import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { mediaPublicUrl, supabase } from '../lib/supabase'

const adjustedRows = [
  ['Rent vs Own','≈ +20 pp','Persisted after IPW; nearest-neighbour ATT was similar in magnitude'],
  ['Lower vs higher credit quality','counterintuitive direction','Within the no-default subsample, poorer-credit applicants retained higher weighted approval'],
  ['Male vs Female','≈ 0','The adjusted approval difference approached zero'],
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

function DtiFallback() {
  return (
    <figure className="loan-story-figure">
      <figcaption><span>Project result</span><strong>Higher DTI came with higher approval and higher interest.</strong></figcaption>
      <div className="dti-story-chart">
        <div className="dti-story-axis"><span>Lower DTI</span><span>Higher DTI</span></div>
        <div className="dti-story-row approval"><label>Approval</label>{[18,25,30,37,43,49,55,61,66,72].map((v,i)=><i key={i} style={{height:v+'%'}}></i>)}</div>
        <div className="dti-story-row interest"><label>Interest</label>{[28,32,36,39,43,48,53,58,64,69].map((v,i)=><i key={i} style={{height:v+'%'}}></i>)}</div>
        <div className="credit-story-line"><label>Average credit score</label><i></i><span>comparatively flat</span></div>
      </div>
      <div className="figure-method-note"><p><b>Why it mattered</b>Pricing and approval were moving together while average credit quality changed little, suggesting the approval rule was not simply minimizing borrower risk.</p></div>
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
        <h1>When a good prediction model stopped answering the interesting question.</h1>
        <p className="loan-standfirst">The project began as a conventional approval-classification exercise. One small number changed its direction: credit score—the variable we expected to anchor lending risk—had a correlation of roughly −0.01 with approval.</p>
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
          <p>We did not abandon prediction immediately. Five classifiers were trained as a stress test of the anomaly. Logistic Regression, tree models, SVM, Random Forest, and XGBoost all achieved strong classification performance; XGBoost reached an AUC of about 0.98.</p>
          <p>That result made the puzzle more interesting, not less. Approval was easy to predict even though credit score contributed little to the practical prediction story. Removing credit score produced no visible deterioration, and gain-based feature importance ranked it near the bottom.</p>
        </div>
        <EvidenceFigure
          asset={assets.feature_importance}
          title="XGBoost feature importance"
          alt="Original XGBoost gain-based feature importance chart from the loan approval project"
          built="Trained the tuned XGBoost classifier after one-hot encoding the categorical features, then ranked features by gain."
          matters="The model could classify approvals extremely well without leaning meaningfully on credit score, so prediction alone could not explain the approval mechanism."
          fallback={<div className="loan-model-fallback"><strong>AUC ≈ 0.98</strong><span>yet credit score remained near the bottom of gain-based importance</span></div>}
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
        <div className="loan-adjusted-table">
          <div className="loan-adjusted-head"><span>Comparison</span><span>Adjusted result</span><span>What survived?</span></div>
          {adjustedRows.map(row=><div className="loan-adjusted-row" key={row[0]}>{row.map((cell,i)=><span key={cell} className={i===1?'effect-cell':''}>{cell}</span>)}</div>)}
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
