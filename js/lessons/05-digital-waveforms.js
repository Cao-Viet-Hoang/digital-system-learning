// Lesson 5: Digital Waveforms — bit streams over time.
import { el, clear } from "../utils/dom.js";
import { section, summary, quizSection, p, resetSectionCounter } from "../utils/lesson-ui.js";
import { COLORS } from "../utils/colors.js";

export default {
  id: "digital-waveforms",
  order: 5,
  title: "Digital Waveforms",
  subtitle: "A sequence of bits, plotted against time, makes a square-wave pattern.",
  objective:
    "Generate a waveform from a bit pattern, read a bit pattern from a waveform, and relate the data signal to the clock.",
  render,
};

function render(container) {
  resetSectionCounter();
  clear(container);

  container.appendChild(
    section(
      "Try it: build a waveform from bits",
      p(
        "Toggle each bit cell below — the top trace shows the matching square waveform. Adjust the clock period to slow down or speed up the signal.",
      ),
      buildEditor(),
    ),
  );

  container.appendChild(
    section("Practice: read the waveform", buildReader()),
  );

  container.appendChild(
    section(
      "Reading tips",
      el("ul", {}, [
        el("li", { html: "A <strong>high</strong> level represents <span class='mono'>1</span>; a <strong>low</strong> level represents <span class='mono'>0</span>." }),
        el("li", { html: "Each bit lasts one clock period — locate clock edges to know when the value can change." }),
        el("li", { html: "Data is sampled <em>on the clock edge</em>; in between is don't-care for the receiver." }),
      ]),
    ),
  );

  container.appendChild(
    quizSection(
      "digital-waveforms",
      [
        {
          prompt:
            "If a clock period is 100 µs, how long does it take to transmit an 8-bit byte (one bit per period)?",
          options: [{ label: "100 µs" }, { label: "400 µs" }, { label: "800 µs" }, { label: "1.6 ms" }],
          answer: 2,
          hint: "8 bits × 100 µs.",
          explanation: "8 bits × 100 µs/bit = 800 µs.",
        },
        {
          prompt:
            "A waveform that goes <em>high, low, high, high</em> represents which bit pattern (MSB first)?",
          options: [
            { label: "<span class='mono'>1011</span>" },
            { label: "<span class='mono'>0101</span>" },
            { label: "<span class='mono'>1101</span>" },
            { label: "<span class='mono'>1110</span>" },
          ],
          answer: 0,
          hint: "High → 1, low → 0, in order.",
          explanation: "high, low, high, high → 1 0 1 1.",
        },
        {
          prompt: "What does the clock signal do in a digital system?",
          options: [
            { label: "Carries the data values" },
            { label: "Sets the timing — receivers sample data on clock edges" },
            { label: "Acts as the power supply" },
            { label: "Stores the data permanently" },
          ],
          answer: 1,
          hint: "Think of it as a metronome for the data line.",
          explanation: "The clock defines bit boundaries so the transmitter and receiver agree on timing.",
        },
      ],
    ),
  );

  container.appendChild(
    section(
      "Summary",
      summary(null, [
        "A digital signal alternates between two voltage levels — high (1) and low (0) — over time.",
        "Each bit occupies one clock period, so the clock paces the whole system.",
        "Reading a waveform = noting the level during each clock period from left to right.",
      ]),
    ),
  );
}

const N_BITS_DEFAULT = 8;

function buildEditor() {
  const card = el("div", { class: "card" });
  const state = { bits: [1, 0, 1, 1, 0, 0, 1, 0], showClock: true, periodMs: 200 };

  const svgWrap = el("div");
  const cells = el("div", { class: "row", style: { justifyContent: "center", marginTop: "12px", flexWrap: "wrap" } });

  function rerender() {
    clear(cells);
    state.bits.forEach((b, i) => {
      const btn = el("button", {
        class: "bit-btn" + (b ? " on" : ""),
        text: String(b),
        style: { width: "44px", height: "44px", fontSize: "16px" },
        onclick: () => {
          state.bits[i] = b ? 0 : 1;
          rerender();
        },
      });
      cells.appendChild(btn);
    });
    clear(svgWrap);
    svgWrap.appendChild(drawWave(state.bits, { showClock: state.showClock }));
  }

  card.appendChild(svgWrap);
  card.appendChild(cells);

  const controls = el("div", { class: "row", style: { marginTop: "12px", justifyContent: "center" } }, [
    el("label", { class: "row row-tight" }, [
      (() => {
        const wrap = el("label", { class: "toggle" });
        const inp = el("input", {
          type: "checkbox",
          checked: state.showClock,
          onchange: (e) => {
            state.showClock = e.target.checked;
            rerender();
          },
        });
        wrap.appendChild(inp);
        wrap.appendChild(el("span", { class: "toggle-track" }));
        return wrap;
      })(),
      el("span", { class: "small text-2", text: "Show clock" }),
    ]),
    el("button", {
      class: "btn btn-outline btn-sm",
      text: "Add bit",
      onclick: () => {
        if (state.bits.length < 16) {
          state.bits.push(0);
          rerender();
        }
      },
    }),
    el("button", {
      class: "btn btn-outline btn-sm",
      text: "Remove bit",
      onclick: () => {
        if (state.bits.length > 2) {
          state.bits.pop();
          rerender();
        }
      },
    }),
    el("button", {
      class: "btn btn-outline btn-sm",
      text: "Random",
      onclick: () => {
        state.bits = state.bits.map(() => (Math.random() < 0.5 ? 0 : 1));
        rerender();
      },
    }),
  ]);
  card.appendChild(controls);

  rerender();
  return card;
}

function drawWave(bits, { showClock = true, height = 200, width = 640 } = {}) {
  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  svg.style.width = "100%";
  svg.style.maxHeight = `${height}px`;
  svg.style.background = COLORS.surface2;
  svg.style.borderRadius = "10px";

  const leftPad = 50;
  const cellW = (width - leftPad - 10) / bits.length;
  const dataY1 = 40;
  const dataY0 = 100;
  const clkY1 = 140;
  const clkY0 = 180;

  // Axis labels
  label(svg, "Data", 8, dataY1 - 10);
  if (showClock) label(svg, "Clock", 8, clkY1 - 10);

  // Bit cell separators
  for (let i = 0; i <= bits.length; i++) {
    const x = leftPad + i * cellW;
    const line = document.createElementNS(svgNS, "line");
    line.setAttribute("x1", x);
    line.setAttribute("x2", x);
    line.setAttribute("y1", 20);
    line.setAttribute("y2", showClock ? clkY0 + 10 : dataY0 + 10);
    line.setAttribute("stroke", COLORS.border);
    line.setAttribute("stroke-dasharray", "2 4");
    svg.appendChild(line);
  }

  // Bit labels above
  bits.forEach((b, i) => {
    const x = leftPad + i * cellW + cellW / 2;
    const t = document.createElementNS(svgNS, "text");
    t.setAttribute("x", x);
    t.setAttribute("y", 14);
    t.setAttribute("font-size", "12");
    t.setAttribute("font-family", "JetBrains Mono");
    t.setAttribute("text-anchor", "middle");
    t.setAttribute("fill", b ? COLORS.peachDeep : COLORS.skyDeep);
    t.textContent = String(b);
    svg.appendChild(t);
  });

  // Data waveform path
  const dataPath = document.createElementNS(svgNS, "path");
  dataPath.setAttribute("fill", "none");
  dataPath.setAttribute("stroke", COLORS.text);
  dataPath.setAttribute("stroke-width", "2.5");
  let dd = "";
  bits.forEach((b, i) => {
    const x0 = leftPad + i * cellW;
    const x1 = leftPad + (i + 1) * cellW;
    const y = b ? dataY1 : dataY0;
    if (i === 0) dd += `M${x0} ${y} `;
    else {
      const prevY = bits[i - 1] ? dataY1 : dataY0;
      if (prevY !== y) dd += `L${x0} ${y} `;
    }
    dd += `L${x1} ${y} `;
  });
  dataPath.setAttribute("d", dd);
  svg.appendChild(dataPath);

  if (showClock) {
    const clkPath = document.createElementNS(svgNS, "path");
    clkPath.setAttribute("fill", "none");
    clkPath.setAttribute("stroke", COLORS.lavenderDeep);
    clkPath.setAttribute("stroke-width", "2");
    let cd = `M${leftPad} ${clkY1} `;
    for (let i = 0; i < bits.length; i++) {
      const x0 = leftPad + i * cellW;
      const xMid = x0 + cellW / 2;
      const x1 = x0 + cellW;
      cd += `L${xMid} ${clkY1} L${xMid} ${clkY0} L${x1} ${clkY0} L${x1} ${clkY1} `;
    }
    clkPath.setAttribute("d", cd);
    svg.appendChild(clkPath);
  }

  return svg;
}

function label(svg, txt, x, y) {
  const t = document.createElementNS("http://www.w3.org/2000/svg", "text");
  t.setAttribute("x", x);
  t.setAttribute("y", y);
  t.setAttribute("font-size", "11");
  t.setAttribute("font-family", "Inter");
  t.setAttribute("fill", COLORS.text3);
  t.textContent = txt;
  svg.appendChild(t);
}

// --- Reader exercise ------------------------------------------------------

function buildReader() {
  const card = el("div", { class: "card" });
  const N = 8;
  let bits = [];
  const wrap = el("div");
  const inputCells = el("div", { class: "row", style: { justifyContent: "center", marginTop: "12px" } });
  const fb = el("div", { style: { marginTop: "10px" } });

  function newQ() {
    bits = Array.from({ length: N }, () => (Math.random() < 0.5 ? 0 : 1));
    clear(wrap);
    wrap.appendChild(drawWave(bits, { showClock: true }));
    clear(inputCells);
    const inputs = [];
    for (let i = 0; i < N; i++) {
      const inp = el("input", {
        class: "input input-mono",
        style: { width: "40px", textAlign: "center" },
        maxlength: "1",
        oninput: (e) => {
          const v = e.target.value;
          if (v && v !== "0" && v !== "1") e.target.value = "";
        },
      });
      inputs.push(inp);
      inputCells.appendChild(inp);
    }
    clear(fb);

    const actions = el("div", { class: "row", style: { justifyContent: "center", marginTop: "12px" } }, [
      el("button", {
        class: "btn btn-primary btn-sm",
        text: "Check",
        onclick: () => {
          const guess = inputs.map((i) => parseInt(i.value, 10));
          if (guess.some((g) => g !== 0 && g !== 1)) {
            clear(fb);
            fb.appendChild(el("div", { class: "quiz-feedback hint", text: "Enter a 0 or 1 in every cell." }));
            return;
          }
          const ok = guess.every((g, i) => g === bits[i]);
          clear(fb);
          fb.appendChild(
            el("div", { class: ok ? "quiz-feedback ok" : "quiz-feedback bad" }, [
              el("strong", { text: ok ? "Correct! " : "Not quite. " }),
              el("span", { html: "The waveform reads <span class='mono'>" + bits.join("") + "</span>." }),
            ]),
          );
        },
      }),
      el("button", { class: "btn btn-outline btn-sm", text: "New waveform", onclick: newQ }),
      el("button", {
        class: "btn btn-ghost btn-sm",
        text: "Reveal",
        onclick: () => {
          inputs.forEach((inp, i) => (inp.value = String(bits[i])));
        },
      }),
    ]);
    clear(fb);
    card._actions && card._actions.remove();
    card._actions = actions;
    card.appendChild(actions);
  }

  card.appendChild(el("div", { class: "small text-2", style: { textAlign: "center" }, text: "Read this 8-bit waveform left-to-right:" }));
  card.appendChild(wrap);
  card.appendChild(inputCells);
  card.appendChild(fb);
  newQ();
  return card;
}
