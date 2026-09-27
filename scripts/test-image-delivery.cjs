const assert = require('node:assert/strict')
const { test } = require('node:test')
const fs = require('node:fs')
const path = require('node:path')
const Module = require('node:module')
const ts = require('typescript')
const React = require('react')
const { renderToStaticMarkup } = require('react-dom/server')
const root = path.resolve(__dirname, '..')

// Exercise the actual TS/TSX without adding a test-runner dependency.
function load(file, aliases = {}) {
  const filename = path.join(root, file)
  const mod = new Module(filename, module)
  mod.filename = filename
  mod.paths = Module._nodeModulePaths(path.dirname(filename))
  const requireModule = mod.require.bind(mod)
  mod.require = (id) => aliases[id] ?? requireModule(id)
  mod._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX },
  }).outputText, filename)
  return mod.exports
}
const delivery = load('lib/image-delivery.ts')
const Image = load('components/site-image.tsx', { '@/lib/image-delivery': delivery }).default
const publicSrc = 'https://example.supabase.co/storage/v1/object/public/magazine/a.jpg'
const render = (props) => renderToStaticMarkup(React.createElement(Image, props))

test('all source types render a native image without optimizer URLs or Next props', () => {
  for (const src of ['/film.jpg', 'https://images.example.com/hero.jpg', publicSrc,
    'data:image/png;base64,AAAA', { src: '/static.jpg', width: 600, height: 400 }]) {
    const html = render({ src, alt: 'Test', fill: true, priority: true })
    assert.match(html, /<img /)
    assert.doesNotMatch(html, /\/_next\/image|\sfill=|\spriority=/)
  }
})
test('fill, crop classes, caller styles and priority preserve layout and loading', () => {
  const html = render({ src: '/film.jpg', fill: true, priority: true, alt: '',
    className: 'object-cover object-top', style: { opacity: 0.4 } })
  for (const value of ['position:absolute', 'inset:0', 'width:100%', 'height:100%',
    'opacity:0.4', 'object-cover object-top', 'loading="eager"', 'fetchPriority="high"']) {
    assert.ok(html.includes(value), value)
  }
})
test('local and other remote assets remain direct, lazy by default', () => {
  for (const src of ['/film.jpg', 'https://images.example.com/a.jpg']) {
    assert.deepEqual(delivery.imageDelivery(src), { src })
    assert.match(render({ src, alt: '' }), /loading="lazy"/)
    assert.doesNotMatch(render({ src, alt: '' }), /srcSet=/)
  }
})
test('Supabase originals get bounded responsive transforms, sizes and compression', () => {
  const d = delivery.imageDelivery(publicSrc)
  assert.match(d.src, /\/render\/image\/public\/magazine\/a.jpg\?quality=70&width=960/)
  assert.equal(d.srcSet.split(', ').length, 5)
  const html = render({ src: publicSrc, fill: true, sizes: '33vw', alt: '' })
  assert.match(html, /sizes="33vw"/)
  assert.doesNotMatch(html, /\/_next\/image/)
})
test('fixed-size images get 1x and 2x widths, capped at Supabase limits', () => {
  assert.match(delivery.imageDelivery(publicSrc, { width: 260 }).srcSet, /width=520 520w/)
  assert.match(delivery.imageDelivery(publicSrc, { width: 2000 }).srcSet, /width=2500 2500w/)
})
test('existing speaker transformations, signed URLs and SVG/GIF stay untouched', () => {
  for (const src of [publicSrc.replace('/object/', '/render/image/') + '?width=220&height=264&quality=55',
    publicSrc.replace('/public/', '/sign/') + '?token=preserved', publicSrc.replace('.jpg', '.svg'),
    publicSrc.replace('.jpg', '.gif')]) assert.deepEqual(delivery.imageDelivery(src), { src })
})
test('legacy optimizer-wrapped inputs are unwrapped, never re-emitted', () => {
  const wrapped = '/_next/image?url=' + encodeURIComponent(publicSrc) + '&w=1920&q=75'
  assert.equal(delivery.directImageSource(wrapped), publicSrc)
  assert.doesNotMatch(render({ src: wrapped, alt: '' }), /\/_next\/image/)
  assert.equal(delivery.directImageSource('/_next/image'), '')
})
test('static imports preserve intrinsic dimensions; explicit dimensions win', () => {
  const src = { default: { src: '/static.jpg', width: 600, height: 400 } }
  assert.match(render({ src, alt: '' }), /width="600" height="400"/)
  assert.match(render({ src, alt: '', width: 300, height: 200 }), /width="300" height="200"/)
})
test('no application component imports Next Image; global safeguard is enabled', () => {
  for (const dir of ['app', 'components']) {
    for (const file of fs.readdirSync(path.join(root, dir), { recursive: true })) {
      if (!/\.[jt]sx?$/.test(file)) continue
      const code = fs.readFileSync(path.join(root, dir, file), 'utf8')
      assert.doesNotMatch(code, /(?:from\s*|require\()\s*['"]next\/(?:legacy\/)?image['"]/, file)
    }
  }
  assert.match(fs.readFileSync(path.join(root, 'next.config.mjs'), 'utf8'), /unoptimized:\s*true/)
})
