// views/sortstorm.js — "Sort & Storm": classify number tiles by a stated rule.
// Core cognitive-flexibility mechanic: after each round, a NEW rule appears on
// the same (or fresh) set of numbers — children must re-sort by the new criterion.
// ~6 rounds, difficulty ramps by round and by S.profile.grade.
// Reuses sprint.js structural pattern: startScreen → play → results.
import { S, persist } from '../state.js';
import { addCoins } from '../gamification.js';
import { navigate, refreshChrome } from '../ui/shell.js';
import { sfx, speak } from '../ui/sound.js';
import { confetti, popup, sparkle } from '../ui/celebrations.js';
import { escapeHtml } from '../ui/dom.js';

// ─── helpers ─────────────────────────────────────────────────────────────────

function isPrime(n) {
  if (n < 2) return false;
  if (n === 2) return true;
  if (n % 2 === 0) return false;
  for (let i = 3; i * i <= n; i += 2) if (n % i === 0) return false;
  return true;
}

// Seeded LCG RNG (lightweight, deterministic per seed)
function makeRng(seed) {
  let s = seed >>> 0;
  return function () {
    s = (Math.imul(1664525, s) + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

function randInt(rng, lo, hi) {
  return lo + Math.floor(rng() * (hi - lo + 1));
}

// ─── rule catalogue ──────────────────────────────────────────────────────────

// Each rule: { id, label, test(n), explain(n) }
function buildRules(grade) {
  const rules = [];

  // always available
  rules.push({
    id: 'even',
    label: 'EVEN numbers',
    test: (n) => n % 2 === 0,
    explain: (n) => `${n} ÷ 2 has no remainder — it's even`,
  });
  rules.push({
    id: 'odd',
    label: 'ODD numbers',
    test: (n) => n % 2 !== 0,
    explain: (n) => `${n} ÷ 2 leaves a remainder — it's odd`,
  });

  // grade 3+
  if (grade >= 3) {
    rules.push({
      id: 'mult5',
      label: 'multiples of 5',
      test: (n) => n % 5 === 0,
      explain: (n) => `${n} ÷ 5 = ${n / 5} — a multiple of 5`,
    });
    rules.push({
      id: 'mult2',
      label: 'multiples of 2',
      test: (n) => n % 2 === 0,
      explain: (n) => `${n} ÷ 2 = ${n / 2} — a multiple of 2`,
    });
  }

  // grade 4+
  if (grade >= 4) {
    rules.push({
      id: 'mult3',
      label: 'multiples of 3',
      test: (n) => n % 3 === 0,
      explain: (n) => {
        const q = Math.floor(n / 3), r = n % 3;
        return r === 0 ? `${n} ÷ 3 = ${q} — a multiple of 3` : `${n} ÷ 3 = ${q} remainder ${r} — not a multiple`;
      },
    });
    rules.push({
      id: 'mult4',
      label: 'multiples of 4',
      test: (n) => n % 4 === 0,
      explain: (n) => {
        const r = n % 4;
        return r === 0 ? `${n} ÷ 4 = ${n / 4} — a multiple of 4` : `${n} ÷ 4 leaves remainder ${r}`;
      },
    });
  }

  // grade 5+
  if (grade >= 5) {
    rules.push({
      id: 'prime',
      label: 'PRIME numbers',
      test: isPrime,
      explain: (n) => isPrime(n) ? `${n} has only 2 factors: 1 and itself` : `${n} can be divided evenly by other numbers`,
    });
    rules.push({
      id: 'mult6',
      label: 'multiples of 6',
      test: (n) => n % 6 === 0,
      explain: (n) => {
        const r = n % 6;
        return r === 0 ? `${n} ÷ 6 = ${n / 6} — a multiple of 6` : `${n} ÷ 6 leaves remainder ${r}`;
      },
    });
  }

  return rules;
}

// For "greater than N" and "less than N" rules (dynamically generated)
function gtRule(n) {
  return {
    id: `gt${n}`,
    label: `greater than ${n}`,
    test: (x) => x > n,
    explain: (x) => x > n ? `${x} > ${n} — yes!` : `${x} is not greater than ${n}`,
  };
}
function ltRule(n) {
  return {
    id: `lt${n}`,
    label: `less than ${n}`,
    test: (x) => x < n,
    explain: (x) => x < n ? `${x} < ${n} — yes!` : `${x} is not less than ${n}`,
  };
}
function betweenRule(lo, hi) {
  return {
    id: `between${lo}and${hi}`,
    label: `between ${lo} and ${hi}`,
    test: (x) => x >= lo && x <= hi,
    explain: (x) => (x >= lo && x <= hi) ? `${x} is between ${lo} and ${hi}` : `${x} is outside the range ${lo}–${hi}`,
  };
}

// ─── round config per grade + round index ────────────────────────────────────

// Returns { rule, numLo, numHi, tileCount }
function roundConfig(grade, roundIdx, rng, allRules) {
  // difficulty tier
  const tier = Math.min(2, Math.floor(roundIdx / 2)); // 0,1,2

  let numLo, numHi, tileCount, rule;

  if (grade <= 3) {
    numLo = [1, 1, 2][tier];
    numHi = [20, 30, 50][tier];
    tileCount = [9, 9, 12][tier];
    const pool = allRules.filter((r) => ['even', 'odd', 'mult2', 'mult5'].includes(r.id));
    const base = pool[Math.floor(rng() * pool.length)];
    // mix gt/lt rules in later rounds
    if (tier >= 1 && rng() < 0.4) {
      const pivot = randInt(rng, 10, 25);
      rule = rng() < 0.5 ? gtRule(pivot) : ltRule(pivot);
    } else {
      rule = base;
    }
  } else if (grade === 4) {
    numLo = [1, 5, 10][tier];
    numHi = [50, 80, 100][tier];
    tileCount = [9, 12, 12][tier];
    const pool = allRules.filter((r) => ['even', 'odd', 'mult3', 'mult4', 'mult5'].includes(r.id));
    if (tier >= 1 && rng() < 0.35) {
      const pivot = randInt(rng, 20, 60);
      rule = rng() < 0.5 ? gtRule(pivot) : ltRule(pivot);
    } else {
      rule = pool[Math.floor(rng() * pool.length)];
    }
  } else {
    // grade 5+
    numLo = [2, 5, 10][tier];
    numHi = [60, 100, 150][tier];
    tileCount = [9, 12, 12][tier];
    const pool = allRules; // all rules including prime, mult6
    if (tier === 2 && rng() < 0.4) {
      const lo = randInt(rng, 10, 40);
      const hi = lo + randInt(rng, 15, 40);
      rule = betweenRule(lo, hi);
    } else {
      rule = pool[Math.floor(rng() * pool.length)];
    }
  }

  return { rule, numLo, numHi, tileCount };
}

// ─── tile generation ─────────────────────────────────────────────────────────

// Generate tileCount numbers in [lo,hi] with a good mix of matches + near-misses.
function generateTiles(rule, numLo, numHi, tileCount, rng) {
  const candidates = [];
  for (let n = numLo; n <= numHi; n++) candidates.push(n);

  const matches = candidates.filter(rule.test);
  const nonMatches = candidates.filter((n) => !rule.test(n));

  // aim for ~35–50% matching tiles (feels fair, not too easy)
  const targetMatches = Math.max(2, Math.round(tileCount * 0.38));
  const targetNonMatches = tileCount - targetMatches;

  // shuffle + pick
  const shuffle = (arr) => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  const pickedMatches = shuffle(matches).slice(0, targetMatches);
  const pickedNon = shuffle(nonMatches).slice(0, targetNonMatches);

  // if not enough, fill remainder from remaining candidates
  const all = shuffle([...pickedMatches, ...pickedNon]);

  // pad if needed (rare edge case for small ranges)
  while (all.length < tileCount) {
    const extra = shuffle(candidates).find((n) => !all.includes(n));
    if (extra !== undefined) all.push(extra);
    else break;
  }

  return shuffle(all.slice(0, tileCount));
}

// ─── main export ─────────────────────────────────────────────────────────────

const TOTAL_ROUNDS = 6;

export function renderSortStorm(root) {
  const grade = (S && S.profile && S.profile.grade) ? S.profile.grade : 3;
  const allRules = buildRules(grade);

  // Use date-seeded RNG so tiles are reproducible within a day but vary daily
  const today = new Date();
  const dateSeed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  const sessionRng = makeRng(dateSeed ^ (grade * 7919));

  let timer = null;
  const clear = () => { if (timer) { clearInterval(timer); timer = null; } };

  // ── start screen ─────────────────────────────────────────────────────────

  function startScreen() {
    clear();
    const best = (S && S.progress && S.progress.sortBest) ? S.progress.sortBest : 0;
    root.innerHTML = `
      <div class="sprint-wrap ss-wrap">
        <header class="sprint-top">
          <button class="btn-ghost" id="ss-back" aria-label="Back to map">← Map</button>
        </header>
        <div class="sprint-intro card-soft ss-intro">
          <div class="sprint-emoji">🌩️</div>
          <h1>Sort &amp; Storm</h1>
          <p>A rule appears — tap every number that matches it!<br>
             After each round the rule <em>changes</em> — stay sharp! ⚡</p>
          <div class="sprint-best ss-best">🏆 Your best: <b>${escapeHtml(String(best))}</b> pts</div>
          <button class="btn btn-big btn-play" id="ss-start">Let's go! 🌩️</button>
        </div>
      </div>`;
    root.querySelector('#ss-back').addEventListener('click', () => { clear(); navigate('#/'); });
    root.querySelector('#ss-start').addEventListener('click', () => { sfx.tap(); play(); });
  }

  // ── gameplay ──────────────────────────────────────────────────────────────

  function play() {
    let totalScore = 0;
    let roundIdx = 0;
    // pre-generate configs for all rounds so the RNG sequence is stable
    const rounds = [];
    const configRng = makeRng(dateSeed ^ 0xBEEF ^ (grade * 31));
    for (let i = 0; i < TOTAL_ROUNDS; i++) {
      rounds.push(roundConfig(grade, i, configRng, allRules));
    }

    function playRound() {
      if (roundIdx >= TOTAL_ROUNDS) { results(totalScore); return; }

      const { rule, numLo, numHi, tileCount } = rounds[roundIdx];
      const tileRng = makeRng(dateSeed ^ (roundIdx * 137) ^ (grade * 53));
      const numbers = generateTiles(rule, numLo, numHi, tileCount, tileRng);
      const selected = new Set(); // indices of tapped tiles
      let roundOver = false;

      // auto-advance timer (10 s per round — soft, not punishing)
      const ROUND_SECS = 10;
      let remaining = ROUND_SECS;

      root.innerHTML = `
        <div class="sprint-wrap ss-wrap">
          <header class="sprint-top">
            <button class="btn-ghost" id="ss-quit" aria-label="Quit game">← Map</button>
            <div class="ss-progress" aria-label="Round ${roundIdx + 1} of ${TOTAL_ROUNDS}">
              ${Array.from({ length: TOTAL_ROUNDS }, (_, i) =>
                `<span class="ss-dot${i < roundIdx ? ' ss-dot-done' : i === roundIdx ? ' ss-dot-cur' : ''}" aria-hidden="true"></span>`
              ).join('')}
            </div>
            <span class="ss-score-hud" aria-live="polite">⭐ <b id="ss-score">${totalScore}</b></span>
          </header>

          <div class="ss-rule-banner" role="status" aria-live="polite">
            <span class="ss-round-label">Round ${roundIdx + 1} of ${TOTAL_ROUNDS}</span>
            <div class="ss-rule-text" id="ss-rule">Tap the <strong>${escapeHtml(rule.label)}</strong></div>
          </div>

          <div class="ss-timer-bar" aria-hidden="true">
            <div class="ss-timer-fill" id="ss-tfill" style="width:100%"></div>
          </div>
          <span class="ss-timer-label" id="ss-tlabel" role="timer" aria-label="${remaining} seconds">${remaining}s</span>

          <div class="ss-grid" id="ss-grid" role="group" aria-label="Number tiles"></div>

          <div class="ss-actions">
            <button class="btn btn-big btn-play ss-submit" id="ss-submit">Done! ✓</button>
          </div>
        </div>`;

      const grid = root.querySelector('#ss-grid');
      const scoreEl = root.querySelector('#ss-score');
      const tFill = root.querySelector('#ss-tfill');
      const tLabel = root.querySelector('#ss-tlabel');

      // render tiles
      numbers.forEach((n, idx) => {
        const btn = document.createElement('button');
        btn.className = 'ss-tile';
        btn.dataset.idx = String(idx);
        btn.dataset.n = String(n);
        btn.setAttribute('aria-label', `${n} — tap to select`);
        btn.setAttribute('aria-pressed', 'false');
        btn.textContent = String(n);
        btn.addEventListener('click', () => onTileTap(btn, idx, n));
        grid.appendChild(btn);
      });

      root.querySelector('#ss-quit').addEventListener('click', () => { clear(); navigate('#/'); });
      root.querySelector('#ss-submit').addEventListener('click', () => {
        if (!roundOver) endRound();
      });

      // round timer — self-clears when DOM detaches
      timer = setInterval(() => {
        if (!document.body.contains(tFill)) { clear(); return; }
        remaining--;
        tFill.style.width = Math.max(0, (remaining / ROUND_SECS) * 100) + '%';
        tLabel.textContent = remaining + 's';
        tLabel.setAttribute('aria-label', `${remaining} seconds`);
        if (remaining <= 0) { clear(); if (!roundOver) endRound(); }
      }, 1000);

      function onTileTap(btn, idx, n) {
        if (roundOver) return;
        if (selected.has(idx)) {
          // deselect
          selected.delete(idx);
          btn.classList.remove('ss-tile-sel');
          btn.setAttribute('aria-pressed', 'false');
          btn.setAttribute('aria-label', `${n} — tap to select`);
          sfx.tap();
        } else {
          selected.add(idx);
          btn.classList.add('ss-tile-sel');
          btn.setAttribute('aria-pressed', 'true');
          btn.setAttribute('aria-label', `${n} — selected`);
          sfx.tap();
          // immediate sparkle for correct taps
          if (rule.test(n)) {
            sparkle(btn);
          } else {
            btn.classList.add('ss-tile-wrong-shake');
            setTimeout(() => btn.classList.remove('ss-tile-wrong-shake'), 600);
          }
        }
      }

      function endRound() {
        roundOver = true;
        clear();

        const tiles = grid.querySelectorAll('.ss-tile');
        let roundScore = 0;

        tiles.forEach((btn, idx) => {
          const n = numbers[idx];
          const isMatch = rule.test(n);
          const wasSel = selected.has(idx);

          btn.disabled = true;
          btn.classList.remove('ss-tile-sel', 'ss-tile-wrong-shake');

          if (isMatch && wasSel) {
            // correct selection ✓
            btn.classList.add('ss-tile-correct');
            btn.setAttribute('aria-label', `${n} — correct! ✓`);
            btn.innerHTML = `${n}<span class="ss-tile-icon" aria-hidden="true">✓</span>`;
            roundScore++;
          } else if (!isMatch && wasSel) {
            // wrong selection ✗
            btn.classList.add('ss-tile-missed');
            btn.setAttribute('aria-label', `${n} — not a match ✗`);
            btn.innerHTML = `${n}<span class="ss-tile-icon" aria-hidden="true">✗</span>`;
            btn.title = rule.explain(n);
            roundScore = Math.max(0, roundScore - 1);
          } else if (isMatch && !wasSel) {
            // missed a match — gentle amber highlight
            btn.classList.add('ss-tile-missed-match');
            btn.setAttribute('aria-label', `${n} — you missed this one`);
            btn.innerHTML = `${n}<span class="ss-tile-icon" aria-hidden="true">~</span>`;
          }
          // non-match not selected = correct non-action, no change
        });

        // floor at 0 per round
        roundScore = Math.max(0, roundScore);
        totalScore += roundScore;
        if (scoreEl) scoreEl.textContent = totalScore;

        sfx.star();

        // brief pause, then next round
        const pause = setTimeout(() => {
          if (!document.body.contains(grid)) { clearTimeout(pause); return; }
          roundIdx++;
          playRound();
        }, 2000);
      }
    }

    playRound();
  }

  // ── results ───────────────────────────────────────────────────────────────

  function results(score) {
    const best = (S && S.progress && S.progress.sortBest != null) ? S.progress.sortBest : 0;
    const isBest = score > best;
    if (isBest) {
      if (S && S.progress) S.progress.sortBest = score;
      persist();
    }
    const coins = Math.max(5, Math.min(40, score * 3));
    addCoins(coins);
    persist();
    refreshChrome();

    if (isBest && score > 0) confetti(140);

    root.innerHTML = `
      <div class="sprint-wrap ss-wrap">
        <div class="sprint-intro card-soft ss-intro">
          <div class="sprint-emoji">${isBest && score > 0 ? '🏆' : '🌩️'}</div>
          <h1>${isBest && score > 0 ? 'New Best!' : 'Storm cleared!'}</h1>
          <div class="sprint-final ss-final-score">${score}</div>
          <p class="muted">points scored · 🏆 best ${(S && S.progress && S.progress.sortBest) || 0} · +${coins} 🪙</p>
          <button class="btn btn-big btn-play" id="ss-again">Play again 🔁</button>
          <button class="btn-link" id="ss-done">Back to map</button>
        </div>
      </div>`;

    sfx.level();
    speak(isBest && score > 0 ? 'New best score! Amazing!' : 'Great sorting!');

    root.querySelector('#ss-again').addEventListener('click', () => { sfx.tap(); play(); });
    root.querySelector('#ss-done').addEventListener('click', () => { sfx.tap(); navigate('#/'); });
  }

  startScreen();
}
