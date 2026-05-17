// Lesson 20: Đơn giản bìa Karnaugh theo SOP.
import { el, clear } from "../utils/dom.js";
import { section, summary, quizSection, p, splitView, resetSectionCounter } from "../utils/lesson-ui.js";
import { COLORS } from "../utils/colors.js";

const ov = (t) => `<span style="text-decoration:overline">${t}</span>`;

// Color palette for groups on a K-map (with transparent fill + solid border).
const GROUP_COLORS = [
  { fill: "rgba(240, 162, 116, 0.35)", stroke: COLORS.peachDeep },
  { fill: "rgba(107, 168, 224, 0.35)", stroke: COLORS.skyDeep },
  { fill: "rgba(126, 200, 166, 0.35)", stroke: COLORS.mintDeep },
  { fill: "rgba(155, 140, 217, 0.35)", stroke: COLORS.lavenderDeep },
  { fill: "rgba(230, 201, 90, 0.40)", stroke: COLORS.butterDeep },
];

export default {
  id: "karnaugh-sop",
  order: 20,
  title: "Đơn giản bìa Karnaugh theo hàm SOP",
  subtitle: "Gộp các ô 1 lại để tạo biểu thức tổng các tích ngắn gọn nhất.",
  objective:
    "Nắm quy tắc gộp ô trên bìa Karnaugh; biết cách rút ra số hạng tích từ mỗi nhóm; áp dụng cho hàm 3 và 4 biến; nhận biết implicant chính và xử lý điều kiện 'don't care'.",
  render,
};

function render(container) {
  resetSectionCounter();
  clear(container);

  container.appendChild(
    section(
      "Ý tưởng cốt lõi",
      p(
        "Khi hai (hoặc nhiều) ô bằng 1 nằm kề nhau trên bìa Karnaugh, chúng cùng đại diện cho các minterm chỉ khác nhau ở một số biến. Gộp chúng lại → các biến đó <em>tự triệt tiêu</em>, để lại một <strong>tích ngắn hơn</strong>. Lặp lại cho đến khi mọi ô 1 đều được phủ — ta thu được biểu thức SOP tối giản.",
      ),
      p(
        "Ưu điểm so với rút gọn đại số bằng tay: nhìn là biết gộp được nhóm nào; rất ít sai sót; bài 4 biến chỉ mất vài phút.",
      ),
    ),
  );

  // Grouping rules
  container.appendChild(
    section(
      "Quy tắc gộp nhóm (rất quan trọng)",
      el("div", { class: "card", style: { padding: "16px" } }, [
        el("ol", { style: { lineHeight: "1.9", margin: 0, paddingLeft: "20px" } }, [
          el("li", { html: "<strong>Hình chữ nhật:</strong> nhóm phải là hình chữ nhật/vuông (không zigzag, không hình L)." }),
          el("li", { html: "<strong>Kích thước là luỹ thừa của 2:</strong> 1, 2, 4, 8, 16 ô. Không có nhóm 3 ô hay 6 ô." }),
          el("li", { html: "<strong>Chỉ chứa ô bằng 1:</strong> mọi ô trong nhóm đều phải bằng 1 (hoặc don't-care, xem mục dưới)." }),
          el("li", { html: "<strong>Nhóm càng lớn càng tốt:</strong> ưu tiên 8 > 4 > 2 > 1. Nhóm to ⇒ tích ngắn ⇒ ít cổng hơn." }),
          el("li", { html: "<strong>Số nhóm càng ít càng tốt:</strong> mỗi nhóm là một số hạng AND trong kết quả." }),
          el("li", { html: "<strong>Cho phép gấp vòng:</strong> ô ở mép có thể gộp với ô ở mép đối diện (bìa K là hình xuyến)." }),
          el("li", { html: "<strong>Cho phép chồng lấp:</strong> một ô 1 có thể nằm trong nhiều nhóm — không sao, miễn là điều đó giúp nhóm khác to hơn." }),
          el("li", { html: "<strong>Phủ tất cả ô 1:</strong> không được bỏ sót minterm nào." }),
        ]),
      ]),
    ),
  );

  // Variable elimination rule
  container.appendChild(
    section(
      "Quy tắc rút ra số hạng từ một nhóm",
      p(
        "Với nhóm kích thước 2<sup>k</sup> ô, có <em>k</em> biến thay đổi giá trị trong nhóm — các biến này bị loại bỏ. Các biến <em>giữ nguyên</em> sẽ xuất hiện trong số hạng: nguyên dạng nếu = 1, lấy bù nếu = 0.",
      ),
      el("div", { class: "card", style: { overflowX: "auto" } }, [
        el("table", { class: "tbl tbl-bordered", style: { width: "auto", margin: "0 auto" } }, [
          el("thead", {}, [
            el("tr", {}, [
              el("th", { text: "Kích thước nhóm" }),
              el("th", { text: "Số biến bị loại" }),
              el("th", { text: "Số biến còn lại (trong hàm n biến)" }),
            ]),
          ]),
          el("tbody", {}, [
            tr(["1 ô", "0", "n (tích đầy đủ — không rút gọn)"]),
            tr(["2 ô", "1", "n − 1"]),
            tr(["4 ô", "2", "n − 2"]),
            tr(["8 ô", "3", "n − 3"]),
            tr(["16 ô (bìa 4 biến)", "4", "0 → Y = 1 (hàm hằng)"]),
          ]),
        ]),
      ]),
    ),
  );

  // Example 1 — 3-var with 2 groups
  container.appendChild(
    section(
      "Ví dụ 1 – Bìa 3 biến",
      p("Cho hàm Y với các minterm 1 ở vị trí m1, m3, m6, m7. Bìa K:"),
      kmap3WithGroups([1, 3, 6, 7], [
        { cells: [1, 3], color: 0, label: ov("A") + "·C" },
        { cells: [6, 7], color: 1, label: "A·B" },
      ]),
      el("div", { class: "card", style: { padding: "14px", marginTop: "10px" } }, [
        el("ol", { style: { lineHeight: "1.9", margin: 0, paddingLeft: "20px" } }, [
          el("li", { html: "<strong>Nhóm 1 (cam):</strong> ô m1 và m3 — đều ở hàng A=0; ô m1 có BC=01, m3 có BC=11. B đổi (0→1), C cố định = 1, A cố định = 0. ⇒ <span class='mono'>" + ov("A") + "·C</span>." }),
          el("li", { html: "<strong>Nhóm 2 (xanh):</strong> ô m6 và m7 — đều ở hàng A=1; m6 có BC=10, m7 có BC=11. C đổi, B cố định = 1, A cố định = 1. ⇒ <span class='mono'>A·B</span>." }),
          el("li", { html: "<strong>Kết quả:</strong> <span class='mono'>Y = " + ov("A") + "·C + A·B</span> (từ biểu thức gốc 4 minterm → 2 tích, 5 cổng → 3 cổng)." }),
        ]),
      ]),
    ),
  );

  // Example 2 — 3-var with row group (size 4)
  container.appendChild(
    section(
      "Ví dụ 2 – Nhóm 4 ô (loại 2 biến)",
      p("Hàm có minterm 1 ở m0, m1, m2, m3 (cả hàng A=0)."),
      kmap3WithGroups([0, 1, 2, 3], [
        { cells: [0, 1, 2, 3], color: 0, label: ov("A") },
      ]),
      el("div", { class: "card", style: { padding: "14px", marginTop: "10px" } }, [
        el("p", { html: "Nhóm gồm cả hàng A = 0. Trong nhóm, B và C nhận đủ 4 tổ hợp → cả hai biến này đều bị loại. Chỉ còn A = 0 không đổi ⇒ <strong>Y = " + ov("A") + "</strong>." }),
        el("p", { class: "small text-2", html: "Bài học: nhóm 4 ô (size 2²) loại 2 biến — kết quả đơn giản hơn nhiều so với gộp từng đôi." }),
      ]),
    ),
  );

  // Example 3 — 3-var wrap-around
  container.appendChild(
    section(
      "Ví dụ 3 – Gấp vòng (wrap-around)",
      p("Hàm có m0, m2, m4, m6 bằng 1 (cột BC=00 và BC=10):"),
      kmap3WithGroups([0, 2, 4, 6], [
        { cells: [0, 2, 4, 6], color: 0, label: ov("C") },
      ]),
      el("div", { class: "card", style: { padding: "14px", marginTop: "10px" } }, [
        el("p", { html: "Hai cột ngoài cùng kề nhau (cùng có C = 0). Bốn ô tạo thành một nhóm size 4 'gấp vòng'. A và B đổi đủ giá trị → loại; C cố định = 0 ⇒ <strong>Y = " + ov("C") + "</strong>." }),
      ]),
    ),
  );

  // Example 4 — 4-var
  container.appendChild(
    section(
      "Ví dụ 4 – Bìa 4 biến",
      p("Hàm 4 biến với minterm 1 ở m5, m7, m13, m15. Đây là nhóm hình vuông 2×2:"),
      kmap4WithGroups([5, 7, 13, 15], [
        { cells: [5, 7, 13, 15], color: 0, label: "B·D" },
      ]),
      el("div", { class: "card", style: { padding: "14px", marginTop: "10px" } }, [
        el("p", { html: "Bốn ô tạo hình vuông 2×2 ở giữa bìa. Trong nhóm: A đổi (0/1), C đổi (0/1) → loại. B cố định = 1, D cố định = 1 ⇒ <strong>Y = B·D</strong>." }),
        el("p", { class: "small text-2", html: "Kiểm tra: m5 = 0101 → A=0, B=1, C=0, D=1. m15 = 1111 → A=1, B=1, C=1, D=1. Đúng là B=1, D=1 ở cả 4 ô." }),
      ]),
    ),
  );

  // Example 5 — Multiple groups, classic 4-var
  container.appendChild(
    section(
      "Ví dụ 5 – Bài 4 biến phức tạp hơn",
      p("Hàm có Y = 1 ở m0, m2, m5, m7, m8, m10, m13, m15 (8 ô)."),
      kmap4WithGroups([0, 2, 5, 7, 8, 10, 13, 15], [
        { cells: [0, 2, 8, 10], color: 0, label: ov("B") + "·" + ov("D") },
        { cells: [5, 7, 13, 15], color: 1, label: "B·D" },
      ]),
      el("div", { class: "card", style: { padding: "14px", marginTop: "10px" } }, [
        el("ol", { style: { lineHeight: "1.9", margin: 0, paddingLeft: "20px" } }, [
          el("li", { html: "<strong>Nhóm cam — 4 ô góc:</strong> m0, m2, m8, m10. Đây là nhóm 'bốn góc' nổi tiếng. Tất cả có B = 0 và D = 0 → <span class='mono'>" + ov("B") + "·" + ov("D") + "</span>." }),
          el("li", { html: "<strong>Nhóm xanh — vuông giữa:</strong> m5, m7, m13, m15 → <span class='mono'>B·D</span>." }),
          el("li", { html: "<strong>Kết quả:</strong> <span class='mono'>Y = " + ov("B") + "·" + ov("D") + " + B·D = " + ov("B ⊕ D") + " (XNOR)</span> — chỉ 2 tích thay vì 8 minterm." }),
        ]),
      ]),
    ),
  );

  // Implicants and essential prime implicants
  container.appendChild(
    section(
      "Một chút thuật ngữ – Implicant",
      el("div", { class: "grid grid-2" }, [
        el("div", { class: "card card-soft-sky" }, [
          el("h3", { text: "Implicant", style: { marginTop: 0 } }),
          el("p", { text: "Một nhóm hợp lệ bất kỳ (bất cứ hình chữ nhật 2^k ô bằng 1)." }),
        ]),
        el("div", { class: "card card-soft-peach" }, [
          el("h3", { text: "Prime implicant (PI)", style: { marginTop: 0 } }),
          el("p", { text: "Implicant không thể mở rộng thêm — đã to nhất có thể." }),
        ]),
        el("div", { class: "card card-soft-mint" }, [
          el("h3", { text: "Essential PI", style: { marginTop: 0 } }),
          el("p", { text: "Một PI mà chứa ít nhất một ô không thuộc PI nào khác. Mọi essential PI BẮT BUỘC phải có trong kết quả." }),
        ]),
        el("div", { class: "card card-soft-lavender" }, [
          el("h3", { text: "Quy trình chuẩn", style: { marginTop: 0 } }),
          el("p", { html: "1. Tìm tất cả PI. 2. Chọn các essential PI trước. 3. Phủ các ô còn lại bằng PI lớn nhất có thể." }),
        ]),
      ]),
    ),
  );

  // Don't care conditions
  container.appendChild(
    section(
      "Điều kiện 'không quan tâm' (don't-care)",
      p(
        "Đôi khi một số tổ hợp ngõ vào <em>không bao giờ xảy ra</em> hoặc kết quả <em>không quan trọng</em>. Ta đánh dấu bằng dấu <strong>X</strong> trên bìa. Khi gộp, có thể <em>tuỳ ý</em> coi X là 0 hoặc 1 — chọn sao cho nhóm to nhất.",
      ),
      el("div", { class: "card", style: { padding: "14px" } }, [
        el("strong", { html: "Ví dụ:" }),
        el("p", { html: "BCD chỉ dùng 10 trong 16 tổ hợp 4-bit (1010 đến 1111 không xảy ra). Khi thiết kế mạch xử lý BCD, ta đánh dấu m10..m15 là X. Nhờ X, bìa thường rút gọn được mạnh hơn." }),
      ]),
      kmap4WithGroups([1, 3, 5, 7, 9], [
        { cells: [1, 3, 5, 7, 9, 11, 13, 15], color: 0, label: "D" },
      ], { dontcares: [10, 11, 12, 13, 14, 15] }),
      el("div", { class: "card", style: { padding: "14px", marginTop: "10px" } }, [
        el("p", { html: "Hàm <span class='mono'>F(A,B,C,D)</span> bằng 1 khi chữ số BCD là lẻ (m1, m3, m5, m7, m9). Các tổ hợp m10..m15 không xảy ra → đánh dấu X." }),
        el("p", { html: "<strong>Không dùng don't-care:</strong> chỉ gộp được nhóm 4 ô (m1, m3, m5, m7) → <span class='mono'>A·D</span>… với m9 đứng lẻ thành minterm riêng → biểu thức dài." }),
        el("p", { html: "<strong>Tận dụng don't-care:</strong> coi m11, m13, m15 là 1 → ghép thành nhóm 8 ô gồm hai cột giữa của bìa (tất cả ô có D = 1). Ba biến A, B, C đổi → loại; chỉ còn D = 1 → <strong><span class='mono'>Y = D</span></strong>. Một thừa số duy nhất!" }),
      ]),
    ),
  );

  // Common mistakes
  container.appendChild(
    section(
      "Lỗi phổ biến cần tránh",
      el("div", { class: "grid grid-2" }, [
        el("div", { class: "card card-soft-peach" }, [
          el("h3", { text: "❶ Gộp nhóm 3 ô", style: { marginTop: 0 } }),
          el("p", { text: "3 không phải luỹ thừa của 2 — không gộp được. Chia thành 2 + 1 hoặc cố mở rộng thành 4." }),
        ]),
        el("div", { class: "card card-soft-peach" }, [
          el("h3", { text: "❷ Quên gấp vòng", style: { marginTop: 0 } }),
          el("p", { text: "Bỏ qua việc ô ở mép kề ô ở mép đối diện → bỏ lỡ nhóm to. 4 góc của bìa 4 biến cũng tạo thành một nhóm hợp lệ." }),
        ]),
        el("div", { class: "card card-soft-peach" }, [
          el("h3", { text: "❸ Tạo nhóm quá nhỏ", style: { marginTop: 0 } }),
          el("p", { text: "Gộp đôi khi có thể gộp tư, hoặc gộp tư khi có thể gộp tám — kết quả vẫn đúng nhưng dài hơn." }),
        ]),
        el("div", { class: "card card-soft-peach" }, [
          el("h3", { text: "❹ Bỏ sót ô 1", style: { marginTop: 0 } }),
          el("p", { text: "Phải kiểm tra: tất cả ô bằng 1 đều phải thuộc ít nhất một nhóm — không sót minterm nào." }),
        ]),
      ]),
    ),
  );

  container.appendChild(
    quizSection("karnaugh-sop", [
      {
        prompt: "Kích thước nhóm hợp lệ trên bìa K là?",
        options: [
          { label: "Bất kỳ" },
          { label: "Số chẵn bất kỳ" },
          { label: "Luỹ thừa của 2: 1, 2, 4, 8, 16" },
          { label: "Bội của 3" },
        ],
        answer: 2,
        hint: "Mỗi lần tăng đôi kích thước loại được thêm 1 biến.",
        explanation: "Quy tắc luỹ thừa của 2 đảm bảo các biến cố định sẽ ra một tích hợp lệ.",
      },
      {
        prompt: "Một nhóm 4 ô trên bìa 4 biến loại bao nhiêu biến?",
        options: [{ label: "1" }, { label: "2" }, { label: "3" }, { label: "4" }],
        answer: 1,
        hint: "4 = 2² → loại 2 biến.",
        explanation: "Nhóm size 2^k loại k biến. 4 = 2² → loại 2 biến, còn lại 2.",
      },
      {
        prompt: "Trên bìa 3 biến, m1 và m3 ở hàng A=0. m1 (BC=01) và m3 (BC=11). Gộp lại được số hạng nào?",
        options: [
          { label: "A·C" },
          { label: `${ov("A")}·C` },
          { label: `${ov("A")}·B·C` },
          { label: "B" },
        ],
        answer: 1,
        hint: "B đổi (0→1), C cố định 1, A cố định 0.",
        explanation: `B thay đổi nên bị loại; còn lại A=0 → ${ov("A")}, C=1 → C. Kết quả ${ov("A")}·C.`,
      },
      {
        prompt: "Trên bìa 4 biến, gộp 4 ô góc (m0, m2, m8, m10) cho số hạng?",
        options: [
          { label: `${ov("A")}·${ov("C")}` },
          { label: `${ov("B")}·${ov("D")}` },
          { label: "B·D" },
          { label: "A·C" },
        ],
        answer: 1,
        hint: "Kiểm tra: m0 = 0000, m2 = 0010, m8 = 1000, m10 = 1010. Cố định B = 0, D = 0.",
        explanation: `A và C đổi → loại; B = 0, D = 0 cố định → ${ov("B")}·${ov("D")}.`,
      },
      {
        prompt: "Don't-care X trên bìa K dùng để làm gì?",
        options: [
          { label: "Đánh dấu lỗi mạch" },
          { label: "Đánh dấu tổ hợp không xảy ra hoặc kết quả không quan trọng — được tự do coi 0 hay 1 để rút gọn tốt hơn" },
          { label: "Ô chưa điền" },
          { label: "Ô trung gian" },
        ],
        answer: 1,
        hint: "X dùng để giúp gộp nhóm lớn hơn.",
        explanation: "X cho phép tận dụng để tạo nhóm to, đổi lại biểu thức ngắn gọn hơn.",
      },
      {
        prompt: "Khi nào cần áp dụng nguyên tắc 'gấp vòng'?",
        options: [
          { label: "Khi mạch quá phức tạp" },
          { label: "Khi các ô bằng 1 nằm ở mép đối diện của bìa và có thể gộp lại" },
          { label: "Khi có hơn 4 biến" },
          { label: "Không bao giờ" },
        ],
        answer: 1,
        hint: "Bìa K hành xử như hình xuyến.",
        explanation: "Bìa K gấp vòng: ô đầu hàng và ô cuối hàng kề nhau; tương tự với cột (4 biến).",
      },
    ]),
  );

  container.appendChild(
    section(
      "Tóm tắt",
      summary(null, [
        "Nhóm trên bìa K phải <strong>hình chữ nhật</strong>, <strong>kích thước 2<sup>k</sup></strong>, chỉ chứa 1 (hoặc X).",
        "Nhóm càng <em>to</em> càng tốt; tổng số nhóm càng <em>ít</em> càng tốt.",
        "Nhóm 2^k ô → loại k biến; biến giữ nguyên 1 ↔ nguyên dạng, giữ nguyên 0 ↔ phủ định.",
        "Bìa K gấp vòng: mép đối diện kề nhau (4 góc của bìa 4 biến là một nhóm hợp lệ).",
        "Cho phép chồng lấp giữa các nhóm để mỗi nhóm to nhất có thể.",
        "<strong>Don't-care (X)</strong>: tận dụng để mở rộng nhóm — coi 0 hay 1 tuỳ ý.",
        "Quy trình: chọn essential prime implicant trước, sau đó phủ ô còn lại bằng PI lớn.",
      ]),
    ),
  );
}

// ===========================================================================
// K-map renderers with group overlays
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

// 3-variable K-map. cellPos[idx] returns the row/col on the displayed grid.
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

// Build a K-map with optional pre-colored groups and don't-cares.
// groups: [{ cells: [minterm idx...], color: 0..4, label }]
function kmap3WithGroups(oneMinterms, groups, opts = {}) {
  return kmapWithGroups({ vars: 3, rows: 2, cols: 4, oneMinterms, groups, opts, pos: pos3,
    rowLabel: (r) => String(r), colLabel: (c) => ["00", "01", "11", "10"][c], header: "A \\ BC" });
}

function kmap4WithGroups(oneMinterms, groups, opts = {}) {
  return kmapWithGroups({ vars: 4, rows: 4, cols: 4, oneMinterms, groups, opts, pos: pos4,
    rowLabel: (r) => ["00", "01", "11", "10"][r], colLabel: (c) => ["00", "01", "11", "10"][c], header: "AB \\ CD" });
}

function kmapWithGroups({ vars, rows, cols, oneMinterms, groups, opts, pos, rowLabel, colLabel, header }) {
  const dontcares = new Set(opts.dontcares || []);
  const ones = new Set(oneMinterms || []);

  const CELL_W = 56, CELL_H = 56;
  const HEAD_W = 64, HEAD_H = 32;

  const wrap = el("div", { class: "card", style: { padding: "12px", display: "flex", flexDirection: "column", alignItems: "center" } });
  const scroll = el("div", { class: "kmap-scroll" });
  // Stage sizes itself to the table — we measure actual cell positions after mount.
  const stage = el("div", { class: "kmap-stage", style: { position: "relative", display: "inline-block" } });

  // Build the underlying table. `table-layout: fixed` keeps column widths predictable.
  const table = el("table", {
    class: "kmap",
    style: { borderCollapse: "collapse", tableLayout: "fixed" },
  });

  // <colgroup> guarantees deterministic column widths.
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

  // Header row.
  const headerRow = el("tr");
  headerRow.appendChild(el("th", {
    html: `<span class='mono'>${header}</span>`,
    style: { ...hStyle(), height: `${HEAD_H}px` },
  }));
  for (let c = 0; c < cols; c++) {
    headerRow.appendChild(el("th", {
      text: colLabel(c),
      style: { ...hStyle(), height: `${HEAD_H}px` },
    }));
  }
  table.appendChild(headerRow);

  for (let r = 0; r < rows; r++) {
    const tr = el("tr");
    tr.appendChild(el("th", {
      text: rowLabel(r),
      style: { ...hStyle(), height: `${CELL_H}px` },
    }));
    for (let c = 0; c < cols; c++) {
      const idx = mintermFromPos(vars, r, c);
      const isOne = ones.has(idx);
      const isX = dontcares.has(idx);
      const val = isX ? "X" : isOne ? "1" : "0";
      const bg = isX ? COLORS.logicXBg : isOne ? COLORS.logic1Bg : COLORS.logic0Bg;
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

  // Overlays — placed first with estimated positions, then snapped to actual cells after mount.
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
          // Initial estimate (used until rAF refines it).
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

  // After the stage is in the DOM and laid out, measure actual cell rects and snap
  // each overlay to span its segment exactly. Retries on next frame until the table
  // has a non-zero size (e.g., if it hasn't been inserted into the DOM yet).
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
        el("span", { class: "mono", style: { fontSize: "13px" }, html: g.label }),
      ]));
    });
    wrap.appendChild(legend);
  }
  return wrap;
}

// Reconstruct minterm idx from (row, col) on the 3- or 4-variable map.
function mintermFromPos(vars, r, c) {
  if (vars === 3) {
    const a = r;
    const { b, c: cc } = BC_GRAY[c];
    return a * 4 + b * 2 + cc;
  }
  // 4 vars.
  const { a, b } = AB_GRAY[r];
  const { b: cc, c: d } = BC_GRAY[c];
  return a * 8 + b * 4 + cc * 2 + d;
}

// Given a list of minterms forming a rectangular group (possibly wrapping),
// split into one or more contiguous rectangle segments for visual drawing.
function groupSegments(cells, pos, cols) {
  // Bucket cells by row → set of columns.
  const rowToCols = new Map();
  cells.forEach((idx) => {
    const { row, col } = pos(idx);
    if (!rowToCols.has(row)) rowToCols.set(row, new Set());
    rowToCols.get(row).add(col);
  });

  // For each row, find contiguous column ranges (handling wrap: cols [0] and [cols-1]).
  const rowRanges = new Map();
  rowToCols.forEach((set, row) => {
    const arr = [...set].sort((a, b) => a - b);
    const ranges = [];
    // Detect wrap: column 0 and column cols-1 both present and the set is exactly the wrap pair (or includes the rest).
    const wraps = set.has(0) && set.has(cols - 1) && !isFullContiguous(arr, cols);
    if (wraps) {
      // Split into [right segment] and [left segment].
      // Right segment: highest contiguous from cols-1 going down.
      let r = cols - 1;
      while (set.has(r) && r >= 0) r--;
      ranges.push({ start: r + 1, end: cols - 1 });
      // Left segment: from 0 upward.
      let l = 0;
      while (set.has(l) && l < cols) l++;
      ranges.push({ start: 0, end: l - 1 });
    } else {
      // Build runs of consecutive cols.
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

  // Now merge rows: rows with identical column-ranges that are vertically adjacent (possibly wrapping rows for 4-var).
  // For simplicity, emit one segment per (row, range). Visually this still groups correctly because each cell is bordered.
  // Then merge adjacent rows sharing the same range.
  const segments = [];
  // Convert map to sorted rows.
  const rows = [...rowRanges.keys()].sort((a, b) => a - b);
  // First emit individually, then merge.
  const individual = [];
  rows.forEach((row) => {
    rowRanges.get(row).forEach((rng) => {
      individual.push({ rowStart: row, rowEnd: row, colStart: rng.start, colEnd: rng.end });
    });
  });

  // Merge vertically: group segments by (colStart, colEnd), then sort by rowStart, merge consecutive.
  const buckets = new Map();
  individual.forEach((s) => {
    const k = `${s.colStart}_${s.colEnd}`;
    if (!buckets.has(k)) buckets.set(k, []);
    buckets.get(k).push(s);
  });
  buckets.forEach((segs, k) => {
    segs.sort((a, b) => a.rowStart - b.rowStart);
    // Detect row wrap for 4-var (rows 0 and 3 both present without full contiguous).
    const rowsPresent = new Set(segs.map((s) => s.rowStart));
    const maxRow = Math.max(...rowsPresent);
    const cols4 = (maxRow === 3) && rowsPresent.has(0) && rowsPresent.has(3) && !rowsPresent.has(1) && !rowsPresent.has(2);
    if (cols4) {
      // Two segments: row 0 alone and row 3 alone (handled below by no merge).
    }
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

function tr(cells) {
  return el("tr", {}, cells.map((c, i) => el("td", {
    style: i === 0 ? { fontWeight: "600" } : { textAlign: "center" },
    class: i === 0 ? "" : "mono",
    text: c,
  })));
}
