# 🗺️ MathQuest — Master Research & Development Map

> The single source of truth for **where we're going and how we get there.**
> Read it top-to-bottom: first the **outcome** we're shooting for (vivid + concrete), then a
> **work-backward** decomposition from that outcome to the systems and tasks that build it,
> then the **sequenced plan** with milestones, gates, research, risks, and the very next steps.
>
> Companion docs: [PROJECT charter](PROJECT.md) · [ARCHITECTURE](ARCHITECTURE.md) ·
> [ROADMAP (tactical)](../ROADMAP.md) · research in [`docs/research/`](research/).
>
> **Status today: v2.7** — 89 skills (grades 2–7, 68 standards), a self-verifying teaching engine,
> a teach-first tutor with fading, spaced review + mastery decay + a mistakes loop, a pet you
> care for and grow, a 3-chapter quest + three mini-games, a parent efficacy report, and a full
> WCAG 2.2 AA pass. Offline, zero-dependency, self-updating, fully tested (5 suites + engine check).

---

## Part I — THE OUTCOME (our North Star)

### 0. One sentence
**A child opens MathQuest and, for 20 joyful minutes a day, a patient genius tutor and a beloved
pet teach them to *understand* math — and they leave a little more capable, and wanting to come
back tomorrow.**

Not "a kid can answer questions." A kid **learns**, **remembers**, and **loves it** — and a
parent can *see* it working.

### 1. A day in the life (when it's "done")

> *Maya (9) taps the fox icon. Her pet otter, Pebbles, is waddling in its home — the happiness
> heart is a little low. She feeds it a treat (she earned coins yesterday), pats it, and Pebbles
> does a happy flip. A gentle banner: "Pebbles wants to check 3 things you learned" — a 90-second
> warm-up of spaced review. She nails 2, slips on 1; the tutor quietly re-queues it.*
>
> *Then: today's chapter of Pet Quest. Pebbles reaches a rope bridge in the Sparkle Caves —
> "3 carts, each with 24 gems." Maya hasn't seen 2-digit × 1-digit lately, so the tutor steps in:
> the fox shows the area model, narrates the partial products, then fades — "you try the tens
> part." Maya does. "Now the whole thing." She gets it. The fox asks her to **explain to Pebbles
> why** breaking 24 into 20 + 4 works; she says it out loud, taps "I explained it." The bridge
> lights up, Pebbles scampers across, +12 coins, +1 treat, the story advances.*
>
> *Total time: 18 minutes. She got a soft "great stopping point" nudge. She mastered one skill,
> reviewed three, and unlocked a new pet hat. That evening her dad opens the Grown-ups Corner:
> "This week Maya practiced 4 days, mastered Multi-digit Multiplication (4.NBT.B.5), and is 78%
> through Grade 4. Suggested next: Division with Remainders." He prints the week's worksheet.*

When the experience above is **true for any kid in grades 2–7, every day, reliably, beautifully**
— we're done.

### 2. What "incredibly detailed and polished" means (the quality bar)

The final product is **world-class on every one of these axes** — not just one:

| Axis | The bar (10/10) |
|---|---|
| **Pedagogy** | Teaches *understanding* (concrete→representational→abstract), not tricks. Worked examples that fade. Misconception-aware. Self-explanation. |
| **Tutor intelligence** | Feels like a 1:1 tutor: knows what you know, scaffolds exactly enough, fades support, re-teaches on the right error, never lets you flounder or get bored. |
| **Content depth** | Grades 2–7 fully covered & standards-aligned; **grade 4 is the gold-standard reference depth**. Every skill has rich lessons, infinite correct problems, visuals, and word problems. |
| **Memory** | Mastery that *sticks*: spaced + interleaved review, mastery decay, a "mistakes" loop. Placement that lands kids in the right spot. |
| **World & story** | A living world with multiple quest lines per grade, exploration, mini-games, and narrative that makes math the hero's obstacle. |
| **Companion** | A pet you genuinely bond with: care, happiness, a home you decorate, growth/evolution, reactions that create real *relatedness*. |
| **Motivation** | Rewards that *support* learning and never replace it (no loot boxes, no guilt, process-praise everywhere). |
| **Accessibility** | WCAG 2.2 AA: keyboard/switch, screen reader, dyslexia, color-blind, reduced-motion, read-aloud — verified, with a published statement. |
| **Trust** | Private by design (COPPA-friendly), a real privacy + accessibility statement, standards transparency, parent reports — credible to a teacher. |
| **Craft** | Visual design, motion, sound, and copy that feel lovingly made; instant load; buttery on a cheap tablet. |
| **Reliability** | Offline-first, self-updating, multi-child profiles, never loses progress, every answer key correct. |
| **Reach** | Installable anywhere, works on a $80 tablet offline, localizable, and discoverable (a real landing page + a third-party review). |

### 3. Definition of Done (the "final product" gate)
The product ships as **v3.0 "The Complete Tutor"** when:
- ✅ Grades **2–7** are covered and standards-tagged; grade 4 hits the **18-skill gold-standard** depth.
- ✅ The **intelligent tutor** (fading + step-level feedback + mastery tracing) runs across all skills.
- ✅ **Spaced + interleaved review** and a **mistakes loop** are the backbone of retention.
- ✅ A **living world**: ≥1 multi-chapter quest per grade band + a decoratable **pet home** + pet growth.
- ✅ **Parent efficacy reports** + worksheet generator + privacy/accessibility statements published.
- ✅ **WCAG 2.2 AA** verified; performance budget met on low-end devices.
- ✅ **Multi-profile** (siblings) on one device — *shipped v2.22*; nothing ever lost; self-update flawless.
- ✅ A **landing page** and submission to a third-party reviewer (e.g., Common Sense) prepared.
- ✅ Every gate in [Part IV](#part-iv--the-quality-bar) is green.

### 4. Non-goals (what we deliberately won't do)
- No mandatory accounts, servers, ads, tracking, or pay-to-win. (An *optional*, parent-gated cloud
  sync or AI-chat layer may be explored — never required, never the default.)
- Not a school SIS/LMS. Not a social network. Not a test-prep cram tool.

---

## Part II — WORKING BACKWARD (outcome → capabilities → systems → tasks)

We decompose the North Star into **10 pillars**. For each: the end-state, the capabilities it
needs, and the concrete systems/tasks — with an honest **current score** (0–10) so the gap is visible.

### The method (illustrated on the Tutor pillar)
```
OUTCOME:  "feels like a patient 1:1 tutor"
  └─ CAPABILITY: knows what the child knows        → mastery model per skill (BKT-ish)
  └─ CAPABILITY: scaffolds exactly enough          → worked-example fading ladder
  └─ CAPABILITY: re-teaches on the RIGHT mistake    → step-level, misconception-keyed feedback
  └─ CAPABILITY: makes thinking visible             → self-explanation prompts + process praise
       └─ SYSTEM: tutor session state machine (concept→example→fade→independent→check)
            └─ TASK: add 4th "bottom-out" hint w/ read-delay; per-(skill,step,error) messages;
                     mastery streak counter; fade gates on 3× first-try-correct; re-queue assisted items
```
Every pillar below is decomposed the same way.

### The 10 pillars — scorecard & gaps

| # | Pillar | Now | Target | The gap (what's missing for 10/10) |
|---|---|----|----|---|
| 1 | **Curriculum & Standards** | **9** | 10 | ✅ grades 2–7 (91 skills, 75 standards), grade-4 deepened (19 skills). Left: sub-standard tags; full K–8 reach |
| 2 | **Teaching Engine** | **9.5** | 10 | ✅ hardened + **fuzzed across 30k problems**; **3 interactive manipulatives** (tap-to-shade fraction bar & circle, base-ten number builder). Left: more interactive types (array builder, number-line plot); drag interactions |
| 3 | **The Tutor** | **9** | 10 | ✅ teach-first "Learn with Foxy" (worked example → self-explanation → **fading** scaffolds → independent) + misconception feedback. Left: step-level model-tracing; bottom-out hint |
| 4 | **Mastery & Memory** | **9** | 10 | ✅ Mistakes Notebook/Fix-It, warm-up, spaced review, **mastery decay** (rusty skills). Left: branching placement v2 |
| 5 | **World & Story** | **9** | 10 | ✅ three mini-games (Sprint, Number Line, Sort & Storm) + 3-chapter quest. Left: per-grade quest lines; an explorable overworld map |
| 6 | **Companion & Care** | **9** | 10 | ✅ decoratable home + **pet growth/evolution** + bonding moments. Left: more reaction variety; per-pet animations |
| 7 | **Motivation & Economy** | **9** | 10 | ✅ collection summary + **parent weekly goal**; story/pet are the core loop; process-praise only. Left: collection *sets* with bonuses |
| 8 | **Accessibility & Inclusion** | **9.5** | 10 | ✅ WCAG 2.2 AA pass + **automated a11y CI gate** (every control named, all routes) + forced-colors mode + in-app statement published. Left: switch-device & real-AT testing |
| 9 | **Trust & Credibility** | **9** | 10 | ✅ parent **efficacy report** + in-app privacy & accessibility statements + standards transparency. Left: worksheet export, Common Sense submission packet |
| 10 | **Craft, Platform & Reliability** | **9** | 10 | ✅ design tokens + motion system + nav/IA overhaul; **8 green CI suites + engine + fuzz gates**. Left: perf budget on real devices; i18n; landing page |

> **Overall ≈ 9.2/10** — updated at **v2.21** (was 9.0 at v2.7). Shipped v2.8 → v2.21 since:
> text-fit + long-prompt handling; WCAG contrast fixes + per-theme shadows + dark-bg legibility +
> forced-colors; a motion-token system + view transitions; a navigation/IA overhaul (consistent
> back bar, 4-hub kid nav, grown-ups behind a gear); **three interactive manipulatives** (the
> start of hands-on CRA); two bug-hunt passes (broken lesson fraction visuals, stacked-modal
> focus trap, TTS-on-navigate, escaping — all fixed + regression-locked); and a much deeper
> safety net (8 UI suites incl. a11y + precache gates, plus 30k-problem fuzz + visual checks).
>
> **⚠️ The #1 gap is not a feature: `main` is at v2.4 — v2.5→v2.21 live on the working branch
> and must be merged + deployed (GitHub Pages) before any of this reaches a child.**
>
> **Path to 10 (in order):** ① merge → `main` → enable Pages → verify live PWA install/update;
> ② DoD features: ✅ worksheet generator (v2.23); bottom-out hint + step-level
> tracing, per-grade quest lines + overworld, landing page + Common Sense packet; ③ real-device
> verification (visual QA, low-end perf, switch/AT testing) — needs a real browser, not the CI
> sandbox; ④ i18n. The 10th point is earned, not coded: a child using it joyfully every day.
>
> **Research bank is now complete for the next phases** — all forward-agenda topics (Part V) have
> docs in `docs/research/`: efficacy measurement, grades 2 & 7 standards, mini-games, accessibility
> & COPPA, and companion design. Building can proceed straight from spec.

### Per-pillar capability decomposition (condensed)

**1 · Curriculum & Standards** → *Every concept a kid 2–7 needs, in the right order, transparently
aligned.*
Capabilities: complete scope&sequence per grade · sub-standard tagging · prerequisite graph ·
per-skill misconception bank · printable curriculum map (✅).
Build: grade2.js, grade7.js; expand grade4 to 18 skills; `misconceptions.js`; prereq-graph view.

**2 · Teaching Engine** → *Infinite, correct, beautifully-explained problems with the right picture.*
Capabilities: generate · solve step-by-step · hint ladder · render manipulative · check any-form answer
(all ✅) + new types + interactive concrete manipulatives.
Build: new `make*` types (multiplicative comparison, angles, line plots, symmetry, mixed-number ops);
animated/draggable manipulatives; engine-check stays green.

**3 · The Tutor** → *A 1:1 tutor that adapts to the individual mind.*
Capabilities: knowledge model · scaffolding that fades · misconception-keyed feedback · metacognition.
Build: `tutor.js` session state machine; fade ladder (full→fill-in→hint→independent); mastery streak
+ re-teach trigger; per-(skill,step,error) messages; bottom-out hint w/ delay; self-explanation library.

**4 · Mastery & Memory** → *What's learned, stays learned; kids start in the right place.*
Capabilities: mastery decay · spaced scheduler (✅ Leitner-lite) · interleaving · error review · diagnostic.
Build: mixed-review session; decay on `reviewAt`; **Mistakes Notebook** (capture misses → targeted re-try);
placement v2 (branching, ~15 items); "warm-up on open."

**5 · World & Story** → *A world worth exploring, where math is the adventure.*
Capabilities: quest engine (✅) · multiple quest lines · world map · mini-games · narrative variety.
Build: quest lines per grade; overworld map UI; 2–3 math mini-games (timed facts, matching, build-it);
chapter content via the content-agent pipeline; light branching/choices.

**6 · Companion & Care** → *A pet you truly bond with.*
Capabilities: care loop (✅) · home you decorate · growth/evolution · expressive reactions.
Build: pet **rooms** + buyable decor (coins) · pet growth stages tied to learning milestones ·
more pets & animations · "your pet learned with you" moments.

**7 · Motivation & Economy** → *Motivation that protects the love of learning.*
Capabilities: balanced economy (✅) · collections · parent goals · process-praise (✅).
Build: collection sets/album; parent-set weekly goal; overjustification audit of all reward copy;
make pet-happiness/story the primary loop, coins the secondary.

**8 · Accessibility** → *Every child can use it.*
Build: WCAG 2.2 AA audit (axe/Lighthouse) + fixes; SVG `role/aria-label`; screen-reader script per view;
switch/keyboard pass; read-aloud the full problem + choices; published **accessibility statement**.

**9 · Trust & Credibility** → *A parent/teacher trusts it on sight.*
Build: `PRIVACY` (✅) + accessibility statements as in-app pages; **parent efficacy report** (mastery by
domain, time, accuracy, trend) + weekly summary card; **worksheet generator** (print problems + key);
Common Sense Education submission packet.

**10 · Craft, Platform & Reliability** → *Lovingly made, rock-solid, fast everywhere.*
Build: **multi-child profiles**; performance budget (TTI < 2s on low-end, asset audit); motion/sound/copy
polish pass; design-token refresh; i18n scaffolding (string table; Spanish first); **landing page**.

---

## Part III — THE PLAN (sequenced path to v3.0)

Phases are ordered by **dependency + leverage**: deepen the *teaching* first (tutor, memory),
then the *world* that carries it, then *trust/scale/polish*. Each phase is a shippable release
(self-updates to installed devices) with its own tests and a "done when" gate.

```
 v2.1 ─►  v2.2 ─►  v2.3 ─►  v2.4 ─►  v2.5 ─►  v2.6 ─►  v2.7 ─►  v3.0
 (now)   Tutor    Memory   World    Trust    Scale   Polish   Complete
         brain    +Mistakes +Pet    +Parent  2–7     +Perf    Tutor
                            home     reports  grades  +i18n
```

### Phase v2.2 — "The Tutor Brain" *(biggest learning lever; grade 4 as gold standard)*
- **Deliver:** worked-example **fading** ladder; **step-level**, misconception-keyed feedback;
  **mastery tracing** (first-try streaks, re-teach trigger); **bottom-out hint** (read-delay, no
  auto-fill); self-explanation prompts in regular practice too; a dedicated **Tutor session** flow.
- **Research feeding it:** `tutor-design.md`, `learning-science.md`, `grade4-standards.md` (misconceptions).
- **Done when:** a grade-4 skill can be learned cold by a struggling child without an adult; the
  tutor demonstrably reduces hints needed over a session; `npm test` + new tutor tests green.

### Phase v2.3 — "Make It Stick" *(memory & assessment)*
- **Deliver:** **mixed/interleaved review** sessions; **mastery decay**; **Mistakes Notebook**
  (auto-captures misses → targeted re-try later); **warm-up on open**; **placement v2** (branching).
- **Research:** `learning-science.md` (spacing/interleaving), `tutor-design.md` (re-queue).
- **Done when:** every session opens with a smart warm-up; missed problems reliably return; placement
  lands test kids within ±1 grade of truth.

### Phase v2.4 — "A World Worth Exploring" *(engagement & companion depth)*
- **Deliver:** an **overworld map**; **quest lines** for grades 3 & 5; **pet home decor** (buy rooms/items
  with coins) + **pet growth**; 2 **math mini-games**; more chapters via the content pipeline.
- **Research:** `engagement.md`, `learning-science.md` (relatedness/autonomy).
- **Done when:** there's a reason to come back that isn't coins; pet bonding is real; ≥2 quest lines exist.

### Phase v2.5 — "For the Grown-Ups" *(trust, reports, credibility)*
- **Deliver:** **parent efficacy report** + weekly summary card; **worksheet generator** (print);
  in-app **privacy + accessibility statements**; export/printable progress; Common Sense submission packet.
- **Research:** `landscape.md` (credibility bar), new: efficacy-measurement research (see agenda).
- **Done when:** a parent can answer "is it working?" in 10 seconds and print practice for offline.

### Phase v2.6 — "Grow the World" *(content scale to grades 2–7)*
- **Deliver:** **grade 2** and **grade 7** curricula + standards + quest content; **grade 4 deepened**
  to the 18-skill gold standard; new engine problem types/manipulatives to cover them.
- **Research:** new: grade-2 and grade-7 (pre-algebra) standards & progressions (agenda).
- **Done when:** 2–7 are standards-complete; engine-check green on all; curriculum map regenerates.

### Phase v2.7 — "Make It Shine" *(craft, performance, reach)*
- **Deliver:** **multi-child profiles**; **WCAG 2.2 AA** audit + fixes + statement; **performance budget**
  on low-end devices; motion/sound/visual polish pass; **i18n scaffolding** (Spanish first); **landing page**.
- **Done when:** siblings share a device; AA verified; loads fast on a cheap tablet; a real marketing page exists.

### Phase v3.0 — "The Complete Tutor" *(integration & launch)*
- **Deliver:** integrate everything; final polish + content QA sweep; submit for third-party review;
  ship the v3.0 release with a celebratory "What's New."
- **Done when:** the [Definition of Done](#3-definition-of-done-the-final-product-gate) is fully green.

### Milestone table

| Phase | Theme | Headline deliverables | Primary research | Gate |
|---|---|---|---|---|
| v2.2 | Tutor brain | Fading · step-feedback · mastery tracing | tutor-design, learning-science | Learn-cold test passes |
| v2.3 | Memory | Mixed review · decay · Mistakes Notebook · placement v2 | learning-science | Warm-up + re-queue work |
| v2.4 | World | Overworld · 2 quest lines · pet home/decor · mini-games | engagement | Comeback reason ≠ coins |
| v2.5 | Trust | Parent reports · worksheet gen · privacy/a11y pages | landscape, efficacy* | "Is it working?" in 10s |
| v2.6 | Scale | Grades 2 & 7 · grade-4 gold depth · new types | grade2/7 standards* | 2–7 standards-complete |
| v2.7 | Polish | Multi-profile · WCAG AA · perf · i18n · landing page | (audits) | AA verified, fast, sharable |
| v3.0 | Launch | Integrate · QA · third-party review | — | Definition of Done green |

\* = new research to commission (see Part V).

---

## Part IV — THE QUALITY BAR (Definition of Done per change)

Every feature, every phase, clears these before it ships:

**Engineering invariants (never broken)** — offline, zero runtime deps, no build, relative paths,
content-as-data per `CONTENT_SCHEMA.md`, engine self-verifying, version+SW-cache bumped together.

**Testing** — `npm run engine:check` green (answer-key correctness); `npm test` green (jsdom flows);
a new test added for any new flow; mastery/economy regression guards intact.

**Content QA** — arithmetic in every example verified; reading level ~2nd–4th grade; growth-mindset copy
(no "Wrong!"/"Easy!"/ability praise); standards tags present; curriculum doc regenerated.

**Accessibility** — visible focus; keyboard reachable; color paired with icon/text; ARIA on interactive
SVG; reduced-motion honored; read-aloud available.

**Polish** — tap targets ≥64px; animation purposeful + interruptible; loads instantly; no layout shift;
consistent with the design tokens.

**Docs** — CHANGELOG entry; ROADMAP/MASTER_PLAN updated; WIKI/ARCHITECTURE updated if behavior changed.

---

## Part V — THE RESEARCH AGENDA (what we still need to learn)

> ✅ **Update:** all six forward-agenda topics below have now been researched and written to
> `docs/research/` (efficacy-measurement, grade2-standards, grade7-standards, minigames,
> accessibility-compliance, companion-design) — joining the original six. Building can proceed
> straight from spec. The list remains here as a record of what each doc answers.

We've banked twelve research docs total. The forward-agenda questions (now answered):

1. **Efficacy measurement (offline):** how to *show* learning gains on-device — pre/post deltas,
   mastery curves, retention — without accounts. → informs Parent Reports (v2.5).
2. **Grade 2 & Grade 7 standards & progressions:** complete scope, prerequisites, misconceptions
   (grade 7 = pre-algebra: ratios/proportions, integers, expressions). → informs v2.6.
3. **Math mini-game design:** what fact-fluency/number-sense mini-games actually build skill (vs.
   busywork) for this age. → informs v2.4.
4. **Diagnostic/placement design:** lightweight branching assessment that's accurate and not anxiety-
   inducing for kids. → informs v2.3.
5. **WCAG 2.2 AA for kids' learning apps + COPPA 2025 specifics:** the concrete checklist + statements.
   → informs v2.5/v2.7.
6. **Pet-bonding & companion design:** how games build durable attachment (care, growth, reactions)
   *without* dark patterns. → informs v2.4/v2.6.

Each follows our pipeline: **research → lock a schema/spec → build → test → ship.**

---

## Part VI — HOW WE WORK (the operating model)

This project is built by a small, fast **research → spec → build → test → ship** loop, executed by
an **agent army** under strict contracts:

1. **Research agents** (parallel, web) produce a `docs/research/*.md` and a crisp recommendation list.
2. **Lock a schema/spec** (e.g., `CONTENT_SCHEMA.md`) so parallel builders can't collide.
3. **Content agents** (parallel) generate data to the schema; **build agents** + the lead implement
   systems against locked interfaces.
4. **Test gates**: `engine:check` (1,000+ problems) + jsdom UI suites; nothing merges red.
5. **Ship**: bump `APP_VERSION` + SW cache, add a `RELEASES` note + CHANGELOG, push → installed
   apps self-update with a "What's New."
6. **Document as we go**: this map, the ARCHITECTURE, the WIKI, and the auto-generated curriculum doc
   stay current.

This is *why* we can move fast without breaking trust: locked contracts + a self-verifying engine +
real UI tests + doc-driven development.

---

## Part VII — RISKS & MITIGATIONS

| Risk | Mitigation |
|---|---|
| **Scope creep** dilutes quality | Phase gates + Definition of Done; ship small, ship often; this map is the guardrail |
| **Engagement overshadows learning** (overjustification) | Make pet/story the core loop; audit reward copy; coins secondary; process-praise only |
| **Content errors** (wrong answer keys) | Deterministic, self-verifying engine; `engine:check` on every change; content QA checklist |
| **Tutor feels robotic** without an LLM | Rich rule-based fading + misconception messages + self-explanation; warmth via mascot/pet |
| **Accessibility regressions** | A11y in the Definition of Done; periodic axe/Lighthouse audits; tests assert focus/ARIA |
| **Performance on cheap tablets** | Zero deps/no build already; perf budget in v2.7; asset audit; lazy-load heavy content |
| **Losing progress** | localStorage hydrate-merge; multi-profile with care; (optional) export/import in v2.5 |
| **Burnout of the "one curious kid"** | Variety (world, pets, mini-games), grace-day streaks, no guilt, healthy session caps |

---

## Part VIII — THE NEXT THREE SPRINTS (do this now)

Concrete, ordered, buildable immediately — this is the start of **v2.2 (The Tutor Brain)**:

**Sprint 1 — Tutor core (grade 4 first)**
- [ ] `js/engine/tutor.js`: a tutor session state machine (concept → worked example → **fade** steps →
      independent → check), reusable by Practice and Pet Quest.
- [ ] Worked-example **fading ladder**: full example → "you do the last step" → "you do the last two" →
      independent. Advance a fade level on each first-try-correct; drop a level on a miss.
- [ ] Add a **4th "bottom-out" hint** to the ladder (reveals the move + the *why*; gated by a read delay;
      never auto-fills the answer).

**Sprint 2 — Knowing the learner**
- [ ] `misconceptions.js` for the grade-4 skills (from `grade4-standards.md`): per-skill common error →
      targeted message; wire **error-specific feedback** into the tutor/practice check path.
- [ ] **Mastery tracing**: per-skill first-try streak; advance at 3; trigger **re-teach** after repeated
      bottom-outs; mark assisted items and **re-queue** them (no mastery credit).

**Sprint 3 — Prove it + wire it everywhere**
- [ ] Add **self-explanation** prompts to regular Practice (not just Quest).
- [ ] New `tests/tutor.mjs`: a struggling-learner sim that should converge (fewer hints over time) and a
      mastery-tracing assertion. Keep the full suite + `engine:check` green.
- [ ] Ship **v2.2**: version bump, CHANGELOG, "What's New," update this map's scorecard (Tutor 5 → 8+).

---

*This map is a living document. Update the scorecard and phase status as we ship. The goal is not a
feature list — it's the day-in-the-life in Part I, made real for every kid.*
