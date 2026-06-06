// js/curriculum/grade2.js
// Grade 2 skill curriculum — 12 skills
// Conforms to CONTENT_SCHEMA.md v1 (LOCKED CONTRACT)

export default [

  // ── Numbers & Place Value ───────────────────────────────────────────────────

  {
    id: 'g2-place-value-tens-ones',
    grade: 2,
    strand: 'Numbers & Place Value',
    title: 'Tens and Ones to 100',
    emoji: '🧱',
    blurb: 'See how tens and ones build every number up to 100.',
    prereq: [],

    lesson: {
      hook: 'Imagine you have 34 stickers. Can you sort them into groups of 10?',
      bigIdea: 'Every number is made of tens and ones stacked together.',
      steps: [
        {
          title: 'Group into tens',
          text: '10 ones can be traded for 1 ten. It\'s like bundling 10 straws with a rubber band! 🪄',
          example: { problem: 'Show 34', show: '3 tens + 4 ones = 34' }
        },
        {
          title: 'Read the places',
          text: 'The left digit counts tens, the right digit counts ones. In 52, the 5 means 50 and the 2 means 2.',
          example: { problem: 'Value of 5 in 52?', show: '5 is in the tens place → 50' }
        },
        {
          title: 'Expanded form',
          text: 'Write the number as an addition to show each part.',
          example: { problem: '67 expanded', show: '60 + 7' }
        }
      ],
      visual: { type: 'baseTen', value: 34 },
      tryThis: 'Let\'s build some numbers!'
    },

    practice: {
      type: 'placeValue',
      params: { digits: 3, ask: 'value' },
      count: 5
    },

    cc: {
      code: '2.NBT.A.1',
      domain: 'Number & Operations in Base Ten',
      text: 'Understand that 3 digits of a 3-digit number represent hundreds, tens, and ones.'
    }
  },

  // ── Numbers & Place Value ───────────────────────────────────────────────────

  {
    id: 'g2-place-value-hundreds',
    grade: 2,
    strand: 'Numbers & Place Value',
    title: 'Place Value to 1,000',
    emoji: '🏗️',
    blurb: 'Learn how hundreds, tens, and ones build numbers all the way to 1,000!',
    prereq: ['g2-place-value-tens-ones'],

    lesson: {
      hook: 'If you had 362 crayons, how many boxes of 100 would you fill?',
      bigIdea: '10 tens make one hundred, and 10 hundreds make one thousand.',
      steps: [
        {
          title: 'Meet the hundreds',
          text: '10 tens bundled together make 1 hundred. Stack hundreds, tens, and ones to build any big number! 🧩',
          example: { problem: 'Show 362', show: '3 hundreds + 6 tens + 2 ones = 362' }
        },
        {
          title: 'Find the place value',
          text: 'Each place is worth 10 times the place to its right. In 528, the 5 stands for 500.',
          example: { problem: 'Value of 2 in 528?', show: '2 is in the ones place → 2' }
        },
        {
          title: 'Read and write',
          text: 'You can write numbers in word form too. 362 = three hundred sixty-two.',
          example: { problem: '405 in expanded form', show: '400 + 0 + 5 = 400 + 5' }
        }
      ],
      visual: { type: 'baseTen', value: 362 },
      tryThis: 'Ready to explore big numbers?'
    },

    practice: {
      type: 'placeValue',
      params: { digits: 3, ask: 'expanded' },
      count: 6
    },

    cc: {
      code: '2.NBT.A.1',
      domain: 'Number & Operations in Base Ten',
      text: 'Understand that 3 digits of a 3-digit number represent amounts of hundreds, tens, and ones.'
    }
  },

  // ── Data & Patterns ─────────────────────────────────────────────────────────

  {
    id: 'g2-skip-count',
    grade: 2,
    strand: 'Data & Patterns',
    title: 'Skip Counting by 2s, 5s & 10s',
    emoji: '🐸',
    blurb: 'Jump by 2s, 5s, and 10s to count fast and spot cool patterns!',
    prereq: ['g2-place-value-tens-ones'],

    lesson: {
      hook: 'A frog jumps 5 lily pads at a time. Where does it land after 4 jumps?',
      bigIdea: 'Skip counting means adding the same amount over and over to get a pattern.',
      steps: [
        {
          title: 'Count by 2s',
          text: 'Start at 0 and keep adding 2: 0, 2, 4, 6, 8, 10 … you land on even numbers every time!',
          example: { problem: 'What comes next? 6, 8, ___', show: '6 + 2 = 8, 8 + 2 = 10' }
        },
        {
          title: 'Count by 5s',
          text: 'Add 5 each hop: 5, 10, 15, 20, 25 … the ones digit keeps flipping between 0 and 5.',
          example: { problem: 'What comes next? 15, 20, ___', show: '20 + 5 = 25' }
        },
        {
          title: 'Count by 10s',
          text: 'Only the tens digit changes: 10, 20, 30, 40 … the ones digit stays the same!',
          example: { problem: 'What comes next? 40, 50, ___', show: '50 + 10 = 60' }
        }
      ],
      visual: { type: 'numberLine', min: 0, max: 30, step: 5, mark: 20 },
      tryThis: 'Let\'s hop down the number line!'
    },

    practice: {
      type: 'patterns',
      params: { kind: 'add', maxStep: 10 },
      count: 5
    },

    cc: {
      code: '2.NBT.A.2',
      domain: 'Number & Operations in Base Ten',
      text: 'Count within 1000; skip-count by 5s, 10s, and 100s.'
    }
  },

  // ── Numbers & Place Value ───────────────────────────────────────────────────

  {
    id: 'g2-compare-numbers',
    grade: 2,
    strand: 'Numbers & Place Value',
    title: 'Compare Numbers to 1,000',
    emoji: '⚖️',
    blurb: 'Use >, <, and = to compare three-digit numbers.',
    prereq: ['g2-place-value-hundreds'],

    lesson: {
      hook: 'You have 457 coins and your friend has 462. Who has more?',
      bigIdea: 'Compare digits from left to right — the first different digit decides the winner.',
      steps: [
        {
          title: 'Start with hundreds',
          text: 'Look at the hundreds digit first. If one number has more hundreds, it is larger — done!',
          example: { problem: 'Compare 521 and 389', show: '5 hundreds > 3 hundreds, so 521 > 389' }
        },
        {
          title: 'Move to tens',
          text: 'If hundreds are equal, check the tens digit. The bigger tens digit wins.',
          example: { problem: 'Compare 674 and 681', show: '6 = 6, then 7 < 8, so 674 < 681' }
        },
        {
          title: 'Use the symbols',
          text: '> means "greater than," < means "less than," = means "equal." The open mouth eats the bigger number! 🐊',
          example: { problem: 'Compare 305 and 305', show: '3=3, 0=0, 5=5 → 305 = 305' }
        }
      ],
      visual: { type: 'baseTen', value: 457 },
      tryThis: 'Which number is bigger? You decide!'
    },

    practice: {
      type: 'compare',
      params: { digits: 3 },
      count: 6
    },

    cc: {
      code: '2.NBT.A.4',
      domain: 'Number & Operations in Base Ten',
      text: 'Compare two 3-digit numbers based on place value using >, =, and < symbols.'
    }
  },

  // ── Addition & Subtraction ──────────────────────────────────────────────────

  {
    id: 'g2-add-within-100',
    grade: 2,
    strand: 'Addition & Subtraction',
    title: 'Add Within 100',
    emoji: '➕',
    blurb: 'Add two-digit numbers, sometimes trading 10 ones for a ten.',
    prereq: ['g2-place-value-tens-ones'],

    lesson: {
      hook: 'You collected 34 shells on Monday and 28 more on Tuesday. How many total?',
      bigIdea: 'When ones add up to 10 or more, regroup them into a new ten.',
      steps: [
        {
          title: 'Add the ones first',
          text: 'Line up the ones and add them. If you get 10 or more, carry a ten over to the tens column.',
          example: { problem: '34 + 28', show: '4 ones + 8 ones = 12 ones → write 2, carry 1 ten' }
        },
        {
          title: 'Add the tens',
          text: 'Now add the tens digits plus any ten you carried over.',
          example: { problem: '34 + 28 (tens step)', show: '3 tens + 2 tens + 1 carried = 6 tens → 62' }
        }
      ],
      visual: { type: 'baseTen', value: 62 },
      tryThis: 'Let\'s add some numbers together!'
    },

    practice: {
      type: 'add',
      params: { digits: 2, regroup: true, terms: 2 },
      count: 6
    },

    cc: {
      code: '2.NBT.B.5',
      domain: 'Number & Operations in Base Ten',
      text: 'Fluently add and subtract within 100 using strategies based on place value.'
    }
  },

  // ── Addition & Subtraction ──────────────────────────────────────────────────

  {
    id: 'g2-sub-within-100',
    grade: 2,
    strand: 'Addition & Subtraction',
    title: 'Subtract Within 100',
    emoji: '➖',
    blurb: 'Subtract two-digit numbers, trading a ten for ones when you need to.',
    prereq: ['g2-add-within-100'],

    lesson: {
      hook: 'You have 52 grapes and you eat 27. How many grapes are left?',
      bigIdea: 'When there aren\'t enough ones, unbundle a ten to get 10 more ones.',
      steps: [
        {
          title: 'Check the ones',
          text: 'Try to subtract the ones first. If the top ones digit is smaller, you need to borrow.',
          example: { problem: '52 − 27 (ones)', show: '2 ones < 7 ones, so borrow 1 ten → 12 − 7 = 5' }
        },
        {
          title: 'Subtract the tens',
          text: 'After borrowing, the tens digit is 1 less. Now subtract the tens.',
          example: { problem: '52 − 27 (tens)', show: '4 tens − 2 tens = 2 tens → answer: 25' }
        }
      ],
      visual: { type: 'numberLine', min: 20, max: 55, step: 5, mark: 25 },
      tryThis: 'Ready to subtract? Let\'s go!'
    },

    practice: {
      type: 'sub',
      params: { digits: 2, regroup: true },
      count: 6
    },

    cc: {
      code: '2.NBT.B.5',
      domain: 'Number & Operations in Base Ten',
      text: 'Fluently add and subtract within 100 using strategies based on place value.'
    }
  },

  // ── Addition & Subtraction ──────────────────────────────────────────────────

  {
    id: 'g2-add-within-1000',
    grade: 2,
    strand: 'Addition & Subtraction',
    title: 'Add Within 1,000',
    emoji: '🔢',
    blurb: 'Add three-digit numbers using place value — ones, tens, and hundreds!',
    prereq: ['g2-add-within-100', 'g2-place-value-hundreds'],

    lesson: {
      hook: 'The school library has 245 books and just got 138 new ones. How many books are there now?',
      bigIdea: 'Add column by column — ones, then tens, then hundreds — regrouping when needed.',
      steps: [
        {
          title: 'Add the ones',
          text: 'Start on the right with ones. Regroup into a ten if the sum is 10 or more.',
          example: { problem: '245 + 138 (ones)', show: '5 + 8 = 13 → write 3, carry 1 ten' }
        },
        {
          title: 'Add the tens',
          text: 'Add the tens digits plus any carried ten. Regroup into a hundred if needed.',
          example: { problem: '245 + 138 (tens)', show: '4 + 3 + 1 carried = 8 tens' }
        },
        {
          title: 'Add the hundreds',
          text: 'Finally add the hundreds digits plus any carried hundred.',
          example: { problem: '245 + 138 (hundreds)', show: '2 + 1 = 3 hundreds → answer: 383' }
        }
      ],
      visual: { type: 'baseTen', value: 383 },
      tryThis: 'Big numbers are no problem — let\'s try one!'
    },

    practice: {
      type: 'add',
      params: { digits: 3, regroup: true, terms: 2 },
      count: 6
    },

    cc: {
      code: '2.NBT.B.7',
      domain: 'Number & Operations in Base Ten',
      text: 'Add and subtract within 1000 using place value strategies and understanding of regrouping.'
    }
  },

  // ── Addition & Subtraction ──────────────────────────────────────────────────

  {
    id: 'g2-sub-within-1000',
    grade: 2,
    strand: 'Addition & Subtraction',
    title: 'Subtract Within 1,000',
    emoji: '🔻',
    blurb: 'Subtract three-digit numbers — trade hundreds and tens when you need to!',
    prereq: ['g2-sub-within-100', 'g2-add-within-1000'],

    lesson: {
      hook: 'There are 724 fans at a game and 356 go home early. How many stay?',
      bigIdea: 'Work column by column from right to left, regrouping whenever the top digit is smaller.',
      steps: [
        {
          title: 'Subtract the ones',
          text: 'If top ones < bottom ones, trade 1 ten for 10 ones. Then subtract.',
          example: { problem: '724 − 356 (ones)', show: '4 < 6, borrow → 14 − 6 = 8' }
        },
        {
          title: 'Subtract the tens',
          text: 'The tens digit is 1 less after lending. If still too small, trade a hundred.',
          example: { problem: '724 − 356 (tens)', show: '1 ten < 5 tens, borrow → 11 − 5 = 6 tens' }
        },
        {
          title: 'Subtract the hundreds',
          text: 'Now subtract the hundreds.',
          example: { problem: '724 − 356 (hundreds)', show: '6 hundreds − 3 hundreds = 3 → answer: 368' }
        }
      ],
      visual: { type: 'baseTen', value: 368 },
      tryThis: 'You\'ve got this — let\'s subtract!'
    },

    practice: {
      type: 'sub',
      params: { digits: 3, regroup: true },
      count: 6
    },

    cc: {
      code: '2.NBT.B.7',
      domain: 'Number & Operations in Base Ten',
      text: 'Add and subtract within 1000 using place value strategies and understanding of regrouping.'
    }
  },

  // ── Multiplication ──────────────────────────────────────────────────────────

  {
    id: 'g2-intro-multiplication',
    grade: 2,
    strand: 'Multiplication',
    title: 'Equal Groups & Arrays',
    emoji: '🍪',
    blurb: 'See how equal groups and rows of dots are the beginning of multiplication!',
    prereq: ['g2-add-within-100'],

    lesson: {
      hook: 'You have 3 plates with 4 cookies on each. How many cookies without counting one by one?',
      bigIdea: 'Multiplication is a shortcut for adding the same number over and over.',
      steps: [
        {
          title: 'Make equal groups',
          text: 'Put the same number in each group. 3 groups of 4 means 4 + 4 + 4 = 12. 🍪🍪🍪🍪',
          example: { problem: '3 groups of 4', show: '4 + 4 + 4 = 12' }
        },
        {
          title: 'Use an array',
          text: 'Arrange objects in rows and columns. 3 rows with 4 in each row = 12 total.',
          example: { problem: '3 × 4 array', show: '3 rows × 4 columns = 12 dots' }
        },
        {
          title: 'Write the multiplication',
          text: '3 × 4 = 12 is the short way to write "3 groups of 4 equals 12." ✖️',
          example: { problem: '2 × 5', show: '2 groups of 5 = 5 + 5 = 10' }
        }
      ],
      visual: { type: 'array', a: 3, b: 4 },
      tryThis: 'Let\'s make some groups and multiply!'
    },

    practice: {
      type: 'mult',
      params: { aDigits: 1, bDigits: 1, regroup: false },
      count: 6
    },

    cc: {
      code: '2.OA.C.4',
      domain: 'Operations & Algebraic Thinking',
      text: 'Use addition to find the total number of objects in arrays up to 5 × 5.'
    }
  },

  // ── Money & Time ────────────────────────────────────────────────────────────

  {
    id: 'g2-money',
    grade: 2,
    strand: 'Money & Time',
    title: 'Counting Money',
    emoji: '💰',
    blurb: 'Add coins and dollars to find totals and make change!',
    prereq: ['g2-add-within-100'],

    lesson: {
      hook: 'You buy a snack for 45¢ and pay with 3 quarters. How much change do you get?',
      bigIdea: 'Money uses dollars and cents — count on from the biggest coins first.',
      steps: [
        {
          title: 'Know your coins',
          text: 'Penny = 1¢, nickel = 5¢, dime = 10¢, quarter = 25¢. Bigger coins are worth more! 🪙',
          example: { problem: '2 dimes + 1 nickel', show: '10 + 10 + 5 = 25¢' }
        },
        {
          title: 'Count on from biggest',
          text: 'Start with the biggest coins and count up. 25, 35, 45, 46 — that\'s 1 quarter + 2 dimes + 1 penny.',
          example: { problem: '1 quarter + 1 dime + 3 pennies', show: '25 + 10 + 3 = 38¢' }
        },
        {
          title: 'Make change',
          text: 'Count up from the price to what you paid. The difference is your change.',
          example: { problem: 'Pay 50¢ for a 35¢ eraser', show: '35 + 15 = 50, so change = 15¢' }
        }
      ],
      visual: { type: 'money', cents: 75 },
      tryThis: 'Let\'s count some coins!'
    },

    practice: {
      type: 'money',
      params: { ask: 'add', maxDollars: 5 },
      count: 5
    },

    cc: {
      code: '2.MD.C.8',
      domain: 'Measurement & Data',
      text: 'Solve word problems involving dollar bills, quarters, dimes, nickels, and pennies.'
    }
  },

  // ── Money & Time ────────────────────────────────────────────────────────────

  {
    id: 'g2-time',
    grade: 2,
    strand: 'Money & Time',
    title: 'Telling Time to 5 Minutes',
    emoji: '🕐',
    blurb: 'Read clocks and tell time to the nearest 5 minutes!',
    prereq: ['g2-skip-count'],

    lesson: {
      hook: 'School lunch ends at 12:35. Can you read that on a clock with hands?',
      bigIdea: 'The short hand points to the hour; the long hand tells the minutes.',
      steps: [
        {
          title: 'The two hands',
          text: 'The SHORT hand shows the hour. The LONG hand shows the minutes. Remember: short = hour! ⏰',
          example: { problem: 'Short hand on 3, long hand on 12', show: '3:00 — three o\'clock' }
        },
        {
          title: 'Read the minutes',
          text: 'The long hand points to a number 1–12. Multiply that by 5 to get minutes.',
          example: { problem: 'Long hand on 7', show: '7 × 5 = 35 minutes' }
        },
        {
          title: 'Put it together',
          text: 'Say the hour first, then the minutes. Short hand near 4, long hand on 6 = 4:30.',
          example: { problem: 'Short near 2, long on 9', show: '9 × 5 = 45 minutes → 2:45' }
        }
      ],
      visual: { type: 'clock', h: 2, m: 35 },
      tryThis: 'What time does the clock show? You can do it!'
    },

    practice: {
      type: 'time',
      params: { ask: 'read', minutes: 5 },
      count: 5
    },

    cc: {
      code: '2.MD.C.7',
      domain: 'Measurement & Data',
      text: 'Tell and write time from analog and digital clocks to the nearest five minutes.'
    }
  },

  // ── Fractions ───────────────────────────────────────────────────────────────

  {
    id: 'g2-fractions-halves-fourths',
    grade: 2,
    strand: 'Fractions',
    title: 'Halves, Thirds & Fourths',
    emoji: '🍕',
    blurb: 'Split shapes into equal parts and name each part — halves, thirds, and fourths!',
    prereq: ['g2-compare-numbers'],

    lesson: {
      hook: 'You want to share a pizza equally with 3 friends. How do you cut it?',
      bigIdea: 'A fraction names one or more equal parts of a whole.',
      steps: [
        {
          title: 'Equal parts matter',
          text: 'For a fraction, ALL parts must be the SAME size. Split a pizza into 2 equal slices — each is one half (1/2).',
          example: { problem: 'Fold paper in half', show: '2 equal parts → each part is 1/2' }
        },
        {
          title: 'Thirds and fourths',
          text: 'Cut into 3 equal parts → thirds (1/3 each). Cut into 4 equal parts → fourths (1/4 each).',
          example: { problem: 'Pizza cut into 4 equal slices, you eat 1', show: 'You ate 1/4 of the pizza 🍕' }
        },
        {
          title: 'Bigger denominator, smaller piece',
          text: 'More cuts means smaller pieces. 1/4 is smaller than 1/2 — the bottom number tells how many pieces!',
          example: { problem: 'Compare 1/2 and 1/4', show: '1/2 > 1/4 because halves are bigger pieces' }
        }
      ],
      visual: { type: 'fractionCircle', num: 1, denom: 4 },
      tryThis: 'Ready to split some shapes?'
    },

    practice: {
      type: 'fractionCompare',
      params: { maxDenom: 4 },
      count: 5
    },

    cc: {
      code: '2.G.A.3',
      domain: 'Geometry',
      text: 'Partition circles and rectangles into 2, 3, or 4 equal shares; describe using halves, thirds, fourths.'
    }
  }

];
