// Quick practice: pick topic(s), count, difficulty, and drill.
import { el, clear } from "../utils/dom.js";
import { renderQuiz } from "../utils/quiz.js";
import { topics, generateQuestion } from "../utils/question-bank.js";

export function renderPractice(container) {
  clear(container);
  const inner = el("div", { class: "content-inner" });
  container.appendChild(inner);

  inner.appendChild(el("h1", { text: "Luyện Tập Nhanh" }));
  inner.appendChild(
    el("p", { class: "text-2", text: "Luyện tập bất kỳ kết hợp chủ đề nào — chọn số câu hỏi và mức độ khó." }),
  );

  const state = {
    selectedTopics: topics.map((t) => t.id),
    count: 10,
    difficulty: "normal",
  };

  // Topic chips
  const chips = el("div", { class: "row", style: { flexWrap: "wrap" } });
  function renderChips() {
    clear(chips);
    topics.forEach((t) => {
      const active = state.selectedTopics.includes(t.id);
      chips.appendChild(
        el("button", {
          class: "btn btn-sm" + (active ? " btn-primary" : " btn-outline"),
          text: t.label,
          onclick: () => {
            if (active) state.selectedTopics = state.selectedTopics.filter((x) => x !== t.id);
            else state.selectedTopics = [...state.selectedTopics, t.id];
            renderChips();
          },
        }),
      );
    });
  }
  renderChips();
  inner.appendChild(
    el("div", { class: "card" }, [
      el("h3", { text: "Chủ đề", style: { margin: "0 0 10px" } }),
      chips,
      el("div", { class: "row", style: { marginTop: "10px" } }, [
        el("button", {
          class: "btn btn-ghost btn-sm",
          text: "Chọn tất cả",
          onclick: () => {
            state.selectedTopics = topics.map((t) => t.id);
            renderChips();
          },
        }),
        el("button", {
          class: "btn btn-ghost btn-sm",
          text: "Bỏ chọn",
          onclick: () => {
            state.selectedTopics = [];
            renderChips();
          },
        }),
      ]),
    ]),
  );

  // Count + difficulty
  const countRow = el("div", { class: "row" });
  function renderCount() {
    clear(countRow);
    [5, 10, 15, 20].forEach((n) => {
      countRow.appendChild(
        el("button", {
          class: "btn btn-sm" + (state.count === n ? " btn-primary" : " btn-outline"),
          text: String(n),
          onclick: () => {
            state.count = n;
            renderCount();
          },
        }),
      );
    });
  }
  renderCount();

  const diffRow = el("div", { class: "row" });
  function renderDiff() {
    clear(diffRow);
    const diffLabels = { easy: "Dễ", normal: "Bình thường", hard: "Khó" };
    ["easy", "normal", "hard"].forEach((d) => {
      diffRow.appendChild(
        el("button", {
          class: "btn btn-sm" + (state.difficulty === d ? " btn-primary" : " btn-outline"),
          text: diffLabels[d],
          onclick: () => {
            state.difficulty = d;
            renderDiff();
          },
        }),
      );
    });
  }
  renderDiff();

  inner.appendChild(
    el("div", { class: "grid grid-2", style: { marginTop: "16px" } }, [
      el("div", { class: "card" }, [el("h3", { text: "Số câu hỏi", style: { margin: "0 0 10px" } }), countRow]),
      el("div", { class: "card" }, [el("h3", { text: "Mức độ khó", style: { margin: "0 0 10px" } }), diffRow]),
    ]),
  );

  // Start button
  inner.appendChild(
    el("div", { class: "row", style: { marginTop: "20px", justifyContent: "center" } }, [
      el("button", {
        class: "btn btn-primary btn-lg",
        text: "Bắt đầu luyện tập",
        onclick: () => start(),
      }),
    ]),
  );

  const quizHost = el("div", { style: { marginTop: "24px" } });
  inner.appendChild(quizHost);

  function start() {
    clear(quizHost);
    if (state.selectedTopics.length === 0) {
      quizHost.appendChild(el("div", { class: "alert alert-warning", text: "Hãy chọn ít nhất một chủ đề." }));
      return;
    }
    const questions = [];
    for (let i = 0; i < state.count; i++) {
      const t = state.selectedTopics[Math.floor(Math.random() * state.selectedTopics.length)];
      const q = generateQuestion(t, state.difficulty);
      if (q) questions.push(q);
    }
    quizHost.appendChild(el("h2", { text: "Vòng luyện tập", style: { marginBottom: "12px" } }));
    const host = el("div");
    quizHost.appendChild(host);
    renderQuiz(host, { questions, onComplete: () => {} });
    quizHost.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}
