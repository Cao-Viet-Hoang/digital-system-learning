// Lesson 12: ASCII — text encoded as numbers.
import { el, clear } from "../utils/dom.js";
import { section, summary, quizSection, p, resetSectionCounter } from "../utils/lesson-ui.js";
import { toBinary, toHex, asciiName } from "../utils/conversions.js";

export default {
  id: "ascii",
  order: 12,
  title: "ASCII",
  subtitle: "Every character on the keyboard is just a number.",
  objective:
    "Look up the ASCII code for any printable character, see the code in decimal, hex and binary, and reverse the lookup.",
  render,
};

function render(container) {
  resetSectionCounter();
  clear(container);

  container.appendChild(
    section(
      "Try it: encode a character",
      p(
        "Type one character or a whole word. Each character maps to a single ASCII code. The same code can be displayed in decimal, hex, or 8-bit binary.",
      ),
      buildEncoder(),
    ),
  );

  container.appendChild(
    section(
      "Browse the printable ASCII table",
      buildAsciiTable(),
    ),
  );

  container.appendChild(
    section("Guess the character", buildGuessExercise()),
  );

  container.appendChild(
    quizSection(
      "ascii",
      [
        {
          prompt: "The ASCII code for character <strong>'A'</strong> is:",
          options: [{ label: "60" }, { label: "65" }, { label: "97" }, { label: "101" }],
          answer: 1,
          hint: "Uppercase letters start at 65.",
          explanation: "'A' = 65 (decimal) = 0x41.",
        },
        {
          prompt: "Which character has ASCII code <strong>32</strong>?",
          options: [{ label: "'0'" }, { label: "'A'" }, { label: "Space" }, { label: "'a'" }],
          answer: 2,
          hint: "Below the printable letters and digits.",
          explanation: "32 is the space character.",
        },
        {
          prompt:
            "The lowercase letter <strong>'a'</strong> has ASCII code 97. What is the difference between the codes for 'a' and 'A'?",
          options: [{ label: "0" }, { label: "16" }, { label: "32" }, { label: "65" }],
          answer: 2,
          hint: "97 − 65.",
          explanation:
            "Lowercase = uppercase + 32. That's why bit 5 toggles letter case in ASCII.",
        },
      ],
    ),
  );

  container.appendChild(
    section(
      "Summary",
      summary(null, [
        "ASCII maps each character to a 7-bit code (extended ASCII uses 8 bits).",
        "Common ranges: digits '0'..'9' = 48..57, uppercase 'A'..'Z' = 65..90, lowercase 'a'..'z' = 97..122.",
        "Same code, different representations: decimal, hex, or 8-bit binary.",
      ]),
    ),
  );
}

function buildEncoder() {
  const card = el("div", { class: "card" });
  const inp = el("input", {
    class: "input input-mono",
    type: "text",
    value: "Hello",
    style: { maxWidth: "320px", fontSize: "18px" },
  });
  const out = el("div", { style: { marginTop: "12px" } });

  function rerender() {
    const s = inp.value;
    clear(out);
    if (!s) {
      out.appendChild(el("div", { class: "alert alert-info", text: "Type something above to see ASCII codes." }));
      return;
    }
    const row = el("div", { class: "row", style: { flexWrap: "wrap", justifyContent: "center" } });
    for (const ch of s) {
      const code = ch.charCodeAt(0);
      row.appendChild(
        el("div", { class: "card", style: { padding: "8px 12px", textAlign: "center", minWidth: "100px" } }, [
          el("div", { class: "mono", style: { fontSize: "26px", fontWeight: "700" }, text: displayChar(ch, code) }),
          el("div", { class: "small mono", style: { marginTop: "4px" }, text: "Dec: " + code }),
          el("div", { class: "small mono", text: "Hex: " + toHex(code, 2) }),
          el("div", { class: "small mono", text: "Bin: " + toBinary(code, 8) }),
        ]),
      );
    }
    out.appendChild(row);
  }
  inp.addEventListener("input", rerender);
  card.appendChild(
    el("div", { class: "row", style: { justifyContent: "center" } }, [
      el("span", { class: "small text-2", text: "Enter text:" }),
      inp,
    ]),
  );
  card.appendChild(out);
  rerender();
  return card;
}

function displayChar(ch, code) {
  if (code < 32 || code === 127) return asciiName(code) || "?";
  return ch;
}

function buildAsciiTable() {
  const card = el("div", { class: "card" });
  const search = el("input", {
    class: "input input-mono",
    type: "text",
    placeholder: "Search by char or code…",
    style: { maxWidth: "260px" },
  });

  const tableWrap = el("div", { style: { overflowX: "auto", marginTop: "12px" } });

  function rerender() {
    const q = search.value.trim();
    clear(tableWrap);
    const tbl = el("table", { class: "tbl tbl-bordered", style: { minWidth: "560px" } });
    tbl.appendChild(
      el("thead", {}, [
        el("tr", {}, [
          el("th", { text: "Char" }),
          el("th", { text: "Dec" }),
          el("th", { text: "Hex" }),
          el("th", { text: "Binary" }),
          el("th", { text: "Notes" }),
        ]),
      ]),
    );
    const tb = el("tbody");
    for (let code = 32; code <= 126; code++) {
      const ch = String.fromCharCode(code);
      if (q) {
        if (!(ch === q || String(code) === q || toHex(code, 2) === q.toUpperCase())) continue;
      }
      tb.appendChild(
        el("tr", {}, [
          el("td", { class: "mono", style: { fontSize: "16px" }, text: ch }),
          el("td", { class: "mono", text: String(code) }),
          el("td", { class: "mono", text: toHex(code, 2) }),
          el("td", { class: "mono", text: toBinary(code, 8) }),
          el("td", { class: "small text-2", text: notesFor(code) }),
        ]),
      );
    }
    tbl.appendChild(tb);
    tableWrap.appendChild(tbl);
  }
  search.addEventListener("input", rerender);
  card.appendChild(
    el("div", { class: "row" }, [
      el("span", { class: "small text-2", text: "Filter:" }),
      search,
    ]),
  );
  card.appendChild(tableWrap);
  rerender();
  return card;
}

function notesFor(code) {
  if (code === 32) return "Space";
  if (code >= 48 && code <= 57) return "Digit";
  if (code >= 65 && code <= 90) return "Uppercase letter";
  if (code >= 97 && code <= 122) return "Lowercase letter";
  return "";
}

function buildGuessExercise() {
  const card = el("div", { class: "card" });
  let code = 0;
  const display = el("div", { class: "mono", style: { textAlign: "center", fontSize: "26px", margin: "12px 0" } });
  const inp = el("input", { class: "input input-mono", type: "text", maxlength: "1", style: { width: "60px", textAlign: "center" } });
  const fb = el("div", { style: { marginTop: "10px" } });

  function newQ() {
    code = Math.floor(Math.random() * (126 - 33 + 1)) + 33;
    clear(display);
    display.appendChild(el("span", { text: "ASCII " + code + " (hex 0x" + toHex(code, 2) + ")" }));
    inp.value = "";
    clear(fb);
  }
  card.appendChild(el("div", { class: "small text-2", style: { textAlign: "center" }, text: "Which character has this code?" }));
  card.appendChild(display);
  card.appendChild(
    el("div", { class: "row", style: { justifyContent: "center" } }, [
      el("span", { class: "small text-2", text: "Your guess:" }),
      inp,
      el("button", {
        class: "btn btn-primary btn-sm",
        text: "Check",
        onclick: () => {
          clear(fb);
          if (!inp.value) {
            fb.appendChild(el("div", { class: "quiz-feedback hint", text: "Enter a single character." }));
            return;
          }
          const ok = inp.value === String.fromCharCode(code);
          fb.appendChild(
            el("div", { class: ok ? "quiz-feedback ok" : "quiz-feedback bad" }, [
              el("strong", { text: ok ? "Correct! " : "Not quite. " }),
              el("span", { html: "Code " + code + " = '<strong>" + String.fromCharCode(code) + "</strong>'." }),
            ]),
          );
        },
      }),
      el("button", { class: "btn btn-outline btn-sm", text: "Next", onclick: newQ }),
    ]),
  );
  card.appendChild(fb);
  newQ();
  return card;
}
