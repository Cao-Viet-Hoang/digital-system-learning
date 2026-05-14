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
  title: "Chuyển Đổi Cơ Số",
  subtitle: "Chuyển đổi giữa thập phân, nhị phân và hex — với từng bước được hiển thị chi tiết.",
  objective:
    "Thực hiện chuyển đổi cơ số tự tin bằng cách theo các phương pháp chuẩn: chia liên tiếp cho decimal→base, tổng có trọng số cho base→decimal, nhóm nibble cho binary↔hex.",
  render,
};

function render(container) {
  resetSectionCounter();
  clear(container);

  container.appendChild(
    section(
      "Chọn hướng chuyển đổi",
      p("Chọn hướng cần chuyển đổi. Nhập giá trị để xem lời giải từng bước và đáp án cuối cùng."),
      buildPicker(),
    ),
  );

  container.appendChild(
    section(
      "Luyện tập tự kiểm tra",
      p(
        "Hãy thử giải trước. Nhập đáp án của bạn; nếu bí, hãy xem các bước. Câu hỏi mới được tạo mỗi lần.",
      ),
      buildPractice(),
    ),
  );

  container.appendChild(
    quizSection(
      "base-conversion",
      [
        {
          prompt: "Chuyển số thập phân <strong>23</strong> sang nhị phân.",
          options: [
            { label: "<span class='mono'>10101</span>" },
            { label: "<span class='mono'>10111</span>" },
            { label: "<span class='mono'>11011</span>" },
            { label: "<span class='mono'>11101</span>" },
          ],
          answer: 1,
          hint: "Chia liên tiếp cho 2, đọc phần dư từ dưới lên.",
          explanation: "23 = 16 + 4 + 2 + 1 = 10111₂.",
        },
        {
          prompt: "Chuyển nhị phân <span class='mono'>110101</span> sang thập phân.",
          options: [{ label: "21" }, { label: "53" }, { label: "55" }, { label: "61" }],
          answer: 1,
          hint: "Trọng số: 32, 16, 8, 4, 2, 1.",
          explanation: "32 + 16 + 4 + 1 = 53.",
        },
        {
          prompt: "Chuyển hex <span class='mono'>3A</span> sang thập phân.",
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
        "<strong>Thập phân → nhị phân / hex.</strong> Chia liên tiếp cho 2 (hoặc 16); đọc phần dư từ dưới lên để có kết quả.",
        "<strong>Nhị phân / hex → thập phân.</strong> Nhân mỗi chữ số với giá trị vị trí của nó và cộng lại.",
        "<strong>Nhị phân ↔ hex.</strong> Nhóm bit thành nhóm 4 từ phải (nhị phân → hex) hoặc mở rộng mỗi chữ số hex thành 4 bit (hex → nhị phân).",
      ]),
    ),
  );
}

const directions = [
  { id: "d2b", label: "Thập phân → Nhị phân" },
  { id: "b2d", label: "Nhị phân → Thập phân" },
  { id: "d2h", label: "Thập phân → Hex" },
  { id: "h2d", label: "Hex → Thập phân" },
  { id: "b2h", label: "Nhị phân → Hex" },
  { id: "h2b", label: "Hex → Nhị phân" },
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
      stepWrap.appendChild(el("div", { class: "alert alert-warning", text: "Nhập giá trị hợp lệ." }));
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
    d2b: "Số thập phân",
    b2d: "Chữ số nhị phân",
    d2h: "Số thập phân",
    h2d: "Chữ số hex",
    b2h: "Chữ số nhị phân",
    h2b: "Chữ số hex",
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
      el("div", { class: "alert alert-info", html: "Chia liên tiếp cho 2; đọc <em>phần dư</em> từ dưới lên." }),
    );
    out.appendChild(renderDivTable(steps, 2));
    out.appendChild(
      el("div", { class: "card card-soft-mint", style: { textAlign: "center" } }, [
        el("div", { class: "small text-2", text: "Kết quả" }),
        el("div", { class: "mono", style: { fontSize: "22px", fontWeight: "600" }, text: result + "₂" }),
        el("div", { class: "small", text: n + " (thập phân) = " + result + " (nhị phân)" }),
      ]),
    );
  } else if (dir === "b2d") {
    const bin = String(value);
    const { terms, result } = binToDecSteps(bin);
    out.appendChild(
      el("div", { class: "alert alert-info", html: "Nhân mỗi bit với giá trị vị trí (lũy thừa của 2) và cộng lại." }),
    );
    out.appendChild(renderWeightTable(terms));
    out.appendChild(
      el("div", { class: "card card-soft-mint", style: { textAlign: "center" } }, [
        el("div", { class: "small text-2", text: "Kết quả" }),
        el("div", { class: "mono", style: { fontSize: "22px", fontWeight: "600" }, text: String(result) }),
        el("div", { class: "small", text: bin + " (nhị phân) = " + result + " (thập phân)" }),
      ]),
    );
  } else if (dir === "d2h") {
    const n = Number(value);
    const { steps, result } = decToHexSteps(n);
    out.appendChild(
      el("div", { class: "alert alert-info", html: "Chia liên tiếp cho 16; đọc <em>phần dư</em> từ dưới lên (10–15 thành A–F)." }),
    );
    out.appendChild(renderDivTable(steps, 16, true));
    out.appendChild(
      el("div", { class: "card card-soft-mint", style: { textAlign: "center" } }, [
        el("div", { class: "small text-2", text: "Kết quả" }),
        el("div", { class: "mono", style: { fontSize: "22px", fontWeight: "600" }, text: "0x" + result }),
        el("div", { class: "small", text: n + " (thập phân) = " + result + " (hex)" }),
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
      el("div", { class: "alert alert-info", html: "Nhân mỗi chữ số hex với giá trị vị trí (lũy thừa của 16)." }),
    );
    out.appendChild(renderHexWeightTable(terms));
    out.appendChild(
      el("div", { class: "card card-soft-mint", style: { textAlign: "center" } }, [
        el("div", { class: "small text-2", text: "Kết quả" }),
        el("div", { class: "mono", style: { fontSize: "22px", fontWeight: "600" }, text: String(n) }),
      ]),
    );
  } else if (dir === "b2h") {
    const bin = String(value);
    const groups = groupBitsToNibbles(bin);
    out.appendChild(
      el("div", { class: "alert alert-info", html: "Nhóm bit thành nhóm 4 từ phải (thêm 0 bên trái nếu cần)." }),
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
        el("div", { class: "small text-2", text: "Kết quả" }),
        el("div", { class: "mono", style: { fontSize: "22px", fontWeight: "600" }, text: "0x" + groups.map((g) => g.hex).join("") }),
      ]),
    );
  } else if (dir === "h2b") {
    const hex = String(value);
    out.appendChild(
      el("div", { class: "alert alert-info", html: "Mở rộng mỗi chữ số hex thành 4 bit nhị phân, rồi nối lại." }),
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
        el("div", { class: "small text-2", text: "Kết quả" }),
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
        el("th", { text: "Bước" }),
        el("th", { text: "Số bị chia" }),
        el("th", { text: "÷ " + divisor }),
        el("th", { text: "Thương" }),
        el("th", { text: "Phần dư" }),
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
    el("p", { class: "small text-2", style: { marginTop: "8px" }, text: "Đọc phần dư từ dưới lên để có kết quả." }),
  );
  return wrap;
}

function renderWeightTable(terms) {
  const wrap = el("div", { style: { overflowX: "auto" } });
  const tbl = el("table", { class: "tbl tbl-bordered", style: { minWidth: "440px" } });
  tbl.appendChild(
    el("thead", {}, [
      el("tr", {}, [
        el("th", { text: "Vị trí" }),
        el("th", { text: "Bit" }),
        el("th", { text: "Trọng số" }),
        el("th", { text: "Đóng góp" }),
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
        el("th", { text: "Vị trí" }),
        el("th", { text: "Chữ số" }),
        el("th", { text: "Giá trị" }),
        el("th", { text: "Trọng số" }),
        el("th", { text: "Đóng góp" }),
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
    promptEl.appendChild(el("div", { class: "small text-2", text: "Chuyển đổi giá trị này:" }));
    promptEl.appendChild(
      el("div", { class: "mono", style: { fontSize: "26px", fontWeight: "600", margin: "6px 0" }, text: state.q.display }),
    );
    promptEl.appendChild(el("div", { class: "small", text: directions.find((d) => d.id === state.dir).label }));

    clear(inputWrap);
    const inp = el("input", { class: "input input-mono", type: "text", style: { width: "160px" } });
    inputWrap.appendChild(el("span", { class: "small text-2", text: "Đáp án của bạn:" }));
    inputWrap.appendChild(inp);
    inputWrap.appendChild(
      el("button", {
        class: "btn btn-primary btn-sm",
        text: "Kiểm tra",
        onclick: () => {
          const guess = (inp.value || "").trim().toUpperCase().replace(/^0X/, "").replace(/^0B/, "");
          const expected = state.q.expected.toUpperCase().replace(/^0X/, "").replace(/^0B/, "");
          clear(fb);
          if (!guess) {
            fb.appendChild(el("div", { class: "quiz-feedback hint", text: "Nhập đáp án của bạn." }));
            return;
          }
          const ok = guess === expected;
          fb.appendChild(
            el("div", { class: ok ? "quiz-feedback ok" : "quiz-feedback bad" }, [
              el("strong", { text: ok ? "Chính xác! " : "Chưa đúng. " }),
              el("span", { html: "Đáp án: <span class='mono'>" + state.q.expected + "</span>." }),
            ]),
          );
        },
      }),
    );
    inputWrap.appendChild(
      el("button", {
        class: "btn btn-outline btn-sm",
        text: state.showSteps ? "Ẩn các bước" : "Xem các bước",
        onclick: () => {
          state.showSteps = !state.showSteps;
          renderSteps();
        },
      }),
    );
    inputWrap.appendChild(el("button", { class: "btn btn-outline btn-sm", text: "Tiếp theo", onclick: newQ }));

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
      el("span", { class: "small text-2", text: "Loại chuyển đổi:" }),
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
