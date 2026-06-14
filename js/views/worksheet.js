// views/worksheet.js — printable practice worksheet generator (parent tool).
// Reuses the engine to make real problems + an answer key, then window.print()
// with a print stylesheet that shows ONLY the sheet. Offline, no dependencies.
import { S } from '../state.js';
import { GRADES, skillsForGrade, strandSkills, groupedByStrand, STRAND_META } from '../curriculum/index.js';
import { nextProblem } from '../engine/index.js';
import { escapeHtml } from '../ui/dom.js';
import { sfx } from '../ui/sound.js';

const COUNTS = [10, 15, 20, 25];
let cfg = null;     // { grade, strand, count }  — remembered across visits
let sheet = [];     // last generated problems
let showKey = false;

const poolFor = (grade, strand) => (strand === '*' ? skillsForGrade(grade) : strandSkills(grade, strand));

// build `count` paper-friendly problems; the interactive kinds (tap/build) don't
// translate to paper, so skip them, and de-dupe identical prompts.
function generate() {
  const pool = poolFor(cfg.grade, cfg.strand);
  const out = [], seen = new Set();
  let guard = 0;
  while (out.length < cfg.count && guard < cfg.count * 40) {
    guard++;
    const sk = pool[Math.floor(Math.random() * pool.length)];
    if (!sk) break;
    let p;
    try { p = nextProblem(sk); } catch (e) { continue; }
    if (p.inputKind === 'tap' || p.inputKind === 'build') continue;
    if (!p.prompt || seen.has(p.prompt)) continue;
    seen.add(p.prompt);
    out.push({ prompt: p.prompt, answer: String(p.answer), choices: p.choices || null });
  }
  sheet = out;
}

function scopeLabel() {
  if (cfg.strand === '*') return 'Mixed review';
  const m = STRAND_META[cfg.strand];
  return `${m ? m.emoji + ' ' : ''}${cfg.strand}`;
}

function sheetHtml() {
  return `
    <div class="ws-sheet" id="ws-print">
      <div class="ws-sheet-head">
        <div class="ws-brand">🦊 MathQuest — Practice</div>
        <div class="ws-meta"><span>Name: ______________________</span><span>Date: ____________</span></div>
        <div class="ws-scope">${escapeHtml(scopeLabel())} · Grade ${cfg.grade} · ${sheet.length} problems</div>
      </div>
      <ol class="ws-problems">
        ${sheet.map((p) => `<li class="ws-prob">
          <div class="ws-q">${escapeHtml(p.prompt)}</div>
          ${p.choices
            ? `<div class="ws-choices">${p.choices.map((c) => `<span class="ws-opt">${escapeHtml(c)}</span>`).join('')}</div>`
            : '<div class="ws-blank" aria-hidden="true"></div>'}
        </li>`).join('')}
      </ol>
      ${showKey ? `<div class="ws-key">
        <h3>Answer Key</h3>
        <ol class="ws-key-list">${sheet.map((p) => `<li>${escapeHtml(p.answer)}</li>`).join('')}</ol>
      </div>` : ''}
    </div>`;
}

export function renderWorksheet(root) {
  if (!cfg) cfg = { grade: S.profile.grade || GRADES[0], strand: '*', count: 15 };
  if (!GRADES.includes(cfg.grade)) cfg.grade = GRADES[0];
  const groups = groupedByStrand(cfg.grade);
  if (cfg.strand !== '*' && !groups.some((g) => g.strand === cfg.strand)) cfg.strand = '*';

  root.innerHTML = `
    <section class="worksheet-view">
      <div class="ws-controls no-print">
        <h1 class="dash-title">📄 Worksheet maker</h1>
        <p class="muted">Print a practice sheet for ${escapeHtml(S.profile.name || 'your learner')} — problems first, answer key on its own page.</p>

        <div class="ws-field"><label>Grade</label>
          <div class="ws-chips" id="ws-grade">${GRADES.map((g) =>
            `<button class="ws-chip ${g === cfg.grade ? 'on' : ''}" data-g="${g}" aria-pressed="${g === cfg.grade}">Grade ${g}</button>`).join('')}</div></div>

        <div class="ws-field"><label for="ws-strand">Topic</label>
          <select id="ws-strand" class="ws-select">
            <option value="*" ${cfg.strand === '*' ? 'selected' : ''}>Mixed review (all topics)</option>
            ${groups.map((g) => `<option value="${escapeHtml(g.strand)}" ${g.strand === cfg.strand ? 'selected' : ''}>${g.emoji} ${escapeHtml(g.strand)}</option>`).join('')}
          </select></div>

        <div class="ws-field"><label>How many problems</label>
          <div class="ws-chips" id="ws-count">${COUNTS.map((n) =>
            `<button class="ws-chip ${n === cfg.count ? 'on' : ''}" data-n="${n}" aria-pressed="${n === cfg.count}">${n}</button>`).join('')}</div></div>

        <div class="ws-actions">
          <button class="btn btn-big" id="ws-make">✨ Make worksheet</button>
          ${sheet.length ? `
            <button class="btn btn-ghost" id="ws-again">🔄 New problems</button>
            <button class="btn btn-ghost" id="ws-key">${showKey ? '🙈 Hide answers' : '🔑 Show answers'}</button>
            <button class="btn btn-big" id="ws-print">🖨️ Print</button>` : ''}
        </div>
      </div>

      ${sheet.length ? sheetHtml() : '<p class="ws-empty no-print">Pick a grade and topic, then tap <b>Make worksheet</b>.</p>'}
    </section>`;

  root.querySelectorAll('#ws-grade .ws-chip').forEach((b) => b.addEventListener('click', () => {
    sfx.tap(); cfg.grade = Number(b.dataset.g); cfg.strand = '*'; sheet = []; renderWorksheet(root);
  }));
  root.querySelector('#ws-strand').addEventListener('change', (e) => { cfg.strand = e.target.value; });
  root.querySelectorAll('#ws-count .ws-chip').forEach((b) => b.addEventListener('click', () => {
    sfx.tap(); cfg.count = Number(b.dataset.n);
    root.querySelectorAll('#ws-count .ws-chip').forEach((x) => { const on = x === b; x.classList.toggle('on', on); x.setAttribute('aria-pressed', on); });
  }));

  const make = () => { sfx.tap(); cfg.strand = root.querySelector('#ws-strand').value; generate(); renderWorksheet(root); };
  root.querySelector('#ws-make').addEventListener('click', make);
  if (sheet.length) {
    root.querySelector('#ws-again').addEventListener('click', make);
    root.querySelector('#ws-key').addEventListener('click', () => { sfx.tap(); showKey = !showKey; renderWorksheet(root); });
    root.querySelector('#ws-print').addEventListener('click', () => { sfx.tap(); try { window.print(); } catch (e) { /* print unavailable */ } });
  }
}
