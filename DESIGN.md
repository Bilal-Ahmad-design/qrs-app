# QRS Design System

**Version:** 1.0 (marketing-site canonical)
**Owner:** Jordan Markwith
**Audience:** Bilal Ahmad (PM/QA), Claude Code (primary builder)
**Companion docs:** v3 Delta Memo, Questionnaire Answers

---

## 1. Design Philosophy

QRS is **Palantir-grade quantitative software for institutional risk**. The marketing site has to look the part: serious, dense, data-forward, and built to be evaluated by sophisticated buyers (CROs, chief actuaries, reinsurance treaty managers).

Three principles drive every design decision:

1. **Show the product, don't describe it.** The hero is a real screenshot of the live QRS terminal — not a mockup. Charts and KPIs are the storytelling vehicle, not stock illustration.
2. **Verifiable by design.** Every claim ties to a proof point — the cryptographic reproducibility seal, the SSRN paper, the Sousounis validation, the benchmark numbers. The visual language reinforces that we're auditable, not aspirational.
3. **Brand by construction.** The marketing site imports the product app's design tokens directly so the two surfaces are visually identical. Palantir is the reference for tone (palantir.com → foundry.palantir.com) — QRS is the source for color, type, and component vocabulary.

**Not this:** consumer-fintech gradients, oversized illustration, lifestyle photography, anything that signals "startup deck" rather than "audited platform."

---

## 2. Source of Truth

- **This file** (`DESIGN.md`) is the canonical reference for the marketing repo. Tokens defined here go directly into the Next.js Tailwind config.
- **The QRS app** (`app.qrsrisk.com`, login provisioned for Bilal) is the visual reference. When in doubt about how a component should look — the KPI strip, the seal badge, the chart treatment — open the live app and match it.
- **If the app and this doc diverge**, log it. Don't drift silently. Either the app updates or this doc updates; the two must stay in sync.

---

## 3. Color

The palette is dark teal with cream surfaces and clean white text on dark grounds. The accent teal carries CTAs; the deep tones carry trust.

### Primary palette

| Token | Hex | Use |
|---|---|---|
| `--color-ink-900` | `#0C0D0E` | Near-black; deepest background, footer |
| `--color-ink-800` | `#1B3B3A` | **Primary dark teal** — hero, header, dark sections |
| `--color-ink-700` | `#1f2124` | Cards on dark grounds |
| `--color-teal-700` | `#29908A` | Secondary teal — borders, dividers on dark |
| `--color-teal-600` | `#3C8481` | Mid teal — hovers, secondary CTAs |
| `--color-teal-500` | `#5BBAB5` | **Accent teal — primary CTA fill** (Request Demo) |
| `--color-navy-700` | `#324A6D` | Supporting navy — data viz axis, chart strokes |
| `--color-cream-50` | `#F4F6F6` | Page background on light sections, card surfaces |
| `--color-cream-100` | `#ebebeb` | Subtle dividers on light |
| `--color-text-strong` | `#0C0D0E` | Body copy on light |
| `--color-text-muted` | `#69727d` | Meta, captions, timestamps |
| `--color-white` | `#FFFFFF` | Text on dark, button labels |

### Semantic mapping

| Semantic | Token |
|---|---|
| `--bg-page-light` | `--color-cream-50` |
| `--bg-page-dark` | `--color-ink-800` |
| `--bg-page-deep` | `--color-ink-900` |
| `--bg-card-light` | `--color-white` |
| `--bg-card-dark` | `--color-ink-700` |
| `--text-on-light` | `--color-text-strong` |
| `--text-on-dark` | `--color-white` |
| `--text-muted-on-light` | `--color-text-muted` |
| `--text-muted-on-dark` | `--color-teal-700` |
| `--border-light` | `--color-cream-100` |
| `--border-dark` | `--color-teal-700` |
| `--cta-primary-bg` | `--color-teal-500` |
| `--cta-primary-bg-hover` | `--color-teal-600` |
| `--cta-primary-text` | `--color-ink-900` |
| `--link` | `--color-teal-600` (on light) / `--color-teal-500` (on dark) |

### Status colors (KPI strip, peril status badges, system status)

| Token | Hex | Use |
|---|---|---|
| `--status-ok` | `#22c55e` | Operational, healthy, validated |
| `--status-warn` | `#f59e0b` | Degraded, advisory, in-progress |
| `--status-error` | `#ef4444` | Outage, failure, blocking |
| `--status-info` | `--color-teal-500` | Neutral informational |

### Accessibility contrast requirements

Lighthouse Accessibility target is **≥ 95 on desktop and mobile** across all five P0 pages. Every text/background pair must pass WCAG AA:

- `--text-on-light` on `--bg-page-light`: contrast 17.8:1 ✓
- `--text-on-dark` on `--bg-page-dark`: contrast 12.1:1 ✓
- `--text-muted-on-light` on `--bg-page-light`: contrast 4.8:1 ✓ (right at AA — verify per layout)
- `--cta-primary-text` on `--cta-primary-bg`: contrast 11.2:1 ✓ (use ink-900, never white)
- **Avoid:** `--text-muted-on-dark` on anything lighter than `--color-ink-800`. Mid-teal-on-mid-teal is the most common a11y failure on dark themes — flag in QA.

---

## 4. Typography

### Font families

- **Display + headings:** `Outfit` (Google Fonts, weights 400/500/600/700)
- **Body + UI:** `Poppins` (Google Fonts, weights 400/500/600)
- **Mono (code, KPI numerics, tabular data):** `JetBrains Mono` (Google Fonts, weights 400/500/600)

Load all three via `next/font` with `display: 'swap'`. No webfont FOIT.

### Scale (rem-based, mobile-first)

| Token | Size | Line height | Use |
|---|---|---|---|
| `--text-display` | `3.5rem` (56px) | 1.05 | Hero H1 only |
| `--text-h1` | `2.5rem` (40px) | 1.1 | Page H1 |
| `--text-h2` | `2rem` (32px) | 1.15 | Major sections |
| `--text-h3` | `1.5rem` (24px) | 1.2 | Card titles, subsections |
| `--text-h4` | `1.25rem` (20px) | 1.3 | Component labels |
| `--text-body-lg` | `1.125rem` (18px) | 1.55 | Lead paragraphs |
| `--text-body` | `1rem` (16px) | 1.6 | Default body |
| `--text-small` | `0.875rem` (14px) | 1.5 | Captions, meta |
| `--text-micro` | `0.75rem` (12px) | 1.4 | Tags, footnotes, badge text |
| `--text-kpi` | `2.25rem` (36px) | 1 | KPI strip numerals (use mono) |

### Weight conventions

- Headings: 600 (semibold), never 700+ unless display
- Body: 400 (regular)
- Emphasis in body: 500 (medium), never italic for emphasis on dark grounds
- KPI numerics: 500 (medium), mono

---

## 5. Spacing

4px base unit, exponential scale. Use Tailwind's default scale aliased to QRS tokens.

| Token | Value | Common use |
|---|---|---|
| `--space-1` | `4px` | Icon padding |
| `--space-2` | `8px` | Inline gaps |
| `--space-3` | `12px` | Tight stacks |
| `--space-4` | `16px` | Default stack gap |
| `--space-6` | `24px` | Card padding |
| `--space-8` | `32px` | Section internal padding |
| `--space-12` | `48px` | Section break (mobile) |
| `--space-16` | `64px` | Section break (tablet) |
| `--space-24` | `96px` | Section break (desktop) |
| `--space-32` | `128px` | Hero vertical padding |

### Layout grid

- Max content width: **1280px** (`max-w-screen-xl`)
- Gutter: 24px mobile / 48px desktop
- 12-column grid for marketing pages; 8-column for legal/Trust pages

---

## 6. Radius, Borders, Elevation

### Border radius

| Token | Value | Use |
|---|---|---|
| `--radius-sm` | `4px` | Inputs, badges, tags |
| `--radius-md` | `8px` | Buttons, cards |
| `--radius-lg` | `16px` | Hero device frame, large surfaces |
| `--radius-pill` | `9999px` | Pill buttons, status chips |

### Border weights

- Default `1px` solid
- Emphasized (active state) `2px` solid

### Elevation (shadows)

Restrained, used for the hero device frame and modal/popover only. Avoid drop shadows on flat content — we're not Stripe.

| Token | Value | Use |
|---|---|---|
| `--shadow-sm` | `0 1px 2px rgba(0,0,0,0.04)` | Card hover |
| `--shadow-md` | `0 4px 12px rgba(0,0,0,0.08)` | Popover, dropdown |
| `--shadow-glow` | `0 0 60px rgba(91,186,181,0.25)` | Hero device frame soft glow |

---

## 7. Motion

Subtle, purposeful, GPU-friendly. Motion exists to direct attention or signal state, never to entertain.

### Duration

| Token | Value | Use |
|---|---|---|
| `--motion-fast` | `120ms` | Hover, focus, micro-interactions |
| `--motion-base` | `240ms` | Default transitions |
| `--motion-slow` | `480ms` | Section entrances, hero load |

### Easing

| Token | Value | Use |
|---|---|---|
| `--ease-standard` | `cubic-bezier(0.2, 0, 0, 1)` | Default |
| `--ease-emphasis` | `cubic-bezier(0.3, 0, 0.8, 0.15)` | Attention pulls |

### Reduced motion

Respect `prefers-reduced-motion: reduce` for every animation. The hero auto-loop screen capture must be replaced with the poster image when reduced-motion is set. This is a Lighthouse Best Practices and Accessibility requirement.

---

## 8. Component Patterns (marketing-specific)

These are the components the v3 memo calls for. Build each as a reusable React component in the marketing repo.

### 8.1 Hero device frame

- Dark `--bg-page-dark` background, full-bleed
- Centered MacBook / browser-chrome device frame, slightly elevated with `--shadow-glow`
- Contents: real QRS terminal screenshot (2x retina static) OR muted auto-looping screen capture (< 1.5 MB total page weight budget)
- Below device frame: H1 (display size), subhead (body-lg), primary CTA `Request Demo`, secondary CTA `Request Validation Report`
- Subtle entrance animation (`--motion-slow` fade-up, easing `--ease-standard`)
- Poster image fallback for reduced-motion users

### 8.2 KPI strip

Dense numerical strip showing the dashboard headline metrics. Used in the hero and on `/why-qrs/`.

- Background: `--bg-card-dark`
- 4–6 KPI cells, horizontally laid out, equal width
- Each cell: label (text-small, `--text-muted-on-dark`) above value (`--text-kpi`, mono, `--text-on-dark`)
- Values: Portfolio TIV, VaR 99.5%, TVaR, Capital Headroom (per v3 memo §1)
- Treat as data — don't pad with units or extra chrome

### 8.3 Lineage Verified seal badge

The single most differentiated visual element. Treat it as a first-class brand asset.

- Compact pill with a checkmark icon + "Lineage verified" label + truncated signature hash (mono)
- Color: `--color-teal-500` border, `--color-ink-800` fill, `--color-white` text
- Hover/click reveals the full ECDSA P-256 signature and a link to the open-source `qrs-replay` verifier
- Used on: hero (visible in the device frame screenshot), `/validation/`, `/trust/`, every run-result mockup

### 8.4 Trust-badge cluster

Horizontal row of small badges shown on the homepage and the Trust Center. Use SVG icons, no raster.

Badges (left to right):
1. SOC 2 in progress (Vanta)
2. Vouch-insured
3. GDPR / CCPA
4. RFC 9116 (security.txt)
5. **Cryptographic reproducibility seal** — slightly larger, highlighted with `--color-teal-500` accent

### 8.5 Peril status indicator

Reads from a CMS-managed JSON. Three states only: Production, Validation, Roadmap.

- Production: `--status-ok` dot + label
- Validation: `--status-warn` dot + label
- Roadmap: `--color-text-muted` dot + label
- Per v3 memo §4: only Florida hurricane shows `Production` at launch

### 8.6 Cards

- Light surfaces on `--bg-page-light`: white fill, `--border-light` 1px, `--radius-md`
- Dark surfaces on `--bg-page-dark`: `--bg-card-dark` fill, `--border-dark` 1px, `--radius-md`
- Default padding: `--space-6`
- No drop shadow on rest; `--shadow-sm` on hover only

### 8.7 Buttons

| Variant | Bg | Text | Border | Use |
|---|---|---|---|---|
| Primary | `--cta-primary-bg` | `--cta-primary-text` | none | Request Demo, primary CTAs |
| Secondary | transparent | `--color-teal-500` on dark / `--color-teal-700` on light | 1px matching | Secondary CTAs |
| Tertiary | transparent | `--color-teal-500` / `--color-teal-700` | none | Inline text links |

All buttons:
- Padding: `--space-3` vertical, `--space-6` horizontal
- Border-radius: `--radius-md`
- Min height: 44px (touch target)
- Focus state: 2px outline in `--color-teal-500`, offset 2px
- Hover state: `--cta-primary-bg-hover` for primary

---

## 9. Iconography & Imagery

- **Icons:** SVG only, single-color, stroke-based, 1.5px stroke weight at 24px. Lucide is the default set.
- **Product imagery:** Real screenshots from the live app only. No mockups. Use 2x retina PNG or WebP. De-identify any portfolio data before publishing.
- **No stock photography.** Ever. If a section needs a visual and no real screenshot exists, use a chart, a diagram, or empty space.
- **Charts:** Match the app's chart library (Recharts or similar). Use the data-viz palette (navy + teal pair) — never rainbow palettes.

---

## 10. Tailwind config snippet (copy-paste for `tailwind.config.ts`)

```ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          900: '#0C0D0E',
          800: '#1B3B3A',
          700: '#1f2124',
        },
        teal: {
          500: '#5BBAB5',
          600: '#3C8481',
          700: '#29908A',
        },
        navy: { 700: '#324A6D' },
        cream: {
          50:  '#F4F6F6',
          100: '#ebebeb',
        },
        muted: '#69727d',
        status: {
          ok:    '#22c55e',
          warn:  '#f59e0b',
          error: '#ef4444',
        },
      },
      fontFamily: {
        display: ['Outfit', 'sans-serif'],
        body:    ['Poppins', 'sans-serif'],
        mono:    ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        display:  ['3.5rem',  { lineHeight: '1.05' }],
        h1:       ['2.5rem',  { lineHeight: '1.1'  }],
        h2:       ['2rem',    { lineHeight: '1.15' }],
        h3:       ['1.5rem',  { lineHeight: '1.2'  }],
        h4:       ['1.25rem', { lineHeight: '1.3'  }],
        'body-lg':['1.125rem',{ lineHeight: '1.55' }],
        body:     ['1rem',    { lineHeight: '1.6'  }],
        small:    ['0.875rem',{ lineHeight: '1.5'  }],
        micro:    ['0.75rem', { lineHeight: '1.4'  }],
        kpi:      ['2.25rem', { lineHeight: '1'    }],
      },
      borderRadius: {
        sm: '4px',
        md: '8px',
        lg: '16px',
      },
      boxShadow: {
        sm:   '0 1px 2px rgba(0,0,0,0.04)',
        md:   '0 4px 12px rgba(0,0,0,0.08)',
        glow: '0 0 60px rgba(91,186,181,0.25)',
      },
      transitionDuration: {
        fast: '120ms',
        base: '240ms',
        slow: '480ms',
      },
      transitionTimingFunction: {
        standard: 'cubic-bezier(0.2, 0, 0, 1)',
        emphasis: 'cubic-bezier(0.3, 0, 0.8, 0.15)',
      },
    },
  },
  plugins: [],
};

export default config;
```

---

## 11. What to do if something isn't documented here

Three rules:

1. **Match the app first.** If the QRS terminal has a treatment for it, mirror that treatment.
2. **Ask before inventing.** New patterns (a tab system we don't have, a comparison table style, a pricing card) should be approved before they ship. Don't pull from competitor sites.
3. **Update this doc.** Anything new that's accepted gets added here so the next person (Claude Code, future contractor, future marketing hire) doesn't have to re-derive it.

---

*Last updated: 2026-06-25 · Jordan Markwith · QRS Quantum Risk Systems*
