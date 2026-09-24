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

function EconometricsPivot() {
  return (
    <div className="econometrics-pivot">
      <article><span>What ML kept answering</span><strong>Who gets approved?</strong><p>Different classifiers reproduced the imbalanced synthetic label, but none explained why credit score could sit near zero correlation while a hard default rule made the outcome comparatively easy to separate.</p></article>
      <i>→</i>
      <article className="pivot-middle"><span>The idea I borrowed from econometrics</span><strong>Direction can be a clue before it is proof.</strong><p>A weak or imprecise effect should not become a conclusion, but its sign can still generate a hypothesis. Causal inference also asks what remains after making groups more comparable.</p></article>
      <i>→</i>
      <article className="pivot-ipw"><span>The method that unlocked the next step</span><strong>Propensity scores + IPW</strong><p>Instead of ranking predictors, reweight borrowers so observed covariates are balanced and inspect which approval gaps persist.</p></article>
    </div>
  )
}

function LendingRuleFigure() {
  return (
    <div className="lending-rule-figure">
      <div className="rule-stage">
        <span>Stage 1 · hard screen</span><strong>Previous default?</strong>
        <div className="rule-branches">
          <div className="rule-branch reject"><b>Yes</b><em>0% approval in this synthetic dataset</em></div>
          <div className="rule-branch continue"><b>No</b><em>continue to pricing / burden trade-off</em></div>
        </div>
      </div>
      <i>→</i>
      <div className="rule-stage yield-stage">
        <span>Stage 2 · among survivors</span><strong>Earn more without crossing the first risk gate</strong>
        <ul><li>higher DTI → much higher approval</li><li>higher DTI → higher interest pricing</li><li>average credit score stays comparatively flat</li><li>lower-credit group retains an approval advantage after adjustment</li></ul>
      </div>
    </div>
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
        <p className="loan-standfirst">We began as a group with 45,000 synthetic loan applications and a familiar task: reproduce the approval rule with machine learning. The turning point was not that prediction failed. Prediction worked. What failed was our ability to explain why credit score—the variable we expected to anchor lending risk—had a correlation of roughly −0.01 with approval.</p>
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
          <p>As a group, we tried the obvious response to the anomaly: more machine learning. Logistic Regression, a Decision Tree, Random Forest, SVM, and XGBoost all attacked the same approval label from different angles.</p>
          <p>The models became better at reproducing the synthetic decision rule, but not at explaining the puzzle. XGBoost still reported an ROC-AUC of 0.980 after credit score was removed—but I do not treat that number as proof of a strong underwriting model. Only about 22% of applications were approvals, and the synthetic label contained a near-deterministic default screen. The metric mainly told us that the rule was easy to recover, not that we had explained it.</p>
        </div>
        <EvidenceFigure asset={assets.feature_importance} title="XGBoost feature importance" alt="Original XGBoost gain-based feature importance chart from the loan approval project" built="Trained the tuned XGBoost classifier after one-hot encoding the categorical features, then stress-tested the result by removing credit score." matters="ROC-AUC stayed high even without credit score, but the target was imbalanced and the synthetic approval rule contained a very strong default gate. I therefore treated AUC as evidence that the label rule was recoverable—not as evidence that the model was economically well specified." fallback={<div className="loan-model-fallback"><span>XGBoost without credit score</span><strong>ROC-AUC 0.980</strong><p>22.2% approvals · strong label separation · not an explanation of the lending logic</p></div>} />
        <div className="loan-turn"><span>Second turn</span><strong>More machine learning kept answering the same question better. It did not answer the question we now cared about.</strong></div>
      </section>

      <section className="loan-story-section">
        <div className="loan-prose">
          <p>We also checked whether the near-zero correlation was hiding a simple nonlinear threshold. Approval rates across credit-score bands did not restore the expected monotonic pattern: better credit did not translate into steadily higher approval.</p>
          <p>At this point, I stopped looking for another classifier. I started looking sideways—toward econometrics.</p>
        </div>
        <EvidenceFigure asset={assets.credit_score_bins} title="Approval rate by credit-score band" alt="Original line chart of approval rate across very poor to very good credit-score categories" built="Binned the continuous credit score into ordered risk categories and calculated approval rate within each bin." matters="The relationship remained non-monotonic, reinforcing that predictive flexibility alone was not revealing the underlying rule." fallback={<CreditScoreFallback />} />
      </section>

      <section className="loan-story-section alternate loan-pivot-section">
        <div className="loan-prose">
          <p>The useful idea came from a different tradition. In econometrics, an effect does not have to become a headline result to be informative: even when evidence is weak, its sign can still be treated as a hypothesis-generating clue rather than proof. More importantly, causal inference changes the object of analysis from feature importance to comparison.</p>
          <p>While reading work on propensity scores and inverse probability weighting, I saw a way to ask the question differently: instead of “which variable predicts approval?”, ask “after making borrowers comparable on observed covariates, which approval differences are still left?” That became the methodological pivot of my part of the project.</p>
        </div>
        <EconometricsPivot />
        <div className="loan-turn"><span>Methodological pivot</span><strong>Prediction ranked signals. Econometrics gave me a way to interrogate the rule.</strong></div>
      </section>

      <section className="loan-story-section">
        <div className="loan-prose"><p>I translated that idea into three comparisons: Rent vs Own, lower vs higher credit quality within the no-default subsample, and Male vs Female. The aim was not to claim experimental causality from observational synthetic data, but to see which patterns survived observable-covariate balancing.</p><p>Propensity scores compressed observed borrower characteristics into a balancing score. I trimmed poor-overlap cases, used IPW to reconstruct comparable weighted groups, and used nearest-neighbour matching as a robustness check where appropriate.</p></div>
        <BalanceFlow />
        <div className="loan-method-caption">Treatment membership was modeled with logistic regression. Extreme propensity scores were trimmed to the 0.05–0.95 overlap region; IPW estimated adjusted ATE-style contrasts, and one-to-one nearest-neighbour propensity-score matching with replacement was used as a robustness check.</div>
      </section>

      <section className="loan-story-section alternate loan-adjusted-section">
        <div className="loan-prose"><p>The adjusted results began to separate durable structure from surface correlation. The renter–owner gap survived reweighting at +20.9 percentage points and stayed similar under matching (+22.0 pp ATT). Within the no-default subsample, the lower-credit group also retained the counterintuitive approval advantage. The gender contrast, by comparison, moved toward zero.</p><p>This was the first time the project moved beyond “credit score looks strange” toward a more coherent lending rule.</p></div>
        <div className="loan-causal-evidence"><RentOwnEffectFigure /><div className="loan-adjusted-table"><div className="loan-adjusted-head"><span>Comparison</span><span>Adjusted result</span><span>What survived?</span></div>{adjustedRows.map(row=><div className="loan-adjusted-row" key={row[0]}>{row.map((cell,i)=><span key={cell} className={i===1?'effect-cell':''}>{cell}</span>)}</div>)}</div></div>
        <div className="loan-turn"><span>Third turn</span><strong>Balancing borrower composition removed some stories—and made the remaining ones harder to dismiss as simple mix effects.</strong></div>
      </section>

      <section className="loan-story-section">
        <div className="loan-prose"><p>The next clue came from debt burden and pricing. Across DTI deciles, approval climbed from about 10.1% in D1 to 70.9% in D10. Average interest rates also rose, while average credit score stayed almost flat in the low 630s.</p><p>Put beside the adjusted no-default credit result, the pattern looked less like “approve the safest borrower” and more like “once the hard default screen is passed, accept more yield-bearing risk.”</p></div>
        <EvidenceFigure asset={assets.dti_deciles} title="Approval, interest, and credit quality across DTI deciles" alt="Original DTI-decile analysis comparing approval rate, interest rate, and credit score" built="Partitioned loan-percent-income into deciles, then summarized approval rate, mean interest rate, and mean credit score within each group." matters="Higher DTI coincided with much higher approval and higher pricing while average credit quality barely moved." fallback={<DtiFallback />} />
      </section>

      <section className="loan-story-section alternate loan-rule-section">
        <div className="loan-prose"><p>The final interpretation was a two-stage, subprime-style rule embedded in this synthetic dataset. First, previous default acted like a hard exclusion gate: applicants with a recorded prior default had a 0% approval rate. Then, among those who survived that screen, the rule appeared willing to move toward higher-yield lending.</p><p>In plain language: <strong>remove the borrowers who have already defaulted, then try to earn more from the remaining risk envelope.</strong> Higher DTI and higher interest could coexist with higher approval, even when credit score was not improving.</p><p>This is an interpretation of the synthetic mechanism, not proof of a real bank's intent. IPW and matching only address observed covariates under their identifying assumptions.</p></div>
        <LendingRuleFigure />
        <div className="loan-turn"><span>What ML could not surface directly</span><strong>A two-stage decision rule: hard default screening first, yield-seeking inside the surviving pool second.</strong></div>
      </section>

      <section className="loan-editorial-ending">
        <p className="eyebrow">What changed in the project</p>
        <h2>The breakthrough was not a better classifier. It was borrowing a different way of thinking.</h2>
        <p>Our group used machine learning to show that the synthetic approval rule was highly predictable. My contribution was the pivot from prediction to explanation: drawing on econometric reasoning and IPW to ask counterfactual-style comparison questions, then using those results to reconstruct the two-stage lending mechanism hiding behind the near-zero credit-score relationship.</p>
        <div className="publication-note">Synthetic dataset. Approval prevalence is about 22.2%, so ROC-AUC is reported alongside class-specific performance rather than treated as a standalone measure of business quality. IPW and matching rely on overlap and conditional-independence assumptions and cannot eliminate unobserved confounding or identify managerial intent.</div>
        <div className="project-actions"><Link className="button secondary" to="/work">Back to all work</Link></div>
      </section>
    </article>
  )
}
