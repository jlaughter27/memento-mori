# MathQuest — Master Development Plan

The operating plan for taking MathQuest from "good" to "genuinely great," derived from
`docs/AUDIT_AND_ROADMAP.md`. This is the **living source of truth** for sequencing and
status. Claude acts as **master orchestrator**: it decomposes each milestone, delegates to
specialist subagents, integrates, verifies adversarially, and ships — one tested release per
milestone.

---

## 1. The orchestration model

For **every** milestone, the orchestrator runs the same loop:

1. **Scope** — write the milestone's objective + **acceptance test** *first* (test-first), and
   the exact files/data it will touch.
2. **Decompose & delegate** — spawn specialist subagents, in parallel where independent:
   - **Builder(s)** — implement a slice (e.g., one cluster of problem types).
   - **Test author** — encode the acceptance criteria as a new `tests/*.mjs` suite.
   - **Adversarial reviewer** — try to break the change (edge cases, a11y, invariant breaks)
     *before* it ships.
3. **Integrate** — orchestrator assembles slices, wires routes/state/SW, resolves seams.
4. **Verify (hard gate)** — the full CI gate must be green locally:
   `npm test` (12+ jsdom suites incl. `a11y` + `precache`) **and** `npm run engine:check`
   **and** `npm run fuzz`. Plus a focused review pass.
5. **Ship** — bump `APP_VERSION` + SW `CACHE` together, add `CHANGELOG.md` + "What's New",
   commit, open PR, watch CI, **merge on green** (per owner).
6. **Record** — tick the milestone here; proceed to the next.

### Non-negotiable quality gates (every milestone)
- **Invariants** (`CLAUDE.md`): offline · zero-dependency · no build · relative paths · content
  is data · deterministic self-verifying engine · release = bump two numbers together.
- **Accessibility**: `tests/a11y.mjs` stays green (every control has an accessible name; no
  positive tabindex); reduced-motion safe; color-blind-safe states.
- **Self-verification**: new engine behavior is proven by `engine:check`/`fuzz`, not asserted.
- **Offline integrity**: `tests/precache.mjs` stays green (every JS/CSS file precached).

### When to escalate to a formal multi-agent workflow
Default execution is inline subagents via the Agent tool. For a milestone that fans out wide
and benefits from deterministic orchestration (e.g., M1 below — author + adversarially verify
misconceptions across 25 types in parallel), the orchestrator may run a **Workflow** (pipeline:
author → verify-on-own-sample → integrate) on the owner's go-ahead.

---

## 2. Milestones (ordered, each = one PR/release)

Effort: **S** ≈ one focused session · **M** ≈ a meaty release · **L** ≈ multi-part.
Status: ☐ todo · ◐ in progress · ☑ shipped.

### Phase B — Tutor depth (do first: "teaching well" is the rarest, highest-value gap)

| # | Milestone | Effort | Acceptance test | Depends on |
|---|---|---|---|---|
| **M1** | **Misconception feedback on all 25+ problem types** — each type maps classic wrong answers to a specific, warm explanation. | M | `engine:check` proves *every* type fires ≥1 misconception on its own wrong-sample, and the sample is genuinely wrong. | — |
| **M2** | **Tiered hints + bottom-out** — hints laddered nudge→strategy→near-solution; full worked solution last & separate; a "bottom-out" hint that never auto-fills and flags Fix-It. | M | New test: hint reveal order + the 4th-hint gate; a11y green. | — |
| **M3** | **Concrete→Pictorial→Abstract lessons** — restructure the lesson view to walk manipulative → labeled diagram → equation, then a low-stakes "you try". | M | Lesson test: the three stages render + the try-it accepts a correct answer. | M1 (feedback reuse) |
| **M4** | **Probabilistic mastery + Challenge Zone** — per-skill p(known) (BKT/SmartScore: weights difficulty, recency, consistency, can go *down*); above ~90% a Challenge Zone gates 100. | M | Mastery test: a struggling run does not master; meter rises/falls; Challenge Zone gate. | — |
| **M5** | **Just-in-time Boost + struggle detection** — a prereq map; on repeated miss, drop to the prerequisite sub-skill, give 1–2 supports, return; distinguish productive vs unproductive struggle. | L | Boost test: induced repeated miss → prereq detour → return. | M4 (signal) |

### Phase C — Refinement (foundation that makes everything feel better)

| # | Milestone | Effort | Acceptance test | Depends on |
|---|---|---|---|---|
| **M6** | **CSS consolidation** — collapse the 3 duplicate reduced-motion guards into one; finish adopting design tokens (token-ify hardcoded colors); one animation/timing system. | M | Visual smoke + a11y green; a token-lint check (no stray hex in components) added. | — |
| **M7** | **Unified rewards + streak-freeze + variable celebrations** — one currency visibly advancing daily-goal + streak + season + badges; an earned **streak freeze**; celebration intensity varies by achievement. | M | Rewards test: streak-freeze saves a missed day; reward fan-out asserted. | — |
| **M8** | **First-run onboarding + warm empty states** — home/practice/collection/pet get friendly first-time UI and non-empty empty states. | S | Flows test: empty states render with guidance + a CTA. | M6 |

### Phase A — World depth (build on the new Quest system)

| # | Milestone | Effort | Acceptance test | Depends on |
|---|---|---|---|---|
| **M9** | **Boss-gates unlock access** — beating a zone keeper unlocks a *new area/ability*, not just a trophy (Pokémon model). | M | World test: a gate is closed pre-boss, open post-boss. | quests (shipped) |
| **M10** | **"Help the character" quests** — NPC-framed word problems over the existing word-problem builder. | S | Encounter test: an NPC task renders a themed word problem that checks. | — |
| **M11** | **Math-as-fuel encounter loop** — answering charges a pet ability/meter that drives an in-world action (Prodigy model). | M | World test: solving fills the charge; spending it triggers the action. | M9 |
| **M12** | **Seasonal event packs** — date-gated content modules unlocked by local date (no server). | S | Test with an injected date → event content unlocks. | — |

---

## 3. Recommended sequence & rationale

```
M1 → M2        teach well first (owner ask #2; biggest category differentiator)
   → M6        refinement foundation (low risk, makes all later UI look better)
   → M9 → M10  world depth on the shipped Quest system (owner ask #1)
   → M4 → M7   mastery truth + reward cohesion reinforce each other
   → M3 → M5   deeper pedagogy (lessons, Boost)
   → M11 → M8 → M12   delight, polish, freshness
```

Each arrow is an independently shippable release. The orchestrator re-evaluates priority after
every merge (new data, owner feedback, or a discovered issue can re-order what's next).

## 4. Definition of done (per milestone)
- Feature complete behind the acceptance test; full gate green; a11y + precache + invariants held.
- `APP_VERSION` ⇄ SW `CACHE` bumped together; `CHANGELOG.md` + "What's New" entry added.
- PR opened, CI green, merged; this file's status column updated.

## 5. Success metrics (how we know it's working)
- **Pedagogy**: % of problem types with verified misconception feedback (target 100%); mastery
  reflects true knowledge (probabilistic, can fall).
- **Engagement loop**: every correct answer visibly advances ≥3 systems (goal/streak/quest/badge).
- **Refinement**: zero duplicate CSS guards; design tokens adopted; a11y always green.
- **Trust/quality**: CI green on every release; invariants never broken.

---

## 6. Status log (append per milestone)
- _(plan created — awaiting go on M1)_
