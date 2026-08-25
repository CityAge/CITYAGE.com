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

export type IssueLeaf = {
  key: 'cover' | 'story' | 'partner' | 'letter' | 'room'
  href: string
}

export const coverPlate = {
  image: '/table-room.jpg',
  imageAlt: 'Empty chairs around a wooden table',
}

export const lauraStory: IssueStory = {
  slug: 'what-the-block-keeps',
  href: '/story/what-the-block-keeps',
  kicker: 'Cities',
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

export const leaves: IssueLeaf[] = [
  { key: 'cover', href: '/' },
  { key: 'story', href: lauraStory.href },
  { key: 'partner', href: partnerStory.href },
  { key: 'letter', href: publisherLetter.href },
  { key: 'room', href: roomLeaf.href },
]

export function adjacentLeaves(href: string) {
  const index = leaves.findIndex((leaf) => leaf.href === href)
  return {
    prev: index > 0 ? leaves[index - 1] : undefined,
    next: index >= 0 && index < leaves.length - 1 ? leaves[index + 1] : undefined,
  }
}

export const storiesBySlug: Record<string, IssueStory> = {
  [lauraStory.slug]: lauraStory,
}

export const partnersBySlug: Record<string, IssueStory> = {
  [partnerStory.slug]: partnerStory,
}
