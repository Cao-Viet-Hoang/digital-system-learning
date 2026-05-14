// Lesson 4: Logic Levels — voltage thresholds and the undefined region.
import { el, clear } from "../utils/dom.js";
import { section, summary, quizSection, p, resetSectionCounter } from "../utils/lesson-ui.js";
import { COLORS } from "../utils/colors.js";

export default {
  id: "logic-levels",
  order: 4,
  title: "Mức Logic",
  subtitle: "Logic 0, logic 1 và vùng cấm ở giữa.",
  objective:
    "Xác định liệu điện áp biểu diễn logic 0, logic 1, hay rơi vào vùng không xác định, và giải thích tại sao biên độ dự phòng quan trọng.",
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
      "Hãy thử: kéo điện áp",
      p(
        "Di chuyển thanh trượt để đặt điện áp đầu vào. Chỉ số bên phải cho thấy cổng logic sẽ hiểu như thế nào. Vùng tô bóng ở giữa là <strong>vùng không xác định</strong> — mạch điện không thể phân biệt 0 với 1 ở đây một cách đáng tin cậy.",
      ),
      buildVoltageSim(),
    ),
  );

  container.appendChild(
    section(
      "Tại sao có khoảng cách?",
      p(
        "Mạch thực không bao giờ tạo ra 0 V hoặc 5 V chính xác. Nhiễu nguồn điện, điện trở dây dẫn và sự biến đổi linh kiện đều làm điện áp thay đổi một chút. Bằng cách định nghĩa một <em>vùng đệm</em> giữa 0 và 1, thiết kế vẫn đáng tin cậy ngay cả khi có nhiễu. Logic hiện đại dùng dải điện áp hẹp hơn (ví dụ: 3,3 V, 1,8 V) nhưng nguyên lý vẫn như vậy.",
      ),
      el("div", { class: "grid grid-3" }, [
        valueCard("Logic 0", `0 V đến ${VOL_MAX} V`, "sky"),
        valueCard("Không xác định", `${VOL_MAX} V đến ${VIH_MIN} V`, "lavender"),
        valueCard("Logic 1", `${VIH_MIN} V đến ${VCC} V`, "peach"),
      ]),
    ),
  );

  container.appendChild(
    section("Luyện tập: dự đoán mức logic", buildPredictExercise()),
  );

  container.appendChild(
    section(
      "Demo nhiễu",
      p(
        "Thêm nhiễu vào điện áp đầu vào. Chú ý cách điện áp 0 sạch (ví dụ: 0,2 V) hoặc 1 sạch (ví dụ: 4,7 V) dễ dàng chịu được nhiễu, trong khi giá trị gần ngưỡng (ví dụ: 2,0 V) trở nên không đáng tin cậy.",
      ),
      buildNoiseDemo(),
    ),
  );

  container.appendChild(
    quizSection(
      "logic-levels",
      [
        {
          prompt: "Cổng CMOS 5 V đọc <strong>0,5 V</strong>. Mức logic là:",
          options: [{ label: "Logic 0" }, { label: "Logic 1" }, { label: "Không xác định" }],
          answer: 0,
          hint: "0,5 V thấp hơn ngưỡng 0,8 V.",
          explanation: "0,5 V ≤ 0,8 V → logic 0.",
        },
        {
          prompt: "Đầu vào ở mức <strong>1,5 V</strong>. Đầu ra cổng là:",
          options: [
            { label: "Logic 0" },
            { label: "Logic 1" },
            { label: "Không xác định — cổng có thể hoạt động không thể đoán trước" },
            { label: "Đúng giữa 0 và 1" },
          ],
          answer: 2,
          hint: "0,8 V < 1,5 V < 2,0 V.",
          explanation: "Bất kỳ giá trị nào nằm chặt giữa V_OL,max và V_IH,min đều là vùng không xác định / cấm.",
        },
        {
          prompt: "Tại sao <em>biên độ dự phòng</em> mức logic lại hữu ích?",
          options: [
            { label: "Làm mạch nhanh hơn" },
            { label: "Cho phép cổng chịu được nhiễu ở đầu vào" },
            { label: "Giảm giá chip" },
            { label: "Nhân đôi nguồn điện" },
          ],
          answer: 1,
          hint: "Nghĩ về cáp thực, nhiễu nguồn điện và sự biến đổi linh kiện.",
          explanation:
            "Vùng đệm cho phép cổng bỏ qua các biến đổi nhỏ ở đầu vào mà không đảo lộn cách hiểu của nó.",
        },
      ],
    ),
  );

  container.appendChild(
    section(
      "Các họ logic phổ biến",
      p(
        "Các mức logic (ngưỡng điện áp) khác nhau tùy theo công nghệ sản xuất chip. Điều này quan trọng khi kết nối các chip từ các thế hệ hoặc hãng khác nhau.",
      ),
      el("div", { class: "card", style: { overflowX: "auto" } }, [
        el("table", { class: "tbl tbl-bordered" }, [
          el("thead", {}, [
            el("tr", {}, [
              el("th", { text: "Họ logic" }),
              el("th", { text: "Điện áp nguồn" }),
              el("th", { text: "Ngưỡng logic 0 (max)" }),
              el("th", { text: "Ngưỡng logic 1 (min)" }),
              el("th", { text: "Ứng dụng" }),
            ]),
          ]),
          el("tbody", {}, [
            el("tr", {}, [el("td", { class: "mono", text: "TTL" }), el("td", { text: "5 V" }), el("td", { text: "0,8 V" }), el("td", { text: "2,0 V" }), el("td", { class: "small", text: "Chip cổ điển, Arduino 5V" })]),
            el("tr", {}, [el("td", { class: "mono", text: "CMOS 3.3V" }), el("td", { text: "3,3 V" }), el("td", { text: "0,9 V" }), el("td", { text: "1,8 V" }), el("td", { class: "small", text: "Raspberry Pi, ESP32" })]),
            el("tr", {}, [el("td", { class: "mono", text: "CMOS 1.8V" }), el("td", { text: "1,8 V" }), el("td", { text: "0,45 V" }), el("td", { text: "0,9 V" }), el("td", { class: "small", text: "Chip di động hiện đại" })]),
          ]),
        ]),
      ]),
      el("div", { class: "alert alert-info", style: { marginTop: "12px" } }, [
        el("strong", { text: "Cảnh báo thực tế: " }),
        el("span", { text: "Nếu kết nối chip 5V với chip 3.3V trực tiếp, điện áp đầu ra 5V có thể làm hỏng chip 3.3V. Cần dùng mạch chuyển mức (level shifter) để kết nối an toàn." }),
      ]),
    ),
  );

  container.appendChild(
    section(
      "Tóm tắt",
      summary(null, [
        `<strong>Logic 0</strong> = điện áp ≤ ${VOL_MAX} V; <strong>logic 1</strong> = điện áp ≥ ${VIH_MIN} V (trên hệ thống 5 V).`,
        "Giữa các ngưỡng đó là <em>vùng không xác định</em> — mạch không thể quyết định đáng tin cậy.",
        "Biên độ dự phòng tồn tại để chịu được nhiễu. Một 0 hoặc 1 sạch vẫn đúng ngay cả khi có một chút nhiễu thêm vào.",
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
  text(svg, (v2x(VOL_MAX) + v2x(VIH_MIN)) / 2, barY + barH + 18, "Không xác định", "12", "#4d3f7a");
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
    let label = "Không xác định";
    if (v <= VOL_MAX) {
      cls = "logic-pill l-0";
      label = "Logic 0";
    } else if (v >= VIH_MIN) {
      cls = "logic-pill l-1";
      label = "Logic 1";
    }
    lLabel.appendChild(el("span", { class: cls, text: label }));
    if (label === "Không xác định") {
      lLabel.appendChild(
        el("div", { class: "small text-2", style: { marginTop: "6px" }, text: "Cảnh báo: hành vi cổng không thể đoán trước trong vùng này." }),
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
      { v: "x", label: "Không xác định", cls: "btn-outline" },
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
                el("strong", { text: ok ? "Chính xác! " : "Chưa đúng. " }),
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
    return k === "0" ? "Logic 0" : k === "1" ? "Logic 1" : "Không xác định";
  }

  card.appendChild(el("div", { class: "small text-2", style: { textAlign: "center" }, text: "Dự đoán mức logic cho điện áp này:" }));
  card.appendChild(display);
  card.appendChild(buttons);
  card.appendChild(fb);
  card.appendChild(
    el("div", { class: "row", style: { marginTop: "12px", justifyContent: "center" } }, [
      el("button", { class: "btn btn-outline btn-sm", text: "Điện áp tiếp theo", onclick: newQ }),
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

    readingLabel.textContent = `${countUndef} / ${N} mẫu rơi vào vùng không xác định.`;
  }

  card.appendChild(svg);
  card.appendChild(readingLabel);

  const controls = el("div", { class: "grid grid-2", style: { marginTop: "12px" } });
  controls.appendChild(
    sliderRow("Điện áp cơ bản", 0, VCC, state.base, 0.1, (v) => {
      state.base = v;
      update();
    }, (v) => v.toFixed(1) + " V"),
  );
  controls.appendChild(
    sliderRow("Biên độ nhiễu", 0, 1.5, state.noise, 0.05, (v) => {
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
