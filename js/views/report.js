// views/report.js — Parent Efficacy Report
// Leads with GROWTH (mastery, retention, accuracy trajectory), not vanity metrics.
import { S } from '../state.js';
import { mistakeCount, levelProgress, dueReviews } from '../gamification.js';
import { BY_GRADE, STRANDS, STRAND_META, getStandard, ALL_SKILLS, standardsCount, GRADES } from '../curriculum/index.js';
import { navigate } from '../ui/shell.js';
import { sfx } from '../ui/sound.js';
import { escapeHtml } from '../ui/dom.js';

// ── helpers ────────────────────────────────────────────────────────────────

function skillsForGrade(grade) {
  return BY_GRADE[grade] || [];
}

/** "YYYY-M-D" → Date object */
function parseDay(d) {
  const [y, m, day] = d.split('-').map(Number);
  return new Date(y, m - 1, day);
}

/** ms since epoch → "YYYY-M-D" string */
function toYMD(ts) {
  const d = new Date(ts);
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

/** format a Date as "Mon D" */
function fmtDate(dt) {
  return dt.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

const MS_PER_DAY = 86400000;

function daysAgo(ms) {
  return Math.floor((Date.now() - ms) / MS_PER_DAY);
}

// ── stat tile (mirrors dashboard.js) ──────────────────────────────────────

function stat(label, val, emoji, note) {
  return `<div class="stat card-soft">
    <div class="stat-emoji">${emoji}</div>
    <div class="stat-val">${escapeHtml(String(val))}</div>
    <div class="stat-label">${escapeHtml(label)}</div>
    ${note ? `<div class="rpt-stat-note muted">${escapeHtml(note)}</div>` : ''}
  </div>`;
}

// ── sparkline SVG ─────────────────────────────────────────────────────────

function buildSparkline(points) {
  // points: array of 0–1 values (accuracy per day), left → right
  const W = 280, H = 64, PAD = 6;
  const n = points.length;
  if (n < 2) return null;

  const xs = points.map((_, i) => PAD + (i / (n - 1)) * (W - PAD * 2));
  const ys = points.map((v) => H - PAD - v * (H - PAD * 2));

  // polyline path
  const pts = xs.map((x, i) => `${x.toFixed(1)},${ys[i].toFixed(1)}`).join(' ');

  // filled area under the curve
  const areaStart = `${xs[0].toFixed(1)},${H}`;
  const areaEnd = `${xs[n - 1].toFixed(1)},${H}`;
  const areaPts = `${areaStart} ${pts} ${areaEnd}`;

  // last value dot
  const lx = xs[n - 1].toFixed(1);
  const ly = ys[n - 1].toFixed(1);

  return `<svg class="rpt-sparkline" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <defs>
      <linearGradient id="spark-fill" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#6c5ce7" stop-opacity=".25"/>
        <stop offset="100%" stop-color="#6c5ce7" stop-opacity="0"/>
      </linearGradient>
    </defs>
    <polygon points="${areaPts}" fill="url(#spark-fill)"/>
    <polyline points="${pts}" fill="none" stroke="#6c5ce7" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>
    <circle cx="${lx}" cy="${ly}" r="4" fill="#6c5ce7"/>
  </svg>`;
}

// ── trend label ───────────────────────────────────────────────────────────

function trendLabel(points) {
  if (points.length < 4) return '';
  const half = Math.floor(points.length / 2);
  const early = points.slice(0, half).reduce((s, v) => s + v, 0) / half;
  const late = points.slice(-half).reduce((s, v) => s + v, 0) / half;
  const delta = late - early;
  if (delta > 0.04) return '<span class="rpt-trend up" aria-label="Improving">↑ Improving</span>';
  if (delta < -0.04) return '<span class="rpt-trend down" aria-label="Declining">↓ Needs attention</span>';
  return '<span class="rpt-trend flat" aria-label="Steady">→ Steady</span>';
}

// ── CCSS tag ──────────────────────────────────────────────────────────────

function ccTag(skillId) {
  const std = getStandard(skillId);
  if (!std) return '';
  const code = std.code || std;
  const desc = std.description || '';
  return `<span class="std-tag" title="${escapeHtml(desc)}"><span class="std-code">${escapeHtml(String(code))}</span></span>`;
}

// ── main render ───────────────────────────────────────────────────────────

export function renderReport(root) {
  const st = S.progress.stats;
  const lp = levelProgress();
  const name = escapeHtml(S.profile.name || 'Your learner');
  const grade = S.profile.grade;

  // ── Headline stats ──────────────────────────────────────────────────────
  const attempted = st.problemsAttempted || 0;
  const correct = st.problemsCorrect || 0;
  const accPct = attempted ? Math.round((correct / attempted) * 100) : 0;
  const accNote = `based on ${attempted} problems`;

  // This-week masteries
  const weekAgo = Date.now() - 7 * MS_PER_DAY;
  const weekMasteries = ALL_SKILLS.filter((s) => {
    const r = S.progress.skills[s.id];
    return r && r.mastered && r.masteredAt && r.masteredAt >= weekAgo;
  }).length;

  // ── Mastery by topic ────────────────────────────────────────────────────
  const gradeSkills = skillsForGrade(grade);
  const masteryRows = STRANDS.map((strand) => {
    const sk = gradeSkills.filter((s) => s.strand === strand);
    if (!sk.length) return '';
    const done = sk.filter((s) => S.progress.skills[s.id] && S.progress.skills[s.id].mastered).length;
    const pct = Math.round((done / sk.length) * 100);
    const meta = STRAND_META[strand] || { emoji: '⭐', color: '#888' };
    return `<div class="mastery-row">
      <span class="mr-emoji" aria-hidden="true">${meta.emoji}</span>
      <span class="mr-name">${escapeHtml(strand)}</span>
      <div class="progress-track sm" role="progressbar" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100" aria-label="${escapeHtml(strand)}: ${done} of ${sk.length} mastered">
        <div class="progress-fill" style="width:${pct}%;background:${meta.color}"></div>
      </div>
      <span class="mr-num">${done}/${sk.length}</span>
    </div>`;
  }).join('');

  // ── Accuracy trend (sparkline) ──────────────────────────────────────────
  const history = S.progress.history || [];
  const recentHistory = history.slice(-14);
  const validHistory = recentHistory.filter((e) => e.a > 0);

  let sparklineHtml = '';
  let trendHtml = '';
  let dateRangeLabel = '';

  if (validHistory.length >= 2) {
    const points = validHistory.map((e) => e.c / e.a);
    sparklineHtml = buildSparkline(points) || '';
    trendHtml = trendLabel(points);
    const first = parseDay(validHistory[0].d);
    const last = parseDay(validHistory[validHistory.length - 1].d);
    dateRangeLabel = `${fmtDate(first)} – ${fmtDate(last)}`;
  }

  const sparkSection = validHistory.length < 2
    ? `<p class="muted rpt-no-data">Not enough data yet — check back after a few more practice days. Keep it up!</p>`
    : `<div class="rpt-sparkline-wrap" aria-label="Accuracy trend chart">
        ${sparklineHtml}
        <div class="rpt-spark-labels">
          <span class="muted" style="font-size:.8rem">${escapeHtml(dateRangeLabel)}</span>
          ${trendHtml}
        </div>
      </div>`;

  // ── Retention health ────────────────────────────────────────────────────
  const dueNow = dueReviews();
  const futurePending = ALL_SKILLS.filter((s) => {
    const r = S.progress.skills[s.id];
    return r && r.mastered && r.reviewAt && r.reviewAt > Date.now();
  });
  const totalPending = dueNow.length + futurePending.length;
  const trickyCount = mistakeCount();

  const retentionMsg = dueNow.length > 0
    ? `${dueNow.length} skill${dueNow.length > 1 ? 's' : ''} ready for a quick review — great chance to lock in long-term memory!`
    : `All caught up on reviews — the app will schedule the next ones soon.`;

  const trickyMsg = trickyCount > 0
    ? `${trickyCount} tricky problem${trickyCount > 1 ? 's' : ''} marked for a little extra practice — completely normal while learning.`
    : `No tricky spots right now — ${name} is handling everything smoothly!`;

  // ── Recently mastered ───────────────────────────────────────────────────
  const fourteenAgo = Date.now() - 14 * MS_PER_DAY;
  const recentMastered = ALL_SKILLS
    .filter((s) => {
      const r = S.progress.skills[s.id];
      return r && r.mastered && r.masteredAt && r.masteredAt >= fourteenAgo;
    })
    .sort((a, b) => (S.progress.skills[b.id].masteredAt || 0) - (S.progress.skills[a.id].masteredAt || 0));

  const recentMasteredHtml = recentMastered.length === 0
    ? `<p class="muted rpt-no-data">No new skills mastered in the last 14 days — keep practicing to unlock the first one!</p>`
    : recentMastered.map((s) => {
        const r = S.progress.skills[s.id];
        const daysBack = daysAgo(r.masteredAt);
        const whenLabel = daysBack === 0 ? 'Today' : daysBack === 1 ? 'Yesterday' : `${daysBack} days ago`;
        return `<div class="rpt-mastered-item">
          <span class="rpt-mastered-name">${escapeHtml(s.name)}</span>
          <span class="rpt-mastered-meta muted">${whenLabel} ${ccTag(s.id)}</span>
        </div>`;
      }).join('');

  // ── Render HTML ─────────────────────────────────────────────────────────
  root.innerHTML = `
    <div class="rpt-wrap">

      <!-- ① Header card -->
      <div class="card-soft rpt-header">
        <div class="rpt-header-info">
          <div class="rpt-avatar" aria-hidden="true">📊</div>
          <div>
            <h1 class="rpt-title">${name}'s Progress Report</h1>
            <p class="muted" style="margin:0">Grade ${grade} · Math</p>
          </div>
        </div>
        <div class="rpt-btn-row no-print">
          <button class="btn btn-ghost" id="rpt-back-btn" aria-label="Back to parent dashboard">← Back</button>
          <button class="btn btn-ghost" id="rpt-print-btn" aria-label="Print this report">🖨️ Print</button>
        </div>
      </div>

      <!-- ② Headline stats — GROWTH first -->
      <h2 class="section-h">Growth at a glance</h2>
      <div class="stat-grid">
        ${stat('Skills mastered', st.skillsMastered, '🌟')}
        ${stat('Accuracy', accPct + '%', '🎯', accNote)}
        ${stat('Day streak', S.progress.streak.count, '🔥')}
        ${stat('New this week', weekMasteries, '✨', 'skills mastered')}
        ${stat('Level', lp.level, '⬆️')}
        ${stat('Problems solved', correct, '✅', `of ${attempted} attempted`)}
      </div>

      <!-- ③ Mastery by topic -->
      <h2 class="section-h">Mastery by topic — Grade ${grade}</h2>
      <div class="card-soft">
        ${masteryRows || '<p class="muted" style="margin:0">No skills started yet for this grade.</p>'}
      </div>

      <!-- ④ Accuracy trend -->
      <h2 class="section-h">Accuracy trend <span class="muted" style="font-weight:400;font-size:.9rem">(last 14 days)</span></h2>
      <div class="card-soft rpt-trend-card">
        ${sparkSection}
      </div>

      <!-- ⑤ Retention health -->
      <h2 class="section-h">Retention health</h2>
      <div class="card-soft rpt-retention">
        <div class="rpt-retention-row">
          <span class="rpt-retention-icon" aria-hidden="true">🔁</span>
          <div>
            <div class="rpt-retention-label">Spaced reviews</div>
            <div class="rpt-retention-detail muted">${escapeHtml(retentionMsg)}</div>
          </div>
          <span class="rpt-retention-count">${totalPending}</span>
        </div>
        <div class="rpt-retention-row">
          <span class="rpt-retention-icon" aria-hidden="true">📝</span>
          <div>
            <div class="rpt-retention-label">Tricky problems</div>
            <div class="rpt-retention-detail muted">${escapeHtml(trickyMsg)}</div>
          </div>
          <span class="rpt-retention-count">${trickyCount}</span>
        </div>
        <p class="muted" style="font-size:.8rem;margin:10px 0 0">
          Progress is measured by accuracy and retention — not time spent.
        </p>
      </div>

      <!-- ⑥ Recently mastered -->
      <h2 class="section-h">Recently mastered <span class="muted" style="font-weight:400;font-size:.9rem">(last 14 days)</span></h2>
      <div class="card-soft rpt-mastered-list">
        ${recentMasteredHtml}
      </div>

      <!-- ⑦ Footer -->
      <div class="rpt-footer muted">
        <p>
          <strong>Common Core aligned</strong> — ${standardsCount} standards across grades 3–6.
          <strong>Private by design:</strong> this report is generated on your device and never leaves it.
        </p>
      </div>

    </div>`;

  // ── Event listeners ─────────────────────────────────────────────────────
  root.querySelector('#rpt-back-btn').addEventListener('click', () => {
    sfx.tap();
    navigate('#/parent');
  });
  root.querySelector('#rpt-print-btn').addEventListener('click', () => {
    sfx.tap();
    window.print();
  });
}
