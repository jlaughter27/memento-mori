# Testing

MathQuest has no backend and no framework, so tests focus on two things: **the engine's answer
keys are always correct**, and **the real UI flows work end-to-end**. Everything runs in
Node + jsdom — no real browser needed.

```bash
npm test               # smoke + smoke-v2 + mastery (installs jsdom on first run)
npm run engine:check   # property test: 1,000+ generated problems vs their solvers
```

## The suites

### `tools/engine-check.mjs` — engine property test
Generates many problems for **every** problem type and asserts that each problem's own
`check()` accepts its own canonical `answer` (and that it has worked-solution steps). This is
the safety net that guarantees no student ever sees a wrong answer key. Exit code is non-zero
on any failure. Tune volume: `node tools/engine-check.mjs 100`.

### `tests/smoke.mjs` — core UX flow
Boots the app in jsdom and drives the **real** UI:
onboarding → home (skill cards) → lesson (all steps) → practice → uses **Hint** and
**Show me how** → answers correctly (reads the revealed answer) and asserts XP/coins/pip →
visits every route → opens all rewards tabs. Fails on any captured runtime error.

### `tests/smoke-v2.mjs` — v2 features
Placement quiz → standard tag on a lesson → curriculum map renders + **print** fires →
**What's New** modal opens/closes → forces a due skill and runs the **spaced-review** session.

### `tests/mastery.mjs` — full mastery loop
Answers a skill to completion and asserts: it shows as **mastered**, the **next skill
unlocks**, and stats/badges/XP/coins update **without double-counting** (a regression guard for
a real bug we fixed).

## How the jsdom harness works
Each test loads `index.html` into jsdom, stubs the handful of browser APIs the app touches
(`AudioContext`, `speechSynthesis`, `requestAnimationFrame`, canvas 2D context, `matchMedia`,
`print`), exposes them on `globalThis`, then `import`s `js/app.js` and dispatches DOM events.
A `window` error/rejection listener fails the run on any uncaught error.

Notes:
- Tests use timed `await wait(...)` because the practice loop schedules celebrations/advances
  on real timers; the waits are sized to those delays.
- Browser-native globals (`innerWidth`, `cancelAnimationFrame`, …) are stubbed in the harness,
  not worked around in source — source stays browser-correct.

## When you change things
- Touch the **engine**? Run `npm run engine:check`.
- Touch **views/flows**? Run `npm test`; if you add a screen or change onboarding, extend the
  relevant smoke test.
- Add **content**? `npm run engine:check` (validates the referenced types) + `npm run
  docs:curriculum`.

CI is intentionally simple/optional — these commands are the gate. Keep them green.
