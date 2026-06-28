// curriculum/missions-data.js — templates for daily & weekly missions ("quests").
// Pure data, no logic. Each template tracks ONE metric the gamification layer
// already emits (solve / firstTry / lesson / master). Copy + reward are derived
// from the tier (daily vs weekly) in gamification.js.
//   unit: [singular, plural] for kid-friendly grammar
export default [
  { id: 'solve', metric: 'solve', emoji: '🎯', verb: 'Solve', unit: ['problem', 'problems'],
    daily: { goal: 8, coins: 20, treats: 1 }, weekly: { goal: 45, coins: 70, treats: 3 } },
  { id: 'firsttry', metric: 'firstTry', emoji: '⚡', verb: 'Nail', unit: ['first-try answer', 'first-try answers'],
    daily: { goal: 5, coins: 22, treats: 1 }, weekly: { goal: 28, coins: 75, treats: 3 } },
  { id: 'lesson', metric: 'lesson', emoji: '📘', verb: 'Finish', unit: ['lesson', 'lessons'],
    daily: { goal: 1, coins: 18, treats: 1 }, weekly: { goal: 5, coins: 65, treats: 3 } },
  { id: 'master', metric: 'master', emoji: '🌟', verb: 'Master', unit: ['skill', 'skills'],
    daily: { goal: 1, coins: 25, treats: 1 }, weekly: { goal: 4, coins: 90, treats: 4 } },
];
