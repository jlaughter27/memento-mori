// curriculum/quests-data.js — multi-step island Quests (adventures with tasks).
// Pure data. Each quest is a CHAIN of steps; each step is one objective over an
// event the engine already emits (solve / master / boss / explore), with its own
// narrative + small reward. Finishing the chain unlocks a completion chest.
//   unlock: { mastered: N } | null   — gate by skills mastered (null = open)
//   steps[].metric ∈ 'solve' | 'master' | 'boss' | 'explore'
//   steps[].reward / chest: { coins, treats }   (chest also drops a sticker)
export default [
  {
    id: 'q-welcome', title: 'Your First Adventure', emoji: '🌟', unlock: null,
    blurb: 'Every hero starts somewhere. Let\'s learn the ropes of the island together!',
    steps: [
      { metric: 'solve', goal: 6, label: 'Warm up your math magic — solve 6 problems', cheer: 'Your magic is glowing! ✨', reward: { coins: 8, treats: 0 } },
      { metric: 'explore', goal: 1, label: 'Explore a new corner of the island', cheer: 'A whole new place to discover! 🗺️', reward: { coins: 10, treats: 1 } },
      { metric: 'master', goal: 1, label: 'Master your very first skill', cheer: 'You truly mastered it! 🌟', reward: { coins: 12, treats: 1 } },
    ],
    chest: { coins: 40, treats: 2, sticker: 'quest-welcome' },
  },
  {
    id: 'q-explorer', title: 'Island Explorer', emoji: '🧭', unlock: { mastered: 2 },
    blurb: 'The island is bigger than it looks. Friendly creatures everywhere need a hand!',
    steps: [
      { metric: 'explore', goal: 3, label: 'Discover 3 new places', cheer: 'You\'re becoming a real explorer! 🧭', reward: { coins: 12, treats: 1 } },
      { metric: 'solve', goal: 15, label: 'Help 15 creatures with their math', cheer: 'So many friends helped! 💛', reward: { coins: 18, treats: 1 } },
    ],
    chest: { coins: 60, treats: 2, sticker: 'quest-explorer' },
  },
  {
    id: 'q-champion', title: 'Boss Hunter', emoji: '⚔️', unlock: { mastered: 4 },
    blurb: 'The zone keepers want to test your skills. Are you ready for a real challenge?',
    steps: [
      { metric: 'boss', goal: 1, label: 'Defeat a zone boss', cheer: 'Boss defeated! 🏆', reward: { coins: 20, treats: 1 } },
      { metric: 'solve', goal: 20, label: 'Power up — solve 20 problems', cheer: 'Fully charged! ⚡', reward: { coins: 20, treats: 1 } },
      { metric: 'boss', goal: 2, label: 'Defeat 2 more bosses', cheer: 'Unstoppable! 🔥', reward: { coins: 30, treats: 2 } },
    ],
    chest: { coins: 100, treats: 3, sticker: 'quest-champion' },
  },
  {
    id: 'q-scholar', title: 'Master Scholar', emoji: '🎓', unlock: { mastered: 6 },
    blurb: 'The wisest pets on the island never stop learning. Show them what you\'ve got!',
    steps: [
      { metric: 'master', goal: 3, label: 'Master 3 more skills', cheer: 'Your brain is on fire! 🧠', reward: { coins: 24, treats: 1 } },
      { metric: 'solve', goal: 25, label: 'Practice makes a scholar — solve 25 problems', cheer: 'True dedication! 📚', reward: { coins: 26, treats: 2 } },
    ],
    chest: { coins: 120, treats: 4, sticker: 'quest-scholar' },
  },
];
