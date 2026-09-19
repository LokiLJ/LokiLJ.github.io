const topics = [
  ['Econometrics & Statistics', 'Regression, inference, causal reasoning, diagnostics, and interpretation.'],
  ['SQL & Data Management', 'Relational design, joins, CTEs, normalization, and analytical querying.'],
  ['Machine Learning', 'Decision trees, ensemble models, neural networks, responsible AI, and model diagnostics.'],
  ['Mathematics', 'Secondary-school mathematics and quantitative reasoning taught through worked examples.'],
]

export default function Teaching() {
  return (
    <>
      <section className="page-hero">
        <p className="kicker">Teaching</p>
        <h1>I teach the reasoning, not just the answer.</h1>
        <p className="hero-copy">
          I have run an independent teaching practice since 2021. This section will become a
          compact learning library built from topics I actually teach and use.
        </p>
      </section>
      <section className="section">
        <div className="teaching-grid">
          {topics.map(([title, description]) => (
            <article key={title}>
              <h2>{title}</h2>
              <p>{description}</p>
              <span>Learning notes coming in V2.1</span>
            </article>
          ))}
        </div>
      </section>
    </>
  )
}
