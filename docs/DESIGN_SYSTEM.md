# 🎨 MathQuest Design System

The single reference for **how the UI looks, spaces, and behaves** — so every
screen feels like one app and new work stays consistent. Pairs with
[`CLAUDE.md`](../CLAUDE.md) (invariant #7: accessibility) and
[`ARCHITECTURE.md`](ARCHITECTURE.md).

> TL;DR — use the **design tokens** in `css/styles.css` (`:root`) instead of magic
> numbers; let **long text shrink or wrap** (never overflow); keep **44px+ touch
> targets**, visible focus, and color-blind-safe states.

---

## 1. Design tokens (use these, not magic numbers)

Defined in `css/styles.css :root`. When you write new CSS, reach for a token first.

### Spacing — 4px scale
| Token | px | Use for |
|---|---|---|
| `--s-1` | 4 | hairline gaps, icon nudges |
| `--s-2` | 8 | tight gaps inside a control |
| `--s-3` | 12 | default gap between sibling elements |
| `--s-4` | 16 | card padding, section gaps |
| `--s-5` | 24 | group separation |
| `--s-6` | 32 | major section breaks |
| `--s-7` | 48 | hero / empty-state breathing room |

`--pad` (`clamp(14px,4vw,22px)`) remains the responsive **card** padding.

### Type ramp
`--fs-xs .72` · `--fs-sm .85` · `--fs-md 1` · `--fs-lg 1.15` · `--fs-xl 1.5` ·
`--fs-2xl 2` (rem). Headings use `clamp()` so they scale with viewport.

### Motion
One easing language, a few durations — don't invent ad-hoc values.
- **Durations:** `--t-fast .15s` (press/hover) · `--t-base .25s` (view enter, most
  transitions) · `--t-slow .4s` (modals, big moments).
- **Easing:** `--ease` (smooth modern default) · `--ease-spring` (gentle overshoot
  for delight — popups, celebrations). Use **transform + opacity only** (GPU) — never
  animate `width`/`box-shadow`/`filter` in hot paths.
- **View transitions:** the router toggles `.view-enter` on `#content` each route
  (`viewEnter` keyframe). All motion is zeroed under `prefers-reduced-motion`.

### Color & elevation
- **Brand:** `--p1`/`--p2` (purple), `--accent` (pink). Overridden per theme via
  `body[data-theme]` — **never hard-code a brand hex**; use the variable so all 9
  themes work. The chunky button shadow is its own per-theme token **`--p-shadow`**
  (a darker shade of `--p1`) — use it, not a literal like `#5a4bd0`.
- **Semantic:** `--good`, `--warn`, `--bad`, `--coin` are bright **fills**. For text/icon
  on white use the **contrast-safe aliases** `--good-text`, `--bad-text`, `--coin-text`
  (the bright versions fail WCAG AA as small text). `--ink`, `--ink-soft` for body copy.
- **Elevation:** the signature look is a **chunky bottom shadow** (`box-shadow:0 Ypx 0 <color>`)
  that compresses on `:active` (`translateY`). Shadow colors: `--p-shadow` (themed),
  `--shadow-key`, `--shadow-key-good`. Modals use `--shadow-modal`. Hairline: `--line`.
- **Radii:** `--radius` (22) cards · `--radius-md` (18) mid cards · `--radius-lg` (20)
  nav/large · `--radius-sm` (14) controls.
- **Dark backgrounds** (`data-bg=stars/galaxy/aurora`): frost white surfaces
  (`background:rgba(255,255,255,.94)`) so they stay legible — see the v2.9 block.

---

## 2. Text that never breaks the layout ⭐

Kid input and generated content are **variable-length**. Two helpers in
[`js/ui/dom.js`](../js/ui/dom.js) keep everything inside its box.

### `fitText(el, {min, max})` — auto-shrink answers
As the child types, the answer display **scales its font down to a floor**
instead of overflowing. Call it from the input's `sync()`:

```js
import { fitText } from '../ui/dom.js';
const sync = () => { disp.textContent = val || '?'; fitText(disp); };
```

- Remembers each element's natural size and **re-fits from there** (idempotent).
- **No-ops safely** where layout isn't measurable (jsdom tests, pre-paint), so you
  can call it unconditionally.
- CSS pairs with it: the box is `white-space:nowrap; overflow:hidden` with padding,
  so even an un-fitted fallback clips cleanly rather than spilling.
- Inputs are also **length-capped** (16 chars) — longer than any real answer.

### `promptLen(str)` → `'' | 'med' | 'long' | 'xlong'`
Bucket a prompt by length and put it on `[data-len]`; CSS sizes/wraps it:

```js
`<div class="problem-prompt" data-len="${promptLen(cur.prompt)}">…</div>`
```

Short math facts stay big and bold; long **word problems** scale down, wrap,
and left-align (`text-wrap:pretty`) so they read as a paragraph, not a billboard.

### General rule
Any element that can receive user/generated text gets `overflow-wrap:anywhere`
(titles, choices, bubbles, toasts, story text). Fixed-size display boxes get
`fitText`. Never assume content is short.

---

## 2b. Navigation & wayfinding

Two screen classes, one consistent pattern:
- **Top-level hubs** (`#/`, `#/adventure`, `#/pet`, `#/rewards`) show the kid **HUD**
  (avatar=home, level, coins, streak, ⚙️ gear) + the **4-item bottom nav**
  (Learn · Quest · Pet · Rewards). The **Grown-ups** area lives behind the HUD **gear**
  (`#/parent`), kept out of the kid nav.
- **Sub-screens** (lessons, practice, tutor, games, review/fix-it/warm-up, report,
  curriculum, grown-ups) hide the kid chrome and show one slim, sticky **back bar**
  (`renderSubhead`): `← Back · screen title · coins`. Back goes to the right parent
  (most → home; report/curriculum → grown-ups). Views must **not** add their own back
  button — the sub-header is the single, consistent escape. The router (`app.js`) and
  `SCREENS` map in `shell.js` own this; add a route's title/back there.

> Any view with a global listener/timer must clean up on `hashchange` (not just on a
> back click), since the child can leave via the shared back bar.

## 3. Layout & responsiveness

- **One column, max 760px**, centered (`.content`). Mobile-first; the 8-year-old's
  device is the design target.
- Use **`dvh`** (not `vh`) for full-height screens — avoids the iOS URL-bar jump.
- Respect **safe-area insets** on fixed chrome (`env(safe-area-inset-*)`).
- Grids use `repeat(auto-fill,minmax(Npx,1fr))` so cards reflow without breakpoints.
- Sticky HUD (top) + fixed nav (bottom); content padding leaves room for both
  (`padding-bottom:96px`).

---

## 4. Accessibility (non-negotiable — invariant #7)

- **Touch targets ≥ 44px** (most are 56–64). `--tap:64px`.
- **Visible focus:** `:focus-visible` ring everywhere; high-contrast override in
  low-contrast themes.
- **Color-blind safe:** correct/wrong use **icon + color** (✓/✗), never color alone.
- **Live regions:** feedback (`role="alert"`), score/timer (`aria-live`), mascot.
- **Dialogs** are real: focus trap, Escape, `inert` background, focus restore.
- **Reduced motion:** `prefers-reduced-motion` zeroes animations/transitions.
- **SVG manipulatives** carry descriptive labels; decorative emoji are
  `aria-hidden`.

---

## 5. Voice & tone (kid-facing copy)

- Reading level ≈ 2nd grade. Short, warm, growth-mindset.
- **Banned:** "Wrong!", "Easy!", ability praise ("You're so smart"). Use "not yet",
  effort praise, and always offer help.
- Escape all dynamic strings (`escapeHtml`/`mdInline`).

---

## 6. Common roadblocks (and how we avoid them)

| Pitfall in apps like this | Our guard |
|---|---|
| Long answers/prompts overflow their box | `fitText` + `promptLen` tiers + `overflow-wrap` |
| `100vh` jumps on mobile browsers | use `dvh` |
| Inconsistent spacing across screens | the `--s-*` token scale |
| Hard-coded brand colors break theming | always use `--p1/--p2/--accent` |
| Touch targets too small for small hands | `--tap`, 44px floors audited |
| Color-only success/error (color blindness) | icon + color states |
| Layout-measuring code crashes in jsdom tests | helpers no-op when unmeasurable |
| Animations cause discomfort | `prefers-reduced-motion` honored |
| Service worker serves stale UI after a change | bump `APP_VERSION` **and** SW cache (invariant #5) |
| Unescaped content → broken DOM / injection | `escapeHtml`/`mdInline` everywhere |

---

## 7. Checklist for any new screen

- [ ] Spacing/type/color use **tokens**, not magic numbers.
- [ ] Every variable-length string can **shrink or wrap** (no overflow).
- [ ] Touch targets ≥ 44px; visible focus; works by keyboard.
- [ ] Success/error states use **icon + color**.
- [ ] Looks right at 320px wide and on a large screen.
- [ ] Honors reduced-motion and the active theme.
- [ ] Copy is warm, short, growth-mindset; strings are escaped.
- [ ] If you added files: bump `APP_VERSION` + SW cache + CHANGELOG.
