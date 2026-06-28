// Seasonal event packs (Plan M12): the active event is gated by the LOCAL date,
// so the app freshens across the year with no server. Pure selector — inject dates.
import { activeSeason } from '../js/curriculum/seasonal-data.js';
let failed = null;
const ok = (c, m) => { if (!c && !failed) failed = m; };
const D = (y, m, d) => new Date(y, m - 1, d); // m is 1-indexed here

try {
  // broad seasons
  ok(activeSeason(D(2026, 3, 15)).id === 'spring', 'mid-March → Spring');
  ok(activeSeason(D(2026, 7, 4)).id === 'summer', 'July 4 → Summer');
  ok(activeSeason(D(2026, 10, 5)).id === 'autumn', 'early October → Autumn');
  ok(activeSeason(D(2026, 1, 15)).id === 'winter', 'mid-January → Winter (year-wrapping window)');
  ok(activeSeason(D(2026, 12, 5)).id === 'winter', 'early December → Winter');
  console.log('  • four seasons select correctly (incl. the Dec→Feb wrap)');

  // specials take priority over the broad season
  ok(activeSeason(D(2026, 1, 1)).id === 'newyear', 'Jan 1 → New Year special (over Winter)');
  ok(activeSeason(D(2026, 10, 31)).id === 'halloween', 'Oct 31 → Halloween special (over Autumn)');
  ok(activeSeason(D(2026, 12, 25)).id === 'holidays', 'Dec 25 → Winter Holidays special (over Winter)');
  console.log('  • holiday specials override the broad season on their dates');

  // always returns a valid event with display fields
  const s = activeSeason(D(2026, 4, 2));
  ok(s && s.name && s.emoji && s.greet, 'every event has name/emoji/greet for the banner');

  // the Home banner is driven by the selector (smoke via render is covered by smoke.mjs;
  // here we assert the data contract the banner relies on)
  console.log(`  • e.g. ${s.emoji} "${s.name}" — "${s.greet}"`);
} catch (e) { failed = e.message; }

if (failed) { console.log('\n❌ SEASONAL FAILED:', failed); process.exit(1); }
console.log('\n✅ SEASONAL PASSED — date-gated event packs select by local date (offline).');
process.exit(0);
