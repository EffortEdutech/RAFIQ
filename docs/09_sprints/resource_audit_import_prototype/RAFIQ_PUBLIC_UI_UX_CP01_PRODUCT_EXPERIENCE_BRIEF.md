# RAFIQ Public UI/UX CP01 - Product Experience Brief

Date: 2026-06-20  
Sprint: RAFIQ Public UI/UX Implementation Sprint  
Checkpoint: CP01 - Product Experience Brief And First-Screen Promise  
Status: Complete  
Decision: Approved as the UX foundation for CP02-CP04

## CP01 Objective

Define the first visible RAFIQ product experience before implementation begins.

This checkpoint answers:

- What should a user understand within the first 5 seconds?
- What should RAFIQ feel like?
- Which user journeys must the first UI support?
- Which public and private-preview routes are allowed?
- What must remain blocked until source approval is complete?

## First-Screen Promise

RAFIQ helps you explore Islamic knowledge with calm guidance, clear sources, and careful boundaries.

Short public-facing version:

> Explore Quran, Hadith, themes, and guided answers with source-aware Islamic knowledge.

Long public-facing version:

> RAFIQ is a guided Islamic knowledge companion built around Quran, Hadith, tafsir, themes, and transparent source evidence. It helps you search, read, and ask carefully framed questions while showing what is approved, what is still under review, and where the evidence comes from.

## First 5-Second User Understanding

When the user lands on RAFIQ, they should immediately understand:

1. RAFIQ is for Islamic knowledge exploration.
2. RAFIQ values evidence and source transparency.
3. RAFIQ can support search, reading, and guided questions.
4. RAFIQ does not pretend all content is publicly approved yet.
5. RAFIQ feels calm and trustworthy, not like an admin dashboard.

## Product Tone

| Attribute | Meaning In UI |
| --- | --- |
| Calm | Spacious layout, soft contrast, low visual noise, no aggressive prompts. |
| Trustworthy | Source labels, approval status, clear boundaries, no hidden evidence. |
| Useful | Immediate paths to search, ask, read, and review sources. |
| Spiritually careful | No casual religious certainty, no unsupported prescriptions, no fatwa-like tone. |
| Human | Warm copy, understandable empty states, gentle guidance when content is unavailable. |

## What RAFIQ Is Not

RAFIQ is not:

- a fatwa engine;
- a generic chatbot;
- a black-box religious answer generator;
- a public dump of unapproved resources;
- an internal review dashboard disguised as a user product.

## Primary User Journeys

| Journey | User Intent | First UI Path | Required State |
| --- | --- | --- | --- |
| Search for knowledge | "I want to find content about patience, prayer, anxiety, family, or a verse/hadith." | Home to Public Search | Search approved public content only; show approval-pending empty state if none exists. |
| Ask a guided question | "I want help framing a question and seeing evidence." | Home to Guided Answer | Show blocked/no-public-evidence state unless approved evidence exists. |
| Read Quran preview | "I want to browse Quran reading experience." | Home to Quran Preview | Read-only shell; approved fixture or private-preview only until public approval. |
| Read Hadith preview | "I want to browse Hadith collections." | Home to Hadith Preview | Read-only shell; approved fixture or private-preview only until public approval. |
| Check source trust | "Where did this content come from?" | Result card or answer evidence to Source Detail | Show attribution/status without private internals. |
| Understand why content is unavailable | "Why are there no results yet?" | Empty state | Explain approval boundary and next step calmly. |

## Information Architecture

Top-level public experience:

- Home
- Search
- Guided Answer
- Quran Preview
- Hadith Preview
- Source Detail

Internal/private experience remains separate:

- private Quran and Hadith pages;
- private search;
- private answer testing;
- review queues;
- retrieval traces;
- validation and source registry internals.

## Route Map

| Route | Mode | Purpose | API Boundary | Status For Sprint |
| --- | --- | --- | --- | --- |
| `/` | public shell | Public home or redirect to public home. | safe static/public health only | Approved |
| `/public` | public | Public home experience. | safe static/public health only | Approved |
| `/public/search` | public | Public search page. | `/api/public-content/search` only | Approved |
| `/public/answer` | public | Guided answer page. | `/api/public-content/answer/*` only | Approved |
| `/public/source/:id` | public | Source detail and attribution. | future public source-detail API only | Approved for design |
| `/public/quran` | public preview | Quran reading shell. | approved fixture/public API only | Approved for gated preview |
| `/public/hadith` | public preview | Hadith reading shell. | approved fixture/public API only | Approved for gated preview |
| `/search` | private/internal existing | Current private search. | `private_api` through server only | Keep separate |
| `/answer` | private/internal existing | Current private answer testing. | `private_api` through server only | Keep separate |
| `/review` | private/internal existing | Internal review queues. | private only | Must not appear in public nav |
| `/source-detail` | private/internal existing | Private source detail. | private only | Must not be reused as public page without filtering |

## First Screen Content Structure

The first public screen should contain:

1. RAFIQ brand mark/name.
2. One-line first-screen promise.
3. Short supporting paragraph about source-aware Islamic knowledge.
4. Primary action: Search knowledge.
5. Secondary action: Ask a guided question.
6. Tertiary paths: Quran preview, Hadith preview, source transparency.
7. Clear note: Public content is release-filtered and approval-gated.
8. Calm trust indicators: source-aware, evidence-led, review-gated.

## First Screen Draft Copy

Hero headline:

> Islamic knowledge, guided with sources.

Hero subcopy:

> RAFIQ helps you explore Quran, Hadith, tafsir, themes, and guided answers with transparent evidence and careful review boundaries.

Primary action:

> Search knowledge

Secondary action:

> Ask with guidance

Approval boundary note:

> Public content is shown only after source, attribution, editorial, and scholar/content approval. Until then, RAFIQ can be reviewed in private preview mode.

Trust indicators:

- Source-aware
- Evidence-led
- Review-gated
- Built for careful guidance

## Empty-State Promise

If no approved public content exists, the UI must not feel broken.

Approved empty-state copy:

> Public content is being prepared for release. RAFIQ already has the search and guidance experience ready, but real sources will appear here only after approval.

Action options:

- Explore the product preview;
- Read about source approval;
- Return home.

## Visual Direction For CP02

CP02 should design around:

- warm neutral background;
- deep green or ink-toned primary color;
- soft gold/accent highlights used sparingly;
- generous spacing;
- rounded cards;
- strong typography hierarchy;
- Arabic-capable reading surfaces;
- clear source/evidence badges;
- quiet approval labels.

## CP01 Decisions

| ID | Decision | Result |
| --- | --- | --- |
| CP01-DEC-001 | First-screen promise | Approved: Islamic knowledge, guided with sources. |
| CP01-DEC-002 | Tone | Approved: calm, trustworthy, useful, spiritually careful, human. |
| CP01-DEC-003 | Primary journeys | Approved: search, guided answer, Quran preview, Hadith preview, source trust, approval-pending explanation. |
| CP01-DEC-004 | Public route map | Approved for CP02-CP04 design and implementation planning. |
| CP01-DEC-005 | Release boundary | Approved: visible UI may be built; real public content remains gated. |

## Acceptance Evidence

CP01 satisfies checklist items:

- UX-001: sprint objective and UI/UX scope approved;
- UX-002: first-screen promise defined;
- UX-003: emotional tone defined;
- UX-004: primary user journeys defined;
- UX-005: route map for public and private-preview modes defined.

## Next Checkpoint

Proceed to CP02: Visual Design System.

CP02 should convert this experience brief into concrete visual rules for colors, typography, layout, cards, states, source badges, evidence panels, and mobile-first screen composition.
