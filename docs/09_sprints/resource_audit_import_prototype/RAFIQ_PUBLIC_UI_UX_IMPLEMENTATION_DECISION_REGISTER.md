# RAFIQ Public UI/UX Implementation Sprint Decision Register

Date prepared: 2026-06-20  
Sprint: RAFIQ Public UI/UX Implementation Sprint  
Status: Complete; CP10 approved

## Decision Tracker

| ID | Decision | Status | Recommendation |
| --- | --- | --- | --- |
| PUX-DEC-001 | Sprint objective | Approved | Build the first polished RAFIQ public-facing UI/UX while retaining release-filtered content gates. |
| PUX-DEC-002 | Sprint name | Approved | Use `RAFIQ Public UI/UX Implementation Sprint` because the core outcome is visible product experience. |
| PUX-DEC-003 | Public release boundary | Approved | Visible public pages may be built, but real public content release remains blocked until approval gates pass. |
| PUX-DEC-004 | Demo content mode | Approved | Use approved fixture or private-preview mode for product review until real public content is approved. |
| PUX-DEC-005 | First screen priority | Approved | Prioritize public home, public search, public guided answer, and source attribution before broader browsing. |
| PUX-DEC-006 | Quran/Hadith preview handling | Approved | Build read-only preview shells, but gate real public content behind approved source versions. |
| PUX-DEC-007 | Public answer behavior | Approved | Public answer UX must show blocked/no-evidence states gracefully until approved evidence exists. |
| PUX-DEC-008 | Attribution placement | Approved | Source attribution must appear on result cards, answer evidence, reading surfaces, and source-detail pages. |
| PUX-DEC-009 | Safety language | Approved | Public UI must avoid fatwa-like certainty and preserve evidence and review boundaries. |
| PUX-DEC-010 | Sprint exit decision | Approved | CP10 will decide whether the UI is ready for stakeholder review, further polish, or blocked remediation. |
| PUX-DEC-011 | First-screen promise | Approved | Use `Islamic knowledge, guided with sources.` as the CP01 hero promise. |
| PUX-DEC-012 | CP01 experience brief | Approved | `RAFIQ_PUBLIC_UI_UX_CP01_PRODUCT_EXPERIENCE_BRIEF.md` is the UX foundation for CP02-CP04. |
| PUX-DEC-013 | CP02 visual direction | Approved | Use a warm, calm, source-aware, restrained, premium visual style. |
| PUX-DEC-014 | CP02 palette | Approved | Use `sand`, `paper`, `ink`, `deepGreen`, and controlled `gold` as the public product palette. |
| PUX-DEC-015 | CP02 component set | Approved | Use app shell, hero panel, content card, source badges, evidence panel, empty state, and boundary panel as the core public UI system. |
| PUX-DEC-016 | CP02 state matrix | Approved | Loading, empty public, blocked no evidence, error, approved result, private preview, and rolled back states are defined. |
| PUX-DEC-017 | CP03 public shell | Approved | `/` and `/public` now render the public RAFIQ shell using CP02 visual tokens. |
| PUX-DEC-018 | CP03 public navigation | Approved | Public nav exposes Home, Search, Ask, Quran, and Hadith only; private review and internal routes are excluded. |
| PUX-DEC-019 | CP03 route shells | Approved | Public route shells are in place for search, answer, Quran, Hadith, and source detail. |
| PUX-DEC-020 | CP04 public landing page | Approved | Public home now includes strong CTAs, trust indicators, workflow story, and approval-boundary messaging. |
| PUX-DEC-021 | CP04 first user paths | Approved | Landing page routes users to public search, guided answer, and reading preview without exposing private review routes. |
| PUX-DEC-022 | CP05 public search API | Approved | `/public/search` calls `/api/public-content/search` and displays release-filter status. |
| PUX-DEC-023 | CP05 empty state | Approved | Zero-approved-content state is intentional and explains approval gating. |
| PUX-DEC-024 | CP05 private boundary | Approved | Public search displays no private retrieval traces, review queues, or private route links. |
| PUX-DEC-025 | CP06 public answer APIs | Approved | `/public/answer` calls public draft and guided-answer APIs only. |
| PUX-DEC-026 | CP06 blocked evidence state | Approved | `blocked_no_public_evidence` and `source_unavailable` render as intentional public guardrail states. |
| PUX-DEC-027 | CP06 non-fatwa boundary | Approved | Public guided answer UX includes clear non-fatwa, source-evidence, and scholar escalation boundaries. |
| PUX-DEC-028 | CP07 public source-detail contract | Approved | Public source detail is separate from private source detail and returns `not_public` for pending/private entities. |
| PUX-DEC-029 | CP07 public attribution display | Approved | Public source-detail UI shows release status, attribution placeholders, permitted-use note, rollback state, and excluded private fields. |
| PUX-DEC-030 | CP08 Quran preview surface | Approved | `/public/quran` may show read-only layout and control previews, but must not expose pending Quran source text. |
| PUX-DEC-031 | CP08 Hadith preview surface | Approved | `/public/hadith` may show read-only browsing/detail previews, but must not expose pending Hadith text, grade claims, or private verification internals. |
| PUX-DEC-032 | CP08 preview labels | Approved | Quran and Hadith preview surfaces must display private-preview, approval-pending, no-public-text, source, rights, attribution, review, and publication labels. |
| PUX-DEC-033 | CP09 public route QA | Approved | Public Home, Search, Answer, Quran, Hadith, and Source Detail routes passed desktop and mobile browser verification. |
| PUX-DEC-034 | CP09 accessibility fixes | Approved | Public brand and source-status links were enlarged to satisfy 44px touch-target expectations. |
| PUX-DEC-035 | CP09 public leakage check | Approved | Public screens and public client contain no private API/private route references, and browser-visible public routes expose no private links or raw JSON. |
| PUX-DEC-036 | CP10 sprint completion | Approved | RAFIQ Public UI/UX Implementation Sprint is complete with CP01-CP10 closed and evidence recorded. |
| PUX-DEC-037 | CP10 stakeholder review decision | GO | Visible RAFIQ UI/UX is ready for private-demo stakeholder/Product Owner review behind release gates. |
| PUX-DEC-038 | CP10 public release decision | NO-GO | Public launch, public beta, public model execution, and public real-content display remain blocked until approval and hosted-public gates pass. |

## Approval Record

The Product Owner approved the sprint pack and authorized CP01 on 2026-06-20.

## Current Recommendation

Proceed to the next sprint: RAFIQ Stakeholder Demo, Approval Workflow, and Public-Readiness Hardening.

The next sprint should prepare a stakeholder demo script, public approval workflow, source approval workbench, hosted-public hardening plan, and release-candidate backlog. Public release remains NO-GO.
