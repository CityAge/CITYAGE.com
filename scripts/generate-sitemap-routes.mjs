import { readdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import config from '../next.config.mjs'

// Access-controlled pages and the redirect into a private partner page.
// Keep this exclusion policy aligned with new gates; proxy.ts remains unchanged.
const excluded = ['/northern-century', '/dispatches', '/pulse', '/the-next-west', '/next-vancouver', '/cec/partners', '/space-to-ice/partners', '/held-back']
const isPublic = path => !excluded.some(prefix => path === prefix || path.startsWith(`${prefix}/`))

export async function discoverRoutes(directory, segments = []) {
  const routes = []
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (/^[\[_@]/.test(entry.name)) continue
      const next = entry.name.startsWith('(') ? segments : [...segments, entry.name]
      routes.push(...await discoverRoutes(join(directory, entry.name), next))
    } else if (/^page\.(tsx?|jsx?)$/.test(entry.name)) {
      const path = `/${segments.join('/')}`
      if (isPublic(path)) routes.push(path)
    }
  }
  return routes
}

const routes = await discoverRoutes(new URL('../app', import.meta.url).pathname)
const rewrites = await config.rewrites?.() ?? []
const entries = Array.isArray(rewrites) ? rewrites : Object.values(rewrites).flat()
for (const { source, destination } of entries) {
  // Include canonical clean URLs for legacy public HTML, not redirect aliases.
  if (destination.endsWith('.html') && !source.includes(':') && isPublic(source)) routes.push(source)
}

// The frozen copy of the old WordPress pages (public/__archive) is served at the old
// addresses. List those addresses for Google too, so the old pages stay indexed after
// the move. Left out: old addresses a new page has replaced or that forward to one, and tag listings.
async function archivedPages(directory, segments = []) {
  const pages = []
  let entries = []
  try { entries = await readdir(directory, { withFileTypes: true }) } catch { return pages }
  for (const entry of entries) {
    if (entry.isDirectory()) pages.push(...await archivedPages(join(directory, entry.name), [...segments, entry.name]))
    else if (entry.name === 'index.html' && segments.length) pages.push(`/${segments.join('/')}/`)
  }
  return pages
}
const forwarded = new Set((await config.redirects?.() ?? []).filter(r => !r.source.includes(':')).map(r => r.source))
const archive = (await archivedPages(new URL('../public/__archive', import.meta.url).pathname))
  .filter(path => !forwarded.has(path) && !path.startsWith('/category/') && isPublic(path.replace(/\/$/, '')) && !routes.includes(path.replace(/\/$/, '')))
await writeFile(new URL('../lib/sitemap-archive.generated.json', import.meta.url), `${JSON.stringify([...new Set(archive)].sort(), null, 2)}\n`)

await writeFile(new URL('../lib/sitemap-routes.generated.json', import.meta.url), `${JSON.stringify([...new Set(routes)].sort(), null, 2)}\n`)
