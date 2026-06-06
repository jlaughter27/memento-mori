# Math Mini-Game Design: Research & Implementation Guide
## Ages 7–11 — Building Durable Skill, Not Busywork

> **Purpose:** Evidence-based design principles for math mini-games that genuinely build mathematical competence in the 7–11 age band, plus three concrete offline-buildable game specs for this app.
> **Audience:** Product designers and developers building new play modes on top of the existing problem engine.

---

## Part 1: What Makes a Math Game Build Skill vs. Produce Busywork

### The Central Distinction

A Stanford research team found that most digital math games — even well-regarded ones — focus on getting the right answer rather than on the process for getting there. Prodigy Math, for example, is broadly engaging (the RPG wrapper sustains motivation in children who "hate math"), but its core loop is answer-verification: the game presents a fact problem, the child types an answer, and the narrative consequence rewards correctness. The math is effectively a keycard to unlock the story. This is not necessarily harmful, but it does not build flexible number sense, multiple-strategy thinking, or transferable reasoning. It is practice, not instruction.

The contrast class is games like DragonBox Algebra, which uses **concreteness fading** — a three-stage pedagogy where a concept is introduced through manipulable concrete objects (no symbols), then the objects are gradually replaced by abstract notation, and finally the child works entirely in standard mathematical form. The child finishes 200 levels having solved linear equations without ever being "taught" algebra. The learning is embedded in the structure of the game itself, not bolted on as a gate.

The research-backed markers that distinguish skill-building games from busywork:

| Skill-Building | Busywork / Luck |
|---|---|
| Problem design forces strategy selection | One-size answer entry works for all problems |
| Errors trigger targeted feedback tied to the specific misconception | All errors produce the same "wrong, try again" response |
| Difficulty adapts to the individual's demonstrated skill | Difficulty is preset or purely random |
| The child is required to discriminate between problem types (interleaving) | The child can detect the pattern and repeat one move |
| Progress is measured in accuracy AND latency trajectory (growing automaticity) | Progress is measured in score or items completed |
| Concrete representations fade toward abstract as fluency grows | One representation throughout, or no representation |

---

## Part 2: Fact-Fluency Games — Speed Without the Anxiety Tax

### The Research on Timed Practice

Math fact fluency is defined as the ability to recall basic arithmetic facts accurately, efficiently, and flexibly — and there is strong evidence that automaticity (sub-second retrieval) frees working memory for higher-order problems. The developmental trajectory is: counting strategies → derived-fact strategies → direct retrieval. Games that appropriately accelerate this progression produce genuine cognitive benefit.

The anxiety risk is real but often overstated. Jo Boaler's work at Stanford documented that time pressure and evaluation stress block working memory — roughly a third of students experience significant anxiety during timed tests, with the effect especially pronounced in higher-achieving students and girls. However, a critical distinction separates two things that often get conflated: *timed tests as performance events* and *timed practice as training*. Racing against a personal best is categorically different from racing against a class average under teacher observation. Games can harness the motivational benefits of speed without triggering the anxiety pathways that come from social comparison and high-stakes evaluation.

The key design rule: **track personal response-time improvement, never display comparisons to other children or to a fixed "passing" threshold mid-game.** After a completed session, a child can see that their average response time dropped from 4.2 seconds to 3.1 seconds — that is a growth signal, not a judgment signal.

Additionally, research on automaticity benchmarks suggests that 16–20 problems per minute is slow enough for children to count on fingers, which means a child can "pass" a time trial without ever consolidating retrieval. Games should aim for sub-2-second response windows per problem to confirm genuine automaticity, but introduce this target gradually and only after foundational accuracy is established.

### How Effective Fluency Games Are Structured

The best-documented fluency programs (Rocket Math, Math Fact Lab, ASCD's 60+ Games framework) share these structural features:

**Narrow bands of facts per session.** Children practice one "family" of facts at a time (e.g., the sevens multiplication table), not all facts simultaneously. This prevents the problem of shallow exposure to everything and deep fluency with nothing. Within a family, facts are introduced in order of difficulty: ties first (7×7), then easy pairs (7×1, 7×2), then the hard facts (7×6, 7×8).

**Beat-your-own-time format.** Present a fixed set of problems (10–15 items) and let the child beat their previous time on the same set. This is self-competition, not peer competition. The mechanism is motivating (there is a concrete target) while removing social anxiety.

**Immediate, non-punitive error correction.** When the child answers incorrectly, the correct answer should appear immediately and the problem should recycle into the queue within the same short session. Research on children's emotional responses to feedback shows that corrective feedback reduces enjoyment only when it is negative in tone; showing the right answer neutrally or with a brief explanation maintains positive affect.

**Interleaving once accuracy is established.** Blocked practice — all 7s facts, then all 8s facts — feels easy in the moment but produces poor retention. After a child reaches accuracy on a family, review should interleave that family with previously learned families. Research by Rohrer and colleagues found that interleaved practice doubled retention scores compared to blocked practice on tests given one day later.

**Spaced review.** The learning-science.md document in this repo already specifies the spaced-repetition schedule (1 → 2 → 4 → 8 days). Fluency games should feed facts back into the review queue using the same scheduler, not treat completed "levels" as permanently mastered.

---

## Part 3: Number-Sense Games — Building the Mental Number Line

### What Number Sense Actually Is

Number sense is not the same as fact knowledge. It is the internalized understanding that numbers represent quantities on a continuous mental scale, that they can be decomposed and recomposed flexibly, and that their magnitude can be estimated intuitively. A child who can compute 36 + 47 but does not realize the answer "should be around 80" lacks number sense even if they have fact fluency.

The foundational research here is Robert Siegler's work on the **linear number line** (multiple studies, Carnegie Mellon, 2008–2014). In a series of landmark experiments, low-income preschoolers played a simple board game in which numbered squares ran from 1 to 10 in a straight line (not a circle). After four 15-minute sessions, these children showed significant improvements not only on number line estimation but on counting, numeral identification, and numerical magnitude comparison — and the gains persisted nine weeks later. The critical variable was the linearity of the spatial layout: playing the same game with color-coded squares instead of numbered ones produced no improvement. The numbered line trains the mental number line directly.

**Subitizing** — instantly recognizing quantity without counting — underlies early number sense and is distinct from both counting and recall. Children can subitize up to about 4–5 items. Games that display dot arrays, dice faces, or ten-frame configurations and ask for instant quantity recognition build subitizing skill, which then supports decomposition thinking ("I see 3 and 2, so that's 5").

**Number composition and decomposition** (number bonds) were popularized by Singapore Math and are increasingly standard in American curricula. The core insight is that understanding 7 as 3+4, 5+2, 6+1, etc. simultaneously is categorically different from knowing 3+4=7 as an isolated fact. Research on children's arithmetic strategies shows that those who use decomposition strategies — breaking one addend to make a friendly number — are both more accurate and faster than those who count up from one operand. Decomposition thinking is number sense in action.

### DragonBox Numbers: A Design Reference

DragonBox Numbers teaches quantity composition through a fully visual, pre-symbolic interface. Children see "Nooms" (numbered creatures) that can be physically dragged and combined or split. A Noom-7 can be broken into a Noom-3 and a Noom-4; two Nooms can be dragged together to show addition as combination. No equations appear. The child builds number relationships through manipulation, and the game's level structure gradually introduces constraints that require specific decompositions. This is concreteness fading implemented as play: the concrete manipulation builds schemas that later attach naturally to symbolic notation.

The key takeaway for game design: the interface itself should embody the mathematical structure. If the game is about decomposition, the visual should show the part-whole relationship, not an equation about it.

---

## Part 4: Matching, Sorting, and Build Games — Relational Thinking

### Why Sorting Builds Deeper Skill Than Answer-Entry

Sorting and categorization tasks require children to activate and apply a mathematical criterion to a set of items — which is a higher-order operation than producing a single answer to a single question. When a child sorts 12 numbers by whether they are multiples of 3, they are evaluating each number against a rule repeatedly, noticing patterns, and correcting their own errors through the sorting mechanism itself. The feedback is embedded in whether the sort "works out" rather than in an external "correct/incorrect" message.

University of Michigan research on cognitive development found that categorization is deeply linked to nearly all aspects of cognition including memory, attention, and reasoning. Cognitive flexibility — the ability to re-sort the same set by a different rule — predicts both math and reading performance in children. A simple extension of any sorting game is the "resort" mechanic: after sorting by one rule, sort the same items by a different rule. This requires the child to suppress the previous categorization and apply new criteria — a direct exercise of cognitive flexibility.

**Number Munchers** (MECC, 1986) is the canonical arcade-style implementation of this principle. The 5×6 grid populates with numbers matching or not matching a stated criterion (multiples of 4, prime numbers, numbers between 20 and 30). The child navigates the grid eating correct numbers while avoiding Troggles. The game's genius is that it makes the discrimination task — is this number a valid target? — the central moment of play, rather than calculation. Children develop fluency with number properties (divisibility, primeness, inequality ranges) through rapid repeated classification rather than worksheet-style evaluation.

### Flow State and Difficulty Ramping

Csikszentmihalyi's flow research identifies the challenge-skill balance as the central mechanism of intrinsic motivation. Games that are too easy produce boredom; games that are too hard produce anxiety. The "flow channel" is the zone where challenge slightly exceeds current skill — enough to require effort but not enough to cause helplessness.

For children ages 7–11, two design implications follow:

**Ramp density, not rule complexity.** A multiple-identification game should start with a low density of valid targets on a smaller grid, giving the child plenty of time per decision. As skill grows, increase the density of valid and invalid targets, add distractors that are one-off near-misses (multiples of 4 mixed with multiples of 2), and optionally reduce response windows. Do not introduce conceptually harder rules until the current rule is fluent — rule complexity and time pressure should not increase simultaneously.

**Use personal-best mechanics for pacing.** Rather than fixed difficulty thresholds, let the child's own previous session become the target. If they correctly classified 8/10 last time in 45 seconds, the next session aims for 9/10 or 40 seconds. This is exactly the mechanic that sustains engagement without inducing failure-state anxiety.

---

## Part 5: Accessibility and Anxiety Considerations

### Designing for the Full Range

Neurodivergent children — those with ADHD, dyslexia, dyscalculia, or anxiety — are disproportionately represented among children who struggle with math, and game design that works for them tends to work better for everyone.

**Mandatory timers are the single greatest accessibility barrier.** A child with processing differences may take 4–6 seconds to answer a problem they understand completely; a timed game that penalizes this produces frustration without any information about mathematical understanding. The solution is not to remove time-based mechanics entirely but to make them opt-in or to have timers measure improvement against personal history rather than against a fixed clock.

**Leaderboards harm the children who need encouragement most.** Research on leaderboard motivation finds that children on teams that are not winning well are *less* motivated by leaderboards — the opposite of the intended effect. Personal progress dashboards ("you were 22% faster this week than last week") produce motivation that does not depend on outperforming others.

**Visual clutter increases cognitive load and reduces accuracy for children with ADHD.** Interface design should have a clear visual hierarchy: the central problem stimulus should have the highest salience, secondary elements (score, progress) should be visually quieter, and decorative animation should be suppressible. Research on adaptive games for children with specific learning difficulties found that simplified UI design and reduced animation load significantly improved task completion and self-reported confidence.

**Audio support and dyslexia-friendly text.** All problem prompts should be available as audio (text-to-speech or recorded voice). Number labels in sorting games should use clear, high-contrast fonts with sufficient spacing to prevent numeral confusion (6 vs. 9, 1 vs. 7).

**"The Number Race"** (open-source adaptive game for dyscalculia remediation, Butterworth & Laurillard, 2006) is the most research-grounded example of accessible number-sense game design. Its core mechanic is numerical comparison — which of two quantities is larger — presented with both symbolic and non-symbolic (dot array) representations simultaneously. This dual-coding approach supports children whose symbolic processing is weak while building the mental number line that underlies all arithmetic.

---

## Part 6: The Three Principles That Matter Most

Drawing across all the research above, three principles dominate:

**1. The game must require the target skill to win — not just reward it.**
If a child can advance by any strategy (guessing, skipping, grinding easy problems), the game is not exercising the target skill. The math should be the engine of play, not the toll booth to a separate game.

**2. Difficulty must adapt to the individual in real time.**
Fixed difficulty levels produce two failure modes: boredom for children above the level, helplessness for children below it. Adaptive difficulty based on response accuracy and latency keeps each child in the flow channel. The existing practice engine in this app already implements consecutive-correct / consecutive-wrong adaptive difficulty (−2 to +2 scale); mini-games should hook into the same or a parallel signal.

**3. Feedback must be immediate, specific, and non-punishing.**
The research literature is consistent that corrective feedback must arrive within 1–2 seconds of the response, must address the specific error (not just "wrong"), and must maintain positive or neutral affect. The pet/mascot feedback system already in this app is well-positioned to deliver this — a short verbal remark from the fox that names what went wrong ("The 6 is a multiple of 3, not the 7 — want to see why?") is more effective than a red X.

---

## Part 7: Game Specifications for This App

These three games are designed to be built on top of the existing `problemTypes.js` engine, `rng.js` utilities, and `manipulatives.js` SVG renderer. None requires external assets, network access, or a third-party library.

---

### Game 1: Sprint — Fact-Fluency (Beat Your Best)

**Skill it builds:** Arithmetic fact automaticity (addition, subtraction, multiplication, or division for any fact family). Specifically targets the transition from derived-fact strategies to direct retrieval.

**Core loop:**
The screen shows one problem at a time, displayed large and centrally. A personal-best timer appears in a corner as a soft visual indicator — never as a countdown threatening failure, but as a "ghost time" the child is chasing. The child types an answer (or selects from 3–4 choices on early levels). On correct answer: the problem dissolves with a brief sparkle, the next appears immediately. On incorrect answer: the correct answer flashes for 1.5 seconds, the problem recycles into the queue within the same session (no score deduction, no negative sound effect). A session is 15 problems from a single fact family. After completing the session, the child sees their total session time and a comparison to their own previous best on that same family — shown as a simple bar ("Today: 38 seconds / Your best: 41 seconds — new record!").

**Difficulty progression:**
- Level 1 (Tier A facts): Products/sums with both operands ≤ 5. Choice-input (4 options). No ghost timer shown.
- Level 2 (Tier B facts): One operand 6–9. Number-entry input. Ghost timer appears.
- Level 3 (Tier C facts): Full table of a chosen number. Interleaved with one previously mastered table. Ghost timer, problem-recycling on error.
- Level 4 (Mixed tables): Two randomly selected tables from mastered ones, interleaved. Session length increases to 20 problems.

Progression gate: a child advances a tier within a family when they complete a session with 90%+ first-try accuracy. No time-based gate for tier advancement — time is a motivation signal, not a qualification test.

**Implementation notes:** Use `nextProblem(skill, diff)` to pull arithmetic facts from the existing curriculum engine. The Sprint mode can request a fixed skill ID (e.g., `g4-multiply-7`) and a difficulty offset of 0. Store personal-best time in localStorage keyed by `sprint:{skillId}:{tier}`. Render the ghost timer as a thin horizontal progress bar that depletes over the personal-best time — it turns green if the child is ahead, amber if they are behind, but makes no sound and applies no penalty when it empties.

**Accessibility:** Ghost timer can be hidden via a toggle in settings. All problems available via text-to-speech on tap. Choice-input mode always available regardless of tier (child self-selects input mode). Error recycling ensures every fact is resolved correctly within the session, so no child ends with unresolved wrong answers.

---

### Game 2: Magnitude Match — Number Sense (Place a Number)

**Skill it builds:** Numerical magnitude estimation and the linear mental number line. Directly targets the cognitive structure Siegler's board-game research improved: the ability to judge where a number lives relative to others on a scale.

**Core loop:**
A horizontal number line is rendered via the existing `numberLine` SVG manipulative, with labeled endpoints (e.g., 0 and 100). A single target number appears above it ("Where does 37 go?"). The child drags a pin along the line and releases it; the pin "snaps" to their chosen location. After a short pause (no immediate verdict), the correct position is revealed as a second colored pin, and the distance between the child's placement and the correct position animates as a small gap. A score is awarded on a curve: 0-distance earns 3 stars, under 5% error earns 2 stars, under 10% earns 1 star, anything wider earns a gentle mascot comment and a retry with the correct position still visible (scaffolded retry, not a fresh problem).

The key design choice: **no "wrong" state exists** — only distances. This reframes the task as estimation quality rather than correctness, which is both mathematically accurate (estimation genuinely is a range task) and anxiety-reducing.

**Difficulty progression:**
- Stage 1: 0–10 number line, whole numbers only, labeled at every 1 (a ruler). Target numbers avoid endpoints.
- Stage 2: 0–20 line, labeled at 0, 10, 20. Target numbers include teens.
- Stage 3: 0–100 line, labeled at 0, 50, 100. Target numbers span the full range. The child must estimate without intermediate labels.
- Stage 4: 0–1000 line, labeled at 0, 500, 1000. A second task variant: two numbers are shown ("Which is closer to 500 — 340 or 600?") requiring comparative magnitude judgment.
- Stage 5: Fraction / decimal number lines (0 to 1, labeled at 0, 0.5, 1). Target: place 0.3, 0.75, 3/8.

A session is 8 placements. Stars accumulate across sessions and unlock cosmetic decoration for the pet — no skill gating on star count.

**Implementation notes:** The `numberLine` renderer in `manipulatives.js` already renders static number lines. The mini-game needs to extend it with a draggable pin (SVG `<circle>` with `pointermove`/`pointerup` handlers) and an animated "reveal" pin. The target number for each stage is generated by `randInt(rng, lo, hi)` from the existing RNG. Stage parameters (lo, hi, step, labelInterval) are stored as a small config object in the game's own module; no changes to the curriculum data are needed. Star history is stored in localStorage keyed `magnitudeMatch:{stage}`.

**Accessibility:** The drag-and-release interaction has a tap-to-position fallback (tap anywhere on the line to set the pin). Labels are rendered in high-contrast text. The mascot comments on the error distance in positive framing ("You were only 4 away — really close!") regardless of star count. No session time limit.

---

### Game 3: Sort & Storm — Build/Sort (Classify by Property)

**Skill it builds:** Number property recognition (multiples, factors, odd/even, rounding, place-value category, fraction comparison). Targets the discrimination skill — evaluating whether a number satisfies a criterion — that underlies Number Munchers, and the cognitive flexibility that develops when the same number set is re-sorted by a different rule.

**Core loop:**
A 3×4 grid of number tiles appears on screen. A banner at the top states the current rule ("Multiples of 4"). The child taps tiles to "tag" them as matching the rule; tagged tiles get a color highlight. When the child taps "Submit" (or all tiles are tagged), the game reveals correctness: correctly tagged tiles flash green, missed tiles flash amber, incorrectly tagged tiles flash red and briefly show why ("12 ÷ 4 = 3, so yes — a multiple!" / "10 ÷ 4 = 2 remainder 2, so no"). After this review phase, a second round appears: the same 12 tiles but a new rule ("Now find the even numbers"). The child must re-evaluate each tile under the new rule. This second-sort mechanic is the cognitive-flexibility exercise.

A session is 3 rule pairs (6 sorts total). Score is tiles correct per sort, displayed as a per-session accuracy percentage. No timer on the classification itself. An optional "time-challenge" mode activates a gentle sand-timer visual for children who want the added challenge — it never penalizes, but the mascot says "ooh, that was quick!" if the child finishes before the sand runs out.

**Difficulty progression:**
- Level 1: 3×3 grid (9 tiles), rules: odd/even. Numbers 1–20.
- Level 2: 3×4 grid (12 tiles), rules: multiples of 2 and 5. Numbers 1–50.
- Level 3: 3×4 grid, rules: multiples of any single digit 2–9. Numbers 1–100. Near-miss distractors included (e.g., 14 in a "multiples of 7" sort, alongside 42, 49).
- Level 4: 3×4 grid, rules: factors of a given number, then prime / not prime. Numbers chosen to include edge cases (1, 2, primes, composites).
- Level 5: 3×4 grid, rules: rounding to the nearest 10 — "rounds to 40" — then "rounds to 50." Numbers in the 35–54 range, requiring the child to hold the rounding rule while re-sorting.
- Level 6 (fraction/decimal sort): tiles show fractions and decimals. Rules: "greater than 1/2" then "less than 1." Visual fraction bar appears on tap as a scaffold.

Rule pairs within a session are chosen from the same conceptual domain (both multiplication-based, or both place-value-based) so that the re-sort builds on the same number knowledge rather than requiring a total context switch.

**Implementation notes:** Tile values are generated by `randInt(rng, ...)` and seeded by session date (reproducible within a day, different the next day). The rule-checking functions (`isMultiple`, `isFactor`, `isPrime`, `roundsTo`, `comparesFraction`) are all derivable from helpers already in `problemTypes.js` (`gcd`, digit-place logic, etc.). Tile rendering uses standard `div` elements with CSS transition for the color-flash feedback — no SVG needed. The fraction scaffold on Level 6 reuses the `fractionBar` renderer from `manipulatives.js`. Session state (current level, score history) is stored in localStorage keyed `sortStorm:{level}`. The mascot delivers rule-specific explanations for incorrect tiles, using the same misconception-feedback pattern already in `practice.js`.

---

## Summary

The three games form a pedagogically complete mini-game suite:

- **Sprint** addresses automaticity — making retrieval fast and effortless through self-competition and interleaved spaced recall.
- **Magnitude Match** addresses number sense — building the internalized mental number line through estimation and magnitude judgment.
- **Sort & Storm** addresses relational thinking — developing number property fluency and cognitive flexibility through classification and re-sorting.

Together they cover the three failure modes most common at ages 7–11: weak fact retrieval (slows multi-step work), poor magnitude intuition (produces nonsensical answers that go unchallenged), and brittle rule knowledge (facts known in isolation but not applied flexibly). None of the three requires always-on internet, server calls, or new asset pipelines. All three are buildable within the existing JavaScript/SVG/CSS stack.

---

## Sources

- Siegler, R.S. & Ramani, G.B. (2008). Playing linear numerical board games promotes low-income children's numerical development. *Developmental Science*, 11(5), 655–661.
- Rohrer, D. & Taylor, K. (2007). The shuffling of mathematics problems improves learning. *Instructional Science*, 35, 481–498.
- Boaler, J. (2014). Speed and time pressure blocks working memory. *YouCubed, Stanford University.*
- Butterworth, B. & Laurillard, D. (2006). Principles underlying the design of The Number Race. *Behavioral and Brain Functions*, 2(1), 19. (PMC1550244)
- Csikszentmihalyi, M. (1990). *Flow: The Psychology of Optimal Experience.* Harper & Row.
- Chen, J. (2006). Flow in games. MFA thesis, University of Southern California.
- Laski, E.V. & Siegler, R.S. (2014). Learning from number board games: You learn what you encode. *Developmental Psychology*, 50(3), 853–864.
- ASCD (2019). *Math Fact Fluency: 60+ Games and Assessment Tools.* (ED592367)
- MathFactLab (2024). Math fact automaticity vs. math fact fluency. mathfactlab.com
- Frontiers in Education (2024). Game-based learning experiences in primary mathematics education. doi:10.3389/feduc.2024.1331312
- Third Space Learning (2023). Interleaving: What is it and how can it improve memory in maths. thirdspacelearning.com
- EdWeek (2023). What is math 'fact fluency' and how does it develop?
- Prodigy Education (2024). A better way for kids to master math facts.
- Springer / Digital Experiences in Mathematics Education (2026). A design-based approach to playful algebra learning with DragonBox Algebra. doi:10.1007/s40751-026-00195-2
