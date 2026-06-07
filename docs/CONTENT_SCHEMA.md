# MathQuest — Content Schema (LOCKED CONTRACT v1)

Every curriculum file and content bank MUST conform to this schema exactly.
The engine consumes these objects. Do not invent new top-level fields.

This app is a **self-contained, offline, zero-dependency ES-module PWA**.
Content files are plain ES modules that `export default` a data object/array.
NO external imports, NO network calls, NO frameworks. Pure data + (optional) pure
functions that take a `rng` and return plain objects.

---

## 1. Skill object

A "skill" is the atomic learnable unit. A grade file exports an array of skills.

```js
{
  id: 'g4-mult-2x1',          // unique, kebab, prefixed with grade: g3/g4/g5/g6
  grade: 4,                    // 3 | 4 | 5 | 6
  strand: 'Multiplication',    // one of the canonical strands (see §4)
  title: 'Multiply 2-Digit by 1-Digit',
  emoji: '✖️',                 // single emoji shown on cards
  blurb: 'Break big numbers apart to multiply them easily.', // <= 90 chars, kid friendly
  prereq: ['g3-mult-facts'],   // array of skill ids (may be []), used to order the map

  // TEACHING LESSON — shown before practice. Warm, simple, second-grade reading level.
  lesson: {
    hook: 'Imagine 23 baskets with 4 apples each... how many apples?', // 1 sentence hook
    bigIdea: 'Multiplication is fast adding of equal groups.',          // 1 sentence
    steps: [                     // 2–5 teaching steps, each a small idea
      {
        title: 'Split the big number',
        text: 'Break 23 into 20 and 3. Smaller pieces are easier!', // <= 160 chars
        // OPTIONAL: a worked mini-example shown with the step
        example: { problem: '23 × 4', show: '20 × 4 = 80, then 3 × 4 = 12' }
      }
    ],
    // OPTIONAL visual aid the lesson view should render (see §3 manipulatives)
    visual: { type: 'array', a: 4, b: 6 },
    tryThis: 'Now you try one with me!' // transition line to first practice problem
  },

  // PRACTICE — references an engine problem TYPE (see §2) + difficulty params.
  // The engine generates infinite problems, full step-by-step solutions, and hints.
  practice: {
    type: 'mult',              // MUST be one of the canonical type ids in §2
    params: { aDigits: 2, bDigits: 1, regroup: true }, // type-specific (see §2)
    count: 6                   // problems to clear the skill (default 5 if omitted)
  },

  // OPTIONAL: pin specific real word problems to this skill (ids from wordbank).
  wordProblemTags: ['shopping', 'animals']
}
```

A grade file:
```js
// js/curriculum/grade4.js
export default [ {skill}, {skill}, ... ];
```

---

## 2. Canonical practice TYPES (the engine implements these)

Content may ONLY use these `type` ids. `params` shapes per type:

| type            | params                                                              | grades |
|-----------------|--------------------------------------------------------------------|--------|
| `add`           | `{digits:2..4, regroup:bool, terms:2..3}`                          | 3–5    |
| `sub`           | `{digits:2..4, regroup:bool}`                                      | 3–5    |
| `mult`          | `{aDigits:1..3, bDigits:1..2, regroup:bool}`                       | 3–6    |
| `div`           | `{dividendDigits:2..4, divisor:1..12, remainder:bool}`            | 3–6    |
| `placeValue`    | `{digits:3..7, ask:'value'|'name'|'expanded'}`                    | 3–5    |
| `baseTenBuild`  | `{places:2..4}` · **interactive** (`inputKind:'build'` — tap blocks to build a number) | 2–4 |
| `rounding`      | `{digits:2..6, to:10|100|1000}`                                    | 3–5    |
| `compare`       | `{digits:2..6}`                                                    | 3–4    |
| `fractionCompare`| `{maxDenom:2..12}`                                                | 3–5    |
| `fractionShade` | `{maxDenom:2..8}` · **interactive** (`inputKind:'tap'` — child shades a bar) | 3–4    |
| `equivFraction` | `{maxDenom:2..12}`                                                 | 3–5    |
| `fractionAddSub`| `{maxDenom:2..12, like:bool, op:'+'|'-'|'mix'}`                   | 4–6    |
| `fractionOfNum` | `{maxDenom:2..10, op:'mix'}`                                       | 4–6    |
| `decimalAddSub` | `{places:1..2, op:'+'|'-'|'mix'}`                                 | 4–6    |
| `decimalCompare`| `{places:1..3}`                                                    | 4–6    |
| `rounding`      | (see above)                                                        |        |
| `factors`       | `{max:50, ask:'factors'|'multiples'|'prime'}`                     | 4–6    |
| `patterns`      | `{kind:'add'|'mult', maxStep:10}`                                 | 3–5    |
| `order`         | `{ops:2..3, parens:bool}`                                          | 5–6    |
| `perimeterArea` | `{shape:'rect'|'square', max:20, ask:'perimeter'|'area'|'mix'}`   | 3–5    |
| `volume`        | `{max:10}`                                                         | 5–6    |
| `time`          | `{ask:'elapsed'|'read', minutes:5|1}`                             | 3–4    |
| `money`         | `{ask:'add'|'change', maxDollars:20}`                             | 3–4    |
| `measure`       | `{kind:'length'|'mass'|'capacity', system:'metric'|'us'}`        | 4–6    |
| `ratio`         | `{max:12}`                                                         | 6      |
| `percent`       | `{kind:'ofNumber'|'whole', max:100}`                             | 6      |
| `integers`      | `{op:'+'|'-'|'mix', max:20}`                                     | 6      |
| `mean`          | `{count:3..5, max:20, ask:'mean'|'range'}`                       | 5–6    |
| `wordProblem`   | `{theme:string, skill:typeId}`  (pulls from wordbank)            | 3–6    |

If unsure about a type, prefer the simpler core types (`add,sub,mult,div,placeValue,
rounding,fractionCompare,equivFraction,fractionAddSub`). The engine guarantees these.

---

## 3. Manipulative visual descriptors (lesson.visual)

The UI renders these. Use ONLY these shapes:
- `{type:'numberLine', min, max, step, mark?}`
- `{type:'array', a, b}`                      // a rows × b cols of dots (for ×)
- `{type:'baseTen', value}`                   // hundreds/tens/ones blocks
- `{type:'fractionBar', num, denom}`          // one or [{num,denom},...] to compare
- `{type:'fractionCircle', num, denom}`
- `{type:'groups', groups, perGroup}`         // equal groups for ×/÷
- `{type:'shape', shape:'rect', w, h}`        // for area/perimeter
- `{type:'clock', h, m}`
- `{type:'money', cents}`

---

## 4. Canonical strands (categories shown on the map)

`Numbers & Place Value`, `Addition & Subtraction`, `Multiplication`, `Division`,
`Fractions`, `Decimals`, `Geometry & Measurement`, `Data & Patterns`,
`Money & Time`, `Ratios & Algebra`.

---

## 5. Word problem bank (js/curriculum/wordbank.js)

```js
export default {
  themes: ['animals','space','baking','sports','ocean','dinosaurs','candy','music'],
  problems: [
    {
      id: 'wp-001',
      skill: 'add',          // a canonical type id (§2)
      grade: 3,
      theme: 'animals',
      // template uses {a},{b},{c} placeholders filled by engine with generated numbers,
      // OR provide fixed numbers + answer for a hand-authored problem.
      template: 'A zoo has {a} monkeys and {b} parrots. How many animals in all?',
      vars: { a:[10,40], b:[10,40] },   // ranges; engine picks + computes answer
      answerExpr: 'a + b',              // safe arithmetic over vars (only + - * / and parens)
      // step-by-step explanation lines (use {a},{b},{answer}); engine fills them
      steps: [
        'We want the TOTAL, so we ADD.',
        'Line up: {a} + {b}.',
        'Add to get {answer} animals. 🐒'
      ]
    }
  ]
}
```

Hand-authored problems (fixed) may instead provide `numbers:{a,b}` and `answer:N`.

---

## 6. Badges & rewards (js/curriculum/rewards-data.js)

```js
export default {
  badges: [
    { id:'first-steps', emoji:'🌟', name:'First Steps', desc:'Finish your first lesson',
      trigger:{ kind:'lessonsCompleted', count:1 } }
  ],
  // trigger.kind ∈ 'lessonsCompleted' | 'problemsCorrect' | 'streakDays' |
  //   'skillsMastered' | 'strandMastered'(needs strand) | 'perfectQuiz' |
  //   'coinsEarned' | 'levelReached'
  shop: [
    { id:'hat-wizard', emoji:'🧙', name:'Wizard Hat', cost:50, kind:'accessory' }
    // kind ∈ 'accessory' | 'pet' | 'theme' | 'background'
  ],
  pets: [ { id:'cat', emoji:'🐱', name:'Pixel', cost:0 } ]
}
```

---

## 7. Hard rules
- Reading level: ~2nd grade. Warm, encouraging, never condescending. Emojis welcome.
- Numbers in examples must be ACCURATE — double-check arithmetic in any fixed example.
- No external assets, no network, no imports between content files.
- `export default` only. Keep each file self-contained.
