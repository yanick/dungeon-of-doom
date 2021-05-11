<script>
  import { browser } from '$app/env';
  import { Display, Map, FOV } from 'rot-js';

  import { randomEmptySpace, createGrid, visitGrid } from './_utils';

  const WIDTH = 78;
  const HEIGHT = 24;

  let view;
  let dungeon;
  let cave = false;

  if (browser)
    dungeon = new Display({
      width: WIDTH,
      height: HEIGHT,
      fontSize: 12
    });

  $: if (view && dungeon) view.appendChild(dungeon.getContainer());

  let grid;

  $: if (dungeon) {
    dungeon.clear();

    grid = createGrid(WIDTH, HEIGHT, null);

    let map;

    const build = (x, y, wall) => {
      if (!wall) return;
      grid[x][y] = '#';
      dungeon.draw(x, y, '#', 'grey');
    };

    if (cave) {
      map = new Map.Cellular(WIDTH, HEIGHT);
      map.randomize(0.5);
      map.create();
      map.create();
      map.connect(build);
    } else {
      map = new Map.Digger(WIDTH, HEIGHT);
      map.create(build);
    }

    let hero = randomEmptySpace(grid, '@');
    dungeon.draw(...hero, '@', 'lightblue');

    let treasure = randomEmptySpace(grid, '%');
    dungeon.draw(...treasure, '%', 'red');

    const lightPasses = (x, y) => grid[x][y] !== '#';

    const fov = new FOV.PreciseShadowcasting(lightPasses);

    fov.compute(...hero, 10, (x, y) => {
      if (grid[x][y]) return;
      dungeon.draw(x, y, grid[x][y], null, '#660');
    });
  }
</script>

<div class="head">
  <h1>Dungeon of Doom</h1>
  <label>
    cave <input type="checkbox" bind:checked={cave} />
  </label>
</div>

<div class="dungeon" bind:this={view} />

<style>
  .head {
    display: flex;
    align-items: baseline;
  }
  label {
    display: block;
  }
  h1 {
    margin: 0pt;
    margin-right: 2em;
  }
</style>
