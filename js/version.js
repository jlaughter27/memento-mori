// version.js — single source of truth for the app version + release notes.
// Bump APP_VERSION when shipping; the service worker cache + "What's New"
// modal key off this string so installed apps update themselves.
export const APP_VERSION = '2.0.0';

// Newest first. Shown in the in-app "What's New" modal on version change.
export const RELEASES = [
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
