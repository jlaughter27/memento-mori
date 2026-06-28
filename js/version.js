// version.js — single source of truth for the app version + release notes.
// Bump APP_VERSION when shipping; the service worker cache + "What's New"
// modal key off this string so installed apps update themselves.
export const APP_VERSION = '2.35.0';

// Newest first. Shown in the in-app "What's New" modal on version change.
export const RELEASES = [
  {
    v: '2.35.0',
    date: '2026-06-28',
    title: 'A Helping Step',
    items: [
      '🌱 Stuck on a tricky kind of problem? Foxy now slips in an easier warm-up to build it up, then brings you back',
    ],
  },
  {
    v: '2.34.0',
    date: '2026-06-28',
    title: 'See It, Try It',
    items: [
      '🧱 Lessons now walk you from pictures → steps → numbers, the way math really clicks',
      '🎯 Every lesson ends with a "Now you try!" — give it a go before you practice!',
    ],
  },
  {
    v: '2.33.0',
    date: '2026-06-28',
    title: 'Streak Savers',
    items: [
      '🧊 New Streak Freeze! Miss a day? An earned freeze keeps your streak safe',
      '🔥 Reach a streak milestone to earn a freeze — build up your safety net!',
    ],
  },
  {
    v: '2.32.0',
    date: '2026-06-28',
    title: 'True Mastery',
    items: [
      '🧠 MathQuest now really understands when a skill is yours — mastery is earned, not just finished',
      '⚡ Get a skill almost there? A Challenge Zone of tougher problems helps you reach 100!',
    ],
  },
  {
    v: '2.31.0',
    date: '2026-06-28',
    title: 'Lend a Hand',
    items: [
      '🧺 Some friends in the World now ask for help with a real-life story problem!',
    ],
  },
  {
    v: '2.30.0',
    date: '2026-06-28',
    title: 'Beat the Boss, Open the Gate',
    items: [
      '⚔️ Bosses now unlock new places! Defeat Geo Rex to open Decimal Docks 🌊',
    ],
  },
  {
    v: '2.29.0',
    date: '2026-06-28',
    title: 'Smoother & Cleaner',
    items: [
      '🌿 Calm mode and "reduce motion" now work consistently across the whole app',
    ],
  },
  {
    v: '2.28.0',
    date: '2026-06-28',
    title: 'Help, Step by Step',
    items: [
      '💡 Hints now come one tier at a time — a little nudge, then more, only as you need it',
      '🤝 Out of hints? Foxy walks you through the whole thing — but you still type the answer!',
    ],
  },
  {
    v: '2.27.0',
    date: '2026-06-28',
    title: 'The Tutor Knows',
    items: [
      '🧠 The tutor now spots the *exact* mix-up behind a wrong answer and explains the fix',
      '✅ Every kind of problem gives smart, specific help — not just "try again"',
    ],
  },
  {
    v: '2.26.0',
    date: '2026-06-21',
    title: 'Island Quests',
    items: [
      '📜 New Quest Log! Big multi-step adventures across the island',
      '🗺️ Quests fill up as you solve, explore, master skills, and beat bosses',
      '🎁 Finish an adventure to claim a treasure chest — coins, treats, and a trophy!',
    ],
  },
  {
    v: '2.25.0',
    date: '2026-06-18',
    title: 'Missions & Sparkle',
    items: [
      '🗺️ New Missions! Daily and weekly quests with progress bars and chest rewards 🎁',
      '🌟 Your pet now celebrates when it grows up — with confetti!',
      '✨ A polish pass: a level ring on your home screen, and buttons & cards that respond to your touch',
    ],
  },
  {
    v: '2.24.0',
    date: '2026-06-14',
    title: 'MathQuest Island',
    items: [
      '🗺️ Explore the World — walk your pet around MathQuest Island and bump into math!',
      '🏝️ Themed zones, friendly creatures, chests, and a pet that grows in friendship',
      '📖 A new Collection album — see every pet, toy, zone, and treasure you\'ve found',
    ],
  },
  {
    v: '2.23.0',
    date: '2026-06-07',
    title: 'Worksheet Maker',
    items: [
      '📄 Grown-ups can print a practice worksheet for any grade & topic',
      '🔑 Each sheet comes with an answer key on its own page',
    ],
  },
  {
    v: '2.22.0',
    date: '2026-06-07',
    title: 'Whole Family',
    items: [
      '👧👦 Multiple kids can share one device — each with their own pet & progress',
      '➕ Add, switch, and manage learners in the Grown-ups Corner',
    ],
  },
  {
    v: '2.21.0',
    date: '2026-06-07',
    title: 'Safe & Sound',
    items: [
      '🔒 Extra safety: all pop-up text is now properly sanitized',
    ],
  },
  {
    v: '2.20.0',
    date: '2026-06-07',
    title: 'Polish Pass',
    items: [
      '✋ Tapping "Check" before building now gently reminds you to tap first',
    ],
  },
  {
    v: '2.19.0',
    date: '2026-06-07',
    title: 'Building Blocks',
    items: [
      '🧱 New "Build the Number" skill — tap blocks to make hundreds, tens & ones!',
      '➕ Add and remove place-value blocks to build any number',
    ],
  },
  {
    v: '2.18.0',
    date: '2026-06-07',
    title: 'Pizza Fractions',
    items: [
      '🍕 "Show the Fraction" now uses bars AND circles — shade a pizza!',
      '✋ Tap the pie slices or bar parts to build your fraction',
    ],
  },
  {
    v: '2.17.0',
    date: '2026-06-07',
    title: 'Hands-On Fractions',
    items: [
      '🎨 New "Show the Fraction" skill — tap to shade the bar and build a fraction!',
      '✋ Our first hands-on, tap-to-learn activity (more coming!)',
    ],
  },
  {
    v: '2.16.0',
    date: '2026-06-07',
    title: 'Accessible by Default',
    items: [
      '♿ Every button and control is now guaranteed to work with a screen reader',
      '🎉 Pop-ups close cleanly even if you tap fast',
    ],
  },
  {
    v: '2.15.0',
    date: '2026-06-07',
    title: 'Tested & True',
    items: [
      '🧪 Deeper testing of settings, the shop, pets, and the quest map',
      '🛡️ A few more safety checks so menus never hiccup',
    ],
  },
  {
    v: '2.14.0',
    date: '2026-06-07',
    title: 'Bug Hunt',
    items: [
      '🖼️ Fixed fraction pictures in lessons that were showing up blank',
      '♿ Celebration pop-ups now play nicely when two happen at once',
      '🛡️ Extra safety checks so nothing can crash mid-play',
    ],
  },
  {
    v: '2.13.0',
    date: '2026-06-07',
    title: 'Clear Next Steps',
    items: [
      '🔒 Locked skills now tell you exactly which one to master first',
    ],
  },
  {
    v: '2.12.0',
    date: '2026-06-07',
    title: 'Easy to Get Around',
    items: [
      '↩️ One clear "Back" bar on every screen — never get lost',
      '🧭 Simpler bottom menu with your 4 favorite places',
      '⚙️ Grown-up tools tucked behind a gear, out of your way',
      '🏠 Tidier home — tap "Grade" only when you want to switch',
    ],
  },
  {
    v: '2.11.0',
    date: '2026-06-07',
    title: 'Modern & Clean',
    items: [
      '✨ Screens now glide in smoothly instead of snapping',
      '🧹 Cleaner, calmer cards with more breathing room',
      '🎮 Home has a tidy "Play & explore" shelf for the games',
      '💫 Friendlier pop animations on celebrations',
    ],
  },
  {
    v: '2.10.0',
    date: '2026-06-07',
    title: 'Readable Everywhere',
    items: [
      '🌌 Everything stays clear on the starry, galaxy & aurora backgrounds',
      '🔳 Works in high-contrast mode for extra-clear visuals',
      '🎯 Sharper keyboard outlines on every theme',
    ],
  },
  {
    v: '2.9.0',
    date: '2026-06-07',
    title: 'Crisp & Consistent',
    items: [
      '🎨 Buttons & worked-examples now match every color theme (not just purple)',
      '👀 Clearer, higher-contrast colors so answers are easy to read',
      '🌙 Star, galaxy & aurora backgrounds keep everything readable',
      '🔇 Read-aloud now stops when you change screens',
      '⚡ Snappier taps and tidier spacing all around',
    ],
  },
  {
    v: '2.8.0',
    date: '2026-06-07',
    title: 'Polished to Fit',
    items: [
      '🔢 Long answers now shrink to fit their box — no more text spilling out',
      '📖 Big word problems scale down and wrap so they\'re easy to read',
      '✨ A consistent spacing & type system makes every screen feel tidy',
    ],
  },
  {
    v: '2.7.0',
    date: '2026-06-06',
    title: 'Grow Together',
    items: [
      '🐣 Your pet grows up as you master skills — watch it evolve!',
      '🌪️ New game: Sort & Storm — tap the numbers that fit the rule',
      '🔄 "Rusty" skills come back so your learning never fades',
      '📅 Grown-ups can set a weekly goal · 🎀 collect it all in Rewards',
    ],
  },
  {
    v: '2.6.0',
    date: '2026-06-06',
    title: 'Learn with Foxy',
    items: [
      '🦊 Tutor mode — Foxy shows you how, helps you try, then lets you fly solo',
      '📍 New game: Number Line — guess where the number goes!',
      '📊 Grown-ups: a full progress report you can read & print',
    ],
  },
  {
    v: '2.5.0',
    date: '2026-06-06',
    title: 'Polished & Hardened',
    items: [
      '♿ Full accessibility pass — screen-reader friendly, keyboard-friendly',
      '✨ Lots of polish: cleaner home, friendlier feedback, smoother games',
      '🐛 Squashed bugs found by a deep audit (your pet quest is rock-solid now)',
    ],
  },
  {
    v: '2.4.0',
    date: '2026-06-06',
    title: 'Math Sprint',
    items: [
      '⚡ New mini-game: Math Sprint — how many can you solve in 60 seconds?',
      '🏆 Beat your own best score (no timers-against-others, no pressure)',
    ],
  },
  {
    v: '2.3.0',
    date: '2026-06-06',
    title: 'Make It Stick',
    items: [
      '🔧 Fix-It time — the problems you miss come back so you can master them',
      '🌅 Daily warm-up — your pet checks what you remember (spaced review)',
      '🧠 Learning that sticks: review beats forgetting',
    ],
  },
  {
    v: '2.2.0',
    date: '2026-06-06',
    title: 'Smarter Tutor & Grades 2–7',
    items: [
      '🧠 The tutor now spots common mistakes and explains the exact fix',
      '📚 New grades: 2nd and 7th — MathQuest now spans grades 2–7 (86 skills)',
      '🐾 New pet treats, rooms, and decorations to collect',
      '⭐ Every skill stays Common Core aligned (65 standards)',
    ],
  },
  {
    v: '2.1.0',
    date: '2026-06-06',
    title: 'Pet Quest & Tutor Mode',
    items: [
      '🐾 Pet Home — feed, play with, and pat your pet (with a happiness meter!)',
      '⚔️ Pet Quest — a 3-chapter story adventure where your pet is the hero',
      '🦊 Tutor mode — every quest challenge teaches you first, then you try',
      '🍪 Treat shop — spend coins on treats for your pet',
      '📐 Deep 4th-grade focus, aligned to national standards',
    ],
  },
  {
    v: '2.0.0',
    date: '2026-06-06',
    title: 'The Legit Update',
    items: [
      '📐 Every lesson now shows its Common Core standard',
      '🧭 Smart placement quiz finds the right starting point',
      '🔁 Spaced review brings back skills before they fade',
      '🎚️ Adaptive difficulty + daily goals',
      '🖼️ New visuals: percent bars, ratio tapes, 3-D volume, dot plots',
      '♿ Full accessibility pass (focus, zoom, color-blind safe)',
      '🔄 Auto-updates — the app now refreshes itself when a new version ships',
    ],
  },
  {
    v: '1.0.0',
    date: '2026-06-06',
    title: 'Hello, MathQuest!',
    items: ['First release: 60 lessons across grades 3–6, badges, pets, and a friendly fox.'],
  },
];

export const latestRelease = () => RELEASES[0];
