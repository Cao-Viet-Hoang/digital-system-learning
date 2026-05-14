// Lesson page template: renders the lesson via its render() function and adds
// navigation between lessons.
import { el, clear } from "../utils/dom.js";
import { getLesson, getNextLesson, getPrevLesson } from "../lessons.js";
import { markStarted, setLastVisited } from "../progress.js";
import { navigate } from "../router.js";

export function renderLessonPage(container, { id }) {
  clear(container);
  const lesson = getLesson(id);
  if (!lesson) {
    container.appendChild(
      el("div", { class: "content-inner" }, [
        el("h1", { text: "Không tìm thấy bài học" }),
        el("p", { text: `Không có bài học nào với mã "${id}".` }),
        el("button", {
          class: "btn btn-primary",
          text: "Về tổng quan",
          onclick: () => navigate("/"),
        }),
      ]),
    );
    return;
  }

  markStarted(lesson.id);
  setLastVisited(lesson.id);

  const inner = el("div", { class: "content-inner" });
  container.appendChild(inner);

  const header = el("div", { class: "lesson-header" }, [
    el("div", { class: "badge badge-lavender", text: `Bài ${lesson.order} / 12` }),
    el("h1", { text: lesson.title }),
    lesson.subtitle ? el("p", { class: "text-2", text: lesson.subtitle }) : null,
  ]);
  inner.appendChild(header);

  inner.appendChild(
    el("div", { class: "lesson-objective" }, [
      el("div", { class: "lesson-objective-icon", text: "★" }),
      el("div", { class: "lesson-objective-text" }, [
        el("div", { class: "lesson-objective-label", text: "Mục tiêu học tập" }),
        el("div", { text: lesson.objective }),
      ]),
    ]),
  );

  // Body: each lesson exports a render(container) function.
  const body = el("div", { class: "lesson-body" });
  inner.appendChild(body);
  lesson.render(body);

  // Footer: prev/next nav.
  const prev = getPrevLesson(lesson.id);
  const next = getNextLesson(lesson.id);
  const footer = el("div", { class: "lesson-footer" });
  if (prev) {
    footer.appendChild(
      el(
        "button",
        {
          class: "lesson-nav-btn",
          onclick: () => navigate(`lesson/${prev.id}`),
        },
        [
          el("div", { class: "lesson-nav-btn-label", text: "← Trước" }),
          el("div", { class: "lesson-nav-btn-title", text: prev.title }),
        ],
      ),
    );
  } else {
    footer.appendChild(el("div", { style: { flex: "1" } }));
  }
  if (next) {
    footer.appendChild(
      el(
        "button",
        {
          class: "lesson-nav-btn right",
          onclick: () => navigate(`lesson/${next.id}`),
        },
        [
          el("div", { class: "lesson-nav-btn-label", text: "Tiếp →" }),
          el("div", { class: "lesson-nav-btn-title", text: next.title }),
        ],
      ),
    );
  } else {
    footer.appendChild(
      el(
        "button",
        {
          class: "lesson-nav-btn right",
          onclick: () => navigate("exam"),
        },
        [
          el("div", { class: "lesson-nav-btn-label", text: "Tiếp →" }),
          el("div", { class: "lesson-nav-btn-title", text: "Kiểm tra chương" }),
        ],
      ),
    );
  }
  inner.appendChild(footer);
}
