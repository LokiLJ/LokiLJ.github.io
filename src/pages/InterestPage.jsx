import { Link, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { cmsConfigured, mediaPublicUrl, supabase } from '../lib/supabase'

function Block({ block }) {
  if (block.type === 'text') {
    return <div className="interest-text-block">{block.content?.split('\n').map((line, i) => <p key={i}>{line || '\u00A0'}</p>)}</div>
  }

  const src = block.media_path ? mediaPublicUrl(block.media_path) : block.media_url
  if (!src) return null

  if (block.type === 'image') {
    return <figure className="interest-media-block"><img src={src} alt={block.caption || ''} />{block.caption && <figcaption>{block.caption}</figcaption>}</figure>
  }

  if (block.type === 'video') {
    return (
      <figure className="interest-media-block">
        <video controls playsInline preload="metadata" src={src} />
        {block.caption && <figcaption>{block.caption}</figcaption>}
      </figure>
    )
  }

  return null
}

export default function InterestPage() {
  const { slug } = useParams()
  const [page, setPage] = useState(null)
  const [blocks, setBlocks] = useState([])
  const [loading, setLoading] = useState(cmsConfigured)

  useEffect(() => {
    if (!supabase) {
      if (slug === 'teaching') {
        setPage({ title: 'Teaching', description: 'Mathematics, statistics, programming, and the craft of explaining technical ideas clearly.' })
        setBlocks([{ id: 'fallback', type: 'text', content: 'Teaching content can be added from the administrator dashboard once the CMS is connected.' }])
      }
      setLoading(false)
      return
    }

    let active = true
    ;(async () => {
      const { data: pageData, error } = await supabase
        .from('interest_pages')
        .select('*')
        .eq('slug', slug)
        .eq('published', true)
        .maybeSingle()

      if (!active) return
      if (error || !pageData) {
        setLoading(false)
        return
      }

      setPage(pageData)
      const { data: blockData } = await supabase
        .from('content_blocks')
        .select('*')
        .eq('page_id', pageData.id)
        .eq('published', true)
        .order('sort_order', { ascending: true })

      if (active) {
        setBlocks(blockData || [])
        setLoading(false)
      }
    })()

    return () => { active = false }
  }, [slug])

  if (loading) return <section className="page-hero"><p className="cms-status">Loading…</p></section>

  if (!page) {
    return <section className="page-hero"><p className="kicker">Interest not found</p><h1>This page is not published.</h1><Link className="button secondary" to="/interests">Back to interests</Link></section>
  }

  return (
    <>
      <section className="page-hero interest-detail-hero">
        <Link className="back-link" to="/interests">← Interests</Link>
        <p className="kicker">Interest</p>
        <h1>{page.title}</h1>
        {page.description && <p className="hero-copy">{page.description}</p>}
      </section>
      <section className="section interest-blocks">
        {blocks.length ? blocks.map((block) => <Block key={block.id} block={block} />) : <p className="cms-status">No published blocks yet.</p>}
      </section>
    </>
  )
}
