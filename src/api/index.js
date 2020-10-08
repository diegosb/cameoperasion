const ENDPOINT = 'https://cameo-explorer.netlify.app'

export const loadCelebrities = async () => {
  const res = await fetch(`${ENDPOINT}/celebs.json`)
  const data = await res.json()
  const lookup = new Map()
  const MIN_REVIEWS = 50

  data.forEach((c) => {
    lookup.set(c.id, c)
  })

  const subset = new Set()
  data.forEach((celeb) => {
    if (celeb.reviews >= MIN_REVIEWS) {
      subset.add(celeb)
      celeb.similar.forEach((id) => {
        subset.add(lookup.get(id))
      })
    }
  })

  return {
    celebs: Array.from(subset),
    lookup,
  }
}
