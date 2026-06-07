# Changelog

All notable changes to MathQuest. Versions follow [Semantic Versioning](https://semver.org/).
The app version lives in `js/version.js` (and the service-worker cache name); bumping it
ships a self-update to every installed device.

## [2.9.0] — 2026-06-07 — "Crisp & Consistent"
A deep UI/UX + design polish pass driven by **five parallel audit agents**
(spacing/layout, text-overflow, accessibility, theming/states, and a PWA
best-practices research pass), integrated sequentially with tests after each wave.
### Fixed (real bugs)
- **Read-aloud kept playing after navigation** — `speak()` only cancelled on the
  next utterance; a long line continued after leaving the view. Added `stopSpeech()`
  and call it on every route change (`js/app.js`). Regression test added.
- **`apple-touch-icon` pointed at a non-existent `icon-192.png`** (404 on install).
  Now references the existing icon; added a proper `rel="icon"`.
- **Magnitude number-line**: a global keydown handler could persist after leaving the
  round — now self-cleans; the pin announces its value (`aria-valuetext`).
### Accessibility (WCAG 2.2 AA contrast)
- Answer-choice **correct/incorrect** colors now pass AA (white-on-green was 2.54:1 →
  `#047857`; error red darkened to `#b3261e`). Check button, `.std-tag`, streak, and
  the answer placeholder all darkened to meet contrast. Low-contrast theme `--p1`
  values (ocean/candy/dino/ice) darkened. Locked-badge fade no longer crushes text.
- `prefers-reduced-motion` now zeroes durations with `0s` (animations **and**
  transitions).
### Theming & consistency
- The chunky button shadow is now a per-theme token (`--p-shadow`) instead of a
  hard-coded purple — buttons/tabs match all 9 themes. The blue worked-solution panel
  + self-explain box recolor to the active theme (`--p1`).
- Added `--radius-md/-lg` and `--shadow-modal` tokens; modals use the token (visible
  on dark backgrounds). Dark decorative backgrounds (stars/galaxy/aurora) **frost**
  white cards/solution panels/scene-nodes so they stay legible.
- `:hover` affordance on pointer devices; stronger `:disabled` state.
### PWA hardening
- `touch-action:manipulation` on tap targets (kills the 300ms double-tap delay
  without disabling pinch-zoom). `<meta name="color-scheme" content="light">` so
  native form controls don't render dark-on-white in device dark mode. HUD respects
  `env(safe-area-inset-top)` (no more tucking under the notch in standalone mode).
- localStorage save failures (quota / private mode) now surface a gentle one-time
  notice instead of failing silently.
- **New `tests/precache.mjs`** guards invariant #5: every shipped JS/CSS file must be
  in the service-worker precache (catches "added a file, forgot the SW list").
### More text-overflow guard-rails
- `overflow-wrap:anywhere` extended to `.feedback`, `.stat-val`, `.mr-name`,
  `.ach-blurb`, `.rpt-mastered-name`, and curriculum-table descriptions.

## [2.8.0] — 2026-06-07 — "Polished to Fit"
A focused UI/UX + design-consistency pass.
### Added
- **Auto-fitting answers** — a new `fitText()` helper (`js/ui/dom.js`) shrinks the
  answer display's font to a floor as the child types, so long answers (decimals,
  times like `12:30`, remainders like `12 r 5`, mixed numbers) **stay inside the box**
  instead of overflowing. Wired into Practice, Pet Quest, and Math Sprint. Inputs are
  also length-capped (16 chars).
- **Long-prompt tiers** — `promptLen()` buckets a prompt by length and CSS scales/wraps
  it via `[data-len]`, so big **word problems** read as a paragraph (smaller, wrapped,
  left-aligned) while short math facts stay big and bold.
- **Design-token scale** — a 4px spacing ramp (`--s-1…--s-7`), a type ramp, and shared
  shadow/line tokens in `:root`, plus overflow guard-rails (`overflow-wrap:anywhere`)
  on every variable-length surface (choices, titles, bubbles, toasts, story text).
- **[docs/DESIGN_SYSTEM.md](docs/DESIGN_SYSTEM.md)** — the new single reference for tokens,
  the text-fit pattern, layout/responsiveness, accessibility, and common UI roadblocks.
### Why
- `fitText` and `promptLen` are **no-op-safe** where layout can't be measured (jsdom),
  so they're called unconditionally without breaking tests. The answer box also pairs
  with `white-space:nowrap; overflow:hidden` for a clean fallback.

## [2.7.0] — 2026-06-06 — "Grow Together"
### Added
- **Pet growth/evolution** — the pet advances through 4 stages (Little → Growing → Grown → Super)
  as skills are mastered, with a scale/glow, a stage badge, an evolution celebration, and bonding
  lines that reference the child's real history.
- **Mastery decay** — mastered skills that go long-overdue become "rusty" (a 🔄 flag on the map)
  and are weighted more heavily in review so decay is actively reversed.
- **Parent weekly goal** (practice days/week) shown as a ring on home; **collection summary** in
  Rewards (badges / pets / items owned vs. total).
- **Sort & Storm** mini-game (`#/sort`) — tap the numbers matching a rule; a new rule each round.
- **+3 grade-4 skills** (multiplicative comparison 4.OA.A.1, multi-step word problems 4.OA.A.3,
  fraction × whole 4.NF.B.4) → **89 skills, 68 standards**.

## [2.6.0] — 2026-06-06 — "Learn with Foxy"
### Added
- **Tutor mode (`#/tutor`)** — a teach-first "Learn with Foxy" flow is now the default learning
  path (lesson concept → fully worked example + self-explanation → practice that **fades**
  scaffolding as the child succeeds → independent). Lesson + home route into it until a skill is
  mastered, then drop to regular practice.
- **Number Line (Magnitude Match) mini-game (`#/magnitude`)** — Siegler number-line estimation,
  scored by closeness (never right/wrong), keyboard-accessible pin, beat-your-best.
- **Parent Efficacy Report (`#/report`)** — growth-first headline stats, mastery-by-topic, an
  accuracy sparkline (from a new on-device daily history log + mastery timestamps), retention
  health, recently-mastered with CCSS codes, printable. Plus in-app **privacy + accessibility
  statements** in the Grown-ups Corner.
### State
- Added `history` (rolling 30-day log), `magnitudeBest`, and `masteredAt` (per-skill).

## [2.5.0] — 2026-06-06 — "Polished & Hardened"
Driven by three parallel audit agents (correctness, accessibility, UX polish).
### Fixed (correctness)
- **`makeMean`** could produce a non-integer true mean → the worked solution showed a false
  equation and rejected the correct decimal. Now always averages to a whole number.
- **Quest crash**: `adventure.js` used `matchMisconception` without importing it (crashed the
  wrong-answer path). Fixed + a wrong-answer regression test added.
- **`makePercent`** float garbage in prompts; **`fractionAddSub`** wrong subtraction
  misconception + a `maxDenom:2` infinite-loop guard; **`placeValue`** expanded-form dead steps.
- **Timer/listener leaks**: Sprint timer and Practice keyboard handler / scheduled callbacks no
  longer run after you navigate away (could hijack a screen / double-count). Self-clear + cleanup.
### Accessibility (WCAG 2.2 AA pass)
- Removed `<main aria-live>` misuse; landmark labels + skip link; modals are real dialogs
  (focus, Escape, inert background, focus restore); feedback/mascot/pet/sprint live regions;
  SVG diagrams carry descriptive labels; decorative emoji/confetti hidden; 44px targets;
  reduced-motion zeroes transitions; high-contrast focus rings per theme.
### Polish
- Home reordered (primary action first; remedial cards grouped under "Quick boosts").
- Ability praise removed; grade-aware Sprint pool; clearer affordances; locked quest nodes 🔒;
  decorations spread out (no stacking) + removal acknowledged; rewards bar shows the equipped pet.

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
