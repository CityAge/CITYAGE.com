# Locked decisions (do not change)

- The magazine is the front door of cityage.com. Monocle-style: masthead, section rail, story well.
- The drawn CityAge wordmark (/logo-ca-black.png, /logo-ca-white.png) is the masthead. Never replace with typeset text.
- Homepage order: Next West plate → house nav (Purpose / Partners / Studio / Subscribe) → drawn masthead → section rail POWER | MONEY | CITIES | FRONTIERS | CULTURE → story well (Miller as FRONTIERS lead) → speaker-faces strip → footer.
- Section names and order: Power, Money, Cities, Frontiers, Culture.
- Speaker faces load server-side from Supabase and sit in a strip directly above the footer, linking to /people.
- Studio page stays exactly as it is (dark page, Plato line, logo wall, film grid).
- Purpose page copy stays as it is.
- Design tokens: cream #F9F9F7 background, gold #C5A059 accents, drawn wordmark, Playfair Display headlines, Libre Baskerville body.
- Stories come from the Supabase `magazine` table. Do not hardcode stories.
- Subscribe goes to Beehiiv.
