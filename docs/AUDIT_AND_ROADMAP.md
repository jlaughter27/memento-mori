# MathQuest — Audit & Roadmap (v3 "Refinement")

Synthesized from a competitive audit (Prodigy, DragonBox, Khan Academy Kids, Zearn, ST Math,
Beast Academy, IXL, SplashLearn, Duolingo, RPG quest design) and a deep internal code audit,
against the owner's three goals: **the world needs adventures & tasks**, **the tutor needs
deeper development**, **the whole app needs refinement**. Everything below respects the
invariants: offline · zero-dependency · no server · no build · accessible.

## Where we stand vs. best-in-class

| Dimension | Best-in-class does… | MathQuest today |
|---|---|---|
| **World / adventures** | Prodigy: math is the *fuel* for battles; Pokémon: bosses gate *access* (new areas/abilities); SplashLearn/Khan: "help the character" quests; collectibles walk the world | Zones, warps, bosses, single-counter per-zone "quests", review critters. **No multi-step chains, objectives, or narrative arcs.** |
| **Tutor / pedagogy** | Zearn: Concrete→Pictorial→Abstract every lesson, just-in-time "Boost" to prereqs, productive-struggle detection, misconception-targeted feedback; ST Math: feedback-as-simulation; Beast: tiered hints separate from answers | Teach-first tutor + hints + steps exist, but **misconception feedback covers ~2 of 25 types**, fading is shallow, mastery is streak-based, no prereq "drop-down". |
| **Polish / rewards** | Duolingo: one currency feeds streak+goal+season+badges, streak-freeze, daily→monthly quests, variable rewards; IXL: SmartScore (0–100, goes down, "Challenge Zone") | Missions (new), badges, coins, XP — but **systems don't reinforce each other**, mastery is a flat %, accreted CSS (3 duplicate reduced-motion guards, half-adopted tokens). |

## The plan — three tracks, shipped incrementally

### Track A — World Quests & Adventures  *(building now)*
A real quest system layered on the world. **Data-driven multi-step quest chains** with
objectives, narrative beats, progress tracking, step-by-step rewards, and a **Quest Log**.
- **A1 (this release):** Quest data model + engine + Quest Log UI. Quests chain objectives
  over events we already emit — *solve N*, *master N*, *beat a boss*, *explore a new zone* —
  each step with narrative + reward; a completion chest. Home + world entry points.
- **A2:** Boss-gates that unlock *access* (a new zone/ability), not just a trophy (Pokémon).
- **A3:** "Help the character" framing over the word-problem builder (SplashLearn/Khan).
- **A4:** Math-as-fuel encounter loop — answering charges a pet ability (Prodigy).
- **A5:** Date-gated seasonal event packs (no server; unlock by local date).

### Track B — Tutor depth
- **B1:** Misconception-specific feedback across **all 25+ problem types** (today ~2). Highest
  pedagogical ROI; pure functions in `problemTypes.js`.
- **B2:** Concrete→Pictorial→Abstract lesson restructure using the existing SVG manipulatives.
- **B3:** Just-in-time **Boost** — on repeated miss, drop to the prerequisite sub-skill, give
  1–2 supporting problems, return to grade level (needs a prereq map).
- **B4:** Productive-vs-unproductive struggle detection → trigger Boost / gentler mode.
- **B5:** Probabilistic mastery (BKT-style / IXL SmartScore: weights difficulty + recency +
  consistency, can go down, "Challenge Zone" above ~90).
- **B6:** Tiered hints (nudge → strategy → near-solution), full solution last & separate.

### Track C — Refinement
- **C1:** Consolidate the 3 duplicate reduced-motion guards; finish adopting the design tokens
  (token-ify hardcoded colors); one animation/timing system.
- **C2:** First-run onboarding + warm empty states (home, practice, collection, pet).
- **C3:** Unify rewards: one currency visibly advancing daily goal + streak + season + badges
  (Duolingo); **streak-freeze** safety net; variable/escalating celebration intensity.
- **C4:** Rewards that benefit the *world/pet*, not just the player (Khan Kids).

## Recommended sequence
1. **A1 Quest system** (this release) — turns the world into real adventures (owner ask #1).
2. **B1 misconceptions + B6 tiered hints** — closes the biggest *teaching* gap (ask #2).
3. **C1 + C3** — make the loop cohere and feel refined (ask #3).
4. A2–A5, B2–B5, C2/C4 thereafter.

_Full competitive sources and file:line findings are in the session audit; this doc is the
living plan._
