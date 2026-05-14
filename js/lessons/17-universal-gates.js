// Lesson 17: Sự đa năng của cổng NAND và NOR.
import { el, clear } from "../utils/dom.js";
import { section, summary, quizSection, p, splitView, resetSectionCounter } from "../utils/lesson-ui.js";
import { COLORS } from "../utils/colors.js";
import { drawGate, drawWire, drawPort, computeGate } from "../utils/gates.js";

export default {
  id: "universal-gates",
  order: 17,
  title: "Sự đa năng của cổng NAND, cổng NOR",
  subtitle: "Vì sao chỉ cần một loại cổng cũng có thể dựng cả CPU.",
  objective:
    "Hiểu khái niệm cổng đa năng (universal gate); biết cách dựng NOT, AND, OR chỉ từ cổng NAND hoặc chỉ từ cổng NOR; giải thích lý do thực tế của thiết kế này.",
  render,
};

function render(container) {
  resetSectionCounter();
  clear(container);

  container.appendChild(
    section(
      "Cổng đa năng là gì?",
      p(
        "Một cổng được gọi là <strong>đa năng</strong> (universal gate) nếu chỉ cần dùng <em>loại cổng đó thôi</em> ta cũng có thể dựng được tất cả các phép toán logic khác. Đại số Boole đã chứng minh: chỉ có hai cổng đa năng là <strong>NAND</strong> và <strong>NOR</strong>.",
      ),
      p(
        "Tại sao điều này quan trọng? Trong công nghiệp bán dẫn, sản xuất hàng loạt một loại transistor đồng nhất rẻ và đáng tin cậy hơn nhiều so với việc trộn nhiều loại. Vì vậy nhiều IC – đặc biệt là chip CMOS – được dựng <strong>hoàn toàn từ cổng NAND</strong> (hoặc NOR), kể cả các mạch phức tạp như bộ nhớ và CPU.",
      ),
    ),
  );

  // NAND universal
  container.appendChild(
    section(
      "Phần 1 – Dựng NOT, AND, OR từ NAND",
      p("Ba mạch dưới chỉ dùng cổng NAND nhưng tạo ra hành vi tương đương NOT, AND, OR. Bấm ngõ vào để kiểm tra."),
      el("div", { class: "stack", style: { gap: "16px" } }, [
        universalCard(
          "NOT từ NAND",
          "Y = (A · A)̅ = Ā",
          "Khi cả hai ngõ vào của NAND nối chung A, ta có A · A = A → NAND = Ā. Vậy NAND một ngõ vào = NOT.",
          buildNotFromNand,
          (a) => computeGate("NOT", a),
          1,
        ),
        universalCard(
          "AND từ NAND",
          "Y = ((A · B)̅)̅ = A · B",
          "Một NAND cho ra (A·B)̅. Đảo lần nữa bằng NAND (cùng ngõ vào) ta được lại A·B.",
          buildAndFromNand,
          (a, b) => computeGate("AND", a, b),
          2,
        ),
        universalCard(
          "OR từ NAND",
          "Y = (Ā · B̄)̅ = A + B  (DeMorgan)",
          "Đảo từng biến trước (NAND-tự-nối = NOT), rồi NAND hai kết quả lại. Theo DeMorgan, kết quả chính là A + B.",
          buildOrFromNand,
          (a, b) => computeGate("OR", a, b),
          2,
        ),
      ]),
    ),
  );

  // NOR universal
  container.appendChild(
    section(
      "Phần 2 – Dựng NOT, AND, OR từ NOR",
      p("Tương tự với cổng NOR. Lưu ý: AND và OR <em>đổi vai trò</em> so với phần 1 vì NOR là phép bù của OR (không phải AND)."),
      el("div", { class: "stack", style: { gap: "16px" } }, [
        universalCard(
          "NOT từ NOR",
          "Y = (A + A)̅ = Ā",
          "Cả hai ngõ vào NOR nối A → A + A = A → NOR = Ā.",
          buildNotFromNor,
          (a) => computeGate("NOT", a),
          1,
        ),
        universalCard(
          "OR từ NOR",
          "Y = ((A + B)̅)̅ = A + B",
          "NOR cho (A+B)̅; đảo lần nữa được A + B.",
          buildOrFromNor,
          (a, b) => computeGate("OR", a, b),
          2,
        ),
        universalCard(
          "AND từ NOR",
          "Y = (Ā + B̄)̅ = A · B  (DeMorgan)",
          "Đảo từng biến (NOR-tự-nối), rồi NOR lại. Theo DeMorgan, kết quả chính là A · B.",
          buildAndFromNor,
          (a, b) => computeGate("AND", a, b),
          2,
        ),
      ]),
    ),
  );

  // Counting comparison
  container.appendChild(
    section(
      "So sánh số cổng cần dùng",
      p(
        "Khi quy mọi mạch về một loại cổng, ta thường <em>tốn nhiều cổng hơn</em> so với dùng tổ hợp AND/OR/NOT. Nhưng đổi lại, toàn bộ chip chỉ có một loại transistor — dễ chế tạo, dễ tối ưu.",
      ),
      el("div", { class: "card", style: { overflowX: "auto" } }, [
        el("table", { class: "tbl tbl-bordered" }, [
          el("thead", {}, [
            el("tr", {}, [
              el("th", { text: "Phép toán" }),
              el("th", { text: "AND/OR/NOT" }),
              el("th", { text: "Chỉ NAND" }),
              el("th", { text: "Chỉ NOR" }),
            ]),
          ]),
          el("tbody", {}, [
            row(["NOT", "1 NOT", "1 NAND", "1 NOR"]),
            row(["AND", "1 AND", "2 NAND", "3 NOR"]),
            row(["OR", "1 OR", "3 NAND", "2 NOR"]),
            row(["NAND", "1 AND + 1 NOT", "1 NAND", "4 NOR"]),
            row(["NOR", "1 OR + 1 NOT", "4 NAND", "1 NOR"]),
            row(["XOR", "5 cổng (3 loại)", "4 NAND", "5 NOR"]),
          ]),
        ]),
      ]),
    ),
  );

  // Why it matters
  container.appendChild(
    section(
      "Vì sao công nghiệp ưa thích NAND/NOR?",
      el("div", { class: "grid grid-2" }, [
        el("div", { class: "card card-soft-mint" }, [
          el("h3", { text: "1. Sản xuất đồng nhất", style: { marginTop: 0 } }),
          el("p", { text: "Cả wafer chỉ cần một loại tế bào CMOS được lặp đi lặp lại — dễ kiểm thử, ít lỗi hơn." }),
        ]),
        el("div", { class: "card card-soft-sky" }, [
          el("h3", { text: "2. Chuẩn hoá thiết kế", style: { marginTop: 0 } }),
          el("p", { text: "Thư viện tổng hợp logic (synthesis library) sẽ chỉ cần đặc tả một cell. Tự động hoá EDA nhờ đó đơn giản hơn." }),
        ]),
        el("div", { class: "card card-soft-peach" }, [
          el("h3", { text: "3. Tốc độ cao", style: { marginTop: 0 } }),
          el("p", { text: "Trong công nghệ CMOS, NAND tự nhiên có 2 transistor nMOS nối tiếp + 2 pMOS song song — cấu trúc hiệu quả nhất trong các cổng cơ bản." }),
        ]),
        el("div", { class: "card card-soft-lavender" }, [
          el("h3", { text: "4. Bộ nhớ flash", style: { marginTop: 0 } }),
          el("p", { html: "Tên gọi <em>NAND Flash</em> và <em>NOR Flash</em> bắt nguồn chính từ cách tế bào nhớ được kết nối — NAND Flash dùng cấu trúc nối tiếp như cổng NAND." }),
        ]),
      ]),
    ),
  );

  container.appendChild(
    quizSection("universal-gates", [
      {
        prompt: "Cổng nào là <em>cổng đa năng</em> — có thể dùng riêng để dựng mọi hàm logic?",
        options: [{ label: "AND" }, { label: "OR" }, { label: "NAND" }, { label: "XOR" }],
        answer: 2,
        hint: "Chỉ có hai cổng đa năng.",
        explanation: "NAND và NOR là hai cổng đa năng. Các cổng khác đều thiếu khả năng tạo phép NOT.",
      },
      {
        prompt: "Để tạo cổng NOT từ NAND, ta làm gì?",
        options: [
          { label: "Nối tiếp hai cổng NAND" },
          { label: "Nối cả hai ngõ vào của NAND vào cùng tín hiệu A" },
          { label: "Cần thêm một cổng NOT" },
          { label: "Không thể tạo được" },
        ],
        answer: 1,
        hint: "A · A = A → NAND = Ā.",
        explanation: "NAND(A, A) = (A·A)̅ = Ā → đúng là NOT.",
      },
      {
        prompt: "Để tạo cổng AND chỉ từ NAND, cần ít nhất bao nhiêu cổng NAND?",
        options: [{ label: "1" }, { label: "2" }, { label: "3" }, { label: "4" }],
        answer: 1,
        hint: "AND = NOT(NAND).",
        explanation: "NAND(A, B) cho (A·B)̅, sau đó dùng NAND tự nối để đảo lần nữa → tổng 2 cổng.",
      },
      {
        prompt: "Theo DeMorgan, OR(A, B) = NAND(?, ?) khi dùng toàn NAND.",
        options: [
          { label: "NAND(A, B), NAND(A, B)" },
          { label: "NAND(A, A), NAND(B, B)" },
          { label: "NAND(A, B), NAND(B, A)" },
          { label: "NAND(Ā, B̄), NAND(A, B)" },
        ],
        answer: 1,
        hint: "OR = (Ā · B̄)̅ — đảo từng biến trước, rồi NAND.",
        explanation: "NAND(A,A)=Ā, NAND(B,B)=B̄; NAND(Ā,B̄)=(Ā·B̄)̅=A+B.",
      },
      {
        prompt: "Vì sao công nghiệp bán dẫn thích dựng chip toàn cổng NAND?",
        options: [
          { label: "NAND nhanh hơn mọi cổng khác trong mọi công nghệ" },
          { label: "Một loại tế bào duy nhất dễ sản xuất và kiểm thử hàng loạt" },
          { label: "NAND có thể nhân với điện áp đầu vào" },
          { label: "Để giảm số ngõ vào của chip" },
        ],
        answer: 1,
        hint: "Đồng nhất hoá quy trình sản xuất.",
        explanation: "Lý do chính: đơn giản hoá sản xuất và kiểm thử — một cell lặp lại trên toàn wafer.",
      },
    ]),
  );

  container.appendChild(
    section(
      "Tóm tắt",
      summary(null, [
        "<strong>NAND và NOR là cổng đa năng</strong>: chỉ dùng một loại cũng đủ dựng mọi hàm logic.",
        "<strong>NOT từ NAND</strong>: nối hai ngõ vào với nhau.",
        "<strong>AND từ NAND</strong>: 2 cổng — NAND rồi đảo bằng NAND nữa.",
        "<strong>OR từ NAND</strong>: 3 cổng — đảo từng biến rồi NAND chúng (DeMorgan).",
        "Đối ứng: NOT, OR, AND có thể dựng từ NOR tương tự (vai trò AND/OR đổi nhau).",
        "Trong công nghiệp CMOS, NAND có cấu trúc transistor đơn giản nhất; nhiều IC thực được dựng <em>hoàn toàn</em> bằng NAND.",
      ]),
    ),
  );
}

function row(cells) {
  return el("tr", {}, cells.map((c, i) => el("td", {
    style: i === 0 ? { fontWeight: "600" } : { textAlign: "center" },
    class: i === 0 ? "" : "mono",
    text: c,
  })));
}

// ---------------------------------------------------------------------------
// Universal card: title, expression, description, interactive diagram, equivalence.

function universalCard(title, expr, desc, builder, expected, arity) {
  const card = el("div", { class: "card" });
  card.appendChild(el("h4", { text: title, style: { marginTop: 0 } }));
  card.appendChild(el("div", { class: "mono", style: { fontSize: "14px", marginBottom: "6px" }, html: expr }));
  card.appendChild(el("p", { class: "small text-2", style: { marginBottom: "10px" }, text: desc }));

  const diagram = el("div");
  const status = el("div", { class: "small", style: { marginTop: "6px", textAlign: "center" } });
  const state = arity === 1 ? { a: 0 } : { a: 0, b: 0 };

  function rerender() {
    clear(diagram);
    const out = arity === 1 ? builder(diagram, state, render2) : builder(diagram, state, render2);
    const expectedY = arity === 1 ? expected(state.a) : expected(state.a, state.b);
    const match = out === expectedY;
    clear(status);
    status.appendChild(el("span", {
      class: match ? "logic-pill l-1" : "logic-pill l-x",
      text: match ? `✓ Y = ${out} (trùng với phép gốc)` : `✗ Y = ${out}, gốc = ${expectedY}`,
    }));
  }
  function render2() { rerender(); }

  card.appendChild(diagram);
  card.appendChild(status);
  rerender();
  return card;
}

// ---- Per-construction builders. Each returns the final Y value -----------
//
// Routing convention:
//   - External ports are placed at the same Y as the gate input they feed, so wires
//     are perfectly horizontal.
//   - Wires between gates use a bend just outside the source gate (free space).
//   - When one signal feeds two gate inputs, a junction dot marks the branch.

function buildNotFromNand(host, state, onChange) {
  return buildSingleInverter(host, state, onChange, "NAND");
}

function buildNotFromNor(host, state, onChange) {
  return buildSingleInverter(host, state, onChange, "NOR");
}

function buildSingleInverter(host, state, onChange, gateType) {
  const svg = svgRoot(320, 100);
  const Y = computeGate(gateType, state.a, state.a);
  const g = drawGate(svg, gateType, 130, 30, { scale: 1.1 });

  // A port sits between the two tied inputs.
  const portY = (g.inA.y + g.inB.y) / 2;
  const junctionX = 100;

  drawWire(svg, [{ x: 50, y: portY }, { x: junctionX, y: portY }], state.a);
  drawWire(svg, [{ x: junctionX, y: portY }, { x: junctionX, y: g.inA.y }, { x: g.inA.x, y: g.inA.y }], state.a);
  drawWire(svg, [{ x: junctionX, y: portY }, { x: junctionX, y: g.inB.y }, { x: g.inB.x, y: g.inB.y }], state.a);
  junctionDot(svg, junctionX, portY);
  drawWire(svg, [{ x: g.out.x, y: g.out.y }, { x: 300, y: g.out.y }], Y);

  const a = drawPort(svg, 50, portY, "A", state.a);
  a.style.cursor = "pointer";
  a.addEventListener("click", () => { state.a ^= 1; onChange(); });
  drawPort(svg, 300, g.out.y, "Y", Y);
  host.appendChild(svg);
  return Y;
}

function buildAndFromNand(host, state, onChange) {
  return buildTwoStageSelf(host, state, onChange, "NAND");
}

function buildOrFromNor(host, state, onChange) {
  return buildTwoStageSelf(host, state, onChange, "NOR");
}

// Two-stage: g1(A,B) then g2(g1.out, g1.out) with both inputs tied. Equivalent to AND for NAND, OR for NOR.
function buildTwoStageSelf(host, state, onChange, gateType) {
  const svg = svgRoot(380, 140);
  const m = computeGate(gateType, state.a, state.b);
  const Y = computeGate(gateType, m, m);
  const g1 = drawGate(svg, gateType, 110, 50, { scale: 1.1 });
  const g2 = drawGate(svg, gateType, 250, 50, { scale: 1.1 });

  // Inputs A, B feed g1 directly — port Y aligned to gate inputs.
  drawWire(svg, [{ x: 40, y: g1.inA.y }, { x: g1.inA.x, y: g1.inA.y }], state.a);
  drawWire(svg, [{ x: 40, y: g1.inB.y }, { x: g1.inB.x, y: g1.inB.y }], state.b);

  // g1.out → both inputs of g2 via a junction in the free space between gates.
  const junctionX = g2.inA.x - 18;
  drawWire(svg, [{ x: g1.out.x, y: g1.out.y }, { x: junctionX, y: g1.out.y }], m);
  drawWire(svg, [{ x: junctionX, y: g1.out.y }, { x: junctionX, y: g2.inA.y }, { x: g2.inA.x, y: g2.inA.y }], m);
  drawWire(svg, [{ x: junctionX, y: g1.out.y }, { x: junctionX, y: g2.inB.y }, { x: g2.inB.x, y: g2.inB.y }], m);
  junctionDot(svg, junctionX, g1.out.y);

  drawWire(svg, [{ x: g2.out.x, y: g2.out.y }, { x: 360, y: g2.out.y }], Y);

  const a = drawPort(svg, 40, g1.inA.y, "A", state.a);
  const b = drawPort(svg, 40, g1.inB.y, "B", state.b);
  a.style.cursor = b.style.cursor = "pointer";
  a.addEventListener("click", () => { state.a ^= 1; onChange(); });
  b.addEventListener("click", () => { state.b ^= 1; onChange(); });
  drawPort(svg, 360, g2.out.y, "Y", Y);
  host.appendChild(svg);
  return Y;
}

function buildOrFromNand(host, state, onChange) {
  return buildDeMorgan(host, state, onChange, "NAND");
}

function buildAndFromNor(host, state, onChange) {
  return buildDeMorgan(host, state, onChange, "NOR");
}

// DeMorgan style: invert A and B (each using a self-tied gate), then a final gate combines.
// For NAND → OR; for NOR → AND.
function buildDeMorgan(host, state, onChange, gateType) {
  const svg = svgRoot(400, 180);
  const nA = computeGate(gateType, state.a, state.a);
  const nB = computeGate(gateType, state.b, state.b);
  const Y = computeGate(gateType, nA, nB);

  const inv1 = drawGate(svg, gateType, 110, 20, { scale: 1 });
  const inv2 = drawGate(svg, gateType, 110, 110, { scale: 1 });
  const out = drawGate(svg, gateType, 260, 65, { scale: 1.1 });

  // A port at vertical middle of inv1 inputs.
  const aPortY = (inv1.inA.y + inv1.inB.y) / 2;
  const bPortY = (inv2.inA.y + inv2.inB.y) / 2;
  const aJunctionX = 80;
  const bJunctionX = 80;

  // A → inv1 inputs.
  drawWire(svg, [{ x: 40, y: aPortY }, { x: aJunctionX, y: aPortY }], state.a);
  drawWire(svg, [{ x: aJunctionX, y: aPortY }, { x: aJunctionX, y: inv1.inA.y }, { x: inv1.inA.x, y: inv1.inA.y }], state.a);
  drawWire(svg, [{ x: aJunctionX, y: aPortY }, { x: aJunctionX, y: inv1.inB.y }, { x: inv1.inB.x, y: inv1.inB.y }], state.a);
  junctionDot(svg, aJunctionX, aPortY);

  // B → inv2 inputs.
  drawWire(svg, [{ x: 40, y: bPortY }, { x: bJunctionX, y: bPortY }], state.b);
  drawWire(svg, [{ x: bJunctionX, y: bPortY }, { x: bJunctionX, y: inv2.inA.y }, { x: inv2.inA.x, y: inv2.inA.y }], state.b);
  drawWire(svg, [{ x: bJunctionX, y: bPortY }, { x: bJunctionX, y: inv2.inB.y }, { x: inv2.inB.x, y: inv2.inB.y }], state.b);
  junctionDot(svg, bJunctionX, bPortY);

  // inv1.out → out.inA, bend at x = out.inA.x - 18.
  const bendX1 = out.inA.x - 18;
  drawWire(svg, [
    { x: inv1.out.x, y: inv1.out.y },
    { x: bendX1, y: inv1.out.y },
    { x: bendX1, y: out.inA.y },
    { x: out.inA.x, y: out.inA.y },
  ], nA);
  // inv2.out → out.inB, bend at x = out.inB.x - 10 (offset to avoid crossing).
  const bendX2 = out.inB.x - 10;
  drawWire(svg, [
    { x: inv2.out.x, y: inv2.out.y },
    { x: bendX2, y: inv2.out.y },
    { x: bendX2, y: out.inB.y },
    { x: out.inB.x, y: out.inB.y },
  ], nB);

  drawWire(svg, [{ x: out.out.x, y: out.out.y }, { x: 380, y: out.out.y }], Y);

  const a = drawPort(svg, 40, aPortY, "A", state.a);
  const b = drawPort(svg, 40, bPortY, "B", state.b);
  a.style.cursor = b.style.cursor = "pointer";
  a.addEventListener("click", () => { state.a ^= 1; onChange(); });
  b.addEventListener("click", () => { state.b ^= 1; onChange(); });
  drawPort(svg, 380, out.out.y, "Y", Y);
  host.appendChild(svg);
  return Y;
}

function junctionDot(svg, x, y) {
  const c = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  c.setAttribute("cx", x);
  c.setAttribute("cy", y);
  c.setAttribute("r", 3);
  c.setAttribute("fill", COLORS.text);
  svg.appendChild(c);
}

function svgRoot(W, H) {
  const s = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  s.setAttribute("viewBox", `0 0 ${W} ${H}`);
  s.style.width = "100%";
  s.style.maxHeight = (H + 40) + "px";
  return s;
}
