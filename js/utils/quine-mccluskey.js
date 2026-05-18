// Quine–McCluskey algorithm with Petrick-style enumeration of all minimum covers.
//
// Representation of an implicant:
//   { mask: int, value: int, covers: Set<int> }
//   - `mask` has bit = 1 for "fixed" variable, 0 for "don't care" in this implicant.
//   - `value` holds the fixed bit values (only bits where mask=1 are meaningful).
//   - `covers` is the set of cell indices (0..2^n-1) covered by this implicant.
//
// Variables are numbered MSB-first: for n=4, bit 3 = A, bit 2 = B, bit 1 = C, bit 0 = D.

export function popcount(n) {
  let c = 0;
  while (n) {
    c += n & 1;
    n >>>= 1;
  }
  return c;
}

// Given a list of minterm indices to cover (1-cells + don't-cares for SOP, or 0-cells + don't-cares
// for POS-via-complement), return the list of all prime implicants.
export function findPrimeImplicants(minterms, numVars) {
  if (minterms.length === 0) return [];

  const allMask = (1 << numVars) - 1;

  // Seed: each minterm starts as a size-1 implicant.
  // Deduplicate by minterm value.
  const seen = new Set();
  let current = [];
  for (const m of minterms) {
    if (seen.has(m)) continue;
    seen.add(m);
    current.push({ value: m, mask: allMask, covers: new Set([m]), combined: false });
  }

  const primes = [];

  while (current.length > 0) {
    const next = new Map(); // key: `${mask}|${value}` → implicant

    for (let i = 0; i < current.length; i++) {
      for (let j = i + 1; j < current.length; j++) {
        const a = current[i];
        const b = current[j];
        if (a.mask !== b.mask) continue;
        const diff = (a.value ^ b.value) & a.mask;
        if (popcount(diff) !== 1) continue;

        const newMask = a.mask & ~diff;
        const newValue = a.value & newMask;
        const key = `${newMask}|${newValue}`;
        if (!next.has(key)) {
          next.set(key, {
            value: newValue,
            mask: newMask,
            covers: new Set([...a.covers, ...b.covers]),
            combined: false,
          });
        }
        a.combined = true;
        b.combined = true;
      }
    }

    // Uncombined implicants become primes.
    for (const imp of current) {
      if (!imp.combined) {
        const key = `${imp.mask}|${imp.value}`;
        if (!primes.some((p) => p.mask === imp.mask && p.value === imp.value)) {
          primes.push({ value: imp.value, mask: imp.mask, covers: imp.covers });
        }
      }
    }

    current = [...next.values()];
  }

  return primes;
}

// Enumerate all minimum-cost covers of `required` using prime implicants.
//
// Cost is lexicographic: (number of implicants, total literals).
// Don't-cares are NOT included in `required` (they don't need to be covered).
// `maxResults` caps how many optimal alternatives we return.
//
// Returns array of covers; each cover is a sorted array of PI indices into `primes`.
export function findMinimalCovers(primes, required, maxResults = 4) {
  if (required.length === 0) return [[]];

  // Which PIs cover each required minterm.
  const coverageMap = new Map();
  for (const m of required) coverageMap.set(m, []);
  primes.forEach((pi, idx) => {
    for (const m of pi.covers) {
      if (coverageMap.has(m)) coverageMap.get(m).push(idx);
    }
  });

  // Essential PIs = PIs that uniquely cover some required minterm.
  const essential = new Set();
  for (const [, pis] of coverageMap) {
    if (pis.length === 1) essential.add(pis[0]);
  }

  // Remaining minterms after extracting essentials.
  const essentialCovers = new Set();
  for (const idx of essential) {
    for (const m of primes[idx].covers) essentialCovers.add(m);
  }
  const remaining = required.filter((m) => !essentialCovers.has(m));

  if (remaining.length === 0) {
    return [sortedFromSet(essential)];
  }

  // Candidate non-essential PIs that cover at least one remaining minterm.
  const candidates = [];
  primes.forEach((pi, idx) => {
    if (essential.has(idx)) return;
    if (remaining.some((m) => pi.covers.has(m))) candidates.push(idx);
  });

  // Branch and bound: at each step pick the first uncovered minterm, then try
  // every candidate that covers it. Use a `seen` signature set to avoid
  // re-exploring the same chosen-set in a different order.
  //
  // Order candidates by literal count ASCENDING (= popcount of mask). Fewer
  // literals means a "wider" implicant covering more cells — trying wider
  // ones first finds small covers quickly, which prunes the rest aggressively.
  candidates.sort((a, b) => popcount(primes[a].mask) - popcount(primes[b].mask));

  let bestSize = Infinity;
  let bestLiterals = Infinity;
  let results = [];
  const seen = new Set();

  function attemptRecord(chosen) {
    const sig = chosen.slice().sort((a, b) => a - b).join(",");
    if (seen.has(sig)) return;
    seen.add(sig);

    const literals = chosen.reduce((s, id) => s + popcount(primes[id].mask), 0);
    if (chosen.length < bestSize || (chosen.length === bestSize && literals < bestLiterals)) {
      bestSize = chosen.length;
      bestLiterals = literals;
      results = [chosen.slice()];
    } else if (chosen.length === bestSize && literals === bestLiterals) {
      if (results.length < maxResults) results.push(chosen.slice());
    }
  }

  const chosenSet = new Set();

  function backtrack(chosen, covered) {
    // Pruning: cannot improve bestSize from here.
    if (chosen.length >= bestSize) {
      // chosen.length === bestSize is OK iff we're already covered (handled below);
      // otherwise extending makes it strictly larger → bail.
      if (chosen.length > bestSize) return;
    }

    // Find an uncovered required minterm.
    let target = -1;
    for (const m of remaining) {
      if (!covered.has(m)) { target = m; break; }
    }
    if (target < 0) {
      attemptRecord(chosen);
      return;
    }
    // Already at bestSize but still uncovered → can't tie.
    if (chosen.length >= bestSize) return;

    // Try each candidate that covers `target`.
    for (const id of candidates) {
      if (chosenSet.has(id)) continue;
      if (!primes[id].covers.has(target)) continue;
      const next = new Set(covered);
      for (const m of primes[id].covers) next.add(m);
      chosen.push(id);
      chosenSet.add(id);
      backtrack(chosen, next);
      chosen.pop();
      chosenSet.delete(id);
    }
  }

  backtrack([], new Set());

  // Merge essentials with each found cover.
  return results.map((r) => {
    const set = new Set(essential);
    for (const id of r) set.add(id);
    return sortedFromSet(set);
  });
}

function sortedFromSet(s) {
  return [...s].sort((a, b) => a - b);
}

// Render a single prime implicant as an HTML term (SOP product or POS sum).
// Variables are A, B, C, D... MSB-first.
export function formatImplicant(pi, numVars, pos = false) {
  const letters = ["A", "B", "C", "D", "E", "F"].slice(0, numVars);
  const parts = [];
  for (let i = 0; i < numVars; i++) {
    const bitPos = numVars - 1 - i; // i=0 → MSB
    const bit = 1 << bitPos;
    if (pi.mask & bit) {
      const v = (pi.value & bit) ? 1 : 0;
      // SOP: variable = 1 → keep, variable = 0 → negate.
      // POS: variable = 0 → keep, variable = 1 → negate.
      const negate = pos ? (v === 1) : (v === 0);
      parts.push(
        negate
          ? `<span style="text-decoration:overline">${letters[i]}</span>`
          : letters[i],
      );
    }
  }
  if (parts.length === 0) {
    return pos ? "0" : "1";
  }
  return pos ? parts.join(" + ") : parts.join("·");
}

// Render a full expression (list of PIs) as HTML.
// SOP: sum of products → "term1 + term2 + ..."
// POS: product of sums → "(sum1)·(sum2)·..."
export function formatExpression(coverPiIndices, primes, numVars, pos = false) {
  if (coverPiIndices.length === 0) {
    return pos ? "1" : "0"; // SOP empty = constant 0; POS empty = constant 1.
  }
  const terms = coverPiIndices.map((idx) => formatImplicant(primes[idx], numVars, pos));
  if (!pos) {
    return terms.join(" + ");
  }
  return terms.map((t) => `(${t})`).join("·");
}

// Compute total literal count of a cover (for display).
export function literalCount(coverPiIndices, primes) {
  return coverPiIndices.reduce((s, idx) => s + popcount(primes[idx].mask), 0);
}

// Enumerate the cells covered by a PI.
export function piCells(pi, numVars) {
  const fixed = pi.mask;
  const free = ((1 << numVars) - 1) & ~fixed;
  const cells = [];
  // Iterate all subsets of `free`.
  let sub = 0;
  while (true) {
    cells.push((pi.value & fixed) | sub);
    if (sub === free) break;
    sub = (sub - free) & free;
  }
  return cells;
}

// High-level entry: solve a K-map and return the data needed for rendering.
//   cells: array length 2^numVars, each value is 0 | 1 | "X"
//   mode: "SOP" | "POS"
// Returns: { primes, covers, requiredCount, dontCareCount, pos }
//   covers: array of { piIndices, literals }
export function solveKMap(cells, numVars, mode = "SOP") {
  const isPos = mode === "POS";
  const cellsToCover = [];   // cells the function must satisfy (1 for SOP, 0 for POS)
  const dontCares = [];      // X cells
  const opposite = [];

  cells.forEach((v, idx) => {
    if (v === "X") dontCares.push(idx);
    else if (isPos ? v === 0 : v === 1) cellsToCover.push(idx);
    else opposite.push(idx);
  });

  // Edge cases.
  if (cellsToCover.length === 0) {
    // For SOP: function is constantly 0; for POS: function is constantly 1.
    return {
      primes: [],
      covers: [[]],
      requiredCount: 0,
      dontCareCount: dontCares.length,
      constant: isPos ? "1" : "0",
      pos: isPos,
    };
  }
  if (cellsToCover.length + dontCares.length === cells.length) {
    // Every cell is 1 (SOP) or 0 (POS) → constant 1 / 0.
    return {
      primes: [],
      covers: [[]],
      requiredCount: cellsToCover.length,
      dontCareCount: dontCares.length,
      constant: isPos ? "0" : "1",
      pos: isPos,
    };
  }

  // Build minterms: cells to cover + don't-cares (don't-cares can be coopted to grow implicants).
  const seeds = [...cellsToCover, ...dontCares];
  const primes = findPrimeImplicants(seeds, numVars);

  // Only the cells-to-cover are "required"; don't-cares are not.
  const covers = findMinimalCovers(primes, cellsToCover, 4);

  return {
    primes,
    covers,
    requiredCount: cellsToCover.length,
    dontCareCount: dontCares.length,
    pos: isPos,
  };
}
