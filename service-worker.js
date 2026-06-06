// service-worker.js — offline-first caching with a controlled update flow.
// Bump CACHE on every release (mirrors APP_VERSION in js/version.js).
const CACHE = 'mathquest-2.4.0';
const ASSETS = [
  './', './index.html', './manifest.json', './assets/icon.svg',
  './css/styles.css',
  './js/app.js', './js/state.js', './js/storage.js', './js/gamification.js', './js/version.js',
  './js/engine/index.js', './js/engine/problemTypes.js', './js/engine/rng.js',
  './js/curriculum/index.js', './js/curriculum/grade2.js', './js/curriculum/grade3.js',
  './js/curriculum/grade4.js', './js/curriculum/grade5.js', './js/curriculum/grade6.js',
  './js/curriculum/grade7.js', './js/curriculum/wordbank.js', './js/curriculum/rewards-data.js',
  './js/curriculum/standards.js', './js/curriculum/adventures.js', './js/curriculum/decor-data.js',
  './js/ui/dom.js', './js/ui/shell.js', './js/ui/sound.js', './js/ui/mascot.js',
  './js/ui/manipulatives.js', './js/ui/celebrations.js', './js/ui/whatsnew.js',
  './js/views/home.js', './js/views/lesson.js', './js/views/practice.js',
  './js/views/rewards.js', './js/views/dashboard.js', './js/views/onboard.js',
  './js/views/curriculum.js', './js/views/pet.js', './js/views/adventure.js', './js/views/sprint.js',
];

self.addEventListener('install', (e) => {
  // Cache the new version, but DON'T auto-activate — the app prompts the user,
  // then posts SKIP_WAITING so the update applies on their tap.
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.map((k) => (k !== CACHE ? caches.delete(k) : null))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('message', (e) => {
  if (e.data && e.data.type === 'SKIP_WAITING') self.skipWaiting();
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
