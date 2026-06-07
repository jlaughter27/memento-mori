// js/curriculum/grade3.js
// Grade 3 skill curriculum — 14 skills
// Conforms to CONTENT_SCHEMA.md v1 (LOCKED CONTRACT)

export default [

  // ── Numbers & Place Value ───────────────────────────────────────────────────

  {
    id: 'g3-place-value-100s',
    grade: 3,
    strand: 'Numbers & Place Value',
    title: 'Place Value to 1,000',
    emoji: '🏗️',
    blurb: 'Learn how hundreds, tens, and ones build every number up to 1,000.',
    prereq: [],

    lesson: {
      hook: 'If you had 347 jelly beans, could you figure out the hundreds, tens, and ones?',
      bigIdea: 'Every number is built from hundreds, tens, and ones stacked together.',
      steps: [
        {
          title: 'Ones, tens, hundreds',
          text: '10 ones make a ten. 10 tens make a hundred. Stack them up like building blocks! 🧱',
          example: { problem: 'What is 347?', show: '3 hundreds + 4 tens + 7 ones' }
        },
        {
          title: 'Read the place',
          text: 'The digit on the left is worth the most. In 347, the 3 is in the hundreds place — it means 300.',
          example: { problem: 'Value of 4 in 347?', show: '4 is in the tens place → 40' }
        },
        {
          title: 'Expanded form',
          text: 'Write a number as an addition sentence to show each part clearly.',
          example: { problem: '256 in expanded form', show: '200 + 50 + 6' }
        }
      ],
      visual: { type: 'baseTen', value: 347 },
      tryThis: 'Let\'s build some numbers together!'
    },

    practice: {
      type: 'placeValue',
      params: { digits: 3, ask: 'value' },
      count: 6
    },
    wordProblemTags: ['animals', 'baking']
  },

  {
    id: 'g3-build-number',
    grade: 3,
    strand: 'Numbers & Place Value',
    title: 'Build the Number',
    emoji: '🧱',
    cc: '2.NBT.A.1',
    blurb: 'Use hundreds, tens, and ones blocks to build numbers with your own hands.',
    prereq: ['g3-place-value-100s'],

    lesson: {
      hook: 'How many hundred-blocks, ten-blocks, and one-blocks make 243?',
      bigIdea: 'A number is just a pile of place-value blocks: hundreds, tens, and ones added together.',
      steps: [
        {
          title: 'Each place is a block',
          text: 'A ones block is tiny (1). A tens block is a rod (10). A hundreds block is a flat square (100). 🧱',
          example: { problem: 'Build 243', show: '2 hundreds, 4 tens, 3 ones' }
        },
        {
          title: 'Match the digits',
          text: 'Each digit tells you how many blocks of that place to grab.',
          example: { problem: 'The 4 in 243', show: '4 tens = 40' }
        },
        {
          title: 'Tap to build',
          text: 'Now YOU build it — tap ＋ to add blocks and － to take one back until you match the number!',
          example: { problem: 'Build 305', show: '3 hundreds, 0 tens, 5 ones' }
        }
      ],
      visual: { type: 'baseTen', value: 243 },
      tryThis: 'Tap to build the number I ask for!'
    },

    practice: {
      type: 'baseTenBuild',
      params: { places: 3 },
      count: 5
    },
    wordProblemTags: ['animals', 'building']
  },

  {
    id: 'g3-compare-numbers',
    grade: 3,
    strand: 'Numbers & Place Value',
    title: 'Compare & Order Numbers to 1,000',
    emoji: '⚖️',
    blurb: 'Use >, <, and = to compare numbers up to 1,000.',
    prereq: ['g3-place-value-100s'],

    lesson: {
      hook: 'You scored 482 and your friend scored 479. Who won? How do you know?',
      bigIdea: 'Compare numbers starting from the highest place value — the biggest place decides!',
      steps: [
        {
          title: 'Line up the places',
          text: 'Write both numbers so hundreds, tens, and ones are lined up. Look at hundreds first.',
          example: { problem: '482 vs 479', show: 'Both have 4 hundreds. Look at tens: 8 > 7, so 482 > 479.' }
        },
        {
          title: 'Use the signs',
          text: '> means "greater than," < means "less than," = means "equal." The open mouth eats the bigger number! 🐊',
          example: { problem: '315 __ 351', show: '315 < 351 (tens: 1 < 5)' }
        },
        {
          title: 'Order three numbers',
          text: 'Find the smallest, middle, and biggest by comparing two at a time.',
          example: { problem: 'Order: 204, 240, 200', show: '200 < 204 < 240' }
        }
      ],
      visual: { type: 'numberLine', min: 0, max: 500, step: 100 },
      tryThis: 'Put these numbers in order — you\'ve got this!'
    },

    practice: {
      type: 'compare',
      params: { digits: 3 },
      count: 6
    },
    wordProblemTags: ['sports', 'animals']
  },

  {
    id: 'g3-rounding',
    grade: 3,
    strand: 'Numbers & Place Value',
    title: 'Rounding to 10 and 100',
    emoji: '🎯',
    blurb: 'Round numbers to the nearest 10 or 100 to estimate quickly.',
    prereq: ['g3-compare-numbers'],

    lesson: {
      hook: 'There are 47 kids at the party. About how many is that — closer to 40 or 50?',
      bigIdea: 'Rounding replaces a number with a nearby "round" number that is easier to work with.',
      steps: [
        {
          title: 'Find the digit to round',
          text: 'To round to the nearest 10, look at the ones digit. To round to the nearest 100, look at the tens digit.',
          example: { problem: 'Round 47 to nearest 10', show: 'Ones digit is 7 — that\'s 5 or more, so round UP to 50.' }
        },
        {
          title: 'The 5 rule',
          text: 'If the digit you look at is 5 or more, round up. If it is 4 or less, round down (keep it the same). 5️⃣➡️UP!',
          example: { problem: 'Round 342 to nearest 100', show: 'Tens digit is 4 — that\'s less than 5, so round DOWN to 300.' }
        },
        {
          title: 'Use a number line',
          text: 'Plot the number on a number line. Which round number is it closer to?',
          example: { problem: 'Round 260 to nearest 100', show: '260 is between 200 and 300; closer to 300, so round UP to 300.' }
        }
      ],
      visual: { type: 'numberLine', min: 0, max: 100, step: 10, mark: 47 },
      tryThis: 'Round these numbers and we\'ll check together!'
    },

    practice: {
      type: 'rounding',
      params: { digits: 3, to: 10 },
      count: 6
    },
    wordProblemTags: ['baking', 'sports']
  },

  // ── Addition & Subtraction ──────────────────────────────────────────────────

  {
    id: 'g3-add-regroup',
    grade: 3,
    strand: 'Addition & Subtraction',
    title: 'Add Within 1,000 with Regrouping',
    emoji: '➕',
    blurb: 'Add three-digit numbers by regrouping (carrying) when needed.',
    prereq: ['g3-place-value-100s'],

    lesson: {
      hook: 'You collected 356 stickers and your friend gave you 278 more. How many do you have now?',
      bigIdea: 'When the digits in a column add up to 10 or more, regroup (carry) into the next place.',
      steps: [
        {
          title: 'Add the ones first',
          text: 'Start at the ones place. If the sum is 10 or more, write the ones digit and carry the 1 to the tens.',
          example: { problem: '356 + 278 (ones)', show: '6 + 8 = 14 → write 4, carry 1' }
        },
        {
          title: 'Add the tens',
          text: 'Add the tens digits plus any carried 1. Regroup again if needed.',
          example: { problem: '356 + 278 (tens)', show: '5 + 7 + 1 = 13 → write 3, carry 1' }
        },
        {
          title: 'Add the hundreds',
          text: 'Add the hundreds digits plus any carried 1 to get the final answer.',
          example: { problem: '356 + 278 (hundreds)', show: '3 + 2 + 1 = 6 → answer is 634' }
        }
      ],
      visual: { type: 'baseTen', value: 356 },
      tryThis: 'Try adding two big numbers — one column at a time!'
    },

    practice: {
      type: 'add',
      params: { digits: 3, regroup: true, terms: 2 },
      count: 6
    },
    wordProblemTags: ['animals', 'sports']
  },

  {
    id: 'g3-sub-regroup',
    grade: 3,
    strand: 'Addition & Subtraction',
    title: 'Subtract Within 1,000 with Regrouping',
    emoji: '➖',
    blurb: 'Subtract three-digit numbers by regrouping (borrowing) when needed.',
    prereq: ['g3-add-regroup'],

    lesson: {
      hook: 'You had 523 coins and spent 178. How many coins do you have left?',
      bigIdea: 'When the top digit is too small to subtract, borrow 1 from the next place to the left.',
      steps: [
        {
          title: 'Subtract the ones',
          text: 'Start at the ones. If the top digit is smaller than the bottom, borrow 10 from the tens place.',
          example: { problem: '523 − 178 (ones)', show: '3 < 8, so borrow: 13 − 8 = 5' }
        },
        {
          title: 'Subtract the tens',
          text: 'After borrowing, the tens digit is 1 less. Borrow from hundreds if needed.',
          example: { problem: '523 − 178 (tens)', show: 'Tens became 1; 1 < 7, so borrow: 11 − 7 = 4' }
        },
        {
          title: 'Subtract the hundreds',
          text: 'Hundreds digit is 1 less after borrowing. Subtract normally.',
          example: { problem: '523 − 178 (hundreds)', show: '4 − 1 = 3 → answer is 345' }
        }
      ],
      visual: { type: 'baseTen', value: 523 },
      tryThis: 'Let\'s borrow and subtract together!'
    },

    practice: {
      type: 'sub',
      params: { digits: 3, regroup: true },
      count: 6
    },
    wordProblemTags: ['candy', 'space']
  },

  // ── Multiplication ──────────────────────────────────────────────────────────

  {
    id: 'g3-mult-groups',
    grade: 3,
    strand: 'Multiplication',
    title: 'Multiplication as Equal Groups',
    emoji: '✖️',
    blurb: 'See multiplication as adding equal groups — a faster way to count!',
    prereq: ['g3-add-regroup'],

    lesson: {
      hook: 'There are 4 plates with 3 cookies each. Instead of counting every cookie, can you multiply?',
      bigIdea: 'Multiplication is a shortcut for adding the same number over and over.',
      steps: [
        {
          title: 'Groups of things',
          text: '4 groups of 3 means 3 + 3 + 3 + 3. That\'s a lot of adding! Multiplication writes it as 4 × 3.',
          example: { problem: '4 × 3', show: '3 + 3 + 3 + 3 = 12' }
        },
        {
          title: 'Read the × sign',
          text: 'The first number is how many groups. The second number is how many are in each group.',
          example: { problem: '2 × 5', show: '2 groups of 5 → 5 + 5 = 10' }
        },
        {
          title: 'Draw an array',
          text: 'Arrange objects in rows and columns. Rows × columns = total. Count to check!',
          example: { problem: '3 × 4 array', show: '3 rows of 4 dots = 12 dots total' }
        }
      ],
      visual: { type: 'groups', groups: 4, perGroup: 3 },
      tryThis: 'Draw your own groups and multiply!'
    },

    practice: {
      type: 'mult',
      params: { aDigits: 1, bDigits: 1, regroup: false },
      count: 6
    },
    wordProblemTags: ['baking', 'animals']
  },

  {
    id: 'g3-mult-facts',
    grade: 3,
    strand: 'Multiplication',
    title: 'Multiplication Facts to 10',
    emoji: '⚡',
    blurb: 'Practice and memorize the times tables up to 10 × 10.',
    prereq: ['g3-mult-groups'],

    lesson: {
      hook: 'What if you could answer 7 × 8 in one second? Let\'s build that super-skill!',
      bigIdea: 'Knowing your multiplication facts by heart makes all of math faster.',
      steps: [
        {
          title: 'Twos and fives are easy',
          text: 'Counting by 2s or 5s gives you those facts! 2 × 6 = 12, 5 × 6 = 30. Notice any patterns?',
          example: { problem: '5 × 7', show: 'Count by 5s: 5, 10, 15, 20, 25, 30, 35 → 35' }
        },
        {
          title: 'Turn it around',
          text: '6 × 3 = 3 × 6 = 18. Order doesn\'t change the answer! That cuts your memorizing in half. 🔄',
          example: { problem: '4 × 9 vs 9 × 4', show: 'Both equal 36' }
        },
        {
          title: 'Tricky nines trick',
          text: 'For 9 × any number: the digits of the answer always add up to 9!',
          example: { problem: '9 × 6', show: '54 → 5 + 4 = 9 ✓' }
        }
      ],
      visual: { type: 'array', a: 6, b: 7 },
      tryThis: 'Speed round — how fast can you go?'
    },

    practice: {
      type: 'mult',
      params: { aDigits: 1, bDigits: 1, regroup: false },
      count: 8
    },
    wordProblemTags: ['space', 'sports']
  },

  // ── Division ────────────────────────────────────────────────────────────────

  {
    id: 'g3-div-intro',
    grade: 3,
    strand: 'Division',
    title: 'Division as Equal Sharing',
    emoji: '➗',
    blurb: 'Share objects equally into groups — that\'s what division is all about!',
    prereq: ['g3-mult-groups'],

    lesson: {
      hook: 'You have 12 crayons and 3 friends. How many crayons does each friend get?',
      bigIdea: 'Division splits a total into equal groups — it is the opposite of multiplication.',
      steps: [
        {
          title: 'Share it out',
          text: 'Give one crayon at a time to each friend, going around and around. Count how many each gets.',
          example: { problem: '12 ÷ 3', show: '12 shared among 3 → each gets 4' }
        },
        {
          title: 'Division is reverse multiplication',
          text: 'If 3 × 4 = 12, then 12 ÷ 3 = 4. Use your times table facts backwards!',
          example: { problem: '20 ÷ 4', show: '4 × ? = 20 → ? = 5, so 20 ÷ 4 = 5' }
        },
        {
          title: 'The ÷ symbol',
          text: 'Write it as 12 ÷ 3 = 4. Say "12 divided by 3 equals 4." Dividend ÷ divisor = quotient.',
          example: { problem: '15 ÷ 5', show: '5 × 3 = 15, so 15 ÷ 5 = 3' }
        }
      ],
      visual: { type: 'groups', groups: 3, perGroup: 4 },
      tryThis: 'Share these equally and find the answer!'
    },

    practice: {
      type: 'div',
      params: { dividendDigits: 2, divisor: 5, remainder: false },
      count: 6
    },
    wordProblemTags: ['candy', 'baking']
  },

  {
    id: 'g3-div-facts',
    grade: 3,
    strand: 'Division',
    title: 'Division Facts to 10',
    emoji: '🔢',
    blurb: 'Use multiplication facts in reverse to solve division problems quickly.',
    prereq: ['g3-div-intro', 'g3-mult-facts'],

    lesson: {
      hook: 'You know 8 × 7 = 56. That means you already know 56 ÷ 8 — did you realise that?',
      bigIdea: 'Every multiplication fact gives you two division facts for free!',
      steps: [
        {
          title: 'Fact families',
          text: 'A fact family is a set of related × and ÷ sentences. They use the same three numbers.',
          example: { problem: 'Fact family for 3, 6, 18', show: '3×6=18, 6×3=18, 18÷3=6, 18÷6=3' }
        },
        {
          title: 'Think multiplication',
          text: 'When you see 24 ÷ 4, think: "4 times what equals 24?" Your times tables answer it!',
          example: { problem: '24 ÷ 4', show: '4 × 6 = 24, so 24 ÷ 4 = 6' }
        },
        {
          title: 'Dividing by 1 and itself',
          text: 'Any number ÷ 1 = itself. Any number ÷ itself = 1.',
          example: { problem: '9 ÷ 1 and 9 ÷ 9', show: '9 ÷ 1 = 9 and 9 ÷ 9 = 1' }
        }
      ],
      visual: { type: 'array', a: 4, b: 6 },
      tryThis: 'Think multiplication to crack these division problems!'
    },

    practice: {
      type: 'div',
      params: { dividendDigits: 2, divisor: 9, remainder: false },
      count: 8
    },
    wordProblemTags: ['ocean', 'animals']
  },

  // ── Fractions ───────────────────────────────────────────────────────────────

  {
    id: 'g3-fractions-unit',
    grade: 3,
    strand: 'Fractions',
    title: 'Unit Fractions & Equal Parts',
    emoji: '🍕',
    blurb: 'Learn what fractions mean by splitting shapes into equal parts.',
    prereq: ['g3-div-intro'],

    lesson: {
      hook: 'You and two friends share one pizza equally. What fraction does each person get?',
      bigIdea: 'A fraction names equal parts of a whole — the bottom says how many parts, the top says how many you have.',
      steps: [
        {
          title: 'Equal parts only',
          text: 'The parts must be the SAME size! A pizza cut into unequal slices is not fair — or a fraction. 🍕',
          example: { problem: 'Pizza cut into 4 equal slices', show: 'Each slice is 1/4 of the whole pizza.' }
        },
        {
          title: 'Numerator and denominator',
          text: 'Bottom (denominator) = total equal parts. Top (numerator) = parts you have.',
          example: { problem: '3 out of 8 equal parts', show: 'Write as 3/8. Say "three-eighths."' }
        },
        {
          title: 'Unit fraction',
          text: 'A unit fraction has 1 on top: 1/2, 1/3, 1/4, 1/5 ... The bigger the bottom, the smaller each part!',
          example: { problem: 'Which is bigger: 1/2 or 1/6?', show: '1/2 — fewer cuts means bigger pieces.' }
        }
      ],
      visual: { type: 'fractionCircle', num: 1, denom: 4 },
      tryThis: 'Shade the fraction and tell me what part you shaded!'
    },

    practice: {
      type: 'fractionCompare',
      params: { maxDenom: 8 },
      count: 6
    },
    wordProblemTags: ['baking', 'music']
  },

  {
    id: 'g3-fractions-shade',
    grade: 3,
    strand: 'Fractions',
    title: 'Show the Fraction',
    emoji: '🎨',
    cc: '3.NF.A.1',
    blurb: 'Shade parts of a bar to build a fraction with your own hands.',
    prereq: ['g3-fractions-unit'],

    lesson: {
      hook: 'If a candy bar has 4 equal pieces and you eat 3, what fraction did you eat?',
      bigIdea: 'A fraction tells you how many equal parts to shade: the bottom is the total parts, the top is how many to color in.',
      steps: [
        {
          title: 'Bottom = total parts',
          text: 'The denominator (bottom) says how many equal pieces the whole is split into.',
          example: { problem: '3/4', show: 'The 4 means the bar has 4 equal parts.' }
        },
        {
          title: 'Top = parts to shade',
          text: 'The numerator (top) says how many of those parts you color in.',
          example: { problem: '3/4', show: 'The 3 means shade 3 of the 4 parts.' }
        },
        {
          title: 'Tap to build it',
          text: 'Now YOU make the fraction — tap the parts of the bar until the right number are shaded!',
          example: { problem: 'Show 2/3', show: 'Tap 2 of the 3 parts.' }
        }
      ],
      visual: { type: 'fractionBar', num: 3, denom: 4 },
      tryThis: 'Tap to shade the fraction I ask for!'
    },

    practice: {
      type: 'fractionShade',
      params: { maxDenom: 6 },
      count: 5
    },
    wordProblemTags: ['baking', 'art']
  },

  {
    id: 'g3-fractions-compare',
    grade: 3,
    strand: 'Fractions',
    title: 'Compare Simple Fractions',
    emoji: '🔍',
    blurb: 'Use fraction bars to decide which fraction is bigger or smaller.',
    prereq: ['g3-fractions-unit'],

    lesson: {
      hook: 'Would you rather have 3/4 of a chocolate bar or 2/4? Let\'s figure it out!',
      bigIdea: 'When fractions have the same denominator, just compare the numerators — more pieces means more!',
      steps: [
        {
          title: 'Same denominator: compare tops',
          text: 'If the bottom numbers match, compare the tops. Bigger top = bigger fraction.',
          example: { problem: '3/8 vs 5/8', show: '5/8 > 3/8 because 5 > 3 (same-sized pieces, more of them).' }
        },
        {
          title: 'Same numerator: compare bottoms',
          text: 'If the tops match, a smaller bottom means bigger pieces — so that fraction is bigger.',
          example: { problem: '1/3 vs 1/5', show: '1/3 > 1/5 because thirds are larger than fifths.' }
        },
        {
          title: 'Use a fraction bar to check',
          text: 'Draw bars of equal length. Divide each into the right number of parts and shade. Which shaded part is longer?',
          example: { problem: '2/3 vs 3/4', show: 'Fraction bar: 2/3 ≈ 0.67, 3/4 = 0.75 → 3/4 > 2/3' }
        }
      ],
      visual: { type: 'fractionBar', num: 3, denom: 4 },
      tryThis: 'Compare these fractions — which one wins?'
    },

    practice: {
      type: 'fractionCompare',
      params: { maxDenom: 8 },
      count: 6
    },
    wordProblemTags: ['baking', 'animals']
  },

  // ── Geometry & Measurement ──────────────────────────────────────────────────

  {
    id: 'g3-perimeter-area',
    grade: 3,
    strand: 'Geometry & Measurement',
    title: 'Perimeter & Area of Rectangles',
    emoji: '📐',
    blurb: 'Find how far around a rectangle is (perimeter) and how much space it covers (area).',
    prereq: ['g3-mult-facts'],

    lesson: {
      hook: 'You want to put a fence around your garden and carpet its floor. Which is perimeter and which is area?',
      bigIdea: 'Perimeter is the distance around the outside; area is the number of square units covering the inside.',
      steps: [
        {
          title: 'Perimeter: add all sides',
          text: 'Walk around the shape. Add up the length of every side.',
          example: { problem: 'Rectangle 5 cm × 3 cm', show: 'Perimeter = 5 + 3 + 5 + 3 = 16 cm' }
        },
        {
          title: 'Perimeter shortcut',
          text: 'For a rectangle: P = 2 × length + 2 × width. Two long sides and two short sides!',
          example: { problem: 'Rectangle 7 m × 4 m', show: 'P = 2×7 + 2×4 = 14 + 8 = 22 m' }
        },
        {
          title: 'Area: multiply sides',
          text: 'Count the square units inside. Rows × columns = area. For a rectangle: A = length × width.',
          example: { problem: 'Rectangle 5 cm × 3 cm', show: 'Area = 5 × 3 = 15 square cm' }
        }
      ],
      visual: { type: 'shape', shape: 'rect', w: 5, h: 3 },
      tryThis: 'Find the perimeter AND area of these rectangles!'
    },

    practice: {
      type: 'perimeterArea',
      params: { shape: 'rect', max: 10, ask: 'mix' },
      count: 6
    },
    wordProblemTags: ['animals', 'sports']
  },

  // ── Money & Time ────────────────────────────────────────────────────────────

  {
    id: 'g3-time-money',
    grade: 3,
    strand: 'Money & Time',
    title: 'Telling Time & Making Change',
    emoji: '🕐',
    blurb: 'Read clocks to the nearest minute and figure out the right change at a shop.',
    prereq: ['g3-add-regroup', 'g3-sub-regroup'],

    lesson: {
      hook: 'Your movie starts at 2:15 and it\'s 1:50 now. You buy a snack for $1.75 and pay with $2. How much change back?',
      bigIdea: 'Reading a clock and counting money are both about understanding units and working out differences.',
      steps: [
        {
          title: 'Read a clock',
          text: 'The short hand shows hours; the long hand shows minutes. Each small mark is 1 minute; each number is 5 minutes.',
          example: { problem: 'Clock shows short hand at 3, long hand at 9', show: '3:45 — three forty-five' }
        },
        {
          title: 'Elapsed time',
          text: 'Count on from the start time to the end time. Jump by hours, then minutes.',
          example: { problem: 'From 1:50 to 2:15', show: '10 min to 2:00, then 15 more min = 25 minutes' }
        },
        {
          title: 'Making change',
          text: 'Count up from the price to the amount paid. Use coins and bills to find the difference.',
          example: { problem: 'Price $1.75, paid $2.00', show: '$2.00 − $1.75 = $0.25 change (one quarter)' }
        }
      ],
      visual: { type: 'clock', h: 1, m: 50 },
      tryThis: 'Read the clock and count the change!'
    },

    practice: {
      type: 'time',
      params: { ask: 'read', minutes: 5 },
      count: 5
    },
    wordProblemTags: ['candy', 'baking']
  },

  // ── Data & Patterns ─────────────────────────────────────────────────────────

  {
    id: 'g3-patterns',
    grade: 3,
    strand: 'Data & Patterns',
    title: 'Number Patterns',
    emoji: '🔁',
    blurb: 'Find and extend patterns made by adding or multiplying the same number each time.',
    prereq: ['g3-mult-facts', 'g3-add-regroup'],

    lesson: {
      hook: '2, 4, 8, 16, 32 ... what\'s the next number? Do you see the secret?',
      bigIdea: 'A pattern has a rule. Find the rule and you can predict any term in the sequence.',
      steps: [
        {
          title: 'Addition patterns',
          text: 'If you add the same number each time, it is an addition pattern. Find the "step" between terms.',
          example: { problem: '5, 10, 15, 20, __', show: 'Rule: +5 each time → next is 25' }
        },
        {
          title: 'Multiplication patterns',
          text: 'If you multiply by the same number each time, it grows very fast! Find the multiplier.',
          example: { problem: '3, 6, 12, 24, __', show: 'Rule: ×2 each time → next is 48' }
        },
        {
          title: 'Describe the rule',
          text: 'Always write the rule clearly: "Start at ___, add/multiply ___ each time." Then extend the pattern.',
          example: { problem: '100, 90, 80, 70, __', show: 'Rule: −10 each time → next is 60' }
        }
      ],
      visual: { type: 'numberLine', min: 0, max: 50, step: 5 },
      tryThis: 'Find the rule and fill in the missing numbers!'
    },

    practice: {
      type: 'patterns',
      params: { kind: 'add', maxStep: 10 },
      count: 5
    },
    wordProblemTags: ['space', 'music']
  }

];
