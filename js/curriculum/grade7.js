// js/curriculum/grade7.js
// Grade 7 — 14 skills in learning order
// Conforms to CONTENT_SCHEMA.md v1 (LOCKED CONTRACT)
//
// TYPE NOTES (concepts without a dedicated engine type):
//   • Proportional relationships / unit-rate scaling → `ratio` (closest; same divide-to-1 mechanic)
//   • Percent change (markup, discount, % increase/decrease) → `percent` kind:'mix'
//   • Multiply/divide fractions → `fractionOfNum` (multiply-by-fraction IS the core mechanic)
//   • Multiply/divide decimals → `decimalAddSub` (engine covers ×/÷ under this type at g6+)
//   • Two-step equations → `order` parens:true (simplify-then-solve mirrors PEMDAS evaluation)
//   • Probability (simple theoretical) → `percent` kind:'ofNumber' (P = favorable/total, expressed as %)
//   • Median → `mean` ask:'range' used for median/range combined (no dedicated 'median' ask exists)
//
// CONCEPTS NEEDING A NEW ENGINE TYPE IN THE FUTURE:
//   • `twoStepEquation` — solve ax + b = c for x (no existing type covers algebraic solving)
//   • `probability`     — theoretical P(event) as fraction/percent, sample space enumeration
//   • `percentChange`   — structured % increase/decrease with direction tracking
//   • `circleGeometry`  — circumference & area of circles (π-based, not rect/square)
//   • `surfaceArea`     — surface area of prisms/pyramids (separate from volume)

export default [

  // ─────────────────────────────────────────────────────────────
  // 1. UNIT RATES & COMPLEX FRACTIONS  (Ratios & Algebra strand)
  //    CCSS 7.RP.A.1 — unit rate associated with a ratio a/b (including fractions)
  // ─────────────────────────────────────────────────────────────
  {
    id: 'g7-unit-rates',
    grade: 7,
    strand: 'Ratios & Algebra',
    title: 'Unit Rates with Fractions',
    emoji: '🏎️',
    blurb: 'Find unit rates even when the quantities are fractions.',
    prereq: ['g6-unit-rates'],

    cc: {
      code: '7.RP.A.1',
      domain: 'Ratios & Proportional Relationships',
      text: 'Compute unit rates associated with ratios of fractions, e.g. ½ mi per ¼ hr = 2 mph.'
    },

    lesson: {
      hook: 'A snail crawls ½ a meter in ¼ of an hour — what is its speed in meters per hour?',
      bigIdea: 'A unit rate is always "per 1." Divide the numerator quantity by the denominator quantity.',
      steps: [
        {
          title: 'Set up the ratio as a fraction',
          text: 'Write: (½ meter) ÷ (¼ hour). This is a complex fraction — a fraction divided by a fraction!',
          example: { problem: '½ ÷ ¼', show: '½ ÷ ¼ = ½ × 4/1 = 4/2 = 2 meters per hour 🐌' }
        },
        {
          title: 'Flip and multiply (KCF)',
          text: 'Keep the first fraction, Change ÷ to ×, Flip the second. Then simplify.',
          example: { problem: '½ ÷ ¼', show: 'Keep ½, Change to ×, Flip ¼ → ½ × 4 = 2' }
        },
        {
          title: 'Label your answer clearly',
          text: 'Always include the unit! "2 meters per hour" not just "2."',
          example: { problem: 'Speed = distance ÷ time', show: '2 m per hour ✅' }
        }
      ],
      visual: { type: 'numberLine', min: 0, max: 4, step: 1 },
      tryThis: 'Ready to find unit rates with fractions? Let\'s go!'
    },

    practice: {
      // `ratio` is the closest existing type; unit-rate problems divide to get a denominator of 1
      type: 'ratio',
      params: { max: 12 },
      count: 6
    },

    wordProblemTags: ['sports', 'animals']
  },

  // ─────────────────────────────────────────────────────────────
  // 2. PROPORTIONAL RELATIONSHIPS  (Ratios & Algebra strand)
  //    CCSS 7.RP.A.2 — identify & represent proportional relationships
  // ─────────────────────────────────────────────────────────────
  {
    id: 'g7-proportions',
    grade: 7,
    strand: 'Ratios & Algebra',
    title: 'Proportional Relationships',
    emoji: '⚖️',
    blurb: 'Use proportions to solve "scales up / scales down" problems.',
    prereq: ['g7-unit-rates'],

    cc: {
      code: '7.RP.A.2',
      domain: 'Ratios & Proportional Relationships',
      text: 'Identify and represent proportional relationships between quantities using tables, graphs, and equations.'
    },

    lesson: {
      hook: 'A recipe uses 3 cups of flour for 12 cookies. How many cups for 40 cookies?',
      bigIdea: 'Two quantities are proportional when their ratio stays constant — you can scale up or down.',
      steps: [
        {
          title: 'Find the constant of proportionality (k)',
          text: 'Divide: k = 12 cookies ÷ 3 cups = 4 cookies per cup. k is always the unit rate.',
          example: { problem: '12 ÷ 3', show: 'k = 4 cookies per cup' }
        },
        {
          title: 'Write the equation y = kx',
          text: 'Cookies = 4 × cups. Plug in 40 cookies: 40 = 4 × cups → cups = 40 ÷ 4 = 10.',
          example: { problem: '40 = 4 × cups', show: 'cups = 40 ÷ 4 = 10 cups 🍪' }
        },
        {
          title: 'Check with cross-multiplication',
          text: 'Set up 3/12 = 10/40. Cross multiply: 3 × 40 = 120 and 12 × 10 = 120. ✓',
          example: { problem: '3/12 = 10/40', show: '3 × 40 = 120 = 12 × 10 ✅' }
        }
      ],
      visual: { type: 'numberLine', min: 0, max: 12, step: 1 },
      tryThis: 'Set up a proportion and solve it!'
    },

    practice: {
      // `ratio` covers equivalent-ratio and scaling problems
      type: 'ratio',
      params: { max: 12 },
      count: 7
    },

    wordProblemTags: ['baking', 'sports']
  },

  // ─────────────────────────────────────────────────────────────
  // 3. PERCENT OF A NUMBER & FINDING THE WHOLE  (Ratios & Algebra)
  //    CCSS 7.RP.A.3 — use proportional relationships to solve percent problems
  // ─────────────────────────────────────────────────────────────
  {
    id: 'g7-percent-problems',
    grade: 7,
    strand: 'Ratios & Algebra',
    title: 'Percent Problems',
    emoji: '💯',
    blurb: 'Find the part, the percent, or the whole in any percent problem.',
    prereq: ['g7-proportions', 'g6-percent-whole'],

    cc: {
      code: '7.RP.A.3',
      domain: 'Ratios & Proportional Relationships',
      text: 'Use proportional relationships to solve multi-step percent problems (tax, tip, discount, interest).'
    },

    lesson: {
      hook: 'A $60 pair of shoes is on sale for 30% off. How much do you actually pay?',
      bigIdea: 'Every percent problem has three parts: the Part, the Percent, and the Whole. Know two → find the third!',
      steps: [
        {
          title: 'Percent of a number (find the Part)',
          text: 'Part = Percent × Whole. Discount = 30% × $60 = 0.30 × 60 = $18.',
          example: { problem: '30% of 60', show: '0.30 × 60 = 18 → save $18 💸' }
        },
        {
          title: 'Sale price = Whole − Discount',
          text: 'You pay $60 − $18 = $42. Or use the shortcut: you pay 70% of $60 = 0.70 × 60 = $42.',
          example: { problem: '$60 − $18', show: '$60 − $18 = $42 ✅' }
        },
        {
          title: 'Find the whole (work backwards)',
          text: 'If $18 is 30% of the price, what is the full price? Whole = Part ÷ Percent = 18 ÷ 0.30 = 60.',
          example: { problem: '18 ÷ 0.30', show: '18 ÷ 0.30 = 60 → original price $60 ✅' }
        }
      ],
      tryThis: 'Pick a percent strategy and solve!'
    },

    practice: {
      type: 'percent',
      params: { kind: 'ofNumber', max: 100 },
      count: 7
    },

    wordProblemTags: ['shopping', 'sports']
  },

  // ─────────────────────────────────────────────────────────────
  // 4. PERCENT CHANGE  (Ratios & Algebra strand)
  //    CCSS 7.RP.A.3 — percent increase and decrease
  // ─────────────────────────────────────────────────────────────
  {
    id: 'g7-percent-change',
    grade: 7,
    strand: 'Ratios & Algebra',
    title: 'Percent Change',
    emoji: '📈',
    blurb: 'Calculate how much something increased or decreased as a percent.',
    prereq: ['g7-percent-problems'],

    cc: {
      code: '7.RP.A.3',
      domain: 'Ratios & Proportional Relationships',
      text: 'Solve percent increase, percent decrease, and percent error problems using the change/original formula.'
    },

    lesson: {
      hook: 'Your lunch cost $8 last year. Now it costs $10. By what percent did the price go up?',
      bigIdea: 'Percent change = (amount of change ÷ original amount) × 100.',
      steps: [
        {
          title: 'Find the amount of change',
          text: 'Subtract: new − original (for increase). $10 − $8 = $2 increase.',
          example: { problem: '$10 − $8', show: 'Change = $2' }
        },
        {
          title: 'Divide by the original',
          text: 'Change ÷ Original = $2 ÷ $8 = 0.25.',
          example: { problem: '2 ÷ 8', show: '0.25' }
        },
        {
          title: 'Multiply by 100 to get percent',
          text: '0.25 × 100 = 25%. The price went up 25%! 📈',
          example: { problem: '0.25 × 100', show: '25% increase ✅' }
        },
        {
          title: 'Percent decrease works the same way',
          text: 'If price dropped from $8 to $6: change = 2, 2 ÷ 8 = 0.25 → 25% decrease.',
          example: { problem: '(8 − 6) ÷ 8', show: '2 ÷ 8 = 0.25 → 25% decrease 📉' }
        }
      ],
      tryThis: 'Calculate a percent change — you\'ve got this!'
    },

    practice: {
      // `percent` kind:'whole' is the closest; percent-change requires finding original
      // A new `percentChange` engine type would be ideal here
      type: 'percent',
      params: { kind: 'whole', max: 100 },
      count: 7
    },

    wordProblemTags: ['shopping', 'sports']
  },

  // ─────────────────────────────────────────────────────────────
  // 5. OPERATIONS WITH INTEGERS  (Numbers & Place Value strand)
  //    CCSS 7.NS.A.1 — add & subtract rational numbers (integers first)
  // ─────────────────────────────────────────────────────────────
  {
    id: 'g7-integers-ops',
    grade: 7,
    strand: 'Numbers & Place Value',
    title: 'Integer Operations',
    emoji: '🌡️',
    blurb: 'Add, subtract, multiply, and divide positive and negative integers.',
    prereq: ['g6-integers'],

    cc: {
      code: '7.NS.A.1',
      domain: 'The Number System',
      text: 'Apply properties of operations to add and subtract rational numbers, including negative integers on a number line.'
    },

    lesson: {
      hook: 'A submarine is at −30 meters. It rises 18 meters. Where is it now?',
      bigIdea: 'Adding moves you right on the number line; subtracting moves you left. Negatives flip the direction!',
      steps: [
        {
          title: 'Same signs → add, keep the sign',
          text: '−12 + (−8): same signs (both negative), add 12 + 8 = 20, keep negative → −20.',
          example: { problem: '−12 + (−8)', show: '12 + 8 = 20 → −20' }
        },
        {
          title: 'Different signs → subtract, keep the bigger sign',
          text: '−30 + 18: different signs. Subtract: 30 − 18 = 12. Bigger number is 30 (negative) → −12.',
          example: { problem: '−30 + 18', show: '30 − 18 = 12 → −12. Submarine is at −12 m. 🚢' }
        },
        {
          title: 'Subtracting = adding the opposite',
          text: '5 − (−9) = 5 + 9 = 14. Always rewrite subtraction as addition of the opposite.',
          example: { problem: '5 − (−9)', show: '5 + 9 = 14' }
        },
        {
          title: 'Multiply/divide: same signs → positive, different signs → negative',
          text: '(−6) × (−5) = 30 (same signs). (−6) × 5 = −30 (different signs).',
          example: { problem: '(−6) × (−5)', show: 'Same signs → positive: 30 ✅' }
        }
      ],
      visual: { type: 'numberLine', min: -30, max: 20, step: 5 },
      tryThis: 'Dive in and try some integer operations!'
    },

    practice: {
      type: 'integers',
      params: { op: 'mix', max: 30 },
      count: 8
    },

    wordProblemTags: ['space', 'ocean']
  },

  // ─────────────────────────────────────────────────────────────
  // 6. ADD & SUBTRACT RATIONAL NUMBERS  (Fractions strand)
  //    CCSS 7.NS.A.1d — apply properties to add/subtract rational numbers
  // ─────────────────────────────────────────────────────────────
  {
    id: 'g7-rational-addsub',
    grade: 7,
    strand: 'Fractions',
    title: 'Add & Subtract Rational Numbers',
    emoji: '➕',
    blurb: 'Add and subtract fractions and mixed numbers, including negatives.',
    prereq: ['g7-integers-ops', 'g6-fraction-addsub'],

    cc: {
      code: '7.NS.A.1',
      domain: 'The Number System',
      text: 'Add and subtract rational numbers (fractions, mixed numbers, negatives) using common denominators.'
    },

    lesson: {
      hook: 'A plant grows 2¾ cm one week, then shrinks ½ cm the next. What is the net change?',
      bigIdea: 'Rational numbers are fractions (including mixed numbers and negatives). Add and subtract them by finding a common denominator.',
      steps: [
        {
          title: 'Convert mixed numbers to improper fractions',
          text: '2¾ = (2 × 4 + 3)/4 = 11/4. This makes adding easier.',
          example: { problem: '2¾', show: '2 × 4 = 8, 8 + 3 = 11 → 11/4' }
        },
        {
          title: 'Find a common denominator',
          text: '11/4 − ½: LCD of 4 and 2 is 4. Rename ½ = 2/4.',
          example: { problem: '11/4 − ½', show: '11/4 − 2/4' }
        },
        {
          title: 'Subtract the numerators',
          text: '11/4 − 2/4 = 9/4 = 2¼ cm. The plant grew a net 2¼ cm. 🌱',
          example: { problem: '11/4 − 2/4', show: '9/4 = 2¼ cm net growth ✅' }
        }
      ],
      visual: { type: 'fractionBar', num: 11, denom: 4 },
      tryThis: 'Add and subtract those fractions!'
    },

    practice: {
      type: 'fractionAddSub',
      params: { maxDenom: 12, like: false, op: 'mix' },
      count: 7
    },

    wordProblemTags: ['baking', 'animals']
  },

  // ─────────────────────────────────────────────────────────────
  // 7. MULTIPLY & DIVIDE FRACTIONS  (Fractions strand)
  //    CCSS 7.NS.A.2a — multiply/divide rational numbers
  // ─────────────────────────────────────────────────────────────
  {
    id: 'g7-fraction-multdiv',
    grade: 7,
    strand: 'Fractions',
    title: 'Multiply & Divide Fractions',
    emoji: '✖️',
    blurb: 'Multiply and divide fractions, mixed numbers, and negatives.',
    prereq: ['g7-rational-addsub', 'g6-fraction-divide'],

    cc: {
      code: '7.NS.A.2',
      domain: 'The Number System',
      text: 'Multiply and divide rational numbers, applying sign rules and converting mixed numbers to improper fractions.'
    },

    lesson: {
      hook: 'You have 2½ kg of trail mix and want to put ⅔ kg into each bag. How many bags?',
      bigIdea: 'Multiply fractions: top × top, bottom × bottom. Divide: flip the second fraction, then multiply.',
      steps: [
        {
          title: 'Convert to improper fractions first',
          text: '2½ ÷ ⅔ → convert: 2½ = 5/2.',
          example: { problem: '2½', show: '2 × 2 + 1 = 5 → 5/2' }
        },
        {
          title: 'Flip the second fraction (reciprocal)',
          text: '5/2 ÷ ⅔ → 5/2 × 3/2. Flip ⅔ to get 3/2.',
          example: { problem: '5/2 ÷ ⅔', show: '5/2 × 3/2 = 15/4' }
        },
        {
          title: 'Multiply and simplify',
          text: '5 × 3 = 15, 2 × 2 = 4. So 15/4 = 3¾ bags. 🎒',
          example: { problem: '15/4', show: '15 ÷ 4 = 3 remainder 3 → 3¾ bags ✅' }
        }
      ],
      visual: { type: 'fractionBar', num: 5, denom: 2 },
      tryThis: 'Flip and multiply your way through these!'
    },

    practice: {
      // `fractionOfNum` covers multiplying by a fraction, which is the core mechanic
      type: 'fractionOfNum',
      params: { maxDenom: 10, op: 'mix' },
      count: 7
    },

    wordProblemTags: ['baking', 'candy']
  },

  // ─────────────────────────────────────────────────────────────
  // 8. MULTIPLY & DIVIDE DECIMALS  (Decimals strand)
  //    CCSS 7.NS.A.2 — multiply/divide rational numbers (decimal form)
  // ─────────────────────────────────────────────────────────────
  {
    id: 'g7-decimal-multdiv',
    grade: 7,
    strand: 'Decimals',
    title: 'Multiply & Divide Decimals',
    emoji: '🔢',
    blurb: 'Multiply and divide decimals and connect them to fractions.',
    prereq: ['g7-fraction-multdiv', 'g6-decimal-addsub'],

    cc: {
      code: '7.NS.A.2',
      domain: 'The Number System',
      text: 'Multiply and divide rational numbers expressed as decimals, applying sign rules and place-value logic.'
    },

    lesson: {
      hook: 'You run 1.25 miles every day. How far will you run in 6.4 days of training?',
      bigIdea: 'Multiply as whole numbers, then count decimal places. Divide by shifting the decimal point.',
      steps: [
        {
          title: 'Multiply: ignore the decimals, then replace',
          text: '1.25 × 6.4 → 125 × 64 = 8000. Count decimals: 2 + 1 = 3 places → 8.000 = 8.0 miles.',
          example: { problem: '1.25 × 6.4', show: '125 × 64 = 8000 → 3 decimal places → 8.000 ✅' }
        },
        {
          title: 'Divide: make the divisor a whole number',
          text: '8.4 ÷ 0.7: multiply both by 10 → 84 ÷ 7 = 12. Much easier!',
          example: { problem: '8.4 ÷ 0.7', show: '× 10 both: 84 ÷ 7 = 12 ✅' }
        },
        {
          title: 'Apply sign rules for negatives',
          text: '(−1.5) × 2.4: multiply 1.5 × 2.4 = 3.6, then apply sign (different signs → negative) → −3.6.',
          example: { problem: '(−1.5) × 2.4', show: '1.5 × 2.4 = 3.6 → −3.6 (diff. signs) 🏃' }
        }
      ],
      tryThis: 'Count those decimal places and solve!'
    },

    practice: {
      // `decimalAddSub` is the closest type; the engine uses it for all decimal operations at g6+
      type: 'decimalAddSub',
      params: { places: 2, op: 'mix' },
      count: 7
    },

    wordProblemTags: ['sports', 'space']
  },

  // ─────────────────────────────────────────────────────────────
  // 9. ORDER OF OPERATIONS & ALGEBRAIC EXPRESSIONS  (Ratios & Algebra)
  //    CCSS 7.EE.A.1 — apply properties of operations to expressions
  // ─────────────────────────────────────────────────────────────
  {
    id: 'g7-expressions',
    grade: 7,
    strand: 'Ratios & Algebra',
    title: 'Algebraic Expressions',
    emoji: '🧮',
    blurb: 'Simplify and evaluate expressions using order of operations and variables.',
    prereq: ['g7-decimal-multdiv', 'g6-order-of-ops'],

    cc: {
      code: '7.EE.A.1',
      domain: 'Expressions & Equations',
      text: 'Apply properties of operations to add, subtract, factor, and expand linear expressions with rational coefficients.'
    },

    lesson: {
      hook: 'If x = −3, what is 4x − 2(x + 5)? Let\'s use the rules to figure it out!',
      bigIdea: 'Simplify expressions step by step: distribute, combine like terms, then evaluate.',
      steps: [
        {
          title: 'Distribute first',
          text: '4x − 2(x + 5): distribute the 2 → 4x − 2x − 10. Multiply each term in the parentheses.',
          example: { problem: '−2(x + 5)', show: '−2 × x + (−2) × 5 = −2x − 10' }
        },
        {
          title: 'Combine like terms',
          text: '4x − 2x − 10 → (4 − 2)x − 10 = 2x − 10.',
          example: { problem: '4x − 2x − 10', show: '2x − 10' }
        },
        {
          title: 'Substitute and evaluate',
          text: 'x = −3: 2(−3) − 10 = −6 − 10 = −16.',
          example: { problem: '2(−3) − 10', show: '−6 − 10 = −16 ✅' }
        }
      ],
      tryThis: 'Distribute, combine, and evaluate!'
    },

    practice: {
      // `order` with parens:true is the closest; covers multi-step evaluation with groupings
      type: 'order',
      params: { ops: 3, parens: true },
      count: 7
    },

    wordProblemTags: ['space', 'sports']
  },

  // ─────────────────────────────────────────────────────────────
  // 10. SOLVING TWO-STEP EQUATIONS  (Ratios & Algebra strand)
  //     CCSS 7.EE.B.4 — solve word problems using linear equations
  // ─────────────────────────────────────────────────────────────
  {
    id: 'g7-two-step-equations',
    grade: 7,
    strand: 'Ratios & Algebra',
    title: 'Two-Step Equations',
    emoji: '🔍',
    blurb: 'Solve equations like 3x + 7 = 19 by undoing operations one step at a time.',
    prereq: ['g7-expressions'],

    cc: {
      code: '7.EE.B.4',
      domain: 'Expressions & Equations',
      text: 'Solve real-world problems by writing and solving equations of the form px + q = r and p(x + q) = r.'
    },

    lesson: {
      hook: 'You buy 3 packs of stickers and a $7 frame. The total is $19. How much is each pack?',
      bigIdea: 'Work backwards: undo the operations in reverse order (subtract first, then divide).',
      steps: [
        {
          title: 'Write the equation',
          text: 'Let x = price of one pack. Equation: 3x + 7 = 19.',
          example: { problem: '3x + 7 = 19', show: 'x = cost of one pack 🎯' }
        },
        {
          title: 'Step 1: subtract from both sides',
          text: 'Undo the +7 by subtracting 7 from both sides: 3x = 19 − 7 = 12.',
          example: { problem: '3x + 7 − 7 = 19 − 7', show: '3x = 12' }
        },
        {
          title: 'Step 2: divide both sides',
          text: 'Undo × 3 by dividing both sides by 3: x = 12 ÷ 3 = 4.',
          example: { problem: '3x ÷ 3 = 12 ÷ 3', show: 'x = 4 → each pack costs $4 ✅' }
        }
      ],
      visual: { type: 'numberLine', min: 0, max: 20, step: 2 },
      tryThis: 'Undo the operations and find x!'
    },

    practice: {
      // NOTE: no `twoStepEquation` type exists yet; `order` with parens:true mimics
      // the multi-step evaluation structure. A new engine type is needed for algebraic solving.
      type: 'order',
      params: { ops: 2, parens: true },
      count: 7
    },

    wordProblemTags: ['shopping', 'sports']
  },

  // ─────────────────────────────────────────────────────────────
  // 11. AREA & CIRCUMFERENCE OF CIRCLES  (Geometry & Measurement)
  //     CCSS 7.G.B.4 — area and circumference of a circle
  // ─────────────────────────────────────────────────────────────
  {
    id: 'g7-circle-geometry',
    grade: 7,
    strand: 'Geometry & Measurement',
    title: 'Circles: Area & Circumference',
    emoji: '⭕',
    blurb: 'Calculate the circumference and area of circles using π ≈ 3.14.',
    prereq: ['g6-area-volume'],

    cc: {
      code: '7.G.B.4',
      domain: 'Geometry',
      text: 'Know the formulas for area and circumference of a circle; give an informal proof of the relationship.'
    },

    lesson: {
      hook: 'A pizza has a radius of 7 inches. How far is it around the crust? How much pizza is there?',
      bigIdea: 'π (pi ≈ 3.14) is the magic ratio: circumference = 2πr, area = πr².',
      steps: [
        {
          title: 'Circumference = 2πr (distance around)',
          text: 'C = 2 × 3.14 × 7 = 43.96 inches. That\'s the crust length! 🍕',
          example: { problem: 'C = 2πr, r = 7', show: '2 × 3.14 × 7 = 43.96 inches' }
        },
        {
          title: 'Area = πr² (flat surface covered)',
          text: 'A = 3.14 × 7² = 3.14 × 49 = 153.86 square inches of pizza.',
          example: { problem: 'A = πr², r = 7', show: '3.14 × 49 = 153.86 in² ✅' }
        },
        {
          title: 'Diameter vs radius',
          text: 'If you know the diameter (d), remember r = d ÷ 2. Also C = πd.',
          example: { problem: 'd = 14 inches', show: 'r = 7, C = π × 14 ≈ 43.96 in ✅' }
        }
      ],
      visual: { type: 'shape', shape: 'rect', w: 7, h: 7 },
      tryThis: 'Grab π and calculate some circles!'
    },

    practice: {
      // `perimeterArea` is the closest existing type (no circle shape param exists yet)
      // A new `circleGeometry` engine type would be ideal
      type: 'perimeterArea',
      params: { shape: 'rect', max: 14, ask: 'mix' },
      count: 6
    },

    wordProblemTags: ['sports', 'baking']
  },

  // ─────────────────────────────────────────────────────────────
  // 12. VOLUME & SURFACE AREA  (Geometry & Measurement strand)
  //     CCSS 7.G.B.6 — volume and surface area of 2-D and 3-D figures
  // ─────────────────────────────────────────────────────────────
  {
    id: 'g7-volume-surface',
    grade: 7,
    strand: 'Geometry & Measurement',
    title: 'Volume & Surface Area',
    emoji: '📦',
    blurb: 'Find the volume and surface area of rectangular prisms and triangular prisms.',
    prereq: ['g7-circle-geometry'],

    cc: {
      code: '7.G.B.6',
      domain: 'Geometry',
      text: 'Solve real-world problems involving area, surface area, and volume of 2-D and 3-D figures.'
    },

    lesson: {
      hook: 'You are wrapping a gift box that is 5 cm × 4 cm × 3 cm. How much wrapping paper do you need?',
      bigIdea: 'Volume fills the inside (l × w × h). Surface area covers the outside (sum of all face areas).',
      steps: [
        {
          title: 'Volume of a rectangular prism',
          text: 'V = l × w × h = 5 × 4 × 3 = 60 cm³. That\'s how much fits inside.',
          example: { problem: 'V = 5 × 4 × 3', show: '5 × 4 = 20, 20 × 3 = 60 cm³ ✅' }
        },
        {
          title: 'Surface area: find each face',
          text: 'A rectangular prism has 3 pairs of faces. Top/bottom: 5×4 = 20 each. Front/back: 5×3 = 15 each. Sides: 4×3 = 12 each.',
          example: { problem: 'SA faces', show: '2(20) + 2(15) + 2(12) = 40 + 30 + 24' }
        },
        {
          title: 'Add up all the faces',
          text: 'SA = 40 + 30 + 24 = 94 cm². You need at least 94 cm² of wrapping paper! 🎁',
          example: { problem: '40 + 30 + 24', show: 'SA = 94 cm² ✅' }
        }
      ],
      visual: { type: 'shape', shape: 'rect', w: 5, h: 4 },
      tryThis: 'Calculate volume and surface area!'
    },

    practice: {
      // `volume` is the closest type; surface area would need a new `surfaceArea` engine type
      type: 'volume',
      params: { max: 10 },
      count: 6
    },

    wordProblemTags: ['space', 'ocean']
  },

  // ─────────────────────────────────────────────────────────────
  // 13. STATISTICS — MEAN, MEDIAN & RANGE  (Data & Patterns strand)
  //     CCSS 7.SP.A.2 — use random sampling to draw inferences
  // ─────────────────────────────────────────────────────────────
  {
    id: 'g7-statistics',
    grade: 7,
    strand: 'Data & Patterns',
    title: 'Mean, Median & Range',
    emoji: '📊',
    blurb: 'Describe a data set using mean, median, and range.',
    prereq: ['g6-mean-range'],

    cc: {
      code: '7.SP.A.2',
      domain: 'Statistics & Probability',
      text: 'Use data from a random sample to draw inferences about a population; gauge how far estimates might vary.'
    },

    lesson: {
      hook: 'Your team\'s scores are 14, 9, 21, 9, and 17. Which "average" best represents your team?',
      bigIdea: 'Mean, median, and range each tell a different story about your data.',
      steps: [
        {
          title: 'Mean = fair share (add ÷ count)',
          text: '14 + 9 + 21 + 9 + 17 = 70. Then 70 ÷ 5 = 14. The mean is 14.',
          example: { problem: '(14+9+21+9+17) ÷ 5', show: '70 ÷ 5 = 14 → mean = 14' }
        },
        {
          title: 'Median = middle value (sort first!)',
          text: 'Sorted: 9, 9, 14, 17, 21. The middle value (3rd of 5) is 14. Median = 14.',
          example: { problem: '9, 9, 14, 17, 21', show: 'Middle is 14 → median = 14' }
        },
        {
          title: 'Range = spread (max − min)',
          text: '21 − 9 = 12. A bigger range means the data is more spread out.',
          example: { problem: '21 − 9', show: 'Range = 12 ✅' }
        }
      ],
      tryThis: 'Sort the data and find all three measures!'
    },

    practice: {
      // `mean` type with ask:'range' covers both mean and spread calculations
      type: 'mean',
      params: { count: 5, max: 30, ask: 'range' },
      count: 6
    },

    wordProblemTags: ['sports', 'animals']
  },

  // ─────────────────────────────────────────────────────────────
  // 14. PROBABILITY  (Data & Patterns strand)
  //     CCSS 7.SP.C.5 — understand probability as a number 0–1
  // ─────────────────────────────────────────────────────────────
  {
    id: 'g7-probability',
    grade: 7,
    strand: 'Data & Patterns',
    title: 'Introduction to Probability',
    emoji: '🎲',
    blurb: 'Find the probability of an event as a fraction, decimal, or percent.',
    prereq: ['g7-statistics', 'g7-percent-problems'],

    cc: {
      code: '7.SP.C.5',
      domain: 'Statistics & Probability',
      text: 'Understand that the probability of a chance event is a number between 0 and 1 representing its likelihood.'
    },

    lesson: {
      hook: 'You spin a spinner with 8 equal sections: 3 red, 2 blue, 3 green. What\'s the chance of red?',
      bigIdea: 'Probability = favorable outcomes ÷ total outcomes. It is always between 0 (impossible) and 1 (certain).',
      steps: [
        {
          title: 'Count favorable outcomes',
          text: 'Red sections = 3. These are the outcomes we WANT.',
          example: { problem: 'Spinner: 3 red out of 8', show: 'Favorable = 3' }
        },
        {
          title: 'Divide by total outcomes',
          text: 'P(red) = 3/8. As a decimal: 3 ÷ 8 = 0.375. As a percent: 37.5%.',
          example: { problem: 'P(red) = 3 ÷ 8', show: '0.375 = 37.5% 🎯' }
        },
        {
          title: 'Complementary probability',
          text: 'P(not red) = 1 − P(red) = 1 − 3/8 = 5/8. The complement always adds to 1!',
          example: { problem: '1 − 3/8', show: '5/8 = P(not red) ✅' }
        },
        {
          title: 'Probability scale check',
          text: '0 = impossible, 0.5 = equally likely, 1 = certain. 3/8 ≈ 0.375 → less than 50/50.',
          example: { problem: '3/8 on the scale', show: '0 ────●────── 1 (closer to 0.5 than to 0)' }
        }
      ],
      visual: { type: 'fractionBar', num: 3, denom: 8 },
      tryThis: 'Calculate some probabilities — what are the chances?'
    },

    practice: {
      // NOTE: no dedicated `probability` engine type exists yet.
      // `percent` kind:'ofNumber' is the closest: P = part/total mirrors percent-of-number.
      // A new `probability` engine type with sample-space enumeration is recommended.
      type: 'percent',
      params: { kind: 'ofNumber', max: 100 },
      count: 7
    },

    wordProblemTags: ['sports', 'candy']
  }

];
