import { Link } from 'react-router-dom'
import { featuredProjects, workAreas } from '../data/projects'

function FeaturedCard({ project, index }) {
  return (
    <article className="featured-card">
      <div className="featured-card-topline"><span>{String(index + 1).padStart(2, '0')}</span><span>{project.area}</span></div>
      <div className="featured-metric"><strong>{project.metric}</strong><span>{project.metricLabel}</span></div>
      <div className="featured-copy">
        <p className="eyebrow">{project.eyebrow}</p>
        <h3>{project.title}</h3>
        <p className="featured-reframe">{project.wrongAssumption}</p>
        <p>{project.summary}</p>
      </div>
      <div className="featured-footer">
        <div className="tags compact-tags">{project.tags.slice(0, 4).map((tag) => <span key={tag}>{tag}</span>)}</div>
        <Link className="arrow-link" to={'/work/' + project.id}>Open case study ↗</Link>
      </div>
    </article>
  )
}

export default function Home() {
  return (
    <>
      <section className="hero hero-v3">
        <div className="hero-grid">
          <div>
            <p className="kicker">Wenchuan (Kevin) Zhu · Quantitative Analytics</p>
            <h1>Find the real problem. Model the uncertainty. Finish the last mile.</h1>
          </div>
          <div className="hero-side">
            <p className="hero-copy">I build quantitative decision systems across operations, finance, healthcare, and applied AI. The recurring pattern in my work is simple: question the first framing, identify what actually drives the decision, and turn the model into something a person can use.</p>
            <div className="hero-actions"><Link className="button primary" to="/work">Explore selected work</Link><a className="button secondary" href="/resume.pdf">View CV</a></div>
          </div>
        </div>
        <div className="hero-rule" />
        <div className="hero-proof"><span>Decision systems</span><span>Machine learning</span><span>Econometrics</span><span>Software & dashboards</span></div>
      </section>

      <section className="section featured-section">
        <div className="section-heading wide-heading">
          <div><p className="section-number">01 / Featured work</p><h2>Three projects that show how I think.</h2></div>
          <p>These are not grouped by algorithm. Each starts with a misleading first impression and ends with a different decision than the original problem suggested.</p>
        </div>
        <div className="featured-stack">{featuredProjects.map((project, index) => <FeaturedCard key={project.id} project={project} index={index} />)}</div>
        <div className="section-cta"><Link className="button secondary" to="/work">See all projects</Link></div>
      </section>

      <section className="section focus-section">
        <div className="section-heading compact wide-heading">
          <div><p className="section-number">02 / Focus areas</p><h2>One toolkit, several domains.</h2></div>
          <p>Finance shaped the questions I ask. Analytics expanded the tools I can use to answer them. The same decision-oriented approach now carries across five domains.</p>
        </div>
        <div className="area-grid area-grid-v3">
          {workAreas.map((area, index) => <article key={area.title}><span>{String(index + 1).padStart(2, '0')}</span><h3>{area.title}</h3><p>{area.description}</p></article>)}
        </div>
      </section>

      <section className="section manifesto-section">
        <div className="manifesto-number">03</div>
        <div><p className="section-number">How I work</p><h2>Prediction is useful. Explanation is useful. A usable decision is better.</h2></div>
        <div className="manifesto-copy">
          <p>I tend to spend as much time diagnosing the structure of a problem as fitting the eventual model. That has meant abandoning point prediction when key information was structurally unobserved, switching from machine learning to econometric adjustment when prediction stopped answering the real question, and treating “too good” results as debugging signals rather than victories.</p>
          <Link className="arrow-link" to="/about">About my background ↗</Link>
        </div>
      </section>
    </>
  )
}
