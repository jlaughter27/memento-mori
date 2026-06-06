export default {
  rooms: [
    // a room is a themed background for the pet home; first one free
    { id: 'room-cozy',    emoji: '🛋️',  name: 'Cozy Den',          cost: 0,   bg: 'linear-gradient(180deg,#fff6e9,#ffe9cf)' },
    { id: 'room-beach',   emoji: '🏖️',  name: 'Beach Hut',         cost: 40,  bg: 'linear-gradient(180deg,#87ceeb,#f0e68c 60%,#f4a460)' },
    { id: 'room-space',   emoji: '🚀',  name: 'Space Station',      cost: 80,  bg: 'linear-gradient(180deg,#0d0d2b,#1a1a4e 50%,#2d2d6b)' },
    { id: 'room-candy',   emoji: '🍬',  name: 'Candy Cottage',      cost: 100, bg: 'linear-gradient(180deg,#ffb3de,#ffe4f0 50%,#fff0fb)' },
    { id: 'room-jungle',  emoji: '🌿',  name: 'Jungle Treehouse',   cost: 120, bg: 'linear-gradient(180deg,#2d5a27,#4a7c3f 40%,#6aab5e)' },
    { id: 'room-ice',     emoji: '❄️',  name: 'Ice Palace',         cost: 160, bg: 'linear-gradient(180deg,#cceeff,#e8f8ff 50%,#f5fdff)' },
    { id: 'room-cloud',   emoji: '☁️',  name: 'Cloud Loft',         cost: 220, bg: 'linear-gradient(180deg,#a8d8f0,#d4eeff 40%,#f0f8ff)' },
    { id: 'room-dino',    emoji: '🦕',  name: 'Dino Cave',          cost: 300, bg: 'linear-gradient(180deg,#3b2a1a,#5c3d2e 40%,#7a5240)' }
  ],
  decor: [
    // decor items the child places in the room (cosmetic). slot is a hint, not strict.
    { id: 'decor-rug',          emoji: '🟫',  name: 'Soft Rug',        cost: 15,  slot: 'floor'     },
    { id: 'decor-ball',         emoji: '⚽',  name: 'Bouncy Ball',     cost: 10,  slot: 'toy'       },
    { id: 'decor-bowl',         emoji: '🥣',  name: 'Food Bowl',       cost: 10,  slot: 'floor'     },
    { id: 'decor-plant',        emoji: '🌱',  name: 'Little Plant',    cost: 20,  slot: 'plant'     },
    { id: 'decor-plushie',      emoji: '🧸',  name: 'Plushie Friend',  cost: 25,  slot: 'toy'       },
    { id: 'decor-poster',       emoji: '🖼️',  name: 'Fun Poster',      cost: 25,  slot: 'wall'      },
    { id: 'decor-lamp',         emoji: '🪔',  name: 'Night Lamp',      cost: 30,  slot: 'light'     },
    { id: 'decor-window',       emoji: '🪟',  name: 'Sunny Window',    cost: 30,  slot: 'window'    },
    { id: 'decor-balloons',     emoji: '🎈',  name: 'Balloons',        cost: 30,  slot: 'light'     },
    { id: 'decor-beanbag',      emoji: '🫘',  name: 'Bean Bag',        cost: 40,  slot: 'furniture' },
    { id: 'decor-clock',        emoji: '🕐',  name: 'Wall Clock',      cost: 40,  slot: 'wall'      },
    { id: 'decor-painting',     emoji: '🎨',  name: 'Colorful Painting', cost: 50, slot: 'wall'    },
    { id: 'decor-fairy-lights', emoji: '✨',  name: 'Fairy Lights',    cost: 60,  slot: 'light'     },
    { id: 'decor-bookshelf',    emoji: '📚',  name: 'Bookshelf',       cost: 70,  slot: 'furniture' },
    { id: 'decor-bed',          emoji: '🛏️',  name: 'Cozy Bed',        cost: 90,  slot: 'furniture' },
    { id: 'decor-ball-pit',     emoji: '🏊',  name: 'Ball Pit',        cost: 120, slot: 'toy'       },
    { id: 'decor-aquarium',     emoji: '🐠',  name: 'Aquarium',        cost: 150, slot: 'furniture' },
    { id: 'decor-telescope',    emoji: '🔭',  name: 'Telescope',       cost: 200, slot: 'window'    }
  ]
};
