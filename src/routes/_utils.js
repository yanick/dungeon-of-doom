export function createGrid(w, h, d = '#') {
  const grid = [];

  for (let x = 0; x < w; x++) {
    grid[x] = [];
    for (let y = 0; y < h; y++) {
      grid[x][y] = d;
    }
  }

  return grid;
}

export function visitGrid(grid, callback) {
  for (let x = 0; x < grid.length; x++) {
    const g = grid[x];
    for (let y = 0; y < g.length; y++) {
      callback(x, y, g[y]);
    }
  }
}
