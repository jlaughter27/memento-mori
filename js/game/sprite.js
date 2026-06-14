// game/sprite.js — a tiny canvas sprite renderer with a graceful emoji fallback.
// Draws a character from a sprite SHEET (animated), a single STATIC image, or — when
// no usable image is loaded — a plain EMOJI glyph. The fallback is what keeps the game
// rendering everywhere: the jsdom test environment can't decode images, so we detect an
// unusable image and quietly fall back so nothing throws and the world still draws.
// This is the swap point for bespoke art: hand it a loaded image and it upgrades itself.

// Load an image without ever throwing. Resolves to the HTMLImageElement on success, or
// null on any failure (bad src, decode error, no DOM Image, jsdom). Callers can `await`
// it and just check for null — no try/catch needed at the call site.
export function loadImage(src) {
  return new Promise((resolve) => {
    if (!src || typeof Image !== 'function') { resolve(null); return; }
    let img;
    try { img = new Image(); } catch (e) { resolve(null); return; }
    let done = false;
    const finish = (val) => { if (!done) { done = true; resolve(val); } };
    img.onload = () => finish(usable(img) ? img : null);
    img.onerror = () => finish(null);
    try { img.src = src; } catch (e) { finish(null); return; }
    // Some environments mark a cached image complete synchronously.
    if (img.complete && usable(img)) finish(img);
  });
}

// Is this image actually drawable? Must exist, be flagged complete, and report a real
// natural size. jsdom Images are "complete" but have 0 natural size — that fails here,
// which is exactly what routes us to the emoji path during tests.
function usable(img) {
  return !!img && img.complete === true &&
    (img.naturalWidth || 0) > 0 && (img.naturalHeight || 0) > 0;
}

// Resolve an animation's frame list into a flat array of frame indices once, so the hot
// path never allocates. Accepts an array of indices or an inclusive {from,to} range.
function frameList(frames) {
  if (Array.isArray(frames)) return frames.slice();
  if (frames && typeof frames === 'object') {
    const from = frames.from | 0, to = frames.to | 0;
    const out = [];
    if (to >= from) for (let i = from; i <= to; i++) out.push(i);
    else out.push(from);
    return out;
  }
  return [0];
}

// Create a sprite controller. See the file header / module API for the opts shape.
export function createSprite(opts = {}) {
  const image = opts.image || null;
  const emoji = opts.emoji || '🐱';
  const frameW = opts.frameW | 0;
  const frameH = opts.frameH | 0;

  // Pre-bake every animation into { list, fps, loop } so update/draw stay allocation-free.
  const anims = {};
  if (opts.anims && typeof opts.anims === 'object') {
    for (const name of Object.keys(opts.anims)) {
      const a = opts.anims[name] || {};
      anims[name] = {
        row: a.row | 0,
        list: frameList(a.frames),
        fps: a.fps > 0 ? a.fps : 1,
        loop: a.loop !== false, // loop by default
      };
    }
  }
  const names = Object.keys(anims);

  // Pick the render mode once. SHEET needs an image + frame size + at least one anim;
  // STATIC is any usable image without those; otherwise we fall back to EMOJI. We also
  // re-check usability at draw time so a not-yet-decoded image still draws as emoji.
  const sheetReady = usable(image) && frameW > 0 && frameH > 0 && names.length > 0;
  const cols = sheetReady ? Math.max(1, Math.floor(image.naturalWidth / frameW)) : 1;

  let curName = (opts.defaultAnim && anims[opts.defaultAnim]) ? opts.defaultAnim
    : (names[0] || '');
  let frameI = 0; // index into the current anim's list
  let timer = 0;  // seconds accumulated toward the next frame

  function setAnim(name) {
    if (name === curName || !anims[name]) return; // no-op on same/unknown
    curName = name;
    frameI = 0;
    timer = 0;
  }

  function update(dt) {
    const a = anims[curName];
    if (!a || !(dt > 0)) return;
    const n = a.list.length;
    if (n <= 1) return; // single-frame anim: nothing to advance
    timer += dt;
    const spf = 1 / a.fps;
    // Step frame-by-frame so the loop can't spiral on a huge dt.
    while (timer >= spf) {
      timer -= spf;
      frameI++;
      if (frameI >= n) frameI = a.loop ? 0 : n - 1;
    }
  }

  // Draw centered horizontally at x with the FEET near y (we draw upward from y), scaled
  // so the visible sprite is about `size` px tall. flipX mirrors for left-facing. Never
  // throws: any unusable-image situation drops to the emoji path.
  function draw(ctx, x, y, size, flipX) {
    if (!ctx) return;
    const h = size > 0 ? size : 32;

    if (sheetReady && usable(image)) {
      const a = anims[curName];
      const idx = (a && a.list[frameI] != null) ? a.list[frameI] : 0;
      const row = a ? a.row : 0;
      const sx = (idx % cols) * frameW;
      const sy = (row + Math.floor(idx / cols)) * frameH;
      const dw = h * (frameW / frameH); // preserve frame aspect ratio
      const dh = h;
      ctx.save();
      ctx.translate(x, y);
      if (flipX) ctx.scale(-1, 1);
      try { ctx.drawImage(image, sx, sy, frameW, frameH, -dw / 2, -dh, dw, dh); } catch (e) {}
      ctx.restore();
      return;
    }

    if (usable(image)) { // STATIC single-image mode: whole image, scaled by height
      const iw = image.naturalWidth, ih = image.naturalHeight;
      const dh = h, dw = h * (iw / ih);
      ctx.save();
      ctx.translate(x, y);
      if (flipX) ctx.scale(-1, 1);
      try { ctx.drawImage(image, -dw / 2, -dh, dw, dh); } catch (e) {}
      ctx.restore();
      return;
    }

    // EMOJI fallback: centered glyph with its feet near y. Sized a touch under `size`
    // because emoji glyphs carry their own padding.
    ctx.save();
    const prevAlign = ctx.textAlign, prevBase = ctx.textBaseline;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';
    ctx.font = `${Math.round(h * 0.95)}px serif`;
    try { ctx.fillText(emoji, x, y); } catch (e) {}
    ctx.textAlign = prevAlign;
    ctx.textBaseline = prevBase;
    ctx.restore();
  }

  function current() { return curName; }

  return { setAnim, update, draw, current };
}
