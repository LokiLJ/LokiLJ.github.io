import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { mediaPublicUrl, supabase } from '../lib/supabase'

const staffing = [
  ['CCRN','65.5','67.3','+1.8'],
  ['Ward RN','76.7','80.2','+3.5'],
  ['RPN','49.4','38.8','−10.5'],
]

function EvidenceImage({ asset, title, alt, fallback }) {
  if (!asset?.media_path) return fallback || null
  return (
    <figure className="nurse-evidence">
      <figcaption><span>Original analysis output</span><strong>{title}</strong></figcaption>
      <img src={mediaPublicUrl(asset.media_path)} alt={alt} />
    </figure>
  )
}

function DemandFallback() {
  return (
    <div className="nurse-demand-fallback">
      <div><span>CCRN</span><i style={{width:'82%'}}></i></div>
      <div><span>Ward RN</span><i style={{width:'100%'}}></i></div>
      <div><span>RPN</span><i style={{width:'73%'}}></i></div>
      <p>Three demand series, three different seasonal and residual structures.</p>
    </div>
  )
}

function ScenarioFallback() {
  return (
    <div className="nurse-corr-fallback">
      <article><span>Raw first-difference correlation</span><strong>−0.209</strong><p>Used to preserve cross-tier dependence.</p></article>
      <i>→</i>
      <article><span>Residual correlation</span><strong>+0.283</strong><p>Rejected because seasonal controls flipped the sign.</p></article>
    </div>
  )
}

export default function NurseProject() {
  const [assets,setAssets]=useState({})

  useEffect(()=>{
    if(!supabase) return
    let active=true
    supabase.from('project_assets').select('asset_key,media_path,caption').eq('project_id','nurse-staffing').eq('published',true).then(({data})=>{
      if(active && data) setAssets(Object.fromEntries(data.map(item=>[item.asset_key,item])))
    })
    return()=>{active=false}
  },[])

  return (
    <article className="nurse-editorial">
      <header className="project-special-hero nurse-hero">
        <div className="special-hero-nav"><Link className="back-link" to="/work">← Selected work</Link><span>Healthcare · 2026</span></div>
        <p className="kicker">89 months of demand · Forecasting → staffing optimization</p>
        <h1>The forecast was only the first half of the staffing decision.</h1>
        <p className="special-deck">A hospital resource team had to decide annual staffing levels across three nursing tiers before monthly demand was known. At first this looked like a forecasting problem. The larger value came from modelling how skills could substitute across tiers once uncertainty arrived.</p>
        <div className="project-role">Team project · Led most of the technical modelling, scenario generation, and optimization work.</div>
      </header>

      <section className="nurse-context-grid">
        <div><p className="eyebrow">The setting</p><p>An Interprofessional Resource Team supplies CCRN, Ward RN, and RPN staff across a hospital system. Hiring too many full-time staff creates idle cost; hiring too few pushes the system into overtime and agency staffing.</p></div>
        <div><p className="eyebrow">What we had</p><p>89 months of tier-level shift requests, cost assumptions, and a skill hierarchy in which higher-qualified nurses can cover lower-tier work but not the reverse.</p></div>
        <div><p className="eyebrow">The decision</p><p>Choose annual FTE levels before demand is realized, then absorb monthly shocks through substitution, overtime, agency labour, or shortage.</p></div>
      </section>

      <section className="nurse-story-section">
        <div className="nurse-prose">
          <p className="nurse-dropcap">The first temptation was to treat the three staffing series as versions of the same forecasting problem. They were not.</p>
          <p>COVID-era volatility was two to three times larger than the post-COVID regime, so the full history was not structurally representative. After isolating the later regime, CCRN still showed residual autocorrelation, Ward RN did not, and RPN carried the strongest seasonal complexity.</p>
        </div>
        <EvidenceImage asset={assets.demand_history} title="Tier demand history and structural break" alt="Original staffing analysis showing monthly demand by nurse tier" fallback={<DemandFallback />} />
        <div className="nurse-turn"><span>First turn</span><strong>One pooled forecast would have erased differences that mattered to the staffing buffer.</strong></div>
      </section>

      <section className="nurse-story-section alternate">
        <div className="nurse-prose">
          <p>We therefore built tier-specific models. Test MAPE landed at 6.60% for CCRN, 8.77% for Ward RN, and 11.11% for RPN. The more important modelling detail, however, was not the ranking of those errors.</p>
          <p>CCRN required an AR(1) correction after a Breusch–Godfrey test detected lag-1 autocorrelation; the correction reduced residual sigma by about 11%. Ward RN needed no such correction. Adding extra Fourier terms for RPN did not help because the post-COVID sample was too small to support more seasonal parameters.</p>
        </div>
        <div className="forecast-cards nurse-forecast-compact">
          <article><span>CCRN</span><strong>6.60% MAPE</strong><p>OLS + AR(1) · residual sigma 35.4 → 31.5</p></article>
          <article><span>Ward RN</span><strong>8.77% MAPE</strong><p>OLS · residuals behaved independently</p></article>
          <article><span>RPN</span><strong>11.11% MAPE</strong><p>Strong seasonality · extra Fourier terms added no value</p></article>
        </div>
      </section>

      <section className="nurse-story-section">
        <div className="nurse-prose">
          <p>The next problem was dependence. CCRN and Ward RN demand were negatively related in the raw first differences: when critical-care demand rose, ward demand often moved the other way.</p>
          <p>But after seasonal residualization, that sign flipped from −0.209 to +0.283. If we had used residual correlation mechanically, the Monte Carlo engine would have invented positive co-movement and overstated joint tail risk.</p>
        </div>
        <EvidenceImage asset={assets.correlation_diagnostics} title="Cross-tier dependence diagnostics" alt="Original analysis comparing raw and residual nurse-tier correlations" fallback={<ScenarioFallback />} />
        <div className="nurse-turn"><span>Second turn</span><strong>A cleaner statistical residual was not the more faithful operational signal.</strong></div>
      </section>

      <section className="nurse-story-section alternate">
        <div className="nurse-prose">
          <p>With tier-specific volatility and the raw dependence structure, we generated 1,000 correlated demand scenarios. Only then did the planning question become fully visible.</p>
          <p>A closed-form newsvendor benchmark treats each tier independently. The LP could do something the benchmark could not: move higher-skilled surplus downward. CCRN could cover Ward RN or RPN demand, and Ward RN could cover RPN.</p>
        </div>
        <div className="staffing-table">
          <div className="staffing-head"><span>Tier</span><span>Independent newsvendor</span><span>Cross-tier LP</span><span>Difference</span></div>
          {staffing.map((r)=><div className="staffing-row" key={r[0]}>{r.map((cell,i)=><span key={cell} className={i===2?'lp-cell':''}>{cell}{i>0 && i<3 ? ' FTE' : ''}</span>)}</div>)}
        </div>
        <div className="nurse-turn"><span>Third turn</span><strong>The optimal mix changed because skills can substitute—not because the forecast suddenly became more accurate.</strong></div>
      </section>

      <section className="nurse-story-section">
        <div className="nurse-prose">
          <p>The economic effect was material. The joint LP reduced projected deterministic annual cost by $100,377 versus the independent newsvendor benchmark, and by $98,882 on average across the 1,000 scenarios. The biggest staffing shift was RPN: 49.4 FTE independently versus 38.8 under the substitution-aware LP.</p>
          <p>That result reframed the value story. Additional forecast complexity could only trim a small part of total cost. The architecture of the decision—who can cover whom—was the larger lever.</p>
        </div>
        <EvidenceImage asset={assets.lp_vs_newsvendor} title="LP versus independent newsvendor" alt="Original project comparison of staffing plans and annual costs" fallback={
          <div className="nurse-impact-compact">
            <article><span>Deterministic annual saving</span><strong>$100,377</strong></article>
            <article><span>Scenario mean saving</span><strong>$98,882</strong></article>
            <article><span>RPN shift</span><strong>−10.5 FTE</strong></article>
          </div>
        } />
      </section>

      <section className="nurse-story-section alternate">
        <div className="nurse-prose">
          <p>A staffing plan also needs a rule for when it stops being trustworthy. In the base case, the gap versus an ex-post optimum was 3.15%; under combined cost stress it rose to 5.18%. Ward RN demand acceleration was the clearest operational risk signal.</p>
          <p>So the deliverable ended with monitoring triggers rather than a static “optimal” number: watch demand drift, utilization, and the overtime/agency mix; re-run the LP when those signals persistently cross threshold.</p>
        </div>
        <EvidenceImage asset={assets.monitoring_framework} title="Monitoring triggers and response owners" alt="Original project monitoring framework for staffing re-optimization" fallback={
          <div className="monitor-flow">
            <article><span>Signal</span><strong>Demand drift</strong></article><i>→</i>
            <article><span>Trigger</span><strong>Persistent breach</strong></article><i>→</i>
            <article><span>Response</span><strong>Re-run LP</strong></article><i>→</i>
            <article><span>Owner</span><strong>Named team</strong></article>
          </div>
        } />
      </section>

      <section className="nurse-editorial-ending">
        <p className="eyebrow">What the project changed</p>
        <h2>Better staffing came from modelling substitution under uncertainty—not treating forecast accuracy as the final objective.</h2>
        <p>The forecasting work mattered because it built realistic scenarios. The larger decision value came from preserving the right dependence structure, representing the skill hierarchy, and turning the final plan into something the operating team could monitor and revisit.</p>
        <div className="publication-note">Methodology and derived findings are summarized. Licensed teaching-case exhibits and source data are not reproduced.</div>
        <div className="project-actions"><Link className="button secondary" to="/work">Back to all work</Link></div>
      </section>
    </article>
  )
}
