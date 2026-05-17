// Shared logic gate helpers — symbol drawing, output computation, naming.
// Used across Chapter 2 lessons (logic gates, circuits, theorems, universality).
import { COLORS } from "./colors.js";
import { el, clear } from "./dom.js";

const SVG_NS = "http://www.w3.org/2000/svg";

// Compute the output of a gate given inputs (0/1 ints or booleans).
export function computeGate(type, a, b) {
  const A = a ? 1 : 0;
  const B = b ? 1 : 0;
  switch (type) {
    case "AND": return A & B;
    case "OR": return A | B;
    case "NOT": return A ? 0 : 1;
    case "NAND": return A & B ? 0 : 1;
    case "NOR": return A | B ? 0 : 1;
    case "XOR": return A ^ B;
    case "XNOR": return A ^ B ? 0 : 1;
    case "BUF": return A;
    default: return 0;
  }
}

// Vietnamese-friendly short name & Boolean expression string.
export function gateInfo(type) {
  const map = {
    AND: { name: "AND", expr: "Y = A · B", desc: "Ngõ ra bằng 1 chỉ khi <em>tất cả</em> ngõ vào bằng 1." },
    OR: { name: "OR", expr: "Y = A + B", desc: "Ngõ ra bằng 1 khi <em>có ít nhất một</em> ngõ vào bằng 1." },
    NOT: { name: "NOT (INVERTER)", expr: "Y = <span style='text-decoration:overline'>A</span>", desc: "Đảo trạng thái ngõ vào: 0 → 1 và 1 → 0." },
    NAND: { name: "NAND", expr: "Y = <span style='text-decoration:overline'>A · B</span>", desc: "Là cổng AND nối tiếp NOT — đảo kết quả AND." },
    NOR: { name: "NOR", expr: "Y = <span style='text-decoration:overline'>A + B</span>", desc: "Là cổng OR nối tiếp NOT — đảo kết quả OR." },
    XOR: { name: "EX-OR (XOR)", expr: "Y = A ⊕ B", desc: "Ngõ ra bằng 1 khi <em>chỉ một</em> ngõ vào bằng 1 (hai ngõ vào khác nhau)." },
    XNOR: { name: "EX-NOR (XNOR)", expr: "Y = <span style='text-decoration:overline'>A ⊕ B</span>", desc: "Ngõ ra bằng 1 khi hai ngõ vào <em>giống nhau</em>." },
  };
  return map[type] || { name: type, expr: "", desc: "" };
}

// Draw a gate symbol (ANSI/IEEE distinctive shape) into an SVG, anchored at (x,y) — left-center.
// Returns { inA, inB, out, body, width, height } where port coordinates are absolute SVG coordinates.
// Each port already accounts for the gate's curved back: external wires drawn straight to inA/inB
// will visually meet the gate's input lead.
export function drawGate(svg, type, x, y, opts = {}) {
  const scale = opts.scale || 1;
  const stroke = opts.stroke || COLORS.text;
  const fill = opts.fill || COLORS.surface;
  const strokeWidth = opts.strokeWidth || 2;
  const g = document.createElementNS(SVG_NS, "g");
  g.setAttribute("transform", `translate(${x},${y}) scale(${scale})`);

  // Standard cell: W=60 wide x H=40 tall. Output at (outX, H/2). Inputs at y=8 and y=32 (binary)
  // or y=20 (unary). Body shape and output X depend on type.
  const W = 60, H = 40;
  const inATop = type === "NOT" || type === "BUF" ? H / 2 : 8;
  const inBBot = type === "NOT" || type === "BUF" ? H / 2 : H - 8;

  // Helper: x position of the OR/XOR inner curve at a given y (quadratic back curve).
  // Back curve: (0,0) Q(W*0.35, H/2) (0,H).  y(t) = H·t  →  t = y/H.
  // x(t) = 2(1-t)·t · W*0.35.
  function orCurveXat(yy) {
    const t = yy / H;
    return 2 * (1 - t) * t * W * 0.35;
  }

  let bodyPath = null;
  let outX = W;
  let leadStartX = 0; // unit-X where the external wire is expected to terminate (= reported inA.x/inB.x in unit coords)

  if (type === "AND" || type === "NAND") {
    // D-shape spanning the full width: rectangle 0..(W-H/2), semicircle to (W, H/2).
    const flat = W - H / 2; // 40
    bodyPath = `M0 0 H${flat} A${H / 2} ${H / 2} 0 0 1 ${flat} ${H} H0 Z`;
    outX = W;
    leadStartX = 0;
  } else if (type === "OR" || type === "NOR") {
    // Curved back, pointed right at (W, H/2).
    bodyPath = `M0 0 Q${W * 0.35} ${H / 2} 0 ${H} Q${W * 0.4} ${H} ${W} ${H / 2} Q${W * 0.4} 0 0 0 Z`;
    outX = W;
    leadStartX = 0;
  } else if (type === "XOR" || type === "XNOR") {
    // OR shape + extra back arc.  Input wires conventionally enter just outside the outer arc.
    bodyPath = `M0 0 Q${W * 0.35} ${H / 2} 0 ${H} Q${W * 0.4} ${H} ${W} ${H / 2} Q${W * 0.4} 0 0 0 Z`;
    outX = W;
    leadStartX = -8;
  } else if (type === "NOT" || type === "BUF") {
    // Triangle 0..(W-8), tip at (W-8, H/2).
    bodyPath = `M0 0 L${W - 8} ${H / 2} L0 ${H} Z`;
    outX = W - 8;
    leadStartX = 0;
  }

  const body = document.createElementNS(SVG_NS, "path");
  body.setAttribute("d", bodyPath);
  body.setAttribute("fill", fill);
  body.setAttribute("stroke", stroke);
  body.setAttribute("stroke-width", strokeWidth);
  body.setAttribute("stroke-linejoin", "round");
  g.appendChild(body);

  // XOR/XNOR: extra back arc behind the OR shape.
  if (type === "XOR" || type === "XNOR") {
    const arc = document.createElementNS(SVG_NS, "path");
    arc.setAttribute("d", `M-6 0 Q${W * 0.3} ${H / 2} -6 ${H}`);
    arc.setAttribute("fill", "none");
    arc.setAttribute("stroke", stroke);
    arc.setAttribute("stroke-width", strokeWidth);
    g.appendChild(arc);
  }

  // Internal input leads (stubs) — make the wire visually reach the body for curved-back gates.
  // AND/NAND/NOT need none because their left edge is straight at x=0.
  if (type === "OR" || type === "NOR" || type === "XOR" || type === "XNOR") {
    const xa = orCurveXat(inATop);
    const xb = orCurveXat(inBBot);
    appendLeadLine(g, leadStartX, inATop, xa, inATop, stroke, strokeWidth);
    appendLeadLine(g, leadStartX, inBBot, xb, inBBot, stroke, strokeWidth);
  }

  // Negation bubble for NAND/NOR/XNOR/NOT.
  const negated = type === "NAND" || type === "NOR" || type === "XNOR" || type === "NOT";
  if (negated) {
    const bub = document.createElementNS(SVG_NS, "circle");
    bub.setAttribute("cx", outX + 4);
    bub.setAttribute("cy", H / 2);
    bub.setAttribute("r", 4);
    bub.setAttribute("fill", fill);
    bub.setAttribute("stroke", stroke);
    bub.setAttribute("stroke-width", strokeWidth);
    g.appendChild(bub);
    outX = outX + 8;
  }

  svg.appendChild(g);

  return {
    body: g,
    inA: { x: x + leadStartX * scale, y: y + inATop * scale },
    inB: { x: x + leadStartX * scale, y: y + inBBot * scale },
    out: { x: x + outX * scale, y: y + (H / 2) * scale },
    width: (outX - leadStartX) * scale,
    height: H * scale,
  };
}

function appendLeadLine(g, x1, y1, x2, y2, stroke, strokeWidth) {
  const l = document.createElementNS(SVG_NS, "line");
  l.setAttribute("x1", x1); l.setAttribute("y1", y1);
  l.setAttribute("x2", x2); l.setAttribute("y2", y2);
  l.setAttribute("stroke", stroke);
  l.setAttribute("stroke-width", strokeWidth);
  l.setAttribute("stroke-linecap", "round");
  g.appendChild(l);
}

// Build a point list for an L-shaped wire route that bends near the source —
// vertical at the source's x first, then horizontal at the destination's y.
// This keeps the vertical segment away from gate bodies (which sit at destination.x).
export function routeL(from, to) {
  if (from.y === to.y) return [from, to];
  return [from, { x: from.x, y: to.y }, to];
}

// Build a point list that bends near the destination — useful when the destination
// is in free space but the source sits at a gate output.
export function routeLDest(from, to) {
  if (from.y === to.y) return [from, to];
  return [from, { x: to.x, y: from.y }, to];
}

// Draw a wire (polyline) between two points; optionally colored by logic value.
export function drawWire(svg, points, value, opts = {}) {
  const color =
    value === 1
      ? opts.colorOn || COLORS.peachDeep
      : value === 0
        ? opts.colorOff || COLORS.skyDeep
        : opts.colorIdle || COLORS.text3;
  const w = document.createElementNS(SVG_NS, "polyline");
  w.setAttribute(
    "points",
    points.map((p) => `${p.x},${p.y}`).join(" "),
  );
  w.setAttribute("fill", "none");
  w.setAttribute("stroke", color);
  w.setAttribute("stroke-width", opts.width || 2.5);
  w.setAttribute("stroke-linecap", "round");
  w.setAttribute("stroke-linejoin", "round");
  svg.appendChild(w);
  return w;
}

// Draw a labeled port circle (input/output endpoint) at (x,y).
export function drawPort(svg, x, y, label, value, opts = {}) {
  const r = opts.r || 9;
  const c = document.createElementNS(SVG_NS, "circle");
  c.setAttribute("cx", x);
  c.setAttribute("cy", y);
  c.setAttribute("r", r);
  c.setAttribute("fill", value === 1 ? COLORS.peachDeep : COLORS.skyDeep);
  c.setAttribute("stroke", COLORS.text);
  c.setAttribute("stroke-width", 1.5);
  svg.appendChild(c);
  const t = document.createElementNS(SVG_NS, "text");
  t.setAttribute("x", x);
  t.setAttribute("y", y + 3);
  t.setAttribute("font-size", "11");
  t.setAttribute("font-family", "Inter");
  t.setAttribute("fill", COLORS.surface);
  t.setAttribute("text-anchor", "middle");
  t.setAttribute("font-weight", "700");
  t.style.pointerEvents = "none";
  t.textContent = String(value);
  svg.appendChild(t);
  if (label) {
    const lab = document.createElementNS(SVG_NS, "text");
    lab.setAttribute("x", x);
    lab.setAttribute("y", y - r - 4);
    lab.setAttribute("font-size", "12");
    lab.setAttribute("font-family", "Inter");
    lab.setAttribute("fill", COLORS.text2);
    lab.setAttribute("text-anchor", "middle");
    lab.style.pointerEvents = "none";
    lab.textContent = label;
    svg.appendChild(lab);
  }
  return c;
}

// ---- Reusable widgets (used by multiple Chapter 2 lessons) -----------------

// Interactive playground: click ports A/B to toggle, see Y update in real time.
export function gatePlayground(type) {
  const isUnary = type === "NOT" || type === "BUF";
  const card = el("div", { class: "card" });
  card.appendChild(
    el("div", { class: "small text-2", style: { textAlign: "center", marginBottom: "8px" }, text: "Bấm vào ngõ vào để đổi 0 ↔ 1" }),
  );

  const W = 320, H = 160;
  const svg = document.createElementNS(SVG_NS, "svg");
  svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
  svg.style.width = "100%";
  svg.style.maxHeight = "200px";

  const state = { a: 0, b: 0 };

  function rerender() {
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    const out = computeGate(type, state.a, state.b);

    const gateX = 150, gateY = 60;
    const gate = drawGate(svg, type, gateX, gateY, { scale: 1.3 });

    // Choose port positions that align horizontally with the gate inputs so wires are perfectly straight.
    const aPortY = gate.inA.y;
    const bPortY = isUnary ? null : gate.inB.y;
    const portX = 60;
    const outPortX = 290;

    if (isUnary) {
      drawWire(svg, [{ x: portX, y: aPortY }, { x: gate.inA.x, y: gate.inA.y }], state.a);
    } else {
      drawWire(svg, [{ x: portX, y: aPortY }, { x: gate.inA.x, y: gate.inA.y }], state.a);
      drawWire(svg, [{ x: portX, y: bPortY }, { x: gate.inB.x, y: gate.inB.y }], state.b);
    }
    drawWire(svg, [{ x: gate.out.x, y: gate.out.y }, { x: outPortX, y: gate.out.y }], out);

    if (isUnary) {
      const aPort = drawPort(svg, portX, aPortY, "A", state.a);
      aPort.style.cursor = "pointer";
      aPort.addEventListener("click", () => { state.a ^= 1; rerender(); });
    } else {
      const aPort = drawPort(svg, portX, aPortY, "A", state.a);
      const bPort = drawPort(svg, portX, bPortY, "B", state.b);
      aPort.style.cursor = "pointer";
      bPort.style.cursor = "pointer";
      aPort.addEventListener("click", () => { state.a ^= 1; rerender(); });
      bPort.addEventListener("click", () => { state.b ^= 1; rerender(); });
    }
    drawPort(svg, outPortX, gate.out.y, "Y", out);
  }

  card.appendChild(svg);
  rerender();
  return card;
}

// Soft card showing gate name, Boolean expression, and short description.
export function gateInfoCard(type, color = "mint") {
  const info = gateInfo(type);
  return el("div", { class: `card card-soft-${color}` }, [
    el("h3", { text: info.name, style: { marginTop: 0 } }),
    el("div", { class: "mono", style: { fontSize: "18px", marginBottom: "8px" }, html: info.expr }),
    el("p", { html: info.desc }),
  ]);
}

// Truth table for a single gate. Output column highlighted.
export function truthTableCard(type) {
  const rows = type === "NOT" || type === "BUF"
    ? [[0, computeGate(type, 0)], [1, computeGate(type, 1)]]
    : [
        [0, 0, computeGate(type, 0, 0)],
        [0, 1, computeGate(type, 0, 1)],
        [1, 0, computeGate(type, 1, 0)],
        [1, 1, computeGate(type, 1, 1)],
      ];

  const head = type === "NOT" || type === "BUF"
    ? el("tr", {}, [el("th", { text: "A" }), el("th", { text: "Y" })])
    : el("tr", {}, [el("th", { text: "A" }), el("th", { text: "B" }), el("th", { text: "Y" })]);

  return el("div", { class: "card", style: { marginTop: "12px" } }, [
    el("div", { class: "small text-2", style: { marginBottom: "6px" }, text: `Bảng chân trị – ${gateInfo(type).name}` }),
    el("table", { class: "tbl tbl-bordered", style: { width: "auto", margin: "0 auto" } }, [
      el("thead", {}, [head]),
      el("tbody", {}, rows.map((r) => el("tr", {}, r.map((v, i) => {
        const isOut = i === r.length - 1;
        return el("td", {
          class: "mono",
          style: {
            textAlign: "center",
            background: isOut ? (v === 1 ? COLORS.logic1Bg : COLORS.logic0Bg) : "transparent",
            fontWeight: isOut ? "700" : "400",
          },
          text: String(v),
        });
      })))),
    ]),
  ]);
}
