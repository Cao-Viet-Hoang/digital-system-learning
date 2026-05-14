// Lesson 7: Binary System — base 2, powers of two, weighted sum.
import { el, clear } from "../utils/dom.js";
import { section, summary, quizSection, p, resetSectionCounter } from "../utils/lesson-ui.js";
import { binToDecSteps, toBinary } from "../utils/conversions.js";

export default {
  id: "binary-system",
  order: 7,
  title: "Hệ Nhị Phân (Binary)",
  subtitle: "Cơ số 2 — mỗi vị trí là một lũy thừa của hai.",
  objective:
    "Chuyển đổi giá trị nhị phân sang thập phân từng bước theo giá trị vị trí, và nhận ra hệ nhị phân là hệ thống vị trí với cơ số 2.",
  render,
};

function render(container) {
  resetSectionCounter();
  clear(container);

  container.appendChild(
    section(
      "Hãy thử: bảng trọng số với bit có thể bật/tắt",
      p(
        "Nhấn vào ô để bật hoặc tắt từng bit. Bảng trọng số bên phải cập nhật đóng góp. Tổng là giá trị thập phân của số nhị phân.",
      ),
      buildWeightTable(),
    ),
  );

  container.appendChild(
    section(
      "Ẩn và kiểm tra",
      p(
        "Thử cách này: ẩn đáp án, tự tính giá trị thập phân, rồi hiện ra. Nút kiểm tra xác nhận đoán của bạn có khớp giá trị không.",
      ),
      buildHideCheck(),
    ),
  );

  container.appendChild(
    section(
      "Khai triển theo ký hiệu",
      el("div", { class: "card card-soft-mint" }, [
        el("p", {
          style: { margin: 0 },
          html:
            "<span class='mono'>1 0 1 1₂</span> = 1×2³ + 0×2² + 1×2¹ + 1×2⁰ = 8 + 0 + 2 + 1 = <strong>11</strong>.",
        }),
      ]),
    ),
  );

  container.appendChild(
    quizSection(
      "binary-system",
      [
        {
          prompt:
            "Giá trị thập phân của <span class='mono'>10101</span> trong nhị phân là bao nhiêu?",
          options: [{ label: "10" }, { label: "17" }, { label: "21" }, { label: "23" }],
          answer: 2,
          hint: "Trọng số: 16, 8, 4, 2, 1.",
          explanation: "1×16 + 0×8 + 1×4 + 0×2 + 1×1 = 21.",
        },
        {
          prompt:
            "Bit <strong>ngoài cùng bên phải</strong> luôn có trọng số nào?",
          options: [{ label: "0" }, { label: "1" }, { label: "2" }, { label: "Bằng với vị trí bit" }],
          answer: 1,
          hint: "Đó là 2⁰.",
          explanation: "2⁰ = 1, bất kể độ dài từ là bao nhiêu.",
        },
        {
          prompt:
            "Giá trị nhị phân nào bằng số thập phân <strong>26</strong>?",
          options: [
            { label: "<span class='mono'>10110</span>" },
            { label: "<span class='mono'>11010</span>" },
            { label: "<span class='mono'>11100</span>" },
            { label: "<span class='mono'>10010</span>" },
          ],
          answer: 1,
          hint: "26 = 16 + 8 + 2.",
          explanation: "Các bit tại trọng số 16, 8, 2 → <span class='mono'>11010</span>.",
        },
      ],
    ),
  );

  container.appendChild(
    section(
      "Summary",
      summary(null, [
        "Hệ nhị phân là cơ số 2 — hai chữ số (0, 1) và lũy thừa của hai là trọng số.",
        "Chuyển sang thập phân bằng cách cộng trọng số của các bit bằng 1.",
        "<em>n</em> bit biểu diễn 2<sup>n</sup> giá trị.",
      ]),
    ),
  );
}

function buildWeightTable() {
  const card = el("div", { class: "card" });
  const N = 8;
  const bits = new Array(N).fill(0);

  const layout = el("div", { class: "grid grid-2", style: { alignItems: "start" } });

  // Left: toggle row
  const left = el("div", { class: "card card-soft-sky" });
  left.appendChild(el("h4", { text: "Các Bit", style: { margin: "0 0 10px" } }));
  const row = el("div", { class: "row", style: { gap: "8px", justifyContent: "center", flexWrap: "wrap" } });
  const btns = [];
  for (let p = N - 1; p >= 0; p--) {
    const b = el("button", {
      class: "bit-btn",
      text: "0",
      style: { width: "44px", height: "44px", fontSize: "16px" },
      onclick: () => {
        bits[p] = bits[p] ? 0 : 1;
        update();
      },
    });
    btns[p] = b;
    row.appendChild(b);
  }
  left.appendChild(row);

  // Right: weight table
  const right = el("div", { class: "card" });
  right.appendChild(el("h4", { text: "Bảng trọng số", style: { margin: "0 0 10px" } }));
  const tbl = el("table", { class: "tbl", style: { fontSize: "13px" } });
  const tbody = el("tbody");
  tbl.appendChild(
    el("thead", {}, [
      el("tr", {}, [
        el("th", { text: "Vị trí" }),
        el("th", { text: "Trọng số" }),
        el("th", { text: "Bit" }),
        el("th", { text: "Đóng góp" }),
      ]),
    ]),
  );
  tbl.appendChild(tbody);
  right.appendChild(tbl);
  const totalRow = el("div", { class: "card card-soft-mint", style: { marginTop: "12px", textAlign: "center" } });
  right.appendChild(totalRow);

  function update() {
    clear(tbody);
    let total = 0;
    let parts = [];
    let binStr = "";
    for (let p = N - 1; p >= 0; p--) {
      btns[p].textContent = String(bits[p]);
      btns[p].classList.toggle("on", bits[p] === 1);
      binStr += bits[p];
      const weight = Math.pow(2, p);
      const c = bits[p] * weight;
      if (c > 0) {
        total += c;
        parts.push(c);
      }
      tbody.appendChild(
        el(
          "tr",
          {},
          [
            el("td", { class: "mono", text: String(p) }),
            el("td", { class: "mono", text: "2" + supDigits(p) + " = " + weight }),
            el("td", { class: "mono", text: String(bits[p]) }),
            el(
              "td",
              {
                class: "mono",
                style: c > 0 ? { color: "var(--c-peach-deep)", fontWeight: "700" } : null,
                text: c > 0 ? "+" + c : "0",
              },
            ),
          ],
        ),
      );
    }
    clear(totalRow);
    totalRow.appendChild(el("div", { class: "small text-2", text: "Giá trị nhị phân" }));
    totalRow.appendChild(el("div", { class: "mono", style: { fontSize: "20px" }, text: binStr }));
    totalRow.appendChild(
      el("div", { style: { fontSize: "26px", fontWeight: "600", marginTop: "4px" }, text: total + " (thập phân)" }),
    );
    totalRow.appendChild(
      el("div", { class: "small text-2", text: parts.length ? "= " + parts.join(" + ") : "= 0" }),
    );
  }

  layout.appendChild(left);
  layout.appendChild(right);
  card.appendChild(layout);
  update();
  return card;
}

function supDigits(n) {
  const map = { "0": "⁰", "1": "¹", "2": "²", "3": "³", "4": "⁴", "5": "⁵", "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹" };
  return String(n)
    .split("")
    .map((d) => map[d])
    .join("");
}

function buildHideCheck() {
  const card = el("div", { class: "card" });
  let bits = "";
  let hidden = true;
  const display = el("div", {
    class: "mono",
    style: { fontSize: "28px", textAlign: "center", margin: "12px 0", letterSpacing: "0.15em" },
  });
  const answer = el("div", { style: { textAlign: "center" } });
  const fb = el("div", { style: { marginTop: "10px" } });
  const inp = el("input", { class: "input input-mono", type: "number", style: { width: "100px" } });

  function newQ() {
    const v = Math.floor(Math.random() * 200) + 8;
    bits = toBinary(v, 8);
    display.textContent = bits.split("").join(" ");
    hidden = true;
    inp.value = "";
    clear(answer);
    answer.appendChild(el("button", { class: "btn btn-ghost btn-sm", text: "Hiện đáp án", onclick: revealAnswer }));
    clear(fb);
  }

  function revealAnswer() {
    hidden = false;
    const v = parseInt(bits, 2);
    const { terms, result } = binToDecSteps(bits);
    const breakdown = terms.filter((t) => t.bit).map((t) => t.weight).join(" + ");
    clear(answer);
    answer.appendChild(
      el("div", {
        class: "card card-soft-mint",
        style: { display: "inline-block", padding: "10px 18px", marginTop: "8px" },
        html: "Thập phân: <strong>" + v + "</strong> &nbsp;( = " + (breakdown || "0") + ")",
      }),
    );
  }

  card.appendChild(el("div", { class: "small text-2", style: { textAlign: "center" }, text: "Giá trị nhị phân:" }));
  card.appendChild(display);
  card.appendChild(
    el("div", { class: "row", style: { justifyContent: "center" } }, [
      el("span", { class: "small text-2", text: "Đoán thập phân của bạn:" }),
      inp,
      el("button", {
        class: "btn btn-primary btn-sm",
        text: "Kiểm tra",
        onclick: () => {
          const v = parseInt(inp.value, 10);
          const target = parseInt(bits, 2);
          clear(fb);
          if (!Number.isFinite(v)) {
            fb.appendChild(el("div", { class: "quiz-feedback hint", text: "Nhập số thập phân." }));
            return;
          }
          fb.appendChild(
            el("div", { class: v === target ? "quiz-feedback ok" : "quiz-feedback bad" }, [
              el("strong", { text: v === target ? "Chính xác! " : "Chưa đúng. " }),
              el("span", { html: "<span class='mono'>" + bits + "</span> = " + target + "." }),
            ]),
          );
        },
      }),
      el("button", { class: "btn btn-outline btn-sm", text: "Số mới", onclick: newQ }),
    ]),
  );
  card.appendChild(answer);
  card.appendChild(fb);
  newQ();
  return card;
}
