export type IssueStory = {
  slug: string
  href: string
  kicker: string
  title: string
  dek: string
  byline?: string
  partner?: boolean
  image: string
  imageAlt: string
  body: string[]
}

export const northernCentury: IssueStory = {
  slug: 'the-northern-century',
  href: '/story/the-northern-century',
  kicker: 'Frontiers',
  title: 'The Northern Century',
  dek: 'The Arctic is not the edge of the map.',
  image: '/northern-century-earth.jpg',
  imageAlt: 'The Arctic from orbit — Greenland and the Circle',
  body: [
    'Most of the planet is empty of us. Ice. Forest. Ocean. The work of the next hundred years will not be done on that emptiness. It will be done on the two percent — the harbours, the grids, the rooms where a city decides what it will be.',
    'From Vancouver the north is not a metaphor. It is a coastline, a route, a question of steel and patience. Capital already knows this. Governments are learning it.',
    'The people who will decide the northern century will do it with maps on the table, then go home, and the ice will still be there in the morning. So will the two percent.',
  ],
}

export const nextVancouver: IssueStory = {
  slug: 'the-next-metro-vancouver',
  href: '/story/the-next-metro-vancouver',
  kicker: 'Cities',
  title: 'The Next Metro Vancouver',
  dek: 'Where this region can actually win.',
  image: '/vancouver-banner.jpg',
  imageAlt: 'Lions Gate and the harbour',
  body: [
    'Vancouver looks west at the Pacific and north at a geography most of the world still treats as empty. That is not a brand. It is a fact of the harbour.',
    'The question is not whether the region is beautiful. It is whether it will decide what it is for — power, money, cities — before someone else decides for it.',
    'The win is not everywhere. It is in the rooms that already know the file: the port, the grid, the builders who can still pour before the weather turns. A metro that cannot say that out loud will spend the decade decorating the view.',
  ],
}

export const lauraStory: IssueStory = {
  slug: 'what-the-block-keeps',
  href: '/story/what-the-block-keeps',
  kicker: 'Cities',
  title: 'What the Block Keeps',
  dek: 'A city is the two percent you can walk.',
  byline: 'Laura Mitham',
  image: '/earth-lights.jpg',
  imageAlt: 'The urban planet at night',
  body: [
    'The lights come on in a line, not all at once. A bakery. A chemist. The window of a room where someone is still deciding a permit. This is the two percent: not the map, the block.',
    'I walked it after the offices emptied. The street did not become empty. It changed jobs. Buses, a kitchen, a man locking a gate he will open at five. A city is what stays open when the speeches are over.',
    'Nobody put a name on that. It does not need one. It needs the people who keep the grid, the keys, the water. The rest is scenery.',
  ],
}

export const partnerStory: IssueStory = {
  slug: 'the-rooms',
  href: '/partner/the-rooms',
  kicker: 'Money',
  title: 'The Rooms After the Meeting',
  dek: 'Where a city decides what it will build.',
  partner: true,
  image: '/parliament-sunset.jpg',
  imageAlt: 'A city at sundown',
  body: [
    'There is a table that is not on a stage. After the larger conversation, eight people stay. They have a map and a date and a thing that must be built before the weather turns.',
    'This is not an advertisement. It is a page about that table — the quiet work that follows a city around. Power and money become a street only if someone remains in the room.',
    'The name on the door is not the point. The room is.',
  ],
}

export const storiesBySlug: Record<string, IssueStory> = {
  [northernCentury.slug]: northernCentury,
  [nextVancouver.slug]: nextVancouver,
  [lauraStory.slug]: lauraStory,
}

export const partnersBySlug: Record<string, IssueStory> = {
  [partnerStory.slug]: partnerStory,
}
