# 🦊 MathQuest — Fun Math Adventures (Grades 3–6)

An interactive, **fully offline** math tutor built for kids. Foxy the guide teaches
each skill step-by-step, gives gentle hints, and celebrates every win with XP,
coins, badges, pets, and a dress-up shop. Designed for a homeschooling 8-year-old,
it grows with the child from **3rd through 6th grade**.

> No accounts, no internet, no API keys, nothing to install. Just open it and learn.
> All progress is saved privately on the device.

**[▶️ Live demo](https://jlaughter27.github.io/memento-mori/)** ·
**[📚 Docs](docs/INDEX.md)** ·
**[🗺️ Master Plan](docs/MASTER_PLAN.md)** ·
**[🛣️ Roadmap](ROADMAP.md)** ·
**[📓 Changelog](CHANGELOG.md)** ·
**[🔒 Privacy](docs/PRIVACY.md)** ·
MIT licensed · v2.1

---

## ▶️ How to run it

It's a static web app (a PWA). You only need a tiny local web server because it
uses JavaScript modules.

**Easiest (Python, already on most machines):**
```bash
cd mathquest
python3 -m http.server 8000
```
Then open **http://localhost:8000** in any modern browser (Chrome/Safari/Edge).

**Or with Node:**
```bash
npm run serve        # uses npx serve
```

On a phone or tablet you can "Add to Home Screen" to install it like an app, and
it will then work completely offline.

---

## ✨ What's inside

- **60 lessons across grades 3–6**, organized by topic (place value, +−×÷, fractions,
  decimals, geometry, measurement, data, ratios, percent, integers, and more).
- **A real teaching engine** — every problem is generated fresh and comes with a full
  **step-by-step worked solution** ("📖 Show me how") and a **3-step hint ladder**
  (💡), so the child is never stuck. It explains long division, regrouping, common
  denominators, the area model, and more — the way a patient tutor would.
- **Pictures that teach**: number lines, base-ten blocks, multiplication arrays,
  fraction bars & circles, equal groups, area grids, and clocks — drawn live as SVG.
- **75 themed word problems** (animals, space, baking, ocean, dinosaurs…) that teach
  the *strategy*, not just the arithmetic.
- **Rewards that motivate without bribing**: XP & levels, coins, **36 badges**, daily
  challenge, gentle grace-day streaks, a **shop** (38 items), and **11 collectible pets**.
- **🐾 Pet Home**: feed, play with, and pat your pet — with a **happiness meter** and a treat
  shop, so the coins and pets have a cozy place to live.
- **⚔️ Pet Quest**: a 3-chapter story adventure (focused on **4th grade**) where your pet is
  the hero and every obstacle is a math problem **taught before it's tested** — a real
  **tutor mode**: concept → worked example → "tell your pet why" → your turn (with hints).
- **Kid-first design**: big tap targets, friendly mascot, encouraging growth-mindset
  language, sound effects, and confetti. Wrong answers are met with "not yet" and help —
  never "wrong!".
- **Grown-ups Corner**: a parent dashboard with progress, mastery-by-topic, accuracy,
  and settings (sound, read-aloud, calm/reduced-motion mode, easy-reading font, reset).

### Built to be legit 🎓
- **Common Core aligned** — every skill is tagged with its CCSS standard, shown in the
  lesson and on a **printable curriculum map** in the parent area.
- **Placement quiz** at onboarding finds the right starting grade.
- **Spaced review** — mastered skills resurface on a lengthening schedule (3→7→16→35 days)
  so they actually stick (retrieval practice).
- **Private by design** — no accounts, no ads, no tracking; everything stays on the device.
- **Self-updating** — installed apps detect new versions and offer a one-tap update, with a
  "What's New" sheet. See [`CHANGELOG.md`](CHANGELOG.md) and [`ROADMAP.md`](ROADMAP.md).
- Accessibility: visible focus, pinch-zoom, color-blind-safe answer states, keyboard nav,
  ARIA, reduced-motion + dyslexia-font + read-aloud options.

The market/credibility research behind these is in
[`docs/research/landscape.md`](docs/research/landscape.md).

The teaching philosophy and reward design are grounded in research notes saved in
[`docs/research/pedagogy.md`](docs/research/pedagogy.md) and
[`docs/research/engagement.md`](docs/research/engagement.md).

---

## 🧱 How it's built

Vanilla JavaScript ES modules + CSS. **Zero runtime dependencies, zero build step.**

```
index.html · manifest.json · service-worker.js   PWA shell (offline + self-update)
css/styles.css                                    design system + themes
js/
  app.js                  boot + hash router + update flow
  state.js · storage.js   progress model + localStorage
  gamification.js         XP, levels, coins, streaks, badges, daily, spaced review
  version.js              app version + release notes
  engine/                 problem generation + step-by-step solvers + hints
  curriculum/             grade3–6 · wordbank · rewards-data · standards · index
  ui/                     mascot · manipulatives (SVG) · sound · celebrations · shell · whatsnew
  views/                  home · lesson · practice · rewards · dashboard · onboard · curriculum
docs/                     all documentation (start at docs/INDEX.md) + research/
tests/                    smoke · smoke-v2 · mastery (jsdom)
tools/                    engine-check · gen-curriculum-doc
```

For the full design, see [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md). New contributors:
[`CONTRIBUTING.md`](CONTRIBUTING.md). Working with an AI agent: [`CLAUDE.md`](CLAUDE.md).

### Adding or editing content
All lessons are plain data following [`docs/CONTENT_SCHEMA.md`](docs/CONTENT_SCHEMA.md).
Edit `js/curriculum/grade*.js` to add skills — no engine changes needed for any of the
supported problem types — then `npm run docs:curriculum`.

---

## 📚 Documentation

Everything lives in **[`docs/INDEX.md`](docs/INDEX.md)**. Highlights:

| Doc | What |
|---|---|
| [Project Charter](docs/PROJECT.md) | Vision, principles, status, metrics |
| [Architecture](docs/ARCHITECTURE.md) | System design, the teaching engine, data flow |
| [Wiki & FAQ](docs/WIKI.md) | Every feature + glossary + parent FAQ |
| [Curriculum Map](docs/CURRICULUM.md) | Auto-generated scope & sequence + Common Core |
| [Content Schema](docs/CONTENT_SCHEMA.md) | The locked data contract for content |
| [Privacy](docs/PRIVACY.md) · [Testing](docs/TESTING.md) | Trust + how the tests work |

---

## ✅ Tests

```bash
npm test               # jsdom UI flows: smoke + smoke-v2 + mastery
npm run engine:check   # 1,000+ generated problems vs their own solvers
```

The UI tests drive the real app (onboarding → lesson → practice → mastery, plus placement,
curriculum map, spaced review) with zero runtime errors. The engine check guarantees every
worked solution matches its answer. See [`docs/TESTING.md`](docs/TESTING.md).

---

Made with 🦊 and a lot of love for one curious kid.
