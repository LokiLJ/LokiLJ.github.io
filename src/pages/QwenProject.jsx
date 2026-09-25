import { Link } from 'react-router-dom'

const transferRows = [
  ['GMAT language trap','Base model misread a key profit wording','Math adapter became more sensitive to the phrasing'],
  ['Binary-search multi-bug','Base corrected only part of the logic','Code adapter corrected all four issues'],
  ['Visual Basic task','VB was nearly absent from the training data','Code adapter still produced a correct solution'],
  ['Python default-parameter trap','Base failed','Code adapter still failed'],
]

function BudgetEvidence() {
  return (
    <div className="qwen-text-evidence">
      <div className="qwen-text-evidence-head"><span>Same prompt · FizzBuzz</span><strong>What changed was not the algorithm. It was the route to the answer.</strong></div>
      <div className="qwen-output-compare">
        <article>
          <span>Base model</span>
          <h3>Repeatedly re-checks the same rule</h3>
          <p>The response spends many lines revisiting the divisibility order—why “both” must be checked before 3 or 5—before finally arriving at the implementation.</p>
          <div className="qwen-output-meter"><i style={{width:'90%'}}></i></div>
          <small>Long deliberation under a fixed output budget</small>
        </article>
        <article className="qwen-output-tuned">
          <span>Fine-tuned model</span>
          <h3>States the rule, then finishes</h3>
          <p>The adjusted response gives the decision order once, moves directly into the function, and reaches a complete answer with less repetition.</p>
          <div className="qwen-output-meter"><i style={{width:'54%'}}></i></div>
          <small>More of the budget reaches the usable answer</small>
        </article>
      </div>
    </div>
  )
}

function BinarySearchEvidence() {
  const rows = [
    ['Initialize right boundary','✓','✓'],
    ['Use left <= right','—','✓'],
    ['Advance left to mid + 1','—','✓'],
    ['Move right to mid − 1','—','✓'],
  ]
  return (
    <div className="qwen-bug-evidence">
      <div className="qwen-text-evidence-head"><span>Held-out code probe · Binary search</span><strong>The base model stopped after finding a plausible fix. The tuned model kept checking.</strong></div>
      <div className="qwen-bug-table">
        <div className="qwen-bug-head"><span>Issue in the program</span><span>Base</span><span>Code adapter</span></div>
        {rows.map((row)=><div className="qwen-bug-row" key={row[0]}>{row.map((cell,i)=><span key={i} className={cell==='✓'?'is-check':''}>{cell}</span>)}</div>)}
      </div>
      <p className="qwen-source-note">The assignment output shows the base response correcting only the initial right-boundary issue, while the fine-tuned response also fixes the loop condition and both pointer-update rules.</p>
    </div>
  )
}

function TransferBoundaryEvidence() {
  return (
    <div className="qwen-transfer-evidence">
      <div className="qwen-transfer-side">
        <span>Transfer worked</span>
        <strong>Checking habits travelled beyond the training examples.</strong>
        <ul>
          <li>GMAT-style wording traps</li>
          <li>multi-bug code checking</li>
          <li>Visual Basic despite near-absence in the code dataset</li>
        </ul>
      </div>
      <i>≠</i>
      <div className="qwen-transfer-side qwen-transfer-fail">
        <span>Transfer stopped here</span>
        <strong>A missing object model stayed missing.</strong>
        <p>The Python default-parameter problem depends on understanding object behaviour, not recognizing a familiar debugging surface pattern. Both the base and tuned model failed.</p>
      </div>
    </div>
  )
}

export default function QwenProject() {
  return (
    <article className="qwen-editorial">
      <header className="project-special-hero qwen-hero">
        <div className="special-hero-nav"><Link className="back-link" to="/work">← Selected work</Link><span>AI & Data Science · 2026</span></div>
        <p className="kicker">Qwen3-14B · LoRA · Reasoning transfer</p>
        <h1>Fine-tuning changed what the model paid attention to.</h1>
        <p className="special-deck">I fine-tuned the same 14B base model on two teaching domains—mathematical word problems and multi-turn code feedback—to ask a narrower question than “does fine-tuning improve performance?”: what behaviour actually changes, and where does that change stop transferring?</p>
        <div className="project-role">Individual assignment · Designed and implemented the fine-tuning, transfer-probe, and classical-baseline workflow.</div>
      </header>

      <section className="qwen-context-grid">
        <div><p className="eyebrow">Why these datasets</p><p>ORCA Math and Code-Feedback matched domains I could evaluate directly from experience teaching secondary mathematics, GMAT quantitative reasoning, and introductory programming.</p></div>
        <div><p className="eyebrow">The setup</p><p>A 4-bit quantized Qwen3-14B adapted with LoRA on an A100. Training used bfloat16 for stability; the multi-turn code data required longer sequence handling.</p></div>
        <div><p className="eyebrow">The real question</p><p>Does the adapter merely memorize familiar solutions, or does it change how the base model checks, compresses, and transfers reasoning?</p></div>
      </section>

      <section className="qwen-story-section">
        <div className="qwen-prose">
          <p className="qwen-dropcap">My first expectation was conventional: specialization should make the model know more about the target domain. The outputs suggested something subtler.</p>
          <p>With the same comparison budget, the base model often spent a large share of its response re-checking reasoning it had already established. The fine-tuned model was more likely to reach a usable ending before the budget ran out. In the code domain especially, the adapter became noticeably more concise.</p>
        </div>
        <BudgetEvidence />
        <div className="qwen-turn"><span>First turn</span><strong>The adapter was changing how the model spent its reasoning budget—not simply adding facts.</strong></div>
      </section>

      <section className="qwen-story-section alternate">
        <div className="qwen-prose">
          <p>A simple coding probe made that behaviour easier to see. The binary-search function contained several interacting errors. The base model found a plausible first fix and stopped. The code adapter kept auditing the logic.</p>
          <p>That difference matched a broader pattern in the assignment: the foundational model often settled for a satisfactory-looking answer, while fine-tuning made the model more sensitive to details it had learned to check repeatedly.</p>
        </div>
        <BinarySearchEvidence />
        <div className="qwen-turn"><span>Second turn</span><strong>The improvement looked less like “more programming knowledge” and more like a stronger checking habit.</strong></div>
      </section>

      <section className="qwen-story-section">
        <div className="qwen-prose">
          <p>If that habit was real, it should survive prompts that did not look like the training examples. So I deliberately tested awkward transfer cases: GMAT wording traps, Visual Basic despite its near-absence from the code data, and a Python default-parameter question whose answer depends on the object model.</p>
          <p>The first two transferred surprisingly well. The last one did not. That boundary mattered more to me than another benchmark gain.</p>
        </div>
        <div className="transfer-table">
          <div className="transfer-head"><span>Probe</span><span>Starting point</span><span>After fine-tuning</span></div>
          {transferRows.map((r)=><div className="transfer-row" key={r[0]}>{r.map((cell)=><span key={cell}>{cell}</span>)}</div>)}
        </div>
        <TransferBoundaryEvidence />
        <div className="qwen-turn"><span>Third turn</span><strong>Transfer travelled farther than the training examples—but not farther than the model's underlying concepts.</strong></div>
      </section>

      <section className="qwen-story-section alternate">
        <div className="qwen-prose">
          <p>I also built a deliberately simple baseline on the ORCA data: 2,000 balanced problem–answer pairs, represented with 5,000 TF-IDF features and classified with Logistic Regression.</p>
          <p>Its accuracy was 41.8%, below the 50% chance benchmark. That is not a like-for-like contest with a generative LLM, but it was useful evidence that surface lexical overlap alone was a poor representation for judging whether a mathematical answer was actually correct.</p>
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
