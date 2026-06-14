# Changelog

All notable changes to MathQuest. Versions follow [Semantic Versioning](https://semver.org/).
The app version lives in `js/version.js` (and the service-worker cache name); bumping it
ships a self-update to every installed device.

## [2.22.0] — 2026-06-07 — "Whole Family"
Multi-child profiles — a v3.0 Definition-of-Done gate item.
### Added
- **Multiple learners on one device.** localStorage now holds a *container*
  (`{ activeId, profiles }`); each child has fully independent name, grade, pet,
  coins, mastery, streak, settings — everything. Manage them in the Grown-ups Corner:
  a **Learners** list with **Switch**, **➕ Add a learner** (runs onboarding for the new
  child), and a two-tap remove (the last learner is protected).
- **Seamless migration:** an existing single-child save is automatically wrapped as the
  first profile — no data loss, no action needed.
### Internal
- `state.js` switches the live `S` in place (every module imports it by reference) and
  **deep-clones at the S ↔ container boundary** so profiles never alias each other.
  "Reset all progress" now resets only the active learner. New `tests/profiles.mjs`
  (migration, independent data, last-learner guard, persistence) + a `flows.mjs` UI step.

## [2.21.0] — 2026-06-07 — "Safe & Sound"
Bug-test pass (two parallel hunters: interactive/input-wiring + a broad regression
sweep) — every finding verified against the code before acting.
### Fixed
- **Escape dynamic strings in `popup()` and `toast()`.** Both injected `title`/`sub`/
  `emoji`/`message` into innerHTML without `escapeHtml`. The child's name is free-text
  input and the project convention is to escape everywhere — now hardened (no caller
  passes intentional HTML, so nothing changes visually). Regression-tested.
- `skillRec()` default now initializes `lessonDone:false` for consistency with the
  other fields (was relying on `undefined` being falsy).
### Verified clean (no fixes needed)
- The interactive manipulatives are sound across every den (2–12, bar + circle) and
  places (1–4, 20-cap, clamp); hint/show-me/solution + reward/replay all work for the
  non-keypad inputs; the wrong-answer path is null-safe (`#ans-display` guarded).
- State hydration/migration, router/chrome, reference-counted `inert`, and the
  gamification math (streak/XP/Leitner/pet-care clamping) all checked out.

## [2.20.0] — 2026-06-07 — "Polish Pass"
### Fixed
- **Interactive inputs:** tapping **Check** before shading/building sent `0`, which
  slipped past the keypad's empty-guard and counted as a wrong attempt (noting a
  mistake). Both the tap and build inputs now prompt the child to interact first.
  Found during a dynamic bug-test sweep; regression-tested.

## [2.19.0] — 2026-06-07 — "Building Blocks"
### Added
- **Interactive base-ten blocks** (`mountBaseTenBuild`, `inputKind:'build'`) — a child
  builds a multi-digit number by tapping ＋/－ in the Hundreds / Tens / Ones columns;
  the blocks render at place-appropriate sizes and a live region announces the running
  value. New engine type `baseTenBuild` + a grade-3 skill **"Build the Number"**
  (`g3-build-number`, CCSS 2.NBT.A.1). **91 skills · 75 standards.**
- Flows test drives the build (constructs the exact target from blocks → accepted);
  a11y route list scans the build controls.

## [2.18.0] — 2026-06-07 — "Pizza Fractions"
### Added
- **Tappable fraction *circle*** — `mountFractionTap` now renders a bar **or** a pie
  (SVG wedges as `role="button"`, keyboard + screen-reader operable). "Show the Fraction"
  randomly picks a bar or a circle each problem, reinforcing that a fraction is parts of
  *any* whole. Flows test deterministically exercises both shapes; a11y route list now
  scans the interactive skill.

## [2.17.0] — 2026-06-07 — "Hands-On Fractions"
The first **interactive manipulative** — kicks off the v3.0 hands-on-learning track.
### Added
- **Tappable fraction bar** (`js/ui/interactive.js`, `mountFractionTap`) — a new
  `inputKind:'tap'` where the child **shades parts of a bar by tapping** instead of
  typing. Every part is a real `<button>` (Tab + Enter/Space), with `aria-pressed` and a
  live region announcing the running count — fully screen-reader friendly.
- **New engine type `fractionShade`** ("Tap to shade N/D of the bar"; `check` = shaded
  count equals the numerator) and a new grade-3 skill **"Show the Fraction"**
  (`g3-fractions-shade`, CCSS 3.NF.A.1) that teaches concrete → abstract fraction sense.
  Wired into the practice loop. **90 skills · 74 standards.**
### Fixed
- `getStandard` no longer returns a bare `cc` string in the fallback path — it always
  returns the full `{code, domain, text}` shape, so a skill with only a `cc` field can't
  crash the curriculum-doc generator or render "undefined" in a lesson's standard tag.
- Practice now drops a previous problem's keypad `keydown` handler when switching input
  kinds (keypad → choice/tap) within a mixed session (daily challenge / review).

## [2.16.0] — 2026-06-07 — "Accessible by Default"
### Added
- **`tests/a11y.mjs`** — codifies invariant #7 as a CI gate: scans every interactive
  control (buttons, links, inputs, custom roles) across all 15 routes and fails if any
  lacks an accessible name, or uses a positive `tabindex`. Currently green — a future
  icon-button with no `aria-label` can no longer ship silently.
### Fixed
- The "What's New" modal's `close()` is now idempotent (a `closed` guard), so a fast
  double-tap can't unbalance the reference-counted `inert` focus-trap.

## [2.15.0] — 2026-06-07 — "Tested & True"
Continued hardening of the less-tested flows.
### Added
- **`tests/flows.mjs`** — a new integration suite driving the real UI through:
  dashboard settings (calm-mode + easy-font toggles apply the body class immediately;
  name/grade/weekly-goal persist; reset *arms* on one tap and only wipes on two),
  rewards (buy an item → owned +1 & coins deducted; buy + auto-equip a pet; equip a
  theme; an unaffordable buy shows a kind popup and makes no purchase), pet treats with
  0 coins, and adventure chapter unlock. All green — no bugs found in these paths.
### Hardened
- `rewards.js` `drawStyle` theme buttons now guard against a missing element (same
  defensive fix already applied to the shop grid).

## [2.14.0] — 2026-06-07 — "Bug Hunt"
A dedicated bug-testing pass: three parallel static audit agents (navigation/lifecycle,
engine/state/gamification, views/render/a11y) + dynamic fuzzing. Every finding was
verified against the code before fixing.
### Fixed (real bugs)
- **Broken fraction diagrams in lessons (P0-ish).** 18 curriculum visuals use `denom:`
  but the renderer destructured `{ num, den }`, so every lesson fraction bar/circle
  rendered **blank with a "3/undefined" label** (the engine uses `den`, which is why
  *practice* visuals worked). `manipulatives.js` now accepts both `den` and `denom`,
  and guards against a 0/negative denominator.
- **Stacked-modal focus trap (a11y).** If a child leveled up *and* hit the daily goal on
  the same answer, two pop-ups overlapped and the first to close removed `inert` from the
  background while the second was still open. `setInert` is now **reference-counted**
  (and also covers the new sub-header).
### Hardened (defensive — agent-flagged null derefs)
- Adventure hint button (`?.`), rewards shop item lookup, and mascot `setSay` now guard
  against missing elements.
### Tooling (permanent regression guards)
- **`npm run fuzz`** — `tools/fuzz.mjs` (10k problems: empty/garbage prompts, loose
  `check()` accepting empty/garbage, malformed choices), `tools/fuzz-skills.mjs` (19.8k:
  every skill × 5 difficulties + word problems), `tools/visual-check.mjs` (renders all 73
  curriculum diagrams, fails on silent-empty — would have caught the fraction bug).
- Smoke test gains a modal-inert reference-count regression.
### Verified clean
- The engine is mathematically sound across ~30k generated problems (no wrong math). The
  navigation refactor is clean — one agent's "listener leak" claim was a false positive
  (`innerHTML =` discards the old node + its listener).

## [2.13.0] — 2026-06-07 — "Clear Next Steps"
### Changed
- **Locked skills now name their prerequisite** — a tooltip + richer aria-label
  ("🔒 Master "X" first") answers "why is this locked?" without a tap.
### Verified
- Full DOM-snapshot visual QA at phone width (390px) across all 14 routes confirmed
  the new chrome: hubs show HUD + 4-item nav (subheader hidden); every sub-screen shows
  the slim back bar with the correct title and hides the kid HUD/nav; no leftover empty
  headers. (Real-browser screenshots weren't possible — the Chromium download is
  firewalled in the build sandbox.)

## [2.12.0] — 2026-06-07 — "Easy to Get Around"
A navigation / information-architecture overhaul (from the IA audit).
### Changed
- **One consistent back bar on every sub-screen.** A new router-managed sticky
  sub-header (`← Back · screen title · coins`, `shell.renderSubhead`) replaces the
  eight different bespoke in-view back buttons. Back always goes to the right parent
  (most → home; report/curriculum → grown-ups), so a child can never get stuck.
- **Bottom nav slimmed to the 4 kid hubs** (Learn · Quest · Pet · Rewards). The
  **Grown-ups** area moved to a **⚙️ gear in the HUD** and is now a sub-screen, so the
  kid nav is no longer mixed with parent tools.
- **Tidier home** — the grade switcher (noise for a single learner) collapses into a
  `<details>`; tap "Grade N" only when you actually want to switch.
- Sub-screens now hide the kid HUD/nav and focus on the task with the slim back bar.
### Internal
- Views with global listeners/timers (practice keydown, magnitude keydown, sort timer)
  now clean up on `hashchange`, since the child can leave via the shared back bar.
- New smoke coverage asserts the 4-hub nav, the HUD gear, and the working sub-header.

## [2.11.0] — 2026-06-07 — "Modern & Clean"
A modern-feel pass from three parallel audits (motion, navigation/IA, visual design).
### Added
- **View transitions** — the router now plays a subtle GPU-friendly enter animation
  (`viewEnter`, transform+opacity) on every route instead of an instant innerHTML
  swap, so screens glide in. Reduced-motion safe.
- **Motion token scale** — `--t-fast/-base/-slow` durations + a single `--ease` and
  `--ease-spring`; press feedback and modal entrances now share one easing language.
  Celebrations/what's-new spring in gently. Documented in `docs/DESIGN_SYSTEM.md`.
- **Home "Play & explore" shelf** — the four games now sit under a labeled section
  header for clearer information architecture.
### Changed (cleaner, calmer surfaces)
- Reduced visual noise: flattened the gradient hero/mastered-card backgrounds, swapped
  the **dashed** "big idea" boxes for solid soft borders, and unified grid cards
  (skill/badge/shop) to a consistent **2px** border + `--radius-md` + lighter shadow.
- More breathing room: larger section spacing and symmetric content padding.
- The bottom-nav **Grown-ups** (utility) item is now visually set apart from the kid
  destinations.

## [2.10.0] — 2026-06-07 — "Readable Everywhere"
Final polish from the five-agent audit.
### Added
- **Forced-colors / Windows High Contrast support** — the UI leans on box-shadow +
  fills (both stripped in that mode); a `@media (forced-colors:active)` block restores
  visible borders on cards/buttons, keeps progress meters colored
  (`forced-color-adjust:none`), and uses system focus outlines.
- **Reusable empty state** (`.empty-state`) with an icon — applied to the parent
  report's "no skills yet / nothing mastered" messages so they read as intentional.
### Fixed
- **Dark-background legibility** — yellow "big idea" boxes, adventure scene-link
  connectors, and progress pips were near-invisible on stars/galaxy/aurora; now lifted.
- **Focus-ring contrast** — bumped card/choice/key outline offset to 3px and added
  high-contrast focus colors for the robot and magic themes (all 9 now covered).

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
