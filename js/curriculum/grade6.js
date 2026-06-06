// js/curriculum/grade6.js
// Grade 6 — 14 skills in learning order
// Conforms to CONTENT_SCHEMA.md v1 (LOCKED CONTRACT)

export default [

  // ─────────────────────────────────────────────────────────────
  // 1. MULTI-DIGIT DIVISION REVIEW  (Division strand — prerequisite)
  // ─────────────────────────────────────────────────────────────
  {
    id: 'g6-div-multidigit',
    grade: 6,
    strand: 'Division',
    title: 'Multi-Digit Division Review',
    emoji: '➗',
    blurb: 'Divide big numbers step by step using long division.',
    prereq: [],

    lesson: {
      hook: 'You have 936 stickers to share equally among 4 friends — how many does each get?',
      bigIdea: 'Long division breaks a big problem into small, manageable steps.',
      steps: [
        {
          title: 'Divide the first digit(s)',
          text: 'Ask: how many times does 4 go into 9? Write 2 on top. 2 × 4 = 8.',
          example: { problem: '936 ÷ 4', show: '4 goes into 9 twice (2 × 4 = 8). Subtract: 9 − 8 = 1.' }
        },
        {
          title: 'Bring down and repeat',
          text: 'Bring down the 3 to make 13. 4 goes into 13 three times (3 × 4 = 12). 13 − 12 = 1.',
          example: { problem: '936 ÷ 4 (cont.)', show: 'Bring down 6 → 16. 16 ÷ 4 = 4. Remainder 0.' }
        },
        {
          title: 'Write the quotient',
          text: 'Read across the top: 234. So 936 ÷ 4 = 234. ✅',
          example: { problem: '936 ÷ 4', show: '936 ÷ 4 = 234' }
        }
      ],
      visual: { type: 'groups', groups: 4, perGroup: 234 },
      tryThis: 'Ready? Let\'s try some division problems!'
    },

    practice: {
      type: 'div',
      params: { dividendDigits: 3, divisor: 6, remainder: false },
      count: 6
    },

    wordProblemTags: ['animals', 'sports']
  },

  // ─────────────────────────────────────────────────────────────
  // 2. DECIMAL MULTIPLY & DIVIDE  (Decimals strand)
  // ─────────────────────────────────────────────────────────────
  {
    id: 'g6-decimal-addsub',
    grade: 6,
    strand: 'Decimals',
    title: 'Multiply & Divide Decimals',
    emoji: '🔢',
    blurb: 'Multiply and divide numbers with decimal points.',
    prereq: ['g6-div-multidigit'],

    lesson: {
      hook: 'A juice bottle holds 1.5 liters. You buy 4 bottles — how many liters total?',
      bigIdea: 'Multiply or divide as whole numbers, then place the decimal point in the answer.',
      steps: [
        {
          title: 'Multiply decimals: ignore the dot first',
          text: 'Treat 1.5 × 4 as 15 × 4 = 60. Then count 1 decimal place → 6.0.',
          example: { problem: '1.5 × 4', show: '15 × 4 = 60 → 1 decimal place → 6.0' }
        },
        {
          title: 'Count decimal places',
          text: 'Total decimal places in the factors = decimal places in the answer.',
          example: { problem: '0.3 × 0.2', show: '3 × 2 = 6 → 2 decimal places → 0.06' }
        },
        {
          title: 'Divide decimals: move the dot',
          text: 'To divide by 0.4, multiply both numbers by 10 first: 2.8 ÷ 0.4 = 28 ÷ 4 = 7.',
          example: { problem: '2.8 ÷ 0.4', show: '× 10 both sides → 28 ÷ 4 = 7' }
        }
      ],
      tryThis: 'Give it a go — you\'ve got this!'
    },

    practice: {
      type: 'decimalAddSub',
      params: { places: 2, op: 'mix' },
      count: 6
    },

    wordProblemTags: ['baking', 'sports']
  },

  // ─────────────────────────────────────────────────────────────
  // 3. DECIMAL COMPARE  (Decimals strand)
  // ─────────────────────────────────────────────────────────────
  {
    id: 'g6-decimal-compare',
    grade: 6,
    strand: 'Decimals',
    title: 'Compare & Order Decimals',
    emoji: '🔍',
    blurb: 'Use <, >, = to compare numbers with decimal points.',
    prereq: ['g6-decimal-addsub'],

    lesson: {
      hook: 'Who ran farther: someone who ran 2.47 km or 2.5 km?',
      bigIdea: 'Line up decimal points and compare digit by digit from left to right.',
      steps: [
        {
          title: 'Line up the decimal points',
          text: 'Write 2.47 and 2.50 one above the other so the dots line up perfectly.',
          example: { problem: '2.47 vs 2.50', show: 'Tenths: 4 vs 5 → 2.50 is bigger' }
        },
        {
          title: 'Add zeros if needed',
          text: 'Write 2.5 as 2.50 to get the same number of places. It does NOT change the value!',
          example: { problem: '2.5 = 2.50?', show: 'Yes! Trailing zeros after the decimal do not change value.' }
        },
        {
          title: 'Compare left to right',
          text: 'Find the first digit that differs. The bigger digit means the bigger number.',
          example: { problem: '2.47 vs 2.50', show: 'Tenths: 4 < 5, so 2.47 < 2.50. Runner #2 went farther! 🏃' }
        }
      ],
      visual: { type: 'numberLine', min: 2, max: 3, step: 0.1 },
      tryThis: 'Try comparing some decimals now!'
    },

    practice: {
      type: 'decimalCompare',
      params: { places: 2 },
      count: 5
    },

    wordProblemTags: ['sports', 'ocean']
  },

  // ─────────────────────────────────────────────────────────────
  // 4. INTEGERS — ADD & SUBTRACT  (Numbers & Place Value strand)
  // ─────────────────────────────────────────────────────────────
  {
    id: 'g6-integers',
    grade: 6,
    strand: 'Numbers & Place Value',
    title: 'Integers: Add & Subtract',
    emoji: '🌡️',
    blurb: 'Add and subtract positive and negative whole numbers.',
    prereq: [],

    lesson: {
      hook: 'It\'s −3°C outside. The temperature drops 5 more degrees. How cold is it now?',
      bigIdea: 'Negative numbers go below zero — a number line helps you see the moves.',
      steps: [
        {
          title: 'Understand negative numbers',
          text: 'Numbers below zero have a − sign. −3 is 3 steps LEFT of zero on the number line.',
          example: { problem: 'Where is −3?', show: '…−4, −3, −2, −1, 0, 1, 2… → 3 steps left of 0' }
        },
        {
          title: 'Adding a negative = moving left',
          text: 'To add −5, jump 5 steps LEFT. −3 + (−5): start at −3, go left 5 → land on −8.',
          example: { problem: '−3 + (−5)', show: 'Start −3, move left 5 → −8' }
        },
        {
          title: 'Subtracting a negative = moving right',
          text: 'Subtracting a negative ADDS! 2 − (−3) = 2 + 3 = 5. The two minuses cancel.',
          example: { problem: '2 − (−3)', show: '2 + 3 = 5' }
        },
        {
          title: 'Different signs: subtract and keep the bigger sign',
          text: '−8 + 3: subtract 8 − 3 = 5, keep the sign of the bigger absolute value → −5.',
          example: { problem: '−8 + 3', show: '8 − 3 = 5, bigger number is 8 (negative) → −5' }
        }
      ],
      visual: { type: 'numberLine', min: -10, max: 10, step: 1 },
      tryThis: 'Jump on the number line and try some integer problems!'
    },

    practice: {
      type: 'integers',
      params: { op: 'mix', max: 15 },
      count: 8
    },

    wordProblemTags: ['space', 'ocean']
  },

  // ─────────────────────────────────────────────────────────────
  // 5. FRACTIONS — FRACTION OF A NUMBER  (Fractions strand)
  // ─────────────────────────────────────────────────────────────
  {
    id: 'g6-fraction-of-num',
    grade: 6,
    strand: 'Fractions',
    title: 'Fraction of a Number',
    emoji: '🍕',
    blurb: 'Find a fraction of a whole number, like ¾ of 20.',
    prereq: ['g6-div-multidigit'],

    lesson: {
      hook: 'There are 24 students and ¾ of them like pizza — how many students is that?',
      bigIdea: 'To find a fraction of a number: DIVIDE by the bottom, MULTIPLY by the top.',
      steps: [
        {
          title: 'Divide by the denominator',
          text: 'The denominator (bottom) splits the whole into equal parts. 24 ÷ 4 = 6.',
          example: { problem: '¾ of 24', show: '24 ÷ 4 = 6 (one-fourth of 24 is 6)' }
        },
        {
          title: 'Multiply by the numerator',
          text: 'The numerator (top) tells how many parts you want. 6 × 3 = 18.',
          example: { problem: '¾ of 24', show: '6 × 3 = 18. So ¾ of 24 = 18 🍕' }
        },
        {
          title: 'Check with multiplication',
          text: 'You can also write it as 3/4 × 24 = 72/4 = 18. Same answer!',
          example: { problem: '3/4 × 24', show: '(3 × 24) ÷ 4 = 72 ÷ 4 = 18 ✅' }
        }
      ],
      visual: { type: 'fractionBar', num: 3, denom: 4 },
      tryThis: 'Try finding fractions of different numbers!'
    },

    practice: {
      type: 'fractionOfNum',
      params: { maxDenom: 8, op: 'mix' },
      count: 6
    },

    wordProblemTags: ['baking', 'animals']
  },

  // ─────────────────────────────────────────────────────────────
  // 6. FRACTIONS — ADD & SUBTRACT (UNLIKE)  (Fractions strand)
  // ─────────────────────────────────────────────────────────────
  {
    id: 'g6-fraction-addsub',
    grade: 6,
    strand: 'Fractions',
    title: 'Add & Subtract Fractions',
    emoji: '➕',
    blurb: 'Add and subtract fractions with different denominators.',
    prereq: ['g6-fraction-of-num'],

    lesson: {
      hook: 'You eat ½ a pizza and your friend eats ⅓. How much pizza is gone?',
      bigIdea: 'Fractions must share the same denominator before you can add or subtract them.',
      steps: [
        {
          title: 'Find a common denominator',
          text: 'Look for the smallest number both denominators divide into. For 2 and 3, that\'s 6.',
          example: { problem: '½ + ⅓', show: 'LCD of 2 and 3 is 6' }
        },
        {
          title: 'Rename each fraction',
          text: '½ = 3/6 (multiply top and bottom by 3). ⅓ = 2/6 (multiply by 2).',
          example: { problem: '½ + ⅓', show: '3/6 + 2/6' }
        },
        {
          title: 'Add or subtract the numerators',
          text: 'Add the tops: 3 + 2 = 5. Keep the denominator: 5/6. Simplify if needed.',
          example: { problem: '3/6 + 2/6', show: '5/6 of the pizza is eaten! 🍕' }
        }
      ],
      visual: [{ type: 'fractionBar', num: 3, denom: 6 }, { type: 'fractionBar', num: 2, denom: 6 }],
      tryThis: 'Now add some fractions yourself!'
    },

    practice: {
      type: 'fractionAddSub',
      params: { maxDenom: 10, like: false, op: 'mix' },
      count: 6
    },

    wordProblemTags: ['baking', 'candy']
  },

  // ─────────────────────────────────────────────────────────────
  // 7. FRACTIONS — DIVIDE  (Fractions strand)
  // ─────────────────────────────────────────────────────────────
  {
    id: 'g6-fraction-divide',
    grade: 6,
    strand: 'Fractions',
    title: 'Divide Fractions',
    emoji: '🔪',
    blurb: 'Divide fractions using the "flip and multiply" trick.',
    prereq: ['g6-fraction-addsub'],

    lesson: {
      hook: 'You have ¾ of a pizza and want to make portions that are ⅛ each — how many portions?',
      bigIdea: 'Dividing by a fraction is the same as multiplying by its reciprocal (flip it!).',
      steps: [
        {
          title: 'Find the reciprocal',
          text: 'Flip the second fraction upside down. The reciprocal of ⅛ is 8/1 = 8.',
          example: { problem: 'reciprocal of ⅛', show: 'Flip: 1/8 → 8/1 = 8' }
        },
        {
          title: 'Change ÷ to × and multiply',
          text: 'Write ¾ × 8/1. Multiply tops: 3 × 8 = 24. Multiply bottoms: 4 × 1 = 4.',
          example: { problem: '¾ ÷ ⅛', show: '¾ × 8/1 = 24/4 = 6 portions 🎉' }
        },
        {
          title: 'Simplify the result',
          text: '24/4 = 6. You can make 6 portions. Always simplify your answer!',
          example: { problem: '24/4', show: '24 ÷ 4 = 6 ✅' }
        }
      ],
      visual: { type: 'fractionBar', num: 3, denom: 4 },
      tryThis: 'Flip and multiply — give it a try!'
    },

    practice: {
      type: 'fractionOfNum',
      params: { maxDenom: 8, op: 'mix' },
      count: 6
    },

    wordProblemTags: ['baking', 'candy']
  },

  // ─────────────────────────────────────────────────────────────
  // 8. RATIOS  (Ratios & Algebra strand)
  // ─────────────────────────────────────────────────────────────
  {
    id: 'g6-ratios',
    grade: 6,
    strand: 'Ratios & Algebra',
    title: 'Understanding Ratios',
    emoji: '⚖️',
    blurb: 'Compare two quantities with a ratio like 3:5.',
    prereq: ['g6-fraction-of-num'],

    lesson: {
      hook: 'In a bag there are 3 red marbles and 5 blue ones — what is the ratio of red to blue?',
      bigIdea: 'A ratio compares two amounts. You can write it as 3:5, 3 to 5, or 3/5.',
      steps: [
        {
          title: 'Write the ratio',
          text: 'Put the first quantity first. Red to Blue = 3:5. Order matters!',
          example: { problem: '3 red, 5 blue', show: 'Red : Blue = 3 : 5' }
        },
        {
          title: 'Equivalent ratios',
          text: 'Multiply or divide both parts by the same number. 3:5 = 6:10 = 9:15.',
          example: { problem: '3:5 × 2', show: '6:10 — same relationship, bigger numbers' }
        },
        {
          title: 'Simplify a ratio',
          text: 'Divide both parts by their GCF. 12:8 → GCF is 4 → 3:2.',
          example: { problem: '12:8', show: '12 ÷ 4 = 3, 8 ÷ 4 = 2 → 3:2 ✅' }
        }
      ],
      visual: { type: 'array', a: 3, b: 5 },
      tryThis: 'Let\'s work with some ratios!'
    },

    practice: {
      type: 'ratio',
      params: { max: 12 },
      count: 6
    },

    wordProblemTags: ['sports', 'animals']
  },

  // ─────────────────────────────────────────────────────────────
  // 9. UNIT RATES  (Ratios & Algebra strand)
  // ─────────────────────────────────────────────────────────────
  {
    id: 'g6-unit-rates',
    grade: 6,
    strand: 'Ratios & Algebra',
    title: 'Unit Rates',
    emoji: '🚗',
    blurb: 'Find the rate for exactly ONE unit, like miles per hour.',
    prereq: ['g6-ratios'],

    lesson: {
      hook: 'A car travels 150 miles in 3 hours — how far does it go each hour?',
      bigIdea: 'A unit rate tells you the amount for exactly 1 of something.',
      steps: [
        {
          title: 'Set up the ratio',
          text: 'Write miles over hours: 150 miles / 3 hours.',
          example: { problem: '150 miles in 3 hours', show: '150/3 miles per hour' }
        },
        {
          title: 'Divide to get 1 in the denominator',
          text: 'Divide both parts by 3: 150 ÷ 3 = 50 miles, 3 ÷ 3 = 1 hour.',
          example: { problem: '150/3', show: '50/1 = 50 miles per hour 🚗' }
        },
        {
          title: 'Use the unit rate to scale',
          text: 'At 50 mph, in 5 hours the car travels 50 × 5 = 250 miles.',
          example: { problem: '50 mph × 5 h', show: '50 × 5 = 250 miles' }
        }
      ],
      tryThis: 'Find some unit rates now!'
    },

    practice: {
      type: 'ratio',
      params: { max: 12 },
      count: 6
    },

    wordProblemTags: ['sports', 'animals']
  },

  // ─────────────────────────────────────────────────────────────
  // 10. PERCENT OF A NUMBER  (Ratios & Algebra strand)
  // ─────────────────────────────────────────────────────────────
  {
    id: 'g6-percent-of-number',
    grade: 6,
    strand: 'Ratios & Algebra',
    title: 'Percent of a Number',
    emoji: '%️',
    blurb: 'Calculate a percentage of any number, like 25% of 80.',
    prereq: ['g6-ratios'],

    lesson: {
      hook: 'A store gives 25% off a $80 jacket — how much do you save?',
      bigIdea: 'Percent means "out of 100." Change it to a decimal or fraction, then multiply.',
      steps: [
        {
          title: 'Convert percent to a decimal',
          text: 'Move the decimal point two places LEFT. 25% becomes 0.25.',
          example: { problem: '25%', show: '25% → 0.25 (divide by 100)' }
        },
        {
          title: 'Multiply by the whole number',
          text: '0.25 × 80 = 20. You save $20!',
          example: { problem: '25% of 80', show: '0.25 × 80 = 20 💰' }
        },
        {
          title: 'Use the fraction shortcut',
          text: '25% = 1/4. Find 1/4 of 80: 80 ÷ 4 = 20. Same answer, faster! ⚡',
          example: { problem: '25% = ¼ of 80', show: '80 ÷ 4 = 20 ✅' }
        }
      ],
      tryThis: 'Try finding some percents!'
    },

    practice: {
      type: 'percent',
      params: { kind: 'ofNumber', max: 100 },
      count: 6
    },

    wordProblemTags: ['shopping', 'sports']
  },

  // ─────────────────────────────────────────────────────────────
  // 11. FINDING THE WHOLE FROM A PERCENT  (Ratios & Algebra strand)
  // ─────────────────────────────────────────────────────────────
  {
    id: 'g6-percent-whole',
    grade: 6,
    strand: 'Ratios & Algebra',
    title: 'Finding the Whole',
    emoji: '🔎',
    blurb: 'Work backwards — find the original number when you know a percent.',
    prereq: ['g6-percent-of-number'],

    lesson: {
      hook: '30 students brought lunch — that\'s 60% of the class. How many students are in the class?',
      bigIdea: 'If a PART and its PERCENT are known, divide to find the whole.',
      steps: [
        {
          title: 'Set up the equation',
          text: 'Part = Percent × Whole. We know Part = 30 and Percent = 60% = 0.60.',
          example: { problem: '30 = 0.60 × Whole', show: 'Whole = 30 ÷ 0.60' }
        },
        {
          title: 'Divide to find the whole',
          text: '30 ÷ 0.60 = 50. There are 50 students in the class. 🏫',
          example: { problem: '30 ÷ 0.60', show: '30 ÷ 0.6 = 50 ✅' }
        },
        {
          title: 'Check your answer',
          text: 'Verify: 60% of 50 = 0.60 × 50 = 30. ✓ It matches!',
          example: { problem: 'Check: 60% × 50', show: '0.60 × 50 = 30 ✓' }
        }
      ],
      tryThis: 'Now find some missing wholes!'
    },

    practice: {
      type: 'percent',
      params: { kind: 'whole', max: 100 },
      count: 6
    },

    wordProblemTags: ['sports', 'animals']
  },

  // ─────────────────────────────────────────────────────────────
  // 12. ORDER OF OPERATIONS / SIMPLE EXPRESSIONS  (Ratios & Algebra strand)
  // ─────────────────────────────────────────────────────────────
  {
    id: 'g6-order-of-ops',
    grade: 6,
    strand: 'Ratios & Algebra',
    title: 'Order of Operations',
    emoji: '🧮',
    blurb: 'Solve expressions correctly using PEMDAS rules.',
    prereq: ['g6-integers'],

    lesson: {
      hook: 'Does 2 + 3 × 4 equal 20 or 14? The answer depends on the ORDER you do things!',
      bigIdea: 'PEMDAS: Parentheses → Exponents → Multiply/Divide → Add/Subtract (left to right).',
      steps: [
        {
          title: 'Parentheses first',
          text: 'Always solve what\'s inside parentheses first, before anything else.',
          example: { problem: '(2 + 3) × 4', show: 'Parentheses first: 5 × 4 = 20' }
        },
        {
          title: 'Multiply and divide before adding and subtracting',
          text: '2 + 3 × 4: do the multiplication first → 2 + 12 = 14.',
          example: { problem: '2 + 3 × 4', show: '3 × 4 = 12 first, then 2 + 12 = 14' }
        },
        {
          title: 'Left to right for equal priority',
          text: 'When two operations have the same level, go left to right. 10 − 3 + 2: 7 + 2 = 9.',
          example: { problem: '10 − 3 + 2', show: '(10 − 3) + 2 = 7 + 2 = 9' }
        }
      ],
      tryThis: 'Remember PEMDAS and try these expressions!'
    },

    practice: {
      type: 'order',
      params: { ops: 3, parens: true },
      count: 6
    },

    wordProblemTags: ['space', 'sports']
  },

  // ─────────────────────────────────────────────────────────────
  // 13. MEAN & RANGE  (Data & Patterns strand)
  // ─────────────────────────────────────────────────────────────
  {
    id: 'g6-mean-range',
    grade: 6,
    strand: 'Data & Patterns',
    title: 'Mean & Range',
    emoji: '📊',
    blurb: 'Find the average (mean) and the spread (range) of a data set.',
    prereq: ['g6-div-multidigit'],

    lesson: {
      hook: 'Your quiz scores this week are 8, 10, 6, and 8. What\'s your average score?',
      bigIdea: 'The mean is the fair share — spread the total evenly. The range shows how spread out the data is.',
      steps: [
        {
          title: 'Find the mean: add all values',
          text: 'Add up all the numbers in the data set: 8 + 10 + 6 + 8 = 32.',
          example: { problem: 'Mean of 8, 10, 6, 8', show: '8 + 10 + 6 + 8 = 32' }
        },
        {
          title: 'Divide by the count',
          text: 'There are 4 scores. Divide: 32 ÷ 4 = 8. The mean score is 8. 🎯',
          example: { problem: '32 ÷ 4', show: '32 ÷ 4 = 8 → mean = 8' }
        },
        {
          title: 'Find the range',
          text: 'Range = largest − smallest. Largest is 10, smallest is 6. 10 − 6 = 4.',
          example: { problem: 'Range of 8, 10, 6, 8', show: '10 − 6 = 4 → range = 4' }
        }
      ],
      tryThis: 'Let\'s crunch some data!'
    },

    practice: {
      type: 'mean',
      params: { count: 4, max: 20, ask: 'mean' },
      count: 6
    },

    wordProblemTags: ['sports', 'animals']
  },

  // ─────────────────────────────────────────────────────────────
  // 14. AREA & VOLUME  (Geometry & Measurement strand)
  // ─────────────────────────────────────────────────────────────
  {
    id: 'g6-area-volume',
    grade: 6,
    strand: 'Geometry & Measurement',
    title: 'Area & Volume',
    emoji: '📐',
    blurb: 'Calculate area of rectangles and volume of rectangular prisms.',
    prereq: ['g6-mean-range', 'g6-order-of-ops'],

    lesson: {
      hook: 'You want to fill a fish tank that is 5 cm long, 4 cm wide, and 3 cm tall. How much water fits?',
      bigIdea: 'Area covers a flat surface (length × width). Volume fills a 3-D box (length × width × height).',
      steps: [
        {
          title: 'Area of a rectangle',
          text: 'Multiply length × width. A 7 m × 4 m room has area 28 m². ▭',
          example: { problem: 'Area: 7 m × 4 m', show: '7 × 4 = 28 m²' }
        },
        {
          title: 'Volume of a rectangular prism',
          text: 'Multiply length × width × height. The tank: 5 × 4 × 3 = 60 cm³.',
          example: { problem: 'Volume: 5 × 4 × 3', show: '5 × 4 = 20, then 20 × 3 = 60 cm³ 🐟' }
        },
        {
          title: 'Units matter!',
          text: 'Area uses square units (m², cm²). Volume uses cubic units (m³, cm³).',
          example: { problem: 'Units check', show: 'Area → units², Volume → units³ ✅' }
        }
      ],
      visual: { type: 'shape', shape: 'rect', w: 7, h: 4 },
      tryThis: 'Measure up — try some area and volume problems!'
    },

    practice: {
      type: 'volume',
      params: { max: 10 },
      count: 6
    },

    wordProblemTags: ['space', 'ocean']
  }

];
