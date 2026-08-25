export type PaperPiece = {
  id: string
  href: string
  title: string
  vertical: string
  tagline: string
  excerpt: string
  date: string
  image: string
  readTime: string
}

/** Existing rooms — not invented news. Live in the paper as stories. */
export const ROOM_PIECES: PaperPiece[] = [
  {
    id: 'northern-century',
    href: '/northern-century.html',
    title: 'The Northern Century',
    vertical: 'Frontiers',
    tagline: 'The Arctic is not the edge of the map. It is the next frontier.',
    excerpt: 'Ideas and investments in the new geography of power — a CityAge room spanning the Arctic and the northern hemisphere.',
    date: '2026',
    image: '/northern-century-hero.png',
    readTime: 'The room',
  },
  {
    id: 'next-metro-vancouver',
    href: '/next-vancouver.html',
    title: 'The Next Metro Vancouver',
    vertical: 'Cities',
    tagline: 'The A.I. Edition — where this region can actually win.',
    excerpt: 'The second edition of The Next West / Next Metro Vancouver, in partnership with The Vancouver Sun.',
    date: 'Nov 2026',
    image: '/vancouver-bluesky.jpg',
    readTime: 'The room',
  },
  {
    id: 'canada-europe-connects',
    href: '/canada-europe-connects',
    title: 'Canada–Europe Connects',
    vertical: 'Power',
    tagline: 'Defence procurement, dual-use technology, and trans-Atlantic trade corridors.',
    excerpt: 'Invitation only · Ottawa · May 26, 2026. A room in the paper, not a brochure.',
    date: 'May 26, 2026',
    image: '/ottawa-feature.jpg',
    readTime: 'The room',
  },
]

export const STUDIO_FILMS = [
  {
    id: 'facing-saddam',
    title: 'Facing Saddam',
    type: 'Documentary Feature',
    href: '/facing-saddam-still.png',
    image: '/facing-saddam-thumb.png',
  },
  {
    id: 'best-day-ever',
    title: 'Best Day Ever',
    type: 'Short Film · Doug Coupland',
    href: 'https://vimeo.com/393076418',
    image: '/best-day-ever-thumb.jpg',
  },
  {
    id: 'sketch-in-the-city',
    title: 'Sketch In The City',
    type: 'Short Film',
    href: 'https://vimeo.com/241956203',
    image: '/sketch-in-the-city-thumb.jpg',
  },
  {
    id: 'west-coast-modernism',
    title: 'West Coast Modernism',
    type: 'Documentary Short',
    href: 'https://vimeo.com/287190902',
    image: '/grosvenor-thumb.jpg',
  },
]
