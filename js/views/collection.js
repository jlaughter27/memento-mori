// views/collection.js — "My Collection": a warm overview of everything the learner
// has gathered across the app (pets, toys, decorations, rooms, zones, bosses, badges).
// A gentle "gotta collect them all" motivator. Pure DOM, fully offline.
import { S } from '../state.js';
import { rewardsData, ALL_SKILLS } from '../curriculum/index.js';
import toysData from '../curriculum/toys-data.js';
import decorData from '../curriculum/decor-data.js';
import worldMaps from '../curriculum/world-maps.js';
import { navigate } from '../ui/shell.js';
import { sfx } from '../ui/sound.js';
import { escapeHtml } from '../ui/dom.js';

const ownsItem = (id) => (S.progress.owned || []).includes(id);
const toyOwned = (t) => t.cost === 0 || (S.progress.home.toys || []).includes(t.id);

function bossList() {
  const out = [];
  for (const id of worldMaps.order) {
    for (const o of (worldMaps.zones[id].objects || [])) {
      if (o.type === 'boss') out.push({ glyph: o.emoji, label: o.name, owned: !!((S.progress.world.bosses || {})[o.id] || {}).done });
    }
  }
  return out;
}
function stickerList() {
  const out = [];
  for (const id of worldMaps.order) {
    for (const o of (worldMaps.zones[id].objects || [])) {
      if (o.type === 'boss' && o.sticker) out.push({ glyph: o.sticker.glyph, label: o.sticker.name, owned: (S.progress.world.stickers || []).includes(o.id) });
    }
  }
  return out;
}

export function renderCollection(root) {
  const home = S.progress.home || {};
  const world = S.progress.world || {};
  const pets = rewardsData.pets.map((p) => ({ glyph: p.emoji, label: p.name, owned: ownsItem(p.id) || p.id === 'pet-cat' }));
  const toys = toysData.toys.map((t) => ({ glyph: t.emoji, label: t.name, owned: toyOwned(t) }));
  const decor = decorData.decor.map((d) => ({ glyph: d.emoji, label: d.name, owned: (home.decor || []).includes(d.id) }));
  const rooms = decorData.rooms.map((r) => ({ glyph: r.emoji, label: r.name, owned: (home.ownedRooms || []).includes(r.id) }));
  const zones = worldMaps.order.map((id) => {
    const z = worldMaps.zones[id];
    return { glyph: z.emoji, label: z.name, owned: id === 'town' || (world.visited || []).includes(id) || world.map === id };
  });
  const bosses = bossList();
  const stickers = stickerList();
  const badges = rewardsData.badges.map((b) => ({ glyph: b.emoji, label: b.name, owned: (S.progress.badges || []).includes(b.id) }));

  const sections = [
    ['🐾', 'Pets', pets], ['🧺', 'Toys', toys], ['🎨', 'Decorations', decor], ['🛋️', 'Rooms', rooms],
    ['🗺️', 'Places', zones], ['⚔️', 'Bosses', bosses], ['⭐', 'Stickers', stickers], ['🏅', 'Badges', badges],
  ];

  // overall "island complete" progress: all collectibles + skills mastered
  const allItems = [...pets, ...toys, ...decor, ...rooms, ...zones, ...bosses, ...stickers, ...badges];
  const mastered = (S.progress.stats && S.progress.stats.skillsMastered) || 0;
  const earned = allItems.filter((i) => i.owned).length + mastered;
  const total = allItems.length + ALL_SKILLS.length;
  const pct = total ? Math.round((earned / total) * 100) : 0;
  const summary = `
    <section class="coll-summary card-soft">
      <div class="cs-top"><span class="cs-pct">${pct}%</span><span class="cs-label">Island complete</span></div>
      <div class="cs-track"><div class="cs-fill" style="width:${pct}%"></div></div>
      <div class="cs-stats">
        <span>🗺️ ${zones.filter((z) => z.owned).length}/${zones.length}</span>
        <span>⚔️ ${bosses.filter((b) => b.owned).length}/${bosses.length}</span>
        <span>🧠 ${mastered}/${ALL_SKILLS.length}</span>
      </div>
    </section>`;

  root.innerHTML = `
    <div class="coll-wrap">
      <header class="coll-top">
        <button class="btn-link" id="coll-back">← Back</button>
        <h1 class="coll-h1">📒 My Collection</h1>
      </header>
      ${summary}
      ${sections.map(sectionHtml).join('')}
    </div>`;
  root.querySelector('#coll-back').addEventListener('click', () => { sfx.tap(); navigate('#/pet'); });
}

function sectionHtml([emoji, title, items]) {
  const have = items.filter((i) => i.owned).length;
  return `
    <section class="coll-section card-soft">
      <div class="coll-sec-head"><span>${emoji} ${escapeHtml(title)}</span><span class="coll-count">${have}/${items.length}</span></div>
      <div class="coll-grid">${items.map(chipHtml).join('')}</div>
    </section>`;
}
function chipHtml(i) {
  return `<div class="coll-chip ${i.owned ? 'have' : 'locked'}" title="${i.owned ? escapeHtml(i.label) : 'Keep playing to unlock!'}">
    <span class="coll-glyph">${i.owned ? i.glyph : '❔'}</span>
    <span class="coll-label">${i.owned ? escapeHtml(i.label) : '???'}</span>
  </div>`;
}
