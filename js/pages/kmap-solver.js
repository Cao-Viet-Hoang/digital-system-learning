// K-map Solver: interactive tool that finds all minimum SOP/POS covers.
import { el, clear } from "../utils/dom.js";
import { COLORS } from "../utils/colors.js";
import { solveKMap, formatExpression, formatImplicant, literalCount, piCells } from "../utils/quine-mccluskey.js";

const GROUP_COLORS = [
  { fill: "rgba(240, 162, 116, 0.40)", stroke: COLORS.peachDeep },
  { fill: "rgba(107, 168, 224, 0.40)", stroke: COLORS.skyDeep },
  { fill: "rgba(126, 200, 166, 0.40)", stroke: COLORS.mintDeep },
  { fill: "rgba(155, 140, 217, 0.40)", stroke: COLORS.lavenderDeep },
  { fill: "rgba(230, 201, 90, 0.45)", stroke: COLORS.butterDeep },
  { fill: "rgba(224, 128, 151, 0.40)", stroke: COLORS.roseDeep },
];

const BC_GRAY = [
  { b: 0, c: 0 },
  { b: 0, c: 1 },
  { b: 1, c: 1 },
  { b: 1, c: 0 },
];
const AB_GRAY = [
  { a: 0, b: 0 },
  { a: 0, b: 1 },
  { a: 1, b: 1 },
  { a: 1, b: 0 },
];
const BC_LABEL = ["00", "01", "11", "10"];

// State that survives re-renders.
const state = {
  vars: 3,          // 2 | 2 | 4
  mode: "SOP",      // "SOP" | "POS"
  cells: [],        // length 2^vars, each 0 | 1 | "X"
  selectedCover: 0, // index into result.covers
  swap: false,      // false → rows = high bits (e.g. A or AB); true → rows = low bits (e.g. BC or CD)
};

function resetCells() {
  state.cells = new Array(1 << state.vars).fill(0);
  state.selectedCover = 0;
}

resetCells();

export function renderKmapSolver(container) {
  clear(container);
  const inner = el("div", { class: "content-inner" });
  container.appendChild(inner);

  inner.appendChild(el("h1", { text: "Tối ưu bìa Karnaugh" }));
  inner.appendChild(
    el("p", { class: "text-2", html: "Bấm vào các ô để đổi <span class='mono'>0</span> → <span class='mono'>1</span> → <span class='mono'>X</span> → <span class='mono'>0</span>. Tool sẽ tìm tất cả biểu thức rút gọn tối ưu theo SOP hoặc POS. Khi có nhiều phương án cùng tối ưu, bạn có thể chọn để xem cách khoanh nhóm tương ứng." }),
  );

  const layout = el("div", { class: "stack stack-lg" });
  inner.appendChild(layout);

  // Containers — re-rendered on each state change so selected state stays in sync.
  const controlsHost = el("div");
  const body = el("div", { class: "stack stack-lg" });
  layout.appendChild(controlsHost);
  layout.appendChild(body);

  function rerender() {
    // Controls.
    clear(controlsHost);
    controlsHost.appendChild(buildControls());

    // Body: K-map + expressions.
    clear(body);
    const result = solveKMap(state.cells, state.vars, state.mode);
    if (state.selectedCover >= result.covers.length) state.selectedCover = 0;
    body.appendChild(buildKmapCard(result, rerender));
    body.appendChild(buildExpressionPanel(result, rerender));
  }

  function buildControls() {
    const card = el("div", { class: "card", style: { display: "flex", flexWrap: "wrap", gap: "16px", alignItems: "center" } });

    // Vars selector.
    card.appendChild(el("div", { style: { display: "flex", gap: "8px", alignItems: "center" } }, [
      el("span", { class: "small text-2", text: "Số biến:" }),
      ...[2, 3, 4].map((n) =>
        el("button", {
          class: "btn btn-sm" + (state.vars === n ? " btn-primary" : " btn-outline"),
          text: String(n),
          onclick: () => {
            if (state.vars !== n) {
              state.vars = n;
              resetCells();
              rerender();
            }
          },
        }),
      ),
    ]));

    // Mode toggle.
    card.appendChild(el("div", { style: { display: "flex", gap: "8px", alignItems: "center" } }, [
      el("span", { class: "small text-2", text: "Phương pháp:" }),
      ...["SOP", "POS"].map((m) =>
        el("button", {
          class: "btn btn-sm" + (state.mode === m ? " btn-primary" : " btn-outline"),
          text: m,
          onclick: () => {
            if (state.mode !== m) {
              state.mode = m;
              state.selectedCover = 0;
              rerender();
            }
          },
        }),
      ),
    ]));

    // Swap rows ↔ cols (e.g. AB \ CD ↔ CD \ AB).
    const ls = layoutSpec(state.vars, state.swap);
    card.appendChild(el("div", { style: { display: "flex", gap: "8px", alignItems: "center" } }, [
      el("span", { class: "small text-2", text: "Trục:" }),
      el("button", {
        class: "btn btn-sm" + (state.swap ? " btn-primary" : " btn-outline"),
        html: `Hoán đổi <span class="mono" style="opacity:.85">(${ls.rowVar}↔${ls.colVar})</span>`,
        title: "Đổi vai trò hàng/cột của bìa K. Bảng chân trị không đổi, chỉ đổi cách hiển thị.",
        onclick: () => { state.swap = !state.swap; rerender(); },
      }),
    ]));

    // Reset / fill helpers.
    card.appendChild(el("div", { class: "spacer" }));
    card.appendChild(el("button", {
      class: "btn btn-sm btn-outline",
      text: "Đặt tất cả về 0",
      onclick: () => { state.cells.fill(0); state.selectedCover = 0; rerender(); },
    }));
    card.appendChild(el("button", {
      class: "btn btn-sm btn-outline",
      text: "Đặt tất cả về 1",
      onclick: () => { state.cells.fill(1); state.selectedCover = 0; rerender(); },
    }));
    card.appendChild(el("button", {
      class: "btn btn-sm btn-outline",
      text: "Ngẫu nhiên",
      onclick: () => {
        for (let i = 0; i < state.cells.length; i++) {
          const r = Math.random();
          state.cells[i] = r < 0.45 ? 1 : r < 0.85 ? 0 : "X";
        }
        state.selectedCover = 0;
        rerender();
      },
    }));

    return card;
  }

  rerender();
}

// ===========================================================================
// K-map card with cell click + group overlays
// ===========================================================================

function buildKmapCard(result, rerender) {
  const card = el("div", { class: "card" });
  card.appendChild(el("div", { class: "small text-2", style: { textAlign: "center", marginBottom: "8px" }, html: cellLegend() }));

  const scroll = el("div", { class: "kmap-scroll" });
  const stage = el("div", { class: "kmap-stage", style: { position: "relative", display: "inline-block" } });

  const { rows, cols, rowLabel, colLabel, rowVar, colVar, posFn, idxFn } = layoutSpec(state.vars, state.swap);

  const CELL_W = 56, CELL_H = 56;
  const HEAD_W = 64, HEAD_H = 40;

  const table = el("table", {
    class: "kmap",
    style: { borderCollapse: "collapse", tableLayout: "fixed" },
  });
  const cg = document.createElement("colgroup");
  const headCol = document.createElement("col");
  headCol.style.width = `${HEAD_W}px`;
  cg.appendChild(headCol);
  for (let c = 0; c < cols; c++) {
    const cc = document.createElement("col");
    cc.style.width = `${CELL_W}px`;
    cg.appendChild(cc);
  }
  table.appendChild(cg);

  const headerRow = el("tr");
  headerRow.appendChild(cornerHeader(rowVar, colVar));
  for (let c = 0; c < cols; c++) {
    headerRow.appendChild(el("th", {
      text: colLabel(c),
      style: { ...hStyle(), height: `${HEAD_H}px` },
    }));
  }
  table.appendChild(headerRow);

  for (let r = 0; r < rows; r++) {
    const tr = el("tr");
    tr.appendChild(el("th", { text: rowLabel(r), style: { ...hStyle(), height: `${CELL_H}px` } }));
    for (let c = 0; c < cols; c++) {
      const idx = idxFn(r, c);
      const v = state.cells[idx];
      const val = v === "X" ? "X" : String(v);
      const bg = v === "X" ? COLORS.logicXBg : v === 1 ? COLORS.logic1Bg : COLORS.logic0Bg;
      const td = el("td", {
        style: {
          height: `${CELL_H}px`,
          border: `1.5px solid ${COLORS.borderStrong}`,
          textAlign: "center",
          verticalAlign: "middle",
          position: "relative",
          background: bg,
          fontFamily: "var(--font-mono)",
          fontWeight: "700",
          fontSize: "20px",
          color: COLORS.text,
          cursor: "pointer",
          userSelect: "none",
        },
        text: val,
        onclick: () => {
          state.cells[idx] = nextCellValue(state.cells[idx]);
          state.selectedCover = 0;
          rerender();
        },
      }, [
        el("span", {
          style: {
            position: "absolute",
            top: "2px",
            left: "4px",
            fontSize: "10px",
            fontWeight: "400",
            color: COLORS.text3,
            pointerEvents: "none",
          },
          text: String(idx),
        }),
      ]);
      td.dataset.mt = String(idx);
      tr.appendChild(td);
    }
    table.appendChild(tr);
  }
  stage.appendChild(table);

  // Draw group overlays for the currently-selected cover.
  const overlayPlans = [];
  if (result.covers.length > 0 && !result.constant) {
    const cover = result.covers[state.selectedCover];
    cover.forEach((piIdx, gi) => {
      const pi = result.primes[piIdx];
      const cells = piCells(pi, state.vars);
      const segments = groupSegments(cells, posFn, cols, rows);
      const color = GROUP_COLORS[gi % GROUP_COLORS.length];
      segments.forEach((seg) => {
        const overlay = el("div", {
          style: {
            position: "absolute",
            background: color.fill,
            border: `2.5px solid ${color.stroke}`,
            borderRadius: "10px",
            pointerEvents: "none",
            boxSizing: "border-box",
            // Placeholder; snapped after layout.
            left: "0px", top: "0px", width: "0px", height: "0px",
          },
        });
        stage.appendChild(overlay);
        overlayPlans.push({ overlay, seg });
      });
    });
  }

  scroll.appendChild(stage);
  card.appendChild(scroll);

  function snapOverlays() {
    if (!table.isConnected || table.offsetWidth === 0) {
      requestAnimationFrame(snapOverlays);
      return;
    }
    const stageRect = stage.getBoundingClientRect();
    overlayPlans.forEach(({ overlay, seg }) => {
      const firstIdx = idxFn(seg.rowStart, seg.colStart);
      const lastIdx = idxFn(seg.rowEnd, seg.colEnd);
      const firstCell = table.querySelector(`td[data-mt="${firstIdx}"]`);
      const lastCell = table.querySelector(`td[data-mt="${lastIdx}"]`);
      if (!firstCell || !lastCell) return;
      const r1 = firstCell.getBoundingClientRect();
      const r2 = lastCell.getBoundingClientRect();
      const inset = 3;
      overlay.style.left = `${r1.left - stageRect.left + inset}px`;
      overlay.style.top = `${r1.top - stageRect.top + inset}px`;
      overlay.style.width = `${r2.right - r1.left - 2 * inset}px`;
      overlay.style.height = `${r2.bottom - r1.top - 2 * inset}px`;
    });
  }
  if (overlayPlans.length) requestAnimationFrame(snapOverlays);

  return card;
}

function cellLegend() {
  return `
    <span class="mono" style="background:${COLORS.logic0Bg};padding:1px 8px;border-radius:4px;">0</span>
    →
    <span class="mono" style="background:${COLORS.logic1Bg};padding:1px 8px;border-radius:4px;">1</span>
    →
    <span class="mono" style="background:${COLORS.logicXBg};padding:1px 8px;border-radius:4px;">X</span>
    (don't-care) → 0 … bấm vào ô để chuyển trạng thái
  `;
}

function nextCellValue(v) {
  if (v === 0) return 1;
  if (v === 1) return "X";
  return 0;
}

// ===========================================================================
// Expression panel
// ===========================================================================

function buildExpressionPanel(result, rerender) {
  const card = el("div", { class: "card" });
  card.appendChild(el("h3", { text: "Biểu thức rút gọn", style: { marginTop: 0, marginBottom: "10px" } }));

  // Handle constants and edge cases.
  if (result.constant != null) {
    card.appendChild(el("div", { class: "mono", style: { fontSize: "18px", padding: "10px" }, html: `Y = ${result.constant}` }));
    card.appendChild(el("p", { class: "small text-2", style: { marginTop: "6px" }, text: result.constant === "1" ? "Hàm luôn bằng 1 với mọi tổ hợp ngõ vào." : "Hàm luôn bằng 0 với mọi tổ hợp ngõ vào." }));
    return card;
  }

  if (result.covers.length === 0) {
    card.appendChild(el("p", { class: "text-2", text: "Không tìm thấy biểu thức." }));
    return card;
  }

  const isPos = result.pos;

  // Stats line.
  const stats = el("div", { class: "small text-3", style: { marginBottom: "10px" } }, [
    el("span", { html: `<strong>${result.requiredCount}</strong> ô = ${isPos ? "0" : "1"}` }),
    el("span", { html: ` &middot; <strong>${result.dontCareCount}</strong> ô X` }),
    el("span", { html: ` &middot; <strong>${result.primes.length}</strong> prime implicant` }),
    el("span", { html: ` &middot; <strong>${result.covers.length}</strong> phương án tối ưu` }),
  ]);
  card.appendChild(stats);

  // Render each cover as a selectable option.
  const list = el("div", { class: "stack" });
  result.covers.forEach((cover, i) => {
    const isSelected = i === state.selectedCover;
    const exprHTML = formatExpression(cover, result.primes, state.vars, isPos);
    const lits = literalCount(cover, result.primes);
    const opt = el("button", {
      class: "kmap-cover-option" + (isSelected ? " selected" : ""),
      onclick: () => { state.selectedCover = i; rerender(); },
    }, [
      el("div", { class: "kmap-cover-header" }, [
        el("span", { class: "kmap-cover-label", text: `Phương án ${i + 1}` }),
        el("span", { class: "kmap-cover-meta small text-3", html: `${cover.length} nhóm · ${lits} literal` }),
      ]),
      el("div", { class: "kmap-cover-expr mono", html: `Y = ${exprHTML}` }),
      el("div", { class: "kmap-cover-terms", style: { marginTop: "6px" } }, cover.map((piIdx, gi) => {
        const color = GROUP_COLORS[gi % GROUP_COLORS.length];
        return el("span", {
          class: "kmap-term-chip mono",
          style: {
            background: color.fill,
            border: `1.5px solid ${color.stroke}`,
          },
          html: isPos
            ? `(${formatImplicant(result.primes[piIdx], state.vars, true)})`
            : formatImplicant(result.primes[piIdx], state.vars, false),
        });
      })),
    ]);
    list.appendChild(opt);
  });
  card.appendChild(list);

  if (result.covers.length === 1) {
    card.appendChild(el("p", { class: "small text-3", style: { marginTop: "10px" }, text: "Đây là biểu thức rút gọn duy nhất với cost tối ưu." }));
  } else {
    card.appendChild(el("p", { class: "small text-3", style: { marginTop: "10px" }, html: `Cả ${result.covers.length} phương án đều có cùng số nhóm và cùng số literal — bạn có thể chọn phương án nào cũng đúng.` }));
  }

  return card;
}

// ===========================================================================
// K-map layout for 2/3/4 variables
// ===========================================================================

// Returns a layout description for rendering and indexing the K-map.
// `swap`: when true, swap which group of variables runs along the rows vs. columns.
//   2-var:  default rows=A, cols=B    ↔ swapped rows=B, cols=A
//   3-var:  default rows=A, cols=BC   ↔ swapped rows=BC, cols=A
//   4-var:  default rows=AB, cols=CD  ↔ swapped rows=CD, cols=AB
// The minterm index itself never changes (A is always MSB) — only the display.
function layoutSpec(vars, swap = false) {
  if (vars === 2) {
    if (!swap) {
      return {
        rows: 2, cols: 2,
        rowLabel: (r) => String(r),
        colLabel: (c) => String(c),
        rowVar: "A", colVar: "B",
        posFn: (idx) => ({ row: (idx >> 1) & 1, col: idx & 1 }),
        idxFn: (r, c) => r * 2 + c,
      };
    }
    return {
      rows: 2, cols: 2,
      rowLabel: (r) => String(r),
      colLabel: (c) => String(c),
      rowVar: "B", colVar: "A",
      posFn: (idx) => ({ row: idx & 1, col: (idx >> 1) & 1 }),
      idxFn: (r, c) => c * 2 + r,
    };
  }
  if (vars === 3) {
    if (!swap) {
      return {
        rows: 2, cols: 4,
        rowLabel: (r) => String(r),
        colLabel: (c) => BC_LABEL[c],
        rowVar: "A", colVar: "BC",
        posFn: (idx) => {
          const a = (idx >> 2) & 1;
          const b = (idx >> 1) & 1;
          const c = idx & 1;
          return { row: a, col: BC_GRAY.findIndex((g) => g.b === b && g.c === c) };
        },
        idxFn: (r, c) => {
          const { b, c: cc } = BC_GRAY[c];
          return r * 4 + b * 2 + cc;
        },
      };
    }
    // Swap: rows are BC (4 values), cols are A (2 values).
    return {
      rows: 4, cols: 2,
      rowLabel: (r) => BC_LABEL[r],
      colLabel: (c) => String(c),
      rowVar: "BC", colVar: "A",
      posFn: (idx) => {
        const a = (idx >> 2) & 1;
        const b = (idx >> 1) & 1;
        const c = idx & 1;
        return { row: BC_GRAY.findIndex((g) => g.b === b && g.c === c), col: a };
      },
      idxFn: (r, c) => {
        const { b, c: cc } = BC_GRAY[r];
        return c * 4 + b * 2 + cc;
      },
    };
  }
  // vars === 4
  if (!swap) {
    return {
      rows: 4, cols: 4,
      rowLabel: (r) => BC_LABEL[r],
      colLabel: (c) => BC_LABEL[c],
      rowVar: "AB", colVar: "CD",
      posFn: (idx) => {
        const a = (idx >> 3) & 1;
        const b = (idx >> 2) & 1;
        const c = (idx >> 1) & 1;
        const d = idx & 1;
        return {
          row: AB_GRAY.findIndex((g) => g.a === a && g.b === b),
          col: BC_GRAY.findIndex((g) => g.b === c && g.c === d),
        };
      },
      idxFn: (r, c) => {
        const { a, b } = AB_GRAY[r];
        const { b: cc, c: d } = BC_GRAY[c];
        return a * 8 + b * 4 + cc * 2 + d;
      },
    };
  }
  // Swap: rows are CD, cols are AB.
  return {
    rows: 4, cols: 4,
    rowLabel: (r) => BC_LABEL[r],
    colLabel: (c) => BC_LABEL[c],
    rowVar: "CD", colVar: "AB",
    posFn: (idx) => {
      const a = (idx >> 3) & 1;
      const b = (idx >> 2) & 1;
      const c = (idx >> 1) & 1;
      const d = idx & 1;
      return {
        row: BC_GRAY.findIndex((g) => g.b === c && g.c === d),
        col: AB_GRAY.findIndex((g) => g.a === a && g.b === b),
      };
    },
    idxFn: (r, c) => {
      const { b: cc, c: d } = BC_GRAY[r];
      const { a, b } = AB_GRAY[c];
      return a * 8 + b * 4 + cc * 2 + d;
    },
  };
}

// Top-left corner cell — SVG diagonal slash splits the cell; row variable
// sits in the bottom-left triangle, column variable in the top-right.
function cornerHeader(rowVar, colVar) {
  const W = 64, H = 40;
  return el("th", {
    class: "kmap-corner",
    style: {
      border: `1.5px solid ${COLORS.borderStrong}`,
      width: `${W}px`,
      height: `${H}px`,
    },
    html: `
      <svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none"
           style="display:block; width:100%; height:100%;">
        <line x1="0" y1="0" x2="${W}" y2="${H}"
              stroke="${COLORS.borderStrong}" stroke-width="1.2"
              vector-effect="non-scaling-stroke" />
        <text x="${W - 5}" y="13" text-anchor="end"
              font-family="JetBrains Mono, ui-monospace, monospace"
              font-size="13" font-weight="700" fill="${COLORS.skyDeep}">${colVar}</text>
        <text x="5" y="${H - 5}" text-anchor="start"
              font-family="JetBrains Mono, ui-monospace, monospace"
              font-size="13" font-weight="700" fill="${COLORS.peachDeep}">${rowVar}</text>
      </svg>
    `,
  });
}

// Split a list of cells into one or more contiguous rectangle segments,
// handling wrap-around in both rows and cols.
function groupSegments(cells, posFn, cols, rows) {
  const rowToCols = new Map();
  cells.forEach((idx) => {
    const { row, col } = posFn(idx);
    if (!rowToCols.has(row)) rowToCols.set(row, new Set());
    rowToCols.get(row).add(col);
  });

  const rowRanges = new Map(); // row → array of {start, end}
  rowToCols.forEach((set, row) => {
    const arr = [...set].sort((a, b) => a - b);
    const ranges = [];
    const wraps = set.has(0) && set.has(cols - 1) && arr.length < cols;
    if (wraps) {
      let r = cols - 1;
      while (set.has(r) && r >= 0) r--;
      ranges.push({ start: r + 1, end: cols - 1 });
      let l = 0;
      while (set.has(l) && l < cols) l++;
      ranges.push({ start: 0, end: l - 1 });
    } else {
      let runStart = arr[0], prev = arr[0];
      for (let i = 1; i < arr.length; i++) {
        if (arr[i] === prev + 1) prev = arr[i];
        else {
          ranges.push({ start: runStart, end: prev });
          runStart = arr[i];
          prev = arr[i];
        }
      }
      ranges.push({ start: runStart, end: prev });
    }
    rowRanges.set(row, ranges);
  });

  // Convert to per-row segments, then merge contiguous rows sharing the same col range.
  const individual = [];
  [...rowRanges.keys()].sort((a, b) => a - b).forEach((row) => {
    rowRanges.get(row).forEach((rng) => {
      individual.push({ rowStart: row, rowEnd: row, colStart: rng.start, colEnd: rng.end });
    });
  });

  // Merge vertically.
  const buckets = new Map();
  individual.forEach((s) => {
    const k = `${s.colStart}_${s.colEnd}`;
    if (!buckets.has(k)) buckets.set(k, []);
    buckets.get(k).push(s);
  });
  const segments = [];
  buckets.forEach((segs) => {
    segs.sort((a, b) => a.rowStart - b.rowStart);
    // Detect row wrap for 4-var (rows 0 and rows-1 both present without full contiguous).
    const rowsPresent = segs.map((s) => s.rowStart);
    const rowsSet = new Set(rowsPresent);
    const wrapsRows = rowsSet.has(0) && rowsSet.has(rows - 1) && rowsPresent.length < rows;

    if (wrapsRows && rows === 4) {
      // Top run: starting from row 0 upward.
      let topEnd = 0;
      while (rowsSet.has(topEnd + 1)) topEnd++;
      // Bottom run: starting from row rows-1 downward.
      let botStart = rows - 1;
      while (rowsSet.has(botStart - 1)) botStart--;
      // Emit two segments if disjoint.
      if (topEnd + 1 < botStart) {
        segments.push({ rowStart: 0, rowEnd: topEnd, colStart: segs[0].colStart, colEnd: segs[0].colEnd });
        segments.push({ rowStart: botStart, rowEnd: rows - 1, colStart: segs[0].colStart, colEnd: segs[0].colEnd });
      } else {
        // Adjacent already; merge normally below.
        let cur = { ...segs[0] };
        for (let i = 1; i < segs.length; i++) {
          if (segs[i].rowStart === cur.rowEnd + 1) cur.rowEnd = segs[i].rowEnd;
          else {
            segments.push(cur);
            cur = { ...segs[i] };
          }
        }
        segments.push(cur);
      }
    } else {
      let cur = { ...segs[0] };
      for (let i = 1; i < segs.length; i++) {
        if (segs[i].rowStart === cur.rowEnd + 1) cur.rowEnd = segs[i].rowEnd;
        else {
          segments.push(cur);
          cur = { ...segs[i] };
        }
      }
      segments.push(cur);
    }
  });
  return segments;
}

function hStyle() {
  return {
    background: COLORS.surface2,
    color: COLORS.text2,
    fontFamily: "var(--font-mono)",
    fontWeight: "600",
    fontSize: "13px",
    padding: "6px 10px",
    border: `1.5px solid ${COLORS.borderStrong}`,
    textAlign: "center",
  };
}
