import { Link } from 'react-router-dom'
import { featuredProjects, workAreas } from '../data/projects'

function FeaturedCard({ project }) {
  const id = project.id
  return (
    <article className="project-card">
      <div className="project-meta">
        <span>{project.category}</span>
        <span>{project.eyebrow}</span>
      </div>
      <div className="metric">
        <strong>{project.metric}</strong>
        <span>{project.metricLabel}</span>
      </div>
      <h3>{project.title}</h3>
      <p className="reframing">{project.reframing}</p>
      <p>{project.summary}</p>
      <div className="tags">
        {project.tags.map((tag) => <span key={tag}>{tag}</span>)}
      </div>
      <Link className="text-link" to={"/work/" + id}>Read case study →</Link>
    </article>
  )
}

export default function Home() {
  return (
    <>
      <section className="hero">
        <p className="kicker">Analytics · Finance · Healthcare · AI</p>
        <h1>Quantitative decision systems, built for real decisions.</h1>
        <p className="hero-copy">
          I’m Wenchuan (Kevin) Zhu, a Master of Management Analytics student with a finance
          background. I work across forecasting, optimization and machine learning — often
          starting by questioning whether we are solving the right problem.
        </p>
        <div className="hero-actions">
          <Link className="button primary" to="/work">Explore my work</Link>
          <a className="button secondary" href="/resume.pdf">View CV</a>
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <p className="section-number">01 / Featured work</p>
          <h2>Three pieces of evidence</h2>
          <p>
            The thread is not a specific algorithm. It is the habit of finding the decision
            underneath the original question, then carrying the analysis through to action.
          </p>
        </div>
        <div className="projects-grid">
          {featuredProjects.map((project) => <FeaturedCard key={project.id} project={project} />)}
        </div>
        <div className="section-cta">
          <Link className="button secondary" to="/work">View all selected work</Link>
        </div>
      </section>

      <section className="section">
        <div className="section-heading compact">
          <p className="section-number">Focus areas</p>
          <h2>One toolkit, several domains</h2>
        </div>
        <div className="area-grid">
          {workAreas.map((area) => (
            <article key={area.title}>
              <h3>{area.title}</h3>
              <p>{area.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section split-section">
        <div>
          <p className="section-number">02 / How I work</p>
          <h2>Reframe. Build. Finish the last mile.</h2>
        </div>
        <div>
          <p>
            Across operations, healthcare, finance, and AI, the most useful result often came
            after challenging the original framing: a visible bottleneck was not the real one,
            forecast accuracy was not the main source of value, or a suspicious pattern was
            actually a data-system artifact.
          </p>
          <Link className="text-link" to="/about">More about my background →</Link>
        </div>
      </section>
    </>
  )
}
