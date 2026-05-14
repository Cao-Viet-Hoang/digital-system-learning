// App entry: wires up router, sidebar, top-bar progress, reset button.
import { el, clear, $ } from "./utils/dom.js";
import { route, startRouter, navigate, setNotFound, setAfterRender, currentPath } from "./router.js";
import { lessons, getLesson } from "./lessons.js";
import {
  getLessonStatus,
  getOverallPercent,
  resetAll,
  subscribe,
} from "./progress.js";
import { renderDashboard } from "./pages/dashboard.js";
import { renderLessonPage } from "./pages/lesson.js";
import { renderExam } from "./pages/exam.js";
import { renderPractice } from "./pages/practice.js";
import { renderDictionary } from "./pages/dictionary.js";
import { renderReference } from "./pages/reference.js";

const content = $("#content");
const breadcrumb = $("#breadcrumb");

// Routes
route("", () => {
  setBreadcrumb([{ label: "Overview", current: true }]);
  renderDashboard(content);
});

route("lesson/:id", ({ id }) => {
  const lesson = getLesson(id);
  setBreadcrumb([
    { label: "Overview", href: "#/" },
    { label: lesson ? lesson.title : "Lesson", current: true },
  ]);
  renderLessonPage(content, { id });
});

route("exam", () => {
  setBreadcrumb([
    { label: "Overview", href: "#/" },
    { label: "Chapter exam", current: true },
  ]);
  renderExam(content);
});

route("practice", () => {
  setBreadcrumb([
    { label: "Overview", href: "#/" },
    { label: "Quick practice", current: true },
  ]);
  renderPractice(content);
});

route("dictionary", () => {
  setBreadcrumb([
    { label: "Overview", href: "#/" },
    { label: "Glossary", current: true },
  ]);
  renderDictionary(content);
});

route("reference", () => {
  setBreadcrumb([
    { label: "Overview", href: "#/" },
    { label: "Reference tables", current: true },
  ]);
  renderReference(content);
});

setNotFound((path) => {
  setBreadcrumb([{ label: "Not found", current: true }]);
  clear(content);
  content.appendChild(
    el("div", { class: "content-inner" }, [
      el("h1", { text: "Page not found" }),
      el("p", { text: `No route matched "${path}".` }),
      el("button", { class: "btn btn-primary", text: "Back to overview", onclick: () => navigate("/") }),
    ]),
  );
});

setAfterRender(() => {
  window.scrollTo(0, 0);
  renderSidebar();
  renderOverall();
});

function setBreadcrumb(parts) {
  clear(breadcrumb);
  parts.forEach((p, i) => {
    if (i > 0) breadcrumb.appendChild(el("span", { class: "crumb-sep", text: "/" }));
    if (p.current) {
      breadcrumb.appendChild(el("span", { class: "crumb-current", text: p.label }));
    } else {
      breadcrumb.appendChild(el("a", { href: p.href, text: p.label }));
    }
  });
}

function renderSidebar() {
  const nav = $("#primary-nav");
  clear(nav);
  const path = currentPath();

  // Section: Learn
  nav.appendChild(el("div", { class: "nav-group-title", text: "Learn" }));
  nav.appendChild(navItem("", "Overview", path === "" || path === "/", "🏠"));

  nav.appendChild(el("div", { class: "nav-group-title", text: "Lessons" }));
  lessons.forEach((l) => {
    const id = l.id;
    const status = getLessonStatus(id);
    const isActive = path === `lesson/${id}`;
    const item = el(
      "button",
      {
        class: "nav-item" + (isActive ? " active" : ""),
        onclick: () => navigate(`lesson/${id}`),
      },
      [
        el("span", { class: "nav-item-num", text: String(l.order).padStart(2, "0") }),
        el("span", { style: { flex: "1", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" } }, [
          l.title,
        ]),
        el("span", {
          class: "nav-item-status" + (status === "completed" ? " done" : status === "in-progress" ? " in-progress" : ""),
        }),
      ],
    );
    nav.appendChild(item);
  });

  nav.appendChild(el("div", { class: "nav-group-title", text: "Practice" }));
  nav.appendChild(navItem("practice", "Quick practice", path === "practice", "⚡"));
  nav.appendChild(navItem("exam", "Chapter exam", path === "exam", "📝"));

  nav.appendChild(el("div", { class: "nav-group-title", text: "Resources" }));
  nav.appendChild(navItem("reference", "Reference tables", path === "reference", "📊"));
  nav.appendChild(navItem("dictionary", "Glossary", path === "dictionary", "📖"));
}

function navItem(path, label, active, icon) {
  return el(
    "button",
    {
      class: "nav-item" + (active ? " active" : ""),
      onclick: () => navigate(path || "/"),
    },
    [
      el("span", { class: "nav-item-num", text: icon || "•" }),
      el("span", { text: label }),
    ],
  );
}

function renderOverall() {
  const pct = getOverallPercent(lessons.map((l) => l.id));
  $("#overall-progress").style.width = pct + "%";
  $("#overall-progress-pct").textContent = pct + "%";
}

// Reset button
$("#reset-progress").addEventListener("click", () => {
  if (confirm("Reset all progress? This will clear lesson completion and scores.")) {
    resetAll();
    navigate("/");
  }
});

// Sidebar toggle (mobile)
$("#toggle-sidebar").addEventListener("click", () => {
  $("#sidebar").classList.toggle("open");
});

subscribe(() => {
  renderSidebar();
  renderOverall();
});

startRouter();
