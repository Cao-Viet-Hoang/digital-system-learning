// Lesson 15: Biểu diễn mạch điện logic — Tính giá trị ngõ ra.
import { el, clear } from "../utils/dom.js";
import { section, summary, quizSection, p, splitView, resetSectionCounter } from "../utils/lesson-ui.js";
import { COLORS } from "../utils/colors.js";
import { drawGate, drawWire, drawPort, computeGate } from "../utils/gates.js";

export default {
  id: "logic-circuits",
  order: 15,
  title: "Biểu diễn mạch điện logic – Tính giá trị ngõ ra",
  subtitle: "Từ sơ đồ mạch sang biểu thức Boole, và ngược lại.",
  objective:
    "Đọc một mạch logic nhiều cổng; viết biểu thức Boole tương ứng; tính giá trị ngõ ra cho mọi tổ hợp ngõ vào; lập bảng chân trị từ mạch.",
  render,
};

function render(container) {
  resetSectionCounter();
  clear(container);

  container.appendChild(
    section(
      "Mạch logic = tổ hợp các cổng",
      p(
        "Hầu hết các phép toán thực tế không chỉ dùng một cổng. Ví dụ: tín hiệu báo động <em>BẬT</em> khi <em>cửa mở</em> VÀ <em>(có chuyển động</em> HOẶC <em>tiếng động lớn)</em>. Đó là một biểu thức ba biến cần ghép nhiều cổng để hiện thực.",
      ),
      p(
        "Bài này sẽ chỉ cho bạn ba kỹ năng cốt lõi: <strong>(1)</strong> đọc sơ đồ mạch để viết biểu thức Boole, <strong>(2)</strong> tính giá trị ngõ ra theo từng cổng, và <strong>(3)</strong> lập bảng chân trị cho toàn mạch.",
      ),
    ),
  );

  // Section 1 — read a 3-gate circuit
  container.appendChild(
    section(
      "Ví dụ 1 – Mạch AND + OR",
      p("Mạch dưới đây nhận ba ngõ vào A, B, C. Hãy bấm vào các ngõ vào để thay đổi 0/1 và quan sát giá trị tại <em>mỗi dây</em>."),
      splitView(
        andOrCircuit(),
        el("div", { class: "card card-soft-sky" }, [
          el("h3", { text: "Cấu trúc mạch", style: { marginTop: 0 } }),
          el("ol", {}, [
            el("li", { html: "Cổng AND nhận <span class='mono'>A</span> và <span class='mono'>B</span>, cho ra <span class='mono'>P = A · B</span>." }),
            el("li", { html: "Cổng OR nhận <span class='mono'>P</span> và <span class='mono'>C</span>, cho ra <span class='mono'>Y = P + C = A·B + C</span>." }),
          ]),
          el("div", { class: "alert alert-info", style: { marginTop: "10px" } }, [
            el("strong", { text: "Quy tắc đọc mạch: " }),
            el("span", { text: "Đi từ trái sang phải, theo dòng tín hiệu. Mỗi cổng làm phép toán trên ngõ vào của nó, kết quả truyền tiếp." }),
          ]),
        ]),
      ),
    ),
  );

  // Boolean expression from circuit
  container.appendChild(
    section(
      "Bước 1 – Viết biểu thức Boole từ mạch",
      p("Để viết biểu thức từ mạch, ta đặt tên cho mỗi <em>dây trung gian</em> rồi diễn giải từng cổng:"),
      el("div", { class: "card mono", style: { padding: "16px", fontSize: "15px", lineHeight: "1.8" } }, [
        el("div", { html: "P = A · B  &nbsp;<span class='small text-3'>// ngõ ra cổng AND</span>" }),
        el("div", { html: "Y = P + C  &nbsp;<span class='small text-3'>// ngõ ra cổng OR</span>" }),
        el("div", { style: { marginTop: "8px", borderTop: `1px dashed ${COLORS.border}`, paddingTop: "8px" } }, [
          el("span", { html: "Thay P:  <strong>Y = A · B + C</strong>" }),
        ]),
      ]),
    ),
  );

  // Trace example
  container.appendChild(
    section(
      "Bước 2 – Tính giá trị ngõ ra cho một tổ hợp",
      p("Cho A = 1, B = 0, C = 1. Tính từng bước:"),
      el("div", { class: "card", style: { padding: "16px" } }, [
        el("ol", { class: "mono", style: { lineHeight: "1.8" } }, [
          el("li", { html: "P = A · B = 1 · 0 = <strong style='color:#3a8aff'>0</strong>" }),
          el("li", { html: "Y = P + C = 0 + 1 = <strong style='color:#f0a274'>1</strong>" }),
        ]),
      ]),
    ),
  );

  // Build full truth table
  container.appendChild(
    section(
      "Bước 3 – Lập bảng chân trị toàn mạch",
      p(
        "Liệt kê <em>tất cả</em> tổ hợp ngõ vào (với n biến → 2<sup>n</sup> hàng), tính cột trung gian rồi cột Y. Bảng chân trị là <strong>cách mô tả đầy đủ nhất</strong> một mạch tổ hợp.",
      ),
      truthTableExpr3(["A", "B", "C"], (a, b, c) => {
        const P = computeGate("AND", a, b);
        const Y = computeGate("OR", P, c);
        return { P, Y };
      }, ["P = A·B", "Y = P + C"]),
    ),
  );

  // Example 2 — XOR built from basic gates
  container.appendChild(
    section(
      "Ví dụ 2 – Mạch XOR dựng từ cổng cơ bản",
      p(
        "Đây là mạch khó hơn: hai cổng NOT, hai cổng AND và một cổng OR — dựng nên hàm <span class='mono'>Y = A·B̅ + A̅·B</span> (chính là XOR). Bấm A, B để theo dõi 5 giá trị trung gian.",
      ),
      xorCircuit(),
    ),
  );

  container.appendChild(
    section(
      "Từ biểu thức Boole → vẽ mạch",
      p(
        "Quá trình ngược: cho biểu thức <span class='mono'>Y = (A + B) · C̅</span>, ta vẽ mạch theo thứ tự <em>ưu tiên phép toán</em> giống đại số thông thường: NOT cao nhất, rồi AND, rồi OR.",
      ),
      el("div", { class: "card", style: { padding: "16px" } }, [
        el("ol", {}, [
          el("li", { html: "Tách biểu thức: cần <span class='mono'>A + B</span> (OR), <span class='mono'>C̅</span> (NOT), rồi <span class='mono'>(A + B) · C̅</span> (AND)." }),
          el("li", { html: "Vẽ cổng OR cho A và B → dây trung gian P." }),
          el("li", { html: "Vẽ cổng NOT cho C → dây trung gian Q." }),
          el("li", { html: "Vẽ cổng AND nhận P và Q → ngõ ra Y." }),
        ]),
        el("div", { class: "alert alert-info", style: { marginTop: "10px" } }, [
          el("strong", { text: "Mẹo: " }),
          el("span", { text: "Luôn đếm số cổng AND, OR, NOT trước khi vẽ để biết cần bao nhiêu chip." }),
        ]),
      ]),
      circuitFromExpr(),
    ),
  );

  container.appendChild(
    quizSection("logic-circuits", [
      {
        prompt: "Mạch có sơ đồ: A, B vào cổng AND → ngõ ra P; P và C vào cổng OR → Y. Biểu thức Y?",
        options: [
          { label: "Y = A + B · C" },
          { label: "Y = A · B + C" },
          { label: "Y = A · (B + C)" },
          { label: "Y = (A + B) · C" },
        ],
        answer: 1,
        hint: "Tính cổng AND trước, sau đó cổng OR.",
        explanation: "P = A·B, Y = P + C = A·B + C.",
      },
      {
        prompt: "Với mạch Y = A·B + C, cho A = 1, B = 1, C = 0. Y = ?",
        options: [{ label: "0" }, { label: "1" }],
        answer: 1,
        hint: "A·B = 1·1 = 1; 1 + 0 = ?",
        explanation: "A·B = 1, OR với C = 0 → Y = 1.",
      },
      {
        prompt: "Mạch ba biến (A, B, C) có bao nhiêu hàng trong bảng chân trị?",
        options: [{ label: "3" }, { label: "6" }, { label: "8" }, { label: "9" }],
        answer: 2,
        hint: "2 mũ n với n là số biến.",
        explanation: "2³ = 8 hàng.",
      },
      {
        prompt: "Biểu thức Y = A·B̅ + A̅·B tương đương với cổng nào?",
        options: [{ label: "AND" }, { label: "OR" }, { label: "XOR" }, { label: "XNOR" }],
        answer: 2,
        hint: "Bằng 1 khi A và B khác nhau.",
        explanation: "Đây là dạng khai triển chuẩn của XOR.",
      },
      {
        prompt: "Khi vẽ mạch từ biểu thức, thứ tự ưu tiên phép toán đúng là:",
        options: [
          { label: "OR → AND → NOT" },
          { label: "NOT → AND → OR" },
          { label: "AND → OR → NOT" },
          { label: "Không có thứ tự cố định" },
        ],
        answer: 1,
        hint: "Giống đại số: phép đơn ngôi trước, nhân trước cộng.",
        explanation: "Trong đại số Boole: NOT (đơn ngôi) > AND (·) > OR (+).",
      },
    ]),
  );

  container.appendChild(
    section(
      "Tóm tắt",
      summary(null, [
        "Mạch logic = nhiều cổng cơ bản ghép lại; tín hiệu đi từ trái (ngõ vào) sang phải (ngõ ra).",
        "Để <em>viết biểu thức từ mạch</em>: đặt tên dây trung gian, diễn giải mỗi cổng, ráp lại.",
        "Để <em>tính giá trị ngõ ra</em>: thay số vào từng cổng theo thứ tự, từ ngõ vào trở đi.",
        "Mạch có n biến → bảng chân trị có 2<sup>n</sup> hàng.",
        "Thứ tự ưu tiên phép toán Boole: <strong>NOT > AND > OR</strong>.",
      ]),
    ),
  );
}

// ---------------------------------------------------------------------------
// Interactive circuit: Y = A·B + C

function andOrCircuit() {
  const card = el("div", { class: "card" });
  card.appendChild(el("div", { class: "small text-2", style: { textAlign: "center", marginBottom: "8px" }, text: "Bấm ngõ vào để theo dõi tín hiệu trên mạch" }));

  const SVG_NS = "http://www.w3.org/2000/svg";
  const W = 380, H = 200;
  const svg = document.createElementNS(SVG_NS, "svg");
  svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
  svg.style.width = "100%";
  svg.style.maxHeight = "240px";

  const state = { a: 0, b: 0, c: 0 };

  function rerender() {
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    const P = computeGate("AND", state.a, state.b);
    const Y = computeGate("OR", P, state.c);

    const andG = drawGate(svg, "AND", 130, 40, { scale: 1.2 });
    const orG = drawGate(svg, "OR", 240, 100, { scale: 1.2 });

    // Port Y-positions aligned with the gate inputs so wires are perfectly straight.
    const aY = andG.inA.y, bY = andG.inB.y, cY = orG.inB.y;
    const portX = 50;

    drawWire(svg, [{ x: portX, y: aY }, { x: andG.inA.x, y: aY }], state.a);
    drawWire(svg, [{ x: portX, y: bY }, { x: andG.inB.x, y: bY }], state.b);
    drawWire(svg, [{ x: portX, y: cY }, { x: orG.inB.x, y: cY }], state.c);

    // AND.out → OR.inA — vertical bend right after AND output (away from gate bodies).
    const bendX = andG.out.x + 10;
    drawWire(svg, [
      { x: andG.out.x, y: andG.out.y },
      { x: bendX, y: andG.out.y },
      { x: bendX, y: orG.inA.y },
      { x: orG.inA.x, y: orG.inA.y },
    ], P);

    drawWire(svg, [{ x: orG.out.x, y: orG.out.y }, { x: 360, y: orG.out.y }], Y);

    labelAt(svg, bendX + 4, andG.out.y - 6, `P = ${P}`, COLORS.text2);

    const a = drawPort(svg, portX, aY, "A", state.a);
    const b = drawPort(svg, portX, bY, "B", state.b);
    const c = drawPort(svg, portX, cY, "C", state.c);
    a.style.cursor = "pointer"; b.style.cursor = "pointer"; c.style.cursor = "pointer";
    a.addEventListener("click", () => { state.a ^= 1; rerender(); });
    b.addEventListener("click", () => { state.b ^= 1; rerender(); });
    c.addEventListener("click", () => { state.c ^= 1; rerender(); });
    drawPort(svg, 360, orG.out.y, "Y", Y);
  }

  card.appendChild(svg);
  rerender();
  return card;
}

// ---------------------------------------------------------------------------
// Interactive XOR built from basic gates: Y = A·B̄ + Ā·B

function xorCircuit() {
  const card = el("div", { class: "card" });

  const SVG_NS = "http://www.w3.org/2000/svg";
  const W = 500, H = 240;
  const svg = document.createElementNS(SVG_NS, "svg");
  svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
  svg.style.width = "100%";
  svg.style.maxHeight = "300px";

  const state = { a: 0, b: 0 };

  function rerender() {
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    const Abar = computeGate("NOT", state.a);
    const Bbar = computeGate("NOT", state.b);
    const T1 = computeGate("AND", state.a, Bbar);
    const T2 = computeGate("AND", Abar, state.b);
    const Y = computeGate("OR", T1, T2);

    const notA = drawGate(svg, "NOT", 130, 30, { scale: 1 });
    const notB = drawGate(svg, "NOT", 130, 170, { scale: 1 });
    const and1 = drawGate(svg, "AND", 240, 50, { scale: 1 });
    const and2 = drawGate(svg, "AND", 240, 150, { scale: 1 });
    const orG = drawGate(svg, "OR", 380, 100, { scale: 1.2 });

    // A port aligned with NOT_A input height (= 50). Junction at x=90 branches to AND1.inA.
    // B port aligned with NOT_B input height (= 190). Junction at x=90 branches to AND2.inB.
    const aPortY = notA.inA.y;       // 50
    const bPortY = notB.inA.y;       // 190
    const aJunctionX = 90;
    const bJunctionX = 90;

    // A → notA.inA (straight horizontal).
    drawWire(svg, [{ x: 50, y: aPortY }, { x: notA.inA.x, y: aPortY }], state.a);
    // Branch A → and1.inA (vertical drop at junction, then horizontal at and1.inA.y).
    drawWire(svg, [
      { x: aJunctionX, y: aPortY },
      { x: aJunctionX, y: and1.inA.y },
      { x: and1.inA.x, y: and1.inA.y },
    ], state.a);
    junction(svg, aJunctionX, aPortY);

    // B → notB.inA (straight horizontal).
    drawWire(svg, [{ x: 50, y: bPortY }, { x: notB.inA.x, y: bPortY }], state.b);
    // Branch B → and2.inB.
    drawWire(svg, [
      { x: bJunctionX, y: bPortY },
      { x: bJunctionX, y: and2.inB.y },
      { x: and2.inB.x, y: and2.inB.y },
    ], state.b);
    junction(svg, bJunctionX, bPortY);

    // NOT_A.out → AND2.inA — route at x=215 (between NOTs and ANDs).
    drawWire(svg, [
      { x: notA.out.x, y: notA.out.y },
      { x: 215, y: notA.out.y },
      { x: 215, y: and2.inA.y },
      { x: and2.inA.x, y: and2.inA.y },
    ], Abar);
    // NOT_B.out → AND1.inB — route at x=225 to avoid overlapping the Ā wire.
    drawWire(svg, [
      { x: notB.out.x, y: notB.out.y },
      { x: 225, y: notB.out.y },
      { x: 225, y: and1.inB.y },
      { x: and1.inB.x, y: and1.inB.y },
    ], Bbar);

    // AND1.out → OR.inA — route at x=335.
    drawWire(svg, [
      { x: and1.out.x, y: and1.out.y },
      { x: 335, y: and1.out.y },
      { x: 335, y: orG.inA.y },
      { x: orG.inA.x, y: orG.inA.y },
    ], T1);
    // AND2.out → OR.inB — route at x=345.
    drawWire(svg, [
      { x: and2.out.x, y: and2.out.y },
      { x: 345, y: and2.out.y },
      { x: 345, y: orG.inB.y },
      { x: orG.inB.x, y: orG.inB.y },
    ], T2);
    drawWire(svg, [{ x: orG.out.x, y: orG.out.y }, { x: 480, y: orG.out.y }], Y);

    labelAt(svg, notA.out.x + 6, notA.out.y - 6, `Ā=${Abar}`, COLORS.text2);
    labelAt(svg, notB.out.x + 6, notB.out.y - 6, `B̄=${Bbar}`, COLORS.text2);
    labelAt(svg, and1.out.x + 4, and1.out.y - 6, `${T1}`, COLORS.text2);
    labelAt(svg, and2.out.x + 4, and2.out.y - 6, `${T2}`, COLORS.text2);

    const a = drawPort(svg, 50, aPortY, "A", state.a);
    const b = drawPort(svg, 50, bPortY, "B", state.b);
    a.style.cursor = "pointer"; b.style.cursor = "pointer";
    a.addEventListener("click", () => { state.a ^= 1; rerender(); });
    b.addEventListener("click", () => { state.b ^= 1; rerender(); });
    drawPort(svg, 480, orG.out.y, "Y", Y);
  }

  card.appendChild(svg);
  card.appendChild(el("div", { class: "small text-2", style: { textAlign: "center", marginTop: "6px" }, text: "Bấm A hoặc B; quan sát Y bằng 1 chỉ khi hai ngõ vào khác nhau." }));
  rerender();
  return card;
}

// ---------------------------------------------------------------------------
// Circuit from expression: Y = (A + B)·C̄

function circuitFromExpr() {
  const card = el("div", { class: "card", style: { marginTop: "10px" } });

  const SVG_NS = "http://www.w3.org/2000/svg";
  const W = 440, H = 200;
  const svg = document.createElementNS(SVG_NS, "svg");
  svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
  svg.style.width = "100%";
  svg.style.maxHeight = "240px";

  const state = { a: 0, b: 0, c: 0 };

  function rerender() {
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    const P = computeGate("OR", state.a, state.b);
    const Cbar = computeGate("NOT", state.c);
    const Y = computeGate("AND", P, Cbar);

    const orG = drawGate(svg, "OR", 130, 30, { scale: 1.1 });
    const notG = drawGate(svg, "NOT", 130, 130, { scale: 1 });
    const andG = drawGate(svg, "AND", 280, 80, { scale: 1.1 });

    const aY = orG.inA.y, bY = orG.inB.y, cY = notG.inA.y;
    const portX = 50;

    drawWire(svg, [{ x: portX, y: aY }, { x: orG.inA.x, y: aY }], state.a);
    drawWire(svg, [{ x: portX, y: bY }, { x: orG.inB.x, y: bY }], state.b);
    drawWire(svg, [{ x: portX, y: cY }, { x: notG.inA.x, y: cY }], state.c);

    // OR.out → AND.inA — bend at x=235 (clear of bodies).
    drawWire(svg, [
      { x: orG.out.x, y: orG.out.y },
      { x: 235, y: orG.out.y },
      { x: 235, y: andG.inA.y },
      { x: andG.inA.x, y: andG.inA.y },
    ], P);
    // NOT.out → AND.inB — bend at x=245.
    drawWire(svg, [
      { x: notG.out.x, y: notG.out.y },
      { x: 245, y: notG.out.y },
      { x: 245, y: andG.inB.y },
      { x: andG.inB.x, y: andG.inB.y },
    ], Cbar);
    drawWire(svg, [{ x: andG.out.x, y: andG.out.y }, { x: 420, y: andG.out.y }], Y);

    labelAt(svg, orG.out.x + 4, orG.out.y - 6, `P=${P}`, COLORS.text2);
    labelAt(svg, notG.out.x + 6, notG.out.y - 6, `C̄=${Cbar}`, COLORS.text2);

    const a = drawPort(svg, portX, aY, "A", state.a);
    const b = drawPort(svg, portX, bY, "B", state.b);
    const c = drawPort(svg, portX, cY, "C", state.c);
    [a, b, c].forEach((n) => n.style.cursor = "pointer");
    a.addEventListener("click", () => { state.a ^= 1; rerender(); });
    b.addEventListener("click", () => { state.b ^= 1; rerender(); });
    c.addEventListener("click", () => { state.c ^= 1; rerender(); });
    drawPort(svg, 420, andG.out.y, "Y", Y);
  }

  card.appendChild(svg);
  card.appendChild(el("div", { class: "small text-2", style: { textAlign: "center", marginTop: "6px" }, text: "Mạch hiện thực Y = (A + B) · C̄" }));
  rerender();
  return card;
}

// ---------------------------------------------------------------------------
// Truth table for an arbitrary 3-var circuit, with intermediate columns.
function truthTableExpr3(inputNames, fn, midLabels) {
  const rows = [];
  for (let a = 0; a <= 1; a++) {
    for (let b = 0; b <= 1; b++) {
      for (let c = 0; c <= 1; c++) {
        const r = fn(a, b, c);
        rows.push({ a, b, c, ...r });
      }
    }
  }
  const keys = Object.keys(rows[0]).filter((k) => !["a", "b", "c"].includes(k));
  return el("div", { class: "card", style: { overflowX: "auto" } }, [
    el("table", { class: "tbl tbl-bordered", style: { width: "auto", margin: "0 auto" } }, [
      el("thead", {}, [
        el("tr", {}, [
          ...inputNames.map((n) => el("th", { text: n })),
          ...keys.map((k, i) => el("th", { html: midLabels[i] || k })),
        ]),
      ]),
      el("tbody", {}, rows.map((r) => el("tr", {}, [
        el("td", { class: "mono", style: { textAlign: "center" }, text: String(r.a) }),
        el("td", { class: "mono", style: { textAlign: "center" }, text: String(r.b) }),
        el("td", { class: "mono", style: { textAlign: "center" }, text: String(r.c) }),
        ...keys.map((k, i) => {
          const isFinal = i === keys.length - 1;
          return el("td", {
            class: "mono",
            style: {
              textAlign: "center",
              fontWeight: isFinal ? "700" : "400",
              background: isFinal ? (r[k] === 1 ? COLORS.logic1Bg : COLORS.logic0Bg) : "transparent",
            },
            text: String(r[k]),
          });
        }),
      ]))),
    ]),
  ]);
}

function labelAt(svg, x, y, str, fill) {
  const t = document.createElementNS("http://www.w3.org/2000/svg", "text");
  t.setAttribute("x", x);
  t.setAttribute("y", y);
  t.setAttribute("font-size", "11");
  t.setAttribute("font-family", "Inter");
  t.setAttribute("fill", fill);
  t.setAttribute("text-anchor", "start");
  t.textContent = str;
  svg.appendChild(t);
}

function junction(svg, x, y) {
  const c = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  c.setAttribute("cx", x);
  c.setAttribute("cy", y);
  c.setAttribute("r", 3);
  c.setAttribute("fill", COLORS.text);
  svg.appendChild(c);
}
