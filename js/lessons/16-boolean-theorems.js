// Lesson 16: Các định lý đại số Boole & định lý DeMorgan.
import { el, clear } from "../utils/dom.js";
import { section, summary, quizSection, p, splitView, resetSectionCounter } from "../utils/lesson-ui.js";
import { COLORS } from "../utils/colors.js";
import { drawGate, drawWire, drawPort, computeGate } from "../utils/gates.js";

export default {
  id: "boolean-theorems",
  order: 16,
  title: "Các định lý logic – Đại số Boole & DeMorgan",
  subtitle: "Quy tắc rút gọn biểu thức để mạch đơn giản, rẻ và nhanh hơn.",
  objective:
    "Nắm các định lý cơ bản của đại số Boole; áp dụng để rút gọn biểu thức; phát biểu và sử dụng định lý DeMorgan để biến đổi giữa các dạng AND/OR và NAND/NOR.",
  render,
};

function render(container) {
  resetSectionCounter();
  clear(container);

  container.appendChild(
    section(
      "Tại sao cần đại số Boole?",
      p(
        "Một bảng chân trị 4 biến có 16 hàng — viết biểu thức trực tiếp từ bảng có thể cho ra hàng chục cổng. Nhưng nhiều biểu thức <em>tương đương</em> có thể được rút gọn thành chỉ 2-3 cổng. Đại số Boole là tập các <strong>định lý</strong> giúp ta biến đổi biểu thức mà <em>không thay đổi giá trị</em> ngõ ra, từ đó giảm chi phí phần cứng và tăng tốc độ mạch.",
      ),
    ),
  );

  // Single-variable theorems
  container.appendChild(
    section(
      "Các định lý một biến",
      p("Các đẳng thức cơ bản giữa một biến A và các hằng 0, 1, hoặc chính nó:"),
      buildTheoremTable([
        ["Identity (Đồng nhất)", "A + 0 = A", "A · 1 = A"],
        ["Null (Hấp thụ hằng)", "A + 1 = 1", "A · 0 = 0"],
        ["Idempotent (Đẳng cấp)", "A + A = A", "A · A = A"],
        ["Complement (Bù)", "A + Ā = 1", "A · Ā = 0"],
        ["Involution (Đối hợp)", "(Ā)̅ = A", "—"],
      ]),
    ),
  );

  // Two-variable laws
  container.appendChild(
    section(
      "Các định lý nhiều biến",
      p("Các luật cơ bản giống đại số thông thường, áp dụng cho hai hoặc ba biến:"),
      buildTheoremTable([
        ["Giao hoán (Commutative)", "A + B = B + A", "A · B = B · A"],
        ["Kết hợp (Associative)", "(A + B) + C = A + (B + C)", "(A · B) · C = A · (B · C)"],
        ["Phân phối (Distributive)", "A · (B + C) = A·B + A·C", "A + (B · C) = (A + B)·(A + C)"],
        ["Hấp thụ (Absorption)", "A + A·B = A", "A · (A + B) = A"],
      ]),
      el("div", { class: "alert alert-info", style: { marginTop: "10px" } }, [
        el("strong", { text: "Lưu ý: " }),
        el("span", { html: "Phân phối thứ hai (<span class='mono'>A + BC = (A+B)(A+C)</span>) <em>không có</em> trong đại số thông thường — đây là điểm đặc biệt của Boole." }),
      ]),
    ),
  );

  // Simplification example
  container.appendChild(
    section(
      "Ứng dụng – Rút gọn biểu thức",
      p("Ví dụ: rút gọn <span class='mono'>Y = A·B + A·B̄ + Ā·B</span>"),
      el("div", { class: "card mono", style: { padding: "16px", lineHeight: "1.9", fontSize: "14px" } }, [
        el("div", { html: "Y = A·B + A·B̄ + Ā·B" }),
        el("div", { html: "&nbsp;&nbsp;= A·(B + B̄) + Ā·B  <span class='small text-3'>// phân phối ngược cho A</span>" }),
        el("div", { html: "&nbsp;&nbsp;= A·1 + Ā·B  <span class='small text-3'>// bù: B + B̄ = 1</span>" }),
        el("div", { html: "&nbsp;&nbsp;= A + Ā·B  <span class='small text-3'>// đồng nhất: A·1 = A</span>" }),
        el("div", { html: "&nbsp;&nbsp;= A + B  <span class='small text-3'>// định lý phụ: A + Ā·B = A + B</span>" }),
        el("div", { style: { marginTop: "8px", borderTop: `1px dashed ${COLORS.border}`, paddingTop: "8px" } }, [
          el("strong", { html: "Y = A + B" }),
          el("span", { class: "small text-3", text: "  (5 cổng → 1 cổng OR)" }),
        ]),
      ]),
      p(
        "Tiết kiệm 4 cổng chỉ nhờ rút gọn đại số. Bạn có thể kiểm tra bằng bảng chân trị — cả hai biểu thức cho cùng kết quả với mọi tổ hợp A, B.",
      ),
      simplificationVerifier(),
    ),
  );

  // DeMorgan
  container.appendChild(
    section(
      "Định lý DeMorgan",
      p(
        "Đây là cặp định lý quan trọng nhất khi làm việc với cổng đảo (NAND, NOR). Nó cho phép <em>đảo phép toán</em> giữa AND và OR bằng cách lấy bù từng biến và bù toàn biểu thức.",
      ),
      el("div", { class: "grid grid-2" }, [
        el("div", { class: "card card-soft-peach" }, [
          el("h3", { text: "Định lý 1", style: { marginTop: 0 } }),
          el("div", { class: "mono", style: { fontSize: "20px", textAlign: "center", margin: "10px 0" }, html: "(A · B)̅ = Ā + B̄" }),
          el("p", { html: "<em>Phủ định của AND = OR của các phủ định.</em><br>Cổng NAND tương đương cổng OR có <strong>cả hai ngõ vào đảo</strong>." }),
        ]),
        el("div", { class: "card card-soft-sky" }, [
          el("h3", { text: "Định lý 2", style: { marginTop: 0 } }),
          el("div", { class: "mono", style: { fontSize: "20px", textAlign: "center", margin: "10px 0" }, html: "(A + B)̅ = Ā · B̄" }),
          el("p", { html: "<em>Phủ định của OR = AND của các phủ định.</em><br>Cổng NOR tương đương cổng AND có <strong>cả hai ngõ vào đảo</strong>." }),
        ]),
      ]),
      el("div", { class: "alert alert-info", style: { marginTop: "12px" } }, [
        el("strong", { text: "Quy tắc nhớ: " }),
        el("span", { html: "Khi đưa gạch ngang (phép NOT) ra/vào trong biểu thức, hãy <em>đảo từng biến</em> và <em>đổi · thành + hoặc ngược lại</em>." }),
      ]),
    ),
  );

  // DeMorgan verifier
  container.appendChild(
    section(
      "Kiểm chứng DeMorgan – hai mạch tương đương",
      p("Hai mạch dưới có sơ đồ khác nhau nhưng cho cùng ngõ ra với mọi tổ hợp ngõ vào. Hãy bấm A, B và so sánh."),
      demorganVerifier(),
    ),
  );

  // Application
  container.appendChild(
    section(
      "Ứng dụng định lý DeMorgan",
      p(
        "DeMorgan rất hữu ích khi bạn chỉ có sẵn một loại cổng (ví dụ chỉ có NAND), hoặc cần đơn giản biểu thức có nhiều dấu gạch ngang chồng nhau.",
      ),
      el("div", { class: "card", style: { padding: "16px" } }, [
        el("strong", { text: "Ví dụ – đơn giản hoá:" }),
        el("div", { class: "mono", style: { marginTop: "10px", lineHeight: "1.9", fontSize: "14px" } }, [
          el("div", { html: "Y = (A·B + C)̅" }),
          el("div", { html: "&nbsp;&nbsp;= (A·B)̅ · C̄  <span class='small text-3'>// DeMorgan 2 (đảo OR)</span>" }),
          el("div", { html: "&nbsp;&nbsp;= (Ā + B̄) · C̄  <span class='small text-3'>// DeMorgan 1 (đảo AND)</span>" }),
        ]),
      ]),
      el("div", { class: "card", style: { marginTop: "12px", padding: "16px" } }, [
        el("strong", { text: "Ví dụ – chuyển sang chỉ dùng NAND:" }),
        el("div", { class: "mono", style: { marginTop: "10px", lineHeight: "1.9", fontSize: "14px" } }, [
          el("div", { html: "Y = A + B  <span class='small text-3'>// muốn dùng NAND</span>" }),
          el("div", { html: "&nbsp;&nbsp;= (A + B)̿  <span class='small text-3'>// thêm hai dấu phủ định (không đổi giá trị)</span>" }),
          el("div", { html: "&nbsp;&nbsp;= (Ā · B̄)̅  <span class='small text-3'>// DeMorgan 2 ở bên trong</span>" }),
        ]),
        el("p", { class: "small text-2", style: { marginTop: "8px" }, html: "Biểu thức cuối chỉ cần 2 cổng NOT (= NAND 1 ngõ vào) và 1 cổng NAND — sẽ thấy chi tiết ở bài tiếp theo." }),
      ]),
    ),
  );

  container.appendChild(
    quizSection("boolean-theorems", [
      {
        prompt: "Định lý nào sau đây <em>sai</em>?",
        options: [
          { label: "A + 1 = 1" },
          { label: "A · 0 = 0" },
          { label: "A + A = 2A" },
          { label: "A · Ā = 0" },
        ],
        answer: 2,
        hint: "Đại số Boole chỉ có 0 và 1; không có 2A.",
        explanation: "A + A = A (Idempotent), không phải 2A.",
      },
      {
        prompt: "Áp dụng định lý hấp thụ: A + A·B = ?",
        options: [{ label: "A·B" }, { label: "A" }, { label: "B" }, { label: "A + B" }],
        answer: 1,
        hint: "A đứng riêng bao hàm trường hợp A·B.",
        explanation: "A + A·B = A·(1 + B) = A·1 = A.",
      },
      {
        prompt: "(A + B)̅ tương đương với?",
        options: [
          { label: "Ā + B̄" },
          { label: "Ā · B̄" },
          { label: "A · B̄" },
          { label: "A + B̄" },
        ],
        answer: 1,
        hint: "Định lý DeMorgan thứ hai.",
        explanation: "DeMorgan: bù của OR = AND của bù từng biến.",
      },
      {
        prompt: "(A·B·C)̅ tương đương với?",
        options: [
          { label: "Ā·B̄·C̄" },
          { label: "Ā + B̄ + C̄" },
          { label: "Ā + B + C̄" },
          { label: "A + B + C" },
        ],
        answer: 1,
        hint: "DeMorgan mở rộng cho nhiều biến: đổi · thành + và đảo từng biến.",
        explanation: "DeMorgan tổng quát: (A·B·C)̅ = Ā + B̄ + C̄.",
      },
      {
        prompt: "Rút gọn: Y = A·B + A·B̄",
        options: [{ label: "A" }, { label: "B" }, { label: "A·B" }, { label: "0" }],
        answer: 0,
        hint: "Phân phối ngược: A·(B + B̄).",
        explanation: "Y = A·(B + B̄) = A·1 = A.",
      },
      {
        prompt: "DeMorgan cho phép biến đổi NAND thành cổng nào tương đương (đầu vào đảo)?",
        options: [{ label: "AND" }, { label: "OR với cả hai ngõ vào đảo" }, { label: "NOR" }, { label: "XOR" }],
        answer: 1,
        hint: "(A·B)̅ = Ā + B̄.",
        explanation: "NAND = OR của hai ngõ vào đã được đảo.",
      },
    ]),
  );

  container.appendChild(
    section(
      "Tóm tắt",
      summary(null, [
        "Đại số Boole có các định lý <em>đồng nhất, null, đẳng cấp, bù, đối hợp</em> cho một biến và <em>giao hoán, kết hợp, phân phối, hấp thụ</em> cho nhiều biến.",
        "Rút gọn biểu thức giúp giảm số cổng cần dùng, tiết kiệm chi phí và tăng tốc độ mạch.",
        "<strong>DeMorgan 1:</strong> (A·B)̅ = Ā + B̄ — bù của AND = OR các bù.",
        "<strong>DeMorgan 2:</strong> (A + B)̅ = Ā · B̄ — bù của OR = AND các bù.",
        "DeMorgan cho phép chuyển đổi giữa AND-OR và NAND-NOR, là chìa khoá cho thiết kế mạch dùng một loại cổng duy nhất.",
      ]),
    ),
  );
}

function buildTheoremTable(rows) {
  return el("div", { class: "card", style: { overflowX: "auto" } }, [
    el("table", { class: "tbl tbl-bordered" }, [
      el("thead", {}, [
        el("tr", {}, [
          el("th", { text: "Tên" }),
          el("th", { text: "Dạng OR" }),
          el("th", { text: "Dạng AND" }),
        ]),
      ]),
      el("tbody", {}, rows.map((r) => el("tr", {}, [
        el("td", { text: r[0], style: { fontWeight: "600" } }),
        el("td", { class: "mono", html: r[1] }),
        el("td", { class: "mono", html: r[2] }),
      ]))),
    ]),
  ]);
}

// Verify Y1 = A·B + A·B̄ + Ā·B equals Y2 = A + B for all 4 inputs.
function simplificationVerifier() {
  const rows = [];
  for (let a = 0; a <= 1; a++) {
    for (let b = 0; b <= 1; b++) {
      const y1 = computeGate("OR", computeGate("OR", computeGate("AND", a, b), computeGate("AND", a, b ? 0 : 1)), computeGate("AND", a ? 0 : 1, b));
      const y2 = computeGate("OR", a, b);
      rows.push([a, b, y1, y2]);
    }
  }
  return el("div", { class: "card", style: { marginTop: "10px", overflowX: "auto" } }, [
    el("div", { class: "small text-2", style: { marginBottom: "6px" }, text: "Bảng chân trị – so sánh biểu thức gốc và biểu thức rút gọn" }),
    el("table", { class: "tbl tbl-bordered", style: { width: "auto", margin: "0 auto" } }, [
      el("thead", {}, [
        el("tr", {}, [
          el("th", { text: "A" }),
          el("th", { text: "B" }),
          el("th", { html: "Y₁ = A·B + A·B̄ + Ā·B" }),
          el("th", { html: "Y₂ = A + B" }),
        ]),
      ]),
      el("tbody", {}, rows.map((r) => el("tr", {}, r.map((v, i) => el("td", {
        class: "mono",
        style: {
          textAlign: "center",
          fontWeight: i >= 2 ? "700" : "400",
          background: i >= 2 ? (v === 1 ? COLORS.logic1Bg : COLORS.logic0Bg) : "transparent",
        },
        text: String(v),
      }))))),
    ]),
    el("div", { class: "small text-2", style: { textAlign: "center", marginTop: "6px" }, text: "Y₁ và Y₂ trùng nhau ở mọi hàng — biểu thức tương đương." }),
  ]);
}

// Show two equivalent circuits for (A · B)̄: a NAND vs. (NOT A) OR (NOT B).
function demorganVerifier() {
  const wrap = el("div", { class: "grid grid-2" });

  // Left card: NAND gate
  const left = el("div", { class: "card" });
  left.appendChild(el("h4", { text: "Vế trái: (A · B)̅", style: { marginTop: 0 } }));

  const SVG_NS = "http://www.w3.org/2000/svg";
  const W = 280, H = 140;

  function makeSvg() {
    const s = document.createElementNS(SVG_NS, "svg");
    s.setAttribute("viewBox", `0 0 ${W} ${H}`);
    s.style.width = "100%";
    s.style.maxHeight = "180px";
    return s;
  }
  const svgL = makeSvg();
  const svgR = makeSvg();
  const state = { a: 0, b: 0 };

  function renderLeft() {
    while (svgL.firstChild) svgL.removeChild(svgL.firstChild);
    const Y = computeGate("NAND", state.a, state.b);
    const g = drawGate(svgL, "NAND", 120, 50, { scale: 1.2 });
    drawWire(svgL, [{ x: 40, y: g.inA.y }, { x: g.inA.x, y: g.inA.y }], state.a);
    drawWire(svgL, [{ x: 40, y: g.inB.y }, { x: g.inB.x, y: g.inB.y }], state.b);
    drawWire(svgL, [{ x: g.out.x, y: g.out.y }, { x: 260, y: g.out.y }], Y);
    const a = drawPort(svgL, 40, g.inA.y, "A", state.a);
    const b = drawPort(svgL, 40, g.inB.y, "B", state.b);
    a.style.cursor = "pointer"; b.style.cursor = "pointer";
    a.addEventListener("click", () => { state.a ^= 1; renderBoth(); });
    b.addEventListener("click", () => { state.b ^= 1; renderBoth(); });
    drawPort(svgL, 260, g.out.y, "Y", Y);
  }

  function renderRight() {
    while (svgR.firstChild) svgR.removeChild(svgR.firstChild);
    const Abar = computeGate("NOT", state.a);
    const Bbar = computeGate("NOT", state.b);
    const Y = computeGate("OR", Abar, Bbar);
    const nA = drawGate(svgR, "NOT", 80, 30, { scale: 1 });
    const nB = drawGate(svgR, "NOT", 80, 90, { scale: 1 });
    const orG = drawGate(svgR, "OR", 170, 55, { scale: 1.1 });
    drawWire(svgR, [{ x: 30, y: nA.inA.y }, { x: nA.inA.x, y: nA.inA.y }], state.a);
    drawWire(svgR, [{ x: 30, y: nB.inA.y }, { x: nB.inA.x, y: nB.inA.y }], state.b);
    // NOT outputs → OR inputs, bend just after each NOT output.
    drawWire(svgR, [
      { x: nA.out.x, y: nA.out.y },
      { x: nA.out.x + 8, y: nA.out.y },
      { x: nA.out.x + 8, y: orG.inA.y },
      { x: orG.inA.x, y: orG.inA.y },
    ], Abar);
    drawWire(svgR, [
      { x: nB.out.x, y: nB.out.y },
      { x: nB.out.x + 14, y: nB.out.y },
      { x: nB.out.x + 14, y: orG.inB.y },
      { x: orG.inB.x, y: orG.inB.y },
    ], Bbar);
    drawWire(svgR, [{ x: orG.out.x, y: orG.out.y }, { x: 260, y: orG.out.y }], Y);
    const a = drawPort(svgR, 30, nA.inA.y, "A", state.a);
    const b = drawPort(svgR, 30, nB.inA.y, "B", state.b);
    a.style.cursor = "pointer"; b.style.cursor = "pointer";
    a.addEventListener("click", () => { state.a ^= 1; renderBoth(); });
    b.addEventListener("click", () => { state.b ^= 1; renderBoth(); });
    drawPort(svgR, 260, orG.out.y, "Y", Y);
  }

  function renderBoth() { renderLeft(); renderRight(); }

  left.appendChild(svgL);
  const right = el("div", { class: "card" });
  right.appendChild(el("h4", { text: "Vế phải: Ā + B̄", style: { marginTop: 0 } }));
  right.appendChild(svgR);

  wrap.appendChild(left);
  wrap.appendChild(right);
  renderBoth();
  return wrap;
}
