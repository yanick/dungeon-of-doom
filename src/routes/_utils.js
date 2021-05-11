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

export function randomEmptySpace(grid,value=null) {
    let tries = 100;
    while(tries-- > 0) {
      const x = parseInt( grid.length * Math.random() );
      const y = parseInt( grid[0].length * Math.random() );
      if( !grid[x][y] ) {
          if(value) grid[x][y] = value;
        return [x,y];
      }
    }
    return;
}
