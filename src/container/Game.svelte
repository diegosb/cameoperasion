<script>
  import { createEventDispatcher } from 'svelte'
  import { fly, scale, crossfade } from 'svelte/transition'
  import * as eases from 'svelte/easing'
  import Card from '../components/Card.svelte'
  import { sleep, pickRandom, loadImage } from '../utils.js'

  export let celebrities
  let lastResult
  let done = false
  let ready = true

  const dispatch = createEventDispatcher()
  function restartGame() {
    dispatch('restart')
  }

  const [send, receive] = crossfade({
    easing: eases.cubicOut,
    duration: 300,
  })

  async function loadDetails(celebrity) {
    const res = await fetch(`https://cameo-explorer.netlify.app/celebs/${celebrity.id}.json`)
    const details = await res.json()
    await loadImage(details.image)
    return details
  }

  const promises = celebrities.map((round) =>
    Promise.all([loadDetails(round.a), loadDetails(round.b)]),
  )

  const results = Array(celebrities.length)

  $: score = results.filter((x) => x === 'right').length

  const pickMessage = (p) => {
    if (p <= 0.2) return pickRandom([`Oof.`, `Better luck next time?`])
    if (p <= 0.5) return pickRandom([`I've seen worse`, `Keep trying!`])
    if (p <= 0.8) return pickRandom([`Yeah!`, `Not bad. Practice makes perfect`])
    if (p < 1) return pickRandom([`Impressive.`])
    return pickRandom([`Flawless victory`, `Top marks`])
  }

  const submit = async (a, b, sign) => {
    lastResult = Math.sign(a.price - b.price) === sign ? 'right' : 'wrong'

    await sleep(1500)

    results[i] = lastResult
    lastResult = null

    await sleep(300)

    if (i < celebrities.length - 1) {
      i += 1
    } else {
      done = true
    }
  }

  let i = 0
</script>

<style>
  h1 {
    color: var(--secondary-700-color);
    font-size: 2rem;
    text-align: center;
  }
  .game-container {
    flex: 1;
    position: relative;
    width: min(100%, 800px);
    display: flex;
    align-items: center;
    flex-wrap: wrap;
  }

  .game {
    display: grid;
    grid-template-rows: 1fr 1fr;
    grid-gap: 0.5em;
    width: 100%;
    height: 100%;
    max-width: min(100%, 40vh);
    margin: 0 auto;
  }

  .game > div {
    display: flex;
    align-items: center;
  }

  .vs-img {
    height: 6rem;
    width: auto;
    justify-self: center;
    align-self: center;
  }

  .same-price {
    align-items: center;
    background: var(--primary-color);
    font-size: 2rem;
    padding: 1rem;
    width: 60%;
    margin: 0 auto;
    text-transform: uppercase;
    border: none;
    box-shadow: 0px 4px 3px 5px #7b1616;
    color: var(--secondary-100-color);
    font-weight: bold;
    cursor: pointer;
    transition: all 200ms ease;
  }

  .same-price:focus {
    outline: none;
  }

  .same-price:active {
    box-shadow: 0px 4px 3px 2px #7b1616;
    transform: translateY(3px);
    outline: none;
  }

  .error {
    color: red;
  }

  .giant-result {
    position: fixed;
    width: 50vmin;
    height: 50vmin;
    left: calc(50vw - 25vmin);
    top: calc(50vh - 25vmin);
    opacity: 0.5;
  }

  .results {
    display: grid;
    grid-gap: 0.2em;
    width: 100%;
    max-width: 320px;
    margin: 1em auto;
  }

  .result {
    background: var(--secondary-700-color);
    border-radius: 50%;
    padding: 0 0 100% 0;
    transition: background 0.2s;
    transition-delay: 0.2s;
  }

  .result img {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
  }

  .done {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .done strong {
    font-size: 6em;
    font-weight: 700;
  }

  @media (min-width: 640px) {
    .game {
      max-width: 100%;
      grid-template-rows: none;
      grid-template-columns: 1fr 8em 1fr;
      max-height: calc(100vh - 6em);
    }
  }
</style>

<header>
  <h1>
    Tap on the more monetisable celebrity's face, or tap 'same price' if society values them
    equally.
  </h1>
</header>

<div class="game-container">
  {#if done}
    <div class="done" in:scale={{ delay: 200, duration: 800, easing: eases.elasticOut }}>
      <strong>{score}/{results.length}</strong>
      <p>{pickMessage(score / results.length)}</p>
      <button on:click={() => restartGame()}>Back to main screen</button>
    </div>
  {:else if ready}
    {#await promises[i]}
      <p>Loading...</p>
    {:then [a, b]}
      <div
        class="game"
        in:fly={{ duration: 200, y: 20 }}
        out:fly={{ duration: 200, y: -20 }}
        on:outrostart={() => (ready = false)}
        on:outroend={() => (ready = true)}>
        <div class="card-container">
          <Card
            celeb={a}
            on:select={() => submit(a, b, 1)}
            showPrice={Boolean(lastResult)}
            winner={a.price >= b.price} />
        </div>
        <img class="vs-img" src="/images/vs.png" alt="versus" />
        <div class="card-container">
          <Card
            celeb={b}
            on:select={() => submit(a, b, -1)}
            showPrice={Boolean(lastResult)}
            winner={b.price >= a.price} />
        </div>
      </div>
      <button class="same-price" on:click={() => submit(a, b, 0)}> same price </button>
    {:catch}
      <p class="error">Oops! Failed to load data</p>
    {/await}
  {/if}
</div>

{#if lastResult}
  <img
    in:fly={{ duration: 200, x: 100 }}
    out:send={{ key: i }}
    class="giant-result"
    alt="{lastResult} answer"
    src="/icons/{lastResult}.svg" />
{/if}

<div class="results" style="grid-template-columns: repeat({results.length}, 1fr)">
  {#each results as result, i}
    <span class="result">
      {#if result}
        <img in:receive={{ key: i }} alt="{result} answer" src="/icons/{result}.svg" />
      {/if}
    </span>
  {/each}
</div>
