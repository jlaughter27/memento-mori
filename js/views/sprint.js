// views/sprint.js — "Math Sprint": a 60-second fact-fluency mini-game.
// Beat-your-own-best (no countdown penalty, no social comparison) — per the
// minigames research: timers are safe when framed as self-competition.
import { S, persist } from '../state.js';
import { nextProblem } from '../engine/index.js';
import { addCoins } from '../gamification.js';
import { navigate, refreshChrome } from '../ui/shell.js';
import { sfx, speak } from '../ui/sound.js';
import { confetti, popup, sparkle } from '../ui/celebrations.js';
import { escapeHtml, fitText } from '../ui/dom.js';

const DURATION = 60; // seconds
// quick mental-math pool, lightly tuned to the child's grade (fact fluency, not busywork)
function poolForGrade(grade) {
  const base = [
    { practice: { type: 'add', params: { digits: 2, regroup: false, terms: 2 } } },
    { practice: { type: 'sub', params: { digits: 2, regroup: false } } },
    { practice: { type: 'mult', params: { aDigits: 1, bDigits: 1 } } },
  ];
  if (grade <= 2) return [{ practice: { type: 'add', params: { digits: 1, terms: 2 } } }, { practice: { type: 'sub', params: { digits: 1 } } }, ...base.slice(0, 2)];
  if (grade >= 4) base.push({ practice: { type: 'div', params: { dividendDigits: 2, divisor: 4, remainder: false } } });
  if (grade >= 5) base.push({ practice: { type: 'mult', params: { aDigits: 2, bDigits: 1 } } });
  return base;
}

export function renderSprint(root) {
  const POOL = poolForGrade(S.profile.grade || 3);
  let timer = null;
  const clear = () => { if (timer) { clearInterval(timer); timer = null; } };

  function startScreen() {
    clear();
    root.innerHTML = `
      <div class="sprint-wrap">
        <div class="sprint-intro card-soft">
          <div class="sprint-emoji">⚡</div>
          <h1>Math Sprint</h1>
          <p>How many can you solve in <b>${DURATION} seconds</b>? Beat your own best!</p>
          <div class="sprint-best">🏆 Your best: <b>${S.progress.sprintBest || 0}</b></div>
          <button class="btn btn-big btn-play" id="sprint-start">Start! 🚀</button>
        </div>
      </div>`;
    root.querySelector('#sprint-start').addEventListener('click', () => { sfx.tap(); countdown(); });
  }

  function countdown() {
    let n = 3;
    root.innerHTML = `<div class="sprint-wrap"><div class="sprint-count" id="sprint-count">${n}</div></div>`;
    const el = root.querySelector('#sprint-count');
    sfx.tap();
    const pop = () => { el.classList.remove('pop-in'); void el.offsetWidth; el.classList.add('pop-in'); };
    timer = setInterval(() => {
      if (!document.body.contains(el)) { clear(); return; } // navigated away
      n--;
      if (n === 0) { el.textContent = 'GO!'; pop(); sfx.star(); }
      else if (n < 0) { clear(); play(); }
      else { el.textContent = n; pop(); sfx.tap(); }
    }, 700);
  }

  function play() {
    let score = 0, remaining = DURATION, cur = null, val = '';
    root.innerHTML = `
      <div class="sprint-wrap sprint-game">
        <div class="sprint-hud">
          <span class="sprint-score" aria-live="polite" aria-atomic="true">⚡ <b id="s-score">0</b></span>
          <div class="sprint-timebar" aria-hidden="true"><div class="sprint-timefill" id="s-time"></div></div>
          <span class="sprint-clock" id="s-clock" role="timer" aria-label="${remaining} seconds left">${remaining}</span>
        </div>
        <div class="sprint-problem" id="s-prob"></div>
        <div class="answer-display sprint-ans" id="s-ans" data-empty="1">?</div>
        <div class="keypad" data-kind="number" id="s-pad"></div>
      </div>`;
    const scoreEl = root.querySelector('#s-score');
    const clockEl = root.querySelector('#s-clock');
    const timeFill = root.querySelector('#s-time');
    const probEl = root.querySelector('#s-prob');
    const ansEl = root.querySelector('#s-ans');
    const pad = root.querySelector('#s-pad');
    const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '⌫', '0', ''];
    pad.innerHTML = keys.map((k) => k ? `<button class="key ${k === '⌫' ? 'key-back' : ''}">${k}</button>` : '<span></span>').join('');

    const answerNum = () => Number(String(cur.answer).replace(/[^\d-]/g, ''));
    function nextProb() {
      cur = nextProblem(POOL[Math.floor(Math.random() * POOL.length)], 0);
      val = ''; ansEl.textContent = '?'; ansEl.dataset.empty = '1';
      probEl.textContent = cur.prompt.replace(/\s*=\s*\?$/, '');
    }
    function sync() { ansEl.textContent = val || '?'; ansEl.dataset.empty = val ? '0' : '1'; fitText(ansEl); }
    function tryAnswer() {
      if (val !== '' && Number(val) === answerNum()) {
        score++; scoreEl.textContent = score; sfx.correct(); sparkle(ansEl);
        nextProb();
      }
    }
    pad.querySelectorAll('.key').forEach((b) => b.addEventListener('click', () => {
      sfx.tap();
      const k = b.textContent;
      if (k === '⌫') val = val.slice(0, -1);
      else if (val.length < 4) val += k;
      sync(); tryAnswer();
    }));
    const keyHandler = (e) => {
      if (e.key === 'Backspace') { val = val.slice(0, -1); sync(); }
      else if (/^[0-9]$/.test(e.key) && val.length < 4) { val += e.key; sync(); tryAnswer(); }
    };
    document.addEventListener('keydown', keyHandler);

    nextProb();
    timer = setInterval(() => {
      if (!document.body.contains(clockEl)) { clear(); document.removeEventListener('keydown', keyHandler); return; } // navigated away mid-game
      remaining--;
      clockEl.textContent = remaining;
      timeFill.style.width = (remaining / DURATION * 100) + '%';
      if (remaining <= 5) clockEl.classList.add('low');
      if (remaining <= 0) { clear(); document.removeEventListener('keydown', keyHandler); results(score); }
    }, 1000);
  }

  function results(score) {
    const best = S.progress.sprintBest || 0;
    const isBest = score > best;
    if (isBest) { S.progress.sprintBest = score; }
    const coins = Math.min(30, score * 2);
    addCoins(coins); persist(); refreshChrome();
    if (isBest && score > 0) confetti(140);
    root.innerHTML = `
      <div class="sprint-wrap">
        <div class="sprint-intro card-soft">
          <div class="sprint-emoji">${isBest && score > 0 ? '🏆' : '⚡'}</div>
          <h1>${isBest && score > 0 ? 'New Best!' : 'Time!'}</h1>
          <div class="sprint-final">${score}</div>
          <p class="muted">problems solved · 🏆 best ${S.progress.sprintBest} · +${coins} 🪙</p>
          <button class="btn btn-big btn-play" id="sprint-again">Play again 🔁</button>
          <button class="btn-link" id="sprint-done">Back to map</button>
        </div>
      </div>`;
    sfx.level(); speak(isBest && score > 0 ? 'New best score!' : 'Time is up!');
    root.querySelector('#sprint-again').addEventListener('click', () => { sfx.tap(); countdown(); });
    root.querySelector('#sprint-done').addEventListener('click', () => { sfx.tap(); navigate('#/'); });
  }

  startScreen();
}
