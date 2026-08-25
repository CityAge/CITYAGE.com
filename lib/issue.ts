export type IssueStory = {
  slug: string
  href: string
  kicker?: string
  title: string
  dek: string
  byline?: string
  partner?: boolean
  image?: string
  imageAlt?: string
  body: string[]
}

export type FrontHeadline = {
  title: string
  href?: string
  byline?: string
  partner?: boolean
}

export const northernCentury: IssueStory = {
  slug: 'the-northern-century',
  href: '/story/the-northern-century',
  title: 'The Northern Century',
  dek: 'The Arctic is not the edge of the map.',
  image: '/ottawa-feature.jpg',
  imageAlt: 'Ice on the Ottawa River below Parliament Hill',
  body: [
    'From Vancouver the north is not a metaphor. It is a coastline, a route, a question of steel and patience. Capital already knows this. Governments are learning it.',
    'The people who will decide the northern century will do it with maps on the table, then go home, and the ice will still be there in the morning.',
    'The Arctic is not the edge of the map. It is the next file — harbours, grids, rooms where a city decides what it will be.',
  ],
}

export const nextVancouver: IssueStory = {
  slug: 'the-next-metro-vancouver',
  href: '/story/the-next-metro-vancouver',
  title: 'The Next Metro Vancouver',
  dek: 'Where this region can actually win.',
  body: [
    'Vancouver looks west at the Pacific and north at a geography most of the world still treats as empty. That is not a brand. It is a fact.',
    'The question is not whether the region is beautiful. It is whether it will decide what it is for before someone else decides for it.',
    'The win is not everywhere. It is in the rooms that already know the file: the port, the grid, the builders who can still pour before the weather turns.',
  ],
}

export const lauraStory: IssueStory = {
  slug: 'what-the-block-keeps',
  href: '/story/what-the-block-keeps',
  title: 'What the Block Keeps',
  dek: 'A city is the two percent you can walk.',
  byline: 'Laura Mitham',
  image: '/block-street.jpg',
  imageAlt: 'A wet street and an empty chair',
  body: [
    'The lights come on in a line, not all at once. A bakery. A chemist. The window of a room where someone is still deciding a permit. This is the two percent: not the map, the block.',
    'I walked it after the offices emptied. The street did not become empty. It changed jobs. Buses, a kitchen, a man locking a gate he will open at five. A city is what stays open when the speeches are over.',
    'Nobody put a name on that. It does not need one. It needs the people who keep the grid, the keys, the water. The rest is scenery.',
  ],
}

export const partnerStory: IssueStory = {
  slug: 'the-rooms',
  href: '/partner/the-rooms',
  title: 'The Rooms After the Meeting',
  dek: 'Where a city decides what it will build.',
  partner: true,
  body: [
    'There is a table that is not on a stage. After the larger conversation, eight people stay. They have a map and a date and a thing that must be built before the weather turns.',
    'A page about that table — the quiet work that follows a city around. Power and money become a street only if someone remains in the room.',
    'The name on the door is not the point. The room is.',
  ],
}

export const publisherLetter = {
  href: '/letter',
  kicker: 'From the publisher',
  sentences: [
    'We live on the urban planet. Two percent of Earth. Everything happens here.',
    'I have spent my working life in rooms that do not look like much.',
    'A table, a few people who can still move a harbour or a northern road, then the work.',
    'CityAge is those rooms, drawn from twenty thousand leaders who already carry the file.',
    'Halls are easy. Rooms are hard.',
    'I write from Vancouver, looking west and north at the same time.',
  ],
  sign: 'Miro Cernetig',
}

export const roomLeaf = {
  href: '/room',
  title: 'The Next Metro Vancouver',
  place: 'A room in Vancouver',
  date: 'Tuesday, 14 October 2026',
  sentence: 'This is a room. A table, a few people, a result before anyone leaves.',
}

export const frontLead = {
  title: northernCentury.title,
  dek: northernCentury.dek,
  href: northernCentury.href,
  image: northernCentury.image,
  imageAlt: northernCentury.imageAlt,
}

export const frontHeadlines: FrontHeadline[] = [
  { title: 'What the Block Keeps', byline: 'Laura Mitham', href: lauraStory.href },
  { title: 'The Next Metro Vancouver', href: nextVancouver.href },
  { title: 'The Rooms After the Meeting', partner: true, href: partnerStory.href },
  { title: 'Halls Are Easy. Rooms Are Hard.', href: publisherLetter.href },
  { title: 'The Port Before the Weather Turns' },
  { title: 'Who Still Builds the Grid' },
  { title: 'Capital Already Knows the North' },
  { title: 'A Room in Vancouver', href: roomLeaf.href },
  { title: 'After Five, the Street Changes Jobs' },
  { title: 'The File That Leaves the Hall' },
]

export const railHeadlines: FrontHeadline[] = [
  { title: 'Ice on the Ottawa River' },
  { title: 'A permit window still open' },
  { title: 'Steel before the weather' },
  { title: 'The Arctic file, twelve ministries' },
  { title: 'Mid-sized cities, critical minerals' },
  { title: 'Who carries the file' },
  { title: 'Defence closer to the street' },
  { title: 'Maps on the table' },
]

export const storiesBySlug: Record<string, IssueStory> = {
  [northernCentury.slug]: northernCentury,
  [nextVancouver.slug]: nextVancouver,
  [lauraStory.slug]: lauraStory,
}

export const partnersBySlug: Record<string, IssueStory> = {
  [partnerStory.slug]: partnerStory,
}
