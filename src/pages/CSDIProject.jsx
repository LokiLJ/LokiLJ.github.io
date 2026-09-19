import { Link } from 'react-router-dom'

const reliabilityRows = [
  { label: 'Random 30%', rmse: 6.88, sens: 0.811, width: 22 },
  { label: 'Blackout 1h', rmse: 16.22, sens: 0.649, width: 51 },
  { label: 'Blackout 2h', rmse: 26.03, sens: 0.200, width: 82 },
  { label: 'Real-world gaps', rmse: 31.71, sens: 0.190, width: 100 },
]

export default function CSDIProject() {
  return (
    <>
      <section className="project-special-hero csdi-hero">
        <div className="special-hero-nav"><Link className="back-link" to="/work">← Selected work</Link><span>Healthcare · 2026</span></div>
        <p className="kicker">Probabilistic Imputation · CSDI · PhysioCGM</p>
        <h1>The useful question was not “Which model has the lowest RMSE?”</h1>
        <p className="special-deck">It was: under what missing-data conditions does an imputation model remain clinically informative, and when should we stop trusting the reconstruction?</p>
        <div className="project-role">Team project · Proposed the CSDI-centered direction and owned the complete CSDI engineering, experimental execution, and shared clinical evaluation framework.</div>
      </section>

      <section className="csdi-boundary-band">
        <div><span>Practical reliability boundary</span><strong>≈ 1 hour</strong><p>CSDI remained comparatively useful through shorter gaps, but performance deteriorated sharply as continuous missingness grew longer.</p></div>
        <div><span>2-hour blackout</span><strong>0.200</strong><p>hypoglycemia sensitivity for the 7-channel model</p></div>
        <div><span>Real-world gap study</span><strong>242</strong><p>naturally occurring sensor gaps used to build a semi-synthetic evaluation distribution</p></div>
      </section>

      <section className="section csdi-baseline-section">
        <div className="section-heading wide-heading">
          <div><p className="section-number">01 / Complexity is conditional</p><h2>Simple interpolation was hard to beat when the gap was easy.</h2></div>
          <p>Under 30% random missingness, linear interpolation achieved mean RMSE 5.04 mg/dL, better point accuracy than the diffusion models in that easy regime. But point accuracy alone did not tell the whole clinical story.</p>
        </div>
        <div className="accuracy-vs-safety">
          <article><p className="eyebrow">Short, scattered gaps</p><strong>5.04 mg/dL</strong><h3>Linear interpolation RMSE</h3><p>Strong local interpolation when nearby glucose observations remain informative.</p></article>
          <div className="contrast-arrow">→</div>
          <article className="clinical-card"><p className="eyebrow">What point RMSE misses</p><strong>0</strong><h3>Hypoglycemia sensitivity for interpolation</h3><p>The project’s cross-method comparison found that the strongest point baseline failed to detect hypoglycemic events across scenarios.</p></article>
        </div>
      </section>

      <section className="section csdi-reliability-section">
        <div className="section-heading wide-heading">
          <div><p className="section-number">02 / Reliability decays with gap length</p><h2>Error rises while clinically important sensitivity collapses.</h2></div>
          <p>The 7-channel CSDI model behaved very differently across missingness regimes. This made gap length itself a decision variable: not every missing segment should be treated as equally reconstructable.</p>
        </div>
        <div className="reliability-chart">
          {reliabilityRows.map((row)=><div className="reliability-row" key={row.label}>
            <div className="reliability-label"><strong>{row.label}</strong><span>RMSE {row.rmse.toFixed(2)} · Hypo sens {row.sens.toFixed(3)}</span></div>
            <div className="reliability-track"><i style={{width:row.width+'%'}}></i></div>
            <div className="sensitivity-dot-wrap"><i style={{left:(row.sens*100)+'%'}}></i></div>
          </div>)}
          <div className="reliability-legend"><span>Bar length → RMSE severity</span><span>Dot position → hypoglycemia sensitivity</span></div>
        </div>
      </section>

      <section className="section multimodal-section">
        <div className="section-heading wide-heading">
          <div><p className="section-number">03 / When do extra sensors help?</p><h2>Multimodal value emerged only when glucose lost its own context.</h2></div>
          <p>Random missingness showed little practical advantage from adding auxiliary wearable signals. Under a 2-hour blackout, however, cross-modal conditioning nearly doubled hypoglycemia sensitivity.</p>
        </div>
        <div className="multimodal-compare">
          <article><span>Random 30%</span><div className="dual-metric"><b>0.811</b><em>7-channel</em><b>0.792</b><em>glucose only</em></div><p>Difference was small and within the broader evidence of fold-to-fold variation.</p></article>
          <article className="multimodal-highlight"><span>Blackout 2h</span><div className="dual-metric"><b>0.200</b><em>7-channel</em><b>0.107</b><em>glucose only</em></div><strong>≈1.9× sensitivity</strong><p>Auxiliary physiology became useful after glucose temporal context was severely disrupted.</p></article>
        </div>
      </section>

      <section className="section realworld-gap-section">
        <div className="section-heading wide-heading">
          <div><p className="section-number">04 / Simulate missingness that looks real</p><h2>Real sensor dropout has a long tail.</h2></div>
          <p>Because naturally missing values do not come with ground truth, the project extracted the empirical gap-length distribution from raw timestamps, then applied it to complete segments to create a semi-synthetic benchmark with realistic missingness and known answers.</p>
        </div>
        <div className="gap-stats">
          <article><strong>110 min</strong><span>median observed gap</span></article>
          <article><strong>4.5 h</strong><span>75th percentile</span></article>
          <article><strong>44%</strong><span>of gaps between 1–4 hours</span></article>
          <article><strong>31.71</strong><span>mg/dL RMSE under semi-synthetic real-world missingness</span></article>
        </div>
      </section>

      <section className="section calibration-section">
        <div className="section-heading wide-heading">
          <div><p className="section-number">05 / Does the model know when it is uncertain?</p><h2>Long gaps broke calibration, not just accuracy.</h2></div>
          <p>Random-missing scenarios tracked the ideal calibration line closely. Under 2-hour blackout, empirical coverage fell systematically below nominal coverage: the model became over-confident exactly when reconstruction was hardest.</p>
        </div>
        <div className="calibration-card">
          <div className="calibration-plot">
            <div className="calibration-axis y"></div><div className="calibration-axis x"></div>
            <i className="perfect-line"></i><i className="random-line"></i><i className="blackout-line"></i>
            <span className="cal-label ideal">perfect calibration</span><span className="cal-label blackout">2h blackout: under-coverage</span>
          </div>
          <div className="calibration-copy"><span>Clinical implication</span><h3>Uncertainty can fail before the user notices.</h3><p>A probabilistic model is valuable only if its intervals remain informative. Long continuous gaps reduced both point reliability and confidence-interval calibration.</p></div>
        </div>
      </section>

      <section className="section ownership-section">
        <div className="section-heading wide-heading"><div><p className="section-number">06 / What I built</p><h2>The CSDI pipeline, evaluation system, and experimental variants.</h2></div><p>The report attributes the complete CSDI engineering pipeline to me: data loading, seven-channel feature extraction, 48-step windows, scenario-specific execution scripts, more than ten training runs, eight additional CV runs, real-world gap analysis, seven clinical metrics, and the CSDI visualizations.</p></div>
        <div className="csdi-build-grid">
          <article><span>7 channels</span><h3>Multimodal CSDI</h3><p>Glucose plus auxiliary physiological signals.</p></article>
          <article><span>48 steps</span><h3>Windowed pipeline</h3><p>Validated loading, feature extraction, normalization, and dataloader integrity.</p></article>
          <article><span>7 metrics</span><h3>Clinical evaluation</h3><p>MAE, RMSE, CRPS, hypo sensitivity/specificity, TIR error, Clarke Error Grid.</p></article>
          <article><span>5-fold CV</span><h3>Robustness checks</h3><p>Used to distinguish meaningful cross-modal effects from fold-to-fold noise.</p></article>
        </div>
      </section>

      <section className="section closing-insight">
        <p className="section-number">Key takeaway</p>
        <h2>The value of probabilistic imputation was not simply a lower error. It was identifying when missing glucose could still be reconstructed—and when the model should no longer be trusted.</h2>
        <div className="project-actions"><Link className="button secondary" to="/work">Back to all work</Link></div>
      </section>
    </>
  )
}
