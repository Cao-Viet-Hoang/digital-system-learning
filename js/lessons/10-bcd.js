// Lesson 10: BCD — binary-coded decimal and 7-segment display.
import { el, clear } from "../utils/dom.js";
import { section, summary, quizSection, p, resetSectionCounter } from "../utils/lesson-ui.js";
import { decToBcd, isValidBcdNibble, toBinary } from "../utils/conversions.js";
import { COLORS } from "../utils/colors.js";

export default {
  id: "bcd",
  order: 10,
  title: "BCD — Mã Thập Phân Nhị Phân",
  subtitle: "Mỗi chữ số thập phân được mã hóa bằng nhóm 4-bit riêng. Dùng trong màn hình hiển thị và máy tính bỏ túi.",
  objective:
    "Mã hóa giá trị thập phân sang BCD, phân biệt BCD với nhị phân thông thường, xác định nibble không hợp lệ, và đọc màn hình 7 đoạn.",
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
      "Hãy thử: mã hóa thập phân sang BCD",
      p(
        "Mỗi chữ số thập phân được mã hóa thành một nhóm 4-bit. Chú ý cách này <em>khác</em> với nhị phân thông thường — giá trị 23 trong BCD là <span class='mono'>0010 0011</span>, nhưng trong nhị phân thông thường 23 là <span class='mono'>10111</span>. Điều này vì BCD mã hóa từng chữ số riêng lẻ!",
      ),
      buildBcdEncoder(),
    ),
  );

  container.appendChild(
    section(
      "BCD so với nhị phân thông thường",
      buildComparison(),
    ),
  );

  container.appendChild(
    section(
      "Nibble BCD hợp lệ và không hợp lệ",
      p(
        "Chỉ các nibble từ 0000–1001 (giá trị 0–9) là mã BCD hợp lệ. Các nibble từ 1010–1111 (giá trị 10–15) là <strong>không hợp lệ</strong> trong BCD vì không có chữ số thập phân nào có giá trị từ 10 trở lên.",
      ),
      buildNibbleChecker(),
    ),
  );

  container.appendChild(
    section(
      "Bật/tắt màn hình 7 đoạn",
      p(
        "Màn hình 7 đoạn thắp sáng bảy thanh LED (được đánh nhãn a..g) để hiển thị một chữ số. Bật/tắt các đoạn bên dưới để tạo chữ số mục tiêu.",
      ),
      buildSevenSegment(),
    ),
  );

  container.appendChild(
    quizSection(
      "bcd",
      [
        {
          prompt: "Số thập phân <strong>59</strong> trong BCD là:",
          options: [
            { label: "<span class='mono'>00111011</span>" },
            { label: "<span class='mono'>0101 1001</span>" },
            { label: "<span class='mono'>0110 1010</span>" },
            { label: "<span class='mono'>0101 1010</span>" },
          ],
          answer: 1,
          hint: "Mã hóa từng chữ số riêng lẻ: 5 → 0101, 9 → 1001.",
          explanation: "59 → chữ số 5 là 0101, chữ số 9 là 1001. BCD = 0101 1001.",
        },
        {
          prompt: "Nibble <span class='mono'>1011</span> có phải là mã BCD hợp lệ không?",
          options: [{ label: "Có" }, { label: "Không — giá trị 11 nằm ngoài phạm vi 0–9" }],
          answer: 1,
          hint: "BCD chỉ mã hóa 0..9.",
          explanation: "1011 = 11 trong nhị phân; BCD chỉ cho phép 0..9 (0000..1001).",
        },
        {
          prompt: "Số 23 trong <strong>nhị phân thông thường</strong> so với <strong>BCD</strong>:",
          options: [
            { label: "Nhị phân 10111 / BCD 00100011 — khác nhau vì BCD mã hóa từng chữ số riêng" },
            { label: "Cả hai đều là 00100011" },
            { label: "Cả hai đều là 10111" },
            { label: "Nhị phân 00010111 / BCD 10111" },
          ],
          answer: 0,
          hint: "BCD đệm mỗi chữ số thập phân thành 4 bit.",
          explanation: "Nhị phân thông thường dùng giá trị toàn bộ số (10111). BCD mã hóa 2 → 0010 và 3 → 0011 riêng lẻ.",
        },
      ],
    ),
  );

  container.appendChild(
    section(
      "Ứng dụng của BCD trong thực tế",
      p(
        "BCD được thiết kế cho một mục đích cụ thể: dễ dàng hiển thị và xử lý số thập phân mà không cần chuyển đổi phức tạp.",
      ),
      el("div", { class: "grid grid-2" }, [
        el("div", { class: "card card-soft-sky" }, [
          el("h4", { text: "Màn hình 7 đoạn và đồng hồ", style: { margin: "0 0 8px" } }),
          el("p", { class: "small", style: { margin: 0 }, text: "Đồng hồ điện tử, máy tính bỏ túi, đồng hồ số dùng BCD để hiển thị giờ:phút:giây. Mỗi chữ số trên màn hình tương ứng với một nibble BCD — bộ điều khiển 7 đoạn chỉ cần dịch trực tiếp từ BCD sang tín hiệu LED." }),
        ]),
        el("div", { class: "card card-soft-peach" }, [
          el("h4", { text: "Tính toán tài chính", style: { margin: "0 0 8px" } }),
          el("p", { class: "small", style: { margin: 0 }, text: "Máy tính tài chính và POS (point-of-sale) dùng BCD để tránh lỗi làm tròn số thập phân. Ví dụ: 0.1 + 0.2 trong nhị phân float = 0.30000000000000004, nhưng trong BCD = 0.3 chính xác." }),
        ]),
      ]),
      el("div", { class: "card card-soft-lavender", style: { marginTop: "12px" } }, [
        el("h4", { text: "So sánh hiệu quả lưu trữ", style: { margin: "0 0 8px" } }),
        el("p", { class: "small", style: { margin: 0 }, html: "Số 99 (thập phân):<br>• Nhị phân thuần: <span class='mono'>1100011</span> = 7 bit<br>• BCD: <span class='mono'>1001 1001</span> = 8 bit<br><br>BCD cần 8 bit để biểu diễn số 99, trong khi nhị phân chỉ cần 7 bit. Tuy nhiên, đánh đổi này xứng đáng khi độ chính xác thập phân quan trọng hơn hiệu quả lưu trữ." }),
      ]),
    ),
  );

  container.appendChild(
    section(
      "Summary",
      summary(null, [
        "BCD = mỗi chữ số thập phân được mã hóa thành nhóm 4-bit riêng.",
        "Chỉ các nibble 0000–1001 là hợp lệ; 1010–1111 không được dùng.",
        "BCD lãng phí bit hơn so với nhị phân thông thường nhưng làm cho bộ điều khiển màn hình (ví dụ: 7 đoạn) đơn giản hơn nhiều.",
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
        el("div", { class: "small text-2", text: "Mã hóa BCD" }),
        el("div", { class: "mono", style: { fontSize: "20px", fontWeight: "600" }, text: groups.map((g) => g.bits).join(" ") }),
        el("div", { class: "small text-2", style: { marginTop: "8px" }, text: "Nhị phân thông thường của cùng giá trị, để so sánh:" }),
        el("div", { class: "mono", style: { fontSize: "16px" }, text: toBinary(v) }),
      ]),
    );
  }
  inp.addEventListener("input", rerender);
  card.appendChild(
    el("div", { class: "row", style: { justifyContent: "center" } }, [
      el("span", { class: "small text-2", text: "Thập phân:" }),
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
        el("th", { text: "Thập phân" }),
        el("th", { text: "Nhị phân thường" }),
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
    display.appendChild(el("div", { class: "small text-2", style: { marginTop: "4px" }, text: "Thập phân: " + v }));
    display.appendChild(
      el(
        "div",
        {
          class: "badge " + (valid ? "badge-success" : "badge-error"),
          style: { marginTop: "8px", fontSize: "13px" },
          text: valid ? "Nibble BCD hợp lệ (" + v + ")" : "Nibble BCD không hợp lệ (giá trị " + v + " > 9)",
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
        text: "Xóa",
        onclick: () => {
          Object.keys(segs).forEach((k) => (segs[k] = 0));
          rerender();
        },
      }),
    );
    controls.appendChild(
      el("button", {
        class: "btn btn-sm btn-ghost",
        text: "Hiện mục tiêu",
        onclick: () => {
          Object.assign(segs, SEG_FOR_DIGIT[target]);
          rerender();
        },
      }),
    );
    clear(fb);
    const match = matchDigit(segs);
    if (match === target) {
      fb.appendChild(el("div", { class: "quiz-feedback ok", text: "Trông giống số " + target + ". Khớp rồi!" }));
    } else if (match != null) {
      fb.appendChild(
        el("div", { class: "quiz-feedback hint", text: "Đang hiển thị số " + match + ", mục tiêu là số " + target + "." }),
      );
    }
  }

  card.appendChild(
    el("div", { class: "row", style: { justifyContent: "center" } }, [
      el("span", { class: "small text-2", text: "Chữ số mục tiêu:" }),
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
        text: "Mục tiêu ngẫu nhiên",
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
