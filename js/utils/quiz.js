// Reusable quiz engine. Each question:
// { prompt, options:[{label,value}], answer, hint, explanation }
import { el, clear } from "./dom.js";

export function renderQuiz(container, { title, questions, onComplete }) {
  clear(container);
  const state = {
    index: 0,
    answers: new Array(questions.length).fill(null), // 'correct' | 'wrong' | null
    selected: null,
    showHint: false,
    revealed: false,
  };

  const root = el("div", { class: "quiz" });
  container.appendChild(root);

  function render() {
    clear(root);
    if (title) root.appendChild(el("h3", { text: title }));
    const q = questions[state.index];

    // progress bar with dots
    const dots = el("div", { class: "quiz-progress-dots" });
    state.answers.forEach((a, i) => {
      let cls = "quiz-progress-dot";
      if (a === "correct") cls += " correct";
      else if (a === "wrong") cls += " wrong";
      if (i === state.index) cls += " current";
      dots.appendChild(el("div", { class: cls }));
    });
    root.appendChild(
      el("div", { class: "quiz-progress" }, [
        el("span", { text: `Câu ${state.index + 1} / ${questions.length}` }),
        dots,
      ]),
    );

    root.appendChild(el("div", { class: "quiz-q", html: q.prompt }));

    const opts = el("div", { class: "quiz-options" });
    q.options.forEach((opt, i) => {
      const marker = String.fromCharCode(65 + i);
      let cls = "quiz-option";
      if (state.selected === i && !state.revealed) cls += " selected";
      if (state.revealed) {
        if (i === q.answer) cls += " correct";
        else if (state.selected === i) cls += " incorrect";
        cls += " disabled";
      }
      const btn = el(
        "button",
        {
          class: cls,
          onclick: () => {
            if (state.revealed) return;
            state.selected = i;
            render();
          },
        },
        [
          el("span", { class: "quiz-option-marker", text: marker }),
          el("span", { html: opt.label !== undefined ? opt.label : String(opt) }),
        ],
      );
      opts.appendChild(btn);
    });
    root.appendChild(opts);

    if (state.showHint && !state.revealed && q.hint) {
      root.appendChild(el("div", { class: "quiz-feedback hint", html: "<strong>Gợi ý.</strong> " + q.hint }));
    }

    if (state.revealed) {
      const isCorrect = state.selected === q.answer;
      const cls = isCorrect ? "quiz-feedback ok" : "quiz-feedback bad";
      const head = isCorrect ? "Chính xác!" : "Chưa đúng.";
      const body = q.explanation || "";
      root.appendChild(el("div", { class: cls, html: `<strong>${head}</strong> ${body}` }));
    }

    const actions = el("div", { class: "quiz-actions" });
    if (!state.revealed) {
      if (q.hint) {
        actions.appendChild(
          el("button", {
            class: "btn btn-outline btn-sm",
            text: state.showHint ? "Ẩn gợi ý" : "Xem gợi ý",
            onclick: () => {
              state.showHint = !state.showHint;
              render();
            },
          }),
        );
      }
      actions.appendChild(
        el("button", {
          class: "btn btn-primary",
          text: "Kiểm tra đáp án",
          disabled: state.selected == null,
          onclick: () => {
            if (state.selected == null) return;
            state.revealed = true;
            state.answers[state.index] = state.selected === q.answer ? "correct" : "wrong";
            render();
          },
        }),
      );
    } else {
      const isLast = state.index === questions.length - 1;
      actions.appendChild(
        el("button", {
          class: "btn btn-primary",
          text: isLast ? "Xem kết quả" : "Câu tiếp theo",
          onclick: () => {
            if (isLast) {
              showResults();
              return;
            }
            state.index += 1;
            state.selected = null;
            state.showHint = false;
            state.revealed = false;
            render();
          },
        }),
      );
    }
    root.appendChild(actions);
  }

  function showResults() {
    clear(root);
    const correct = state.answers.filter((a) => a === "correct").length;
    const total = questions.length;
    const pct = Math.round((correct / total) * 100);

    root.appendChild(el("h3", { text: "Kết quả kiểm tra" }));
    root.appendChild(
      el("div", { class: "row" }, [
        el("div", { class: "badge badge-success", text: `${correct} / ${total} đúng` }),
        el("div", { class: "badge badge-lavender", text: `Điểm: ${pct}%` }),
      ]),
    );

    const summary = el("div", { class: "stack", style: { marginTop: "16px" } });
    questions.forEach((q, i) => {
      const ok = state.answers[i] === "correct";
      const card = el("div", { class: "card", style: { padding: "12px 16px" } }, [
        el("div", { class: "row" }, [
          el("span", { class: ok ? "badge badge-success" : "badge badge-error", text: ok ? "Đúng" : "Sai" }),
          el("span", { class: "small text-2", text: `Câu ${i + 1}` }),
        ]),
        el("div", { style: { marginTop: "8px" }, html: q.prompt }),
        !ok && q.explanation
          ? el("div", { class: "small text-2", style: { marginTop: "6px" }, html: q.explanation })
          : null,
      ]);
      summary.appendChild(card);
    });
    root.appendChild(summary);

    const retry = el(
      "button",
      {
        class: "btn btn-primary",
        text: "Thử lại",
        style: { marginTop: "16px" },
        onclick: () => {
          state.index = 0;
          state.answers = new Array(questions.length).fill(null);
          state.selected = null;
          state.showHint = false;
          state.revealed = false;
          render();
        },
      },
    );
    root.appendChild(retry);

    if (onComplete) onComplete({ correct, total, pct });
  }

  render();
}
