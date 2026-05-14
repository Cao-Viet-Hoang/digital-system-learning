// Lesson 2: Mixed Analog-Digital Systems.
import { el, clear } from "../utils/dom.js";
import { section, summary, quizSection, p, resetSectionCounter } from "../utils/lesson-ui.js";

export default {
  id: "mixed-systems",
  order: 2,
  title: "Mixed Analog-Digital Systems",
  subtitle: "Most real systems convert physical signals to digital, process them, then output to the analog world.",
  objective:
    "Understand the typical signal chain — sensor → analog conditioning → ADC → processing → DAC → actuator — and classify parts of a system as analog, digital, or both.",
  render,
};

const stages = [
  {
    key: "phys",
    title: "Physical quantity",
    blurb: "Sound, light, temperature, position — continuous in the real world.",
    color: "sky",
    type: "analog",
  },
  {
    key: "sensor",
    title: "Sensor",
    blurb: "Converts physical quantity into a voltage. The output is still analog.",
    color: "sky",
    type: "analog",
  },
  {
    key: "adc",
    title: "ADC",
    blurb: "Analog-to-digital converter samples and quantises the voltage into bits.",
    color: "lavender",
    type: "boundary",
  },
  {
    key: "cpu",
    title: "Digital processor",
    blurb: "Software or logic processes the bits — filtering, decisions, storage.",
    color: "peach",
    type: "digital",
  },
  {
    key: "dac",
    title: "DAC",
    blurb: "Digital-to-analog converter turns processed bits back into a voltage.",
    color: "lavender",
    type: "boundary",
  },
  {
    key: "act",
    title: "Actuator",
    blurb: "Speaker, motor, display — drives the physical world from a voltage.",
    color: "mint",
    type: "analog",
  },
];

function render(container) {
  resetSectionCounter();
  clear(container);

  container.appendChild(
    section(
      "Try it: build the signal chain",
      p(
        "A typical sensor-to-actuator system has six stages. Drag or click to reorder them, then click <strong>Check order</strong>.",
      ),
      buildChainBuilder(),
    ),
  );

  container.appendChild(
    section(
      "The flow, fixed",
      p(
        "Once correct, the chain converts a continuous physical quantity into bits, processes them, and pushes the result back to the physical world.",
      ),
      buildFlowDiagram(),
    ),
  );

  container.appendChild(
    section(
      "Classify the part",
      p(
        "For each example below, choose whether the stage shown is analog, digital, or a converter between the two.",
      ),
      buildClassifier(),
    ),
  );

  container.appendChild(
    quizSection(
      "mixed-systems",
      [
        {
          prompt:
            "In a digital thermometer, the <strong>thermistor</strong> outputs a continuously varying voltage. This stage is:",
          options: [
            { label: "Analog" },
            { label: "Digital" },
            { label: "A converter between analog and digital" },
            { label: "Mechanical only" },
          ],
          answer: 0,
          hint: "Is the thermistor's output continuous or discrete?",
          explanation: "The thermistor's voltage is continuous — that's analog. The ADC after it does the conversion.",
        },
        {
          prompt: "Which block <strong>turns voltage into bits</strong>?",
          options: [{ label: "DAC" }, { label: "ADC" }, { label: "CPU" }, { label: "Actuator" }],
          answer: 1,
          hint: "ADC = Analog-to-Digital Converter.",
          explanation: "The ADC samples the voltage at regular intervals and quantises it into a multi-bit number.",
        },
        {
          prompt: "Which of these systems is best described as <strong>mixed analog + digital</strong>?",
          options: [
            { label: "A pocket calculator" },
            { label: "A USB cable" },
            { label: "A smart-speaker that listens, processes voice, and plays audio" },
            { label: "A purely mechanical clock" },
          ],
          answer: 2,
          hint: "Mixed systems sense the physical world and act on it.",
          explanation:
            "The smart speaker has a microphone (analog sense), ADC, digital processor, DAC, and amplifier-speaker (analog actuator) — that's the textbook mixed system.",
        },
      ],
    ),
  );

  container.appendChild(
    section(
      "Summary",
      summary(null, [
        "Most real systems are <strong>mixed</strong>: sensors and actuators are analog; processing is digital; <em>ADC</em> and <em>DAC</em> bridge the two.",
        "Signals travel <em>physical → analog → digital → analog → physical</em>.",
        "Identifying which stage is which is the first step in designing or troubleshooting a system.",
      ]),
    ),
  );
}

function buildFlowDiagram() {
  const card = el("div", { class: "card" });
  const row = el("div", { class: "row", style: { justifyContent: "space-between", flexWrap: "nowrap", overflowX: "auto", paddingBottom: "8px" } });
  stages.forEach((s, i) => {
    const box = el("div", { class: `card card-soft-${s.color}`, style: { minWidth: "140px", flexShrink: "0", textAlign: "center" } }, [
      el("div", { class: "small mono text-2", text: typeLabel(s.type) }),
      el("div", { style: { fontWeight: "600", marginTop: "4px" }, text: s.title }),
      el("div", { class: "small", style: { marginTop: "4px", opacity: "0.85" }, text: s.blurb }),
    ]);
    row.appendChild(box);
    if (i < stages.length - 1) {
      row.appendChild(el("div", { style: { fontSize: "20px", color: "var(--text-3)", flexShrink: "0" }, text: "→" }));
    }
  });
  card.appendChild(row);
  return card;
}

function typeLabel(t) {
  if (t === "analog") return "ANALOG";
  if (t === "digital") return "DIGITAL";
  return "CONVERTER";
}

function buildChainBuilder() {
  const card = el("div", { class: "card" });
  const shuffled = stages.slice().sort(() => Math.random() - 0.5);
  const order = shuffled.slice();

  const list = el("div", { class: "stack", style: { gap: "8px" } });

  function rerender() {
    clear(list);
    order.forEach((s, i) => {
      const item = el(
        "div",
        {
          class: `card card-soft-${s.color}`,
          style: { display: "flex", alignItems: "center", gap: "12px", padding: "10px 14px" },
        },
        [
          el("span", { class: "mono small", style: { width: "20px" }, text: String(i + 1) }),
          el("div", { style: { flex: "1" } }, [
            el("div", { style: { fontWeight: "600" }, text: s.title }),
            el("div", { class: "small", style: { opacity: "0.85" }, text: s.blurb }),
          ]),
          el("button", {
            class: "btn btn-sm btn-ghost",
            text: "↑",
            disabled: i === 0,
            onclick: () => {
              [order[i - 1], order[i]] = [order[i], order[i - 1]];
              rerender();
            },
          }),
          el("button", {
            class: "btn btn-sm btn-ghost",
            text: "↓",
            disabled: i === order.length - 1,
            onclick: () => {
              [order[i + 1], order[i]] = [order[i], order[i + 1]];
              rerender();
            },
          }),
        ],
      );
      list.appendChild(item);
    });
  }

  rerender();
  card.appendChild(list);

  const feedback = el("div", { style: { marginTop: "12px" } });
  card.appendChild(feedback);

  card.appendChild(
    el("div", { class: "row", style: { marginTop: "12px" } }, [
      el("button", {
        class: "btn btn-primary",
        text: "Check order",
        onclick: () => {
          clear(feedback);
          const correct = order.every((s, i) => s.key === stages[i].key);
          feedback.appendChild(
            el("div", { class: correct ? "alert alert-success" : "alert alert-warning" }, [
              el("strong", { text: correct ? "Correct order. " : "Not yet. " }),
              el("span", {
                text: correct
                  ? "The signal flows physical → sensor → ADC → processor → DAC → actuator."
                  : "Hint: the signal must be analog before the ADC and digital after it.",
              }),
            ]),
          );
        },
      }),
      el("button", {
        class: "btn btn-outline",
        text: "Shuffle",
        onclick: () => {
          order.sort(() => Math.random() - 0.5);
          rerender();
          clear(feedback);
        },
      }),
      el("button", {
        class: "btn btn-ghost",
        text: "Show solution",
        onclick: () => {
          order.length = 0;
          stages.forEach((s) => order.push(s));
          rerender();
          clear(feedback);
        },
      }),
    ]),
  );

  return card;
}

function buildClassifier() {
  const items = [
    { name: "Microphone diaphragm", answer: "analog", reason: "Outputs continuous voltage from sound pressure." },
    { name: "Memory chip storing bits", answer: "digital", reason: "Stores discrete 0/1 values." },
    { name: "Speaker driver", answer: "analog", reason: "Drives a continuous current to move the cone." },
    { name: "ADC inside a microphone preamp", answer: "boundary", reason: "Converts voltage into a binary code." },
    { name: "Push button (pressed / not pressed)", answer: "digital", reason: "Only two discrete states." },
    { name: "Brightness slider on a smart bulb", answer: "boundary", reason: "User-facing dial, but the bulb stores a number — a converter between human-analog and digital control." },
  ];

  const card = el("div", { class: "card" });
  const grid = el("div", { class: "grid grid-2" });
  items.forEach((it) => {
    let chosen = null;
    let revealed = false;
    const block = el("div", { class: "card", style: { padding: "12px 14px" } });
    block.appendChild(el("div", { style: { fontWeight: "600" }, text: it.name }));
    const buttons = el("div", { class: "row", style: { marginTop: "8px" } });
    const fb = el("div", { class: "small", style: { marginTop: "8px" } });

    function rerender() {
      clear(buttons);
      ["analog", "digital", "boundary"].forEach((opt) => {
        const cls =
          "btn btn-sm " +
          (chosen === opt
            ? revealed
              ? opt === it.answer
                ? "btn-mint"
                : "btn-peach"
              : "btn-primary"
            : "btn-outline");
        buttons.appendChild(
          el("button", {
            class: cls,
            text: opt === "boundary" ? "Converter" : opt[0].toUpperCase() + opt.slice(1),
            disabled: revealed,
            onclick: () => {
              chosen = opt;
              revealed = true;
              rerender();
              clear(fb);
              const ok = opt === it.answer;
              fb.appendChild(
                el("div", { class: ok ? "quiz-feedback ok" : "quiz-feedback bad" }, [
                  el("strong", { text: ok ? "Correct. " : "Not quite. " }),
                  el("span", { text: it.reason }),
                ]),
              );
            },
          }),
        );
      });
    }
    rerender();
    block.appendChild(buttons);
    block.appendChild(fb);
    grid.appendChild(block);
  });

  card.appendChild(grid);
  return card;
}
