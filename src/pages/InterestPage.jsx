import { Link, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { cmsConfigured, mediaPublicUrl, supabase } from '../lib/supabase'

function primeVideoPreview(event) {
  const video = event.currentTarget
  if (!Number.isFinite(video.duration) || video.duration <= 0.2 || video.currentTime > 0.05) return
  try {
    video.currentTime = Math.min(0.18, video.duration * 0.05)
  } catch {
    // Some browsers do not allow programmatic seeking until more data is buffered.
  }
}

function mediaLayoutClass(mediaIndex) {
  if (mediaIndex === 0) return 'is-featured'
  if (mediaIndex % 4 === 1) return 'is-standard'
  if (mediaIndex % 4 === 2) return 'is-pair-left'
  if (mediaIndex % 4 === 3) return 'is-pair-right'
  return 'is-standard'
}

function MediaCaption({ caption, mediaIndex }) {
  if (!caption) return null
  return (
    <figcaption className="interest-journal-caption">
      <span>{String(mediaIndex + 1).padStart(2, '0')}</span>
      <p>{caption}</p>
    </figcaption>
  )
}

function Block({ block, mediaIndex }) {
  if (block.type === 'text') {
    return (
      <div className="interest-text-block interest-journal-text">
        {block.content?.split('\n').map((line, i) => <p key={i}>{line || '\u00A0'}</p>)}
      </div>
    )
  }

  const src = block.media_path ? mediaPublicUrl(block.media_path) : block.media_url
  if (!src) return null

  const layout = mediaLayoutClass(mediaIndex)

  if (block.type === 'image') {
    return (
      <figure className={`interest-media-block interest-journal-media ${layout}`}>
        <div className="interest-journal-frame">
          <img src={src} alt={block.caption || ''} loading="lazy" />
        </div>
        <MediaCaption caption={block.caption} mediaIndex={mediaIndex} />
      </figure>
    )
  }

  if (block.type === 'video') {
    return (
      <figure className={`interest-media-block interest-journal-media interest-journal-video ${layout}`}>
        <div className="interest-journal-frame">
          <video
            controls
            playsInline
            preload="auto"
            src={src}
            onLoadedData={primeVideoPreview}
          />
          <span className="interest-video-tag">Short film</span>
        </div>
        <MediaCaption caption={block.caption} mediaIndex={mediaIndex} />
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

  let mediaIndex = -1

  return (
    <div className="interest-journal-page">
      <style>{`
        .interest-journal-page{overflow:hidden}
        .interest-journal-hero{max-width:1120px;padding-bottom:52px}
        .interest-journal-hero h1{max-width:820px;font-size:clamp(2.4rem,4.4vw,4.2rem);line-height:1.02;margin:16px 0 20px}
        .interest-journal-hero .hero-copy{max-width:720px;font-size:1.02rem;line-height:1.78}
        .interest-journal-rule{margin-top:36px;border-top:1px solid var(--line);padding-top:12px;display:flex;justify-content:space-between;gap:20px;color:var(--muted);font-size:.68rem;text-transform:uppercase;letter-spacing:.1em}
        .interest-journal-grid{max-width:1160px;margin:0 auto;padding-top:18px;padding-bottom:96px;display:grid;grid-template-columns:repeat(12,minmax(0,1fr));column-gap:22px;row-gap:64px}
        .interest-journal-text{grid-column:3/11;max-width:none!important;margin:0!important}
        .interest-journal-text p{font-size:1.02rem!important;line-height:1.86!important;color:#434742!important;margin:0 0 18px!important}
        .interest-journal-media{margin:0!important;min-width:0}
        .interest-journal-media.is-featured{grid-column:1/-1}
        .interest-journal-media.is-standard{grid-column:3/11}
        .interest-journal-media.is-pair-left{grid-column:1/7}
        .interest-journal-media.is-pair-right{grid-column:7/13}
        .interest-journal-frame{position:relative;background:#e8ebe6;border-radius:18px;overflow:hidden;border:1px solid #dde0da}
        .interest-journal-media img,.interest-journal-media video{display:block;width:100%!important;height:auto!important;max-height:720px!important;object-fit:contain!important;border-radius:0!important;background:#e8ebe6!important}
        .interest-journal-video.is-standard video,.interest-journal-video.is-pair-left video,.interest-journal-video.is-pair-right video{aspect-ratio:16/9;object-fit:cover!important}
        .interest-video-tag{position:absolute;top:14px;left:14px;padding:7px 9px;border-radius:999px;background:rgba(248,248,244,.88);backdrop-filter:blur(8px);font-size:.62rem;text-transform:uppercase;letter-spacing:.09em;color:#3f4541;pointer-events:none}
        .interest-journal-caption{display:grid;grid-template-columns:42px 1fr;gap:12px;margin-top:12px!important;padding-top:10px;border-top:1px solid var(--line);color:var(--muted)!important}
        .interest-journal-caption span{font-family:'Playfair Display',serif;font-size:1rem;color:var(--accent)}
        .interest-journal-caption p{margin:0;font-size:.78rem;line-height:1.55;color:var(--muted)}
        @media(max-width:860px){
          .interest-journal-grid{column-gap:16px;row-gap:44px}
          .interest-journal-text,.interest-journal-media.is-standard{grid-column:2/12}
          .interest-journal-media.is-pair-left,.interest-journal-media.is-pair-right{grid-column:1/-1}
        }
        @media(max-width:640px){
          .interest-journal-hero{padding-top:58px;padding-left:18px;padding-right:18px}
          .interest-journal-hero h1{font-size:clamp(2.2rem,10vw,3.15rem)}
          .interest-journal-rule{flex-direction:column;gap:5px}
          .interest-journal-grid{display:block;padding:8px 18px 72px}
          .interest-journal-text,.interest-journal-media{margin-bottom:38px!important}
          .interest-journal-frame{border-radius:14px}
          .interest-journal-media img,.interest-journal-media video{max-height:560px!important}
          .interest-journal-video video{aspect-ratio:16/10;object-fit:cover!important}
        }
      `}</style>

      <section className="page-hero interest-detail-hero interest-journal-hero">
        <Link className="back-link" to="/interests">← Interests</Link>
        <p className="kicker">Field notes</p>
        <h1>{page.title}</h1>
        {page.description && <p className="hero-copy">{page.description}</p>}
        <div className="interest-journal-rule"><span>Images · short films · notes</span><span>Personal archive</span></div>
      </section>

      <section className="section interest-blocks interest-journal-grid">
        {blocks.length ? blocks.map((block) => {
          const index = block.type === 'image' || block.type === 'video' ? ++mediaIndex : -1
          return <Block key={block.id} block={block} mediaIndex={index} />
        }) : <p className="cms-status">No published blocks yet.</p>}
      </section>
    </div>
  )
}
