// views/practice.js — the core practice loop (skill practice + daily quiz).
import { S, skillRec } from '../state.js';
import { getSkill, skillsForGrade } from '../curriculum/index.js';
import { nextProblem } from '../engine/index.js';
import {
  recordAnswer, masterSkill, checkNewBadges, PRAISE, pickPraise,
} from '../gamification.js';
import { mountMascot, foxLine } from '../ui/mascot.js';
import { renderVisual } from '../ui/manipulatives.js';
import { navigate, refreshChrome } from '../ui/shell.js';
import { sfx, speak } from '../ui/sound.js';
import { confetti, popup, floatText, sparkle } from '../ui/celebrations.js';
import { showBadges } from './rewards.js';
import { escapeHtml, nl2br } from '../ui/dom.js';
import { isUnlocked } from '../state.js';

/* ---------------- entry points ---------------- */
export function renderPractice(root, id) {
  const skill = getSkill(id);
  if (!skill) { navigate('#/'); return; }
  const goal = (skill.practice && skill.practice.count) || 5;
  startSession(root, {
    title: `${skill.emoji || ''} ${skill.title}`,
    subtitle: 'Practice',
    goal,
    getNext: () => ({ problem: nextProblem(skill), skillId: skill.id }),
    onComplete: (stats) => finishSkill(skill, stats),
  });
}

export function renderPlay(root) {
  const grade = S.profile.grade;
  let pool = skillsForGrade(grade).filter((s) => isUnlocked(s));
  if (!pool.length) pool = skillsForGrade(grade);
  if (!pool.length) { navigate('#/'); return; }
  const goal = 8;
  startSession(root, {
    title: '⚡ Daily Challenge',
    subtitle: `Grade ${grade} mix`,
    goal,
    getNext: () => {
      const s = pool[Math.floor(Math.random() * pool.length)];
      return { problem: nextProblem(s), skillId: s.id };
    },
    onComplete: (stats) => finishQuiz(stats),
  });
}

/* ---------------- the session runner ---------------- */
function startSession(root, { title, subtitle, goal, getNext, onComplete }) {
  const sess = { goal, cleared: 0, distinct: 0, firstTryCorrect: 0, coins: 0, xp: 0 };
  let cur = null, curSkillId = null, wrongOnCur = 0, hintIdx = 0, solxIdx = 0, answered = false, sessionOver = false;

  root.innerHTML = `
    <div class="practice-wrap">
      <header class="practice-top">
        <button class="btn-ghost" id="prac-back">← Map</button>
        <div class="prac-title">${title}<span class="prac-sub">${subtitle}</span></div>
        <div class="prac-progress" id="prac-pips"></div>
      </header>
      <div class="practice-mascot" id="prac-mascot"></div>
      <div class="problem-card card-soft" id="problem-card"></div>
      <div class="answer-area" id="answer-area"></div>
      <div class="practice-actions">
        <button class="btn btn-hint" id="hint-btn">💡 Hint</button>
        <button class="btn btn-show" id="show-btn">📖 Show me how</button>
      </div>
      <div class="solution-panel" id="solution-panel" hidden></div>
    </div>`;

  const mascot = mountMascot(root.querySelector('#prac-mascot'), { mood: 'happy', say: foxLine('start'), size: 84 });
  const pips = root.querySelector('#prac-pips');
  const card = root.querySelector('#problem-card');
  const ansArea = root.querySelector('#answer-area');
  const hintBtn = root.querySelector('#hint-btn');
  const showBtn = root.querySelector('#show-btn');
  const solPanel = root.querySelector('#solution-panel');
  root.querySelector('#prac-back').addEventListener('click', () => navigate('#/'));

  function drawPips() {
    pips.innerHTML = Array.from({ length: goal }, (_, i) =>
      `<span class="pip ${i < sess.cleared ? 'done' : ''}"></span>`).join('');
  }

  function load() {
    const n = getNext();
    cur = n.problem; curSkillId = n.skillId;
    wrongOnCur = 0; hintIdx = 0; solxIdx = 0; answered = false;
    sess.distinct++;
    drawPips();
    card.classList.remove('pop-in'); void card.offsetWidth; card.classList.add('pop-in');
    card.innerHTML = `
      <div class="problem-prompt">${escapeHtml(cur.prompt)}</div>
      ${cur.visual ? `<div class="problem-visual">${renderVisual(cur.visual)}</div>` : ''}
      <div class="feedback" id="feedback"></div>`;
    solPanel.hidden = true; solPanel.innerHTML = '';
    showBtn.classList.remove('pulse');
    buildInput();
    speak(cur.prompt);
  }

  /* ---- input controllers ---- */
  function buildInput() {
    const kind = cur.inputKind || 'number';
    if (kind === 'choice') return buildChoice();
    ansArea.innerHTML = `
      <div class="answer-display" id="ans-display" data-empty="1">?</div>
      <div class="keypad" id="keypad"></div>
      <button class="btn btn-big btn-check" id="check-btn">Check ✓</button>`;
    const display = ansArea.querySelector('#ans-display');
    const keypad = ansArea.querySelector('#keypad');
    const keys = kind === 'fraction'
      ? ['1','2','3','4','5','6','7','8','9','/','0','⌫']
      : kind === 'text'
      ? ['1','2','3','4','5','6','7','8','9',':','0','/', ',','+','-','r','.','⌫']
      : ['1','2','3','4','5','6','7','8','9','-','0','.','⌫'];
    keypad.dataset.kind = kind;
    keypad.innerHTML = keys.map((k) =>
      `<button class="key ${k === '⌫' ? 'key-back' : ''}">${k}</button>`).join('');
    let val = '';
    const sync = () => { display.textContent = val || '?'; display.dataset.empty = val ? '0' : '1'; };
    keypad.querySelectorAll('.key').forEach((b) => b.addEventListener('click', () => {
      if (answered) return;
      sfx.tap();
      const k = b.textContent;
      if (k === '⌫') val = val.slice(0, -1);
      else if (k === ' ') val += ' ';
      else val += k;
      sync();
    }));
    ansArea.querySelector('#check-btn').addEventListener('click', () => check(val));
    // physical keyboard support
    ansArea._keyHandler && document.removeEventListener('keydown', ansArea._keyHandler);
    ansArea._keyHandler = (e) => {
      if (answered) return;
      if (e.key === 'Enter') { check(val); }
      else if (e.key === 'Backspace') { val = val.slice(0, -1); sync(); }
      else if (/^[0-9./\- :,+r]$/.test(e.key)) { val += e.key; sync(); }
    };
    document.addEventListener('keydown', ansArea._keyHandler);
    cur._getVal = () => val;
  }
  function buildChoice() {
    ansArea.innerHTML = `<div class="choices">${cur.choices.map((c) =>
      `<button class="choice-btn" data-c="${escapeHtml(c)}">${escapeHtml(c)}</button>`).join('')}</div>`;
    ansArea.querySelectorAll('.choice-btn').forEach((b) =>
      b.addEventListener('click', () => { if (!answered) check(b.dataset.c, b); }));
  }

  /* ---- checking ---- */
  function check(raw, sourceEl) {
    if (answered || sessionOver) return;
    if (raw === undefined || raw === '' || raw === '?') { mascot.setSay('Type your answer first! 😊', 'idle'); return; }
    const correct = !!cur.check(raw);
    const fb = card.querySelector('#feedback');
    if (correct) {
      answered = true;
      const firstTry = wrongOnCur === 0;
      if (firstTry) sess.firstTryCorrect++;
      sess.cleared++;
      const r = recordAnswer(curSkillId, true, firstTry);
      sess.coins += r.coinsGained; sess.xp += r.xpGained;
      sfx.correct(); if (r.surprise) setTimeout(() => sfx.coin(), 180);
      const praise = wrongOnCur > 0 ? pickPraise(PRAISE.correctAfterStruggle) : pickPraise(PRAISE.correct);
      fb.innerHTML = `<span class="fb-good">${praise}${r.surprise ? ' <b>Bonus coins!</b> 🪙' : ''}</span>`;
      mascot.setSay(foxLine('correct'), 'celebrate');
      flyReward(r.xpGained, r.coinsGained + (r.surprise ? 0 : 0), sourceEl);
      if (sourceEl) { sourceEl.classList.add('correct'); sparkle(sourceEl); }
      drawPips();
      const fresh = checkNewBadges(); refreshChrome();
      const after = () => {
        if (sessionOver) return;
        if (sess.cleared >= goal) { sessionOver = true; onComplete(sess); }
        else load();
      };
      if (r.leveledUp) {
        setTimeout(() => popup({ emoji: '⬆️', title: `Level ${r.newLevel}!`, sub: 'You\'re getting stronger!', sound: 'level' }), 400);
      }
      setTimeout(() => { if (fresh.length) showBadges(fresh, after); else after(); }, r.leveledUp ? 1500 : 950);
    } else {
      wrongOnCur++;
      recordAnswer(curSkillId, false, false);
      sfx.wrong();
      if (sourceEl) { sourceEl.classList.add('wrong'); setTimeout(() => sourceEl.classList.remove('wrong'), 600); }
      const disp = ansArea.querySelector('#ans-display');
      if (disp) { disp.classList.remove('shake'); void disp.offsetWidth; disp.classList.add('shake'); }
      if (wrongOnCur === 1) {
        fb.innerHTML = `<span class="fb-soft">${pickPraise(PRAISE.wrong1)}</span>`;
        mascot.setSay(foxLine('encourage'), 'encourage');
      } else if (wrongOnCur === 2) {
        fb.innerHTML = `<span class="fb-soft">${pickPraise(PRAISE.wrong2)}</span>`;
        mascot.setSay('Tap 💡 Hint or 📖 Show me how — I\'ll help!', 'think');
        hintBtn.classList.add('pulse'); showBtn.classList.add('pulse');
      } else {
        // after 3 tries, reveal the worked solution, then a fresh similar problem
        fb.innerHTML = `<span class="fb-soft">Let's look at it together. You'll get the next one! 💪</span>`;
        revealSolution(true);
        answered = true;
        const nextBtn = document.createElement('button');
        nextBtn.className = 'btn btn-big';
        nextBtn.textContent = 'Try a new one →';
        nextBtn.addEventListener('click', () => load());
        solPanel.appendChild(nextBtn);
      }
    }
  }

  function flyReward(xp, coins, srcEl) {
    const rect = (srcEl || card).getBoundingClientRect();
    const x = rect.left + rect.width / 2, y = rect.top + 20;
    if (xp) floatText(`+${xp} XP`, x - 30, y, 'xp');
    if (coins) floatText(`+${coins} 🪙`, x + 30, y, 'coin');
  }

  /* ---- hints + solution ---- */
  hintBtn.addEventListener('click', () => {
    sfx.tap(); hintBtn.classList.remove('pulse');
    const hints = cur.hints || [];
    if (!hints.length) { mascot.setSay('Try breaking it into smaller steps!', 'think'); return; }
    const h = hints[Math.min(hintIdx, hints.length - 1)];
    hintIdx++;
    mascot.setSay(h, 'think');
  });
  showBtn.addEventListener('click', () => { sfx.tap(); showBtn.classList.remove('pulse'); revealSolution(false); });

  function revealSolution(full) {
    const steps = cur.steps || [];
    solPanel.hidden = false;
    solPanel.innerHTML = `<div class="sol-head">📖 Step by step</div>`;
    const list = document.createElement('div');
    list.className = 'sol-steps';
    solPanel.appendChild(list);
    let shown = 0;
    const showNext = () => {
      if (shown >= steps.length) return;
      const s = steps[shown];
      const node = document.createElement('div');
      node.className = 'sol-step slide-in';
      node.innerHTML = `<span class="ss-num">${shown + 1}</span><span class="ss-text">${nl2br(s.text)}</span>`;
      list.appendChild(node);
      speak(s.text);
      shown++;
      if (shown < steps.length) {
        moreBtn.hidden = false;
        moreBtn.textContent = `Next step (${shown}/${steps.length})`;
      } else {
        moreBtn.hidden = true;
        const ans = document.createElement('div');
        ans.className = 'sol-answer';
        ans.innerHTML = `✅ Answer: <b>${escapeHtml(cur.answer)}</b>`;
        solPanel.appendChild(ans);
      }
    };
    const moreBtn = document.createElement('button');
    moreBtn.className = 'btn btn-ghost sol-more';
    moreBtn.addEventListener('click', showNext);
    solPanel.appendChild(moreBtn);
    if (full) { while (shown < steps.length) showNext(); }
    else showNext();
    if (solPanel.scrollIntoView) solPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  load();
}

/* ---------------- completion handlers ---------------- */
function finishSkill(skill, sess) {
  const accuracy = sess.distinct ? sess.firstTryCorrect / sess.distinct : 1;
  const res = masterSkill(skill.id, accuracy);
  skillRec(skill.id).lessonDone = true;
  const fresh = checkNewBadges();
  refreshChrome();
  const starStr = '⭐'.repeat(res.stars) + '☆'.repeat(3 - res.stars);
  confetti(140);
  popup({
    emoji: res.stars === 3 ? '🏆' : '🎉',
    title: res.firstTime ? 'Skill Mastered!' : 'Great practice!',
    sub: `${starStr}\n+${res.xp} XP · +${res.coins} 🪙`,
    sound: 'level', hold: true,
    confetti: false,
  });
  const goMap = () => navigate('#/');
  setTimeout(() => { if (fresh.length) showBadges(fresh, goMap); }, 300);
}

function finishQuiz(sess) {
  const fresh = checkNewBadges();
  refreshChrome();
  confetti(120);
  popup({
    emoji: '⚡', title: 'Challenge Complete!',
    sub: `You cleared ${sess.cleared} problems!\n+${sess.xp} XP · +${sess.coins} 🪙`,
    sound: 'level', hold: true, confetti: false,
  });
  setTimeout(() => { if (fresh.length) showBadges(fresh, () => navigate('#/')); }, 300);
}
