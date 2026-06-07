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

### Color & elevation
- **Brand:** `--p1`/`--p2` (purple), `--accent` (pink). Overridden per theme via
  `body[data-theme]` — never hard-code a brand hex; use the variable so themes work.
- **Semantic:** `--good`, `--warn`, `--bad`, `--coin`, `--ink`, `--ink-soft`.
- **Elevation:** the signature look is a **chunky bottom shadow** (`box-shadow:0 Ypx 0 <color>`)
  that compresses on `:active` (`translateY`). Shadow colors: `--shadow-key`,
  `--shadow-key-good`. Hairline dividers: `--line`.
- **Radii:** `--radius` (22) cards · `--radius-sm` (14) controls.

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
