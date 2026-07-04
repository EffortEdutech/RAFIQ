# RAFIQ Public UI/UX CP02 - Visual Design System

Date: 2026-06-20  
Sprint: RAFIQ Public UI/UX Implementation Sprint  
Checkpoint: CP02 - Visual Design System  
Status: Complete  
Decision: Approved as the visual foundation for CP03-CP08

## CP02 Objective

Convert the CP01 product experience brief into a concrete visual system for RAFIQ public UI/UX.

This checkpoint defines:

- color palette;
- typography hierarchy;
- spacing and layout rhythm;
- card and surface system;
- source, evidence, approval, and warning badges;
- loading, empty, blocked, and error states;
- mobile-first composition rules.

## Design Direction

RAFIQ should feel like a calm Islamic knowledge companion, not a utility dashboard.

The visual language should be:

- warm, not sterile;
- grounded, not flashy;
- premium, not decorative;
- evidence-aware, not bureaucratic;
- readable for long-form Quran, Hadith, tafsir, and answer evidence;
- restrained enough to preserve religious seriousness.

## Color System

| Token | Hex | Usage |
| --- | --- | --- |
| `ink` | `#10201C` | Primary text, major headings, serious emphasis. |
| `deepGreen` | `#0F5F55` | Primary brand color, header accents, primary actions. |
| `deepGreenPressed` | `#0A453E` | Pressed/active primary action. |
| `mint` | `#DDEFE8` | Soft supporting background, calm highlights. |
| `sand` | `#F8F1E3` | App background and warm page base. |
| `paper` | `#FFFDF7` | Main card surfaces and reading panels. |
| `cream` | `#FDF7EA` | Nested surfaces, quiet empty states. |
| `gold` | `#C99A3A` | Small trust accents, dividers, badge trim. |
| `goldSoft` | `#F3E3B7` | Soft accent background. |
| `slate` | `#53605A` | Secondary text. |
| `muted` | `#7A867F` | Metadata and helper copy. |
| `line` | `#E7DCC7` | Borders and subtle dividers. |
| `success` | `#237A57` | Approved/release-ready indicators. |
| `warning` | `#A86E00` | Pending approval and caution states. |
| `danger` | `#A13D2D` | Error, rollback, blocked security state. |
| `info` | `#2F6F9F` | Neutral system information. |

## Color Rules

- Use `sand` as the main public background.
- Use `paper` for major cards and reading surfaces.
- Use `deepGreen` for primary action, but avoid flooding the screen with green.
- Use `gold` only as an accent, never as body text.
- Use `danger` only for true errors, rollback, blocked access, or serious warning.
- Keep approval-pending states warm and calm, not alarming.

## Typography

| Role | Size | Weight | Line Height | Usage |
| --- | --- | --- | --- | --- |
| Hero | 36-44 | 700 | 1.08 | First-screen promise. |
| Page Title | 28-34 | 700 | 1.15 | Screen titles. |
| Section Title | 20-24 | 700 | 1.25 | Card and section headers. |
| Body | 16-18 | 400 | 1.55 | Main explanatory copy. |
| Body Strong | 16-18 | 650 | 1.45 | Important source and evidence text. |
| Metadata | 13-14 | 500 | 1.4 | Attribution, source version, approval state. |
| Label | 12-13 | 700 | 1.2 | Badges, chips, small status labels. |
| Arabic Reading | 26-34 | 500 | 1.9 | Quran/Hadith Arabic reading surface. |
| Translation Reading | 17-19 | 400 | 1.65 | Translation and tafsir body text. |

## Typography Rules

- Public home headline should be confident but not salesy.
- Reading surfaces need more line height than navigation surfaces.
- Arabic content must be visually honored with generous spacing and right-to-left alignment.
- Metadata should be visible but quiet.
- Avoid all-caps paragraphs. All-caps may be used only for short badges.

## Spacing Scale

| Token | Value | Usage |
| --- | --- | --- |
| `space2` | 2 | Hairline separation, icon nudges. |
| `space4` | 4 | Tight inline spacing. |
| `space8` | 8 | Badge/card internal gaps. |
| `space12` | 12 | Compact card gaps. |
| `space16` | 16 | Standard screen padding on mobile. |
| `space20` | 20 | Card padding and stacked groups. |
| `space24` | 24 | Section gaps. |
| `space32` | 32 | Major block spacing. |
| `space40` | 40 | Hero separation. |
| `space56` | 56 | Large desktop/tablet section spacing. |

## Layout Rules

- Mobile first: all screens must work beautifully at 360px width.
- Use one-column mobile layout.
- Use max-width reading columns on larger screens.
- Keep primary actions near the first screen.
- Avoid dense table-like layouts in public UI.
- Put evidence and attribution close to the content they support.
- Use generous whitespace around Quran/Hadith reading surfaces.

## Radius And Elevation

| Token | Value | Usage |
| --- | --- | --- |
| `radiusSmall` | 10 | Badges, chips, compact inputs. |
| `radiusMedium` | 16 | Cards, search results, state panels. |
| `radiusLarge` | 24 | Hero cards and reading containers. |
| `radiusPill` | 999 | Pills, trust indicators, compact status badges. |
| `shadowSoft` | `0 10 30 rgba(16,32,28,0.08)` | Major elevated cards. |
| `shadowQuiet` | `0 4 14 rgba(16,32,28,0.06)` | Smaller action cards. |

## Core Components

### Public App Shell

Purpose: make RAFIQ feel like a public product while keeping private tools hidden.

Required elements:

- RAFIQ wordmark;
- public navigation: Home, Search, Ask, Quran Preview, Hadith Preview;
- source/release status link;
- no Review, Trace, Validation, private Source Detail, or internal routes.

### Hero Panel

Purpose: deliver the first-screen promise.

Required elements:

- headline: `Islamic knowledge, guided with sources.`;
- short subcopy;
- primary CTA: `Search knowledge`;
- secondary CTA: `Ask with guidance`;
- trust badges: Source-aware, Evidence-led, Review-gated.

### Content Card

Purpose: generic surface for search results, reading previews, evidence items, and source summaries.

Required elements:

- title;
- short body or excerpt;
- source/approval badge area;
- action affordance if clickable.

### Source Status Badge

Badge variants:

| Variant | Label | Color Behavior |
| --- | --- | --- |
| `approvedPublic` | Approved Public | success text on soft success background. |
| `approvalPending` | Approval Pending | warning text on soft gold background. |
| `privatePreview` | Private Preview | info text on pale blue/cream background. |
| `fixtureDemo` | Demo Fixture | muted text on cream background. |
| `blocked` | Blocked | danger text on soft danger background. |
| `rolledBack` | Rolled Back | danger border and warning copy. |

### Evidence Panel

Purpose: show answer evidence without overwhelming the user.

Required elements:

- evidence title;
- cited content snippet or reference;
- source attribution;
- approval state;
- clear note when public evidence is unavailable.

### Empty State Panel

Purpose: make pending public content feel intentional.

Required copy:

> Public content is being prepared for release. RAFIQ already has the search and guidance experience ready, but real sources will appear here only after approval.

Required actions:

- Return home;
- Explore product preview;
- View source approval note.

### Warning And Boundary Panel

Purpose: preserve religious and release safety.

Use for:

- no approved public evidence;
- content pending approval;
- public model disabled;
- source rolled back;
- non-fatwa boundary.

Tone:

- clear;
- calm;
- non-alarming unless there is a genuine error.

## State Matrix

| State | Visual Treatment | Copy Direction | Allowed Action |
| --- | --- | --- | --- |
| Loading | Skeleton cards on `paper` surface. | Minimal: `Preparing results...` | Wait or navigate back. |
| Empty Public | Warm empty panel with `approvalPending` badge. | Explain release approval boundary. | Return home, view preview, learn about approval. |
| Blocked No Evidence | Boundary panel with warning badge. | Explain approved evidence is unavailable. | Refine question, return home. |
| Error | Clear danger border and concise message. | Explain what failed without exposing internals. | Retry, return home. |
| Approved Result | Content card with source badge. | Show excerpt, reference, source. | Open result/source detail. |
| Private Preview | Clear private-preview label. | Explain not for public release. | Continue internal review. |
| Rolled Back | Strong warning panel. | Explain source was removed from public release. | Hide content, link to status if allowed. |

## Mobile-First Rules

- Minimum touch target: 44px height.
- Primary CTA should appear before the first scroll when possible.
- Cards stack vertically with 16px screen padding.
- Badges may wrap but should not truncate important status words.
- Arabic reading text should have enough vertical rhythm for comfortable recitation-like reading.
- Source metadata should sit below excerpts on mobile, not beside them.
- Avoid fixed-width elements.

## Accessibility Rules

- Text contrast should meet WCAG AA where practical.
- Do not rely on color alone for source status.
- Every icon-like status must have text.
- Links and buttons must have clear labels.
- Focus states must be visible in web builds.
- Error and blocked states must be understandable without color.

## Do Not Use

- bright neon gradients;
- heavy decorative Islamic geometry behind reading text;
- large all-caps religious claims;
- chat bubbles that make evidence look casual;
- internal labels such as `raw_object_id`, `private_api`, `trace_id`, or `service_role` in public UI;
- red warnings for ordinary approval-pending states.

## CP02 Decisions

| ID | Decision | Result |
| --- | --- | --- |
| CP02-DEC-001 | Visual style | Approved: warm, calm, source-aware, restrained, premium. |
| CP02-DEC-002 | Primary palette | Approved: `sand`, `paper`, `ink`, `deepGreen`, controlled `gold`. |
| CP02-DEC-003 | Typography | Approved: strong hero/page hierarchy, generous reading line heights, Arabic-capable surfaces. |
| CP02-DEC-004 | Component set | Approved: app shell, hero panel, content card, source badges, evidence panel, empty state, boundary panel. |
| CP02-DEC-005 | State matrix | Approved: loading, empty public, blocked no evidence, error, approved result, private preview, rolled back. |
| CP02-DEC-006 | Mobile-first rules | Approved: one-column mobile, 44px touch targets, source metadata below content. |

## Acceptance Evidence

CP02 satisfies checklist items:

- UX-006: typography, color palette, spacing scale, and card system defined;
- UX-007: source status, evidence, empty states, warnings, and citation components defined;
- UX-008: mobile-first layout rules defined;
- UX-009: loading, error, blocked, and approval-pending states defined.

Machine-readable design tokens are recorded in:

- `RAFIQ_PUBLIC_UI_UX_CP02_VISUAL_DESIGN_SYSTEM.json`

## Next Checkpoint

Proceed to CP03: Public App Shell.

CP03 should implement the public route structure, public navigation, shared shell, and safe route separation using this design system.
