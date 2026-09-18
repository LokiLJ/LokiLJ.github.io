export const featuredProjects = [
  {
    id: 'production-scheduling',
    category: 'Decision Systems',
    eyebrow: 'Operations · Optimization · 2026',
    title: 'Production Scheduling & Inventory Optimization',
    metric: '61%',
    metricLabel: 'reduction in cost-weighted inventory waste',
    reframing: 'The throughput problem turned out to be a synchronization problem.',
    summary:
      'A cost-weighted release policy built around an external chrome-plating bottleneck, with backtesting, capacity sweeps, and a live scheduling toolchain.',
    tags: ['Python', 'Forecasting', 'Newsvendor', 'Optimization'],
    confidentiality: 'NDA-safe summary only',
  },
  {
    id: 'nurse-staffing',
    category: 'Healthcare',
    eyebrow: 'Healthcare · Forecasting · Optimization · 2026',
    title: 'Nurse Staffing Optimization',
    metric: '$100K',
    metricLabel: 'lower projected annual staffing cost',
    reframing: 'Better optimization architecture mattered more than better forecasting.',
    summary:
      'Tier-specific forecasting, correlated demand scenarios, and cross-tier substitution converted uncertain monthly demand into an annual staffing decision.',
    tags: ['R', 'Pyomo', 'Time Series', 'Scenario Analysis'],
  },
  {
    id: 'logistics-network',
    category: 'Decision Systems',
    eyebrow: 'Logistics · Stochastic Optimization · 2026',
    title: 'Stochastic Logistics Network Optimization',
    metric: '14.7M',
    metricLabel: 'order records investigated',
    reframing: 'The alarming return rate turned out to be a data-system artifact.',
    summary:
      'A two-stage stochastic capacity model built after reconstructing delivery paths and correcting structural misclassification in the operating data.',
    tags: ['Python', 'Stochastic Programming', 'kNN', 'Risk'],
  },
]

export const workAreas = [
  {
    title: 'Decision Systems',
    description: 'Forecasting, optimization, simulation, and operational decision design under uncertainty.',
  },
  {
    title: 'AI & Data Science',
    description: 'LLM fine-tuning, diffusion models, reinforcement learning, causal analysis, and applied ML.',
  },
  {
    title: 'Healthcare',
    description: 'Staffing optimization and clinically grounded physiological-sensor modelling.',
  },
  {
    title: 'Finance & Risk',
    description: 'Credit fairness, valuation, risk simulation, causal inference, and model governance.',
  },
  {
    title: 'Software',
    description: 'Deployed tools, real-time systems, dashboards, and practical automation.',
  },
]
