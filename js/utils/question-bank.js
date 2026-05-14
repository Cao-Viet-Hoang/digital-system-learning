// Generates random questions per topic for practice / exam.
import { toBinary, toHex, decToBcd, binToGray, decToGray, randInt, shuffle } from "./conversions.js";

export const topics = [
  { id: "binary", label: "Số nhị phân", lesson: "binary-numbers" },
  { id: "logic", label: "Mức logic", lesson: "logic-levels" },
  { id: "waveform", label: "Dạng sóng số", lesson: "digital-waveforms" },
  { id: "decimal", label: "Hệ thập phân", lesson: "decimal" },
  { id: "hex", label: "Thập lục phân", lesson: "hexadecimal" },
  { id: "d2b", label: "Thập phân → Nhị phân", lesson: "base-conversion" },
  { id: "b2d", label: "Nhị phân → Thập phân", lesson: "base-conversion" },
  { id: "d2h", label: "Thập phân → Hex", lesson: "base-conversion" },
  { id: "h2d", label: "Hex → Thập phân", lesson: "base-conversion" },
  { id: "b2h", label: "Nhị phân → Hex", lesson: "base-conversion" },
  { id: "bcd", label: "Mã hóa BCD", lesson: "bcd" },
  { id: "gray", label: "Mã Gray", lesson: "gray-code" },
  { id: "ascii", label: "ASCII", lesson: "ascii" },
];

export function generateQuestion(topicId, difficulty = "normal") {
  const gen = generators[topicId];
  if (!gen) return null;
  return gen(difficulty);
}

const generators = {
  binary(d) {
    const n = randVal(d, 4);
    const bin = toBinary(n, 8);
    const opts = uniqueAround(n, 3, 0, 255);
    return makeMc(
      `Giá trị thập phân của <span class='mono'>${bin}</span> là bao nhiêu?`,
      opts,
      n,
      `Cộng các giá trị vị trí (1, 2, 4, 8, 16, 32, 64, 128) cho mỗi bit bằng 1.`,
      `<span class='mono'>${bin}</span> = ${n}.`,
      { topic: "binary" },
    );
  },
  logic(d) {
    const v = Math.round(Math.random() * 50) / 10;
    const answer = v <= 0.8 ? "Logic 0" : v >= 2.0 ? "Logic 1" : "Không xác định";
    const options = ["Logic 0", "Logic 1", "Không xác định"];
    return makeMc(
      `Trên hệ thống 5 V, đầu vào <strong>${v.toFixed(1)} V</strong> được đọc là:`,
      options,
      answer,
      "Logic 0: ≤ 0,8 V; Logic 1: ≥ 2,0 V; mọi giá trị khác là không xác định.",
      `${v.toFixed(1)} V → ${answer}.`,
      { topic: "logic" },
    );
  },
  waveform(d) {
    const bits = Array.from({ length: 4 }, () => (Math.random() < 0.5 ? 0 : 1));
    const trace = bits.map((b) => (b ? "high" : "low")).join(", ");
    const ans = bits.join("");
    const wrong = [];
    while (wrong.length < 3) {
      const cand = Array.from({ length: 4 }, () => (Math.random() < 0.5 ? 0 : 1)).join("");
      if (cand !== ans && !wrong.includes(cand)) wrong.push(cand);
    }
    return makeMc(
      `Dạng sóng đi <em>${trace}</em>. Đó là chuỗi bit nào (MSB đầu tiên)?`,
      [ans, ...wrong].map((b) => `<span class='mono'>${b}</span>`),
      `<span class='mono'>${ans}</span>`,
      "cao → 1, thấp → 0, theo thứ tự dạng sóng hiển thị.",
      `<span class='mono'>${ans}</span>.`,
      { topic: "waveform" },
    );
  },
  decimal(d) {
    const digits = randInt(3, 4);
    let n = "";
    for (let i = 0; i < digits; i++) n += randInt(i === 0 ? 1 : 0, 9);
    const pos = randInt(0, digits - 1);
    const digit = parseInt(n[digits - 1 - pos], 10);
    const place = Math.pow(10, pos);
    return makeMc(
      `Trong số thập phân <strong>${n}</strong>, <em>giá trị vị trí</em> của chữ số <strong>${digit}</strong> tại vị trí ${pos} (từ phải) là bao nhiêu?`,
      [place, place * 10, place / 10 || 1, place * 100].map(String),
      String(place),
      "Giá trị vị trí = 10^vị_trí, đếm từ phải bắt đầu từ 0.",
      `Vị trí ${pos} → 10^${pos} = ${place}.`,
      { topic: "decimal" },
    );
  },
  hex(d) {
    const n = randVal(d, 5);
    const hex = toHex(n);
    const opts = uniqueAround(n, 3, 0, 255);
    return makeMc(
      `Chuyển hex <span class='mono'>${hex}</span> sang thập phân.`,
      opts,
      n,
      "Mỗi chữ số hex nhân với một lũy thừa của 16.",
      `<span class='mono'>${hex}</span> = ${n}.`,
      { topic: "hex" },
    );
  },
  d2b(d) {
    const n = randVal(d, 4);
    const bin = toBinary(n);
    const wrong = uniqueBinAround(bin, 3);
    return makeMc(
      `Chuyển số thập phân <strong>${n}</strong> sang nhị phân.`,
      [bin, ...wrong].map((b) => `<span class='mono'>${b}</span>`),
      `<span class='mono'>${bin}</span>`,
      "Chia liên tiếp cho 2; đọc phần dư từ dưới lên.",
      `${n} = <span class='mono'>${bin}</span>.`,
      { topic: "d2b" },
    );
  },
  b2d(d) {
    const n = randVal(d, 4);
    const bin = toBinary(n);
    const opts = uniqueAround(n, 3, 0, 255);
    return makeMc(
      `Chuyển nhị phân <span class='mono'>${bin}</span> sang thập phân.`,
      opts,
      n,
      "Cộng trọng số của các bit bằng 1.",
      `<span class='mono'>${bin}</span> = ${n}.`,
      { topic: "b2d" },
    );
  },
  d2h(d) {
    const n = randVal(d, 5);
    const hex = toHex(n);
    const wrong = uniqueHexAround(hex, 3);
    return makeMc(
      `Chuyển số thập phân <strong>${n}</strong> sang hex.`,
      [hex, ...wrong].map((h) => `<span class='mono'>${h}</span>`),
      `<span class='mono'>${hex}</span>`,
      "Chia liên tiếp cho 16.",
      `${n} = <span class='mono'>${hex}</span>.`,
      { topic: "d2h" },
    );
  },
  h2d(d) {
    return this.hex(d);
  },
  b2h(d) {
    const n = randVal(d, 5);
    const bin = toBinary(n, 8);
    const hex = toHex(n, 2);
    const wrong = uniqueHexAround(hex, 3);
    return makeMc(
      `Chuyển nhị phân <span class='mono'>${bin}</span> sang hex.`,
      [hex, ...wrong].map((h) => `<span class='mono'>${h}</span>`),
      `<span class='mono'>${hex}</span>`,
      "Nhóm bit thành nhóm 4 từ phải sang.",
      `<span class='mono'>${bin}</span> = <span class='mono'>${hex}</span>.`,
      { topic: "b2h" },
    );
  },
  bcd(d) {
    const n = randInt(10, 99);
    const bcd = decToBcd(n)
      .map((g) => g.bits)
      .join(" ");
    const plainBin = toBinary(n, 8);
    const wrongs = [
      plainBin.padStart(8, "0").replace(/(....)(....)/, "$1 $2"),
      decToBcd(n + 10).map((g) => g.bits).join(" "),
      decToBcd(n - 1 < 10 ? n + 1 : n - 1).map((g) => g.bits).join(" "),
    ];
    return makeMc(
      `Mã hóa số thập phân <strong>${n}</strong> sang BCD.`,
      [bcd, ...wrongs].map((s) => `<span class='mono'>${s}</span>`),
      `<span class='mono'>${bcd}</span>`,
      "Mã hóa từng chữ số thành nhóm 4-bit riêng.",
      `${n} → BCD <span class='mono'>${bcd}</span>.`,
      { topic: "bcd" },
    );
  },
  gray(d) {
    const n = randInt(1, 15);
    const bin = toBinary(n, 4);
    const gray = decToGray(n, 4);
    const wrongs = uniqueBinAround(gray, 3).filter((w) => w !== gray);
    return makeMc(
      `Mã Gray của nhị phân <span class='mono'>${bin}</span> là gì?`,
      [gray, ...wrongs.slice(0, 3)].map((g) => `<span class='mono'>${g}</span>`),
      `<span class='mono'>${gray}</span>`,
      "G[0] = B[0]; G[i] = B[i-1] XOR B[i].",
      `<span class='mono'>${bin}</span> → Gray <span class='mono'>${gray}</span>.`,
      { topic: "gray" },
    );
  },
  ascii(d) {
    const ch = String.fromCharCode(randInt(33, 126));
    const code = ch.charCodeAt(0);
    const opts = uniqueAround(code, 3, 32, 127);
    return makeMc(
      `Mã ASCII (thập phân) của ký tự <strong>'${ch}'</strong> là bao nhiêu?`,
      opts,
      code,
      "Phạm vi thường gặp: chữ số 48..57, chữ hoa 65..90, chữ thường 97..122.",
      `'${ch}' = ${code}.`,
      { topic: "ascii" },
    );
  },
};

function randVal(diff, defaultMaxBits) {
  if (diff === "easy") return randInt(0, 15);
  if (diff === "hard") return randInt(0, 255);
  return randInt(0, Math.pow(2, defaultMaxBits) - 1);
}

function uniqueAround(n, count, min, max) {
  const set = new Set([n]);
  const arr = [];
  while (set.size < count + 1) {
    const cand = n + (Math.random() < 0.5 ? -1 : 1) * randInt(1, Math.max(3, Math.floor(n * 0.3) + 2));
    if (cand >= min && cand <= max) set.add(cand);
  }
  set.forEach((v) => arr.push(String(v)));
  return shuffle(arr);
}

function uniqueBinAround(bin, count) {
  const out = new Set([bin]);
  const len = bin.length;
  while (out.size < count + 1) {
    const arr = bin.split("");
    const flips = randInt(1, 2);
    for (let i = 0; i < flips; i++) {
      const p = randInt(0, len - 1);
      arr[p] = arr[p] === "1" ? "0" : "1";
    }
    out.add(arr.join(""));
  }
  out.delete(bin);
  return Array.from(out);
}

function uniqueHexAround(hex, count) {
  const out = new Set([hex]);
  while (out.size < count + 1) {
    const v = parseInt(hex, 16) + (Math.random() < 0.5 ? -1 : 1) * randInt(1, 32);
    if (v >= 0 && v <= 255) out.add(toHex(v));
  }
  out.delete(hex);
  return Array.from(out);
}

function makeMc(prompt, options, correctValue, hint, explanation, meta = {}) {
  const stringOpts = options.map(String);
  let answer = stringOpts.findIndex((o) => o === String(correctValue));
  // If correct value embedded in HTML mono, compare differently — fall back to first occurrence.
  if (answer < 0) answer = stringOpts.findIndex((o) => o.includes(String(correctValue)));
  return {
    prompt,
    options: stringOpts.map((label) => ({ label })),
    answer,
    hint,
    explanation,
    ...meta,
  };
}
