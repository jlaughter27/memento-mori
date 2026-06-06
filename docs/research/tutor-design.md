# Tutor Mode Design Research
## Evidence-Based Specification for an Offline, Rule-Based Math Tutor

**Audience:** Children ages 7–11 (primary target: 8-year-old, Grade 3, homeschool)  
**Constraint:** Deterministic, rule-based engine — no LLM, no network dependency  
**Sources:** Bloom (1984), VanLehn (2011), Corbett & Anderson (1994), Sweller cognitive load theory, Rosenshine principles, Carnegie Learning Cognitive Tutor research, ASSISTments platform studies

---

## Part 1: Why Tutoring Works — The 2-Sigma Problem and Mastery Learning

### Bloom's Original Finding

In 1984, Benjamin Bloom published "The 2 Sigma Problem" in *Educational Researcher*, reporting a striking result from University of Chicago dissertation studies by Anania and Burke. Students tutored one-on-one using mastery learning principles outperformed conventional classroom students by approximately two standard deviations — meaning the average tutored student scored above 98% of classroom students. The effect was labeled a "problem" because individual tutoring at scale is economically impossible, and Bloom challenged researchers to find group methods that approached it.

Bloom attributed the advantage primarily to two mechanisms: (1) **constant corrective feedback** — the tutor catches each misunderstanding before it compounds, and (2) **pacing by mastery** — the student does not advance until prerequisite concepts are genuinely secure.

### How Robust Is the 2-Sigma Claim?

Bloom's 2.0 figure has not replicated cleanly. Critics note a methodological asymmetry: the mastery threshold in the tutored condition was set at 90% correct while the classroom condition required only 80%, making the comparison somewhat unfair. John Hattie's 2009 meta-meta-analysis of over 800 studies placed human tutoring at d = 0.79. A 1982 meta-analysis by Cohen, Kulik, and Kulik found an average tutoring effect of d = 0.33 across a broader range of studies. The honest summary: one-on-one tutoring reliably produces large effects in the d = 0.4–0.8 range — far exceeding most classroom interventions — but the 2-sigma headline is inflated by methodological choices.

Critically for our purposes: VanLehn's 2011 meta-analysis of 28 evaluation studies confirmed that **step-based ITS (d = 0.76) nearly matches human tutoring (d = 0.79)**, while answer-only tutoring systems achieve only d = 0.31. This single finding is the design mandate: feedback must operate at the level of each solution step, not just the final answer.

### What Tutors Do That Classrooms Cannot

The core advantages of one-on-one tutoring, distilled from Bloom and subsequent research:

1. **Adaptive pacing.** The tutor presents the next problem only when the current concept is mastered, not when the clock says to move on.
2. **Immediate corrective feedback.** Errors are caught before they are rehearsed. Practicing errors is worse than not practicing at all (Rosenshine's corollary: "immediate correction stops errors from becoming habits").
3. **Private low-stakes errors.** No social risk of being wrong in front of peers. Children try more freely.
4. **Diagnostic questioning.** The tutor asks follow-up questions to distinguish a calculation slip from a conceptual misunderstanding before choosing a response.
5. **Calibrated challenge.** Problems stay in the zone of proximal development — hard enough to require thinking, achievable enough to avoid frustration.
6. **Mastery gating.** Advancement requires demonstrated competence, not just time-on-task.

Bloom's mastery learning components, as operationalized by Carroll and later Bloom himself:
- Instruction broken into small, well-defined units
- Clear mastery criteria per unit (typically 80–90% accuracy)
- Formative checkpoints at the end of each unit
- Corrective instruction for students who do not meet criteria
- Enrichment for students who do

---

## Part 2: Proven Tutoring Moves

### The Worked-Example Effect

Sweller's cognitive load theory explains why novices learn better from worked examples than from independent problem-solving. A worked example offloads the search for solution steps onto the example itself, freeing working memory to build schema. The worked-example effect is one of the most replicated findings in educational psychology. Its key practical implications:

- **For true novices**, present worked examples before asking them to solve problems. Asking novices to solve cold wastes cognitive capacity on search strategies they do not yet possess.
- **The expertise reversal effect**: as the learner gains competence, fully worked examples become redundant and even harmful (they add cognitive load without adding information). This demands fading.

### Faded Worked Examples

Faded worked examples gradually shift labor from the example to the learner. The standard sequence:

1. **Fully worked example** — all steps shown, annotated
2. **Completion problem** — final step(s) left blank ("what comes next?")
3. **Partial-completion problem** — multiple steps omitted
4. **Independent problem** — full solution required

Research by Renkl, Atkinson, and colleagues demonstrates that backward fading (removing steps from the end of the solution first, then earlier steps) is more effective than other fading orders because it preserves the goal structure that novices need to reason about. Combined with self-explanation prompts (see below), faded examples produce effect sizes of d = 0.5–0.7 on immediate tests compared to unguided practice.

The transition from worked examples to independent practice maps directly onto the "gradual release of responsibility" model.

### Gradual Release of Responsibility ("I Do / We Do / You Do")

The gradual release model, grounded in Vygotsky's zone of proximal development and codified by Pearson and Gallagher (1983), structures the transfer of cognitive responsibility from teacher to learner in three phases:

| Phase | What Happens | Cognitive Load on Student |
|-------|-------------|--------------------------|
| **I Do** — Modeling | Tutor narrates solving a complete example, making thinking explicit | Observation only |
| **We Do** — Guided Practice | Tutor and student work together; tutor prompts, student acts | Shared |
| **You Do** — Independent Practice | Student solves alone; tutor monitors and corrects | Full student ownership |

Each phase requires explicit checkpoints. Rosenshine's principles extend this framework: present new material in small steps, ask questions after each step, check all students understand before advancing, provide guided practice until the student achieves 80%+ accuracy, then allow independent practice.

The critical error is moving to "You Do" before the student is genuinely ready. Signs of readiness: student can execute the procedure unprompted, student can explain each step (not just perform it), and error rate on guided practice has dropped below 20%.

### Scaffolding and Fading

Scaffolding (Wood, Bruner, and Ross 1976) refers to temporary support structures that enable a learner to complete a task they could not complete independently. Crucially, scaffolds must be faded — removed as competence grows — or they create dependency.

Effective scaffolding in math tutoring includes:
- Breaking a multi-step problem into explicitly labeled sub-steps
- Providing a worked example of the same problem type just before the practice problem
- Offering a visual model (number line, area diagram) alongside the abstract notation
- Pre-filling one step of a solution and asking the student to continue

Fading is triggered by demonstrated performance, not by time. When a student answers three consecutive problems of a type correctly, reduce the scaffolding one level (e.g., remove the sub-step labels; hide the worked example by default but make it requestable).

### Self-Explanation Prompts

Self-explanation (Chi, Bassok, Lewis, Reimann, and Glaser 1989) is the act of generating an explanation for oneself about why a step in a worked example is correct. Students who self-explain spontaneously learn more than students who do not. When prompted to self-explain, learning improves with effect sizes in the d = 0.4–0.6 range on immediate tests (meta-analysis by Bisra et al., 2018).

Self-explanation works by:
1. Forcing the learner to notice gaps between what they understood and what the example shows
2. Integrating new information with prior knowledge
3. Identifying the principle being applied, not just the surface steps

Effective self-explanation prompts are specific and open-ended:
- "Why did we add the denominators together in this step?" (principle prompt)
- "What would happen if we skipped step 2?" (prediction prompt)
- "In your own words, what did we just do to get from line 2 to line 3?" (paraphrase prompt)
- "How is this problem similar to the one we did before?" (analogy prompt)

Self-explanation works best during initial learning of a concept, not after mastery. For a deterministic system, prompts can be tied to specific steps in the worked example that research identifies as common sticking points (e.g., the step where denominators are found for fraction addition).

### Socratic Questioning

Human tutors do not simply tell students the answer when they err. Bloom's analysis of expert tutors found they use a pattern of Socratic probing: asking questions that lead the student to discover the error themselves. This preserves agency and produces deeper encoding.

The Socratic sequence for a wrong answer:
1. **Reflection probe**: "Can you walk me through how you got that?" (makes the error visible to the student)
2. **Targeted question**: "What do we know about [the relevant concept]?" (activates relevant prior knowledge)
3. **Gap question**: "Does your answer match what we know?" (creates cognitive conflict)
4. **Leading question**: "What if we tried [partial hint]?" (guides without revealing)
5. **Direct correction** (last resort): "The answer here is X because..."

For a deterministic system, this sequence is approximated by the hint ladder (see Part 4).

### Immediate, Specific, Elaborated Feedback

The timing and content of feedback both matter. Research distinctions:

- **Immediate vs. delayed feedback**: For procedural skills (calculations), immediate feedback consistently outperforms delayed. The sooner an error is caught, the less it is rehearsed.
- **Simple verification vs. elaborated feedback**: Telling a child "wrong" produces less learning than telling them "wrong — you multiplied where you should have added." Elaborated feedback (correct answer + explanation of why) outperforms simple feedback, but only when the student has sufficient working memory capacity to process it.
- **Error-specific feedback**: The highest-value feedback names the specific misconception, not just the error. Example: "It looks like you added the top and bottom numbers — remember, denominators tell us the size of each piece and they don't change when we add fractions."

Vanderbilt research (2015) provides an important caveat: feedback only reliably helps children who have low prior knowledge of the topic. For children who have already been taught a concept, trial-and-error feedback during problem solving can actually lower performance compared to no feedback — because it interrupts their application of recently learned knowledge with disruptive verification signals. This implies: delay or reduce immediate feedback as the student demonstrates growing competence.

---

## Part 3: Intelligent Tutoring Systems Design

### The Cognitive Tutor / Carnegie Learning Architecture

Carnegie Learning's Cognitive Tutor, developed by John Anderson, Ken Koedinger, and colleagues at Carnegie Mellon University starting in the 1990s, is the most extensively studied ITS and the direct ancestor of modern step-based tutoring systems. Its core design:

**Model tracing**: The system maintains a cognitive model — a set of production rules representing correct and incorrect solution paths for each problem type. As a student works, each action is matched against the model. If the action matches a correct production rule, the step is accepted. If it matches a known incorrect rule (a "buggy rule" representing a common misconception), an error-specific message fires. If no rule matches, the system flags an error and invites the student to request a hint.

**Knowledge tracing (Bayesian Knowledge Tracing, BKT)**: Developed by Corbett and Anderson (1994), BKT models each knowledge component (KC) — a discrete skill such as "find a common denominator" or "multiply across a fraction" — as a hidden Markov process. Each KC has four parameters:
- **P(L₀)**: Prior probability the student has already mastered this KC
- **P(T)**: Probability of learning (transitioning from unmastered to mastered) after one practice opportunity
- **P(G)**: Probability of guessing correctly even when KC is unmastered
- **P(S)**: Probability of slipping (answering incorrectly even when KC is mastered)

After each student response, the system updates the estimated mastery probability P(Lₙ). When P(Lₙ) ≥ 0.95, the KC is declared mastered and the student stops receiving problems requiring that KC. The system then selects problems that target the next unmastered KC in the skill graph.

For a deterministic offline system without parameter fitting, BKT can be approximated with simpler rules (see Part 5 and the spec at the end of this document).

**Step-level feedback**: Crucially, the Cognitive Tutor provides feedback after each step of a multi-step problem, not just after the final answer. VanLehn's meta-analysis confirms this is the architectural feature most responsible for the ITS performance advantage.

### ASSISTments

ASSISTments, developed at Worcester Polytechnic Institute, combines assessment with tutoring assistance. Its notable contributions to ITS design:

- **Scaffolded hint sequences**: Each problem has an author-written hint ladder of 3–5 hints, ranging from orienting hints ("think about what operation is needed") to bottom-out hints ("the answer is 12 because 3 × 4 = 12").
- **Research platform**: ASSISTments has been used to run hundreds of randomized controlled experiments on hint design, feedback timing, and problem sequencing. Key finding: hint use is negatively correlated with learning outcomes when students request hints before genuinely attempting a problem — confirming the "gaming the system" problem.
- **Worked example toggle**: Recent ASSISTments features allow teachers to attach worked examples to problems, consistent with faded-example research.

### Model Tracing vs. Knowledge Tracing

These are complementary, not competing, components:

| Technique | What it tracks | Granularity | Purpose |
|-----------|---------------|-------------|---------|
| **Model tracing** | Student's current step | Within-problem | Real-time step feedback |
| **Knowledge tracing** | Student's KC mastery over time | Across problems | Mastery and sequencing |

A minimal deterministic implementation: model tracing is the step-by-step solution engine (which the app already has); knowledge tracing is the per-KC counter that drives mastery advancement.

---

## Part 4: Hint and Feedback Design

### The Four-Level Hint Ladder

The standard research-backed structure for hint sequences in ITS (Aleven, McLaren, Roll, Koedinger):

| Level | Name | What It Reveals | Example (fraction addition 1/3 + 1/4) |
|-------|------|----------------|----------------------------------------|
| 1 | **Orientation** | Reminds the student what the goal is; directs attention | "We need to add these two fractions. What do we need to find first?" |
| 2 | **Strategy** | Names the procedure or principle to apply | "To add fractions, we first need a common denominator — a number that both 3 and 4 divide into evenly." |
| 3 | **Step** | Describes the specific action for this step | "Find the least common multiple of 3 and 4. List the multiples: 3, 6, 9, 12... and 4, 8, 12... What's the smallest number in both lists?" |
| 4 | **Bottom-out** | Gives the complete answer for this step | "The least common denominator is 12. Now rewrite 1/3 as 4/12 and 1/4 as 3/12." |

The bottom-out hint is the last resort. It should reveal the answer AND briefly explain why, so even the student who needed it entirely learns something. It should NOT be delivered unless hints 1–3 have been presented.

### How Many Hints Per Step

Research consensus: 3–5 hints per step is optimal. Fewer than 3 collapses the gradient too quickly; more than 5 creates excessive text and invites skip-through behavior. The app's existing 3-step hint ladder maps exactly to levels 1–3 above; the bottom-out (level 4) should be added as a final fallback.

### Timing: Let Them Struggle First

The timing of hint availability matters as much as hint content:

- **Minimum attempt requirement**: Do not display even the first hint until the student has made at least one genuine attempt (submitted an answer). This prevents hint-seeking as a first strategy.
- **Hint delay**: After an incorrect answer, impose a brief delay (Carnegie Learning used 2 seconds) before the hint button becomes active. This small friction reduces thoughtless clicking.
- **Struggle budget**: Allow 2–3 wrong attempts before offering to show the first hint proactively ("Would you like a hint?"). Before that, the response to wrong answers is corrective feedback only, not a hint.

Research from the ASSISTments platform confirms: students who attempt before hinting learn significantly more than students who hint immediately, even when both groups eventually see the same hints.

### Anti-Gaming Design

Gaming the system is the behavior of rapidly clicking through hints to reach the bottom-out answer without engaging with the intermediate hints. Research by Baker, Corbett, and Koedinger identified it as common and harmful. Prevention strategies (all implementable without an LLM):

1. **Sequential lock**: Only show one hint level at a time. The student cannot skip to hint 3 without reading hints 1 and 2. (This is enforced by UI, not by the student.)
2. **Read-through delay**: After displaying hint text, the "Next Hint" button is inactive for a minimum of (word count ÷ 2) seconds — approximately reading-speed paced.
3. **Bottom-out accountability**: After a bottom-out hint is shown, the problem is not marked correct. The student must still enter the correct answer themselves, and that problem is flagged as "hinted to completion" — it does not count toward mastery advancement.
4. **Hinted-to-completion re-queue**: Problems where the student needed a bottom-out hint are added back to the practice queue and must be answered without hints on a later attempt to count toward mastery.

---

## Part 5: Mastery and Progression

### Mastery Criteria

The Cognitive Tutor uses a 0.95 BKT threshold — when the system estimates 95% probability of mastery, the KC is considered learned. For a simpler deterministic system, the research-equivalent criteria are:

**Advance rule**: A student advances past a knowledge component when they answer **3 consecutive problems correctly without using any hints**. This approximates the BKT 0.95 threshold and has been used in several simpler mastery-based systems. For more time-consuming multi-step problems, "2 consecutive correct without hints" is acceptable.

**Remediate rule**: If a student answers incorrectly **3 times on the same step** of a single problem (despite having seen hints), the system should:
1. Show a mini-review of the prerequisite concept (one worked example, narrated)
2. Provide a simpler "scaffold" version of the problem
3. Return to the original problem type after the scaffold is completed correctly once

**Stuck rule**: If a student reaches the bottom-out hint on **more than 50% of problems** in a session for a given KC, that KC is queued for a full re-teach in the next session rather than continued practice.

### When to Advance, When to Remediate

The decision tree:
- 3 consecutive correct, no hints → advance to the next KC or reduce scaffolding one level
- 2 correct then 1 wrong → continue, do not reset streak
- 2 consecutive incorrect → show orientation hint proactively on the next problem
- 3+ incorrect on same step → trigger mini-review of prerequisite
- Bottom-out hint used → problem marked as "assisted completion," does not count toward mastery streak; re-queue

### Spaced and Interleaved Review

Research consistently shows (Kang 2016, Rohrer et al.) that distributing practice over time vastly outperforms massed practice. For a children's math app:

- **Spaced review**: After a KC is mastered, it enters a review queue. Review problems for that KC reappear after approximately 1 day, then 3 days, then 1 week, then 2 weeks. If answered correctly at each review, the interval doubles. If answered incorrectly at review, the KC reverts to "needs practice."
- **Interleaved practice**: Once a student has mastered 3+ KCs in the same topic area, subsequent sessions should mix problem types rather than presenting all problems of the same type together. Interleaved practice produces worse performance during practice (the "interleaving difficulty") but significantly better retention on delayed tests (Rohrer and Taylor 2007).
- **Session structure recommendation**: Each new-learning session should contain roughly 60% new KC problems and 40% spaced review of previously mastered KCs.

---

## Part 6: Motivation Within Tutoring

### Zone of Proximal Difficulty

Vygotsky's Zone of Proximal Development (ZPD) describes the range of tasks a learner cannot yet do independently but can do with appropriate support. In tutoring, this translates to: problems should be challenging enough to require genuine effort, but achievable enough that effort eventually succeeds.

Csikszentmihalyi's "flow" concept operationalizes this: the flow state (maximum engagement) occurs when challenge and skill are in balance. Too easy → boredom. Too hard → anxiety. For a math tutoring app, this means:

- The error rate should sit between 20–40% on new material. If the child is getting everything right immediately, the problems are too easy. If the child is getting more than 60% wrong even after hints, the prerequisite knowledge is missing and the system should go back further.
- Track the **recent session error rate** as a difficulty signal. If below 20% for 5 consecutive problems, advance. If above 60% after hints for 3 consecutive problems, trigger a prerequisite review.

### Productive Struggle

Productive struggle is the cognitively effortful engagement with a problem that the student cannot yet solve — the condition that drives learning. It becomes unproductive when:
- The student has no relevant prior knowledge to apply (prerequisite gap)
- The student is genuinely confused about what is being asked (clarity failure)
- Frustration or anxiety has exceeded the student's regulation capacity

The tutor's role is to sustain productive struggle, not eliminate it. Strategies:
- **Do not hint before the student has attempted**: The first hint should only appear after at least one genuine attempt. Offering help before a student tries trains learned helplessness.
- **Affirm effort before correcting**: "You're really thinking carefully about this — let's look at one step." This is not empty praise; research on growth mindset (Dweck) confirms process praise ("you worked hard") outperforms outcome praise ("you're smart") for persistence after failure.
- **Re-frame errors positively**: "That's a really common mix-up — it means you're ready to learn the difference." This is a scripted, deterministic response that does not require LLM flexibility.
- **Avoid over-scaffolding**: Providing hints before the student needs them removes the struggle that drives learning. The optimal intervention point is just past the moment of genuine confusion but before frustration sets in.

### Encouragement Design

For a children's app, encouragement should be:
- **Specific**: "You got the common denominator right — that's the hardest part" outperforms "Great job!"
- **Process-focused**: Praise the strategy, not the child's identity ("You tried a different approach and it worked" vs. "You're so smart")
- **Honest**: Do not celebrate correct answers achieved via bottom-out hints. Reserve celebration for genuinely independent correct answers.
- **Calibrated**: After a long struggle that ends in a correct answer, more enthusiastic encouragement is warranted than after a routine quick correct.

---

## Part 7: Concrete "Tutor Mode" Specification

This section translates all of the above research into a step-by-step, buildable interaction design for a single tutored problem session. It assumes the app already has: (1) a problem engine that generates problems by knowledge component, (2) step-by-step solutions, and (3) a 3-step hint ladder per step. It requires adding: a 4th bottom-out hint level, a mastery counter per KC, a re-queue mechanism, and specific feedback message templates.

---

### Tutor Mode: Full Session Flow

A Tutor Mode session for a single knowledge component follows five phases in sequence.

---

#### Phase 0: Concept Introduction (30–60 seconds)

**Trigger**: Student enters a KC for the first time (P(mastered) = 0 or session counter = 0).

**Flow**:
1. Display a brief concept card (2–4 sentences, plain language, one visual). Example for "finding common denominators": "When we add fractions, the bottom numbers (denominators) need to match. Think of them as telling us the size of each piece — you can't add thirds and quarters until they're the same size. We call the matching number the **common denominator**."
2. Display one **fully worked example** with narration labels on each step. Each label explains *why* the step is done, not just *what* it is. Example label on step 2: "We need both fractions to show twelfths, so we multiply top and bottom of 1/3 by 4."
3. After the worked example is displayed, show a **self-explanation prompt** about the most critical step: "Before we practice, look at Step 2. Why did we multiply 1/3 by 4/4 — why 4/4 and not just 4?"
4. The student types or selects an answer. This is not graded. Accept any non-empty response. Display a brief confirming elaboration: "Exactly right — we multiply by 4/4 because 4/4 = 1, so we're not changing the fraction's value, just rewriting it." (This text is authored per problem type, not generated.)
5. Transition message: "Now let's try one together."

---

#### Phase 1: Guided Practice ("We Do") — 2 Problems

**Problem type**: Same KC as the worked example, similar structure, different numbers.

**For each guided practice problem**:

1. **Present the problem** with scaffolding visible: the solution is broken into labeled sub-steps, and the first sub-step is pre-filled. The student must complete subsequent sub-steps in order.

2. **On each sub-step**:
   - Student enters an answer and submits.
   - **Correct on first try**: Show green confirmation. Display a specific, brief elaboration: "Yes — 12 is the LCM of 3 and 4." Advance to the next sub-step automatically.
   - **Incorrect on first try**: Show red indicator. Do NOT show the hint yet. Display a specific error message tied to the most common misconception for this sub-step. Example: "It looks like you might have added 3 and 4 — but we need a number that both divide into, not their sum." Give the student one more attempt.
   - **Incorrect on second try**: Now activate the hint button with a prompt: "Would you like a hint?" If the student selects yes, show Hint Level 1 (Orientation).
   - **Hint Level 1 (Orientation)**: Reminds the student what the goal is. "We're looking for the smallest number that both 3 and 4 divide into evenly." Wait at least 4 seconds before enabling "Next Hint."
   - **Incorrect after Hint 1, or student requests next hint**: Show Hint Level 2 (Strategy). "List the multiples of each denominator until you find one they share." Wait at least 5 seconds.
   - **Incorrect after Hint 2, or student requests next hint**: Show Hint Level 3 (Step). "Multiples of 3: 3, 6, 9, 12... Multiples of 4: 4, 8, 12... What's the first number in both lists?" Wait at least 6 seconds.
   - **Incorrect after Hint 3, or student requests next hint**: Show Hint Level 4 (Bottom-out). "The common denominator is 12. Type 12." After submission, mark this sub-step as "required hint to complete." This sub-step does NOT count toward the mastery streak.
   - **Three consecutive wrong answers with no hint request** (student is stuck or guessing): Show the orientation hint proactively without waiting for a request.

3. After both guided practice problems are complete, show a brief bridge message: "You've got the idea — now let's try one on your own."

---

#### Phase 2: Independent Practice ("You Do") — 3–5 Problems

**Problem type**: Same KC. Scaffolding is reduced: sub-step labels are removed. The problem is presented as a single problem to solve step by step, but without pre-filled steps.

**Mastery tracking begins here.** The mastery counter tracks only independent practice results.

**For each independent practice problem**:

1. **Present the problem**. No scaffolding. The hint button is present but visually de-emphasized (not a large button; a small "Need a hint?" link).

2. **On submission**:
   - **Correct on first try, no hints**: Add +1 to the consecutive-correct streak. Display specific process praise: "Perfect — you found the common denominator right away!" Do NOT show encouragement for hint-assisted correct answers.
   - **Incorrect on first try**: Show error-specific feedback tied to the most likely misconception for the step where the error occurred (if step-level detection is available) or the type of error in the final answer. Do not reveal the hint. Let the student try again once.
   - **Incorrect twice**: Activate the hint ladder as described in Phase 1. A problem where the bottom-out hint is used is marked "assisted" and does NOT count toward the streak.
   - **Correct after hints**: Confirm the correct answer but do not add to the consecutive-correct streak. Briefly explain the step that caused difficulty.

3. **Mastery advance rule**: When the consecutive-correct streak (problems correct on first try, no hints) reaches **3**, the KC is declared mastered. Show a mastery celebration message. Add the KC to the spaced review queue with a 1-day return interval. Advance to the next KC in the curriculum sequence.

4. **Remediation rule**: If the student gets 3 consecutive incorrect answers (even after hints, meaning bottom-out hints were needed for 3 problems in a row), exit independent practice and return to Phase 0 with a different worked example. After the re-teach, run 2 guided practice problems before returning to independent practice. Reset the mastery counter.

5. **Session cap**: If 5 independent practice problems have been completed without reaching mastery (streak of 3), end the session with a "great work today" message. The KC remains in-progress. On the next session, begin at Phase 2 with the streak preserved (do not reset).

---

#### Phase 3: Check and Remediation

After mastery is achieved in Phase 2, the session ends with a brief check:

1. Display a **transfer problem** — same KC but in a different surface form (e.g., if the practice used 1/3 + 1/4, the check might use 2/5 + 1/3, or a word problem context). This is not graded toward mastery — the student has already mastered. Its purpose is to consolidate generalization.

2. If the transfer problem is answered correctly: full celebration, mastery confirmed, session ends.

3. If the transfer problem is answered incorrectly: do NOT revoke mastery, but queue the KC for a shorter spaced review interval (1 day instead of 3 days). Display: "Almost there — this is a trickier version of the same idea. Let's look at it [tomorrow / in the next session]."

---

#### Phase 4: Spaced Review (Returning Sessions)

When a previously mastered KC returns for spaced review:

1. Skip Phase 0 (no concept card) and Phase 1 (no guided practice). Go directly to a single independent problem.
2. If correct on first try: extend the review interval (×2 the previous interval). No mastery celebration needed — use a brief "Great, you still remember this!" message.
3. If incorrect: reduce the interval back to 1 day and queue 2 additional practice problems before the next review.
4. After the review problem, continue to new learning. Review items should compose no more than 30–40% of any session.

---

### Error Message Templates (Per Misconception)

Each KC should have 3–5 authored error messages, each targeting a specific misconception, not just confirming "wrong." Examples for the "common denominator" KC:

| What the student did | Error message |
|---------------------|---------------|
| Added numerator and denominator together (e.g., 1/3 + 1/4 = 2/7) | "It looks like you added tops and bottoms separately — but the denominator tells us the piece size, and we can't change it by adding. We need to find a common denominator first." |
| Used one of the existing denominators (e.g., answered 3 or 4) | "Good thinking, but 3 and 4 both need to divide into our common denominator evenly. What's the smallest number that both 3 and 4 go into?" |
| Used the product (12) but calculated the new numerators incorrectly | "You found the common denominator — 12 is right! Now double-check: if 1/3 becomes ?/12, we multiplied the bottom by 4, so we also multiply the top by 4. What's 1 × 4?" |
| Correct common denominator but added instead of keeping denominator | "You set up the fractions perfectly. Now when we add fractions with the same denominator, we add the top numbers and keep the bottom number the same — we don't add the denominators." |

---

### Self-Explanation Prompt Bank (Per KC Step)

Each KC should have 2–3 self-explanation prompts, one of which fires after the worked example and one of which may fire mid-practice as a "think-aloud" check. Prompts are triggered by step, not by correctness.

Example format:
- After the "find LCM" step: "In your own words, what does the common denominator tell us?"
- After the "rewrite fractions" step: "Why do we multiply both the top and bottom by the same number?"
- After the "add numerators" step: "Why don't we add the denominators together?"

For a deterministic system, prompts are authored per KC and per step, not generated. They should appear at most once per session per KC to avoid prompt fatigue.

---

### Mastery Rule Summary

```
Consecutive correct, no hints: streak += 1
Correct with hint (any level):  streak unchanged
Incorrect:                       streak = 0
Bottom-out hint used:            problem marked "assisted," does not affect streak
streak >= 3:                     KC mastered → add to spaced review, advance
3 problems needing bottom-out:   trigger re-teach (Phase 0 → Phase 1 → Phase 2)
50%+ bottom-out in session:      flag KC for prerequisite review in next session
```

---

### Interaction Design Constraints (No-LLM Rules)

1. **All error messages are authored text** keyed to (KC, step, error-type). The problem engine already knows which step is wrong; the error type is the delta between the correct answer and the submitted answer.
2. **All hints are authored text** in a 4-level ladder per step. The existing 3-step ladder becomes levels 1–3; add a level-4 bottom-out.
3. **All self-explanation prompts are authored text** per (KC, step). Student responses are accepted without evaluation — the prompt's value is in the act of generating the explanation, not in grading it. Display a confirming statement regardless.
4. **All mastery logic is rule-based** counters: streak counter, session problem counter, KC review queue with interval tracking.
5. **Difficulty selection** uses the KC graph: find the first KC in topological order that is neither mastered nor in the current "stuck" state. This is deterministic given the curriculum structure that already exists in CURRICULUM.md.
6. **The hint button timer** is implemented client-side: record hint-display timestamp, disable "Next Hint" button until (word count of hint ÷ reading-speed constant) seconds have elapsed. Reading speed for 8-year-olds: approximately 100–130 words per minute → ~0.5 seconds per word is a conservative pace for hints.

---

*Research sources: Bloom (1984), VanLehn (2011), Corbett & Anderson (1994), Sweller cognitive load theory, Rosenshine (2012), Renkl & Atkinson faded worked examples, Chi et al. self-explanation, Bisra et al. (2018) meta-analysis, Baker et al. gaming the system research, Kang (2016) spaced repetition, ASSISTments platform studies, Carnegie Learning Cognitive Tutor effectiveness literature.*
