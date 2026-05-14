// Lesson 5: Digital Waveforms — bit streams over time.
import { el, clear } from "../utils/dom.js";
import { section, summary, quizSection, p, resetSectionCounter } from "../utils/lesson-ui.js";
import { COLORS } from "../utils/colors.js";

export default {
  id: "digital-waveforms",
  order: 5,
  title: "Dạng Sóng Số (Digital Waveforms)",
  subtitle: "Chuỗi bit vẽ theo thời gian tạo ra dạng sóng vuông.",
  objective:
    "Tạo dạng sóng từ chuỗi bit, đọc chuỗi bit từ dạng sóng, và liên hệ tín hiệu dữ liệu với xung clock.",
  render,
};

function render(container) {
  resetSectionCounter();
  clear(container);

  container.appendChild(
    section(
      "Hãy thử: tạo dạng sóng từ các bit",
      p(
        "Bật/tắt mỗi ô bit bên dưới — đường trên hiển thị dạng sóng vuông tương ứng. Điều chỉnh chu kỳ clock để làm chậm hoặc nhanh tín hiệu.",
      ),
      buildEditor(),
    ),
  );

  container.appendChild(
    section("Luyện tập: đọc dạng sóng", buildReader()),
  );

  container.appendChild(
    section(
      "Mẹo đọc dạng sóng",
      el("ul", {}, [
        el("li", { html: "Mức <strong>cao</strong> biểu diễn <span class='mono'>1</span>; mức <strong>thấp</strong> biểu diễn <span class='mono'>0</span>." }),
        el("li", { html: "Mỗi bit kéo dài một chu kỳ clock — xác định cạnh clock để biết khi nào giá trị có thể thay đổi." }),
        el("li", { html: "Dữ liệu được lấy mẫu <em>tại cạnh clock</em>; khoảng giữa không quan trọng với bên nhận." }),
      ]),
    ),
  );

  container.appendChild(
    section(
      "Tốc độ truyền dữ liệu",
      p(
        "Hiểu dạng sóng số giúp bạn tính toán tốc độ truyền dữ liệu — một thông số quan trọng trong thiết kế hệ thống.",
      ),
      el("div", { class: "grid grid-2" }, [
        el("div", { class: "card card-soft-sky" }, [
          el("h4", { text: "Tần số và chu kỳ clock", style: { margin: "0 0 8px" } }),
          el("p", { class: "small", style: { margin: 0 }, html: "Tần số (f) là số chu kỳ mỗi giây, tính bằng Hz. Chu kỳ (T) là thời gian một chu kỳ: <strong>T = 1/f</strong>.<br><br>Ví dụ: CPU 3 GHz → T = 1/3.000.000.000 ≈ 0,33 ns mỗi chu kỳ." }),
        ]),
        el("div", { class: "card card-soft-peach" }, [
          el("h4", { text: "Tốc độ bit (Bit rate)", style: { margin: "0 0 8px" } }),
          el("p", { class: "small", style: { margin: 0 }, html: "Nếu mỗi chu kỳ clock truyền 1 bit: <strong>Bit rate = Tần số clock</strong>.<br><br>Ví dụ: USB 2.0 = 480 Mbps → 480 triệu bit mỗi giây → mỗi bit kéo dài ~2,08 ns." }),
        ]),
      ]),
      el("div", { class: "alert alert-info", style: { marginTop: "12px" } }, [
        el("strong", { text: "Ứng dụng thực tế: " }),
        el("span", { text: "UART (kết nối serial) thường chạy ở 9600 baud = 9600 bit/giây. Để truyền 1 byte (8 bit + 2 bit khung) mất khoảng 1,04 ms. Đây là lý do UART thường chỉ dùng cho dữ liệu tốc độ thấp như cảm biến, GPS." }),
      ]),
    ),
  );

  container.appendChild(
    quizSection(
      "digital-waveforms",
      [
        {
          prompt:
            "Nếu chu kỳ clock là 100 µs, cần bao lâu để truyền 1 byte 8-bit (một bit mỗi chu kỳ)?",
          options: [{ label: "100 µs" }, { label: "400 µs" }, { label: "800 µs" }, { label: "1,6 ms" }],
          answer: 2,
          hint: "8 bit × 100 µs.",
          explanation: "8 bit × 100 µs/bit = 800 µs.",
        },
        {
          prompt:
            "Dạng sóng lần lượt là <em>cao, thấp, cao, cao</em> biểu diễn chuỗi bit nào (MSB trước)?",
          options: [
            { label: "<span class='mono'>1011</span>" },
            { label: "<span class='mono'>0101</span>" },
            { label: "<span class='mono'>1101</span>" },
            { label: "<span class='mono'>1110</span>" },
          ],
          answer: 0,
          hint: "Cao → 1, thấp → 0, theo thứ tự.",
          explanation: "Cao, thấp, cao, cao → 1 0 1 1.",
        },
        {
          prompt: "Tín hiệu clock trong hệ thống digital có vai trò gì?",
          options: [
            { label: "Mang các giá trị dữ liệu" },
            { label: "Đặt thời gian — bên nhận lấy mẫu dữ liệu tại cạnh clock" },
            { label: "Đóng vai trò nguồn điện" },
            { label: "Lưu trữ dữ liệu vĩnh viễn" },
          ],
          answer: 1,
          hint: "Hãy nghĩ đó như máy đánh nhịp cho đường dữ liệu.",
          explanation: "Clock định nghĩa ranh giới bit để bên phát và bên nhận đồng ý về thời gian.",
        },
      ],
    ),
  );

  container.appendChild(
    section(
      "Summary",
      summary(null, [
        "Tín hiệu digital xen kẽ giữa hai mức điện áp — cao (1) và thấp (0) — theo thời gian.",
        "Mỗi bit chiếm một chu kỳ clock, vì vậy clock điều phối toàn bộ hệ thống.",
        "Đọc dạng sóng = ghi nhận mức trong mỗi chu kỳ clock từ trái sang phải.",
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
      el("span", { class: "small text-2", text: "Hiện clock" }),
    ]),
    el("button", {
      class: "btn btn-outline btn-sm",
      text: "Thêm bit",
      onclick: () => {
        if (state.bits.length < 16) {
          state.bits.push(0);
          rerender();
        }
      },
    }),
    el("button", {
      class: "btn btn-outline btn-sm",
      text: "Xóa bit",
      onclick: () => {
        if (state.bits.length > 2) {
          state.bits.pop();
          rerender();
        }
      },
    }),
    el("button", {
      class: "btn btn-outline btn-sm",
      text: "Ngẫu nhiên",
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
  label(svg, "Dữ liệu", 8, dataY1 - 10);
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
        text: "Kiểm tra",
        onclick: () => {
          const guess = inputs.map((i) => parseInt(i.value, 10));
          if (guess.some((g) => g !== 0 && g !== 1)) {
            clear(fb);
            fb.appendChild(el("div", { class: "quiz-feedback hint", text: "Nhập 0 hoặc 1 vào mỗi ô." }));
            return;
          }
          const ok = guess.every((g, i) => g === bits[i]);
          clear(fb);
          fb.appendChild(
            el("div", { class: ok ? "quiz-feedback ok" : "quiz-feedback bad" }, [
              el("strong", { text: ok ? "Chính xác! " : "Chưa đúng. " }),
              el("span", { html: "Dạng sóng đọc là <span class='mono'>" + bits.join("") + "</span>." }),
            ]),
          );
        },
      }),
      el("button", { class: "btn btn-outline btn-sm", text: "Dạng sóng mới", onclick: newQ }),
      el("button", {
        class: "btn btn-ghost btn-sm",
        text: "Hiển thị",
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

  card.appendChild(el("div", { class: "small text-2", style: { textAlign: "center" }, text: "Đọc dạng sóng 8-bit này từ trái sang phải:" }));
  card.appendChild(wrap);
  card.appendChild(inputCells);
  card.appendChild(fb);
  newQ();
  return card;
}
