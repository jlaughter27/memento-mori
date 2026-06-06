# Contributing to MathQuest

Thanks for helping! MathQuest is a **vanilla-JS, zero-dependency, no-build PWA**. If you can
read JavaScript and run a local web server, you can contribute. First read
[CLAUDE.md](CLAUDE.md) (the rules & invariants) and [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## Setup

```bash
git clone <repo> && cd mathquest
npm start        # http://localhost:8000  (no install needed to run the app)
npm test         # installs jsdom (dev-only) and runs the UI suites
```

No build step. Edit a file, refresh the browser.

## Golden rules (don't break these)
- **No runtime dependencies, no framework, no bundler.** Keep it vanilla.
- **Relative paths only** (`./`, `../`) — it ships under a subpath on GitHub Pages.
- **Content is pure data** following [docs/CONTENT_SCHEMA.md](docs/CONTENT_SCHEMA.md).
- **`npm test` and `npm run engine:check` must pass** before you push.
- **Kid-facing copy:** warm, ~2nd-grade reading level, growth-mindset. No "Wrong!", no "Easy!",
  no ability praise.

---

## Recipes

### ➕ Add a lesson / skill
1. Open `js/curriculum/grade<N>.js` and add a skill object (schema §1). Use only an existing
   engine `type` (schema §2) for `practice`.
2. Add its Common Core code to `js/curriculum/standards.js` (`{ id: {code, domain, text} }`).
3. Double-check any numbers in `lesson.steps[].example` are correct.
4. `npm run docs:curriculum` to refresh the curriculum map. `npm test`.

### 🧩 Add a problem type (engine)
1. In `js/engine/problemTypes.js`, write `make<Name>(params, rng)` returning
   `{ prompt, answer, steps:[{text}], hints:[…], visual?, inputKind?, choices?, check }`.
   - `steps` may use `**bold**`. `hints` are plain text (shown by the mascot).
   - `check(raw)` must accept **every equivalent form** of the answer (use the helpers near the
     top of the file: `checkInt`, `checkDecimal`, `checkFraction`, `checkChoice`, `checkSet`).
2. Register it in the `TYPES` map.
3. Add it to the schema §2 table and use it from a skill's `practice.type`.
4. `npm run engine:check` (generates 1,000+ and verifies every `check(answer)`).

### 🖼️ Add a manipulative
Add a renderer function + a `case` in `js/ui/manipulatives.js`, then reference it from a
problem type or lesson via a `visual: { type:'yourType', … }` descriptor.

### 🏅 Add a badge / shop item / pet
Edit `js/curriculum/rewards-data.js` (schema §6). Badge `trigger.kind` must be one of the
supported kinds (see the schema). Use a single valid emoji.

### 🎨 Style / theme
All styles live in `css/styles.css` (CSS variables + `[data-theme]` / `[data-bg]` blocks).
Keep tap targets ≥ 64px, pair color with an icon/text, and respect `reduced-motion`.

---

## Shipping a release
1. Implement + make `npm test` and `npm run engine:check` green.
2. Bump `APP_VERSION` in `js/version.js` and add a `RELEASES` entry.
3. Bump `CACHE` in `service-worker.js` to match, and add any new files to its precache list.
4. Add a `CHANGELOG.md` section. Commit, push, open a PR.

## Pull requests
- Keep diffs focused; match the surrounding code style.
- Describe what changed and how you verified it (tests run, screenshots if UI).
- Don't commit `node_modules/` (it's git-ignored) or any internal/model identifiers.
