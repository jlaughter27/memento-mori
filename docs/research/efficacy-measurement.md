# Efficacy Measurement for an Offline, No-Account Kids' Math App

> Implementation-ready guide for measuring and surfacing genuine learning gains using localStorage only.
> Audience: developers and designers building Memento Mori.

---

## 1. Why Standard Metrics Lie

The first trap in edtech analytics is confusing engagement with learning. Completion rates, time-on-screen, and problems-attempted are vanity metrics: they measure consumption, not competence. A child who spends forty minutes randomly tapping through flashcards shows excellent "time on task" and zero durable learning. Research on corporate learning platforms confirms the same pathology at scale — the LMS measures activity; nobody measures whether the skill transferred.

Three specific vanity metrics to consciously avoid:

- **Problems completed.** A child who answers 200 easy addition facts they already know will outperform a child who struggles through 40 genuinely challenging subtraction problems. Raw volume inflates apparent progress.
- **Streaks and badges.** Motivational scaffolding is valuable but it is not evidence of mastery. A streak signals sustained engagement, not whether the child will still know the skill next week.
- **Session count.** Frequency of use is a proxy for parental supervision style, not for learning rate.

The replacement: measure accuracy trajectory on novel problems within each skill, spaced retention after a delay, and domain mastery aggregated across sessions.

---

## 2. The Learning Curve as a Measurement Framework

Cognitive psychology's power law of practice provides the theoretical backbone for measuring skill acquisition. The pattern is consistent across age groups and skill types: improvement is rapid in the earliest practice attempts and decelerates as competence approaches asymptote. Mathematically, performance time (or error rate) falls as a power function of the number of attempts. The practical implication for an app is that the shape of a learner's accuracy curve — not any single-session score — reveals whether genuine learning is occurring.

For a children's math app, the learning curve translates into three observable phases per skill:

1. **Acquisition phase.** First 3–8 attempts. Error rate is high, response latency is long, self-corrections are common. A downward-sloping error rate here confirms the child is in active learning mode, not retrieval mode.
2. **Consolidation phase.** Attempts 9–20. Accuracy stabilizes above 70–80%, latency decreases. The child can produce the answer reliably but with cognitive effort.
3. **Mastery phase.** Accuracy exceeds a threshold (literature benchmarks: 80% across three sessions in clinical behavioral research; 0.95–0.98 posterior probability in Bayesian Knowledge Tracing systems; IXL sets SmartScore 80 as "proficient," 100 as "fully mastered") with consistent response latency. The skill is procedurally automatic.

Logging enough data per attempt — timestamp, correctness, response time in milliseconds, skill ID, attempt number — lets the app reconstruct this curve entirely from localStorage without any server.

---

## 3. Pre- and Post-Mastery Measurement Without Accounts

### Placement Probes (Pre-Measurement)

On first encounter with a domain, the app needs a baseline. A placement probe is a short, stratified sample: 8–12 items that span the skill's difficulty range. The child answers without hints or feedback. The result determines starting level and establishes the baseline accuracy score that all future gains are measured against.

Key design rules for offline pre-measurement:
- Run placement probes silently, framed as "let's see what you already know" rather than as a test.
- Record both accuracy and response latency. A child who answers 7/10 correctly but takes 12 seconds per item is in a different place than one who answers 7/10 in 2 seconds per item.
- Store the raw item-level responses with timestamps, not just the aggregate score. The item-level record is what enables later skill-gap analysis without re-testing.
- Refresh placement data if the child has not touched a domain in more than 21 days. Retention degrades; the baseline becomes stale.

### Post-Measurement and Growth Scoring

Post-mastery is not a separate formal test — it emerges naturally from the practice session record. After a skill accumulates enough practice events (recommend: minimum 10 scored attempts across at least 2 sessions), compute:

- **Accuracy delta:** (mean accuracy in last 5 attempts) minus (mean accuracy in first 5 attempts). A positive delta is evidence of learning gain.
- **Latency delta:** (mean response time in last 5 attempts) minus (mean response time in first 5 attempts). Negative delta (faster) indicates automaticity growth, a stronger signal than accuracy alone for already-familiar skills.
- **Mastery unlock:** Binary flag set when accuracy >= 0.80 across 3 consecutive attempts and latency is below skill-specific ceiling (e.g., 8 seconds for single-digit addition facts).

---

## 4. Retention Measurement via Spaced Reviews

Learning that evaporates is not learning. Ebbinghaus's forgetting curve, validated across over a century of research, shows that without review, humans lose the majority of new knowledge within days. For children specifically, one study found 73% of mathematical knowledge lost within four weeks of initial learning when no review occurred. Spaced repetition combats this by scheduling review precisely when memory begins to decay.

### The Measurement Opportunity in Review Sessions

Each scheduled review is not just pedagogical reinforcement — it is a retention measurement event. When a child encounters a "mastered" skill after a delay and answers correctly, the app has evidence that the learning was durable. When the child fails a previously mastered skill after a delay, the forgetting curve has been observed in action.

Tracking retention accuracy creates a new metric: **retention rate per skill**, defined as the percentage of spaced review attempts that succeed after the child previously demonstrated mastery.

### Interval Scheduling Without a Server

A simplified SM-2-inspired algorithm works entirely in localStorage:

- After first mastery: schedule review in 1 day (relative to session timestamp).
- After successful review: multiply interval by 2.5 (so: day 1, day 3, day 7, day 16, day 37...).
- After failed review: reset interval to 1 day; decrement the skill's mastery confidence level.
- Store per-skill: `{ skillId, masteryLevel, nextReviewDue, intervalDays, retentionAttempts, retentionSuccesses }`.

The review scheduling logic runs entirely on-device by comparing `nextReviewDue` timestamps against `Date.now()`. No server required.

### What Retention Data Reveals to Parents

A skill with high retention rate (>80% of spaced reviews correct) after intervals of 7+ days is genuinely learned. A skill with low retention rate despite mastery unlock signals shallow encoding — the child could perform the skill during a session but could not retain it. This distinction is invisible to apps that only show "skills completed."

---

## 5. How the Platforms Do It: Khan Academy, IXL, Zearn

### Khan Academy

Khan Academy's mastery system tracks four states per skill: not started, practiced, leveled up, and mastered. Mastery is gated by sustained accuracy across multiple exercise attempts, not a single test score. The parent/teacher report surface shows mastery distribution across a course, how long the student has been working on material, accuracy on recent questions, and comparison to grade-level expectations. The key design insight is that mastery is computed cumulatively across sessions — there is no "test moment," only a rolling evidence window. Khan also shows "course mastery percentage" as an aggregate, giving parents a single headline number without hiding the skill-level detail beneath it.

### IXL

IXL's SmartScore is the clearest public example of a multi-factor mastery score. It weighs question difficulty, answer accuracy, and consistency simultaneously. A score of 80 represents proficiency; 100 is full mastery. The "Challenge Zone" activates at 90 and penalizes incorrect answers more heavily, testing whether mastery holds under pressure. Parent-facing analytics tie SmartScore to specific skills, not just grade bands, so a parent can see "my child is at 62 in double-digit subtraction" — pinpointing exactly where to focus. IXL's published research claims reaching SmartScore 80 in at least two skills per subject per week correlates with measurable test-score gains.

### Zearn

Zearn uses its "Tower of Power" as the mastery gate at the end of each digital lesson. The tower demands 100% accuracy across a multi-stage problem set that escalates in complexity and reduces scaffolding at each level. Students cannot advance without passing it. Zearn's reporting suite shows teachers and parents which topics a student excels in, how deep any struggle is, and lesson-level assessment results. The strict accuracy gate — unusual by industry standards — reflects the platform's commitment to ensuring procedural fluency before conceptual extension.

### Common Patterns Worth Adopting

All three platforms share these design choices:
1. Mastery is computed over multiple attempts, not a single test.
2. Domain-level aggregation (e.g., "Addition") sits above skill-level detail (e.g., "Double-digit addition with carrying"), giving parents a hierarchy to navigate.
3. Accuracy trend matters more than any single score. Platforms show whether a student is improving, plateau, or declining.
4. Time-on-task is shown but not featured. IXL and Khan include it; it is supporting context, not the headline.

---

## 6. What a Meaningful Parent Report Contains

A parent looking at a progress report wants to answer one question: "Is my child actually getting better?" Everything else is noise unless it supports that answer. Based on how leading platforms structure their reports and what learning science defines as durable gain, a meaningful offline parent report has five layers:

### Layer 1: Headline Growth Indicator
A single sentence or number that answers "is it working?" without requiring the parent to interpret data. Example: "Maya has mastered 4 new math skills this month and is retaining 87% of what she learned." This is not vanity (it is mastery-gated and retention-verified, not just activity-based).

### Layer 2: Domain Mastery Map
A visual grid or list showing each math domain (e.g., Number Sense, Addition, Subtraction, Place Value, Multiplication) with a status per domain: not started, in progress, approaching mastery, mastered, retained. This is the map parents need to have a conversation with a teacher or tutor.

### Layer 3: Accuracy Trend per Domain
A sparkline or simple "improving / steady / declining" label for each domain showing accuracy direction over the last 4 weeks. This is the critical anti-vanity layer: a child who is "in progress" on Subtraction but showing declining accuracy needs attention; a child showing a rising trend is on track even if not yet mastered.

### Layer 4: Retention Evidence
For each mastered skill, show whether the child still knows it. "Mastered and retained (4 spaced reviews passed)" is far more meaningful than "mastered." If a skill was mastered but then failed on review, flag it as "needs refresh."

### Layer 5: Time-on-Task (Context Only)
Sessions this week, average minutes per session. Shown as context for whether the accuracy and mastery data is based on enough practice. A child who shows 100% accuracy on 3 attempts has an unreliable mastery signal. A child with 100% accuracy on 40 attempts has a robust one. Parents deserve to see sample size alongside percentage.

---

## 7. Privacy-Safe Local Analytics

An offline, no-account app has a structural privacy advantage: there is no server to breach. COPPA's core requirement — no personal data collected from children under 13 without verifiable parental consent — is automatically satisfied when nothing leaves the device. But local data still warrants careful design:

- Store data under a device-local anonymous session ID, not a name or email. Parents set up the child's name locally for display purposes only; it never needs to be a lookup key in any schema.
- Apply data minimization: log only what is necessary for mastery and retention computation. Skip behavioral metadata (tap patterns, hesitation analysis) unless it directly feeds a learning metric.
- Cap localStorage history: keep per-skill attempt history to the last 50 attempts per skill, and per-session logs for the last 90 days. Prune older raw events to prevent unbounded growth and reduce the value of any device-access exposure.
- Never include device identifiers, IP addresses, or cross-app identifiers in any local schema. Even if a future sync feature is added, the local schema should be designed so it cannot be used to build a behavioral profile.
- Make all stored data exportable and deletable from the parent report UI. A "clear all data" option is both a privacy control and a trust signal to parents.

---

## 8. Concrete Specification

### 8.1 On-Device Metrics to Log Per Skill Per Attempt

Every scored problem attempt writes one record to localStorage. The complete schema:

**Attempt record** (append-only log):
- `skillId` — unique identifier for the specific skill (e.g., `add-2digit-no-carry`)
- `domainId` — parent domain (e.g., `addition`)
- `sessionId` — anonymous session identifier (timestamp-based UUID, regenerated per device installation)
- `attemptTimestamp` — Unix ms timestamp
- `isCorrect` — boolean
- `responseTimeMs` — time from problem display to answer submission in milliseconds
- `attemptNumber` — sequential count of all attempts on this skill across all sessions
- `wasHintUsed` — boolean (hints indicate partial mastery)
- `difficultyLevel` — integer 1–5 (used to weight mastery calculation)

**Skill state record** (mutable, one per skill):
- `skillId`
- `masteryLevel` — enum: `not_started | acquiring | consolidating | mastered | retained`
- `masteryUnlockedAt` — timestamp when mastery threshold was first crossed
- `masteryScore` — float 0–1 (rolling weighted accuracy of last 10 attempts, weighted by difficulty)
- `latencyScore` — float 0–1 (normalized response time vs. skill benchmark)
- `retentionAttempts` — count of spaced review attempts post-mastery
- `retentionSuccesses` — count of successful spaced reviews
- `nextReviewDue` — Unix ms timestamp for next scheduled review
- `currentIntervalDays` — float, current spaced repetition interval
- `placementAccuracy` — float, accuracy on the initial placement probe
- `lastAttemptTimestamp` — for staleness detection

**Session summary record** (one per session):
- `sessionId`
- `startTimestamp`, `endTimestamp`
- `totalAttempts`
- `skillsTouched` — array of skillIds
- `newMastriesUnlocked` — array of skillIds crossing mastery threshold this session
- `reviewsCompleted` — count of spaced review events
- `reviewsPassed` — count of successful reviews

---

### 8.2 Parent Efficacy Report Layout

The report is a single-screen view, accessible from the app's parent mode (PIN-gated). Layout is top-to-bottom, with the most actionable information first.

**Section A — Headline Card** (always visible, above the fold)
- Child's display name + total weeks using the app
- "Skills mastered and retained: N" — mastered + passed at least one spaced review
- "Skills mastered, pending retention check: N"
- "Overall accuracy trend this week: [Up / Steady / Down]" — computed from accuracy delta across all domains this week vs. last week

**Section B — Domain Mastery Grid**
One row per domain. Columns:
- Domain name
- Mastery status icon (not started / in progress / approaching / mastered / retained)
- Skills mastered count / total skills in domain
- Accuracy trend arrow (up/flat/down) for last 4 weeks
- Tap to expand to skill-level detail

**Section C — Accuracy Trend Chart**
A rolling 8-week chart showing overall accuracy per week across all domains. Uses only logged problem data — no inference. Includes sample size notation ("based on N problems this week") to give parents a sense of reliability.

**Section D — Retention Health**
List of all mastered skills. For each:
- Skill name
- Days since mastered
- Retention status: "Retained (N reviews passed)" / "Review due soon" / "Needs refresh (failed last review)"
- Next review due date

**Section E — Time Context**
- Sessions this week and last 4 weeks
- Average session length in minutes
- Note: "Progress is based on accuracy and retention, not time spent"

---

### 8.3 Weekly Summary Card

The weekly summary card is a condensed, shareable (screenshot-friendly) view generated every Sunday from session logs. Layout:

```
Week of [Date Range]
[Child name]'s Math Progress

NEW THIS WEEK
  Mastered: [N skills] in [domains]
  Retained: [N skills] passed spaced review

ACCURACY
  This week: [X%] — [Up/Down N% from last week]
  Best domain: [name] at [X%]
  Needs work: [name] at [X%]

PRACTICE
  [N] sessions  |  ~[N] min/session
  [N] problems  |  [N] reviews

[OVERALL TREND: arrow + label]
```

The weekly card deliberately omits raw counts of problems completed and time on screen as headline metrics. Growth (new masteries, retention passes, accuracy delta) leads; activity (sessions, minutes) is shown last and smallest.

---

## Sources Consulted

- Outhwaite et al. (2023), "Understanding how educational maths apps can enhance learning," *British Journal of Educational Technology*. https://bera-journals.onlinelibrary.wiley.com/doi/10.1111/bjet.13339
- Berkowitz et al. (2019), "Raising Early Achievement in Math With Interactive Apps: A Randomized Control Trial," *PMC*. https://pmc.ncbi.nlm.nih.gov/articles/PMC6366442/
- IXL Learning, "IXL SmartScore: The key to mastery-based learning." https://blog.ixl.com/2020/11/11/ixl-smartscore-the-key-to-mastery-based-learning/
- IXL Learning, "How does the SmartScore work?" https://www.ixl.com/help-center/article/1272663/how_does_the_smartscore_work
- Khan Academy, "Using Khan Academy's mastery progress reports." https://www.khanacademy.org/khan-for-educators/k4e-us-demo/xb78db74671c953a7:using-assignments-on-khan-academy/xb78db74671c953a7:strategies-for-using-assignments-with-students/a/using-khan-academys-mastery-progress-reports
- Zearn, "Zearn reporting suite." https://help.zearn.org/hc/en-us/articles/29008224450967-Zearn-reporting-suite
- Zearn, "Lesson-level assessments." https://help.zearn.org/hc/en-us/articles/115007900828-Lesson-level-assessments
- Pelanek (2018), "Analysis and Design of Mastery Learning Criteria." https://www.fi.muni.cz/~xpelanek/publications/nrhm-mastery.pdf
- Laleh et al. (2019), "DAS3H: Modeling Student Learning and Forgetting for Optimally Scheduling Distributed Practice of Skills." https://arxiv.org/pdf/1905.06873
- Skycak, J., "Cognitive Science of Learning: Spaced Repetition." https://www.justinmath.com/cognitive-science-of-learning-spaced-repetition/
- Third Space Learning, "A Teacher's Guide To Spaced Repetition." https://thirdspacelearning.com/blog/spaced-repetition/
- Power law of practice — Wikipedia. https://en.wikipedia.org/wiki/Power_law_of_practice
- Rethinking Grading Through the Lens of the Power Law of Learning. https://www.geyerinstructional.com/blog/rethinking-grading-systems-through-the-lens-of-the-power-law-of-learning/
- Stanford GSE, "Testing gains from extra time in math class not lasting." https://ed.stanford.edu/news/testing-gains-extra-time-math-class-not-lasting
- Lambda Solutions, "How To Ditch Vanity Metrics For Actionable Metrics For Better eLearning." https://www.lambdasolutions.net/en/blog/how-to-ditch-vanity-metrics-for-actionable-metrics-for-better-elearning
- Idea Usher, "How to Build a COPPA-Compliant Kid's Learning App." https://ideausher.com/blog/coppa-compliant-learning-app-development/
- 6B Education, "Building Privacy-Compliant Systems: EdTech Development Under GDPR, COPPA, and FERPA." https://6b.education/insight/building-privacy-compliant-systems-edtech-development-under-gdpr-coppa-and-ferpa/
- Blended Mastery Learning in Mathematics (arXiv). https://arxiv.org/pdf/1712.07848
- Mastery Criteria and Maintenance: a Descriptive Analysis of Applied Research Procedures, PMC. https://pmc.ncbi.nlm.nih.gov/articles/PMC7314871/
