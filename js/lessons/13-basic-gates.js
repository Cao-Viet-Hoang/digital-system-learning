// Lesson 13: Các cổng logic cơ bản — OR, AND, NOT.
import { el, clear } from "../utils/dom.js";
import { section, summary, quizSection, p, splitView, resetSectionCounter } from "../utils/lesson-ui.js";
import { COLORS } from "../utils/colors.js";
import { computeGate, gatePlayground, gateInfoCard, truthTableCard } from "../utils/gates.js";

export default {
  id: "basic-gates",
  order: 13,
  title: "Cổng logic cơ bản – OR, AND, NOT",
  subtitle: "Ba viên gạch nền tảng để xây mọi mạch số.",
  objective:
    "Hiểu được phép toán OR, AND, NOT; đọc và viết bảng chân trị; dự đoán ngõ ra của một cổng khi biết ngõ vào.",
  render,
};

function render(container) {
  resetSectionCounter();
  clear(container);

  container.appendChild(
    section(
      "Từ điện áp đến phép toán logic",
      p(
        "Ở các bài trước, ta biết mạch số chỉ làm việc với hai mức điện áp — gọi là <strong>logic 0</strong> và <strong>logic 1</strong>. Một <em>cổng logic</em> (logic gate) là mạch điện nhỏ nhất nhận một hoặc hai mức logic ở ngõ vào và sinh ra một mức logic ở ngõ ra theo một <em>quy tắc cố định</em>.",
      ),
      p(
        "Mọi vi xử lý, bộ nhớ và mạch điều khiển đều được dựng từ tổ hợp ba cổng nền tảng: <strong>OR</strong>, <strong>AND</strong>, <strong>NOT</strong>. Trong bài này, ta sẽ làm quen với cả ba: ký hiệu, biểu thức Boole, bảng chân trị và mạch điện minh hoạ.",
      ),
    ),
  );

  // OR gate
  container.appendChild(
    section(
      "Phép toán OR – cổng OR",
      p(
        "Cổng OR cho ngõ ra bằng 1 khi <strong>ít nhất một</strong> ngõ vào bằng 1. Tưởng tượng hai công tắc mắc <em>song song</em> nối với bóng đèn — đèn sáng nếu bất kỳ công tắch nào được bật.",
      ),
      splitView(
        gatePlayground("OR"),
        gateInfoCard("OR"),
      ),
      truthTableCard("OR"),
    ),
  );

  // AND gate
  container.appendChild(
    section(
      "Phép toán AND – cổng AND",
      p(
        "Cổng AND cho ngõ ra bằng 1 chỉ khi <strong>tất cả</strong> ngõ vào bằng 1. Tưởng tượng hai công tắc mắc <em>nối tiếp</em> — đèn chỉ sáng khi cả hai cùng bật.",
      ),
      splitView(
        gatePlayground("AND"),
        gateInfoCard("AND"),
      ),
      truthTableCard("AND"),
    ),
  );

  // NOT gate
  container.appendChild(
    section(
      "Phép toán NOT – cổng NOT (INVERTER)",
      p(
        "Cổng NOT chỉ có <strong>một ngõ vào</strong> và <strong>một ngõ ra</strong>. Nó <em>đảo trạng thái</em>: 0 thành 1, 1 thành 0. Ký hiệu là một dấu gạch ngang trên biến (A̅) hoặc dấu nháy đơn (A').",
      ),
      splitView(
        gatePlayground("NOT"),
        gateInfoCard("NOT"),
      ),
      truthTableCard("NOT"),
    ),
  );

  // Real-world analogy
  container.appendChild(
    section(
      "Ví dụ thực tế – công tắc và bóng đèn",
      p(
        "Cách dễ nhất để hình dung OR và AND là dùng mạch điện công tắc. Mỗi công tắc đại diện cho một biến: <em>đóng</em> = 1, <em>mở</em> = 0. Bóng đèn sáng đại diện cho ngõ ra Y = 1.",
      ),
      el("div", { class: "grid grid-2" }, [
        switchCircuitCard("OR"),
        switchCircuitCard("AND"),
      ]),
    ),
  );

  // Multi-input note
  container.appendChild(
    section(
      "Cổng nhiều ngõ vào",
      p(
        "OR và AND không bị giới hạn ở hai ngõ vào — cổng <strong>AND 3 ngõ vào</strong>, <strong>OR 4 ngõ vào</strong>... đều tồn tại. Quy tắc vẫn giữ nguyên: AND nhiều ngõ vào cho 1 khi <em>mọi</em> ngõ vào bằng 1; OR nhiều ngõ vào cho 1 khi <em>có ít nhất một</em> ngõ vào bằng 1.",
      ),
      el("div", { class: "alert alert-info" }, [
        el("strong", { text: "Mẹo nhớ: " }),
        el("span", {
          html: "OR giống phép cộng (+), AND giống phép nhân (·). Trong đại số Boole: <code>0 + 0 = 0, 0 + 1 = 1, 1 + 1 = 1</code> và <code>0 · 0 = 0, 0 · 1 = 0, 1 · 1 = 1</code>.",
        }),
      ]),
    ),
  );

  container.appendChild(
    quizSection("basic-gates", [
      {
        prompt: "Cổng <strong>AND</strong> 2 ngõ vào có A = 1, B = 0. Ngõ ra Y bằng?",
        options: [{ label: "0" }, { label: "1" }, { label: "Không xác định" }],
        answer: 0,
        hint: "AND chỉ cho 1 khi tất cả ngõ vào bằng 1.",
        explanation: "1 · 0 = 0 → Y = 0.",
      },
      {
        prompt: "Cổng <strong>OR</strong> 3 ngõ vào có A = 0, B = 0, C = 1. Y bằng?",
        options: [{ label: "0" }, { label: "1" }, { label: "Tuỳ thuộc thứ tự" }],
        answer: 1,
        hint: "OR cho 1 khi có ít nhất một ngõ vào bằng 1.",
        explanation: "0 + 0 + 1 = 1 → Y = 1.",
      },
      {
        prompt: "Cổng <strong>NOT</strong> có ngõ vào A = 1. Ngõ ra Y bằng?",
        options: [{ label: "0" }, { label: "1" }, { label: "Vẫn là 1" }],
        answer: 0,
        hint: "NOT đảo trạng thái.",
        explanation: "Y = A̅ = 1̅ = 0.",
      },
      {
        prompt: "Biểu thức Boole nào sau đây <em>không đúng</em>?",
        options: [
          { label: "1 + 1 = 1 (OR)" },
          { label: "1 · 1 = 1 (AND)" },
          { label: "1 + 1 = 2 (OR)" },
          { label: "0 · 1 = 0 (AND)" },
        ],
        answer: 2,
        hint: "Đại số Boole chỉ có hai giá trị: 0 và 1.",
        explanation: "Trong đại số Boole, OR là phép logic, không phải phép cộng số học. 1 + 1 = 1.",
      },
      {
        prompt: "Trong mạch công tắc, hai công tắc mắc <strong>nối tiếp</strong> với bóng đèn tương ứng với cổng nào?",
        options: [{ label: "OR" }, { label: "AND" }, { label: "NOT" }],
        answer: 1,
        hint: "Nối tiếp = cả hai công tắc phải đóng thì dòng mới chạy.",
        explanation: "Đèn chỉ sáng khi <em>cả hai</em> công tắc đóng → phép AND.",
      },
    ]),
  );

  container.appendChild(
    section(
      "Tóm tắt",
      summary(null, [
        "<strong>OR</strong>: Y = A + B, bằng 1 khi có ít nhất một ngõ vào bằng 1.",
        "<strong>AND</strong>: Y = A · B, bằng 1 chỉ khi tất cả ngõ vào bằng 1.",
        "<strong>NOT</strong>: Y = A̅, đảo trạng thái ngõ vào (0 ↔ 1).",
        "Cổng AND/OR có thể có nhiều hơn 2 ngõ vào; quy tắc vẫn giữ nguyên.",
        "OR ~ công tắc <em>song song</em>; AND ~ công tắc <em>nối tiếp</em>; NOT ~ đảo công tắc.",
      ]),
    ),
  );
}

// ---------------------------------------------------------------------------
// Switch-circuit analogy — series/parallel switches with a bulb.

function switchCircuitCard(type) {
  const card = el("div", { class: "card" });
  card.appendChild(el("h4", { text: type === "OR" ? "OR – công tắc song song" : "AND – công tắc nối tiếp", style: { marginTop: 0 } }));
  const state = { a: 0, b: 0 };

  const SVG_NS = "http://www.w3.org/2000/svg";
  const W = 320, H = 160;
  const svg = document.createElementNS(SVG_NS, "svg");
  svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
  svg.style.width = "100%";
  svg.style.maxHeight = "180px";

  function rerender() {
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    const out = computeGate(type, state.a, state.b);
    const onColor = COLORS.peachDeep;
    const offColor = COLORS.text3;

    // Battery on the left
    const bx = 20, by = H / 2;
    line(svg, bx, by - 14, bx, by + 14, COLORS.text, 3);
    line(svg, bx + 8, by - 8, bx + 8, by + 8, COLORS.text, 2);
    text(svg, bx - 12, by + 4, "+", "12", COLORS.text);
    text(svg, bx + 18, by + 4, "−", "12", COLORS.text);

    // Bulb on the right
    const lx = W - 30, ly = H / 2;
    const bulb = document.createElementNS(SVG_NS, "circle");
    bulb.setAttribute("cx", lx);
    bulb.setAttribute("cy", ly);
    bulb.setAttribute("r", 16);
    bulb.setAttribute("fill", out ? COLORS.butter : COLORS.surface2);
    bulb.setAttribute("stroke", COLORS.text);
    bulb.setAttribute("stroke-width", 2);
    svg.appendChild(bulb);
    text(svg, lx, ly + 30, `Y = ${out}`, "12", COLORS.text2);

    if (type === "OR") {
      // Two parallel switches between battery and bulb.
      // Top branch
      line(svg, bx, by, bx, by - 40, COLORS.text, 2);
      line(svg, bx, by - 40, lx - 40, by - 40, state.a ? onColor : offColor, 3);
      drawSwitch(svg, lx - 40, by - 40, state.a, "A", () => { state.a ^= 1; rerender(); });
      line(svg, lx - 10, by - 40, lx, by - 40, state.a ? onColor : offColor, 3);
      line(svg, lx, by - 40, lx, by - 16, out ? onColor : offColor, 3);
      // Bottom branch
      line(svg, bx, by, bx, by + 40, COLORS.text, 2);
      line(svg, bx, by + 40, lx - 40, by + 40, state.b ? onColor : offColor, 3);
      drawSwitch(svg, lx - 40, by + 40, state.b, "B", () => { state.b ^= 1; rerender(); });
      line(svg, lx - 10, by + 40, lx, by + 40, state.b ? onColor : offColor, 3);
      line(svg, lx, by + 40, lx, by + 16, out ? onColor : offColor, 3);
    } else {
      // Two switches in series.
      line(svg, bx, by, 70, by, COLORS.text, 2);
      drawSwitch(svg, 70, by, state.a, "A", () => { state.a ^= 1; rerender(); });
      line(svg, 100, by, 170, by, state.a ? onColor : offColor, 3);
      drawSwitch(svg, 170, by, state.b, "B", () => { state.b ^= 1; rerender(); });
      line(svg, 200, by, lx - 16, by, out ? onColor : offColor, 3);
    }
  }

  function drawSwitch(svg, x, y, closed, label, onClick) {
    // Two terminals 30 apart.
    const t1 = document.createElementNS(SVG_NS, "circle");
    t1.setAttribute("cx", x); t1.setAttribute("cy", y); t1.setAttribute("r", 3);
    t1.setAttribute("fill", COLORS.text);
    svg.appendChild(t1);
    const t2 = document.createElementNS(SVG_NS, "circle");
    t2.setAttribute("cx", x + 30); t2.setAttribute("cy", y); t2.setAttribute("r", 3);
    t2.setAttribute("fill", COLORS.text);
    svg.appendChild(t2);
    // Lever — horizontal if closed, angled up if open.
    const lev = document.createElementNS(SVG_NS, "line");
    lev.setAttribute("x1", x);
    lev.setAttribute("y1", y);
    if (closed) {
      lev.setAttribute("x2", x + 30);
      lev.setAttribute("y2", y);
    } else {
      lev.setAttribute("x2", x + 26);
      lev.setAttribute("y2", y - 14);
    }
    lev.setAttribute("stroke", closed ? COLORS.peachDeep : COLORS.text);
    lev.setAttribute("stroke-width", 3);
    lev.setAttribute("stroke-linecap", "round");
    svg.appendChild(lev);
    text(svg, x + 15, y - 20, `${label} = ${closed ? 1 : 0}`, "11", COLORS.text2);
    // Invisible hitbox
    const hit = document.createElementNS(SVG_NS, "rect");
    hit.setAttribute("x", x - 4);
    hit.setAttribute("y", y - 20);
    hit.setAttribute("width", 38);
    hit.setAttribute("height", 28);
    hit.setAttribute("fill", "transparent");
    hit.style.cursor = "pointer";
    hit.addEventListener("click", onClick);
    svg.appendChild(hit);
  }

  card.appendChild(svg);
  card.appendChild(
    el("div", { class: "small text-2", style: { textAlign: "center" }, text: "Bấm vào công tắc để đóng/mở" }),
  );
  rerender();
  return card;
}

// SVG primitive helpers (local — keep simple).
function line(svg, x1, y1, x2, y2, color, w) {
  const l = document.createElementNS("http://www.w3.org/2000/svg", "line");
  l.setAttribute("x1", x1); l.setAttribute("y1", y1);
  l.setAttribute("x2", x2); l.setAttribute("y2", y2);
  l.setAttribute("stroke", color);
  l.setAttribute("stroke-width", w || 2);
  l.setAttribute("stroke-linecap", "round");
  svg.appendChild(l);
}
function text(svg, x, y, str, size, fill) {
  const t = document.createElementNS("http://www.w3.org/2000/svg", "text");
  t.setAttribute("x", x); t.setAttribute("y", y);
  t.setAttribute("font-size", size);
  t.setAttribute("font-family", "Inter");
  t.setAttribute("fill", fill);
  t.setAttribute("text-anchor", "middle");
  t.textContent = str;
  svg.appendChild(t);
}
