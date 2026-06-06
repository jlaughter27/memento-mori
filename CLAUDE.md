# CLAUDE.md

Guidance for Claude Code (and any developer) working in this repository.
Read this first. It is the single source of truth for **how this project is built and the
rules that must not be broken.**

---

## What this is

**MathQuest** — an interactive, **fully offline** math tutor for kids in **grades 3–6**.
It is a **static, zero-dependency, no-build Progressive Web App** written in vanilla
JavaScript (ES modules) + CSS. There is no backend, no framework, no bundler, no accounts.
All learner progress lives in `localStorage` on the device.

Primary user: an 8-year-old homeschooler. Tone: warm, encouraging, growth-mindset, never
condescending. Reading level ≈ 2nd grade for kid-facing copy.

---

## Run & test

```bash
npm start              # serve at http://localhost:8000 (python3 http.server)
# or: npm run serve    # via npx serve

npm test               # jsdom UI flows: smoke + smoke-v2 + mastery (installs jsdom first)
npm run engine:check   # property test: 1,000+ generated problems vs their own solvers
npm run docs:curriculum# regenerate docs/CURRICULUM.md from live data
```

A local server is required (ES modules + service worker don't run from `file://`).

---

## 🔒 Invariants — do not break these

1. **Offline, zero-dependency, no build.** No runtime npm packages, no framework, no
   bundler. `jsdom` is a dev-only test dependency (installed with `--no-save`).
2. **Relative paths only.** Every asset/import/SW registration uses `./` or `../` so the app
   works from any host or subpath (it ships on GitHub Pages under `/memento-mori/`).
   Never introduce a root-absolute `/...` path.
3. **Content is data.** Curriculum, word problems, badges, and standards are plain ES
   modules that `export default`. They follow [`docs/CONTENT_SCHEMA.md`](docs/CONTENT_SCHEMA.md)
   exactly. No logic or imports between content files.
4. **The engine is deterministic and self-verifying.** Every problem type must generate a
   problem, a full step-by-step solution, hints, and a `check()` that accepts its own answer.
   `npm run engine:check` must stay green.
5. **Release = bump two numbers together.** `APP_VERSION` in `js/version.js` **and** the
   `CACHE` name in `service-worker.js`. Add the new files to the SW precache list and a
   `CHANGELOG.md` entry. Installed apps self-update from this.
6. **`npm test` must pass before pushing.** It drives the real UI through jsdom.
7. **Accessibility is a feature, not a nice-to-have.** Keep focus styles, ARIA, color-blind
   safe states (icon + color), keyboard nav, and reduced-motion support.

---

## Architecture (1-minute version)

```
index.html ──> js/app.js (boot + hash router + SW update flow)
                  │
   ┌──────────────┼───────────────────────────────┐
   views/         engine/            ui/            state + gamification
   home,lesson,   problemTypes  ←─ the teaching     state.js (progress, localStorage)
   practice,...   (gen+solve+hint)  brain           gamification.js (XP, badges,
                  index (adaptive,                   streaks, daily, spaced review)
                  word problems)
                                     mascot, manipulatives (SVG),
                                     celebrations, sound, shell (HUD/nav), whatsnew
   curriculum/  grade3–6 · wordbank · rewards-data · standards · index (lookups)
```

Full detail: [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

### File responsibilities (quick map)

| Path | Responsibility |
|---|---|
| `js/app.js` | Boot, hash router, PWA update flow, "What's New" trigger |
| `js/state.js` · `storage.js` | Learner state model + `localStorage` persistence |
| `js/gamification.js` | XP/levels, coins, badges, streaks, daily goal, spaced review, recommendations |
| `js/version.js` | `APP_VERSION` + release notes |
| `js/engine/problemTypes.js` | **The teaching brain** — 25 problem types: generate + solve + hints + visual |
| `js/engine/index.js` | `nextProblem` (adaptive), word-problem builder, quiz sets |
| `js/engine/rng.js` | Seedable RNG |
| `js/curriculum/*` | Skill data (grades 3–6), word bank, rewards data, CCSS standards, aggregator |
| `js/ui/*` | mascot, manipulatives (SVG), celebrations/toasts, sound, shell (HUD+nav), dom helpers, whatsnew |
| `js/views/*` | Screens: home, lesson, practice, rewards, dashboard, onboard, curriculum |

---

## How to extend (common tasks)

- **Add a lesson/skill** → edit `js/curriculum/grade<N>.js` following §1 of the schema. Use
  only the problem `type`s the engine supports (§2). Add its CCSS code to
  `js/curriculum/standards.js`. Run `npm run docs:curriculum`. No engine changes needed.
- **Add a problem type** → implement `make<Name>(params, rng)` in `js/engine/problemTypes.js`
  returning `{prompt, answer, steps, hints, visual, inputKind, check}`; register it in `TYPES`.
  Add it to the schema table. `npm run engine:check`.
- **Add a manipulative** → add a renderer + `case` in `js/ui/manipulatives.js`, reference it
  via a `visual` descriptor from a problem type or lesson.
- **Add a badge / shop item / pet** → edit `js/curriculum/rewards-data.js` (schema §6).
- **Ship a release** → see Invariant #5 and `ROADMAP.md` → "How to cut a release".

See [`CONTRIBUTING.md`](CONTRIBUTING.md) for step-by-step recipes.

---

## Conventions

- Vanilla ES modules; views render via template strings + `addEventListener` (no virtual DOM).
- Match the surrounding code's style and comment density. Keep helpers small and pure.
- Kid-facing copy: short, warm, growth-mindset. Banned words in feedback: "Wrong!", "Easy!",
  ability praise ("You're so smart"). Use "not yet", effort praise, and offer help.
- Escape user/content strings in the DOM (`escapeHtml` / `mdInline` in `js/ui/dom.js`).
- Do **not** put the model identifier or internal IDs in committed artifacts.

---

## Docs index

Start at [`docs/INDEX.md`](docs/INDEX.md) for the full documentation map (project charter,
architecture, wiki, curriculum, privacy, testing, and the research that informed the design).
