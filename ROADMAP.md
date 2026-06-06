# MathQuest Roadmap

The upgrade path, grouped by horizon. MathQuest is an **offline, single-device,
zero-backend PWA**, so each item is scoped to what's achievable without servers or accounts
(unless explicitly marked). Shipping a release = bump `APP_VERSION` in `js/version.js` and the
`CACHE` name in `service-worker.js`; installed devices self-update.

## ✅ Shipped (v2.0)
- Common Core standards on every lesson · placement quiz · spaced review
- Self-updating PWA + "What's New" · adaptive difficulty · daily goals
- New manipulatives (percent / ratio / volume / data) · full accessibility pass

## 🔜 Next (v2.1 — content & mastery depth)
- **Mixed review sessions** that interleave several mastered skills (proven retention win).
- **Mastery decay + smarter spaced-repetition scheduler** (Leitner-style boxes per skill).
- **"Challenge" tier** per skill (harder params, multi-step) for 3-star+ learners.
- **Printable worksheets** (generate a PDF/print sheet of problems + answer key from any skill).
- Per-skill **error-pattern hints** (detect the classic misconception and address it directly).

## 🌱 Later (v2.2+ — reach & trust)
- **Diagnostic report** for parents (strengths/gaps by domain) + weekly email-style summary card.
- **Multiple learner profiles** on one device (siblings).
- **More grades** (K–2 readiness; pre-algebra for grade 7).
- **Localization** (Spanish first) and a **dyslexia/▶ read-aloud** polish pass.
- **Privacy page** stating no data leaves the device (COPPA-friendly positioning).

## 🧪 Exploratory (needs a backend — opt-in only)
- Optional cloud sync / cross-device progress.
- Optional **AI tutor chat** layer (LLM) for free-form "explain this differently" help,
  gated behind a parent toggle + key, with the deterministic engine as the always-on default.

## How to cut a release
1. Implement + `npm test` (engine self-check + jsdom UI/mastery tests must pass).
2. Add a `RELEASES` entry in `js/version.js`, bump `APP_VERSION`.
3. Bump `CACHE` in `service-worker.js` to match.
4. Add a `CHANGELOG.md` section. Commit, push, deploy.
