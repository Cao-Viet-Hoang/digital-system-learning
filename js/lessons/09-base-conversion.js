// Lesson 9: Base Conversion with step-by-step solutions.
import { el, clear } from "../utils/dom.js";
import { section, summary, quizSection, p, resetSectionCounter } from "../utils/lesson-ui.js";
import {
  decToBinSteps,
  binToDecSteps,
  decToHexSteps,
  groupBitsToNibbles,
  toBinary,
  toHex,
  fromHex,
  fromBinary,
} from "../utils/conversions.js";

export default {
  id: "base-conversion",
  order: 9,
  title: "Base Conversion",
  subtitle: "Convert between decimal, binary, and hex — with every step shown.",
  objective:
    "Carry out base conversions confidently by following the standard methods: repeated division for decimal→base, weighted sum for base→decimal, nibble grouping for binary↔hex.",
  render,
};

function render(container) {
  resetSectionCounter();
  clear(container);

  container.appendChild(
    section(
      "Pick a direction",
      p("Choose what to convert. Type a value to see a step-by-step solution and the final answer."),
      buildPicker(),
    ),
  );

  container.appendChild(
    section(
      "Self-check practice",
      p(
        "Try a problem first. Enter your answer; if you're stuck, peek at the steps. New questions are generated each round.",
      ),
      buildPractice(),
    ),
  );

  container.appendChild(
    quizSection(
      "base-conversion",
      [
        {
          prompt: "Convert decimal <strong>23</strong> to binary.",
          options: [
            { label: "<span class='mono'>10101</span>" },
            { label: "<span class='mono'>10111</span>" },
            { label: "<span class='mono'>11011</span>" },
            { label: "<span class='mono'>11101</span>" },
          ],
          answer: 1,
          hint: "Divide by 2 repeatedly, reading remainders bottom-up.",
          explanation: "23 = 16 + 4 + 2 + 1 = 10111₂.",
        },
        {
          prompt: "Convert binary <span class='mono'>110101</span> to decimal.",
          options: [{ label: "21" }, { label: "53" }, { label: "55" }, { label: "61" }],
          answer: 1,
          hint: "Weights: 32, 16, 8, 4, 2, 1.",
          explanation: "32 + 16 + 4 + 1 = 53.",
        },
        {
          prompt: "Convert hex <span class='mono'>3A</span> to decimal.",
          options: [{ label: "26" }, { label: "30" }, { label: "58" }, { label: "60" }],
          answer: 2,
          hint: "3×16 + A(10).",
          explanation: "3×16 + 10 = 48 + 10 = 58.",
        },
      ],
    ),
  );

  container.appendChild(
    section(
      "Summary",
      summary(null, [
        "<strong>Decimal → binary / hex.</strong> Divide by 2 (or 16) repeatedly; remainders read from bottom to top give the answer.",
        "<strong>Binary / hex → decimal.</strong> Multiply each digit by its place value and sum.",
        "<strong>Binary ↔ hex.</strong> Group bits in fours from the right (binary → hex) or expand each hex digit to 4 bits (hex → binary).",
      ]),
    ),
  );
}

const directions = [
  { id: "d2b", label: "Decimal → Binary" },
  { id: "b2d", label: "Binary → Decimal" },
  { id: "d2h", label: "Decimal → Hex" },
  { id: "h2d", label: "Hex → Decimal" },
  { id: "b2h", label: "Binary → Hex" },
  { id: "h2b", label: "Hex → Binary" },
];

function buildPicker() {
  const card = el("div", { class: "card" });
  let active = directions[0].id;
  let raw = "23";

  const tabs = el("div", { class: "row", style: { flexWrap: "wrap" } });
  directions.forEach((d) => {
    const btn = el("button", {
      class: "btn btn-sm" + (active === d.id ? " btn-primary" : " btn-outline"),
      text: d.label,
      onclick: () => {
        active = d.id;
        raw = defaultFor(d.id);
        rerender();
      },
    });
    tabs.appendChild(btn);
  });

  const inputWrap = el("div", { style: { marginTop: "12px" } });
  const stepWrap = el("div", { style: { marginTop: "12px" } });

  function rerender() {
    clear(tabs);
    directions.forEach((d) => {
      const btn = el("button", {
        class: "btn btn-sm" + (active === d.id ? " btn-primary" : " btn-outline"),
        text: d.label,
        onclick: () => {
          active = d.id;
          raw = defaultFor(d.id);
          rerender();
        },
      });
      tabs.appendChild(btn);
    });

    clear(inputWrap);
    inputWrap.appendChild(
      el("label", { class: "label", text: inputLabel(active) }),
    );
    const inp = el("input", {
      class: "input input-mono",
      type: "text",
      value: raw,
      style: { maxWidth: "300px" },
      oninput: (e) => {
        raw = sanitize(active, e.target.value);
        e.target.value = raw;
        showSteps();
      },
    });
    inputWrap.appendChild(inp);
    showSteps();
  }

  function showSteps() {
    clear(stepWrap);
    const v = parseInput(active, raw);
    if (v == null) {
      stepWrap.appendChild(el("div", { class: "alert alert-warning", text: "Enter a valid value." }));
      return;
    }
    stepWrap.appendChild(renderSolution(active, v, raw));
  }

  card.appendChild(tabs);
  card.appendChild(inputWrap);
  card.appendChild(stepWrap);
  rerender();
  return card;
}

function inputLabel(dir) {
  return {
    d2b: "Decimal number",
    b2d: "Binary digits",
    d2h: "Decimal number",
    h2d: "Hex digits",
    b2h: "Binary digits",
    h2b: "Hex digits",
  }[dir];
}

function sanitize(dir, v) {
  if (dir === "d2b" || dir === "d2h") return v.replace(/[^0-9]/g, "").slice(0, 6);
  if (dir === "b2d" || dir === "b2h") return v.replace(/[^01]/g, "").slice(0, 16);
  return v.replace(/[^0-9a-fA-F]/g, "").toUpperCase().slice(0, 6);
}

function parseInput(dir, raw) {
  if (!raw) return null;
  if (dir === "d2b" || dir === "d2h") return parseInt(raw, 10);
  if (dir === "b2d" || dir === "b2h") return raw; // keep string
  return raw.toUpperCase();
}

function defaultFor(dir) {
  return {
    d2b: "23",
    b2d: "10111",
    d2h: "47",
    h2d: "2F",
    b2h: "11011010",
    h2b: "DA",
  }[dir];
}

function renderSolution(dir, value, raw) {
  const out = el("div", { class: "stack" });
  if (dir === "d2b") {
    const n = Number(value);
    const { steps, result } = decToBinSteps(n);
    out.appendChild(
      el("div", { class: "alert alert-info", html: "Repeatedly divide by 2; read <em>remainders</em> from bottom to top." }),
    );
    out.appendChild(renderDivTable(steps, 2));
    out.appendChild(
      el("div", { class: "card card-soft-mint", style: { textAlign: "center" } }, [
        el("div", { class: "small text-2", text: "Result" }),
        el("div", { class: "mono", style: { fontSize: "22px", fontWeight: "600" }, text: result + "₂" }),
        el("div", { class: "small", text: n + " (decimal) = " + result + " (binary)" }),
      ]),
    );
  } else if (dir === "b2d") {
    const bin = String(value);
    const { terms, result } = binToDecSteps(bin);
    out.appendChild(
      el("div", { class: "alert alert-info", html: "Multiply each bit by its place value (a power of 2) and sum." }),
    );
    out.appendChild(renderWeightTable(terms));
    out.appendChild(
      el("div", { class: "card card-soft-mint", style: { textAlign: "center" } }, [
        el("div", { class: "small text-2", text: "Result" }),
        el("div", { class: "mono", style: { fontSize: "22px", fontWeight: "600" }, text: String(result) }),
        el("div", { class: "small", text: bin + " (binary) = " + result + " (decimal)" }),
      ]),
    );
  } else if (dir === "d2h") {
    const n = Number(value);
    const { steps, result } = decToHexSteps(n);
    out.appendChild(
      el("div", { class: "alert alert-info", html: "Repeatedly divide by 16; read <em>remainders</em> from bottom to top (10–15 become A–F)." }),
    );
    out.appendChild(renderDivTable(steps, 16, true));
    out.appendChild(
      el("div", { class: "card card-soft-mint", style: { textAlign: "center" } }, [
        el("div", { class: "small text-2", text: "Result" }),
        el("div", { class: "mono", style: { fontSize: "22px", fontWeight: "600" }, text: "0x" + result }),
        el("div", { class: "small", text: n + " (decimal) = " + result + " (hex)" }),
      ]),
    );
  } else if (dir === "h2d") {
    const hex = String(value);
    const n = fromHex(hex);
    const digits = hex.split("");
    const terms = digits.map((d, i) => ({
      digit: d,
      digitValue: parseInt(d, 16),
      position: digits.length - 1 - i,
      weight: Math.pow(16, digits.length - 1 - i),
      contribution: parseInt(d, 16) * Math.pow(16, digits.length - 1 - i),
    }));
    out.appendChild(
      el("div", { class: "alert alert-info", html: "Multiply each hex digit by its place value (a power of 16)." }),
    );
    out.appendChild(renderHexWeightTable(terms));
    out.appendChild(
      el("div", { class: "card card-soft-mint", style: { textAlign: "center" } }, [
        el("div", { class: "small text-2", text: "Result" }),
        el("div", { class: "mono", style: { fontSize: "22px", fontWeight: "600" }, text: String(n) }),
      ]),
    );
  } else if (dir === "b2h") {
    const bin = String(value);
    const groups = groupBitsToNibbles(bin);
    out.appendChild(
      el("div", { class: "alert alert-info", html: "Group bits in fours from the right (pad the left with 0 if needed)." }),
    );
    const row = el("div", { class: "row", style: { justifyContent: "center", flexWrap: "wrap" } });
    groups.forEach((g) => {
      row.appendChild(
        el("div", { class: "card card-soft-peach", style: { textAlign: "center", padding: "10px 14px" } }, [
          el("div", { class: "mono", style: { fontSize: "18px" }, text: g.bits }),
          el("div", { class: "mono", style: { fontWeight: "700", fontSize: "20px" }, text: g.hex }),
        ]),
      );
    });
    out.appendChild(row);
    out.appendChild(
      el("div", { class: "card card-soft-mint", style: { textAlign: "center" } }, [
        el("div", { class: "small text-2", text: "Result" }),
        el("div", { class: "mono", style: { fontSize: "22px", fontWeight: "600" }, text: "0x" + groups.map((g) => g.hex).join("") }),
      ]),
    );
  } else if (dir === "h2b") {
    const hex = String(value);
    out.appendChild(
      el("div", { class: "alert alert-info", html: "Expand each hex digit to 4 binary bits, then concatenate." }),
    );
    const row = el("div", { class: "row", style: { justifyContent: "center", flexWrap: "wrap" } });
    const bin = hex
      .split("")
      .map((d) => parseInt(d, 16).toString(2).padStart(4, "0"));
    hex.split("").forEach((d, i) => {
      row.appendChild(
        el("div", { class: "card card-soft-peach", style: { textAlign: "center", padding: "10px 14px" } }, [
          el("div", { class: "mono", style: { fontSize: "20px", fontWeight: "700" }, text: d }),
          el("div", { class: "mono", style: { fontSize: "16px" }, text: bin[i] }),
        ]),
      );
    });
    out.appendChild(row);
    out.appendChild(
      el("div", { class: "card card-soft-mint", style: { textAlign: "center" } }, [
        el("div", { class: "small text-2", text: "Result" }),
        el("div", { class: "mono", style: { fontSize: "22px", fontWeight: "600" }, text: bin.join("") + "₂" }),
      ]),
    );
  }
  return out;
}

function renderDivTable(steps, divisor, asHex) {
  const wrap = el("div", { style: { overflowX: "auto" } });
  const tbl = el("table", { class: "tbl tbl-bordered", style: { minWidth: "440px" } });
  tbl.appendChild(
    el("thead", {}, [
      el("tr", {}, [
        el("th", { text: "Step" }),
        el("th", { text: "Dividend" }),
        el("th", { text: "÷ " + divisor }),
        el("th", { text: "Quotient" }),
        el("th", { text: "Remainder" }),
      ]),
    ]),
  );
  const tb = el("tbody");
  steps.forEach((s, i) => {
    tb.appendChild(
      el("tr", {}, [
        el("td", { class: "mono", text: String(i + 1) }),
        el("td", { class: "mono", text: String(s.dividend) }),
        el("td", { class: "mono", text: "÷ " + divisor }),
        el("td", { class: "mono", text: String(s.quotient) }),
        el("td", { class: "mono", style: { fontWeight: "700", color: "var(--c-peach-deep)" }, text: asHex ? s.digit : String(s.remainder) }),
      ]),
    );
  });
  tbl.appendChild(tb);
  wrap.appendChild(tbl);
  wrap.appendChild(
    el("p", { class: "small text-2", style: { marginTop: "8px" }, text: "Read remainders bottom-up to get the result." }),
  );
  return wrap;
}

function renderWeightTable(terms) {
  const wrap = el("div", { style: { overflowX: "auto" } });
  const tbl = el("table", { class: "tbl tbl-bordered", style: { minWidth: "440px" } });
  tbl.appendChild(
    el("thead", {}, [
      el("tr", {}, [
        el("th", { text: "Position" }),
        el("th", { text: "Bit" }),
        el("th", { text: "Weight" }),
        el("th", { text: "Contribution" }),
      ]),
    ]),
  );
  const tb = el("tbody");
  terms.forEach((t) => {
    tb.appendChild(
      el("tr", {}, [
        el("td", { class: "mono", text: String(t.position) }),
        el("td", { class: "mono", text: String(t.bit) }),
        el("td", { class: "mono", text: String(t.weight) }),
        el(
          "td",
          { class: "mono", style: t.contribution > 0 ? { color: "var(--c-peach-deep)", fontWeight: "700" } : null, text: String(t.contribution) },
        ),
      ]),
    );
  });
  tbl.appendChild(tb);
  wrap.appendChild(tbl);
  return wrap;
}

function renderHexWeightTable(terms) {
  const wrap = el("div", { style: { overflowX: "auto" } });
  const tbl = el("table", { class: "tbl tbl-bordered", style: { minWidth: "440px" } });
  tbl.appendChild(
    el("thead", {}, [
      el("tr", {}, [
        el("th", { text: "Position" }),
        el("th", { text: "Digit" }),
        el("th", { text: "Value" }),
        el("th", { text: "Weight" }),
        el("th", { text: "Contribution" }),
      ]),
    ]),
  );
  const tb = el("tbody");
  terms.forEach((t) => {
    tb.appendChild(
      el("tr", {}, [
        el("td", { class: "mono", text: String(t.position) }),
        el("td", { class: "mono", text: t.digit }),
        el("td", { class: "mono", text: String(t.digitValue) }),
        el("td", { class: "mono", text: String(t.weight) }),
        el(
          "td",
          { class: "mono", style: t.contribution > 0 ? { color: "var(--c-peach-deep)", fontWeight: "700" } : null, text: String(t.contribution) },
        ),
      ]),
    );
  });
  tbl.appendChild(tb);
  wrap.appendChild(tbl);
  return wrap;
}

// --- Practice -------------------------------------------------------------

function buildPractice() {
  const card = el("div", { class: "card" });
  const state = { dir: "d2b", q: null, showSteps: false };

  const select = el("select", { class: "select", style: { maxWidth: "260px" } });
  directions.forEach((d) => select.appendChild(el("option", { value: d.id, text: d.label, selected: d.id === state.dir })));
  select.addEventListener("change", () => {
    state.dir = select.value;
    newQ();
  });

  const promptEl = el("div", { class: "card card-soft-lavender", style: { marginTop: "12px", textAlign: "center" } });
  const inputWrap = el("div", { class: "row", style: { justifyContent: "center", marginTop: "12px" } });
  const stepsWrap = el("div", { style: { marginTop: "12px" } });
  const fb = el("div", { style: { marginTop: "10px" } });

  function newQ() {
    state.q = generateQuestion(state.dir);
    state.showSteps = false;
    clear(promptEl);
    promptEl.appendChild(el("div", { class: "small text-2", text: "Convert this value:" }));
    promptEl.appendChild(
      el("div", { class: "mono", style: { fontSize: "26px", fontWeight: "600", margin: "6px 0" }, text: state.q.display }),
    );
    promptEl.appendChild(el("div", { class: "small", text: directions.find((d) => d.id === state.dir).label }));

    clear(inputWrap);
    const inp = el("input", { class: "input input-mono", type: "text", style: { width: "160px" } });
    inputWrap.appendChild(el("span", { class: "small text-2", text: "Your answer:" }));
    inputWrap.appendChild(inp);
    inputWrap.appendChild(
      el("button", {
        class: "btn btn-primary btn-sm",
        text: "Check",
        onclick: () => {
          const guess = (inp.value || "").trim().toUpperCase().replace(/^0X/, "").replace(/^0B/, "");
          const expected = state.q.expected.toUpperCase().replace(/^0X/, "").replace(/^0B/, "");
          clear(fb);
          if (!guess) {
            fb.appendChild(el("div", { class: "quiz-feedback hint", text: "Enter your answer." }));
            return;
          }
          const ok = guess === expected;
          fb.appendChild(
            el("div", { class: ok ? "quiz-feedback ok" : "quiz-feedback bad" }, [
              el("strong", { text: ok ? "Correct! " : "Not quite. " }),
              el("span", { html: "Answer: <span class='mono'>" + state.q.expected + "</span>." }),
            ]),
          );
        },
      }),
    );
    inputWrap.appendChild(
      el("button", {
        class: "btn btn-outline btn-sm",
        text: state.showSteps ? "Hide steps" : "Show steps",
        onclick: () => {
          state.showSteps = !state.showSteps;
          renderSteps();
        },
      }),
    );
    inputWrap.appendChild(el("button", { class: "btn btn-outline btn-sm", text: "Next", onclick: newQ }));

    clear(fb);
    renderSteps();
  }

  function renderSteps() {
    clear(stepsWrap);
    if (state.showSteps) {
      stepsWrap.appendChild(renderSolution(state.dir, state.q.parsedValue, state.q.display));
    }
  }

  card.appendChild(
    el("div", { class: "row" }, [
      el("span", { class: "small text-2", text: "Conversion type:" }),
      select,
    ]),
  );
  card.appendChild(promptEl);
  card.appendChild(inputWrap);
  card.appendChild(fb);
  card.appendChild(stepsWrap);
  newQ();
  return card;
}

function generateQuestion(dir) {
  const n = Math.floor(Math.random() * 240) + 8;
  if (dir === "d2b") return { display: String(n), parsedValue: n, expected: n.toString(2) };
  if (dir === "b2d") {
    const bin = toBinary(n, 8);
    return { display: bin, parsedValue: bin, expected: String(n) };
  }
  if (dir === "d2h") return { display: String(n), parsedValue: n, expected: n.toString(16).toUpperCase() };
  if (dir === "h2d") {
    const hex = n.toString(16).toUpperCase();
    return { display: hex, parsedValue: hex, expected: String(n) };
  }
  if (dir === "b2h") {
    const bin = toBinary(n, 8);
    return { display: bin, parsedValue: bin, expected: n.toString(16).toUpperCase() };
  }
  if (dir === "h2b") {
    const hex = n.toString(16).toUpperCase();
    return { display: hex, parsedValue: hex, expected: n.toString(2).padStart(hex.length * 4, "0") };
  }
}
