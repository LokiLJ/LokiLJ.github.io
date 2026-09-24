import { useEffect, useState } from 'react'
import { mediaPublicUrl, supabase } from '../lib/supabase'

const legacyHeading = 'Quantitative modelling meets decisions that have to be made anyway.'
const legacyBody = 'I came to analytics through finance and capital markets. Recent work has taken me into production scheduling, hospital staffing, logistics, responsible AI, language models, and software. Across those domains, I am most interested in finding the real decision behind the initial problem and carrying the analysis through to something a person can actually use.'

const fallback = {
  heading: 'I came to analytics through finance. I stayed for the decisions.',
  body: `My training started in finance and capital markets: two undergraduate finance degrees, then work across investment banking, securities, and commercial credit. I learned to read a business through cash flows, incentives, risk, and the decisions hidden behind reported numbers.

The Master of Management Analytics at the University of Alberta expanded the toolkit. Since then, my work has moved across production scheduling, hospital staffing, logistics, credit strategy, responsible AI, and language models. The domains change, but the pattern is usually the same: the first framing is rarely the real problem.

What I enjoy most is the part between analysis and action—questioning the initial assumption, choosing a model that matches the decision, and carrying the result through to a tool, policy, or workflow someone can actually use. I also teach mathematics and programming independently, which has made clear explanation part of how I work, not an afterthought.`,
  image_path: '',
  image_caption: '',
}

function normalizeProfile(profile) {
  if (!profile) return fallback
  return {
    ...profile,
    heading: profile.heading === legacyHeading ? fallback.heading : profile.heading,
    body: profile.body === legacyBody ? fallback.body : profile.body,
  }
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
        if (active && data) setProfile(normalizeProfile(data))
      })
    return () => { active = false }
  }, [])

  const paragraphs = (profile.body || '').split(/\n\s*\n/).filter(Boolean)

  return (
    <>
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

      <section className="about-career-section">
        <div className="about-career-label">
          <p className="section-number">Career direction</p>
          <span>Where I want to go next</span>
        </div>
        <div className="about-career-copy">
          <h2>Closer to the decision about what gets built.</h2>
          <p>My recent projects have made me less interested in modelling as an isolated technical exercise and more interested in the decisions around it: Which problem is worth solving? What evidence should change the plan? What should be automated, and what still needs human judgement?</p>
          <p>I am looking for work at the intersection of <strong>applied analytics, decision science, and product or strategy</strong>—roles where quantitative modelling is paired with business context and implementation rather than handed off as a final notebook.</p>
          <p>Longer term, I am especially interested in <strong>AI agents and enterprise process automation</strong>: using models not only to generate predictions, but to coordinate information, decisions, and repeatable workflows inside real organizations.</p>
          <div className="career-path">
            <span>Finance & capital markets</span><i>→</i><span>Decision systems</span><i>→</i><span>AI-enabled product & process design</span>
          </div>
          <div className="career-actions">
            <a className="button primary" href="/resume.pdf">View CV</a>
            <a className="button secondary" href="mailto:qmcztop@outlook.com">Get in touch</a>
          </div>
        </div>
      </section>
    </>
  )
}
