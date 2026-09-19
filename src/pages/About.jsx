const experience = [
  {
    period: 'Sep 2026 — Present',
    role: 'Data Scientist Intern (LLM)',
    org: 'Zhu HiTech Limited',
    text: 'Developing language-model methods for reverse question generation on educational content. Public descriptions remain generic because client work is confidential.',
  },
  {
    period: 'May — Aug 2026',
    role: 'Data Analyst Intern',
    org: 'Zhu HiTech Limited',
    text: 'Data exploration, cleaning, preprocessing, validation, and exploratory analysis on large datasets, with emphasis on surfacing data-quality issues before modelling.',
  },
  {
    period: 'Mar — Jun 2025',
    role: 'Intern of Finance (Equity & Debt)',
    org: 'PingAn Securities — Investment Banking Division',
    text: 'Supported IPO and corporate-bond transactions, built comparable-company analysis across 10+ sectors, and automated recurring analysis reports from 10,000+ row datasets with VBA.',
  },
  {
    period: '2021 — Present',
    role: 'Independent Instructor',
    org: 'Mathematics, Programming, Test Preparation',
    text: 'Runs an independent teaching practice with self-designed curriculum, pricing, and scheduling, covering secondary mathematics, introductory Visual Basic, and GMAT quantitative reasoning.',
  },
]

const education = [
  ['2025 — Dec 2026', 'Master of Management Analytics', 'University of Alberta · GPA 3.77/4.00'],
  ['2021 — 2025', 'BSc (Hons) Finance and Investment Management', 'University of Ulster · First Class Honours'],
  ['2021 — 2025', 'Bachelor of Finance', 'Dongbei University of Finance and Economics · GPA 93.2/100'],
]

export default function About() {
  return (
    <>
      <section className="page-hero">
        <p className="kicker">About</p>
        <h1>Quantitative modelling meets decisions that have to be made anyway.</h1>
        <p className="hero-copy">
          I came to analytics through finance and capital markets. Recent work has taken me
          into production scheduling, hospital staffing, logistics, responsible AI, language
          models, and software — different domains with the same recurring challenge:
          understanding what the real decision is before optimizing it.
        </p>
      </section>

      <section className="section split-section">
        <div>
          <p className="section-number">Story</p>
          <h2>Three habits connect the work.</h2>
        </div>
        <div className="prose-stack">
          <p><strong>Reframe the question.</strong> Several of my strongest projects became useful only after the original framing was challenged.</p>
          <p><strong>Finish the last mile.</strong> A model is not the deliverable if the user still cannot act on it; I try to translate analysis into policies, thresholds, tools, or monitoring rules.</p>
          <p><strong>Teach it.</strong> Independent teaching since 2021 has made explaining technical reasoning to non-technical audiences part of the work rather than an afterthought.</p>
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <p className="section-number">Experience</p>
          <h2>Professional journey</h2>
        </div>
        <div className="timeline-v2">
          {experience.map((item) => (
            <article key={item.period + item.role}>
              <span>{item.period}</span>
              <div>
                <h3>{item.role}</h3>
                <p className="timeline-org">{item.org}</p>
                <p>{item.text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <p className="section-number">Education</p>
          <h2>Finance first, analytics next.</h2>
        </div>
        <div className="education-grid">
          {education.map(([period, degree, school]) => (
            <article key={degree}>
              <span>{period}</span>
              <h3>{degree}</h3>
              <p>{school}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section split-section">
        <div>
          <p className="section-number">Direction</p>
          <h2>From building systems toward deciding what gets built.</h2>
        </div>
        <div>
          <p>
            I am particularly interested in product and strategy work around quantitative
            decision systems and AI agents for enterprise process automation.
          </p>
        </div>
      </section>
    </>
  )
}
