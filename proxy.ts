import { NextResponse, type NextRequest } from 'next/server'
import frozenBare from '@/lib/frozen-bare.generated.json'

/** Old WordPress pages kept in the frozen copy, as asked for without the trailing slash. */
const FROZEN_BARE = new Set<string>(frozenBare)

/**
 * Pages held back from the public while they are worked on.
 *
 * A browser that has opened one of them once with ?preview=<PREVIEW_KEY>
 * gets a private cookie and sees the page from then on; everyone else,
 * search engines included, gets the site's 404. With no PREVIEW_KEY set
 * in the environment, nobody sees them.
 */
const PRIVATE = ['/northern-century', '/dispatches', '/pulse', '/the-next-west']
// Held back on the exact address only, so /next-vancouver/partners keeps working.
const PRIVATE_EXACT = ['/next-vancouver', '/next-vancouver.html']
const COOKIE = 'ca_preview'

export function proxy(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl

  // "/past-events" → "/past-events/" on cityage.com. Without this the request falls through to the
  // live archive, which forwards to archive.cityage.com. Exact match only, so no loop.
  if (FROZEN_BARE.has(pathname)) {
    const url = req.nextUrl.clone()
    url.pathname = `${pathname}/`
    return NextResponse.redirect(url, 308)
  }
  const isPrivate =
    PRIVATE.some((p) => pathname === p || pathname.startsWith(`${p}/`)) || PRIVATE_EXACT.includes(pathname)
  if (!isPrivate) return NextResponse.next()

  const key = process.env.PREVIEW_KEY
  const given = searchParams.get('preview')
  if (key && given && given === key) {
    const url = req.nextUrl.clone()
    url.searchParams.delete('preview')
    const res = NextResponse.redirect(url)
    res.cookies.set(COOKIE, key, { httpOnly: true, secure: true, sameSite: 'lax', path: '/', maxAge: 60 * 60 * 24 * 90 })
    return res
  }
  if (key && req.cookies.get(COOKIE)?.value === key) {
    const res = NextResponse.next()
    res.headers.set('X-Robots-Tag', 'noindex, nofollow')
    return res
  }
  const res = NextResponse.rewrite(new URL('/held-back', req.url), { status: 404 })
  res.headers.set('X-Robots-Tag', 'noindex, nofollow')
  return res
}

export const config = {
  matcher: [
    '/the-next-west/:path*', '/northern-century/:path*', '/dispatches/:path*', '/pulse/:path*', '/next-vancouver', '/next-vancouver.html',
    // Any page address without a trailing slash or file extension, for the old-page forward above.
    '/((?!_next/|api/|__archive/|wp-content/|wp-includes/)[^.]*[^/.])',
  ],
}
