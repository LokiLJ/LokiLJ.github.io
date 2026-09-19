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

export const coreProjects = [
  {
    id: 'production-scheduling',
    area: 'Decision Systems',
    year: '2026',
    title: 'Production Scheduling & Inventory Optimization',
    context: 'MMA capstone for Lifting Solutions Inc., an oilfield equipment manufacturer.',
    originalQuestion: 'How can production throughput be increased and work-in-process reduced?',
    wrongAssumption: 'The main constraint was not extruder throughput.',
    reframing:
      'The operating problem was a synchronization problem around an external chrome-plating bottleneck and the timing of stator–rotor pairing.',
    approach:
      'Modelled pairing as a newsvendor problem, used cost-weighted service levels and quantile forecasts, then tested release rules, capacity changes, and relocation heuristics through historical replay.',
    result:
      'The public, NDA-safe backtest showed a 61% reduction in cost-weighted inventory waste and a 66% reduction in projected average WIP. Additional extruder capacity improved the objective by under 1%, while mould availability emerged as the true bottleneck.',
    takeaway: 'Capacity investment should follow the actual bottleneck, not the most visible production step.',
    tags: ['Python', 'Optimization', 'Forecasting', 'Backtesting'],
    note: 'Only aggregate, NDA-cleared results are shown. No raw client data, part numbers, cost parameters, or reconstructible operating data are published.',
  },
  {
    id: 'nurse-staffing',
    area: 'Healthcare',
    year: '2026',
    title: 'Nurse Staffing Optimization',
    context: 'Healthcare analytics course project using a published teaching case.',
    originalQuestion: 'How many full-time-equivalent nurses should be staffed across three tiers?',
    wrongAssumption: 'Improving forecast accuracy was not the primary source of value.',
    reframing:
      'The important decision was how staffing tiers substitute for one another under uncertain monthly demand and asymmetric shortage and surplus costs.',
    approach:
      'Built tier-specific forecasts, corrected autocorrelation where justified, generated correlated scenarios with Cholesky decomposition, and compared a cross-tier linear program with a newsvendor benchmark.',
    result:
      'The optimization architecture reduced projected annual cost by $100,377 on roughly $17.8M of staffing spend, with stress testing used to bound downside risk.',
    takeaway: 'Decision architecture can matter more than squeezing another point of forecast accuracy.',
    tags: ['R', 'Pyomo', 'Time Series', 'Scenario Analysis'],
    note: 'Methodology and findings are summarized; licensed case exhibits and datasets are not reproduced.',
  },
  {
    id: 'qwen-finetuning',
    area: 'AI & Data Science',
    year: '2026',
    title: 'LLM Fine-Tuning and Reasoning Transfer — Qwen3-14B',
    context: 'Machine learning course project across mathematics and multi-turn code feedback.',
    originalQuestion: 'Does fine-tuning primarily add domain knowledge or change how the model reasons?',
    wrongAssumption: 'The adapter did more than memorize domain-specific patterns.',
    reframing:
      'The key effect was on deliberation behavior: fine-tuning reduced verbose reasoning that had been exhausting the token budget and truncating answers.',
    approach:
      'LoRA fine-tuned a 4-bit quantized Qwen3-14B, switched to bfloat16 for numerical stability, extended sequence handling, and probed transfer with held-out cognitive-trap items.',
    result:
      'Reasoning gains generalized beyond the training distribution in several tests, while failures on object-model understanding exposed the boundary between pattern completion and deeper structural reasoning.',
    takeaway: 'Model behavior can shift because of how it reasons, not only because of what it knows.',
    tags: ['PyTorch', 'LoRA', 'HuggingFace', 'LLM'],
  },
  {
    id: 'diffusion-transformer',
    area: 'AI & Data Science',
    year: '2026',
    title: 'Diffusion Transformer for Handwritten Character Generation',
    context: 'Diffusion Transformer trained from scratch on a non-benchmark traditional Chinese handwriting dataset.',
    originalQuestion: 'Which hyperparameter combination would most improve generated character quality?',
    wrongAssumption: 'Hyperparameter search was not the decisive lever.',
    reframing:
      'The loss function mattered more than every tested combination of epochs, learning rate, batch size, data volume, and model capacity.',
    approach:
      'Ran structured ablations, diagnosed underfitting and mode collapse, then compared objectives and built a denoising-difficulty diagnostic across multiple noise levels.',
    result:
      'Changing the objective from L1 to MSE produced the clearest quality improvement, consistent with the Gaussian structure of the noise-prediction task.',
    takeaway: 'A one-line modelling assumption can dominate a large hyperparameter search.',
    tags: ['PyTorch', 'Diffusion', 'Transformers', 'Ablation'],
  },
  {
    id: 'responsible-ai-credit',
    area: 'Finance & Risk',
    year: '2026',
    title: 'Responsible AI Audit — Alternative-Data Credit Scoring',
    context: 'Responsible AI course project written from the perspective of a Chief Compliance Officer.',
    originalQuestion: 'Can a credit model be treated as fair once the protected attribute is removed?',
    wrongAssumption: 'Fairness through unawareness was not sufficient.',
    reframing:
      'The audit focused on whether remaining features could reconstruct protected-group information and whether mitigation behaved consistently across model classes.',
    approach:
      'Audited Logistic Regression and XGBoost on 307,000+ applications using disparate-impact checks, SHAP analysis, proxy-gap analysis, bias repair, and deployment-monitoring design.',
    result:
      'Both models passed the 80% disparate-impact rule at the default threshold, but proxy features still encoded demographic information. A repair step worsened fairness for the linear model while the tree ensemble remained more robust.',
    takeaway: 'Passing a headline fairness metric is not the same as being governance-ready.',
    tags: ['XGBoost', 'SHAP', 'Fairness', 'Model Governance'],
  },
  {
    id: 'gomoku',
    area: 'Software',
    year: '2026',
    title: 'Real-Time Multiplayer Game Server — Gomoku',
    context: 'Personal software project, originally built for a friend.',
    originalQuestion: 'How do you make a real-time multiplayer game robust when players can disconnect, pause, undo, spectate, or time out?',
    wrongAssumption: 'The board logic was only a small part of the system.',
    reframing:
      'The real engineering problem was authoritative shared state and protocol design under concurrency.',
    approach:
      'Built a FastAPI/WebSocket server with asyncio, server-side validation, player/spectator roles, timer broadcasting, graceful disconnect handling, a consent-based undo protocol, and an authenticated admin interface.',
    result:
      'Deployed a working multiplayer service with persistent leaderboard support and live room configuration.',
    takeaway: 'Reliable real-time software is mostly about state transitions, edge cases, and protocol discipline.',
    tags: ['Python', 'FastAPI', 'WebSockets', 'asyncio'],
    githubUrl: 'https://github.com/LokiLJ/gomoku',
    note: 'The live demo remains access-gated; the public portfolio will use screenshots or a short recording rather than exposing the private access question.',
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
