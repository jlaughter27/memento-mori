# MathQuest Roadmap

The upgrade path, grouped by horizon. MathQuest is an **offline, single-device,
zero-backend PWA**, so each item is scoped to what's achievable without servers or accounts
(unless explicitly marked). Shipping a release = bump `APP_VERSION` in `js/version.js` and the
`CACHE` name in `service-worker.js`; installed devices self-update.

## ✅ Shipped (v2.0 · v2.1)
- Common Core standards on every lesson · placement quiz · spaced review
- Self-updating PWA + "What's New" · adaptive difficulty · daily goals
- New manipulatives (percent / ratio / volume / data) · full accessibility pass
- **Pet Home** (happiness meter, feed/play/pat, treat shop)
- **Pet Quest** — 3-chapter story adventure (4th-grade focus) with a teach-first **tutor mode**
  (concept → worked example → self-explanation → guided try)

## 🔜 Next (v2.2 — deepen the tutor & the quest)
Grounded in `docs/research/tutor-design.md` and `docs/research/learning-science.md`:
- **Worked-example fading** — full example → partial fill-in → hint-available → independent,
  gated on 3 consecutive first-try-correct (the #1 cognitive-load lever).
- **Step-level error feedback** — misconception-specific messages per (skill, step, error).
- **BKT-style mastery** + a "bottom-out" 4th hint (with a read-speed delay) that never auto-fills.
- **Mixed/interleaved review sessions**; per-skill **Challenge tier**; **printable worksheets**.
- **More quest chapters** + grade 3/5/6 quest lines; **pet rooms & decor** to buy with coins.

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
