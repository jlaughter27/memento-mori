// game/loop.js — a fixed-timestep game loop on requestAnimationFrame.
// update(step) runs at a steady rate (good for movement/collision); render(alpha)
// draws with an interpolation factor. The loop clamps long frames so a backgrounded
// tab doesn't "spiral", and auto-stops when `alive()` returns false (e.g. the canvas
// was removed from the DOM by the router).
export function createLoop({ update, render, step = 1 / 60, maxFrame = 0.1, alive } = {}) {
  let raf = 0, running = false, prev = 0, acc = 0;

  function frame(ts) {
    if (!running) return;
    if (alive && !alive()) { stop(); return; }
    let dt = (ts - prev) / 1000; prev = ts;
    if (!isFinite(dt) || dt < 0) dt = step;
    if (dt > maxFrame) dt = maxFrame;
    acc += dt;
    let guard = 0;
    while (acc >= step && guard++ < 5) { update(step); acc -= step; }
    if (render) render(acc / step);
    raf = requestAnimationFrame(frame);
  }

  function start() {
    if (running) return;
    running = true;
    raf = requestAnimationFrame((t) => { prev = t; acc = 0; frame(t); });
  }
  function stop() { running = false; if (raf) cancelAnimationFrame(raf); raf = 0; }

  return { start, stop, isRunning: () => running };
}
