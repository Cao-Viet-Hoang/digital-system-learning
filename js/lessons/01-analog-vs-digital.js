// Lesson 1: Analog vs Digital Systems.
import { el, clear } from "../utils/dom.js";
import { section, summary, quizSection, p, splitView, resetSectionCounter } from "../utils/lesson-ui.js";
import { COLORS } from "../utils/colors.js";

export default {
  id: "analog-vs-digital",
  order: 1,
  title: "Analog vs Digital Systems",
  subtitle: "How continuous signals differ from discrete ones, and why digital wins for storage and processing.",
  objective:
    "Distinguish analog from digital signals and explain why most modern systems sample the world into digital form.",
  render,
};

function render(container) {
  resetSectionCounter();
  clear(container);

  container.appendChild(
    section(
      "Try it: continuous vs discrete",
      p(
        "Move the sliders below to change a real-world signal. The <strong>top</strong> trace is the analog version — a smooth curve. The <strong>bottom</strong> trace is the digital version — a staircase made of discrete samples. Add noise to see how each form copes.",
      ),
      buildSimulator(),
    ),
  );

  container.appendChild(
    section(
      "What's the difference?",
      splitView(
        el("div", { class: "card card-soft-sky" }, [
          el("h3", { text: "Analog signal" }),
          el("p", {
            text: "Varies continuously over time. Can take any value within its range. Sound waves, temperature, light brightness, and natural voltages are all analog.",
          }),
          el("ul", {}, [
            el("li", { text: "Smooth, continuous curve" }),
            el("li", { text: "Infinite possible values" }),
            el("li", { text: "Sensitive to noise — every wobble counts" }),
          ]),
        ]),
        el("div", { class: "card card-soft-peach" }, [
          el("h3", { text: "Digital signal" }),
          el("p", {
            text: "Switches between a small set of discrete levels — usually two: 0 and 1. Computers, USB cables, and CDs all use digital representations.",
          }),
          el("ul", {}, [
            el("li", { text: "Staircase or square shape" }),
            el("li", { text: "Two levels: low (0) and high (1)" }),
            el("li", { text: "Tolerates noise — small wobbles still read as 0 or 1" }),
          ]),
        ]),
      ),
    ),
  );

  container.appendChild(
    section(
      "Real-world examples",
      el("div", { class: "grid grid-3" }, [
        exampleCard("🎤", "Microphone", "Analog: continuous air pressure → continuous voltage."),
        exampleCard("🎚️", "Volume knob", "Analog: smooth resistance change."),
        exampleCard("💡", "Light switch", "Digital: on or off — nothing in between."),
        exampleCard("💻", "Computer memory", "Digital: every bit is 0 or 1."),
        exampleCard("🌡️", "Mercury thermometer", "Analog: continuous height of liquid."),
        exampleCard("⌨️", "Keyboard key", "Digital: pressed or not pressed."),
      ]),
    ),
  );

  container.appendChild(
    section(
      "Pros and cons",
      el("table", { class: "tbl tbl-bordered" }, [
        el("thead", {}, [
          el("tr", {}, [
            el("th", { text: "Aspect" }),
            el("th", { text: "Analog" }),
            el("th", { text: "Digital" }),
          ]),
        ]),
        el("tbody", {}, [
          row(["Detail", "Captures fine variation naturally", "Limited by sample resolution"]),
          row(["Noise tolerance", "Poor — noise distorts the signal", "High — small noise is ignored"]),
          row(["Storage", "Degrades over copies", "Lossless copies, easy to compress"]),
          row(["Processing", "Special analog circuits", "Standard computers, any algorithm"]),
          row(["Cost at scale", "Expensive precise components", "Cheap chips, mass-produced"]),
        ]),
      ]),
    ),
  );

  container.appendChild(
    quizSection(
      "analog-vs-digital",
      [
        {
          prompt:
            "Which of the following is an <strong>analog</strong> quantity?",
          options: [
            { label: "The number of students in a classroom" },
            { label: "The voltage at a microphone output as someone speaks" },
            { label: "Whether a light switch is on or off" },
            { label: "A pixel value stored as 8 bits" },
          ],
          answer: 1,
          hint: "Analog signals vary smoothly over time.",
          explanation:
            "A microphone output is a continuously varying voltage — that's analog. The other choices are either counts or already discretised.",
        },
        {
          prompt:
            "Why is digital generally preferred for storing music compared to analog tape?",
          options: [
            { label: "Digital sound has more information than analog" },
            { label: "Digital signals tolerate noise better, so copies stay clean" },
            { label: "Analog circuits cannot represent audio" },
            { label: "Digital files are always smaller than tape" },
          ],
          answer: 1,
          hint: "Think about what happens when you copy a tape multiple times.",
          explanation:
            "Small noise added to a digital signal is still read as the same 0 or 1, so digital copies are identical to the original. Analog tapes lose quality on every copy.",
        },
        {
          prompt:
            "A traffic light shows red, yellow or green. Is the light state itself analog or digital?",
          options: [
            { label: "Analog — it varies continuously" },
            { label: "Digital — it has a small set of discrete states" },
            { label: "Neither — it's mechanical" },
            { label: "Both at once" },
          ],
          answer: 1,
          hint: "Count how many distinct states the system has.",
          explanation:
            "The light has three distinct states. Anything with a small, countable set of states is digital, even if it has more than two.",
        },
      ],
    ),
  );

  container.appendChild(
    section(
      "Summary",
      summary(null, [
        "<strong>Analog</strong> signals vary continuously; <strong>digital</strong> signals take a small set of discrete values.",
        "Digital signals tolerate noise — that is why nearly all modern storage, communication and computing is digital.",
        "Most real-world quantities (sound, light, temperature) are analog and must be <em>sampled</em> to become digital.",
      ]),
    ),
  );
}

function exampleCard(icon, title, text) {
  return el("div", { class: "card" }, [
    el("div", { style: { fontSize: "26px", marginBottom: "4px" }, text: icon }),
    el("h4", { text: title, style: { margin: "4px 0" } }),
    el("p", { class: "small text-2", style: { margin: 0 }, text }),
  ]);
}

function row(cells) {
  return el(
    "tr",
    {},
    cells.map((c, i) => el(i === 0 ? "th" : "td", { text: c })),
  );
}

// --- Simulator -------------------------------------------------------------

function buildSimulator() {
  const card = el("div", { class: "card" });
  const state = { amp: 60, freq: 1.5, noise: 0, levels: 4 };

  const svgNS = "http://www.w3.org/2000/svg";
  const W = 640;
  const H = 360;
  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
  svg.setAttribute("width", "100%");
  svg.style.maxHeight = "360px";
  svg.style.background = COLORS.surface2;
  svg.style.borderRadius = "10px";

  const analogPath = document.createElementNS(svgNS, "path");
  analogPath.setAttribute("fill", "none");
  analogPath.setAttribute("stroke", COLORS.skyDeep);
  analogPath.setAttribute("stroke-width", "2.5");
  analogPath.setAttribute("stroke-linejoin", "round");

  const digitalPath = document.createElementNS(svgNS, "path");
  digitalPath.setAttribute("fill", "none");
  digitalPath.setAttribute("stroke", COLORS.peachDeep);
  digitalPath.setAttribute("stroke-width", "2.5");

  // Center lines
  function centerLine(y, label) {
    const g = document.createElementNS(svgNS, "g");
    const line = document.createElementNS(svgNS, "line");
    line.setAttribute("x1", 40);
    line.setAttribute("x2", W - 10);
    line.setAttribute("y1", y);
    line.setAttribute("y2", y);
    line.setAttribute("stroke", COLORS.borderStrong);
    line.setAttribute("stroke-dasharray", "4 4");
    const t = document.createElementNS(svgNS, "text");
    t.setAttribute("x", 8);
    t.setAttribute("y", y - 80);
    t.setAttribute("font-size", "12");
    t.setAttribute("fill", COLORS.text2);
    t.setAttribute("font-family", "Inter");
    t.textContent = label;
    g.appendChild(t);
    g.appendChild(line);
    return g;
  }
  svg.appendChild(centerLine(90, "Analog"));
  svg.appendChild(centerLine(270, "Digital (sampled)"));
  svg.appendChild(analogPath);
  svg.appendChild(digitalPath);

  function update() {
    const samples = 200;
    const xs = [];
    const analogYs = [];
    for (let i = 0; i <= samples; i++) {
      const t = i / samples;
      const x = 40 + t * (W - 50);
      const wave = Math.sin(2 * Math.PI * state.freq * t * 2) * (state.amp / 100);
      const noise = (Math.random() - 0.5) * (state.noise / 100) * 1.0;
      const y = 90 - wave * 60 + noise * 60;
      xs.push(x);
      analogYs.push(y);
    }
    analogPath.setAttribute("d", buildPath(xs, analogYs));

    // Digital: sample analog at fixed intervals and quantise to N levels.
    const sampleCount = 32;
    const levels = state.levels;
    const dxs = [];
    const dys = [];
    for (let i = 0; i <= sampleCount; i++) {
      const t = i / sampleCount;
      const idx = Math.min(samples, Math.round(t * samples));
      const yAnalog = analogYs[idx];
      // Map yAnalog (range ~30..150 around centre 90) to [0..levels-1]
      const v = (90 - yAnalog) / 60; // approx -1..1
      const clamped = Math.max(-1, Math.min(1, v));
      const lvl = Math.round(((clamped + 1) / 2) * (levels - 1));
      const yDigital = 270 - ((lvl / (levels - 1)) * 120 - 60);
      const x = 40 + t * (W - 50);
      dxs.push(x);
      dys.push(yDigital);
    }
    digitalPath.setAttribute("d", buildStepPath(dxs, dys));
  }

  function buildPath(xs, ys) {
    let s = "";
    for (let i = 0; i < xs.length; i++) {
      s += (i === 0 ? "M" : "L") + xs[i].toFixed(1) + " " + ys[i].toFixed(1) + " ";
    }
    return s;
  }

  function buildStepPath(xs, ys) {
    let s = "M" + xs[0].toFixed(1) + " " + ys[0].toFixed(1) + " ";
    for (let i = 1; i < xs.length; i++) {
      s += "L" + xs[i].toFixed(1) + " " + ys[i - 1].toFixed(1) + " ";
      s += "L" + xs[i].toFixed(1) + " " + ys[i].toFixed(1) + " ";
    }
    return s;
  }

  card.appendChild(svg);

  const controls = el("div", { class: "grid grid-4", style: { marginTop: "16px" } });
  controls.appendChild(slider("Amplitude", 10, 100, state.amp, (v) => ((state.amp = v), update())));
  controls.appendChild(slider("Frequency", 0.5, 4, state.freq, (v) => ((state.freq = v), update()), 0.1));
  controls.appendChild(slider("Noise", 0, 60, state.noise, (v) => ((state.noise = v), update())));
  controls.appendChild(
    slider("Digital levels", 2, 16, state.levels, (v) => ((state.levels = Math.round(v)), update()), 1),
  );
  card.appendChild(controls);

  card.appendChild(
    el("div", { class: "alert alert-info", style: { marginTop: "16px" } }, [
      el("strong", { text: "Observe: " }),
      el("span", {
        text:
          "Increase noise — the analog (blue) signal gets jittery quickly, but the digital (orange) version stays steady. That's the noise-tolerance advantage. Decrease the digital levels to see how a coarser sampling loses detail.",
      }),
    ]),
  );

  update();
  return card;
}

function slider(label, min, max, value, oninput, step = 1) {
  const labelEl = el("div", { class: "row", style: { justifyContent: "space-between" } }, [
    el("span", { class: "small text-2", text: label }),
    el("span", { class: "small mono", text: String(value) }),
  ]);
  const inp = el("input", {
    class: "slider",
    type: "range",
    min: String(min),
    max: String(max),
    step: String(step),
    value: String(value),
    oninput: (e) => {
      const v = parseFloat(e.target.value);
      labelEl.children[1].textContent = step < 1 ? v.toFixed(1) : String(v);
      oninput(v);
    },
  });
  return el("div", { class: "stack", style: { gap: "6px" } }, [labelEl, inp]);
}
