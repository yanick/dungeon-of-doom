<script>
  import { browser } from '$app/env';
  import { Display, Map, FOV, Path } from 'rot-js';

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
  let hero;
  let treasure;

  const colorFor = (char) =>
    char === '@'
      ? 'lightgreen'
      : char === '%'
      ? 'red'
      : char === '#'
      ? 'grey'
      : 'black';

  const lightPasses = (x, y) => grid[x][y] !== '#';

  const drawDungeon = (dungeon, grid) => {
    dungeon.clear();

    visitGrid(grid, (x, y, char) => {
      dungeon.draw(x, y, char, colorFor(char));
    });

    const fov = new FOV.PreciseShadowcasting(lightPasses);

    fov.compute(...hero, 10, (x, y) => {
      dungeon.draw(x, y, grid[x][y], colorFor(grid[x][y]), '#440');
    });
  };

  let generated = false;
  $: generated = cave && !cave;

  $: if (dungeon && !generated) {
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

    hero = randomEmptySpace(grid, '@');

    treasure = randomEmptySpace(grid, '%');

    drawDungeon(dungeon, grid);

    generated = true;
  }

  let input;
  let output = [];

  const dirs = {
    e: [1, 0],
    w: [-1, 0],
    n: [0, -1],
    s: [0, 1]
  };

  const handleKeyUp = (event) => {
    if (event.code !== 'Enter') return;

    if (input === 'cheat') {
      const d = new Path.Dijkstra(...treasure, lightPasses);

      d.compute(...hero, (x, y) => {
        if (!grid[x][y]) dungeon.draw(x, y, '.', 'red');
      });
    }

    const dir = dirs[input];
    if (!dir) {
      output = [...output, 'say what?'];
      input = '';
      return;
    }

    const newPos = hero.map((x, i) => x + dir[i]);

    if (grid[newPos[0]][newPos[1]] === '#') {
      output = [...output, 'ow'];
      input = '';
      return;
    }

    output = [...output, 'yes, my lord'];
    input = '';

    grid[hero[0]][hero[1]] = null;
    hero = newPos;
    grid[hero[0]][hero[1]] = '@';
    drawDungeon(dungeon, grid);
  };
</script>

<div class="head">
  <h1>Dungeon of Doom</h1>
  <label> cave <input type="checkbox" bind:checked={cave} /> </label>
</div>

<main>
  <div class="dungeon" bind:this={view} />

  <div class="output">
    <h4>output</h4>

    {#each output as line, i (i)}
      <div>{line}</div>
    {/each}
  </div>
</main>

<input class="input" type="text" bind:value={input} on:keyup={handleKeyUp} />

<style>
  main {
    display: flex;
  }
  .dungeon {
    margin-right: 1em;
  }
  .input {
    width: 40em;
  }
  .output {
    max-height: 15em;
    min-width: 15em;
    overflow-y: scroll;
  }
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
