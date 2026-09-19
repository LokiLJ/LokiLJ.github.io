import { Link } from 'react-router-dom'

const staffing = [
  ['CCRN','65.5','67.3','+1.8'],
  ['Ward RN','76.7','80.2','+3.5'],
  ['RPN','49.4','38.8','−10.5'],
]

export default function NurseProject() {
  return (
    <>
      <section className="project-special-hero nurse-hero">
        <div className="special-hero-nav"><Link className="back-link" to="/work">← Selected work</Link><span>Healthcare · 2026</span></div>
        <p className="kicker">Forecasting · Scenario Analysis · Optimization</p>
        <h1>Forecast accuracy was not the main source of staffing value.</h1>
        <p className="special-deck">A three-tier nurse-staffing study that combined tier-specific demand models, correlated scenarios, asymmetric staffing costs, and cross-tier substitution in a linear program.</p>
        <div className="project-role">Team project · Led most of the technical modelling, scenario generation, and optimization work.</div>
      </section>

      <section className="nurse-impact-band">
        <div><span>Projected deterministic saving</span><strong>$100,377</strong><p>LP with cross-tier substitution vs. independent closed-form newsvendor benchmark</p></div>
        <div><span>Scenario mean saving</span><strong>$98,882</strong><p>evaluated across 1,000 correlated demand scenarios</p></div>
        <div><span>Main value driver</span><strong>Substitution</strong><p>optimization architecture mattered more than extra forecast complexity</p></div>
      </section>

      <section className="section nurse-forecast-section">
        <div className="section-heading wide-heading">
          <div><p className="section-number">01 / Forecast the tiers separately</p><h2>Heterogeneity was structural, not cosmetic.</h2></div>
          <p>The three nurse tiers had different volatility, seasonality, and residual behaviour. A pooled model would have mixed those structures and distorted downstream staffing buffers.</p>
        </div>
        <div className="forecast-cards">
          <article><span>CCRN</span><strong>6.60% MAPE</strong><p>OLS + AR(1). Lag-1 correction reduced residual sigma from 35.4 to 31.5.</p><div className="forecast-meter"><i style={{width:'66%'}}></i></div></article>
          <article><span>Ward RN</span><strong>8.77% MAPE</strong><p>OLS with independent residuals; no correction was justified by diagnostics.</p><div className="forecast-meter"><i style={{width:'87.7%'}}></i></div></article>
          <article><span>RPN</span><strong>11.11% MAPE</strong><p>Strongest seasonal complexity; extra Fourier terms did not improve the small-sample specification.</p><div className="forecast-meter"><i style={{width:'100%'}}></i></div></article>
        </div>
      </section>

      <section className="section dependence-section">
        <div className="section-heading wide-heading">
          <div><p className="section-number">02 / Preserve the right dependence</p><h2>Residual correlation would have flipped the story.</h2></div>
          <p>For CCRN and Ward RN, the raw first-difference correlation was negative. Seasonal residualization changed its sign, so residual correlation would have incorrectly modelled the tiers as co-moving.</p>
        </div>
        <div className="correlation-contrast">
          <article><span>Raw first-difference correlation</span><strong>−0.209</strong><p>Used for scenario generation.</p></article>
          <div className="correlation-switch">→ seasonal residualization →</div>
          <article className="warning-correlation"><span>Residual correlation</span><strong>+0.283</strong><p>Rejected because it reversed the dependence structure.</p></article>
        </div>
        <div className="scenario-pill">1,000 correlated Monte Carlo scenarios · covariance built from tier-specific volatility + raw cross-tier correlations</div>
      </section>

      <section className="section staffing-section">
        <div className="section-heading wide-heading">
          <div><p className="section-number">03 / Optimize jointly</p><h2>The LP could substitute skills. The benchmark could not.</h2></div>
          <p>Higher-tier surplus could cover lower-tier shortfalls: CCRN could substitute downward into Ward RN or RPN demand, and Ward RN could cover RPN. This changed the optimal mix most sharply for RPN.</p>
        </div>
        <div className="staffing-table">
          <div className="staffing-head"><span>Tier</span><span>Independent newsvendor</span><span>Cross-tier LP</span><span>Difference</span></div>
          {staffing.map((r)=><div className="staffing-row" key={r[0]}>{r.map((c,i)=><span key={c} className={i===2?'lp-cell':''}>{c}{i>0 && i<3 ? ' FTE' : ''}</span>)}</div>)}
        </div>
        <div className="substitution-diagram">
          <article className="tier-high">CCRN</article><i>↓</i><article>Ward RN</article><i>↓</i><article className="tier-low">RPN</article><p>Downward substitution only</p>
        </div>
      </section>

      <section className="section nurse-risk-section">
        <div className="section-heading wide-heading">
          <div><p className="section-number">04 / Stress the recommendation</p><h2>A staffing plan needs a monitoring rule, not just an optimum.</h2></div>
          <p>Under combined cost stress, the gap versus ex-post optimal rose to 5.18%. Ward RN trend acceleration was the largest single sensitivity risk, motivating explicit monitoring and mid-year re-optimization triggers.</p>
        </div>
        <div className="monitor-flow">
          <article><span>Signal</span><strong>Demand drifts above forecast</strong></article><i>→</i>
          <article><span>Trigger</span><strong>Persistent threshold breach</strong></article><i>→</i>
          <article><span>Response</span><strong>Re-run the LP</strong></article><i>→</i>
          <article><span>Owner</span><strong>Named operating team</strong></article>
        </div>
        <blockquote className="capstone-quote nurse-quote"><span>Decision insight</span><p>The estimated ROI ceiling from additional forecast complexity was only about 3–5% of total cost. Cross-tier substitution was the bigger lever.</p></blockquote>
      </section>

      <section className="section closing-insight">
        <p className="section-number">Key takeaway</p>
        <h2>Better staffing came from modelling how skills substitute under uncertainty—not from treating forecasting accuracy as the end goal.</h2>
        <div className="publication-note">Methodology and derived findings are summarized; licensed teaching-case exhibits and source data are not reproduced.</div>
        <div className="project-actions"><Link className="button secondary" to="/work">Back to all work</Link></div>
      </section>
    </>
  )
}
