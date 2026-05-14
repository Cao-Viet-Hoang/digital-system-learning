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
