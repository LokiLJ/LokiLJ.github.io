import { Link, useParams } from 'react-router-dom'
import { allProjects } from '../data/projects'
import CapstoneProject from './CapstoneProject'
import RRSProject from './RRSProject'
import QwenProject from './QwenProject'
import NurseProject from './NurseProject'
import CSDIProject from './CSDIProject'
import LoanStrategyProject from './LoanStrategyProject'

export default function Project() {
  const { projectId } = useParams()

  const specialPages = {
    'production-scheduling': CapstoneProject,
    'logistics-network': RRSProject,
    'qwen-finetuning': QwenProject,
    'nurse-staffing': NurseProject,
    'csdi-cgm': CSDIProject,
    'loan-strategy': LoanStrategyProject,
  }

  const SpecialPage = specialPages[projectId]
  if (SpecialPage) return <SpecialPage />

  const project = allProjects.find((item) => item.id === projectId)
  if (!project || project.depth !== 'deep') {
    return (
      <section className="page-hero">
        <p className="kicker">Project not found</p>
        <h1>This case study is not published as a full page.</h1>
        <Link className="button secondary" to="/work">Back to work</Link>
      </section>
    )
  }

  return (
    <>
      <section className="project-hero project-hero-v3">
        <Link className="back-link" to="/work">← Selected work</Link>
        <p className="kicker">{project.area} · {project.year}</p>
        <h1>{project.title}</h1>
        <p className="hero-copy">{project.context}</p>
        {project.role && <p className="project-role">{project.role}</p>}
        <div className="tags project-tags">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
      </section>

      {project.metric && (
        <section className="project-metric-band">
          <strong>{project.metric}</strong>
          <p>{project.metricLabel}</p>
        </section>
      )}

      <section className="section case-detail case-detail-v3">
        <div className="case-detail-grid">
          <article><span className="case-label">01 / Original question</span><h2>{project.originalQuestion}</h2></article>
          <article className="emphasis-panel"><span className="case-label">02 / Assumption that failed</span><h2>{project.wrongAssumption}</h2></article>
          <article><span className="case-label">03 / Reframing</span><p>{project.reframing}</p></article>
          <article><span className="case-label">04 / Approach</span><p>{project.approach}</p></article>
          <article><span className="case-label">05 / Result</span><p>{project.result}</p></article>
          <article><span className="case-label">06 / What it showed</span><p className="project-takeaway">{project.takeaway}</p></article>
        </div>
        <div className="visual-placeholder refined-placeholder">
          <span>Project-specific visual comes next</span>
          <p>The narrative and evidence structure is live. The next visual pass will add the project’s strongest chart, comparison, or system diagram rather than generic screenshots.</p>
        </div>
        {project.note && <p className="publication-note">{project.note}</p>}
        {project.confidentiality && <p className="publication-note">{project.confidentiality}</p>}
        <div className="project-actions">
          {project.githubUrl && <a className="button secondary" href={project.githubUrl} target="_blank" rel="noreferrer">View GitHub</a>}
          <Link className="button secondary" to="/work">Back to all work</Link>
        </div>
      </section>
    </>
  )
}
