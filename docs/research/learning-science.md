# Learning Science Design Guide
## How Children Ages 8–11 Learn Best in Math
### Implementation-Ready Principles for a Kids' Math Tutor with Pet Companion + Story Mode

> **Audience:** Product designers, developers, and content authors building an adaptive math app for children in the 8–11 age range.
> **Scope:** Nine evidence-based learning-science principles, each with a mechanism summary and concrete in-app implementation recommendations tied to features (lessons, hints, spaced review, the pet companion, narrative adventure, rewards).

---

## 1. Cognitive Load Theory

### The Finding

Working memory can hold only about 4 ± 1 chunks of novel information at once (Cowan, 2001; Sweller, 1988). Cognitive load theory partitions the total demand placed on working memory into three types: **intrinsic load** (the inherent complexity of the material itself, determined by the number of interacting elements), **extraneous load** (unnecessary mental effort caused by poor instructional design — split-attention, redundant text, cluttered interfaces), and **germane load** (productive effort spent constructing and automating schemas). Learning is impaired when intrinsic plus extraneous load together saturate working memory, leaving no capacity for schema formation.

The **worked-example effect** is one of the most replicated findings in educational psychology (Sweller & Cooper, 1985; Atkinson et al., 2000): novice learners who study fully-solved worked examples learn faster and transfer better than those who solve equivalent problems themselves. The mechanism is load reduction — examples eliminate the need for means-ends search, freeing capacity for pattern abstraction. However, the **expertise-reversal effect** (Kalyuga et al., 2003) means that as proficiency grows, full worked examples become redundant or even harmful, because the learner now has to actively suppress what they already know. Guidance must therefore fade in step with competence.

### In Our App

- **Introduce every new concept with a fully worked example first**, narrated by the pet companion, before presenting any practice problem. Show each step sequentially — not all at once — to avoid element-interactivity overload.
- **Implement an explicit fading schedule:** full example → partial example (some steps masked as fill-in-the-blank) → problem with hint → problem with no scaffold. Gate the transition on demonstrated accuracy (e.g., 3 consecutive correct answers before removing a scaffold).
- **Minimize extraneous load throughout the UI:** do not overlay on-screen text that repeats what the pet's audio narration is already saying (see Mayer's redundancy principle in §4). Keep animations purposeful; idle cosmetic motion competes for visual attention.
- **Limit novel interacting elements per screen.** A new problem type should introduce one new concept at a time; multi-step word problems combining two new skills should only appear once both individual skills are consolidated.
- **Use the adventure story to provide worked examples in context:** the pet companion models solving a math problem as part of the story quest ("Watch how I figure out how many apples we need for the journey…"), then the child solves an analogous problem.

---

## 2. Retrieval Practice and Spaced Practice

### The Finding

Retrieval practice (the testing effect) is the finding that actively recalling information from memory produces stronger, more durable learning than an equivalent amount of re-reading or re-studying (Roediger & Karpicke, 2006). The mechanism is **retrieval-induced memory consolidation**: each successful recall strengthens the retrieval route itself, making subsequent recall faster and more robust — even months later. Critically, this benefit is independent of ability level, making it effective for the full range of children in this age band (Kornell et al., 2009; multiple elementary-school replications). In a direct study of second-graders learning multiplication facts, retrieval practice produced stronger both short-term and long-term fluency gains compared to re-study conditions (Ophuis-Cox et al., 2023).

**Spaced practice** compounds this effect: spreading practice over time (rather than massing it in a single session) dramatically improves long-term retention. The optimal spacing gap is roughly 10–20% of the intended retention interval — so material tested in a week benefits from a 1-day gap; material to be retained for a month benefits from a 3–7-day gap (Cepeda et al., 2006). Rosenshine (2012) operationalizes this as reviewing the previous week's content on Monday, and reviewing the previous month's content on every fourth Monday.

### In Our App

- **Build a spaced-review queue** (a lightweight implementation of a spaced-repetition scheduler). When a child first correctly answers a problem type, schedule it for review in 1 day. On successful review, double the interval (1 → 2 → 4 → 8 days, up to a practical ceiling of ~30 days). On failure, reset to a 1-day interval.
- **Open every session with a short retrieval warm-up** (3–5 questions) drawn from prior lesson material rather than new content. Frame it as the pet asking "Can you remember what we learned last time?" — this primes memory and lowers initial anxiety.
- **Make retrieval feel low-stakes.** Errors during spaced review should trigger the pet companion offering a brief re-explanation (an "explanation card") rather than a penalty. Reward the *attempt* to recall, not only correct answers — this aligns with the metacognitive finding that children often underestimate how much they are learning through testing and need encouragement to persist.
- **Never allow content to disappear after a lesson is "completed."** Treat mastery as a maintained state requiring periodic confirmation, not a one-time achievement.

---

## 3. Interleaving vs. Blocked Practice

### The Finding

Blocked practice (finishing all problems of type A before moving to all problems of type B) is the traditional school approach and feels easier during practice. Interleaved practice (mixing problem types so that consecutive problems require different strategies) is harder during practice but produces significantly better long-term retention and transfer. In Rohrer and Taylor's (2007) landmark study, interleaved practice produced test scores of 77% compared to 38% for blocked practice on a test 24 hours later. A large-scale replication with ~800 seventh-graders showed 61% (interleaved) vs. 38% (blocked) on a test one month after instruction. The mechanism is **discriminative contrast**: interleaving forces the learner to identify which strategy to apply before applying it — a metacognitive skill that blocked practice never demands (Kornell & Bjork, 2008). For elementary school children specifically, interleaving also increases flexible and adaptive use of mathematical strategies (Ziegler & Stern, 2016).

**Important caveat for young learners:** for children at the very start of encountering a new concept (the first 1–3 exposures), some blocked practice may be beneficial to establish a minimal schema before the discrimination challenge is introduced.

### In Our App

- **Use a two-phase structure per concept:** a short *acquisition phase* of 3–5 blocked problems to establish the schema, followed immediately by interleaved practice mixing the new type with 2–3 recently learned types.
- **In the spaced-review queue, always interleave problem types** within a session. Avoid generating a review session that contains only one type of problem.
- **Design the story-quest structure to naturally interleave:** each quest chapter requires applying different math skills from the current unit, preventing the child from getting into a repetitive single-strategy rhythm.
- **Label problem types after solving, not before.** Revealing the category after the attempt (rather than labeling "this is a division problem") preserves the discrimination challenge and increases the metacognitive benefit.

---

## 4. Dual Coding and Multimedia Learning (Mayer's Principles)

### The Finding

Paivio's dual coding theory (1986) holds that memory is strengthened when information is encoded in both a verbal and a visual channel simultaneously, because the two independent traces provide redundant retrieval routes. Mayer's Cognitive Theory of Multimedia Learning (2001, 2009) extends this into 12 specific, well-replicated design principles grounded in three assumptions: dual channels (auditory and visual), limited capacity in each channel, and active processing. The principles most critical for a children's math app are:

- **Multimedia principle:** words + pictures together produce better learning than words alone.
- **Modality principle:** narrated animation is better than on-screen text + animation, because narration uses the auditory channel while the visual channel processes the image — preventing the bottleneck that occurs when both text and image compete for the visual channel.
- **Redundancy principle:** removing on-screen text that merely repeats the narration *improves* learning, because reading and listening simultaneously to the same content wastes visual capacity on redundant decoding.
- **Spatial contiguity principle:** labels and explanations should be placed physically adjacent to the thing they describe, not in a separate panel or legend.
- **Temporal contiguity principle:** narration and animation should be synchronized, not sequential.
- **Segmentation principle:** break complex animated sequences into learner-controlled steps rather than a continuous stream, to prevent transient-information overload.
- **Coherence principle:** removing interesting but irrelevant details and decorations improves learning by reducing extraneous load.

### In Our App

- **Use narrated animation as the primary instructional medium** for new concepts. The pet companion speaks the explanation aloud while an animated visual demonstrates the concept. Do not also display the full spoken text on screen simultaneously.
- **Place minimal, precise labels directly on the visual**, not in a side panel. If a number line is being used to show addition, annotate the number line itself.
- **Break animated demonstrations into steps with a "tap to continue" gate** so children control pacing and can replay any step.
- **Strip cosmetic background decorations from instructional screens.** The adventure art belongs in the story mode; the problem-solving workspace should be clean.
- **Use the pet companion's voice as the single audio channel for instruction.** Background music during instruction competes with the auditory channel — reserve it for celebration moments and navigation.
- **Leverage dual coding for abstract concepts:** for multiplication, pair the spoken multiplication fact ("3 groups of 4") with a visual array and physical grouping animation simultaneously, reinforcing both encodings.

---

## 5. Concrete–Representational–Abstract (CRA) Progression

### The Finding

The CRA instructional sequence (grounded in Bruner's enactive–iconic–symbolic model, 1966, and systematized by Witzel, Riccomini, & Schneider, 2008) holds that mathematical concepts are best acquired through three staged representations: **Concrete** (physical or virtual manipulables — blocks, counters, area tiles), **Representational** (pictures, diagrams, drawn models), and **Abstract** (numerals and symbolic notation). The progression works because it grounds abstract symbols in perceptual experience, building a conceptual schema before procedural rules are attached to it. A 2025 meta-analysis (Ebner, MacDonald, et al.) found an overall Tau-BC effect size of 0.9965 in favor of CRA over traditional instruction — a very strong finding, particularly for students with learning difficulties, but with benefits documented across the general population as well. CRA is the backbone of Singapore Math's Concrete–Pictorial–Abstract (CPA) model.

### In Our App

- **Map every new math concept to a CRA progression.** Before a child encounters the symbolic expression 3 × 4 = 12, they should first manipulate virtual objects (drag 3 groups of 4 apples), then see a pictorial representation (a drawn array), then finally see the numeral.
- **Virtual manipulatives should be interactive, not merely decorative.** The child physically groups, partitions, or rearranges the objects — this is more effective than a static picture.
- **Use the story world as the concrete stage:** the adventure narrative provides a natural setting (e.g., "sort the potions into equal groups"), making manipulations story-coherent.
- **Allow the child to return to the concrete or representational layer on demand** via a "show me with objects" hint. Do not lock them into the abstract layer prematurely.
- **The pet companion bridges layers:** in the concrete stage it names objects ("these are the treasure coins"); in the representational stage it draws them; in the abstract stage it writes the equation — always explicitly connecting them ("the 3 bags of 4 coins is the same as writing 3 × 4").

---

## 6. Productive Struggle and Desirable Difficulties

### The Finding

Bjork's (1994) concept of **desirable difficulties** is the finding that learning conditions that create short-term difficulty and slower apparent acquisition (e.g., retrieval practice, interleaving, spacing, reduced feedback frequency) produce superior long-term retention and transfer. The key word is *desirable*: difficulties are beneficial when they engage productive processing and are within the learner's capability to resolve; they are harmful when they merely frustrate and prevent any progress. Vygotsky's **zone of proximal development (ZPD)** provides the calibration criterion: the optimal challenge is the task a child cannot yet do alone but can do with appropriate support. A child working below their ZPD is bored; above it, they are overwhelmed. The challenge sweet spot produces **productive struggle** — effortful engagement that drives schema growth.

### In Our App

- **Implement adaptive difficulty:** track rolling accuracy per skill and adjust problem difficulty to maintain approximately 70–80% accuracy (the empirical success-rate associated with maximal learning in adaptive tutoring research). Problems answered correctly at > 90% are too easy; < 60% for more than 3 consecutive problems indicates the scaffold has been removed too early.
- **Never immediately rescue a child who is struggling.** Build a short "think time" into the UI — show the pet companion in a "thinking with you" animation for 10–15 seconds before hints are offered, normalizing effort and discouraging impulsive hint-seeking.
- **Offer tiered hints, not instant solutions.** Hint 1: a question that redirects attention ("What do we know about the problem?"). Hint 2: a partial concrete representation. Hint 3: a near-complete worked sub-step. Only after all three have been offered should a full solution be shown.
- **Celebrate perseverance explicitly** in the pet's dialogue and in the story narrative — "You kept trying even when it was hard, and you figured it out!" — to build tolerance for difficulty.
- **Calibrate story quest difficulty arcs:** quests should start easier (building competence and confidence) and increase difficulty toward the climax, mirroring game design principles and the motivational arc of flow theory.

---

## 7. Motivation: SDT, Overjustification, Growth Mindset, Narrative and the Pet Companion

### The Finding

**Self-Determination Theory (SDT)** (Deci & Ryan, 1985, 2000) identifies three basic psychological needs whose satisfaction predicts sustained intrinsic motivation: **Autonomy** (the experience of choice and volition), **Competence** (the experience of efficacy and mastery), and **Relatedness** (the experience of meaningful connection to others). When instruction satisfies all three, children engage more deeply, persist longer, and develop stronger metacognitive strategies (SDT-metacognition research, Cerasoli & Ford, 2014).

**The overjustification effect** (Deci, Koestner, & Ryan, 1999 meta-analysis of 128 studies): tangible, expected, contingent rewards (e.g., points or prizes given simply for completing a task) reliably undermine pre-existing intrinsic motivation. The mechanism is a shift in perceived locus of causality — the child attributes their behavior to the external reward rather than their own interest. Unexpected rewards and **informational feedback** (rewards that communicate competence rather than control) do not undermine motivation and may enhance it.

**Growth mindset** (Dweck, 1999): praising effort and strategy (process praise) rather than ability (person praise) is robustly supported. However, the broader growth mindset *intervention* literature has shown mixed replication (Sisk et al., 2018 meta-analysis: d = 0.08 average effect). The honest implication is that the *language and framing* of feedback matters, but standalone mindset lessons are unlikely to produce large achievement gains. Growth mindset framing works best in combination with mastery-oriented task design and supportive feedback.

**Narrative and pet companions** support the **Relatedness** need. Research on Stanford's SmartPrimer and related systems shows that embedding learning in narrative boosts engagement as measured by behavioral coding. Character-based companions increase persistence on difficult problems by creating a social context — children feel accountable to (and curious about) a character they care about. Narrative also provides *context* for mathematical problems, increasing perceived relevance and supporting encoding via story memory.

### In Our App

- **Autonomy:** let children choose the order of quest chapters within a unit (2–3 options), choose the pet companion's appearance or name, and choose between problem representations (e.g., number line vs. array). Even small choices dramatically increase feelings of ownership.
- **Competence:** provide **informational feedback** ("You solved it correctly — that strategy of breaking 7 into 5 + 2 is very efficient") rather than merely evaluative feedback ("Correct! +10 stars"). Competence-affirming language tied to *specific strategies* the child used satisfies the competence need without creating dependence on external validation.
- **Relatedness:** make the pet companion a persistent character with a developing story and visible emotional reactions. The pet celebrates the child's success genuinely, worries during hard problems alongside them, and references previous achievements ("Remember when you figured out fractions? This is just like that"). This social-emotional texture satisfies the Relatedness need.
- **Avoid contingent tangible rewards as the primary motivator.** Stars, coins, and badges are fine as secondary signals, but they must not be the framing of why to engage. The story stakes ("the pet needs your help to complete the quest") and the intrinsic satisfaction of solving ("you figured it out!") should be primary.
- **Use process praise in all pet dialogue and feedback copy.** "You tried a different approach when the first one didn't work — that's exactly what good mathematicians do" rather than "You're so smart!" or just "Correct."
- **Growth mindset framing throughout:** frame errors as information, not failure. The pet should model this: "Hmm, that didn't work. Let's figure out why — that actually helps us learn more than getting it right on the first try."

---

## 8. Feedback — Timing, Specificity, Metacognition, and Self-Explanation

### The Finding

Hattie and Timperley (2007) reviewed hundreds of studies and found feedback to be one of the most powerful influences on learning (effect size d ≈ 0.73). They identify three levels of feedback that are most effective: **task-level** (is this correct?), **process-level** (which strategy led here, and why?), and **self-regulation level** (how can you monitor and adjust your own approach?). Self-level feedback ("you are a good student") is the weakest and can backfire.

**Timing:** for young learners building foundational skills, **immediate corrective feedback** is superior to delayed feedback, because delayed errors become reinforced in memory (Anderson et al., 1990). However, withholding feedback slightly during retrieval practice — allowing a full recall attempt before confirming — maximizes the mnemonic benefit. The practical synthesis: allow a complete response attempt, then give immediate, specific feedback.

**The self-explanation effect** (Chi et al., 1989): students who are prompted to explain *why* a step works — rather than simply watching or repeating it — show dramatically better learning and transfer. The mechanism is that self-explanation forces the child to identify gaps in their understanding and integrate new information with existing schemas. Even brief prompts ("Why did we do that step?") produce measurable gains.

**Metacognitive monitoring:** helping children accurately track their own understanding — by predicting performance, judging difficulty, or noting what they are unsure of — improves learning by directing effort toward genuine gaps (Dunlosky & Rawson, 2012).

### In Our App

- **Give process-level feedback by default**, not just right/wrong. When a child answers correctly, the pet explains *why* the strategy worked. When they answer incorrectly, the pet identifies the specific error step, not just the wrong answer.
- **Build in self-explanation prompts** after every 3–5 problems: "Can you explain to [pet name] why you got that answer?" or "Tell me in your own words: why does this rule work?" Accept any response (typed, spoken if supported, or selected from a menu of explanations) and reward the attempt. This is the most underused high-leverage technique in math app design.
- **Implement a "confidence rating" before each answer** (thumbs up/down, or a simple 1–3 scale). Comparing confidence to accuracy helps children build metacognitive calibration over time. Celebrate accurate self-assessment ("You knew that one would be tricky and you were right — and you got it anyway!").
- **Never show the answer before a full attempt is made,** even for very hard problems. The failed retrieval attempt itself strengthens learning — the "hypercorrection effect" shows that confidently-wrong answers that are then corrected are remembered especially well.
- **Persist feedback in a reviewable form.** After a session, show the child (and optionally a parent) a brief "What we learned and what was tricky" summary — this supports metacognitive awareness and parent involvement.

---

## 9. Attention and Session Design for Ages 8–11

### The Finding

Empirical estimates of sustained focused attention for children in this age band: 7–8 year-olds sustain focused attention for approximately 16–24 minutes; 9–10 year-olds for 20–30 minutes; 11–12 year-olds for 25–35 minutes (these estimates are for appropriately engaging tasks — novel or unengaging tasks reduce these windows substantially). Brain imaging studies show that children aged 8 show markedly greater prefrontal activation than adults when solving novel addition and subtraction problems, indicating that cognitive costs of new learning are proportionally higher for this age group (Peters & De Smedt, 2018). Attention is maintained longer when the task is intrinsically motivating, is appropriately challenging, and involves clear moment-to-moment progress signals.

**Chunking:** information presented in meaningful groups of 3–5 items is processed more reliably than longer strings (Miller, 1956; Cowan, 2001). For skill sequences (multi-step procedures), breaking steps into chunks with explicit labeling ("Step 1 of 3") reduces load and gives children clear progress anchors.

**Pacing and breaks:** the spacing effect applies within sessions too — brief breaks (even 30–60 seconds of non-academic activity) can partially restore attentional resources and improve the next learning segment (Ariga & Lleras, 2011).

### In Our App

- **Cap daily lesson sessions at 15–20 minutes of active problem-solving.** This aligns with attentional capacity for the target age range and with research showing that two 15-minute sessions per week produce noticeable learning improvements. Longer sessions should be broken into discrete modules with a clear stopping point between them.
- **Design sessions in 3–5 minute micro-segments** (a concept introduction, a practice block, a retrieval check), each with a natural narrative beat — a story moment, a mini-celebration, or a transition — that also provides an attentional reset.
- **Build micro-breaks into the experience:** between segments, the pet companion does a 20–30 second story animation or celebration that is low-cognitive-demand. This is not wasted time; it is attentional recovery and reward.
- **Limit multi-step problem sequences to 3–4 steps** with chunked on-screen cues. For longer problems, reveal steps progressively rather than displaying the entire problem at once.
- **Use progress indicators within each segment** ("Question 3 of 5") to provide closure signals that maintain motivation toward a near-term goal — a psychologically important feature for this age group, which has difficulty maintaining motivation toward very distant goals.
- **Allow session interruption and resumption without penalty.** Children in this age range have highly variable available attention; a child who closes the app mid-session should return to exactly where they left off, with the spaced-review queue intact.

---

## Design Principles Checklist

Use this one-page checklist to audit any new lesson, feature, or UI change before shipping.

### Cognitive Load
- [ ] Every new concept is introduced with a fully worked example before any unsupported practice
- [ ] Worked examples fade to partial examples to independent problems as accuracy improves
- [ ] Screen text does not repeat what the pet's narration is already saying (no redundancy)
- [ ] Problem-solving workspace is visually clean; decorative elements are removed during instruction
- [ ] Multi-step problems introduce no more than one new interacting element at a time

### Retrieval and Spacing
- [ ] Every session opens with a retrieval warm-up on prior material
- [ ] A spaced-repetition scheduler controls when past skills reappear (interval doubles on success, resets on failure)
- [ ] Completed lessons are never permanently "done" — they re-enter the review queue
- [ ] Low-stakes review is framed positively; errors trigger explanation, not penalty

### Interleaving
- [ ] After an acquisition block (3–5 problems), new problems are mixed with previously learned types
- [ ] Spaced-review sessions always mix problem types, never presenting only one type consecutively
- [ ] Story quest chapters require applying mixed skills, not a single repeated skill

### Multimedia and Dual Coding
- [ ] New concepts use narrated animation: voice audio + synchronized visual
- [ ] Labels appear directly on diagrams (spatial contiguity), not in a sidebar
- [ ] Animated demonstrations are segmented with learner-controlled "tap to continue"
- [ ] Background music is absent or minimal during instructional screens

### CRA Progression
- [ ] Every abstract concept is introduced via virtual manipulables (concrete) before pictorial and symbolic stages
- [ ] Children can access the concrete/pictorial layer on demand via a hint
- [ ] The pet companion explicitly bridges representations ("these 3 groups of 4 = 3 × 4")

### Productive Struggle and Difficulty
- [ ] Adaptive difficulty targets ~70–80% accuracy per skill
- [ ] Hints are tiered (redirect → partial scaffold → near-complete step) with a delay before first hint
- [ ] The pet companion and story narrative celebrate effort and perseverance, not just correct answers
- [ ] No instant rescue: children must attempt before the hint system engages

### Motivation and Reward
- [ ] Feedback is informational and process-specific, not merely evaluative ("correct! +10 stars")
- [ ] Process praise is used throughout all copy and pet dialogue (effort, strategy, persistence)
- [ ] Children have meaningful choices within lessons (representation type, quest order, pet customization)
- [ ] Story stakes and intrinsic satisfaction are the primary motivational frame; tangible rewards are secondary
- [ ] The pet companion has persistent emotional reactions that create genuine Relatedness

### Feedback and Metacognition
- [ ] Correct answers receive process-level explanation ("this strategy worked because…")
- [ ] Errors receive specific step-level diagnosis, not just "try again"
- [ ] Self-explanation prompts appear regularly ("Why does this step work?")
- [ ] Confidence ratings are collected before answers and tracked for metacognitive calibration
- [ ] A session-end review shows what was learned and what was challenging

### Session Design
- [ ] Active problem-solving sessions are capped at 15–20 minutes
- [ ] Sessions are divided into 3–5 minute micro-segments with low-demand transitions
- [ ] Multi-step problems show no more than 3–4 steps, revealed progressively
- [ ] Each segment includes a progress indicator ("Question 3 of 5")
- [ ] Session interruption is handled gracefully; children resume exactly where they left off

---

## Key Sources

- Sweller, J. (1988). Cognitive load during problem solving: Effects on learning. *Cognitive Science*, 12(2), 257–285.
- Atkinson, R. K., et al. (2000). Learning from examples: Instructional principles from the worked examples research. *Review of Educational Research*, 70(2), 181–214.
- Kalyuga, S., et al. (2003). The expertise reversal effect. *Educational Psychologist*, 38(1), 23–31.
- Roediger, H. L., & Karpicke, J. D. (2006). Test-enhanced learning. *Psychological Science*, 17(3), 249–255.
- Cepeda, N. J., et al. (2006). Distributed practice in verbal recall tasks. *Psychological Bulletin*, 132(3), 354–380.
- Ophuis-Cox, R., et al. (2023). The effect of retrieval practice on multiplication fact fluency. *Applied Cognitive Psychology*.
- Rohrer, D., & Taylor, K. (2007). The shuffling of mathematics problems. *Instructional Science*, 35, 481–498.
- Ziegler, E., & Stern, E. (2016). Consistent advantages of contrasted comparisons. *Learning and Instruction*, 41, 41–51.
- Mayer, R. E. (2009). *Multimedia Learning* (2nd ed.). Cambridge University Press.
- Paivio, A. (1986). *Mental Representations: A Dual Coding Approach*. Oxford University Press.
- Bruner, J. S. (1966). *Toward a Theory of Instruction*. Harvard University Press.
- Witzel, B. S., Riccomini, P. J., & Schneider, E. (2008). Implementing CRA with secondary students. *Intervention in School and Clinic*, 43(5), 270–276.
- Ebner, S., MacDonald, M. K., et al. (2025). A meta-analytic review of the CRA math approach. *Journal of Special Education*.
- Bjork, R. A. (1994). Memory and metamemory considerations in the training of human beings. In J. Metcalfe & A. Shimamura (Eds.), *Metacognition*, 185–205.
- Deci, E. L., Koestner, R., & Ryan, R. M. (1999). A meta-analytic review of experiments examining the effects of extrinsic rewards on intrinsic motivation. *Psychological Bulletin*, 125(6), 627–668.
- Sisk, V. F., et al. (2018). To what extent and under which circumstances are growth mind-sets important to academic achievement? *Psychological Science*, 29(4), 549–571.
- Hattie, J., & Timperley, H. (2007). The power of feedback. *Review of Educational Research*, 77(1), 81–112.
- Chi, M. T. H., et al. (1989). Self-explanations: How students study and use examples. *Cognitive Science*, 13(2), 145–182.
- Rosenshine, B. (2012). Principles of instruction. *American Educator*, Spring 2012.
