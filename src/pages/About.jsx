import { useEffect, useState } from 'react'
import { cmsConfigured, mediaPublicUrl, supabase } from '../lib/supabase'

const fallback = {
  heading: 'Quantitative modelling meets decisions that have to be made anyway.',
  body: 'I came to analytics through finance and capital markets. Recent work has taken me into production scheduling, hospital staffing, logistics, responsible AI, language models, and software. Across those domains, I am most interested in finding the real decision behind the initial problem and carrying the analysis through to something a person can actually use.',
  image_path: '',
  image_caption: '',
}

export default function About() {
  const [profile, setProfile] = useState(fallback)

  useEffect(() => {
    if (!supabase) return
    let active = true
    supabase
      .from('about_profile')
      .select('heading,body,image_path,image_caption')
      .eq('id', 1)
      .eq('published', true)
      .maybeSingle()
      .then(({ data }) => {
        if (active && data) setProfile(data)
      })
    return () => { active = false }
  }, [])

  const paragraphs = (profile.body || '').split(/\n\s*\n/).filter(Boolean)

  return (
    <section className="about-editorial-page">
      <div className="about-editorial-copy">
        <p className="kicker">About</p>
        <h1>{profile.heading}</h1>
        <div className="about-prose">
          {paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
        </div>
        <div className="about-mini-meta">
          <span>Finance × Analytics × Decision Systems</span>
          <span>University of Alberta · Master of Management Analytics</span>
        </div>
      </div>

      <figure className="about-editorial-image">
        {profile.image_path ? (
          <img src={mediaPublicUrl(profile.image_path)} alt={profile.image_caption || 'Wenchuan Kevin Zhu'} />
        ) : (
          <div className="about-photo-placeholder">
            <span>Photo</span>
            <small>Upload from /admin</small>
          </div>
        )}
        {profile.image_caption && <figcaption>{profile.image_caption}</figcaption>}
      </figure>
    </section>
  )
}
