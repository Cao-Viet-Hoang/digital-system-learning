// Lesson 21: Đơn giản bìa Karnaugh theo POS.
import { el, clear } from "../utils/dom.js";
import { section, summary, quizSection, p, splitView, resetSectionCounter, toolCTA } from "../utils/lesson-ui.js";
import { COLORS } from "../utils/colors.js";

const ov = (t) => `<span style="text-decoration:overline">${t}</span>`;

const GROUP_COLORS = [
  { fill: "rgba(107, 168, 224, 0.40)", stroke: COLORS.skyDeep },
  { fill: "rgba(240, 162, 116, 0.35)", stroke: COLORS.peachDeep },
  { fill: "rgba(126, 200, 166, 0.35)", stroke: COLORS.mintDeep },
  { fill: "rgba(155, 140, 217, 0.35)", stroke: COLORS.lavenderDeep },
  { fill: "rgba(230, 201, 90, 0.40)", stroke: COLORS.butterDeep },
];

export default {
  id: "karnaugh-pos",
  order: 21,
  title: "Đơn giản bìa Karnaugh theo hàm POS",
  subtitle: "Gộp các ô 0 lại để tạo biểu thức tích các tổng ngắn gọn nhất.",
  objective:
    "Áp dụng quy tắc bìa Karnaugh cho dạng tích các tổng (POS); biết cách rút ra số hạng tổng từ một nhóm ô 0; so sánh với SOP; lựa chọn dạng phù hợp cho mạch.",
  render,
};

function render(container) {
  resetSectionCounter();
  clear(container);

  container.appendChild(
    section(
      "Vì sao học cả POS?",
      p(
        "Bài trước ta gộp các ô <em>bằng 1</em> để có biểu thức <strong>SOP</strong> (tổng các tích). Nhưng đôi khi hàm có nhiều ô 0 hơn ô 1 — gộp ô 0 sẽ cho biểu thức ngắn hơn. Đây chính là dạng <strong>POS</strong> (Product of Sums — tích các tổng).",
      ),
      p(
        "Ngoài ra, một số công nghệ phần cứng dễ hiện thực OR-AND hơn AND-OR (ví dụ mạch có sẵn nhiều cổng NOR). Hai dạng SOP và POS luôn cho cùng bảng chân trị nhưng cấu trúc cổng khác nhau — biết cả hai giúp bạn chọn được dạng tối ưu.",
      ),
    ),
  );

  // Core idea
  container.appendChild(
    section(
      "Ý tưởng cốt lõi",
      p(
        "Nguyên tắc rất giống SOP — chỉ đổi vai trò 0 ↔ 1 và phép toán:",
      ),
      el("div", { class: "card", style: { overflowX: "auto" } }, [
        el("table", { class: "tbl tbl-bordered" }, [
          el("thead", {}, [
            el("tr", {}, [
              el("th", { text: "Yếu tố" }),
              el("th", { text: "SOP (bài trước)" }),
              el("th", { text: "POS (bài này)" }),
            ]),
          ]),
          el("tbody", {}, [
            row(["Gộp các ô", "1", "0"]),
            row(["Mỗi nhóm tạo ra", "Một tích (AND)", "Một tổng (OR)"]),
            row(["Kết quả là", "Tổng các tích (Y = …+…+…)", "Tích các tổng (Y = (…)·(…)·…)"]),
            row(["Biến trong nhóm cố định = 0", "Lấy bù", "Giữ nguyên (không đảo)"]),
            row(["Biến trong nhóm cố định = 1", "Giữ nguyên", "Lấy bù"]),
          ]),
        ]),
      ]),
      el("div", { class: "alert alert-info", style: { marginTop: "10px" } }, [
        el("strong", { text: "Vì sao đảo dấu? " }),
        el("span", { html: "Một tổng <span class='mono'>(A + " + ov("B") + ")</span> bằng 0 khi và chỉ khi A = 0 và " + ov("B") + " = 0 (tức B = 1). Nghĩa là khi viết tổng đại diện cho một nhóm ô 0, biến giá trị 1 phải được <em>đảo</em> để khi điền giá trị thật vào, tổng đó đúng bằng 0." }),
      ]),
    ),
  );

  // Quick worked rule
  container.appendChild(
    section(
      "Quy tắc rút số hạng từ một nhóm ô 0",
      el("div", { class: "card", style: { padding: "16px" } }, [
        el("ol", { style: { lineHeight: "1.9", margin: 0, paddingLeft: "20px" } }, [
          el("li", { html: "Xác định các biến giữ nguyên trong nhóm và giá trị của chúng." }),
          el("li", { html: "Mỗi biến giữ nguyên ⇒ một <em>literal</em> trong tổng:" }),
          el("ul", { style: { marginTop: "4px" } }, [
            el("li", { html: "Biến cố định <strong>0</strong> ⇒ giữ nguyên (vd. A)." }),
            el("li", { html: "Biến cố định <strong>1</strong> ⇒ lấy bù (vd. " + ov("A") + ")." }),
          ]),
          el("li", { html: "Cộng các literal lại bằng dấu '+' rồi đóng ngoặc → ra một thừa số." }),
          el("li", { html: "Tích tất cả các thừa số (mỗi nhóm) cho biểu thức POS cuối." }),
        ]),
      ]),
      el("div", { class: "card mono", style: { padding: "12px", marginTop: "8px", textAlign: "center", fontSize: "14px" } }, [
        el("div", { html: "Ví dụ: nhóm có A = 1 và B = 0 (C đổi) ⇒ số hạng: (" + ov("A") + " + B)." }),
        el("div", { class: "small text-3", style: { marginTop: "4px" }, html: "Kiểm tra: A = 1, B = 0 → " + ov("A") + " = 0 và B = 0 → tổng = 0 ✓ — đúng là maxterm." }),
      ]),
    ),
  );

  // Example 1 — 3-var simple
  container.appendChild(
    section(
      "Ví dụ 1 – Bìa 3 biến",
      p("Hàm có Y = 0 ở các ô m0, m1, m4, m5. Mục tiêu: viết Y dạng POS rút gọn."),
      kmap3WithGroupsPOS([0, 1, 4, 5], [
        { cells: [0, 1, 4, 5], color: 0, label: "B" },
      ]),
      el("div", { class: "card", style: { padding: "14px", marginTop: "10px" } }, [
        el("p", { html: "Nhóm 4 ô (toàn cột BC=00 và BC=01) — tất cả có B = 0; A đổi (0/1), C đổi (0/1). Hai biến đổi → loại; chỉ còn B = 0 → literal là <span class='mono'>B</span> (giữ nguyên, không đảo)." }),
          el("p", { html: "Kết quả: <strong><span class='mono'>Y = B</span></strong>. Chỉ một thừa số duy nhất — không thể đơn giản hơn." }),
      ]),
    ),
  );

  // Example 2 — 3-var two groups
  container.appendChild(
    section(
      "Ví dụ 2 – Hai nhóm POS",
      p("Hàm có Y = 0 ở m0, m2, m4, m6 (cột BC=00 và BC=10 — wrap) và m7. Lưu ý: m7 đứng một mình → nhóm 1 ô."),
      kmap3WithGroupsPOS([0, 2, 4, 6, 7], [
        { cells: [0, 2, 4, 6], color: 0, label: "C" },
        { cells: [7], color: 1, label: ov("A") + " + " + ov("B") + " + " + ov("C") },
      ]),
      el("div", { class: "card", style: { padding: "14px", marginTop: "10px" } }, [
        el("ol", { style: { lineHeight: "1.9", margin: 0, paddingLeft: "20px" } }, [
          el("li", { html: "<strong>Nhóm xanh (4 ô gấp vòng):</strong> tất cả có C = 0. A và B đổi → loại. C = 0 → literal <span class='mono'>C</span>. Thừa số: <span class='mono'>(C)</span>." }),
          el("li", { html: "<strong>Nhóm cam (1 ô — m7):</strong> A = B = C = 1; cả ba biến giữ nguyên 1 → đảo tất cả. Thừa số: <span class='mono'>(" + ov("A") + " + " + ov("B") + " + " + ov("C") + ")</span>." }),
          el("li", { html: "<strong>Kết quả:</strong> <span class='mono'>Y = C · (" + ov("A") + " + " + ov("B") + " + " + ov("C") + ")</span>." }),
        ]),
        el("p", { class: "small text-2", html: "Lưu ý: nhóm 1 ô = maxterm đầy đủ (không rút gọn được). Luôn cố gắng mở rộng nhóm nhưng đôi khi 1 ô bị 'cô lập' là không tránh khỏi." }),
      ]),
    ),
  );

  // Example 3 — 4-variable
  container.appendChild(
    section(
      "Ví dụ 3 – Bìa 4 biến",
      p("Cho hàm 4 biến có Y = 0 ở các ô m0, m1, m4, m5, m12, m13, m14, m15. Mục tiêu: viết Y dạng POS rút gọn."),
      kmap4WithGroupsPOS([0, 1, 4, 5, 12, 13, 14, 15], [
        { cells: [0, 1, 4, 5], color: 0, label: "A + C" },
        { cells: [12, 13, 14, 15], color: 1, label: ov("A") + " + " + ov("B") },
      ]),
      el("div", { class: "card", style: { padding: "14px", marginTop: "10px" } }, [
        el("ol", { style: { lineHeight: "1.9", margin: 0, paddingLeft: "20px" } }, [
          el("li", { html: "<strong>Nhóm xanh — vuông 2×2 trên-trái (m0, m1, m4, m5):</strong> chiếm hai hàng AB=00 và AB=01, hai cột CD=00 và CD=01. Phân tích: A = 0 cố định, B đổi (loại); C = 0 cố định, D đổi (loại). Hai biến cố định = 0 → giữ nguyên. Thừa số: <span class='mono'>(A + C)</span>." }),
          el("li", { html: "<strong>Nhóm cam — cả hàng AB=11 (m12, m13, m14, m15):</strong> A = 1, B = 1 cố định; C, D đổi → loại. Hai biến cố định = 1 → đảo. Thừa số: <span class='mono'>(" + ov("A") + " + " + ov("B") + ")</span>." }),
          el("li", { html: "<strong>Kết quả:</strong> <span class='mono'>Y = (A + C) · (" + ov("A") + " + " + ov("B") + ")</span>." }),
        ]),
        el("p", { class: "small text-2", html: "Kiểm tra nhanh: tại m4 (A=0, B=1, C=0, D=0): (0 + 0)·(1 + 0) = 0·1 = 0 ✓. Tại m12 (A=1, B=1, C=0, D=0): (1 + 0)·(0 + 0) = 1·0 = 0 ✓. Tại m3 (A=0, B=0, C=1, D=1): (0 + 1)·(1 + 1) = 1·1 = 1 ✓." }),
      ]),
    ),
  );

  // SOP vs POS comparison
  container.appendChild(
    section(
      "Khi nào nên dùng POS?",
      p(
        "Nhìn vào bìa K của hàm: nếu <strong>ô 1 ít hơn ô 0</strong>, dùng SOP. Nếu <strong>ô 0 ít hơn ô 1</strong>, dùng POS.",
      ),
      kmapComparisonExample(),
      el("div", { class: "card", style: { padding: "14px", marginTop: "10px" } }, [
        el("p", { html: "Ở bìa trên: chỉ có <strong>2 ô bằng 0</strong> (m0 và m2) nhưng có 6 ô bằng 1. Gộp hai ô 0 (cùng hàng A=0, hai cột BC=00 và BC=10 — gấp vòng): A=0 và C=0 cố định, B đổi." }),
        el("ul", { style: { lineHeight: "1.8" } }, [
          el("li", { html: "<strong>POS:</strong> chỉ một thừa số → <span class='mono'>Y = (A + C)</span> — rất ngắn." }),
          el("li", { html: "<strong>SOP:</strong> phải phủ 6 ô 1 → ít nhất 2-3 tích, biểu thức dài hơn nhiều." }),
        ]),
      ]),
    ),
  );

  // Two equivalent forms
  container.appendChild(
    section(
      "Hai biểu thức – cùng một hàm",
      p("Cùng hàm Y = m1 + m3 + m6 + m7 (bài 19) có thể viết theo hai cách:"),
      el("div", { class: "grid grid-2" }, [
        el("div", { class: "card card-soft-mint" }, [
          el("h3", { text: "Dạng SOP", style: { marginTop: 0 } }),
          el("div", { class: "mono", style: { fontSize: "16px", textAlign: "center" }, html: "Y = " + ov("A") + "·C + A·B" }),
          el("p", { class: "small text-2", html: "Mạch: 2 cổng AND + 1 cổng OR (cộng 1 NOT cho " + ov("A") + ")." }),
        ]),
        el("div", { class: "card card-soft-sky" }, [
          el("h3", { text: "Dạng POS", style: { marginTop: 0 } }),
          el("div", { class: "mono", style: { fontSize: "16px", textAlign: "center" }, html: "Y = (A + C) · (" + ov("A") + " + B)" }),
          el("p", { class: "small text-2", html: "Mạch: 2 cổng OR + 1 cổng AND (cộng NOT)." }),
        ]),
      ]),
      el("p", { style: { marginTop: "10px" }, html: "Hai biểu thức cho cùng bảng chân trị nhưng cấu trúc khác nhau — SOP dùng AND-OR, POS dùng OR-AND. Trong trường hợp này hai dạng có số literal bằng nhau (4); tuỳ công nghệ cổng có sẵn mà chọn dạng nào để hiện thực." }),
    ),
  );

  // Common mistakes
  container.appendChild(
    section(
      "Lỗi phổ biến với POS",
      el("div", { class: "grid grid-2" }, [
        el("div", { class: "card card-soft-peach" }, [
          el("h3", { text: "❶ Quên đảo dấu", style: { marginTop: 0 } }),
          el("p", { html: "Nhầm sang quy tắc SOP — biến cố định 1 lấy bù chứ không phải biến cố định 0. Hãy nhớ: POS đảo ngược SOP về dấu." }),
        ]),
        el("div", { class: "card card-soft-peach" }, [
          el("h3", { text: "❷ Dùng dấu '·' giữa các literal", style: { marginTop: 0 } }),
          el("p", { html: "Trong một thừa số POS, các literal nối bằng dấu '+'. Dấu '·' chỉ dùng để nhân <em>giữa</em> các thừa số." }),
        ]),
        el("div", { class: "card card-soft-peach" }, [
          el("h3", { text: "❸ Quên phủ tất cả ô 0", style: { marginTop: 0 } }),
          el("p", { text: "Cũng giống SOP nhưng với ô 0 — không được bỏ sót maxterm nào." }),
        ]),
        el("div", { class: "card card-soft-peach" }, [
          el("h3", { text: "❹ Don't-care vẫn dùng được", style: { marginTop: 0 } }),
          el("p", { text: "X có thể coi là 0 hoặc 1 — tự do chọn để mở rộng nhóm ô 0 cho nhóm POS to hơn." }),
        ]),
      ]),
    ),
  );

  container.appendChild(
    section(
      "Luyện tập SOP và POS với công cụ",
      toolCTA({
        title: "So sánh SOP ↔ POS trên cùng một bìa K",
        description:
          "Vào trang <strong>Tối ưu bìa K</strong>, bật chế độ <em>Luyện tập</em> để hệ thống sinh đề ngẫu nhiên. Với mỗi đề, hãy tự rút gọn <strong>cả SOP lẫn POS</strong> trên giấy, rồi chuyển nút <em>Phương pháp</em> giữa hai chế độ để đối chiếu — nhanh chóng cảm nhận khi nào POS ngắn hơn SOP và ngược lại.",
        buttonText: "Mở công cụ luyện tập →",
        href: "#/kmap-solver",
        hint: "Mẹo: cùng một bìa K, đổi SOP ↔ POS sẽ tự ẩn đáp án để bạn thử lại.",
      }),
    ),
  );

  container.appendChild(
    quizSection("karnaugh-pos", [
      {
        prompt: "Khi rút gọn theo POS, ta gộp các ô có giá trị nào?",
        options: [{ label: "1" }, { label: "0" }, { label: "X" }, { label: "Bất kỳ" }],
        answer: 1,
        hint: "POS lấy maxterm — mỗi maxterm tương ứng một hàng Y = 0.",
        explanation: "POS gộp ô 0 (maxterm); SOP gộp ô 1 (minterm).",
      },
      {
        prompt: "Trong một nhóm POS, biến cố định = 1 sẽ xuất hiện trong tổng dưới dạng?",
        options: [
          { label: "Giữ nguyên" },
          { label: "Lấy bù (đảo)" },
          { label: "Không xuất hiện" },
          { label: "Được nhân với chính nó" },
        ],
        answer: 1,
        hint: "Phải đảm bảo tổng bằng 0 ở vị trí ô đó.",
        explanation: `Nếu A = 1 trong nhóm, để tổng = 0 ta cần ${ov("A")} = 0 → đưa ${ov("A")} vào tổng.`,
      },
      {
        prompt: "Một nhóm 4 ô 0 trên bìa 3 biến nằm gọn trong cột BC=00 và BC=01 (cùng hàng A=0). Thừa số rút ra là?",
        options: [
          { label: "A + B" },
          { label: "A + " + ov("B") },
          { label: ov("A") + " + B" },
          { label: "A" },
        ],
        answer: 3,
        hint: "Xác định biến cố định: A = 0, B = 0; C đổi.",
        explanation: "Chờ — hai cột BC=00 và BC=01 có B=0 chung và C đổi. Cùng hàng A=0 → A cố định 0. Hai biến cố định: A=0 → A; B=0 → B. Thừa số: (A + B).",
      },
      {
        prompt: "Cùng một hàm có thể viết bằng SOP hoặc POS. Khi nào nên chọn POS?",
        options: [
          { label: "Luôn luôn" },
          { label: "Khi số ô 0 trên bìa K nhiều hơn ô 1" },
          { label: "Khi số ô 0 trên bìa K ít hơn ô 1" },
          { label: "Khi mạch dùng cổng AND" },
        ],
        answer: 2,
        hint: "Ít ô để gộp → ít nhóm → biểu thức ngắn.",
        explanation: "Ô 0 ít → gộp dễ và biểu thức POS ngắn. Ngược lại chọn SOP.",
      },
      {
        prompt: "Trong POS, các literal trong cùng một thừa số nối bằng phép gì?",
        options: [{ label: "AND (·)" }, { label: "OR (+)" }, { label: "XOR (⊕)" }, { label: "NOT" }],
        answer: 1,
        hint: "Một thừa số là một 'tổng'.",
        explanation: "Thừa số POS là một tổng → các literal cộng nhau bằng '+'. Các thừa số nhân nhau bằng '·'.",
      },
      {
        prompt: `Nhóm 1 ô (m7 trên bìa 3 biến: A=B=C=1) cho thừa số POS là?`,
        options: [
          { label: "A + B + C" },
          { label: `${ov("A")} + ${ov("B")} + ${ov("C")}` },
          { label: "A·B·C" },
          { label: `${ov("A·B·C")}` },
        ],
        answer: 1,
        hint: "Cả ba biến cố định = 1 → đảo cả ba.",
        explanation: `Tổng = 0 khi A=1, B=1, C=1 ⇒ cần ${ov("A")}+${ov("B")}+${ov("C")} = 0+0+0 = 0 ✓.`,
      },
    ]),
  );

  container.appendChild(
    section(
      "Tóm tắt",
      summary(null, [
        "<strong>POS</strong> = tích các tổng — gộp các ô 0 trên bìa K.",
        "Mỗi nhóm ô 0 cho một <em>tổng</em>; tích các tổng = biểu thức POS.",
        "Biến cố định <strong>0 → giữ nguyên</strong>; biến cố định <strong>1 → đảo</strong> (ngược với SOP).",
        "Các quy tắc gộp (size 2<sup>k</sup>, hình chữ nhật, gấp vòng, chồng lấp, phủ hết) giống y SOP.",
        "Chọn POS khi <em>ô 0 ít hơn ô 1</em>; chọn SOP khi ngược lại.",
        "Don't-care vẫn dùng được — tự do coi 0/1 để mở rộng nhóm.",
        "Hai dạng SOP và POS cho cùng giá trị — chọn dạng đơn giản hơn theo từng bài.",
      ]),
    ),
  );
}

// ===========================================================================
// K-map renderers for POS (zero-minterm list and group overlays).
// ===========================================================================

const BC_GRAY = [
  { b: 0, c: 0 },
  { b: 0, c: 1 },
  { b: 1, c: 1 },
  { b: 1, c: 0 },
];
const AB_GRAY = [
  { a: 0, b: 0 },
  { a: 0, b: 1 },
  { a: 1, b: 1 },
  { a: 1, b: 0 },
];

// Top-left corner cell — SVG diagonal slash splits the cell; row variable
// sits in the bottom-left triangle, column variable in the top-right.
function cornerHeader(rowVar, colVar) {
  const W = 64, H = 40;
  return el("th", {
    class: "kmap-corner",
    style: {
      border: `1.5px solid ${COLORS.borderStrong}`,
      width: `${W}px`,
      height: `${H}px`,
    },
    html: `
      <svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none"
           style="display:block; width:100%; height:100%;">
        <line x1="0" y1="0" x2="${W}" y2="${H}"
              stroke="${COLORS.borderStrong}" stroke-width="1.2"
              vector-effect="non-scaling-stroke" />
        <text x="${W - 5}" y="13" text-anchor="end"
              font-family="JetBrains Mono, ui-monospace, monospace"
              font-size="13" font-weight="700" fill="${COLORS.skyDeep}">${colVar}</text>
        <text x="5" y="${H - 5}" text-anchor="start"
              font-family="JetBrains Mono, ui-monospace, monospace"
              font-size="13" font-weight="700" fill="${COLORS.peachDeep}">${rowVar}</text>
      </svg>
    `,
  });
}

function pos3(idx) {
  const a = (idx >> 2) & 1;
  const b = (idx >> 1) & 1;
  const c = idx & 1;
  const row = a;
  const col = BC_GRAY.findIndex((g) => g.b === b && g.c === c);
  return { row, col };
}

function pos4(idx) {
  const a = (idx >> 3) & 1;
  const b = (idx >> 2) & 1;
  const c = (idx >> 1) & 1;
  const d = idx & 1;
  const row = AB_GRAY.findIndex((g) => g.a === a && g.b === b);
  const col = BC_GRAY.findIndex((g) => g.b === c && g.c === d);
  return { row, col };
}

function kmap3WithGroupsPOS(zeroMinterms, groups, opts = {}) {
  return kmapWithGroupsPOS({
    vars: 3, rows: 2, cols: 4, zeroMinterms, groups, opts, pos: pos3,
    rowLabel: (r) => String(r), colLabel: (c) => ["00", "01", "11", "10"][c],
    rowVar: "A", colVar: "BC",
  });
}

function kmap4WithGroupsPOS(zeroMinterms, groups, opts = {}) {
  return kmapWithGroupsPOS({
    vars: 4, rows: 4, cols: 4, zeroMinterms, groups, opts, pos: pos4,
    rowLabel: (r) => ["00", "01", "11", "10"][r], colLabel: (c) => ["00", "01", "11", "10"][c],
    rowVar: "AB", colVar: "CD",
  });
}

function kmapWithGroupsPOS({ vars, rows, cols, zeroMinterms, groups, opts, pos, rowLabel, colLabel, rowVar, colVar }) {
  const zeros = new Set(zeroMinterms || []);
  const dontcares = new Set(opts.dontcares || []);

  const CELL_W = 56, CELL_H = 56;
  const HEAD_W = 64, HEAD_H = 40;

  const wrap = el("div", { class: "card", style: { padding: "12px", display: "flex", flexDirection: "column", alignItems: "center" } });
  const scroll = el("div", { class: "kmap-scroll" });
  const stage = el("div", { class: "kmap-stage", style: { position: "relative", display: "inline-block" } });

  const table = el("table", { class: "kmap", style: { borderCollapse: "collapse", tableLayout: "fixed" } });

  const colgroup = document.createElement("colgroup");
  const headCol = document.createElement("col");
  headCol.style.width = `${HEAD_W}px`;
  colgroup.appendChild(headCol);
  for (let c = 0; c < cols; c++) {
    const cc = document.createElement("col");
    cc.style.width = `${CELL_W}px`;
    colgroup.appendChild(cc);
  }
  table.appendChild(colgroup);

  const headerRow = el("tr");
  headerRow.appendChild(cornerHeader(rowVar, colVar));
  for (let c = 0; c < cols; c++) {
    headerRow.appendChild(el("th", {
      text: colLabel(c),
      style: { ...hStyle(), height: `${HEAD_H}px` },
    }));
  }
  table.appendChild(headerRow);

  for (let r = 0; r < rows; r++) {
    const tr = el("tr");
    tr.appendChild(el("th", { text: rowLabel(r), style: { ...hStyle(), height: `${CELL_H}px` } }));
    for (let c = 0; c < cols; c++) {
      const idx = mintermFromPos(vars, r, c);
      const isZero = zeros.has(idx);
      const isX = dontcares.has(idx);
      const val = isX ? "X" : isZero ? "0" : "1";
      const bg = isX ? COLORS.logicXBg : isZero ? COLORS.logic0Bg : COLORS.logic1Bg;
      const td = el("td", {
        style: {
          height: `${CELL_H}px`,
          border: `1.5px solid ${COLORS.borderStrong}`,
          textAlign: "center",
          verticalAlign: "middle",
          position: "relative",
          background: bg,
          fontFamily: "var(--font-mono)",
          fontWeight: "700",
          fontSize: "20px",
          color: COLORS.text,
        },
        text: val,
      }, [
        el("span", {
          style: {
            position: "absolute",
            top: "2px",
            left: "4px",
            fontSize: "10px",
            fontWeight: "400",
            color: COLORS.text3,
          },
          text: String(idx),
        }),
      ]);
      td.dataset.mt = String(idx);
      tr.appendChild(td);
    }
    table.appendChild(tr);
  }
  stage.appendChild(table);

  const overlayPlans = [];
  (groups || []).forEach((g) => {
    const color = GROUP_COLORS[g.color % GROUP_COLORS.length];
    const segments = groupSegments(g.cells, pos, cols);
    segments.forEach((seg) => {
      const overlay = el("div", {
        style: {
          position: "absolute",
          background: color.fill,
          border: `2.5px solid ${color.stroke}`,
          borderRadius: "10px",
          pointerEvents: "none",
          boxSizing: "border-box",
          left: `${HEAD_W + seg.colStart * CELL_W + 3}px`,
          top: `${HEAD_H + seg.rowStart * CELL_H + 3}px`,
          width: `${(seg.colEnd - seg.colStart + 1) * CELL_W - 6}px`,
          height: `${(seg.rowEnd - seg.rowStart + 1) * CELL_H - 6}px`,
        },
      });
      stage.appendChild(overlay);
      overlayPlans.push({ overlay, seg });
    });
  });

  scroll.appendChild(stage);
  wrap.appendChild(scroll);

  function snapOverlays() {
    if (!table.isConnected || table.offsetWidth === 0) {
      requestAnimationFrame(snapOverlays);
      return;
    }
    const stageRect = stage.getBoundingClientRect();
    overlayPlans.forEach(({ overlay, seg }) => {
      const firstIdx = mintermFromPos(vars, seg.rowStart, seg.colStart);
      const lastIdx = mintermFromPos(vars, seg.rowEnd, seg.colEnd);
      const firstCell = table.querySelector(`td[data-mt="${firstIdx}"]`);
      const lastCell = table.querySelector(`td[data-mt="${lastIdx}"]`);
      if (!firstCell || !lastCell) return;
      const r1 = firstCell.getBoundingClientRect();
      const r2 = lastCell.getBoundingClientRect();
      const inset = 3;
      overlay.style.left = `${r1.left - stageRect.left + inset}px`;
      overlay.style.top = `${r1.top - stageRect.top + inset}px`;
      overlay.style.width = `${r2.right - r1.left - 2 * inset}px`;
      overlay.style.height = `${r2.bottom - r1.top - 2 * inset}px`;
    });
  }
  if (overlayPlans.length) {
    requestAnimationFrame(snapOverlays);
  }

  if (groups && groups.length) {
    const legend = el("div", { style: { display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center", marginTop: "10px" } });
    groups.forEach((g) => {
      const color = GROUP_COLORS[g.color % GROUP_COLORS.length];
      legend.appendChild(el("div", { style: { display: "flex", alignItems: "center", gap: "6px" } }, [
        el("span", { style: {
          display: "inline-block", width: "14px", height: "14px", borderRadius: "4px",
          background: color.fill, border: `2px solid ${color.stroke}`,
        } }),
        el("span", { class: "mono", style: { fontSize: "13px" }, html: "(" + g.label + ")" }),
      ]));
    });
    wrap.appendChild(legend);
  }
  return wrap;
}

// Comparison K-map: hàm có nhiều 1 hơn 0.
function kmapComparisonExample() {
  // Y = 0 only at m0 and m2 (3-var). Two zeros only.
  return kmap3WithGroupsPOS([0, 2], [
    { cells: [0, 2], color: 0, label: "A + C" },
  ]);
}

function mintermFromPos(vars, r, c) {
  if (vars === 3) {
    const a = r;
    const { b, c: cc } = BC_GRAY[c];
    return a * 4 + b * 2 + cc;
  }
  const { a, b } = AB_GRAY[r];
  const { b: cc, c: d } = BC_GRAY[c];
  return a * 8 + b * 4 + cc * 2 + d;
}

function groupSegments(cells, pos, cols) {
  const rowToCols = new Map();
  cells.forEach((idx) => {
    const { row, col } = pos(idx);
    if (!rowToCols.has(row)) rowToCols.set(row, new Set());
    rowToCols.get(row).add(col);
  });

  const rowRanges = new Map();
  rowToCols.forEach((set, row) => {
    const arr = [...set].sort((a, b) => a - b);
    const ranges = [];
    const wraps = set.has(0) && set.has(cols - 1) && !isFullContiguous(arr, cols);
    if (wraps) {
      let r = cols - 1;
      while (set.has(r) && r >= 0) r--;
      ranges.push({ start: r + 1, end: cols - 1 });
      let l = 0;
      while (set.has(l) && l < cols) l++;
      ranges.push({ start: 0, end: l - 1 });
    } else {
      let runStart = arr[0], prev = arr[0];
      for (let i = 1; i < arr.length; i++) {
        if (arr[i] === prev + 1) prev = arr[i];
        else {
          ranges.push({ start: runStart, end: prev });
          runStart = arr[i]; prev = arr[i];
        }
      }
      ranges.push({ start: runStart, end: prev });
    }
    rowRanges.set(row, ranges);
  });

  const segments = [];
  const rows = [...rowRanges.keys()].sort((a, b) => a - b);
  const individual = [];
  rows.forEach((row) => {
    rowRanges.get(row).forEach((rng) => {
      individual.push({ rowStart: row, rowEnd: row, colStart: rng.start, colEnd: rng.end });
    });
  });

  const buckets = new Map();
  individual.forEach((s) => {
    const k = `${s.colStart}_${s.colEnd}`;
    if (!buckets.has(k)) buckets.set(k, []);
    buckets.get(k).push(s);
  });
  buckets.forEach((segs) => {
    segs.sort((a, b) => a.rowStart - b.rowStart);
    let cur = { ...segs[0] };
    for (let i = 1; i < segs.length; i++) {
      if (segs[i].rowStart === cur.rowEnd + 1) {
        cur.rowEnd = segs[i].rowEnd;
      } else {
        segments.push(cur);
        cur = { ...segs[i] };
      }
    }
    segments.push(cur);
  });
  return segments;
}

function isFullContiguous(arr, cols) {
  if (arr.length !== cols) return false;
  for (let i = 0; i < cols; i++) if (arr[i] !== i) return false;
  return true;
}

function hStyle() {
  return {
    background: COLORS.surface2,
    color: COLORS.text2,
    fontFamily: "var(--font-mono)",
    fontWeight: "600",
    fontSize: "13px",
    padding: "6px 10px",
    border: `1.5px solid ${COLORS.borderStrong}`,
    textAlign: "center",
  };
}

function row(cells) {
  return el("tr", {}, cells.map((c, i) => el("td", {
    style: i === 0 ? { fontWeight: "600" } : { textAlign: "center" },
    class: i === 0 ? "" : "mono",
    html: c,
  })));
}
