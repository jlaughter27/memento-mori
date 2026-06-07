// precache.mjs — guards invariant #5: every shipped JS/CSS file must be in the
// service worker's precache list, or a cold offline load could 404 that module.
// This catches "added a file, forgot the SW list" before it reaches a device.
import fs from 'fs';
import path from 'path';

const root = new URL('..', import.meta.url).pathname;
const sw = fs.readFileSync(path.join(root, 'service-worker.js'), 'utf8');

// the ASSETS array entries look like  './js/views/home.js'
const listed = new Set([...sw.matchAll(/['"]\.\/([^'"]+)['"]/g)].map((m) => m[1]));

function walk(dir) {
  const out = [];
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    if (fs.statSync(full).isDirectory()) out.push(...walk(full));
    else out.push(path.relative(root, full));
  }
  return out;
}

// every runtime JS module and every stylesheet must be precached
const shipped = [
  ...walk(path.join(root, 'js')),
  ...walk(path.join(root, 'css')),
].filter((f) => /\.(js|css)$/.test(f));

const missing = shipped.filter((f) => !listed.has(f));

if (missing.length) {
  console.log('\n❌ PRECACHE DRIFT — these files ship but are NOT in service-worker.js ASSETS:');
  for (const f of missing) console.log('   • ' + f);
  console.log('\nAdd them to the ASSETS array (and bump APP_VERSION + CACHE) before release.');
  process.exit(1);
}

console.log(`✅ PRECACHE OK — all ${shipped.length} JS/CSS files are in the service-worker precache.`);
process.exit(0);
