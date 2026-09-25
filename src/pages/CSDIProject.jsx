import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { mediaPublicUrl, supabase } from '../lib/supabase'

const reliabilityRows = [
  { label: 'Random 30%', rmse: 6.88, sens: 0.811, width: 22 },
  { label: 'Blackout 1h', rmse: 16.22, sens: 0.649, width: 51 },
  { label: 'Blackout 2h', rmse: 26.03, sens: 0.200, width: 82 },
  { label: 'Real-world gaps', rmse: 31.71, sens: 0.190, width: 100 },
]

function EvidenceImage({ asset, title, alt, fallback }) {
  if (!asset?.media_path) return fallback || null
  return (
    <figure className="csdi-evidence">
      <figcaption><span>Original report output</span><strong>{title}</strong></figcaption>
      <img src={mediaPublicUrl(asset.media_path)} alt={alt} />
    </figure>
  )
}

function ReliabilityFallback() {
  return (
    <div className="reliability-chart">
      {reliabilityRows.map((row)=><div className="reliability-row" key={row.label}>
        <div className="reliability-label"><strong>{row.label}</strong><span>RMSE {row.rmse.toFixed(2)} · Hypo sens {row.sens.toFixed(3)}</span></div>
        <div className="reliability-track"><i style={{width:row.width+'%'}}></i></div>
        <div className="sensitivity-dot-wrap"><i style={{left:(row.sens*100)+'%'}}></i></div>
      </div>)}
      <div className="reliability-legend"><span>Bar length → RMSE severity</span><span>Dot position → hypoglycemia sensitivity</span></div>
    </div>
  )
}

export default function CSDIProject() {
  const [assets,setAssets]=useState({})

  useEffect(()=>{
    if(!supabase) return
    let active=true
    supabase.from('project_assets').select('asset_key,media_path,caption').eq('project_id','csdi-imputation').eq('published',true).then(({data})=>{
      if(active && data) setAssets(Object.fromEntries(data.map(item=>[item.asset_key,item])))
    })
    return()=>{active=false}
  },[])

  return (
    <article className="csdi-editorial">
      <header className="project-special-hero csdi-hero">
        <div className="special-hero-nav"><Link className="back-link" to="/work">← Selected work</Link><span>Healthcare · 2026</span></div>
        <p className="kicker">10 T1D participants · Multimodal CGM imputation · CSDI</p>
        <h1>A more complex model was not always the safer answer.</h1>
        <p className="special-deck">The project began with a familiar machine-learning question: can diffusion models reconstruct missing continuous-glucose-monitor data better than conventional methods? The more useful question became: under which missingness conditions should anyone trust the reconstruction at all?</p>
        <div className="project-role">Team project · Proposed the CSDI-centered direction and owned the complete CSDI engineering, experimental execution, and shared clinical evaluation framework.</div>
      </header>

      <section className="csdi-context-grid">
        <div><p className="eyebrow">The setting</p><p>PhysioCGM combines glucose with wearable signals such as heart rate, breathing, electrodermal activity, temperature, and movement from 10 adults with Type 1 Diabetes over up to 17 days.</p></div>
        <div><p className="eyebrow">Why missingness matters</p><p>Sensor replacement, connectivity loss, and activity create gaps. In a closed-loop insulin setting, a plausible-looking but wrong reconstruction can be more dangerous than an explicit missing value.</p></div>
        <div><p className="eyebrow">The comparison</p><p>Traditional baselines versus two diffusion approaches across random masking, continuous blackouts, and missingness shaped by real sensor-dropout patterns.</p></div>
      </section>

      <section className="csdi-story-section">
        <div className="csdi-prose">
          <p className="csdi-dropcap">The first result challenged the reason for using diffusion at all. Under 30% random missingness, linear interpolation achieved the best mean point accuracy: RMSE 5.04 mg/dL.</p>
          <p>That was not a failure of the project. It was the first useful boundary. When gaps are short and scattered, nearby glucose observations already contain enough local information that a sophisticated generative model may simply be unnecessary.</p>
        </div>
        <EvidenceImage asset={assets.random_missing_comparison} title="Random 30% missingness benchmark" alt="Original report comparison of interpolation and diffusion models under random missingness" fallback={
          <div className="csdi-baseline-fallback">
            <article><span>Linear interpolation</span><strong>5.04</strong><p>mean RMSE mg/dL</p></article>
            <i>vs</i>
            <article><span>CSDI</span><strong>6.88</strong><p>mean RMSE mg/dL</p></article>
          </div>
        } />
        <div className="csdi-turn"><span>First turn</span><strong>For easy gaps, the simple method deserved to win.</strong></div>
      </section>

      <section className="csdi-story-section alternate">
        <div className="csdi-prose">
          <p>But random masking is not how sensors usually fail. Real devices disappear for continuous stretches, and the length of that blackout changes the information available to any imputer.</p>
          <p>As the gap grew, CSDI's error rose and hypoglycemia sensitivity collapsed. Performance was comparatively stable through gaps of roughly one hour; by two hours, sensitivity fell to 0.200 and the reconstruction became difficult to justify clinically.</p>
        </div>
        <EvidenceImage asset={assets.gap_reliability} title="Imputation quality versus gap length" alt="Original report figure showing RMSE and hypoglycemia sensitivity by gap length" fallback={<ReliabilityFallback />} />
        <div className="csdi-turn"><span>Second turn</span><strong>The real decision variable was not model family. It was gap length.</strong></div>
      </section>

      <section className="csdi-story-section">
        <div className="csdi-prose">
          <p>The multimodal design then produced another conditional result. Adding auxiliary physiology barely changed performance under random missingness, where glucose still had plenty of its own temporal context.</p>
          <p>Under a two-hour blackout, however, the seven-channel model reached hypoglycemia sensitivity of 0.200 versus 0.107 for glucose alone—about a 1.9× improvement. Extra sensors became useful precisely when the primary signal could no longer explain itself.</p>
        </div>
        <EvidenceImage asset={assets.cross_modal_ablation} title="Cross-modal ablation" alt="Original report comparison of seven-channel and glucose-only CSDI" fallback={
          <div className="multimodal-compare csdi-multimodal-compact">
            <article><span>Random 30%</span><div className="dual-metric"><b>0.811</b><em>7-channel</em><b>0.792</b><em>glucose only</em></div><p>Little practical difference.</p></article>
            <article className="multimodal-highlight"><span>Blackout 2h</span><div className="dual-metric"><b>0.200</b><em>7-channel</em><b>0.107</b><em>glucose only</em></div><strong>≈1.9× sensitivity</strong></article>
          </div>
        } />
        <div className="csdi-turn"><span>Third turn</span><strong>Multimodal data mattered most when the main modality lost its own context.</strong></div>
      </section>

      <section className="csdi-story-section alternate">
        <div className="csdi-prose">
          <p>To move beyond hand-designed masks, we extracted the empirical gap-length distribution from the raw timestamps. Naturally missing values have no ground truth, so we replayed that distribution onto complete segments to create realistic missingness with known answers.</p>
          <p>The real-world distribution was long-tailed: median gap about 110 minutes, 75th percentile about 4.5 hours, and 44% of gaps between one and four hours. Under this semi-synthetic benchmark, CSDI RMSE reached 31.71 mg/dL and hypoglycemia sensitivity fell to 0.190.</p>
        </div>
        <EvidenceImage asset={assets.real_world_gaps} title="Real-world gap distribution" alt="Original report figure describing observed PhysioCGM sensor gaps" fallback={
          <div className="gap-stats">
            <article><strong>110 min</strong><span>median observed gap</span></article>
            <article><strong>4.5 h</strong><span>75th percentile</span></article>
            <article><strong>44%</strong><span>of gaps between 1–4 hours</span></article>
            <article><strong>31.71</strong><span>mg/dL RMSE under realistic missingness</span></article>
          </div>
        } />
      </section>

      <section className="csdi-story-section">
        <div className="csdi-prose">
          <p>A probabilistic model should ideally know when it is uncertain. That became the final safety test.</p>
          <p>Under random missingness, the confidence intervals were reasonably calibrated. Under long blackouts, empirical coverage dropped below nominal coverage: the model became over-confident at the same time its point estimates were becoming less reliable.</p>
        </div>
        <EvidenceImage asset={assets.calibration} title="Calibration under easy and hard missingness" alt="Original report calibration analysis for CSDI confidence intervals" fallback={
          <div className="calibration-card">
            <div className="calibration-plot"><div className="calibration-axis y"></div><div className="calibration-axis x"></div><i className="perfect-line"></i><i className="random-line"></i><i className="blackout-line"></i><span className="cal-label ideal">ideal</span><span className="cal-label blackout">2h blackout: under-coverage</span></div>
            <div className="calibration-copy"><span>Safety implication</span><h3>Uncertainty can fail before the user notices.</h3><p>A confidence interval is only useful if its stated confidence still means something under the hard cases.</p></div>
          </div>
        } />
        <div className="csdi-turn"><span>Final turn</span><strong>The model did not only become less accurate after long gaps. It became too confident about being wrong.</strong></div>
      </section>

      <section className="csdi-story-section alternate">
        <div className="csdi-prose">
          <p>My contribution was the CSDI engineering layer that made these comparisons possible: adapting the data loader to the PhysioCGM timestep format, extracting seven channels, building 48-step windows, running scenario-specific experiments, and implementing the clinical evaluation suite.</p>
          <p>The resulting recommendation is deliberately conditional: interpolation is enough for easy local gaps; CSDI adds value as gaps become harder; auxiliary physiology becomes meaningful when glucose context disappears; beyond roughly two hours, the system should stop presenting imputation as if it were dependable.</p>
        </div>
        <div className="csdi-build-grid">
          <article><span>7 channels</span><h3>Multimodal CSDI</h3><p>Glucose plus auxiliary physiological signals.</p></article>
          <article><span>48 steps</span><h3>Windowed pipeline</h3><p>Validated loading, feature extraction, normalization, and dataloader integrity.</p></article>
          <article><span>7 metrics</span><h3>Clinical evaluation</h3><p>Point error, probabilistic quality, event sensitivity, TIR, and Clarke Error Grid.</p></article>
          <article><span>5-fold CV</span><h3>Robustness checks</h3><p>Separated meaningful cross-modal gains from fold-to-fold noise.</p></article>
        </div>
      </section>

      <section className="csdi-editorial-ending">
        <p className="eyebrow">What the project changed</p>
        <h2>The safest imputation system is not the one that always fills the gap. It is the one that knows when the gap has become too hard.</h2>
        <p>The project moved from model comparison to a reliability policy: choose complexity conditionally, use multimodal information when the primary signal loses context, and expose a practical stop-trusting boundary instead of forcing a prediction through every missing segment.</p>
        <div className="project-actions"><Link className="button secondary" to="/work">Back to all work</Link></div>
      </section>
    </article>
  )
}
