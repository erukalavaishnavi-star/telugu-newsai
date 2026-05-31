# UI/UX Design — Telugu NewsAI

## Design Principles
- **Newsroom SaaS**: professional, fast, trustworthy
- **Telugu-first**: Tiro Telugu for generated content; Syne for headings
- **Clarity over decoration**: card-based outputs, one action per block

## Color System
| Token | Usage |
|-------|--------|
| White / Slate-50 | Page background |
| Slate-900 / Blue-900 gradient | Hero banners, nav active state |
| Red-600 | Primary CTA, brand accent, breaking news |
| Blue-50 / Blue-600 | Info badges, links |
| Per-platform pastels | Output card headers (FB blue, IG pink, etc.) |

## Layout

### Dashboard
- Hero CTA → Generator
- 4-stat grid (articles, today, time saved, avg speed)
- Recent generations (left) + category bars (right)

### Generator (2-column)
- **Left**: Article textarea, category, tone, sample loader, generate button with progress
- **Right**: Export bar → Headline/facts → Variations → Platform cards → Hashtags/SEO

### History
- Search + category chips
- Table: title, category, posts count, sentiment, date, view/delete
- Modal for full generation detail

### Auth
- Full-screen dark gradient
- Glass card, red primary button

## Interactions
| Action | Feedback |
|--------|----------|
| Generate | Telugu progress steps + shimmer skeletons |
| Copy | Button → green “Copied!” 2s |
| Export JSON | Toast + file download |
| Delete history | Toast + list refresh |

## Typography
- Headings: Syne 700–800
- UI: Inter
- Telugu body: Tiro Telugu, line-height 1.75–2

## Accessibility
- Minimum 44px touch targets on buttons
- Color + icon for sentiment (not color-only)
- Focus rings on inputs (`focus:ring-blue-100`)

## Responsive Note
Desktop-first (2-col generator). Mobile: stack columns (future enhancement).
