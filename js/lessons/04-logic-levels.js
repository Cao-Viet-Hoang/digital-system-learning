// Lesson 4: Logic Levels — voltage thresholds and the undefined region.
import { el, clear } from "../utils/dom.js";
import { section, summary, quizSection, p, resetSectionCounter } from "../utils/lesson-ui.js";
import { COLORS } from "../utils/colors.js";

export default {
  id: "logic-levels",
  order: 4,
  title: "Logic Levels",
  subtitle: "Logic 0, logic 1, and the forbidden region in between.",
  objective:
    "Identify whether a voltage represents logic 0, logic 1, or falls in the undefined region, and explain why margins matter.",
  render,
};

const VCC = 5.0;
const VOL_MAX = 0.8; // anything ≤ this is logic 0
const VIH_MIN = 2.0; // anything ≥ this is logic 1

function render(container) {
  resetSectionCounter();
  clear(container);

  container.appendChild(
    section(
      "Try it: drag the voltage",
      p(
        "Move the slider to set the input voltage. The reading on the right shows what the logic gate would interpret. The shaded zone in the middle is the <strong>undefined region</strong> — a circuit cannot reliably tell 0 from 1 there.",
      ),
      buildVoltageSim(),
    ),
  );

  container.appendChild(
    section(
      "Why the gap?",
      p(
        "Real circuits never produce a perfect 0 V or 5 V. Power supply noise, wire resistance, and component variation all shift voltages a little. By defining a <em>buffer zone</em> between 0 and 1, designs stay reliable even in the presence of noise. Modern logic uses tighter ranges (eg. 3.3 V, 1.8 V) but the principle is the same.",
      ),
      el("div", { class: "grid grid-3" }, [
        valueCard("Logic 0", `0 V to ${VOL_MAX} V`, "sky"),
        valueCard("Undefined", `${VOL_MAX} V to ${VIH_MIN} V`, "lavender"),
        valueCard("Logic 1", `${VIH_MIN} V to ${VCC} V`, "peach"),
      ]),
    ),
  );

  container.appendChild(
    section("Practice: predict the logic level", buildPredictExercise()),
  );

  container.appendChild(
    section(
      "Noise demo",
      p(
        "Add noise on top of an input voltage. Notice how a clean 0 (eg. 0.2 V) or clean 1 (eg. 4.7 V) easily survives noise, while a value near the threshold (eg. 2.0 V) becomes unreliable.",
      ),
      buildNoiseDemo(),
    ),
  );

  container.appendChild(
    quizSection(
      "logic-levels",
      [
        {
          prompt: "A 5 V CMOS-style gate reads <strong>0.5 V</strong>. The logic level is:",
          options: [{ label: "Logic 0" }, { label: "Logic 1" }, { label: "Undefined" }],
          answer: 0,
          hint: "0.5 V is below the 0.8 V threshold.",
          explanation: "0.5 V ≤ 0.8 V → logic 0.",
        },
        {
          prompt: "An input sits at <strong>1.5 V</strong>. The gate output is:",
          options: [
            { label: "Logic 0" },
            { label: "Logic 1" },
            { label: "Undefined — the gate may behave unpredictably" },
            { label: "Exactly halfway between 0 and 1" },
          ],
          answer: 2,
          hint: "0.8 V < 1.5 V < 2.0 V.",
          explanation: "Anything strictly between V_OL,max and V_IH,min is the undefined / forbidden region.",
        },
        {
          prompt: "Why are logic-level <em>margins</em> useful?",
          options: [
            { label: "They make the circuit faster" },
            { label: "They allow the gate to tolerate noise on the input" },
            { label: "They reduce the chip's price" },
            { label: "They double the power supply" },
          ],
          answer: 1,
          hint: "Think about real cables, supply noise and component variation.",
          explanation:
            "The buffer zone lets the gate ignore small variations on the input without flipping its interpretation.",
        },
      ],
    ),
  );

  container.appendChild(
    section(
      "Summary",
      summary(null, [
        `<strong>Logic 0</strong> = voltage ≤ ${VOL_MAX} V; <strong>logic 1</strong> = voltage ≥ ${VIH_MIN} V (on a 5 V system).`,
        "Between those thresholds is the <em>undefined region</em> — the circuit cannot reliably decide.",
        "Margins exist to tolerate noise. A clean 0 or 1 stays correct even when a little noise rides on top.",
      ]),
    ),
  );
}

function valueCard(title, range, color) {
  return el("div", { class: `card card-soft-${color}` }, [
    el("div", { style: { fontWeight: "600" }, text: title }),
    el("div", { class: "small mono", style: { marginTop: "4px" }, text: range }),
  ]);
}

// --- Voltage simulator ----------------------------------------------------

function buildVoltageSim() {
  const card = el("div", { class: "card" });

  const svgNS = "http://www.w3.org/2000/svg";
  const W = 600;
  const H = 220;
  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
  svg.style.width = "100%";
  svg.style.maxHeight = "240px";

  // Background bands
  const xAxis = 40,
    barW = W - 80,
    barH = 90,
    barY = 60;
  const v2x = (v) => xAxis + (v / VCC) * barW;
  bg(svg, xAxis, barY, v2x(VOL_MAX) - xAxis, barH, COLORS.logic0Bg);
  bg(svg, v2x(VOL_MAX), barY, v2x(VIH_MIN) - v2x(VOL_MAX), barH, COLORS.logicXBg);
  bg(svg, v2x(VIH_MIN), barY, v2x(VCC) - v2x(VIH_MIN), barH, COLORS.logic1Bg);

  // Labels
  text(svg, v2x(VOL_MAX / 2), barY + barH + 18, "Logic 0", "12", "#234a6e");
  text(svg, (v2x(VOL_MAX) + v2x(VIH_MIN)) / 2, barY + barH + 18, "Undefined", "12", "#4d3f7a");
  text(svg, (v2x(VIH_MIN) + v2x(VCC)) / 2, barY + barH + 18, "Logic 1", "12", "#7a4422");

  // Threshold labels
  text(svg, v2x(VOL_MAX), barY - 6, `${VOL_MAX.toFixed(1)}V`, "10", COLORS.text3);
  text(svg, v2x(VIH_MIN), barY - 6, `${VIH_MIN.toFixed(1)}V`, "10", COLORS.text3);
  text(svg, xAxis, barY - 6, "0V", "10", COLORS.text3);
  text(svg, xAxis + barW, barY - 6, `${VCC.toFixed(1)}V`, "10", COLORS.text3);

  // Marker
  const marker = document.createElementNS(svgNS, "g");
  const tri = document.createElementNS(svgNS, "polygon");
  tri.setAttribute("fill", COLORS.text);
  const line = document.createElementNS(svgNS, "line");
  line.setAttribute("stroke", COLORS.text);
  line.setAttribute("stroke-width", "2");
  line.setAttribute("y1", barY - 4);
  line.setAttribute("y2", barY + barH + 4);
  marker.appendChild(tri);
  marker.appendChild(line);
  svg.appendChild(marker);

  // Voltage label
  const vLabel = el("div", {
    class: "mono",
    style: { fontSize: "32px", textAlign: "center", marginTop: "8px" },
  });
  const lLabel = el("div", { style: { textAlign: "center", marginTop: "4px" } });

  function setVoltage(v) {
    const x = v2x(v);
    line.setAttribute("x1", x);
    line.setAttribute("x2", x);
    tri.setAttribute("points", `${x - 6},${barY - 8} ${x + 6},${barY - 8} ${x},${barY - 2}`);
    vLabel.textContent = v.toFixed(2) + " V";
    clear(lLabel);
    let cls = "logic-pill l-x";
    let label = "Undefined";
    if (v <= VOL_MAX) {
      cls = "logic-pill l-0";
      label = "Logic 0";
    } else if (v >= VIH_MIN) {
      cls = "logic-pill l-1";
      label = "Logic 1";
    }
    lLabel.appendChild(el("span", { class: cls, text: label }));
    if (label === "Undefined") {
      lLabel.appendChild(
        el("div", { class: "small text-2", style: { marginTop: "6px" }, text: "Caution: gate behaviour is unpredictable in this region." }),
      );
    }
  }

  card.appendChild(svg);
  card.appendChild(vLabel);
  card.appendChild(lLabel);

  const slider = el("input", {
    class: "slider",
    type: "range",
    min: "0",
    max: String(VCC),
    step: "0.05",
    value: "0",
    style: { marginTop: "16px" },
    oninput: (e) => setVoltage(parseFloat(e.target.value)),
  });
  card.appendChild(slider);

  // Quick preset buttons
  card.appendChild(
    el("div", { class: "row", style: { marginTop: "12px", justifyContent: "center" } }, [
      preset("0.2 V", 0.2),
      preset("0.9 V", 0.9),
      preset("1.5 V", 1.5),
      preset("2.0 V", 2.0),
      preset("3.5 V", 3.5),
      preset("4.8 V", 4.8),
    ]),
  );
  function preset(label, v) {
    return el("button", {
      class: "btn btn-outline btn-sm",
      text: label,
      onclick: () => {
        slider.value = String(v);
        setVoltage(v);
      },
    });
  }

  setVoltage(0);
  return card;
}

function bg(svg, x, y, w, h, fill) {
  const r = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  r.setAttribute("x", x);
  r.setAttribute("y", y);
  r.setAttribute("width", w);
  r.setAttribute("height", h);
  r.setAttribute("fill", fill);
  svg.appendChild(r);
}

function text(svg, x, y, str, size, fill) {
  const t = document.createElementNS("http://www.w3.org/2000/svg", "text");
  t.setAttribute("x", x);
  t.setAttribute("y", y);
  t.setAttribute("font-size", size);
  t.setAttribute("font-family", "Inter");
  t.setAttribute("fill", fill);
  t.setAttribute("text-anchor", "middle");
  t.textContent = str;
  svg.appendChild(t);
}

// --- Predict exercise -----------------------------------------------------

function buildPredictExercise() {
  const card = el("div", { class: "card" });
  let voltage = 0;
  let chosen = null;
  let revealed = false;
  const display = el("div", { class: "mono", style: { fontSize: "26px", textAlign: "center", margin: "12px 0" } });
  const buttons = el("div", { class: "row", style: { justifyContent: "center" } });
  const fb = el("div", { style: { marginTop: "10px" } });

  function newQ() {
    voltage = Math.round(Math.random() * 50) / 10; // 0 .. 5 in 0.1 steps
    chosen = null;
    revealed = false;
    rerender();
  }

  function rerender() {
    clear(display);
    display.appendChild(el("span", { text: voltage.toFixed(1) + " V" }));
    clear(buttons);
    [
      { v: "0", label: "Logic 0", cls: "btn-sky" },
      { v: "x", label: "Undefined", cls: "btn-outline" },
      { v: "1", label: "Logic 1", cls: "btn-peach" },
    ].forEach((opt) => {
      const isSelected = chosen === opt.v;
      let cls = `btn ${opt.cls}`;
      if (revealed) {
        if (isSelected) {
          const correct = isCorrect(opt.v);
          cls = `btn ${correct ? "btn-mint" : "btn-peach"}`;
        } else cls = "btn btn-outline";
      } else {
        cls = isSelected ? `btn btn-primary` : `btn btn-outline`;
      }
      buttons.appendChild(
        el("button", {
          class: cls,
          text: opt.label,
          disabled: revealed,
          onclick: () => {
            chosen = opt.v;
            revealed = true;
            rerender();
            const ok = isCorrect(opt.v);
            clear(fb);
            fb.appendChild(
              el("div", { class: ok ? "quiz-feedback ok" : "quiz-feedback bad" }, [
                el("strong", { text: ok ? "Correct! " : "Not quite. " }),
                el("span", { text: `${voltage.toFixed(1)} V → ${correctLabel(voltage)}.` }),
              ]),
            );
          },
        }),
      );
    });
  }

  function isCorrect(v) {
    return v === correctKey(voltage);
  }

  function correctKey(v) {
    if (v <= VOL_MAX) return "0";
    if (v >= VIH_MIN) return "1";
    return "x";
  }
  function correctLabel(v) {
    const k = correctKey(v);
    return k === "0" ? "Logic 0" : k === "1" ? "Logic 1" : "Undefined";
  }

  card.appendChild(el("div", { class: "small text-2", style: { textAlign: "center" }, text: "Predict the logic level for this voltage:" }));
  card.appendChild(display);
  card.appendChild(buttons);
  card.appendChild(fb);
  card.appendChild(
    el("div", { class: "row", style: { marginTop: "12px", justifyContent: "center" } }, [
      el("button", { class: "btn btn-outline btn-sm", text: "Next voltage", onclick: newQ }),
    ]),
  );
  newQ();
  return card;
}

// --- Noise demo -----------------------------------------------------------

function buildNoiseDemo() {
  const card = el("div", { class: "card" });
  const state = { base: 2.0, noise: 0.5 };
  const svgNS = "http://www.w3.org/2000/svg";
  const W = 600;
  const H = 200;
  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
  svg.style.width = "100%";
  svg.style.maxHeight = "220px";
  svg.style.background = COLORS.surface2;
  svg.style.borderRadius = "10px";

  // Threshold lines
  const v2y = (v) => H - 30 - (v / VCC) * (H - 60);
  const top = v2y(VIH_MIN);
  const bot = v2y(VOL_MAX);
  bgRect(svg, 0, top, W, bot - top, COLORS.logicXBg);
  hLine(svg, top, COLORS.peachDeep);
  hLine(svg, bot, COLORS.skyDeep);

  const path = document.createElementNS(svgNS, "path");
  path.setAttribute("fill", "none");
  path.setAttribute("stroke", COLORS.text);
  path.setAttribute("stroke-width", "2");
  svg.appendChild(path);

  const readingLabel = el("div", { class: "small text-2", style: { marginTop: "8px", textAlign: "center" } });

  function update() {
    const N = 200;
    const xs = [];
    const ys = [];
    let countUndef = 0;
    for (let i = 0; i < N; i++) {
      const x = (i / (N - 1)) * (W - 20) + 10;
      const v = state.base + (Math.random() - 0.5) * state.noise * 2;
      const vc = Math.max(0, Math.min(VCC, v));
      xs.push(x);
      ys.push(v2y(vc));
      if (vc > VOL_MAX && vc < VIH_MIN) countUndef++;
    }
    let d = "";
    for (let i = 0; i < N; i++) d += (i === 0 ? "M" : "L") + xs[i].toFixed(1) + " " + ys[i].toFixed(1) + " ";
    path.setAttribute("d", d);

    readingLabel.textContent = `${countUndef} / ${N} samples landed in the undefined region.`;
  }

  card.appendChild(svg);
  card.appendChild(readingLabel);

  const controls = el("div", { class: "grid grid-2", style: { marginTop: "12px" } });
  controls.appendChild(
    sliderRow("Base voltage", 0, VCC, state.base, 0.1, (v) => {
      state.base = v;
      update();
    }, (v) => v.toFixed(1) + " V"),
  );
  controls.appendChild(
    sliderRow("Noise amplitude", 0, 1.5, state.noise, 0.05, (v) => {
      state.noise = v;
      update();
    }, (v) => "±" + v.toFixed(2) + " V"),
  );
  card.appendChild(controls);
  update();
  return card;
}

function hLine(svg, y, color) {
  const l = document.createElementNS("http://www.w3.org/2000/svg", "line");
  l.setAttribute("x1", 0);
  l.setAttribute("x2", 600);
  l.setAttribute("y1", y);
  l.setAttribute("y2", y);
  l.setAttribute("stroke", color);
  l.setAttribute("stroke-dasharray", "4 3");
  svg.appendChild(l);
}

function bgRect(svg, x, y, w, h, fill) {
  const r = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  r.setAttribute("x", x);
  r.setAttribute("y", y);
  r.setAttribute("width", w);
  r.setAttribute("height", h);
  r.setAttribute("fill", fill);
  svg.appendChild(r);
}

function sliderRow(label, min, max, value, step, oninput, format) {
  const head = el("div", { class: "row", style: { justifyContent: "space-between" } }, [
    el("span", { class: "small text-2", text: label }),
    el("span", { class: "small mono", text: format(value) }),
  ]);
  const slider = el("input", {
    class: "slider",
    type: "range",
    min: String(min),
    max: String(max),
    step: String(step),
    value: String(value),
    oninput: (e) => {
      const v = parseFloat(e.target.value);
      head.children[1].textContent = format(v);
      oninput(v);
    },
  });
  return el("div", { class: "stack", style: { gap: "6px" } }, [head, slider]);
}
