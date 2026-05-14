// Overview / dashboard page.
import { el, clear } from "../utils/dom.js";
import { lessons } from "../lessons.js";
import { getLessonStatus, getLessonScore, getOverallPercent, getLastVisited } from "../progress.js";
import { navigate } from "../router.js";

const cardColors = ["mint", "peach", "lavender", "sky", "butter"];

export function renderDashboard(container) {
  clear(container);
  const inner = el("div", { class: "content-inner" });
  container.appendChild(inner);

  const pct = getOverallPercent(lessons.map((l) => l.id));
  const last = getLastVisited();
  const lastLesson = lessons.find((l) => l.id === last) || null;
  const completedCount = lessons.filter((l) => getLessonStatus(l.id) === "completed").length;

  const hero = el("div", { class: "hero" }, [
    el("h1", { text: "Hệ Thống Số — Chương 1" }),
    el("p", {
      text:
        "Học nền tảng điện tử số qua các mô phỏng tương tác. Bật/tắt bit, đọc dạng sóng, chuyển đổi giữa các hệ thống số, và nắm vững các mã như BCD, Gray và ASCII.",
    }),
    el("div", { class: "row" }, [
      lastLesson
        ? el("button", {
            class: "btn btn-primary",
            text: `Tiếp tục: ${lastLesson.title}`,
            onclick: () => navigate(`lesson/${lastLesson.id}`),
          })
        : el("button", {
            class: "btn btn-primary",
            text: "Bắt đầu bài học 1",
            onclick: () => navigate(`lesson/${lessons[0].id}`),
          }),
      el("button", {
        class: "btn btn-outline",
        text: "Luyện tập nhanh",
        onclick: () => navigate("practice"),
      }),
      el("button", {
        class: "btn btn-outline",
        text: "Kiểm tra chương",
        onclick: () => navigate("exam"),
      }),
    ]),
  ]);
  inner.appendChild(hero);

  // Stats row
  const stats = el("div", { class: "grid grid-3", style: { marginBottom: "24px" } }, [
    statCard("Bài học đã hoàn thành", `${completedCount} / ${lessons.length}`, "mint"),
    statCard("Tiến độ tổng thể", `${pct}%`, "lavender"),
    statCard(
      "Hoạt động gần nhất",
      lastLesson ? lastLesson.title : "Chưa bắt đầu",
      "peach",
      lastLesson ? () => navigate(`lesson/${lastLesson.id}`) : null,
    ),
  ]);
  inner.appendChild(stats);

  // Lessons grid
  inner.appendChild(el("h2", { text: "Các bài học", style: { marginTop: "8px" } }));
  inner.appendChild(
    el("p", {
      class: "text-2",
      text: "Mỗi bài học có mô phỏng tương tác và bài kiểm tra ngắn. Học theo thứ tự hoặc nhảy đến bất kỳ chủ đề nào.",
    }),
  );

  const grid = el("div", { class: "grid grid-3", style: { marginTop: "16px" } });
  lessons.forEach((l, i) => {
    const status = getLessonStatus(l.id);
    const score = getLessonScore(l.id);
    const color = cardColors[i % cardColors.length];
    const statusBadge =
      status === "completed"
        ? el("span", { class: "badge badge-success", text: "Hoàn thành" })
        : status === "in-progress"
        ? el("span", { class: "badge badge-warning", text: "Đang học" })
        : el("span", { class: "badge", text: "Chưa bắt đầu" });

    const card = el(
      "div",
      {
        class: `card card-soft-${color}`,
        style: { cursor: "pointer", display: "flex", flexDirection: "column", gap: "10px" },
        onclick: () => navigate(`lesson/${l.id}`),
      },
      [
        el("div", { class: "row" }, [
          el("span", {
            class: "mono",
            style: { fontSize: "11px", opacity: "0.7" },
            text: String(l.order).padStart(2, "0"),
          }),
          statusBadge,
        ]),
        el("h3", { text: l.title, style: { margin: "4px 0" } }),
        el("p", {
          class: "small",
          style: { margin: "0", color: "rgba(0,0,0,0.65)" },
          text: l.objective,
        }),
        score != null
          ? el("div", {
              class: "small",
              style: { marginTop: "4px", fontWeight: "500" },
              text: `Điểm kiểm tra cao nhất: ${score}%`,
            })
          : null,
      ],
    );
    grid.appendChild(card);
  });
  inner.appendChild(grid);

  // Tools section
  inner.appendChild(el("h2", { text: "Công cụ & tài liệu tham khảo", style: { marginTop: "32px" } }));
  const tools = el("div", { class: "grid grid-3", style: { marginTop: "12px" } }, [
    toolCard(
      "Luyện tập nhanh",
      "Câu hỏi ngẫu nhiên theo bất kỳ chủ đề nào để rèn luyện chuyển đổi và mã hóa.",
      "Mở luyện tập",
      () => navigate("practice"),
    ),
    toolCard(
      "Kiểm tra chương",
      "Bài kiểm tra toàn chương với điểm số và phân tích theo từng chủ đề.",
      "Làm bài kiểm tra",
      () => navigate("exam"),
    ),
    toolCard(
      "Bảng tra cứu",
      "Bảng tra cứu nhanh cho nhị phân, hex, BCD, Gray và ASCII.",
      "Xem bảng",
      () => navigate("reference"),
    ),
    toolCard(
      "Bảng chú giải",
      "Định nghĩa ngắn gọn, dễ hiểu cho tất cả các thuật ngữ quan trọng.",
      "Mở bảng chú giải",
      () => navigate("dictionary"),
    ),
  ]);
  inner.appendChild(tools);
}

function statCard(label, value, color, onclick) {
  return el(
    "div",
    {
      class: `card card-soft-${color}`,
      style: { cursor: onclick ? "pointer" : "default" },
      onclick: onclick || undefined,
    },
    [
      el("div", { class: "small text-2", text: label }),
      el("div", { style: { fontSize: "22px", fontWeight: "600", marginTop: "4px" }, text: value }),
    ],
  );
}

function toolCard(title, desc, btn, onclick) {
  return el("div", { class: "card" }, [
    el("h3", { text: title, style: { marginBottom: "6px" } }),
    el("p", { class: "small text-2", text: desc }),
    el("button", { class: "btn btn-outline btn-sm", text: btn, onclick, style: { marginTop: "6px" } }),
  ]);
}
