import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { cmsConfigured, supabase, mediaPublicUrl } from '../lib/supabase'

const fallback = [
  {
    id: 'teaching',
    slug: 'teaching',
    title: 'Teaching',
    description: 'Mathematics, statistics, programming, and the craft of explaining technical ideas clearly.',
  },
]

export default function Interests() {
  const [pages, setPages] = useState(fallback)
  const [loading, setLoading] = useState(cmsConfigured)

  useEffect(() => {
    if (!supabase) return
    let active = true
    supabase
      .from('interest_pages')
      .select('id,slug,title,description,cover_path,sort_order')
      .eq('published', true)
      .order('sort_order', { ascending: true })
      .then(({ data, error }) => {
        if (!active) return
        if (!error && data?.length) setPages(data)
        setLoading(false)
      })
    return () => { active = false }
  }, [])

  return (
    <>
      <section className="page-hero interests-hero">
        <p className="kicker">Interests</p>
        <h1>The things I build, teach, and explore outside the main portfolio.</h1>
        <p className="hero-copy">A flexible collection of notes, images, and videos. Teaching lives here too—as one interest among several rather than a separate professional silo.</p>
      </section>
      <section className="section">
        {loading && <p className="cms-status">Loading published interests…</p>}
        <div className="interest-grid">
          {pages.map((page) => (
            <Link className="interest-card" to={'/interests/' + page.slug} key={page.id || page.slug}>
              {page.cover_path ? (
                <img src={mediaPublicUrl(page.cover_path)} alt="" />
              ) : (
                <div className="interest-cover-placeholder"><span>{page.title.slice(0, 1)}</span></div>
              )}
              <div>
                <p className="eyebrow">Interest</p>
                <h2>{page.title}</h2>
                <p>{page.description}</p>
                <span className="arrow-link">Open ↗</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  )
}
