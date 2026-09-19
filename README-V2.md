# Portfolio V2 — redesign branch

This branch is the working scaffold for the next version of Wenchuan (Kevin) Zhu's portfolio.

## Repository visibility

This repository is intentionally public. The site is a recruiting portfolio and the public source code is part of the evidence. Sensitive information must never rely on repository privacy for protection.

Rules:
- Never commit passwords, API keys, tokens, private datasets, or client source data.
- NDA-restricted work is represented only by cleared methodology and aggregate results.
- Licensed teaching-case exhibits and source datasets are not republished.
- Secrets for future CMS/admin features must live in environment variables or a platform secret store.

## Goals

- Keep `main` untouched until the redesign is ready.
- Lead with evidence from selected projects rather than a résumé-style chronology.
- Organize work around Decision Systems, AI & Data Science, Healthcare, Finance & Risk, and Software.
- Preserve Teaching and About as supporting proof of communication and domain depth.
- Treat NDA and licensed-case constraints as first-class publishing rules.
- Add CMS/editor/admin functionality only after the public portfolio is stable.

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Current scope

V2.0 scaffold now includes:
- homepage and featured evidence
- five work focus areas
- six structured core case studies
- teaching, about, and contact sections
- responsive styling
- custom-domain CNAME

Planned next:
1. Dedicated case-study routes/pages
2. Project visualizations and media
3. About/experience timeline
4. Teaching library structure
5. SEO metadata and social cards
6. GitHub Pages build workflow for Vite
7. CMS + role-based editor/admin


Deployment source: GitHub Actions.
