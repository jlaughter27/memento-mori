// game/tilemap.js — parse a string-row map + legend into a pre-rendered image
// and a collision test. Pure logic + one offscreen-canvas prerender; no art here
// (a `drawTile` painter is passed in, so art can be swapped without touching this).
//
// A map looks like:
//   { tile:40, spawn:{col,row}, legend:{ 'T':{solid:true}, '.':{} }, rows:[ "T..T", ... ], objects:[...] }
export function createTileMap(map) {
  const tile = map.tile || 40;
  const rows = map.rows || [];
  const R = rows.length;
  const C = R ? rows[0].length : 0;
  const legend = map.legend || {};
  const widthPx = C * tile;
  const heightPx = R * tile;

  const codeAt = (col, row) => (row >= 0 && row < R && col >= 0 && col < C) ? rows[row][col] : 'T';
  const solidAt = (col, row) => { const e = legend[codeAt(col, row)]; return !!(e && e.solid); };
  const isSolidPx = (x, y) => solidAt(Math.floor(x / tile), Math.floor(y / tile));

  function prerender(drawTile) {
    const cv = document.createElement('canvas');
    cv.width = Math.max(1, widthPx);
    cv.height = Math.max(1, heightPx);
    const ctx = cv.getContext('2d');
    for (let r = 0; r < R; r++) {
      for (let c = 0; c < C; c++) drawTile(ctx, codeAt(c, r), c * tile, r * tile, tile);
    }
    return cv;
  }

  return { tile, cols: C, rows: R, widthPx, heightPx, codeAt, solidAt, isSolidPx, prerender };
}
