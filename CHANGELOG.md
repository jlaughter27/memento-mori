# Changelog

All notable changes to MathQuest. Versions follow [Semantic Versioning](https://semver.org/).
The app version lives in `js/version.js` (and the service-worker cache name); bumping it
ships a self-update to every installed device.

## [2.4.0] — 2026-06-06 — "Math Sprint"
### Added
- **Math Sprint** mini-game (`js/views/sprint.js`, `#/sprint`) — a 60-second fact-fluency game
  (multiplication facts + add/sub within 100). **Beat-your-own-best** framing (a depleting time
  bar, no countdown penalty, no social comparison) per `docs/research/minigames.md`. Auto-advances
  on a correct answer; awards coins; stores a personal best. Reachable from a home CTA card.
### Tests
- `tests/sprint.mjs` drives start → countdown → solving → scoring.

## [2.3.0] — 2026-06-06 — "Make It Stick"
### Added
- **Mistakes Notebook / Fix-It loop** — a first-try miss notes the skill; a clean first-try-correct
  resolves one. A "🔧 Fix-It time" home card launches an interleaved session (`#/fixit`) that drills
  exactly the missed skills until the notebook empties. Wired into Practice + Pet Quest.
- **Daily warm-up** — once a day, a short interleaved retrieval check of past material (`#/warmup`),
  framed as the pet checking what you remember. Surfaces as a home card.
- Curriculum map now spans **all grades (2–7, 86 skills)**.
### Why
- Retrieval + spaced + interleaved practice is the strongest lever for durable memory
  (see `docs/research/learning-science.md`). This makes "mastered" mean "mastered and retained."

## [2.2.0] — 2026-06-06 — "Smarter Tutor & Grades 2–7"
### Added
- **Misconception-aware feedback** (`js/engine/problemTypes.js`): problems predict classic wrong
  answers and the tutor names the specific fix (no-carry, borrow/abs-columns, rounded-down,
  ignored remainder, added-denominators, bigger-denominator-is-bigger). Wired into Practice + Quest.
- **Grades 2 and 7** (`grade2.js` 12 skills, `grade7.js` 14 skills) — MathQuest now spans **grades
  2–7 (86 skills, 65 Common Core standards)**. `cc` tags + `getStandard()` fallback; dynamic `GRADES`.
- **Pet home decorations** (`decor-data.js`: 8 rooms + 18 items) — a Decorate panel to buy/equip
  rooms (room background) and collect/place decorations with coins. New `progress.home` state.
- **Research banked** in `docs/research/`: efficacy-measurement, grade2/grade7 standards, minigames,
  accessibility-compliance (WCAG 2.2 AA + COPPA), companion-design.
### Notes
- Grade-7 skills currently reuse existing engine types as proxies; dedicated types (solve-equation,
  circle/probability, signed mult/div) are speced in the research and on the roadmap (v2.6).

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
