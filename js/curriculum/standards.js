// js/curriculum/standards.js
// Common Core State Standards (CCSS) alignment for Grade 3–6 math skills.
// Each key is a skill id; value has { code, domain, text }.
// text is a short (≤120 char) parent-friendly paraphrase of the standard.

export default {

  // ── Grade 3 ────────────────────────────────────────────────────────────────

  'g3-place-value-100s': {
    code: '3.NBT.A.1',
    domain: 'Number & Operations in Base Ten',
    text: 'Understand place value for hundreds, tens, and ones to read and write numbers up to 1,000.'
  },

  'g3-build-number': {
    code: '2.NBT.A.1',
    domain: 'Number & Operations in Base Ten',
    text: 'Compose a three-digit number from hundreds, tens, and ones using place-value blocks.'
  },

  'g3-compare-numbers': {
    code: '3.NBT.A.1',
    domain: 'Number & Operations in Base Ten',
    text: 'Compare two three-digit numbers using >, =, and < by reasoning about their place values.'
  },

  'g3-rounding': {
    code: '3.NBT.A.1',
    domain: 'Number & Operations in Base Ten',
    text: 'Use place value to round whole numbers to the nearest 10 or 100.'
  },

  'g3-add-regroup': {
    code: '3.NBT.A.2',
    domain: 'Number & Operations in Base Ten',
    text: 'Fluently add within 1,000 using strategies based on place value and regrouping.'
  },

  'g3-sub-regroup': {
    code: '3.NBT.A.2',
    domain: 'Number & Operations in Base Ten',
    text: 'Fluently subtract within 1,000 using strategies based on place value and borrowing.'
  },

  'g3-mult-groups': {
    code: '3.OA.A.1',
    domain: 'Operations & Algebraic Thinking',
    text: 'Interpret multiplication as the total number of objects in equal groups (rows × columns).'
  },

  'g3-mult-facts': {
    code: '3.OA.C.7',
    domain: 'Operations & Algebraic Thinking',
    text: 'Fluently multiply within 100 using strategies and knowing all products of 1-digit numbers.'
  },

  'g3-div-intro': {
    code: '3.OA.A.2',
    domain: 'Operations & Algebraic Thinking',
    text: 'Interpret division as splitting a total into equal groups or finding how many in each group.'
  },

  'g3-div-facts': {
    code: '3.OA.C.7',
    domain: 'Operations & Algebraic Thinking',
    text: 'Fluently divide within 100 by applying the relationship between multiplication and division.'
  },

  'g3-fractions-unit': {
    code: '3.NF.A.1',
    domain: 'Number & Operations—Fractions',
    text: 'Understand a fraction 1/b as one equal part when a whole is divided into b equal parts.'
  },

  'g3-fractions-shade': {
    code: '3.NF.A.1',
    domain: 'Number & Operations—Fractions',
    text: 'Build a fraction a/b by shading a equal parts of a whole divided into b equal parts.'
  },

  'g3-fractions-compare': {
    code: '3.NF.A.3',
    domain: 'Number & Operations—Fractions',
    text: 'Compare fractions with the same numerator or denominator using fraction models and reasoning.'
  },

  'g3-perimeter-area': {
    code: '3.MD.D.8',
    domain: 'Measurement & Data',
    text: 'Solve problems about perimeter of polygons and understand the relationship between area and multiplication.'
  },

  'g3-time-money': {
    code: '3.MD.A.1',
    domain: 'Measurement & Data',
    text: 'Tell and write time to the nearest minute and solve word problems involving addition and subtraction of time intervals.'
  },

  'g3-patterns': {
    code: '3.OA.D.9',
    domain: 'Operations & Algebraic Thinking',
    text: 'Identify arithmetic patterns and explain them using properties of operations.'
  },

  // ── Grade 4 ────────────────────────────────────────────────────────────────

  'g4-place-value': {
    code: '4.NBT.A.2',
    domain: 'Number & Operations in Base Ten',
    text: 'Read and write multi-digit whole numbers up to 1,000,000 using base-ten numerals, names, and expanded form.'
  },

  'g4-rounding': {
    code: '4.NBT.A.3',
    domain: 'Number & Operations in Base Ten',
    text: 'Use place value understanding to round multi-digit whole numbers to any place.'
  },

  'g4-add-regroup': {
    code: '4.NBT.B.4',
    domain: 'Number & Operations in Base Ten',
    text: 'Fluently add multi-digit whole numbers using the standard algorithm with regrouping.'
  },

  'g4-sub-regroup': {
    code: '4.NBT.B.4',
    domain: 'Number & Operations in Base Ten',
    text: 'Fluently subtract multi-digit whole numbers using the standard algorithm with borrowing.'
  },

  'g4-mult-3x1': {
    code: '4.NBT.B.5',
    domain: 'Number & Operations in Base Ten',
    text: 'Multiply a multi-digit number by a 1-digit whole number using place value and properties of operations.'
  },

  'g4-mult-2x2': {
    code: '4.NBT.B.5',
    domain: 'Number & Operations in Base Ten',
    text: 'Multiply two 2-digit numbers using an area model and the standard algorithm.'
  },

  'g4-div-basic': {
    code: '4.NBT.B.6',
    domain: 'Number & Operations in Base Ten',
    text: 'Find whole-number quotients and remainders with up to 4-digit dividends and 1-digit divisors.'
  },

  'g4-div-remainder': {
    code: '4.NBT.B.6',
    domain: 'Number & Operations in Base Ten',
    text: 'Divide multi-digit numbers and interpret the remainder in context using long division.'
  },

  'g4-factors-multiples': {
    code: '4.OA.B.4',
    domain: 'Operations & Algebraic Thinking',
    text: 'Find all factor pairs for a whole number 1–100 and recognize multiples of single-digit numbers.'
  },

  'g4-prime': {
    code: '4.OA.B.4',
    domain: 'Operations & Algebraic Thinking',
    text: 'Determine whether a whole number 1–100 is prime or composite by checking its factors.'
  },

  'g4-equiv-fractions': {
    code: '4.NF.A.1',
    domain: 'Number & Operations—Fractions',
    text: 'Explain and generate equivalent fractions by multiplying or dividing numerator and denominator by the same number.'
  },

  'g4-fraction-compare': {
    code: '4.NF.A.2',
    domain: 'Number & Operations—Fractions',
    text: 'Compare two fractions with different numerators and denominators by finding a common denominator.'
  },

  'g4-fraction-add-sub': {
    code: '4.NF.B.3',
    domain: 'Number & Operations—Fractions',
    text: 'Add and subtract fractions with the same denominator, including decomposing fractions into sums of unit fractions.'
  },

  'g4-decimals': {
    code: '4.NF.C.7',
    domain: 'Number & Operations—Fractions',
    text: 'Compare two decimals to hundredths using <, >, = based on the meanings of tenths and hundredths.'
  },

  'g4-perimeter-area': {
    code: '4.MD.A.3',
    domain: 'Measurement & Data',
    text: 'Apply area and perimeter formulas for rectangles in real-world and mathematical problems.'
  },

  'g4-measurement': {
    code: '4.MD.A.1',
    domain: 'Measurement & Data',
    text: 'Know relative sizes of measurement units within a system and convert between larger and smaller units.'
  },

  // ── Grade 5 ────────────────────────────────────────────────────────────────

  'g5-powers-of-10': {
    code: '5.NBT.A.2',
    domain: 'Number & Operations in Base Ten',
    text: 'Explain patterns when multiplying or dividing by powers of 10; use whole-number exponents to denote powers of 10.'
  },

  'g5-decimal-place-value': {
    code: '5.NBT.A.1',
    domain: 'Number & Operations in Base Ten',
    text: 'Recognize that in a multi-digit number each place represents 10 times the place to its right, extending to thousandths.'
  },

  'g5-rounding-decimals': {
    code: '5.NBT.A.4',
    domain: 'Number & Operations in Base Ten',
    text: 'Use place value understanding to round decimals to any place from ones to hundredths.'
  },

  'g5-decimal-compare': {
    code: '5.NBT.A.3',
    domain: 'Number & Operations in Base Ten',
    text: 'Read, write, and compare decimals to thousandths using <, >, = and place-value reasoning.'
  },

  'g5-mult-3x2': {
    code: '5.NBT.B.5',
    domain: 'Number & Operations in Base Ten',
    text: 'Fluently multiply multi-digit whole numbers using the standard algorithm.'
  },

  'g5-div-2digit-divisor': {
    code: '5.NBT.B.6',
    domain: 'Number & Operations in Base Ten',
    text: 'Find whole-number quotients with up to 4-digit dividends and 2-digit divisors using strategies and the standard algorithm.'
  },

  'g5-decimal-add-sub': {
    code: '5.NBT.B.7',
    domain: 'Number & Operations in Base Ten',
    text: 'Add and subtract decimals to hundredths using concrete models or drawings and strategies based on place value.'
  },

  'g5-decimal-mult': {
    code: '5.NBT.B.7',
    domain: 'Number & Operations in Base Ten',
    text: 'Multiply decimals to hundredths using concrete models and strategies; relate the strategy to a written method.'
  },

  'g5-fraction-add-sub-unlike': {
    code: '5.NF.A.1',
    domain: 'Number & Operations—Fractions',
    text: 'Add and subtract fractions with unlike denominators by replacing them with equivalent fractions with a common denominator.'
  },

  'g5-fraction-mult-whole': {
    code: '5.NF.B.4',
    domain: 'Number & Operations—Fractions',
    text: 'Multiply a fraction by a whole number or by another fraction, interpreting the result as scaling.'
  },

  'g5-fraction-mult-fraction': {
    code: '5.NF.B.4',
    domain: 'Number & Operations—Fractions',
    text: 'Multiply fractions — find the product by multiplying numerators and multiplying denominators, then simplify.'
  },

  'g5-area-review': {
    code: '5.MD.C.5',
    domain: 'Measurement & Data',
    text: 'Apply the formula V = l × w × h and find the area of rectangles as a foundation for volume understanding.'
  },

  'g5-volume': {
    code: '5.MD.C.5',
    domain: 'Measurement & Data',
    text: 'Apply the formulas V = l × w × h and V = B × h to find volumes of rectangular prisms in real-world problems.'
  },

  'g5-perimeter': {
    code: '5.MD.C.5',
    domain: 'Measurement & Data',
    text: 'Apply the perimeter formula P = 2 × (l + w) for rectangles and connect it to real-world measurement situations.'
  },

  'g5-order-of-operations': {
    code: '5.OA.A.1',
    domain: 'Operations & Algebraic Thinking',
    text: 'Use parentheses, brackets, or braces in numerical expressions, and evaluate expressions following the order of operations.'
  },

  'g5-mean-range': {
    code: '5.MD.B.2',
    domain: 'Measurement & Data',
    text: 'Represent and interpret data on a line plot; understand average (mean) as a fair-share value and range as spread.'
  },

  // ── Grade 6 ────────────────────────────────────────────────────────────────

  'g6-div-multidigit': {
    code: '6.NS.B.2',
    domain: 'The Number System',
    text: 'Fluently divide multi-digit numbers using the standard long-division algorithm.'
  },

  'g6-decimal-addsub': {
    code: '6.NS.B.3',
    domain: 'The Number System',
    text: 'Fluently multiply and divide multi-digit decimals using the standard algorithm.'
  },

  'g6-decimal-compare': {
    code: '6.NS.C.6',
    domain: 'The Number System',
    text: 'Understand that numbers on a number line extend in both directions; compare and order decimals using <, >, =.'
  },

  'g6-integers': {
    code: '6.NS.C.5',
    domain: 'The Number System',
    text: 'Understand positive and negative numbers as directions on a number line; add and subtract integers.'
  },

  'g6-fraction-of-num': {
    code: '6.NS.A.1',
    domain: 'The Number System',
    text: 'Interpret and compute a fraction of a whole number by dividing by the denominator and multiplying by the numerator.'
  },

  'g6-fraction-addsub': {
    code: '6.NS.A.1',
    domain: 'The Number System',
    text: 'Add and subtract fractions with unlike denominators by finding the least common denominator and renaming fractions.'
  },

  'g6-fraction-divide': {
    code: '6.NS.A.1',
    domain: 'The Number System',
    text: 'Divide fractions by fractions by multiplying by the reciprocal (flip-and-multiply), and solve real-world problems.'
  },

  'g6-ratios': {
    code: '6.RP.A.1',
    domain: 'Ratios & Proportional Relationships',
    text: 'Understand a ratio as a comparison of two quantities and use ratio language to describe the relationship.'
  },

  'g6-unit-rates': {
    code: '6.RP.A.2',
    domain: 'Ratios & Proportional Relationships',
    text: 'Understand the concept of a unit rate a/b associated with a ratio a:b, and use rate language in context.'
  },

  'g6-percent-of-number': {
    code: '6.RP.A.3',
    domain: 'Ratios & Proportional Relationships',
    text: 'Find a percent of a quantity by converting to a decimal or fraction, and solve real-world percent problems.'
  },

  'g6-percent-whole': {
    code: '6.RP.A.3',
    domain: 'Ratios & Proportional Relationships',
    text: 'Use ratio reasoning to find the whole when a part and its percent are known; solve using division.'
  },

  'g6-order-of-ops': {
    code: '6.EE.A.1',
    domain: 'Expressions & Equations',
    text: 'Write and evaluate numerical expressions using whole-number exponents and the correct order of operations (PEMDAS).'
  },

  'g6-mean-range': {
    code: '6.SP.A.2',
    domain: 'Statistics & Probability',
    text: 'Understand that a data set has a distribution described by center (mean) and spread (range).'
  },

  'g6-area-volume': {
    code: '6.G.A.2',
    domain: 'Geometry',
    text: 'Find the volume of a rectangular prism using the formula V = l × w × h; find area of rectangles in real-world contexts.'
  }

};
