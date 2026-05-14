// Lesson 8: Hexadecimal — base 16 and 4-bit nibble grouping.
import { el, clear } from "../utils/dom.js";
import { section, summary, quizSection, p, resetSectionCounter } from "../utils/lesson-ui.js";
import { fromHex, toHex, groupBitsToNibbles } from "../utils/conversions.js";

export default {
  id: "hexadecimal",
  order: 8,
  title: "The Hexadecimal System",
  subtitle: "Base 16. One hex digit = exactly four bits — that's why programmers love it.",
  objective:
    "Read hex digits, see how they map to 4-bit nibbles, and convert between hex and binary by grouping.",
  render,
};

function render(container) {
  resetSectionCounter();
  clear(container);

  container.appendChild(
    section(
      "The 16 hex digits",
      p(
        "Hexadecimal uses sixteen digits: <span class='mono'>0–9</span> for values 0..9, then <span class='mono'>A, B, C, D, E, F</span> for 10..15. Each hex digit maps to exactly one group of four bits.",
      ),
      buildLookupTable(),
    ),
  );

  container.appendChild(
    section(
      "Try it: convert by typing",
      p("Type a number in any field — the other two update."),
      buildConverter(),
    ),
  );

  container.appendChild(
    section(
      "Try it: group bits into nibbles",
      p(
        "Enter a binary string. The app groups bits into 4-bit nibbles (padding the left with zeros if needed) and shows the matching hex digit for each.",
      ),
      buildNibbleGrouper(),
    ),
  );

  container.appendChild(
    quizSection(
      "hexadecimal",
      [
        {
          prompt: "Hex <span class='mono'>2F</span> equals which decimal value?",
          options: [{ label: "31" }, { label: "47" }, { label: "63" }, { label: "215" }],
          answer: 1,
          hint: "2×16 + 15.",
          explanation: "2×16 + F(15) = 32 + 15 = 47.",
        },
        {
          prompt: "Which 4-bit nibble matches hex digit <strong>C</strong>?",
          options: [
            { label: "<span class='mono'>1010</span>" },
            { label: "<span class='mono'>1100</span>" },
            { label: "<span class='mono'>1110</span>" },
            { label: "<span class='mono'>0110</span>" },
          ],
          answer: 1,
          hint: "C = 12 = 8 + 4.",
          explanation: "12 in binary is 1100.",
        },
        {
          prompt: "Binary <span class='mono'>11011010</span> in hex is:",
          options: [
            { label: "<span class='mono'>0xBA</span>" },
            { label: "<span class='mono'>0xDA</span>" },
            { label: "<span class='mono'>0xCA</span>" },
            { label: "<span class='mono'>0xEA</span>" },
          ],
          answer: 1,
          hint: "Group: 1101 1010 → D A.",
          explanation: "1101 = D, 1010 = A → DA.",
        },
      ],
    ),
  );

  container.appendChild(
    section(
      "Summary",
      summary(null, [
        "Hex is base 16: digits 0–9 and A–F (values 10–15).",
        "One hex digit = exactly one 4-bit nibble. To convert binary → hex, group bits in fours from the right.",
        "Hex is just a shorter way to write binary — handy for memory addresses and byte values.",
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
        el("th", { text: "Decimal" }),
        el("th", { text: "Hex" }),
        el("th", { text: "Binary (4 bits)" }),
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

  const decInp = mkField("Decimal", "number", "47", (e) => {
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
  const binInp = mkField("Binary", "text", "00101111", (e) => {
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
    vis.appendChild(el("div", { class: "small text-2", text: "Nibble grouping (left-padded with zeros):" }));
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
        el("span", { html: "Combined hex: <span class='mono' style='font-size:20px;font-weight:700'>" + hex + "</span>" }),
      ]),
    );
  }
  inp.addEventListener("input", rerender);
  card.appendChild(
    el("div", { class: "row", style: { justifyContent: "center" } }, [
      el("span", { class: "small text-2", text: "Enter binary bits:" }),
      inp,
    ]),
  );
  card.appendChild(out);
  rerender();
  return card;
}
