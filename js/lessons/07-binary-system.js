// Lesson 7: Binary System — base 2, powers of two, weighted sum.
import { el, clear } from "../utils/dom.js";
import { section, summary, quizSection, p, resetSectionCounter } from "../utils/lesson-ui.js";
import { binToDecSteps, toBinary } from "../utils/conversions.js";

export default {
  id: "binary-system",
  order: 7,
  title: "The Binary System",
  subtitle: "Base 2 — every position is a power of two.",
  objective:
    "Convert a binary value to decimal step by step using place values, and recognise binary as a positional system with base 2.",
  render,
};

function render(container) {
  resetSectionCounter();
  clear(container);

  container.appendChild(
    section(
      "Try it: weight table with toggleable bits",
      p(
        "Click cells to switch each bit on or off. The weight table on the right updates the contribution. The total is the decimal value of the binary number.",
      ),
      buildWeightTable(),
    ),
  );

  container.appendChild(
    section(
      "Hide-and-check",
      p(
        "Try this: turn off the answer, compute the decimal value yourself, then reveal it. The check button confirms whether your guess matches the value.",
      ),
      buildHideCheck(),
    ),
  );

  container.appendChild(
    section(
      "Expansion in symbols",
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
            "What is the decimal value of <span class='mono'>10101</span> in binary?",
          options: [{ label: "10" }, { label: "17" }, { label: "21" }, { label: "23" }],
          answer: 2,
          hint: "Weights: 16, 8, 4, 2, 1.",
          explanation: "1×16 + 0×8 + 1×4 + 0×2 + 1×1 = 21.",
        },
        {
          prompt:
            "Which weight does the <strong>rightmost</strong> bit always have?",
          options: [{ label: "0" }, { label: "1" }, { label: "2" }, { label: "Same as bit position" }],
          answer: 1,
          hint: "It's 2⁰.",
          explanation: "2⁰ = 1, regardless of word length.",
        },
        {
          prompt:
            "Which binary value equals decimal <strong>26</strong>?",
          options: [
            { label: "<span class='mono'>10110</span>" },
            { label: "<span class='mono'>11010</span>" },
            { label: "<span class='mono'>11100</span>" },
            { label: "<span class='mono'>10010</span>" },
          ],
          answer: 1,
          hint: "26 = 16 + 8 + 2.",
          explanation: "Bits at weights 16, 8, 2 → <span class='mono'>11010</span>.",
        },
      ],
    ),
  );

  container.appendChild(
    section(
      "Summary",
      summary(null, [
        "Binary is base 2 — two digits (0, 1) and powers of two as weights.",
        "Convert to decimal by summing weights of the 1-bits.",
        "<em>n</em> bits represent 2<sup>n</sup> values.",
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
  left.appendChild(el("h4", { text: "Bits", style: { margin: "0 0 10px" } }));
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
  right.appendChild(el("h4", { text: "Weight table", style: { margin: "0 0 10px" } }));
  const tbl = el("table", { class: "tbl", style: { fontSize: "13px" } });
  const tbody = el("tbody");
  tbl.appendChild(
    el("thead", {}, [
      el("tr", {}, [
        el("th", { text: "Position" }),
        el("th", { text: "Weight" }),
        el("th", { text: "Bit" }),
        el("th", { text: "Contribution" }),
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
    totalRow.appendChild(el("div", { class: "small text-2", text: "Binary value" }));
    totalRow.appendChild(el("div", { class: "mono", style: { fontSize: "20px" }, text: binStr }));
    totalRow.appendChild(
      el("div", { style: { fontSize: "26px", fontWeight: "600", marginTop: "4px" }, text: total + " (decimal)" }),
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
    answer.appendChild(el("button", { class: "btn btn-ghost btn-sm", text: "Reveal answer", onclick: revealAnswer }));
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
        html: "Decimal: <strong>" + v + "</strong> &nbsp;( = " + (breakdown || "0") + ")",
      }),
    );
  }

  card.appendChild(el("div", { class: "small text-2", style: { textAlign: "center" }, text: "Binary value:" }));
  card.appendChild(display);
  card.appendChild(
    el("div", { class: "row", style: { justifyContent: "center" } }, [
      el("span", { class: "small text-2", text: "Your decimal guess:" }),
      inp,
      el("button", {
        class: "btn btn-primary btn-sm",
        text: "Check",
        onclick: () => {
          const v = parseInt(inp.value, 10);
          const target = parseInt(bits, 2);
          clear(fb);
          if (!Number.isFinite(v)) {
            fb.appendChild(el("div", { class: "quiz-feedback hint", text: "Enter a decimal number." }));
            return;
          }
          fb.appendChild(
            el("div", { class: v === target ? "quiz-feedback ok" : "quiz-feedback bad" }, [
              el("strong", { text: v === target ? "Correct! " : "Not quite. " }),
              el("span", { html: "<span class='mono'>" + bits + "</span> = " + target + "." }),
            ]),
          );
        },
      }),
      el("button", { class: "btn btn-outline btn-sm", text: "New number", onclick: newQ }),
    ]),
  );
  card.appendChild(answer);
  card.appendChild(fb);
  newQ();
  return card;
}
