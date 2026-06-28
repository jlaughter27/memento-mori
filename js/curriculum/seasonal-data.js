// curriculum/seasonal-data.js — date-gated seasonal "event packs".
// Pure data + a pure selector: the active event is chosen by the LOCAL date, so
// the app freshens itself across the year with zero server (offline-safe).
const SEASONS = [
  { id: 'winter', name: 'Winter Wonderland', emoji: '❄️', greet: 'Bundle up and warm up your math! ⛄', from: { m: 12, d: 1 }, to: { m: 2, d: 28 } }, // wraps the year
  { id: 'spring', name: 'Spring Bloom', emoji: '🌸', greet: 'Fresh blossoms and fresh problems! 🌷', from: { m: 3, d: 1 }, to: { m: 5, d: 31 } },
  { id: 'summer', name: 'Summer Splash', emoji: '🏖️', greet: 'Sunshine and skills — dive in! 🌊', from: { m: 6, d: 1 }, to: { m: 8, d: 31 } },
  { id: 'autumn', name: 'Autumn Harvest', emoji: '🍂', greet: 'Cozy season — collect those leaves and stars! 🍁', from: { m: 9, d: 1 }, to: { m: 11, d: 30 } },
];
// Specials take priority over the broad season (a single day or a short window).
const SPECIALS = [
  { id: 'newyear', name: 'New Year Kickoff', emoji: '🎉', greet: 'New year, new math adventures! 🎊', on: { m: 1, d: 1 } },
  { id: 'halloween', name: 'Spooky Math', emoji: '🎃', greet: 'Boo! Spooky-fun problems await! 👻', on: { m: 10, d: 31 } },
  { id: 'holidays', name: 'Winter Holidays', emoji: '🎁', greet: 'A gift of learning this holiday season! ⭐', from: { m: 12, d: 20 }, to: { m: 12, d: 31 } },
];

// true if month/day falls in [from,to], handling a year-wrapping window (Dec→Feb)
function inRange(m, d, from, to) {
  const md = m * 100 + d, a = from.m * 100 + from.d, b = to.m * 100 + to.d;
  return a <= b ? (md >= a && md <= b) : (md >= a || md <= b);
}
// the active seasonal event for a date (injectable for testing); always returns one
export function activeSeason(date = new Date()) {
  const m = date.getMonth() + 1, d = date.getDate();
  for (const s of SPECIALS) {
    if (s.on ? (s.on.m === m && s.on.d === d) : inRange(m, d, s.from, s.to)) return s;
  }
  for (const s of SEASONS) if (inRange(m, d, s.from, s.to)) return s;
  return SEASONS[0];
}
export default { SEASONS, SPECIALS };
