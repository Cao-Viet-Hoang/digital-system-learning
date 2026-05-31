// Equivalence Checker: compare two Boolean expressions via a shared truth table.
// Teaching goal — students SEE why two expressions are (or aren't) the same:
// the verdict, the differing rows (counterexample), and the canonical minterms.
import { el, clear } from "../utils/dom.js";
import { checkEquivalence } from "../utils/bool-expr.js";

// State that survives re-renders.
const state = {
  exprA: "!(A*B)",
  exprB: "!A + !B",
  checked: false, // only show results after the user asks (or loads an example)
  tableFilter: "diff", // "all" | "match" | "diff" — which rows the truth table shows
};

// A few classic pairs students meet in Boolean-algebra lessons.
const EXAMPLES = [
  { label: "De Morgan 1", a: "!(A*B)", b: "!A + !B" },
  { label: "De Morgan 2", a: "!(A+B)", b: "!A * !B" },
  { label: "Phân phối", a: "A(B+C)", b: "AB + AC" },
  { label: "Hấp thụ", a: "A + AB", b: "A" },
  { label: "Đồng thuận", a: "AB + A'C + BC", b: "AB + A'C" },
  { label: "XOR khai triển", a: "A^B", b: "A'B + AB'" },
  { label: "Bẫy: sai", a: "A+B*C", b: "(A+B)*C" },
];

export function renderEquivalence(container) {
  clear(container);
  const inner = el("div", { class: "content-inner" });
  container.appendChild(inner);

  inner.appendChild(el("h1", { text: "So sánh hai biểu thức logic" }));
  inner.appendChild(
    el("p", {
      class: "text-2",
      html:
        "Nhập hai biểu thức Boolean và công cụ sẽ kiểm tra chúng có <strong>tương đương</strong> hay không bằng cách lập <strong>bảng chân trị chung</strong> trên tất cả các biến. Nếu mọi hàng đều cho ngõ ra giống nhau → tương đương. Nếu có dù chỉ một hàng khác nhau → <em>không</em> tương đương, và hàng đó chính là <strong>phản ví dụ</strong>.",
    }),
  );

  const layout = el("div", { class: "stack stack-lg" });
  inner.appendChild(layout);

  layout.appendChild(buildSyntaxHelp());

  const inputHost = el("div");
  const resultHost = el("div");
  layout.appendChild(inputHost);
  layout.appendChild(resultHost);

  function rerender() {
    clear(inputHost);
    inputHost.appendChild(buildInputCard(rerender));
    clear(resultHost);
    if (state.checked) resultHost.appendChild(buildResult(rerender));
  }

  rerender();
}

// ---- Syntax help -----------------------------------------------------------

function buildSyntaxHelp() {
  const card = el("div", { class: "card card-soft-sky" });
  card.appendChild(el("h3", { text: "Cú pháp hỗ trợ", style: { marginTop: 0 } }));
  const tbl = el("table", { class: "tbl", style: { width: "auto" } });
  const rows = [
    ["NOT (đảo)", "!A &nbsp; ~A &nbsp; A' ", "Phủ định"],
    ["AND (và)", "A*B &nbsp; A.B &nbsp; A&amp;B &nbsp; AB", "Nhân logic; viết liền AB cũng là AND"],
    ["OR (hoặc)", "A+B &nbsp; A|B", "Cộng logic"],
    ["XOR", "A^B", "Khác nhau thì bằng 1"],
    ["Hằng số", "0 &nbsp; 1", "Luôn sai / luôn đúng"],
    ["Ngoặc", "( )", "Nhóm để định thứ tự ưu tiên"],
  ];
  const tb = el("tbody");
  rows.forEach((r) => {
    tb.appendChild(
      el("tr", {}, [
        el("td", { style: { fontWeight: "600", whiteSpace: "nowrap" }, text: r[0] }),
        el("td", { class: "mono", html: r[1] }),
        el("td", { class: "small text-2", html: r[2] }),
      ]),
    );
  });
  tbl.appendChild(tb);
  card.appendChild(tbl);
  card.appendChild(
    el("p", {
      class: "small text-2",
      style: { marginTop: "8px", marginBottom: 0 },
      html:
        "Biến là một chữ cái <span class='mono'>A</span>…<span class='mono'>Z</span> (không phân biệt hoa thường). Thứ tự ưu tiên: <strong>NOT → AND → XOR → OR</strong>. Khi chưa chắc, hãy thêm dấu ngoặc.",
    }),
  );
  return card;
}

// ---- Input card ------------------------------------------------------------

function buildInputCard(rerender) {
  const card = el("div", { class: "card" });

  const mkField = (labelText, key, color) => {
    const field = el("div", { class: "field" });
    field.appendChild(el("label", { class: "label", html: labelText }));
    const input = el("input", {
      class: "input input-mono",
      type: "text",
      value: state[key],
      placeholder: "Ví dụ: A*B + C",
      autocomplete: "off",
      spellcheck: false,
    });
    input.addEventListener("input", () => {
      state[key] = input.value;
    });
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        state.checked = true;
        rerender();
      }
    });
    field.appendChild(input);
    field.style.borderLeft = `3px solid ${color}`;
    field.style.paddingLeft = "12px";
    return field;
  };

  card.appendChild(mkField("Biểu thức 1 &nbsp;<span class='mono'>F₁</span>", "exprA", "var(--c-peach-deep, #f0a274)"));
  card.appendChild(mkField("Biểu thức 2 &nbsp;<span class='mono'>F₂</span>", "exprB", "var(--c-sky-deep, #6ba8e0)"));

  const actions = el("div", { style: { display: "flex", flexWrap: "wrap", gap: "8px", alignItems: "center", marginTop: "4px" } });
  actions.appendChild(
    el("button", {
      class: "btn btn-primary",
      text: "So sánh",
      onclick: () => {
        state.checked = true;
        rerender();
      },
    }),
  );
  actions.appendChild(
    el("button", {
      class: "btn btn-outline btn-sm",
      text: "Hoán đổi F₁ ↔ F₂",
      onclick: () => {
        const t = state.exprA;
        state.exprA = state.exprB;
        state.exprB = t;
        rerender();
      },
    }),
  );
  card.appendChild(actions);

  // Example presets.
  const exWrap = el("div", { style: { marginTop: "14px" } });
  exWrap.appendChild(el("div", { class: "small text-2", style: { marginBottom: "6px" }, text: "Ví dụ nhanh:" }));
  const chips = el("div", { style: { display: "flex", flexWrap: "wrap", gap: "6px" } });
  EXAMPLES.forEach((ex) => {
    chips.appendChild(
      el("button", {
        class: "btn btn-outline btn-sm",
        text: ex.label,
        title: `${ex.a}   vs   ${ex.b}`,
        onclick: () => {
          state.exprA = ex.a;
          state.exprB = ex.b;
          state.checked = true;
          rerender();
        },
      }),
    );
  });
  exWrap.appendChild(chips);
  card.appendChild(exWrap);

  return card;
}

// ---- Result ----------------------------------------------------------------

function buildResult(rerender) {
  const result = checkEquivalence(state.exprA, state.exprB);
  const wrap = el("div", { class: "stack stack-lg" });

  if (!result.ok) {
    wrap.appendChild(
      el("div", { class: "alert alert-error" }, [
        el("strong", { text: `Lỗi cú pháp ở Biểu thức ${result.which}: ` }),
        document.createTextNode(result.message),
      ]),
    );
    return wrap;
  }

  // Verdict banner.
  wrap.appendChild(buildVerdict(result));

  // Combined truth table.
  wrap.appendChild(buildTruthTableCard(result, rerender));

  // Canonical minterm forms.
  wrap.appendChild(buildCanonicalCard(result));

  return wrap;
}

function buildVerdict(result) {
  if (result.equivalent) {
    return el("div", { class: "alert alert-success" }, [
      el("strong", { text: "✓ Hai biểu thức TƯƠNG ĐƯƠNG. " }),
      document.createTextNode(
        `Mọi tổ hợp trong số ${result.rows.length} hàng đều cho ngõ ra giống nhau, nên F₁ và F₂ là cùng một hàm logic.`,
      ),
    ]);
  }

  const d = result.firstDiff;
  const assign = result.vars.map((v, i) => `${v}=${d.bits[i]}`).join(", ");
  return el("div", { class: "alert alert-error" }, [
    el("strong", { text: "✗ KHÔNG tương đương. " }),
    document.createTextNode("Có ít nhất một hàng cho kết quả khác nhau — đó là phản ví dụ. "),
    el("br"),
    el("span", {
      html: `Phản ví dụ: khi <span class="mono">${assign}</span> thì <span class="mono">F₁ = ${d.out1}</span> nhưng <span class="mono">F₂ = ${d.out2}</span>.`,
    }),
  ]);
}

function buildTruthTableCard(result, rerender) {
  const card = el("div", { class: "card", style: { overflowX: "auto" } });
  card.appendChild(
    el("div", { class: "small text-2", style: { marginBottom: "8px" }, html: "Bảng chân trị chung. Cột <strong>So khớp</strong> = ✓ khi hai ngõ ra bằng nhau; hàng tô đỏ là nơi chúng khác nhau." }),
  );

  // Filter control: which rows to show.
  const matchCount = result.rows.filter((r) => r.match).length;
  const diffCount = result.rows.length - matchCount;
  const filters = [
    { id: "diff", label: `Chỉ khác (${diffCount})` },
    { id: "match", label: `Chỉ khớp (${matchCount})` },
    { id: "all", label: `Tất cả (${result.rows.length})` },
  ];
  const filterBar = el("div", { style: { display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "10px", alignItems: "center" } });
  filterBar.appendChild(el("span", { class: "small text-2", text: "Hiển thị:" }));
  filters.forEach((f) => {
    filterBar.appendChild(
      el("button", {
        class: "btn btn-sm" + (state.tableFilter === f.id ? " btn-primary" : " btn-outline"),
        text: f.label,
        onclick: () => {
          state.tableFilter = f.id;
          rerender();
        },
      }),
    );
  });
  card.appendChild(filterBar);

  const visibleRows = result.rows.filter((row) =>
    state.tableFilter === "all" ? true : state.tableFilter === "match" ? row.match : !row.match,
  );

  if (visibleRows.length === 0) {
    const msg =
      state.tableFilter === "diff"
        ? "Không có hàng nào khác nhau — hai biểu thức khớp ở mọi tổ hợp."
        : "Không có hàng nào khớp — hai biểu thức khác nhau ở mọi tổ hợp.";
    card.appendChild(el("p", { class: "small text-2", style: { margin: 0 }, text: msg }));
    return card;
  }

  const tbl = el("table", { class: "tbl tbl-bordered", style: { minWidth: "360px" } });

  // Header.
  const headCells = result.vars.map((v) => el("th", { text: v }));
  headCells.push(el("th", { style: { color: "var(--c-peach-deep, #f0a274)" }, html: "F₁" }));
  headCells.push(el("th", { style: { color: "var(--c-sky-deep, #6ba8e0)" }, html: "F₂" }));
  headCells.push(el("th", { text: "So khớp" }));
  tbl.appendChild(el("thead", {}, [el("tr", {}, headCells)]));

  const tb = el("tbody");
  visibleRows.forEach((row) => {
    const cells = row.bits.map((b) =>
      el("td", { class: "mono", style: { textAlign: "center", color: "var(--text-2)" }, text: String(b) }),
    );
    const outStyle = (v) => ({
      textAlign: "center",
      fontWeight: "700",
      background: v === 1 ? "var(--logic-1-bg, #ffe2cc)" : "var(--logic-0-bg, #d4e8fa)",
    });
    cells.push(el("td", { class: "mono", style: outStyle(row.out1), text: String(row.out1) }));
    cells.push(el("td", { class: "mono", style: outStyle(row.out2), text: String(row.out2) }));
    cells.push(
      el("td", {
        class: "mono",
        style: { textAlign: "center", fontWeight: "700", color: row.match ? "var(--c-success, #6dbf8b)" : "var(--c-error, #e88a8a)" },
        text: row.match ? "✓" : "✗",
      }),
    );
    const tr = el("tr", {}, cells);
    if (!row.match) tr.style.background = "var(--c-error-bg, #fbdcdc)";
    tb.appendChild(tr);
  });
  tbl.appendChild(tb);
  card.appendChild(tbl);
  return card;
}

function buildCanonicalCard(result) {
  const card = el("div", { class: "card card-soft-mint" });
  card.appendChild(el("h3", { text: "Dạng chuẩn tắc (tập minterm)", style: { marginTop: 0 } }));
  card.appendChild(
    el("p", {
      class: "small text-2",
      html:
        "Mỗi hàm logic ứng với một <strong>tập minterm</strong> — các hàng có ngõ ra = 1. Hai biểu thức tương đương <em>khi và chỉ khi</em> hai tập này giống hệt nhau. Đây là góc nhìn khác của cùng phép so sánh.",
    }),
  );

  const fmt = (arr) => (arr.length ? arr.map((m) => `m${m}`).join(", ") : "∅ (không có)");
  const list = el("div", { class: "stack", style: { gap: "6px" } });
  list.appendChild(
    el("div", { class: "mono", html: `<span style="color:var(--c-peach-deep,#f0a274);font-weight:700">F₁</span> = Σ( ${fmt(result.minterms1)} )` }),
  );
  list.appendChild(
    el("div", { class: "mono", html: `<span style="color:var(--c-sky-deep,#6ba8e0);font-weight:700">F₂</span> = Σ( ${fmt(result.minterms2)} )` }),
  );
  card.appendChild(list);

  if (!result.equivalent) {
    const diffs = [];
    if (result.onlyIn1.length)
      diffs.push(`Chỉ có ở F₁: ${result.onlyIn1.map((m) => "m" + m).join(", ")}`);
    if (result.onlyIn2.length)
      diffs.push(`Chỉ có ở F₂: ${result.onlyIn2.map((m) => "m" + m).join(", ")}`);
    card.appendChild(
      el("p", {
        class: "small",
        style: { marginTop: "10px", marginBottom: 0, fontWeight: "600", color: "var(--c-error, #e88a8a)" },
        text: "Khác nhau ở các minterm → " + diffs.join("; "),
      }),
    );
  }
  return card;
}
