// Number system conversions and code helpers.

export function toBinary(n, width = 0) {
  if (n < 0) return "";
  const s = (n >>> 0).toString(2);
  if (width > 0 && s.length < width) return s.padStart(width, "0");
  return s;
}

export function fromBinary(str) {
  if (!/^[01]+$/.test(str)) return NaN;
  return parseInt(str, 2);
}

export function toHex(n, width = 0) {
  if (n < 0) return "";
  const s = n.toString(16).toUpperCase();
  if (width > 0 && s.length < width) return s.padStart(width, "0");
  return s;
}

export function fromHex(str) {
  if (!/^[0-9a-fA-F]+$/.test(str)) return NaN;
  return parseInt(str, 16);
}

// Step-by-step decimal-to-binary using repeated division by 2.
export function decToBinSteps(n) {
  const steps = [];
  if (n === 0) return { steps: [{ dividend: 0, quotient: 0, remainder: 0 }], result: "0" };
  let v = n;
  while (v > 0) {
    const q = Math.floor(v / 2);
    const r = v % 2;
    steps.push({ dividend: v, quotient: q, remainder: r });
    v = q;
  }
  const result = steps
    .map((s) => s.remainder)
    .reverse()
    .join("");
  return { steps, result };
}

// Step-by-step binary-to-decimal: sum of bit * 2^position.
export function binToDecSteps(binStr) {
  const bits = binStr.split("").map(Number);
  const n = bits.length;
  const terms = bits.map((b, i) => ({
    bit: b,
    position: n - 1 - i,
    weight: Math.pow(2, n - 1 - i),
    contribution: b * Math.pow(2, n - 1 - i),
  }));
  const result = terms.reduce((a, t) => a + t.contribution, 0);
  return { terms, result };
}

// Step-by-step decimal-to-hex.
export function decToHexSteps(n) {
  const steps = [];
  if (n === 0) return { steps: [{ dividend: 0, quotient: 0, remainder: 0, digit: "0" }], result: "0" };
  let v = n;
  while (v > 0) {
    const q = Math.floor(v / 16);
    const r = v % 16;
    steps.push({
      dividend: v,
      quotient: q,
      remainder: r,
      digit: r.toString(16).toUpperCase(),
    });
    v = q;
  }
  const result = steps
    .map((s) => s.digit)
    .reverse()
    .join("");
  return { steps, result };
}

// Group binary bits into 4-bit nibbles (padded from the left) for hex conversion.
export function groupBitsToNibbles(binStr) {
  const padded = binStr.padStart(Math.ceil(binStr.length / 4) * 4, "0");
  const groups = [];
  for (let i = 0; i < padded.length; i += 4) groups.push(padded.slice(i, i + 4));
  return groups.map((g) => ({ bits: g, value: parseInt(g, 2), hex: parseInt(g, 2).toString(16).toUpperCase() }));
}

// BCD encoding: each decimal digit becomes a 4-bit group.
export function decToBcd(n) {
  const digits = String(n).split("");
  return digits.map((d) => ({ digit: d, bits: parseInt(d, 10).toString(2).padStart(4, "0") }));
}

export function isValidBcdNibble(bits) {
  if (!/^[01]{4}$/.test(bits)) return false;
  return parseInt(bits, 2) <= 9;
}

// Gray code: G = B XOR (B >> 1).
export function binToGray(binStr) {
  if (!/^[01]+$/.test(binStr)) return "";
  const n = binStr.length;
  let out = binStr[0];
  for (let i = 1; i < n; i++) {
    out += (parseInt(binStr[i - 1], 2) ^ parseInt(binStr[i], 2)).toString();
  }
  return out;
}

// Reverse: B[0]=G[0]; B[i] = G[i] XOR B[i-1].
export function grayToBin(grayStr) {
  if (!/^[01]+$/.test(grayStr)) return "";
  let prev = parseInt(grayStr[0], 2);
  let out = String(prev);
  for (let i = 1; i < grayStr.length; i++) {
    prev = prev ^ parseInt(grayStr[i], 2);
    out += String(prev);
  }
  return out;
}

export function decToGray(n, width = 4) {
  return binToGray(toBinary(n, width));
}

// Random integer in [min, max] inclusive.
export function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Shuffle (Fisher-Yates) in place; returns the array.
export function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ASCII helpers.
export function asciiCodeOf(ch) {
  return ch.charCodeAt(0);
}

export function asciiName(code) {
  const names = {
    0: "NUL",
    7: "BEL",
    8: "BS",
    9: "TAB",
    10: "LF",
    13: "CR",
    27: "ESC",
    32: "SPACE",
    127: "DEL",
  };
  return names[code] || null;
}
