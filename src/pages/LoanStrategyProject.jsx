import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { mediaPublicUrl, supabase } from '../lib/supabase'

const adjustedRows = [
  ['Rent vs Own','+20.9 pp IPW','Nearest-neighbour matching gave a similar +22.0 pp ATT'],
  ['Lower vs higher credit quality','counterintuitive direction','Within the no-default subsample, the lower-credit group retained higher weighted approval'],
  ['Male vs Female','≈ 0 adjusted gap','The estimated approval difference approached zero after adjustment'],
]

const dtiRows = [
  { decile:'D1', approval:10.0826, interest:10.6009, credit:634.3012 },
  { decile:'D2', approval:11.7927, interest:10.5286, credit:632.9547 },
  { decile:'D3', approval:12.9193, interest:10.6062, credit:632.9477 },
  { decile:'D4', approval:12.2986, interest:10.7450, credit:631.7530 },
  { decile:'D5', approval:13.9689, interest:10.8258, credit:633.6182 },
  { decile:'D6', approval:17.6744, interest:11.0458, credit:632.5752 },
  { decile:'D7', approval:18.6905, interest:11.1762, credit:632.0791 },
  { decile:'D8', approval:21.4030, interest:11.3893, credit:632.0685 },
  { decile:'D9', approval:37.5458, interest:11.6716, credit:631.9723 },
  { decile:'D10', approval:70.8618, interest:11.6235, credit:631.5470 },
]

function EvidenceFigure({ asset, title, alt, built, matters, fallback }) {
  if (!asset?.media_path) return fallback || null
  return (
    <figure className="loan-evidence-figure">
      <figcaption><span>Original analysis output</span><strong>{title}</strong></figcaption>
      <img src={mediaPublicUrl(asset.media_path)} alt={alt} />
      <div className="figure-method-note">
        <p><b>How I built it</b>{built}</p>
        <p><b>Why it mattered</b>{matters}</p>
      </div>
    </figure>
  )
}

function CorrelationFallback() {
  return (
    <div className="loan-corr-fallback">
      <span>credit score ↔ approval</span>
      <strong>−0.01</strong>
      <p>Almost no linear relationship.</p>
    </div>
  )
}

function CreditScoreFallback() {
  const vals=[21.2,22.6,22.4,21.8,21.4]
  return (
    <div className="score-fallback">
      <div className="score-axis"><span>Very poor</span><span>Poor</span><span>Fair</span><span>Good</span><span>Very good</span></div>
      <div className="score-line">{vals.map((v,i)=><i key={i} style={{height:(v-20)*40+20}}><b>{v.toFixed(1)}%</b></i>)}</div>
      <p>Approval did not rise monotonically with score.</p>
    </div>
  )
}

function Sparkline({ values, min, max, suffix='' }) {
  const pts = values.map((v,i) => {
    const x = 8 + i * (84 / (values.length - 1))
    const y = 86 - ((v - min) / (max - min || 1)) * 68
    return x + ',' + y
  }).join(' ')
  return (
    <svg className="loan-sparkline" viewBox="0 0 100 100" role="img" aria-label={values.map(v=>v.toFixed(1)+suffix).join(', ')}>
      <line x1="8" y1="86" x2="92" y2="86" />
      <polyline points={pts} />
      {values.map((v,i)=>{
        const x = 8 + i * (84 / (values.length - 1))
        const y = 86 - ((v - min) / (max - min || 1)) * 68
        return <circle key={i} cx={x} cy={y} r="1.7" />
      })}
    </svg>
  )
}

function DtiFallback() {
  const approval=dtiRows.map(d=>d.approval)
  const interest=dtiRows.map(d=>d.interest)
  const credit=dtiRows.map(d=>d.credit)
  return (
    <figure className="loan-story-figure dti-evidence">
      <figcaption><span>Notebook result · redrawn</span><strong>Approval and pricing climbed with DTI while average credit score barely moved.</strong></figcaption>
      <div className="dti-small-multiples">
        <article>
          <span>Approval rate</span>
          <strong>10.1% → 70.9%</strong>
          <Sparkline values={approval} min={8} max={74} suffix="%" />
        </article>
        <article>
          <span>Average interest</span>
          <strong>10.6% → 11.6%</strong>
          <Sparkline values={interest} min={10.4} max={11.8} suffix="%" />
        </article>
        <article>
          <span>Average credit score</span>
          <strong>634 → 632</strong>
          <Sparkline values={credit} min={630.5} max={635} />
        </article>
      </div>
      <div className="dti-decile-labels">{dtiRows.map(d=><span key={d.decile}>{d.decile}</span>)}</div>
      <div className="figure-method-note"><p><b>Why it mattered</b>By D10, approval had risen to about 70.9% while average credit score remained close to the low-630s. Pricing moved upward too, which shifted the interpretation from pure risk screening toward a risk–return pattern inside this synthetic approval rule.</p></div>
    </figure>
  )
}

function RentOwnEffectFigure() {
  const groups=[
    {method:'IPW', rent:28.7823, own:7.9019, effect:'+20.9 pp ATE'},
    {method:'Nearest-neighbour matching', rent:29.6251, own:7.6419, effect:'+22.0 pp ATT'},
  ]
  return (
    <figure className="loan-story-figure rent-own-figure">
      <figcaption><span>Causal-adjustment result · redrawn</span><strong>The renter–owner approval gap survived balancing.</strong></figcaption>
      <div className="rent-own-panels">
        {groups.map(g=><article key={g.method}>
          <div className="rent-own-head"><span>{g.method}</span><strong>{g.effect}</strong></div>
          <div className="effect-bar"><label>Rent</label><div><i style={{width:(g.rent/35*100)+'%'}}></i></div><b>{g.rent.toFixed(1)}%</b></div>
          <div className="effect-bar own"><label>Own</label><div><i style={{width:(g.own/35*100)+'%'}}></i></div><b>{g.own.toFixed(1)}%</b></div>
        </article>)}
      </div>
      <div className="figure-method-note"><p><b>How I built it</b>Propensity scores came from logistic regression. Extreme scores were trimmed to the 0.05–0.95 overlap region; IPW estimated an adjusted contrast and one-to-one propensity-score matching with replacement served as a robustness check.</p></div>
    </figure>
  )
}

function BalanceFlow() {
  return (
    <div className="loan-balance-flow">
      <article><span>Observed groups</span><strong>Different borrower mix</strong><p>Raw comparisons combine policy effects with composition differences.</p></article>
      <i>→</i>
      <article><span>Propensity model</span><strong>Estimate e(X)</strong><p>Compress observed covariates into a balancing score.</p></article>
      <i>→</i>
      <article><span>Overlap</span><strong>Trim 0.05–0.95</strong><p>Avoid unstable weights and unsupported comparisons.</p></article>
      <i>→</i>
      <article><span>IPW / matching</span><strong>Rebuild comparability</strong><p>Ask which approval gaps survive adjustment.</p></article>
    </div>
  )
}

export default function LoanStrategyProject() {
  const [assets,setAssets]=useState({})

  useEffect(()=>{
    if(!supabase) return
    let active=true
    supabase.from('project_assets').select('asset_key,media_path,caption').eq('project_id','loan-strategy').eq('published',true).then(({data})=>{
      if(!active||!data) return
      setAssets(Object.fromEntries(data.map(item=>[item.asset_key,item])))
    })
    return()=>{active=false}
  },[])

  return (
    <article className="loan-editorial">
      <header className="loan-editorial-hero">
        <div className="special-hero-nav"><Link className="back-link" to="/work">← Selected work</Link><span>Finance & Risk · 2025</span></div>
        <p className="kicker">45,000 loan applications · Machine learning → causal inference</p>
        <h1>When credit score explained almost nothing.</h1>
        <p className="loan-standfirst">We began with 45,000 synthetic loan applications and a familiar task: reproduce the approval rule with machine learning. One small number changed the project. Credit score—the variable we expected to anchor lending risk—had a correlation of roughly −0.01 with approval.</p>
        <div className="rrs-byline">Technical lead · Designed and implemented the modelling and econometric analysis.</div>
      </header>

      <section className="loan-context-grid">
        <div><p className="eyebrow">The data</p><p>A synthetic bank dataset with 45,000 applicant records and 14 variables covering demographics, income, loan terms, housing, credit history, default history, and approval outcomes.</p></div>
        <div><p className="eyebrow">The original question</p><p>Can a machine-learning system reproduce the bank's approval decision accurately enough to automate routine applications?</p></div>
        <div><p className="eyebrow">The question that emerged</p><p>If approval is highly predictable but credit quality barely explains it, what structure in the decision rule is the model actually learning?</p></div>
      </section>

      <section className="loan-story-section">
        <div className="loan-prose">
          <p className="loan-dropcap">The first pass looked ordinary: clean the data, encode categorical variables, inspect correlations, then train classifiers. The correlation heatmap was supposed to be routine EDA.</p>
          <p>Instead, one cell stood out. Credit score and approval were almost unrelated linearly. That did not prove credit score was irrelevant—it could still matter nonlinearly or through interactions—but it was enough to challenge the original framing.</p>
        </div>
        <EvidenceFigure
          asset={assets.correlation_heatmap}
          title="Correlation heatmap"
          alt="Original project correlation heatmap showing near-zero correlation between credit score and loan approval"
          built="Computed pairwise correlations across the cleaned numeric feature set and rendered the lower-triangle matrix in Python."
          matters="The credit-score / approval coefficient was approximately −0.01, which triggered the shift from a routine classifier project toward a policy investigation."
          fallback={<CorrelationFallback />}
        />
        <div className="loan-turn"><span>First turn</span><strong>The variable that should have explained credit quality barely moved with approval.</strong></div>
      </section>

      <section className="loan-story-section alternate">
        <div className="loan-prose">
          <p>We did not abandon prediction immediately. Instead, we used the classifier as a stress test of the anomaly. If credit score really carried essential approval information, removing it should damage performance.</p>
          <p>It did not. An XGBoost model trained without credit score still reached an AUC of 0.980 on the held-out test set. The model could reproduce approvals extremely well while barely needing the variable that normally anchors a credit-risk narrative.</p>
        </div>
        <EvidenceFigure
          asset={assets.feature_importance}
          title="XGBoost feature importance"
          alt="Original XGBoost gain-based feature importance chart from the loan approval project"
          built="Trained the tuned XGBoost classifier after one-hot encoding the categorical features, then ranked features by gain."
          matters="The model could classify approvals extremely well without leaning meaningfully on credit score, so prediction alone could not explain the approval mechanism."
          fallback={<div className="loan-model-fallback"><span>XGBoost without credit score</span><strong>AUC 0.980</strong><p>Predictive performance barely moved when credit score was removed.</p></div>}
        />
      </section>

      <section className="loan-story-section">
        <div className="loan-prose">
          <p>Next we looked directly at approval rates across credit-score bands. If the correlation was hiding a simple nonlinear threshold, the bins should have revealed it.</p>
          <p>They did not. Approval rose from the very-low group into the middle of the distribution, then declined again as credit score improved. Even after restricting the sample to applicants without previous defaults, credit score remained secondary in the model.</p>
        </div>
        <EvidenceFigure
          asset={assets.credit_score_bins}
          title="Approval rate by credit-score band"
          alt="Original line chart of approval rate across very poor to very good credit-score categories"
          built="Binned the continuous credit score into ordered risk categories and calculated approval rate within each bin."
          matters="The relationship was visibly non-monotonic: better credit did not translate into steadily higher approval."
          fallback={<CreditScoreFallback />}
        />
        <div className="loan-turn"><span>Second turn</span><strong>Trying a more flexible algorithm did not restore the lending intuition.</strong></div>
      </section>

      <section className="loan-story-section alternate">
        <div className="loan-prose">
          <p>The next clue appeared when risk and pricing were viewed together. Across DTI deciles, applicants with higher debt burdens were approved more often—and were also charged higher interest rates—while average credit score stayed comparatively stable.</p>
          <p>That pattern suggested a different hypothesis: perhaps the synthetic approval mechanism was screening out extreme risk, then accepting more yield-bearing risk inside the remaining envelope.</p>
        </div>
        <EvidenceFigure
          asset={assets.dti_deciles}
          title="Approval, interest, and credit quality across DTI deciles"
          alt="Original DTI-decile analysis comparing approval rate, interest rate, and credit score"
          built="Partitioned loan-percent-income into deciles, then summarized approval rate, mean interest rate, and mean credit score within each group."
          matters="Higher DTI coincided with both higher approval and higher pricing, while credit quality moved much less."
          fallback={<DtiFallback />}
        />
      </section>

      <section className="loan-story-section">
        <div className="loan-prose">
          <p>At this point the project had moved beyond feature importance. Raw group differences could still be caused by the types of borrowers inside each group. Renters, owners, lower-score applicants, and higher-score applicants do not enter the dataset with identical incomes, ages, loan purposes, or debt burdens.</p>
          <p>So the question changed again: after balancing observable borrower composition, which unusual approval gaps were still there?</p>
        </div>
        <BalanceFlow />
        <div className="loan-method-caption">For each comparison, treatment membership was modeled with logistic regression. Extreme propensity scores were trimmed to the 0.05–0.95 overlap region; IPW estimated adjusted ATE-style contrasts, and one-to-one nearest-neighbour propensity-score matching with replacement was used as a robustness check where appropriate.</div>
      </section>

      <section className="loan-story-section alternate loan-adjusted-section">
        <div className="loan-prose">
          <p>The adjusted comparisons did not all behave the same way. The renter–owner gap survived reweighting at roughly twenty percentage points and remained similar under matching. Within the no-default sample, the lower-credit group also retained the counterintuitive approval advantage. The gender contrast, by comparison, moved toward zero after adjustment.</p>
          <p>That contrast mattered. It suggested we were not simply looking at one universal source of selection bias: some approval patterns survived observed-covariate balancing while others did not.</p>
        </div>
        <div className="loan-causal-evidence">
          <RentOwnEffectFigure />
          <div className="loan-adjusted-table">
            <div className="loan-adjusted-head"><span>Comparison</span><span>Adjusted result</span><span>What survived?</span></div>
            {adjustedRows.map(row=><div className="loan-adjusted-row" key={row[0]}>{row.map((cell,i)=><span key={cell} className={i===1?'effect-cell':''}>{cell}</span>)}</div>)}
          </div>
        </div>
        <div className="loan-turn"><span>Third turn</span><strong>Balancing borrower composition removed some stories—and strengthened others.</strong></div>
      </section>

      <section className="loan-story-section">
        <div className="loan-prose">
          <p>Taken together, the results were consistent with a bounded risk–return mechanism in this synthetic system. Previous default acted like a hard risk screen. Inside the surviving pool, higher-DTI, higher-interest borrowers could receive more approvals even when credit scores were not better.</p>
          <p>That is an interpretation of the observed synthetic mechanism—not proof of managerial intent, and not a claim about real banks. IPW and matching only address observed covariates under their identifying assumptions.</p>
        </div>
        <div className="loan-risk-envelope">
          <div className="risk-gate"><span>Hard screen</span><strong>Previous default</strong><p>Extreme-risk applicants are largely removed first.</p></div>
          <i>→</i>
          <div className="risk-field"><span>Remaining approval envelope</span><strong>Risk can be traded for yield</strong><p>Higher DTI + higher interest can coexist with higher approval.</p></div>
        </div>
      </section>

      <section className="loan-editorial-ending">
        <p className="eyebrow">What changed in the project</p>
        <h2>Machine learning answered “who gets approved.” The more useful work began when we asked why that answer looked financially strange.</h2>
        <p>The project became less about squeezing another point of AUC from a classifier and more about distinguishing prediction from explanation: EDA surfaced the anomaly, ML showed it was not a simple modeling failure, and causal-adjustment tools tested which group patterns persisted after observed borrower composition was balanced.</p>
        <div className="publication-note">Synthetic dataset. IPW and matching rely on overlap and conditional-independence assumptions and cannot eliminate unobserved confounding or identify managerial intent.</div>
        <div className="project-actions"><Link className="button secondary" to="/work">Back to all work</Link></div>
      </section>
    </article>
  )
}
