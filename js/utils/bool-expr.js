// Boolean expression parser + evaluator.
// Turns a textual Boolean expression into an Abstract Syntax Tree (AST), then
// evaluates it for a given variable assignment. Used by the equivalence-checker
// tool, but kept general so other lessons could reuse it.
//
// Supported notation (case-insensitive variables A..Z):
//   NOT : prefix  !A   ~A   ¬A        postfix  A'
//   AND : A*B  A.B  A·B  A&B  AB (juxtaposition / implicit AND)
//   XOR : A^B  A⊕B
//   OR  : A+B  A|B
//   Constants: 0 (always false), 1 (always true)
//   Parentheses: ( ... )
//
// Precedence, lowest → highest:  OR  <  XOR  <  AND  <  NOT/postfix-'
// When in doubt, students should add parentheses.

// ---- Tokenizer -------------------------------------------------------------

const AND_CHARS = new Set(["*", ".", "·", "&", "∧"]);
const OR_CHARS = new Set(["+", "|", "∨"]);
const XOR_CHARS = new Set(["^", "⊕"]);
const NOT_CHARS = new Set(["!", "~", "¬"]);

function tokenize(input) {
  const tokens = [];
  for (let i = 0; i < input.length; i++) {
    const ch = input[i];
    if (ch === " " || ch === "\t" || ch === "\n") continue;
    if (/[A-Za-z]/.test(ch)) {
      tokens.push({ type: "var", value: ch.toUpperCase() });
    } else if (ch === "0" || ch === "1") {
      tokens.push({ type: "const", value: Number(ch) });
    } else if (ch === "(") {
      tokens.push({ type: "lparen" });
    } else if (ch === ")") {
      tokens.push({ type: "rparen" });
    } else if (ch === "'") {
      tokens.push({ type: "post-not" });
    } else if (AND_CHARS.has(ch)) {
      tokens.push({ type: "and" });
    } else if (OR_CHARS.has(ch)) {
      tokens.push({ type: "or" });
    } else if (XOR_CHARS.has(ch)) {
      tokens.push({ type: "xor" });
    } else if (NOT_CHARS.has(ch)) {
      tokens.push({ type: "pre-not" });
    } else {
      throw new ParseError(`Ký tự không hợp lệ: “${ch}”`);
    }
  }
  return tokens;
}

export class ParseError extends Error {}

// ---- Parser (recursive descent) -------------------------------------------
// AST node shapes:
//   { op: "var",  name: "A" }
//   { op: "const", value: 0|1 }
//   { op: "not", a }
//   { op: "and"|"or"|"xor", a, b }

function parse(input) {
  const tokens = tokenize(input);
  let pos = 0;

  const peek = () => tokens[pos];
  const next = () => tokens[pos++];

  // A token that can begin a new factor — needed to detect implicit AND (AB).
  function canStartFactor(tok) {
    return (
      tok &&
      (tok.type === "var" ||
        tok.type === "const" ||
        tok.type === "lparen" ||
        tok.type === "pre-not")
    );
  }

  function parseOr() {
    let node = parseXor();
    while (peek() && peek().type === "or") {
      next();
      node = { op: "or", a: node, b: parseXor() };
    }
    return node;
  }

  function parseXor() {
    let node = parseAnd();
    while (peek() && peek().type === "xor") {
      next();
      node = { op: "xor", a: node, b: parseAnd() };
    }
    return node;
  }

  function parseAnd() {
    let node = parseNot();
    while (peek()) {
      const tok = peek();
      if (tok.type === "and") {
        next(); // explicit AND operator
        node = { op: "and", a: node, b: parseNot() };
      } else if (canStartFactor(tok)) {
        // Implicit AND, e.g. "AB" or "A(B+C)".
        node = { op: "and", a: node, b: parseNot() };
      } else {
        break;
      }
    }
    return node;
  }

  function parseNot() {
    if (peek() && peek().type === "pre-not") {
      next();
      return { op: "not", a: parseNot() };
    }
    return parsePostfix();
  }

  function parsePostfix() {
    let node = parsePrimary();
    while (peek() && peek().type === "post-not") {
      next();
      node = { op: "not", a: node };
    }
    return node;
  }

  function parsePrimary() {
    const tok = peek();
    if (!tok) throw new ParseError("Thiếu toán hạng ở cuối biểu thức.");
    if (tok.type === "var") {
      next();
      return { op: "var", name: tok.value };
    }
    if (tok.type === "const") {
      next();
      return { op: "const", value: tok.value };
    }
    if (tok.type === "lparen") {
      next();
      const node = parseOr();
      if (!peek() || peek().type !== "rparen") {
        throw new ParseError("Thiếu dấu đóng ngoặc “)”.");
      }
      next();
      return node;
    }
    if (tok.type === "rparen") throw new ParseError("Thừa dấu đóng ngoặc “)”.");
    if (tok.type === "and" || tok.type === "or" || tok.type === "xor") {
      throw new ParseError("Toán tử đứng ở vị trí không hợp lệ (thiếu toán hạng).");
    }
    if (tok.type === "post-not") throw new ParseError("Dấu “'” đứng ở vị trí không hợp lệ.");
    throw new ParseError("Biểu thức không hợp lệ.");
  }

  if (tokens.length === 0) throw new ParseError("Biểu thức trống.");
  const ast = parseOr();
  if (pos < tokens.length) {
    throw new ParseError("Có phần thừa sau biểu thức — kiểm tra lại dấu ngoặc/toán tử.");
  }
  return ast;
}

// ---- Variable collection & evaluation -------------------------------------

function collectVars(ast, set) {
  if (ast.op === "var") set.add(ast.name);
  else if (ast.op === "not") collectVars(ast.a, set);
  else if (ast.op === "and" || ast.op === "or" || ast.op === "xor") {
    collectVars(ast.a, set);
    collectVars(ast.b, set);
  }
  return set;
}

function evalAst(ast, env) {
  switch (ast.op) {
    case "const":
      return ast.value;
    case "var":
      return env[ast.name] ? 1 : 0;
    case "not":
      return evalAst(ast.a, env) ? 0 : 1;
    case "and":
      return evalAst(ast.a, env) & evalAst(ast.b, env);
    case "or":
      return evalAst(ast.a, env) | evalAst(ast.b, env);
    case "xor":
      return evalAst(ast.a, env) ^ evalAst(ast.b, env);
    default:
      throw new ParseError("Nút AST không xác định.");
  }
}

// Public: compile an expression string into a reusable object.
// Returns { ast, vars: Set<string>, eval(env) }. Throws ParseError on bad input.
export function compile(input) {
  const ast = parse(input);
  const vars = collectVars(ast, new Set());
  return {
    ast,
    vars,
    eval: (env) => evalAst(ast, env),
  };
}

// ---- Equivalence checking --------------------------------------------------
// Compares two expression strings by building a shared truth table over the
// UNION of their variables. Returns a rich result object so the UI can render
// the table, the verdict, and a counterexample.
//
// Result shape:
// {
//   ok: true,
//   vars: ["A","B",...],              // sorted union of variables
//   rows: [{ bits:[0,1,..], out1, out2, match }],
//   equivalent: bool,
//   firstDiff: row | null,            // first row where they differ
//   minterms1: number[], minterms2,   // canonical SOP minterm indices
//   onlyIn1: number[], onlyIn2,       // minterms where they disagree
// }
// On parse error: { ok:false, which:1|2, message }
export function checkEquivalence(exprA, exprB) {
  let cA, cB;
  try {
    cA = compile(exprA);
  } catch (e) {
    return { ok: false, which: 1, message: e.message };
  }
  try {
    cB = compile(exprB);
  } catch (e) {
    return { ok: false, which: 2, message: e.message };
  }

  const vars = [...new Set([...cA.vars, ...cB.vars])].sort();
  const n = vars.length;
  const total = 1 << n;

  const rows = [];
  const minterms1 = [];
  const minterms2 = [];
  const onlyIn1 = [];
  const onlyIn2 = [];
  let equivalent = true;
  let firstDiff = null;

  for (let i = 0; i < total; i++) {
    const env = {};
    const bits = [];
    for (let v = 0; v < n; v++) {
      // First variable = most significant bit, so rows read like binary counting.
      const bit = (i >> (n - 1 - v)) & 1;
      bits.push(bit);
      env[vars[v]] = bit;
    }
    const out1 = cA.eval(env);
    const out2 = cB.eval(env);
    if (out1) minterms1.push(i);
    if (out2) minterms2.push(i);
    const match = out1 === out2;
    if (!match) {
      equivalent = false;
      if (!firstDiff) firstDiff = { bits, out1, out2, index: i };
      if (out1 && !out2) onlyIn1.push(i);
      if (out2 && !out1) onlyIn2.push(i);
    }
    rows.push({ bits, out1, out2, match, index: i });
  }

  return {
    ok: true,
    vars,
    rows,
    equivalent,
    firstDiff,
    minterms1,
    minterms2,
    onlyIn1,
    onlyIn2,
  };
}
