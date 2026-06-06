// views/adventure.js — "Pet Quest": a story adventure where your pet is the hero
// and every obstacle is a 4th-grade math problem, taught teach-first (tutor mode).
import adventures from '../curriculum/adventures.js';
import { S, persist } from '../state.js';
import { getSkill } from '../curriculum/index.js';
import { rewardsData } from '../curriculum/index.js';
import { nextProblem } from '../engine/index.js';
import { matchMisconception } from '../engine/problemTypes.js';
import { recordAnswer, checkNewBadges, addCoins, awardTreat, patPet, noteMistake, resolveMistake } from '../gamification.js';
import { renderVisual } from '../ui/manipulatives.js';
import { navigate, refreshChrome } from '../ui/shell.js';
import { sfx, speak } from '../ui/sound.js';
import { confetti, popup, sparkle, floatText } from '../ui/celebrations.js';
import { showBadges } from './rewards.js';
import { escapeHtml, mdInline } from '../ui/dom.js';

const CHAPTERS = (adventures && adventures.chapters) || [];
const petName = () => (rewardsData.pets.find((p) => p.id === S.profile.avatar.pet) || { name: 'your pet' }).name;
const petEmoji = () => (rewardsData.pets.find((p) => p.id === S.profile.avatar.pet) || { emoji: '🐾' }).emoji;
const fill = (s) => String(s || '').replace(/\{pet\}/g, petName());

function adv() { return S.progress.adventure; }
const isDone = (sceneId) => adv().completed.includes(sceneId);
function chapterDone(ch) { return ch.scenes.every((s) => isDone(s.id)); }
function chapterUnlocked(i) { return i === 0 || chapterDone(CHAPTERS[i - 1]); }
// the first not-yet-done scene in a chapter (or null if all done)
function nextScene(ch) { return ch.scenes.find((s) => !isDone(s.id)) || null; }

/* ---------------- map ---------------- */
export function renderAdventure(root) {
  if (!CHAPTERS.length) { root.innerHTML = '<div class="content"><p class="muted center">The adventure is loading…</p></div>'; return; }
  const totalScenes = CHAPTERS.reduce((n, c) => n + c.scenes.length, 0);
  const doneScenes = adv().completed.length;
  root.innerHTML = `
    <div class="adv-wrap">
      <header class="adv-top">
        <h1 class="adv-h1">⚔️ ${escapeHtml(petName())}'s Quest</h1>
        <span class="adv-prog">${doneScenes}/${totalScenes} ⭐</span>
      </header>
      <div id="adv-chapters"></div>
    </div>`;
  const host = root.querySelector('#adv-chapters');
  host.innerHTML = CHAPTERS.map((ch, i) => {
    const unlocked = chapterUnlocked(i);
    const done = chapterDone(ch);
    const cur = nextScene(ch);
    return `
      <section class="adv-chapter ${unlocked ? '' : 'locked'} ${done ? 'done' : ''}">
        <header class="ach-head">
          <span class="ach-emoji">${ch.emoji || '🗺️'}</span>
          <span class="ach-title">${escapeHtml(ch.title)}${done ? ' ✅' : unlocked ? '' : ' 🔒'}</span>
          <span class="ach-count">${ch.scenes.filter((s) => isDone(s.id)).length}/${ch.scenes.length}</span>
        </header>
        ${unlocked ? `<p class="ach-blurb">${escapeHtml(fill(ch.blurb))}</p>
        <div class="scene-path">
          ${ch.scenes.map((s) => {
            const d = isDone(s.id), isCur = cur && cur.id === s.id;
            return `<span class="scene-node ${d ? 'done' : isCur ? 'current' : 'locked'}" title="${escapeHtml(s.art)}">${d ? '⭐' : isCur ? s.art : '🔒'}</span>`;
          }).join('<span class="scene-link"></span>')}
        </div>
        ${cur ? `<button class="btn btn-big adv-go" data-ch="${i}">${ch.scenes.some((s) => isDone(s.id)) ? 'Continue' : 'Start'} the journey →</button>`
              : `<div class="ach-complete">Chapter complete! 🎉</div>`}`
        : `<p class="ach-blurb muted">Finish the chapter above to unlock this one.</p>`}
      </section>`;
  }).join('');
  host.querySelectorAll('.adv-go').forEach((b) =>
    b.addEventListener('click', () => { sfx.tap(); openScene(root, +b.dataset.ch); }));
}

/* ---------------- scene flow: story -> (teach) -> challenge -> success ---------------- */
function openScene(root, chIndex) {
  const ch = CHAPTERS[chIndex];
  const scene = nextScene(ch);
  if (!scene) { renderAdventure(root); return; }
  storyPhase(root, ch, scene);
}

function sceneShell(root, ch, inner) {
  root.innerHTML = `
    <div class="adv-scene" data-bg-art>
      <header class="adv-scene-top">
        <button class="btn-ghost" id="scene-back">← Map</button>
        <span class="scene-chapter">${ch.emoji} ${escapeHtml(ch.title)}</span>
      </header>
      <div id="scene-body">${inner}</div>
    </div>`;
  root.querySelector('#scene-back').addEventListener('click', () => { sfx.tap(); renderAdventure(root); });
  return root.querySelector('#scene-body');
}

function storyPhase(root, ch, scene) {
  const body = sceneShell(root, ch, `
    <div class="scene-art">${scene.art || '✨'}</div>
    <div class="scene-pet">${petEmoji()}</div>
    <div class="scene-story card-soft">${escapeHtml(fill(scene.story))}</div>
    <button class="btn btn-big" id="scene-next">${scene.teach ? 'Learn how →' : 'Let\'s solve it! →'}</button>`);
  speak(fill(scene.story));
  body.querySelector('#scene-next').addEventListener('click', () => {
    sfx.tap();
    scene.teach ? teachPhase(root, ch, scene) : challengePhase(root, ch, scene);
  });
}

// TEACH-FIRST: show the concept + a fully worked example before asking (tutor mode).
function teachPhase(root, ch, scene) {
  const skill = getSkill(scene.skill);
  const lesson = (skill && skill.lesson) || {};
  const example = nextProblem(skill, -1); // an easier instance to demonstrate
  let stepIdx = 0;
  const steps = example.steps || [];

  function draw() {
    const body = sceneShell(root, ch, `
      <div class="teach-card card-soft">
        <div class="teach-head">🦊 Let me show you!</div>
        ${lesson.bigIdea ? `<p class="teach-idea">💡 ${escapeHtml(lesson.bigIdea)}</p>` : ''}
        <div class="teach-problem">${escapeHtml(example.prompt)}</div>
        ${example.visual ? `<div class="teach-visual">${renderVisual(example.visual)}</div>` : ''}
        <div class="teach-steps" id="teach-steps"></div>
        <div class="self-explain" id="self-explain" hidden>
          <p>🗣️ <b>Your turn to teach!</b> Tell ${escapeHtml(petName())} <em>why</em> that works — say it out loud!</p>
        </div>
        <div class="teach-controls">
          <button class="btn btn-ghost" id="teach-step">Next step</button>
          <button class="btn btn-big" id="teach-go" hidden>I explained it — my turn! →</button>
        </div>
      </div>`);
    const list = body.querySelector('#teach-steps');
    const stepBtn = body.querySelector('#teach-step');
    const goBtn = body.querySelector('#teach-go');
    const renderSteps = () => {
      list.innerHTML = steps.slice(0, stepIdx).map((s, i) =>
        `<div class="sol-step slide-in"><span class="ss-num">${i + 1}</span><span class="ss-text">${mdInline(s.text)}</span></div>`).join('');
      if (stepIdx >= steps.length) {
        stepBtn.hidden = true; goBtn.hidden = false;
        const se = body.querySelector('#self-explain'); if (se) se.hidden = false;
        if (!list.querySelector('.sol-answer')) {
          const a = document.createElement('div'); a.className = 'sol-answer';
          a.innerHTML = `✅ So the answer is <b>${escapeHtml(example.answer)}</b>.`;
          list.appendChild(a);
        }
      } else {
        stepBtn.textContent = `Next step (${stepIdx}/${steps.length})`;
      }
    };
    stepIdx = Math.max(stepIdx, 1); renderSteps();
    if (steps.length) speak(steps[0].text);
    stepBtn.addEventListener('click', () => { sfx.tap(); stepIdx++; renderSteps(); if (steps[stepIdx - 1]) speak(steps[stepIdx - 1].text); });
    goBtn.addEventListener('click', () => { sfx.tap(); challengePhase(root, ch, scene); });
  }
  draw();
}

// THE CHALLENGE: one problem with hint ladder + show-me-how; pass to advance.
function challengePhase(root, ch, scene) {
  const skill = getSkill(scene.skill);
  const problem = nextProblem(skill, 0);
  let wrong = 0, hintIdx = 0, answered = false;

  const body = sceneShell(root, ch, `
    <div class="scene-pet small">${petEmoji()}</div>
    <div class="challenge-card card-soft">
      <div class="challenge-tag">🧩 ${escapeHtml(skill ? skill.title : 'Challenge')}</div>
      <div class="problem-prompt">${escapeHtml(problem.prompt)}</div>
      ${problem.visual ? `<div class="problem-visual">${renderVisual(problem.visual)}</div>` : ''}
      <div class="feedback" id="c-fb" role="alert" aria-atomic="true"></div>
      <div id="c-input"></div>
      <div class="challenge-actions">
        <button class="btn btn-hint" id="c-hint">💡 Hint</button>
        <button class="btn btn-show" id="c-show">📖 Show me</button>
      </div>
      <div class="solution-panel" id="c-sol" hidden></div>
    </div>`);
  speak(problem.prompt);
  const fb = body.querySelector('#c-fb');
  const sol = body.querySelector('#c-sol');
  buildAnswer(body.querySelector('#c-input'), problem, submit);

  body.querySelector('#c-hint').addEventListener('click', () => {
    sfx.tap();
    const hs = problem.hints || [];
    if (!hs.length) return;
    fb.innerHTML = `<span class="fb-soft">💡 ${escapeHtml(hs[Math.min(hintIdx, hs.length - 1)])}</span>`;
    hintIdx++;
  });
  body.querySelector('#c-show').addEventListener('click', () => { sfx.tap(); revealSolution(); });

  function revealSolution() {
    sol.hidden = false;
    sol.innerHTML = `<div class="sol-head">📖 Step by step</div>` +
      (problem.visual ? `<div class="sol-visual">${renderVisual(problem.visual)}</div>` : '') +
      `<div class="sol-steps">${(problem.steps || []).map((s, i) => `<div class="sol-step"><span class="ss-num">${i + 1}</span><span class="ss-text">${mdInline(s.text)}</span></div>`).join('')}</div>` +
      `<div class="sol-answer">✅ Answer: <b>${escapeHtml(problem.answer)}</b></div>`;
  }

  function submit(raw, sourceEl) {
    if (answered) return;
    if (raw === undefined || raw === '' || raw === '?') return;
    if (problem.check(raw)) {
      answered = true;
      const firstTry = wrong === 0;
      if (firstTry) resolveMistake(scene.skill);
      const r = recordAnswer(scene.skill, true, firstTry);
      sfx.correct(); if (sourceEl) { sourceEl.classList.add('correct'); sparkle(sourceEl); }
      fb.innerHTML = `<span class="fb-good">✅ ${firstTry ? 'Perfect!' : 'You did it!'}</span>`;
      const fresh = checkNewBadges(); refreshChrome();
      setTimeout(() => { if (fresh.length) showBadges(fresh, () => successPhase(root, ch, scene)); else successPhase(root, ch, scene); }, 700);
    } else {
      wrong++;
      if (wrong === 1) noteMistake(scene.skill);
      recordAnswer(scene.skill, false, false);
      sfx.wrong();
      if (sourceEl) { sourceEl.classList.add('wrong'); setTimeout(() => sourceEl.classList.remove('wrong'), 600); }
      const misc = matchMisconception(problem, raw);
      if (misc && wrong <= 2) { fb.innerHTML = `<span class="fb-soft">${mdInline(misc)}</span>`; if (wrong === 2) body.querySelector('#c-hint').classList.add('pulse'); }
      else if (wrong === 1) fb.innerHTML = `<span class="fb-soft">🤔 Not quite — try again! Tap 💡 for a hint.</span>`;
      else if (wrong === 2) { fb.innerHTML = `<span class="fb-soft">💛 You can do it — here's a hint.</span>`; body.querySelector('#c-hint').classList.add('pulse'); }
      else { fb.innerHTML = `<span class="fb-soft">Let's look together — then you've got the next one!</span>`; revealSolution(); }
    }
  }
}

function successPhase(root, ch, scene) {
  // record progress + rewards
  if (!isDone(scene.id)) adv().completed.push(scene.id);
  const rw = scene.reward || {};
  if (rw.coins) addCoins(rw.coins);
  if (rw.treats) awardTreat(rw.treats);
  // the pet is delighted by the adventure
  S.progress.care.happiness = Math.min(100, S.progress.care.happiness + 5);
  persist(); refreshChrome();

  const chapterFinished = chapterDone(ch);
  confetti(chapterFinished ? 150 : 80);
  const body = sceneShell(root, ch, `
    <div class="scene-art win">${scene.art || '🌟'}</div>
    <div class="scene-pet bounce">${petEmoji()}</div>
    <div class="scene-story card-soft success">${escapeHtml(fill(scene.success))}
      <div class="scene-reward">${rw.coins ? `🪙 +${rw.coins}` : ''} ${rw.treats ? `🍪 +${rw.treats} treat${rw.treats > 1 ? 's' : ''}` : ''} 💖 +5</div>
    </div>
    <button class="btn btn-big" id="scene-cont">${chapterFinished ? 'Finish chapter 🎉' : 'Continue →'}</button>`);
  sfx.star(); speak(fill(scene.success));
  body.querySelector('#scene-cont').addEventListener('click', () => {
    sfx.tap();
    if (chapterFinished) {
      popup({ emoji: ch.emoji || '🏆', title: `${escapeHtml(ch.title)} complete!`, sub: fill(ch.outro || 'On to the next adventure!'), sound: 'level', hold: true });
      setTimeout(() => renderAdventure(root), 300);
    } else {
      openScene(root, CHAPTERS.indexOf(ch));
    }
  });
}

/* ---------------- compact answer pad (number / fraction / text / choice) ---------------- */
function buildAnswer(host, problem, onSubmit) {
  const kind = problem.inputKind || 'number';
  if (kind === 'choice') {
    host.innerHTML = `<div class="choices">${problem.choices.map((c) => `<button class="choice-btn" data-c="${escapeHtml(c)}">${escapeHtml(c)}</button>`).join('')}</div>`;
    host.querySelectorAll('.choice-btn').forEach((b) => b.addEventListener('click', () => onSubmit(b.dataset.c, b)));
    return;
  }
  const digit = (c) => ({ l: c, v: c });
  const back = { l: '⌫', v: 'BACK', cls: 'key-back' };
  const keyDefs = kind === 'fraction'
    ? [...'123456789'].map(digit).concat([{ l: '/', v: '/' }, digit('0'), { l: '␣', v: ' ', cls: 'key-space' }, back])
    : kind === 'text'
    ? [...'123456789'].map(digit).concat([{ l: ':', v: ':' }, digit('0'), { l: '/', v: '/' }, { l: ',', v: ',' }, { l: '+', v: '+' }, { l: '−', v: '-' }, { l: 'r', v: 'r' }, { l: '.', v: '.' }, back])
    : [...'123456789'].map(digit).concat([{ l: '−', v: '-' }, digit('0'), { l: '.', v: '.' }, back]);
  host.innerHTML = `
    <div class="answer-display" id="c-disp" data-empty="1">?</div>
    <div class="keypad" data-kind="${kind}">${keyDefs.map((k) => `<button class="key ${k.cls || ''}">${k.l}</button>`).join('')}</div>
    <button class="btn btn-big btn-check" id="c-check">Check ✓</button>`;
  const disp = host.querySelector('#c-disp');
  let val = '';
  const sync = () => { disp.textContent = val || '?'; disp.dataset.empty = val ? '0' : '1'; };
  host.querySelectorAll('.key').forEach((b, i) => b.addEventListener('click', () => {
    sfx.tap(); const v = keyDefs[i].v; val = v === 'BACK' ? val.slice(0, -1) : val + v; sync();
  }));
  host.querySelector('#c-check').addEventListener('click', () => onSubmit(val, disp));
}
