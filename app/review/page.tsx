'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

interface MagazineArticle {
  id: string
  headline: string
  deck: string | null
  body: string
  vertical: string
  sub_vertical: string | null
  tags: string[]
  image_url: string | null
  featured: boolean
  source_urls: string[]
  read_time: number
  status: string
  created_at: string
  published_at: string | null
}

export default function ReviewPage() {
  const [articles, setArticles] = useState<MagazineArticle[]>([])
  const [filter, setFilter] = useState<'draft' | 'review' | 'published' | 'all'>('draft')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const supabase = createClient(supabaseUrl, supabaseKey)

  const fetchArticles = useCallback(async () => {
    setLoading(true)
    let query = supabase
      .from('magazine')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50)

    if (filter !== 'all') {
      query = query.eq('status', filter)
    }

    const { data } = await query
    setArticles(data || [])
    setLoading(false)
  }, [filter])

  useEffect(() => {
    fetchArticles()
  }, [fetchArticles])

  const updateStatus = async (id: string, newStatus: string) => {
    const updates: any = { status: newStatus }
    if (newStatus === 'published') {
      updates.published_at = new Date().toISOString()
    }
    await supabase.from('magazine').update(updates).eq('id', id)
    fetchArticles()
  }

  const toggleFeatured = async (id: string, current: boolean) => {
    await supabase.from('magazine').update({ featured: !current }).eq('id', id)
    fetchArticles()
  }

  const deleteArticle = async (id: string) => {
    if (!confirm('Kill this article? This cannot be undone.')) return
    await supabase.from('magazine').delete().eq('id', id)
    fetchArticles()
  }

  const verticalColor: Record<string, string> = {
    Power: 'text-red-800',
    Money: 'text-emerald-800',
    Cities: 'text-blue-800',
    Frontiers: 'text-purple-800',
    Culture: 'text-amber-800',
  }

  return (
    <div className="min-h-screen bg-[#F9F9F7]">
      {/* Dark editor header */}
      <header className="bg-black text-white px-6 md:px-12 py-5 border-b border-white/10">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="font-serif font-black text-xl uppercase tracking-tight hover:text-[#C5A059] transition-colors">
              The Urban Planet
            </Link>
            <span className="text-white/20">|</span>
            <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#C5A059]">
              Editorial Review
            </span>
          </div>
          <div className="flex items-center gap-6">
            <span className="font-mono text-[9px] tracking-[0.15em] uppercase text-white/30">
              {articles.length} articles
            </span>
            <Link href="/" className="font-mono text-[9px] tracking-[0.2em] uppercase text-white/40 hover:text-[#C5A059] transition-colors">
              ← Live Site
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-[1200px] mx-auto px-6 md:px-12 py-8">

        {/* Filter tabs */}
        <div className="flex items-center gap-1 mb-8">
          {(['draft', 'review', 'published', 'all'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`font-mono text-[10px] tracking-[0.2em] uppercase px-5 py-2.5 transition-all ${
                filter === f
                  ? 'bg-black text-white'
                  : 'bg-white text-black/50 hover:text-black border border-black/10'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Articles */}
        {loading ? (
          <p className="font-serif italic text-black/20 text-xl py-16 text-center">Loading...</p>
        ) : articles.length === 0 ? (
          <div className="py-20 text-center">
            <p className="font-serif italic text-black/20 text-2xl mb-3">No {filter} articles</p>
            <p className="font-mono text-[10px] text-black/20 tracking-widest uppercase">
              {filter === 'draft' ? 'The scraper will populate drafts here for your review' : 'Try a different filter'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {articles.map((article) => (
              <div key={article.id} className="bg-white border border-black/10">

                {/* Summary row */}
                <div
                  className="px-6 py-5 flex items-start gap-5 cursor-pointer hover:bg-black/[0.02] transition-colors"
                  onClick={() => setExpandedId(expandedId === article.id ? null : article.id)}
                >
                  {/* Thumbnail */}
                  {article.image_url ? (
                    <div className="w-20 h-14 shrink-0 overflow-hidden bg-gray-100">
                      <img src={article.image_url} alt="" className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-20 h-14 shrink-0 bg-gray-100" />
                  )}

                  {/* Info */}
                  <div className="flex-grow min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className={`font-mono text-[9px] font-bold tracking-[0.2em] uppercase ${verticalColor[article.vertical] || 'text-black/70'}`}>
                        {article.vertical}
                      </span>
                      {article.sub_vertical && (
                        <>
                          <span className="text-black/15 text-[7px]">→</span>
                          <span className="font-mono text-[9px] tracking-[0.15em] uppercase text-black/40">{article.sub_vertical}</span>
                        </>
                      )}
                      <span className={`font-mono text-[8px] tracking-[0.1em] uppercase px-2 py-0.5 ${
                        article.status === 'draft' ? 'bg-yellow-50 text-yellow-700' :
                        article.status === 'published' ? 'bg-green-50 text-green-700' :
                        article.status === 'review' ? 'bg-blue-50 text-blue-700' :
                        'bg-gray-50 text-gray-500'
                      }`}>
                        {article.status}
                      </span>
                      {article.featured && (
                        <span className="font-mono text-[8px] tracking-[0.1em] uppercase px-2 py-0.5 bg-[#C5A059]/10 text-[#C5A059]">★ Featured</span>
                      )}
                    </div>
                    <h3 className="font-serif font-bold text-base leading-snug">
                      {article.headline}
                    </h3>
                    {article.deck && (
                      <p className="font-serif text-black/40 text-sm mt-1 leading-snug">{article.deck}</p>
                    )}
                  </div>

                  {/* Expand arrow */}
                  <div className="shrink-0 pt-2">
                    <svg className={`w-4 h-4 text-black/20 transition-transform ${expandedId === article.id ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                      <path d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                {/* Expanded detail */}
                {expandedId === article.id && (
                  <div className="border-t border-black/5 px-6 py-6">
                    {/* Action buttons */}
                    <div className="flex items-center gap-3 mb-6 pb-6 border-b border-black/5">
                      {article.status !== 'published' && (
                        <button
                          onClick={() => updateStatus(article.id, 'published')}
                          className="bg-green-700 text-white px-5 py-2 font-mono text-[10px] tracking-[0.2em] uppercase hover:bg-green-800 transition-colors"
                        >
                          Publish
                        </button>
                      )}
                      {article.status === 'published' && (
                        <button
                          onClick={() => updateStatus(article.id, 'archived')}
                          className="bg-black/10 text-black/60 px-5 py-2 font-mono text-[10px] tracking-[0.2em] uppercase hover:bg-black/20 transition-colors"
                        >
                          Archive
                        </button>
                      )}
                      {article.status === 'draft' && (
                        <button
                          onClick={() => updateStatus(article.id, 'review')}
                          className="bg-blue-600 text-white px-5 py-2 font-mono text-[10px] tracking-[0.2em] uppercase hover:bg-blue-700 transition-colors"
                        >
                          Mark for Review
                        </button>
                      )}
                      <button
                        onClick={() => toggleFeatured(article.id, article.featured)}
                        className={`px-5 py-2 font-mono text-[10px] tracking-[0.2em] uppercase transition-colors ${
                          article.featured
                            ? 'bg-[#C5A059] text-black hover:bg-[#C5A059]/80'
                            : 'bg-black/5 text-black/40 hover:bg-black/10'
                        }`}
                      >
                        {article.featured ? '★ Featured' : '☆ Feature'}
                      </button>
                      {article.status === 'published' && (
                        <Link
                          href={`/magazine/${article.id}`}
                          className="bg-black/5 text-black/60 px-5 py-2 font-mono text-[10px] tracking-[0.2em] uppercase hover:bg-black/10 transition-colors"
                          target="_blank"
                        >
                          View Live →
                        </Link>
                      )}
                      <div className="flex-grow" />
                      <button
                        onClick={() => deleteArticle(article.id)}
                        className="text-red-400 hover:text-red-600 font-mono text-[9px] tracking-[0.2em] uppercase transition-colors"
                      >
                        Kill
                      </button>
                    </div>

                    {/* Article preview */}
                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
                      <div>
                        {/* Image */}
                        {article.image_url && (
                          <div className="mb-6">
                            <img src={article.image_url} alt={article.headline} className="w-full max-h-[400px] object-cover" />
                          </div>
                        )}

                        {/* Body preview */}
                        <div className="font-serif text-black/70 text-[15px] leading-[1.7] max-h-[500px] overflow-y-auto pr-4">
                          {article.body.split('\n').filter(l => l.trim()).slice(0, 20).map((line, i) => {
                            if (line.startsWith('## ')) return <h2 key={i} className="font-bold text-xl text-black mt-6 mb-3">{line.replace('## ', '')}</h2>
                            if (line.startsWith('**') && line.endsWith('**')) return <p key={i} className="font-mono font-bold text-black/60 text-xs tracking-wide uppercase mt-5 mb-2">{line.replace(/\*\*/g, '')}</p>
                            return <p key={i} className="mb-3">{line}</p>
                          })}
                          {article.body.split('\n').filter(l => l.trim()).length > 20 && (
                            <p className="font-mono text-[9px] text-black/30 uppercase tracking-widest mt-4">... article continues</p>
                          )}
                        </div>
                      </div>

                      {/* Metadata sidebar */}
                      <div className="space-y-6 text-[11px]">
                        <div>
                          <span className="font-mono text-[8px] tracking-[0.3em] uppercase text-black/30 block mb-2">Tags</span>
                          <div className="flex flex-wrap gap-1.5">
                            {(article.tags || []).map((tag) => (
                              <span key={tag} className="font-mono text-[9px] tracking-[0.1em] bg-black/5 text-black/50 px-2 py-1">{tag}</span>
                            ))}
                          </div>
                        </div>

                        <div>
                          <span className="font-mono text-[8px] tracking-[0.3em] uppercase text-black/30 block mb-2">Sources</span>
                          {(article.source_urls || []).length > 0 ? (
                            <div className="space-y-1.5">
                              {article.source_urls.map((url, i) => (
                                <a key={i} href={url} target="_blank" rel="noopener" className="font-mono text-[9px] text-[#1A365D] hover:text-[#C5A059] block truncate transition-colors">
                                  {url.replace(/https?:\/\/(www\.)?/, '').slice(0, 60)}
                                </a>
                              ))}
                            </div>
                          ) : (
                            <span className="font-mono text-[9px] text-black/20">No sources linked</span>
                          )}
                        </div>

                        <div>
                          <span className="font-mono text-[8px] tracking-[0.3em] uppercase text-black/30 block mb-2">Details</span>
                          <div className="space-y-1.5 font-mono text-[9px] text-black/40">
                            <p>Read time: {article.read_time} min</p>
                            <p>Created: {new Date(article.created_at).toLocaleDateString()}</p>
                            {article.published_at && <p>Published: {new Date(article.published_at).toLocaleDateString()}</p>}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
