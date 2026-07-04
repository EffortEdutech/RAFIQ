# RAFIQ Public UI/UX Implementation Sprint Checklist

Date prepared: 2026-06-20  
Sprint: RAFIQ Public UI/UX Implementation Sprint  
Status: Complete; CP10 approved

## How To Use This Checklist

Update the status column as work progresses.

Status values:

- `Not Started`
- `In Progress`
- `Blocked`
- `Needs Review`
- `Done`

## Master Checklist

| ID | Checkpoint | Task | Status | Evidence |
| --- | --- | --- | --- | --- |
| UX-001 | CP01 | Approve sprint objective and UI/UX scope. | Done | Product Owner approved sprint pack on 2026-06-20. |
| UX-002 | CP01 | Define RAFIQ first-screen promise. | Done | `RAFIQ_PUBLIC_UI_UX_CP01_PRODUCT_EXPERIENCE_BRIEF.md` |
| UX-003 | CP01 | Define emotional tone: calm, trustworthy, useful, spiritually careful. | Done | `RAFIQ_PUBLIC_UI_UX_CP01_PRODUCT_EXPERIENCE_BRIEF.md` |
| UX-004 | CP01 | Define primary user journeys. | Done | `RAFIQ_PUBLIC_UI_UX_CP01_PRODUCT_EXPERIENCE_BRIEF.md` |
| UX-005 | CP01 | Define route map for public and private-preview modes. | Done | `RAFIQ_PUBLIC_UI_UX_CP01_PRODUCT_EXPERIENCE_BRIEF.md` |
| UX-006 | CP02 | Select typography, color palette, spacing scale, and card system. | Done | `RAFIQ_PUBLIC_UI_UX_CP02_VISUAL_DESIGN_SYSTEM.md` |
| UX-007 | CP02 | Define components for source status, evidence, empty states, warnings, and citations. | Done | `RAFIQ_PUBLIC_UI_UX_CP02_VISUAL_DESIGN_SYSTEM.md` |
| UX-008 | CP02 | Define mobile-first layout rules. | Done | `RAFIQ_PUBLIC_UI_UX_CP02_VISUAL_DESIGN_SYSTEM.md` |
| UX-009 | CP02 | Define loading, error, blocked, and approval-pending states. | Done | `RAFIQ_PUBLIC_UI_UX_CP02_VISUAL_DESIGN_SYSTEM.md` |
| UX-010 | CP03 | Build or refine public app shell. | Done | `RAFIQ_PUBLIC_UI_UX_CP03_PUBLIC_APP_SHELL_REPORT.md` |
| UX-011 | CP03 | Confirm public navigation does not expose private routes. | Done | Browser verification: `/review` absent from public navigation. |
| UX-012 | CP03 | Add footer/source policy links where relevant. | Done | Public release boundary copy added to public shell footer. |
| UX-013 | CP04 | Build public landing page. | Done | `RAFIQ_PUBLIC_UI_UX_CP04_PUBLIC_LANDING_PAGE_REPORT.md` |
| UX-014 | CP04 | Add primary user paths: search, guided answer, reading preview. | Done | Browser verification confirmed public search, guided answer, and reading preview paths. |
| UX-015 | CP04 | Add public approval boundary copy. | Done | `RAFIQ_PUBLIC_UI_UX_CP04_PUBLIC_LANDING_PAGE_REPORT.md` |
| UX-016 | CP05 | Build public search page using `/api/public-content/search`. | Done | `RAFIQ_PUBLIC_UI_UX_CP05_PUBLIC_SEARCH_UX_REPORT.md` |
| UX-017 | CP05 | Implement zero-approved-content empty state. | Done | Browser verification confirmed intentional approval-pending empty state. |
| UX-018 | CP05 | Implement approved fixture/demo result rendering. | Done | Approved-result card rendering path implemented; no real public results are active. |
| UX-019 | CP05 | Show source status and attribution summary on search result cards. | Done | Future approved-result cards include approved-public status and source-detail link behavior. |
| UX-020 | CP06 | Build public guided answer page. | Done | `RAFIQ_PUBLIC_UI_UX_CP06_PUBLIC_GUIDED_ANSWER_UX_REPORT.md` |
| UX-021 | CP06 | Implement `blocked_no_public_evidence` state. | Done | Runtime/browser verification confirmed `blocked_no_public_evidence`. |
| UX-022 | CP06 | Implement answer evidence/citation area. | Done | Evidence and citation counts render as zero with no-evidence panel. |
| UX-023 | CP06 | Add safe guidance copy and non-fatwa boundary. | Done | Non-fatwa and approved-evidence boundary copy added. |
| UX-024 | CP07 | Build public source-detail page or equivalent modal. | Done | `RAFIQ_PUBLIC_UI_UX_CP07_PUBLIC_SOURCE_DETAIL_UX_REPORT.md` |
| UX-025 | CP07 | Display attribution, license/status, source version, and rollback state. | Done | Public source-detail API/UI verification passed. |
| UX-026 | CP07 | Ensure raw-object/internal reviewer details are hidden. | Done | Public source-detail excludes raw-object paths, reviewer notes, traces, validation internals, and service-role details. |
| UX-027 | CP08 | Build Quran read-only preview surface. | Done | `RAFIQ_PUBLIC_UI_UX_CP08_QURAN_HADITH_PREVIEW_SURFACES_REPORT.md`; browser text verification confirmed `/public/quran`. |
| UX-028 | CP08 | Build Hadith read-only preview surface. | Done | `RAFIQ_PUBLIC_UI_UX_CP08_QURAN_HADITH_PREVIEW_SURFACES_REPORT.md`; browser text verification confirmed `/public/hadith`. |
| UX-029 | CP08 | Ensure preview mode is fixture/private-preview only until public approval. | Done | Public preview pages show private-preview, approval-pending, and no-public-text labels; runtime public gates remain blocked. |
| UX-030 | CP08 | Add source and approval labels to preview surfaces. | Done | Source/status rows added for source, rights, attribution, editorial, scholar/content or verification, and publication gate. |
| UX-031 | CP09 | Run browser verification for public routes. | Done | `RAFIQ_PUBLIC_UI_UX_CP09_RESPONSIVE_ACCESSIBILITY_BROWSER_QA_REPORT.md`; desktop and mobile route sweeps passed. |
| UX-032 | CP09 | Verify mobile layout. | Done | 390x844 browser viewport sweep passed with no horizontal overflow. |
| UX-033 | CP09 | Verify keyboard navigation and basic accessibility. | Done | Focusable controls have labels; touch targets are 44px or larger after fixes. |
| UX-034 | CP09 | Verify public routes cannot call private APIs. | Done | Source scan found no private API/private route matches in public screens/client; browser sweep found no private visible links. |
| UX-035 | CP09 | Verify public empty states are graceful and intentional. | Done | Public search, answer, source detail, Quran, and Hadith states remain approval-gated and product-readable. |
| UX-036 | CP10 | Prepare sprint review report. | Done | `RAFIQ_PUBLIC_UI_UX_CP10_SPRINT_REVIEW_REPORT.md` |
| UX-037 | CP10 | Prepare Go/No-Go decision register. | Done | `RAFIQ_PUBLIC_UI_UX_CP10_GO_NO_GO_DECISION_REGISTER.md` |
| UX-038 | CP10 | Update execution board, roadmap, and correction register. | Done | `EXECUTION_BOARD.md`, `PRIVATE_PLATFORM_IMPORT_ROADMAP.md`, and `CORRECTION_REGISTER.md` updated. |

## Daily Review Questions

1. What visible user experience improved today?
2. Which screen can the Product Owner review now?
3. Did any public route accidentally depend on private data or private API?
4. Are empty, blocked, loading, and error states designed?
5. Does the current UI feel like RAFIQ, or does it still feel like a test harness?

## Definition Of Done

This sprint is done when the Product Owner can open RAFIQ locally, review the public-facing flow, understand the content approval boundary, and see a polished user experience without needing to inspect backend logs or database records.
