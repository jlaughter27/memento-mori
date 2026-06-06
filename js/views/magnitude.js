// views/magnitude.js — "Magnitude Match": number-line estimation mini-game.
// Research basis: Siegler & Ramani (2008) linear number line builds mental magnitude.
// Round-based (8 rounds, no timer); scored by closeness — no "wrong" state.
// Keyboard: Left/Right arrows move pin, Enter/Space confirms placement.
import { S, persist } from '../state.js';
import { addCoins } from '../gamification.js';
import { navigate, refreshChrome } from '../ui/shell.js';
import { sfx, speak } from '../ui/sound.js';
import { confetti, popup, sparkle } from '../ui/celebrations.js';
import { escapeHtml } from '../ui/dom.js';

const ROUNDS = 8;

// Stage config: { lo, hi, labels, desc }
// labels: array of values that get tick+label on the number line
function stageForGrade(grade) {
  if (grade <= 3) return { lo: 0, hi: 100,  labels: [0, 25, 50, 75, 100],  desc: '0 – 100'  };
  if (grade <= 5) return { lo: 0, hi: 1000, labels: [0, 250, 500, 750, 1000], desc: '0 – 1,000' };
  return             { lo: 0, hi: 1000, labels: [0, 500, 1000],              desc: '0 – 1,000' };
}

// Simple seeded LCG so we can generate reproducible targets within a session.
function mkRng(seed) {
  let s = seed >>> 0;
  return () => { s = (Math.imul(1664525, s) + 1013904223) >>> 0; return s / 0xFFFFFFFF; };
}

// Generate `n` distinct integers in [lo+offset, hi-offset], avoiding endpoints.
function makeTargets(rng, lo, hi, n) {
  const margin = Math.max(1, Math.round((hi - lo) * 0.05));
  const targets = [];
  const used = new Set();
  let attempts = 0;
  while (targets.length < n && attempts < n * 40) {
    attempts++;
    const v = Math.round(lo + margin + rng() * (hi - lo - margin * 2));
    if (!used.has(v)) { used.add(v); targets.push(v); }
  }
  return targets;
}

// Return a score 0-100 based on how close the guess is.
function calcScore(placed, target, lo, hi) {
  const range = hi - lo;
  const err = Math.abs(placed - target) / range; // 0..1
  return Math.max(0, Math.round(100 * (1 - err / 0.2))); // full marks ≤0%, 0 at ≥20% error
}

// Growth-mindset feedback based on error percentage.
function feedbackMsg(err01) {
  if (err01 <= 0.02) return 'Perfect! Right on target! 🎯';
  if (err01 <= 0.05) return 'Amazing estimate! So close! ⭐';
  if (err01 <= 0.10) return 'Really good — you\'re getting it! 🌟';
  if (err01 <= 0.18) return 'Nice try — check where it landed! 👍';
  return 'Keep estimating — you\'ll nail it! 💪';
}

export function renderMagnitude(root) {
  const stage   = stageForGrade(S.profile.grade || 3);
  const rng     = mkRng(Date.now() ^ 0xDEADBEEF);
  const targets = makeTargets(rng, stage.lo, stage.hi, ROUNDS);
  let roundIdx  = 0;
  let totalScore = 0;

  // ── Start screen ────────────────────────────────────────────────────────────
  function startScreen() {
    const best = S.progress.magnitudeBest || 0;
    root.innerHTML = `
      <div class="sprint-wrap">
        <header class="sprint-top">
          <button class="btn-ghost" id="mag-back">← Map</button>
        </header>
        <div class="sprint-intro card-soft">
          <div class="sprint-emoji" aria-hidden="true">📏</div>
          <h1>Magnitude Match</h1>
          <p>Place the number on the number line!<br>
             <span class="muted">Range: <b>${escapeHtml(stage.desc)}</b> · ${ROUNDS} rounds</span></p>
          <div class="sprint-best" aria-label="Your best score: ${best}">
            🏆 Your best: <b>${best}</b>
          </div>
          <button class="btn btn-big btn-play" id="mag-start">Let's go! 🚀</button>
        </div>
      </div>`;
    root.querySelector('#mag-back').addEventListener('click', () => navigate('#/'));
    root.querySelector('#mag-start').addEventListener('click', () => { sfx.tap(); playRound(); });
  }

  // ── One round ────────────────────────────────────────────────────────────────
  function playRound() {
    const target = targets[roundIdx];
    const { lo, hi, labels } = stage;
    // Pin state: fraction 0–1 of the line (starts at midpoint)
    let pinFrac = 0.5;
    let confirmed = false;

    root.innerHTML = `
      <div class="mag-wrap" id="mag-root">
        <header class="sprint-top">
          <button class="btn-ghost" id="mag-quit">← Map</button>
          <span class="mag-round-badge" aria-label="Round ${roundIdx + 1} of ${ROUNDS}">
            Round ${roundIdx + 1} / ${ROUNDS}
          </span>
          <span class="mag-score-badge" aria-live="polite" aria-atomic="true">
            ⭐ ${totalScore}
          </span>
        </header>

        <div class="mag-card card-soft">
          <p class="mag-question" aria-live="polite">
            Where does <strong class="mag-target">${escapeHtml(String(target))}</strong> go?
          </p>

          <!-- Interactive number line -->
          <div class="mag-line-wrap" id="mag-line-wrap">
            <svg class="mag-svg" id="mag-svg" viewBox="0 0 500 110"
                 preserveAspectRatio="xMidYMid meet"
                 role="none" aria-hidden="true" focusable="false">
              <!-- track (wide hit area) -->
              <rect x="30" y="38" width="440" height="44" rx="22" fill="#ece7ff"/>
              <!-- line spine -->
              <line x1="50" y1="60" x2="450" y2="60" stroke="#7a6fb0" stroke-width="3"/>
              <!-- tick marks & labels -->
              ${labels.map(v => {
                const fx = 50 + ((v - lo) / (hi - lo)) * 400;
                return `<line x1="${fx}" y1="50" x2="${fx}" y2="70" stroke="#7a6fb0" stroke-width="2"/>
                        <text x="${fx}" y="90" text-anchor="middle" font-size="13" fill="#5a4f86" font-weight="700">${v}</text>`;
              }).join('')}
              <!-- draggable pin (start at midpoint) -->
              <g id="mag-pin" class="mag-pin" role="none">
                <circle id="mag-pin-shadow" cx="250" cy="62" r="18" fill="rgba(108,92,231,0.18)"/>
                <circle id="mag-pin-circle" cx="250" cy="60" r="16" fill="#e84393" stroke="#fff" stroke-width="3"/>
                <text id="mag-pin-label" x="250" y="65" text-anchor="middle" font-size="11" fill="#fff" font-weight="800">?</text>
              </g>
              <!-- reveal pin (hidden initially) -->
              <g id="mag-reveal" style="display:none">
                <circle id="mag-reveal-circle" cx="0" cy="60" r="14" fill="#00b894" stroke="#fff" stroke-width="3"/>
                <text id="mag-reveal-label" x="0" y="65" text-anchor="middle" font-size="11" fill="#fff" font-weight="800"></text>
              </g>
            </svg>
          </div>

          <!-- Accessible slider (visually off-screen, keyboard-driven) -->
          <input
            type="range"
            id="mag-slider"
            class="mag-slider-sr"
            min="${lo}" max="${hi}" step="1"
            value="${Math.round(lo + (hi - lo) * 0.5)}"
            aria-label="Number line position — use arrow keys to move the pin, then press Confirm"
          />

          <div class="mag-feedback" id="mag-feedback" aria-live="polite" aria-atomic="true"></div>

          <button class="btn btn-big btn-play mag-confirm-btn" id="mag-confirm">
            Place it here! 📍
          </button>
        </div>
      </div>`;

    // ── DOM refs ──────────────────────────────────────────────────────────────
    const svg        = root.querySelector('#mag-svg');
    const pinCircle  = root.querySelector('#mag-pin-circle');
    const pinShadow  = root.querySelector('#mag-pin-shadow');
    const pinLabel   = root.querySelector('#mag-pin-label');
    const revealG    = root.querySelector('#mag-reveal');
    const revealCx   = root.querySelector('#mag-reveal-circle');
    const revealLbl  = root.querySelector('#mag-reveal-label');
    const feedbackEl = root.querySelector('#mag-feedback');
    const confirmBtn = root.querySelector('#mag-confirm');
    const slider     = root.querySelector('#mag-slider');
    const lineWrap   = root.querySelector('#mag-line-wrap');

    // ── Coordinate helpers ────────────────────────────────────────────────────
    // SVG viewBox: x=50..450 maps to lo..hi
    const X_LEFT = 50, X_RIGHT = 450, X_SPAN = 400;

    function fracToSvgX(f) { return X_LEFT + Math.max(0, Math.min(1, f)) * X_SPAN; }
    function svgXToFrac(x) { return Math.max(0, Math.min(1, (x - X_LEFT) / X_SPAN)); }

    function movePinToFrac(f) {
      pinFrac = Math.max(0, Math.min(1, f));
      const cx = fracToSvgX(pinFrac);
      const val = Math.round(lo + pinFrac * (hi - lo));
      [pinCircle, pinShadow].forEach(el => el.setAttribute('cx', cx));
      pinLabel.setAttribute('x', cx);
      pinLabel.textContent = String(val);
      // sync the accessible slider
      slider.value = val;
    }

    function getClientXFromEvent(e) {
      return e.touches ? e.touches[0].clientX : e.clientX;
    }

    // Convert a client X coordinate → SVG fraction
    function clientXToFrac(clientX) {
      const rect = svg.getBoundingClientRect();
      // SVG is stretched to fit rect; map screen → viewBox fraction
      const relX = clientX - rect.left;
      const screenFrac = relX / rect.width;
      // viewBox goes 0..500; our line is X_LEFT..X_RIGHT inside that
      const viewBoxX = screenFrac * 500;
      return svgXToFrac(viewBoxX);
    }

    // ── Pointer drag on SVG ───────────────────────────────────────────────────
    let dragging = false;

    function onPointerDown(e) {
      if (confirmed) return;
      e.preventDefault();
      dragging = true;
      svg.setPointerCapture && svg.setPointerCapture(e.pointerId);
      movePinToFrac(clientXToFrac(getClientXFromEvent(e)));
      sfx.tap();
    }

    function onPointerMove(e) {
      if (!dragging || confirmed) return;
      movePinToFrac(clientXToFrac(getClientXFromEvent(e)));
    }

    function onPointerUp(e) {
      if (!dragging) return;
      dragging = false;
      svg.releasePointerCapture && svg.releasePointerCapture(e.pointerId);
    }

    // Use both pointer events (modern) and touch events (older iOS)
    svg.addEventListener('pointerdown',  onPointerDown);
    svg.addEventListener('pointermove',  onPointerMove);
    svg.addEventListener('pointerup',    onPointerUp);
    svg.addEventListener('pointercancel',onPointerUp);

    // Also handle plain click on the track area (fallback + desktop)
    lineWrap.addEventListener('click', (e) => {
      if (confirmed) return;
      if (e.target === confirmBtn) return;
      movePinToFrac(clientXToFrac(e.clientX));
    });

    // ── Accessible range slider syncs the visual pin ──────────────────────────
    slider.addEventListener('input', () => {
      if (confirmed) return;
      const val = Number(slider.value);
      pinFrac = (val - lo) / (hi - lo);
      movePinToFrac(pinFrac);
    });

    // ── Keyboard: arrow keys on the whole round (even when btn focused) ───────
    function onKeyDown(e) {
      if (confirmed) return;
      // Focus the slider first if user hits arrow keys outside it
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        e.preventDefault();
        const step = e.shiftKey ? 0.05 : 0.01; // Shift = coarse step
        const dir  = e.key === 'ArrowLeft' ? -1 : 1;
        movePinToFrac(pinFrac + dir * step);
      }
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        confirmPlacement();
      }
    }
    document.addEventListener('keydown', onKeyDown);

    // ── Confirm placement ─────────────────────────────────────────────────────
    function confirmPlacement() {
      if (confirmed) return;
      confirmed = true;
      confirmBtn.disabled = true;
      confirmBtn.textContent = '✓ Placed!';

      const placed = Math.round(lo + pinFrac * (hi - lo));
      const err    = Math.abs(placed - target);
      const err01  = err / (hi - lo);
      const pts    = calcScore(placed, target, lo, hi);
      totalScore  += pts;

      // Reveal true position
      const trueFrac = (target - lo) / (hi - lo);
      const trueCx   = fracToSvgX(trueFrac);
      revealCx.setAttribute('cx', trueCx);
      revealLbl.setAttribute('x', trueCx);
      revealLbl.textContent = String(target);
      revealG.style.display = '';

      const msg = feedbackMsg(err01);
      feedbackEl.innerHTML = `
        <span class="mag-fb-msg">${escapeHtml(msg)}</span>
        <span class="mag-fb-pts ${pts >= 80 ? 'mag-pts-great' : pts >= 40 ? 'mag-pts-good' : 'mag-pts-ok'}">+${pts}</span>
        <span class="muted" style="font-size:.85em">You placed: ${placed} · Answer: ${target} · Off by ${err}</span>`;

      speak(msg);
      if (err01 <= 0.05) { sfx.correct(); sparkle(pinCircle); }
      else if (err01 <= 0.15) { sfx.tap(); }

      // Small pause then proceed
      setTimeout(() => {
        if (!document.body.contains(root)) { cleanup(); return; }
        document.removeEventListener('keydown', onKeyDown);
        roundIdx++;
        if (roundIdx < ROUNDS) {
          confirmBtn.textContent = 'Next →';
          confirmBtn.disabled = false;
          confirmBtn.onclick = () => { sfx.tap(); playRound(); };
        } else {
          confirmBtn.textContent = 'See results →';
          confirmBtn.disabled = false;
          confirmBtn.onclick = () => { sfx.tap(); showResults(); };
        }
      }, 1400);
    }

    function cleanup() {
      document.removeEventListener('keydown', onKeyDown);
    }

    confirmBtn.addEventListener('click', confirmPlacement);

    // ── Back button ────────────────────────────────────────────────────────────
    root.querySelector('#mag-quit').addEventListener('click', () => {
      cleanup();
      navigate('#/');
    });

    // ── Initial pin at midpoint ───────────────────────────────────────────────
    movePinToFrac(0.5);
    // Put focus on slider for immediate keyboard access
    slider.focus({ preventScroll: true });
  }

  // ── Results screen ────────────────────────────────────────────────────────────
  function showResults() {
    const best    = S.progress.magnitudeBest || 0;
    const isBest  = totalScore > best && totalScore > 0;
    if (isBest) { S.progress.magnitudeBest = totalScore; }
    const coins = Math.max(1, Math.min(25, Math.round(totalScore / ROUNDS / 4)));
    addCoins(coins); persist(); refreshChrome();

    if (isBest) confetti(120);

    root.innerHTML = `
      <div class="sprint-wrap">
        <div class="sprint-intro card-soft">
          <div class="sprint-emoji" aria-hidden="true">${isBest ? '🏆' : '📏'}</div>
          <h1>${isBest ? 'New Best!' : 'Nice work!'}</h1>
          <div class="sprint-final" aria-label="Score: ${totalScore}">${totalScore}</div>
          <p class="muted">
            out of ${ROUNDS * 100} · 🏆 best ${S.progress.magnitudeBest} · +${coins} 🪙
          </p>
          <button class="btn btn-big btn-play" id="mag-again">Play again 🔁</button>
          <button class="btn-link" id="mag-done">Back to map</button>
        </div>
      </div>`;

    sfx.level();
    speak(isBest ? 'New best score! Fantastic estimating!' : 'Great estimating! Keep practising!');

    root.querySelector('#mag-again').addEventListener('click', () => {
      sfx.tap();
      // Reset state for a fresh game
      roundIdx   = 0;
      totalScore = 0;
      // Generate fresh targets for replay
      const rng2    = mkRng(Date.now() ^ 0xCAFEBABE);
      targets.splice(0, ROUNDS, ...makeTargets(rng2, stage.lo, stage.hi, ROUNDS));
      playRound();
    });
    root.querySelector('#mag-done').addEventListener('click', () => { sfx.tap(); navigate('#/'); });
  }

  startScreen();
}
