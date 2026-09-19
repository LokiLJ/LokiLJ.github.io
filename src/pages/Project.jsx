import { Link, useParams } from 'react-router-dom'
import { coreProjects } from '../data/projects'

export default function Project() {
  const { projectId } = useParams()
  const project = coreProjects.find((item) => item.id === projectId)

  if (!project) {
    return (
      <section className="page-hero">
        <p className="kicker">Project not found</p>
        <h1>This case study does not exist.</h1>
        <Link className="button secondary" to="/work">Back to work</Link>
      </section>
    )
  }

  return (
    <>
      <section className="project-hero">
        <Link className="back-link" to="/work">← Selected work</Link>
        <p className="kicker">{project.area} · {project.year}</p>
        <h1>{project.title}</h1>
        <p className="hero-copy">{project.context}</p>
        <div className="tags project-tags">
          {project.tags.map((tag) => <span key={tag}>{tag}</span>)}
        </div>
      </section>

      <section className="section case-detail">
        <div className="case-detail-grid">
          <article>
            <span className="case-label">01 / Original question</span>
            <h2>{project.originalQuestion}</h2>
          </article>
          <article className="emphasis-panel">
            <span className="case-label">02 / Assumption that failed</span>
            <h2>{project.wrongAssumption}</h2>
          </article>
          <article>
            <span className="case-label">03 / Reframing</span>
            <p>{project.reframing}</p>
          </article>
          <article>
            <span className="case-label">04 / Approach</span>
            <p>{project.approach}</p>
          </article>
          <article>
            <span className="case-label">05 / Result</span>
            <p>{project.result}</p>
          </article>
          <article>
            <span className="case-label">06 / What it showed</span>
            <p className="project-takeaway">{project.takeaway}</p>
          </article>
        </div>

        <div className="visual-placeholder" role="img" aria-label="Visualization placeholder">
          <span>Project visualization / figure</span>
          <p>V2.1 will replace this with a project-specific chart, screenshot, or interactive result.</p>
        </div>

        {project.note && <p className="publication-note">{project.note}</p>}

        <div className="project-actions">
          {project.githubUrl && (
            <a className="button secondary" href={project.githubUrl} target="_blank" rel="noreferrer">
              View GitHub
            </a>
          )}
          <Link className="button secondary" to="/work">Back to all work</Link>
        </div>
      </section>
    </>
  )
}
