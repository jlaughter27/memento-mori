// app.js — boot + hash router.
import { S, applyBodyClasses, persist } from './state.js';
import { updateStreakOnOpen, checkNewBadges } from './gamification.js';
import { renderHUD, renderNav, setRouter, refreshChrome } from './ui/shell.js';
import { primeAudio } from './ui/sound.js';
import { popup } from './ui/celebrations.js';
import { renderHome } from './views/home.js';
import { renderLesson } from './views/lesson.js';
import { renderPractice, renderPlay } from './views/practice.js';
import { renderRewards, showBadges } from './views/rewards.js';
import { renderDashboard } from './views/dashboard.js';
import { renderOnboard } from './views/onboard.js';

const content = () => document.getElementById('content');
const TOP_LEVEL = new Set(['', 'rewards', 'parent']);

function parseHash() {
  const h = (location.hash || '#/').replace(/^#\//, '');
  const [route, ...rest] = h.split('/');
  return { route, param: rest.join('/') };
}

function route() {
  // gate on onboarding
  if (!S.onboarded && location.hash !== '#/onboard') { location.hash = '#/onboard'; return; }

  const { route, param } = parseHash();
  const root = content();
  root.scrollTop = 0;
  window.scrollTo(0, 0);

  document.body.dataset.route = route || 'home';
  const showChrome = TOP_LEVEL.has(route) && S.onboarded;
  document.getElementById('nav').style.display = showChrome ? '' : 'none';
  document.getElementById('hud').style.display = (route === 'onboard') ? 'none' : '';

  switch (route) {
    case '': renderHome(root); break;
    case 'onboard': renderOnboard(root); break;
    case 'learn': renderLesson(root, param); break;
    case 'practice': renderPractice(root, param); break;
    case 'play': renderPlay(root); break;
    case 'rewards': renderRewards(root); break;
    case 'parent': renderDashboard(root); break;
    default: location.hash = '#/'; return;
  }
  refreshChrome();
}

function boot() {
  applyBodyClasses();
  if (S.onboarded) {
    const streak = updateStreakOnOpen();
    const fresh = checkNewBadges();
    if (fresh.length) setTimeout(() => showBadges(fresh, () => {}), 800);
    else if (streak.milestone) {
      setTimeout(() => popup({
        emoji: '🔥', title: `${streak.milestone}-day streak!`,
        sub: `You've practiced ${streak.milestone} days — amazing! Keep it going!`,
        sound: 'level', confetti: true, hold: true,
      }), 800);
    }
  }
  setRouter(route);
  window.addEventListener('hashchange', route);
  primeAudio();
  renderHUD(); renderNav();
  route();

  // PWA service worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./service-worker.js').catch(() => {});
  }
}

boot();
