# CP12D Guidance Deep-Link Upgrade

Date: 2026-07-03  
Sprint: RAFIQ Orchestrator-First Product Sprint  
Checkpoint: CP12D - Guidance Deep-Link Upgrade  
Status: Pass for current mobile scope

## Objective

Make RAFIQ guidance results become study entry points instead of closed responses.

When RAFIQ shows a Quran lens, tafsir context, or Sunnah support, the user should be able to open deeper study immediately.

## Implemented

### Shared Mobile Component

Added:

```text
apps/mobile/src/components/GuidanceDeepLinks.tsx
```

The component renders compact mobile links from:

- `RafiqDeepLink[]`;
- `GuidanceResearchSuggestion[]`.

### Guidance Routes Upgraded

Added deep-link sections to:

- `/` Today;
- `/answer` Ask;
- `/search` Guided Discovery;
- `/hadith` Sunnah Practice.

### Deep-Link Surfaces

Quran guidance now exposes:

- Read ayah;
- Open tafsir;
- Search related Quran;
- Find Sunnah support;
- translation/tafsir/Sunnah research suggestions where available.

Sunnah guidance now exposes:

- Open narration;
- Related narrations;
- Check verification/source detail;
- Search Quran connection;
- related Hadith/Quran/verification suggestions.

Guidance-level panels now expose:

- Research this path;
- Research this answer;
- source-search route from the session source map.

## Acceptance Evidence

| Gate | Status | Evidence |
| --- | --- | --- |
| Quran lens is not a dead snippet. | Pass | Today, Ask, Learn, and Sunnah Practice render Quran anchor deep links where present. |
| Sunnah support is not a dead snippet. | Pass | Today, Ask, Learn, and Sunnah Practice render Sunnah support deep links where present. |
| Guidance can continue into Source Search. | Pass | `GuidanceDeepLinks` renders research suggestions routed to `/sources`. |
| Guidance API carries Quran deep links. | Pass | `mercy/all` guidance session returned Quran anchor `7:155`, 4 Quran deep links, 3 Quran research suggestions, and `sourceSearchRoute=/sources?q=mercy&domain=all`. |
| Guidance API carries Sunnah deep links. | Pass | `intention/hadith` guidance session returned 2 Sunnah supports; first support had 4 deep links and 3 research suggestions. |
| Build passes. | Pass | `corepack pnpm build` passed. |
| Mobile export passes. | Pass | `corepack pnpm -C apps/mobile exec expo export --platform web` passed and exported bundle `index-d59ccef5a2ede82204aba34d194eb5f3.js`. |
| Runtime passes. | Pass | `scripts/check_phase5_runtime.ps1` passed. |

## Known Limits

- Automated Playwright visual QA remains unavailable because the local Playwright browser binary is missing.
- Source detail still opens the internal trust/provenance route; CP12E should create user-facing ayah/narration study rooms.
- Deep links depend on the CP12A/CP12B backend fields. If a source lacks a target, the UI correctly hides that link.

## Close-Out

- Completed: shared deep-link component, Today/Ask/Learn/Sunnah Practice wiring, build/export/runtime/API checks.
- Next planned: CP12E - Ayah And Narration Study Rooms.
- Ad-hoc first: none blocking. Product review should inspect the new link density on mobile.
- Checklist update: CP12D marked Pass for current mobile scope; TECH-018 added.
- Documentation update: CP12D report created; sprint plan, checklist, dual-search plan, and decision register updated.
