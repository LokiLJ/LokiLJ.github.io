import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { mediaPublicUrl, supabase } from '../lib/supabase'

const transferRows = [
  ['GMAT language trap','Base: vulnerable','Math adapter: improved'],
  ['Cognitive-trap item','Base: mixed','Math adapter: solved'],
  ['Binary-search multi-bug','Base: partial','Code adapter: deeper coverage'],
  ['Visual Basic task','Near-absent in training','Code adapter: correct transfer'],
  ['Python object-model trap','Base: failed','Code adapter: still failed'],
]

function EvidenceImage({ asset, title, alt, fallback }) {
  if (!asset?.media_path) return fallback || null
  return (
    <figure className="qwen-evidence">
      <figcaption><span>Original assignment output</span><strong>{title}</strong></figcaption>
      <img src={mediaPublicUrl(asset.media_path)} alt={alt} />
    </figure>
  )
}

function BudgetFallback() {
  return (
    <div className="qwen-budget-visual">
      <article>
        <span>Base model · same 512-token output budget</span>
        <div className="token-spend"><i style={{width:'91%'}}></i></div>
        <strong>Long deliberation</strong>
        <p>Useful answer can arrive late or be cut off.</p>
      </article>
      <article className="qwen-budget-tuned">
        <span>Fine-tuned adapter · same budget</span>
        <div className="token-spend"><i style={{width:'55%'}}></i></div>
        <strong>Shorter route to completion</strong>
        <p>The change was behavioural, not merely factual.</p>
      </article>
    </div>
  )
}

export default function QwenProject() {
  const [assets,setAssets]=useState({})

  useEffect(()=>{
    if(!supabase) return
    let active=true
    supabase.from('project_assets').select('asset_key,media_path,caption').eq('project_id','qwen-finetuning').eq('published',true).then(({data})=>{
      if(active && data) setAssets(Object.fromEntries(data.map(item=>[item.asset_key,item])))
    })
    return()=>{active=false}
  },[])

  return (
    <article className="qwen-editorial">
      <header className="project-special-hero qwen-hero">
        <div className="special-hero-nav"><Link className="back-link" to="/work">← Selected work</Link><span>AI & Data Science · 2026</span></div>
        <p className="kicker">Qwen3-14B · LoRA · Reasoning transfer</p>
        <h1>Fine-tuning changed what the model paid attention to.</h1>
        <p className="special-deck">I fine-tuned the same 14B base model on two very different teaching domains—mathematical word problems and multi-turn code feedback—to ask a narrower question than “does fine-tuning improve performance?”: what behaviour actually changes, and where does that change stop transferring?</p>
        <div className="project-role">Individual assignment · Designed and implemented the full fine-tuning, transfer-probe, and classical-baseline workflow.</div>
      </header>

      <section className="qwen-context-grid">
        <div><p className="eyebrow">Why these datasets</p><p>ORCA Math and Code-Feedback matched domains I could evaluate directly from experience teaching secondary mathematics, GMAT quantitative reasoning, and introductory programming.</p></div>
        <div><p className="eyebrow">The setup</p><p>A 4-bit quantized Qwen3-14B adapted with LoRA on an A100. Training used bfloat16 for stability; the code dataset needed longer sequence handling because examples were multi-turn dialogues.</p></div>
        <div><p className="eyebrow">The real question</p><p>Does the adapter merely memorize familiar solution patterns, or does it change how the base model checks, compresses, and transfers reasoning?</p></div>
      </section>

      <section className="qwen-story-section">
        <div className="qwen-prose">
          <p className="qwen-dropcap">My first expectation was conventional: specialization should make the model know more about the target domain. The outputs suggested something subtler.</p>
          <p>Under the same 512-token comparison budget, the base model often spent a large share of its response on repetitive deliberation. Fine-tuned responses were more likely to reach a usable ending before the budget ran out. In the code domain especially, the adapter became noticeably more concise.</p>
        </div>
        <EvidenceImage asset={assets.budget_example} title="Base vs fine-tuned response under the same output budget" alt="Original assignment comparison of Qwen base and fine-tuned responses" fallback={<BudgetFallback />} />
        <div className="qwen-turn"><span>First turn</span><strong>The adapter was changing how the model spent its reasoning budget—not simply adding facts.</strong></div>
      </section>

      <section className="qwen-story-section alternate">
        <div className="qwen-prose">
          <p>That raised a harder test. If the improvement was only memorization, it should disappear as soon as the prompt moved away from the training distribution.</p>
          <p>I therefore chose probes that were deliberately awkward: GMAT wording traps, a multi-bug binary-search task, a Visual Basic problem despite VB being nearly absent from the code data, and a Python default-parameter problem whose answer depends on understanding the object model rather than following a familiar debugging pattern.</p>
        </div>
        <div className="transfer-table">
          <div className="transfer-head"><span>Probe</span><span>Starting point</span><span>After fine-tuning</span></div>
          {transferRows.map((r)=><div className="transfer-row" key={r[0]}>{r.map((cell)=><span key={cell}>{cell}</span>)}</div>)}
        </div>
        <div className="qwen-turn"><span>Second turn</span><strong>Transfer travelled farther than the training examples—but not farther than the model's underlying concepts.</strong></div>
      </section>

      <section className="qwen-story-section">
        <div className="qwen-prose">
          <p>The successful transfer was real. The math adapter became more sensitive to precise wording in GMAT-style traps. The code adapter found more of the flaws in a binary-search program and produced correct Visual Basic code despite the training data being dominated by other languages.</p>
          <p>But the Python object-model trap survived fine-tuning. Both the base model and the code adapter failed. That boundary mattered more to me than another benchmark gain: repeated exposure can strengthen a checking pattern, but it does not automatically create a missing mental model.</p>
        </div>
        <EvidenceImage asset={assets.transfer_examples} title="Held-out transfer probes" alt="Original assignment outputs comparing transfer successes and the Python failure case" fallback={
          <div className="qwen-boundary-visual">
            <div><span>Pattern sensitivity</span><strong>Improved</strong><p>wording traps · multi-bug checking · unfamiliar language syntax</p></div>
            <i>≠</i>
            <div><span>Missing conceptual model</span><strong>Still failed</strong><p>Python object behaviour / default-parameter mechanism</p></div>
          </div>
        } />
      </section>

      <section className="qwen-story-section alternate">
        <div className="qwen-prose">
          <p>I also built a deliberately simple baseline on the ORCA data: 2,000 balanced problem–answer pairs, represented with 5,000 TF-IDF features and classified with Logistic Regression.</p>
          <p>Its accuracy was 41.8%, below the 50% chance benchmark. That is not a like-for-like contest with a generative LLM, but it was useful evidence that surface lexical overlap alone was a poor representation for judging mathematical correctness.</p>
        </div>
        <div className="baseline-visual qwen-baseline-compact">
          <article><span>TF-IDF + Logistic Regression</span><strong>41.8%</strong><div className="accuracy-track"><i style={{width:'41.8%'}}></i><b>50% chance</b></div><p>Words were present; the relation between question and answer was not represented well enough.</p></article>
        </div>
      </section>

      <section className="qwen-editorial-ending">
        <p className="eyebrow">What changed in my view</p>
        <h2>Fine-tuning can reshape attention and checking behaviour without guaranteeing deeper understanding.</h2>
        <p>The useful result was not “the tuned model is better.” It was a more precise boundary: adapters can compress familiar reasoning, increase sensitivity to recurring traps, and transfer those habits surprisingly far—but they still inherit conceptual holes the training examples never force them to resolve.</p>
        <div className="project-actions"><Link className="button secondary" to="/work">Back to all work</Link></div>
      </section>
    </article>
  )
}
