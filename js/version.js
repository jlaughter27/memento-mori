// version.js — single source of truth for the app version + release notes.
// Bump APP_VERSION when shipping; the service worker cache + "What's New"
// modal key off this string so installed apps update themselves.
export const APP_VERSION = '2.6.0';

// Newest first. Shown in the in-app "What's New" modal on version change.
export const RELEASES = [
  {
    v: '2.6.0',
    date: '2026-06-06',
    title: 'Learn with Foxy',
    items: [
      '🦊 Tutor mode — Foxy shows you how, helps you try, then lets you fly solo',
      '📍 New game: Number Line — guess where the number goes!',
      '📊 Grown-ups: a full progress report you can read & print',
    ],
  },
  {
    v: '2.5.0',
    date: '2026-06-06',
    title: 'Polished & Hardened',
    items: [
      '♿ Full accessibility pass — screen-reader friendly, keyboard-friendly',
      '✨ Lots of polish: cleaner home, friendlier feedback, smoother games',
      '🐛 Squashed bugs found by a deep audit (your pet quest is rock-solid now)',
    ],
  },
  {
    v: '2.4.0',
    date: '2026-06-06',
    title: 'Math Sprint',
    items: [
      '⚡ New mini-game: Math Sprint — how many can you solve in 60 seconds?',
      '🏆 Beat your own best score (no timers-against-others, no pressure)',
    ],
  },
  {
    v: '2.3.0',
    date: '2026-06-06',
    title: 'Make It Stick',
    items: [
      '🔧 Fix-It time — the problems you miss come back so you can master them',
      '🌅 Daily warm-up — your pet checks what you remember (spaced review)',
      '🧠 Learning that sticks: review beats forgetting',
    ],
  },
  {
    v: '2.2.0',
    date: '2026-06-06',
    title: 'Smarter Tutor & Grades 2–7',
    items: [
      '🧠 The tutor now spots common mistakes and explains the exact fix',
      '📚 New grades: 2nd and 7th — MathQuest now spans grades 2–7 (86 skills)',
      '🐾 New pet treats, rooms, and decorations to collect',
      '⭐ Every skill stays Common Core aligned (65 standards)',
    ],
  },
  {
    v: '2.1.0',
    date: '2026-06-06',
    title: 'Pet Quest & Tutor Mode',
    items: [
      '🐾 Pet Home — feed, play with, and pat your pet (with a happiness meter!)',
      '⚔️ Pet Quest — a 3-chapter story adventure where your pet is the hero',
      '🦊 Tutor mode — every quest challenge teaches you first, then you try',
      '🍪 Treat shop — spend coins on treats for your pet',
      '📐 Deep 4th-grade focus, aligned to national standards',
    ],
  },
  {
    v: '2.0.0',
    date: '2026-06-06',
    title: 'The Legit Update',
    items: [
      '📐 Every lesson now shows its Common Core standard',
      '🧭 Smart placement quiz finds the right starting point',
      '🔁 Spaced review brings back skills before they fade',
      '🎚️ Adaptive difficulty + daily goals',
      '🖼️ New visuals: percent bars, ratio tapes, 3-D volume, dot plots',
      '♿ Full accessibility pass (focus, zoom, color-blind safe)',
      '🔄 Auto-updates — the app now refreshes itself when a new version ships',
    ],
  },
  {
    v: '1.0.0',
    date: '2026-06-06',
    title: 'Hello, MathQuest!',
    items: ['First release: 60 lessons across grades 3–6, badges, pets, and a friendly fox.'],
  },
];

export const latestRelease = () => RELEASES[0];
