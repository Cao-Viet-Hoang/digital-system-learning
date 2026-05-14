// Chapter exam: covers all 12 topics with multiple difficulty levels.
import { el, clear } from "../utils/dom.js";
import { renderQuiz } from "../utils/quiz.js";
import { topics, generateQuestion } from "../utils/question-bank.js";
import { recordExamScore, getProgress } from "../progress.js";
import { navigate } from "../router.js";

const LEVELS = {
  basic: { label: "Basic", count: 8, difficulty: "easy" },
  practice: { label: "Practice", count: 15, difficulty: "normal" },
  challenge: { label: "Challenge", count: 20, difficulty: "hard" },
};

export function renderExam(container) {
  clear(container);
  const inner = el("div", { class: "content-inner" });
  container.appendChild(inner);

  inner.appendChild(el("h1", { text: "Chapter Exam" }));
  inner.appendChild(
    el("p", {
      class: "text-2",
      text: "Mixed questions covering every topic in chapter 1. Choose a difficulty level to start.",
    }),
  );

  const choose = el("div", { class: "grid grid-3", style: { marginTop: "16px" } });
  Object.entries(LEVELS).forEach(([key, lv]) => {
    choose.appendChild(
      el(
        "div",
        {
          class: "card card-soft-" + (key === "basic" ? "mint" : key === "practice" ? "lavender" : "peach"),
          style: { cursor: "pointer" },
          onclick: () => startExam(key),
        },
        [
          el("h3", { text: lv.label, style: { margin: "0 0 4px" } }),
          el("div", { class: "small text-2", text: `${lv.count} questions • ${lv.difficulty} difficulty` }),
          el("button", { class: "btn btn-outline btn-sm", style: { marginTop: "10px" }, text: "Start" }),
        ],
      ),
    );
  });
  inner.appendChild(choose);

  // History
  const history = getProgress().examScores;
  if (history.length) {
    inner.appendChild(el("h3", { text: "Recent attempts", style: { marginTop: "32px" } }));
    const list = el("div", { class: "stack" });
    history.slice(0, 5).forEach((h) => {
      const d = new Date(h.at);
      list.appendChild(
        el("div", { class: "card", style: { display: "flex", justifyContent: "space-between" } }, [
          el("span", { text: d.toLocaleString() }),
          el("span", {
            class: "badge " + (h.score >= 80 ? "badge-success" : h.score >= 60 ? "badge-warning" : "badge-error"),
            text: `${h.score}%`,
          }),
        ]),
      );
    });
    inner.appendChild(list);
  }

  const examWrap = el("div", { id: "exam-wrap", style: { marginTop: "24px" } });
  inner.appendChild(examWrap);

  function startExam(levelKey) {
    const lv = LEVELS[levelKey];
    const questions = [];
    // distribute across topics
    for (let i = 0; i < lv.count; i++) {
      const topic = topics[i % topics.length];
      const q = generateQuestion(topic.id, lv.difficulty);
      if (q) questions.push({ ...q, topicId: topic.id, topicLabel: topic.label });
    }
    clear(examWrap);
    examWrap.appendChild(
      el("h2", { text: `${lv.label} exam`, style: { marginBottom: "12px" } }),
    );
    const host = el("div");
    examWrap.appendChild(host);

    // We render the quiz, then on complete, also show per-topic breakdown.
    renderQuiz(host, {
      questions,
      onComplete: ({ pct }) => {
        recordExamScore(pct);
        host.appendChild(renderTopicBreakdown(questions));
      },
    });
    examWrap.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function renderTopicBreakdown(questions) {
  // Use the quiz state implicitly: walk DOM is not great. Instead, store hint
  // by reading from the DOM is fragile - so we re-evaluate by scanning rendered
  // "wrong"/"correct" feedback. Simpler: rely on the question.answer vs the
  // user's choices stored by the quiz engine via answers in dots? We don't
  // export that. So instead, build a quick summary card listing topics covered.
  const wrap = el("div", { style: { marginTop: "16px" } });
  wrap.appendChild(el("h3", { text: "Topics covered" }));
  const byTopic = {};
  questions.forEach((q) => {
    if (!byTopic[q.topicId]) byTopic[q.topicId] = { label: q.topicLabel, count: 0 };
    byTopic[q.topicId].count += 1;
  });
  const list = el("div", { class: "stack" });
  Object.entries(byTopic).forEach(([id, t]) => {
    list.appendChild(
      el("div", { class: "card", style: { display: "flex", justifyContent: "space-between", alignItems: "center" } }, [
        el("span", { text: t.label }),
        el("div", { class: "row" }, [
          el("span", { class: "small text-2", text: `${t.count} questions` }),
          el("button", {
            class: "btn btn-outline btn-sm",
            text: "Open lesson",
            onclick: () => {
              const topic = topics.find((tt) => tt.id === id);
              if (topic) navigate(`lesson/${topic.lesson}`);
            },
          }),
        ]),
      ]),
    );
  });
  wrap.appendChild(list);
  return wrap;
}
