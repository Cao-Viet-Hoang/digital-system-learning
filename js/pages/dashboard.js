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
    el("h1", { text: "Digital Systems — Chapter 1" }),
    el("p", {
      text:
        "Learn the foundations of digital electronics through hands-on simulations. Toggle bits, read waveforms, convert between number systems, and master codes like BCD, Gray, and ASCII.",
    }),
    el("div", { class: "row" }, [
      lastLesson
        ? el("button", {
            class: "btn btn-primary",
            text: `Continue: ${lastLesson.title}`,
            onclick: () => navigate(`lesson/${lastLesson.id}`),
          })
        : el("button", {
            class: "btn btn-primary",
            text: "Start lesson 1",
            onclick: () => navigate(`lesson/${lessons[0].id}`),
          }),
      el("button", {
        class: "btn btn-outline",
        text: "Quick practice",
        onclick: () => navigate("practice"),
      }),
      el("button", {
        class: "btn btn-outline",
        text: "Chapter exam",
        onclick: () => navigate("exam"),
      }),
    ]),
  ]);
  inner.appendChild(hero);

  // Stats row
  const stats = el("div", { class: "grid grid-3", style: { marginBottom: "24px" } }, [
    statCard("Lessons completed", `${completedCount} / ${lessons.length}`, "mint"),
    statCard("Overall progress", `${pct}%`, "lavender"),
    statCard(
      "Last activity",
      lastLesson ? lastLesson.title : "Not started",
      "peach",
      lastLesson ? () => navigate(`lesson/${lastLesson.id}`) : null,
    ),
  ]);
  inner.appendChild(stats);

  // Lessons grid
  inner.appendChild(el("h2", { text: "Lessons", style: { marginTop: "8px" } }));
  inner.appendChild(
    el("p", {
      class: "text-2",
      text: "Each lesson has an interactive simulation and a short quiz. Complete them in order or jump to any topic.",
    }),
  );

  const grid = el("div", { class: "grid grid-3", style: { marginTop: "16px" } });
  lessons.forEach((l, i) => {
    const status = getLessonStatus(l.id);
    const score = getLessonScore(l.id);
    const color = cardColors[i % cardColors.length];
    const statusBadge =
      status === "completed"
        ? el("span", { class: "badge badge-success", text: "Completed" })
        : status === "in-progress"
        ? el("span", { class: "badge badge-warning", text: "In progress" })
        : el("span", { class: "badge", text: "Not started" });

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
              text: `Best quiz score: ${score}%`,
            })
          : null,
      ],
    );
    grid.appendChild(card);
  });
  inner.appendChild(grid);

  // Tools section
  inner.appendChild(el("h2", { text: "Tools & references", style: { marginTop: "32px" } }));
  const tools = el("div", { class: "grid grid-3", style: { marginTop: "12px" } }, [
    toolCard(
      "Quick practice",
      "Random questions on any topic to drill conversions and codes.",
      "Open practice",
      () => navigate("practice"),
    ),
    toolCard(
      "Chapter exam",
      "Full chapter quiz with scoring and a topic-by-topic breakdown.",
      "Take exam",
      () => navigate("exam"),
    ),
    toolCard(
      "Reference tables",
      "Lookup tables for binary, hex, BCD, Gray and ASCII.",
      "View tables",
      () => navigate("reference"),
    ),
    toolCard(
      "Glossary",
      "Short, plain-language definitions of all key terms.",
      "Open glossary",
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
