import { Link } from 'react-router-dom'
import { coreProjects, workAreas } from '../data/projects'

export default function Work() {
  return (
    <>
      <section className="page-hero">
        <p className="kicker">Selected work</p>
        <h1>Projects grouped by what they demonstrate.</h1>
        <p className="hero-copy">
          Six projects are shown in depth. Each case study names the original question,
          the assumption that failed, the reframing, the method, and what the result changed.
        </p>
      </section>

      <section className="section">
        <div className="area-grid work-area-grid">
          {workAreas.map((area) => (
            <article key={area.title}>
              <h3>{area.title}</h3>
              <p>{area.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="work-list">
          {coreProjects.map((project, index) => (
            <article className="work-row" key={project.id}>
              <div className="work-index">{String(index + 1).padStart(2, '0')}</div>
              <div className="work-copy">
                <span className="case-area">{project.area} · {project.year}</span>
                <h2>{project.title}</h2>
                <p className="reframing">{project.wrongAssumption}</p>
                <p>{project.takeaway}</p>
                <div className="tags">
                  {project.tags.map((tag) => <span key={tag}>{tag}</span>)}
                </div>
              </div>
              <Link className="work-open" to={"/work/" + project.id} aria-label={"Open " + project.title}>
                ↗
              </Link>
            </article>
          ))}
        </div>
      </section>
    </>
  )
}
