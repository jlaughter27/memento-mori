# 📚 MathQuest Documentation

Welcome to the MathQuest docs. Everything you need, organized by who you are.

> **MathQuest** is a fully offline, zero-dependency math-tutor PWA for grades 3–6.
> Live: https://jlaughter27.github.io/memento-mori/

---

## 🧭 Start here

| If you are… | Read this |
|---|---|
| A **parent / homeschooler** | [README](../README.md) → [Wiki & FAQ](WIKI.md) → [Curriculum Map](CURRICULUM.md) → [Privacy](PRIVACY.md) |
| A **developer / contributor** | [CLAUDE.md](../CLAUDE.md) → [Architecture](ARCHITECTURE.md) → [Contributing](../CONTRIBUTING.md) → [Testing](TESTING.md) |
| An **AI agent (Claude Code)** | [CLAUDE.md](../CLAUDE.md) (rules & invariants) then this index |
| A **reviewer / stakeholder** | [Master Plan](MASTER_PLAN.md) → [Project Charter](PROJECT.md) → [Roadmap](../ROADMAP.md) |

---

## 📄 All documents

### Product & vision
- **⭐ [Master Plan](MASTER_PLAN.md)** — the North Star outcome, the work-backward decomposition,
  and the sequenced plan to v3.0. **Start here for the big picture.**
- **[Project Charter](PROJECT.md)** — vision, audience, principles, status, success criteria.
- **[Roadmap](../ROADMAP.md)** — the tactical upgrade path, by horizon.
- **[Changelog](../CHANGELOG.md)** — release history (SemVer).

### For families
- **[Wiki & FAQ](WIKI.md)** — every feature explained, glossary, parent FAQ.
- **[Curriculum Map](CURRICULUM.md)** — *auto-generated* scope & sequence with Common Core alignment.
- **[Privacy](PRIVACY.md)** — what we collect (nothing leaves the device) — COPPA-friendly.

### For builders
- **[CLAUDE.md](../CLAUDE.md)** — build rules, invariants, file map, how to extend.
- **[Architecture](ARCHITECTURE.md)** — system design, data flow, the teaching engine, state model.
- **[Content Schema](CONTENT_SCHEMA.md)** — the locked data contract for all curriculum content.
- **[Contributing](../CONTRIBUTING.md)** — step-by-step recipes (add a skill, problem type, badge…).
- **[Testing](TESTING.md)** — the test suite and how to run it.

### Research (why it's built this way)
- **[Pedagogy](research/pedagogy.md)** — how to teach grades 3–6 math; common misconceptions.
- **[Engagement](research/engagement.md)** — reward design & UX for ages 7–11.
- **[Landscape](research/landscape.md)** — competitive analysis + the "what makes it legit" bar.
- **[Grade 4 Standards](research/grade4-standards.md)** · **[Grade 2](research/grade2-standards.md)** ·
  **[Grade 7](research/grade7-standards.md)** — national/CCSS maps by grade.
- **[Tutor Design](research/tutor-design.md)** — how to build an effective tutor (ITS) offline.
- **[Learning Science](research/learning-science.md)** — how kids learn best, made implementable.
- **[Efficacy Measurement](research/efficacy-measurement.md)** — showing learning gains offline.
- **[Mini-games](research/minigames.md)** — skill-building math games (not busywork).
- **[Accessibility & COPPA](research/accessibility-compliance.md)** — WCAG 2.2 AA + privacy compliance.
- **[Companion Design](research/companion-design.md)** — ethical pet-bonding (no dark patterns).

---

## 🗂️ Repository layout

```
mathquest/
├── index.html · manifest.json · service-worker.js   # PWA entry (must stay at root)
├── vercel.json · .nojekyll · .gitignore             # deploy config
├── README · CLAUDE · CONTRIBUTING · CHANGELOG · ROADMAP · LICENSE
├── assets/        icon.svg
├── css/           styles.css                        # full design system + themes
├── js/
│   ├── app.js · state.js · storage.js · gamification.js · version.js
│   ├── engine/        rng · problemTypes · index    # the teaching brain
│   ├── curriculum/    grade3–6 · wordbank · rewards-data · standards · index
│   ├── ui/            dom · shell · sound · mascot · manipulatives · celebrations · whatsnew
│   └── views/         home · lesson · practice · rewards · dashboard · onboard · curriculum
├── docs/          this index + all markdown (+ research/)
├── tests/         smoke · smoke-v2 · mastery (jsdom)
└── tools/         engine-check · gen-curriculum-doc
```

---

## ⚡ Quick commands

```bash
npm start                 # run locally at :8000
npm test                  # full UI test suite (jsdom)
npm run engine:check      # verify every generated problem against its solver
npm run docs:curriculum   # regenerate the curriculum map from live data
```
