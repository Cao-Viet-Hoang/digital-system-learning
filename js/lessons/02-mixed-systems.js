// Lesson 2: Mixed Analog-Digital Systems.
import { el, clear } from "../utils/dom.js";
import { section, summary, quizSection, p, resetSectionCounter } from "../utils/lesson-ui.js";

export default {
  id: "mixed-systems",
  order: 2,
  title: "Hệ thống Analog-Digital Hỗn Hợp",
  subtitle: "Hầu hết hệ thống thực tế chuyển đổi tín hiệu vật lý sang digital, xử lý, rồi xuất ra thế giới analog.",
  objective:
    "Hiểu chuỗi tín hiệu điển hình — cảm biến → điều hòa analog → ADC → xử lý → DAC → cơ cấu chấp hành — và phân loại các phần của hệ thống là analog, digital, hoặc cả hai.",
  render,
};

const stages = [
  {
    key: "phys",
    title: "Đại lượng vật lý",
    blurb: "Âm thanh, ánh sáng, nhiệt độ, vị trí — liên tục trong thế giới thực.",
    color: "sky",
    type: "analog",
  },
  {
    key: "sensor",
    title: "Cảm biến",
    blurb: "Chuyển đại lượng vật lý thành điện áp. Đầu ra vẫn là analog.",
    color: "sky",
    type: "analog",
  },
  {
    key: "adc",
    title: "ADC",
    blurb: "Bộ chuyển đổi analog-sang-digital lấy mẫu và lượng hóa điện áp thành các bit.",
    color: "lavender",
    type: "boundary",
  },
  {
    key: "cpu",
    title: "Bộ xử lý Digital",
    blurb: "Phần mềm hoặc logic xử lý các bit — lọc, ra quyết định, lưu trữ.",
    color: "peach",
    type: "digital",
  },
  {
    key: "dac",
    title: "DAC",
    blurb: "Bộ chuyển đổi digital-sang-analog chuyển các bit đã xử lý trở lại thành điện áp.",
    color: "lavender",
    type: "boundary",
  },
  {
    key: "act",
    title: "Cơ cấu chấp hành",
    blurb: "Loa, động cơ, màn hình — điều khiển thế giới vật lý từ điện áp.",
    color: "mint",
    type: "analog",
  },
];

function render(container) {
  resetSectionCounter();
  clear(container);

  container.appendChild(
    section(
      "Hãy thử: xây dựng chuỗi tín hiệu",
      p(
        "Một hệ thống điển hình từ cảm biến đến cơ cấu chấp hành gồm sáu giai đoạn. Nhấn nút mũi tên để sắp xếp lại thứ tự, sau đó nhấn <strong>Kiểm tra thứ tự</strong>.",
      ),
      buildChainBuilder(),
    ),
  );

  container.appendChild(
    section(
      "Luồng tín hiệu cố định",
      p(
        "Khi đúng, chuỗi này chuyển đổi đại lượng vật lý liên tục thành các bit, xử lý chúng, rồi đẩy kết quả trở lại thế giới vật lý.",
      ),
      buildFlowDiagram(),
    ),
  );

  container.appendChild(
    section(
      "Phân loại thành phần",
      p(
        "Với mỗi ví dụ bên dưới, hãy chọn liệu giai đoạn đó là analog, digital, hay bộ chuyển đổi giữa hai loại.",
      ),
      buildClassifier(),
    ),
  );

  container.appendChild(
    quizSection(
      "mixed-systems",
      [
        {
          prompt:
            "Trong nhiệt kế digital, <strong>nhiệt điện trở (thermistor)</strong> xuất ra điện áp thay đổi liên tục. Giai đoạn này là:",
          options: [
            { label: "Analog" },
            { label: "Digital" },
            { label: "Bộ chuyển đổi giữa analog và digital" },
            { label: "Chỉ là cơ học" },
          ],
          answer: 0,
          hint: "Đầu ra của nhiệt điện trở là liên tục hay rời rạc?",
          explanation: "Điện áp của nhiệt điện trở là liên tục — đó là analog. ADC sau nó mới thực hiện việc chuyển đổi.",
        },
        {
          prompt: "Khối nào <strong>chuyển điện áp thành bit</strong>?",
          options: [{ label: "DAC" }, { label: "ADC" }, { label: "CPU" }, { label: "Cơ cấu chấp hành" }],
          answer: 1,
          hint: "ADC = Bộ chuyển đổi Analog-sang-Digital.",
          explanation: "ADC lấy mẫu điện áp theo chu kỳ đều và lượng hóa nó thành số nhiều bit.",
        },
        {
          prompt: "Hệ thống nào sau đây được mô tả tốt nhất là <strong>hỗn hợp analog + digital</strong>?",
          options: [
            { label: "Máy tính bỏ túi" },
            { label: "Cáp USB" },
            { label: "Loa thông minh lắng nghe, xử lý giọng nói và phát âm thanh" },
            { label: "Đồng hồ cơ thuần túy" },
          ],
          answer: 2,
          hint: "Hệ thống hỗn hợp cảm nhận thế giới vật lý và tác động lên nó.",
          explanation:
            "Loa thông minh có microphone (cảm biến analog), ADC, bộ xử lý digital, DAC và bộ khuếch đại-loa (cơ cấu chấp hành analog) — đó là hệ thống hỗn hợp điển hình.",
        },
      ],
    ),
  );

  container.appendChild(
    section(
      "ADC và DAC hoạt động như thế nào?",
      p(
        "ADC và DAC là hai thành phần quan trọng nhất trong hệ thống hỗn hợp. Hiểu cách chúng hoạt động giúp bạn thiết kế và sửa lỗi hệ thống hiệu quả hơn.",
      ),
      el("div", { class: "grid grid-2" }, [
        el("div", { class: "card card-soft-lavender" }, [
          el("h4", { text: "ADC — Bộ chuyển đổi A→D", style: { margin: "0 0 8px" } }),
          el("ol", { class: "small" }, [
            el("li", { text: "Lấy mẫu: đo điện áp tại thời điểm xác định" }),
            el("li", { text: "Giữ mẫu: giữ giá trị ổn định để xử lý" }),
            el("li", { text: "Lượng hóa: làm tròn đến mức gần nhất (ví dụ: 1024 mức với 10 bit)" }),
            el("li", { text: "Mã hóa: xuất số nhị phân tương ứng" }),
          ]),
          el("div", { class: "small text-2", style: { marginTop: "8px" } }, [
            el("span", { text: "Ví dụ: micro điện thoại, cảm biến nhiệt độ, camera" }),
          ]),
        ]),
        el("div", { class: "card card-soft-mint" }, [
          el("h4", { text: "DAC — Bộ chuyển đổi D→A", style: { margin: "0 0 8px" } }),
          el("ol", { class: "small" }, [
            el("li", { text: "Nhận số nhị phân từ bộ xử lý" }),
            el("li", { text: "Chuyển thành điện áp tỉ lệ với giá trị số" }),
            el("li", { text: "Lọc để làm mượt tín hiệu bậc thang" }),
            el("li", { text: "Khuếch đại để điều khiển cơ cấu chấp hành" }),
          ]),
          el("div", { class: "small text-2", style: { marginTop: "8px" } }, [
            el("span", { text: "Ví dụ: loa, động cơ servo, màn hình analog" }),
          ]),
        ]),
      ]),
      el("div", { class: "alert alert-info", style: { marginTop: "12px" } }, [
        el("strong", { text: "Lưu ý quan trọng: " }),
        el("span", { text: "Độ chính xác của hệ thống bị giới hạn bởi ADC. Nếu ADC chỉ có 8-bit (256 mức), dù bộ xử lý mạnh đến đâu, thông tin cũng không chi tiết hơn 256 mức ban đầu." }),
      ]),
    ),
  );

  container.appendChild(
    section(
      "Tóm tắt",
      summary(null, [
        "Hầu hết hệ thống thực đều là <strong>hỗn hợp</strong>: cảm biến và cơ cấu chấp hành là analog; xử lý là digital; <em>ADC</em> và <em>DAC</em> kết nối hai thế giới.",
        "Tín hiệu di chuyển theo hướng <em>vật lý → analog → digital → analog → vật lý</em>.",
        "Xác định giai đoạn nào thuộc loại nào là bước đầu tiên trong thiết kế hoặc khắc phục sự cố hệ thống.",
      ]),
    ),
  );
}

function buildFlowDiagram() {
  const card = el("div", { class: "card" });
  const row = el("div", { class: "row", style: { justifyContent: "space-between", flexWrap: "nowrap", overflowX: "auto", paddingBottom: "8px" } });
  stages.forEach((s, i) => {
    const box = el("div", { class: `card card-soft-${s.color}`, style: { minWidth: "140px", flexShrink: "0", textAlign: "center" } }, [
      el("div", { class: "small mono text-2", text: typeLabel(s.type) }),
      el("div", { style: { fontWeight: "600", marginTop: "4px" }, text: s.title }),
      el("div", { class: "small", style: { marginTop: "4px", opacity: "0.85" }, text: s.blurb }),
    ]);
    row.appendChild(box);
    if (i < stages.length - 1) {
      row.appendChild(el("div", { style: { fontSize: "20px", color: "var(--text-3)", flexShrink: "0" }, text: "→" }));
    }
  });
  card.appendChild(row);
  return card;
}

function typeLabel(t) {
  if (t === "analog") return "ANALOG";
  if (t === "digital") return "DIGITAL";
  return "CHUYỂN ĐỔI";
}

function buildChainBuilder() {
  const card = el("div", { class: "card" });
  const shuffled = stages.slice().sort(() => Math.random() - 0.5);
  const order = shuffled.slice();

  const list = el("div", { class: "stack", style: { gap: "8px" } });

  function rerender() {
    clear(list);
    order.forEach((s, i) => {
      const item = el(
        "div",
        {
          class: `card card-soft-${s.color}`,
          style: { display: "flex", alignItems: "center", gap: "12px", padding: "10px 14px" },
        },
        [
          el("span", { class: "mono small", style: { width: "20px" }, text: String(i + 1) }),
          el("div", { style: { flex: "1" } }, [
            el("div", { style: { fontWeight: "600" }, text: s.title }),
            el("div", { class: "small", style: { opacity: "0.85" }, text: s.blurb }),
          ]),
          el("button", {
            class: "btn btn-sm btn-ghost",
            text: "↑",
            disabled: i === 0,
            onclick: () => {
              [order[i - 1], order[i]] = [order[i], order[i - 1]];
              rerender();
            },
          }),
          el("button", {
            class: "btn btn-sm btn-ghost",
            text: "↓",
            disabled: i === order.length - 1,
            onclick: () => {
              [order[i + 1], order[i]] = [order[i], order[i + 1]];
              rerender();
            },
          }),
        ],
      );
      list.appendChild(item);
    });
  }

  rerender();
  card.appendChild(list);

  const feedback = el("div", { style: { marginTop: "12px" } });
  card.appendChild(feedback);

  card.appendChild(
    el("div", { class: "row", style: { marginTop: "12px" } }, [
      el("button", {
        class: "btn btn-primary",
        text: "Kiểm tra thứ tự",
        onclick: () => {
          clear(feedback);
          const correct = order.every((s, i) => s.key === stages[i].key);
          feedback.appendChild(
            el("div", { class: correct ? "alert alert-success" : "alert alert-warning" }, [
              el("strong", { text: correct ? "Đúng thứ tự! " : "Chưa đúng. " }),
              el("span", {
                text: correct
                  ? "Tín hiệu chạy: vật lý → cảm biến → ADC → bộ xử lý → DAC → cơ cấu chấp hành."
                  : "Gợi ý: tín hiệu phải là analog trước ADC và digital sau nó.",
              }),
            ]),
          );
        },
      }),
      el("button", {
        class: "btn btn-outline",
        text: "Xáo trộn",
        onclick: () => {
          order.sort(() => Math.random() - 0.5);
          rerender();
          clear(feedback);
        },
      }),
      el("button", {
        class: "btn btn-ghost",
        text: "Xem đáp án",
        onclick: () => {
          order.length = 0;
          stages.forEach((s) => order.push(s));
          rerender();
          clear(feedback);
        },
      }),
    ]),
  );

  return card;
}

function buildClassifier() {
  const items = [
    { name: "Màng rung microphone", answer: "analog", reason: "Xuất điện áp liên tục từ áp suất âm thanh." },
    { name: "Chip nhớ lưu trữ bit", answer: "digital", reason: "Lưu trữ giá trị rời rạc 0/1." },
    { name: "Bộ điều khiển loa", answer: "analog", reason: "Điều khiển dòng điện liên tục để di chuyển màng loa." },
    { name: "ADC trong preamp microphone", answer: "boundary", reason: "Chuyển đổi điện áp thành mã nhị phân." },
    { name: "Nút nhấn (nhấn / không nhấn)", answer: "digital", reason: "Chỉ có hai trạng thái rời rạc." },
    { name: "Thanh trượt độ sáng của bóng đèn thông minh", answer: "boundary", reason: "Núm điều khiển phía người dùng, nhưng bóng đèn lưu một số — bộ chuyển đổi giữa điều khiển analog-người-dùng và digital." },
  ];

  const card = el("div", { class: "card" });
  const grid = el("div", { class: "grid grid-2" });
  items.forEach((it) => {
    let chosen = null;
    let revealed = false;
    const block = el("div", { class: "card", style: { padding: "12px 14px" } });
    block.appendChild(el("div", { style: { fontWeight: "600" }, text: it.name }));
    const buttons = el("div", { class: "row", style: { marginTop: "8px" } });
    const fb = el("div", { class: "small", style: { marginTop: "8px" } });

    function rerender() {
      clear(buttons);
      ["analog", "digital", "boundary"].forEach((opt) => {
        const cls =
          "btn btn-sm " +
          (chosen === opt
            ? revealed
              ? opt === it.answer
                ? "btn-mint"
                : "btn-peach"
              : "btn-primary"
            : "btn-outline");
        buttons.appendChild(
          el("button", {
            class: cls,
            text: opt === "boundary" ? "Bộ chuyển đổi" : opt === "analog" ? "Analog" : "Digital",
            disabled: revealed,
            onclick: () => {
              chosen = opt;
              revealed = true;
              rerender();
              clear(fb);
              const ok = opt === it.answer;
              fb.appendChild(
                el("div", { class: ok ? "quiz-feedback ok" : "quiz-feedback bad" }, [
                  el("strong", { text: ok ? "Đúng rồi. " : "Chưa đúng. " }),
                  el("span", { text: it.reason }),
                ]),
              );
            },
          }),
        );
      });
    }
    rerender();
    block.appendChild(buttons);
    block.appendChild(fb);
    grid.appendChild(block);
  });

  card.appendChild(grid);
  return card;
}
