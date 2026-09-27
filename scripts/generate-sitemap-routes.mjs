import { readdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import config from '../next.config.mjs'

// Access-controlled pages and the redirect into a private partner page.
// Keep this exclusion policy aligned with new gates; proxy.ts remains unchanged.
const excluded = ['/northern-century', '/dispatches', '/cec/partners', '/next-vancouver/partners', '/space-to-ice/partners']
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
await writeFile(new URL('../lib/sitemap-routes.generated.json', import.meta.url), `${JSON.stringify([...new Set(routes)].sort(), null, 2)}\n`)
