import { NextResponse, type NextRequest } from 'next/server'

/**
 * Pages held back from the public while they are worked on.
 *
 * A browser that has opened one of them once with ?preview=<PREVIEW_KEY>
 * gets a private cookie and sees the page from then on; everyone else,
 * search engines included, gets the site's 404. With no PREVIEW_KEY set
 * in the environment, nobody sees them.
 */
const PRIVATE = ['/northern-century']
const COOKIE = 'ca_preview'

export function proxy(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl
  const isPrivate = PRIVATE.some((p) => pathname === p || pathname.startsWith(`${p}/`))
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
  const res = NextResponse.rewrite(new URL('/__private', req.url), { status: 404 })
  res.headers.set('X-Robots-Tag', 'noindex, nofollow')
  return res
}

export const config = { matcher: ['/northern-century/:path*'] }
