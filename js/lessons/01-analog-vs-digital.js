// Lesson 1: Analog vs Digital Systems.
import { el, clear } from "../utils/dom.js";
import { section, summary, quizSection, p, splitView, resetSectionCounter } from "../utils/lesson-ui.js";
import { COLORS } from "../utils/colors.js";

export default {
  id: "analog-vs-digital",
  order: 1,
  title: "Hệ thống Analog và Digital",
  subtitle: "Tín hiệu liên tục khác gì tín hiệu rời rạc, và tại sao digital chiếm ưu thế trong lưu trữ và xử lý.",
  objective:
    "Phân biệt được tín hiệu analog và digital, giải thích tại sao hầu hết hệ thống hiện đại chuyển đổi thế giới thực sang dạng digital.",
  render,
};

function render(container) {
  resetSectionCounter();
  clear(container);

  container.appendChild(
    section(
      "Hãy thử: liên tục vs rời rạc",
      p(
        "Di chuyển các thanh trượt bên dưới để thay đổi tín hiệu. Đường <strong>trên</strong> là phiên bản analog — một đường cong mượt mà, liên tục theo thời gian. Đường <strong>dưới</strong> là phiên bản digital — một bậc thang được tạo từ các mẫu rời rạc. Thêm nhiễu để quan sát cách mỗi dạng tín hiệu ứng phó.",
      ),
      buildSimulator(),
    ),
  );

  container.appendChild(
    section(
      "Sự khác biệt là gì?",
      splitView(
        el("div", { class: "card card-soft-sky" }, [
          el("h3", { text: "Tín hiệu Analog" }),
          el("p", {
            text: "Biến đổi liên tục theo thời gian. Có thể nhận bất kỳ giá trị nào trong phạm vi của nó. Sóng âm thanh, nhiệt độ, độ sáng ánh sáng và điện áp tự nhiên đều là analog.",
          }),
          el("ul", {}, [
            el("li", { text: "Đường cong mịn, liên tục" }),
            el("li", { text: "Vô số giá trị có thể" }),
            el("li", { text: "Nhạy cảm với nhiễu — mọi dao động đều ảnh hưởng" }),
          ]),
        ]),
        el("div", { class: "card card-soft-peach" }, [
          el("h3", { text: "Tín hiệu Digital" }),
          el("p", {
            text: "Chuyển đổi giữa một tập hợp nhỏ các mức rời rạc — thường là hai: 0 và 1. Máy tính, cáp USB và đĩa CD đều dùng biểu diễn digital.",
          }),
          el("ul", {}, [
            el("li", { text: "Dạng bậc thang hoặc vuông" }),
            el("li", { text: "Hai mức: thấp (0) và cao (1)" }),
            el("li", { text: "Chống nhiễu tốt — dao động nhỏ vẫn đọc đúng là 0 hoặc 1" }),
          ]),
        ]),
      ),
    ),
  );

  container.appendChild(
    section(
      "Ví dụ thực tế",
      el("div", { class: "grid grid-3" }, [
        exampleCard("🎤", "Microphone", "Analog: áp suất không khí liên tục → điện áp liên tục."),
        exampleCard("🎚️", "Núm âm lượng", "Analog: điện trở thay đổi mượt mà."),
        exampleCard("💡", "Công tắc đèn", "Digital: bật hoặc tắt — không có trạng thái trung gian."),
        exampleCard("💻", "Bộ nhớ máy tính", "Digital: mỗi bit là 0 hoặc 1."),
        exampleCard("🌡️", "Nhiệt kế thủy ngân", "Analog: chiều cao của chất lỏng thay đổi liên tục."),
        exampleCard("⌨️", "Phím bàn phím", "Digital: nhấn hoặc không nhấn."),
      ]),
    ),
  );

  container.appendChild(
    section(
      "Ưu và nhược điểm",
      el("table", { class: "tbl tbl-bordered" }, [
        el("thead", {}, [
          el("tr", {}, [
            el("th", { text: "Khía cạnh" }),
            el("th", { text: "Analog" }),
            el("th", { text: "Digital" }),
          ]),
        ]),
        el("tbody", {}, [
          row(["Chi tiết", "Ghi lại biến đổi tinh tế một cách tự nhiên", "Bị giới hạn bởi độ phân giải mẫu"]),
          row(["Chống nhiễu", "Kém — nhiễu làm méo tín hiệu", "Cao — nhiễu nhỏ bị bỏ qua"]),
          row(["Lưu trữ", "Chất lượng giảm theo mỗi lần sao chép", "Sao chép không mất dữ liệu, dễ nén"]),
          row(["Xử lý", "Mạch analog chuyên dụng", "Máy tính thông thường, mọi thuật toán"]),
          row(["Chi phí lớn", "Linh kiện chính xác đắt tiền", "Chip giá rẻ, sản xuất hàng loạt"]),
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
            "Đại lượng nào sau đây là đại lượng <strong>analog</strong>?",
          options: [
            { label: "Số học sinh trong lớp" },
            { label: "Điện áp ở đầu ra microphone khi ai đó nói chuyện" },
            { label: "Trạng thái bật/tắt của công tắc đèn" },
            { label: "Giá trị pixel được lưu dưới dạng 8 bit" },
          ],
          answer: 1,
          hint: "Tín hiệu analog biến đổi mượt mà theo thời gian.",
          explanation:
            "Đầu ra microphone là điện áp thay đổi liên tục — đó là analog. Các lựa chọn khác đều là số đếm hoặc đã được rời rạc hóa.",
        },
        {
          prompt:
            "Tại sao digital thường được ưu tiên để lưu trữ âm nhạc so với băng analog?",
          options: [
            { label: "Âm thanh digital chứa nhiều thông tin hơn analog" },
            { label: "Tín hiệu digital chống nhiễu tốt hơn, nên bản sao luôn sạch" },
            { label: "Mạch analog không thể biểu diễn âm thanh" },
            { label: "File digital luôn nhỏ hơn băng" },
          ],
          answer: 1,
          hint: "Nghĩ về điều gì xảy ra khi bạn sao chép băng nhiều lần.",
          explanation:
            "Nhiễu nhỏ thêm vào tín hiệu digital vẫn được đọc đúng là 0 hoặc 1, nên bản sao digital giống hệt bản gốc. Băng analog mất chất lượng sau mỗi lần sao chép.",
        },
        {
          prompt:
            "Đèn giao thông hiển thị đỏ, vàng hoặc xanh. Trạng thái của đèn là analog hay digital?",
          options: [
            { label: "Analog — nó biến đổi liên tục" },
            { label: "Digital — nó có một tập hợp nhỏ các trạng thái rời rạc" },
            { label: "Không cái nào — nó là cơ học" },
            { label: "Cả hai cùng lúc" },
          ],
          answer: 1,
          hint: "Đếm xem hệ thống có bao nhiêu trạng thái phân biệt.",
          explanation:
            "Đèn có ba trạng thái phân biệt. Bất kỳ hệ thống nào có tập hợp trạng thái nhỏ, đếm được đều là digital, kể cả khi có hơn hai trạng thái.",
        },
      ],
    ),
  );

  container.appendChild(
    section(
      "Tóm tắt",
      summary(null, [
        "Tín hiệu <strong>analog</strong> biến đổi liên tục; tín hiệu <strong>digital</strong> chỉ nhận một tập hợp nhỏ các giá trị rời rạc.",
        "Tín hiệu digital chống nhiễu tốt — đó là lý do hầu hết lưu trữ, truyền thông và máy tính hiện đại đều dùng digital.",
        "Hầu hết đại lượng thực (âm thanh, ánh sáng, nhiệt độ) đều là analog và phải được <em>lấy mẫu</em> để chuyển thành digital.",
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
  svg.appendChild(centerLine(270, "Digital (lấy mẫu)"));
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
  controls.appendChild(slider("Biên độ", 10, 100, state.amp, (v) => ((state.amp = v), update())));
  controls.appendChild(slider("Tần số", 0.5, 4, state.freq, (v) => ((state.freq = v), update()), 0.1));
  controls.appendChild(slider("Nhiễu", 0, 60, state.noise, (v) => ((state.noise = v), update())));
  controls.appendChild(
    slider("Mức digital", 2, 16, state.levels, (v) => ((state.levels = Math.round(v)), update()), 1),
  );
  card.appendChild(controls);

  card.appendChild(
    el("div", { class: "alert alert-info", style: { marginTop: "16px" } }, [
      el("strong", { text: "Quan sát: " }),
      el("span", {
        text:
          "Quan sát: Tăng nhiễu — tín hiệu analog (xanh) bị rung ngay, nhưng phiên bản digital (cam) vẫn ổn định. Đó là lợi thế chống nhiễu. Giảm mức digital để thấy lấy mẫu thô hơn làm mất chi tiết như thế nào.",
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
