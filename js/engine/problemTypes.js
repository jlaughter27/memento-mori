// engine/problemTypes.js
// The teaching brain. Each type can: generate a problem, produce a full
// step-by-step worked solution, and a ladder of progressive hints.
//
// make(params, rng) -> Problem
// Problem = {
//   type, prompt, answer (canonical display string),
//   steps: [{text}],         full worked solution (revealed on "Show me how")
//   hints: [string],          progressive nudges (revealed one at a time)
//   visual: descriptor|null,  optional manipulative for THIS problem
//   inputKind: 'number'|'fraction'|'choice'|'text',
//   choices: [..]|undefined,  for choice questions (<,>,=, yes/no, multiple choice)
//   check(raw) -> bool
// }
import { randInt, pick, shuffle } from './rng.js';

/* ---------- number helpers ---------- */
const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) { [a, b] = [b, a % b]; } return a || 1; };
const lcm = (a, b) => Math.abs(a * b) / gcd(a, b);
const grp = (n) => n.toLocaleString('en-US'); // 1,234 grouping for readability
const digitsOf = (n) => String(Math.abs(n)).split('').map(Number);
const placeNames = ['ones', 'tens', 'hundreds', 'thousands', 'ten thousands', 'hundred thousands', 'millions'];
const placeValAt = (i) => Math.pow(10, i);

function simplify(num, den) {
  const g = gcd(num, den);
  return [num / g, den / g];
}
function fracStr(num, den) {
  if (den === 1) return String(num);
  return `${num}/${den}`;
}
// mixed number nice display: 7/4 -> "1 3/4"
function mixedStr(num, den) {
  if (den === 1) return String(num);
  if (Math.abs(num) < den) return `${num}/${den}`;
  const whole = Math.trunc(num / den);
  const rem = Math.abs(num % den);
  if (rem === 0) return String(whole);
  return `${whole} ${rem}/${den}`;
}

/* ---------- answer checkers ---------- */
const parseNum = (raw) => {
  if (raw == null) return NaN;
  const s = String(raw).trim().replace(/,/g, '').replace(/\s+/g, '');
  if (s === '') return NaN;
  return Number(s);
};
const checkInt = (target) => (raw) => parseNum(raw) === target;
const checkDecimal = (target) => (raw) => {
  const v = parseNum(raw);
  return Number.isFinite(v) && Math.abs(v - target) < 1e-6;
};
const checkChoice = (target) => (raw) =>
  String(raw).trim().toLowerCase() === String(target).trim().toLowerCase();
// accept any fraction equal in value to num/den, OR the decimal, OR whole number
const checkFraction = (num, den) => (raw) => {
  const s = String(raw).trim().replace(/\s+/g, ' ');
  // mixed number "1 3/4"
  let m = s.match(/^(-?\d+)\s+(\d+)\/(\d+)$/);
  if (m) {
    const w = +m[1], a = +m[2], b = +m[3];
    if (!b) return false;
    const val = (Math.abs(w) * b + a) * Math.sign(w || 1);
    return val * den === num * b;
  }
  m = s.match(/^(-?\d+)\/(-?\d+)$/);
  if (m) {
    const a = +m[1], b = +m[2];
    if (!b) return false;
    return a * den === num * b;
  }
  const v = parseNum(s);
  if (Number.isFinite(v)) return Math.abs(v - num / den) < 1e-6;
  return false;
};
// set equality for lists like factors "1, 2, 3, 6"
const checkSet = (targetArr) => (raw) => {
  const got = String(raw).split(/[\s,]+/).map((x) => x.trim()).filter(Boolean).map(Number);
  if (got.some((x) => !Number.isFinite(x))) return false;
  const a = [...new Set(got)].sort((x, y) => x - y);
  const b = [...new Set(targetArr)].sort((x, y) => x - y);
  return a.length === b.length && a.every((v, i) => v === b[i]);
};

const P = (o) => ({ steps: [], hints: [], visual: null, inputKind: 'number', ...o });

/* =====================================================================
   ADDITION
===================================================================== */
function makeAdd(params = {}, rng) {
  const d = params.digits || 2;
  const terms = params.terms || 2;
  const regroup = params.regroup !== false;
  const lo = Math.pow(10, d - 1), hi = Math.pow(10, d) - 1;
  let nums;
  for (let tries = 0; tries < 60; tries++) {
    nums = Array.from({ length: terms }, () => randInt(rng, lo, hi));
    const carries = columnCarries(nums);
    if (regroup ? carries : !carries) break;
  }
  const total = nums.sum ? nums.sum : nums.reduce((a, b) => a + b, 0);
  const steps = additionSteps(nums, total);
  return P({
    type: 'add',
    prompt: `${nums.map(grp).join(' + ')} = ?`,
    answer: grp(total),
    steps,
    hints: [
      'Stack the numbers so the ones line up under the ones.',
      'Start at the RIGHT (the ones place) and add each column.',
      `If a column adds up to 10 or more, carry the extra to the next column. ${regroup ? 'This one needs carrying!' : ''}`,
    ],
    visual: terms === 2 && total <= 30 ? { type: 'numberLine', min: 0, max: roundUp(total), step: stepFor(total), mark: total } : null,
    check: checkInt(total),
  });
}
function columnCarries(nums) {
  const maxLen = Math.max(...nums.map((n) => String(n).length));
  let carry = 0;
  for (let i = 0; i < maxLen; i++) {
    let s = carry;
    for (const n of nums) s += digitAt(n, i);
    if (s >= 10) { carry = Math.floor(s / 10); return true; }
    carry = 0;
  }
  return false;
}
function digitAt(n, i) { return Math.floor(Math.abs(n) / Math.pow(10, i)) % 10; }
function additionSteps(nums, total) {
  const steps = [{ text: `Stack them up and line up the place values:\n  ${nums.map(grp).join('\n+ ')}` }];
  const maxLen = Math.max(...nums.map((n) => String(n).length));
  let carry = 0;
  for (let i = 0; i < maxLen; i++) {
    const ds = nums.map((n) => digitAt(n, i));
    const colSum = carry + ds.reduce((a, b) => a + b, 0);
    const write = colSum % 10;
    const newCarry = Math.floor(colSum / 10);
    let t = `${placeNames[i][0].toUpperCase() + placeNames[i].slice(1)}: ${ds.join(' + ')}${carry ? ' + ' + carry + ' (carried)' : ''} = ${colSum}.`;
    if (newCarry) t += ` Write ${write}, carry the ${newCarry}.`;
    else t += ` Write ${write}.`;
    steps.push({ text: t });
    carry = newCarry;
  }
  if (carry) steps.push({ text: `Bring down the carried ${carry} to the front.` });
  steps.push({ text: `The total is ${grp(total)}. 🎉` });
  return steps;
}
const roundUp = (n) => Math.ceil(n / 5) * 5;
const stepFor = (n) => (n <= 20 ? 1 : n <= 50 ? 5 : 10);

/* =====================================================================
   SUBTRACTION
===================================================================== */
function makeSub(params = {}, rng) {
  const d = params.digits || 2;
  const regroup = params.regroup !== false;
  const lo = Math.pow(10, d - 1), hi = Math.pow(10, d) - 1;
  let a, b;
  for (let tries = 0; tries < 80; tries++) {
    a = randInt(rng, lo, hi); b = randInt(rng, lo, a);
    if (a === b) continue;
    const borrows = needsBorrow(a, b);
    if (regroup ? borrows : !borrows) break;
  }
  const ans = a - b;
  return P({
    type: 'sub',
    prompt: `${grp(a)} − ${grp(b)} = ?`,
    answer: grp(ans),
    steps: subtractionSteps(a, b, ans),
    hints: [
      'Put the bigger number on top and line up the place values.',
      'Subtract each column starting from the RIGHT.',
      regroup
        ? 'When the top digit is smaller, BORROW 10 from the next column to the left.'
        : 'Each top digit is big enough — no borrowing needed here.',
    ],
    visual: a <= 30 ? { type: 'numberLine', min: 0, max: roundUp(a), step: stepFor(a), mark: ans } : null,
    check: checkInt(ans),
  });
}
function needsBorrow(a, b) {
  const len = String(a).length;
  for (let i = 0; i < len; i++) if (digitAt(a, i) < digitAt(b, i)) return true;
  return false;
}
function subtractionSteps(a, b, ans) {
  const steps = [{ text: `Stack with the bigger number on top:\n  ${grp(a)}\n− ${grp(b)}` }];
  const len = String(a).length;
  const top = digitsOf(a).reverse(); // index 0 = ones
  for (let i = 0; i < len; i++) {
    let t = top[i] || 0;
    const bot = digitAt(b, i);
    let line = `${placeNames[i][0].toUpperCase() + placeNames[i].slice(1)}: `;
    if (t < bot) {
      // borrow from next non-zero
      let j = i + 1;
      while ((top[j] || 0) === 0 && j < len) { top[j] = 9; j++; }
      top[j] = (top[j] || 0) - 1;
      t += 10;
      line += `${t - 10} is smaller than ${bot}, so borrow 10 → ${t}. ${t} − ${bot} = ${t - bot}.`;
    } else {
      line += `${t} − ${bot} = ${t - bot}.`;
    }
    top[i] = t - bot;
    steps.push({ text: line });
  }
  steps.push({ text: `The answer is ${grp(ans)}. ✅ (Check: ${grp(b)} + ${grp(ans)} = ${grp(a)}.)` });
  return steps;
}

/* =====================================================================
   MULTIPLICATION
===================================================================== */
function makeMult(params = {}, rng) {
  const ad = params.aDigits || 1, bd = params.bDigits || 1;
  const aLo = Math.pow(10, ad - 1), aHi = Math.pow(10, ad) - 1;
  const bLo = Math.pow(10, bd - 1), bHi = Math.pow(10, bd) - 1;
  let a = randInt(rng, Math.max(aLo, 2), aHi);
  let b = randInt(rng, Math.max(bLo, 2), bHi);
  const ans = a * b;
  let steps, visual = null;
  if (ad === 1 && bd === 1) {
    steps = [
      { text: `${a} × ${b} means ${a} groups of ${b} (or ${b} added ${a} times).` },
      { text: `${Array(a).fill(b).join(' + ')} = ${ans}.` },
      { text: `So ${a} × ${b} = ${ans}. 🌟` },
    ];
    visual = { type: 'array', a, b };
  } else if (bd === 1) {
    // distributive break-apart by place value
    const parts = [];
    const dig = digitsOf(a).reverse();
    for (let i = dig.length - 1; i >= 0; i--) {
      if (dig[i] === 0) continue;
      const place = dig[i] * Math.pow(10, i);
      parts.push({ place, prod: place * b });
    }
    steps = [
      { text: `Break ${a} apart by place value: ${parts.map((p) => grp(p.place)).join(' + ')}.` },
      ...parts.map((p) => ({ text: `${grp(p.place)} × ${b} = ${grp(p.prod)}.` })),
      { text: `Add the pieces: ${parts.map((p) => grp(p.prod)).join(' + ')} = ${grp(ans)}.` },
      { text: `So ${grp(a)} × ${b} = ${grp(ans)}. 🎉` },
    ];
    visual = { type: 'array', a: Math.min(b, 10), b: Math.min(dig.reduce((s, x) => s + x, 0) ? a : a, 12) > 12 ? 12 : a };
    if (a > 12 || b > 12) visual = null;
  } else {
    // 2-digit × 2-digit: partial products via tens+ones of b
    const bTens = Math.floor(b / 10) * 10, bOnes = b % 10;
    const p1 = a * bOnes, p2 = a * bTens;
    steps = [
      { text: `Break ${b} into ${bTens} + ${bOnes}.` },
      { text: `${grp(a)} × ${bOnes} = ${grp(p1)}.` },
      { text: `${grp(a)} × ${bTens} = ${grp(p2)}.` },
      { text: `Add the partial products: ${grp(p1)} + ${grp(p2)} = ${grp(ans)}.` },
      { text: `So ${grp(a)} × ${grp(b)} = ${grp(ans)}. 🚀` },
    ];
  }
  return P({
    type: 'mult',
    prompt: `${grp(a)} × ${grp(b)} = ?`,
    answer: grp(ans),
    steps,
    hints: [
      ad === 1 && bd === 1 ? `Think of ${a} groups with ${b} in each group.` : `Break the bigger number apart by place value.`,
      `Multiply the easy pieces first, then add them together.`,
      `Don't forget the zeros: tens × something ends in 0.`,
    ],
    visual,
    check: checkInt(ans),
  });
}

/* =====================================================================
   DIVISION
===================================================================== */
function makeDiv(params = {}, rng) {
  const dd = params.dividendDigits || 2;
  const divisorMax = params.divisor || 9;
  const wantRem = !!params.remainder;
  const lo = Math.pow(10, dd - 1), hi = Math.pow(10, dd) - 1;
  let divisor = randInt(rng, 2, Math.max(2, divisorMax));
  let dividend;
  for (let tries = 0; tries < 80; tries++) {
    dividend = randInt(rng, lo, hi);
    const r = dividend % divisor;
    if (wantRem ? r !== 0 : r === 0) break;
  }
  if (!wantRem && dividend % divisor !== 0) dividend = Math.floor(dividend / divisor) * divisor;
  const q = Math.floor(dividend / divisor), r = dividend % divisor;
  const ansStr = r ? `${q} r${r}` : String(q);
  return P({
    type: 'div',
    prompt: `${grp(dividend)} ÷ ${divisor} = ?`,
    answer: ansStr,
    steps: longDivisionSteps(dividend, divisor, q, r),
    hints: [
      `Ask: how many ${divisor}'s fit? Work LEFT to right, one digit at a time.`,
      `Multiply, subtract, then bring down the next digit. Repeat!`,
      wantRem ? `Whatever is left at the end that's smaller than ${divisor} is the remainder.` : `It should divide evenly with nothing left over.`,
    ],
    inputKind: r ? 'text' : 'number',
    check: r
      ? (raw) => {
          const s = String(raw).toLowerCase().replace(/\s+/g, '');
          const m = s.match(/^(\d+)(?:r(\d+))?$/);
          if (!m) return false;
          return +m[1] === q && (m[2] ? +m[2] === r : r === 0);
        }
      : checkInt(q),
  });
}
function longDivisionSteps(dividend, divisor, q, r) {
  const steps = [{ text: `We share ${grp(dividend)} into groups of ${divisor}. Work from the left.` }];
  const digs = digitsOf(dividend);
  let cur = 0, started = false;
  for (let i = 0; i < digs.length; i++) {
    cur = cur * 10 + digs[i];
    const part = Math.floor(cur / divisor);
    if (part === 0 && !started) {
      steps.push({ text: `${divisor} doesn't fit into ${cur} yet, so look at the next digit.` });
      continue;
    }
    started = true;
    const prod = part * divisor, rem = cur - prod;
    steps.push({
      text: `${divisor} fits into ${cur} ${part} time${part === 1 ? '' : 's'} (${part} × ${divisor} = ${prod}). Subtract: ${cur} − ${prod} = ${rem}.${i < digs.length - 1 ? ` Bring down the ${digs[i + 1]}.` : ''}`,
    });
    cur = rem;
  }
  steps.push({ text: r ? `Nothing left to bring down. ${r} is left over → answer is ${q} remainder ${r}.` : `Nothing left over. The answer is ${grp(q)}. ✅` });
  return steps;
}

/* =====================================================================
   PLACE VALUE
===================================================================== */
function makePlaceValue(params = {}, rng) {
  const d = params.digits || 3;
  const ask = params.ask || 'value';
  const lo = Math.pow(10, d - 1), hi = Math.pow(10, d) - 1;
  const n = randInt(rng, lo, hi);
  const digs = digitsOf(n).reverse(); // index = place
  if (ask === 'expanded') {
    const parts = [];
    for (let i = digs.length - 1; i >= 0; i--) if (digs[i]) parts.push(digs[i] * placeValAt(i));
    const ansStr = parts.map(grp).join(' + ');
    return P({
      type: 'placeValue', inputKind: 'text',
      prompt: `Write ${grp(n)} in expanded form (like 300 + 40 + 5):`,
      answer: ansStr,
      steps: [
        { text: `Look at each digit and its place value.` },
        ...[...digs].map((dv, i) => digs.length - 1 - i >= 0 && digs[digs.length - 1 - i] ? null : null).filter(Boolean),
        { text: parts.map((p, i) => `${grp(p)}`).join(' + ') + ` = ${grp(n)}.` },
        { text: `Expanded form: ${ansStr}. 🧩` },
      ],
      hints: ['Each digit is worth its face value times its place (ones, tens, hundreds...).', 'Write each nonzero digit times its place, joined with +.'],
      check: (raw) => {
        const got = String(raw).replace(/,/g, '').split('+').map((x) => Number(x.trim())).filter((x) => x);
        return got.reduce((a, b) => a + b, 0) === n && got.every((x) => /^\d0*$/.test(String(x)) || x < 10);
      },
    });
  }
  // pick a place that has a nonzero digit when possible
  let place = randInt(rng, 0, d - 1);
  const digit = digs[place];
  if (ask === 'name') {
    return P({
      type: 'placeValue',
      prompt: `In ${grp(n)}, what digit is in the ${placeNames[place]} place?`,
      answer: String(digit),
      steps: [
        { text: `Count places from the right: ones, tens, hundreds...` },
        { text: `The ${placeNames[place]} place is position ${place + 1} from the right.` },
        { text: `That digit is ${digit}. ✅` },
      ],
      hints: [`Start at the ones place on the right and count left.`, `${placeNames[place]} is ${place} place(s) left of the ones.`],
      check: checkInt(digit),
    });
  }
  // value
  const val = digit * placeValAt(place);
  return P({
    type: 'placeValue',
    prompt: `In ${grp(n)}, what is the VALUE of the ${digit} in the ${placeNames[place]} place?`,
    answer: grp(val),
    steps: [
      { text: `The digit is ${digit}, and it sits in the ${placeNames[place]} place (worth ${grp(placeValAt(place))}).` },
      { text: `Value = ${digit} × ${grp(placeValAt(place))} = ${grp(val)}.` },
      { text: `So its value is ${grp(val)}. 💎` },
    ],
    hints: [`A digit's value = the digit × its place value.`, `${placeNames[place]} place is worth ${grp(placeValAt(place))}.`],
    visual: n <= 9999 ? { type: 'baseTen', value: n } : null,
    check: checkInt(val),
  });
}

/* =====================================================================
   ROUNDING
===================================================================== */
function makeRounding(params = {}, rng) {
  const d = params.digits || 3;
  const to = params.to || 10;
  const lo = Math.pow(10, d - 1), hi = Math.pow(10, d) - 1;
  const n = randInt(rng, lo, hi);
  const rounded = Math.round(n / to) * to;
  const placeIdx = Math.log10(to);
  const lookDigit = digitAt(n, placeIdx - 1);
  return P({
    type: 'rounding',
    prompt: `Round ${grp(n)} to the nearest ${grp(to)}.`,
    answer: grp(rounded),
    steps: [
      { text: `We're rounding to the nearest ${grp(to)}, so look at the ${placeNames[placeIdx - 1]} digit.` },
      { text: `That digit is ${lookDigit}. Rule: 5 or more rounds UP, 4 or less stays the same.` },
      { text: `${lookDigit >= 5 ? `${lookDigit} ≥ 5, so round UP` : `${lookDigit} < 5, so round DOWN`} → ${grp(rounded)}. 🎯` },
    ],
    hints: [`Find the digit just to the RIGHT of the place you're rounding to.`, `5 or more? Round up. 4 or less? Keep it the same.`, `Everything to the right becomes 0.`],
    visual: n <= 100 ? { type: 'numberLine', min: Math.floor(n / to) * to, max: Math.ceil(n / to) * to, step: to / 2 || 1, mark: n } : null,
    check: checkInt(rounded),
  });
}

/* =====================================================================
   COMPARE NUMBERS
===================================================================== */
function makeCompare(params = {}, rng) {
  const d = params.digits || 3;
  const lo = Math.pow(10, d - 1), hi = Math.pow(10, d) - 1;
  let a = randInt(rng, lo, hi), b = randInt(rng, lo, hi);
  if (rng() < 0.12) b = a; // sometimes equal
  const ans = a > b ? '>' : a < b ? '<' : '=';
  return P({
    type: 'compare', inputKind: 'choice', choices: ['<', '>', '='],
    prompt: `Compare:  ${grp(a)}  ?  ${grp(b)}`,
    answer: ans,
    steps: [
      { text: `Line them up and compare from the LEFT (biggest place first).` },
      { text: a === b ? `Every digit matches, so they're equal.` : `The first place where they differ decides it.` },
      { text: `${grp(a)} ${ans} ${grp(b)}. ${ans === '>' ? '◀ points to the bigger one!' : ans === '<' ? 'The open side faces the bigger one!' : ''}` },
    ],
    hints: [`Compare the leftmost digits first.`, `The alligator mouth always opens toward the BIGGER number. 🐊`],
    check: checkChoice(ans),
  });
}

/* =====================================================================
   FRACTIONS — compare
===================================================================== */
function makeFractionCompare(params = {}, rng) {
  const maxD = params.maxDenom || 8;
  const d1 = randInt(rng, 2, maxD), d2 = randInt(rng, 2, maxD);
  const n1 = randInt(rng, 1, d1 - 1), n2 = randInt(rng, 1, d2 - 1);
  const v1 = n1 / d1, v2 = n2 / d2;
  const ans = Math.abs(v1 - v2) < 1e-9 ? '=' : v1 > v2 ? '>' : '<';
  const L = lcm(d1, d2);
  return P({
    type: 'fractionCompare', inputKind: 'choice', choices: ['<', '>', '='],
    prompt: `Compare:  ${n1}/${d1}  ?  ${n2}/${d2}`,
    answer: ans,
    steps: [
      { text: `To compare, give them the same denominator. The smallest common one is ${L}.` },
      { text: `${n1}/${d1} = ${n1 * (L / d1)}/${L}  and  ${n2}/${d2} = ${n2 * (L / d2)}/${L}.` },
      { text: `Now compare the top numbers: ${n1 * (L / d1)} vs ${n2 * (L / d2)} → ${n1}/${d1} ${ans} ${n2}/${d2}. 🍕` },
    ],
    hints: [`Same-size pieces are easy to compare — find a common denominator.`, `When denominators match, just compare the numerators.`],
    visual: { type: 'fractionBar', bars: [{ num: n1, den: d1 }, { num: n2, den: d2 }] },
    check: checkChoice(ans),
  });
}

/* =====================================================================
   FRACTIONS — equivalent
===================================================================== */
function makeEquivFraction(params = {}, rng) {
  const maxD = params.maxDenom || 8;
  const den = randInt(rng, 2, Math.max(3, Math.floor(maxD / 2)));
  const num = randInt(rng, 1, den - 1);
  const mult = randInt(rng, 2, 4);
  const tDen = den * mult, tNum = num * mult;
  // ask: a/b = ?/tDen  (find numerator)
  return P({
    type: 'equivFraction',
    prompt: `Fill in the missing number:  ${num}/${den} = ?/${tDen}`,
    answer: String(tNum),
    steps: [
      { text: `Ask: what did we multiply ${den} by to get ${tDen}? ${den} × ${mult} = ${tDen}.` },
      { text: `Whatever we do to the bottom, we do to the top. So multiply the top by ${mult} too.` },
      { text: `${num} × ${mult} = ${tNum}. So ${num}/${den} = ${tNum}/${tDen}. ✨` },
    ],
    hints: [`Equivalent fractions are the same amount cut into more pieces.`, `Multiply top AND bottom by the same number.`, `${den} × ? = ${tDen}`],
    visual: { type: 'fractionBar', bars: [{ num, den }, { num: tNum, den: tDen }] },
    check: checkInt(tNum),
  });
}

/* =====================================================================
   FRACTIONS — add / subtract
===================================================================== */
function makeFractionAddSub(params = {}, rng) {
  const maxD = params.maxDenom || 8;
  const like = params.like === true ? true : params.like === false ? false : rng() < 0.5;
  const op = params.op === 'mix' || !params.op ? (rng() < 0.5 ? '+' : '-') : params.op;
  let d1, d2, n1, n2;
  if (like) {
    d1 = d2 = randInt(rng, 3, maxD);
    n1 = randInt(rng, 1, d1 - 1); n2 = randInt(rng, 1, d1 - 1);
  } else {
    d1 = randInt(rng, 2, maxD); d2 = randInt(rng, 2, maxD);
    while (d2 === d1) d2 = randInt(rng, 2, maxD);
    n1 = randInt(rng, 1, d1 - 1); n2 = randInt(rng, 1, d2 - 1);
  }
  if (op === '-' && n1 / d1 < n2 / d2) { [d1, d2] = [d2, d1];[n1, n2] = [n2, n1]; }
  const L = lcm(d1, d2);
  const a = n1 * (L / d1), b = n2 * (L / d2);
  const rawNum = op === '+' ? a + b : a - b;
  const [sNum, sDen] = simplify(rawNum, L);
  const steps = [];
  if (like) {
    steps.push({ text: `Same denominator (${d1})! Just ${op === '+' ? 'add' : 'subtract'} the top numbers.` });
    steps.push({ text: `${n1} ${op} ${n2} = ${rawNum} → ${rawNum}/${d1}.` });
  } else {
    steps.push({ text: `Different bottoms. Find a common denominator: the LCM of ${d1} and ${d2} is ${L}.` });
    steps.push({ text: `${n1}/${d1} = ${a}/${L}  and  ${n2}/${d2} = ${b}/${L}.` });
    steps.push({ text: `Now ${op === '+' ? 'add' : 'subtract'} the tops: ${a} ${op} ${b} = ${rawNum} → ${rawNum}/${L}.` });
  }
  if (sDen !== (like ? d1 : L) || sNum !== rawNum) steps.push({ text: `Simplify: ${rawNum}/${like ? d1 : L} = ${mixedStr(sNum, sDen)}.` });
  steps.push({ text: `Answer: ${mixedStr(sNum, sDen)}. 🎉` });
  return P({
    type: 'fractionAddSub', inputKind: 'fraction',
    prompt: `${n1}/${d1} ${op} ${n2}/${d2} = ?`,
    answer: mixedStr(sNum, sDen),
    steps,
    hints: [
      like ? `The bottoms already match — work with the tops.` : `You need the SAME denominator before adding or subtracting.`,
      like ? `${op === '+' ? 'Add' : 'Subtract'} the numerators, keep the denominator.` : `Rewrite both with denominator ${L}.`,
      `Always simplify your answer if you can.`,
    ],
    visual: { type: 'fractionBar', bars: [{ num: n1, den: d1 }, { num: n2, den: d2 }] },
    check: checkFraction(sNum, sDen),
  });
}

/* =====================================================================
   FRACTION OF A NUMBER
===================================================================== */
function makeFractionOfNum(params = {}, rng) {
  const maxD = params.maxDenom || 6;
  const den = randInt(rng, 2, maxD);
  const num = randInt(rng, 1, den);
  const whole = den * randInt(rng, 2, 8); // divisible
  const ans = (whole / den) * num;
  return P({
    type: 'fractionOfNum',
    prompt: `What is ${num}/${den} of ${whole}?`,
    answer: String(ans),
    steps: [
      { text: `"of" means multiply. First split ${whole} into ${den} equal parts.` },
      { text: `${whole} ÷ ${den} = ${whole / den}. That's ONE part (1/${den}).` },
      { text: `We want ${num} parts: ${whole / den} × ${num} = ${ans}. 🎯` },
    ],
    hints: [`"of" tells you to multiply.`, `Divide by the bottom to find one part, then times the top.`],
    visual: { type: 'groups', groups: den, perGroup: whole / den },
    check: checkInt(ans),
  });
}

/* =====================================================================
   DECIMALS — add / subtract
===================================================================== */
function makeDecimalAddSub(params = {}, rng) {
  const places = params.places || 2;
  const op = params.op === 'mix' || !params.op ? (rng() < 0.5 ? '+' : '-') : params.op;
  const scale = Math.pow(10, places);
  let a = randInt(rng, 1 * scale, 50 * scale) / scale;
  let b = randInt(rng, 1 * scale, 50 * scale) / scale;
  if (op === '-' && b > a) [a, b] = [b, a];
  const ans = op === '+' ? +(a + b).toFixed(places) : +(a - b).toFixed(places);
  return P({
    type: 'decimalAddSub', inputKind: 'number',
    prompt: `${a.toFixed(places)} ${op} ${b.toFixed(places)} = ?`,
    answer: ans.toFixed(places),
    steps: [
      { text: `LINE UP THE DECIMAL POINTS — that's the #1 rule with decimals.` },
      { text: `Then ${op === '+' ? 'add' : 'subtract'} just like whole numbers, column by column.` },
      { text: `Bring the decimal point straight down. Answer: ${ans.toFixed(places)}. 💯` },
    ],
    hints: [`Stack them so the decimal points are in a straight line.`, `Fill empty spots with 0 if you need to.`, `Drop the decimal point straight down into the answer.`],
    check: checkDecimal(ans),
  });
}

/* =====================================================================
   DECIMALS — compare
===================================================================== */
function makeDecimalCompare(params = {}, rng) {
  const places = params.places || 2;
  const scale = Math.pow(10, places);
  const a = randInt(rng, 1, 99 * scale / 10) / scale;
  const b = randInt(rng, 1, 99 * scale / 10) / scale;
  const ans = Math.abs(a - b) < 1e-9 ? '=' : a > b ? '>' : '<';
  return P({
    type: 'decimalCompare', inputKind: 'choice', choices: ['<', '>', '='],
    prompt: `Compare:  ${a}  ?  ${b}`,
    answer: ans,
    steps: [
      { text: `Compare place by place from the LEFT: whole numbers first, then tenths, then hundredths.` },
      { text: `Tip: give them the same number of decimal places by adding zeros.` },
      { text: `${a} ${ans} ${b}. ✅` },
    ],
    hints: [`Compare the whole-number part first.`, `Add trailing zeros so both have the same length, then compare like whole numbers.`],
    check: checkChoice(ans),
  });
}

/* =====================================================================
   FACTORS / MULTIPLES / PRIME
===================================================================== */
function makeFactors(params = {}, rng) {
  const max = params.max || 40;
  const ask = params.ask || 'factors';
  if (ask === 'multiples') {
    const n = randInt(rng, 2, 9);
    const list = [n, n * 2, n * 3, n * 4, n * 5];
    return P({
      type: 'factors', inputKind: 'text',
      prompt: `List the first 5 multiples of ${n}.`,
      answer: list.join(', '),
      steps: [
        { text: `Multiples are what you get when you skip-count by ${n}.` },
        { text: `${n}, ${n}×2=${n * 2}, ${n}×3=${n * 3}, ${n}×4=${n * 4}, ${n}×5=${n * 5}.` },
        { text: `First five multiples: ${list.join(', ')}. 🔢` },
      ],
      hints: [`Just skip-count: ${n}, then keep adding ${n}.`, `Multiples = the times table of ${n}.`],
      check: checkSet(list),
    });
  }
  if (ask === 'prime') {
    const n = randInt(rng, 2, max);
    const isPrime = (() => { for (let i = 2; i * i <= n; i++) if (n % i === 0) return false; return n >= 2; })();
    let factor = 0; for (let i = 2; i * i <= n; i++) if (n % i === 0) { factor = i; break; }
    return P({
      type: 'factors', inputKind: 'choice', choices: ['Prime', 'Composite'],
      prompt: `Is ${n} prime or composite?`,
      answer: isPrime ? 'Prime' : 'Composite',
      steps: [
        { text: `Prime = only factors are 1 and itself. Composite = has more factors.` },
        { text: isPrime ? `Nothing divides ${n} evenly except 1 and ${n}.` : `${n} ÷ ${factor} = ${n / factor}, so ${factor} is a factor.` },
        { text: `${n} is ${isPrime ? 'PRIME' : 'COMPOSITE'}. ✅` },
      ],
      hints: [`Try dividing by 2, 3, 5, 7...`, `If anything besides 1 and itself divides evenly, it's composite.`],
      check: checkChoice(isPrime ? 'Prime' : 'Composite'),
    });
  }
  const n = randInt(rng, 6, max);
  const factors = []; for (let i = 1; i <= n; i++) if (n % i === 0) factors.push(i);
  return P({
    type: 'factors', inputKind: 'text',
    prompt: `List all the factors of ${n}.`,
    answer: factors.join(', '),
    steps: [
      { text: `Factors are numbers that divide ${n} with NO remainder.` },
      { text: `Check in pairs: 1 × ${n}, and work up. ${factorPairs(n)}` },
      { text: `Factors of ${n}: ${factors.join(', ')}. 🧮` },
    ],
    hints: [`Always start with 1 and the number itself.`, `Find pairs that multiply to ${n}.`],
    check: checkSet(factors),
  });
}
function factorPairs(n) {
  const pairs = []; for (let i = 1; i * i <= n; i++) if (n % i === 0) pairs.push(`${i}×${n / i}`);
  return pairs.join(', ') + '.';
}

/* =====================================================================
   NUMBER PATTERNS
===================================================================== */
function makePatterns(params = {}, rng) {
  const kind = params.kind || 'add';
  const start = randInt(rng, 1, 9);
  const step = randInt(rng, 2, params.maxStep || 9);
  let seq = [], v = start;
  for (let i = 0; i < 5; i++) { seq.push(v); v = kind === 'mult' ? v * step : v + step; }
  const next = v;
  return P({
    type: 'patterns',
    prompt: `What comes next?  ${seq.join(', ')}, ___`,
    answer: String(next),
    steps: [
      { text: `Look at how each number changes to the next.` },
      { text: kind === 'mult' ? `Each one is ×${step} the one before (${seq[0]}→${seq[1]}...).` : `Each one is +${step} more than the one before.` },
      { text: `So next is ${seq[4]} ${kind === 'mult' ? '×' : '+'} ${step} = ${next}. 🔍` },
    ],
    hints: [`Find the difference (or ratio) between each pair.`, `Apply that same change to the last number.`],
    check: checkInt(next),
  });
}

/* =====================================================================
   ORDER OF OPERATIONS
===================================================================== */
function makeOrder(params = {}, rng) {
  const parens = params.parens !== false && rng() < 0.6;
  const a = randInt(rng, 2, 9), b = randInt(rng, 2, 9), c = randInt(rng, 2, 9);
  let expr, ans, steps;
  if (parens) {
    expr = `(${a} + ${b}) × ${c}`; ans = (a + b) * c;
    steps = [
      { text: `PEMDAS: do what's inside PARENTHESES first.` },
      { text: `(${a} + ${b}) = ${a + b}.` },
      { text: `Then ${a + b} × ${c} = ${ans}. ✅` },
    ];
  } else {
    expr = `${a} + ${b} × ${c}`; ans = a + b * c;
    steps = [
      { text: `PEMDAS: MULTIPLY before you add.` },
      { text: `${b} × ${c} = ${b * c} first.` },
      { text: `Then ${a} + ${b * c} = ${ans}. ✅` },
    ];
  }
  return P({
    type: 'order',
    prompt: `${expr} = ?`,
    answer: String(ans),
    steps,
    hints: [`Remember PEMDAS: Parentheses, then ×/÷, then +/−.`, `Don't just go left to right!`],
    check: checkInt(ans),
  });
}

/* =====================================================================
   PERIMETER / AREA
===================================================================== */
function makePerimeterArea(params = {}, rng) {
  const max = params.max || 12;
  const square = params.shape === 'square';
  const w = randInt(rng, 2, max), h = square ? w : randInt(rng, 2, max);
  const ask = params.ask === 'mix' || !params.ask ? pick(rng, ['perimeter', 'area']) : params.ask;
  if (ask === 'perimeter') {
    const ans = 2 * (w + h);
    return P({
      type: 'perimeterArea',
      prompt: `A rectangle is ${w} by ${h}. What is its PERIMETER?`,
      answer: String(ans),
      steps: [
        { text: `Perimeter is the distance all the way AROUND.` },
        { text: `Add all four sides: ${w} + ${h} + ${w} + ${h}, or 2 × (${w} + ${h}).` },
        { text: `2 × ${w + h} = ${ans} units. 📏` },
      ],
      hints: [`Perimeter = the fence around the shape.`, `Add up every side: 2 long + 2 short.`],
      visual: { type: 'shape', shape: 'rect', w, h },
      check: checkInt(ans),
    });
  }
  const ans = w * h;
  return P({
    type: 'perimeterArea',
    prompt: `A rectangle is ${w} by ${h}. What is its AREA?`,
    answer: String(ans),
    steps: [
      { text: `Area is how many unit squares cover the inside.` },
      { text: `Area = length × width = ${w} × ${h}.` },
      { text: `${w} × ${h} = ${ans} square units. 🟦` },
    ],
    hints: [`Area = length × width.`, `Count the rows of squares times the columns.`],
    visual: { type: 'shape', shape: 'rect', w, h },
    check: checkInt(ans),
  });
}

/* =====================================================================
   VOLUME
===================================================================== */
function makeVolume(params = {}, rng) {
  const max = params.max || 8;
  const l = randInt(rng, 2, max), w = randInt(rng, 2, max), h = randInt(rng, 2, max);
  const ans = l * w * h;
  return P({
    type: 'volume',
    prompt: `A box is ${l} long, ${w} wide, and ${h} tall. What is its VOLUME?`,
    answer: String(ans),
    steps: [
      { text: `Volume is how many unit cubes fill the box.` },
      { text: `Volume = length × width × height = ${l} × ${w} × ${h}.` },
      { text: `${l} × ${w} = ${l * w}, then × ${h} = ${ans} cubic units. 📦` },
    ],
    hints: [`Volume = length × width × height.`, `Find the area of the bottom first, then multiply by the height.`],
    check: checkInt(ans),
  });
}

/* =====================================================================
   TIME
===================================================================== */
function makeTime(params = {}, rng) {
  const ask = params.ask || 'elapsed';
  if (ask === 'read') {
    const h = randInt(rng, 1, 12), m = pick(rng, [0, 15, 30, 45]);
    const ansStr = `${h}:${String(m).padStart(2, '0')}`;
    return P({
      type: 'time', inputKind: 'text',
      prompt: `What time does the clock show? (write like 3:45)`,
      answer: ansStr,
      steps: [
        { text: `The short hand points to the HOUR, the long hand to the MINUTES.` },
        { text: `Hour: ${h}. Minutes: ${m}.` },
        { text: `Time is ${ansStr}. 🕐` },
      ],
      hints: [`Short hand = hour, long hand = minutes.`, `Each number on the clock is 5 minutes.`],
      visual: { type: 'clock', h, m },
      check: (raw) => String(raw).replace(/\s/g, '') === ansStr || parseNum(String(raw).replace(':', '.')) === h + m / 100,
    });
  }
  const startH = randInt(rng, 1, 9), startM = pick(rng, [0, 15, 30]);
  const addMin = pick(rng, [15, 30, 45, 60, 90]);
  const total = startH * 60 + startM + addMin;
  const endH = Math.floor(total / 60), endM = total % 60;
  const ansStr = `${endH}:${String(endM).padStart(2, '0')}`;
  return P({
    type: 'time', inputKind: 'text',
    prompt: `It is ${startH}:${String(startM).padStart(2, '0')}. What time is it ${addMin} minutes later?`,
    answer: ansStr,
    steps: [
      { text: `Add the minutes first: ${startM} + ${addMin} = ${startM + addMin} minutes.` },
      { text: `Every 60 minutes is 1 hour. ${addMin} min = ${Math.floor(addMin / 60) ? Math.floor(addMin / 60) + ' hr ' : ''}${addMin % 60} min.` },
      { text: `New time: ${ansStr}. ⏰` },
    ],
    hints: [`Count forward by the minutes, rolling over each hour at 60.`, `60 minutes = 1 hour.`],
    visual: { type: 'clock', h: startH, m: startM },
    check: (raw) => String(raw).replace(/\s/g, '') === ansStr,
  });
}

/* =====================================================================
   MONEY
===================================================================== */
function makeMoney(params = {}, rng) {
  const ask = params.ask || 'change';
  const maxD = params.maxDollars || 20;
  if (ask === 'add') {
    const a = randInt(rng, 50, maxD * 100) / 100, b = randInt(rng, 50, maxD * 100) / 100;
    const ans = +(a + b).toFixed(2);
    return P({
      type: 'money',
      prompt: `You buy a toy for $${a.toFixed(2)} and a snack for $${b.toFixed(2)}. How much in all?`,
      answer: ans.toFixed(2),
      steps: [
        { text: `Add the two prices. Line up the decimal points!` },
        { text: `$${a.toFixed(2)} + $${b.toFixed(2)} = $${ans.toFixed(2)}.` },
        { text: `Total: $${ans.toFixed(2)}. 💵` },
      ],
      hints: [`Adding money is just adding decimals.`, `Keep the dollars under dollars and cents under cents.`],
      check: checkDecimal(ans),
    });
  }
  const price = randInt(rng, 50, (maxD - 1) * 100) / 100;
  const paid = Math.ceil(price);
  const change = +(paid - price).toFixed(2);
  return P({
    type: 'money',
    prompt: `Something costs $${price.toFixed(2)}. You pay with $${paid}.00. What's your change?`,
    answer: change.toFixed(2),
    steps: [
      { text: `Change = money you GAVE − the PRICE.` },
      { text: `$${paid}.00 − $${price.toFixed(2)} = $${change.toFixed(2)}.` },
      { text: `You get $${change.toFixed(2)} back. 🪙` },
    ],
    hints: [`Subtract the price from what you paid.`, `Line up the decimal points and borrow if needed.`],
    check: checkDecimal(change),
  });
}

/* =====================================================================
   MEASUREMENT CONVERSION
===================================================================== */
function makeMeasure(params = {}, rng) {
  const kind = params.kind || 'length';
  const system = params.system || 'metric';
  const table = {
    length: system === 'metric' ? { from: 'meters', to: 'centimeters', factor: 100 } : { from: 'feet', to: 'inches', factor: 12 },
    mass: system === 'metric' ? { from: 'kilograms', to: 'grams', factor: 1000 } : { from: 'pounds', to: 'ounces', factor: 16 },
    capacity: system === 'metric' ? { from: 'liters', to: 'milliliters', factor: 1000 } : { from: 'gallons', to: 'quarts', factor: 4 },
  }[kind];
  const n = randInt(rng, 2, 9);
  const ans = n * table.factor;
  return P({
    type: 'measure',
    prompt: `Convert ${n} ${table.from} to ${table.to}.`,
    answer: grp(ans),
    steps: [
      { text: `1 ${table.from.replace(/s$/, '')} = ${grp(table.factor)} ${table.to}.` },
      { text: `So multiply: ${n} × ${grp(table.factor)} = ${grp(ans)}.` },
      { text: `${n} ${table.from} = ${grp(ans)} ${table.to}. 📐` },
    ],
    hints: [`Bigger units → smaller units means MULTIPLY.`, `1 ${table.from.replace(/s$/, '')} = ${grp(table.factor)} ${table.to}.`],
    check: checkInt(ans),
  });
}

/* =====================================================================
   RATIO
===================================================================== */
function makeRatio(params = {}, rng) {
  const max = params.max || 12;
  const g = randInt(rng, 2, 5);
  const a = randInt(rng, 1, max) * g, b = randInt(rng, 1, max) * g;
  const [sa, sb] = [a / gcd(a, b), b / gcd(a, b)];
  return P({
    type: 'ratio', inputKind: 'text',
    prompt: `Simplify the ratio ${a} : ${b} to lowest terms (like 2:3).`,
    answer: `${sa}:${sb}`,
    steps: [
      { text: `A ratio simplifies like a fraction — divide both sides by the same number.` },
      { text: `The greatest common factor of ${a} and ${b} is ${gcd(a, b)}.` },
      { text: `${a} ÷ ${gcd(a, b)} = ${sa}, ${b} ÷ ${gcd(a, b)} = ${sb} → ${sa}:${sb}. ✅` },
    ],
    hints: [`Treat it like reducing a fraction.`, `Divide both numbers by their greatest common factor.`],
    check: (raw) => {
      const m = String(raw).replace(/\s/g, '').match(/^(\d+):(\d+)$/);
      return m && +m[1] === sa && +m[2] === sb;
    },
  });
}

/* =====================================================================
   PERCENT
===================================================================== */
function makePercent(params = {}, rng) {
  const kind = params.kind || 'ofNumber';
  if (kind === 'whole') {
    const pct = pick(rng, [10, 20, 25, 50]);
    const part = randInt(rng, 2, 12) * (pct / 100) * 4; // keep clean
    const whole = Math.round(part / (pct / 100));
    return P({
      type: 'percent',
      prompt: `${pct}% of a number is ${part}. What is the whole number?`,
      answer: String(whole),
      steps: [
        { text: `${pct}% means ${pct} out of 100, or the fraction ${pct}/100.` },
        { text: `If ${pct}% is ${part}, then 100% (the whole) is ${part} ÷ ${pct / 100}.` },
        { text: `${part} ÷ ${pct / 100} = ${whole}. ✅` },
      ],
      hints: [`Percent means "out of 100".`, `Divide the part by the percent (as a decimal) to get the whole.`],
      check: checkInt(whole),
    });
  }
  const pct = pick(rng, [10, 20, 25, 50, 75]);
  const whole = randInt(rng, 1, 10) * 20;
  const ans = (pct / 100) * whole;
  return P({
    type: 'percent',
    prompt: `What is ${pct}% of ${whole}?`,
    answer: String(ans),
    steps: [
      { text: `${pct}% means ${pct} per 100 → the decimal ${(pct / 100).toFixed(2)}.` },
      { text: `Multiply: ${(pct / 100).toFixed(2)} × ${whole}.` },
      { text: `= ${ans}. 💯` },
    ],
    hints: [`Turn the percent into a decimal (move the dot 2 left).`, `Then multiply by the number.`],
    check: checkInt(ans),
  });
}

/* =====================================================================
   INTEGERS
===================================================================== */
function makeIntegers(params = {}, rng) {
  const max = params.max || 15;
  const op = params.op === 'mix' || !params.op ? pick(rng, ['+', '-']) : params.op;
  const a = randInt(rng, -max, max), b = randInt(rng, -max, max);
  const ans = op === '+' ? a + b : a - b;
  const bShown = b < 0 ? `(${b})` : `${b}`;
  return P({
    type: 'integers',
    prompt: `${a} ${op} ${bShown} = ?`,
    answer: String(ans),
    steps: [
      { text: `Think of a NUMBER LINE. Positive = move right, negative = move left.` },
      { text: op === '+'
        ? `Start at ${a}. ${b >= 0 ? `Move RIGHT ${b}.` : `Add a negative = move LEFT ${Math.abs(b)}.`}`
        : `Subtracting ${bShown} means ${b >= 0 ? `move LEFT ${b}` : `move RIGHT ${Math.abs(b)} (minus a negative = plus!)`}.` },
      { text: `You land on ${ans}. ✅` },
    ],
    hints: [`Use a number line: right for +, left for −.`, `Subtracting a negative is the same as adding!`],
    visual: { type: 'numberLine', min: -max - 5, max: max + 5, step: 5, mark: ans },
    check: checkInt(ans),
  });
}

/* =====================================================================
   MEAN / RANGE
===================================================================== */
function makeMean(params = {}, rng) {
  const count = params.count || 4;
  const max = params.max || 20;
  const ask = params.ask || 'mean';
  let nums;
  if (ask === 'mean') {
    // make the sum divisible by count for a clean average
    const target = randInt(rng, 3, max);
    nums = Array.from({ length: count }, () => randInt(rng, 1, max));
    const sum = nums.reduce((a, b) => a + b, 0);
    const fix = (target * count - sum);
    nums[0] = Math.min(Math.max(nums[0] + fix, 1), max * count);
  } else {
    nums = Array.from({ length: count }, () => randInt(rng, 1, max));
  }
  const sum = nums.reduce((a, b) => a + b, 0);
  if (ask === 'range') {
    const ans = Math.max(...nums) - Math.min(...nums);
    return P({
      type: 'mean',
      prompt: `Find the RANGE of: ${nums.join(', ')}`,
      answer: String(ans),
      steps: [
        { text: `Range = biggest − smallest.` },
        { text: `Biggest is ${Math.max(...nums)}, smallest is ${Math.min(...nums)}.` },
        { text: `${Math.max(...nums)} − ${Math.min(...nums)} = ${ans}. 📊` },
      ],
      hints: [`Find the largest and smallest values.`, `Subtract the smallest from the largest.`],
      check: checkInt(ans),
    });
  }
  const ans = Math.round(sum / count);
  return P({
    type: 'mean',
    prompt: `Find the MEAN (average) of: ${nums.join(', ')}`,
    answer: String(ans),
    steps: [
      { text: `Mean = add them all up, then divide by how many.` },
      { text: `${nums.join(' + ')} = ${sum}. There are ${count} numbers.` },
      { text: `${sum} ÷ ${count} = ${ans}. 📈` },
    ],
    hints: [`Add every number first.`, `Then divide the total by how many numbers there are.`],
    check: checkInt(ans),
  });
}

/* ---------- registry + generic fallback ---------- */
export const TYPES = {
  add: makeAdd, sub: makeSub, mult: makeMult, div: makeDiv,
  placeValue: makePlaceValue, rounding: makeRounding, compare: makeCompare,
  fractionCompare: makeFractionCompare, equivFraction: makeEquivFraction,
  fractionAddSub: makeFractionAddSub, fractionOfNum: makeFractionOfNum,
  decimalAddSub: makeDecimalAddSub, decimalCompare: makeDecimalCompare,
  factors: makeFactors, patterns: makePatterns, order: makeOrder,
  perimeterArea: makePerimeterArea, volume: makeVolume, time: makeTime,
  money: makeMoney, measure: makeMeasure, ratio: makeRatio, percent: makePercent,
  integers: makeIntegers, mean: makeMean,
};

export function generateProblem(type, params, rng) {
  const fn = TYPES[type];
  if (!fn) {
    // graceful fallback: simple addition so the app never crashes on bad data
    return makeAdd({ digits: 2 }, rng);
  }
  try {
    return fn(params || {}, rng);
  } catch (e) {
    console.warn('problem gen failed for', type, e);
    return makeAdd({ digits: 2 }, rng);
  }
}
