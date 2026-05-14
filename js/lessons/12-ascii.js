// Lesson 12: ASCII — text encoded as numbers.
import { el, clear } from "../utils/dom.js";
import { section, summary, quizSection, p, resetSectionCounter } from "../utils/lesson-ui.js";
import { toBinary, toHex, asciiName } from "../utils/conversions.js";

export default {
  id: "ascii",
  order: 12,
  title: "Mã ASCII",
  subtitle: "Mỗi ký tự trên bàn phím chỉ là một con số.",
  objective:
    "Tra cứu mã ASCII cho bất kỳ ký tự in được nào, xem mã trong thập phân, hex và nhị phân, và tra cứu ngược lại.",
  render,
};

function render(container) {
  resetSectionCounter();
  clear(container);

  container.appendChild(
    section(
      "Hãy thử: mã hóa ký tự",
      p(
        "Nhập một ký tự hoặc cả từ. Mỗi ký tự ánh xạ đến một mã ASCII duy nhất. Cùng một mã có thể hiển thị dưới dạng thập phân, hex, hoặc nhị phân 8-bit.",
      ),
      buildEncoder(),
    ),
  );

  container.appendChild(
    section(
      "Duyệt bảng ASCII in được",
      buildAsciiTable(),
    ),
  );

  container.appendChild(
    section("Đoán ký tự", buildGuessExercise()),
  );

  container.appendChild(
    quizSection(
      "ascii",
      [
        {
          prompt: "Mã ASCII của ký tự <strong>'A'</strong> là:",
          options: [{ label: "60" }, { label: "65" }, { label: "97" }, { label: "101" }],
          answer: 1,
          hint: "Chữ cái hoa bắt đầu từ 65.",
          explanation: "'A' = 65 (thập phân) = 0x41.",
        },
        {
          prompt: "Ký tự nào có mã ASCII <strong>32</strong>?",
          options: [{ label: "'0'" }, { label: "'A'" }, { label: "Dấu cách (Space)" }, { label: "'a'" }],
          answer: 2,
          hint: "Nằm dưới các chữ cái và chữ số in được.",
          explanation: "32 là ký tự dấu cách (space).",
        },
        {
          prompt:
            "Chữ thường <strong>'a'</strong> có mã ASCII 97. Sự khác biệt giữa mã của 'a' và 'A' là bao nhiêu?",
          options: [{ label: "0" }, { label: "16" }, { label: "32" }, { label: "65" }],
          answer: 2,
          hint: "97 − 65.",
          explanation:
            "Chữ thường = chữ hoa + 32. Đó là lý do bit thứ 5 chuyển đổi chữ hoa/thường trong ASCII.",
        },
      ],
    ),
  );

  container.appendChild(
    section(
      "ASCII và các bộ mã ký tự hiện đại",
      p(
        "ASCII được thiết kế năm 1963 cho tiếng Anh với 128 ký tự (7 bit). Thế giới hiện đại cần nhiều hơn thế.",
      ),
      el("div", { class: "stack", style: { gap: "12px" } }, [
        el("div", { class: "card card-soft-sky" }, [
          el("h4", { text: "Cấu trúc ASCII gốc (7-bit, 128 ký tự)", style: { margin: "0 0 8px" } }),
          el("div", { class: "grid grid-2", style: { gap: "8px" } }, [
            el("div", { class: "small" }, [el("div", { html: "<strong>0–31:</strong> Ký tự điều khiển (CR, LF, Tab...)" }), el("div", { html: "<strong>32:</strong> Dấu cách (Space)" }), el("div", { html: "<strong>33–47:</strong> Ký hiệu (!, @, #...)" })]),
            el("div", { class: "small" }, [el("div", { html: "<strong>48–57:</strong> Chữ số '0'–'9'" }), el("div", { html: "<strong>65–90:</strong> Chữ hoa A–Z" }), el("div", { html: "<strong>97–122:</strong> Chữ thường a–z" })]),
          ]),
        ]),
        el("div", { class: "card card-soft-peach" }, [
          el("h4", { text: "Unicode — giải pháp toàn cầu", style: { margin: "0 0 8px" } }),
          el("p", { class: "small", style: { margin: 0 }, html: "ASCII không có tiếng Việt, tiếng Trung, tiếng Ả Rập... <strong>Unicode</strong> giải quyết điều này với hơn 143.000 ký tự từ hầu hết ngôn ngữ trên thế giới.<br><br><strong>UTF-8</strong> là cách mã hóa Unicode phổ biến nhất — ký tự ASCII dùng 1 byte, các ký tự khác dùng 2–4 byte. Trang web bạn đang xem dùng UTF-8!" }),
        ]),
      ]),
      el("div", { class: "alert alert-info", style: { marginTop: "12px" } }, [
        el("strong", { text: "Mẹo hay: " }),
        el("span", { html: "Chữ thường = Chữ hoa + 32. Ví dụ: 'A' = 65, 'a' = 97 = 65 + 32. Trong nhị phân, bit thứ 5 (từ phải, đánh số từ 0) là bit phân biệt hoa/thường: 'A' = <span class='mono'>01000001</span>, 'a' = <span class='mono'>01100001</span>." }),
      ]),
    ),
  );

  container.appendChild(
    section(
      "Summary",
      summary(null, [
        "ASCII ánh xạ mỗi ký tự đến mã 7-bit (ASCII mở rộng dùng 8 bit).",
        "Phạm vi thường gặp: chữ số '0'..'9' = 48..57, chữ hoa 'A'..'Z' = 65..90, chữ thường 'a'..'z' = 97..122.",
        "Cùng một mã, biểu diễn khác nhau: thập phân, hex, hoặc nhị phân 8-bit.",
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
      out.appendChild(el("div", { class: "alert alert-info", text: "Nhập gì đó ở trên để xem mã ASCII." }));
      return;
    }
    const row = el("div", { class: "row", style: { flexWrap: "wrap", justifyContent: "center" } });
    for (const ch of s) {
      const code = ch.charCodeAt(0);
      row.appendChild(
        el("div", { class: "card", style: { padding: "8px 12px", textAlign: "center", minWidth: "100px" } }, [
          el("div", { class: "mono", style: { fontSize: "26px", fontWeight: "700" }, text: displayChar(ch, code) }),
          el("div", { class: "small mono", style: { marginTop: "4px" }, text: "Thập phân: " + code }),
          el("div", { class: "small mono", text: "Hex: " + toHex(code, 2) }),
          el("div", { class: "small mono", text: "Nhị phân: " + toBinary(code, 8) }),
        ]),
      );
    }
    out.appendChild(row);
  }
  inp.addEventListener("input", rerender);
  card.appendChild(
    el("div", { class: "row", style: { justifyContent: "center" } }, [
      el("span", { class: "small text-2", text: "Nhập văn bản:" }),
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
    placeholder: "Tìm theo ký tự hoặc mã…",
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
          el("th", { text: "Ký tự" }),
          el("th", { text: "Thập phân" }),
          el("th", { text: "Hex" }),
          el("th", { text: "Nhị phân" }),
          el("th", { text: "Ghi chú" }),
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
      el("span", { class: "small text-2", text: "Lọc:" }),
      search,
    ]),
  );
  card.appendChild(tableWrap);
  rerender();
  return card;
}

function notesFor(code) {
  if (code === 32) return "Dấu cách";
  if (code >= 48 && code <= 57) return "Chữ số";
  if (code >= 65 && code <= 90) return "Chữ hoa";
  if (code >= 97 && code <= 122) return "Chữ thường";
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
  card.appendChild(el("div", { class: "small text-2", style: { textAlign: "center" }, text: "Ký tự nào có mã này?" }));
  card.appendChild(display);
  card.appendChild(
    el("div", { class: "row", style: { justifyContent: "center" } }, [
      el("span", { class: "small text-2", text: "Đoán của bạn:" }),
      inp,
      el("button", {
        class: "btn btn-primary btn-sm",
        text: "Kiểm tra",
        onclick: () => {
          clear(fb);
          if (!inp.value) {
            fb.appendChild(el("div", { class: "quiz-feedback hint", text: "Nhập một ký tự duy nhất." }));
            return;
          }
          const ok = inp.value === String.fromCharCode(code);
          fb.appendChild(
            el("div", { class: ok ? "quiz-feedback ok" : "quiz-feedback bad" }, [
              el("strong", { text: ok ? "Chính xác! " : "Chưa đúng. " }),
              el("span", { html: "Mã " + code + " = '<strong>" + String.fromCharCode(code) + "</strong>'." }),
            ]),
          );
        },
      }),
      el("button", { class: "btn btn-outline btn-sm", text: "Tiếp theo", onclick: newQ }),
    ]),
  );
  card.appendChild(fb);
  newQ();
  return card;
}
