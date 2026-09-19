import { Link } from 'react-router-dom'

const modelRows = [
  { model: 'M1', name: 'Mean-demand baseline', regret: 12.74, sd: 6.22, note: 'Simple, but ignores uncertainty.' },
  { model: 'M2', name: 'Stochastic SAA', regret: 10.94, sd: 2.93, note: 'Captures uncertainty with equal scenario weights.' },
  { model: 'M3', name: 'Context-weighted PP', regret: 8.51, sd: 5.33, note: 'Best average regret; higher volatility.' },
  { model: 'M4', name: 'Risk-aware VaR', regret: 8.88, sd: 4.01, note: 'Small mean premium for better tail control.' },
]

const debugCards = [
  ['Zero regret', 'The economics were wrong: free or mispriced recourse made capacity constraints meaningless.'],
  ['Zero capacity on remote spokes', 'The penalty baseline used average distance, making shortage cheaper than serving distant destinations.'],
  ['Independent spokes', 'Without a shared first-stage capacity budget, the network collapsed into separate newsvendor problems.'],
  ['Inactive VaR guardrail', 'In cost minimization, the auxiliary threshold had to be explicitly disciplined or the risk constraint could become vacuous.'],
]

export default function RRSProject() {
  return (
    <>
      <section className="project-special-hero rrs-hero">
        <div className="special-hero-nav"><Link className="back-link" to="/work">← Selected work</Link><span>Decision Systems · 2026</span></div>
        <p className="kicker">Predictive–Prescriptive Logistics</p>
        <h1>Before optimizing the network, I had to determine what the network actually was.</h1>
        <p className="special-deck">A large-scale logistics project that moved from raw operational records to a two-stage stochastic capacity model with contextual demand weighting and tail-risk control.</p>
        <div className="project-role">Model-design lead · Developed the modelling theory and directed implementation.</div>
      </section>

      <section className="evidence-strip">
        <article><strong>14.7M</strong><span>filtered order records investigated</span></article>
        <article><strong>54.4%</strong><span>local orders removed before network analysis</span></article>
        <article><strong>6.7M</strong><span>cross-hub orders remaining</span></article>
        <article><strong>80% / 7%</strong><span>traffic concentration across a small share of arcs</span></article>
      </section>

      <section className="section narrative-grid-section">
        <div className="section-heading wide-heading">
          <div><p className="section-number">01 / Reconstruct reality</p><h2>Transactional flow was not physical flow.</h2></div>
          <p>Origin–destination assignments described fulfilment decisions, while movement logs described what the freight actually did. That distinction changed the admissible network before any optimization model was allowed to run.</p>
        </div>
        <div className="network-contrast">
          <article><span>Orders table</span><h3>Assigned origin → destination</h3><div className="route-demo direct"><b>081</b><i>→</i><b>089</b></div><p>Looks like a direct lane.</p></article>
          <div className="contrast-arrow">≠</div>
          <article className="actual-route"><span>Movement log</span><h3>Observed physical route</h3><div className="route-demo relay"><b>081</b><i>→</i><b>082</b><i>→</i><b>089</b></div><p>Physical movement reveals the relay structure.</p></article>
        </div>
        <div className="data-lesson-grid">
          <article><span>Identity lesson</span><h3>Patterns do not prove node roles.</h3><p>Initial hub-role inference from flow ratios was later corrected using external structural evidence.</p></article>
          <article><span>Event-code lesson</span><h3>Operational records can imitate reverse logistics.</h3><p>An alarming return pattern was traced to non-physical system events rather than genuine freight movement.</p></article>
          <article><span>Policy lesson</span><h3>ρ was not simply “a number to estimate.”</h3><p>The shortage penalty encoded management’s service posture, so it became a sensitivity and policy parameter.</p></article>
        </div>
      </section>

      <section className="section rrs-debug-section">
        <div className="section-heading wide-heading">
          <div><p className="section-number">02 / Model debugging</p><h2>“Regret = 0” was a bug report, not a victory.</h2></div>
          <p>The hardest part was not getting the solver to return an answer. It was recognizing when a mathematically feasible answer violated the economics of the system.</p>
        </div>
        <div className="debug-grid">{debugCards.map(([title,text],i)=><article key={title}><span>0{i+1}</span><h3>{title}</h3><p>{text}</p></article>)}</div>
      </section>

      <section className="section model-ladder-section">
        <div className="section-heading wide-heading">
          <div><p className="section-number">03 / Build the decision ladder</p><h2>Separate the value of uncertainty, context, and risk control.</h2></div>
          <p>The final benchmark used a progression from deterministic planning to stochastic planning, then contextual scenario weighting, then a VaR-style safeguard. Each step answered a different question.</p>
        </div>
        <div className="model-ladder">
          <article><span>M0</span><strong>Perfect foresight</strong><p>Lower bound only.</p></article>
          <i>→</i><article><span>M1</span><strong>Mean demand</strong><p>Deterministic baseline.</p></article>
          <i>→</i><article><span>M2</span><strong>SAA</strong><p>Value of uncertainty.</p></article>
          <i>→</i><article className="model-best"><span>M3</span><strong>kNN context</strong><p>Value of context.</p></article>
          <i>→</i><article><span>M4</span><strong>VaR guardrail</strong><p>Value of robustness.</p></article>
        </div>
      </section>

      <section className="section rrs-results-section">
        <div className="section-heading wide-heading">
          <div><p className="section-number">04 / Results</p><h2>Context improved the mean. Risk control improved the tail.</h2></div>
          <p>Average regret fell as the model incorporated uncertainty and operating context. M3 achieved the lowest mean regret among practical models, while M4 accepted a small mean-regret premium in exchange for lower volatility.</p>
        </div>
        <div className="rrs-table">
          <div className="rrs-table-head"><span>Model</span><span>Avg regret</span><span>Std regret</span><span>Interpretation</span></div>
          {modelRows.map((row)=><div className={'rrs-table-row '+(row.model==='M3'?'is-best':'')} key={row.model}>
            <span><b>{row.model}</b><small>{row.name}</small></span>
            <span>{row.regret.toFixed(2)}M<div className="regret-bar"><i style={{width: (row.regret/13*100)+'%'}}></i></div></span>
            <span>{row.sd.toFixed(2)}M</span>
            <span>{row.note}</span>
          </div>)}
        </div>
        <blockquote className="capstone-quote rrs-quote"><span>Decision insight</span><p>Context was valuable—but concentrating too heavily on local scenarios also increased volatility. Better prediction did not automatically mean safer decisions.</p></blockquote>
      </section>

      <section className="section closing-insight">
        <p className="section-number">Key takeaway</p>
        <h2>A mathematically solvable model is not enough. The network, the data semantics, and the economics all have to describe the same reality.</h2>
        <div className="project-actions"><Link className="button secondary" to="/work">Back to all work</Link></div>
      </section>
    </>
  )
}
