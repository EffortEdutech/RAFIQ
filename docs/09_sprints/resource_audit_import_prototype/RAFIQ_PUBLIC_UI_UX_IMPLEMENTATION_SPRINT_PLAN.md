# RAFIQ Public UI/UX Implementation Sprint Plan

Date prepared: 2026-06-20  
Sprint name: RAFIQ Public UI/UX Implementation Sprint  
Sprint status: Complete; CP10 approved  
Recommended duration: 10 working days  
Primary objective: Build the first polished, visible RAFIQ user experience while preserving the Phase 6 public-release gates.

## Sprint Purpose

This sprint moves RAFIQ from background infrastructure into visible product experience.

The previous phases proved that the content engine, private retrieval, public release gates, search contracts, answer contracts, attribution rules, and security boundaries exist. This sprint turns those foundations into screens a user can actually see, feel, navigate, and evaluate.

The goal is not public launch. The goal is a polished public-facing UI/UX shell and preview flow that can run safely while real public content approval remains pending.

## Product Principle

RAFIQ must feel calm, trustworthy, useful, and spiritually careful.

The first user impression should not be a database or admin system. It should feel like a guided Islamic companion with clear boundaries, beautiful reading surfaces, evidence-aware answers, and transparent source attribution.

## Public Release Boundary

This sprint may build visible public pages.

This sprint must not publish unapproved real content to public users.

Allowed content modes:

- `approved_public`: real content that has passed all release gates;
- `approved_fixture`: synthetic or test-approved content used only for development verification;
- `private_preview`: internal-only product preview using private content with clear non-public labeling;
- `empty_public`: public-ready UX showing graceful empty states while no approved real content exists.

Disallowed:

- public display of pending real content;
- public API calls to `private_api`;
- service-role credentials in the app client;
- public review queues, retrieval traces, validation internals, or source registry internals;
- public model generation over unapproved evidence.

## Sprint Outcomes

By the end of this sprint, RAFIQ should have:

- a polished public app shell and navigation;
- public landing/home page;
- public search page;
- public guided answer page;
- public source-detail and attribution page;
- empty and approval-pending states that feel intentional, not broken;
- private-preview/demo mode for visual review;
- responsive mobile-first layout;
- browser verification evidence;
- a sprint Go/No-Go decision for the next stage.

## Checkpoint Plan

| Checkpoint | Title | Output | Status |
| --- | --- | --- | --- |
| CP01 | Product Experience Brief | Define tone, UX principles, information architecture, and first-screen promise. | Done |
| CP02 | Visual Design System | Establish colors, typography, spacing, cards, states, and component rules. | Done |
| CP03 | Public App Shell | Build navigation, layout, header, footer, safe public route structure. | Done |
| CP04 | Public Landing Page | Build the first visible RAFIQ home experience and call-to-action flow. | Done |
| CP05 | Public Search UX | Build public search page using `public_api` and graceful empty states. | Done |
| CP06 | Public Guided Answer UX | Build guided question/answer page with evidence and blocked-state handling. | Done |
| CP07 | Public Source Detail UX | Build attribution/source-detail page and source trust display. | Done |
| CP08 | Quran and Hadith Preview Surfaces | Build read-only preview surfaces using approved fixture or private-preview mode only. | Done |
| CP09 | Responsive, Accessibility, and Browser QA | Verify mobile layout, keyboard flow, contrast, empty states, and blocked private routes. | Done |
| CP10 | Sprint Review and Go/No-Go | Decide whether visible RAFIQ UI/UX is ready for approval workflow and further polish. | Done |

## UX Quality Bar

Every visible screen must satisfy these rules:

- clear first impression within 5 seconds;
- calm visual hierarchy;
- no admin-like raw JSON or internal database language;
- no dead-end empty state without explanation;
- visible source and approval status where relevant;
- no fake certainty;
- no public access to private-only features;
- mobile layout must feel first-class;
- loading, error, empty, and blocked states must be designed;
- every answer-like screen must show evidence boundary and citation expectations.

## Screen Inventory

| Screen | Route Candidate | Purpose | Content Gate |
| --- | --- | --- | --- |
| Public Home | `/public` or `/` | Introduce RAFIQ and route users into search, reading, or guided answer. | Safe static content |
| Public Search | `/public/search` | Search approved public content only. | `public_api` only |
| Public Guided Answer | `/public/answer` | Ask a guided question and receive approved-evidence-only response states. | `public_api` only |
| Public Source Detail | `/public/source/:id` | Show attribution, source status, and permitted use notes. | approved source versions only |
| Public Quran Preview | `/public/quran` | Read-only Quran browsing shell for approved or fixture content. | gated |
| Public Hadith Preview | `/public/hadith` | Read-only Hadith browsing shell for approved or fixture content. | gated |
| Approval Pending | shared state | Explain why content is not publicly visible yet. | empty public |

## Technical Boundaries

- Public screens must call only `/api/public-content/*` or safe public health endpoints.
- Private screens may remain available in internal mode but must stay separate.
- Any preview of private content must be marked internal/private and must not be included in public deployment mode.
- No public screen should depend on service-role credentials.
- Public source-detail must not expose raw-object paths, internal reviewer notes, private traces, or validation internals.

## Acceptance Criteria

The sprint is complete only when:

- CP01-CP10 are completed or explicitly deferred with reasons;
- public UI routes are implemented or represented by reviewed design artifacts;
- browser verification proves the screens load;
- public search and public answer use release-filtered public APIs only;
- empty states work when approved public content count is zero;
- approved fixture/demo mode can demonstrate the intended user flow;
- public/private leakage tests pass;
- Product Owner can review the visible RAFIQ experience without reading backend logs.

## Sprint Risks

| Risk | Mitigation |
| --- | --- |
| UX becomes too technical | Use product-language copy and visual design review at CP01-CP04. |
| Empty public content looks broken | Design intentional approval-pending empty states. |
| Private data leaks into public routes | Maintain strict route/API allowlist and browser leakage tests. |
| UI is built before content approval | Use fixture/demo/private-preview modes with clear labels. |
| AI answer UX implies fatwa authority | Keep evidence, disclaimer, and escalation boundaries visible. |

## Final Sprint Decision Target

At CP10, the expected decision is one of:

- GO for public UI polish and approval workflow;
- GO for private-demo stakeholder review only;
- NO-GO until UX, security, or source-approval blockers are fixed.

Public launch remains a separate future decision.
