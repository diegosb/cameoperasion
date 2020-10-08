<script>
  import { onMount } from 'svelte'
  import { loadCelebrities } from './api'
  import { loadImage } from './utils.js'
  import { select } from './select.js'
  import Home from './container/Home.svelte'
  import Game from './container/Game.svelte'

  const PAGES = {
    WELCOME: 'WELCOME',
    PLAYING: 'PLAYING',
  }
  let activeScreen = PAGES.WELCOME
  let selectedCelebritiesType = null

  const startGame = async (e) => {
    const { celebs, lookup } = await loadCelebrities()
    const { category } = e.detail

    selectedCelebritiesType = select(celebs, lookup, category.slug)
    activeScreen = PAGES.PLAYING
  }

  onMount(() => {
    loadCelebrities()
    loadImage('/icons/right.svg')
    loadImage('/icons/wrong.svg')
    loadImage('/images/vs.png')
  })
</script>

<style>
  .app__header {
    display: flex;
    width: 100vw;
    justify-content: center;
    align-items: center;
    background-color: var(--secondary-700-color);
    color: var(--secondary-100-color);
    font-size: 2.5rem;
    line-height: 1.6;
    height: 100px;
  }

  .logo {
    display: inline-block;
    background: url(/icons/compare.svg) 50% 50% no-repeat;
    background-size: 100% 100%;
    width: 0.8em;
    transform: scale(1.4);
    left: 0.02em;
    text-indent: -9999px;
  }

  .app__content {
    min-height: calc(100vh - 100px);
    width: 100vw;
    background-color: var(--secondary-100-color);
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-direction: column;
  }
</style>

<div class="app">
  <header class="app__header">CameoP<span class="logo">a</span>rison</header>
  <main class="app__content">
    {#if activeScreen === PAGES.WELCOME}
      <Home on:select={startGame} />
    {:else if activeScreen === PAGES.PLAYING}
      <Game
        celebrities={selectedCelebritiesType}
        on:restart={() => (activeScreen = PAGES.WELCOME)} />
    {/if}
  </main>
</div>
