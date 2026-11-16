/**
 * Old cityage.com addresses that Google still asks for, forwarded to the closest page
 * that exists today. Built from Search Console (Pages → Not found (404) and Blocked (403))
 * on 16 Nov 2026. Most come from 2020–2024 email links to an older version of the site.
 * Each destination is a frozen old page (public/__archive) or a new-site page.
 */
import { readdirSync } from 'node:fs'
import { join } from 'node:path'

/** Hand-picked: old address → closest page today. */
export const HAND_MAP = {
  '/event/how-to-modernize-our-supply-chains': '/past-events/fast-track-cities-building-sustainable-supply-chains-2/',
  '/event/digitalinfra': '/past-events/the-digital-transformation-of-american-infrastructure/',
  '/event/decarbonizing-fast-growing-cities-in-person-summit-vancouver': '/past-events/fast-growing-cities-and-the-circular-economy/',
  '/event/the-data-effect-vancouver-the-next-evolution-in-health-our-ai-health-data-opportunity': '/past-events/the-data-effect-vancouver-our-health-data-opportunity/',
  '/event/heart-of-the-climate-economy-atlanta-in-person': '/past-events/cityage-atlanta-heart-of-the-new-climate-economy/',
  '/event/how-to-build-a-digital-society': '/past-events/the-data-effect-how-to-build-a-digital-society/',
  '/event/decarbonizing-houston': '/past-events/cityage-houston-decarbonizing-americas-energy-capital/',
  '/event/future-of-health-summit': '/past-events/the-future-of-health/',
  '/articles-right-column/mcmaster-community-energy': '/mcmaster-research-co-op-leads-charge-to-harvest-community-energy/',
  '/articles/canadas-moment-how-the-north-can-lead-the-world-in-the-next-space-race': '/why-every-company-city-and-citizen-needs-a-space-strategy/',
  '/cityage-vancouver-2024': '/past-events/',
  '/cityage-atlanta-2023': '/past-events/cityage-atlanta-heart-of-the-new-climate-economy/',
  '/cityageinsights-houston': '/past-events/cityage-houston-decarbonizing-americas-energy-capital/',
  '/circular-future': '/past-events/building-a-circular-food-future/',
  '/americanneighborhood': '/past-events/building-a-complete-american-neighbourhood/',
  '/americanneighborhood2': '/past-events/building-a-complete-american-neighbourhood/',
  '/build-the-futures-cities-campaign': '/campaigns/',
  '/crossover-acceleration': '/crossover-ai-cityage-explores-artificial-intelligence-for-2020/',
  '/crowds': '/past-events/bringing-the-crowds-back/',
  '/tde-toronto-2023': '/past-events/the-data-effect-toronto-health-cares-ai-revolution/',
  '/tde-vancouver-2023': '/past-events/the-data-effect-vancouver-our-health-data-opportunity/',
  '/ottawa-tde-2023': '/past-events/the-data-effect-ottawa-canadas-ai-future/',
  '/thedataeffect2022': '/campaigns/the-data-effect/',
  '/dataeffect': '/campaigns/the-data-effect/',
  '/datadriven': '/past-events/data-driven-investments/',
  '/americas-recovery-campaign': '/category/americas-recovery/',
  '/campaign-the-future-of-food-2': '/campaigns/foods-future/',
  '/urbangrowth': '/past-events/fast-growing-places/',
  '/beyondborders': '/past-events/opportunities-beyond-borders/',
  '/scf1': '/why-were-launching-smart-city-futures/',
  '/naturalcity': '/past-events/the-natural-city/',
  '/aibuildingbetter': '/past-events/how-ai-can-build-a-better-world/',
  '/nyc-urban-tech': '/past-events/cityage-new-york/',
  '/betteragriculture': '/past-events/better-agriculture-to-feed-10-billion-people/',
  '/breakoutcities': '/past-events/breakout-cities/',
  '/valuechain': '/past-events/building-a-digital-food-chain/',
  '/toronto-2023': '/past-events/cityage-toronto-canadas-next-10-million/',
  '/ethicalai': '/past-events/ethical-ai-its-time/',
  '/podcast': '/podcasts/',
  '/sponsor-inquiries': '/contact?subject=sponsoring',
  '/poltio-scooter-poll-results': '/',
  '/ras': '/',
  '/author/cj-joaquin/': '/',
}

/** Every frozen old page, as its address with the trailing slash ("/past-events/x/"). */
export function frozenPages(root = join(process.cwd(), 'public', '__archive')) {
  const pages = []
  const walk = (dir, segments) => {
    let entries = []
    try { entries = readdirSync(dir, { withFileTypes: true }) } catch { return }
    for (const entry of entries) {
      if (entry.isDirectory()) walk(join(dir, entry.name), [...segments, entry.name])
      else if (entry.name === 'index.html' && segments.length) pages.push(`/${segments.join('/')}/`)
    }
  }
  walk(root, [])
  return pages.sort()
}

/**
 * Permanent redirects for old addresses. Order matters: exact addresses first, then
 * the pattern rules, so a pattern never overrides a hand-picked destination.
 */
/** @param {string[]} newPages addresses the new site owns ("/contact"); never redirected. */
export function legacyRedirects(newPages = []) {
  const owned = new Set(newPages)
  const frozen = frozenPages()
  const frozenSet = new Set(frozen)
  const out = []
  const add = (source, destination) => out.push({ source, destination, permanent: true })

  for (const [from, to] of Object.entries(HAND_MAP)) {
    add(from, to)
    // The same address with or without its trailing slash.
    if (from !== '/' && !from.endsWith('/')) add(`${from}/`, to)
  }

  // Old event pages: /event/<slug> → /past-events/<slug>/ when that page was kept.
  for (const page of frozen) {
    const m = page.match(/^\/past-events\/([^/]+)\/$/)
    if (m && !HAND_MAP[`/event/${m[1]}`]) {
      add(`/event/${m[1]}`, page)
      add(`/event/${m[1]}/`, page)
    }
  }
  // Old sidebar article addresses: /articles-right-column/<slug> → /<slug>/ when kept.
  for (const page of frozen) {
    const m = page.match(/^\/([^/]+)\/$/)
    if (m && !HAND_MAP[`/articles-right-column/${m[1]}`]) {
      add(`/articles-right-column/${m[1]}`, page)
      add(`/articles-right-column/${m[1]}/`, page)
    }
  }
  // Anything else under those old folders: their nearest listing.
  add('/event/:slug*', '/past-events/')
  add('/articles-right-column/:slug*', '/news/')
  // Old category pages 2, 3, ... → the category's first page, which was kept.
  for (const page of frozen) {
    const m = page.match(/^\/category\/([^/]+)\/$/)
    if (m) add(`/category/${m[1]}/page/:n(\\d+)/`, page)
  }
  // A frozen page asked for without its trailing slash stays on cityage.com.
  for (const page of frozen) {
    const bare = page.slice(0, -1)
    if (!frozenSet.has(bare) && !HAND_MAP[bare] && !owned.has(bare)) add(bare, page)
  }
  return out
}
