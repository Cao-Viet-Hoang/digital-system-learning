// Glossary of important terms.
import { el, clear } from "../utils/dom.js";

const TERMS = [
  { term: "Analog signal", def: "A continuously varying quantity (eg. voltage from a microphone). Can take any value within its range." },
  { term: "Digital signal", def: "A signal that takes a small discrete set of values, usually two — interpreted as 0 and 1." },
  { term: "Bit", def: "A binary digit — the smallest unit of digital information; value 0 or 1." },
  { term: "Byte", def: "A group of 8 bits. Often the smallest addressable unit of memory." },
  { term: "Nibble", def: "A group of 4 bits — exactly one hex digit." },
  { term: "Binary (base 2)", def: "Number system with two digits (0, 1) and powers of two as place values." },
  { term: "Decimal (base 10)", def: "Number system with ten digits (0–9) and powers of ten as place values." },
  { term: "Hexadecimal (base 16)", def: "Number system with sixteen digits (0–9, A–F) — one hex digit = 4 bits." },
  { term: "Logic 0 / Logic 1", def: "The two valid binary states. Voltage ranges depend on the technology (eg. CMOS, TTL)." },
  { term: "Undefined region", def: "Voltage range between logic 0 and logic 1 where the gate's interpretation is unreliable." },
  { term: "Clock", def: "A regular oscillating signal that paces a digital system; data is sampled on clock edges." },
  { term: "Waveform", def: "Plot of a signal's value over time." },
  { term: "BCD (Binary Coded Decimal)", def: "Encoding where each decimal digit is represented by its own 4-bit group (0000..1001)." },
  { term: "Gray code", def: "A binary encoding where consecutive values differ by exactly one bit." },
  { term: "ASCII", def: "American Standard Code for Information Interchange — maps characters to 7-bit numeric codes." },
  { term: "ADC", def: "Analog-to-digital converter — samples a continuous voltage and outputs a binary number." },
  { term: "DAC", def: "Digital-to-analog converter — takes a binary number and produces a corresponding voltage." },
  { term: "MSB / LSB", def: "Most-significant bit / least-significant bit — the leftmost / rightmost bit of a binary value." },
  { term: "7-segment display", def: "A display made of seven LED segments (a..g) that can show digits 0–9." },
  { term: "Nibble (BCD)", def: "In BCD context, a 4-bit group representing exactly one decimal digit." },
];

export function renderDictionary(container) {
  clear(container);
  const inner = el("div", { class: "content-inner" });
  container.appendChild(inner);
  inner.appendChild(el("h1", { text: "Glossary" }));
  inner.appendChild(
    el("p", { class: "text-2", text: "Short, plain-language definitions of the key terms used in this chapter." }),
  );

  const search = el("input", {
    class: "input input-mono",
    type: "text",
    placeholder: "Search terms…",
    style: { maxWidth: "320px", marginBottom: "16px" },
  });
  inner.appendChild(search);
  const list = el("div", { class: "stack" });
  inner.appendChild(list);

  function rerender() {
    const q = search.value.trim().toLowerCase();
    clear(list);
    TERMS.filter((t) => !q || t.term.toLowerCase().includes(q) || t.def.toLowerCase().includes(q)).forEach((t) => {
      list.appendChild(
        el("div", { class: "card" }, [
          el("div", { style: { fontWeight: "600", marginBottom: "4px" }, text: t.term }),
          el("div", { class: "text-2", text: t.def }),
        ]),
      );
    });
    if (!list.children.length) {
      list.appendChild(el("div", { class: "alert alert-info", text: "No terms matched your search." }));
    }
  }
  search.addEventListener("input", rerender);
  rerender();
}
