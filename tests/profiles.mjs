// tests/profiles.mjs — multi-child profiles: migration of an old single-child
// save, create/switch with independent data, the last-learner delete guard, and
// the container persistence shape.
import { JSDOM } from 'jsdom';
const dom = new JSDOM('<!DOCTYPE html><body></body>', { url: 'http://localhost/' });
const { window } = dom;
globalThis.window = window; globalThis.document = window.document; globalThis.localStorage = window.localStorage;

// seed an OLD single-state save (pre-profiles shape) to verify migration
const old = {
  profile: { name: 'Ada', grade: 4, avatar: { pet: 'pet-dog', accessories: [], theme: 'theme-ocean', background: 'default' } },
  progress: { coins: 42, level: 3, skills: {}, settings: {} },
  onboarded: true, lastVersion: '2.4.0',
};
localStorage.setItem('mathquest.v1', JSON.stringify(old));

const fails = [];
const ok = (c, m) => { if (!c) fails.push(m); };

const st = await import('../js/state.js');
const { S, listProfiles, createProfile, switchProfile, deleteProfile, activeProfileId, profileCount, persist } = st;

// 1) migration: the old single-child save becomes profile #1, data intact
ok(S.profile.name === 'Ada', 'migration: name not carried (' + S.profile.name + ')');
ok(S.profile.grade === 4, 'migration: grade not carried');
ok(S.progress.coins === 42, 'migration: coins not carried');
ok(S.onboarded === true, 'migration: onboarded flag lost');
ok(profileCount() === 1, 'migration: expected 1 profile, got ' + profileCount());
const firstId = activeProfileId();

// 2) add a second learner — fresh + active + un-onboarded
const secondId = createProfile();
ok(profileCount() === 2, 'create: expected 2 profiles');
ok(activeProfileId() === secondId, 'create: new profile not active');
ok(S.profile.name === '', 'create: new profile should be blank, got "' + S.profile.name + '"');
ok(S.onboarded === false, 'create: new profile should be un-onboarded');
ok(S.progress.coins === 0, 'create: new profile should have fresh progress');
S.profile.name = 'Bo'; S.profile.grade = 6; S.progress.coins = 7; persist();

// 3) switching restores each learner's OWN data (independence)
ok(switchProfile(firstId) === true, 'switch: to first failed');
ok(S.profile.name === 'Ada' && S.profile.grade === 4 && S.progress.coins === 42, 'switch: first learner data not restored');
switchProfile(secondId);
ok(S.profile.name === 'Bo' && S.profile.grade === 6 && S.progress.coins === 7, 'switch: second learner data not restored');

// 4) listProfiles shape
const list = listProfiles();
ok(list.length === 2 && list.filter((p) => p.active).length === 1, 'list: 2 profiles, exactly one active');
ok(list.some((p) => p.name === 'Ada') && list.some((p) => p.name === 'Bo'), 'list: names missing');

// 5) delete a non-active learner; refuse to delete the LAST one
ok(deleteProfile(firstId) === true, 'delete: removing non-active learner failed');
ok(profileCount() === 1, 'delete: expected 1 remaining');
ok(deleteProfile(secondId) === false, 'delete: must refuse to remove the last learner');
ok(profileCount() === 1, 'delete: last learner not protected');

// 6) persistence: storage holds a container, not a bare state
const raw = JSON.parse(localStorage.getItem('mathquest.v1'));
ok(raw && raw.profiles && raw.activeId, 'persist: container shape missing');
ok(Object.keys(raw.profiles).length === 1, 'persist: expected 1 saved profile');
ok(raw.profiles[raw.activeId].profile.name === 'Bo', 'persist: active learner not saved');

if (fails.length) { console.error('❌ PROFILES FAILED:\n' + fails.map((f) => '  • ' + f).join('\n')); process.exit(1); }
console.log('✅ PROFILES PASSED — migration, create, switch (independent data), last-learner guard, persistence.');
process.exit(0);
