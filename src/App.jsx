import { featuredProjects, workAreas } from './data/projects'

function Navbar() {
  return (
    <header className="site-header">
      <a className="brand" href="#top" aria-label="Kevin Zhu home">W.K.Z.</a>
      <nav aria-label="Primary navigation">
        <a href="#work">Work</a>
        <a href="#teaching">Teaching</a>
        <a href="#about">About</a>
        <a href="#contact">Contact</a>
      </nav>
    </header>
  )
}

function ProjectCard({ project }) {
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
      <div className="tags" aria-label="Project technologies">
        {project.tags.map((tag) => <span key={tag}>{tag}</span>)}
      </div>
      {project.confidentiality && (
        <p className="confidentiality">{project.confidentiality}</p>
      )}
      <button className="text-link" type="button" disabled>
        Case study coming in V2.1 →
      </button>
    </article>
  )
}

function App() {
  return (
    <>
      <Navbar />
      <main id="top">
        <section className="hero">
          <p className="kicker">Analytics · Finance · Healthcare · AI</p>
          <h1>Quantitative decision systems, built for real decisions.</h1>
          <p className="hero-copy">
            I’m Wenchuan (Kevin) Zhu, a Master of Management Analytics student with a
            finance background. I work across forecasting, optimization and machine
            learning — often starting by questioning whether we are solving the right problem.
          </p>
          <div className="hero-actions">
            <a className="button primary" href="#work">Explore my work</a>
            <a className="button secondary" href="/resume.pdf">View CV</a>
          </div>
        </section>

        <section id="work" className="section">
          <div className="section-heading">
            <p className="section-number">01 / Work</p>
            <h2>Featured case studies</h2>
            <p>
              The thread across these projects is not a specific algorithm. It is the
              habit of finding the decision underneath the original question.
            </p>
          </div>
          <div className="projects-grid">
            {featuredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </section>

        <section className="section work-map" aria-labelledby="work-map-heading">
          <div className="section-heading compact">
            <p className="section-number">Focus areas</p>
            <h2 id="work-map-heading">One toolkit, several domains</h2>
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

        <section id="teaching" className="section split-section">
          <div>
            <p className="section-number">02 / Teaching</p>
            <h2>I can teach the reasoning, not just show the result.</h2>
          </div>
          <div>
            <p>
              I have run an independent teaching practice since 2021, covering secondary
              mathematics, introductory programming, and quantitative reasoning.
            </p>
            <p className="muted">
              V2.1 will turn this into a small learning library for statistics,
              econometrics, SQL, machine learning, and quantitative reasoning.
            </p>
          </div>
        </section>

        <section id="about" className="section split-section">
          <div>
            <p className="section-number">03 / About</p>
            <h2>Finance taught me what questions to ask. Analytics expanded how I can answer them.</h2>
          </div>
          <div>
            <p>
              My recent work spans production scheduling, hospital staffing, logistics,
              responsible AI, language models, and financial analysis. The domains change;
              the operating pattern is consistent: reframe the problem, build the model,
              and finish the last mile to a decision someone can use.
            </p>
            <p className="muted">
              Education, experience, skills, awards, and personal interests will live here
              without competing with the project evidence on the homepage.
            </p>
          </div>
        </section>

        <section id="contact" className="section contact">
          <p className="section-number">04 / Contact</p>
          <h2>Let’s talk about analytics, decision systems, or applied AI.</h2>
          <div className="contact-links">
            <a href="mailto:qmcztop@outlook.com">Email</a>
            <a href="https://www.linkedin.com/in/wenchuanzhu" target="_blank" rel="noreferrer">LinkedIn</a>
            <a href="https://github.com/LokiLJ" target="_blank" rel="noreferrer">GitHub</a>
          </div>
        </section>
      </main>
      <footer>
        <span>© 2026 Wenchuan (Kevin) Zhu</span>
        <span>V2 redesign scaffold</span>
      </footer>
    </>
  )
}

export default App
