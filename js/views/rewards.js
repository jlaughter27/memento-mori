// views/rewards.js — badges, shop, pets, avatar + badge-unlock popups.
import { S, persist, applyBodyClasses } from '../state.js';
import { rewardsData } from '../curriculum/index.js';
import { allBadges, buy, equip, owns, canAfford } from '../gamification.js';
import { foxSVG } from '../ui/mascot.js';
import { refreshChrome } from '../ui/shell.js';
import { sfx } from '../ui/sound.js';
import { popup, confetti, sparkle } from '../ui/celebrations.js';
import { escapeHtml } from '../ui/dom.js';

let activeTab = 'badges';

export function renderRewards(root) {
  root.innerHTML = `
    <div class="rewards-wrap">
      <div class="rewards-coinbar card-soft">
        <div class="rc-pet rc-pet-emoji">${(rewardsData.pets.find((p) => p.id === S.profile.avatar.pet) || { emoji: '🦊' }).emoji}</div>
        <div class="rc-info">
          <div class="rc-name">${escapeHtml(S.profile.name || 'Explorer')}'s Treasures</div>
          <div class="rc-coins">🪙 <b>${S.progress.coins}</b> coins</div>
        </div>
      </div>
      <div class="collection-bar card-soft">
        ${(() => {
          const ownedSet = new Set(S.progress.owned);
          const badgesGot = S.progress.badges.length, badgesTot = rewardsData.badges.length;
          const petsGot = rewardsData.pets.filter((p) => ownedSet.has(p.id)).length, petsTot = rewardsData.pets.length;
          const itemsGot = rewardsData.shop.filter((i) => ownedSet.has(i.id)).length, itemsTot = rewardsData.shop.length;
          const cell = (emoji, got, tot) => `<span class="coll-cell">${emoji} <b>${got}</b>/${tot}</span>`;
          return `<span class="coll-label">My collection</span>${cell('🏅', badgesGot, badgesTot)}${cell('🐾', petsGot, petsTot)}${cell('🎀', itemsGot, itemsTot)}`;
        })()}
      </div>
      <div class="tabbar">
        ${['badges', 'shop', 'pets', 'style'].map((t) =>
          `<button class="tab ${t === activeTab ? 'active' : ''}" data-tab="${t}">${tabLabel(t)}</button>`).join('')}
      </div>
      <div id="tab-body"></div>
    </div>`;
  root.querySelectorAll('.tab').forEach((b) =>
    b.addEventListener('click', () => { sfx.tap(); activeTab = b.dataset.tab; renderRewards(root); }));
  drawTab(root.querySelector('#tab-body'));
}
const tabLabel = (t) => ({ badges: '🏅 Badges', shop: '🛍️ Shop', pets: '🐾 Pets', style: '🎨 Style' }[t]);

function drawTab(host) {
  if (activeTab === 'badges') return drawBadges(host);
  if (activeTab === 'pets') return drawItems(host, rewardsData.pets.map((p) => ({ ...p, kind: 'pet' })), 'pet');
  if (activeTab === 'style') return drawStyle(host);
  return drawItems(host, rewardsData.shop, 'shop');
}

function drawBadges(host) {
  const badges = allBadges();
  const got = badges.filter((b) => b.earned).length;
  host.innerHTML = `
    <p class="muted center">You've earned <b>${got}</b> of ${badges.length} badges!</p>
    <div class="badge-grid">
      ${badges.map((b) => `
        <div class="badge ${b.earned ? 'earned' : 'locked'}" title="${escapeHtml(b.desc)}">
          <div class="badge-emoji">${b.earned ? b.emoji : '🔒'}</div>
          <div class="badge-name">${escapeHtml(b.name)}</div>
          <div class="badge-desc">${escapeHtml(b.desc)}</div>
        </div>`).join('')}
    </div>`;
}

function drawItems(host, items, mode) {
  host.innerHTML = `<div class="shop-grid">${items.map((it) => itemCard(it)).join('')}</div>`;
  host.querySelectorAll('.shop-item').forEach((c) => {
    const id = c.dataset.id;
    const item = items.find((x) => x.id === id);
    const btn = c.querySelector('.item-btn');
    if (!item || !btn) return;
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      handleItem(item, host);
    });
  });
}

function itemCard(it) {
  const have = owns(it.id);
  const equipped = isEquipped(it);
  let btn;
  if (!have) btn = `<button class="item-btn ${canAfford(it) ? 'buy' : 'cant'}">${it.cost === 0 ? 'Get' : `🪙 ${it.cost}`}</button>`;
  else if (it.kind === 'accessory' || it.kind === 'pet' || it.kind === 'theme' || it.kind === 'background')
    btn = `<button class="item-btn ${equipped ? 'equipped' : 'equip'}">${equipped ? '✓ On' : 'Wear'}</button>`;
  else btn = `<button class="item-btn equipped">✓ Owned</button>`;
  return `
    <div class="shop-item ${have ? 'owned' : ''}" data-id="${it.id}">
      <div class="item-emoji">${it.emoji}</div>
      <div class="item-name">${escapeHtml(it.name)}</div>
      ${btn}
    </div>`;
}
function isEquipped(it) {
  const a = S.profile.avatar;
  if (it.kind === 'pet') return a.pet === it.id;
  if (it.kind === 'theme') return a.theme === it.id;
  if (it.kind === 'background') return a.background === it.id;
  if (it.kind === 'accessory') return a.accessories.includes(it.id);
  return false;
}

function handleItem(item, host) {
  if (!owns(item.id)) {
    const r = buy(item);
    if (!r.ok) {
      if (r.reason === 'poor') { sfx.wrong(); popup({ emoji: '🪙', title: 'Not enough coins yet!', sub: 'Practice more to earn coins. You can do it!', sound: false, confetti: false }); }
      return;
    }
    sfx.coin(); confetti(60);
    if (item.kind === 'pet' || item.kind === 'theme' || item.kind === 'background') equip(item);
    applyBodyClasses();
  } else {
    sfx.tap();
    equip(item);
    applyBodyClasses();
  }
  refreshChrome();
  drawTab(host);
}

function drawStyle(host) {
  const a = S.profile.avatar;
  const equippedAcc = a.accessories.map((id) => (rewardsData.shop.find((s) => s.id === id) || {}).emoji).filter(Boolean);
  host.innerHTML = `
    <div class="style-stage card-soft" data-theme="${a.theme}">
      <div class="style-fox">${foxSVG('celebrate')}
        <div class="style-acc">${equippedAcc.join(' ')}</div>
      </div>
      <p class="muted">Buy items in the Shop, then tap “Wear” to dress up Foxy and pick your theme!</p>
    </div>
    <h3 class="section-h">Your Themes</h3>
    <div class="shop-grid" id="style-themes"></div>`;
  const owned = rewardsData.shop.filter((s) => s.kind === 'theme' && owns(s.id));
  const themes = [{ id: 'default', emoji: '🌈', name: 'Classic', kind: 'theme', cost: 0 }, ...owned];
  const tHost = host.querySelector('#style-themes');
  tHost.innerHTML = themes.map((t) => itemCard(t)).join('');
  tHost.querySelectorAll('.shop-item').forEach((c) => {
    const t = themes.find((x) => x.id === c.dataset.id);
    const btn = c.querySelector('.item-btn');
    if (!t || !btn) return;
    btn.addEventListener('click', () => {
      sfx.tap(); equip(t); applyBodyClasses(); drawStyle(host);
    });
  });
}

/* ---------- badge unlock popups (used across views) ---------- */
export function showBadges(badges, onClose) {
  let i = 0;
  const next = () => {
    if (i >= badges.length) { onClose && onClose(); return; }
    const b = badges[i++];
    popup({
      emoji: b.emoji, title: 'Badge Unlocked!',
      sub: `${b.name}\n${b.desc}`, sound: 'badge', hold: true, confetti: true,
      onClose: next, // chain to the next badge (or final onClose) exactly once
    });
  };
  next();
}
