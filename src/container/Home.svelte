<script>
  import { createEventDispatcher } from 'svelte'

  const dispatch = createEventDispatcher()
  const selectCategory = (category) => {
    dispatch('select', { category })
  }

  const availableCategories = [
    { slug: 'actors', label: 'Actors' },
    { slug: 'athletes', label: 'Athletes' },
    { slug: 'comedians', label: 'Comedians' },
    { slug: 'creators', label: 'Creators' },
    { slug: 'models', label: 'Models' },
    { slug: 'musicians', label: 'Musicians' },
    { slug: 'reality-tv', label: 'Reality TV' },
  ]
</script>

<style>
  .welcome-screen {
    text-align: center;
    display: flex;
    flex-direction: column;
    flex: 1 1 auto;
    width: 70vw;
    margin: 0 auto;
  }
  h1 {
    font-size: 3rem;
    color: var(--primary-color);
    font-weight: bold;
  }
  h2 {
    color: var(--secondary-700-color);
    font-weight: normal;
  }
  img {
    height: 2rem;
    width: auto;
    filter: invert(1);
  }
  p {
    font-size: 1rem;
  }
  .welcome-screen > p {
    color: var(--secondary-700-color);
    font-weight: bold;
  }

  .categories-buttons {
    display: flex;
    flex-direction: column;
    width: 80%;
    margin: 0 auto;
  }
  button {
    width: min(80vw, 300px);
    margin: 0 auto 1rem;
    font-size: 1.15rem;
    letter-spacing: 0.5px;
    padding: 1rem 0;
    background: var(--secondary-400-color);
    color: var(--secondary-100-color);
    text-transform: uppercase;
    border: none;
    border-radius: 8px;
    outline: none;
    cursor: pointer;
    transition: background 250ms ease-in-out;
  }
  button:hover {
    background: var(--secondary-700-color);
  }
</style>

<section class="welcome-screen">
  <header>
    <h1>
      Do you know
      <a href="https://cameo.com">
        <img
          src="https://d3el26csp1xekx.cloudfront.net/staticDir/logo_white.svg"
          alt="Cameo logo" /></a>?
    </h1>
    <h2>There you can buy personalised video clips from everyone from Lindsay Lohan to Ice T</h2>
    <p>But <b>WHO</b> commands the highest price?</p>
  </header>

  <p>Pick a category to start the game:</p>

  <div class="categories-buttons">
    {#each availableCategories as category}
      <button type="button" on:click={() => selectCategory(category)}> {category.label} </button>
    {/each}
  </div>
</section>
