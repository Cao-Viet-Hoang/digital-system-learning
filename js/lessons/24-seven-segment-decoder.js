// Lesson 24: Mạch giải mã LED 7 đoạn (anode chung).
import { el, clear } from "../utils/dom.js";
import { section, summary, quizSection, p, splitView, resetSectionCounter } from "../utils/lesson-ui.js";
import { COLORS } from "../utils/colors.js";

const ov = (t) => `<span style="text-decoration:overline">${t}</span>`;

export default {
  id: "seven-segment-decoder",
  order: 24,
  title: "Mạch giải mã LED 7 đoạn",
  subtitle: "Từ mã BCD 4 bit đến hình con số 0–9 trên LED bảy đoạn.",
  objective:
    "Hiểu cấu tạo LED 7 đoạn loại anode chung và cathode chung; phân biệt ngõ ra tích cực mức 0/1 phù hợp với mỗi loại; lập bảng chân trị cho mạch giải mã BCD-7 đoạn; làm quen với vi mạch 74LS47.",
  render,
};

function render(container) {
  resetSectionCounter();
  clear(container);

  // ===== 1. Giới thiệu =====
  container.appendChild(
    section(
      "Giới thiệu",
      p(
        "Trong các thiết bị điện tử quen thuộc — đồng hồ kỹ thuật số, lò vi sóng, đồng hồ đo, máy tính bỏ túi — chúng ta thấy những con số sáng hình “khối góc” tạo bởi <strong>LED 7 đoạn</strong> (7-segment display). Đây là cách hiển thị số rẻ và dễ dùng nhất trong điện tử số.",
      ),
      p(
        "Vấn đề: vi xử lý hay bộ đếm thường xuất ra số dưới dạng <strong>BCD 4 bit</strong> (0000…1001 cho các số 0–9). Nhưng LED 7 đoạn lại cần 7 đường tín hiệu riêng biệt — mỗi đường điều khiển một đoạn. Cần một mạch <em>chuyển đổi</em>: BCD 4 bit → 7 đường a, b, c, d, e, f, g. Đó là <strong>mạch giải mã LED 7 đoạn</strong>.",
      ),
      el("div", { class: "alert alert-info", style: { marginTop: "8px" } }, [
        el("strong", { text: "Liên hệ với bài trước: " }),
        el("span", { html: "đây vẫn là một mạch giải mã, nhưng <em>không phải</em> kiểu 1-trong-N. Số đường tích cực khác nhau tuỳ con số — ví dụ số “1” chỉ bật 2 đoạn, số “8” bật cả 7 đoạn. Bảng chân trị đặc trưng và lớn hơn decoder cơ bản." }),
      ]),
    ),
  );

  // ===== 2. Cấu tạo LED 7 đoạn =====
  container.appendChild(
    section(
      "Cấu tạo LED 7 đoạn",
      p(
        "Một LED 7 đoạn là gói gồm <strong>7 đèn LED nhỏ</strong> xếp thành hình số “8” (cộng thêm một LED phụ cho dấu chấm thập phân DP). Mỗi LED tạo một đoạn (segment) và được đặt tên từ <strong>a</strong> đến <strong>g</strong>.",
      ),
      sevenSegDiagram("blank"),
      p("Để bật một đoạn, ta cần đặt <em>dòng điện</em> chạy qua LED của đoạn đó. Có hai cách đấu chung 7 chân LED, tạo ra hai loại LED 7 đoạn:"),
      el("div", { class: "grid grid-2" }, [
        el("div", { class: "card card-soft-peach" }, [
          el("h3", { text: "Anode chung (Common Anode – CA)", style: { marginTop: 0 } }),
          el("p", { html: "Tất cả các <strong>anode</strong> (cực +) của 7 LED nối chung với nhau, đưa lên <span class='mono'>V<sub>CC</sub></span>. Mỗi cathode (cực −) là một chân ra riêng." }),
          el("p", { html: "Muốn đoạn nào sáng → đặt cathode của đoạn đó xuống <strong>mức 0</strong> (LOW) để có dòng chảy. Cathode ở mức 1 → đèn tắt." }),
          el("p", { class: "small text-2", html: "Vì vậy mạch giải mã cho CA cần ngõ ra <em>tích cực mức 0</em>." }),
        ]),
        el("div", { class: "card card-soft-sky" }, [
          el("h3", { text: "Cathode chung (Common Cathode – CC)", style: { marginTop: 0 } }),
          el("p", { html: "Tất cả các <strong>cathode</strong> nối chung và đưa xuống GND. Mỗi anode là một chân ra riêng." }),
          el("p", { html: "Muốn đoạn nào sáng → đặt anode lên <strong>mức 1</strong> (HIGH). Anode ở mức 0 → đèn tắt." }),
          el("p", { class: "small text-2", html: "Mạch giải mã cho CC cần ngõ ra <em>tích cực mức 1</em>." }),
        ]),
      ]),
      el("div", { class: "alert alert-info", style: { marginTop: "10px" } }, [
        el("strong", { text: "Mẹo nhớ: " }),
        el("span", { html: "“Chung anode → ngõ ra 0 thì sáng”. Vì anode đã sẵn ở mức cao, chỉ cần kéo đầu kia xuống thấp là dòng chạy qua LED." }),
      ]),
    ),
  );

  // ===== 3. Hình ảnh / Tên các đoạn =====
  container.appendChild(
    section(
      "Tên các đoạn và cách hiển thị từng số",
      p(
        "Quy ước đặt tên các đoạn theo chiều kim đồng hồ, bắt đầu từ đoạn ngang trên cùng:",
      ),
      sevenSegDiagram("labeled"),
      el("ul", { style: { lineHeight: "1.8" } }, [
        el("li", { html: "<strong>a</strong> – đoạn ngang trên cùng." }),
        el("li", { html: "<strong>b</strong> – đoạn dọc bên phải trên." }),
        el("li", { html: "<strong>c</strong> – đoạn dọc bên phải dưới." }),
        el("li", { html: "<strong>d</strong> – đoạn ngang dưới cùng." }),
        el("li", { html: "<strong>e</strong> – đoạn dọc bên trái dưới." }),
        el("li", { html: "<strong>f</strong> – đoạn dọc bên trái trên." }),
        el("li", { html: "<strong>g</strong> – đoạn ngang chính giữa." }),
      ]),
      p("<strong>Cách hiển thị 10 chữ số 0–9 (mỗi số bật những đoạn cụ thể):</strong>"),
      digitsRow(),
      p("Ví dụ: số <strong>0</strong> bật các đoạn a, b, c, d, e, f và <em>tắt</em> g. Số <strong>1</strong> chỉ bật b và c. Số <strong>8</strong> bật cả 7 đoạn."),
    ),
  );

  // ===== 4. Mạch giải mã BCD → 7-seg (Anode chung) =====
  container.appendChild(
    section(
      "Mạch giải mã LED 7 đoạn loại Anode chung",
      p(
        "Mục tiêu: nhận 4 bit BCD <span class='mono'>D C B A</span> (D = bit cao nhất, A = bit thấp nhất, giá trị từ 0 đến 9) và xuất ra 7 tín hiệu " + segOv("a") + " " + segOv("b") + " " + segOv("c") + " " + segOv("d") + " " + segOv("e") + " " + segOv("f") + " " + segOv("g") + " để điều khiển LED Anode chung.",
      ),
      p('<strong>Quy ước ngõ ra (tích cực mức 0):</strong>'),
      el("ul", { style: { lineHeight: "1.8" } }, [
        el("li", { html: "Ngõ ra = <strong>0</strong> → đoạn đó <em>sáng</em> (cathode bị kéo xuống mass, có dòng qua LED)." }),
        el("li", { html: "Ngõ ra = <strong>1</strong> → đoạn đó <em>tắt</em> (cathode ở mức cao, không có dòng)." }),
      ]),
      p("<strong>Bảng chân trị</strong> cho 10 số 0–9 (các tổ hợp 1010…1111 là <em>don't-care</em> vì BCD chỉ tới 9):"),
      bcdSevenSegTable(),
      p("<strong>Cách rút biểu thức cho từng đoạn:</strong> với mỗi đoạn, liệt kê các giá trị D C B A mà đoạn đó <em>sáng</em> (ngõ ra = 0) — đây chính là tập <em>maxterm</em>. Dùng bìa Karnaugh 4 biến (với 6 ô don't-care từ 10–15) để rút gọn:"),
      el("div", { class: "card mono", style: { padding: "14px", textAlign: "center", lineHeight: "2.0", fontSize: "14px" } }, [
        el("div", { html: segOv("a") + " = " + ov("D") + "·" + ov("B") + "·" + ov("C") + "·A + " + ov("D") + "·C·" + ov("B") + "·" + ov("A") }),
        el("div", { html: segOv("b") + " = " + ov("D") + "·C·" + ov("B") + "·A + " + ov("D") + "·C·B·" + ov("A") }),
        el("div", { html: segOv("c") + " = " + ov("D") + "·" + ov("C") + "·B·" + ov("A") }),
        el("div", { html: "…" }),
        el("div", { class: "small text-3", style: { marginTop: "6px" }, html: "Biểu thức đầy đủ cho 7 đoạn khá dài — nên trong thực tế người ta dùng <strong>vi mạch tích hợp</strong> sẵn thay vì lắp cổng rời." }),
      ]),
    ),
  );

  // ===== 5. 74LS47 =====
  container.appendChild(
    section(
      "Vi mạch 74LS47 – giải mã BCD → 7 đoạn (Anode chung)",
      p(
        "<strong>74LS47</strong> là IC kinh điển dành riêng cho LED 7 đoạn loại Anode chung. Ngõ ra tích cực mức 0 (đảo), nối thẳng vào cathode của LED qua điện trở hạn dòng.",
      ),
      el("div", { class: "card", style: { padding: "12px" } }, [
        el("strong", { text: "Sơ đồ chân chính:" }),
        el("ul", { style: { lineHeight: "1.8", margin: "6px 0 0 0" } }, [
          el("li", { html: "<span class='mono'>A, B, C, D</span> — 4 ngõ vào BCD (A là bit thấp nhất)." }),
          el("li", { html: "<span class='mono'>" + segOv("a") + "…" + segOv("g") + "</span> — 7 ngõ ra tới các cathode của LED, tích cực mức 0." }),
          el("li", { html: "<span class='mono'>" + ov("LT") + "</span> (Lamp Test): kéo xuống 0 để <em>thử bật cả 7 đoạn</em> — dùng kiểm tra đèn còn tốt hay không." }),
          el("li", { html: "<span class='mono'>" + ov("BI") + "/" + ov("RBO") + "</span> (Blanking Input / Ripple Blanking Output): kéo xuống 0 → tắt toàn bộ 7 đoạn. Dùng để chớp số hay xoá số 0 vô nghĩa." }),
          el("li", { html: "<span class='mono'>" + ov("RBI") + "</span> (Ripple Blanking Input): khi RBI = 0 và mã vào = 0, đoạn nào cũng tắt — dùng để <em>ẩn các số 0 đầu</em> trong dãy nhiều LED ghép." }),
        ]),
      ]),
      el("div", { class: "alert alert-info", style: { marginTop: "10px" } }, [
        el("strong", { text: "IC tương tự: " }),
        el("span", { html: "74LS48 cho LED <em>Cathode chung</em> (ngõ ra tích cực mức 1). Khi đọc đề bài, chú ý loại LED để chọn IC tương ứng." }),
      ]),
      p("<strong>Sơ đồ ghép đơn giản (1 chữ số):</strong>"),
      circuit74LS47(),
    ),
  );

  // ===== 6. Common mistakes =====
  container.appendChild(
    section(
      "Lỗi thường gặp",
      el("div", { class: "grid grid-2" }, [
        el("div", { class: "card card-soft-peach" }, [
          el("h3", { text: "❶ Dùng nhầm loại IC", style: { marginTop: 0 } }),
          el("p", { html: "Ghép 74LS47 (ra mức 0) với LED Cathode chung → đèn <em>luôn sáng cả 7 đoạn</em> vì cathode đã ở mass và mọi anode đều cao. Phải đúng cặp: 74LS47 + CA, hoặc 74LS48 + CC." }),
        ]),
        el("div", { class: "card card-soft-peach" }, [
          el("h3", { text: "❷ Quên điện trở hạn dòng", style: { marginTop: 0 } }),
          el("p", { html: "Mỗi đoạn LED cần điện trở khoảng <span class='mono'>220–470 Ω</span> nối tiếp; nếu thiếu, LED có thể cháy hoặc IC quá dòng." }),
        ]),
        el("div", { class: "card card-soft-peach" }, [
          el("h3", { text: "❸ Đảo nhầm thứ tự bit", style: { marginTop: 0 } }),
          el("p", { html: "Trong 74LS47, chân A là bit thấp nhất, D là bit cao nhất — ngược với cách nhiều người viết “DCBA”. Đọc kỹ datasheet trước khi nối dây." }),
        ]),
        el("div", { class: "card card-soft-peach" }, [
          el("h3", { text: "❹ BCD lớn hơn 9", style: { marginTop: 0 } }),
          el("p", { html: "Cấp mã 1010–1111 vào 74LS47 → hiển thị các ký tự lạ (không phải A–F như IC HEX). Đảm bảo bộ đếm phía trước chỉ đếm BCD 0–9." }),
        ]),
      ]),
    ),
  );

  // ===== 7. Quiz =====
  container.appendChild(
    quizSection("seven-segment-decoder", [
      {
        prompt: "LED 7 đoạn loại Anode chung sáng khi ngõ vào cathode của đoạn đó ở mức nào?",
        options: [{ label: "Mức 1 (HIGH)" }, { label: "Mức 0 (LOW)" }, { label: "Cao trở" }, { label: "Bất kỳ" }],
        answer: 1,
        hint: "Anode đã ở V_CC, cần dòng chảy về phía thấp.",
        explanation: "Anode đã ở mức cao; kéo cathode xuống 0 mới có dòng qua LED → đoạn sáng.",
      },
      {
        prompt: "Số “1” trên LED 7 đoạn bật những đoạn nào?",
        options: [
          { label: "a, b, c" },
          { label: "b, c" },
          { label: "a, f, g" },
          { label: "c, d, e" },
        ],
        answer: 1,
        hint: "Số 1 là hai đoạn dọc bên phải.",
        explanation: "Đoạn b và c (hai đoạn dọc bên phải) sáng, các đoạn khác tắt.",
      },
      {
        prompt: "IC 74LS47 phù hợp với loại LED 7 đoạn nào?",
        options: [{ label: "Cathode chung" }, { label: "Anode chung" }, { label: "Cả hai" }, { label: "Không loại nào" }],
        answer: 1,
        hint: "Ngõ ra của 74LS47 tích cực mức 0.",
        explanation: "74LS47 ra mức 0 khi đoạn sáng → đúng với LED Anode chung. Cathode chung dùng 74LS48.",
      },
      {
        prompt: "Chức năng của chân " + ov("LT") + " trên 74LS47 là gì?",
        options: [
          { label: "Chọn loại LED" },
          { label: "Lamp Test — thử bật cả 7 đoạn" },
          { label: "Điều chỉnh độ sáng" },
          { label: "Reset bộ đếm" },
        ],
        answer: 1,
        hint: "Tên đầy đủ: Lamp Test.",
        explanation: ov("LT") + " = 0 → mạch xuất ra mức 0 ở cả 7 đoạn để bạn kiểm tra tất cả LED còn cháy không.",
      },
      {
        prompt: "Vì sao bảng chân trị giải mã BCD-7 đoạn chỉ liệt kê tới 9, mặc dù D C B A có tới 16 tổ hợp?",
        options: [
          { label: "Vì IC chỉ có 9 chân ngõ vào" },
          { label: "BCD chỉ định nghĩa cho 0–9; 10–15 là don't-care" },
          { label: "Vì LED chỉ có 9 đoạn" },
          { label: "Vì 1010–1111 không thể có trong điện tử số" },
        ],
        answer: 1,
        hint: "BCD = Binary-Coded Decimal.",
        explanation: "BCD chỉ dùng các giá trị 0000–1001 (0–9). Các tổ hợp còn lại không hợp lệ, được coi don't-care khi rút gọn bằng K-map.",
      },
      {
        prompt: "Khi nối LED 7 đoạn với 74LS47, vì sao cần điện trở hạn dòng mỗi đoạn?",
        options: [
          { label: "Để giảm tần số chớp đèn" },
          { label: "Để LED không bị cháy do dòng quá lớn" },
          { label: "Để tăng điện áp lên LED" },
          { label: "Không cần điện trở" },
        ],
        answer: 1,
        hint: "LED có điện áp rơi cố định khoảng 1.8–2 V.",
        explanation: "Mỗi LED cần dòng giới hạn (thường 5–20 mA). Điện trở khoảng 220–470 Ω giữ dòng an toàn cho LED và IC.",
      },
    ]),
  );

  // ===== 8. Summary =====
  container.appendChild(
    section(
      "Tóm tắt",
      summary(null, [
        "LED 7 đoạn gồm 7 LED tên <strong>a, b, c, d, e, f, g</strong>; bật theo tổ hợp để hiển thị các số 0–9.",
        "Hai loại đấu chung chân: <strong>Anode chung (CA)</strong> — sáng khi ngõ ra <em>= 0</em>; <strong>Cathode chung (CC)</strong> — sáng khi ngõ ra <em>= 1</em>.",
        "Mạch giải mã BCD → 7 đoạn nhận 4 bit (D C B A, BCD 0–9) và sinh 7 tín hiệu điều khiển — có thể rút gọn bằng bìa Karnaugh với 6 don't-care.",
        "<strong>74LS47</strong> là IC tích hợp sẵn cho LED CA, ngõ ra tích cực mức 0; có thêm các chức năng " + ov("LT") + ", " + ov("BI") + ", " + ov("RBI") + " hữu ích trong hệ thống nhiều chữ số.",
        "<strong>74LS48</strong> tương ứng cho LED CC. Mỗi đoạn cần điện trở hạn dòng (~220–470 Ω).",
        "Bộ đếm BCD + 74LS47 + LED 7 đoạn là khối hiển thị số đơn giản nhất trong điện tử số — nền tảng cho đồng hồ, máy đo, máy đếm.",
      ]),
    ),
  );
}

// ============================================================================
// SVG: 7-segment digit drawing
// ============================================================================

// Map 0..9 → which segments are on (object with a..g flags). Standard convention.
const DIGIT_SEGMENTS = {
  0: { a: 1, b: 1, c: 1, d: 1, e: 1, f: 1, g: 0 },
  1: { a: 0, b: 1, c: 1, d: 0, e: 0, f: 0, g: 0 },
  2: { a: 1, b: 1, c: 0, d: 1, e: 1, f: 0, g: 1 },
  3: { a: 1, b: 1, c: 1, d: 1, e: 0, f: 0, g: 1 },
  4: { a: 0, b: 1, c: 1, d: 0, e: 0, f: 1, g: 1 },
  5: { a: 1, b: 0, c: 1, d: 1, e: 0, f: 1, g: 1 },
  6: { a: 1, b: 0, c: 1, d: 1, e: 1, f: 1, g: 1 },
  7: { a: 1, b: 1, c: 1, d: 0, e: 0, f: 0, g: 0 },
  8: { a: 1, b: 1, c: 1, d: 1, e: 1, f: 1, g: 1 },
  9: { a: 1, b: 1, c: 1, d: 1, e: 0, f: 1, g: 1 },
};

// Returns an SVG element of a 7-seg digit. opts.segments: object with a..g booleans,
// opts.showLabels: true to draw a..g labels.
function sevenSegSVG(segments = {}, showLabels = false, size = 1) {
  const SVG_NS = "http://www.w3.org/2000/svg";
  const W = 80 * size, H = 130 * size;
  const svg = document.createElementNS(SVG_NS, "svg");
  svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
  svg.setAttribute("style", `width:${W}px;height:${H}px;display:block;`);

  const onColor = COLORS.logic1;
  const offColor = COLORS.surface3;
  const stroke = COLORS.text;
  const t = 12 * size;       // segment thickness
  const m = 6 * size;        // margin between segments
  const segLen = (W - 2 * m - 2 * 4 * size);

  // Segment polygons as flat hex shapes
  function segPoly(points, fillOn, label, lx, ly) {
    const poly = document.createElementNS(SVG_NS, "polygon");
    poly.setAttribute("points", points);
    poly.setAttribute("fill", fillOn ? onColor : offColor);
    poly.setAttribute("stroke", stroke);
    poly.setAttribute("stroke-width", "1");
    poly.setAttribute("stroke-linejoin", "round");
    svg.appendChild(poly);
    if (showLabels && label) {
      const txt = document.createElementNS(SVG_NS, "text");
      txt.setAttribute("x", lx);
      txt.setAttribute("y", ly);
      txt.setAttribute("font-family", "monospace");
      txt.setAttribute("font-size", String(11 * size));
      txt.setAttribute("fill", COLORS.text2);
      txt.setAttribute("text-anchor", "middle");
      txt.textContent = label;
      svg.appendChild(txt);
    }
  }

  // Compute coords for a 7-seg display
  // Top-left corner of top segment is around (cx, top)
  const x0 = 14 * size;
  const x1 = W - x0;
  const yTop = 10 * size;
  const yMid = H / 2;
  const yBot = H - yTop;

  // a — top horizontal: parallelogram
  segPoly(
    `${x0 + t/2},${yTop}  ${x1 - t/2},${yTop}  ${x1 - t},${yTop + t/2}  ${x0 + t},${yTop + t/2}`,
    segments.a, "a", W / 2, yTop - 2 * size,
  );
  // d — bottom horizontal
  segPoly(
    `${x0 + t},${yBot - t/2}  ${x1 - t},${yBot - t/2}  ${x1 - t/2},${yBot}  ${x0 + t/2},${yBot}`,
    segments.d, "d", W / 2, yBot + 10 * size,
  );
  // g — middle horizontal
  segPoly(
    `${x0 + t/2},${yMid}  ${x0 + t},${yMid - t/2}  ${x1 - t},${yMid - t/2}  ${x1 - t/2},${yMid}  ${x1 - t},${yMid + t/2}  ${x0 + t},${yMid + t/2}`,
    segments.g, "g", W / 2 + 30 * size, yMid + 3 * size,
  );
  // f — top-left vertical
  segPoly(
    `${x0},${yTop + t/2}  ${x0 + t/2},${yTop + t}  ${x0 + t/2},${yMid - t/2}  ${x0},${yMid - t/4}`,
    segments.f, "f", x0 - 8 * size, (yTop + yMid) / 2 + 4 * size,
  );
  // b — top-right vertical
  segPoly(
    `${x1},${yTop + t/2}  ${x1 - t/2},${yTop + t}  ${x1 - t/2},${yMid - t/2}  ${x1},${yMid - t/4}`,
    segments.b, "b", x1 + 8 * size, (yTop + yMid) / 2 + 4 * size,
  );
  // e — bottom-left vertical
  segPoly(
    `${x0},${yMid + t/4}  ${x0 + t/2},${yMid + t/2}  ${x0 + t/2},${yBot - t}  ${x0},${yBot - t/2}`,
    segments.e, "e", x0 - 8 * size, (yMid + yBot) / 2 + 4 * size,
  );
  // c — bottom-right vertical
  segPoly(
    `${x1},${yMid + t/4}  ${x1 - t/2},${yMid + t/2}  ${x1 - t/2},${yBot - t}  ${x1},${yBot - t/2}`,
    segments.c, "c", x1 + 8 * size, (yMid + yBot) / 2 + 4 * size,
  );

  return svg;
}

function sevenSegDiagram(mode) {
  if (mode === "labeled") {
    const allOn = { a: 0.5, b: 0.5, c: 0.5, d: 0.5, e: 0.5, f: 0.5, g: 0.5 };
    // Use light-on style so labels are visible
    const wrap = el("div", { style: { display: "flex", justifyContent: "center", padding: "10px 0" } });
    wrap.appendChild(sevenSegSVG(allOn, true, 1.4));
    return el("div", { class: "card", style: { padding: "8px" } }, [wrap]);
  }
  // blank
  const wrap = el("div", { style: { display: "flex", justifyContent: "center", padding: "10px 0" } });
  wrap.appendChild(sevenSegSVG({}, false, 1.4));
  return el("div", { class: "card", style: { padding: "8px" } }, [wrap]);
}

function digitsRow() {
  const wrap = el("div", {
    class: "card",
    style: {
      padding: "12px",
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "center",
      gap: "12px",
    },
  });
  for (let d = 0; d <= 9; d++) {
    const cell = el("div", { style: { textAlign: "center" } });
    cell.appendChild(sevenSegSVG(DIGIT_SEGMENTS[d], false, 0.7));
    cell.appendChild(el("div", { class: "small text-2", style: { marginTop: "4px" }, text: `Số ${d}` }));
    wrap.appendChild(cell);
  }
  return wrap;
}

function bcdSevenSegTable() {
  const segNames = ["a", "b", "c", "d", "e", "f", "g"];
  const rows = [];
  for (let n = 0; n <= 9; n++) {
    const d = (n >> 3) & 1, c = (n >> 2) & 1, b = (n >> 1) & 1, a = n & 1;
    const seg = DIGIT_SEGMENTS[n];
    // For common anode: output = 0 when segment ON, 1 when OFF
    const outs = segNames.map((s) => seg[s] ? 0 : 1);
    rows.push({ n, d, c, b, a, outs });
  }
  return el("div", { class: "card", style: { overflowX: "auto" } }, [
    el("table", { class: "tbl tbl-bordered", style: { fontSize: "13px", margin: "0 auto" } }, [
      el("thead", {}, [
        el("tr", {}, [
          el("th", { text: "Số" }),
          el("th", { text: "D" }),
          el("th", { text: "C" }),
          el("th", { text: "B" }),
          el("th", { text: "A" }),
          ...segNames.map((s) => el("th", { html: segOv(s) })),
        ]),
      ]),
      el("tbody", {}, rows.map((r) =>
        el("tr", {}, [
          el("td", { class: "mono", style: { textAlign: "center", fontWeight: "700" }, text: String(r.n) }),
          el("td", { class: "mono", style: { textAlign: "center", background: r.d ? COLORS.logic1Bg : COLORS.logic0Bg }, text: String(r.d) }),
          el("td", { class: "mono", style: { textAlign: "center", background: r.c ? COLORS.logic1Bg : COLORS.logic0Bg }, text: String(r.c) }),
          el("td", { class: "mono", style: { textAlign: "center", background: r.b ? COLORS.logic1Bg : COLORS.logic0Bg }, text: String(r.b) }),
          el("td", { class: "mono", style: { textAlign: "center", background: r.a ? COLORS.logic1Bg : COLORS.logic0Bg }, text: String(r.a) }),
          ...r.outs.map((v) =>
            el("td", {
              class: "mono",
              style: {
                textAlign: "center",
                fontWeight: "700",
                background: v === 0 ? COLORS.logic1Bg : COLORS.surface,
                color: v === 0 ? COLORS.text : COLORS.text3,
              },
              text: String(v),
            }),
          ),
        ]),
      )),
    ]),
    el("p", { class: "small text-3", style: { textAlign: "center", marginTop: "6px" }, html: "Cột ngõ ra tô sáng = giá trị 0 = đoạn đang sáng (đối với LED Anode chung)." }),
  ]);
}

function circuit74LS47() {
  return el("div", { class: "card", style: { padding: "14px" } }, [
    el("div", { class: "mono", style: { textAlign: "center", lineHeight: "1.9", fontSize: "13.5px" } }, [
      el("div", { html: "BCD vào ──▶ <strong>[ 74LS47 ]</strong> ──▶ 7 ngõ ra (mức 0 khi sáng)" }),
      el("div", { class: "small text-3", style: { marginTop: "4px" }, text: "Mỗi ngõ ra qua một điện trở ~330 Ω rồi vào cathode tương ứng của LED Anode chung." }),
      el("div", { style: { marginTop: "10px" }, html: "V<sub>CC</sub> ──┬── anode chung của LED" }),
      el("div", { html: "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;└── chân V<sub>CC</sub> của IC 74LS47" }),
    ]),
    el("p", { class: "small text-2", style: { marginTop: "10px" }, html: "Sơ đồ rút gọn: chỉ cần BCD → IC → 7 điện trở → 7 cathode → LED. Ghép nhiều IC + nhiều LED tạo ra dãy hiển thị nhiều chữ số (ví dụ đồng hồ HH:MM:SS có 6 chữ số)." }),
  ]);
}

function segOv(name) {
  return ov(name);
}
