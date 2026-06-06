// js/curriculum/grade4.js
// Grade 4 — 16 skills in learning order
// Conforms to CONTENT_SCHEMA.md v1 (§1 Skill, §2 Types, §3 Visuals, §4 Strands)

export default [

  // ── 1. Numbers & Place Value ──────────────────────────────────────────────

  {
    id: 'g4-place-value',
    grade: 4,
    strand: 'Numbers & Place Value',
    title: 'Numbers to Millions & Expanded Form',
    emoji: '🏙️',
    blurb: 'Read, write, and break apart big numbers all the way to 1,000,000!',
    prereq: ['g3-place-thousands'],
    lesson: {
      hook: 'Did you know a big city can have over a MILLION people? Let\'s learn to read — and break apart — numbers that big!',
      bigIdea: 'Every digit in a big number has a place that tells you its value. Expanded form shows all those values at once.',
      steps: [
        {
          title: 'The place-value chart',
          text: 'Ones, tens, hundreds — then thousands, ten-thousands, hundred-thousands, millions. Each place is 10× bigger!',
          example: { problem: 'What is 3 worth in 3,456,789?', show: '3 is in the millions place → worth 3,000,000' }
        },
        {
          title: 'Read it left to right',
          text: 'Start at the biggest place. Read each group, say its name, then move right.',
          example: { problem: '2,308,041', show: 'Two million, three hundred eight thousand, forty-one' }
        },
        {
          title: 'Write expanded form',
          text: 'List the value of each digit with a + sign. Skip any digit that is a zero.',
          example: { problem: '45,263', show: '40,000 + 5,000 + 200 + 60 + 3' }
        },
        {
          title: 'Zeros hold the place',
          text: 'A zero means "nothing here," but it keeps every other digit in the right spot.',
          example: { problem: '308,070', show: '300,000 + 8,000 + 70' }
        }
      ],
      visual: { type: 'baseTen', value: 45263 },
      tryThis: 'Ready to name and expand some big numbers? Let\'s go! 🚀'
    },
    practice: {
      type: 'placeValue',
      params: { digits: 7, ask: 'expanded' },
      count: 6
    },
    wordProblemTags: ['space', 'animals']
  },

  // ── 2. Numbers & Place Value ──────────────────────────────────────────────

  {
    id: 'g4-rounding',
    grade: 4,
    strand: 'Numbers & Place Value',
    title: 'Round to the Nearest 1,000',
    emoji: '🎯',
    blurb: 'Snap numbers to the closest thousand to make estimating easy.',
    prereq: ['g4-place-value'],
    lesson: {
      hook: 'Your school has 3,748 students. About how many is that? Rounding gives you a quick, clean answer!',
      bigIdea: 'Rounding finds the nearest "clean" number so you can estimate and compare more easily.',
      steps: [
        {
          title: 'Find the rounding digit',
          text: 'Circle the thousands digit. Then look at the hundreds digit just to its right.',
          example: { problem: 'Round 3,748 to the nearest 1,000', show: 'Thousands = 3 · Hundreds = 7' }
        },
        {
          title: 'The magic number is 5',
          text: 'Hundreds digit 5 or more → round UP (add 1 to thousands). Hundreds digit 4 or less → round DOWN (keep thousands digit).',
          example: { problem: '3,748 → hundreds = 7 (≥ 5)', show: 'Round UP → 4,000' }
        },
        {
          title: 'Replace the rest with zeros',
          text: 'After deciding the thousands digit, change every digit to its right to 0.',
          example: { problem: '6,312 → hundreds = 3 (< 5)', show: 'Round DOWN → 6,000' }
        }
      ],
      visual: { type: 'numberLine', min: 3000, max: 4000, step: 1000, mark: 3748 },
      tryThis: 'Let\'s practice rounding to the thousands! 🎳'
    },
    practice: {
      type: 'rounding',
      params: { digits: 4, to: 1000 },
      count: 6
    }
  },

  // ── 3. Addition & Subtraction ─────────────────────────────────────────────

  {
    id: 'g4-add-regroup',
    grade: 4,
    strand: 'Addition & Subtraction',
    title: 'Add Multi-Digit Numbers',
    emoji: '➕',
    blurb: 'Stack and add 3- and 4-digit numbers, carrying when you need to.',
    prereq: ['g3-add-regroup', 'g4-place-value'],
    lesson: {
      hook: 'A school fair sold 1,456 tickets Saturday and 2,875 Sunday. How many in all?',
      bigIdea: 'Line up the digits, add from right to left, and carry any extras to the next column.',
      steps: [
        {
          title: 'Line up by place',
          text: 'Ones under ones, tens under tens, hundreds under hundreds. Columns must line up!',
          example: { problem: '1,456 + 2,875', show: '  1456\n+ 2875' }
        },
        {
          title: 'Add ones first, then carry',
          text: 'Add the ones column. If the sum is 10 or more, write the ones digit and carry the tens digit up.',
          example: { problem: '6 + 5 = 11', show: 'Write 1, carry 1 to the tens column' }
        },
        {
          title: 'Work all the way left',
          text: 'Add tens (include carry!), then hundreds, then thousands.',
          example: { problem: '1,456 + 2,875', show: '4,331' }
        }
      ],
      visual: { type: 'baseTen', value: 1456 },
      tryThis: 'Stack \'em up and add! ➕'
    },
    practice: {
      type: 'add',
      params: { digits: 4, regroup: true, terms: 2 },
      count: 6
    },
    wordProblemTags: ['sports', 'baking']
  },

  // ── 4. Addition & Subtraction ─────────────────────────────────────────────

  {
    id: 'g4-sub-regroup',
    grade: 4,
    strand: 'Addition & Subtraction',
    title: 'Subtract Multi-Digit Numbers',
    emoji: '➖',
    blurb: 'Subtract 3- and 4-digit numbers by borrowing across columns.',
    prereq: ['g4-add-regroup'],
    lesson: {
      hook: 'You have 5,000 coins in a game and spend 2,347. How many are left?',
      bigIdea: 'When a digit on top is too small to subtract from, borrow 10 from the next column to the left.',
      steps: [
        {
          title: 'Set up the problem',
          text: 'Write the bigger number on top. Line up all the place-value columns carefully.',
          example: { problem: '5,000 − 2,347', show: '  5000\n− 2347' }
        },
        {
          title: 'Borrow when the top is too small',
          text: 'If the top digit is smaller than the bottom, borrow 1 from the next column left. That adds 10 to your column.',
          example: { problem: 'Ones: 0 − 7, need to borrow', show: '10 − 7 = 3, and reduce tens by 1' }
        },
        {
          title: 'Borrow across zeros',
          text: 'If the next column is also 0, keep moving left until you find a non-zero digit to borrow from.',
          example: { problem: '5,000 − 2,347', show: '2,653' }
        }
      ],
      visual: { type: 'baseTen', value: 5000 },
      tryThis: 'Time to borrow and subtract! ➖'
    },
    practice: {
      type: 'sub',
      params: { digits: 4, regroup: true },
      count: 6
    },
    wordProblemTags: ['candy', 'sports']
  },

  // ── 5. Multiplication ─────────────────────────────────────────────────────

  {
    id: 'g4-mult-3x1',
    grade: 4,
    strand: 'Multiplication',
    title: 'Multiply 3-Digit by 1-Digit',
    emoji: '✖️',
    blurb: 'Use place value to multiply hundreds, tens, and ones step by step.',
    prereq: ['g3-mult-facts', 'g4-place-value'],
    lesson: {
      hook: 'A baker makes 324 cookies every day. How many does she bake in 3 days?',
      bigIdea: 'Break the big number into hundreds, tens, and ones — multiply each part, then add.',
      steps: [
        {
          title: 'Multiply ones first',
          text: 'Multiply the ones digit by the single-digit number. Write the ones, carry any tens.',
          example: { problem: '324 × 3 — ones step', show: '4 × 3 = 12 → write 2, carry 1' }
        },
        {
          title: 'Multiply tens, add carry',
          text: 'Multiply the tens digit by the number, then add the carry from before.',
          example: { problem: '2 × 3 = 6, + 1 carry = 7', show: 'Write 7 in the tens column' }
        },
        {
          title: 'Multiply hundreds',
          text: 'Multiply the hundreds digit. Add any remaining carry.',
          example: { problem: '3 × 3 = 9', show: '324 × 3 = 972' }
        }
      ],
      visual: { type: 'array', a: 3, b: 9 },
      tryThis: 'Multiply column by column! ✖️'
    },
    practice: {
      type: 'mult',
      params: { aDigits: 3, bDigits: 1, regroup: true },
      count: 6
    },
    wordProblemTags: ['baking', 'animals']
  },

  // ── 6. Multiplication ─────────────────────────────────────────────────────

  {
    id: 'g4-mult-2x2',
    grade: 4,
    strand: 'Multiplication',
    title: 'Multiply 2-Digit by 2-Digit',
    emoji: '💥',
    blurb: 'Use an area model and the standard algorithm to multiply two 2-digit numbers.',
    prereq: ['g4-mult-3x1'],
    lesson: {
      hook: 'A garden has 23 rows and 14 plants in each row. How many plants in all?',
      bigIdea: 'Split both numbers into tens and ones, multiply each part in a grid, then add it all up.',
      steps: [
        {
          title: 'Area model: split both numbers',
          text: 'Break each factor into tens and ones. Draw a rectangle and label the sides.',
          example: { problem: '23 × 14', show: '23 = 20 + 3 · 14 = 10 + 4' }
        },
        {
          title: 'Fill in the four boxes',
          text: 'Multiply each pair of parts to fill in the four sections of the rectangle.',
          example: { problem: '20×10=200, 20×4=80, 3×10=30, 3×4=12', show: '200 + 80 + 30 + 12 = 322' }
        },
        {
          title: 'Standard algorithm',
          text: 'Multiply by ones, then multiply by tens (add a 0 placeholder), then add both rows.',
          example: { problem: '36 × 24', show: '36×4=144, 36×20=720, 144+720=864' }
        }
      ],
      visual: { type: 'shape', shape: 'rect', w: 14, h: 23 },
      tryThis: 'Draw the grid and multiply! 💥'
    },
    practice: {
      type: 'mult',
      params: { aDigits: 2, bDigits: 2, regroup: true },
      count: 7
    },
    wordProblemTags: ['sports', 'ocean']
  },

  // ── 7. Division ───────────────────────────────────────────────────────────

  {
    id: 'g4-div-basic',
    grade: 4,
    strand: 'Division',
    title: 'Long Division — No Remainder',
    emoji: '➗',
    blurb: 'Divide 2- and 3-digit numbers by a 1-digit divisor with no leftovers.',
    prereq: ['g3-div-facts', 'g4-mult-2x2'],
    lesson: {
      hook: 'Share 96 stickers equally among 4 friends. How many does each friend get?',
      bigIdea: 'Long division breaks a big sharing problem into small steps: Divide, Multiply, Subtract, Bring down.',
      steps: [
        {
          title: 'Divide the first digit',
          text: 'Look at the first digit (or first two, if needed). How many times does the divisor fit?',
          example: { problem: '96 ÷ 4', show: '9 ÷ 4 = 2 (write 2 above the 9)' }
        },
        {
          title: 'Multiply and subtract',
          text: 'Multiply your digit by the divisor. Subtract. Bring down the next digit.',
          example: { problem: '2 × 4 = 8 · 9 − 8 = 1 · bring down 6 → 16', show: '16 ÷ 4 = 4' }
        },
        {
          title: 'Repeat until done',
          text: 'Keep the cycle going until no digits remain.',
          example: { problem: '4 × 4 = 16 · 16 − 16 = 0', show: '96 ÷ 4 = 24' }
        }
      ],
      visual: { type: 'groups', groups: 4, perGroup: 24 },
      tryThis: 'Divide, multiply, subtract, bring down — you\'ve got this! ➗'
    },
    practice: {
      type: 'div',
      params: { dividendDigits: 3, divisor: 9, remainder: false },
      count: 6
    },
    wordProblemTags: ['candy', 'baking']
  },

  // ── 8. Division ───────────────────────────────────────────────────────────

  {
    id: 'g4-div-remainder',
    grade: 4,
    strand: 'Division',
    title: 'Long Division with Remainders',
    emoji: '🧩',
    blurb: 'When numbers don\'t divide evenly, find the quotient AND the remainder.',
    prereq: ['g4-div-basic'],
    lesson: {
      hook: '25 kids, 4 to a team — does everyone fit on a team? Let\'s find out what\'s left over!',
      bigIdea: 'When a number can\'t be shared equally, the amount left over is called the remainder.',
      steps: [
        {
          title: 'Divide as usual',
          text: 'Follow the same Divide → Multiply → Subtract → Bring down steps.',
          example: { problem: '25 ÷ 4', show: '4 goes into 25 six times (4 × 6 = 24)' }
        },
        {
          title: 'Spot the remainder',
          text: 'After the last subtraction, if a number is left that is smaller than the divisor, that is the remainder.',
          example: { problem: '25 − 24 = 1', show: '25 ÷ 4 = 6 remainder 1' }
        },
        {
          title: 'Check your work',
          text: 'Multiply quotient × divisor, then add the remainder. You should get the original number.',
          example: { problem: '6 × 4 + 1', show: '24 + 1 = 25 ✓' }
        }
      ],
      visual: { type: 'groups', groups: 6, perGroup: 4 },
      tryThis: 'Find the leftover! 🧩'
    },
    practice: {
      type: 'div',
      params: { dividendDigits: 3, divisor: 9, remainder: true },
      count: 6
    },
    wordProblemTags: ['sports', 'animals']
  },

  // ── 9. Data & Patterns ────────────────────────────────────────────────────

  {
    id: 'g4-factors-multiples',
    grade: 4,
    strand: 'Data & Patterns',
    title: 'Factors & Multiples',
    emoji: '🔍',
    blurb: 'Hunt for all the factor pairs of a number and list its multiples.',
    prereq: ['g3-mult-facts'],
    lesson: {
      hook: 'Which pairs of numbers multiply to make 24? Factor hunting is like a math treasure hunt!',
      bigIdea: 'Factors multiply together to make a number. Multiples are what you get by skip-counting by a number.',
      steps: [
        {
          title: 'Find factors in pairs',
          text: 'Start at 1 and count up. If a number divides evenly, both numbers in that division are factors.',
          example: { problem: 'Factors of 24', show: '1×24, 2×12, 3×8, 4×6 → factors: 1,2,3,4,6,8,12,24' }
        },
        {
          title: 'List multiples',
          text: 'Multiply a number by 1, 2, 3, 4, 5, … to get its list of multiples.',
          example: { problem: 'Multiples of 6', show: '6, 12, 18, 24, 30, …' }
        }
      ],
      visual: { type: 'array', a: 4, b: 6 },
      tryThis: 'Find every factor — don\'t miss one! 🔍'
    },
    practice: {
      type: 'factors',
      params: { max: 50, ask: 'factors' },
      count: 6
    }
  },

  // ── 10. Data & Patterns ───────────────────────────────────────────────────

  {
    id: 'g4-prime',
    grade: 4,
    strand: 'Data & Patterns',
    title: 'Prime & Composite Numbers',
    emoji: '⭐',
    blurb: 'Numbers with exactly 2 factors are prime — all others are composite.',
    prereq: ['g4-factors-multiples'],
    lesson: {
      hook: 'Some numbers are loners — only divisible by 1 and themselves. Meet the prime numbers!',
      bigIdea: 'A prime number has exactly 2 factors: 1 and itself. A composite number has more.',
      steps: [
        {
          title: 'Test for primeness',
          text: 'Try dividing by 2, 3, 5, 7, … If nothing divides evenly (besides 1 and the number), it\'s prime!',
          example: { problem: 'Is 13 prime?', show: '13 ÷ 2, 3: no exact division → PRIME' }
        },
        {
          title: 'Composite has extra factors',
          text: 'If any number besides 1 and itself divides evenly, the number is composite.',
          example: { problem: 'Is 15 prime?', show: '15 ÷ 3 = 5 exactly → COMPOSITE (factors: 1,3,5,15)' }
        },
        {
          title: 'Special cases to remember',
          text: '1 is NEITHER prime nor composite. 2 is the only even prime number!',
          example: { problem: 'Primes below 20', show: '2, 3, 5, 7, 11, 13, 17, 19' }
        }
      ],
      tryThis: 'Prime or composite — you decide! ⭐'
    },
    practice: {
      type: 'factors',
      params: { max: 50, ask: 'prime' },
      count: 6
    }
  },

  // ── 11. Fractions ─────────────────────────────────────────────────────────

  {
    id: 'g4-equiv-fractions',
    grade: 4,
    strand: 'Fractions',
    title: 'Equivalent Fractions',
    emoji: '🍕',
    blurb: 'Different fractions can show the same amount — discover equivalents!',
    prereq: ['g3-fractions-basic'],
    lesson: {
      hook: 'Is half a pizza the same as 2 fourths? Let\'s use fraction bars to see!',
      bigIdea: 'Equivalent fractions look different but are equal — multiply or divide top and bottom by the same number.',
      steps: [
        {
          title: 'Multiply to make an equivalent fraction',
          text: 'Multiply BOTH the numerator (top) and denominator (bottom) by the same number.',
          example: { problem: '1/2 = ?/8', show: '1×4=4, 2×4=8 → 4/8' }
        },
        {
          title: 'Divide to simplify',
          text: 'Divide both numerator and denominator by the same number to simplify.',
          example: { problem: '6/9 simplified', show: '6÷3=2, 9÷3=3 → 2/3' }
        }
      ],
      visual: [
        { type: 'fractionBar', num: 1, denom: 2 },
        { type: 'fractionBar', num: 4, denom: 8 }
      ],
      tryThis: 'Find the matching fraction! 🍕'
    },
    practice: {
      type: 'equivFraction',
      params: { maxDenom: 12 },
      count: 6
    }
  },

  // ── 12. Fractions ─────────────────────────────────────────────────────────

  {
    id: 'g4-fraction-compare',
    grade: 4,
    strand: 'Fractions',
    title: 'Compare Fractions',
    emoji: '🔢',
    blurb: 'Use >, <, and = to compare fractions with different denominators.',
    prereq: ['g4-equiv-fractions'],
    lesson: {
      hook: 'Which is more: 3/4 of a granola bar or 5/8? Let\'s compare!',
      bigIdea: 'To compare fractions, find a common denominator, then compare the numerators.',
      steps: [
        {
          title: 'Same denominator — easy!',
          text: 'If denominators match, the bigger numerator wins.',
          example: { problem: '3/8 vs 5/8', show: '3 < 5 → 3/8 < 5/8' }
        },
        {
          title: 'Different denominators',
          text: 'Find a common denominator, convert both fractions to it, then compare the tops.',
          example: { problem: '3/4 vs 5/8 → use 8', show: '3/4 = 6/8 · 6/8 > 5/8 → 3/4 > 5/8' }
        }
      ],
      visual: [
        { type: 'fractionBar', num: 3, denom: 4 },
        { type: 'fractionBar', num: 5, denom: 8 }
      ],
      tryThis: 'Which fraction is bigger? You choose! 🔢'
    },
    practice: {
      type: 'fractionCompare',
      params: { maxDenom: 12 },
      count: 6
    }
  },

  // ── 13. Fractions ─────────────────────────────────────────────────────────

  {
    id: 'g4-fraction-add-sub',
    grade: 4,
    strand: 'Fractions',
    title: 'Add & Subtract Like Fractions',
    emoji: '🥧',
    blurb: 'Add and subtract fractions that share the same denominator.',
    prereq: ['g4-fraction-compare'],
    lesson: {
      hook: 'You ate 2/8 of a pie and your friend ate 3/8. How much pie is gone?',
      bigIdea: 'When fractions have the same denominator, just add or subtract the numerators — the denominator stays!',
      steps: [
        {
          title: 'Check the denominators',
          text: 'Make sure both fractions have the same denominator. If yes, you\'re ready!',
          example: { problem: '2/8 + 3/8', show: 'Both have denominator 8 — great!' }
        },
        {
          title: 'Add or subtract the tops',
          text: 'Operate on only the numerators. Copy the same denominator below.',
          example: { problem: '2/8 + 3/8', show: '(2+3)/8 = 5/8' }
        },
        {
          title: 'Simplify if you can',
          text: 'Divide both numerator and denominator by the same number to simplify.',
          example: { problem: '4/8 → divide by 4', show: '4/8 = 1/2' }
        }
      ],
      visual: { type: 'fractionBar', num: 5, denom: 8 },
      tryThis: 'Add those fraction slices! 🥧'
    },
    practice: {
      type: 'fractionAddSub',
      params: { maxDenom: 12, like: true, op: 'mix' },
      count: 6
    },
    wordProblemTags: ['baking', 'candy']
  },

  // ── 14. Decimals ──────────────────────────────────────────────────────────

  {
    id: 'g4-decimals',
    grade: 4,
    strand: 'Decimals',
    title: 'Decimals: Tenths, Hundredths & Comparing',
    emoji: '💰',
    blurb: 'Read decimals to hundredths, compare them, and add or subtract.',
    prereq: ['g4-equiv-fractions'],
    lesson: {
      hook: '$4.25 and $4.52 — who has more? And how much is the total? Decimals hold the answer!',
      bigIdea: 'The decimal point separates whole parts from fraction parts. Tenths and hundredths work just like place value.',
      steps: [
        {
          title: 'Tenths and hundredths',
          text: 'One tenth (0.1) is 1 of 10 equal parts. One hundredth (0.01) is 1 of 100 equal parts.',
          example: { problem: '0.37', show: '3 tenths + 7 hundredths = 37 hundredths = 37/100' }
        },
        {
          title: 'Compare digit by digit',
          text: 'Start at the ones place and scan right. The first place where digits differ decides the winner.',
          example: { problem: '4.25 vs 4.52', show: 'Tenths: 2 < 5 → 4.25 < 4.52' }
        },
        {
          title: 'Add and subtract decimals',
          text: 'Line up the decimal points, add zeros to fill gaps, then add or subtract column by column.',
          example: { problem: '4.25 + 3.60', show: '4.25 + 3.60 = 7.85' }
        }
      ],
      visual: { type: 'fractionBar', num: 37, denom: 100 },
      tryThis: 'Line up those decimal points and go! 💰'
    },
    practice: {
      type: 'decimalAddSub',
      params: { places: 2, op: 'mix' },
      count: 6
    },
    wordProblemTags: ['candy', 'baking']
  },

  // ── 15. Geometry & Measurement ────────────────────────────────────────────

  {
    id: 'g4-perimeter-area',
    grade: 4,
    strand: 'Geometry & Measurement',
    title: 'Perimeter & Area',
    emoji: '📐',
    blurb: 'Find how far around and how much space a rectangle takes up.',
    prereq: ['g4-mult-3x1'],
    lesson: {
      hook: 'You want to put a fence around your garden and lay grass inside it. That\'s perimeter and area!',
      bigIdea: 'Perimeter is the total distance around a shape. Area is the number of square units it covers.',
      steps: [
        {
          title: 'Perimeter: add all the sides',
          text: 'For a rectangle, add: length + width + length + width. Or use P = 2 × (length + width).',
          example: { problem: 'Rectangle 8 × 5', show: 'P = 8+5+8+5 = 26 units' }
        },
        {
          title: 'Area: multiply length × width',
          text: 'Count square units inside by multiplying the two side lengths.',
          example: { problem: 'Rectangle 8 × 5', show: 'A = 8 × 5 = 40 square units' }
        },
        {
          title: 'Units matter',
          text: 'Perimeter is measured in plain units (cm, m). Area is measured in SQUARE units (cm², m²).',
          example: { problem: 'A = 40 square centimetres', show: 'Write it as 40 cm²' }
        }
      ],
      visual: { type: 'shape', shape: 'rect', w: 8, h: 5 },
      tryThis: 'Find the perimeter AND the area! 📐'
    },
    practice: {
      type: 'perimeterArea',
      params: { shape: 'rect', max: 20, ask: 'mix' },
      count: 6
    },
    wordProblemTags: ['sports', 'animals']
  },

  // ── 16. Geometry & Measurement ────────────────────────────────────────────

  {
    id: 'g4-measurement',
    grade: 4,
    strand: 'Geometry & Measurement',
    title: 'Measurement Conversions',
    emoji: '📏',
    blurb: 'Convert between units of length, mass, and capacity.',
    prereq: ['g4-mult-3x1', 'g4-div-basic'],
    lesson: {
      hook: 'Your recipe needs 2 liters but you only have a milliliter cup. How many cups is that?',
      bigIdea: 'Converting measurements means swapping the unit without changing the actual amount.',
      steps: [
        {
          title: 'Bigger to smaller → multiply',
          text: 'Moving to a smaller unit means you\'ll have MORE of them, so multiply.',
          example: { problem: '3 km to meters', show: '3 × 1,000 = 3,000 m' }
        },
        {
          title: 'Smaller to bigger → divide',
          text: 'Moving to a bigger unit means you\'ll have FEWER of them, so divide.',
          example: { problem: '500 cm to meters', show: '500 ÷ 100 = 5 m' }
        },
        {
          title: 'Key conversion facts',
          text: '1 km = 1,000 m · 1 m = 100 cm · 1 kg = 1,000 g · 1 L = 1,000 mL',
          example: { problem: '4 kg to grams', show: '4 × 1,000 = 4,000 g' }
        }
      ],
      visual: { type: 'numberLine', min: 0, max: 1000, step: 100, mark: 500 },
      tryThis: 'Convert those units! 📏'
    },
    practice: {
      type: 'measure',
      params: { kind: 'length', system: 'metric' },
      count: 6
    },
    wordProblemTags: ['ocean', 'space']
  }

];
