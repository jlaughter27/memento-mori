// service-worker.js — offline-first caching for MathQuest.
const CACHE = 'mathquest-v1';
const ASSETS = [
  './', './index.html', './manifest.json', './assets/icon.svg',
  './css/styles.css',
  './js/app.js', './js/state.js', './js/storage.js', './js/gamification.js',
  './js/engine/index.js', './js/engine/problemTypes.js', './js/engine/rng.js',
  './js/curriculum/index.js', './js/curriculum/grade3.js', './js/curriculum/grade4.js',
  './js/curriculum/grade5.js', './js/curriculum/grade6.js', './js/curriculum/wordbank.js',
  './js/curriculum/rewards-data.js',
  './js/ui/dom.js', './js/ui/shell.js', './js/ui/sound.js', './js/ui/mascot.js',
  './js/ui/manipulatives.js', './js/ui/celebrations.js',
  './js/views/home.js', './js/views/lesson.js', './js/views/practice.js',
  './js/views/rewards.js', './js/views/dashboard.js', './js/views/onboard.js',
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keys) =>
    Promise.all(keys.map((k) => k !== CACHE && caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  const { request } = e;
  if (request.method !== 'GET') return;
  e.respondWith(
    caches.match(request).then((cached) => {
      const net = fetch(request).then((resp) => {
        if (resp && resp.status === 200 && resp.type === 'basic') {
          const copy = resp.clone();
          caches.open(CACHE).then((c) => c.put(request, copy));
        }
        return resp;
      }).catch(() => cached);
      return cached || net;
    })
  );
});
