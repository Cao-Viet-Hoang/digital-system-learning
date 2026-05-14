// Lesson 3: Binary Numbers — bit-toggle simulator.
import { el, clear } from "../utils/dom.js";
import { section, summary, quizSection, p, resetSectionCounter } from "../utils/lesson-ui.js";
import { toBinary, fromBinary } from "../utils/conversions.js";

export default {
  id: "binary-numbers",
  order: 3,
  title: "Số Nhị Phân (Binary)",
  subtitle: "Chữ số hai trạng thái — 0 và 1 — kết hợp theo giá trị vị trí để biểu diễn bất kỳ số nguyên nào.",
  objective: "Xây dựng bất kỳ giá trị nào bằng cách bật/tắt bit, và đọc giá trị nhị phân như tổng có trọng số của các lũy thừa của 2.",
  render,
};

function render(container) {
  resetSectionCounter();
  clear(container);

  container.appendChild(
    section(
      "Hãy thử: bật/tắt bit để tạo số",
      p(
        "Mỗi bit có một <strong>giá trị vị trí</strong> (trọng số). Bật bit để cộng trọng số của nó vào tổng. Các bit đang bật được tô sáng màu cam bên dưới.",
      ),
      buildBitSimulator(),
    ),
  );

  container.appendChild(
    section(
      "Cách đọc giá trị",
      p(
        "Đọc các bit từ trái (quan trọng nhất) sang phải (ít quan trọng nhất). Với mỗi <strong>1</strong>, cộng trọng số của nó vào. Bỏ qua các <strong>0</strong>.",
      ),
      el("div", { class: "card card-soft-mint" }, [
        el("p", {
          style: { margin: 0 },
          html:
            "Ví dụ: <span class='mono'>1 0 1 1</span> = 1×8 + 0×4 + 1×2 + 1×1 = <strong>11</strong>. Tức là chỉ cộng trọng số của các bit bằng 1.",
        }),
      ]),
    ),
  );

  container.appendChild(
    section("Luyện tập: đọc số nhị phân", buildReadExercise()),
  );

  container.appendChild(
    section("Luyện tập: xây dựng số mục tiêu", buildBuildExercise()),
  );

  container.appendChild(
    quizSection(
      "binary-numbers",
      [
        {
          prompt:
            "Giá trị thập phân của số nhị phân <span class='mono'>1100</span> là bao nhiêu?",
          options: [{ label: "8" }, { label: "10" }, { label: "12" }, { label: "14" }],
          answer: 2,
          hint: "Trọng số: 8, 4, 2, 1. Cộng trọng số của các bit 1.",
          explanation: "1×8 + 1×4 + 0×2 + 0×1 = <strong>12</strong>.",
        },
        {
          prompt:
            "Số nhị phân 4 bit nào biểu diễn <strong>5</strong>?",
          options: [
            { label: "<span class='mono'>0011</span>" },
            { label: "<span class='mono'>0101</span>" },
            { label: "<span class='mono'>1010</span>" },
            { label: "<span class='mono'>0111</span>" },
          ],
          answer: 1,
          hint: "5 = 4 + 1.",
          explanation: "5 = 4 + 1, nên bit tại trọng số 4 và 1 bật: <span class='mono'>0101</span>.",
        },
        {
          prompt:
            "Với <strong>5 bit</strong>, có thể biểu diễn bao nhiêu giá trị phân biệt?",
          options: [{ label: "16" }, { label: "25" }, { label: "31" }, { label: "32" }],
          answer: 3,
          hint: "Mỗi bit nhân đôi số lượng: 2^n.",
          explanation: "5 bit cho 2^5 = 32 tổ hợp (từ 00000 đến 11111, tức 0..31).",
        },
      ],
    ),
  );

  container.appendChild(
    section(
      "Tóm tắt",
      summary(null, [
        "Một chữ số nhị phân (<em>bit</em>) là 0 hoặc 1.",
        "Mỗi vị trí có trọng số 2^k, với k tính từ phải sang bắt đầu là 0.",
        "Giá trị = tổng các trọng số mà bit tại đó bằng 1.",
        "<em>n</em> bit biểu diễn 2<sup>n</sup> giá trị phân biệt, từ 0 đến 2<sup>n</sup>−1.",
      ]),
    ),
  );
}

// --- Bit simulator (8 bits) -----------------------------------------------

function buildBitSimulator() {
  const N = 8;
  const bits = new Array(N).fill(0);
  const card = el("div", { class: "card" });

  const row = el("div", { class: "row", style: { justifyContent: "center", gap: "12px" } });
  const display = el("div", {
    class: "card card-soft-lavender",
    style: { marginTop: "20px", textAlign: "center" },
  });

  const bitButtons = [];
  const contribLabels = [];

  for (let i = 0; i < N; i++) {
    const pos = N - 1 - i; // index from MSB
    const weight = Math.pow(2, pos);
    const col = el("div", { class: "bit-row" }, [
      el("div", { class: "bit-weight", text: "2" + supDigits(pos) }),
      (() => {
        const btn = el("button", {
          class: "bit-btn",
          text: "0",
          onclick: () => {
            bits[pos] = bits[pos] ? 0 : 1;
            update();
          },
        });
        bitButtons[pos] = btn;
        return btn;
      })(),
      el("div", { class: "bit-weight", text: "= " + weight }),
      (() => {
        const c = el("div", { class: "bit-contrib", text: "" });
        contribLabels[pos] = c;
        return c;
      })(),
    ]);
    row.appendChild(col);
  }

  function update() {
    let total = 0;
    let binStr = "";
    const parts = [];
    for (let p = N - 1; p >= 0; p--) {
      const v = bits[p];
      binStr += v;
      bitButtons[p].textContent = String(v);
      bitButtons[p].classList.toggle("on", v === 1);
      const weight = Math.pow(2, p);
      if (v) {
        total += weight;
        contribLabels[p].textContent = "+" + weight;
        contribLabels[p].classList.add("active");
        parts.push(weight);
      } else {
        contribLabels[p].textContent = "";
        contribLabels[p].classList.remove("active");
      }
    }
    clear(display);
    display.appendChild(
      el("div", { class: "mono", style: { fontSize: "28px", letterSpacing: "0.1em" } }, [binStr]),
    );
    display.appendChild(
      el("div", { class: "small text-2", style: { marginTop: "8px" } }, [
        parts.length === 0
          ? el("span", { text: "Thập phân: 0" })
          : el("span", { html: "Thập phân: " + parts.join(" + ") + " = <strong>" + total + "</strong>" }),
      ]),
    );
    display.appendChild(
      el("div", { class: "small mono text-2", style: { marginTop: "4px" }, text: "Hex: " + total.toString(16).toUpperCase() }),
    );
  }

  card.appendChild(row);
  card.appendChild(display);
  card.appendChild(
    el("div", { class: "row", style: { marginTop: "16px", justifyContent: "center" } }, [
      el("button", {
        class: "btn btn-outline btn-sm",
        text: "Tất cả 0",
        onclick: () => {
          bits.fill(0);
          update();
        },
      }),
      el("button", {
        class: "btn btn-outline btn-sm",
        text: "Tất cả 1",
        onclick: () => {
          bits.fill(1);
          update();
        },
      }),
      el("button", {
        class: "btn btn-outline btn-sm",
        text: "Ngẫu nhiên",
        onclick: () => {
          for (let i = 0; i < N; i++) bits[i] = Math.random() < 0.5 ? 0 : 1;
          update();
        },
      }),
    ]),
  );

  // Decimal input
  const inputRow = el(
    "div",
    { class: "row", style: { marginTop: "16px", justifyContent: "center" } },
    [
      el("span", { class: "small text-2", text: "Đặt từ thập phân:" }),
      (() => {
        const inp = el("input", {
          class: "input input-mono",
          type: "number",
          min: "0",
          max: "255",
          style: { width: "100px" },
          placeholder: "0-255",
        });
        const apply = () => {
          const v = parseInt(inp.value, 10);
          if (Number.isFinite(v) && v >= 0 && v <= 255) {
            for (let p = 0; p < N; p++) bits[p] = (v >> p) & 1;
            update();
          }
        };
        inp.addEventListener("change", apply);
        inp.addEventListener("keydown", (e) => {
          if (e.key === "Enter") apply();
        });
        return inp;
      })(),
    ],
  );
  card.appendChild(inputRow);

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

// --- Read exercise --------------------------------------------------------

function buildReadExercise() {
  const card = el("div", { class: "card" });
  const state = { target: null };

  function newQuestion() {
    state.target = Math.floor(Math.random() * 240) + 8;
    const bits = toBinary(state.target, 8);
    const display = el("div", {
      class: "mono",
      style: { fontSize: "28px", letterSpacing: "0.15em", textAlign: "center", margin: "16px 0" },
      text: bits.split("").join(" "),
    });
    const inp = el("input", { class: "input input-mono", type: "number", style: { width: "120px" } });
    const fb = el("div", { style: { marginTop: "10px" } });
    const actions = el("div", { class: "row", style: { marginTop: "10px" } }, [
      el("span", { class: "small text-2", text: "Đáp án thập phân của bạn:" }),
      inp,
      el("button", {
        class: "btn btn-primary btn-sm",
        text: "Kiểm tra",
        onclick: () => {
          const v = parseInt(inp.value, 10);
          clear(fb);
          if (!Number.isFinite(v)) {
            fb.appendChild(el("div", { class: "quiz-feedback hint", text: "Nhập một số." }));
            return;
          }
          const ok = v === state.target;
          fb.appendChild(
            el("div", { class: ok ? "quiz-feedback ok" : "quiz-feedback bad" }, [
              el("strong", { text: ok ? "Chính xác! " : "Chưa đúng. " }),
              el("span", { html: "<span class='mono'>" + bits + "</span> = " + state.target + "." }),
            ]),
          );
        },
      }),
      el("button", {
        class: "btn btn-outline btn-sm",
        text: "Số mới",
        onclick: () => rerender(),
      }),
    ]);
    clear(card);
    card.appendChild(el("div", { class: "small text-2", style: { textAlign: "center" }, text: "Đọc số nhị phân 8 bit này:" }));
    card.appendChild(display);
    card.appendChild(el("div", { class: "row", style: { justifyContent: "center", flexWrap: "wrap" } }, [actions]));
    card.appendChild(fb);
  }
  function rerender() {
    newQuestion();
  }
  rerender();
  return card;
}

// --- Build exercise -------------------------------------------------------

function buildBuildExercise() {
  const N = 8;
  const card = el("div", { class: "card" });
  const state = { target: 0, bits: new Array(N).fill(0) };

  const targetDisplay = el("div", { style: { textAlign: "center", marginBottom: "12px" } });
  const row = el("div", { class: "row", style: { justifyContent: "center", gap: "10px" } });
  const value = el("div", { class: "mono", style: { textAlign: "center", marginTop: "10px", fontSize: "18px" } });
  const fb = el("div", { style: { marginTop: "10px" } });

  function nextTarget() {
    state.target = Math.floor(Math.random() * 240) + 8;
    state.bits.fill(0);
    rerender();
  }

  function rerender() {
    clear(targetDisplay);
    targetDisplay.appendChild(el("div", { class: "small text-2", text: "Giá trị mục tiêu (thập phân):" }));
    targetDisplay.appendChild(
      el("div", { style: { fontSize: "26px", fontWeight: "600" }, text: String(state.target) }),
    );

    clear(row);
    for (let p = N - 1; p >= 0; p--) {
      const weight = Math.pow(2, p);
      const onOff = state.bits[p];
      const col = el("div", { class: "bit-row" }, [
        el("div", { class: "bit-weight", text: String(weight) }),
        el("button", {
          class: "bit-btn" + (onOff ? " on" : ""),
          text: String(onOff),
          onclick: () => {
            state.bits[p] = onOff ? 0 : 1;
            rerender();
          },
        }),
      ]);
      row.appendChild(col);
    }
    const cur = state.bits.reduce((a, b, p) => a + (b ? Math.pow(2, p) : 0), 0);
    const bin = state.bits.slice().reverse().join("");
    clear(value);
    value.appendChild(el("span", { text: "Hiện tại: " + bin + " = " + cur }));

    clear(fb);
    if (cur === state.target) {
      fb.appendChild(
        el("div", { class: "quiz-feedback ok", html: "<strong>Khớp rồi!</strong> Nhấn <em>Mục tiêu mới</em> để thử tiếp." }),
      );
    }
  }

  card.appendChild(targetDisplay);
  card.appendChild(row);
  card.appendChild(value);
  card.appendChild(fb);
  card.appendChild(
    el("div", { class: "row", style: { justifyContent: "center", marginTop: "12px" } }, [
      el("button", { class: "btn btn-outline btn-sm", text: "Mục tiêu mới", onclick: nextTarget }),
      el("button", {
        class: "btn btn-ghost btn-sm",
        text: "Xem đáp án",
        onclick: () => {
          for (let p = 0; p < N; p++) state.bits[p] = (state.target >> p) & 1;
          rerender();
        },
      }),
    ]),
  );

  nextTarget();
  return card;
}
