<script>
  import { browser } from '$app/env';
  import { Display } from 'rot-js';

  import { createGrid, visitGrid } from './_utils';

  const WIDTH = 78;
  const HEIGHT = 24;

  let view;
  let dungeon;

  if (browser)
    dungeon = new Display({
      width: WIDTH,
      height: HEIGHT,
      fontSize: 12
    });

  $: if (view && dungeon) view.appendChild(dungeon.getContainer());

  const grid = createGrid(WIDTH, HEIGHT, '#');

  $: if (dungeon)
    visitGrid(grid, (x, y, cell) => dungeon.draw(x, y, cell, 'grey'));
</script>

<h1>Dungeon of Doom</h1>

<div class="dungeon" bind:this={view} />
