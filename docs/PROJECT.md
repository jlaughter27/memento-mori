# MathQuest — Project Charter

## Vision
Give any child a patient, encouraging, genuinely effective math tutor that works
**anywhere, offline, for free, forever** — no accounts, no ads, no data leaving the device.
Built first for one homeschooler; designed to help any kid in grades 3–6.

## Who it's for
- **Primary:** a curious 8-year-old (grade 3), growing into grades 4–6.
- **Secondary:** the parent/homeschool guide who wants real, standards-aligned progress.

## Principles
1. **Teach, don't quiz.** Every problem can be explained step-by-step; help is always one tap away.
2. **Concrete before abstract.** Visual models (CRA) for every major concept.
3. **Growth mindset only.** Mistakes are normal and useful. No "wrong!", no ability praise.
4. **Motivate without bribing.** Rewards support learning; they never become the point.
5. **Private by design.** Everything stays on the device. Nothing to sign up for.
6. **Accessible to every kid.** Keyboard, screen reader, dyslexia font, calm mode, read-aloud.
7. **Boringly reliable.** Deterministic engine, no backend, self-verifying, self-updating.

## Status — v2.0 ("The Legit Update")
**Shipped and tested.** Live as an installable PWA.

| Metric | Value |
|---|---|
| Lessons (skills) | **60** across grades 3–6 |
| Problem types (engine) | **25** — each with generation, full worked solution, hints |
| Common Core standards covered | **45** distinct codes |
| Word problems | **75** themed templates |
| Manipulatives | number lines, base-ten, arrays, fraction bars/circles, groups, area, clocks, percent bars, ratio tapes, 3-D volume, dot plots |
| Badges / shop items / pets | **36 / 38 / 11** |
| Tests | engine self-check (1,000+ problems) + 3 jsdom UI suites |
| Dependencies (runtime) | **0** |

### What's built
Lessons → guided practice (hints + "show me how") → mastery → spaced review. Adaptive
difficulty, daily goals, streaks, badges, shop, pets, a friendly mascot, sound, confetti.
Common Core tags on every lesson + a printable curriculum map. Placement quiz. Parent
dashboard. Self-updating PWA with a "What's New" sheet. Full accessibility pass.

## Non-goals (for now)
- No online accounts, cloud sync, multiplayer, or leaderboards (privacy + simplicity).
- No required AI/LLM at runtime — the deterministic engine is the always-on default.
  (An *optional*, parent-gated AI chat layer is a future exploration; see the roadmap.)
- Not a school SIS/LMS; it's a learner-and-parent tool.

## Success criteria
- A child can learn a new skill **without an adult sitting beside them** and rarely gets stuck.
- A parent can see, at a glance, **what was learned and which standard it maps to.**
- The app **never breaks**: works offline, updates itself, and every answer key is correct.

## The bigger picture
The codebase is intentionally small, dependency-free, and well-documented so it can be
understood, trusted, audited, and extended for years — by a person or by an AI agent.
See [ROADMAP](../ROADMAP.md) for where it goes next.
