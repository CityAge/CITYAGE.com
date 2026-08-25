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
