// Lesson 11: Gray Code — single-bit change between consecutive codes.
import { el, clear } from "../utils/dom.js";
import { section, summary, quizSection, p, resetSectionCounter } from "../utils/lesson-ui.js";
import { binToGray, grayToBin, toBinary, decToGray } from "../utils/conversions.js";

export default {
  id: "gray-code",
  order: 11,
  title: "Gray Code",
  subtitle: "A reflected binary code: two consecutive codes differ by exactly one bit.",
  objective:
    "Convert between binary and Gray code, see the single-bit transition property, and apply it to position sensing.",
  render,
};

function render(container) {
  resetSectionCounter();
  clear(container);

  container.appendChild(
    section(
      "Compare binary vs Gray",
      p(
        "Step through values 0..15 and watch how many bits change at each transition. In <strong>plain binary</strong>, a step like 7 → 8 changes all four bits at once. In <strong>Gray code</strong>, only one bit ever changes between consecutive values.",
      ),
      buildStepper(),
    ),
  );

  container.appendChild(
    section(
      "Try it: convert between binary and Gray",
      p("Type a binary value to see the Gray code and vice versa."),
      buildConverter(),
    ),
  );

  container.appendChild(
    section(
      "Why it matters: rotary encoders",
      p(
        "A rotary encoder reads a code wheel as it spins. If the wheel were marked in binary, multiple bits could change at the same instant. Mechanical wear means some bits might flip a touch earlier than others, producing brief but wrong readings. With Gray code, only one bit changes per step — so the reading is at most one position off, never wildly wrong.",
      ),
      buildEncoderDemo(),
    ),
  );

  container.appendChild(
    section(
      "Spot the bad transition",
      p(
        "These transitions are presented in order. Which one breaks the Gray code rule (more than one bit changes)?",
      ),
      buildBadTransitionExercise(),
    ),
  );

  container.appendChild(
    quizSection(
      "gray-code",
      [
        {
          prompt: "What is the Gray code for binary <span class='mono'>0110</span>?",
          options: [
            { label: "<span class='mono'>0011</span>" },
            { label: "<span class='mono'>0101</span>" },
            { label: "<span class='mono'>1100</span>" },
            { label: "<span class='mono'>1001</span>" },
          ],
          answer: 1,
          hint: "G[0] = B[0]; G[i] = B[i-1] XOR B[i].",
          explanation: "0110 → keep first 0; 0⊕1=1; 1⊕1=0; 1⊕0=1 → 0101.",
        },
        {
          prompt: "Which property makes Gray code useful for encoders?",
          options: [
            { label: "Codes are shorter than binary" },
            { label: "Consecutive codes differ by exactly one bit" },
            { label: "Half the codes are zero" },
            { label: "It is the only code with no zero" },
          ],
          answer: 1,
          hint: "Think mechanical wear and bit-flip glitches.",
          explanation: "Only one bit changes per step, so a momentarily wrong bit can only mis-read by one position.",
        },
        {
          prompt: "Gray code <span class='mono'>1011</span> corresponds to which binary value?",
          options: [
            { label: "<span class='mono'>1010</span>" },
            { label: "<span class='mono'>1101</span>" },
            { label: "<span class='mono'>1110</span>" },
            { label: "<span class='mono'>1011</span>" },
          ],
          answer: 1,
          hint: "B[0] = G[0]; B[i] = G[i] XOR B[i-1].",
          explanation: "B = 1, 1⊕0=1, 1⊕1=0, 0⊕1=1 → 1101.",
        },
      ],
    ),
  );

  container.appendChild(
    section(
      "Summary",
      summary(null, [
        "Gray code is a binary encoding where <strong>consecutive values differ by one bit</strong>.",
        "Binary → Gray: G[0]=B[0]; G[i]=B[i-1]⊕B[i].",
        "Gray → Binary: B[0]=G[0]; B[i]=G[i]⊕B[i-1].",
        "Used in rotary encoders, Karnaugh maps, and asynchronous communication.",
      ]),
    ),
  );
}

function buildStepper() {
  const card = el("div", { class: "card", style: { overflowX: "auto" } });
  const tbl = el("table", { class: "tbl tbl-bordered", style: { minWidth: "560px" } });
  tbl.appendChild(
    el("thead", {}, [
      el("tr", {}, [
        el("th", { text: "Decimal" }),
        el("th", { text: "Binary" }),
        el("th", { text: "Gray" }),
        el("th", { text: "Bits changed (binary)" }),
        el("th", { text: "Bits changed (Gray)" }),
      ]),
    ]),
  );
  const tb = el("tbody");
  let prevBin = null;
  let prevGray = null;
  for (let i = 0; i < 16; i++) {
    const bin = toBinary(i, 4);
    const gray = decToGray(i, 4);
    const dBin = prevBin ? countChange(prevBin, bin) : "—";
    const dGray = prevGray ? countChange(prevGray, gray) : "—";
    tb.appendChild(
      el("tr", {}, [
        el("td", { class: "mono", text: String(i) }),
        el("td", { class: "mono", html: highlightChange(prevBin, bin) }),
        el("td", { class: "mono", html: highlightChange(prevGray, gray) }),
        el(
          "td",
          {
            class: "mono",
            style: typeof dBin === "number" && dBin > 1 ? { color: "var(--c-error)", fontWeight: "700" } : null,
            text: String(dBin),
          },
        ),
        el(
          "td",
          {
            class: "mono",
            style: typeof dGray === "number" ? { color: "var(--c-success)", fontWeight: "700" } : null,
            text: String(dGray),
          },
        ),
      ]),
    );
    prevBin = bin;
    prevGray = gray;
  }
  tbl.appendChild(tb);
  card.appendChild(tbl);
  return card;
}

function countChange(a, b) {
  let n = 0;
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) n++;
  return n;
}

function highlightChange(prev, cur) {
  if (!prev) return cur;
  let s = "";
  for (let i = 0; i < cur.length; i++) {
    if (cur[i] !== prev[i]) s += "<span style='background:var(--c-butter);padding:0 2px;border-radius:3px'>" + cur[i] + "</span>";
    else s += cur[i];
  }
  return s;
}

function buildConverter() {
  const card = el("div", { class: "card" });
  const binInp = el("input", { class: "input input-mono", type: "text", value: "0110", style: { width: "160px" } });
  const grayInp = el("input", { class: "input input-mono", type: "text", value: "0101", style: { width: "160px" } });

  function fromBin() {
    const v = binInp.value.replace(/[^01]/g, "").slice(0, 8);
    binInp.value = v;
    grayInp.value = v ? binToGray(v) : "";
    drawSteps(v, "b2g");
  }
  function fromGray() {
    const v = grayInp.value.replace(/[^01]/g, "").slice(0, 8);
    grayInp.value = v;
    binInp.value = v ? grayToBin(v) : "";
    drawSteps(v, "g2b");
  }
  binInp.addEventListener("input", fromBin);
  grayInp.addEventListener("input", fromGray);

  const steps = el("div", { style: { marginTop: "12px" } });

  function drawSteps(v, dir) {
    clear(steps);
    if (!v) return;
    const rows = [];
    if (dir === "b2g") {
      const b = v.split("").map(Number);
      const g = [b[0]];
      rows.push({ label: "G[0] = B[0]", value: String(g[0]) });
      for (let i = 1; i < b.length; i++) {
        const x = b[i - 1] ^ b[i];
        g.push(x);
        rows.push({ label: `G[${i}] = B[${i - 1}] ⊕ B[${i}] = ${b[i - 1]} ⊕ ${b[i]}`, value: String(x) });
      }
      steps.appendChild(
        el("div", { class: "card card-soft-lavender", style: { padding: "12px 16px" } }, [
          el("div", { class: "small text-2", text: "Binary → Gray, bit by bit:" }),
          ...rows.map((r) =>
            el("div", { class: "mono", style: { marginTop: "4px" } }, [r.label + " = " + r.value]),
          ),
          el("div", { class: "mono", style: { marginTop: "10px", fontSize: "18px", fontWeight: "700" }, text: "Gray = " + g.join("") }),
        ]),
      );
    } else {
      const g = v.split("").map(Number);
      const b = [g[0]];
      rows.push({ label: "B[0] = G[0]", value: String(b[0]) });
      for (let i = 1; i < g.length; i++) {
        const x = g[i] ^ b[i - 1];
        b.push(x);
        rows.push({ label: `B[${i}] = G[${i}] ⊕ B[${i - 1}] = ${g[i]} ⊕ ${b[i - 1]}`, value: String(x) });
      }
      steps.appendChild(
        el("div", { class: "card card-soft-lavender", style: { padding: "12px 16px" } }, [
          el("div", { class: "small text-2", text: "Gray → Binary, bit by bit:" }),
          ...rows.map((r) =>
            el("div", { class: "mono", style: { marginTop: "4px" } }, [r.label + " = " + r.value]),
          ),
          el("div", { class: "mono", style: { marginTop: "10px", fontSize: "18px", fontWeight: "700" }, text: "Binary = " + b.join("") }),
        ]),
      );
    }
  }

  card.appendChild(
    el("div", { class: "grid grid-2" }, [
      el("div", { class: "field" }, [
        el("label", { class: "label", text: "Binary" }),
        binInp,
      ]),
      el("div", { class: "field" }, [
        el("label", { class: "label", text: "Gray code" }),
        grayInp,
      ]),
    ]),
  );
  card.appendChild(steps);
  fromBin();
  return card;
}

function buildEncoderDemo() {
  const card = el("div", { class: "card" });
  let pos = 0; // 0..15
  const display = el("div", { class: "row", style: { justifyContent: "center", gap: "20px" } });
  const slider = el("input", {
    class: "slider",
    type: "range",
    min: "0",
    max: "15",
    value: "0",
    style: { maxWidth: "320px", marginTop: "12px" },
    oninput: (e) => {
      pos = parseInt(e.target.value, 10);
      rerender();
    },
  });

  function rerender() {
    clear(display);
    display.appendChild(
      el("div", { class: "card card-soft-sky", style: { textAlign: "center" } }, [
        el("div", { class: "small text-2", text: "Position" }),
        el("div", { style: { fontSize: "28px", fontWeight: "700" }, text: String(pos) }),
      ]),
    );
    display.appendChild(
      el("div", { class: "card card-soft-peach", style: { textAlign: "center" } }, [
        el("div", { class: "small text-2", text: "Binary code" }),
        el("div", { class: "mono", style: { fontSize: "20px", fontWeight: "700" }, text: toBinary(pos, 4) }),
      ]),
    );
    display.appendChild(
      el("div", { class: "card card-soft-mint", style: { textAlign: "center" } }, [
        el("div", { class: "small text-2", text: "Gray code" }),
        el("div", { class: "mono", style: { fontSize: "20px", fontWeight: "700" }, text: decToGray(pos, 4) }),
      ]),
    );
  }
  card.appendChild(display);
  card.appendChild(el("div", { style: { textAlign: "center" } }, [slider]));
  rerender();
  return card;
}

function buildBadTransitionExercise() {
  const card = el("div", { class: "card" });
  let pairs = [];
  let badIdx = -1;
  let chosen = null;
  let revealed = false;

  const list = el("div", { class: "stack" });
  const fb = el("div", { style: { marginTop: "8px" } });

  function generate() {
    // 4 transitions, mostly valid Gray, one corrupted.
    let v = Math.floor(Math.random() * 12);
    pairs = [];
    for (let i = 0; i < 4; i++) {
      const from = decToGray(v, 4);
      const to = decToGray(v + 1, 4);
      pairs.push({ from, to });
      v++;
    }
    badIdx = Math.floor(Math.random() * pairs.length);
    // Corrupt the bad one by flipping an extra bit in 'to'.
    let bad = pairs[badIdx].to.split("");
    let flip = Math.floor(Math.random() * 4);
    while (bad[flip] === (pairs[badIdx].from[flip] === "1" ? "0" : "1")) flip = (flip + 1) % 4;
    bad[flip] = bad[flip] === "1" ? "0" : "1";
    pairs[badIdx].to = bad.join("");
    chosen = null;
    revealed = false;
    rerender();
  }

  function rerender() {
    clear(list);
    pairs.forEach((p, i) => {
      let style = null;
      if (revealed) {
        if (i === badIdx) style = { borderColor: "var(--c-error)", background: "var(--c-error-bg)" };
        else style = { borderColor: "var(--c-success)", background: "var(--c-success-bg)" };
      } else if (chosen === i) {
        style = { borderColor: "var(--c-lavender-deep)", background: "var(--c-lavender)" };
      }
      const item = el(
        "button",
        {
          class: "card",
          style: {
            padding: "10px 14px",
            cursor: revealed ? "default" : "pointer",
            textAlign: "left",
            ...(style || {}),
          },
          disabled: revealed,
          onclick: () => {
            chosen = i;
            rerender();
          },
        },
        [
          el("div", { class: "mono", text: p.from + "  →  " + p.to }),
          el("div", { class: "small text-2", style: { marginTop: "2px" }, text: "Bits changed: " + countChange(p.from, p.to) }),
        ],
      );
      list.appendChild(item);
    });
    clear(fb);
    if (revealed) {
      const ok = chosen === badIdx;
      fb.appendChild(
        el("div", { class: ok ? "quiz-feedback ok" : "quiz-feedback bad" }, [
          el("strong", { text: ok ? "Correct! " : "Not quite. " }),
          el("span", { text: "The bad transition was #" + (badIdx + 1) + " — more than one bit changed." }),
        ]),
      );
    }
  }

  card.appendChild(list);
  card.appendChild(
    el("div", { class: "row", style: { marginTop: "10px" } }, [
      el("button", {
        class: "btn btn-primary btn-sm",
        text: "Check",
        onclick: () => {
          if (chosen != null) {
            revealed = true;
            rerender();
          }
        },
      }),
      el("button", { class: "btn btn-outline btn-sm", text: "New set", onclick: generate }),
    ]),
  );
  card.appendChild(fb);
  generate();
  return card;
}
