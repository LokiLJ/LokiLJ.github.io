import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { mediaPublicUrl, supabase } from '../lib/supabase'

const scheduleRows = [
  ['Mon', 'DS00134', 'Move earlier', 'Mould constraint'],
  ['Mon', 'DS00137', 'Move earlier', 'Capacity'],
  ['Tue', 'DS00141', 'Ideal date', '—'],
  ['Wed', 'DS00143', 'Move earlier', 'Mould constraint'],
]

function MoneyLockedVisual() {
  return (
    <div className="cash-lock-visual" aria-label="Working capital becoming trapped in work in process">
      <div className="cash-source"><span>Profit</span><strong>$</strong></div>
      <div className="cash-arrow">→</div>
      <div className="cash-stack">
        <div className="cash-free"><span>Available cash</span><i></i></div>
        <div className="cash-wip"><span>Working capital locked in WIP</span><i></i><i></i><i></i><i></i></div>
      </div>
    </div>
  )
}

function PumpVisual() {
  return (
    <div className="pump-visual" aria-label="A pump requires a stator and a rotor">
      <article className="component-card stator-card">
        <span>Component 01</span>
        <div className="stator-shape" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></div>
        <h3>Stator</h3>
        <p>Produced internally · relatively short lead time</p>
      </article>
      <div className="component-plus">+</div>
      <article className="component-card rotor-card">
        <span>Component 02</span>
        <div className="rotor-shape" aria-hidden="true"><i></i></div>
        <h3>Rotor</h3>
        <p>External chrome processing · longer and more uncertain</p>
      </article>
      <div className="component-equals">=</div>
      <article className="component-card pump-card">
        <span>Assembly</span>
        <div className="pump-shape" aria-hidden="true"><i></i><b></b></div>
        <h3>Pump</h3>
        <p>Cannot move forward until both matching components are ready</p>
      </article>
    </div>
  )
}

function MismatchTimeline() {
  return (
    <div className="mismatch-timeline" aria-label="Stator finishes much earlier than rotor">
      <div className="timeline-row"><span>Stator</span><div className="timeline-track"><i className="stator-build"></i><b className="done-marker">DONE</b><em className="wait-zone">waiting → working capital locked</em></div></div>
      <div className="timeline-row"><span>Rotor</span><div className="timeline-track"><i className="rotor-build"></i><i className="chrome-process"></i><b className="return-marker">RETURN</b></div></div>
      <div className="timeline-assembly">Both ready → assembly</div>
    </div>
  )
}

function CapacityQuestion() {
  return (
    <div className="capacity-question">
      <article><span>Intuitive lever</span><strong>More machines</strong><p>Raise aggregate throughput.</p></article>
      <div>or</div>
      <article><span>Intuitive lever</span><strong>More labour</strong><p>Push more units through the line.</p></article>
    </div>
  )
}

function InvestigationFlow() {
  const steps = [
    ['01','Make WIP visible'],
    ['02','Find where inventory actually waits'],
    ['03','Identify the right production trigger'],
    ['04','Model uncertain return timing'],
    ['05','Convert timing into a feasible schedule'],
    ['06','Replay history and stress-test capacity'],
    ['07','Deliver a tool managers can use'],
  ]
  return (
    <div className="investigation-flow">
      {steps.map(([n,t],i)=><div className="investigation-step" key={n}><span>{n}</span><strong>{t}</strong>{i < steps.length-1 && <i>↓</i>}</div>)}
    </div>
  )
}

function DistributionVisual() {
  return (
    <div className="distribution-story">
      <div className="observed-box">
        <p className="eyebrow">Observed</p>
        <strong>Dispatch time</strong>
        <strong>Return time</strong>
      </div>
      <div className="hidden-box">
        <p className="eyebrow">Mostly unobserved</p>
        <span>supplier queue</span><span>batching</span><span>internal priority</span><span>processing decisions</span>
      </div>
      <div className="distribution-box">
        <p className="eyebrow">Decision</p>
        <strong>Stop forcing a point prediction.</strong>
        <div className="distribution-bars">{[28,46,78,100,88,69,48,31,18].map((h,i)=><i key={i} style={{height:h+'%'}}></i>)}</div>
        <span>Use an empirical return-time distribution instead.</span>
      </div>
    </div>
  )
}

function CostTradeoffVisual() {
  return (
    <div className="cost-tradeoff">
      <article>
        <span>Too early</span>
        <div className="tradeoff-icon early-icon"><i></i><b></b></div>
        <h3>Stator waits</h3>
        <p>Working capital is locked before the rotor returns.</p>
      </article>
      <div className="tradeoff-balance"><span>cost-weighted<br/>critical ratio</span><strong>⇄</strong></div>
      <article>
        <span>Too late</span>
        <div className="tradeoff-icon late-icon"><i></i><b></b></div>
        <h3>Rotor waits</h3>
        <p>Assembly is delayed after the rotor is already available.</p>
      </article>
    </div>
  )
}

function CapacitySensitivity() {
  return (
    <div className="capacity-sensitivity">
      <div className="capacity-row"><span>Existing aggregate capacity</span><div><i style={{width:'91%'}}></i></div><strong>baseline</strong></div>
      <div className="capacity-row"><span>Higher aggregate capacity</span><div><i style={{width:'94%'}}></i></div><strong>small incremental gain</strong></div>
      <div className="constraint-row"><span>More consequential constraint</span><strong>Mould availability</strong><div className="constraint-blocks"><i></i><i></i><i></i><i></i><i></i></div></div>
    </div>
  )
}

export default function CapstoneProject() {
  const [assets, setAssets] = useState({})

  useEffect(() => {
    if (!supabase) return
    let active = true
    supabase
      .from('project_assets')
      .select('asset_key,media_path,caption')
      .eq('project_id', 'production-scheduling')
      .eq('published', true)
      .then(({ data }) => {
        if (!active || !data) return
        setAssets(Object.fromEntries(data.map((item) => [item.asset_key, item])))
      })
    return () => { active = false }
  }, [])

  const dashboardVideo = assets.dashboard_demo?.media_path ? mediaPublicUrl(assets.dashboard_demo.media_path) : ''
  const schedulerFile = assets.scheduler_excel?.media_path ? mediaPublicUrl(assets.scheduler_excel.media_path) : ''

  return (
    <>
      <section className="cap-story-hero">
        <div className="cap-story-nav"><Link className="back-link" to="/work">← Selected work</Link><span>Industry capstone · synthetic public demo</span></div>
        <p className="kicker">Production Scheduling · Working Capital · 2026</p>
        <h1>A profitable manufacturer can still run short of cash.</h1>
        <p className="cap-story-lead">One reason is easy to miss: cash can be sitting on the factory floor as unfinished inventory.</p>
        <MoneyLockedVisual />
        <div className="cap-story-question">What if the problem is not selling too little—but producing too much <em>too early</em>?</div>
      </section>

      <section className="section cap-act cap-act-light">
        <div className="story-beat"><span>01 / Make the problem concrete</span><h2>Imagine a pump manufacturer with two components that refuse to finish together.</h2></div>
        <PumpVisual />
        <MismatchTimeline />
        <div className="story-punchline"><span>What accumulates?</span><strong>Finished stators waiting for their matching rotors.</strong><p>Every completed stator waiting on the floor represents working capital that cannot yet become a finished pump.</p></div>
      </section>

      <section className="section cap-act cap-act-dark">
        <div className="story-beat inverse"><span>02 / The obvious answer</span><h2>If production is backing up, increase production.</h2><p>More equipment or more labour sounds like the straightforward response.</p></div>
        <CapacityQuestion />
        <div className="big-story-question">But would producing faster actually solve the mismatch?</div>
      </section>

      <section className="section cap-act">
        <div className="story-beat"><span>03 / Our project begins here</span><h2>We treated it as a data problem before treating it as a capacity problem.</h2></div>
        <InvestigationFlow />
      </section>

      <section className="section cap-act cap-dashboard-act">
        <div className="story-beat"><span>04 / Diagnose before optimizing</span><h2>First, we needed to see where the cash was sitting.</h2><p>The dashboard reconstructed point-in-time WIP, lead-time distributions, and operational states using synthetic public-demo data.</p></div>
        <div className="cap-video-shell">
          {dashboardVideo ? (
            <video controls playsInline preload="metadata" src={dashboardVideo} />
          ) : (
            <div className="cap-video-placeholder">
              <span>Dashboard demo</span>
              <strong>Upload the redacted video from Admin → Project assets.</strong>
              <p>The page is already wired to display it here once published.</p>
            </div>
          )}
          <div className="cap-video-caption">Synthetic demonstration data · location-specific label redacted · no client operational records shown</div>
        </div>
        <div className="wip-reveal">
          <p className="eyebrow">What the diagnostic made visible</p>
          <div className="wip-bar-row"><span>Stator in production</span><div><i style={{width:'38%'}}></i></div></div>
          <div className="wip-bar-row key"><span>Stator waiting for rotor</span><div><i style={{width:'88%'}}></i></div></div>
          <div className="wip-bar-row"><span>Waiting for final test</span><div><i style={{width:'13%'}}></i></div></div>
          <strong>The bottleneck was synchronization—not raw throughput.</strong>
        </div>
      </section>

      <section className="section cap-act cap-act-light">
        <div className="story-beat"><span>05 / Second tempting answer</span><h2>If rotor timing drives the mismatch, why not predict the exact return date?</h2></div>
        <DistributionVisual />
        <div className="story-punchline"><span>Second turn</span><strong>The information needed for reliable individual prediction was structurally missing.</strong><p>So the model stopped pretending to know one exact date and represented return timing as a distribution.</p></div>
      </section>

      <section className="section cap-act">
        <div className="story-beat"><span>06 / Turn uncertainty into a decision</span><h2>Scheduling too early and too late do not cost the same.</h2></div>
        <CostTradeoffVisual />
        <div className="critical-ratio-note">
          <span>Decision rule</span>
          <strong>Choose the return-time percentile that balances the cost of the two waiting errors.</strong>
          <code>q* = F⁻¹( C_stator / (C_stator + C_rotor) )</code>
        </div>
      </section>

      <section className="section cap-act cap-act-dark">
        <div className="story-beat inverse"><span>07 / Reality interrupts the math</span><h2>The ideal build date was not always feasible.</h2><p>Daily capacity and mould availability could force an order away from its cost-optimal date.</p></div>
        <div className="feasibility-flow">
          <article><span>Ideal date</span><strong>Model timing</strong></article><i>→</i>
          <article><span>Check 1</span><strong>Plant capacity</strong></article><i>→</i>
          <article><span>Check 2</span><strong>Mould availability</strong></article><i>→</i>
          <article className="feasibility-final"><span>Final decision</span><strong>Move earlier or later by lower economic penalty</strong></article>
        </div>
      </section>

      <section className="section cap-act">
        <div className="story-beat"><span>08 / Return to the original intuition</span><h2>So—should the company simply buy more aggregate capacity?</h2></div>
        <CapacitySensitivity />
        <div className="story-punchline"><span>Third turn</span><strong>More overall capacity barely changed the answer.</strong><p>If investment is needed, target the binding tooling constraint rather than the headline plant-capacity number.</p></div>
      </section>

      <section className="section cap-impact-reveal">
        <p className="eyebrow">Historical replay</p>
        <strong className="impact-number">More than half</strong>
        <h2>lower simulated cost-weighted idle inventory versus the manual baseline.</h2>
        <p>Physical WIP also fell, so the improvement was not simply a shift toward cheaper inventory. Exact client-derived figures remain intentionally rounded.</p>
      </section>

      <section className="section cap-deliverables">
        <div className="story-beat"><span>09 / Last mile</span><h2>From analysis to something managers could actually use.</h2></div>
        <div className="deliverable-grid">
          <article className="deliverable-video">
            <p className="eyebrow">Deliverable 01</p>
            <h3>Operational dashboard</h3>
            <p>See what is happening: monitor WIP, inspect lead-time distributions, and drill into operational states.</p>
            {dashboardVideo ? <video controls playsInline preload="metadata" src={dashboardVideo} /> : <div className="mini-placeholder">Dashboard video appears after upload.</div>}
          </article>
          <article className="deliverable-excel">
            <p className="eyebrow">Deliverable 02</p>
            <h3>Daily scheduling output</h3>
            <p>Decide what to build: final build day, movement reason, audit trail, and manual exceptions.</p>
            <div className="deliverable-table-wrap"><table><thead><tr><th>Build day</th><th>Stator</th><th>Decision</th><th>Why</th></tr></thead><tbody>{scheduleRows.map((row)=><tr key={row.join('-')}>{row.map(cell=><td key={cell}>{cell}</td>)}</tr>)}</tbody></table></div>
            {schedulerFile && <a className="button primary" href={schedulerFile} target="_blank" rel="noreferrer">Download synthetic Excel demo</a>}
          </article>
        </div>
      </section>

      <section className="section cap-final-line">
        <p>Dashboard → diagnosis · Scheduling model → decision · Excel output → execution</p>
        <h2>We did not solve the problem by producing more.<br/>We solved it by producing at the right time.</h2>
        <div className="cap-role-note"><span>My contribution</span><strong>100% of scheduling algorithm and application · ~60% of dashboard design</strong></div>
        <div className="publication-note">Public business context is combined with intentionally rounded client-derived outcomes and independently generated synthetic demo data. Raw client data, exact costs, internal identifiers, and confidential operating parameters are not published.</div>
        <div className="project-actions"><Link className="button secondary" to="/work">Back to all work</Link></div>
      </section>
    </>
  )
}
