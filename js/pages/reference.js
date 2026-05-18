// Reference tables: binary, hex, BCD, Gray, ASCII.
import { el, clear } from "../utils/dom.js";
import { toBinary, toHex, decToBcd, decToGray } from "../utils/conversions.js";

export function renderReference(container) {
  clear(container);
  const inner = el("div", { class: "content-inner" });
  container.appendChild(inner);
  inner.appendChild(el("h1", { text: "Bảng Tra Cứu" }));
  inner.appendChild(
    el("p", { class: "text-2", text: "Bảng tra cứu nhanh. Dùng như tài liệu tham khảo khi luyện tập." }),
  );

  const tabs = el("div", { class: "tabs", style: { marginBottom: "16px" } });
  const view = el("div");
  const tabSet = [
    { id: "bin-hex", label: "Nhị phân / Thập phân / Hex", render: renderBinHex },
    { id: "bcd", label: "BCD", render: renderBcd },
    { id: "gray", label: "Mã Gray", render: renderGray },
    { id: "ascii", label: "ASCII", render: renderAscii },
    { id: "seven-seg", label: "BCD → 7 đoạn", render: renderSevenSeg },
  ];
  let active = "bin-hex";

  function rerenderTabs() {
    clear(tabs);
    tabSet.forEach((t) => {
      tabs.appendChild(
        el("button", {
          class: "tab" + (t.id === active ? " active" : ""),
          text: t.label,
          onclick: () => {
            active = t.id;
            rerenderTabs();
            rerenderView();
          },
        }),
      );
    });
  }
  function rerenderView() {
    clear(view);
    const t = tabSet.find((x) => x.id === active);
    if (t) view.appendChild(t.render());
  }
  rerenderTabs();
  rerenderView();
  inner.appendChild(tabs);
  inner.appendChild(view);
}

function renderBinHex() {
  const card = el("div", { class: "card", style: { overflowX: "auto" } });
  const tbl = el("table", { class: "tbl tbl-bordered", style: { minWidth: "440px" } });
  tbl.appendChild(
    el("thead", {}, [
      el("tr", {}, [
        el("th", { text: "Thập phân" }),
        el("th", { text: "Nhị phân (4-bit)" }),
        el("th", { text: "Hex" }),
      ]),
    ]),
  );
  const tb = el("tbody");
  for (let i = 0; i < 16; i++) {
    tb.appendChild(
      el("tr", {}, [
        el("td", { class: "mono", text: String(i) }),
        el("td", { class: "mono", text: toBinary(i, 4) }),
        el("td", { class: "mono", style: { fontWeight: "600" }, text: toHex(i) }),
      ]),
    );
  }
  tbl.appendChild(tb);
  card.appendChild(tbl);
  return card;
}

function renderBcd() {
  const card = el("div", { class: "card", style: { overflowX: "auto" } });
  const tbl = el("table", { class: "tbl tbl-bordered", style: { minWidth: "440px" } });
  tbl.appendChild(
    el("thead", {}, [
      el("tr", {}, [
        el("th", { text: "Chữ số thập phân" }),
        el("th", { text: "BCD (4-bit)" }),
      ]),
    ]),
  );
  const tb = el("tbody");
  for (let i = 0; i <= 9; i++) {
    tb.appendChild(
      el("tr", {}, [
        el("td", { class: "mono", text: String(i) }),
        el("td", { class: "mono", text: toBinary(i, 4) }),
      ]),
    );
  }
  tbl.appendChild(tb);
  card.appendChild(tbl);
  card.appendChild(
    el("p", { class: "small text-2", style: { marginTop: "8px" }, text: "Các nibble 1010..1111 (10..15) không hợp lệ trong BCD." }),
  );
  return card;
}

function renderGray() {
  const card = el("div", { class: "card", style: { overflowX: "auto" } });
  const tbl = el("table", { class: "tbl tbl-bordered", style: { minWidth: "440px" } });
  tbl.appendChild(
    el("thead", {}, [
      el("tr", {}, [
        el("th", { text: "Thập phân" }),
        el("th", { text: "Nhị phân" }),
        el("th", { text: "Gray" }),
      ]),
    ]),
  );
  const tb = el("tbody");
  for (let i = 0; i < 16; i++) {
    tb.appendChild(
      el("tr", {}, [
        el("td", { class: "mono", text: String(i) }),
        el("td", { class: "mono", text: toBinary(i, 4) }),
        el("td", { class: "mono", style: { fontWeight: "600" }, text: decToGray(i, 4) }),
      ]),
    );
  }
  tbl.appendChild(tb);
  card.appendChild(tbl);
  return card;
}

// Segment patterns for digits 0..9 — same convention as Lesson 24.
const DIGIT_SEGMENTS = {
  0: { a: 1, b: 1, c: 1, d: 1, e: 1, f: 1, g: 0 },
  1: { a: 0, b: 1, c: 1, d: 0, e: 0, f: 0, g: 0 },
  2: { a: 1, b: 1, c: 0, d: 1, e: 1, f: 0, g: 1 },
  3: { a: 1, b: 1, c: 1, d: 1, e: 0, f: 0, g: 1 },
  4: { a: 0, b: 1, c: 1, d: 0, e: 0, f: 1, g: 1 },
  5: { a: 1, b: 0, c: 1, d: 1, e: 0, f: 1, g: 1 },
  6: { a: 1, b: 0, c: 1, d: 1, e: 1, f: 1, g: 1 },
  7: { a: 1, b: 1, c: 1, d: 0, e: 0, f: 0, g: 0 },
  8: { a: 1, b: 1, c: 1, d: 1, e: 1, f: 1, g: 1 },
  9: { a: 1, b: 1, c: 1, d: 1, e: 0, f: 1, g: 1 },
};

function renderSevenSeg() {
  const wrap = el("div");

  wrap.appendChild(
    el("p", { class: "small text-2", style: { marginBottom: "10px" },
      html: "Bảng tra mã 7 đoạn cho từng số BCD 0–9. Cùng một con số có hai bảng mã ngược nhau tuỳ loại LED: <strong>Anode chung</strong> tích cực mức 0 (đoạn sáng khi ngõ ra = 0), <strong>Cathode chung</strong> tích cực mức 1." }),
  );

  const segNames = ["a", "b", "c", "d", "e", "f", "g"];
  const ov = (t) => `<span style="text-decoration:overline">${t}</span>`;

  const card = el("div", { class: "card", style: { overflowX: "auto" } });
  const tbl = el("table", { class: "tbl tbl-bordered", style: { minWidth: "640px" } });

  // Header: Số | BCD | a a a a a (Anode chung — gạch trên) | a..g (Cathode chung)
  const thead = el("thead");
  thead.appendChild(el("tr", {}, [
    el("th", { rowSpan: "2", text: "Số" }),
    el("th", { rowSpan: "2", text: "BCD (DCBA)" }),
    el("th", { colSpan: "7", html: "LED <strong>Anode chung</strong> (mức 0 = sáng)" }),
    el("th", { colSpan: "7", html: "LED <strong>Cathode chung</strong> (mức 1 = sáng)" }),
  ]));
  thead.appendChild(el("tr", {}, [
    ...segNames.map((s) => el("th", { html: ov(s) })),
    ...segNames.map((s) => el("th", { text: s })),
  ]));
  tbl.appendChild(thead);

  const tb = el("tbody");
  for (let n = 0; n <= 9; n++) {
    const seg = DIGIT_SEGMENTS[n];
    const bcd = toBinary(n, 4);
    const ccBits = segNames.map((s) => seg[s]);          // CC: 1 = on
    const caBits = ccBits.map((v) => v ? 0 : 1);          // CA: invert
    tb.appendChild(el("tr", {}, [
      el("td", { class: "mono", style: { fontWeight: "700", textAlign: "center" }, text: String(n) }),
      el("td", { class: "mono", style: { textAlign: "center" }, text: bcd }),
      ...caBits.map((v) =>
        el("td", {
          class: "mono",
          style: {
            textAlign: "center",
            fontWeight: v === 0 ? "700" : "400",
            background: v === 0 ? "rgba(240, 162, 116, 0.35)" : "transparent",
            color: v === 1 ? "#8b8694" : "#2a2730",
          },
          text: String(v),
        }),
      ),
      ...ccBits.map((v) =>
        el("td", {
          class: "mono",
          style: {
            textAlign: "center",
            fontWeight: v === 1 ? "700" : "400",
            background: v === 1 ? "rgba(240, 162, 116, 0.35)" : "transparent",
            color: v === 0 ? "#8b8694" : "#2a2730",
          },
          text: String(v),
        }),
      ),
    ]));
  }
  tbl.appendChild(tb);
  card.appendChild(tbl);

  card.appendChild(
    el("p", { class: "small text-2", style: { marginTop: "8px" },
      html: "Ô tô màu cam = đoạn đang sáng. Hai khối bên trái và phải có cùng nội dung nhưng đảo bit cho nhau. IC <span class='mono'>74LS47</span> phù hợp với khối Anode chung; <span class='mono'>74LS48</span> phù hợp với khối Cathode chung." }),
  );

  wrap.appendChild(card);
  return wrap;
}

function renderAscii() {
  const card = el("div", { class: "card", style: { overflowX: "auto" } });
  const tbl = el("table", { class: "tbl tbl-bordered", style: { minWidth: "560px" } });
  tbl.appendChild(
    el("thead", {}, [
      el("tr", {}, [
        el("th", { text: "Ký tự" }),
        el("th", { text: "Thập phân" }),
        el("th", { text: "Hex" }),
        el("th", { text: "Nhị phân" }),
      ]),
    ]),
  );
  const tb = el("tbody");
  for (let code = 32; code <= 126; code++) {
    tb.appendChild(
      el("tr", {}, [
        el("td", { class: "mono", text: String.fromCharCode(code) }),
        el("td", { class: "mono", text: String(code) }),
        el("td", { class: "mono", text: toHex(code, 2) }),
        el("td", { class: "mono", text: toBinary(code, 8) }),
      ]),
    );
  }
  tbl.appendChild(tb);
  card.appendChild(tbl);
  return card;
}
