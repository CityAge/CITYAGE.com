const { test } = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const vm = require('node:vm')
const ts = require('typescript')
const routes = require('../lib/sitemap-routes.generated.json')

function load(fetch) {
  const exports = {}
  const dependencies = {
    './robots': { SITE_BASE_URL: 'https://cityagemag.vercel.app' },
    '@/lib/sitemap-routes.generated.json': routes,
    '@/lib/magazine': { SECTIONS: ['power', 'money', 'cities', 'frontiers', 'culture'].map(slug => ({ slug })) },
    '@/lib/supabase/env': { supabaseEnv: () => ({ url: 'https://example.supabase.co', key: 'test' }) },
  }
  const code = ts.transpileModule(fs.readFileSync('app/sitemap.ts', 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, esModuleInterop: true },
  }).outputText
  vm.runInNewContext(code, { exports, require: name => dependencies[name], fetch, URLSearchParams, AbortSignal })
  return exports.default
}

test('complete pagination, canonical slugs, dates and public route priorities', async () => {
  const batches = [
    [{ id: '001', slug: 'new-article', updated_at: '2026-09-21', published_at: '2026-09-20' }],
    [{ id: '002', slug: null, updated_at: null, published_at: '2026-09-22' }],
    [],
  ]
  let calls = 0
  const sitemap = load(async url => {
    const params = new URL(url).searchParams
    assert.equal(params.get('status'), 'eq.published')
    assert.equal(params.get('id'), calls ? `gt.00${calls}` : null)
    return { ok: true, json: async () => batches[calls++] }
  })
  const entries = await sitemap()
  assert.equal(calls, 3, 'continues even when the server returns fewer than the requested limit')
  assert.equal(entries.length, routes.length + 2)
  assert.equal(entries.find(row => row.url.endsWith('/new-article')).lastModified.toISOString(), '2026-09-21T00:00:00.000Z')
  assert.equal(entries.find(row => row.url.endsWith('/002')).priority, 0.6)
  assert.equal(entries.find(row => row.url.endsWith('/power')).priority, 0.8)
  assert.equal(entries.find(row => row.url.endsWith('/contact')).priority, 0.3)
  assert.equal(entries.find(row => row.url === 'https://cityagemag.vercel.app').priority, 1)
  assert.ok(!entries.some(row => /northern-century|dispatches|\/cec\/|\/next-vancouver\/partners|space-to-ice/.test(row.url)))
})

test('data-source failure cannot produce a partial successful sitemap', async () => {
  await assert.rejects(load(async () => ({ ok: false, status: 503 }))(), /query failed: 503/)
})
