// Central lesson registry. Add new lessons by importing and pushing here.
import lesson01 from "./lessons/01-analog-vs-digital.js";
import lesson02 from "./lessons/02-mixed-systems.js";
import lesson03 from "./lessons/03-binary-numbers.js";
import lesson04 from "./lessons/04-logic-levels.js";
import lesson05 from "./lessons/05-digital-waveforms.js";
import lesson06 from "./lessons/06-decimal.js";
import lesson07 from "./lessons/07-binary-system.js";
import lesson08 from "./lessons/08-hexadecimal.js";
import lesson09 from "./lessons/09-base-conversion.js";
import lesson10 from "./lessons/10-bcd.js";
import lesson11 from "./lessons/11-gray-code.js";
import lesson12 from "./lessons/12-ascii.js";

export const lessons = [
  lesson01,
  lesson02,
  lesson03,
  lesson04,
  lesson05,
  lesson06,
  lesson07,
  lesson08,
  lesson09,
  lesson10,
  lesson11,
  lesson12,
];

export function getLesson(id) {
  return lessons.find((l) => l.id === id) || null;
}

export function getNextLesson(id) {
  const i = lessons.findIndex((l) => l.id === id);
  return i >= 0 && i < lessons.length - 1 ? lessons[i + 1] : null;
}

export function getPrevLesson(id) {
  const i = lessons.findIndex((l) => l.id === id);
  return i > 0 ? lessons[i - 1] : null;
}

export const lessonIds = lessons.map((l) => l.id);
