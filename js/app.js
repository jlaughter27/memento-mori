// app.js — boot + hash router.
import { S, applyBodyClasses, persist } from './state.js';
import { updateStreakOnOpen, checkNewBadges } from './gamification.js';
import { renderHUD, renderNav, setRouter, refreshChrome } from './ui/shell.js';
import { primeAudio } from './ui/sound.js';
import { popup, toast } from './ui/celebrations.js';
import { APP_VERSION } from './version.js';
import { showWhatsNew } from './ui/whatsnew.js';
import { renderHome } from './views/home.js';
import { renderLesson } from './views/lesson.js';
import { renderPractice, renderPlay, renderReview, renderFixit } from './views/practice.js';
import { renderRewards, showBadges } from './views/rewards.js';
import { renderDashboard } from './views/dashboard.js';
import { renderCurriculum } from './views/curriculum.js';
import { renderPet } from './views/pet.js';
import { renderAdventure } from './views/adventure.js';
import { renderOnboard } from './views/onboard.js';

const content = () => document.getElementById('content');
const TOP_LEVEL = new Set(['', 'adventure', 'pet', 'rewards', 'parent']);

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
    case 'review': renderReview(root); break;
    case 'fixit': renderFixit(root); break;
    case 'rewards': renderRewards(root); break;
    case 'parent': renderDashboard(root); break;
    case 'curriculum': renderCurriculum(root); break;
    case 'pet': renderPet(root); break;
    case 'adventure': renderAdventure(root); break;
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
    // "What's New" after an update (covers upgraders, incl. from versions with no stored version)
    if (S.lastVersion !== APP_VERSION) {
      const firstEver = S.lastVersion === null && S.progress.stats.problemsAttempted === 0;
      S.lastVersion = APP_VERSION; persist();
      if (!firstEver) setTimeout(() => showWhatsNew(), fresh.length || streak.milestone ? 5200 : 1000);
    }
  }
  setRouter(route);
  window.addEventListener('hashchange', route);
  primeAudio();
  renderHUD(); renderNav();
  route();
  registerSW();
}

// PWA service worker + controlled update flow
function registerSW() {
  if (!('serviceWorker' in navigator)) return;
  navigator.serviceWorker.register('./service-worker.js').then((reg) => {
    const offerUpdate = () => {
      if (!reg.waiting) return;
      toast('A new version of MathQuest is ready! 🎉', {
        actionLabel: 'Update now',
        onAction: () => reg.waiting && reg.waiting.postMessage({ type: 'SKIP_WAITING' }),
      });
    };
    if (reg.waiting && navigator.serviceWorker.controller) offerUpdate();
    reg.addEventListener('updatefound', () => {
      const nw = reg.installing;
      if (!nw) return;
      nw.addEventListener('statechange', () => {
        if (nw.state === 'installed' && navigator.serviceWorker.controller) offerUpdate();
      });
    });
  }).catch(() => {});
  let refreshing = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (refreshing) return; refreshing = true; location.reload();
  });
}

boot();
