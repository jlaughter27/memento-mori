export default {
  // Toys the child picks in the pet playground for the pet to play with.
  // kind tells the animation engine how the pet plays with the toy:
  //   chase  = rolls along the floor (balls, mice, yarn)
  //   pounce = darts around for the pet to pounce (laser, feather)
  //   float  = drifts up high for the pet to jump/bat (bubbles, balloon, kite)
  //   fetch  = thrown across the room, pet runs and brings it back (frisbee, bone)
  // The first three toys are free so every kid can play right away.
  toys: [
    { id: 'toy-ball',     emoji: '⚽',  name: 'Bouncy Ball',  cost: 0,   kind: 'chase'  },
    { id: 'toy-feather',  emoji: '🪶',  name: 'Feather Wand', cost: 0,   kind: 'pounce' },
    { id: 'toy-stick',    emoji: '🪵',  name: 'Fetch Stick',  cost: 0,   kind: 'fetch'  },
    { id: 'toy-mouse',    emoji: '🐭',  name: 'Wind-up Mouse', cost: 15, kind: 'chase'  },
    { id: 'toy-bubbles',  emoji: '🫧',  name: 'Soap Bubbles', cost: 20,  kind: 'float'  },
    { id: 'toy-yarn',     emoji: '🧶',  name: 'Yarn Ball',    cost: 25,  kind: 'chase'  },
    { id: 'toy-frisbee',  emoji: '🥏',  name: 'Flying Disc',  cost: 30,  kind: 'fetch'  },
    { id: 'toy-laser',    emoji: '🔴',  name: 'Laser Dot',    cost: 35,  kind: 'pounce' },
    { id: 'toy-balloon',  emoji: '🎈',  name: 'Balloon',      cost: 40,  kind: 'float'  },
    { id: 'toy-bone',     emoji: '🦴',  name: 'Chew Bone',    cost: 45,  kind: 'fetch'  },
    { id: 'toy-squeaky',  emoji: '🧸',  name: 'Squeaky Toy',  cost: 50,  kind: 'chase'  },
    { id: 'toy-kite',     emoji: '🪁',  name: 'Soaring Kite', cost: 60,  kind: 'float'  }
  ]
};
