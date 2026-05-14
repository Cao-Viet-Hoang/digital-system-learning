// Lesson 6: Decimal System — base 10, place values, weighted sum.
import { el, clear } from "../utils/dom.js";
import { section, summary, quizSection, p, resetSectionCounter } from "../utils/lesson-ui.js";

export default {
  id: "decimal",
  order: 6,
  title: "Hệ Thập Phân (Decimal)",
  subtitle: "Cơ số 10 — hệ thống mọi người học đầu tiên. Giá trị mỗi chữ số là một lũy thừa của 10.",
  objective:
    "Phân tích số thập phân thành tích chữ số × giá trị vị trí và nhận ra cơ số 10 chỉ là một trong nhiều hệ thống vị trí có thể.",
  render,
};

function render(container) {
  resetSectionCounter();
  clear(container);

  container.appendChild(
    section(
      "Hãy thử: phân tích số thập phân",
      p(
        "Nhập số bên dưới. Mỗi chữ số được hiển thị với giá trị vị trí của nó (một lũy thừa của 10) và đóng góp của nó vào tổng.",
      ),
      buildExpander(),
    ),
  );

  container.appendChild(
    section(
      "Tại sao dùng cơ số 10?",
      p(
        "Hệ thập phân dùng mười chữ số (0–9) và các giá trị vị trí là 1, 10, 100, ... Có lẽ vì chúng ta có mười ngón tay. Các cơ số khác dùng cùng ý tưởng nhưng với số chữ số khác: cơ số 2 dùng hai chữ số, cơ số 16 dùng mười sáu.",
      ),
      el("div", { class: "card card-soft-mint" }, [
        el("p", {
          style: { margin: 0 },
          html:
            "<strong>Ví dụ.</strong> 4 0 7 trong thập phân = 4 × 10² + 0 × 10¹ + 7 × 10⁰ = 400 + 0 + 7 = <strong>407</strong>.",
        }),
      ]),
    ),
  );

  container.appendChild(
    section(
      "So sánh các hệ thống số",
      p(
        "Hệ thập phân không phải hệ thống duy nhất. Mọi hệ đếm vị trí đều hoạt động theo cùng một nguyên lý — chỉ khác ở số chữ số cơ bản.",
      ),
      el("div", { class: "card", style: { overflowX: "auto" } }, [
        el("table", { class: "tbl tbl-bordered" }, [
          el("thead", {}, [
            el("tr", {}, [
              el("th", { text: "Hệ" }),
              el("th", { text: "Cơ số" }),
              el("th", { text: "Chữ số dùng" }),
              el("th", { text: "Ứng dụng" }),
            ]),
          ]),
          el("tbody", {}, [
            el("tr", {}, [el("td", { text: "Thập phân" }), el("td", { class: "mono", text: "10" }), el("td", { class: "mono", text: "0–9" }), el("td", { class: "small", text: "Đời thường, tiền tệ, đo lường" })]),
            el("tr", {}, [el("td", { text: "Nhị phân" }), el("td", { class: "mono", text: "2" }), el("td", { class: "mono", text: "0, 1" }), el("td", { class: "small", text: "Bên trong máy tính, vi xử lý" })]),
            el("tr", {}, [el("td", { text: "Bát phân" }), el("td", { class: "mono", text: "8" }), el("td", { class: "mono", text: "0–7" }), el("td", { class: "small", text: "Quyền file Unix (chmod 755)" })]),
            el("tr", {}, [el("td", { text: "Thập lục phân" }), el("td", { class: "mono", text: "16" }), el("td", { class: "mono", text: "0–9, A–F" }), el("td", { class: "small", text: "Địa chỉ bộ nhớ, màu sắc HTML (#FF5733)" })]),
          ]),
        ]),
      ]),
      el("div", { class: "alert alert-info", style: { marginTop: "12px" } }, [
        el("strong", { text: "Điểm mấu chốt: " }),
        el("span", { text: "Giá trị của một số KHÔNG thay đổi khi đổi hệ đếm — chỉ cách viết thay đổi. Số 12 (thập phân) = 1100 (nhị phân) = C (hex) đều là cùng một lượng." }),
      ]),
    ),
  );

  container.appendChild(
    section("Luyện tập: thay đổi chữ số", buildDigitTweaker()),
  );

  container.appendChild(
    quizSection(
      "decimal",
      [
        {
          prompt: "Trong số thập phân <strong>3052</strong>, giá trị vị trí của chữ số <strong>3</strong> là bao nhiêu?",
          options: [{ label: "1" }, { label: "100" }, { label: "1 000" }, { label: "10 000" }],
          answer: 2,
          hint: "Đếm vị trí từ phải sang, bắt đầu từ 0.",
          explanation: "3052 = 3×1000 + 0×100 + 5×10 + 2×1.",
        },
        {
          prompt: "Khai triển nào bằng <strong>6 207</strong>?",
          options: [
            { label: "6×1000 + 2×100 + 0×10 + 7×1" },
            { label: "6×100 + 2×10 + 0×1 + 7×0,1" },
            { label: "6×10 + 2×1 + 0 + 7" },
            { label: "6 + 2 + 0 + 7" },
          ],
          answer: 0,
          hint: "Lũy thừa của 10 từ phải sang.",
          explanation: "Vị trí 3 là 10³ = 1000, vị trí 0 là 10⁰ = 1.",
        },
        {
          prompt: "<strong>4 chữ số thập phân</strong> biểu diễn được bao nhiêu giá trị phân biệt?",
          options: [{ label: "40" }, { label: "100" }, { label: "1 000" }, { label: "10 000" }],
          answer: 3,
          hint: "10^n.",
          explanation: "4 chữ số → 10⁴ = 10 000 tổ hợp (0000 đến 9999).",
        },
      ],
    ),
  );

  container.appendChild(
    section(
      "Summary",
      summary(null, [
        "Hệ thập phân là cơ số 10 — chữ số 0..9 và giá trị vị trí 1, 10, 100, ...",
        "Giá trị = tổng của <em>chữ số × giá trị vị trí</em> cho mỗi chữ số.",
        "Các hệ thống số khác dùng cùng ý tưởng với cơ số khác nhau.",
      ]),
    ),
  );
}

function buildExpander() {
  const card = el("div", { class: "card" });
  const inp = el("input", {
    class: "input input-mono",
    type: "text",
    value: "4072",
    style: { width: "200px", fontSize: "22px", textAlign: "center" },
  });
  const expansion = el("div", { style: { marginTop: "16px" } });

  function rerender() {
    const raw = inp.value.replace(/[^0-9]/g, "").slice(0, 8) || "0";
    inp.value = raw;
    clear(expansion);
    const digits = raw.split("");
    const cols = el("div", { class: "row", style: { justifyContent: "center", gap: "14px", flexWrap: "wrap" } });
    let total = 0;
    digits.forEach((d, i) => {
      const place = digits.length - 1 - i;
      const weight = Math.pow(10, place);
      const contrib = parseInt(d, 10) * weight;
      total += contrib;
      cols.appendChild(
        el(
          "div",
          { class: contrib > 0 ? "card card-soft-peach" : "card", style: { textAlign: "center", padding: "10px 14px" } },
          [
            el("div", { class: "mono", style: { fontSize: "26px", fontWeight: "700" }, text: d }),
            el("div", { class: "small mono text-2", style: { marginTop: "4px" }, text: "× 10" + supDigits(place) }),
            el("div", { class: "small", style: { marginTop: "2px", fontWeight: "500" }, text: "= " + contrib.toLocaleString() }),
          ],
        ),
      );
    });
    expansion.appendChild(cols);
    expansion.appendChild(
      el("div", { class: "card card-soft-mint", style: { marginTop: "12px", textAlign: "center" } }, [
        el("span", {
          html: "Tổng = " + digits.map((d, i) => parseInt(d, 10) * Math.pow(10, digits.length - 1 - i)).filter((x) => x > 0).join(" + "),
        }),
        el("div", { style: { fontSize: "22px", fontWeight: "600", marginTop: "4px" }, text: total.toLocaleString() }),
      ]),
    );
  }

  inp.addEventListener("input", rerender);
  card.appendChild(
    el("div", { class: "row", style: { justifyContent: "center" } }, [
      el("span", { class: "small text-2", text: "Nhập số thập phân:" }),
      inp,
    ]),
  );
  card.appendChild(expansion);
  rerender();
  return card;
}

function supDigits(n) {
  const map = { "0": "⁰", "1": "¹", "2": "²", "3": "³", "4": "⁴", "5": "⁵", "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹" };
  return String(n)
    .split("")
    .map((d) => map[d])
    .join("");
}

function buildDigitTweaker() {
  const card = el("div", { class: "card" });
  let digits = [4, 0, 7, 2];

  const cells = el("div", { class: "row", style: { justifyContent: "center", gap: "10px" } });
  const display = el("div", { style: { textAlign: "center", marginTop: "12px" } });

  function rerender() {
    clear(cells);
    digits.forEach((d, i) => {
      const place = digits.length - 1 - i;
      const col = el("div", { class: "bit-row" }, [
        el("div", { class: "bit-weight", text: "10" + supDigits(place) }),
        (() => {
          const inp = el("input", {
            class: "input input-mono",
            type: "number",
            min: "0",
            max: "9",
            value: String(d),
            style: { width: "60px", textAlign: "center", fontSize: "22px", fontWeight: "700" },
            oninput: (e) => {
              let v = parseInt(e.target.value, 10);
              if (!Number.isFinite(v) || v < 0) v = 0;
              if (v > 9) v = 9;
              e.target.value = String(v);
              digits[i] = v;
              rerender();
            },
          });
          return inp;
        })(),
        el("div", { class: "bit-contrib active", text: "+" + d * Math.pow(10, place) }),
      ]);
      cells.appendChild(col);
    });

    const total = digits.reduce((a, b, i) => a + b * Math.pow(10, digits.length - 1 - i), 0);
    clear(display);
    display.appendChild(
      el("div", { class: "card card-soft-lavender", style: { display: "inline-block", padding: "12px 24px" } }, [
        el("div", { class: "small text-2", text: "Giá trị" }),
        el("div", { class: "mono", style: { fontSize: "26px", fontWeight: "600" }, text: total.toLocaleString() }),
      ]),
    );
  }

  card.appendChild(cells);
  card.appendChild(display);
  rerender();
  return card;
}
