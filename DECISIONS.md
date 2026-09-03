# Locked decisions (do not change)

- The magazine is the front door of cityage.com. Monocle-style: masthead, section rail, story well.
- The drawn CityAge wordmark (/logo-ca-black.png, /logo-ca-white.png) is the masthead. Never replace with typeset text.
- Homepage order: Next West plate → house nav (Purpose / Partners / Studio / Subscribe) → drawn masthead → section rail POWER | MONEY | CITIES | FRONTIERS | CULTURE → story well (Miller as FRONTIERS lead) → speaker-faces strip → footer.
- Section names and order: Power, Money, Cities, Frontiers, Culture.
- Speaker faces load server-side from Supabase and sit in a strip directly above the footer, linking to /people.
- Studio page stays exactly as it is (dark page, Plato line, logo wall, film grid).
- Purpose page copy stays as it is.
- Design tokens: Newsreader (variable, optical sizing) for all text; drawn wordmark for the masthead; cream #F9F9F7, gold #C5A059; type scale lead 40 / rail 24 / deck 18 / body 17 / kicker+meta 12 caps.
- Stories come from the Supabase `magazine` table. Do not hardcode stories.
- Subscribe goes to Beehiiv.
- Interviews are Two Per Cent, in the house Q&A format: kicker line SECTION | TWO PER CENT | date | read time; headline; the interview intro as the deck; the dateline line "City, date. As spoken." in italic at the top of the body; one pull quote (a `> ` line) as the single bold move; bold-only lines are the questions, roman paragraphs the answers; no name labels. The subject's words are never changed.

# Northern Pulse

The product is one motion: a slowly rotating globe opening on Canada and Europe; click a dot, fly down to the real place with satellite imagery, read the card, come back up. Everything else on /pulse is furniture and must never get in the way of that motion.
