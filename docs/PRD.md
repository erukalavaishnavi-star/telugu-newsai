# Product Requirements Document (PRD)

## Product Name
**Telugu NewsAI** — AI Social Media Post Generator for Telugu News

## Problem
Telugu news publishers manually rewrite every article into Facebook posts, Instagram captions, WhatsApp forwards, tweets, hashtags, and breaking alerts. This costs 30–45 minutes per story and delays distribution.

## Objective
Automate conversion of a Telugu news article into platform-ready social content in under 10 seconds while preserving factual accuracy.

## Target Users
- News editors
- Social media managers
- Digital content teams
- Telugu news publishers (TV, digital, hyperlocal)

## Core User Flow
1. Editor signs in
2. Pastes Telugu article + selects category/tone
3. AI generates multi-platform outputs
4. Editor copies or exports JSON
5. Content is saved to history for reuse

## Feature Requirements

### Must Have
| ID | Feature |
|----|---------|
| F1 | Paste article (50–5000 chars) |
| F2 | Generate 10 output types (summary, FB, IG, X, WhatsApp, YouTube, breaking, hashtags, SEO, sentiment) |
| F3 | Headline + 3 key facts extraction |
| F4 | 3 caption variations |
| F5 | Copy per block + copy all + JSON export |
| F6 | JWT authentication |
| F7 | Dashboard stats (articles, today, categories) |
| F8 | Searchable history |

### Should Have
| ID | Feature |
|----|---------|
| F9 | Category & tone selection |
| F10 | Generation progress UI |
| F11 | Role-based users (admin/editor/viewer) |

## Success Metrics
- Generation time &lt; 10s (p95)
- Editor time saved ≥ 30 min/article
- Zero fabricated facts in QA sample (manual review)

## Out of Scope (v1)
- Direct posting to Meta/X APIs
- Real-time trending hashtag API
- Multi-language beyond Telugu

## Risks
| Risk | Mitigation |
|------|------------|
| AI hallucination | Strict prompt + fact-only rules |
| API key exposure | Server-side Gemini only |
