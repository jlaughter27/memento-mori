// js/curriculum/wordbank.js
// Word Problem Bank for MathQuest — LOCKED SCHEMA §5
// 60+ problems across 8 themes, 11 skill types, grades 3–6

export default {
  themes: ['animals','space','baking','sports','ocean','dinosaurs','candy','music'],
  problems: [

    // ─── ANIMALS ──────────────────────────────────────────────────────────────

    {
      id: 'wp-001',
      skill: 'add',
      grade: 3,
      theme: 'animals',
      template: 'A zoo has {a} monkeys and {b} parrots. How many animals in all? 🐒🦜',
      vars: { a:[12,45], b:[10,40] },
      answerExpr: 'a + b',
      steps: [
        'We want the TOTAL of two groups, so we ADD. ➕',
        'Set up: {a} + {b}.',
        'Count them up: {answer} animals total! 🎉'
      ]
    },
    {
      id: 'wp-002',
      skill: 'sub',
      grade: 3,
      theme: 'animals',
      template: 'A farm had {a} chickens. A fox took {b} away. How many chickens are left? 🐔',
      vars: { a:[30,60], b:[5,20] },
      answerExpr: 'a - b',
      steps: [
        'We are finding what is LEFT after some are taken away, so we SUBTRACT. ➖',
        'Write: {a} − {b}.',
        'There are {answer} chickens left on the farm. 🌾'
      ]
    },
    {
      id: 'wp-003',
      skill: 'mult',
      grade: 3,
      theme: 'animals',
      template: 'There are {a} dogs. Each dog has {b} puppies. How many puppies are there in all? 🐶',
      vars: { a:[3,9], b:[2,8] },
      answerExpr: 'a * b',
      steps: [
        'We have {a} EQUAL groups of {b} puppies, so we MULTIPLY. ✖️',
        'Write: {a} × {b}.',
        'That makes {answer} puppies altogether! 🐾'
      ]
    },
    {
      id: 'wp-004',
      skill: 'div',
      grade: 4,
      theme: 'animals',
      template: '{a} butterflies land on {b} flowers equally. How many butterflies are on each flower? 🦋🌸',
      vars: { a:[12,60], b:[2,10] },
      answerExpr: 'a / b',
      steps: [
        'We are sharing equally, so we DIVIDE. ➗',
        'Write: {a} ÷ {b}.',
        'Each flower has {answer} butterflies. 🌺'
      ]
    },
    {
      id: 'wp-005',
      skill: 'fractionOfNum',
      grade: 4,
      theme: 'animals',
      template: 'A shelter has {a} cats. {b}/{c} of them are kittens. How many cats are kittens? 🐱',
      vars: { a:[12,36], b:[1,3], c:[3,6] },
      answerExpr: '(a / c) * b',
      steps: [
        'To find a fraction OF a number, we divide by the denominator first, then multiply by the numerator.',
        'Step 1 — Divide: {a} ÷ {c} = {a}/{c}.',
        'Step 2 — Multiply: ({a}/{c}) × {b}.',
        '{answer} cats are kittens! 🐾'
      ]
    },
    {
      id: 'wp-006',
      skill: 'perimeterArea',
      grade: 3,
      theme: 'animals',
      template: 'A rabbit pen is {a} meters long and {b} meters wide. What is the perimeter of the pen? 🐰',
      vars: { a:[4,12], b:[3,9] },
      answerExpr: '2 * (a + b)',
      steps: [
        'Perimeter is the distance all the way AROUND a shape. 📏',
        'For a rectangle: P = 2 × (length + width).',
        '2 × ({a} + {b}) = 2 × {a+b}... wait — let\'s just compute: {answer} meters around the pen. 🌿'
      ]
    },

    // ─── SPACE ────────────────────────────────────────────────────────────────

    {
      id: 'wp-007',
      skill: 'add',
      grade: 3,
      theme: 'space',
      template: 'An astronaut collected {a} moon rocks on Monday and {b} moon rocks on Tuesday. How many rocks in all? 🌕🪨',
      vars: { a:[15,80], b:[10,75] },
      answerExpr: 'a + b',
      steps: [
        'We want the TOTAL rocks, so we ADD. ➕',
        '{a} + {b} = ?',
        'The astronaut has {answer} moon rocks! 🚀'
      ]
    },
    {
      id: 'wp-008',
      skill: 'mult',
      grade: 4,
      theme: 'space',
      template: 'A spaceship visits {a} planets. On each planet it finds {b} moons. How many moons in all? 🪐',
      vars: { a:[3,9], b:[2,8] },
      answerExpr: 'a * b',
      steps: [
        'There are {a} equal groups of {b} moons — that means we MULTIPLY. ✖️',
        '{a} × {b} = ?',
        'The spaceship found {answer} moons total! 🌙'
      ]
    },
    {
      id: 'wp-009',
      skill: 'sub',
      grade: 3,
      theme: 'space',
      template: 'A rocket had {a} stars stickers. The pilot gave away {b}. How many stickers remain? ⭐',
      vars: { a:[40,99], b:[5,30] },
      answerExpr: 'a - b',
      steps: [
        'We are finding what REMAINS after giving some away — SUBTRACT. ➖',
        '{a} − {b} = ?',
        '{answer} star stickers are left! 🌟'
      ]
    },
    {
      id: 'wp-010',
      skill: 'div',
      grade: 4,
      theme: 'space',
      template: '{a} space explorers split into {b} equal crews. How many explorers are in each crew? 👨‍🚀',
      vars: { a:[20,60], b:[2,6] },
      answerExpr: 'a / b',
      steps: [
        'We split into EQUAL groups — that is DIVISION. ➗',
        '{a} ÷ {b} = ?',
        'Each crew has {answer} explorers. 🚀'
      ]
    },
    {
      id: 'wp-011',
      skill: 'percent',
      grade: 6,
      theme: 'space',
      template: 'A space mission lasts {a} days. The crew spends {b}% of the time doing experiments. How many days are spent on experiments? 🔬',
      vars: { a:[100,200], b:[10,50] },
      answerExpr: '(a * b) / 100',
      steps: [
        'To find a percent OF a number, multiply and then divide by 100.',
        '{a} × {b} ÷ 100 = ?',
        'The crew spends {answer} days on experiments! 🛸'
      ]
    },
    {
      id: 'wp-012',
      skill: 'ratio',
      grade: 6,
      theme: 'space',
      template: 'A space station has {a} robots and {b} humans. What is the ratio of robots to humans? Write it as robots : humans. 🤖',
      vars: { a:[2,8], b:[1,5] },
      answerExpr: 'a / b',
      steps: [
        'A RATIO compares two quantities.',
        'Robots : Humans = {a} : {b}.',
        'The ratio of robots to humans is {a} : {b}. (The answer value shows {a}/{b} = {answer}.) 🚀'
      ]
    },

    // ─── BAKING ───────────────────────────────────────────────────────────────

    {
      id: 'wp-013',
      skill: 'add',
      grade: 3,
      theme: 'baking',
      template: 'Maya baked {a} chocolate cookies and {b} vanilla cookies. How many cookies did she bake in all? 🍪',
      vars: { a:[12,48], b:[10,40] },
      answerExpr: 'a + b',
      steps: [
        'We want the TOTAL number of cookies, so we ADD. ➕',
        '{a} + {b} = ?',
        'Maya baked {answer} cookies! 🎉'
      ]
    },
    {
      id: 'wp-014',
      skill: 'mult',
      grade: 3,
      theme: 'baking',
      template: 'A baker makes {a} trays of muffins. Each tray holds {b} muffins. How many muffins are there in all? 🧁',
      vars: { a:[3,8], b:[6,12] },
      answerExpr: 'a * b',
      steps: [
        'We have {a} equal trays of {b} muffins — MULTIPLY. ✖️',
        '{a} × {b} = ?',
        'There are {answer} muffins in all! 🥐'
      ]
    },
    {
      id: 'wp-015',
      skill: 'fractionAddSub',
      grade: 4,
      theme: 'baking',
      template: 'A recipe needs {a}/{c} cup of sugar and {b}/{c} cup of brown sugar. How much sugar in all? 🍬',
      vars: { a:[1,3], b:[1,3], c:[4,8] },
      answerExpr: '(a + b) / c',
      steps: [
        'The fractions have the SAME denominator, so we just add the numerators! 🎂',
        '{a}/{c} + {b}/{c} = ({a}+{b})/{c}.',
        'That is {answer} cups of sugar in total. 🥣'
      ]
    },
    {
      id: 'wp-016',
      skill: 'sub',
      grade: 3,
      theme: 'baking',
      template: 'A bakery made {a} cupcakes in the morning. By noon they sold {b} cupcakes. How many are left? 🧁',
      vars: { a:[40,90], b:[10,35] },
      answerExpr: 'a - b',
      steps: [
        'We are finding what is LEFT after sales — SUBTRACT. ➖',
        '{a} − {b} = ?',
        'There are {answer} cupcakes left! 🎊'
      ]
    },
    {
      id: 'wp-017',
      skill: 'money',
      grade: 3,
      theme: 'baking',
      template: 'A cake costs ${a}. Liam pays with a ${b} bill. How much change does he get? 💵',
      vars: { a:[3,15], b:[5,20] },
      answerExpr: 'b - a',
      steps: [
        'To find CHANGE, subtract the price from the amount paid. 💰',
        '${b} − ${a} = ?',
        'Liam gets ${answer} change. 🎂'
      ]
    },
    {
      id: 'wp-018',
      skill: 'fractionOfNum',
      grade: 5,
      theme: 'baking',
      template: 'A recipe makes {a} cookies. Zoe gives away {b}/{c} of them to her friends. How many cookies does Zoe give away? 🍪',
      vars: { a:[24,48], b:[1,3], c:[4,6] },
      answerExpr: '(a / c) * b',
      steps: [
        'To find a fraction OF a number, divide first, then multiply. 🔢',
        'Step 1: {a} ÷ {c} = {a/c} (find one part).',
        'Step 2: {a/c} × {b} = ?',
        'Zoe gives away {answer} cookies! 🎁'
      ]
    },

    // ─── SPORTS ───────────────────────────────────────────────────────────────

    {
      id: 'wp-019',
      skill: 'add',
      grade: 3,
      theme: 'sports',
      template: 'A basketball team scored {a} points in the first half and {b} points in the second half. What was their total score? 🏀',
      vars: { a:[20,55], b:[15,50] },
      answerExpr: 'a + b',
      steps: [
        'Total score means we ADD both halves. ➕',
        '{a} + {b} = ?',
        'The team scored {answer} points! 🏆'
      ]
    },
    {
      id: 'wp-020',
      skill: 'sub',
      grade: 3,
      theme: 'sports',
      template: 'A soccer team played {a} games this season and lost {b} of them. How many games did they NOT lose? ⚽',
      vars: { a:[20,40], b:[2,12] },
      answerExpr: 'a - b',
      steps: [
        'We subtract the losses from total games to find wins + ties. ➖',
        '{a} − {b} = ?',
        'They did NOT lose {answer} games! 🥅'
      ]
    },
    {
      id: 'wp-021',
      skill: 'mult',
      grade: 4,
      theme: 'sports',
      template: 'A swim team has {a} swimmers. Each swimmer swims {b} laps at practice. How many laps in all? 🏊',
      vars: { a:[4,12], b:[5,10] },
      answerExpr: 'a * b',
      steps: [
        '{a} swimmers each swim {b} laps — equal groups means MULTIPLY. ✖️',
        '{a} × {b} = ?',
        'The team swam {answer} laps in all! 💦'
      ]
    },
    {
      id: 'wp-022',
      skill: 'div',
      grade: 4,
      theme: 'sports',
      template: '{a} kids sign up for a tennis tournament. They are split into groups of {b}. How many groups are there? 🎾',
      vars: { a:[24,60], b:[3,6] },
      answerExpr: 'a / b',
      steps: [
        'We are splitting into equal groups — that is DIVISION. ➗',
        '{a} ÷ {b} = ?',
        'There are {answer} groups! 🏅'
      ]
    },
    {
      id: 'wp-023',
      skill: 'time',
      grade: 3,
      theme: 'sports',
      template: 'Baseball practice starts at {a}:00 and ends at {b}:00. How many hours long is practice? ⚾',
      vars: { a:[1,4], b:[3,7] },
      answerExpr: 'b - a',
      steps: [
        'To find elapsed time, subtract the start time from the end time. ⏰',
        '{b}:00 − {a}:00 = ?',
        'Practice is {answer} hours long! 🧢'
      ]
    },
    {
      id: 'wp-024',
      skill: 'percent',
      grade: 6,
      theme: 'sports',
      template: 'A basketball player took {a} free throws and made {b}% of them. How many free throws did she make? 🏀',
      vars: { a:[50,100], b:[60,90] },
      answerExpr: '(a * b) / 100',
      steps: [
        'Percent of a number: multiply by the percent then divide by 100.',
        '{a} × {b} ÷ 100 = ?',
        'She made {answer} free throws! 🎯'
      ]
    },

    // ─── OCEAN ────────────────────────────────────────────────────────────────

    {
      id: 'wp-025',
      skill: 'add',
      grade: 3,
      theme: 'ocean',
      template: 'Divers saw {a} fish on Monday and {b} fish on Tuesday. How many fish did they see in all? 🐠',
      vars: { a:[25,85], b:[15,70] },
      answerExpr: 'a + b',
      steps: [
        'We want the TOTAL fish — ADD. ➕',
        '{a} + {b} = ?',
        'The divers saw {answer} fish in all! 🌊'
      ]
    },
    {
      id: 'wp-026',
      skill: 'mult',
      grade: 3,
      theme: 'ocean',
      template: 'An octopus has {b} arms. There are {a} octopuses. How many arms in all? 🐙',
      vars: { a:[3,9], b:[8,8] },
      answerExpr: 'a * b',
      steps: [
        'Each octopus has {b} arms and there are {a} of them — MULTIPLY. ✖️',
        '{a} × {b} = ?',
        'That is {answer} octopus arms! 🦑'
      ]
    },
    {
      id: 'wp-027',
      skill: 'sub',
      grade: 4,
      theme: 'ocean',
      template: 'A coral reef had {a} different fish species. Scientists found that {b} species had moved away. How many species remain? 🐡',
      vars: { a:[80,150], b:[10,40] },
      answerExpr: 'a - b',
      steps: [
        'We need to find what REMAINS — SUBTRACT. ➖',
        '{a} − {b} = ?',
        '{answer} species still live on the reef. 🪸'
      ]
    },
    {
      id: 'wp-028',
      skill: 'div',
      grade: 4,
      theme: 'ocean',
      template: 'A marine biologist has {a} sea turtle eggs to place equally into {b} nests. How many eggs per nest? 🐢',
      vars: { a:[20,80], b:[4,8] },
      answerExpr: 'a / b',
      steps: [
        'We share equally among {b} nests — DIVIDE. ➗',
        '{a} ÷ {b} = ?',
        'Each nest gets {answer} eggs. 🏖️'
      ]
    },
    {
      id: 'wp-029',
      skill: 'ratio',
      grade: 6,
      theme: 'ocean',
      template: 'In a tide pool there are {a} crabs and {b} starfish. What is the ratio of crabs to starfish? 🦀⭐',
      vars: { a:[3,9], b:[1,4] },
      answerExpr: 'a / b',
      steps: [
        'A ratio compares two amounts.',
        'Crabs : Starfish = {a} : {b}.',
        'The ratio is {a} : {b}. (Decimal form: {answer}.) 🌊'
      ]
    },
    {
      id: 'wp-030',
      skill: 'perimeterArea',
      grade: 4,
      theme: 'ocean',
      template: 'A rectangular aquarium tank is {a} feet long and {b} feet wide. What is the area of the bottom of the tank? 🦈',
      vars: { a:[5,15], b:[3,10] },
      answerExpr: 'a * b',
      steps: [
        'Area of a rectangle = length × width. 📐',
        '{a} × {b} = ?',
        'The bottom of the tank has an area of {answer} square feet. 🐟'
      ]
    },

    // ─── DINOSAURS ────────────────────────────────────────────────────────────

    {
      id: 'wp-031',
      skill: 'add',
      grade: 3,
      theme: 'dinosaurs',
      template: 'Paleontologists found {a} dinosaur bones in the morning and {b} more in the afternoon. How many bones were found in all? 🦕',
      vars: { a:[30,90], b:[20,60] },
      answerExpr: 'a + b',
      steps: [
        'Finding more means our total GROWS — ADD. ➕',
        '{a} + {b} = ?',
        'They found {answer} dinosaur bones in all! 🦴'
      ]
    },
    {
      id: 'wp-032',
      skill: 'mult',
      grade: 4,
      theme: 'dinosaurs',
      template: 'A T-Rex needed {b} pounds of meat each day. How many pounds would it eat in {a} days? 🦖',
      vars: { a:[5,9], b:[10,30] },
      answerExpr: 'a * b',
      steps: [
        '{a} days of {b} pounds each — equal groups, so MULTIPLY. ✖️',
        '{a} × {b} = ?',
        'The T-Rex would eat {answer} pounds! 🍖'
      ]
    },
    {
      id: 'wp-033',
      skill: 'sub',
      grade: 3,
      theme: 'dinosaurs',
      template: 'A dinosaur herd had {a} members. After a big storm, only {b} were left. How many dinosaurs were lost? 🦕',
      vars: { a:[50,120], b:[20,80] },
      answerExpr: 'a - b',
      steps: [
        'We need to find how many were LOST — SUBTRACT. ➖',
        '{a} − {b} = ?',
        '{answer} dinosaurs were lost in the storm. 🌩️'
      ]
    },
    {
      id: 'wp-034',
      skill: 'div',
      grade: 5,
      theme: 'dinosaurs',
      template: 'Scientists dug up {a} dinosaur eggs spread evenly across {b} dig sites. How many eggs were at each site? 🥚',
      vars: { a:[30,90], b:[3,9] },
      answerExpr: 'a / b',
      steps: [
        'Eggs spread evenly means DIVIDE. ➗',
        '{a} ÷ {b} = ?',
        'There were {answer} eggs at each dig site! 🦕'
      ]
    },
    {
      id: 'wp-035',
      skill: 'fractionAddSub',
      grade: 5,
      theme: 'dinosaurs',
      template: 'A museum display shows that {a}/{c} of the dinosaurs are herbivores and {b}/{c} are carnivores. How much of the display do these two groups make together? 🦖🌿',
      vars: { a:[2,4], b:[1,3], c:[8,10] },
      answerExpr: '(a + b) / c',
      steps: [
        'Same denominator — just add the numerators! 🔢',
        '{a}/{c} + {b}/{c} = ({a}+{b})/{c}.',
        'Together they make up {answer} of the display. 🏛️'
      ]
    },
    {
      id: 'wp-036',
      skill: 'perimeterArea',
      grade: 4,
      theme: 'dinosaurs',
      template: 'A dinosaur enclosure at a theme park is {a} yards long and {b} yards wide. What is the perimeter of the enclosure? 🦕',
      vars: { a:[10,25], b:[6,18] },
      answerExpr: '2 * (a + b)',
      steps: [
        'Perimeter is the distance ALL THE WAY AROUND. 📏',
        'Formula: P = 2 × (length + width).',
        '2 × ({a} + {b}) = {answer} yards. 🌿'
      ]
    },

    // ─── CANDY ────────────────────────────────────────────────────────────────

    {
      id: 'wp-037',
      skill: 'add',
      grade: 3,
      theme: 'candy',
      template: 'On Halloween, Sofia collected {a} lollipops and {b} chocolate bars. How many pieces of candy does she have? 🍬',
      vars: { a:[15,55], b:[10,45] },
      answerExpr: 'a + b',
      steps: [
        'We want the TOTAL candy — ADD. ➕',
        '{a} + {b} = ?',
        'Sofia has {answer} pieces of candy! 🎃'
      ]
    },
    {
      id: 'wp-038',
      skill: 'sub',
      grade: 3,
      theme: 'candy',
      template: 'A candy shop had {a} gummy bears. Kids bought {b} of them. How many gummy bears are left? 🐻',
      vars: { a:[80,150], b:[20,60] },
      answerExpr: 'a - b',
      steps: [
        'When some are bought, the total gets SMALLER — SUBTRACT. ➖',
        '{a} − {b} = ?',
        '{answer} gummy bears are left in the shop! 🍬'
      ]
    },
    {
      id: 'wp-039',
      skill: 'mult',
      grade: 3,
      theme: 'candy',
      template: 'A bag of candy has {b} pieces. There are {a} bags. How many pieces of candy in all? 🍭',
      vars: { a:[4,10], b:[5,12] },
      answerExpr: 'a * b',
      steps: [
        '{a} bags with {b} pieces each — MULTIPLY. ✖️',
        '{a} × {b} = ?',
        'There are {answer} pieces of candy! 🍫'
      ]
    },
    {
      id: 'wp-040',
      skill: 'div',
      grade: 4,
      theme: 'candy',
      template: '{a} pieces of candy are shared equally among {b} kids. How many pieces does each kid get? 🍬',
      vars: { a:[24,72], b:[3,9] },
      answerExpr: 'a / b',
      steps: [
        'Sharing EQUALLY means we DIVIDE. ➗',
        '{a} ÷ {b} = ?',
        'Each kid gets {answer} pieces! 🎉'
      ]
    },
    {
      id: 'wp-041',
      skill: 'money',
      grade: 3,
      theme: 'candy',
      template: 'Aiden wants to buy a candy bar for ${a} and a lollipop for ${b}. How much does he spend altogether? 🍫',
      vars: { a:[1,5], b:[1,4] },
      answerExpr: 'a + b',
      steps: [
        'We ADD the two prices to find the total cost. 💰',
        '${a} + ${b} = ?',
        'Aiden spends ${answer} in all! 🍬'
      ]
    },
    {
      id: 'wp-042',
      skill: 'percent',
      grade: 6,
      theme: 'candy',
      template: 'A bag has {a} pieces of candy. {b}% are chocolate. How many pieces are chocolate? 🍫',
      vars: { a:[50,200], b:[20,80] },
      answerExpr: '(a * b) / 100',
      steps: [
        'Percent of a number: multiply then divide by 100. 🔢',
        '{a} × {b} ÷ 100 = ?',
        '{answer} pieces are chocolate! 🍭'
      ]
    },
    {
      id: 'wp-043',
      skill: 'ratio',
      grade: 6,
      theme: 'candy',
      template: 'In a candy mix there are {a} red pieces for every {b} blue pieces. What is the ratio of red to blue? 🔴🔵',
      vars: { a:[2,8], b:[1,4] },
      answerExpr: 'a / b',
      steps: [
        'A ratio shows how two amounts COMPARE.',
        'Red : Blue = {a} : {b}.',
        'The ratio of red to blue is {a} : {b}. 🍬'
      ]
    },

    // ─── MUSIC ────────────────────────────────────────────────────────────────

    {
      id: 'wp-044',
      skill: 'add',
      grade: 3,
      theme: 'music',
      template: 'A school band has {a} woodwind players and {b} brass players. How many band members are there in all? 🎷🎺',
      vars: { a:[12,35], b:[8,25] },
      answerExpr: 'a + b',
      steps: [
        'We want the TOTAL number of players — ADD. ➕',
        '{a} + {b} = ?',
        'There are {answer} band members in all! 🎶'
      ]
    },
    {
      id: 'wp-045',
      skill: 'sub',
      grade: 3,
      theme: 'music',
      template: 'A concert hall sold {a} tickets. {b} people showed up late and missed the opening. How many were on time? 🎵',
      vars: { a:[200,500], b:[20,80] },
      answerExpr: 'a - b',
      steps: [
        'We subtract the late arrivals from total tickets. ➖',
        '{a} − {b} = ?',
        '{answer} people were on time! 🎤'
      ]
    },
    {
      id: 'wp-046',
      skill: 'mult',
      grade: 4,
      theme: 'music',
      template: 'A music class practices {b} songs each week. How many songs will the class practice in {a} weeks? 🎵',
      vars: { a:[4,10], b:[3,8] },
      answerExpr: 'a * b',
      steps: [
        '{a} weeks of {b} songs each — MULTIPLY. ✖️',
        '{a} × {b} = ?',
        'The class will practice {answer} songs! 🎼'
      ]
    },
    {
      id: 'wp-047',
      skill: 'div',
      grade: 5,
      theme: 'music',
      template: 'A choir has {a} members split evenly into {b} groups for a performance. How many singers are in each group? 🎤',
      vars: { a:[30,80], b:[5,10] },
      answerExpr: 'a / b',
      steps: [
        'Splitting evenly means DIVIDE. ➗',
        '{a} ÷ {b} = ?',
        'Each group has {answer} singers! 🎶'
      ]
    },
    {
      id: 'wp-048',
      skill: 'fractionAddSub',
      grade: 5,
      theme: 'music',
      template: 'Elena practiced piano for {a}/{c} of an hour on Monday and {b}/{c} of an hour on Tuesday. How much total time did she practice? 🎹',
      vars: { a:[1,3], b:[1,3], c:[4,6] },
      answerExpr: '(a + b) / c',
      steps: [
        'Same denominator — add the numerators. ➕',
        '{a}/{c} + {b}/{c} = ({a}+{b})/{c} hours.',
        'Elena practiced {answer} hours in all! 🎵'
      ]
    },
    {
      id: 'wp-049',
      skill: 'time',
      grade: 3,
      theme: 'music',
      template: 'A song starts at {a}:00 and ends at {b}:00. How many hours long is the concert? 🎸',
      vars: { a:[6,8], b:[9,11] },
      answerExpr: 'b - a',
      steps: [
        'Elapsed time = end time − start time. ⏰',
        '{b}:00 − {a}:00 = ?',
        'The concert is {answer} hours long! 🎶'
      ]
    },
    {
      id: 'wp-050',
      skill: 'money',
      grade: 4,
      theme: 'music',
      template: 'A guitar lesson costs ${a}. Marcus pays with a ${b} bill. How much change does he get? 🎸',
      vars: { a:[8,18], b:[20,20] },
      answerExpr: 'b - a',
      steps: [
        'Change = amount paid − price. 💵',
        '${b} − ${a} = ?',
        'Marcus gets ${answer} change! 🎵'
      ]
    },

    // ─── ADDITIONAL PROBLEMS (reaching 60+) ──────────────────────────────────

    // More animals
    {
      id: 'wp-051',
      skill: 'fractionAddSub',
      grade: 5,
      theme: 'animals',
      template: 'A nature trail has {a}/{c} miles of bird-watching path and {b}/{c} miles of mammal-watching path. How long is the trail in total? 🐦🦌',
      vars: { a:[2,5], b:[1,4], c:[8,10] },
      answerExpr: '(a + b) / c',
      steps: [
        'Same denominator — add numerators. ➕',
        '{a}/{c} + {b}/{c} = ({a}+{b})/{c} miles.',
        'The full trail is {answer} miles long! 🌿'
      ]
    },
    {
      id: 'wp-052',
      skill: 'money',
      grade: 3,
      theme: 'animals',
      template: 'At a petting zoo, Emma buys food for animals. One bag costs ${a} and another costs ${b}. How much does she spend in total? 🐐',
      vars: { a:[2,7], b:[1,5] },
      answerExpr: 'a + b',
      steps: [
        'We ADD the costs together to find the total. 💰',
        '${a} + ${b} = ?',
        'Emma spends ${answer} in total! 🐑'
      ]
    },

    // More space
    {
      id: 'wp-053',
      skill: 'fractionOfNum',
      grade: 5,
      theme: 'space',
      template: 'A space station has {a} rooms. {b}/{c} of them are living quarters. How many rooms are living quarters? 🚀',
      vars: { a:[24,48], b:[1,2], c:[3,6] },
      answerExpr: '(a / c) * b',
      steps: [
        'Fraction of a number: divide by denominator, multiply by numerator.',
        '{a} ÷ {c} = {a/c} (one part).',
        '{a/c} × {b} = ?',
        'There are {answer} living-quarter rooms! 🛸'
      ]
    },
    {
      id: 'wp-054',
      skill: 'perimeterArea',
      grade: 5,
      theme: 'space',
      template: 'A rectangular solar panel on a satellite is {a} meters long and {b} meters wide. What is its area? ☀️',
      vars: { a:[6,14], b:[4,10] },
      answerExpr: 'a * b',
      steps: [
        'Area = length × width. 📐',
        '{a} × {b} = ?',
        'The solar panel\'s area is {answer} square meters! 🛰️'
      ]
    },

    // More baking
    {
      id: 'wp-055',
      skill: 'ratio',
      grade: 6,
      theme: 'baking',
      template: 'A cookie recipe uses {a} cups of flour for every {b} cups of sugar. What is the ratio of flour to sugar? 🍪',
      vars: { a:[3,6], b:[1,2] },
      answerExpr: 'a / b',
      steps: [
        'A ratio compares two quantities in a recipe.',
        'Flour : Sugar = {a} : {b}.',
        'The ratio is {a} : {b}. 🧁'
      ]
    },
    {
      id: 'wp-056',
      skill: 'div',
      grade: 3,
      theme: 'baking',
      template: 'A baker has {a} cookies to put equally into {b} bags. How many cookies go in each bag? 🍪',
      vars: { a:[20,60], b:[4,10] },
      answerExpr: 'a / b',
      steps: [
        'Sharing equally means DIVIDE. ➗',
        '{a} ÷ {b} = ?',
        'Each bag gets {answer} cookies! 🎁'
      ]
    },

    // More ocean
    {
      id: 'wp-057',
      skill: 'fractionOfNum',
      grade: 5,
      theme: 'ocean',
      template: 'A beach has {a} seashells. {b}/{c} of them are spiral shells. How many spiral shells are there? 🐚',
      vars: { a:[30,60], b:[1,2], c:[3,5] },
      answerExpr: '(a / c) * b',
      steps: [
        'Fraction of a number: divide by the bottom number, multiply by the top number.',
        '{a} ÷ {c} = {a/c}.',
        '{a/c} × {b} = ?',
        'There are {answer} spiral shells! 🌊'
      ]
    },
    {
      id: 'wp-058',
      skill: 'money',
      grade: 4,
      theme: 'ocean',
      template: 'At a beach shop, a surfboard rental costs ${a} and sunscreen costs ${b}. How much does it cost altogether? 🏄',
      vars: { a:[10,18], b:[3,8] },
      answerExpr: 'a + b',
      steps: [
        'We ADD the two prices. 💰',
        '${a} + ${b} = ?',
        'It costs ${answer} in all! 🌊'
      ]
    },

    // More sports
    {
      id: 'wp-059',
      skill: 'fractionOfNum',
      grade: 5,
      theme: 'sports',
      template: 'A track team has {a} runners. {b}/{c} of them run the 100-meter dash. How many run the 100-meter dash? 🏃',
      vars: { a:[20,40], b:[1,3], c:[4,5] },
      answerExpr: '(a / c) * b',
      steps: [
        'Find the fraction of the total runners.',
        'Step 1: {a} ÷ {c} = {a/c}.',
        'Step 2: {a/c} × {b} = ?',
        '{answer} runners compete in the 100-meter dash! 🏅'
      ]
    },
    {
      id: 'wp-060',
      skill: 'ratio',
      grade: 6,
      theme: 'sports',
      template: 'A baseball team wins {a} games for every {b} games they lose. What is the win-to-loss ratio? ⚾',
      vars: { a:[3,7], b:[1,3] },
      answerExpr: 'a / b',
      steps: [
        'A ratio compares wins to losses.',
        'Win : Loss = {a} : {b}.',
        'The win-to-loss ratio is {a} : {b}! 🏆'
      ]
    },

    // More dinosaurs
    {
      id: 'wp-061',
      skill: 'money',
      grade: 3,
      theme: 'dinosaurs',
      template: 'Dino Museum tickets cost ${a} each. How much do {b} tickets cost in all? 🦕',
      vars: { a:[5,12], b:[2,8] },
      answerExpr: 'a * b',
      steps: [
        'Repeated equal costs → MULTIPLY. ✖️',
        '${a} × {b} = ?',
        '{b} tickets cost ${answer} in all! 🏛️'
      ]
    },
    {
      id: 'wp-062',
      skill: 'fractionOfNum',
      grade: 6,
      theme: 'dinosaurs',
      template: 'A fossil collection has {a} fossils. {b}/{c} of them are from the Jurassic period. How many are Jurassic fossils? 🦴',
      vars: { a:[36,60], b:[1,2], c:[3,4] },
      answerExpr: '(a / c) * b',
      steps: [
        'Fraction of a set: divide by the denominator, then multiply by the numerator.',
        '{a} ÷ {c} = {a/c}.',
        '{a/c} × {b} = {answer} Jurassic fossils! 🦖'
      ]
    },

    // More candy
    {
      id: 'wp-063',
      skill: 'fractionAddSub',
      grade: 6,
      theme: 'candy',
      template: 'A jar is {a}/{c} full of gummy worms. After Leo eats some, the jar is only {b}/{c} full. How much did Leo eat? 🐛',
      vars: { a:[5,7], b:[1,3], c:[8,10] },
      answerExpr: '(a - b) / c',
      steps: [
        'We SUBTRACT fractions to find how much was eaten.',
        '{a}/{c} − {b}/{c} = ({a}−{b})/{c}.',
        'Leo ate {answer} of a jar of gummy worms! 🍬'
      ]
    },
    {
      id: 'wp-064',
      skill: 'perimeterArea',
      grade: 4,
      theme: 'candy',
      template: 'A candy store has a rectangular display case that is {a} feet long and {b} feet wide. What is the area of the display case? 🍭',
      vars: { a:[5,12], b:[3,8] },
      answerExpr: 'a * b',
      steps: [
        'Area of a rectangle = length × width. 📐',
        '{a} × {b} = ?',
        'The display case has an area of {answer} square feet! 🍫'
      ]
    },

    // More music
    {
      id: 'wp-065',
      skill: 'perimeterArea',
      grade: 3,
      theme: 'music',
      template: 'A stage is {a} meters long and {b} meters wide. What is the perimeter of the stage? 🎸',
      vars: { a:[8,20], b:[5,15] },
      answerExpr: '2 * (a + b)',
      steps: [
        'Perimeter = 2 × (length + width). 📏',
        '2 × ({a} + {b}) = 2 × {a+b}... computing: {answer} meters.',
        'The stage perimeter is {answer} meters! 🎶'
      ]
    },
    {
      id: 'wp-066',
      skill: 'percent',
      grade: 6,
      theme: 'music',
      template: 'A music store has {a} instruments. {b}% of them are guitars. How many guitars does the store have? 🎸',
      vars: { a:[100,300], b:[20,60] },
      answerExpr: '(a * b) / 100',
      steps: [
        'Percent of a number: multiply by percent then divide by 100.',
        '{a} × {b} ÷ 100 = ?',
        'The store has {answer} guitars! 🎵'
      ]
    },

    // Extra coverage problems for variety

    {
      id: 'wp-067',
      skill: 'time',
      grade: 4,
      theme: 'baking',
      template: 'A cake goes in the oven at {a}:00 and needs {b} hours to bake. What time will it be done? 🎂',
      vars: { a:[1,4], b:[1,3] },
      answerExpr: 'a + b',
      steps: [
        'Add the baking time to the start time. ⏰',
        '{a}:00 + {b} hours = ?',
        'The cake will be done at {answer}:00! 🍰'
      ]
    },
    {
      id: 'wp-068',
      skill: 'add',
      grade: 4,
      theme: 'dinosaurs',
      template: 'A museum display shows fossils from {a} dinosaur species in Wing A and {b} species in Wing B. How many species are shown in all? 🦖',
      vars: { a:[120,300], b:[80,200] },
      answerExpr: 'a + b',
      steps: [
        'We want the TOTAL species — ADD both wings. ➕',
        '{a} + {b} = ?',
        'The museum shows {answer} dinosaur species! 🦴'
      ]
    },
    {
      id: 'wp-069',
      skill: 'fractionAddSub',
      grade: 4,
      theme: 'ocean',
      template: 'A fish tank is {a}/{c} full of water in the morning. By evening, {b}/{c} more water is added. How full is the tank now? 🐠',
      vars: { a:[2,4], b:[1,3], c:[8,10] },
      answerExpr: '(a + b) / c',
      steps: [
        'We ADD fractions with the same denominator.',
        '{a}/{c} + {b}/{c} = ({a}+{b})/{c}.',
        'The tank is now {answer} full! 🌊'
      ]
    },
    {
      id: 'wp-070',
      skill: 'perimeterArea',
      grade: 5,
      theme: 'sports',
      template: 'A basketball court is {a} meters long and {b} meters wide. What is the area of the court? 🏀',
      vars: { a:[25,30], b:[12,16] },
      answerExpr: 'a * b',
      steps: [
        'Area = length × width. 📐',
        '{a} × {b} = ?',
        'The basketball court has an area of {answer} square meters! 🏆'
      ]
    },
    {
      id: 'wp-071',
      skill: 'mult',
      grade: 5,
      theme: 'candy',
      template: 'A candy factory makes {a} bags of gummies every hour. How many bags does it make in {b} hours? 🍬',
      vars: { a:[120,350], b:[5,12] },
      answerExpr: 'a * b',
      steps: [
        '{b} equal hours of {a} bags each — MULTIPLY. ✖️',
        '{a} × {b} = ?',
        'The factory makes {answer} bags in {b} hours! 🏭'
      ]
    },
    {
      id: 'wp-072',
      skill: 'sub',
      grade: 5,
      theme: 'music',
      template: 'A famous singer released {a} songs over their career. {b} of those songs were sad ballads. How many songs were NOT ballads? 🎵',
      vars: { a:[80,150], b:[15,50] },
      answerExpr: 'a - b',
      steps: [
        'We SUBTRACT the ballads from the total songs. ➖',
        '{a} − {b} = ?',
        '{answer} songs were not ballads! 🎤'
      ]
    },
    {
      id: 'wp-073',
      skill: 'div',
      grade: 6,
      theme: 'space',
      template: 'A space telescope takes {a} photos over {b} days, taking the same number each day. How many photos does it take per day? 🔭',
      vars: { a:[60,180], b:[6,12] },
      answerExpr: 'a / b',
      steps: [
        'Equal amount each day — DIVIDE to find one day\'s count. ➗',
        '{a} ÷ {b} = ?',
        'The telescope takes {answer} photos per day! 🌌'
      ]
    },
    {
      id: 'wp-074',
      skill: 'fractionAddSub',
      grade: 6,
      theme: 'sports',
      template: 'A runner jogs {a}/{c} of a mile before breakfast and {b}/{c} of a mile after school. How far does the runner go in total? 🏃',
      vars: { a:[3,5], b:[2,4], c:[8,10] },
      answerExpr: '(a + b) / c',
      steps: [
        'Same denominator — add the numerators. ➕',
        '{a}/{c} + {b}/{c} = ({a}+{b})/{c} miles.',
        'The runner goes {answer} miles in total! 🥇'
      ]
    },
    {
      id: 'wp-075',
      skill: 'percent',
      grade: 6,
      theme: 'animals',
      template: 'A sanctuary has {a} animals. {b}% are birds. How many birds live at the sanctuary? 🐦',
      vars: { a:[200,500], b:[10,40] },
      answerExpr: '(a * b) / 100',
      steps: [
        'Percent of a total: multiply and divide by 100. 🔢',
        '{a} × {b} ÷ 100 = ?',
        'There are {answer} birds at the sanctuary! 🦅'
      ]
    }

  ]
};
