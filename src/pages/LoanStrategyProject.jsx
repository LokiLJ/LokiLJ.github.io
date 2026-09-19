import { Link } from 'react-router-dom'

const inferenceRows = [
  ['Rent vs Own','Adjusted gap remained','≈ +20 pp','Persisted after IPW; matching ATT was similar in magnitude'],
  ['Lower vs higher credit quality','Counterintuitive gap remained','Direction reversed from intuition','Within the no-default subsample, poorer-credit applicants had higher weighted approval'],
  ['Male vs Female','Gap largely disappeared','≈ 0','After adjustment, no systematic gender approval difference remained'],
]

export default function LoanStrategyProject() {
  return (
    <>
      <section className="project-special-hero loan-hero">
        <div className="special-hero-nav"><Link className="back-link" to="/work">← Selected work</Link><span>Finance & Risk · 2025</span></div>
        <p className="kicker">Machine Learning → Econometrics</p>
        <h1>A routine approval classifier changed direction after one correlation came back almost zero.</h1>
        <p className="special-deck">The initial goal was ordinary: predict loan approval. The more interesting question emerged when credit score—the variable expected to anchor credit quality—showed almost no relationship with approval.</p>
        <div className="project-role">Technical lead · Designed and implemented the modelling and econometric analysis.</div>
      </section>

      <section className="loan-pivot-band">
        <div><span>Observation that changed the project</span><strong>−0.01</strong><p>correlation between credit score and approval</p></div>
        <div className="pivot-story"><span>Initial endpoint</span><strong>“Can ML predict approval?”</strong><i>→</i><span>Better question</span><strong>“What lending logic makes the approvals coherent?”</strong></div>
      </section>

      <section className="section loan-ml-section">
        <div className="section-heading wide-heading">
          <div><p className="section-number">01 / Prediction was not the endpoint</p><h2>Good classifiers did not explain the policy.</h2></div>
          <p>After the near-zero correlation appeared, nonlinear models were used to test whether credit score simply mattered in a non-linear way. Strong predictive performance remained possible, but credit score contributed little to the practical prediction story.</p>
        </div>
        <div className="ml-to-econ-flow">
          <article><span>EDA</span><strong>corr ≈ −0.01</strong><p>Unexpected credit-score signal.</p></article><i>→</i>
          <article><span>Machine learning</span><strong>RF / XGBoost</strong><p>Confirm that approval can still be predicted well.</p></article><i>→</i>
          <article className="pivot-card"><span>Methodological pivot</span><strong>Econometric adjustment</strong><p>Ask whether group patterns persist after observable differences are balanced.</p></article>
        </div>
      </section>

      <section className="section dti-section">
        <div className="section-heading wide-heading">
          <div><p className="section-number">02 / Look at risk and pricing together</p><h2>Higher DTI came with both higher approval and higher interest.</h2></div>
          <p>Across DTI deciles, the approval pattern moved upward while interest rates also rose, yet average credit scores stayed broadly similar. That combination suggested a risk–return logic that a feature-importance chart alone could not explain.</p>
        </div>
        <div className="dti-visual">
          <div className="dti-axis"><span>Lower DTI</span><span>Higher DTI</span></div>
          <div className="dti-series approval-series"><label>Approval</label>{[18,25,30,37,43,49,55,61,66,72].map((v,i)=><i key={i} style={{height:v+'%'}}></i>)}</div>
          <div className="dti-series rate-series"><label>Interest</label>{[28,32,36,39,43,48,53,58,64,69].map((v,i)=><i key={i} style={{height:v+'%'}}></i>)}</div>
          <div className="credit-flat-line"><label>Credit score</label><i></i><span>roughly flat across deciles</span></div>
        </div>
        <p className="method-note">The visual is schematic: it preserves the directional finding from the project rather than reproducing proprietary-looking exact chart values.</p>
      </section>

      <section className="section causal-section">
        <div className="section-heading wide-heading">
          <div><p className="section-number">03 / Move from feature importance to balanced comparisons</p><h2>IPW and matching asked a different question.</h2></div>
          <p>Propensity scores compressed observed covariate information into a balancing score. Extreme scores were trimmed, IPW estimated adjusted group contrasts, and nearest-neighbour matching provided robustness checks where appropriate.</p>
        </div>
        <div className="causal-pipeline">
          <article><span>01</span><strong>Estimate propensity</strong><p>Logistic model for group membership from observed covariates.</p></article><i>→</i>
          <article><span>02</span><strong>Check overlap</strong><p>Trim extreme propensity scores to avoid unstable weights.</p></article><i>→</i>
          <article><span>03</span><strong>Weight / match</strong><p>Re-balance observable borrower composition.</p></article><i>→</i>
          <article><span>04</span><strong>Compare approval</strong><p>Ask which gaps remain after adjustment.</p></article>
        </div>
      </section>

      <section className="section inference-section">
        <div className="section-heading wide-heading">
          <div><p className="section-number">04 / What survived adjustment?</p><h2>Not every raw difference behaved the same way.</h2></div>
          <p>The adjusted comparisons created a useful contrast: housing and credit-quality patterns persisted, while the gender approval gap approached zero.</p>
        </div>
        <div className="inference-table">
          <div className="inference-head"><span>Comparison</span><span>Adjusted result</span><span>Magnitude / direction</span><span>Interpretation</span></div>
          {inferenceRows.map((r)=><div className="inference-row" key={r[0]}>{r.map((c)=><span key={c}>{c}</span>)}</div>)}
        </div>
      </section>

      <section className="section strategy-section">
        <div className="section-heading wide-heading">
          <div><p className="section-number">05 / Interpret the mechanism carefully</p><h2>The pattern looked more like bounded risk–return than simple risk minimization.</h2></div>
          <p>The dataset is synthetic, so the analysis should not be read as evidence about a real bank’s intent. Within the synthetic approval mechanism, however, the combined DTI, interest-rate, default-screening, housing, and credit-group results were consistent with a higher-risk, higher-yield strategy inside a constrained risk envelope.</p>
        </div>
        <div className="risk-envelope">
          <article className="risk-stop"><span>Screen out</span><strong>Extreme risk</strong><p>Previous default history acts as a hard boundary in the synthetic system.</p></article>
          <div className="risk-arrow">→</div>
          <article className="risk-zone"><span>Within remaining envelope</span><strong>Trade risk for yield</strong><p>Higher-DTI / higher-interest segments receive more approval despite similar average credit quality.</p></article>
        </div>
      </section>

      <section className="section closing-insight">
        <p className="section-number">Key takeaway</p>
        <h2>Machine learning answered “who is approved.” Econometric adjustment helped investigate why the unusual approval pattern remained after borrower composition was balanced.</h2>
        <div className="publication-note">This project uses a synthetic loan dataset. IPW and matching adjust for observed covariates under identifying assumptions; they do not establish managerial intent or eliminate unobserved confounding.</div>
        <div className="project-actions"><Link className="button secondary" to="/work">Back to all work</Link></div>
      </section>
    </>
  )
}
