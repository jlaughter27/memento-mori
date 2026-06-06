# Architecture

MathQuest is a **static, offline, zero-dependency PWA** in vanilla ES modules + CSS.
No framework, no bundler, no build step. This document explains how the pieces fit.

---

## 1. Layers

```
┌──────────────────────────────────────────────────────────────────────┐
│  index.html  ·  manifest.json  ·  service-worker.js   (PWA shell)      │
└──────────────────────────────────────────────────────────────────────┘
        │ loads
┌───────▼──────────────────────────────────────────────────────────────┐
│  app.js   boot + hash router + PWA update flow + "What's New"          │
└───┬───────────────┬───────────────────────┬──────────────────────────┘
    │               │                        │
┌───▼────┐   ┌──────▼───────┐        ┌───────▼────────────────────────┐
│ views/ │   │   ui/        │        │  state.js  +  gamification.js   │
│ screens│◄──┤ shell, mascot│        │  progress model, XP, badges,    │
│        │   │ manipulatives│        │  streaks, daily, spaced review  │
│        │   │ celebrations │        └───────┬────────────────────────┘
│        │   │ sound, dom   │                │ reads/writes
│        │   │ whatsnew     │        ┌───────▼────────────────────────┐
└───┬────┘   └──────────────┘        │  storage.js → localStorage      │
    │ asks for problems              └─────────────────────────────────┘
┌───▼──────────────────────────┐    ┌─────────────────────────────────┐
│  engine/                     │    │  curriculum/  (pure data)       │
│  index.js   nextProblem()    │◄───┤  grade3–6 · wordbank ·          │
│  problemTypes.js  (25 types) │    │  rewards-data · standards ·     │
│  rng.js                      │    │  index (aggregator + lookups)   │
└──────────────────────────────┘    └─────────────────────────────────┘
```

**Dependency direction:** views → (engine, ui, state/gamification) → (curriculum data, storage).
Content data never imports code. The engine never imports views.

---

## 2. Boot & routing (`app.js`)

1. `applyBodyClasses()` (theme, reduced-motion, dyslexia font).
2. If onboarded: update the **streak**, check for **new badges**, and decide whether to show
   the **"What's New"** modal (when `state.lastVersion !== APP_VERSION`).
3. Install the router on `hashchange`, render the current route, register the service worker.

Routing is **hash-based** (`#/`, `#/learn/:id`, `#/practice/:id`, `#/play`, `#/review`,
`#/rewards`, `#/parent`, `#/curriculum`, `#/onboard`). Each route calls a `renderX(root, param)`
that paints `#content` and wires events. A persistent **HUD** (level/XP/coins/streak) and
**bottom nav** live outside `#content` and are refreshed via `ui/shell.js`. Because routing is
hash-only, the server never needs rewrites — any host serving `index.html` works.

---

## 3. The teaching engine (`engine/`) — the crown jewel

Each problem **type** is a pure function `make<Type>(params, rng) → Problem`:

```js
Problem = {
  prompt,                 // display string, e.g. "23 × 4 = ?"
  answer,                 // canonical answer string
  steps: [{text}],        // full worked solution (markdown **bold** allowed)
  hints: [string],        // progressive ladder (plain text — shown by the mascot)
  visual,                 // optional manipulative descriptor (see ui/manipulatives)
  inputKind,              // 'number' | 'fraction' | 'choice' | 'text'
  choices,                // for choice questions
  check(raw) -> boolean,  // accepts any equivalent form of the answer
}
```

- **25 types** today: `add, sub, mult, div, placeValue, rounding, compare, fractionCompare,
  equivFraction, fractionAddSub, fractionOfNum, decimalAddSub, decimalCompare, factors,
  patterns, order, perimeterArea, volume, time, money, measure, ratio, percent, integers, mean`.
- `engine/index.js` exposes **`nextProblem(skill, diff)`** — reads the skill's `practice`
  spec, applies an **adaptive difficulty** nudge (`diff ∈ −2..+2` scales params like `digits`),
  and returns a problem. It also builds **word problems** from the bank (fills `{a,b,c}`
  templates, evaluates `answerExpr` in a sandbox, prefers integer answers) and **quiz sets**.
- **Self-verifying:** every type's `check()` must accept its own `answer`. `npm run engine:check`
  generates 1,000+ problems and asserts this — the safety net that keeps answer keys correct.

Why deterministic (not an LLM)? Reliability and offline-first. A child must never see a wrong
answer key or a blank screen with no network. The engine is exhaustively testable.

---

## 4. Content as data (`curriculum/`)

Pure ES modules that `export default` arrays/objects following
[`CONTENT_SCHEMA.md`](CONTENT_SCHEMA.md):

- `grade3.js … grade6.js` — **skills**: id, grade, strand, title, emoji, prereqs, a warm
  `lesson` (hook → big idea → steps → optional visual), and a `practice` spec (engine `type` +
  `params` + count).
- `wordbank.js` — 75 themed word-problem templates.
- `rewards-data.js` — badges (with triggers), shop items, pets.
- `standards.js` — `{ skillId: {code, domain, text} }` Common Core alignment.
- `index.js` — aggregates everything; exposes `getSkill`, `getStandard`, `groupedByStrand`,
  `STRANDS`, `standardsCount`, etc.

Adding content requires **no engine changes** as long as it uses supported types.

---

## 5. State & persistence (`state.js`, `storage.js`)

A single object `S` is the source of truth, persisted to one `localStorage` key
(`mathquest.v1`) via a debounced writer. On load it's **hydrated** (deep-merged with defaults)
so older saves gain new fields safely.

```
S = {
  profile:  { name, grade, mascotName, avatar:{pet, accessories, theme, background} },
  progress: {
    xp, level, coins,
    streak:{ count, lastActiveDate, graceUsed },
    daily:{ date, count, goalReached },
    skills:{ [id]: { attempts, correct, mastered, stars, lastSeen, lessonDone,
                     reviewStage, reviewAt } },
    badges:[…], owned:[…], stats:{…}, settings:{ sound, reducedMotion, dyslexicFont, tts },
  },
  onboarded, lastVersion,
}
```

Skill **unlocking** is prerequisite-gated (same-grade prereqs must be mastered; cross-grade
prereqs are tolerated/ignored). `state.js` also owns `applyBodyClasses()` (theme/bg/a11y).

---

## 6. Gamification (`gamification.js`)

- **XP & levels:** `xpToReach(level)` is a rising sum; correct answers grant XP (+ first-try
  bonus), lessons/mastery grant more; level-ups award bonus coins.
- **Coins:** spent in the shop; a ~1-in-6 "surprise" bonus adds delight (variable reward, not a
  gamble).
- **Streaks:** grace-day, positively framed; milestones (3/5/7/14/21/30/50/100) trigger a popup.
- **Daily goal:** 10 problems/day; resets per calendar day; celebrates completion.
- **Badges:** declarative `trigger` kinds evaluated against `stats` (`problemsCorrect`,
  `skillsMastered`, `strandMastered`, `streakDays`, `levelReached`, …).
- **Spaced review (Leitner-lite):** mastering a skill schedules `reviewAt` on a lengthening
  ladder (3→7→16→35→70 days). `dueReviews()` surfaces a "Review time" card; completing a review
  session pushes each skill further out. This is the core retention mechanism.
- **Recommendation:** `recommendedSkill()` powers the home "Keep going" card.

---

## 7. UI layer (`ui/`)

- `shell.js` — the persistent HUD + bottom nav + `navigate()` + the router hook.
- `mascot.js` — **Foxy**, an SVG fox with moods (idle/happy/think/celebrate/encourage/wave/
  proud/surprised) and a speech bubble (optionally read aloud).
- `manipulatives.js` — pure SVG renderers from a `visual` descriptor (number line, base-ten
  blocks, arrays, fraction bars/circles, equal groups, area grid, clock, money, percent bar,
  ratio tape, 3-D box, dot plot).
- `celebrations.js` — confetti (canvas), centered `popup`, bottom `toast`, floaty `+XP/+coins`,
  sparkles. All respect reduced-motion.
- `sound.js` — procedural WebAudio SFX (no audio files) + optional text-to-speech.
- `whatsnew.js` — release-notes modal. `dom.js` — tiny helpers (`el`, `escapeHtml`, `mdInline`).

Rendering is **template strings + `addEventListener`** — no virtual DOM. Views fully repaint
`#content` on navigation; the HUD/nav update independently.

---

## 8. PWA & the self-update flow

- `manifest.json` makes it installable; `service-worker.js` precaches the app shell for
  **offline** use (cache-first, then network-revalidate).
- **Controlled updates:** the SW does **not** auto-activate. On a new deploy the app detects the
  waiting worker and shows a **"Update now"** toast; tapping posts `SKIP_WAITING`, the new SW
  activates, and `controllerchange` reloads the page. No stale installs, no surprise reloads.
- **Cutting a release:** bump `APP_VERSION` (`js/version.js`) **and** `CACHE`
  (`service-worker.js`) together, add the new files to the precache list, add a `CHANGELOG.md`
  entry and a `RELEASES` item. See `ROADMAP.md` → "How to cut a release".

---

## 9. Testing (see [TESTING.md](TESTING.md))

- `tools/engine-check.mjs` — property test of the engine (answer-key correctness).
- `tests/smoke.mjs` — onboarding → home → lesson → practice (hints, show-me-how, correct path)
  → all routes.
- `tests/smoke-v2.mjs` — placement quiz, standards on lessons, curriculum map + print,
  "What's New", spaced review.
- `tests/mastery.mjs` — drives a skill to full mastery; asserts unlock + rewards + no
  double-counting.

All run in **jsdom** with small browser stubs — no real browser required.

---

## 10. Why these choices

| Decision | Reason |
|---|---|
| No backend / accounts | Privacy, zero cost, works offline, nothing to operate |
| No framework / build | Longevity, auditability, instant load, anyone can read it |
| Deterministic engine | Correct answer keys, fully testable, no network dependency |
| Content as pure data | Non-engineers (or agents) can add lessons safely |
| Hash routing | Works on any static host/subpath with no server config |
| Controlled SW updates | Reliable upgrades without breaking an in-progress session |
