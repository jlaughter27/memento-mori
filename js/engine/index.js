// engine/index.js — public engine API used by the views.
import { makeRng, pick } from './rng.js';
import { generateProblem, TYPES } from './problemTypes.js';
import { wordbank } from '../curriculum/index.js';

const rng = makeRng(0); // reseeds itself from Math.random on first use

export { TYPES };

// Generate the next practice problem for a given skill object.
export function nextProblem(skill) {
  const pr = skill.practice || { type: 'add', params: {} };
  if (pr.type === 'wordProblem') {
    return wordProblem({ skill: (pr.params && pr.params.skill) || 'add', grade: skill.grade });
  }
  const p = generateProblem(pr.type, pr.params || {}, rng);
  // optionally attach a word problem hint context for variety on some skills
  return p;
}

/* ---------- word problems from the bank ---------- */
const fill = (str, vars) =>
  String(str).replace(/\{(\w+)\}/g, (_, k) => (vars[k] !== undefined ? vars[k] : `{${k}}`));

function safeEval(expr, vars) {
  if (!/^[-+*/(). \dabc]+$/.test(expr)) return NaN;
  try {
    // eslint-disable-next-line no-new-func
    return Function('a', 'b', 'c', `"use strict";return (${expr});`)(vars.a || 0, vars.b || 0, vars.c || 0);
  } catch (e) {
    return NaN;
  }
}

export function wordProblem({ skill = 'add', grade = null, theme = null } = {}) {
  let pool = wordbank.problems.filter((p) => p.skill === skill);
  if (grade) {
    const g = pool.filter((p) => Math.abs((p.grade || grade) - grade) <= 1);
    if (g.length) pool = g;
  }
  if (theme) {
    const t = pool.filter((p) => p.theme === theme);
    if (t.length) pool = t;
  }
  if (!pool.length) pool = wordbank.problems;
  const def = pool[Math.floor(rng() * pool.length)];
  return buildWordProblem(def);
}

function buildWordProblem(def) {
  let vars = {};
  let answer;
  // hand-authored fixed form
  if (def.numbers && def.answer !== undefined) {
    vars = { ...def.numbers };
    answer = def.answer;
  } else {
    // template form: pick vars, compute answer, prefer integer answers
    const ranges = def.vars || {};
    let best = null;
    for (let tries = 0; tries < 40; tries++) {
      const v = {};
      for (const k in ranges) {
        const [lo, hi] = ranges[k];
        v[k] = lo + Math.floor(rng() * (hi - lo + 1));
      }
      const a = safeEval(def.answerExpr || '0', v);
      if (!Number.isFinite(a)) continue;
      if (best === null) best = { v, a };
      if (Number.isInteger(a) && a >= 0) { best = { v, a }; break; }
    }
    vars = best ? best.v : {};
    answer = best ? best.a : 0;
    if (!Number.isInteger(answer)) answer = Math.round(answer * 100) / 100;
  }
  vars.answer = answer;
  const prompt = fill(def.template || def.prompt || 'Solve:', vars);
  const steps = (def.steps || ['Read carefully and decide which operation to use.', `The answer is ${answer}.`])
    .map((s) => ({ text: fill(s, vars) }));
  const isDecimal = !Number.isInteger(answer);
  return {
    type: 'wordProblem',
    subSkill: def.skill,
    prompt,
    answer: String(answer),
    steps,
    hints: [
      'Read it twice. What is it ASKING for?',
      'Draw a quick picture or underline the important numbers.',
      `Which operation fits — join (+), take away (−), groups (×), or share (÷)?`,
    ],
    visual: null,
    inputKind: isDecimal ? 'number' : 'number',
    check: (raw) => {
      const v = Number(String(raw).trim().replace(/[$,\s]/g, ''));
      return Number.isFinite(v) && Math.abs(v - answer) < 1e-6;
    },
  };
}

// quick quiz: mix problems across an array of skills
export function quizSet(skills, n = 5) {
  const out = [];
  for (let i = 0; i < n; i++) {
    const sk = skills[Math.floor(rng() * skills.length)];
    out.push(nextProblem(sk));
  }
  return out;
}
