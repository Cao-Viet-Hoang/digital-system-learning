// Simple hash router. Routes are registered with patterns like "lesson/:id".
const routes = [];
let notFoundHandler = null;
let onAfterRender = null;

export function route(pattern, handler) {
  const keys = [];
  const re = new RegExp(
    "^" +
      pattern.replace(/:([A-Za-z0-9_]+)/g, (_, k) => {
        keys.push(k);
        return "([^/]+)";
      }) +
      "$",
  );
  routes.push({ pattern, re, keys, handler });
}

export function setNotFound(fn) {
  notFoundHandler = fn;
}

export function setAfterRender(fn) {
  onAfterRender = fn;
}

export function navigate(path) {
  if (!path.startsWith("#")) path = "#/" + path.replace(/^\//, "");
  if (location.hash === path) {
    resolve();
  } else {
    location.hash = path;
  }
}

export function currentPath() {
  return (location.hash || "#/").slice(2); // drop "#/"
}

function resolve() {
  const path = currentPath();
  for (const r of routes) {
    const m = path.match(r.re);
    if (m) {
      const params = {};
      r.keys.forEach((k, i) => (params[k] = decodeURIComponent(m[i + 1])));
      r.handler(params, path);
      if (onAfterRender) onAfterRender(path);
      return;
    }
  }
  if (notFoundHandler) notFoundHandler(path);
  if (onAfterRender) onAfterRender(path);
}

export function startRouter() {
  window.addEventListener("hashchange", resolve);
  if (!location.hash) location.hash = "#/";
  resolve();
}
