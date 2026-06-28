export default {

  // ─── BADGES ────────────────────────────────────────────────────────────────
  // trigger.kind ∈ 'lessonsCompleted' | 'problemsCorrect' | 'streakDays' |
  //   'skillsMastered' | 'strandMastered' | 'perfectQuiz' |
  //   'coinsEarned' | 'levelReached'
  badges: [

    // ── Early-win badges (first few sessions) ─────────────────────────────
    {
      id: 'first-steps',
      emoji: '🌟',
      name: 'First Steps',
      desc: 'You finished your very first lesson — awesome start!',
      trigger: { kind: 'lessonsCompleted', count: 1 }
    },
    {
      id: 'getting-started',
      emoji: '🚀',
      name: 'Blasting Off',
      desc: 'You got 10 problems right — you\'re on a roll!',
      trigger: { kind: 'problemsCorrect', count: 10 }
    },
    {
      id: 'first-skill',
      emoji: '🏅',
      name: 'Skill Unlocked',
      desc: 'You mastered your first skill — you\'re a math hero!',
      trigger: { kind: 'skillsMastered', count: 1 }
    },
    {
      id: 'perfect-start',
      emoji: '✨',
      name: 'Perfect Start',
      desc: 'You got a perfect quiz on your first try — incredible!',
      trigger: { kind: 'perfectQuiz', count: 1 }
    },
    {
      id: 'coin-collector',
      emoji: '🪙',
      name: 'Coin Collector',
      desc: 'You earned your first 50 coins — spend them in the shop!',
      trigger: { kind: 'coinsEarned', count: 50 }
    },

    // ── Lessons-completed milestones ───────────────────────────────────────
    {
      id: 'lesson-5',
      emoji: '📚',
      name: 'Bookworm',
      desc: 'Five lessons done — you love learning!',
      trigger: { kind: 'lessonsCompleted', count: 5 }
    },
    {
      id: 'lesson-10',
      emoji: '🎒',
      name: 'Study Buddy',
      desc: 'Ten lessons completed — you\'re becoming a math expert!',
      trigger: { kind: 'lessonsCompleted', count: 10 }
    },
    {
      id: 'lesson-25',
      emoji: '🎓',
      name: 'Graduate',
      desc: 'Twenty-five lessons! You\'ve worked so hard!',
      trigger: { kind: 'lessonsCompleted', count: 25 }
    },
    {
      id: 'lesson-50',
      emoji: '🏛️',
      name: 'Math Scholar',
      desc: 'Fifty whole lessons — you\'re a true math scholar!',
      trigger: { kind: 'lessonsCompleted', count: 50 }
    },

    // ── Problems-correct milestones ────────────────────────────────────────
    {
      id: 'problems-50',
      emoji: '🎯',
      name: 'Sharpshooter',
      desc: '50 correct answers — your aim is amazing!',
      trigger: { kind: 'problemsCorrect', count: 50 }
    },
    {
      id: 'problems-100',
      emoji: '💯',
      name: 'Century Club',
      desc: '100 problems correct — that\'s a century!',
      trigger: { kind: 'problemsCorrect', count: 100 }
    },
    {
      id: 'problems-250',
      emoji: '⚡',
      name: 'Lightning Brain',
      desc: '250 problems down — your brain is like lightning!',
      trigger: { kind: 'problemsCorrect', count: 250 }
    },
    {
      id: 'problems-500',
      emoji: '🔥',
      name: 'On Fire',
      desc: '500 correct answers — you are totally on fire!',
      trigger: { kind: 'problemsCorrect', count: 500 }
    },
    {
      id: 'problems-1000',
      emoji: '🏆',
      name: 'Math Champion',
      desc: '1000 problems solved — you\'re a true champion!',
      trigger: { kind: 'problemsCorrect', count: 1000 }
    },

    // ── Streak badges ──────────────────────────────────────────────────────
    {
      id: 'streak-3',
      emoji: '🌤️',
      name: 'Three Days Strong',
      desc: '3 days in a row — you\'re building great habits!',
      trigger: { kind: 'streakDays', count: 3 }
    },
    {
      id: 'streak-7',
      emoji: '🌈',
      name: 'Week Warrior',
      desc: 'A whole week without missing a day — wow!',
      trigger: { kind: 'streakDays', count: 7 }
    },
    {
      id: 'streak-14',
      emoji: '🌙',
      name: 'Two-Week Hero',
      desc: '14 days in a row — dedication superstar!',
      trigger: { kind: 'streakDays', count: 14 }
    },
    {
      id: 'streak-30',
      emoji: '🌞',
      name: 'Month Master',
      desc: '30 days straight — you never gave up!',
      trigger: { kind: 'streakDays', count: 30 }
    },

    // ── Skills-mastered milestones ─────────────────────────────────────────
    {
      id: 'skills-5',
      emoji: '🌿',
      name: 'Skill Sprout',
      desc: '5 skills mastered — you\'re growing fast!',
      trigger: { kind: 'skillsMastered', count: 5 }
    },
    {
      id: 'skills-10',
      emoji: '🌳',
      name: 'Knowledge Tree',
      desc: '10 skills mastered — strong roots, big branches!',
      trigger: { kind: 'skillsMastered', count: 10 }
    },
    {
      id: 'skills-20',
      emoji: '🦁',
      name: 'Skill King',
      desc: '20 skills mastered — you rule the math jungle!',
      trigger: { kind: 'skillsMastered', count: 20 }
    },

    // ── Perfect quiz streak ────────────────────────────────────────────────
    {
      id: 'perfect-3',
      emoji: '💎',
      name: 'Diamond Mind',
      desc: '3 perfect quizzes — flawless!',
      trigger: { kind: 'perfectQuiz', count: 3 }
    },
    {
      id: 'perfect-10',
      emoji: '👑',
      name: 'Quiz Royalty',
      desc: '10 perfect quizzes — you\'re quiz royalty!',
      trigger: { kind: 'perfectQuiz', count: 10 }
    },

    // ── Strand-mastered badges ─────────────────────────────────────────────
    {
      id: 'strand-numbers',
      emoji: '🔢',
      name: 'Number Ninja',
      desc: 'You mastered all of Numbers & Place Value — ninja approved!',
      trigger: { kind: 'strandMastered', strand: 'Numbers & Place Value' }
    },
    {
      id: 'strand-addition',
      emoji: '➕',
      name: 'Add-It-All',
      desc: 'You conquered Addition & Subtraction — nothing can stop you!',
      trigger: { kind: 'strandMastered', strand: 'Addition & Subtraction' }
    },
    {
      id: 'strand-multiplication',
      emoji: '✖️',
      name: 'Times-Table Titan',
      desc: 'Multiplication mastered — you\'re a Titan!',
      trigger: { kind: 'strandMastered', strand: 'Multiplication' }
    },
    {
      id: 'strand-division',
      emoji: '➗',
      name: 'Division Dragon',
      desc: 'Division mastered — the Division Dragon bows to you!',
      trigger: { kind: 'strandMastered', strand: 'Division' }
    },
    {
      id: 'strand-fractions',
      emoji: '🍕',
      name: 'Fraction Wizard',
      desc: 'Fractions mastered — you sliced every problem perfectly!',
      trigger: { kind: 'strandMastered', strand: 'Fractions' }
    },
    {
      id: 'strand-decimals',
      emoji: '🔵',
      name: 'Decimal Detective',
      desc: 'Decimals mastered — every point solved!',
      trigger: { kind: 'strandMastered', strand: 'Decimals' }
    },
    {
      id: 'strand-geometry',
      emoji: '📐',
      name: 'Shape Shifter',
      desc: 'Geometry & Measurement mastered — shapes have no secrets now!',
      trigger: { kind: 'strandMastered', strand: 'Geometry & Measurement' }
    },
    {
      id: 'strand-data',
      emoji: '📊',
      name: 'Pattern Poet',
      desc: 'Data & Patterns mastered — you see patterns everywhere!',
      trigger: { kind: 'strandMastered', strand: 'Data & Patterns' }
    },

    // ── Coins & level milestones ───────────────────────────────────────────
    {
      id: 'coins-200',
      emoji: '💰',
      name: 'Treasure Hunter',
      desc: '200 coins earned — you found the treasure!',
      trigger: { kind: 'coinsEarned', count: 200 }
    },
    {
      id: 'coins-500',
      emoji: '💎',
      name: 'Gem Hoarder',
      desc: '500 coins earned — your chest is overflowing!',
      trigger: { kind: 'coinsEarned', count: 500 }
    },
    {
      id: 'level-5',
      emoji: '⭐',
      name: 'Level Up Legend',
      desc: 'You reached Level 5 — you\'re a rising star!',
      trigger: { kind: 'levelReached', count: 5 }
    },
    {
      id: 'level-10',
      emoji: '🌠',
      name: 'Double Digits',
      desc: 'Level 10 reached — you\'re really something special!',
      trigger: { kind: 'levelReached', count: 10 }
    },
    {
      id: 'level-20',
      emoji: '🎆',
      name: 'Math Legend',
      desc: 'Level 20! You are an absolute Math Legend!',
      trigger: { kind: 'levelReached', count: 20 }
    },
    {
      id: 'mission-1',
      emoji: '🗺️',
      name: 'Quest Begun',
      desc: 'You finished your first mission — adventure awaits!',
      trigger: { kind: 'missionsDone', count: 1 }
    },
    {
      id: 'mission-25',
      emoji: '🏵️',
      name: 'Quest Champion',
      desc: '25 missions complete — you show up and get it done!',
      trigger: { kind: 'missionsDone', count: 25 }
    }
  ],

  // ─── SHOP ──────────────────────────────────────────────────────────────────
  // kind ∈ 'accessory' | 'pet' | 'theme' | 'background'
  shop: [

    // ── Cheap accessories (10–40 coins) ────────────────────────────────────
    { id: 'acc-glasses-star',    emoji: '🕶️', name: 'Star Shades',       cost: 10,  kind: 'accessory' },
    { id: 'acc-hat-party',       emoji: '🎉', name: 'Party Hat',          cost: 15,  kind: 'accessory' },
    { id: 'acc-bow',             emoji: '🎀', name: 'Sparkle Bow',        cost: 15,  kind: 'accessory' },
    { id: 'acc-hat-cowboy',      emoji: '🤠', name: 'Cowboy Hat',         cost: 20,  kind: 'accessory' },
    { id: 'acc-glasses-heart',   emoji: '😍', name: 'Heart Glasses',      cost: 20,  kind: 'accessory' },
    { id: 'acc-hat-tophat',      emoji: '🎩', name: 'Top Hat',            cost: 25,  kind: 'accessory' },
    { id: 'acc-wings-fairy',     emoji: '🧚', name: 'Fairy Wings',        cost: 30,  kind: 'accessory' },
    { id: 'acc-hat-santa',       emoji: '🎅', name: 'Santa Hat',          cost: 30,  kind: 'accessory' },
    { id: 'acc-cape-red',        emoji: '🦸', name: 'Hero Cape',          cost: 35,  kind: 'accessory' },
    { id: 'acc-crown-silver',    emoji: '🥈', name: 'Silver Crown',       cost: 40,  kind: 'accessory' },

    // ── Mid-range accessories (50–120 coins) ──────────────────────────────
    { id: 'acc-hat-wizard',      emoji: '🧙', name: 'Wizard Hat',         cost: 50,  kind: 'accessory' },
    { id: 'acc-hat-unicorn',     emoji: '🦄', name: 'Unicorn Horn',       cost: 60,  kind: 'accessory' },
    { id: 'acc-glasses-rainbow', emoji: '🌈', name: 'Rainbow Specs',      cost: 60,  kind: 'accessory' },
    { id: 'acc-cape-galaxy',     emoji: '🌌', name: 'Galaxy Cape',        cost: 75,  kind: 'accessory' },
    { id: 'acc-crown-gold',      emoji: '👑', name: 'Gold Crown',         cost: 80,  kind: 'accessory' },
    { id: 'acc-shield-star',     emoji: '🛡️', name: 'Star Shield',        cost: 90,  kind: 'accessory' },
    { id: 'acc-sword-math',      emoji: '⚔️', name: 'Math Sword',         cost: 100, kind: 'accessory' },
    { id: 'acc-armor-knight',    emoji: '🏰', name: 'Knight Armor',       cost: 120, kind: 'accessory' },

    // ── Themes (75–300 coins) ──────────────────────────────────────────────
    { id: 'theme-space',         emoji: '🚀', name: 'Space Explorer',     cost: 75,  kind: 'theme' },
    { id: 'theme-ocean',         emoji: '🌊', name: 'Ocean Deep',         cost: 75,  kind: 'theme' },
    { id: 'theme-candy',         emoji: '🍭', name: 'Candy Land',         cost: 100, kind: 'theme' },
    { id: 'theme-jungle',        emoji: '🌿', name: 'Jungle Adventure',   cost: 100, kind: 'theme' },
    { id: 'theme-dino',          emoji: '🦕', name: 'Dino World',         cost: 150, kind: 'theme' },
    { id: 'theme-robot',         emoji: '🤖', name: 'Robot Factory',      cost: 200, kind: 'theme' },
    { id: 'theme-magic',         emoji: '🔮', name: 'Magic Kingdom',      cost: 250, kind: 'theme' },
    { id: 'theme-superhero',     emoji: '🦸', name: 'Superhero City',     cost: 300, kind: 'theme' },

    // ── Backgrounds (50–200 coins) ─────────────────────────────────────────
    { id: 'bg-stars',            emoji: '⭐', name: 'Starry Night',       cost: 50,  kind: 'background' },
    { id: 'bg-rainbow',          emoji: '🌈', name: 'Rainbow Sky',        cost: 60,  kind: 'background' },
    { id: 'bg-underwater',       emoji: '🐠', name: 'Underwater World',   cost: 75,  kind: 'background' },
    { id: 'bg-forest',           emoji: '🌲', name: 'Enchanted Forest',   cost: 80,  kind: 'background' },
    { id: 'bg-volcano',          emoji: '🌋', name: 'Volcano Island',     cost: 100, kind: 'background' },
    { id: 'bg-galaxy',           emoji: '🌌', name: 'Galaxy Portal',      cost: 150, kind: 'background' },
    { id: 'bg-castle',           emoji: '🏰', name: 'Magic Castle',       cost: 175, kind: 'background' },
    { id: 'bg-cloud-palace',     emoji: '☁️', name: 'Cloud Palace',       cost: 200, kind: 'background' },

    // ── Aspirational items (300–500 coins) ────────────────────────────────
    { id: 'acc-wings-dragon',    emoji: '🐉', name: 'Dragon Wings',       cost: 350, kind: 'accessory' },
    { id: 'theme-ice',           emoji: '❄️', name: 'Ice Kingdom',        cost: 400, kind: 'theme' },
    { id: 'bg-aurora',           emoji: '🌠', name: 'Aurora Borealis',    cost: 450, kind: 'background' },
    { id: 'acc-crown-diamond',   emoji: '💎', name: 'Diamond Crown',      cost: 500, kind: 'accessory' }
  ],

  // ─── PETS ──────────────────────────────────────────────────────────────────
  pets: [
    { id: 'pet-cat',       emoji: '🐱', name: 'Pixel',      cost: 0   },
    { id: 'pet-dog',       emoji: '🐶', name: 'Biscuit',    cost: 50  },
    { id: 'pet-bunny',     emoji: '🐰', name: 'Cotton',     cost: 75  },
    { id: 'pet-chick',     emoji: '🐥', name: 'Sunny',      cost: 75  },
    { id: 'pet-dragon',    emoji: '🐲', name: 'Sparky',     cost: 100 },
    { id: 'pet-fox',       emoji: '🦊', name: 'Rusty',      cost: 100 },
    { id: 'pet-penguin',   emoji: '🐧', name: 'Waddles',    cost: 150 },
    { id: 'pet-unicorn',   emoji: '🦄', name: 'Glitter',    cost: 200 },
    { id: 'pet-owl',       emoji: '🦉', name: 'Professor',  cost: 200 },
    { id: 'pet-dino',      emoji: '🦕', name: 'Stompy',     cost: 250 },
    { id: 'pet-rocket',    emoji: '🚀', name: 'Blaster',    cost: 300 }
  ]

}
