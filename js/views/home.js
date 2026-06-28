// views/home.js — the learning map: continue card, daily goal, grade tabs, strands.
import { S, persist, isUnlocked, isMastered, skillRec } from '../state.js';
import { groupedByStrand, getSkill, GRADES } from '../curriculum/index.js';
import { gradeCompletion, recommendedSkill, dailyStatus, dueReviews, mistakeCount, warmupDue, isRusty, weeklyProgress,
  listMissions, claimMission, levelProgress, allBadges, pendingPetEvolution, markPetStageSeen, checkNewBadges } from '../gamification.js';
import { rewardsData } from '../curriculum/index.js';
import { mountMascot, foxLine } from '../ui/mascot.js';
import { navigate, refreshChrome } from '../ui/shell.js';
import { sfx } from '../ui/sound.js';
import { popup, confetti } from '../ui/celebrations.js';
import { showBadges } from './rewards.js';
import { escapeHtml } from '../ui/dom.js';

const stars = (n) => `<span class="stars" aria-label="${n} of 3 stars">${[0, 1, 2].map((i) => `<span class="${i < n ? 'on' : ''}">★</span>`).join('')}</span>`;

// one mission row (daily or weekly)
function missionRow(m) {
  const right = m.claimed
    ? '<span class="m-claimed" aria-label="claimed">✓</span>'
    : m.done
      ? `<button class="btn-claim" data-tier="${m.tier}" data-id="${m.id}" aria-label="Claim reward: ${m.coins} coins">Claim 🎁</button>`
      : `<span class="m-prog">${m.n}/${m.goal}</span>`;
  return `<div class="mission ${m.done ? 'done' : ''} ${m.claimed ? 'claimed' : ''}">
    <span class="m-emoji">${m.emoji}</span>
    <div class="m-body">
      <div class="m-title">${escapeHtml(m.title)}</div>
      <div class="m-bar"><div class="m-fill" style="width:${m.pct}%"></div></div>
    </div>${right}</div>`;
}
function missionsHtml() {
  const { daily, weekly } = listMissions();
  const ready = [...daily, ...weekly].filter((x) => x.done && !x.claimed).length;
  return `
    <div class="missions-head">
      <h3>🗺️ Missions${ready ? ` <span class="m-badge">${ready} ready!</span>` : ''}</h3>
      <span class="missions-sub muted">New daily quests each day</span>
    </div>
    <div class="missions-list">${daily.map(missionRow).join('')}</div>
    <details class="missions-weekly"${ready && weekly.some((w) => w.done && !w.claimed) ? ' open' : ''}>
      <summary>📆 Weekly quests <span class="muted">(bigger rewards)</span></summary>
      <div class="missions-list">${weekly.map(missionRow).join('')}</div>
    </details>`;
}

export function renderHome(root) {
  const grade = S.profile.grade;
  const comp = gradeCompletion(grade);
  const streak = S.progress.streak.count || 0;
  const daily = dailyStatus();
  const cont = recommendedSkill(isUnlocked);
  const reviews = dueReviews();
  const mistakes = mistakeCount();
  const showWarmup = warmupDue();
  const weekly = weeklyProgress();
  const lp = levelProgress();
  const badgeCount = allBadges().filter((b) => b.earned).length;
  const petName = (rewardsData.pets.find((p) => p.id === S.profile.avatar.pet) || { name: 'Your pet' }).name;
  const greeting = streak > 1
    ? `You've practiced ${streak} days in a row — keep it up! 🔥`
    : "Let's learn something awesome today.";

  root.innerHTML = `
    <section class="home-hero card-soft">
      <div class="home-mascot" id="home-mascot"></div>
      <div class="home-hello">
        <h1>Hi ${escapeHtml(S.profile.name || 'friend')}! 👋</h1>
        <p class="muted">${greeting}</p>
        <div class="hero-stats" aria-label="Your progress">
          <span class="hero-stat" title="Level"><span class="hs-ring" style="--p:${Math.round(lp.pct * 100)}"><b>${lp.level}</b></span><span class="hs-label">Level</span></span>
          <span class="hero-stat" title="Day streak"><span class="hs-num">🔥 ${streak}</span><span class="hs-label">streak</span></span>
          <span class="hero-stat" title="Badges earned"><span class="hs-num">🏅 ${badgeCount}</span><span class="hs-label">badges</span></span>
        </div>
        <button class="btn btn-big btn-play" id="daily-btn">⚡ Daily Challenge</button>
      </div>
    </section>

    ${cont ? `
    <button class="continue-card" id="continue-btn" data-id="${cont.id}">
      <span class="cont-emoji">${cont.emoji || '✏️'}</span>
      <span class="cont-text"><b>Keep going</b><span>${escapeHtml(cont.title)}</span></span>
      <span class="cont-go">▶</span>
    </button>` : ''}

    <div class="daily-goal card-soft">
      <div class="gp-row"><span>🎯 Today's goal</span><span><b>${Math.min(daily.count, daily.goal)}</b> / ${daily.goal} problems</span></div>
      <div class="goal-pips">${Array.from({ length: daily.goal }, (_, i) => `<span class="goal-pip ${i < daily.count ? 'on' : ''}"></span>`).join('')}</div>
      ${daily.reached ? '<p class="goal-done">Goal complete — you\'re a star today! 🌟</p>' : ''}
    </div>

    <section class="missions card-soft" id="missions-panel">${missionsHtml()}</section>

    ${weekly.goal ? `
    <div class="card-soft weekly-goal">
      <div class="wg-ring" style="--p:${Math.min(100, Math.round(weekly.days / weekly.goal * 100))}"><span>${Math.min(weekly.days, weekly.goal)}/${weekly.goal}</span></div>
      <div class="wg-text">📅 <b>This week's goal</b><br><span class="muted">${weekly.met ? 'Goal met this week — amazing! 🎉' : `${weekly.days} of ${weekly.goal} practice days`}</span></div>
    </div>` : ''}

    ${(showWarmup || mistakes || reviews.length) ? `
    <h3 class="section-h nudge-h">Quick boosts ✨</h3>
    <div class="home-nudges">
      ${showWarmup ? `
      <button class="continue-card warmup-card" id="warmup-btn">
        <span class="cont-emoji">🌅</span>
        <span class="cont-text"><b>Daily warm-up</b><span>${escapeHtml(petName)} wants to see what you remember!</span></span>
        <span class="cont-go">▶</span>
      </button>` : ''}
      ${mistakes ? `
      <button class="continue-card fixit-card" id="fixit-btn">
        <span class="cont-emoji">🔧</span>
        <span class="cont-text"><b>Fix-It time</b><span>${mistakes} tricky problem${mistakes > 1 ? 's' : ''} to master</span></span>
        <span class="cont-go">▶</span>
      </button>` : ''}
      ${reviews.length ? `
      <button class="continue-card review-card" id="review-btn">
        <span class="cont-emoji">🔁</span>
        <span class="cont-text"><b>Review time</b><span>${reviews.length} skill${reviews.length > 1 ? 's' : ''} ready for a quick refresh</span></span>
        <span class="cont-go">▶</span>
      </button>` : ''}
    </div>` : ''}

    <h3 class="section-h">Play &amp; explore 🎮</h3>
    <div class="home-cta-row">
      <button class="continue-card world-card" id="world-btn">
        <span class="cont-emoji">🗺️</span>
        <span class="cont-text"><b>Explore the World</b><span>Walk your pet around MathQuest Island!</span></span>
      </button>
      <button class="continue-card collection-card" id="collection-btn">
        <span class="cont-emoji">📖</span>
        <span class="cont-text"><b>My Collection</b><span>See everything you've found!</span></span>
      </button>
      <button class="continue-card quest-card" id="quest-btn">
        <span class="cont-emoji">⚔️</span>
        <span class="cont-text"><b>Pet Quest</b><span>A story adventure with your pet!</span></span>
      </button>
      <button class="continue-card sprint-card" id="sprint-btn">
        <span class="cont-emoji">⚡</span>
        <span class="cont-text"><b>Math Sprint</b><span>Beat your best in 60 seconds!</span></span>
      </button>
      <button class="continue-card magnitude-card" id="magnitude-btn">
        <span class="cont-emoji">📍</span>
        <span class="cont-text"><b>Number Line</b><span>Guess where the number goes!</span></span>
      </button>
      <button class="continue-card sort-card" id="sort-btn">
        <span class="cont-emoji">🌪️</span>
        <span class="cont-text"><b>Sort &amp; Storm</b><span>Tap the numbers that fit the rule!</span></span>
      </button>
    </div>

    <details class="grade-switch">
      <summary><span>📚 Grade ${grade}</span><span class="gs-hint">tap to switch grade</span></summary>
      <div class="grade-tabs" role="tablist" aria-label="Choose grade">
        ${GRADES.map((g) => `<button class="grade-tab ${g === grade ? 'active' : ''}" role="tab" aria-selected="${g === grade}" data-grade="${g}">Grade ${g}</button>`).join('')}
      </div>
    </details>

    <div class="grade-progress card-soft">
      <div class="gp-row">
        <span>Grade ${grade} journey</span>
        <span><b>${comp.done}</b> / ${comp.total} skills mastered</span>
      </div>
      <div class="progress-track"><div class="progress-fill" style="width:${(comp.pct * 100).toFixed(0)}%"></div></div>
    </div>

    <div id="strands"></div>
  `;

  const m = mountMascot(root.querySelector('#home-mascot'), { mood: 'wave', say: foxLine('greet'), size: 110 });
  setTimeout(() => m.setMood('idle'), 1600);

  // celebrate a pet "evolution" the first time we're back home after it advances
  const evo = pendingPetEvolution();
  if (evo) {
    markPetStageSeen();
    setTimeout(() => popup({
      emoji: '🌟', title: `${escapeHtml(petName)} grew up!`,
      sub: `Your pet is now ${evo.name}! Keep mastering skills to help it grow.`,
      sound: 'level', hold: true, confetti: true,
    }), 700);
  }

  // missions: claim a finished quest → reward + celebration, then re-render the panel
  const panel = root.querySelector('#missions-panel');
  const wireMissions = () => {
    panel.querySelectorAll('.btn-claim').forEach((b) => b.addEventListener('click', () => {
      const r = claimMission(b.dataset.tier, b.dataset.id);
      if (!r) return;
      sfx.coin(); confetti(90);
      popup({ emoji: r.emoji || '🎁', title: 'Mission complete!', sub: `+${r.coins} 🪙  +${r.treats} 🍪`, sound: 'badge' });
      panel.innerHTML = missionsHtml(); wireMissions(); refreshChrome();
      const fresh = checkNewBadges();
      if (fresh.length) setTimeout(() => showBadges(fresh, () => {}), 900);
    }));
  };
  wireMissions();

  root.querySelector('#daily-btn').addEventListener('click', () => { sfx.tap(); navigate('#/play'); });
  const revBtn = root.querySelector('#review-btn');
  if (revBtn) revBtn.addEventListener('click', () => { sfx.tap(); navigate('#/review'); });
  const fixBtn = root.querySelector('#fixit-btn');
  if (fixBtn) fixBtn.addEventListener('click', () => { sfx.tap(); navigate('#/fixit'); });
  const warmBtn = root.querySelector('#warmup-btn');
  if (warmBtn) warmBtn.addEventListener('click', () => { sfx.tap(); navigate('#/warmup'); });
  root.querySelector('#world-btn').addEventListener('click', () => { sfx.tap(); navigate('#/world'); });
  root.querySelector('#collection-btn').addEventListener('click', () => { sfx.tap(); navigate('#/collection'); });
  root.querySelector('#quest-btn').addEventListener('click', () => { sfx.tap(); navigate('#/adventure'); });
  root.querySelector('#sprint-btn').addEventListener('click', () => { sfx.tap(); navigate('#/sprint'); });
  root.querySelector('#magnitude-btn').addEventListener('click', () => { sfx.tap(); navigate('#/magnitude'); });
  root.querySelector('#sort-btn').addEventListener('click', () => { sfx.tap(); navigate('#/sort'); });
  const contBtn = root.querySelector('#continue-btn');
  if (contBtn) contBtn.addEventListener('click', () => {
    sfx.tap();
    const rec = skillRec(cont.id);
    navigate(rec.mastered ? `#/practice/${cont.id}` : rec.lessonDone ? `#/tutor/${cont.id}` : `#/learn/${cont.id}`);
  });

  const tabs = [...root.querySelectorAll('.grade-tab')];
  tabs.forEach((t) => {
    t.addEventListener('click', () => { sfx.tap(); S.profile.grade = +t.dataset.grade; persist(); renderHome(root); });
    t.addEventListener('keydown', (e) => {
      let i = tabs.indexOf(t);
      if (e.key === 'ArrowRight') i = (i + 1) % tabs.length;
      else if (e.key === 'ArrowLeft') i = (i - 1 + tabs.length) % tabs.length;
      else return;
      e.preventDefault();
      sfx.tap(); S.profile.grade = +tabs[i].dataset.grade; persist(); renderHome(root);
      const nt = root.querySelector('.grade-tab.active'); if (nt) nt.focus();
    });
  });

  const strandsHost = root.querySelector('#strands');
  const groups = groupedByStrand(grade);
  strandsHost.innerHTML = groups.map((g) => {
    const mastered = g.skills.filter((s) => isMastered(s.id)).length;
    return `
    <section class="strand" style="--strand:${g.color}">
      <header class="strand-head">
        <span class="strand-emoji">${g.emoji}</span>
        <span class="strand-name">${escapeHtml(g.strand)}</span>
        <span class="strand-count">${mastered}/${g.skills.length}</span>
      </header>
      <div class="skill-row">
        ${g.skills.map((s) => skillCard(s)).join('')}
      </div>
    </section>`;
  }).join('');

  strandsHost.querySelectorAll('.skill-card').forEach((c) =>
    c.addEventListener('click', () => {
      const id = c.dataset.id;
      if (c.classList.contains('locked')) {
        sfx.wrong();
        c.classList.remove('shake'); void c.offsetWidth; c.classList.add('shake');
        // explain WHY it's locked, kindly
        const sk = getSkill(id);
        const pr = (sk.prereq || []).map((p) => getSkill(p)).find((x) => x && !isMastered(x.id));
        m.setSay(pr ? `Master "${pr.title}" first to unlock this one! 🔒` : 'Finish the earlier skills to unlock this! 🔒', 'idle');
        return;
      }
      sfx.tap();
      const rec = skillRec(id);
      navigate(rec.mastered ? `#/practice/${id}` : rec.lessonDone ? `#/tutor/${id}` : `#/learn/${id}`);
    }));
}

function skillCard(s) {
  const unlocked = isUnlocked(s);
  const rec = S.progress.skills[s.id] || { stars: 0, mastered: false };
  const rusty = isRusty(rec);
  // for locked cards, name the prerequisite so "why is this locked?" is answerable
  // without tapping (tooltip + richer aria-label)
  const prereq = unlocked ? null
    : (s.prereq || []).map((p) => getSkill(p)).find((x) => x && !isMastered(x.id));
  const lockHint = prereq ? `Master "${prereq.title}" first` : 'Finish the earlier skills first';
  return `
    <button class="skill-card ${unlocked ? '' : 'locked'} ${rec.mastered ? 'mastered' : ''} ${rusty ? 'rusty' : ''}" data-id="${s.id}"
      ${unlocked ? '' : `title="🔒 ${escapeHtml(lockHint)}"`}
      aria-label="${escapeHtml(s.title)}${unlocked ? '' : ` (locked — ${lockHint})`}${rec.mastered ? ' (mastered)' : ''}${rusty ? ' (needs a refresh)' : ''}">
      ${rusty ? '<span class="rusty-flag" title="Time for a refresh!">🔄</span>' : ''}
      <span class="skill-emoji">${s.emoji || '✏️'}</span>
      <span class="skill-title">${escapeHtml(s.title)}</span>
      ${unlocked ? stars(rec.stars || 0) : '<span class="lock">🔒</span>'}
      ${rec.mastered ? '<span class="skill-check">✓</span>' : ''}
    </button>`;
}
