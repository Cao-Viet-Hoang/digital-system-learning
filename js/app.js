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
import { renderKmapSolver } from "./pages/kmap-solver.js";

const content = $("#content");
const breadcrumb = $("#breadcrumb");

// Routes
route("", () => {
  setBreadcrumb([{ label: "Tổng quan", current: true }]);
  renderDashboard(content);
});

route("lesson/:id", ({ id }) => {
  const lesson = getLesson(id);
  setBreadcrumb([
    { label: "Tổng quan", href: "#/" },
    { label: lesson ? lesson.title : "Bài học", current: true },
  ]);
  renderLessonPage(content, { id });
});

route("exam", () => {
  setBreadcrumb([
    { label: "Tổng quan", href: "#/" },
    { label: "Kiểm tra chương", current: true },
  ]);
  renderExam(content);
});

route("practice", () => {
  setBreadcrumb([
    { label: "Tổng quan", href: "#/" },
    { label: "Luyện tập nhanh", current: true },
  ]);
  renderPractice(content);
});

route("dictionary", () => {
  setBreadcrumb([
    { label: "Tổng quan", href: "#/" },
    { label: "Bảng chú giải", current: true },
  ]);
  renderDictionary(content);
});

route("reference", () => {
  setBreadcrumb([
    { label: "Tổng quan", href: "#/" },
    { label: "Bảng tra cứu", current: true },
  ]);
  renderReference(content);
});

route("kmap-solver", () => {
  setBreadcrumb([
    { label: "Tổng quan", href: "#/" },
    { label: "Tối ưu bìa Karnaugh", current: true },
  ]);
  renderKmapSolver(content);
});

setNotFound((path) => {
  setBreadcrumb([{ label: "Không tìm thấy", current: true }]);
  clear(content);
  content.appendChild(
    el("div", { class: "content-inner" }, [
      el("h1", { text: "Không tìm thấy trang" }),
      el("p", { text: `Không có trang nào khớp với "${path}".` }),
      el("button", { class: "btn btn-primary", text: "Về tổng quan", onclick: () => navigate("/") }),
    ]),
  );
});

setAfterRender(() => {
  window.scrollTo(0, 0);
  renderSidebar();
  renderOverall();
  if (mobileQuery.matches) closeMobileSidebar();
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
  nav.appendChild(el("div", { class: "nav-group-title", text: "Học" }));
  nav.appendChild(navItem("", "Tổng quan", path === "" || path === "/", "🏠"));

  nav.appendChild(el("div", { class: "nav-group-title", text: "Bài học" }));
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

  nav.appendChild(el("div", { class: "nav-group-title", text: "Luyện tập" }));
  nav.appendChild(navItem("practice", "Luyện tập nhanh", path === "practice", "⚡"));
  nav.appendChild(navItem("exam", "Kiểm tra chương", path === "exam", "📝"));

  nav.appendChild(el("div", { class: "nav-group-title", text: "Tài nguyên" }));
  nav.appendChild(navItem("reference", "Bảng tra cứu", path === "reference", "📊"));
  nav.appendChild(navItem("dictionary", "Bảng chú giải", path === "dictionary", "📖"));
  nav.appendChild(navItem("kmap-solver", "Tối ưu bìa K", path === "kmap-solver", "🧮"));
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
  if (confirm("Đặt lại toàn bộ tiến độ? Thao tác này sẽ xóa kết quả bài học và điểm số.")) {
    resetAll();
    navigate("/");
  }
});

// Sidebar toggle
const sidebar = $("#sidebar");
const backdrop = $("#sidebar-backdrop");
const mobileQuery = window.matchMedia("(max-width: 900px)");

function closeMobileSidebar() {
  sidebar.classList.remove("open");
  backdrop.classList.remove("active");
}

$("#toggle-sidebar").addEventListener("click", () => {
  if (mobileQuery.matches) {
    const isOpen = sidebar.classList.toggle("open");
    backdrop.classList.toggle("active", isOpen);
  } else {
    $("#app").classList.toggle("sidebar-collapsed");
  }
});

backdrop.addEventListener("click", closeMobileSidebar);

// Khi chuyển từ desktop → mobile, reset trạng thái sidebar
mobileQuery.addEventListener("change", (e) => {
  if (e.matches) closeMobileSidebar();
});

subscribe(() => {
  renderSidebar();
  renderOverall();
});

startRouter();
