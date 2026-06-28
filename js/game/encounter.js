// game/encounter.js — a reusable "math encounter" overlay that drops the adaptive
// tutor INTO the explorable world. When the pet bumps an NPC/creature, world.js calls
// openEncounter(...): we (optionally) teach, pose one adaptive problem with a hint
// ladder + "show me", reward a solve, and report back so the world can react.
//
// Self-contained: builds its own DOM overlay + answer pad (a compact re-implementation
// of adventure.js's buildAnswer) and removes everything on close. No routing, no
// side effects at import time.
import { S, persist, isMastered, isUnlocked } from '../state.js';
import { getSkill, ALL_SKILLS, strandSkills, GRADES } from '../curriculum/index.js';
import { nextProblem, wordProblem } from '../engine/index.js';

// map a skill's strand to a word-problem skill tag in the wordbank ("help the
// character" framing). Unmapped strands fall back to any grade-appropriate story.
const STRAND_TO_WORD = {
  'Addition & Subtraction': 'add', 'Multiplication': 'mult', 'Division': 'div',
  'Fractions': 'fractionOfNum', 'Geometry & Measurement': 'perimeterArea',
  'Money & Time': 'money', 'Ratios & Algebra': 'ratio',
};
import { matchMisconception } from '../engine/problemTypes.js';
import { recordAnswer, checkNewBadges, addCoins, noteMistake, resolveMistake } from '../gamification.js';
import { renderVisual } from '../ui/manipulatives.js';
import { sfx, speak } from '../ui/sound.js';
import { confetti, sparkle } from '../ui/celebrations.js';
import { escapeHtml, mdInline } from '../ui/dom.js';

const reducedMotion = () => !!(S.progress && S.progress.settings && S.progress.settings.reducedMotion);

/* ---------------- skill selection ---------------- */
// Choose the skill to quiz. Priority for a strand request:
//   unlocked AND not-mastered AND grade-appropriate
//   → unlocked AND not-mastered (any grade)
//   → any unlocked in strand → any in strand → any skill anywhere.
function chooseSkill(opts) {
  if (opts.skillId) {
    const s = getSkill(opts.skillId);
    if (s) return s;
  }
  const grade = opts.grade || (S.profile && S.profile.grade) || GRADES[0];
  let pool;
  if (opts.strand) {
    // gather this strand across grades, biasing toward the chosen grade
    pool = ALL_SKILLS.filter((s) => s.strand === opts.strand);
    if (!pool.length) pool = ALL_SKILLS.slice();
  } else {
    pool = ALL_SKILLS.slice();
  }
  const gradeBias = (s) => Math.abs((s.grade || grade) - grade);
  const byGrade = (a, b) => gradeBias(a) - gradeBias(b);
  const sorted = pool.slice().sort(byGrade);

  // best: unlocked, not yet mastered, closest grade
  let pick = sorted.find((s) => isUnlocked(s) && !isMastered(s.id));
  if (pick) return pick;
  // next: any unlocked in the pool
  pick = sorted.find((s) => isUnlocked(s));
  if (pick) return pick;
  // next: any skill in the pool
  if (sorted.length) return sorted[0];
  // ultimate fallback: any skill at all
  return ALL_SKILLS[0] || null;
}

function shouldTeach(skill, mode) {
  if (mode === 'always') return true;
  if (mode === 'never') return false;
  return !isMastered(skill.id); // 'auto'
}

/* ---------------- public API ---------------- */
export function openEncounter(opts = {}) {
  const host = opts.host;
  if (!host) throw new Error('openEncounter: opts.host is required');

  const skill = chooseSkill(opts);
  const skillId = skill ? skill.id : null;
  const title = opts.title || (skill ? skill.title : 'A Math Challenge');
  const npcEmoji = opts.npcEmoji || '🐾';
  const teachMode = opts.teach || 'auto';
  const willTeach = skill ? shouldTeach(skill, teachMode) : false;

  // capture focus to restore on close
  const prevFocus = document.activeElement;

  // ---- build overlay shell ----
  const overlay = document.createElement('div');
  overlay.className = 'enc-overlay';
  overlay.innerHTML = `
    <div class="enc-card" role="dialog" aria-modal="true" aria-label="${escapeHtml(title)}" tabindex="-1">
      <header class="enc-head">
        <span class="enc-npc" aria-hidden="true">${escapeHtml(npcEmoji)}</span>
        <span class="enc-title">${escapeHtml(title)}</span>
        <button class="enc-close" type="button" aria-label="Leave">✕</button>
      </header>
      ${opts.intro ? `<p class="enc-intro">${escapeHtml(opts.intro)}</p>` : ''}
      <div class="enc-body"></div>
    </div>`;
  host.appendChild(overlay);
  const card = overlay.querySelector('.enc-card');
  const body = overlay.querySelector('.enc-body');

  if (opts.intro) speak(opts.intro);

  // ---- lifecycle bookkeeping (idempotent close, single onClose / onDone) ----
  let closed = false;
  let doneFired = false;
  const timers = [];
  const after = (ms, fn) => { const t = setTimeout(fn, ms); timers.push(t); return t; };

  function close() {
    if (closed) return;
    closed = true;
    timers.forEach(clearTimeout);
    document.removeEventListener('keydown', onKey, true);
    if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
    // restore focus to wherever the world had it
    try { if (prevFocus && prevFocus.focus) prevFocus.focus(); } catch (e) {}
    if (typeof opts.onClose === 'function') opts.onClose();
  }

  function fireDone(result) {
    if (doneFired) return;
    doneFired = true;
    if (typeof opts.onDone === 'function') opts.onDone(result);
  }

  // Escape + focus trap
  function onKey(e) {
    if (e.key === 'Escape') { e.preventDefault(); sfx.tap(); close(); return; }
    if (e.key === 'Tab') {
      const f = card.querySelectorAll('button, [tabindex]:not([tabindex="-1"]), input');
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  }
  document.addEventListener('keydown', onKey, true);
  overlay.querySelector('.enc-close').addEventListener('click', () => { sfx.tap(); close(); });
  // move focus into the dialog
  requestAnimationFrame(() => card.focus());

  // ---- if there's no usable skill, show a friendly bail-out ----
  if (!skill) {
    body.innerHTML = `<p class="enc-intro">No challenge right now — come back soon! 🌱</p>
      <button class="enc-btn enc-btn-big" type="button">Okay</button>`;
    body.querySelector('button').addEventListener('click', () => { sfx.tap(); close(); });
    return { close };
  }

  // ---- flow: (teach?) -> challenge ----
  if (willTeach) renderTeach(); else renderChallenge();

  /* ---------------- TEACH section (compact teachPhase) ---------------- */
  function renderTeach() {
    const lesson = (skill && skill.lesson) || {};
    const example = nextProblem(skill, -1); // easier instance to demonstrate
    const steps = example.steps || [];
    let stepIdx = Math.min(1, steps.length);

    body.innerHTML = `
      <section class="enc-teach">
        <div class="enc-teach-head">🦊 Let me show you first!</div>
        ${lesson.bigIdea ? `<p class="enc-bigidea">💡 ${escapeHtml(lesson.bigIdea)}</p>` : ''}
        <div class="enc-teach-problem">${escapeHtml(example.prompt)}</div>
        ${example.visual ? `<div class="enc-teach-visual">${renderVisual(example.visual)}</div>` : ''}
        <div class="enc-teach-steps"></div>
        <div class="enc-teach-controls">
          <button class="enc-btn enc-btn-step" type="button">Next step</button>
          <button class="enc-btn enc-btn-big enc-btn-go" type="button" hidden>My turn! →</button>
        </div>
      </section>`;
    const list = body.querySelector('.enc-teach-steps');
    const stepBtn = body.querySelector('.enc-btn-step');
    const goBtn = body.querySelector('.enc-btn-go');

    const renderSteps = () => {
      list.innerHTML = steps.slice(0, stepIdx).map((s, i) =>
        `<div class="enc-sol-step"><span class="enc-ss-num">${i + 1}</span><span class="enc-ss-text">${mdInline(s.text)}</span></div>`).join('');
      if (stepIdx >= steps.length) {
        stepBtn.hidden = true; goBtn.hidden = false;
        if (!list.querySelector('.enc-sol-answer')) {
          const a = document.createElement('div');
          a.className = 'enc-sol-answer';
          a.innerHTML = `✅ So the answer is <b>${escapeHtml(example.answer)}</b>.`;
          list.appendChild(a);
        }
      } else {
        stepBtn.textContent = `Next step (${stepIdx}/${steps.length})`;
      }
    };
    renderSteps();
    if (steps.length) speak(steps[0].text);

    stepBtn.addEventListener('click', () => {
      sfx.tap(); stepIdx++; renderSteps();
      if (steps[stepIdx - 1]) speak(steps[stepIdx - 1].text);
    });
    goBtn.addEventListener('click', () => { sfx.tap(); renderChallenge(); });
    // if there were no steps to show, jump straight to "my turn"
    if (!steps.length) { stepBtn.hidden = true; goBtn.hidden = false; }
  }

  /* ---------------- CHALLENGE section (one adaptive problem) ---------------- */
  function renderChallenge() {
    // "help the character": when the NPC asks for help, pose a themed WORD problem
    // (a little story) instead of bare arithmetic; otherwise the usual adaptive problem.
    const problem = opts.wordProblem
      ? wordProblem({ skill: (skill && STRAND_TO_WORD[skill.strand]) || 'add', grade: S.profile.grade })
      : nextProblem(skill, 0);
    let wrong = 0, hintIdx = 0, answered = false, showedMe = false;

    body.innerHTML = `
      <section class="enc-challenge">
        <div class="enc-tag">${opts.wordProblem ? '🧺 Can you help?' : `🧩 ${escapeHtml(skill.title)}`}</div>
        <div class="enc-prompt">${escapeHtml(problem.prompt)}</div>
        ${problem.visual ? `<div class="enc-visual">${renderVisual(problem.visual)}</div>` : ''}
        <div class="enc-feedback" aria-live="assertive"></div>
        <div class="enc-input"></div>
        <div class="enc-actions">
          <button class="enc-btn enc-btn-hint" type="button">💡 Hint</button>
          <button class="enc-btn enc-btn-show" type="button">📖 Show me</button>
        </div>
        <div class="enc-solution" hidden></div>
      </section>`;
    speak(problem.prompt);

    const fb = body.querySelector('.enc-feedback');
    const sol = body.querySelector('.enc-solution');
    const hintBtn = body.querySelector('.enc-btn-hint');
    buildAnswer(body.querySelector('.enc-input'), problem, submit);

    hintBtn.addEventListener('click', () => {
      sfx.tap();
      const hs = problem.hints || [];
      if (!hs.length) { fb.innerHTML = `<span class="enc-fb-soft">Take your best try — you've got this! 🌟</span>`; return; }
      fb.innerHTML = `<span class="enc-fb-soft">💡 ${escapeHtml(hs[Math.min(hintIdx, hs.length - 1)])}</span>`;
      hintIdx++;
    });

    body.querySelector('.enc-btn-show').addEventListener('click', () => {
      sfx.tap();
      showedMe = true; // using "show me" means this is no longer a first try
      revealSolution();
    });

    function revealSolution() {
      sol.hidden = false;
      sol.innerHTML = `<div class="enc-sol-head">📖 Step by step</div>` +
        (problem.visual ? `<div class="enc-sol-visual">${renderVisual(problem.visual)}</div>` : '') +
        `<div class="enc-sol-steps">${(problem.steps || []).map((s, i) =>
          `<div class="enc-sol-step"><span class="enc-ss-num">${i + 1}</span><span class="enc-ss-text">${mdInline(s.text)}</span></div>`).join('')}</div>` +
        `<div class="enc-sol-answer">✅ Answer: <b>${escapeHtml(problem.answer)}</b></div>`;
    }

    function submit(raw, sourceEl) {
      if (answered) return;
      if (raw === undefined || raw === '' || raw === '?') return;

      if (problem.check(raw)) {
        answered = true;
        const firstTry = wrong === 0 && !showedMe;
        if (firstTry) resolveMistake(skillId);
        const r = recordAnswer(skillId, true, firstTry);
        sfx.correct();
        if (sourceEl) { sourceEl.classList.add('enc-correct'); sparkle(sourceEl); }
        fb.innerHTML = `<span class="enc-fb-good">✅ ${firstTry ? 'Perfect!' : 'You did it!'}</span>`;

        // reward: bonus coins on top of recordAnswer's base; XP already handled there
        const bonusCoins = firstTry ? 8 : 4;
        addCoins(bonusCoins);
        // the pet is delighted
        if (S.progress.care) {
          S.progress.care.happiness = Math.min(100, (S.progress.care.happiness || 0) + 3);
        }
        checkNewBadges();
        persist();

        if (!reducedMotion()) confetti(80);

        const result = {
          solved: true,
          firstTry,
          skillId,
          reward: { coins: (r.coinsGained || 0) + bonusCoins, xp: r.xpGained || 0 },
        };
        after(700, () => { fireDone(result); close(); });
      } else {
        wrong++;
        if (wrong === 1) noteMistake(skillId);
        recordAnswer(skillId, false, false);
        sfx.wrong();
        if (sourceEl) {
          sourceEl.classList.add('enc-wrong');
          after(600, () => sourceEl.classList.remove('enc-wrong'));
        }
        const misc = matchMisconception(problem, raw);
        if (misc && wrong <= 2) {
          fb.innerHTML = `<span class="enc-fb-soft">${mdInline(misc)}</span>`;
          if (wrong === 2) hintBtn.classList.add('enc-pulse');
        } else if (wrong === 1) {
          fb.innerHTML = `<span class="enc-fb-soft">🤔 Not yet — try again! Tap 💡 for a hint.</span>`;
        } else if (wrong === 2) {
          fb.innerHTML = `<span class="enc-fb-soft">💛 You can do it — here's a hint.</span>`;
          hintBtn.classList.add('enc-pulse');
        } else {
          fb.innerHTML = `<span class="enc-fb-soft">Let's look together — then you've got the next one! 🌱</span>`;
          showedMe = true;
          revealSolution();
        }
      }
    }
  }

  return { close };
}

/* ---------------- compact answer pad (number / fraction / text / choice) ----------------
   Self-contained re-implementation of adventure.js buildAnswer (do not import). */
function buildAnswer(host, problem, onSubmit) {
  const kind = problem.inputKind || 'number';

  if (kind === 'choice') {
    host.innerHTML = `<div class="enc-choices">${(problem.choices || []).map((c) =>
      `<button class="enc-choice" type="button" data-c="${escapeHtml(c)}">${escapeHtml(c)}</button>`).join('')}</div>`;
    host.querySelectorAll('.enc-choice').forEach((b) =>
      b.addEventListener('click', () => onSubmit(b.dataset.c, b)));
    return;
  }

  const digit = (c) => ({ l: c, v: c });
  const back = { l: '⌫', v: 'BACK', cls: 'enc-key-back' };
  const keyDefs = kind === 'fraction'
    ? [...'123456789'].map(digit).concat([{ l: '/', v: '/' }, digit('0'), { l: '␣', v: ' ', cls: 'enc-key-space' }, back])
    : kind === 'text'
    ? [...'123456789'].map(digit).concat([{ l: ':', v: ':' }, digit('0'), { l: '/', v: '/' }, { l: ',', v: ',' }, { l: '+', v: '+' }, { l: '−', v: '-' }, { l: 'r', v: 'r' }, { l: '.', v: '.' }, back])
    : [...'123456789'].map(digit).concat([{ l: '−', v: '-' }, digit('0'), { l: '.', v: '.' }, back]);

  host.innerHTML = `
    <div class="enc-display" data-empty="1">?</div>
    <div class="enc-keypad" data-kind="${kind}">${keyDefs.map((k) =>
      `<button class="enc-key ${k.cls || ''}" type="button">${k.l}</button>`).join('')}</div>
    <button class="enc-btn enc-btn-big enc-btn-check" type="button">Check ✓</button>`;
  const disp = host.querySelector('.enc-display');
  let val = '';
  const sync = () => { disp.textContent = val || '?'; disp.dataset.empty = val ? '0' : '1'; };
  host.querySelectorAll('.enc-key').forEach((b, i) => b.addEventListener('click', () => {
    sfx.tap();
    const v = keyDefs[i].v;
    val = v === 'BACK' ? val.slice(0, -1) : val + v;
    sync();
  }));
  host.querySelector('.enc-btn-check').addEventListener('click', () => onSubmit(val, disp));
}
