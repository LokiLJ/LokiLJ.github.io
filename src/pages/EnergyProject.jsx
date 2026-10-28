import { Link } from 'react-router-dom'
import '../energy-project.css'

const repository = 'https://github.com/LokiLJ/utility-supply-chain-risk-analysis'

const chapters = [
  {
    id: 'energy-priorities',
    number: '01',
    label: 'Priorities',
    title: 'Start with a shortlist. Then look beneath the ranking.',
    text: 'Meters lead the composite vulnerability score, followed by distribution transformers. The useful next step is to examine what drives each score: U.S.-origin inventory exposure, coverage, lead time, and the category’s tolerance for disruption.',
    file: '01_priority_scores.png',
    height: 1710,
    alt: 'Vulnerability scores for 11 inventory categories. Meters rank first at 0.664, followed by distribution transformers at 0.617, electrical components at 0.566, and switchgear at 0.565.',
    caption: 'The five-factor index is a prioritization aid. Its weights and category averages affect the order; the score is not a failure probability.',
  },
  {
    id: 'energy-coverage',
    number: '02',
    label: 'Coverage',
    title: 'The most urgent item can sit below the top-ranked category.',
    text: 'Switchgear ranks fourth in the category screen, yet one record has a 213-day gap between available coverage and average replenishment lead time. That item-level signal creates a different agenda: check open orders, expected arrivals, and contingency stock.',
    file: '02_coverage_gaps.png',
    height: 1710,
    alt: 'Six U.S.-origin inventory records have days of supply below average lead time. The largest shortfall is 213 days for switchgear, comparing 684 days of supply with an 897-day lead time.',
    caption: 'Six of 24 U.S.-origin records trigger the coverage screen. A negative gap identifies a planning shortfall; it does not establish an actual stock-out date.',
  },
  {
    id: 'energy-exposure',
    number: '03',
    label: 'Cost scenario',
    title: 'Financial exposure and operating urgency need different priorities.',
    text: 'Other generation equipment and protection & control carry the largest modeled cost increases. Switchgear contributes a smaller dollar amount but has the deepest coverage gap among the U.S.-origin records. A procurement response needs both views.',
    file: '03_tariff_scenario.png',
    height: 1800,
    alt: 'An illustrative 35 percent tariff scenario totals approximately CAD 70.7 million annually. Other generation equipment, protection and control, and distribution transformers each account for about CAD 14 million.',
    caption: 'Historical 35% case assumption × category annual spend × U.S.-origin inventory-row share. The row-share proxy makes this an illustrative scenario, not a current tariff forecast.',
  },
  {
    id: 'energy-trade',
    number: '04',
    label: 'Trade context',
    title: 'The sourcing backdrop changes by equipment group.',
    text: 'Between 2021 and 2024, the U.S. share of Canadian imports rose for generators and batteries, while falling for several transformer and switchgear groups. Diversification therefore needs a product-level view.',
    file: '04_import_dependence.png',
    height: 1710,
    alt: 'U.S. shares of Canadian imports in 2021 and 2024 vary by equipment group. The selected generator group rises to 88.9 percent, while switchgear panels fall from 59.3 to 40.7 percent.',
    caption: 'Canada is the importing country throughout this comparison. National trade shares provide market context; they do not measure the utility’s own purchasing exposure.',
  },
  {
    id: 'energy-suppliers',
    number: '05',
    label: 'Supplier screen',
    title: 'A longer vendor list still needs a qualification process.',
    text: 'The performance screen makes the next questions concrete. The two meter records without a U.S. restriction flag are both rated Poor; other categories offer a broader starting pool. Technical fit and available capacity still need verification.',
    file: '05_supplier_screen.png',
    height: 1800,
    alt: 'Vendor-record counts without a U.S. restriction flag, across five performance bands. Meters have two records, both Poor; switchgear has 35 records spread across all five bands.',
    caption: 'Restriction flags are kept distinct from country of origin. These are record counts, which may not represent unique suppliers; all five performance bands are shown.',
  },
]

function EvidenceChapter({ chapter }) {
  const image = `/assets/energy/${chapter.file}`

  return (
    <section className="energy-chapter" id={chapter.id} aria-labelledby={`${chapter.id}-title`}>
      <div className="energy-chapter-heading">
        <div className="energy-chapter-title">
          <p className="energy-eyebrow"><span>{chapter.number}</span> {chapter.label}</p>
          <h2 id={`${chapter.id}-title`}>{chapter.title}</h2>
        </div>
        <p className="energy-chapter-reading">{chapter.text}</p>
      </div>
      <figure className="energy-evidence">
        <a
          className="energy-image-link"
          href={image}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Open figure ${chapter.number}: ${chapter.label}, full size in a new tab`}
        >
          <img
            src={image}
            alt={chapter.alt}
            width="2520"
            height={chapter.height}
            loading="lazy"
            decoding="async"
          />
          <span className="energy-image-action" aria-hidden="true">Open full size <span>↗</span></span>
        </a>
        <figcaption>
          <span className="energy-figure-number">Fig. {chapter.number}</span>
          <span>{chapter.caption}</span>
        </figcaption>
      </figure>
    </section>
  )
}

export default function EnergyProject() {
  return (
    <article className="energy-project">
      <header className="energy-hero">
        <div className="energy-topline">
          <Link className="back-link" to="/work">← Selected work</Link>
          <span>Energy & infrastructure · Historical case study</span>
        </div>
        <p className="energy-eyebrow energy-hero-eyebrow">Utility supply chains · Risk & procurement</p>
        <h1>Where should a utility act first?</h1>
        <p className="energy-deck">A tariff shock brings cost pressure and supply continuity into the same decision. I used inventory, spending, and trade data to separate the categories with the largest financial exposure from the items that needed the earliest operational attention.</p>

        <div className="energy-credit">
          <span>My role</span>
          <p>Responsible for the analysis in a team MMA 608 assignment based on an Ivey case concerning BC Hydro.</p>
        </div>

        <dl className="energy-highlights" aria-label="Historical case highlights">
          <div>
            <dt>Illustrative annual cost exposure</dt>
            <dd><small>≈ CAD</small> 70.7M</dd>
            <dd className="energy-highlight-note">Under the fixed 35% case scenario</dd>
          </div>
          <div>
            <dt>U.S.-origin coverage flags</dt>
            <dd>6 <small>of 24</small></dd>
            <dd className="energy-highlight-note">Days of supply below average lead time</dd>
          </div>
          <div>
            <dt>Largest U.S.-origin coverage gap</dt>
            <dd>213 <small>days</small></dd>
            <dd className="energy-highlight-note">One switchgear record in the case data</dd>
          </div>
        </dl>
      </header>

      <nav className="energy-chart-nav" aria-label="Case study figures">
        <span className="energy-nav-label">Read the evidence</span>
        <ol>
          {chapters.map(({ id, number, label }) => (
            <li key={id}><a href={`#${id}`}><span>{number}</span>{label}</a></li>
          ))}
        </ol>
      </nav>

      <div className="energy-evidence-series">
        {chapters.map((chapter) => <EvidenceChapter key={chapter.id} chapter={chapter} />)}
      </div>

      <section className="energy-conclusion" aria-labelledby="energy-conclusion-title">
        <p className="energy-eyebrow">The decision I would carry forward</p>
        <h2 id="energy-conclusion-title">Protect near-term continuity.<br />Build alternatives with evidence.</h2>
        <div className="energy-decisions">
          <div><span>First</span><p>Validate flagged items against open orders and delivery commitments.</p></div>
          <div><span>Next</span><p>Test high-exposure categories with actual origin-specific spending.</p></div>
          <div><span>Then</span><p>Qualify alternative suppliers for specifications, capacity, and delivery.</p></div>
        </div>
        <div className="energy-closing-links">
          <a className="button primary" href={repository} target="_blank" rel="noopener noreferrer">Explore the analysis on GitHub ↗</a>
          <Link className="energy-back-link" to="/work">Back to selected work →</Link>
        </div>
        <p className="energy-source-note">Academic case analysis, not a commissioned engagement or a description of current BC Hydro operations. Figures redraw saved analysis outputs. The public repository includes the curated notebook and methodology notes; the original case workbook is not redistributed.</p>
      </section>
    </article>
  )
}
