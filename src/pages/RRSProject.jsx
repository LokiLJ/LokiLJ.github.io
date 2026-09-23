import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { mediaPublicUrl, supabase } from '../lib/supabase'

const modelRows = [
  { model: 'M1', label: 'Mean demand', regret: 12.74, sd: 6.22 },
  { model: 'M2', label: 'Stochastic SAA', regret: 10.94, sd: 2.93 },
  { model: 'M3', label: 'Context weighted', regret: 8.51, sd: 5.33 },
  { model: 'M4', label: 'Risk aware', regret: 8.88, sd: 4.01 },
]

function TrafficFigure() {
  return (
    <figure className="rrs-figure traffic-figure">
      <figcaption><span>Report result · redrawn</span><strong>A small share of arcs carried most of the traffic.</strong></figcaption>
      <div className="traffic-bars">
        <div className="traffic-bar"><span>Top arcs</span><div><i style={{width:'7%'}}></i></div><b>7% of arcs</b></div>
        <div className="traffic-bar"><span>Traffic</span><div><i style={{width:'80%'}}></i></div><b>80% of flow</b></div>
      </div>
      <p>The network was highly concentrated, so getting node roles and relay structure wrong would distort nearly every downstream capacity decision.</p>
    </figure>
  )
}

function RouteFigure() {
  return (
    <figure className="rrs-figure route-figure">
      <figcaption><span>Report result · redrawn</span><strong>The order table and the physical movement log told different stories.</strong></figcaption>
      <div className="route-story">
        <div>
          <small>Order record</small>
          <div className="route-line"><b>081</b><i>→</i><b>089</b></div>
          <p>It looks like one direct lane.</p>
        </div>
        <strong className="route-not-equal">≠</strong>
        <div className="route-actual">
          <small>Movement log</small>
          <div className="route-line"><b>081</b><i>→</i><b>082</b><i>→</i><b>089</b></div>
          <p>The freight actually moved through a relay.</p>
        </div>
      </div>
    </figure>
  )
}

function PathMixFigure() {
  return (
    <figure className="rrs-figure path-mix-figure">
      <figcaption><span>Report figure · redrawn</span><strong>Reconstructed paths showed a mostly direct network—with meaningful relay traffic.</strong></figcaption>
      <div className="path-mix-meta"><strong>~1.9M</strong><span>order paths reconstructed from timestamped movement records</span></div>
      <div className="path-mix-bar" aria-label="About 90 percent direct and 10 percent transshipment among inter-center shipments">
        <i className="path-direct" style={{width:'90%'}}><span>~90% direct</span></i>
        <i className="path-relay" style={{width:'10%'}}><span>~10%</span></i>
      </div>
      <p>That was enough transshipment to matter operationally, but not enough to justify treating every theoretical lane as feasible.</p>
    </figure>
  )
}

function ContextWeightFigure() {
  return (
    <figure className="rrs-figure context-weight-figure">
      <figcaption><span>Report figure · redrawn</span><strong>Context weighting changed which historical demand scenarios mattered.</strong></figcaption>
      <div className="context-weight-grid">
        <div>
          <small>M2 · SAA</small>
          <strong>Every historical day counts equally</strong>
          <div className="scenario-dots uniform">{Array.from({length:10}).map((_,i)=><i key={i}></i>)}</div>
        </div>
        <div>
          <small>M3 · kNN context</small>
          <strong>Similar operating days receive more weight</strong>
          <div className="scenario-dots weighted">{[1,1,2,4,5,4,2,1,1,1].map((w,i)=><i key={i} style={{transform:`scale(${0.65+w*0.12})`,opacity:0.35+w*0.11}}></i>)}</div>
        </div>
      </div>
      <p>The report's weighted-demand figure showed the same idea: context narrows attention toward scenarios that better resemble current conditions.</p>
    </figure>
  )
}

function RegretFigure() {
  const max = 13
  return (
    <figure className="rrs-figure regret-figure">
      <figcaption><span>Report result · redrawn</span><strong>Decision quality improved as uncertainty and context entered the model.</strong></figcaption>
      <div className="regret-chart">
        {modelRows.map((row) => (
          <div className="regret-chart-row" key={row.model}>
            <div className="regret-name"><b>{row.model}</b><span>{row.label}</span></div>
            <div className="regret-track"><i style={{width:(row.regret/max*100)+'%'}}></i></div>
            <strong>{row.regret.toFixed(2)}M</strong>
          </div>
        ))}
      </div>
      <p>Lower is better. M3 produced the lowest average regret among practical models, but its larger standard deviation made the next question unavoidable: how much mean performance should be traded for tail stability?</p>
    </figure>
  )
}

function RiskFigure() {
  return (
    <figure className="rrs-figure risk-figure">
      <figcaption><span>Report result · redrawn</span><strong>The best average model was not the calmest one.</strong></figcaption>
      <div className="risk-points">
        {modelRows.slice(1).map((row) => (
          <div className="risk-point-row" key={row.model}>
            <span>{row.model}</span>
            <div className="risk-axis"><i style={{left:(row.sd/6.5*100)+'%'}}></i></div>
            <b>{row.sd.toFixed(2)}M SD</b>
          </div>
        ))}
      </div>
      <p>Context improved the mean result, while the risk-aware model accepted a small average-regret premium for lower volatility.</p>
    </figure>
  )
}

function EvidenceImage({ asset, title, alt, built, matters, fallback }) {
  if (!asset?.media_path) return fallback || null
  return (
    <figure className="rrs-figure rrs-original-figure">
      <figcaption><span>Original analysis output</span><strong>{title}</strong></figcaption>
      <img src={mediaPublicUrl(asset.media_path)} alt={alt} />
      <div className="figure-method-note">
        <p><b>How I built it</b>{built}</p>
        <p><b>Why it mattered</b>{matters}</p>
      </div>
    </figure>
  )
}

function ModelComparisonTable() {
  const rows = [
    ['Avg Cost','64.36M','62.56M','60.13M','60.50M'],
    ['Avg Regret','12.74M','10.94M','8.51M','8.88M'],
    ['Std Regret','6.22M','2.93M','5.33M','4.01M'],
    ['Max Regret','24.54M','19.20M','32.48M','24.32M'],
    ['RDE','0.247','0.212','0.165','0.172'],
    ['RPG vs M2','−16.5%','—','+22.2%','+18.8%'],
  ]
  return (
    <figure className="rrs-figure report-table-figure">
      <figcaption><span>Report result · table</span><strong>M3 won on average. The tail told a different story.</strong></figcaption>
      <div className="report-table-wrap">
        <table>
          <thead><tr><th>Metric</th><th>M1<br/><small>Baseline</small></th><th>M2<br/><small>SAA</small></th><th>M3<br/><small>PP + kNN</small></th><th>M4<br/><small>VaR</small></th></tr></thead>
          <tbody>{rows.map((row)=><tr key={row[0]}>{row.map((cell,i)=><td key={cell} className={i===3 ? 'm3-cell' : ''}>{cell}</td>)}</tr>)}</tbody>
        </table>
      </div>
      <div className="figure-method-note">
        <p><b>How I built it</b>Out-of-sample decisions were evaluated against a perfect-foresight lower bound, then summarized by average, standard-deviation, and maximum regret.</p>
        <p><b>Why it mattered</b>M3 achieved the lowest average regret, but its larger tail exposure motivated the M4 risk-control extension.</p>
      </div>
    </figure>
  )
}

export default function RRSProject() {
  const [assets, setAssets] = useState({})

  useEffect(() => {
    if (!supabase) return
    let active = true
    supabase.from('project_assets').select('asset_key,media_path,caption').eq('project_id','logistics-network').eq('published',true).then(({ data }) => {
      if (!active || !data) return
      setAssets(Object.fromEntries(data.map((item) => [item.asset_key, item])))
    })
    return () => { active = false }
  }, [])

  return (
    <>
      <article className="rrs-editorial">
        <header className="rrs-editorial-hero">
          <div className="special-hero-nav"><Link className="back-link" to="/work">← Selected work</Link><span>Decision Systems · 2026</span></div>
          <p className="kicker">14.7M order records · ~20 GB raw data · Network optimization</p>
          <h1>Data-driven network decisions under uncertainty.</h1>
          <p className="rrs-standfirst">A large logistics dataset became a two-stage planning problem: before tomorrow's demand is known, how much outbound capacity should the network reserve today?</p>
          <div className="rrs-byline">Model-design lead · Developed the modelling theory and directed implementation.</div>
        </header>

        <section className="rrs-brief">
          <div>
            <p className="eyebrow">The setting</p>
            <p>RRS operates a distribution network serving manufacturers, retailers, logistics platforms, and ultimately end customers. Headquarters decides how freight should move between distribution centers while balancing cost and service requirements.</p>
          </div>
          <div>
            <p className="eyebrow">What we received</p>
            <p>Historical orders, timestamped delivery-movement records, appointment information, and SKU-level product attributes. Together, the data described order demand, product weight and volume, and how freight appeared to move through the network.</p>
          </div>
          <div>
            <p className="eyebrow">The decision</p>
            <p>Our planning focus was the subnetwork centered on Hub 081. Capacity had to be reserved before demand was known; after demand appeared, the system could use direct service, transshipment, emergency transport, or controlled stockouts. This made the project a two-stage decision problem, not just a forecasting exercise.</p>
          </div>
          <p className="rrs-bridge">The filtered order table alone contained roughly 14.7 million records. That sounded like enough information to start optimizing. Instead, the first question became more basic: <strong>what did these records actually say the network was?</strong></p>
        </section>

        <section className="rrs-story-section">
          <div className="rrs-prose">
            <p className="rrs-dropcap">Before any stochastic model was built, more than half of the order records had to be removed because origin and destination were the same. The remaining cross-hub traffic was highly concentrated: a small share of arcs carried most of the flow.</p>
            <p>That concentration made network reconstruction consequential. A mistaken hub role or a false direct connection would not be a cosmetic data-cleaning issue; it would change where the optimization model believed capacity was needed.</p>
          </div>
          <EvidenceImage
            asset={assets.network_outbound}
            title="Top outbound OD flows from Hub 081"
            alt="Original horizontal bar chart of outbound origin-destination flows from Hub 081"
            built="Filtered to inter-center orders, aggregated order counts by origin-destination pair, and ranked the outbound destinations of Hub 081."
            matters="The concentration of flow showed that a small number of destination relationships dominate tactical capacity decisions."
            fallback={<TrafficFigure />}
          />
        </section>

        <section className="rrs-story-section alternate">
          <div className="rrs-prose">
            <p>Then came a more important contradiction. The order table described where an order was assigned. The movement log described where freight physically travelled. Those are not the same thing.</p>
            <p>An order could appear to move directly from node 081 to node 089, while timestamped movement records showed an intermediate relay through node 082. The transactional network was therefore a fulfilment network, not necessarily a physical one.</p>
          </div>
          <div className="rrs-figure-stack">
            <RouteFigure />
            <EvidenceImage
              asset={assets.path_reconstruction}
              title="Actual delivery paths: direct vs relay"
              alt="Original stacked horizontal bar chart comparing direct and relay delivery paths by destination"
              built="Reconstructed approximately 1.9 million timestamped delivery paths, then classified each destination's shipments as direct from CDC 081 or routed through an RDC."
              matters="The chart exposed destinations such as 089 with effectively zero direct flow, preventing unsupported direct arcs from entering the optimization model."
              fallback={<PathMixFigure />}
            />
          </div>
          <div className="rrs-turn"><span>First turn</span><strong>Before optimizing the network, we had to reconstruct the network.</strong></div>
        </section>

        <section className="rrs-story-section">
          <div className="rrs-prose">
            <p>The data kept producing results that looked interesting and were actually warnings. Apparent reverse flows turned out to include system events that did not correspond to physical freight movement. Early hub-role classifications based on flow patterns also had to be corrected once structural evidence was considered.</p>
            <p>That changed how we treated the dataset. We stopped assuming every operational code was a physical event and stopped treating every visually obvious pattern as a valid network rule.</p>
          </div>
          <aside className="rrs-margin-note">
            <span>Data lesson</span>
            <p>Operational data often records the logic of a system, not a literal map of reality. The semantic layer had to be reconstructed before the mathematical layer could be trusted.</p>
          </aside>
        </section>

        <section className="rrs-story-section rrs-zero-section">
          <div className="rrs-prose">
            <p>When the first optimization runs eventually returned <strong>zero regret</strong>, the result was tempting. A perfect decision model would be an excellent outcome.</p>
            <p>But zero regret was too good to be credible. It became the clearest debugging signal in the project.</p>
          </div>
          <div className="zero-regret-visual">
            <strong>0</strong><span>regret</span>
            <p>Not a victory. A model specification problem.</p>
          </div>
          <div className="rrs-debug-story">
            <p>The economics were allowing capacity constraints to disappear. Recourse could become too cheap; remote spokes could be cheaper to leave short than to serve; independent capacity budgets could turn one network problem into a collection of unrelated newsvendor problems.</p>
            <p>The fix was not another algorithm. It was to rebuild the economic logic: shared first-stage capacity, meaningful shortage penalties, and a risk formulation that could not become vacuous.</p>
          </div>
          <div className="rrs-turn"><span>Second turn</span><strong>A solver can be perfectly happy with a model that makes no operational sense.</strong></div>
        </section>

        <section className="rrs-story-section alternate">
          <div className="rrs-prose">
            <p>Only after the network and economics were coherent did model comparison become useful. We deliberately built a ladder rather than jumping to the most complex formulation.</p>
            <p>Mean-demand planning provided a deterministic baseline. Sample-average approximation added uncertainty. Context weighting asked whether similar operating conditions improved the decision. A risk-aware extension then asked whether some average performance should be sacrificed to reduce volatility.</p>
          </div>
          <div className="rrs-figure-stack">
            <EvidenceImage
              asset={assets.context_weighting}
              title="Weighted demand distribution P(Y | X=x)"
              alt="Original histogram comparing uniform and k-nearest-neighbour weighted demand distributions"
              built="Treated historical days as empirical demand scenarios; M2 used equal weights while M3 used standardized context features with k-nearest neighbours to reweight similar operating days."
              matters="The shift toward a conditional demand distribution explains why context improved average decision quality—and why local weighting could increase sensitivity to unusual outcomes."
              fallback={<ContextWeightFigure />}
            />
            <RegretFigure />
            <ModelComparisonTable />
          </div>
        </section>

        <section className="rrs-story-section">
          <div className="rrs-prose">
            <p>The contextual model produced the lowest average regret. That sounds like the end of the story, but it created another trade-off: its outcomes were more volatile.</p>
            <p>The risk-aware version gave up a small amount of average performance and reduced that volatility. In other words, better context improved the typical decision, but concentrating too heavily on local scenarios could also make the plan more brittle.</p>
          </div>
          <div className="rrs-figure-stack">
            <RiskFigure />
            <EvidenceImage
              asset={assets.arc_capacity}
              title="Activated arc capacities by model"
              alt="Original model output comparing reserved capacity on an activated network arc"
              built="Extracted first-stage reserved-capacity decisions from each benchmark model and compared how the policy changed as uncertainty, context, and risk control were added."
              matters="It translates abstract regret differences back into the operational quantity the planner actually controls: reserved capacity."
            />
          </div>
          <div className="rrs-turn"><span>Final turn</span><strong>Better prediction did not automatically mean safer decisions.</strong></div>
        </section>

        <section className="rrs-editorial-ending">
          <p className="eyebrow">What I took from the project</p>
          <h2>A mathematically solvable model is not enough. The data semantics, network structure, and economics all have to describe the same reality.</h2>
          <p>The eventual stochastic program mattered, but the more transferable lesson was diagnostic: suspiciously elegant results deserve investigation, and optimization is only as useful as the world it has been told to represent.</p>
          <Link className="button secondary" to="/work">Back to all work</Link>
        </section>
      </article>
    </>
  )
}
