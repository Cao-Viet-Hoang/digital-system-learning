// Lesson 8: Hexadecimal — base 16 and 4-bit nibble grouping.
import { el, clear } from "../utils/dom.js";
import { section, summary, quizSection, p, resetSectionCounter } from "../utils/lesson-ui.js";
import { fromHex, toHex, groupBitsToNibbles } from "../utils/conversions.js";

export default {
  id: "hexadecimal",
  order: 8,
  title: "Hệ Thập Lục Phân (Hexadecimal)",
  subtitle: "Cơ số 16. Một chữ số hex = đúng bốn bit — đó là lý do lập trình viên yêu thích nó.",
  objective:
    "Đọc các chữ số hex, xem chúng ánh xạ đến nibble 4-bit như thế nào, và chuyển đổi giữa hex và nhị phân bằng cách nhóm.",
  render,
};

function render(container) {
  resetSectionCounter();
  clear(container);

  container.appendChild(
    section(
      "16 chữ số hex",
      p(
        "Hệ thập lục phân dùng mười sáu chữ số: <span class='mono'>0–9</span> cho giá trị 0..9, rồi <span class='mono'>A, B, C, D, E, F</span> cho 10..15. Mỗi chữ số hex ánh xạ đến đúng một nhóm bốn bit (nibble).",
      ),
      buildLookupTable(),
    ),
  );

  container.appendChild(
    section(
      "Hãy thử: chuyển đổi bằng cách nhập",
      p("Nhập số vào bất kỳ ô nào — hai ô còn lại sẽ tự cập nhật."),
      buildConverter(),
    ),
  );

  container.appendChild(
    section(
      "Hãy thử: nhóm bit thành nibble",
      p(
        "Nhập chuỗi bit nhị phân. Ứng dụng nhóm các bit thành nibble 4-bit (thêm số 0 bên trái nếu cần) và hiển thị chữ số hex tương ứng cho mỗi nhóm.",
      ),
      buildNibbleGrouper(),
    ),
  );

  container.appendChild(
    section(
      "Hex trong thực tế lập trình",
      p(
        "Lập trình viên dùng hex mỗi ngày vì nó ngắn gọn hơn nhị phân và dễ ánh xạ sang bit hơn thập phân.",
      ),
      el("div", { class: "grid grid-2" }, [
        el("div", { class: "card card-soft-sky" }, [
          el("h4", { text: "Màu sắc HTML", style: { margin: "0 0 8px" } }),
          el("p", { class: "small", style: { margin: 0 }, html: "Màu <span class='mono'>#FF5733</span> nghĩa là:<br>• Đỏ (R): <span class='mono'>FF</span> = 255<br>• Xanh lá (G): <span class='mono'>57</span> = 87<br>• Xanh dương (B): <span class='mono'>33</span> = 51<br>Mỗi kênh màu dùng 1 byte (2 chữ số hex = 8 bit)." }),
        ]),
        el("div", { class: "card card-soft-peach" }, [
          el("h4", { text: "Địa chỉ bộ nhớ", style: { margin: "0 0 8px" } }),
          el("p", { class: "small", style: { margin: 0 }, html: "Địa chỉ bộ nhớ thường viết bằng hex: <span class='mono'>0x7FFF0000</span>. Đây là địa chỉ 32-bit = 8 chữ số hex = 32 bit nhị phân. Nhị phân sẽ cần 32 chữ số — khó đọc hơn nhiều!" }),
        ]),
      ]),
      el("div", { class: "card card-soft-lavender", style: { marginTop: "12px" } }, [
        el("h4", { text: "Quy tắc đổi nhanh Binary ↔ Hex", style: { margin: "0 0 8px" } }),
        el("p", { class: "small", style: { margin: 0 }, html: "<strong>Binary → Hex:</strong> Chia thành nhóm 4 bit từ phải, tra bảng từng nhóm.<br><strong>Hex → Binary:</strong> Mỗi chữ số hex mở rộng thành 4 bit nhị phân.<br><br>Đây là lý do hex là \"cầu nối\" lý tưởng giữa thế giới bit của máy tính và con người." }),
      ]),
    ),
  );

  container.appendChild(
    quizSection(
      "hexadecimal",
      [
        {
          prompt: "Hex <span class='mono'>2F</span> bằng giá trị thập phân nào?",
          options: [{ label: "31" }, { label: "47" }, { label: "63" }, { label: "215" }],
          answer: 1,
          hint: "2×16 + 15.",
          explanation: "2×16 + F(15) = 32 + 15 = 47.",
        },
        {
          prompt: "Nibble 4-bit nào khớp với chữ số hex <strong>C</strong>?",
          options: [
            { label: "<span class='mono'>1010</span>" },
            { label: "<span class='mono'>1100</span>" },
            { label: "<span class='mono'>1110</span>" },
            { label: "<span class='mono'>0110</span>" },
          ],
          answer: 1,
          hint: "C = 12 = 8 + 4.",
          explanation: "12 trong nhị phân là 1100.",
        },
        {
          prompt: "Nhị phân <span class='mono'>11011010</span> trong hex là:",
          options: [
            { label: "<span class='mono'>0xBA</span>" },
            { label: "<span class='mono'>0xDA</span>" },
            { label: "<span class='mono'>0xCA</span>" },
            { label: "<span class='mono'>0xEA</span>" },
          ],
          answer: 1,
          hint: "Nhóm: 1101 1010 → D A.",
          explanation: "1101 = D, 1010 = A → DA.",
        },
      ],
    ),
  );

  container.appendChild(
    section(
      "Summary",
      summary(null, [
        "Hex là cơ số 16: chữ số 0–9 và A–F (giá trị 10–15).",
        "Một chữ số hex = đúng một nibble 4-bit. Để chuyển nhị phân → hex, nhóm bit thành nhóm 4 từ phải sang.",
        "Hex chỉ là cách viết ngắn hơn của nhị phân — tiện dụng cho địa chỉ bộ nhớ và giá trị byte.",
      ]),
    ),
  );
}

function buildLookupTable() {
  const card = el("div", { class: "card", style: { overflowX: "auto" } });
  const tbl = el("table", { class: "tbl", style: { minWidth: "560px" } });
  tbl.appendChild(
    el("thead", {}, [
      el("tr", {}, [
        el("th", { text: "Thập phân" }),
        el("th", { text: "Hex" }),
        el("th", { text: "Nhị phân (4 bit)" }),
      ]),
    ]),
  );
  const tb = el("tbody");
  for (let i = 0; i < 16; i++) {
    tb.appendChild(
      el("tr", {}, [
        el("td", { class: "mono", text: String(i) }),
        el("td", { class: "mono", style: { fontWeight: "600", color: "var(--c-peach-deep)" }, text: i.toString(16).toUpperCase() }),
        el("td", { class: "mono", text: i.toString(2).padStart(4, "0") }),
      ]),
    );
  }
  tbl.appendChild(tb);
  card.appendChild(tbl);
  return card;
}

function buildConverter() {
  const card = el("div", { class: "card" });
  const state = { value: 47 };

  const decInp = mkField("Thập phân", "number", "47", (e) => {
    const v = parseInt(e.target.value, 10);
    if (Number.isFinite(v) && v >= 0) {
      state.value = v;
      sync();
    }
  });
  const hexInp = mkField("Hex", "text", "2F", (e) => {
    const raw = e.target.value.replace(/^0x/i, "").toUpperCase();
    const v = fromHex(raw);
    if (Number.isFinite(v)) {
      state.value = v;
      sync();
    }
  }, true);
  const binInp = mkField("Nhị phân", "text", "00101111", (e) => {
    const raw = e.target.value.replace(/[^01]/g, "");
    if (raw) {
      state.value = parseInt(raw, 2);
      sync();
    }
  }, true);

  function sync() {
    decInp.input.value = String(state.value);
    hexInp.input.value = toHex(state.value);
    binInp.input.value = state.value.toString(2);
  }
  sync();

  card.appendChild(el("div", { class: "grid grid-3" }, [decInp.wrap, hexInp.wrap, binInp.wrap]));

  // Visualisation
  const vis = el("div", { class: "card card-soft-lavender", style: { marginTop: "16px" } });
  const visUpdate = () => {
    clear(vis);
    const bits = state.value.toString(2);
    const groups = groupBitsToNibbles(bits);
    vis.appendChild(el("div", { class: "small text-2", text: "Nhóm nibble (thêm số 0 bên trái):" }));
    const row = el("div", { class: "row", style: { justifyContent: "center", marginTop: "8px", gap: "10px" } });
    groups.forEach((g) => {
      row.appendChild(
        el("div", { class: "card", style: { padding: "8px 12px", textAlign: "center" } }, [
          el("div", { class: "mono", style: { fontSize: "18px", letterSpacing: "0.1em" }, text: g.bits }),
          el("div", { class: "small mono", style: { color: "var(--c-peach-deep)", fontWeight: "700" }, text: g.hex }),
        ]),
      );
    });
    vis.appendChild(row);
  };
  card.appendChild(vis);
  const origSync = sync;
  // wrap sync so vis also updates - simpler: call after each input
  ["input", "change"].forEach((ev) => {
    [decInp.input, hexInp.input, binInp.input].forEach((i) => i.addEventListener(ev, visUpdate));
  });
  visUpdate();
  return card;
}

function mkField(label, type, value, oninput, mono) {
  const input = el("input", {
    class: "input" + (mono ? " input-mono" : ""),
    type,
    value,
    oninput,
  });
  const wrap = el("div", { class: "field" }, [el("label", { class: "label", text: label }), input]);
  return { wrap, input };
}

function buildNibbleGrouper() {
  const card = el("div", { class: "card" });
  const inp = el("input", {
    class: "input input-mono",
    type: "text",
    value: "11011010",
    style: { width: "260px", letterSpacing: "0.08em" },
  });
  const out = el("div", { style: { marginTop: "14px" } });

  function rerender() {
    const raw = inp.value.replace(/[^01]/g, "");
    inp.value = raw;
    clear(out);
    if (!raw) return;
    const groups = groupBitsToNibbles(raw);
    const row = el("div", { class: "row", style: { justifyContent: "center", flexWrap: "wrap" } });
    groups.forEach((g) => {
      row.appendChild(
        el("div", { class: "card card-soft-peach", style: { padding: "10px 14px", textAlign: "center" } }, [
          el("div", { class: "mono", style: { fontSize: "18px", letterSpacing: "0.1em" }, text: g.bits }),
          el("div", { class: "small", style: { marginTop: "4px" }, text: "= " + g.value }),
          el("div", { class: "mono", style: { fontSize: "20px", fontWeight: "700", color: "var(--text)" }, text: g.hex }),
        ]),
      );
    });
    out.appendChild(row);
    const hex = groups.map((g) => g.hex).join("");
    out.appendChild(
      el("div", { class: "card card-soft-mint", style: { marginTop: "12px", textAlign: "center" } }, [
        el("span", { html: "Hex kết hợp: <span class='mono' style='font-size:20px;font-weight:700'>" + hex + "</span>" }),
      ]),
    );
  }
  inp.addEventListener("input", rerender);
  card.appendChild(
    el("div", { class: "row", style: { justifyContent: "center" } }, [
      el("span", { class: "small text-2", text: "Nhập bit nhị phân:" }),
      inp,
    ]),
  );
  card.appendChild(out);
  rerender();
  return card;
}
