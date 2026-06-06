# 🦊 MathQuest — Fun Math Adventures (Grades 3–6)

An interactive, **fully offline** math tutor built for kids. Foxy the guide teaches
each skill step-by-step, gives gentle hints, and celebrates every win with XP,
coins, badges, pets, and a dress-up shop. Designed for a homeschooling 8-year-old,
it grows with the child from **3rd through 6th grade**.

> No accounts, no internet, no API keys, nothing to install. Just open it and learn.
> All progress is saved privately on the device.

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
[`docs/research-landscape.md`](docs/research-landscape.md).

The teaching philosophy and reward design are grounded in research notes saved in
[`docs/research-curriculum.md`](docs/research-curriculum.md) and
[`docs/research-engagement.md`](docs/research-engagement.md).

---

## 🧱 How it's built

Vanilla JavaScript ES modules + CSS. **Zero runtime dependencies, zero build step.**

```
index.html               app shell (HUD + content + nav)
css/styles.css           full kid-friendly design system + themes
js/
  app.js                 boot + hash router
  state.js storage.js    progress model + localStorage
  gamification.js        XP, levels, coins, streaks, badges
  engine/                problem generation + step-by-step solvers + hints
  curriculum/            grade3–6 skills, word bank, rewards data
  ui/                    mascot, manipulatives (SVG), sound, celebrations, shell
  views/                 home map, lesson, practice, rewards, dashboard, onboarding
docs/                    research notes, content schema, automated tests
service-worker.js        offline caching
manifest.json            installable PWA
```

### Adding or editing content
All lessons are plain data following [`docs/CONTENT_SCHEMA.md`](docs/CONTENT_SCHEMA.md).
Edit `js/curriculum/grade*.js` to add skills — no engine changes needed for any of the
supported problem types.

---

## ✅ Tests

Automated DOM tests drive the real UI (onboarding → lesson → practice → mastery) and
verify the full reward loop with no runtime errors:

```bash
npm test
```
(installs `jsdom` on first run). There's also an engine self-check that generates
1,000+ problems and confirms every worked solution matches its answer.

---

Made with 🦊 and a lot of love for one curious kid.
