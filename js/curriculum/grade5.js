// js/curriculum/grade5.js
// Grade 5 curriculum — 16 skills in learning order
// Conforms to CONTENT_SCHEMA.md v1

export default [

  // ─────────────────────────────────────────────
  // STRAND: Numbers & Place Value
  // ─────────────────────────────────────────────

  {
    id: 'g5-powers-of-10',
    grade: 5,
    strand: 'Numbers & Place Value',
    title: 'Powers of 10',
    emoji: '🔟',
    blurb: 'Discover how multiplying by 10 over and over creates huge numbers fast!',
    prereq: [],

    lesson: {
      hook: 'What if every step you took was 10 times bigger than the last? Where would you end up?',
      bigIdea: 'A power of 10 means we multiply 10 by itself a certain number of times.',
      steps: [
        {
          title: 'Start with one 10',
          text: '10¹ just means one 10. That\'s 10.',
          example: { problem: '10¹', show: '10' }
        },
        {
          title: 'Multiply again to get 10²',
          text: '10² means 10 × 10. Count the zeros — there are 2!',
          example: { problem: '10²', show: '10 × 10 = 100' }
        },
        {
          title: 'One more time for 10³',
          text: '10³ means 10 × 10 × 10. The exponent tells you how many zeros to write.',
          example: { problem: '10³', show: '10 × 10 × 10 = 1,000' }
        },
        {
          title: 'The shortcut',
          text: 'The exponent = the number of zeros in the answer. So 10⁴ = 10,000.',
          example: { problem: '10⁴', show: '1 followed by 4 zeros = 10,000' }
        }
      ],
      visual: { type: 'baseTen', value: 1000 },
      tryThis: 'Ready to try some powers of 10 yourself? Let\'s go!'
    },

    practice: {
      type: 'placeValue',
      params: { digits: 5, ask: 'value' },
      count: 5
    }
  },

  {
    id: 'g5-decimal-place-value',
    grade: 5,
    strand: 'Numbers & Place Value',
    title: 'Decimal Place Value to Thousandths',
    emoji: '🔍',
    blurb: 'Every digit after the decimal point has its own special place name.',
    prereq: ['g5-powers-of-10'],

    lesson: {
      hook: 'A bottle of water costs $1.259 — what does each digit after the dot mean?',
      bigIdea: 'Decimal places go tenths, hundredths, thousandths — each 10 times smaller.',
      steps: [
        {
          title: 'Tenths are split into 10 equal pieces',
          text: 'The first place after the dot is TENTHS. In 3.4, the 4 is in the tenths place.',
          example: { problem: '3.4', show: '3 ones and 4 tenths' }
        },
        {
          title: 'Hundredths are even smaller',
          text: 'The second place is HUNDREDTHS. In 3.46, the 6 is in the hundredths place.',
          example: { problem: '3.46', show: '3 ones, 4 tenths, 6 hundredths' }
        },
        {
          title: 'Thousandths are the tiniest',
          text: 'The third decimal place is THOUSANDTHS. In 3.456, the last 6 is in the thousandths place.',
          example: { problem: '3.456', show: '3 ones, 4 tenths, 5 hundredths, 6 thousandths' }
        }
      ],
      visual: { type: 'numberLine', min: 0, max: 1, step: 0.1 },
      tryThis: 'Now tell me the value of each digit!'
    },

    practice: {
      type: 'placeValue',
      params: { digits: 6, ask: 'name' },
      count: 6
    }
  },

  {
    id: 'g5-rounding-decimals',
    grade: 5,
    strand: 'Numbers & Place Value',
    title: 'Rounding Decimals',
    emoji: '🎯',
    blurb: 'Round decimals to the nearest whole, tenth, or hundredth.',
    prereq: ['g5-decimal-place-value'],

    lesson: {
      hook: 'You spend $4.78 — about how many dollars is that? Rounding helps you estimate fast!',
      bigIdea: 'Look at the digit to the RIGHT of where you\'re rounding to decide up or down.',
      steps: [
        {
          title: 'Find the rounding place',
          text: 'Decide if you\'re rounding to ones, tenths, or hundredths. Underline that digit.',
          example: { problem: 'Round 3.456 to the nearest tenth', show: 'Underline the 4 (tenths place)' }
        },
        {
          title: 'Look one place to the right',
          text: 'Check the digit just to the right. If it\'s 5 or more, round up. If less, round down.',
          example: { problem: '3.4 | 56 …', show: 'The digit after the 4 is 5, so round UP' }
        },
        {
          title: 'Write the rounded answer',
          text: 'Drop all the digits after the rounding place. So 3.456 rounded to the nearest tenth is 3.5.',
          example: { problem: '3.456 → nearest tenth', show: '3.5' }
        }
      ],
      visual: { type: 'numberLine', min: 3, max: 4, step: 0.1, mark: 3.456 },
      tryThis: 'Let\'s practice rounding together!'
    },

    practice: {
      type: 'rounding',
      params: { digits: 4, to: 100 },
      count: 6
    }
  },

  {
    id: 'g5-decimal-compare',
    grade: 5,
    strand: 'Numbers & Place Value',
    title: 'Compare & Order Decimals',
    emoji: '⚖️',
    blurb: 'Line up the decimal points and compare place by place to order decimals.',
    prereq: ['g5-decimal-place-value'],

    lesson: {
      hook: 'Who ran faster — someone who ran 0.4 km or someone who ran 0.35 km?',
      bigIdea: 'Compare decimals digit by digit from left to right, starting at the tenths place.',
      steps: [
        {
          title: 'Line up the decimal points',
          text: 'Always line up the decimal points first. This keeps the same place values in the same column.',
          example: { problem: '0.4 vs 0.35', show: '  0.40\n− 0.35\n(add a zero to make same length)' }
        },
        {
          title: 'Compare tenths first',
          text: 'Look at the tenths digit. 0.4 has 4 tenths. 0.35 has 3 tenths. 4 > 3, so 0.4 is bigger!',
          example: { problem: '0.40 vs 0.35', show: '4 tenths > 3 tenths, so 0.4 > 0.35' }
        },
        {
          title: 'Use <, >, or =',
          text: 'Once you know which is bigger, write the symbol. The open end faces the bigger number.',
          example: { problem: '0.4 ○ 0.35', show: '0.4 > 0.35' }
        }
      ],
      visual: { type: 'numberLine', min: 0, max: 1, step: 0.1 },
      tryThis: 'Your turn — which decimal is bigger?'
    },

    practice: {
      type: 'decimalCompare',
      params: { places: 3 },
      count: 6
    }
  },

  // ─────────────────────────────────────────────
  // STRAND: Multiplication
  // ─────────────────────────────────────────────

  {
    id: 'g5-mult-3x2',
    grade: 5,
    strand: 'Multiplication',
    title: 'Multiply 3-Digit × 2-Digit',
    emoji: '✖️',
    blurb: 'Use the standard algorithm to multiply any big numbers together.',
    prereq: ['g5-decimal-place-value'],

    lesson: {
      hook: 'A school orders 124 boxes of crayons, each with 23 crayons. How many crayons is that?',
      bigIdea: 'Break the 2-digit number into ones and tens, multiply each part, then add.',
      steps: [
        {
          title: 'Multiply by the ones digit first',
          text: 'Multiply 124 × 3 (the ones digit of 23). Write that product on the first row.',
          example: { problem: '124 × 3', show: '124 × 3 = 372' }
        },
        {
          title: 'Multiply by the tens digit next',
          text: 'Multiply 124 × 20 (the tens digit times 10). Write a 0 placeholder, then multiply 124 × 2.',
          example: { problem: '124 × 20', show: '124 × 2 = 248, so 124 × 20 = 2,480' }
        },
        {
          title: 'Add the two partial products',
          text: 'Add 372 + 2,480 to get the final answer.',
          example: { problem: '372 + 2,480', show: '372 + 2,480 = 2,852' }
        }
      ],
      visual: { type: 'array', a: 12, b: 10 },
      tryThis: 'Now you multiply a big one — you\'ve got this!'
    },

    practice: {
      type: 'mult',
      params: { aDigits: 3, bDigits: 2, regroup: true },
      count: 6
    }
  },

  // ─────────────────────────────────────────────
  // STRAND: Division
  // ─────────────────────────────────────────────

  {
    id: 'g5-div-2digit-divisor',
    grade: 5,
    strand: 'Division',
    title: 'Divide with 2-Digit Divisors',
    emoji: '➗',
    blurb: 'Learn to divide large numbers using estimation and long division.',
    prereq: ['g5-mult-3x2'],

    lesson: {
      hook: '195 students need to ride buses. Each bus holds 15 students. How many buses?',
      bigIdea: 'Estimate, multiply, subtract, and bring down — repeat until done.',
      steps: [
        {
          title: 'Estimate to find your first digit',
          text: 'Ask: how many times does 15 go into 19? Try 1. 1 × 15 = 15. That fits!',
          example: { problem: '195 ÷ 15', show: 'First digit: 15 goes into 19 once (1)' }
        },
        {
          title: 'Multiply and subtract',
          text: 'Write 1 above. Multiply 1 × 15 = 15. Subtract: 19 − 15 = 4.',
          example: { problem: '19 − 15', show: '4 left over, bring down the 5 → 45' }
        },
        {
          title: 'Divide again',
          text: 'Now divide 45 by 15. 3 × 15 = 45. Write 3. Subtract 45 − 45 = 0.',
          example: { problem: '45 ÷ 15', show: '3 × 15 = 45, remainder 0' }
        },
        {
          title: 'Write the final answer',
          text: 'Put the digits together: 195 ÷ 15 = 13.',
          example: { problem: '195 ÷ 15', show: '13 buses needed' }
        }
      ],
      visual: { type: 'groups', groups: 13, perGroup: 15 },
      tryThis: 'Let\'s divide a big number together!'
    },

    practice: {
      type: 'div',
      params: { dividendDigits: 3, divisor: 12, remainder: false },
      count: 6
    }
  },

  // ─────────────────────────────────────────────
  // STRAND: Decimals
  // ─────────────────────────────────────────────

  {
    id: 'g5-decimal-add-sub',
    grade: 5,
    strand: 'Decimals',
    title: 'Add & Subtract Decimals',
    emoji: '🔢',
    blurb: 'Line up the decimal points and add or subtract just like whole numbers.',
    prereq: ['g5-rounding-decimals', 'g5-decimal-compare'],

    lesson: {
      hook: 'You have $3.45 and earn $2.18 more. How much do you have now?',
      bigIdea: 'Line up the decimal points so the same place values are in the same column.',
      steps: [
        {
          title: 'Line up the decimal points',
          text: 'Write one number above the other with decimal points in the same column.',
          example: { problem: '3.45 + 2.18', show: '  3.45\n+ 2.18' }
        },
        {
          title: 'Add from right to left',
          text: 'Start at the hundredths: 5 + 8 = 13. Write 3, carry 1. Then 4 + 1 + 1 = 6. Then 3 + 2 = 5.',
          example: { problem: '3.45 + 2.18', show: '= 5.63' }
        },
        {
          title: 'Bring the decimal point straight down',
          text: 'The decimal point in the answer goes right below the decimal points in the problem.',
          example: { problem: 'Answer: 5.63', show: 'Decimal point is between 5 and 6' }
        }
      ],
      visual: { type: 'numberLine', min: 0, max: 10, step: 1 },
      tryThis: 'Try adding or subtracting these decimals!'
    },

    practice: {
      type: 'decimalAddSub',
      params: { places: 2, op: 'mix' },
      count: 6
    }
  },

  {
    id: 'g5-decimal-mult',
    grade: 5,
    strand: 'Decimals',
    title: 'Multiply Decimals',
    emoji: '💫',
    blurb: 'Multiply like whole numbers, then count decimal places to place the dot.',
    prereq: ['g5-decimal-add-sub', 'g5-mult-3x2'],

    lesson: {
      hook: 'You buy 3 ribbons, each 1.2 meters long. How many meters total?',
      bigIdea: 'Ignore the decimal first, multiply whole numbers, then place the decimal in the answer.',
      steps: [
        {
          title: 'Count the decimal places in both numbers',
          text: '1.2 has 1 decimal place. 3 has 0. Total decimal places needed in the answer: 1.',
          example: { problem: '1.2 × 3', show: '1 decimal place + 0 = 1 total' }
        },
        {
          title: 'Multiply as whole numbers',
          text: 'Pretend there\'s no decimal: 12 × 3 = 36.',
          example: { problem: '12 × 3', show: '36' }
        },
        {
          title: 'Place the decimal in the answer',
          text: 'Count 1 place from the right in 36, so the answer is 3.6.',
          example: { problem: '36 → 1 decimal place', show: '1.2 × 3 = 3.6' }
        }
      ],
      visual: { type: 'numberLine', min: 0, max: 4, step: 0.5 },
      tryThis: 'Now multiply some decimals yourself!'
    },

    practice: {
      type: 'decimalAddSub',
      params: { places: 1, op: 'mix' },
      count: 6
    }
  },

  // ─────────────────────────────────────────────
  // STRAND: Fractions
  // ─────────────────────────────────────────────

  {
    id: 'g5-fraction-add-sub-unlike',
    grade: 5,
    strand: 'Fractions',
    title: 'Add & Subtract Unlike Fractions',
    emoji: '🍕',
    blurb: 'Find a common denominator so you can add or subtract fractions with different bottoms.',
    prereq: ['g5-decimal-add-sub'],

    lesson: {
      hook: 'You ate 1/2 of a pizza and your friend ate 1/3. Together, how much pizza is gone?',
      bigIdea: 'Fractions need the same denominator before you can add or subtract them.',
      steps: [
        {
          title: 'Find a common denominator',
          text: 'List multiples of both denominators. The smallest number on both lists is the LCM.',
          example: { problem: '1/2 + 1/3', show: 'Multiples of 2: 2,4,6... Multiples of 3: 3,6... LCM = 6' }
        },
        {
          title: 'Rename each fraction',
          text: 'Multiply top and bottom of each fraction so the denominator becomes 6.',
          example: { problem: '1/2 = ?/6  and  1/3 = ?/6', show: '1/2 = 3/6  and  1/3 = 2/6' }
        },
        {
          title: 'Add (or subtract) the numerators',
          text: 'Once the denominators match, just add or subtract the tops. Keep the same denominator.',
          example: { problem: '3/6 + 2/6', show: '= 5/6' }
        }
      ],
      visual: { type: 'fractionBar', num: 5, denom: 6 },
      tryThis: 'Let\'s add some unlike fractions together!'
    },

    practice: {
      type: 'fractionAddSub',
      params: { maxDenom: 12, like: false, op: 'mix' },
      count: 6
    }
  },

  {
    id: 'g5-fraction-mult-whole',
    grade: 5,
    strand: 'Fractions',
    title: 'Multiply Fractions by Whole Numbers',
    emoji: '🔢',
    blurb: 'Multiplying a fraction by a whole number is like adding that fraction over and over.',
    prereq: ['g5-fraction-add-sub-unlike'],

    lesson: {
      hook: 'You make 6 smoothies and each needs 2/3 cup of berries. How many cups in all?',
      bigIdea: 'Multiply the whole number by the numerator. Keep the denominator the same.',
      steps: [
        {
          title: 'Write the whole number as a fraction',
          text: 'Any whole number can be written over 1. So 6 = 6/1.',
          example: { problem: '2/3 × 6', show: '2/3 × 6/1' }
        },
        {
          title: 'Multiply numerators together',
          text: 'Multiply the tops: 2 × 6 = 12.',
          example: { problem: '2 × 6', show: '12' }
        },
        {
          title: 'Multiply denominators together',
          text: 'Multiply the bottoms: 3 × 1 = 3. The answer is 12/3.',
          example: { problem: '12/3', show: '= 4 (simplify: 12 ÷ 3 = 4)' }
        }
      ],
      visual: { type: 'fractionBar', num: 2, denom: 3 },
      tryThis: 'Multiply some fractions by whole numbers!'
    },

    practice: {
      type: 'fractionOfNum',
      params: { maxDenom: 10, op: 'mix' },
      count: 6
    }
  },

  {
    id: 'g5-fraction-mult-fraction',
    grade: 5,
    strand: 'Fractions',
    title: 'Multiply Fraction by Fraction',
    emoji: '🔀',
    blurb: 'Multiply tops together and bottoms together to find a fraction of a fraction.',
    prereq: ['g5-fraction-mult-whole'],

    lesson: {
      hook: 'You have 1/2 a pizza and want to eat 3/4 of what\'s left. How much of the whole pizza is that?',
      bigIdea: 'Multiply across: top × top, bottom × bottom. Simplify if you can.',
      steps: [
        {
          title: 'Multiply the numerators',
          text: 'Multiply the tops together. 1 × 3 = 3.',
          example: { problem: '1/2 × 3/4', show: 'Numerator: 1 × 3 = 3' }
        },
        {
          title: 'Multiply the denominators',
          text: 'Multiply the bottoms together. 2 × 4 = 8.',
          example: { problem: '1/2 × 3/4', show: 'Denominator: 2 × 4 = 8' }
        },
        {
          title: 'Write the answer and simplify',
          text: 'Put the answers together: 3/8. Check if it can be simplified. 3 and 8 share no common factor, so 3/8 is the final answer.',
          example: { problem: '1/2 × 3/4', show: '= 3/8' }
        }
      ],
      visual: { type: 'fractionCircle', num: 3, denom: 8 },
      tryThis: 'Let\'s multiply some fractions!'
    },

    practice: {
      type: 'fractionOfNum',
      params: { maxDenom: 8, op: 'mix' },
      count: 6
    }
  },

  // ─────────────────────────────────────────────
  // STRAND: Geometry & Measurement
  // ─────────────────────────────────────────────

  {
    id: 'g5-area-review',
    grade: 5,
    strand: 'Geometry & Measurement',
    title: 'Area of Rectangles & Squares',
    emoji: '📐',
    blurb: 'Area tells you how much flat space is inside a shape. Multiply length × width!',
    prereq: ['g5-mult-3x2'],

    lesson: {
      hook: 'You want to tile a floor that is 7 meters long and 4 meters wide. How many tiles do you need?',
      bigIdea: 'Area = length × width. The answer is in square units.',
      steps: [
        {
          title: 'Identify length and width',
          text: 'Length is the longer side. Width is the shorter side. Label them.',
          example: { problem: 'Rectangle: 7 m long, 4 m wide', show: 'length = 7, width = 4' }
        },
        {
          title: 'Multiply length × width',
          text: 'Use multiplication to find the area: 7 × 4 = 28.',
          example: { problem: '7 × 4', show: '= 28 square meters (m²)' }
        },
        {
          title: 'Don\'t forget the units!',
          text: 'Area is always in SQUARE units. Write m², cm², or ft² after your answer.',
          example: { problem: 'Area of the floor', show: '28 m²' }
        }
      ],
      visual: { type: 'shape', shape: 'rect', w: 7, h: 4 },
      tryThis: 'Find the area of some rectangles!'
    },

    practice: {
      type: 'perimeterArea',
      params: { shape: 'rect', max: 15, ask: 'area' },
      count: 5
    }
  },

  {
    id: 'g5-volume',
    grade: 5,
    strand: 'Geometry & Measurement',
    title: 'Volume of Rectangular Prisms',
    emoji: '📦',
    blurb: 'Volume measures how much space is inside a 3-D box. Multiply length × width × height.',
    prereq: ['g5-area-review'],

    lesson: {
      hook: 'Imagine filling a box with tiny unit cubes. How many cubes fit? That\'s the volume!',
      bigIdea: 'Volume = length × width × height. The answer is in cubic units.',
      steps: [
        {
          title: 'Find the three measurements',
          text: 'Every rectangular prism (box shape) has a length, a width, and a height. Find all three.',
          example: { problem: 'Box: 4 cm long, 3 cm wide, 5 cm tall', show: 'l=4, w=3, h=5' }
        },
        {
          title: 'Multiply all three together',
          text: 'Multiply length × width first: 4 × 3 = 12. Then multiply by height: 12 × 5 = 60.',
          example: { problem: '4 × 3 × 5', show: '12 × 5 = 60' }
        },
        {
          title: 'Label the answer in cubic units',
          text: 'Volume is always in CUBIC units. Write cm³, m³, or in³ after your answer.',
          example: { problem: 'Volume of the box', show: '60 cm³' }
        }
      ],
      visual: { type: 'baseTen', value: 60 },
      tryThis: 'Now figure out the volume of some boxes!'
    },

    practice: {
      type: 'volume',
      params: { max: 10 },
      count: 6
    }
  },

  {
    id: 'g5-perimeter',
    grade: 5,
    strand: 'Geometry & Measurement',
    title: 'Perimeter of Rectangles',
    emoji: '🏃',
    blurb: 'Perimeter is the total distance around the outside of a shape.',
    prereq: ['g5-area-review'],

    lesson: {
      hook: 'You want to put a fence around a garden that is 7 m long and 4 m wide. How much fence?',
      bigIdea: 'Perimeter = add up ALL the sides. For a rectangle use P = 2 × (length + width).',
      steps: [
        {
          title: 'Label all four sides',
          text: 'A rectangle has two long sides and two short sides. Opposite sides are equal.',
          example: { problem: 'Rectangle: 7 m × 4 m', show: 'Sides: 7, 4, 7, 4' }
        },
        {
          title: 'Add all sides together',
          text: 'Add: 7 + 4 + 7 + 4 = 22.',
          example: { problem: '7 + 4 + 7 + 4', show: '= 22 m' }
        },
        {
          title: 'Shortcut: double the sum',
          text: 'You can also do 2 × (7 + 4) = 2 × 11 = 22. Same answer, faster!',
          example: { problem: '2 × (7 + 4)', show: '2 × 11 = 22 m' }
        }
      ],
      visual: { type: 'shape', shape: 'rect', w: 7, h: 4 },
      tryThis: 'Practice finding perimeters now!'
    },

    practice: {
      type: 'perimeterArea',
      params: { shape: 'rect', max: 20, ask: 'perimeter' },
      count: 5
    }
  },

  // ─────────────────────────────────────────────
  // STRAND: Ratios & Algebra
  // ─────────────────────────────────────────────

  {
    id: 'g5-order-of-operations',
    grade: 5,
    strand: 'Ratios & Algebra',
    title: 'Order of Operations',
    emoji: '🧮',
    blurb: 'Follow the rule: Parentheses → Multiply & Divide → Add & Subtract.',
    prereq: ['g5-mult-3x2', 'g5-div-2digit-divisor'],

    lesson: {
      hook: 'Does 3 + 4 × 2 equal 14 or 11? The ORDER you do the operations matters!',
      bigIdea: 'Always follow PEMDAS: Parentheses, Exponents, Multiply/Divide, Add/Subtract.',
      steps: [
        {
          title: 'Do parentheses first',
          text: 'Any math inside ( ) gets done before everything else.',
          example: { problem: '(3 + 4) × 2', show: 'First: 3 + 4 = 7, then 7 × 2 = 14' }
        },
        {
          title: 'Then multiply and divide (left to right)',
          text: 'After parentheses, do all × and ÷ from left to right.',
          example: { problem: '3 + 4 × 2', show: 'First: 4 × 2 = 8, then 3 + 8 = 11' }
        },
        {
          title: 'Finally add and subtract (left to right)',
          text: 'Add and subtract last, going left to right.',
          example: { problem: '10 − 3 + 2', show: '10 − 3 = 7, then 7 + 2 = 9' }
        }
      ],
      visual: { type: 'numberLine', min: 0, max: 20, step: 1 },
      tryThis: 'Solve these expressions in the right order!'
    },

    practice: {
      type: 'order',
      params: { ops: 3, parens: true },
      count: 6
    }
  },

  // ─────────────────────────────────────────────
  // STRAND: Data & Patterns
  // ─────────────────────────────────────────────

  {
    id: 'g5-mean-range',
    grade: 5,
    strand: 'Data & Patterns',
    title: 'Mean & Range',
    emoji: '📊',
    blurb: 'Mean is the average of a set of numbers; range tells you how spread out they are.',
    prereq: ['g5-div-2digit-divisor'],

    lesson: {
      hook: 'Your scores on 5 math quizzes are 4, 6, 8, 10, and 12. What\'s your average score?',
      bigIdea: 'Mean = total ÷ count. Range = biggest − smallest.',
      steps: [
        {
          title: 'Find the mean: add all values',
          text: 'Add up all the numbers in the set: 4 + 6 + 8 + 10 + 12 = 40.',
          example: { problem: '4 + 6 + 8 + 10 + 12', show: '= 40' }
        },
        {
          title: 'Divide by how many numbers there are',
          text: 'There are 5 scores. Divide the total by 5: 40 ÷ 5 = 8.',
          example: { problem: '40 ÷ 5', show: '= 8. Mean score = 8!' }
        },
        {
          title: 'Find the range',
          text: 'Subtract the smallest value from the largest: 12 − 4 = 8.',
          example: { problem: '12 − 4', show: '= 8. Range = 8' }
        }
      ],
      visual: { type: 'numberLine', min: 0, max: 15, step: 1 },
      tryThis: 'Find the mean and range of some data sets!'
    },

    practice: {
      type: 'mean',
      params: { count: 5, max: 20, ask: 'mean' },
      count: 6
    }
  }

];
