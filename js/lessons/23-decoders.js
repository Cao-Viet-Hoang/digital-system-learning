// Lesson 23: Mạch giải mã (Decoders).
import { el, clear } from "../utils/dom.js";
import { section, summary, quizSection, p, splitView, resetSectionCounter } from "../utils/lesson-ui.js";
import { COLORS } from "../utils/colors.js";

const ov = (t) => `<span style="text-decoration:overline">${t}</span>`;

export default {
  id: "decoders",
  order: 23,
  title: "Mạch giải mã (Decoder)",
  subtitle: "Biến mã nhị phân n bit thành 2ⁿ đường tín hiệu — và vai trò của ngõ cho phép.",
  objective:
    "Hiểu khái niệm decoder; viết bảng chân trị và biểu thức cho mạch giải mã 2 → 4; phân tích bốn biến thể theo cực tính ngõ ra và số ngõ cho phép (Enable); biết cách dùng Enable để chọn/khoá decoder hoặc mở rộng.",
  render,
};

function render(container) {
  resetSectionCounter();
  clear(container);

  // ===== 1. Decoder concept =====
  container.appendChild(
    section(
      "Mạch giải mã là gì?",
      p(
        "Bài trước chúng ta dùng <strong>encoder</strong> để gom N đường thành mã nhị phân ngắn. <strong>Mạch giải mã (Decoder)</strong> làm chiều ngược lại: nhận một mã nhị phân <em>n</em> bit ở ngõ vào và <em>kích hoạt đúng một</em> trong <strong>2ⁿ đường</strong> ngõ ra.",
      ),
      el("div", { class: "alert alert-info", style: { marginTop: "8px" } }, [
        el("strong", { text: "Ý tưởng cốt lõi: " }),
        el("span", { html: "mỗi tổ hợp n bit ngõ vào tương ứng đúng một đường ngõ ra được tích cực. Decoder vì vậy còn được gọi là “mạch chọn đường” hay “bộ tạo minterm”." }),
      ]),
      p(
        "Ví dụ: decoder 2 → 4 có 2 ngõ vào A₁A₀ và 4 ngõ ra Y₀, Y₁, Y₂, Y₃. Khi A₁A₀ = 10, chỉ Y₂ tích cực; các ngõ ra khác không tích cực. Decoder 3 → 8 có 8 ngõ ra; decoder 4 → 16 có 16 ngõ ra.",
      ),
      p('Ứng dụng: chọn ô nhớ theo địa chỉ, chọn chip trong hệ vi xử lý, điều khiển hiển thị, giải mã lệnh CPU, demultiplexer (DEMUX).'),
    ),
  );

  // ===== 2. Decoder 2->4 active-high (basic) =====
  container.appendChild(
    section(
      "Mạch giải mã 2 → 4 (ngõ ra tích cực mức 1)",
      p(
        "<strong>Bài toán:</strong> 2 ngõ vào A₁A₀, 4 ngõ ra Y₀…Y₃ tích cực mức 1 (Y nào tích cực sẽ bằng 1, các Y khác bằng 0).",
      ),
      p("<strong>Bảng chân trị:</strong>"),
      decoder24Table({ enable: false, activeLow: false }),
      p("<strong>Phân tích:</strong> Y<sub>k</sub> = 1 khi và chỉ khi mã nhị phân A₁A₀ bằng k. Mỗi Y<sub>k</sub> chính là một <em>minterm</em> của A₁, A₀:"),
      el("div", { class: "card mono", style: { padding: "14px", textAlign: "center", lineHeight: "1.9", fontSize: "15px" } }, [
        el("div", { html: "Y₀ = " + ov("A₁") + " · " + ov("A₀") }),
        el("div", { html: "Y₁ = " + ov("A₁") + " · A₀" }),
        el("div", { html: "Y₂ = A₁ · " + ov("A₀") }),
        el("div", { html: "Y₃ = A₁ · A₀" }),
      ]),
      p("<strong>Sơ đồ mạch:</strong> 2 cổng NOT để có " + ov("A₁") + " và " + ov("A₀") + ", rồi 4 cổng AND 2 ngõ vào — mỗi AND tạo một minterm."),
      decoder24Diagram({ enable: false, activeLow: false }),
    ),
  );

  // ===== 3. Decoder 2->4 with 1 enable =====
  container.appendChild(
    section(
      "Decoder 2 → 4 với một ngõ cho phép E",
      p(
        "Thực tế, ta thường muốn “bật / tắt” cả decoder bằng một tín hiệu duy nhất. <strong>Ngõ cho phép E</strong> (Enable) làm việc đó: khi E = 1 decoder hoạt động bình thường; khi E = 0 thì <em>mọi ngõ ra = 0</em> bất chấp A₁A₀.",
      ),
      decoder24Table({ enable: true, activeLow: false }),
      p("Biểu thức mới — nhân thêm E vào mỗi minterm:"),
      el("div", { class: "card mono", style: { padding: "14px", textAlign: "center", lineHeight: "1.9", fontSize: "15px" } }, [
        el("div", { html: "Y₀ = E · " + ov("A₁") + " · " + ov("A₀") }),
        el("div", { html: "Y₁ = E · " + ov("A₁") + " · A₀" }),
        el("div", { html: "Y₂ = E · A₁ · " + ov("A₀") }),
        el("div", { html: "Y₃ = E · A₁ · A₀" }),
      ]),
      p("<strong>Ích lợi của E:</strong>"),
      el("ul", { style: { lineHeight: "1.8" } }, [
        el("li", { html: "<strong>Khoá decoder</strong> khi không cần dùng → tiết kiệm năng lượng và tránh nhiễu lan." }),
        el("li", { html: "<strong>Chọn 1 trong nhiều decoder</strong> (mở rộng): nối E của các IC vào những bit địa chỉ cao hơn → ghép nhiều decoder nhỏ thành decoder lớn." }),
        el("li", { html: "<strong>Dùng decoder làm DEMUX</strong>: đưa dữ liệu vào ngõ E, A₁A₀ chọn đường — dữ liệu sẽ xuất hiện ở đúng một ngõ ra." }),
      ]),
    ),
  );

  // ===== 4. Decoder 2->4 with 2 enables E1 active-high, E2 active-low =====
  container.appendChild(
    section(
      "Decoder 2 → 4 với hai ngõ cho phép E₁ và " + ov("E₂"),
      p(
        "Nhiều IC thật (ví dụ 74LS139) có nhiều ngõ Enable kết hợp <em>khác cực</em>. Cách kết hợp phổ biến: <strong>E₁ tích cực mức 1</strong> và <strong>" + ov("E₂") + " tích cực mức 0</strong>. Cả hai phải đồng thời tích cực thì decoder mới hoạt động.",
      ),
      p("Điều kiện cho phép: <span class='mono'>E = E₁ · " + ov("E₂") + "</span>. Khi E = 1 decoder làm việc; ngược lại tất cả Y = 0."),
      decoder24Table({ enable: true, activeLow: false, twoEnables: true }),
      el("div", { class: "card mono", style: { padding: "14px", textAlign: "center", lineHeight: "1.9", fontSize: "15px" } }, [
        el("div", { html: "Y₀ = E₁ · " + ov("E₂") + " · " + ov("A₁") + " · " + ov("A₀") }),
        el("div", { html: "Y₁ = E₁ · " + ov("E₂") + " · " + ov("A₁") + " · A₀" }),
        el("div", { html: "Y₂ = E₁ · " + ov("E₂") + " · A₁ · " + ov("A₀") }),
        el("div", { html: "Y₃ = E₁ · " + ov("E₂") + " · A₁ · A₀" }),
      ]),
      el("div", { class: "alert alert-info", style: { marginTop: "8px" } }, [
        el("strong", { text: "Vì sao kết hợp khác cực? " }),
        el("span", { html: "Trong mạch hệ thống lớn, một số tín hiệu địa chỉ là tích cực mức 1, một số là " + ov("CS") + " (Chip Select) tích cực mức 0. Có sẵn cả E và " + ov("E") + " trên cùng một IC giúp ghép trực tiếp <em>không cần thêm cổng NOT</em>." }),
      ]),
    ),
  );

  // ===== 5. Decoder 2->4 active-low outputs =====
  container.appendChild(
    section(
      "Decoder 2 → 4 với ngõ ra tích cực mức 0 (hai ngõ cho phép)",
      p(
        "Biến thể cuối: ngõ ra <em>đảo</em>. Đường được chọn bằng <strong>0</strong>; các đường khác đều ở mức 1. Đây là kiểu phổ biến nhất trong họ TTL/LS (ví dụ 74LS139, 74LS138).",
      ),
      p("Giả sử dùng cùng cặp Enable E₁ (active-high) và " + ov("E₂") + " (active-low). Bảng chân trị:"),
      decoder24Table({ enable: true, activeLow: true, twoEnables: true }),
      p("Biểu thức bây giờ là <em>tổng các maxterm</em> — hoặc đơn giản hơn: đảo ngõ ra của phiên bản tích cực mức 1:"),
      el("div", { class: "card mono", style: { padding: "14px", textAlign: "center", lineHeight: "1.9", fontSize: "14.5px" } }, [
        el("div", { html: ov("Y₀") + " = " + ov("E₁ · " + ov("E₂") + " · " + ov("A₁") + " · " + ov("A₀")) }),
        el("div", { html: ov("Y₁") + " = " + ov("E₁ · " + ov("E₂") + " · " + ov("A₁") + " · A₀") }),
        el("div", { html: ov("Y₂") + " = " + ov("E₁ · " + ov("E₂") + " · A₁ · " + ov("A₀")) }),
        el("div", { html: ov("Y₃") + " = " + ov("E₁ · " + ov("E₂") + " · A₁ · A₀") }),
        el("div", { class: "small text-3", style: { marginTop: "6px" }, text: "(Mỗi ngõ ra là NAND của Enable và minterm tương ứng → mạch dùng cổng NAND thay cho AND.)" }),
      ]),
      el("div", { class: "card card-soft-butter", style: { padding: "12px", marginTop: "8px" } }, [
        el("strong", { html: "Vì sao chuộng ngõ ra tích cực mức 0? " }),
        el("span", { html: "Trong họ TTL, dòng \"sink\" (hấp thụ về mass) lớn hơn dòng \"source\" — kéo dây xuống 0 mạnh hơn kéo lên 1. Vì vậy LED, role, chip nhớ và nhiều thiết bị ngoại vi được kích hoạt bằng mức 0." }),
      ]),
    ),
  );

  // ===== 6. Tổng kết 4 biến thể =====
  container.appendChild(
    section(
      "So sánh nhanh bốn biến thể",
      el("div", { class: "card", style: { overflowX: "auto" } }, [
        el("table", { class: "tbl tbl-bordered" }, [
          el("thead", {}, [
            el("tr", {}, [
              el("th", { text: "Biến thể" }),
              el("th", { text: "Số ngõ Enable" }),
              el("th", { text: "Ngõ ra tích cực" }),
              el("th", { text: "Cổng chính trong sơ đồ" }),
              el("th", { text: "Ví dụ IC thực tế" }),
            ]),
          ]),
          el("tbody", {}, [
            row(["1. Cơ bản", "0", "Mức 1", "4 × AND + 2 × NOT", "Ít gặp dạng rời rạc"]),
            row(["2. Có 1 Enable", "1 (E)", "Mức 1", "4 × AND (3 ngõ vào) + NOT", "Phần lõi của nhiều IC"]),
            row(["3. Hai Enable", "2 (E₁, " + ov("E₂") + ")", "Mức 1", "AND nhiều ngõ vào", "Hiếm — thường ra mức 0"]),
            row(["4. Hai Enable + ra mức 0", "2 (E₁, " + ov("E₂") + ")", "Mức 0", "NAND 4 ngõ vào", "<strong>74LS139</strong>, ½ × 74LS138"]),
          ]),
        ]),
      ]),
      p("Bốn biến thể là cùng một <em>chức năng giải mã</em>, chỉ khác về tín hiệu điều khiển và mức tích cực. Đây cũng là kiểu phân loại bạn sẽ gặp khi đọc datasheet của các IC giải mã thật."),
    ),
  );

  // ===== 7. Decoder làm DEMUX & mở rộng =====
  container.appendChild(
    section(
      "Ứng dụng đặc biệt: DEMUX và mở rộng decoder",
      el("div", { class: "grid grid-2" }, [
        el("div", { class: "card card-soft-mint" }, [
          el("h3", { text: "Decoder làm DEMUX", style: { marginTop: 0 } }),
          el("p", { html: "Decoder có Enable chính là một <strong>1 → 2ⁿ demultiplexer</strong>: đưa dữ liệu D vào ngõ E, dùng A₁A₀ chọn đường — dữ liệu D xuất hiện ở đúng một ngõ Y<sub>k</sub>, các đường khác = 0." }),
        ]),
        el("div", { class: "card card-soft-sky" }, [
          el("h3", { text: "Mở rộng 3 → 8 từ hai 2 → 4", style: { marginTop: 0 } }),
          el("p", { html: "Dùng bit địa chỉ cao A₂ để cho phép: A₂ = 0 bật decoder dưới (Y₀..Y₃); A₂ = 1 bật decoder trên (Y₄..Y₇). Hai bit thấp A₁A₀ vẫn nối song song. Đây chính là tinh thần của ngõ Enable." }),
        ]),
      ]),
    ),
  );

  // ===== 8. Common mistakes =====
  container.appendChild(
    section(
      "Lỗi thường gặp",
      el("div", { class: "grid grid-2" }, [
        el("div", { class: "card card-soft-peach" }, [
          el("h3", { text: "❶ Đọc nhầm cực tính ngõ ra", style: { marginTop: 0 } }),
          el("p", { html: "Decoder ngõ ra mức 0: đường <em>được chọn</em> là đường có giá trị 0, không phải 1. Luôn kiểm tra dấu gạch trên trong ký hiệu ngõ ra." }),
        ]),
        el("div", { class: "card card-soft-peach" }, [
          el("h3", { text: "❷ Quên Enable không tích cực", style: { marginTop: 0 } }),
          el("p", { html: "Nếu E = 0 (hoặc " + ov("E") + " = 1 với Enable active-low), mọi ngõ ra mất tích cực — đừng đoán ngõ ra theo riêng A₁A₀." }),
        ]),
        el("div", { class: "card card-soft-peach" }, [
          el("h3", { text: "❸ Nhầm decoder với encoder", style: { marginTop: 0 } }),
          el("p", { html: "Encoder thu gọn (N → log₂N); decoder mở rộng (n → 2ⁿ). Số lượng ngõ vào và ra giúp nhận diện ngay." }),
        ]),
        el("div", { class: "card card-soft-peach" }, [
          el("h3", { text: "❹ Một lúc nhiều ngõ ra tích cực", style: { marginTop: 0 } }),
          el("p", { html: "Decoder chuẩn chỉ kích hoạt đúng <em>một</em> ngõ ra. Nếu thấy hai ngõ ra cùng tích cực, hãy kiểm tra lại biểu thức hoặc tín hiệu Enable." }),
        ]),
      ]),
    ),
  );

  // ===== 9. Quiz =====
  container.appendChild(
    quizSection("decoders", [
      {
        prompt: "Decoder n → 2ⁿ có 4 ngõ vào sẽ có bao nhiêu ngõ ra?",
        options: [{ label: "2" }, { label: "4" }, { label: "8" }, { label: "16" }],
        answer: 3,
        hint: "2ⁿ với n = 4.",
        explanation: "2⁴ = 16 ngõ ra — mỗi tổ hợp 4 bit kích hoạt đúng một ngõ ra.",
      },
      {
        prompt: "Với decoder 2 → 4 ngõ ra mức 1, A₁A₀ = 10. Ngõ ra nào tích cực?",
        options: [{ label: "Y₀" }, { label: "Y₁" }, { label: "Y₂" }, { label: "Y₃" }],
        answer: 2,
        hint: "10 nhị phân = 2.",
        explanation: "Y₂ = A₁ · " + ov("A₀") + " = 1·1 = 1; các Y khác bằng 0.",
      },
      {
        prompt: "Decoder có một ngõ cho phép E (active-high). Khi E = 0 thì các ngõ ra Y₀..Y₃ là?",
        options: [
          { label: "Vẫn bám theo A₁A₀" },
          { label: "Tất cả bằng 0" },
          { label: "Tất cả bằng 1" },
          { label: "Lơ lửng (cao trở)" },
        ],
        answer: 1,
        hint: "E nhân với mỗi minterm.",
        explanation: "E = 0 ⇒ E · (bất kỳ) = 0 ⇒ mọi Y = 0, không phụ thuộc A₁A₀.",
      },
      {
        prompt: "Decoder có Enable E₁ (active-high) và " + ov("E₂") + " (active-low). Cặp giá trị nào cho phép decoder hoạt động?",
        options: [
          { label: "E₁ = 0, " + ov("E₂") + " = 0" },
          { label: "E₁ = 0, " + ov("E₂") + " = 1" },
          { label: "E₁ = 1, " + ov("E₂") + " = 0" },
          { label: "E₁ = 1, " + ov("E₂") + " = 1" },
        ],
        answer: 2,
        hint: "E = E₁ · " + ov("E₂") + " phải bằng 1.",
        explanation: "Cần E₁ = 1 (tích cực) và " + ov("E₂") + " = 0 (tích cực). Mọi tổ hợp khác cấm decoder.",
      },
      {
        prompt: "Decoder 2 → 4 ngõ ra mức 0, A₁A₀ = 01, Enable đang tích cực. Trạng thái 4 ngõ ra " + ov("Y₀") + ov("Y₁") + ov("Y₂") + ov("Y₃") + "?",
        options: [
          { label: "1110" },
          { label: "1011" },
          { label: "0100" },
          { label: "1000" },
        ],
        answer: 1,
        hint: "Đường được chọn ở mức 0, các đường khác ở mức 1.",
        explanation: "A₁A₀ = 01 ⇒ chọn Y₁ ⇒ " + ov("Y₁") + " = 0; các " + ov("Y") + " khác = 1 ⇒ 1011.",
      },
      {
        prompt: "Decoder có Enable có thể dùng làm mạch nào dưới đây?",
        options: [
          { label: "Encoder" },
          { label: "Demultiplexer (DEMUX)" },
          { label: "Cổng XOR" },
          { label: "Bộ cộng đầy đủ" },
        ],
        answer: 1,
        hint: "Dữ liệu đi vào ngõ E, địa chỉ chọn đường.",
        explanation: "Đưa dữ liệu D vào E, A₁A₀ chọn đường ra → đúng định nghĩa DEMUX 1 → 2ⁿ.",
      },
    ]),
  );

  // ===== 10. Summary =====
  container.appendChild(
    section(
      "Tóm tắt",
      summary(null, [
        "<strong>Decoder n → 2ⁿ</strong>: từ mã nhị phân n bit kích hoạt đúng một trong 2ⁿ đường ngõ ra.",
        "Mỗi ngõ ra của decoder cơ bản là một <em>minterm</em> của các ngõ vào.",
        "Ngõ <strong>Enable (E)</strong> bật/tắt cả decoder; khi E không tích cực, mọi ngõ ra mất tích cực.",
        "Nhiều IC dùng <strong>hai Enable khác cực</strong> (E₁ và " + ov("E₂") + ") để dễ ghép với các tín hiệu " + ov("CS") + " trong hệ thống lớn.",
        "Ngõ ra <em>tích cực mức 0</em> (đảo) phổ biến trong họ TTL/LS — phù hợp với LED, role, chip nhớ.",
        "Decoder có Enable đồng thời là <strong>DEMUX</strong>; nhiều decoder ghép tầng qua ngõ Enable tạo decoder lớn hơn.",
      ]),
    ),
  );
}

// ============================================================================
// Helpers
// ============================================================================

function row(cells) {
  return el("tr", {}, cells.map((c) => el("td", { html: c, style: { textAlign: c.match(/^\d/) ? "center" : "left" } })));
}

// Generate the 2->4 decoder truth table for various variants.
// opts: { enable: bool, activeLow: bool, twoEnables: bool }
function decoder24Table(opts = {}) {
  const { enable = false, activeLow = false, twoEnables = false } = opts;

  const headers = [];
  if (twoEnables) {
    headers.push("E₁", ov("E₂"));
  } else if (enable) {
    headers.push("E");
  }
  headers.push("A₁", "A₀");
  const yLbl = (i) => activeLow ? ov("Y" + sub(i)) : "Y" + sub(i);
  headers.push(yLbl(0), yLbl(1), yLbl(2), yLbl(3), "Ghi chú");

  // Build rows
  const rows = [];

  function makeRow(en1, en2, a1, a0, active, note) {
    // active = -1 means none (all outputs inactive)
    const outActive = activeLow ? 0 : 1;
    const outIdle = activeLow ? 1 : 0;
    const ys = [outIdle, outIdle, outIdle, outIdle];
    if (active >= 0) ys[active] = outActive;
    const cells = [];
    if (twoEnables) cells.push(en1, en2);
    else if (enable) cells.push(en1);
    cells.push(a1, a0);
    return { input: cells, ys, note };
  }

  if (twoEnables) {
    // Disabled rows (collapse a few)
    rows.push(makeRow("0", "X", "X", "X", -1, "Decoder bị khoá (E₁ = 0)"));
    rows.push(makeRow("X", "1", "X", "X", -1, "Decoder bị khoá (" + ov("E₂") + " = 1)"));
    // Enabled rows
    for (let v = 0; v < 4; v++) {
      const a1 = (v >> 1) & 1, a0 = v & 1;
      rows.push(makeRow("1", "0", String(a1), String(a0), v, "Chọn Y" + sub(v)));
    }
  } else if (enable) {
    rows.push(makeRow("0", null, "X", "X", -1, "Decoder bị khoá (E = 0)"));
    for (let v = 0; v < 4; v++) {
      const a1 = (v >> 1) & 1, a0 = v & 1;
      rows.push(makeRow("1", null, String(a1), String(a0), v, "Chọn Y" + sub(v)));
    }
  } else {
    for (let v = 0; v < 4; v++) {
      const a1 = (v >> 1) & 1, a0 = v & 1;
      rows.push(makeRow(null, null, String(a1), String(a0), v, "Chọn Y" + sub(v)));
    }
  }

  return el("div", { class: "card", style: { overflowX: "auto" } }, [
    el("table", { class: "tbl tbl-bordered", style: { fontSize: "13.5px", margin: "0 auto" } }, [
      el("thead", {}, [
        el("tr", {}, headers.map((h) => el("th", { html: h }))),
      ]),
      el("tbody", {}, rows.map((r) =>
        el("tr", {}, [
          ...r.input.map((v) => {
            const bg = v === "1" ? COLORS.logic1Bg : v === "0" ? COLORS.logic0Bg : COLORS.logicXBg;
            return el("td", { class: "mono", style: { textAlign: "center", background: bg }, text: v });
          }),
          ...r.ys.map((v) =>
            el("td", {
              class: "mono",
              style: {
                textAlign: "center",
                fontWeight: "700",
                background: (activeLow ? v === 0 : v === 1) ? COLORS.logic1Bg : COLORS.logic0Bg,
              },
              text: String(v),
            }),
          ),
          el("td", { class: "small text-2", style: { textAlign: "left" }, html: r.note }),
        ]),
      )),
    ]),
  ]);
}

// Block-style diagram: shows the 4 AND gates with their input literals listed,
// rather than a full mess of routing. Reads cleanly for first-time learners.
function decoder24Diagram() {
  const rows = [
    { y: "Y₀", inputs: [ov("A₁"), ov("A₀")] },
    { y: "Y₁", inputs: [ov("A₁"), "A₀"] },
    { y: "Y₂", inputs: ["A₁", ov("A₀")] },
    { y: "Y₃", inputs: ["A₁", "A₀"] },
  ];
  return el("div", { class: "card", style: { padding: "14px" } }, [
    el("div", { class: "small text-3", style: { textAlign: "center", marginBottom: "10px" }, html: "Ngõ vào A₁, A₀ đi qua 2 cổng NOT để có " + ov("A₁") + " và " + ov("A₀") + ". Bốn cổng AND, mỗi cổng lấy đúng tổ hợp literal tương ứng với một minterm:" }),
    el("div", { class: "grid grid-2", style: { gap: "10px" } }, rows.map((r) =>
      el("div", { class: "card", style: { padding: "10px", background: COLORS.surface2 } }, [
        el("div", { class: "mono", style: { textAlign: "center", fontSize: "15px" }, html:
          `<span style="color:${COLORS.text2}">[ ${r.inputs[0]} · ${r.inputs[1]} ]</span>  ⟶  <strong>${r.y}</strong>` }),
      ]),
    )),
  ]);
}

function sub(n) {
  const map = { 0: "₀", 1: "₁", 2: "₂", 3: "₃", 4: "₄", 5: "₅", 6: "₆", 7: "₇", 8: "₈", 9: "₉" };
  return String(n).split("").map((c) => map[c] || c).join("");
}
