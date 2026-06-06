# Changelog

All notable changes to MathQuest. Versions follow [Semantic Versioning](https://semver.org/).
The app version lives in `js/version.js` (and the service-worker cache name); bumping it
ships a self-update to every installed device.

## [2.1.0] — 2026-06-06 — "Pet Quest & Tutor Mode"
### Added
- **Pet Home** (`js/views/pet.js`) — care for your companion: feed (treats), play, and pat,
  with a **happiness** meter and **fullness** meter that gently drift over real time. A small
  in-app treat shop spends coins; playing sometimes turns up bonus coins.
- **Pet Quest** (`js/views/adventure.js`, `js/curriculum/adventures.js`) — a 3-chapter,
  15-scene story adventure where your pet is the hero and every obstacle is a **4th-grade**
  math problem. Chapters unlock in sequence; scenes reward coins, treats, and pet happiness.
- **Tutor mode (teach-first):** each new concept in the quest is taught before it's tested —
  concept → fully worked example (step-by-step, with the visual) → a **self-explanation**
  prompt ("tell your pet why it works") → your turn, with the hint ladder + "show me".
- Bottom nav reorganized: **Learn · Quest · Pet · Rewards · Grown-ups** (Daily Challenge moved
  to a button on the home screen). Home gains a Pet Quest discovery card.
- New research informing this release: `docs/research/grade4-standards.md`,
  `docs/research/tutor-design.md`, `docs/research/learning-science.md`.
### Notes
- Deeper tutor features (worked-example *fading*, step-level error feedback, BKT-style mastery)
  are speced in the research docs and scheduled on the roadmap.

## [2.0.0] — 2026-06-06 — "The Legit Update"
### Added
- **Common Core alignment** — every skill is tagged with its CCSS standard, shown in the
  lesson header and the Grown-ups dashboard (`js/curriculum/standards.js`).
- **Placement quiz** in onboarding to find the right starting grade.
- **Spaced review** — mastered skills resurface for a quick refresh before they fade.
- **Self-updating PWA** — installed apps detect new versions and offer a one-tap update;
  a "What's New" sheet summarizes each release.
- **New visual manipulatives**: percent bars, ratio tape diagrams, 3-D volume boxes, dot plots.
- **Adaptive difficulty**, **daily goals**, streak milestones, and session accuracy summaries.
### Changed
- Worked solutions re-show the picture and **bold** the key step; ALL-CAPS replaced with bold.
### Accessibility
- Visible focus rings, pinch-zoom re-enabled, color-blind-safe ✓/✗ answer states,
  keyboard-navigable tabs, ARIA on the XP bar, dark-theme legibility fixes.
### Fixed
- Fraction keypad now has a working space key (mixed-number answers were unenterable).
- Hardened the practice session against double-award / double-render edge cases.

## [1.0.0] — 2026-06-06 — "Hello, MathQuest!"
### Added
- First release: 60 lessons across grades 3–6, a deterministic teaching engine with
  step-by-step solutions and a hint ladder, 75 word problems, 36 badges, a shop, 11 pets,
  a friendly mascot, sound, confetti, a parent dashboard, and offline PWA support.
