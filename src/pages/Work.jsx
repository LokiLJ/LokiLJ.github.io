import { Link } from 'react-router-dom'
import { compactProjects, deepProjects, workAreas } from '../data/projects'

function DeepCard({ project }) {
  return (
    <article className="work-card-v3">
      <div className="work-card-meta"><span>{project.year}</span><span>Case study</span></div>
      <p className="eyebrow">{project.eyebrow}</p>
      <h3>{project.title}</h3>
      <p className="work-card-hook">{project.wrongAssumption}</p>
      <p>{project.takeaway}</p>
      {project.metric && <div className="mini-metric"><strong>{project.metric}</strong><span>{project.metricLabel}</span></div>}
      <div className="tags compact-tags">{project.tags.slice(0, 5).map((tag) => <span key={tag}>{tag}</span>)}</div>
      <Link className="arrow-link" to={'/work/' + project.id}>Open case study ↗</Link>
    </article>
  )
}

function CompactCard({ project }) {
  return (
    <article className="archive-card">
      <div className="archive-topline"><span>{project.year}</span><span>{project.area}</span></div>
      <p className="eyebrow">{project.eyebrow}</p>
      <h3>{project.title}</h3>
      <p>{project.summary}</p>
      <div className="tags compact-tags">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
    </article>
  )
}

export default function Work() {
  return (
    <>
      <section className="page-hero work-hero-v3">
        <p className="kicker">Selected work</p>
        <h1>Projects grouped by the decisions they support.</h1>
        <p className="hero-copy">The deeper case studies show the reasoning path, not only the final model: what the first question was, which assumption failed, how the problem was reframed, and what the evidence changed.</p>
      </section>

      <section className="section taxonomy-section">
        <div className="area-grid area-grid-v3">
          {workAreas.map((area, index) => <article key={area.title}><span>{String(index + 1).padStart(2, '0')}</span><h3>{area.title}</h3><p>{area.description}</p></article>)}
        </div>
      </section>

      {workAreas.map((area, areaIndex) => {
        const projects = deepProjects.filter((project) => project.area === area.title)
        if (!projects.length) return null
        return (
          <section className="section area-project-section" key={area.title}>
            <div className="area-section-head"><span>{String(areaIndex + 1).padStart(2, '0')}</span><div><p className="section-number">Deep case studies</p><h2>{area.title}</h2></div></div>
            <div className="work-card-grid">{projects.map((project) => <DeepCard key={project.id} project={project} />)}</div>
          </section>
        )
      })}

      <section className="section archive-section">
        <div className="section-heading wide-heading">
          <div><p className="section-number">Additional work</p><h2>Smaller projects and earlier work.</h2></div>
          <p>These fill out the toolkit—API engineering, reinforcement learning, relational data systems, macroeconometrics, and earlier corporate-finance work—without competing with the flagship case studies for attention.</p>
        </div>
        <div className="archive-grid">{compactProjects.map((project) => <CompactCard key={project.id} project={project} />)}</div>
      </section>
    </>
  )
}
