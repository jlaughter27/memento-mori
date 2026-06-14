// game/camera.js — follows a target and stays inside the map bounds.
// Coordinates are in CSS pixels; the view (vw/vh) is the visible canvas size.
export function createCamera(viewW, viewH, mapW, mapH) {
  const cam = { x: 0, y: 0, vw: viewW, vh: viewH, mw: mapW, mh: mapH };
  const clamp = () => {
    cam.x = Math.max(0, Math.min(cam.x, Math.max(0, cam.mw - cam.vw)));
    cam.y = Math.max(0, Math.min(cam.y, Math.max(0, cam.mh - cam.vh)));
  };
  cam.setView = (w, h) => { cam.vw = w; cam.vh = h; clamp(); };
  cam.setMap = (w, h) => { cam.mw = w; cam.mh = h; clamp(); };
  cam.center = (tx, ty) => { cam.x = tx - cam.vw / 2; cam.y = ty - cam.vh / 2; clamp(); };
  cam.follow = (tx, ty, smooth = 1) => {
    cam.x += ((tx - cam.vw / 2) - cam.x) * smooth;
    cam.y += ((ty - cam.vh / 2) - cam.y) * smooth;
    clamp();
  };
  return cam;
}
