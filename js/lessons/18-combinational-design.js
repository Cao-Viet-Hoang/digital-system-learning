// Lesson 18: Quy trình thiết kế mạch tổ hợp.
import { el, clear } from "../utils/dom.js";
import { section, summary, quizSection, p, splitView, resetSectionCounter } from "../utils/lesson-ui.js";
import { COLORS } from "../utils/colors.js";
import { drawGate, drawWire, drawPort, computeGate } from "../utils/gates.js";

const ov = (t) => `<span style="text-decoration:overline">${t}</span>`;

export default {
  id: "combinational-design",
  order: 18,
  title: "Thiết kế mạch tổ hợp",
  subtitle: "Từ phát biểu bài toán → bảng chân trị → biểu thức → sơ đồ mạch.",
  objective:
    "Hiểu khái niệm mạch tổ hợp; nắm 5 bước thiết kế chuẩn; biết viết biểu thức dạng SOP và POS chuẩn từ bảng chân trị; áp dụng trên ví dụ mạch biểu quyết 3 ngõ vào.",
  render,
};

function render(container) {
  resetSectionCounter();
  clear(container);

  container.appendChild(
    section(
      "Mạch tổ hợp là gì?",
      p(
        "Một <strong>mạch tổ hợp</strong> (combinational circuit) là mạch mà <em>ngõ ra chỉ phụ thuộc vào ngõ vào hiện tại</em>, không có bộ nhớ và không nhớ trạng thái trước đó. Các mạch ta đã gặp — cổng AND, OR, NOT, XOR, bộ cộng nửa, bộ chọn dữ liệu — đều là mạch tổ hợp.",
      ),
      p(
        "Ngược lại, <em>mạch tuần tự</em> (sequential circuit) như flip-flop, thanh ghi, bộ đếm có chứa bộ nhớ và sẽ học sau. Bài này tập trung vào <strong>quy trình thiết kế</strong> chuẩn cho mạch tổ hợp.",
      ),
      el("div", { class: "alert alert-info", style: { marginTop: "8px" } }, [
        el("strong", { text: "Mục tiêu của thiết kế: " }),
        el("span", { text: "với một bài toán logic cho trước, tạo ra mạch có số cổng ít nhất nhưng vẫn cho đúng ngõ ra ở mọi tổ hợp ngõ vào." }),
      ]),
    ),
  );

  container.appendChild(
    section(
      "Năm bước thiết kế chuẩn",
      el("div", { class: "card", style: { padding: "16px" } }, [
        el("ol", { style: { lineHeight: "1.9", margin: 0, paddingLeft: "20px" } }, [
          el("li", { html: "<strong>Bước 1 — Phân tích bài toán.</strong> Liệt kê các tín hiệu ngõ vào, ngõ ra, và mô tả khi nào ngõ ra bằng 1." }),
          el("li", { html: "<strong>Bước 2 — Lập bảng chân trị.</strong> Liệt kê tất cả 2<sup>n</sup> tổ hợp ngõ vào; điền giá trị ngõ ra cho từng hàng." }),
          el("li", { html: "<strong>Bước 3 — Viết biểu thức Boole.</strong> Từ bảng, viết dạng <em>chuẩn SOP</em> (tổng các tích) hoặc <em>chuẩn POS</em> (tích các tổng)." }),
          el("li", { html: "<strong>Bước 4 — Đơn giản biểu thức.</strong> Dùng đại số Boole hoặc bìa Karnaugh để giảm số cổng (sẽ học chi tiết ở bài tiếp)." }),
          el("li", { html: "<strong>Bước 5 — Vẽ mạch.</strong> Triển khai biểu thức đã đơn giản bằng cổng logic; có thể chuyển sang một loại cổng duy nhất (NAND/NOR) nếu yêu cầu." }),
        ]),
      ]),
    ),
  );

  // SOP and POS canonical forms
  container.appendChild(
    section(
      "Hai dạng chuẩn của biểu thức Boole",
      p(
        "Từ bảng chân trị, ta có hai cách máy móc để viết biểu thức — luôn đúng nhưng thường chưa tối ưu:",
      ),
      el("div", { class: "grid grid-2" }, [
        el("div", { class: "card card-soft-mint" }, [
          el("h3", { text: "Dạng SOP chuẩn — Sum of Products", style: { marginTop: 0 } }),
          el("p", { html: "Xét <em>các hàng có Y = 1</em>. Mỗi hàng tạo ra một <strong>minterm</strong> (số hạng tích) gồm tất cả biến — biến = 1 giữ nguyên, biến = 0 lấy bù. Cộng (OR) các minterm lại." }),
          el("p", { class: "small text-2", html: "Ví dụ hàng A=1, B=0, C=1 → minterm <span class='mono'>A·" + ov("B") + "·C</span>." }),
        ]),
        el("div", { class: "card card-soft-sky" }, [
          el("h3", { text: "Dạng POS chuẩn — Product of Sums", style: { marginTop: 0 } }),
          el("p", { html: "Xét <em>các hàng có Y = 0</em>. Mỗi hàng tạo ra một <strong>maxterm</strong> (số hạng tổng) — biến = 0 giữ nguyên, biến = 1 lấy bù. Nhân (AND) các maxterm lại." }),
          el("p", { class: "small text-2", html: "Ví dụ hàng A=1, B=0, C=1 → maxterm <span class='mono'>(" + ov("A") + " + B + " + ov("C") + ")</span>." }),
        ]),
      ]),
      el("div", { class: "alert alert-info", style: { marginTop: "10px" } }, [
        el("strong", { text: "Mẹo nhớ quy tắc đảo: " }),
        el("span", { html: "SOP nhìn hàng <span class='mono'>1</span> — biến 0 thì <em>đảo</em>. POS nhìn hàng <span class='mono'>0</span> — biến 1 thì <em>đảo</em>. Hai dạng này luôn cho ngõ ra giống nhau." }),
      ]),
    ),
  );

  // Worked example — majority voter
  container.appendChild(
    section(
      "Ví dụ thiết kế – Mạch biểu quyết 3 ngõ vào",
      p(
        "<strong>Đề bài:</strong> Một uỷ ban có 3 thành viên A, B, C. Mỗi người bỏ phiếu 1 (đồng ý) hoặc 0 (phản đối). Quyết định Y = 1 khi <em>đa số</em> đồng ý (ít nhất 2 trong 3).",
      ),
      p("<strong>Bước 1 — Phân tích:</strong> 3 ngõ vào A, B, C; 1 ngõ ra Y; Y = 1 khi số ngõ vào bằng 1 ≥ 2."),
      p("<strong>Bước 2 — Bảng chân trị:</strong>"),
      majorityTable(),
      p("<strong>Bước 3 — Biểu thức dạng SOP chuẩn:</strong> liệt kê 4 hàng có Y = 1:"),
      el("div", { class: "card mono", style: { padding: "14px", lineHeight: "1.8", fontSize: "14px" } }, [
        el("div", { html: "Y = " + ov("A") + "·B·C + A·" + ov("B") + "·C + A·B·" + ov("C") + " + A·B·C" }),
        el("div", { class: "small text-3", style: { marginTop: "4px" }, text: "(4 minterm — mỗi hàng Y=1 đóng góp một số hạng)" }),
      ]),
      p("<strong>Bước 4 — Đơn giản (dùng đại số Boole):</strong>"),
      el("div", { class: "card mono", style: { padding: "14px", lineHeight: "1.9", fontSize: "14px" } }, [
        el("div", { html: "Y = " + ov("A") + "·B·C + A·" + ov("B") + "·C + A·B·" + ov("C") + " + A·B·C" }),
        el("div", { html: "&nbsp;&nbsp;= " + ov("A") + "·B·C + A·B·C &nbsp;+&nbsp; A·" + ov("B") + "·C + A·B·C &nbsp;+&nbsp; A·B·" + ov("C") + " + A·B·C  <span class='small text-3'>// nhân đôi A·B·C (idempotent)</span>" }),
        el("div", { html: "&nbsp;&nbsp;= B·C·(" + ov("A") + " + A) + A·C·(" + ov("B") + " + B) + A·B·(" + ov("C") + " + C)  <span class='small text-3'>// phân phối ngược</span>" }),
        el("div", { html: "&nbsp;&nbsp;= B·C + A·C + A·B  <span class='small text-3'>// bù: X + " + ov("X") + " = 1</span>" }),
        el("div", { style: { marginTop: "8px", borderTop: `1px dashed ${COLORS.border}`, paddingTop: "8px" } }, [
          el("strong", { html: "Y = A·B + B·C + A·C" }),
          el("span", { class: "small text-3", text: "  (từ 12 cổng → 4 cổng)" }),
        ]),
      ]),
      p("<strong>Bước 5 — Vẽ mạch đã đơn giản:</strong> ba cổng AND đưa vào một cổng OR. Bấm các ngõ vào để kiểm tra."),
      majorityCircuit(),
    ),
  );

  // Comparison SOP vs POS
  container.appendChild(
    section(
      "So sánh SOP và POS cho cùng bài toán",
      p(
        "Cùng mạch biểu quyết, viết theo POS chuẩn (nhìn 4 hàng Y = 0):",
      ),
      el("div", { class: "card mono", style: { padding: "14px", lineHeight: "1.8", fontSize: "14px" } }, [
        el("div", { html: "Y = (A + B + C) · (A + B + " + ov("C") + ") · (A + " + ov("B") + " + C) · (" + ov("A") + " + B + C)" }),
        el("div", { class: "small text-3", style: { marginTop: "4px" }, text: "(4 maxterm — mỗi hàng Y=0 đóng góp một thừa số)" }),
      ]),
      p(
        "Sau khi đơn giản, dạng POS rút lại thành <span class='mono'>Y = (A + B)·(B + C)·(A + C)</span>. Hai biểu thức SOP và POS cho cùng bảng chân trị nhưng <em>cấu trúc cổng khác nhau</em> — SOP dùng AND-OR, POS dùng OR-AND. Tuỳ công nghệ và mạch khả dụng mà ta chọn dạng nào để hiện thực.",
      ),
    ),
  );

  // Why simplify
  container.appendChild(
    section(
      "Vì sao bước đơn giản hoá lại quan trọng?",
      el("div", { class: "grid grid-2" }, [
        el("div", { class: "card card-soft-peach" }, [
          el("h3", { text: "Tiết kiệm cổng", style: { marginTop: 0 } }),
          el("p", { text: "Ít cổng hơn → ít transistor hơn → chip nhỏ hơn, rẻ hơn, tiêu thụ điện ít hơn." }),
        ]),
        el("div", { class: "card card-soft-lavender" }, [
          el("h3", { text: "Tốc độ cao hơn", style: { marginTop: 0 } }),
          el("p", { text: "Tín hiệu đi qua ít tầng cổng hơn → trễ truyền ngắn → mạch chạy ở xung nhịp cao hơn." }),
        ]),
        el("div", { class: "card card-soft-mint" }, [
          el("h3", { text: "Dễ kiểm tra lỗi", style: { marginTop: 0 } }),
          el("p", { text: "Sơ đồ đơn giản dễ debug, dễ viết test, dễ bảo trì khi yêu cầu thay đổi." }),
        ]),
        el("div", { class: "card card-soft-sky" }, [
          el("h3", { text: "Bìa Karnaugh — bài tiếp theo", style: { marginTop: 0 } }),
          el("p", { html: "Với hàm 3-4 biến, biến đổi đại số bằng tay dễ sai. <strong>Bìa Karnaugh</strong> là công cụ trực quan giúp rút gọn nhanh, chính xác — và đó là chủ đề chính của ba bài kế tiếp." }),
        ]),
      ]),
    ),
  );

  container.appendChild(
    quizSection("combinational-design", [
      {
        prompt: "Đặc điểm phân biệt mạch tổ hợp với mạch tuần tự là gì?",
        options: [
          { label: "Có nhiều cổng AND" },
          { label: "Ngõ ra chỉ phụ thuộc ngõ vào hiện tại, không có bộ nhớ" },
          { label: "Luôn dùng cổng NAND" },
          { label: "Có ít nhất ba ngõ vào" },
        ],
        answer: 1,
        hint: "Mạch tuần tự có flip-flop — có bộ nhớ.",
        explanation: "Mạch tổ hợp không nhớ trạng thái trước; ngõ ra hoàn toàn xác định bởi ngõ vào hiện tại.",
      },
      {
        prompt: "Bước nào dưới đây <em>không</em> thuộc quy trình thiết kế mạch tổ hợp chuẩn?",
        options: [
          { label: "Lập bảng chân trị" },
          { label: "Viết biểu thức Boole dạng chuẩn" },
          { label: "Đo điện áp ngõ ra" },
          { label: "Đơn giản hoá biểu thức" },
        ],
        answer: 2,
        hint: "Đo điện áp là việc của kiểm thử phần cứng, không phải bước thiết kế logic.",
        explanation: "Năm bước: phân tích → bảng chân trị → biểu thức → đơn giản → vẽ mạch.",
      },
      {
        prompt: "Trong dạng SOP chuẩn, mỗi minterm được lấy từ hàng nào của bảng chân trị?",
        options: [
          { label: "Hàng có Y = 0" },
          { label: "Hàng có Y = 1" },
          { label: "Hàng đầu tiên" },
          { label: "Hàng mà tổng A + B + C nhỏ nhất" },
        ],
        answer: 1,
        hint: "SOP = Sum of Products → cộng các minterm.",
        explanation: "Mỗi hàng Y = 1 tạo một minterm; OR các minterm lại được biểu thức.",
      },
      {
        prompt: "Trong dạng SOP chuẩn, biến có giá trị 0 trong hàng tương ứng sẽ:",
        options: [
          { label: "Bị loại khỏi minterm" },
          { label: "Xuất hiện ở dạng phủ định (đảo)" },
          { label: "Xuất hiện ở dạng nguyên" },
          { label: "Được nhân với 0" },
        ],
        answer: 1,
        hint: `A = 0 → ${ov("A")} trong minterm.`,
        explanation: "Biến 0 lấy bù, biến 1 giữ nguyên — vì minterm phải bằng 1 ở chính hàng đó.",
      },
      {
        prompt: "Mạch biểu quyết 3 ngõ vào (đa số) sau khi rút gọn cần bao nhiêu cổng?",
        options: [
          { label: "1 cổng AND" },
          { label: "3 cổng AND + 1 cổng OR" },
          { label: "4 cổng AND + 1 cổng OR" },
          { label: "12 cổng AND + 1 cổng OR" },
        ],
        answer: 1,
        hint: "Y = A·B + B·C + A·C.",
        explanation: "Ba tích hai biến qua cổng AND, kết hợp bằng một OR — tổng 4 cổng.",
      },
      {
        prompt: "Vì sao thường nên đơn giản hoá biểu thức trước khi vẽ mạch?",
        options: [
          { label: "Để dễ vẽ trên giấy hơn" },
          { label: "Để giảm số cổng — chip rẻ hơn, nhanh hơn, ít tiêu thụ điện hơn" },
          { label: "Để bảng chân trị có ít hàng hơn" },
          { label: "Để tránh dùng cổng NOT" },
        ],
        answer: 1,
        hint: "Mục tiêu chính của thiết kế tối ưu.",
        explanation: "Ít cổng → chi phí phần cứng thấp, trễ truyền nhỏ, công suất tiêu thụ thấp.",
      },
    ]),
  );

  container.appendChild(
    section(
      "Tóm tắt",
      summary(null, [
        "<strong>Mạch tổ hợp</strong>: ngõ ra chỉ phụ thuộc ngõ vào hiện tại — không nhớ.",
        "Quy trình 5 bước: <em>phân tích → bảng chân trị → biểu thức → đơn giản → vẽ mạch</em>.",
        "<strong>SOP chuẩn</strong>: cộng các minterm (hàng Y = 1), biến 0 thì lấy bù.",
        "<strong>POS chuẩn</strong>: nhân các maxterm (hàng Y = 0), biến 1 thì lấy bù.",
        "Đơn giản hoá giúp giảm số cổng → mạch rẻ hơn, nhanh hơn, ít lỗi hơn.",
        "Công cụ trực quan để đơn giản nhanh là <strong>bìa Karnaugh</strong> — sẽ học chi tiết ở bài tiếp.",
      ]),
    ),
  );
}

// Truth table for the 3-input majority function.
function majorityTable() {
  const rows = [];
  for (let a = 0; a <= 1; a++) {
    for (let b = 0; b <= 1; b++) {
      for (let c = 0; c <= 1; c++) {
        const sum = a + b + c;
        const y = sum >= 2 ? 1 : 0;
        rows.push({ a, b, c, y });
      }
    }
  }
  return el("div", { class: "card", style: { overflowX: "auto" } }, [
    el("table", { class: "tbl tbl-bordered", style: { width: "auto", margin: "0 auto" } }, [
      el("thead", {}, [
        el("tr", {}, [
          el("th", { text: "Hàng" }),
          el("th", { text: "A" }),
          el("th", { text: "B" }),
          el("th", { text: "C" }),
          el("th", { text: "Y" }),
          el("th", { text: "Minterm (nếu Y = 1)" }),
        ]),
      ]),
      el("tbody", {}, rows.map((r, i) => {
        const term = mintermStr(r.a, r.b, r.c);
        return el("tr", {}, [
          el("td", { class: "mono", style: { textAlign: "center" }, text: String(i) }),
          el("td", { class: "mono", style: { textAlign: "center" }, text: String(r.a) }),
          el("td", { class: "mono", style: { textAlign: "center" }, text: String(r.b) }),
          el("td", { class: "mono", style: { textAlign: "center" }, text: String(r.c) }),
          el("td", {
            class: "mono",
            style: {
              textAlign: "center",
              background: r.y === 1 ? COLORS.logic1Bg : COLORS.logic0Bg,
              fontWeight: "700",
            },
            text: String(r.y),
          }),
          el("td", { class: "mono", style: { textAlign: "center" }, html: r.y === 1 ? term : "—" }),
        ]);
      })),
    ]),
  ]);
}

function mintermStr(a, b, c) {
  const A = a ? "A" : ov("A");
  const B = b ? "B" : ov("B");
  const C = c ? "C" : ov("C");
  return `${A}·${B}·${C}`;
}

// Interactive: Y = A·B + B·C + A·C (3-input majority).
function majorityCircuit() {
  const card = el("div", { class: "card" });
  card.appendChild(el("div", { class: "small text-2", style: { textAlign: "center", marginBottom: "8px" }, text: "Bấm A, B, C để kiểm tra — Y phải bằng 1 khi ít nhất 2 trong 3 bằng 1" }));

  const SVG_NS = "http://www.w3.org/2000/svg";
  const W = 520, H = 280;
  const svg = document.createElementNS(SVG_NS, "svg");
  svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
  svg.style.width = "100%";
  svg.style.maxHeight = "320px";

  const state = { a: 0, b: 0, c: 0 };

  function rerender() {
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    const AB = computeGate("AND", state.a, state.b);
    const BC = computeGate("AND", state.b, state.c);
    const AC = computeGate("AND", state.a, state.c);
    const Y = computeGate("OR", AB, computeGate("OR", BC, AC));

    // Three AND gates stacked.
    const andAB = drawGate(svg, "AND", 220, 30, { scale: 1 });
    const andBC = drawGate(svg, "AND", 220, 110, { scale: 1 });
    const andAC = drawGate(svg, "AND", 220, 190, { scale: 1 });
    // OR gate combining all three — use 3-input shape by stacking a wider OR.
    const orG = drawGate(svg, "OR", 380, 110, { scale: 1.5 });

    // Bus lines for A, B, C on the left.
    const aBusX = 90, bBusX = 110, cBusX = 130;
    const aPortY = 30, bPortY = 130, cPortY = 230;

    // Vertical buses.
    drawWire(svg, [{ x: aBusX, y: aPortY }, { x: aBusX, y: andAC.inA.y }], state.a);
    drawWire(svg, [{ x: bBusX, y: bPortY }, { x: bBusX, y: andBC.inA.y }], state.b);
    drawWire(svg, [{ x: cBusX, y: cPortY }, { x: cBusX, y: andBC.inB.y }], state.c);

    // A → andAB.inA  and andAC.inA
    drawWire(svg, [{ x: aBusX, y: andAB.inA.y }, { x: andAB.inA.x, y: andAB.inA.y }], state.a);
    drawWire(svg, [{ x: aBusX, y: andAC.inA.y }, { x: andAC.inA.x, y: andAC.inA.y }], state.a);
    junction(svg, aBusX, andAB.inA.y);
    junction(svg, aBusX, andAC.inA.y);

    // B → andAB.inB and andBC.inA
    drawWire(svg, [{ x: bBusX, y: andAB.inB.y }, { x: andAB.inB.x, y: andAB.inB.y }], state.b);
    drawWire(svg, [{ x: bBusX, y: andBC.inA.y }, { x: andBC.inA.x, y: andBC.inA.y }], state.b);
    junction(svg, bBusX, andAB.inB.y);
    junction(svg, bBusX, andBC.inA.y);

    // C → andBC.inB and andAC.inB
    drawWire(svg, [{ x: cBusX, y: andBC.inB.y }, { x: andBC.inB.x, y: andBC.inB.y }], state.c);
    drawWire(svg, [{ x: cBusX, y: andAC.inB.y }, { x: andAC.inB.x, y: andAC.inB.y }], state.c);
    junction(svg, cBusX, andBC.inB.y);
    junction(svg, cBusX, andAC.inB.y);

    // AND outputs → OR inputs (the OR has only 2 inputs in our shape; we fan in via two-step approach).
    // We'll fake a 3-input OR visually by routing all three lines into a band slightly inside the OR's mouth.
    const orMidY = orG.inA.y + (orG.inB.y - orG.inA.y) / 2;
    const bendX = orG.inA.x - 18;
    drawWire(svg, [
      { x: andAB.out.x, y: andAB.out.y },
      { x: bendX, y: andAB.out.y },
      { x: bendX, y: orG.inA.y },
      { x: orG.inA.x, y: orG.inA.y },
    ], AB);
    drawWire(svg, [
      { x: andBC.out.x, y: andBC.out.y },
      { x: bendX - 6, y: andBC.out.y },
      { x: bendX - 6, y: orMidY },
      { x: orG.inA.x + 4, y: orMidY },
    ], BC);
    drawWire(svg, [
      { x: andAC.out.x, y: andAC.out.y },
      { x: bendX, y: andAC.out.y },
      { x: bendX, y: orG.inB.y },
      { x: orG.inB.x, y: orG.inB.y },
    ], AC);

    drawWire(svg, [{ x: orG.out.x, y: orG.out.y }, { x: 500, y: orG.out.y }], Y);

    // Term labels.
    labelAt(svg, andAB.out.x + 4, andAB.out.y - 6, `A·B = ${AB}`, COLORS.text2);
    labelAt(svg, andBC.out.x + 4, andBC.out.y - 6, `B·C = ${BC}`, COLORS.text2);
    labelAt(svg, andAC.out.x + 4, andAC.out.y - 6, `A·C = ${AC}`, COLORS.text2);

    const a = drawPort(svg, aBusX, aPortY, "A", state.a);
    const b = drawPort(svg, bBusX, bPortY, "B", state.b);
    const c = drawPort(svg, cBusX, cPortY, "C", state.c);
    [a, b, c].forEach((n) => n.style.cursor = "pointer");
    a.addEventListener("click", () => { state.a ^= 1; rerender(); });
    b.addEventListener("click", () => { state.b ^= 1; rerender(); });
    c.addEventListener("click", () => { state.c ^= 1; rerender(); });
    drawPort(svg, 500, orG.out.y, "Y", Y);
  }

  card.appendChild(svg);
  rerender();
  return card;
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
