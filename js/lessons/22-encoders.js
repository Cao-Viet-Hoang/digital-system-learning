// Lesson 22: Mạch mã hóa (Encoders).
import { el, clear } from "../utils/dom.js";
import { section, summary, quizSection, p, splitView, resetSectionCounter } from "../utils/lesson-ui.js";
import { COLORS } from "../utils/colors.js";

const ov = (t) => `<span style="text-decoration:overline">${t}</span>`;

export default {
  id: "encoders",
  order: 22,
  title: "Mạch mã hóa (Encoder)",
  subtitle: "Biến N đường tín hiệu rời rạc thành mã nhị phân log₂N bit.",
  objective:
    "Hiểu khái niệm và công dụng của mạch mã hoá; phân biệt ngõ vào tích cực mức 1 và mức 0; lập bảng chân trị và biểu thức cho mã hoá 4→2, 8→3; làm quen với mã hoá ưu tiên và vi mạch 74LS147.",
  render,
};

function render(container) {
  resetSectionCounter();
  clear(container);

  // ===== 1. Why encoders =====
  container.appendChild(
    section(
      "Mạch mã hóa là gì và để làm gì?",
      p(
        "Hình dung một bàn phím máy tính. Mỗi phím là một <em>đường tín hiệu</em> riêng. Khi bạn bấm phím số 5, máy tính không cần 100 dây để nhận 100 phím — nó chỉ cần một <strong>mã nhị phân</strong> ngắn (vài bit) tương ứng với phím được bấm. <strong>Mạch mã hoá (Encoder)</strong> chính là mạch làm việc này: <em>biến nhiều đường tín hiệu thành một mã nhị phân ngắn</em>.",
      ),
      p(
        "Tổng quát: nếu có <strong>N</strong> đường ngõ vào và mỗi lần chỉ một đường được kích hoạt, thì mã ngõ ra cần <strong>n = ⌈log₂N⌉</strong> bit. Ví dụ: 4 phím cần 2 bit, 8 phím cần 3 bit, 16 phím cần 4 bit.",
      ),
      el("div", { class: "alert alert-info", style: { marginTop: "10px" } }, [
        el("strong", { text: "Ứng dụng: " }),
        el("span", { text: "bàn phím, bộ nhận lệnh từ remote, bộ chọn ưu tiên ngắt (interrupt) trong vi xử lý, nén tín hiệu, mã hoá vị trí." }),
      ]),
    ),
  );

  // ===== 2. Hai dạng ngõ vào =====
  container.appendChild(
    section(
      "Ngõ vào tích cực mức 1 và mức 0",
      p(
        "Một ngõ vào được gọi là <strong>tích cực</strong> (active) khi đang ở mức mà mạch coi là <em>“đang được nhấn / đang yêu cầu”</em>. Tuỳ thiết kế, mức tích cực có thể là 1 hoặc 0:",
      ),
      el("div", { class: "grid grid-2" }, [
        el("div", { class: "card card-soft-mint" }, [
          el("h3", { text: "Tích cực mức 1 (active-high)", style: { marginTop: 0 } }),
          el("p", { html: "Đường nào đang ở <strong>logic 1</strong> là đường đang được kích hoạt. Các đường còn lại bằng 0. Dễ hiểu trực quan — phù hợp cho bài đầu tiên." }),
        ]),
        el("div", { class: "card card-soft-sky" }, [
          el("h3", { text: "Tích cực mức 0 (active-low)", style: { marginTop: 0 } }),
          el("p", { html: "Đường nào đang ở <strong>logic 0</strong> mới là đường được kích hoạt. Trong thực tế nhiều IC dùng cách này — kéo dây xuống 0 ổn định và chống nhiễu tốt hơn kéo lên 1." }),
        ]),
      ]),
      el("div", { class: "alert alert-info", style: { marginTop: "10px" } }, [
        el("strong", { text: "Quy ước ký hiệu: " }),
        el("span", { html: "tên tín hiệu có dấu gạch ngang phía trên (ví dụ " + ov("I₀") + ") thường chỉ <em>tích cực mức 0</em>. Tên không có gạch (I₀) thường chỉ <em>tích cực mức 1</em>." }),
      ]),
    ),
  );

  // ===== 3. Encoder 4 → 2 active-high =====
  container.appendChild(
    section(
      "Mạch mã hoá 4 → 2 (ngõ vào tích cực mức 1)",
      p(
        "<strong>Bài toán:</strong> có 4 đường ngõ vào I₀, I₁, I₂, I₃. Tại mỗi thời điểm chỉ một đường = 1, các đường khác = 0. Cần xuất ra mã nhị phân 2 bit A₁A₀ chỉ số thứ tự của đường đang tích cực.",
      ),
      p("<strong>Bảng chân trị:</strong> (4 hàng hợp lệ, các tổ hợp khác coi là không cho phép)"),
      enc4to2TruthTable(true),
      p("<strong>Phân tích bảng:</strong> nhìn cột A₁ — bằng 1 khi I₂ hoặc I₃ tích cực. Nhìn cột A₀ — bằng 1 khi I₁ hoặc I₃ tích cực. Vậy:"),
      el("div", { class: "card mono", style: { padding: "14px", textAlign: "center", lineHeight: "1.9", fontSize: "15px" } }, [
        el("div", { html: "A₁ = I₂ + I₃" }),
        el("div", { html: "A₀ = I₁ + I₃" }),
      ]),
      p('<strong>Mạch:</strong> chỉ cần <em>hai cổng OR 2 ngõ vào</em>. I₀ không kết nối với ngõ ra nào — vì khi I₀ tích cực, mã = 00 (tất cả ngõ ra = 0).'),
      enc4to2Diagram(),
      el("div", { class: "alert alert-info", style: { marginTop: "10px" } }, [
        el("strong", { text: "Hạn chế: " }),
        el("span", { html: "nếu nhiều đường cùng tích cực một lúc (ví dụ I₁ = I₂ = 1) thì A₁A₀ = 11 — trùng với mã của I₃! Mạch không phân biệt được. Phần sau sẽ giới thiệu <em>mã hoá ưu tiên</em> để giải quyết." }),
      ]),
    ),
  );

  // ===== 4. Encoder 8 → 3 active-low =====
  container.appendChild(
    section(
      "Mạch mã hoá 8 → 3 (ngõ vào tích cực mức 0)",
      p(
        "Bây giờ 8 đường ngõ vào " + ov("I₀") + " … " + ov("I₇") + " (gạch trên = tích cực mức 0). Đường nào = 0 thì <em>đang được nhấn</em>; các đường khác = 1. Mã ra A₂A₁A₀ là số thứ tự của đường đang tích cực.",
      ),
      p("<strong>Bảng chân trị rút gọn:</strong>"),
      enc8to3TruthTable(),
      p("<strong>Rút biểu thức:</strong> A₂ = 1 khi một trong I₄, I₅, I₆, I₇ tích cực (= 0). Vì ngõ vào tích cực mức 0, cần đảo trước khi OR — hoặc dùng cổng NAND."),
      el("div", { class: "card mono", style: { padding: "14px", textAlign: "center", lineHeight: "1.9", fontSize: "15px" } }, [
        el("div", { html: "A₂ = " + ov("I₄") + " + " + ov("I₅") + " + " + ov("I₆") + " + " + ov("I₇") }),
        el("div", { html: "A₁ = " + ov("I₂") + " + " + ov("I₃") + " + " + ov("I₆") + " + " + ov("I₇") }),
        el("div", { html: "A₀ = " + ov("I₁") + " + " + ov("I₃") + " + " + ov("I₅") + " + " + ov("I₇") }),
        el("div", { class: "small text-3", style: { marginTop: "6px" }, html: "Mỗi A<sub>k</sub> = OR của các đường mà chỉ số có bit k = 1." }),
      ]),
      el("div", { class: "card card-soft-butter", style: { padding: "12px", marginTop: "10px" } }, [
        el("strong", { html: "Quy tắc nhớ: " }),
        el("span", { html: "trong số thứ tự nhị phân của ngõ vào, hễ <em>bit ra A<sub>k</sub> phải = 1</em>, thì ngõ vào tương ứng có bit nhị phân thứ k = 1. Ví dụ bit A₀: I₁ (001), I₃ (011), I₅ (101), I₇ (111) — toàn số lẻ." }),
      ]),
    ),
  );

  // ===== 5. Mã hoá ưu tiên =====
  container.appendChild(
    section(
      "Mã hoá ưu tiên (Priority Encoder)",
      p(
        "Như đã chỉ ra ở phần trước, nếu hai ngõ vào cùng tích cực thì mã ra bị nhầm. <strong>Mã hoá ưu tiên</strong> giải quyết bằng cách: nếu nhiều đường cùng tích cực, mạch chỉ <em>mã hoá đường có chỉ số cao nhất</em> và bỏ qua các đường nhỏ hơn.",
      ),
      p("Ví dụ với 4 → 2 ưu tiên (ngõ vào tích cực mức 1):"),
      enc4to2PriorityTable(),
      p("Cột “X” nghĩa là <em>không quan tâm</em> — ngõ vào đó có thể là 0 hoặc 1, mạch vẫn cho cùng mã ra vì đường ưu tiên cao hơn đang tích cực."),
      el("div", { class: "card mono", style: { padding: "14px", textAlign: "center", lineHeight: "1.9", fontSize: "15px" } }, [
        el("div", { html: "A₁ = I₂·" + ov("I₃") + " + I₃ &nbsp;=&nbsp; I₂ + I₃" }),
        el("div", { html: "A₀ = I₁·" + ov("I₂") + "·" + ov("I₃") + " + I₃" }),
        el("div", { class: "small text-3", style: { marginTop: "6px" }, html: "Một số IC còn thêm ngõ ra V (valid) = I₀+I₁+I₂+I₃ — báo có đường nào tích cực hay không." }),
      ]),
    ),
  );

  // ===== 6. 74LS147 =====
  container.appendChild(
    section(
      "Vi mạch 74LS147 – mã hoá 10 đường → 4 đường (BCD)",
      p(
        "Đây là IC mã hoá ưu tiên thực tế phổ biến nhất. Nó nhận 9 ngõ vào " + ov("I₁") + " … " + ov("I₉") + " (tích cực mức 0) và xuất ra mã <strong>BCD đảo</strong> 4 bit " + ov("A₃") + " " + ov("A₂") + " " + ov("A₁") + " " + ov("A₀") + ".",
      ),
      el("div", { class: "card card-soft-lavender", style: { padding: "12px" } }, [
        el("strong", { html: "Vì sao chỉ 9 ngõ vào mà không phải 10? " }),
        el("span", { html: "Trường hợp <em>không phím nào</em> được nhấn (tất cả ở mức 1) tự động ứng với số 0 → mã BCD đảo = 1111. Vậy ngõ vào I₀ là <em>ngầm hiểu</em>, không cần dây thật." }),
      ]),
      p("<strong>Bảng chân trị (rút gọn — chỉ liệt kê đường ưu tiên cao nhất đang tích cực):</strong>"),
      ic74147Table(),
      p('Ưu tiên: <span class="mono">' + ov("I₉") + " > " + ov("I₈") + " > … > " + ov("I₁") + "</span>. Ngõ ra cũng <em>đảo</em> (gạch trên) — đặc trưng họ TTL/LS để dễ ghép với LED, cổng NAND/NOR có sẵn."),
      el("div", { class: "alert alert-info", style: { marginTop: "10px" } }, [
        el("strong", { text: "Ứng dụng kinh điển: " }),
        el("span", { html: "bàn phím số 10 phím (0–9) → mã BCD 4 bit cho vi xử lý. Vi mạch 74LS148 là biến thể 8 → 3 dùng nguyên lý tương tự (ngõ vào tích cực mức 0, ngõ ra đảo, có ngõ vào cho phép EI, ngõ ra GS và EO để xếp tầng)." }),
      ]),
    ),
  );

  // ===== 7. Common mistakes =====
  container.appendChild(
    section(
      "Lỗi thường gặp",
      el("div", { class: "grid grid-2" }, [
        el("div", { class: "card card-soft-peach" }, [
          el("h3", { text: "❶ Nhầm mức tích cực", style: { marginTop: 0 } }),
          el("p", { html: "Đọc lướt bảng chân trị mà bỏ qua dấu gạch trên. Ngõ vào " + ov("I₃") + " <strong>= 0</strong> mới là “đang nhấn”, không phải bằng 1." }),
        ]),
        el("div", { class: "card card-soft-peach" }, [
          el("h3", { text: "❷ Quên trường hợp 0 đường tích cực", style: { marginTop: 0 } }),
          el("p", { html: "Mạch không có ngõ V (valid) thì khi tất cả ngõ vào = 0 (không nhấn gì) mã ra cũng = 00 — trùng với khi I₀ tích cực. Phải dùng tín hiệu valid để phân biệt." }),
        ]),
        el("div", { class: "card card-soft-peach" }, [
          el("h3", { text: "❸ Encoder ≠ Decoder", style: { marginTop: 0 } }),
          el("p", { html: "Encoder: <em>nhiều đường → mã ngắn</em>. Decoder (bài tiếp): <em>mã ngắn → nhiều đường</em>. Hai mạch ngược chiều nhau." }),
        ]),
        el("div", { class: "card card-soft-peach" }, [
          el("h3", { text: "❹ Nhiều đường cùng tích cực", style: { marginTop: 0 } }),
          el("p", { html: "Encoder thông thường không xử lý đúng. Phải dùng <strong>mã hoá ưu tiên</strong> để có mã ra xác định." }),
        ]),
      ]),
    ),
  );

  // ===== 8. Quiz =====
  container.appendChild(
    quizSection("encoders", [
      {
        prompt: "Mạch mã hoá 16 đường (chỉ một đường tích cực tại mỗi thời điểm) cần bao nhiêu bit ngõ ra?",
        options: [{ label: "2 bit" }, { label: "3 bit" }, { label: "4 bit" }, { label: "16 bit" }],
        answer: 2,
        hint: "n = ⌈log₂N⌉.",
        explanation: "log₂16 = 4, nên cần 4 bit ngõ ra.",
      },
      {
        prompt: "Trong mạch mã hoá 4 → 2 với ngõ vào tích cực mức 1, khi I₂ = 1 và các đường khác = 0, mã ra A₁A₀ là?",
        options: [{ label: "00" }, { label: "01" }, { label: "10" }, { label: "11" }],
        answer: 2,
        hint: "A₁ = I₂ + I₃; A₀ = I₁ + I₃.",
        explanation: "I₂ = 1 ⇒ A₁ = 1, A₀ = 0 ⇒ mã = 10 (chính là số 2 nhị phân).",
      },
      {
        prompt: "Ngõ vào " + ov("I₅") + " (có gạch trên) đang tích cực khi nó có giá trị nào?",
        options: [{ label: "Logic 1" }, { label: "Logic 0" }, { label: "Bất kỳ" }, { label: "Trạng thái cao trở" }],
        answer: 1,
        hint: "Gạch trên = tích cực mức thấp.",
        explanation: "Ký hiệu có gạch trên báo tín hiệu tích cực mức 0; vậy " + ov("I₅") + " = 0 nghĩa là đường thứ 5 đang được kích hoạt.",
      },
      {
        prompt: "Trong mã hoá 8 → 3, biểu thức cho bit ra A₀ là?",
        options: [
          { label: "I₀ + I₁ + I₂ + I₃" },
          { label: "I₁ + I₃ + I₅ + I₇" },
          { label: "I₄ + I₅ + I₆ + I₇" },
          { label: "I₂ + I₃ + I₆ + I₇" },
        ],
        answer: 1,
        hint: "A₀ = 1 ở những số có bit thấp = 1 — tức số lẻ.",
        explanation: "Các chỉ số lẻ 1, 3, 5, 7 đều có bit A₀ = 1 trong dạng nhị phân.",
      },
      {
        prompt: "Vì sao 74LS147 chỉ có 9 ngõ vào (" + ov("I₁") + " … " + ov("I₉") + ") thay vì 10?",
        options: [
          { label: "Vì tiết kiệm chân IC" },
          { label: "Trường hợp không phím nào nhấn tự nhiên ứng với số 0" },
          { label: "Phím 0 luôn luôn được nhấn" },
          { label: "Mạch chỉ mã hoá tới số 9" },
        ],
        answer: 1,
        hint: "Khi không ai nhấn, tất cả ngõ vào ở mức không tích cực (= 1).",
        explanation: "Tất cả ngõ vào = 1 ⇒ không đường nào tích cực ⇒ mã BCD đảo = 1111 (tức số 0). Vì vậy I₀ là ngầm.",
      },
      {
        prompt: "Mạch mã hoá ưu tiên giải quyết vấn đề gì?",
        options: [
          { label: "Giảm số cổng logic" },
          { label: "Cho mã ra xác định khi nhiều ngõ vào cùng tích cực" },
          { label: "Tăng tốc độ truyền tin" },
          { label: "Đảo mức tín hiệu ra" },
        ],
        answer: 1,
        hint: "Encoder thường nhầm khi nhiều ngõ vào = 1.",
        explanation: "Khi nhiều đường cùng tích cực, encoder ưu tiên sẽ mã hoá đường có chỉ số cao nhất, đảm bảo mã ra luôn xác định.",
      },
    ]),
  );

  // ===== 9. Summary =====
  container.appendChild(
    section(
      "Tóm tắt",
      summary(null, [
        "<strong>Mã hoá</strong> = biến <em>N đường tín hiệu</em> thành <em>n = ⌈log₂N⌉ bit mã nhị phân</em>.",
        "Ngõ vào <em>tích cực mức 1</em> (active-high) — đường đang nhấn ở logic 1; <em>tích cực mức 0</em> (active-low, có gạch trên) — đường đang nhấn ở logic 0.",
        "Encoder cơ bản: mỗi bit ra A<sub>k</sub> là tổng OR của các ngõ vào có chỉ số chứa bit k = 1.",
        "Encoder thường nhầm khi nhiều ngõ vào cùng tích cực → dùng <strong>mã hoá ưu tiên</strong>.",
        "Vi mạch 74LS147: 9 ngõ vào → 4 bit BCD đảo, ưu tiên cao xuống thấp; áp dụng cho bàn phím số.",
        "Encoder và Decoder là cặp đối ngẫu: encoder thu gọn, decoder mở rộng — bài tiếp ta sẽ học decoder.",
      ]),
    ),
  );
}

// ============================================================================
// Truth tables and diagrams
// ============================================================================

function enc4to2TruthTable() {
  const rows = [
    [1, 0, 0, 0, 0, 0, "I₀ tích cực"],
    [0, 1, 0, 0, 0, 1, "I₁ tích cực"],
    [0, 0, 1, 0, 1, 0, "I₂ tích cực"],
    [0, 0, 0, 1, 1, 1, "I₃ tích cực"],
  ];
  return el("div", { class: "card", style: { overflowX: "auto" } }, [
    el("table", { class: "tbl tbl-bordered", style: { width: "auto", margin: "0 auto" } }, [
      el("thead", {}, [
        el("tr", {}, [
          el("th", { text: "I₀" }),
          el("th", { text: "I₁" }),
          el("th", { text: "I₂" }),
          el("th", { text: "I₃" }),
          el("th", { text: "A₁" }),
          el("th", { text: "A₀" }),
          el("th", { text: "Ghi chú" }),
        ]),
      ]),
      el("tbody", {}, rows.map((r) =>
        el("tr", {}, [
          ...r.slice(0, 4).map((v) =>
            el("td", {
              class: "mono",
              style: { textAlign: "center", background: v === 1 ? COLORS.logic1Bg : COLORS.logic0Bg },
              text: String(v),
            }),
          ),
          ...r.slice(4, 6).map((v) =>
            el("td", {
              class: "mono",
              style: { textAlign: "center", fontWeight: "700", background: v === 1 ? COLORS.logic1Bg : COLORS.logic0Bg },
              text: String(v),
            }),
          ),
          el("td", { class: "small text-2", style: { textAlign: "left" }, text: r[6] }),
        ]),
      )),
    ]),
  ]);
}

function enc4to2Diagram() {
  const SVG_NS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(SVG_NS, "svg");
  svg.setAttribute("viewBox", "0 0 420 220");
  svg.setAttribute("style", "max-width:520px;width:100%;display:block;margin:10px auto;");

  // Input labels and wires for I0..I3 (left side)
  const labels = ["I₀", "I₁", "I₂", "I₃"];
  for (let i = 0; i < 4; i++) {
    const y = 30 + i * 40;
    const t = document.createElementNS(SVG_NS, "text");
    t.setAttribute("x", "10");
    t.setAttribute("y", String(y + 5));
    t.setAttribute("font-family", "monospace");
    t.setAttribute("font-size", "14");
    t.setAttribute("fill", COLORS.text);
    t.textContent = labels[i];
    svg.appendChild(t);

    // wire from label area
    const line = document.createElementNS(SVG_NS, "line");
    line.setAttribute("x1", "35");
    line.setAttribute("y1", String(y));
    line.setAttribute("x2", "120");
    line.setAttribute("y2", String(y));
    line.setAttribute("stroke", COLORS.text2);
    line.setAttribute("stroke-width", "2");
    svg.appendChild(line);
  }

  // Junction dots: I1, I3 → A0;  I2, I3 → A1
  // A1 OR gate at (250, 50);  A0 OR gate at (250, 140)
  // Path from I2 (y=110) routes up to A1.inB; I3 (y=150) routes up to A1.inB too via branching
  // For clarity, draw simple OR gates and routes with bend points.

  function orGate(cx, cy) {
    const g = document.createElementNS(SVG_NS, "g");
    g.setAttribute("transform", `translate(${cx},${cy})`);
    const path = document.createElementNS(SVG_NS, "path");
    path.setAttribute("d", `M0 0 Q22 25 0 50 Q24 50 60 25 Q24 0 0 0 Z`);
    path.setAttribute("fill", COLORS.surface);
    path.setAttribute("stroke", COLORS.text);
    path.setAttribute("stroke-width", "2");
    g.appendChild(path);
    const lbl = document.createElementNS(SVG_NS, "text");
    lbl.setAttribute("x", "22");
    lbl.setAttribute("y", "30");
    lbl.setAttribute("font-size", "11");
    lbl.setAttribute("font-family", "monospace");
    lbl.setAttribute("fill", COLORS.text2);
    lbl.textContent = "OR";
    g.appendChild(lbl);
    svg.appendChild(g);
    return { inA: { x: cx + 5, y: cy + 10 }, inB: { x: cx + 5, y: cy + 40 }, out: { x: cx + 60, y: cy + 25 } };
  }

  function wire(x1, y1, x2, y2, color = COLORS.text2) {
    const l = document.createElementNS(SVG_NS, "line");
    l.setAttribute("x1", x1); l.setAttribute("y1", y1);
    l.setAttribute("x2", x2); l.setAttribute("y2", y2);
    l.setAttribute("stroke", color);
    l.setAttribute("stroke-width", "2");
    svg.appendChild(l);
  }

  function dot(x, y) {
    const c = document.createElementNS(SVG_NS, "circle");
    c.setAttribute("cx", x); c.setAttribute("cy", y); c.setAttribute("r", "3");
    c.setAttribute("fill", COLORS.text);
    svg.appendChild(c);
  }

  // OR gates
  const orA1 = orGate(220, 40);   // A1 = I2 + I3, gate around y=40..90
  const orA0 = orGate(220, 130);  // A0 = I1 + I3, around y=130..180

  // Branch wires
  // I1 (y=70) → orA0.inA (y=140): go right to x=180, then down
  wire(120, 70, 180, 70);
  dot(180, 70);
  wire(180, 70, 180, 140);
  wire(180, 140, orA0.inA.x, orA0.inA.y);

  // I2 (y=110) → orA1.inB (y=80): right to 180, then up to 80
  wire(120, 110, 200, 110);
  dot(200, 110);
  wire(200, 110, 200, 80);
  wire(200, 80, orA1.inB.x, orA1.inB.y);

  // I3 (y=150) → both orA1.inA (y=50) and orA0.inB (y=170)
  wire(120, 150, 160, 150);
  dot(160, 150);
  // branch up to A1.inA
  wire(160, 150, 160, 50);
  wire(160, 50, orA1.inA.x, orA1.inA.y);
  // branch right to A0.inB
  wire(160, 150, 200, 150);
  wire(200, 150, 200, 170);
  wire(200, 170, orA0.inB.x, orA0.inB.y);

  // Outputs
  wire(orA1.out.x, orA1.out.y, 360, orA1.out.y);
  wire(orA0.out.x, orA0.out.y, 360, orA0.out.y);
  const a1Lbl = document.createElementNS(SVG_NS, "text");
  a1Lbl.setAttribute("x", "370"); a1Lbl.setAttribute("y", String(orA1.out.y + 5));
  a1Lbl.setAttribute("font-family", "monospace"); a1Lbl.setAttribute("font-size", "14");
  a1Lbl.setAttribute("fill", COLORS.text); a1Lbl.textContent = "A₁";
  svg.appendChild(a1Lbl);
  const a0Lbl = document.createElementNS(SVG_NS, "text");
  a0Lbl.setAttribute("x", "370"); a0Lbl.setAttribute("y", String(orA0.out.y + 5));
  a0Lbl.setAttribute("font-family", "monospace"); a0Lbl.setAttribute("font-size", "14");
  a0Lbl.setAttribute("fill", COLORS.text); a0Lbl.textContent = "A₀";
  svg.appendChild(a0Lbl);

  return el("div", { class: "card", style: { padding: "8px" } }, [svg]);
}

function enc8to3TruthTable() {
  // Each row: only one input is 0 (active low), others = 1
  const rows = [];
  for (let active = 0; active < 8; active++) {
    const inputs = [];
    for (let i = 0; i < 8; i++) inputs.push(i === active ? 0 : 1);
    const a2 = (active >> 2) & 1;
    const a1 = (active >> 1) & 1;
    const a0 = active & 1;
    rows.push({ inputs, a2, a1, a0, label: `${ov("I" + sub(active))} tích cực` });
  }
  return el("div", { class: "card", style: { overflowX: "auto" } }, [
    el("table", { class: "tbl tbl-bordered", style: { fontSize: "13px", margin: "0 auto" } }, [
      el("thead", {}, [
        el("tr", {}, [
          ...Array.from({ length: 8 }, (_, i) =>
            el("th", { html: ov("I" + sub(i)) }),
          ),
          el("th", { text: "A₂" }),
          el("th", { text: "A₁" }),
          el("th", { text: "A₀" }),
          el("th", { text: "Ghi chú" }),
        ]),
      ]),
      el("tbody", {}, rows.map((r) =>
        el("tr", {}, [
          ...r.inputs.map((v) =>
            el("td", {
              class: "mono",
              style: { textAlign: "center", background: v === 0 ? COLORS.logic1Bg : COLORS.logic0Bg },
              text: String(v),
            }),
          ),
          el("td", { class: "mono", style: { textAlign: "center", fontWeight: "700" }, text: String(r.a2) }),
          el("td", { class: "mono", style: { textAlign: "center", fontWeight: "700" }, text: String(r.a1) }),
          el("td", { class: "mono", style: { textAlign: "center", fontWeight: "700" }, text: String(r.a0) }),
          el("td", { class: "small text-2", html: r.label }),
        ]),
      )),
    ]),
  ]);
}

function enc4to2PriorityTable() {
  // Rows: prioritize from I3 down
  const rows = [
    { i: ["0", "0", "0", "0"], a: ["0", "0"], note: "Không nhấn" },
    { i: ["1", "0", "0", "0"], a: ["0", "0"], note: "I₀ tích cực" },
    { i: ["X", "1", "0", "0"], a: ["0", "1"], note: "I₁ ưu tiên" },
    { i: ["X", "X", "1", "0"], a: ["1", "0"], note: "I₂ ưu tiên" },
    { i: ["X", "X", "X", "1"], a: ["1", "1"], note: "I₃ ưu tiên cao nhất" },
  ];
  return el("div", { class: "card", style: { overflowX: "auto" } }, [
    el("table", { class: "tbl tbl-bordered", style: { width: "auto", margin: "0 auto" } }, [
      el("thead", {}, [
        el("tr", {}, [
          el("th", { text: "I₀" }),
          el("th", { text: "I₁" }),
          el("th", { text: "I₂" }),
          el("th", { text: "I₃" }),
          el("th", { text: "A₁" }),
          el("th", { text: "A₀" }),
          el("th", { text: "Ghi chú" }),
        ]),
      ]),
      el("tbody", {}, rows.map((r) =>
        el("tr", {}, [
          ...r.i.map((v) => {
            const bg = v === "1" ? COLORS.logic1Bg : v === "0" ? COLORS.logic0Bg : COLORS.logicXBg;
            return el("td", { class: "mono", style: { textAlign: "center", background: bg }, text: v });
          }),
          ...r.a.map((v) =>
            el("td", { class: "mono", style: { textAlign: "center", fontWeight: "700", background: COLORS.surface2 }, text: v }),
          ),
          el("td", { class: "small text-2", style: { textAlign: "left" }, text: r.note }),
        ]),
      )),
    ]),
  ]);
}

function ic74147Table() {
  // Active priority encoder, lowest priority shown first
  const rows = [
    { inputs: "1 1 1 1 1 1 1 1 1", out: "1 1 1 1", note: "Không nhấn → số 0" },
    { inputs: "0 X X X X X X X X", out: "1 1 1 0", note: ov("I₁") + " tích cực → số 1" },
    { inputs: "1 0 X X X X X X X", out: "1 1 0 1", note: "số 2" },
    { inputs: "1 1 0 X X X X X X", out: "1 1 0 0", note: "số 3" },
    { inputs: "1 1 1 0 X X X X X", out: "1 0 1 1", note: "số 4" },
    { inputs: "1 1 1 1 0 X X X X", out: "1 0 1 0", note: "số 5" },
    { inputs: "1 1 1 1 1 0 X X X", out: "1 0 0 1", note: "số 6" },
    { inputs: "1 1 1 1 1 1 0 X X", out: "1 0 0 0", note: "số 7" },
    { inputs: "1 1 1 1 1 1 1 0 X", out: "0 1 1 1", note: "số 8" },
    { inputs: "1 1 1 1 1 1 1 1 0", out: "0 1 1 0", note: ov("I₉") + " ưu tiên cao nhất → số 9" },
  ];
  const inHdr = [];
  for (let i = 1; i <= 9; i++) inHdr.push(el("th", { html: ov("I" + sub(i)) }));
  return el("div", { class: "card", style: { overflowX: "auto" } }, [
    el("table", { class: "tbl tbl-bordered", style: { fontSize: "12.5px", margin: "0 auto" } }, [
      el("thead", {}, [
        el("tr", {}, [
          ...inHdr,
          el("th", { html: ov("A₃") }),
          el("th", { html: ov("A₂") }),
          el("th", { html: ov("A₁") }),
          el("th", { html: ov("A₀") }),
          el("th", { text: "Ý nghĩa" }),
        ]),
      ]),
      el("tbody", {}, rows.map((r) => {
        const ins = r.inputs.split(" ");
        const outs = r.out.split(" ");
        return el("tr", {}, [
          ...ins.map((v) => {
            const bg = v === "0" ? COLORS.logic1Bg : v === "1" ? COLORS.logic0Bg : COLORS.logicXBg;
            return el("td", { class: "mono", style: { textAlign: "center", background: bg }, text: v });
          }),
          ...outs.map((v) =>
            el("td", { class: "mono", style: { textAlign: "center", fontWeight: "700", background: COLORS.surface2 }, text: v }),
          ),
          el("td", { class: "small text-2", style: { textAlign: "left" }, html: r.note }),
        ]);
      })),
    ]),
  ]);
}

function sub(n) {
  const map = { 0: "₀", 1: "₁", 2: "₂", 3: "₃", 4: "₄", 5: "₅", 6: "₆", 7: "₇", 8: "₈", 9: "₉" };
  return String(n).split("").map((c) => map[c] || c).join("");
}
