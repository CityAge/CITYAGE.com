import { createClient } from '@/lib/supabase/server'

export async function InfluenceLetterBlock() {
  const supabase = await createClient()

  const { data: brief } = await supabase
    .from('briefs')
    .select('id, title, vertical, published_at, body')
    .eq('status', 'published')
    .eq('vertical', 'Canada Europe Connects')
    .order('published_at', { ascending: false })
    .limit(1)
    .single()

  if (!brief) return null

  const date = new Date(brief.published_at).toLocaleDateString('en-CA', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'America/Toronto'
  })

  // Extract the tagline (italic line after dateline)
  const tagline = brief.body
    ?.split('\n')
    .find((line: string) => line.startsWith('*') && line.endsWith('*') && !line.includes('Defence.'))
    ?.replace(/\*/g, '')
    ?.trim()

  // Extract the situation line (text after **SITUATION LINE**)
  const bodyLines = brief.body?.split('\n') || []
  const sitIdx = bodyLines.findIndex((l: string) => l.includes('SITUATION LINE'))
  let situationLine = ''
  if (sitIdx >= 0) {
    for (let i = sitIdx + 1; i < bodyLines.length; i++) {
      const line = bodyLines[i].trim()
      if (line === '---' || line === '') {
        if (situationLine) break
        continue
      }
      situationLine += (situationLine ? ' ' : '') + line
    }
  }

  // Simple markdown rendering for the body
  function renderBrief(md: string): string {
    return md
      .replace(/^### (.+)$/gm, '<h3 class="font-serif font-bold text-lg md:text-xl text-white mt-8 mb-3">$1</h3>')
      .replace(/^## (.+)$/gm, '<h2 class="font-serif font-bold text-xl md:text-2xl text-[#D4AF37] mt-4 mb-1">$1</h2>')
      .replace(/^# (.+)$/gm, '<h1 class="font-serif font-black text-2xl md:text-3xl text-white mt-2 mb-1">$1</h1>')
      .replace(/\*\*(.+?)\*\*/g, '<strong class="font-bold text-[#D4AF37]">$1</strong>')
      .replace(/\*(.+?)\*/g, '<em class="italic text-[#FDFCF8]/50">$1</em>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener" class="text-[#D4AF37]/80 hover:text-[#D4AF37] underline underline-offset-2 decoration-[#D4AF37]/30">$1</a>')
      .replace(/^---$/gm, '<hr class="border-[#D4AF37]/10 my-6" />')
      .replace(/^(?!<[h|p|s|e|a|u|hr])(.*\S.*)$/gm, '<p class="font-serif text-[#FDFCF8]/70 text-[15px] md:text-base leading-relaxed mb-3">$1</p>')
  }

  const html = renderBrief(brief.body)

  return (
    <section className="bg-[#050505] px-8 md:px-16 py-16 md:py-24">
      <div className="max-w-4xl mx-auto">

        {/* Section label */}
        <div className="flex items-center justify-between mb-10">
          <span className="font-mono text-[10px] tracking-[0.35em] text-[#D4AF37] uppercase">
            The Influence Letter
          </span>
          <span className="font-mono text-[10px] tracking-[0.2em] text-[#888888] uppercase">
            {date}
          </span>
        </div>

        {/* The brief in a gold-bordered box */}
        <div className="border border-[#D4AF37]/30 p-8 md:p-12">

          {/* Tagline */}
          {tagline && (
            <p className="font-serif italic text-[#FDFCF8]/50 text-base md:text-lg mb-6 text-pretty">
              {tagline}
            </p>
          )}

          {/* Situation line preview */}
          {situationLine && (
            <p className="font-serif text-white text-lg md:text-xl leading-relaxed mb-8 text-pretty">
              {situationLine}
            </p>
          )}

          {/* Divider */}
          <hr className="border-[#D4AF37]/15 mb-8" />

          {/* Full brief body */}
          <div
            className="brief-body"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      </div>
    </section>
  )
}
