// 100 quotes/verses (sample set — expand/curate as needed)
window.LTC_QUOTES = [
  "Psalm 90:12 — Teach us to number our days, that we may gain a heart of wisdom.",
  "Proverbs 3:5 — Trust in the LORD with all your heart and lean not on your own understanding.",
  "Romans 8:28 — All things work together for good for those who love God.",
  "Philippians 4:13 — I can do all things through Christ who strengthens me.",
  "Joshua 1:9 — Be strong and courageous... the LORD your God is with you.",
  "Isaiah 40:31 — Those who hope in the LORD will renew their strength.",
  "Matthew 6:33 — Seek first the kingdom of God and his righteousness.",
  "2 Corinthians 5:7 — For we walk by faith, not by sight.",
  "Galatians 6:9 — Do not grow weary of doing good... in due season we will reap.",
  "Hebrews 12:1 — Run with endurance the race set before us.",
  // ... Add more to reach 100
];

// Duplicating to reach 100 (placeholder). Replace with unique curated list later.
(function padTo100(){
  const target = 100;
  while (window.LTC_QUOTES.length < target) {
    window.LTC_QUOTES.push(window.LTC_QUOTES[window.LTC_QUOTES.length % 10]);
  }
})();
