import { Link } from 'react-router-dom'

const methodSteps = [
  ['01','Trigger on a real operational event','Rotor dispatch became the pull signal for its matching stator, replacing a fixed five-week backward schedule with a response to the component that actually drives assembly timing.'],
  ['02','Model uncertainty as a distribution','Individual return dates were not reliably predictable because much of the external processing queue was unobserved. The model therefore used conditional empirical return-time distributions instead of forcing a point forecast.'],
  ['03','Price early and late completion differently','A newsvendor-style critical ratio used the relative value of the stator and rotor to select the target return-time quantile, explicitly pricing which component would sit idle.'],
  ['04','Respect plant and mould constraints','Ideal release dates were converted into feasible production dates. When capacity conflicted, the scheduler evaluated the pump-specific cost of moving earlier versus later instead of applying one fixed displacement rule.'],
  ['05','Replay history point-in-time','Validation reconstructed only the information that would have been known on each historical snapshot date, preventing future outcomes from leaking into earlier scheduling decisions.'],
]

const scheduleRows = [
  ['Fri','DS00134','Moved earlier','Mould capacity'],
  ['Mon','DS00137','Moved earlier','Rush + capacity'],
  ['Tue','DS00141','On ideal day','—'],
  ['Wed','DS00143','Moved earlier','Mould capacity'],
  ['Fri','DS00108','On ideal day','—'],
]

export default function CapstoneProject() {
  return (
    <>
      <section className="capstone-hero">
        <div className="capstone-hero-top">
          <Link className="back-link" to="/work">← Selected work</Link>
          <span className="case-status">Industry capstone · synthetic public demo</span>
        </div>
        <p className="kicker">Decision Systems · Operations · 2026</p>
        <h1>Production Scheduling & Working-Capital Optimization</h1>
        <p className="capstone-deck">A production-synchronization system for Lifting Solutions that combines an operational dashboard, uncertainty-aware release logic, capacity-aware scheduling, and manager-readable daily output.</p>
        <div className="capstone-role"><span>My role</span><strong>Designed 100% of the scheduling algorithm and its application · contributed ~60% of dashboard design</strong></div>
      </section>

      <section className="impact-band">
        <div className="impact-main"><span>Historical replay</span><strong>More than half</strong><p>lower simulated cost-weighted idle inventory versus the manual baseline</p></div>
        <div className="impact-secondary">
          <article><span>Physical WIP</span><strong>↓</strong><p>Inventory quantity fell alongside value, rather than being hidden by a cheaper mix.</p></article>
          <article><span>Plant capacity</span><strong>Not the main lever</strong><p>Extra aggregate capacity delivered only marginal additional improvement.</p></article>
        </div>
        <p className="impact-footnote">Exact client-derived performance figures are intentionally rounded. Public demonstrations use independently generated synthetic data.</p>
      </section>

      <section className="section capstone-problem-section">
        <div className="section-heading wide-heading">
          <div><p className="section-number">01 / Reframe the problem</p><h2>Two components. Two lead times. One shipment.</h2></div>
          <p>A stator can be built in days. Its matching rotor spends much longer in external chrome processing. The pump cannot move forward until both are ready. Manual scheduling therefore created idle working capital when the two streams drifted apart.</p>
        </div>
        <div className="flow-compare">
          <article><span className="flow-tag">Stator</span><strong>Built internally</strong><p>Shorter, more controllable lead time</p></article>
          <div className="flow-connector">+</div>
          <article><span className="flow-tag">Rotor</span><strong>External chrome processing</strong><p>Longer, partially unobserved turnaround</p></article>
          <div className="flow-connector">→</div>
          <article className="flow-outcome"><span className="flow-tag">Assembly</span><strong>Both must be ready</strong><p>Synchronization, not raw throughput, determines idle WIP</p></article>
        </div>
        <blockquote className="capstone-quote"><span>What changed</span><p>More capacity was not the answer. Better timing was.</p></blockquote>
      </section>

      <section className="section capstone-method-section">
        <div className="section-heading wide-heading">
          <div><p className="section-number">02 / Decision logic</p><h2>Turn uncertainty into a release rule.</h2></div>
          <p>The model deliberately stays interpretable. Every production date can be traced to a trigger, a return-time distribution, a cost trade-off, and the capacity rule that made the final plan feasible.</p>
        </div>
        <div className="method-steps">{methodSteps.map(([n,title,text]) => <article key={n}><span>{n}</span><div><h3>{title}</h3><p>{text}</p></div></article>)}</div>
      </section>

      <section className="section demo-section">
        <div className="section-heading wide-heading">
          <div><p className="section-number">03 / Operational visibility</p><h2>Diagnose the system before scheduling it.</h2></div>
          <p>The production dashboard reconstructs point-in-time WIP, lead-time distributions, working-capital exposure, and regional drill-downs. This public preview is rebuilt from synthetic data rather than client operational records.</p>
        </div>
        <div className="browser-demo">
          <div className="browser-bar"><span></span><span></span><span></span><p>LSI PCP — WIP dashboard · synthetic portfolio demo</p></div>
          <div className="dashboard-demo">
            <div className="dashboard-kpis">
              <article><span>Stator in production</span><strong>21</strong><small>synthetic snapshot</small></article>
              <article><span>Stator waiting for rotor</span><strong>53</strong><small>synthetic snapshot</small></article>
              <article><span>Pump waiting for test</span><strong>1</strong><small>synthetic snapshot</small></article>
              <article className="pending-card"><span>Pending total</span><strong>75</strong><small>synthetic snapshot</small></article>
            </div>
            <div className="dashboard-panel">
              <div className="dashboard-panel-head"><div><span>Typical days per process step</span><strong>All pumps</strong></div><small>synthetic demo</small></div>
              <div className="process-cards">
                <article><strong>4 d</strong><span>Stator build</span></article>
                <article><strong>12 d</strong><span>Rotor build → chrome</span></article>
                <article><strong>1 d</strong><span>Rotor wait to be sent</span></article>
                <article className="redacted-process"><strong>13 d</strong><span>External chrome lead time</span></article>
                <article><strong>4 d</strong><span>Test wait</span></article>
              </div>
            </div>
            <div className="dashboard-lower-grid">
              <div className="dashboard-panel"><div className="dashboard-panel-head"><div><span>Pending WIP by region</span><strong>Drill-down view</strong></div></div><div className="bar-chart-demo"><div className="bar-group"><div className="bar b1"></div><div className="bar b2"></div><label>Region A</label></div><div className="bar-group"><div className="bar b3"></div><div className="bar b4"></div><label>Region B</label></div></div></div>
              <div className="dashboard-panel"><div className="dashboard-panel-head"><div><span>WIP value</span><strong>Last 60 days</strong></div></div><div className="line-chart-demo"><i></i><i></i></div></div>
            </div>
          </div>
          <div className="demo-disclaimer">SYNTHETIC DATA · location-specific label redacted in recorded demo · no client operational data shown</div>
        </div>
      </section>

      <section className="section planner-section">
        <div className="section-heading wide-heading">
          <div><p className="section-number">04 / From model to action</p><h2>The output is a daily production plan—not a probability.</h2></div>
          <p>The public planner mirrors the synthetic Excel output: the schedule answers “what to build,” the audit trail explains “why this date,” and non-standard re-chrome cases are deliberately routed back to human judgement.</p>
        </div>
        <div className="planner-summary-grid">
          <article><span>Schedule</span><strong>What should production build?</strong><p>Daily stator plan after aggregate and mould-level capacity constraints.</p></article>
          <article><span>Detail</span><strong>Why was this order moved?</strong><p>Return-time quantile, predicted return, ideal date, final date, and capacity reason.</p></article>
          <article><span>Exceptions</span><strong>What should remain manual?</strong><p>Non-standard re-chrome cases are isolated instead of being forced through automation.</p></article>
        </div>
        <div className="schedule-viewer">
          <div className="schedule-viewer-head"><div><span>Synthetic schedule preview</span><h3>Daily build plan</h3></div><span className="synthetic-pill">demo capacity · synthetic IDs</span></div>
          <div className="schedule-table-wrap"><table className="schedule-table"><thead><tr><th>Build day</th><th>Demo stator</th><th>Decision</th><th>Reason</th></tr></thead><tbody>{scheduleRows.map((row) => <tr key={row.join('-')}>{row.map((cell) => <td key={cell}>{cell}</td>)}</tr>)}</tbody></table></div>
        </div>
        <div className="decision-audit-grid">
          <article><p className="eyebrow">Decision detail</p><h3>Why did DS00134 move?</h3><dl><div><dt>Sent for chrome</dt><dd>Jul 21</dd></div><div><dt>Return-time quantile</dt><dd>10 days</dd></div><div><dt>Predicted return</dt><dd>Jul 31</dd></div><div><dt>Final build day</dt><dd>Jul 24</dd></div><div><dt>Status</dt><dd>Moved · mould cap</dd></div></dl></article>
          <article className="exception-card"><p className="eyebrow">Manual exception</p><h3>Re-chrome stays outside automation.</h3><p>A synthetic re-chrome order is flagged into a separate queue rather than being forced through the standard release rule. The model preserves a human escalation path for cases whose history no longer represents normal flow.</p></article>
        </div>
      </section>

      <section className="section ownership-section">
        <div className="section-heading wide-heading"><div><p className="section-number">05 / What I owned</p><h2>Method, application, and most of the decision experience.</h2></div><p>The technical contribution was not limited to an analysis notebook. I designed the scheduling theory, translated it into operating rules, guided application, and built most of the dashboard experience used to inspect the system.</p></div>
        <div className="ownership-grid"><article><span>100%</span><h3>Scheduling algorithm</h3><p>Trigger logic, uncertainty model, cost-weighted release target, capacity handling, replay design.</p></article><article><span>100%</span><h3>Algorithm application</h3><p>Operational translation into a repeatable daily planning workflow and auditable scheduling output.</p></article><article><span>~60%</span><h3>Dashboard design</h3><p>WIP framing, interaction logic, decision views, and presentation of the operational diagnostic.</p></article></div>
      </section>

      <section className="section closing-insight">
        <p className="section-number">Key takeaway</p>
        <h2>The biggest gain did not come from producing faster. It came from synchronizing two production streams and turning uncertainty into a cost-aware release rule.</h2>
        <div className="publication-note capstone-note">This case study uses public business context, intentionally rounded client-derived outcomes, and independently generated synthetic demo data. Raw client data, internal identifiers, exact costs, and confidential operating parameters are not published.</div>
        <div className="project-actions"><Link className="button secondary" to="/work">Back to all work</Link></div>
      </section>
    </>
  )
}
