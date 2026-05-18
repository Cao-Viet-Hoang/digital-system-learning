// Lesson 19: Xây dựng bìa Karnaugh.
import { el, clear } from "../utils/dom.js";
import { section, summary, quizSection, p, splitView, resetSectionCounter, toolCTA } from "../utils/lesson-ui.js";
import { COLORS } from "../utils/colors.js";

const ov = (t) => `<span style="text-decoration:overline">${t}</span>`;

export default {
  id: "karnaugh-build",
  order: 19,
  title: "Bìa Karnaugh – Xây dựng",
  subtitle: "Một dạng bảng chân trị 'gập lại' giúp nhìn ra cách rút gọn.",
  objective:
    "Hiểu khái niệm bìa Karnaugh (K-map) và quy tắc Gray code; biết bố trí bìa cho 2, 3, 4 biến; biết điền giá trị từ bảng chân trị hoặc từ biểu thức SOP/POS chuẩn.",
  render,
};

function render(container) {
  resetSectionCounter();
  clear(container);

  container.appendChild(
    section(
      "Bìa Karnaugh là gì?",
      p(
        "Khi hàm Boole có 3-4 biến, rút gọn bằng đại số dễ rườm rà và dễ sót. <strong>Bìa Karnaugh</strong> (Karnaugh map, gọi tắt là <em>K-map</em>) là một <em>bảng chân trị được sắp xếp lại theo dạng lưới</em> sao cho các ô nằm cạnh nhau chỉ khác nhau <strong>đúng một biến</strong>. Nhờ vậy, các minterm có thể rút gọn được luôn nằm sát nhau — ta nhìn là thấy.",
      ),
      p(
        "Bìa Karnaugh hữu hiệu nhất với 2-4 biến. Với 5-6 biến vẫn dùng được nhưng phức tạp hơn; từ 7 biến trở lên người ta dùng thuật toán Quine-McCluskey hoặc các công cụ EDA.",
      ),
    ),
  );

  // Gray code adjacency
  container.appendChild(
    section(
      "Quy tắc Gray code – nền tảng của K-map",
      p(
        "Hai tổ hợp được gọi là <strong>kề nhau logic</strong> nếu chúng khác nhau <em>đúng một biến</em>. Ví dụ <span class='mono'>A" + ov("B") + "C</span> và <span class='mono'>ABC</span> kề nhau (chỉ B đổi). Khi hai minterm kề nhau cùng cho Y = 1, ta có thể gộp lại và <em>loại bỏ biến thay đổi</em>:",
      ),
      el("div", { class: "card mono", style: { padding: "12px", textAlign: "center", fontSize: "15px" } }, [
        el("div", { html: "A·" + ov("B") + "·C + A·B·C = A·C·(" + ov("B") + " + B) = A·C" }),
      ]),
      p(
        "Bìa K phải bố trí sao cho hai ô cạnh nhau (về mặt hình học) luôn kề nhau logic. Để làm điều đó, ta dùng thứ tự <strong>Gray code</strong>: <span class='mono'>00 → 01 → 11 → 10</span> — chỉ một bit thay đổi mỗi bước.",
      ),
      el("div", { class: "alert alert-info", style: { marginTop: "8px" } }, [
        el("strong", { text: "Cảnh báo phổ biến: " }),
        el("span", { text: "Thứ tự Gray là 00, 01, 11, 10 — KHÔNG phải 00, 01, 10, 11 như đếm nhị phân." }),
      ]),
    ),
  );

  // 2-variable K-map
  container.appendChild(
    section(
      "Bìa 2 biến",
      p("Hàm 2 biến (A, B) có 4 minterm. Bìa K là một lưới 2 × 2:"),
      splitView(
        kmap2Demo(),
        el("div", { class: "card card-soft-mint" }, [
          el("h3", { text: "Đọc bìa thế nào?", style: { marginTop: 0 } }),
          el("ul", {}, [
            el("li", { html: "Cột là <strong>B</strong> (0 hoặc 1). Hàng là <strong>A</strong>." }),
            el("li", { html: "Mỗi ô tương ứng một <em>minterm</em> — đánh số m₀ … m₃." }),
            el("li", { html: "Hai ô cạnh nhau (cùng hàng hoặc cùng cột) khác nhau đúng một biến." }),
            el("li", { html: "Bấm các ô để bật/tắt — giá trị bảng chân trị tự cập nhật." }),
          ]),
        ]),
      ),
    ),
  );

  // 3-variable K-map
  container.appendChild(
    section(
      "Bìa 3 biến",
      p("Hàm 3 biến (A, B, C) có 8 minterm. Bìa là lưới 2 × 4. Cột chứa cặp <span class='mono'>BC</span> theo thứ tự Gray <span class='mono'>00, 01, 11, 10</span>:"),
      kmap3Demo(),
      el("div", { class: "alert alert-info", style: { marginTop: "10px" } }, [
        el("strong", { text: "Lưu ý 'gấp vòng': " }),
        el("span", { html: "Cột ngoài cùng bên trái (<span class='mono'>BC=00</span>) và cột ngoài cùng bên phải (<span class='mono'>BC=10</span>) <em>kề nhau logic</em> — chúng chỉ khác bit B. Hình dung bìa như một <em>ống trụ</em> được gập lại." }),
      ]),
    ),
  );

  // 4-variable K-map
  container.appendChild(
    section(
      "Bìa 4 biến",
      p("Hàm 4 biến (A, B, C, D) có 16 minterm. Bìa là lưới 4 × 4. Cả hàng (AB) và cột (CD) đều dùng Gray code:"),
      kmap4Demo(),
      el("div", { class: "alert alert-info", style: { marginTop: "10px" } }, [
        el("strong", { text: "Hai chiều gấp vòng: " }),
        el("span", { html: "Hàng trên cùng kề hàng dưới cùng, và cột trái nhất kề cột phải nhất — bìa như một <em>hình xuyến</em> (torus). 4 ô góc của bìa 4 biến luôn kề nhau!" }),
      ]),
    ),
  );

  // Filling from truth table
  container.appendChild(
    section(
      "Cách 1 – Điền bìa từ bảng chân trị",
      p("Mỗi hàng của bảng chân trị tương ứng <em>một ô</em> của bìa K. Cách làm:"),
      el("div", { class: "card", style: { padding: "16px" } }, [
        el("ol", { style: { lineHeight: "1.9", margin: 0, paddingLeft: "20px" } }, [
          el("li", { html: "Liệt kê bảng chân trị đầy đủ với cột số thứ tự minterm (0 → 2<sup>n</sup> − 1)." }),
          el("li", { html: "Đánh dấu vị trí từng ô minterm trên bìa K bằng số chỉ thứ tự." }),
          el("li", { html: "Đặt giá trị Y vào đúng ô đó." }),
        ]),
      ]),
      p("Ví dụ — hàm Y = A·B + " + ov("A") + "·C với 3 biến. Bảng chân trị có 4 hàng Y=1: m1, m3, m6, m7."),
      kmap3Example("Y = A·B + " + ov("A") + "·C", [1, 3, 6, 7]),
    ),
  );

  // Filling from SOP expression
  container.appendChild(
    section(
      "Cách 2 – Điền bìa từ biểu thức SOP",
      p(
        "Khi đã có biểu thức Boole dạng SOP, ta đi qua từng số hạng. <em>Mỗi tích</em> ứng với một <strong>hoặc nhiều</strong> ô trên bìa.",
      ),
      el("div", { class: "card", style: { padding: "16px" } }, [
        el("strong", { text: "Ví dụ – điền " }),
        el("span", { class: "mono", html: "Y = A·" + ov("C") + " + B·C" }),
        el("strong", { text: " (3 biến A, B, C):" }),
        el("ul", { style: { marginTop: "10px", lineHeight: "1.8" } }, [
          el("li", { html: "Số hạng <span class='mono'>A·" + ov("C") + "</span> ⇒ A=1, C=0, B = bất kỳ → hai ô: (A=1, B=0, C=0) và (A=1, B=1, C=0), tức minterm 4 và 6." }),
          el("li", { html: "Số hạng <span class='mono'>B·C</span> ⇒ B=1, C=1, A = bất kỳ → hai ô: (A=0, B=1, C=1) và (A=1, B=1, C=1), tức minterm 3 và 7." }),
        ]),
      ]),
      kmap3Example("Y = A·" + ov("C") + " + B·C", [3, 4, 6, 7]),
      el("div", { class: "alert alert-info", style: { marginTop: "10px" } }, [
        el("strong", { text: "Quy tắc đếm ô: " }),
        el("span", { html: "Một số hạng SOP có <em>k</em> biến vắng mặt sẽ chiếm <strong>2<sup>k</sup></strong> ô trên bìa K (chúng nằm sát nhau)." }),
      ]),
    ),
  );

  // Filling from POS expression
  container.appendChild(
    section(
      "Cách 3 – Điền bìa từ biểu thức POS",
      p(
        "Với biểu thức POS, mỗi <em>maxterm</em> đánh dấu một ô có giá trị 0. Các ô còn lại bằng 1. Một thừa số POS thiếu k biến ⇒ chiếm 2<sup>k</sup> ô bằng 0.",
      ),
      el("div", { class: "card", style: { padding: "16px" } }, [
        el("strong", { text: "Ví dụ – điền " }),
        el("span", { class: "mono", html: "Y = (A + B)·(" + ov("A") + " + C)" }),
        el("ul", { style: { marginTop: "10px", lineHeight: "1.8" } }, [
          el("li", { html: "Thừa số <span class='mono'>(A + B)</span> = 0 ⇔ A = 0 và B = 0; C bất kỳ → 2 ô bằng 0: (0,0,0) và (0,0,1) tức M0, M1." }),
          el("li", { html: "Thừa số <span class='mono'>(" + ov("A") + " + C)</span> = 0 ⇔ A = 1 và C = 0; B bất kỳ → 2 ô bằng 0: (1,0,0) và (1,1,0) tức M4, M6." }),
          el("li", { html: "Các ô còn lại (m2, m3, m5, m7) bằng 1." }),
        ]),
      ]),
      kmap3ExamplePOS([0, 1, 4, 6]),
    ),
  );

  container.appendChild(
    section(
      "Thử ngay với công cụ tương tác",
      toolCTA({
        title: "Tối ưu bìa Karnaugh — công cụ tương tác",
        description:
          "Mở trang công cụ để tự dựng bìa K (2, 3 hoặc 4 biến), bấm vào từng ô để gán <span class='mono'>0</span>, <span class='mono'>1</span>, <span class='mono'>X</span> và quan sát cách các ô được sắp xếp theo Gray code. Bài tiếp theo sẽ học cách gộp nhóm — bạn có thể quay lại công cụ này để luyện tập.",
        buttonText: "Mở công cụ tối ưu bìa K →",
        href: "#/kmap-solver",
        hint: "Có cả <strong>chế độ Luyện tập</strong> để hệ thống sinh đề ngẫu nhiên.",
      }),
    ),
  );

  container.appendChild(
    quizSection("karnaugh-build", [
      {
        prompt: "Vì sao bìa Karnaugh sắp xếp theo Gray code, không phải nhị phân thường?",
        options: [
          { label: "Để cho đẹp" },
          { label: "Để hai ô kề nhau khác nhau đúng một biến — dễ gộp" },
          { label: "Vì Gray code đếm nhanh hơn" },
          { label: "Vì máy tính dùng Gray code" },
        ],
        answer: 1,
        hint: "Gray code đảm bảo tính kề logic.",
        explanation: "Tính chất 'kề nhau khác nhau 1 bit' của Gray code chính là điều cho phép gộp minterm trên bìa K.",
      },
      {
        prompt: "Thứ tự Gray code đúng cho 2 bit là?",
        options: [
          { label: "00, 01, 10, 11" },
          { label: "00, 01, 11, 10" },
          { label: "00, 10, 11, 01" },
          { label: "11, 10, 01, 00" },
        ],
        answer: 1,
        hint: "Mỗi bước chỉ một bit thay đổi.",
        explanation: "00 → 01 (đổi LSB) → 11 (đổi MSB) → 10 (đổi LSB).",
      },
      {
        prompt: "Bìa Karnaugh 4 biến có bao nhiêu ô?",
        options: [{ label: "4" }, { label: "8" }, { label: "16" }, { label: "32" }],
        answer: 2,
        hint: "2^n với n là số biến.",
        explanation: "2⁴ = 16 ô — bằng số minterm của hàm 4 biến.",
      },
      {
        prompt: "Trên bìa K 3 biến (A, BC), hai ô ở cột ngoài cùng trái và phải có quan hệ gì?",
        options: [
          { label: "Không liên quan" },
          { label: "Khác nhau bit C" },
          { label: "Kề nhau logic — bìa gấp vòng theo cột" },
          { label: "Có cùng giá trị" },
        ],
        answer: 2,
        hint: "BC = 00 và BC = 10 chỉ khác bit B.",
        explanation: "Bìa K 3 biến gấp vòng theo chiều cột; ô đầu và ô cuối mỗi hàng kề nhau.",
      },
      {
        prompt: "Khi điền bìa từ SOP, số hạng <span class='mono'>A·B</span> trong hàm 3 biến (A, B, C) chiếm bao nhiêu ô?",
        options: [{ label: "1" }, { label: "2" }, { label: "4" }, { label: "8" }],
        answer: 1,
        hint: "Số biến vắng mặt = k → 2^k ô.",
        explanation: "Biến C vắng mặt (k = 1) → 2¹ = 2 ô liên tiếp, ứng với C = 0 và C = 1.",
      },
      {
        prompt: "Trong bìa K, ô có giá trị 0 tương ứng với loại số hạng nào?",
        options: [{ label: "Minterm (SOP)" }, { label: "Maxterm (POS)" }, { label: "Tích nhỏ nhất" }, { label: "Không có ý nghĩa" }],
        answer: 1,
        hint: "Maxterm là số hạng cho Y = 0.",
        explanation: "Ô = 1 ↔ minterm (cho SOP); ô = 0 ↔ maxterm (cho POS).",
      },
    ]),
  );

  container.appendChild(
    section(
      "Tóm tắt",
      summary(null, [
        "Bìa Karnaugh là bảng chân trị sắp xếp lại sao cho hai ô kề nhau khác nhau đúng một biến.",
        "Hàng và cột dùng <strong>Gray code</strong>: <span class='mono'>00, 01, 11, 10</span>.",
        "Bìa 2 biến: 4 ô — 3 biến: 8 ô — 4 biến: 16 ô.",
        "Bìa <em>gấp vòng</em>: hai cạnh đối diện kề nhau (3 biến gấp 1 chiều, 4 biến gấp 2 chiều).",
        "Điền từ <strong>bảng chân trị</strong>: mỗi hàng → một ô.",
        "Điền từ <strong>SOP</strong>: mỗi tích chiếm 2<sup>k</sup> ô bằng 1 (k = số biến vắng).",
        "Điền từ <strong>POS</strong>: mỗi tổng chiếm 2<sup>k</sup> ô bằng 0; các ô còn lại bằng 1.",
      ]),
    ),
  );
}

// ===========================================================================
// K-map renderers
// ===========================================================================

// 2-variable K-map (A as row, B as column).
function kmap2Demo() {
  const state = new Array(4).fill(0);
  const card = el("div", { class: "card", style: { padding: "12px" } });
  const grid = el("div");
  card.appendChild(grid);
  function render2() {
    clear(grid);
    grid.appendChild(buildKmap2(state, (i) => { state[i] ^= 1; render2(); }));
  }
  render2();
  card.appendChild(el("div", { class: "small text-2", style: { textAlign: "center", marginTop: "6px" }, text: "Bấm các ô để bật/tắt" }));
  return card;
}

function buildKmap2(values, onToggle) {
  // Header row: B=0, B=1. Rows: A=0, A=1.
  // minterm index = A*2 + B.
  const scroll = el("div", { class: "kmap-scroll" });
  const table = el("table", { class: "kmap", style: { borderCollapse: "collapse", margin: "0 auto" } });
  const header = el("tr", {}, [
    cornerHeader("A", "B"),
    el("th", { text: "0", style: hStyle() }),
    el("th", { text: "1", style: hStyle() }),
  ]);
  table.appendChild(header);
  for (let a = 0; a <= 1; a++) {
    const row = el("tr");
    row.appendChild(el("th", { text: String(a), style: hStyle() }));
    for (let b = 0; b <= 1; b++) {
      const idx = a * 2 + b;
      row.appendChild(cell(values[idx], idx, () => onToggle && onToggle(idx)));
    }
    table.appendChild(row);
  }
  scroll.appendChild(table);
  return scroll;
}

// 3-variable K-map (A rows, BC columns Gray-coded).
function kmap3Demo() {
  const state = new Array(8).fill(0);
  const card = el("div", { class: "card", style: { padding: "12px" } });
  const grid = el("div");
  card.appendChild(grid);
  function render3() {
    clear(grid);
    grid.appendChild(buildKmap3(state, (i) => { state[i] ^= 1; render3(); }));
  }
  render3();
  card.appendChild(el("div", { class: "small text-2", style: { textAlign: "center", marginTop: "6px" }, text: "Số nhỏ ở góc là chỉ số minterm. Bấm để bật/tắt." }));
  return card;
}

// Map column index → (B, C) in Gray order.
const BC_GRAY = [
  { b: 0, c: 0 },
  { b: 0, c: 1 },
  { b: 1, c: 1 },
  { b: 1, c: 0 },
];
const BC_LABEL = ["00", "01", "11", "10"];

function buildKmap3(values, onToggle) {
  const scroll = el("div", { class: "kmap-scroll" });
  const table = el("table", { class: "kmap", style: { borderCollapse: "collapse", margin: "0 auto" } });
  const header = el("tr", {}, [
    cornerHeader("A", "BC"),
    ...BC_LABEL.map((lab) => el("th", { text: lab, style: hStyle() })),
  ]);
  table.appendChild(header);
  for (let a = 0; a <= 1; a++) {
    const row = el("tr");
    row.appendChild(el("th", { text: String(a), style: hStyle() }));
    for (let col = 0; col < 4; col++) {
      const { b, c } = BC_GRAY[col];
      const idx = a * 4 + b * 2 + c;
      row.appendChild(cell(values[idx], idx, () => onToggle && onToggle(idx)));
    }
    table.appendChild(row);
  }
  scroll.appendChild(table);
  return scroll;
}

// 4-variable K-map (AB rows Gray-coded, CD columns Gray-coded).
function kmap4Demo() {
  const state = new Array(16).fill(0);
  const card = el("div", { class: "card", style: { padding: "12px" } });
  const grid = el("div");
  card.appendChild(grid);
  function render4() {
    clear(grid);
    grid.appendChild(buildKmap4(state, (i) => { state[i] ^= 1; render4(); }));
  }
  render4();
  card.appendChild(el("div", { class: "small text-2", style: { textAlign: "center", marginTop: "6px" }, text: "Bấm các ô để bật/tắt. Mỗi ô ghi sẵn chỉ số minterm." }));
  return card;
}

const AB_GRAY = [
  { a: 0, b: 0 },
  { a: 0, b: 1 },
  { a: 1, b: 1 },
  { a: 1, b: 0 },
];
const AB_LABEL = ["00", "01", "11", "10"];

function buildKmap4(values, onToggle) {
  const scroll = el("div", { class: "kmap-scroll" });
  const table = el("table", { class: "kmap", style: { borderCollapse: "collapse", margin: "0 auto" } });
  const header = el("tr", {}, [
    cornerHeader("AB", "CD"),
    ...BC_LABEL.map((lab) => el("th", { text: lab, style: hStyle() })),
  ]);
  table.appendChild(header);
  for (let r = 0; r < 4; r++) {
    const { a, b } = AB_GRAY[r];
    const row = el("tr");
    row.appendChild(el("th", { text: AB_LABEL[r], style: hStyle() }));
    for (let cIdx = 0; cIdx < 4; cIdx++) {
      const { b: c, c: d } = BC_GRAY[cIdx]; // reuse Gray order for CD
      const idx = a * 8 + b * 4 + c * 2 + d;
      row.appendChild(cell(values[idx], idx, () => onToggle && onToggle(idx)));
    }
    table.appendChild(row);
  }
  scroll.appendChild(table);
  return scroll;
}

// Helper: pre-filled 3-variable K-map for examples (read-only).
function kmap3Example(title, oneMinterms) {
  const state = new Array(8).fill(0);
  oneMinterms.forEach((m) => { state[m] = 1; });
  const card = el("div", { class: "card", style: { padding: "12px", marginTop: "8px" } });
  card.appendChild(el("div", { class: "small text-2", style: { textAlign: "center", marginBottom: "6px" }, html: title }));
  card.appendChild(buildKmap3(state, null));
  card.appendChild(el("div", { class: "small text-3", style: { textAlign: "center", marginTop: "6px" }, html: `Các ô bằng 1: m${oneMinterms.join(", m")}` }));
  return card;
}

function kmap3ExamplePOS(zeroMinterms) {
  const state = new Array(8).fill(1);
  zeroMinterms.forEach((m) => { state[m] = 0; });
  const card = el("div", { class: "card", style: { padding: "12px", marginTop: "8px" } });
  card.appendChild(el("div", { class: "small text-2", style: { textAlign: "center", marginBottom: "6px" }, html: "Y = (A + B)·(" + ov("A") + " + C)" }));
  card.appendChild(buildKmap3(state, null));
  card.appendChild(el("div", { class: "small text-3", style: { textAlign: "center", marginTop: "6px" }, html: `Các ô bằng 0 (maxterm): M${zeroMinterms.join(", M")}` }));
  return card;
}

// ===========================================================================
// Cell + header helpers
// ===========================================================================

function cell(value, index, onClick) {
  const td = el("td", {
    style: {
      width: "54px",
      height: "54px",
      border: `1.5px solid ${COLORS.borderStrong}`,
      textAlign: "center",
      verticalAlign: "middle",
      position: "relative",
      cursor: onClick ? "pointer" : "default",
      background: value === 1 ? COLORS.logic1Bg : COLORS.logic0Bg,
      fontFamily: "var(--font-mono)",
      fontWeight: "700",
      fontSize: "20px",
      color: COLORS.text,
      userSelect: "none",
    },
    text: String(value),
  });
  // Tiny minterm index in upper-left.
  const tag = el("span", {
    style: {
      position: "absolute",
      top: "2px",
      left: "4px",
      fontSize: "10px",
      fontWeight: "400",
      color: COLORS.text3,
      fontFamily: "var(--font-mono)",
    },
    text: String(index),
  });
  td.appendChild(tag);
  if (onClick) td.addEventListener("click", onClick);
  return td;
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
  };
}

// Top-left corner cell — SVG draws a diagonal slash dividing the cell, with
// the row variable in the bottom-left triangle and the column variable in the
// top-right triangle. Both are placed at coordinates that guarantee they sit
// entirely within their respective triangle, far from the diagonal.
function cornerHeader(rowVar, colVar) {
  return el("th", {
    class: "kmap-corner",
    style: {
      border: `1.5px solid ${COLORS.borderStrong}`,
      width: "64px",
      height: "40px",
    },
    html: cornerSvg(rowVar, colVar),
  });
}

function cornerSvg(rowVar, colVar) {
  const W = 64, H = 40;
  return `
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
  `;
}
