# CP11 Guided Discovery And Sunnah Practice Rebuild

Date: 2026-07-03  
Sprint: RAFIQ Orchestrator-First Product Sprint  
Checkpoint: CP11 - User-POV Guided Knowledge UI Correction  
Status: Pass for current scope

## Objective

Correct the Search and Hadith routes from a source-browser/search-engine mental model into a user-guided knowledge delivery model.

RAFIQ must not expect a user to know which collection, source family, or technical record to browse. The route should begin from a normal user need, then open a Quran-centered guidance path with Sunnah support, caution, reflection, and one action.

## Implemented

### CP11A - Guided Discovery Search Rebuild

- Rebuilt `/search` copy and route hierarchy around `Guided discovery`.
- Changed starter prompts from abstract keywords to user-life needs:
  - `I need patience with my family`;
  - `I want to improve my prayer`;
  - `I want sincerity in my actions`;
  - `I want to respond with mercy`.
- Kept the route driven by `GuidanceSession`.
- The first result surface is now `RAFIQ Path`, followed by ordered `Guided Steps`.
- Raw search-result framing is no longer the first experience.

### CP11B - Sunnah Practice Home Rebuild

- Rebuilt `/hadith` default view as `Sunnah practice`.
- Added one user-need input: `What Sunnah do you want to practice?`.
- Added practice starters for Prayer, Intention, Patience, and Mercy.
- The page now creates:
  - a Quran-led `GuidanceSession` for the practice path;
  - a Hadith-scoped `GuidanceSession` for Sunnah support.
- The first guidance surface shows:
  - Quran lens;
  - Sunnah support;
  - verification/caution;
  - one action;
  - route to the full guided path.
- Source browsing remains available behind `Browse sources`.
- Collection/source browsing no longer dominates the first viewport.

### Orchestrator Support

- Added intention/sincerity natural-language expansion so phrases such as `I want sincerity in my actions` map to an intention guidance path.
- Verified the real endpoint at:
  - `/api/private-content/guidance/session?entryPoint=learn_theme&input=...`

## Acceptance Evidence

| Gate | Status | Evidence |
| --- | --- | --- |
| `/search` starts from user need, not raw result list. | Pass | Route renders `Guided discovery`, user-need prompt, `RAFIQ Path`, and `Guided Steps`. |
| `/hadith` starts from practice need, not collection browsing. | Pass | Route renders `Sunnah practice`, practice prompt, `Guided Sunnah Path`, Quran lens, Sunnah support, and `Browse sources`. |
| Source browsing is secondary. | Pass | Narration index is present only inside the source-browse section controlled by `Browse sources`. |
| Orchestrator supports CP11 examples. | Pass | `I need patience with my family` returns ready session, Quran `2:45`, and five learning steps. Hadith-scoped prayer returns ready session with two Sunnah supports. |
| Build passes. | Pass | `corepack pnpm build` passed. |
| Mobile export passes. | Pass | `corepack pnpm -C apps/mobile exec expo export --platform web` passed and exported bundle `index-0647751a20c66ff4e5e11a8071bc6bfa.js`. |
| Runtime passes. | Pass | `scripts/check_phase5_runtime.ps1` passed for API `8056` and mobile export `8057`. |

## Verification Note

The local Playwright browser executable was unavailable in `C:\Users\user\AppData\Local\ms-playwright\chromium_headless_shell-1200`, so a live headless visual browser run could not be completed in this pass without installing browser binaries. CP11 was still verified through build, export, runtime, route-source checks, and direct API checks.

## Known Limits

- `/search` still has a compact route structure from the existing Learn surface; deeper source inspection collapse can be improved in the next refinement.
- `/hadith` now opens a guided Sunnah path first, but source browsing still depends on available collection/narration metadata.
- Hadith semantic ranking can still improve beyond the current theme/support retrieval.
- Full mobile visual QA should be repeated when the Playwright browser binary is available or with manual Product Owner inspection on `http://localhost:8057`.

## Close-Out

- Completed: CP11A Guided Discovery Search Rebuild, CP11B Sunnah Practice Home Rebuild, intention expansion in the orchestrator, build/export/runtime checks, route-source checks, and API journey checks.
- Next planned: CP12 should deepen the knowledge delivery quality: richer tafsir reading room, better Quran-to-tafsir learning, and a stronger Hadith practice map with semantic ranking and clearer verification states.
- Ad-hoc first: restore or install the Playwright browser binary if automated visual QA is required before Product Owner review.
- Checklist update: ADHOC-004, CP11A, CP11B, and CP11C marked Pass for current scope.
- Documentation update: CP11 report created; sprint plan, acceptance checklist, and decision register updated.
