import { Link } from 'react-router-dom'

const transferRows = [
  ['GMAT language trap','Base: vulnerable','Math adapter: improved'],
  ['Cognitive-trap item','Base: mixed','Math adapter: solved'],
  ['Binary-search multi-bug','Base: partial','Code adapter: deeper coverage'],
  ['Visual Basic task','Near-absent in training','Code adapter: correct transfer'],
  ['Python object-model trap','Base: failed','Code adapter: still failed'],
]

export default function QwenProject() {
  return (
    <>
      <section className="project-special-hero qwen-hero">
        <div className="special-hero-nav"><Link className="back-link" to="/work">← Selected work</Link><span>AI & Data Science · 2026</span></div>
        <p className="kicker">LLM Fine-Tuning · Qwen3-14B</p>
        <h1>Fine-tuning changed how the model spent its answer budget.</h1>
        <p className="special-deck">Two LoRA adapters—mathematical reasoning and multi-turn code feedback—were used to study not only whether outputs improved, but how fine-tuning changed response efficiency, transfer, and failure boundaries.</p>
        <div className="project-role">Technical owner · Designed and implemented the full fine-tuning and evaluation workflow.</div>
      </section>

      <section className="qwen-budget-band">
        <div><span>Fixed comparison budget</span><strong>512 tokens</strong><p>Base responses often spent too much of the output budget on repetitive deliberation and risked truncating the final answer.</p></div>
        <div className="budget-compare">
          <article><span>Base model</span><div className="token-bar base-token"><i></i></div><strong>Longer deliberation → answer truncation risk</strong></article>
          <article><span>Fine-tuned adapters</span><div className="token-bar tuned-token"><i></i></div><strong>Shorter path → complete answer more often</strong></article>
        </div>
      </section>

      <section className="section qwen-setup-section">
        <div className="section-heading wide-heading">
          <div><p className="section-number">01 / Efficient adaptation</p><h2>Specialize a 14B model without retraining it.</h2></div>
          <p>The workflow used a 4-bit quantized Qwen3-14B with LoRA, switched training to bfloat16 on A100 hardware, and extended sequence handling for multi-turn code dialogues.</p>
        </div>
        <div className="tech-pipeline">
          <article><span>Base</span><strong>Qwen3-14B</strong><p>4-bit quantized foundation model</p></article><i>→</i>
          <article><span>Adapter A</span><strong>Math reasoning</strong><p>ORCA-style mathematical problems</p></article><i>+</i>
          <article><span>Adapter B</span><strong>Code feedback</strong><p>Multi-turn programming correction</p></article><i>→</i>
          <article className="tech-output"><span>Probe</span><strong>Transfer & failures</strong><p>Held-out tasks beyond the training pattern</p></article>
        </div>
      </section>

      <section className="section qwen-behaviour-section">
        <div className="section-heading wide-heading">
          <div><p className="section-number">02 / Behaviour changed</p><h2>The interesting effect was not just “more knowledge.”</h2></div>
          <p>Under the same output budget, the tuned models tended to reach usable answers with less repetitive reasoning overhead. This made response completion itself part of the evaluation.</p>
        </div>
        <div className="behaviour-contrast">
          <article><p className="eyebrow">Before tuning</p><h3>Verbose deliberation</h3><div className="reasoning-lines">{[92,84,96,77,88,68,60].map((w,i)=><i key={i} style={{width:w+'%'}}></i>)}</div><span className="reasoning-end truncated">answer may truncate</span></article>
          <div className="contrast-arrow">→</div>
          <article className="tuned-card"><p className="eyebrow">After tuning</p><h3>More concise path to answer</h3><div className="reasoning-lines short">{[76,63,54].map((w,i)=><i key={i} style={{width:w+'%'}}></i>)}</div><span className="reasoning-end complete">complete answer</span></article>
        </div>
        <p className="method-note">The portfolio summarizes response behaviour; it does not expose hidden chain-of-thought content.</p>
      </section>

      <section className="section transfer-section">
        <div className="section-heading wide-heading">
          <div><p className="section-number">03 / Test transfer</p><h2>Can the adapter travel beyond familiar examples?</h2></div>
          <p>The answer was “sometimes.” Several gains transferred to atypical or near-out-of-distribution tasks, but a Python object-model trap exposed a boundary that neither the base model nor code adapter crossed.</p>
        </div>
        <div className="transfer-table">
          <div className="transfer-head"><span>Probe</span><span>Starting point</span><span>After fine-tuning</span></div>
          {transferRows.map((r)=><div className="transfer-row" key={r[0]}>{r.map((c)=><span key={c}>{c}</span>)}</div>)}
        </div>
        <blockquote className="capstone-quote qwen-quote"><span>Boundary</span><p>Pattern transfer is not the same thing as conceptual understanding.</p></blockquote>
      </section>

      <section className="section classical-baseline-section">
        <div className="section-heading wide-heading">
          <div><p className="section-number">04 / Classical baseline</p><h2>Surface lexical overlap was not enough.</h2></div>
          <p>A TF-IDF + Logistic Regression classifier was trained on 2,000 problem–answer pairs with 5,000 lexical features. Its 41.8% accuracy fell below the 50% random benchmark for the balanced binary task.</p>
        </div>
        <div className="baseline-visual">
          <article><span>TF-IDF + Logistic Regression</span><strong>41.8%</strong><div className="accuracy-track"><i style={{width:'41.8%'}}></i><b>50% chance</b></div><p>Lexical similarity could not reliably distinguish mathematical correctness.</p></article>
          <article className="semantic-card"><span>Fine-tuned pretrained model</span><strong>Semantic, multi-step generation</strong><p>The comparison highlights a representation gap rather than a like-for-like accuracy contest; the LLM was evaluated through reasoning probes rather than the same binary metric.</p></article>
        </div>
      </section>

      <section className="section closing-insight">
        <p className="section-number">Key takeaway</p>
        <h2>Fine-tuning changed response efficiency and task sensitivity, but the transfer stopped when success required concepts beyond familiar solution patterns.</h2>
        <div className="project-actions"><Link className="button secondary" to="/work">Back to all work</Link></div>
      </section>
    </>
  )
}
