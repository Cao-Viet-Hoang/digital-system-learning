// Lesson 10: BCD — binary-coded decimal and 7-segment display.
import { el, clear } from "../utils/dom.js";
import { section, summary, quizSection, p, resetSectionCounter } from "../utils/lesson-ui.js";
import { decToBcd, isValidBcdNibble, toBinary } from "../utils/conversions.js";
import { COLORS } from "../utils/colors.js";

export default {
  id: "bcd",
  order: 10,
  title: "BCD — Binary Coded Decimal",
  subtitle: "Each decimal digit is encoded with its own 4-bit group. Used by displays and pocket calculators.",
  objective:
    "Encode a decimal value as BCD, distinguish BCD from plain binary, identify invalid nibbles, and read a 7-segment display.",
  render,
};

// 7-segment encoding (a..g) for digits 0–9. Standard mapping.
const SEG_FOR_DIGIT = {
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

function render(container) {
  resetSectionCounter();
  clear(container);

  container.appendChild(
    section(
      "Try it: encode a decimal as BCD",
      p(
        "Each decimal digit is encoded as a 4-bit group. Notice how this is <em>different</em> from plain binary — the value 23 in BCD is <span class='mono'>0010 0011</span>, but in plain binary 23 is <span class='mono'>10111</span>.",
      ),
      buildBcdEncoder(),
    ),
  );

  container.appendChild(
    section(
      "BCD vs plain binary",
      buildComparison(),
    ),
  );

  container.appendChild(
    section(
      "Valid vs invalid BCD nibbles",
      p(
        "Only nibbles 0000–1001 (values 0–9) are valid BCD codes. The nibbles 1010–1111 (values 10–15) are <strong>invalid</strong> in BCD.",
      ),
      buildNibbleChecker(),
    ),
  );

  container.appendChild(
    section(
      "Toggle 7-segment display",
      p(
        "A 7-segment display lights up seven LED bars (labelled a..g) to show a digit. Toggle the segments below to form the target digit.",
      ),
      buildSevenSegment(),
    ),
  );

  container.appendChild(
    quizSection(
      "bcd",
      [
        {
          prompt: "Decimal <strong>59</strong> in BCD is:",
          options: [
            { label: "<span class='mono'>00111011</span>" },
            { label: "<span class='mono'>0101 1001</span>" },
            { label: "<span class='mono'>0110 1010</span>" },
            { label: "<span class='mono'>0101 1010</span>" },
          ],
          answer: 1,
          hint: "Encode each digit separately: 5 → 0101, 9 → 1001.",
          explanation: "59 → digit 5 is 0101, digit 9 is 1001. BCD = 0101 1001.",
        },
        {
          prompt: "Is the nibble <span class='mono'>1011</span> a valid BCD code?",
          options: [{ label: "Yes" }, { label: "No — value 11 is outside 0–9" }],
          answer: 1,
          hint: "BCD only encodes 0..9.",
          explanation: "1011 = 11 in binary; BCD allows only 0..9 (0000..1001).",
        },
        {
          prompt: "Decimal 23 in <strong>plain binary</strong> vs <strong>BCD</strong>:",
          options: [
            { label: "Binary 10111 / BCD 00100011 — different because BCD encodes each digit separately" },
            { label: "Both are 00100011" },
            { label: "Both are 10111" },
            { label: "Binary 00010111 / BCD 10111" },
          ],
          answer: 0,
          hint: "BCD pads each decimal digit to 4 bits.",
          explanation: "Plain binary uses the whole number's value (10111). BCD encodes 2 → 0010 and 3 → 0011 separately.",
        },
      ],
    ),
  );

  container.appendChild(
    section(
      "Summary",
      summary(null, [
        "BCD = each decimal digit, encoded as its own 4-bit group.",
        "Only nibbles 0000–1001 are valid; 1010–1111 are not used.",
        "BCD wastes bits compared to plain binary but makes display drivers (eg. 7-segment) much simpler.",
      ]),
    ),
  );
}

function buildBcdEncoder() {
  const card = el("div", { class: "card" });
  const inp = el("input", {
    class: "input input-mono",
    type: "number",
    min: "0",
    max: "9999",
    value: "23",
    style: { width: "160px", textAlign: "center", fontSize: "20px" },
  });
  const out = el("div", { style: { marginTop: "12px" } });

  function rerender() {
    let v = parseInt(inp.value, 10);
    if (!Number.isFinite(v) || v < 0) v = 0;
    if (v > 9999) v = 9999;
    inp.value = String(v);
    const groups = decToBcd(v);
    clear(out);
    const row = el("div", { class: "row", style: { justifyContent: "center", flexWrap: "wrap" } });
    groups.forEach((g) => {
      row.appendChild(
        el("div", { class: "card card-soft-peach", style: { textAlign: "center", padding: "10px 14px" } }, [
          el("div", { class: "mono", style: { fontSize: "26px", fontWeight: "700" }, text: g.digit }),
          el("div", { class: "mono", style: { fontSize: "16px", marginTop: "6px" }, text: g.bits }),
        ]),
      );
    });
    out.appendChild(row);
    out.appendChild(
      el("div", { class: "card card-soft-mint", style: { textAlign: "center", marginTop: "10px" } }, [
        el("div", { class: "small text-2", text: "BCD encoding" }),
        el("div", { class: "mono", style: { fontSize: "20px", fontWeight: "600" }, text: groups.map((g) => g.bits).join(" ") }),
        el("div", { class: "small text-2", style: { marginTop: "8px" }, text: "Plain binary of the same value, for comparison:" }),
        el("div", { class: "mono", style: { fontSize: "16px" }, text: toBinary(v) }),
      ]),
    );
  }
  inp.addEventListener("input", rerender);
  card.appendChild(
    el("div", { class: "row", style: { justifyContent: "center" } }, [
      el("span", { class: "small text-2", text: "Decimal:" }),
      inp,
    ]),
  );
  card.appendChild(out);
  rerender();
  return card;
}

function buildComparison() {
  const card = el("div", { class: "card", style: { overflowX: "auto" } });
  const tbl = el("table", { class: "tbl tbl-bordered", style: { minWidth: "560px" } });
  tbl.appendChild(
    el("thead", {}, [
      el("tr", {}, [
        el("th", { text: "Decimal" }),
        el("th", { text: "Plain binary" }),
        el("th", { text: "BCD" }),
      ]),
    ]),
  );
  const tb = el("tbody");
  [3, 9, 10, 23, 47, 99, 100, 255].forEach((d) => {
    tb.appendChild(
      el("tr", {}, [
        el("td", { class: "mono", text: String(d) }),
        el("td", { class: "mono", text: toBinary(d) }),
        el("td", { class: "mono", text: decToBcd(d).map((g) => g.bits).join(" ") }),
      ]),
    );
  });
  tbl.appendChild(tb);
  card.appendChild(tbl);
  return card;
}

function buildNibbleChecker() {
  const card = el("div", { class: "card" });
  const bits = [0, 0, 0, 0];
  const row = el("div", { class: "row", style: { justifyContent: "center", gap: "10px" } });
  const display = el("div", { style: { textAlign: "center", marginTop: "12px" } });

  function rerender() {
    clear(row);
    bits.forEach((b, i) => {
      row.appendChild(
        el("button", {
          class: "bit-btn" + (b ? " on" : ""),
          text: String(b),
          onclick: () => {
            bits[i] = b ? 0 : 1;
            rerender();
          },
        }),
      );
    });
    const str = bits.join("");
    const v = parseInt(str, 2);
    const valid = isValidBcdNibble(str);
    clear(display);
    display.appendChild(el("div", { class: "mono", style: { fontSize: "22px" }, text: str }));
    display.appendChild(el("div", { class: "small text-2", style: { marginTop: "4px" }, text: "Decimal: " + v }));
    display.appendChild(
      el(
        "div",
        {
          class: "badge " + (valid ? "badge-success" : "badge-error"),
          style: { marginTop: "8px", fontSize: "13px" },
          text: valid ? "Valid BCD digit (" + v + ")" : "Invalid BCD nibble (value " + v + " > 9)",
        },
      ),
    );
  }
  card.appendChild(row);
  card.appendChild(display);
  rerender();
  return card;
}

// --- 7-segment display ----------------------------------------------------

function buildSevenSegment() {
  const card = el("div", { class: "card" });
  const segs = { a: 0, b: 0, c: 0, d: 0, e: 0, f: 0, g: 0 };
  let target = 0;

  const svgWrap = el("div", { style: { textAlign: "center" } });
  const controls = el("div", { class: "row", style: { justifyContent: "center", marginTop: "12px", flexWrap: "wrap" } });
  const fb = el("div", { style: { marginTop: "12px" } });

  function rerender() {
    clear(svgWrap);
    svgWrap.appendChild(drawSegments(segs));
    clear(controls);
    "abcdefg".split("").forEach((s) => {
      controls.appendChild(
        el("button", {
          class: "btn btn-sm" + (segs[s] ? " btn-peach" : " btn-outline"),
          text: s.toUpperCase(),
          onclick: () => {
            segs[s] = segs[s] ? 0 : 1;
            rerender();
          },
        }),
      );
    });
    controls.appendChild(
      el("button", {
        class: "btn btn-sm btn-ghost",
        text: "Clear",
        onclick: () => {
          Object.keys(segs).forEach((k) => (segs[k] = 0));
          rerender();
        },
      }),
    );
    controls.appendChild(
      el("button", {
        class: "btn btn-sm btn-ghost",
        text: "Show target",
        onclick: () => {
          Object.assign(segs, SEG_FOR_DIGIT[target]);
          rerender();
        },
      }),
    );
    clear(fb);
    const match = matchDigit(segs);
    if (match === target) {
      fb.appendChild(el("div", { class: "quiz-feedback ok", text: "Looks like a " + target + ". Match!" }));
    } else if (match != null) {
      fb.appendChild(
        el("div", { class: "quiz-feedback hint", text: "Currently displays " + match + ", target is " + target + "." }),
      );
    }
  }

  card.appendChild(
    el("div", { class: "row", style: { justifyContent: "center" } }, [
      el("span", { class: "small text-2", text: "Target digit:" }),
      (() => {
        const sel = el("select", { class: "select", style: { width: "80px" } });
        for (let i = 0; i < 10; i++) sel.appendChild(el("option", { value: String(i), text: String(i) }));
        sel.addEventListener("change", () => {
          target = parseInt(sel.value, 10);
          rerender();
        });
        return sel;
      })(),
      el("button", {
        class: "btn btn-outline btn-sm",
        text: "Random target",
        onclick: () => {
          target = Math.floor(Math.random() * 10);
          rerender();
        },
      }),
    ]),
  );
  card.appendChild(svgWrap);
  card.appendChild(controls);
  card.appendChild(fb);
  rerender();
  return card;
}

function drawSegments(segs) {
  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNS, "svg");
  const W = 140,
    H = 220;
  svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
  svg.setAttribute("width", "140");
  svg.setAttribute("height", "220");

  const on = COLORS.peachDeep;
  const off = COLORS.surface3;
  const seg = (name, points) => {
    const p = document.createElementNS(svgNS, "polygon");
    p.setAttribute("points", points);
    p.setAttribute("fill", segs[name] ? on : off);
    p.setAttribute("stroke", COLORS.border);
    p.setAttribute("stroke-width", "0.5");
    svg.appendChild(p);
  };

  // Segment polygons (approximate)
  seg("a", "30,10 110,10 100,22 40,22");
  seg("b", "112,12 122,22 122,98 112,108 102,98 102,32");
  seg("c", "112,112 122,122 122,198 112,208 102,198 102,132");
  seg("d", "30,210 110,210 100,198 40,198");
  seg("e", "28,112 38,122 38,198 28,208 18,198 18,122");
  seg("f", "28,12 38,22 38,98 28,108 18,98 18,22");
  seg("g", "30,110 110,110 100,118 40,118 30,110 40,102 100,102 110,110");

  // segment labels
  const lab = (x, y, t) => {
    const el = document.createElementNS(svgNS, "text");
    el.setAttribute("x", x);
    el.setAttribute("y", y);
    el.setAttribute("font-size", "9");
    el.setAttribute("font-family", "Inter");
    el.setAttribute("fill", COLORS.text3);
    el.setAttribute("text-anchor", "middle");
    el.textContent = t;
    svg.appendChild(el);
  };
  lab(70, 19, "a");
  lab(120, 60, "b");
  lab(120, 160, "c");
  lab(70, 218, "d");
  lab(20, 160, "e");
  lab(20, 60, "f");
  lab(70, 117, "g");
  return svg;
}

function matchDigit(segs) {
  for (let d = 0; d < 10; d++) {
    const ref = SEG_FOR_DIGIT[d];
    if (Object.keys(ref).every((k) => ref[k] === segs[k])) return d;
  }
  return null;
}
