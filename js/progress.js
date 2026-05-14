// Progress tracking via localStorage.
const KEY = "dsl.progress.v1";

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaults();
    const parsed = JSON.parse(raw);
    return { ...defaults(), ...parsed, lessons: { ...defaults().lessons, ...(parsed.lessons || {}) } };
  } catch {
    return defaults();
  }
}

function defaults() {
  return { lessons: {}, lastVisited: null, examScores: [] };
}

function save(state) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* ignore */
  }
}

let state = load();
const listeners = new Set();

function notify() {
  for (const fn of listeners) fn(state);
}

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function getProgress() {
  return state;
}

export function getLessonStatus(id) {
  return state.lessons[id]?.status || "not-started"; // not-started | in-progress | completed
}

export function getLessonScore(id) {
  return state.lessons[id]?.bestScore ?? null;
}

export function markStarted(id) {
  if (!state.lessons[id]) state.lessons[id] = { status: "in-progress" };
  else if (state.lessons[id].status === "not-started") state.lessons[id].status = "in-progress";
  state.lastVisited = id;
  save(state);
  notify();
}

export function markCompleted(id, score = null) {
  const cur = state.lessons[id] || {};
  const bestScore = score == null ? cur.bestScore ?? null : Math.max(cur.bestScore ?? 0, score);
  state.lessons[id] = { ...cur, status: "completed", bestScore };
  save(state);
  notify();
}

export function recordExamScore(score) {
  state.examScores.unshift({ score, at: Date.now() });
  state.examScores = state.examScores.slice(0, 10);
  save(state);
  notify();
}

export function setLastVisited(id) {
  state.lastVisited = id;
  save(state);
  notify();
}

export function getLastVisited() {
  return state.lastVisited;
}

export function getOverallPercent(allLessonIds) {
  if (!allLessonIds.length) return 0;
  const done = allLessonIds.filter((id) => state.lessons[id]?.status === "completed").length;
  return Math.round((done / allLessonIds.length) * 100);
}

export function resetAll() {
  state = defaults();
  save(state);
  notify();
}
