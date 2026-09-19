import { decisionProjects } from './decisionProjects'
import { aiProjects } from './aiProjects'
import { healthProjects } from './healthProjects'
import { financeProjects } from './financeProjects'
import { miscProjects } from './miscProjects'

export const allProjects = [
  ...decisionProjects,
  ...aiProjects,
  ...healthProjects,
  ...financeProjects,
  ...miscProjects,
]

export const featuredProjects = allProjects.filter((project) => project.featured)
export const deepProjects = allProjects.filter((project) => project.depth === 'deep')
export const compactProjects = allProjects.filter((project) => project.depth === 'compact')

export const workAreas = [
  {
    title: 'Decision Systems',
    description: 'Forecasting, stochastic optimization, scheduling, simulation, and operational decisions under uncertainty.',
  },
  {
    title: 'AI & Data Science',
    description: 'LLM fine-tuning, diffusion models, reinforcement learning, API pipelines, and experimental model diagnosis.',
  },
  {
    title: 'Healthcare',
    description: 'Staffing optimization, physiological time series, probabilistic imputation, and clinically meaningful evaluation.',
  },
  {
    title: 'Finance & Risk',
    description: 'Econometrics, credit strategy, responsible AI, valuation, causal adjustment, and model governance.',
  },
  {
    title: 'Software',
    description: 'Real-time systems, dashboards, relational data systems, and practical tools that carry analysis into use.',
  },
]
