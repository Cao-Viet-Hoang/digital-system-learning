// Small helpers shared by lesson pages to reduce repetition.
import { el } from "./dom.js";
import { renderQuiz } from "./quiz.js";
import { markCompleted } from "../progress.js";

let sectionCounter = 0;

export function resetSectionCounter() {
  sectionCounter = 0;
}

export function section(title, ...children) {
  sectionCounter += 1;
  const wrap = el("section", { class: "lesson-section" });
  wrap.appendChild(
    el("div", { class: "lesson-section-title" }, [
      el("div", { class: "lesson-section-num", text: String(sectionCounter) }),
      el("h2", { text: title, style: { margin: "0" } }),
    ]),
  );
  for (const c of children) {
    if (c == null || c === false) continue;
    wrap.appendChild(c instanceof Node ? c : document.createTextNode(String(c)));
  }
  return wrap;
}

export function summary(title, points) {
  return el("div", { class: "summary" }, [
    el("h3", { text: title || "Điểm chính cần nhớ" }),
    el(
      "ul",
      {},
      points.map((p) => el("li", { html: p })),
    ),
  ]);
}

export function quizSection(lessonId, questions, title) {
  const wrap = el("section", { class: "lesson-section" });
  sectionCounter += 1;
  wrap.appendChild(
    el("div", { class: "lesson-section-title" }, [
      el("div", { class: "lesson-section-num", text: String(sectionCounter) }),
      el("h2", { text: title || "Kiểm tra nhanh", style: { margin: "0" } }),
    ]),
  );
  const host = el("div");
  wrap.appendChild(host);
  renderQuiz(host, {
    questions,
    onComplete: ({ pct }) => markCompleted(lessonId, pct),
  });
  return wrap;
}

// Prose paragraph helper - keeps lessons concise.
export function p(html) {
  return el("p", { html });
}

// Inline two-column layout for sim + text.
export function splitView(left, right) {
  return el("div", { class: "grid grid-2", style: { alignItems: "start" } }, [left, right]);
}
