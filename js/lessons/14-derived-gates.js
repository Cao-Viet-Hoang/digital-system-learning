// Lesson 14: Các cổng logic dẫn xuất — NOR, NAND, XOR, XNOR.
import { el, clear } from "../utils/dom.js";
import { section, summary, quizSection, p, splitView, resetSectionCounter } from "../utils/lesson-ui.js";
import { COLORS } from "../utils/colors.js";
import {
  computeGate,
  gatePlayground,
  gateInfoCard,
  truthTableCard,
  drawGate,
  drawWire,
  drawPort,
} from "../utils/gates.js";

export default {
  id: "derived-gates",
  order: 14,
  title: "Cổng logic dẫn xuất – NOR, NAND, XOR, XNOR",
  subtitle: "Mở rộng từ ba cổng cơ bản: thêm phép đảo, thêm phép so sánh.",
  objective:
    "Hiểu được bốn cổng dẫn xuất NAND, NOR, XOR, XNOR — biểu thức Boole, bảng chân trị, mối liên hệ với cổng cơ bản và ứng dụng.",
  render,
};

function render(container) {
  resetSectionCounter();
  clear(container);

  container.appendChild(
    section(
      "Từ ba cổng cơ bản đến cả họ cổng logic",
      p(
        "Ba cổng cơ bản OR, AND, NOT đã đủ để dựng mọi mạch số. Nhưng trong thực tế, người ta thường <em>ghép</em> phép NOT vào ngay sau OR hoặc AND để có cổng <strong>tổ hợp</strong>: NOR và NAND. Ngoài ra, một phép toán đặc biệt – <strong>so sánh khác biệt</strong> – được hiện thực thành cổng XOR và phiên bản đảo của nó là XNOR.",
      ),
      p(
        "Mỗi cổng dẫn xuất chỉ cần <em>một</em> chip thay vì hai (AND + NOT) nên rẻ hơn và chạy nhanh hơn. Đặc biệt NAND và NOR còn có tính chất <em>đa năng</em> mà ta sẽ học ở bài cuối chương.",
      ),
    ),
  );

  // NOR
  container.appendChild(
    section(
      "Phép toán NOR – cổng NOR (= OR + NOT)",
      p(
        "Cổng NOR là cổng OR có gắn thêm vòng tròn đảo ở ngõ ra. Ngõ ra bằng 1 chỉ khi <strong>cả hai</strong> ngõ vào cùng bằng 0 — tức là <em>không có</em> ngõ vào nào ở mức 1.",
      ),
      splitView(gatePlayground("NOR"), gateInfoCard("NOR", "lavender")),
      truthTableCard("NOR"),
      el("div", { class: "alert alert-info", style: { marginTop: "12px" } }, [
        el("strong", { text: "Mối quan hệ: " }),
        el("span", { html: "Y<sub>NOR</sub> = <span class='mono'><span style='text-decoration:overline'>A + B</span></span> = NOT(OR(A, B))." }),
      ]),
    ),
  );

  // NAND
  container.appendChild(
    section(
      "Phép toán NAND – cổng NAND (= AND + NOT)",
      p(
        "Cổng NAND là cổng AND có vòng tròn đảo ở ngõ ra. Ngõ ra bằng 0 chỉ khi <strong>cả hai</strong> ngõ vào cùng bằng 1; trong mọi trường hợp khác, ngõ ra là 1.",
      ),
      splitView(gatePlayground("NAND"), gateInfoCard("NAND", "peach")),
      truthTableCard("NAND"),
      el("div", { class: "alert alert-info", style: { marginTop: "12px" } }, [
        el("strong", { text: "Mối quan hệ: " }),
        el("span", { html: "Y<sub>NAND</sub> = <span class='mono'><span style='text-decoration:overline'>A · B</span></span> = NOT(AND(A, B))." }),
      ]),
    ),
  );

  // XOR
  container.appendChild(
    section(
      "Phép toán EX-OR – cổng XOR",
      p(
        "Cổng XOR (Exclusive-OR) cho ngõ ra bằng 1 khi <strong>chỉ một</strong> trong hai ngõ vào bằng 1, không phải cả hai. Nói cách khác: XOR phát hiện <em>hai ngõ vào khác nhau</em>.",
      ),
      splitView(gatePlayground("XOR"), gateInfoCard("XOR", "sky")),
      truthTableCard("XOR"),
      el("div", { class: "alert alert-info", style: { marginTop: "12px" } }, [
        el("strong", { text: "Ứng dụng: " }),
        el("span", { html: "XOR là trái tim của <em>mạch cộng nhị phân</em>, mạch <em>so sánh</em>, mạch tạo <em>parity bit</em> để phát hiện lỗi truyền dữ liệu, và mạch <em>mã hoá XOR</em> trong mật mã sơ cấp." }),
      ]),
    ),
  );

  // XNOR
  container.appendChild(
    section(
      "Phép toán EX-NOR – cổng XNOR",
      p(
        "Cổng XNOR là cổng XOR có vòng tròn đảo ở ngõ ra. Ngõ ra bằng 1 khi <strong>hai ngõ vào giống nhau</strong> (cùng 0 hoặc cùng 1). Vì vậy XNOR còn gọi là cổng <em>so sánh tương đương</em>.",
      ),
      splitView(gatePlayground("XNOR"), gateInfoCard("XNOR", "butter")),
      truthTableCard("XNOR"),
      el("div", { class: "alert alert-info", style: { marginTop: "12px" } }, [
        el("strong", { text: "Ứng dụng: " }),
        el("span", { text: "XNOR thường dùng trong mạch so sánh số nhiều bit — nếu mỗi cặp bit tương ứng đều bằng nhau (XNOR = 1), thì hai số bằng nhau." }),
      ]),
    ),
  );

  // Comparison table
  container.appendChild(
    section(
      "So sánh bảng chân trị của 4 cổng dẫn xuất",
      p("Đặt cạnh nhau để dễ nhận ra điểm khác biệt:"),
      buildComparisonTable(),
    ),
  );

  // Decomposition: derive NOR/NAND from OR/AND + NOT
  container.appendChild(
    section(
      "Tách cổng dẫn xuất thành cổng cơ bản",
      p(
        "Mỗi cổng dẫn xuất đều có thể vẽ lại bằng tổ hợp các cổng cơ bản. Hình dưới minh hoạ NAND = AND + NOT và NOR = OR + NOT.",
      ),
      el("div", { class: "grid grid-2" }, [
        decompositionCard("NAND", "AND"),
        decompositionCard("NOR", "OR"),
      ]),
    ),
  );

  // XOR-as-formula
  container.appendChild(
    section(
      "XOR biểu diễn qua các cổng cơ bản",
      p(
        "XOR không có ký hiệu riêng trong mạch điện ban đầu — nó được dựng từ tổ hợp AND, OR, NOT. Biểu thức:",
      ),
      el("div", { class: "card mono", style: { textAlign: "center", fontSize: "18px" } }, [
        el("span", { html: "Y = A ⊕ B = A·<span style='text-decoration:overline'>B</span> + <span style='text-decoration:overline'>A</span>·B" }),
      ]),
      p(
        "Diễn giải: <em>(A bằng 1 và B bằng 0)</em> hoặc <em>(A bằng 0 và B bằng 1)</em> — chính là <strong>một và chỉ một</strong> trong hai bằng 1.",
      ),
    ),
  );

  container.appendChild(
    quizSection("derived-gates", [
      {
        prompt: "Cổng <strong>NAND</strong> 2 ngõ vào có A = 1, B = 1. Y bằng?",
        options: [{ label: "0" }, { label: "1" }],
        answer: 0,
        hint: "NAND = NOT(AND).",
        explanation: "AND(1, 1) = 1 → NAND = 0.",
      },
      {
        prompt: "Cổng <strong>NOR</strong> có A = 0, B = 0. Y bằng?",
        options: [{ label: "0" }, { label: "1" }],
        answer: 1,
        hint: "NOR = NOT(OR).",
        explanation: "OR(0, 0) = 0 → NOR = 1.",
      },
      {
        prompt: "Cổng <strong>XOR</strong> có A = 1, B = 1. Y bằng?",
        options: [{ label: "0" }, { label: "1" }],
        answer: 0,
        hint: "XOR = 1 chỉ khi hai ngõ vào khác nhau.",
        explanation: "1 và 1 giống nhau → XOR = 0.",
      },
      {
        prompt: "Cổng nào cho ngõ ra 1 khi <em>hai ngõ vào giống nhau</em>?",
        options: [{ label: "XOR" }, { label: "XNOR" }, { label: "NAND" }, { label: "NOR" }],
        answer: 1,
        hint: "Đảo của XOR.",
        explanation: "XNOR bằng 1 khi A = B (cả hai cùng 0 hoặc cùng 1).",
      },
      {
        prompt: "Biểu thức nào tương đương với XOR?",
        options: [
          { label: "A · B + <span style='text-decoration:overline'>A</span> · <span style='text-decoration:overline'>B</span>" },
          { label: "A · <span style='text-decoration:overline'>B</span> + <span style='text-decoration:overline'>A</span> · B" },
          { label: "A + B" },
          { label: "<span style='text-decoration:overline'>A + B</span>" },
        ],
        answer: 1,
        hint: "XOR = 1 khi chỉ một trong hai bằng 1.",
        explanation: "A·<span style='text-decoration:overline'>B</span> + <span style='text-decoration:overline'>A</span>·B đúng định nghĩa XOR. A·B + <span style='text-decoration:overline'>A</span>·<span style='text-decoration:overline'>B</span> là XNOR.",
      },
      {
        prompt: "Cổng NAND khác cổng AND ở điểm nào trên ký hiệu?",
        options: [
          { label: "Có vòng tròn nhỏ ở ngõ ra (bubble)" },
          { label: "Có dấu chéo trên thân cổng" },
          { label: "Đảo chiều hình dáng" },
          { label: "Không khác — chỉ khác tên" },
        ],
        answer: 0,
        hint: "Vòng tròn = phép đảo.",
        explanation: "Vòng tròn nhỏ ở ngõ ra biểu thị phép NOT được áp dụng sau AND.",
      },
    ]),
  );

  container.appendChild(
    section(
      "Tóm tắt",
      summary(null, [
        "<strong>NAND</strong> = NOT(AND): Y = 0 chỉ khi mọi ngõ vào = 1.",
        "<strong>NOR</strong> = NOT(OR): Y = 1 chỉ khi mọi ngõ vào = 0.",
        "<strong>XOR</strong>: Y = 1 khi hai ngõ vào <em>khác nhau</em>; là cơ sở của mạch cộng nhị phân.",
        "<strong>XNOR</strong>: Y = 1 khi hai ngõ vào <em>giống nhau</em>; là cơ sở của mạch so sánh.",
        "Ký hiệu: thêm <em>vòng tròn ở ngõ ra</em> nghĩa là có thêm phép đảo.",
      ]),
    ),
  );
}

function buildComparisonTable() {
  const rows = [];
  for (let a = 0; a <= 1; a++) {
    for (let b = 0; b <= 1; b++) {
      rows.push([
        a, b,
        computeGate("NAND", a, b),
        computeGate("NOR", a, b),
        computeGate("XOR", a, b),
        computeGate("XNOR", a, b),
      ]);
    }
  }
  return el("div", { class: "card", style: { overflowX: "auto" } }, [
    el("table", { class: "tbl tbl-bordered", style: { width: "auto", margin: "0 auto" } }, [
      el("thead", {}, [
        el("tr", {}, [
          el("th", { text: "A" }),
          el("th", { text: "B" }),
          el("th", { text: "NAND" }),
          el("th", { text: "NOR" }),
          el("th", { text: "XOR" }),
          el("th", { text: "XNOR" }),
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
  ]);
}

// Show decomposition: base gate -> NOT -> derived output, all interactive.
function decompositionCard(derived, base) {
  const card = el("div", { class: "card" });
  card.appendChild(el("h4", { text: `${derived} = ${base} + NOT`, style: { marginTop: 0 } }));

  const SVG_NS = "http://www.w3.org/2000/svg";
  const W = 360, H = 140;
  const svg = document.createElementNS(SVG_NS, "svg");
  svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
  svg.style.width = "100%";
  svg.style.maxHeight = "160px";

  const state = { a: 0, b: 0 };
  function rerender() {
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    const mid = computeGate(base, state.a, state.b);
    const out = computeGate(derived, state.a, state.b);

    const baseG = drawGate(svg, base, 110, 50, { scale: 1 });
    // Position NOT so its input aligns horizontally with base's output.
    const notG = drawGate(svg, "NOT", 200, baseG.out.y - 20, { scale: 1 });

    // Input wires — straight horizontal from ports aligned to gate inputs.
    drawWire(svg, [{ x: 40, y: baseG.inA.y }, { x: baseG.inA.x, y: baseG.inA.y }], state.a);
    drawWire(svg, [{ x: 40, y: baseG.inB.y }, { x: baseG.inB.x, y: baseG.inB.y }], state.b);
    drawWire(svg, [{ x: baseG.out.x, y: baseG.out.y }, { x: notG.inA.x, y: notG.inA.y }], mid);
    drawWire(svg, [{ x: notG.out.x, y: notG.out.y }, { x: 330, y: notG.out.y }], out);

    const aPort = drawPort(svg, 40, baseG.inA.y, "A", state.a);
    const bPort = drawPort(svg, 40, baseG.inB.y, "B", state.b);
    aPort.style.cursor = "pointer";
    bPort.style.cursor = "pointer";
    aPort.addEventListener("click", () => { state.a ^= 1; rerender(); });
    bPort.addEventListener("click", () => { state.b ^= 1; rerender(); });
    drawPort(svg, 330, notG.out.y, "Y", out);

    // Intermediate label
    const t = document.createElementNS(SVG_NS, "text");
    t.setAttribute("x", (baseG.out.x + notG.inA.x) / 2);
    t.setAttribute("y", baseG.out.y - 6);
    t.setAttribute("font-size", "11");
    t.setAttribute("font-family", "Inter");
    t.setAttribute("fill", COLORS.text2);
    t.setAttribute("text-anchor", "middle");
    t.textContent = `${mid}`;
    svg.appendChild(t);
  }

  card.appendChild(svg);
  card.appendChild(el("div", { class: "small text-2", style: { textAlign: "center" }, text: "Bấm A/B để xem trung gian (sau base) bị đảo." }));
  rerender();
  return card;
}
