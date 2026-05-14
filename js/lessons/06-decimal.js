// Lesson 6: Decimal System — base 10, place values, weighted sum.
import { el, clear } from "../utils/dom.js";
import { section, summary, quizSection, p, resetSectionCounter } from "../utils/lesson-ui.js";

export default {
  id: "decimal",
  order: 6,
  title: "The Decimal System",
  subtitle: "Base 10 — the system everyone learns first. Each digit's value is a power of 10.",
  objective:
    "Break a decimal number into its digit × place-value contributions and recognise base 10 as just one possible positional system.",
  render,
};

function render(container) {
  resetSectionCounter();
  clear(container);

  container.appendChild(
    section(
      "Try it: split any decimal number",
      p(
        "Type a number below. Each digit is shown with its place value (a power of 10) and the contribution it makes to the total.",
      ),
      buildExpander(),
    ),
  );

  container.appendChild(
    section(
      "Why base 10?",
      p(
        "Decimal uses ten digits (0–9) and ten place values (1, 10, 100, …). Probably because we have ten fingers. Other bases are just the same idea with a different number of digits: base 2 uses two, base 16 uses sixteen.",
      ),
      el("div", { class: "card card-soft-mint" }, [
        el("p", {
          style: { margin: 0 },
          html:
            "<strong>Example.</strong> 4 0 7 in decimal = 4 × 10² + 0 × 10¹ + 7 × 10⁰ = 400 + 0 + 7 = <strong>407</strong>.",
        }),
      ]),
    ),
  );

  container.appendChild(
    section("Practice: change a digit", buildDigitTweaker()),
  );

  container.appendChild(
    quizSection(
      "decimal",
      [
        {
          prompt: "In the decimal number <strong>3052</strong>, what is the place value of the digit <strong>3</strong>?",
          options: [{ label: "1" }, { label: "100" }, { label: "1 000" }, { label: "10 000" }],
          answer: 2,
          hint: "Count positions from the right starting at 0.",
          explanation: "3052 = 3×1000 + 0×100 + 5×10 + 2×1.",
        },
        {
          prompt: "Which expansion equals <strong>6 207</strong>?",
          options: [
            { label: "6×1000 + 2×100 + 0×10 + 7×1" },
            { label: "6×100 + 2×10 + 0×1 + 7×0.1" },
            { label: "6×10 + 2×1 + 0 + 7" },
            { label: "6 + 2 + 0 + 7" },
          ],
          answer: 0,
          hint: "Powers of ten from the right.",
          explanation: "Position 3 is 10³ = 1000, position 0 is 10⁰ = 1.",
        },
        {
          prompt: "How many distinct values can <strong>4 decimal digits</strong> represent?",
          options: [{ label: "40" }, { label: "100" }, { label: "1 000" }, { label: "10 000" }],
          answer: 3,
          hint: "10^n.",
          explanation: "4 digits → 10⁴ = 10 000 patterns (0000 to 9999).",
        },
      ],
    ),
  );

  container.appendChild(
    section(
      "Summary",
      summary(null, [
        "Decimal is base 10 — digits 0..9 and place values 1, 10, 100, …",
        "Value = sum over digits of <em>digit × place-value</em>.",
        "Other number systems use the same idea with a different base.",
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
          html: "Total = " + digits.map((d, i) => parseInt(d, 10) * Math.pow(10, digits.length - 1 - i)).filter((x) => x > 0).join(" + "),
        }),
        el("div", { style: { fontSize: "22px", fontWeight: "600", marginTop: "4px" }, text: total.toLocaleString() }),
      ]),
    );
  }

  inp.addEventListener("input", rerender);
  card.appendChild(
    el("div", { class: "row", style: { justifyContent: "center" } }, [
      el("span", { class: "small text-2", text: "Enter a decimal number:" }),
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
        el("div", { class: "small text-2", text: "Value" }),
        el("div", { class: "mono", style: { fontSize: "26px", fontWeight: "600" }, text: total.toLocaleString() }),
      ]),
    );
  }

  card.appendChild(cells);
  card.appendChild(display);
  rerender();
  return card;
}
