# Privacy

**Short version: MathQuest collects nothing. Nothing your child does leaves the device.**

MathQuest is built privacy-first, which matters especially for a children's product.

## What we collect
**None of your data is sent anywhere.** There is no server, no analytics, no advertising, and
no tracking of any kind. We do not know who you are, and we never will.

## What is stored, and where
The app saves your child's **progress locally** in the browser's `localStorage` on **your
device only** (a single key, `mathquest.v1`). This includes things like: chosen name and
grade, skills practiced and mastered, XP/level/coins, badges, owned shop items/pets, streak and
daily-goal counters, and settings.

This data:
- **Never leaves the device.** It is not uploaded, synced, shared, or sold.
- Is **not personally identifying** — it's whatever name your child types plus math progress.
- Can be **erased anytime**: *Grown-ups Corner → Reset all progress*, or by clearing the
  browser's site data.

## Network use
The only network activity is **downloading the app's own files** the first time you visit (or
when you install/update it). After that, MathQuest runs **fully offline**. It makes no other
network requests. (Fonts load from Google Fonts as a progressive enhancement and gracefully
fall back to system fonts offline; no analytics are attached.)

## No accounts, no ads
There is nothing to sign up for, no login, no email, no in-app purchases, and no advertisements.

## Children's privacy (COPPA-friendly by design)
Because MathQuest has no servers and collects no personal information, there is no personal
data for any operator to access, store, or disclose. This architecture is intended to align
with the spirit of children's privacy regulations such as **COPPA**: the safest data is the
data that is never collected.

## Permissions
MathQuest may use, only on your device and only if you enable it:
- **Audio** — for sound effects and optional read-aloud (text-to-speech). Toggle in settings.
- **Offline storage** — `localStorage` (progress) and a service worker cache (the app files).

## Questions
This is an open project — you can read every line of code in this repository to verify the
above. The relevant files are `js/storage.js` (the only place data is saved) and
`service-worker.js` (the only place files are cached).

*Last reviewed: 2026-06-06 · applies to MathQuest v2.0.*
