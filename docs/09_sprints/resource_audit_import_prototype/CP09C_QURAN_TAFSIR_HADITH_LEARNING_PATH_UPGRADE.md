# CP09C - Quran, Tafsir, Hadith Learning Path Upgrade

Date: 2026-06-30  
Status: Pass  
Sprint: RAFIQ Orchestrator-First Product Sprint

## Objective

Upgrade RAFIQ's learning path from a screen-level presentation into an orchestrated `GuidanceSession` structure that can carry Quran, tafsir, Hadith/Sunnah support, reflection, and one action as ordered learning steps.

## Completed

- Added `GuidanceSessionLearningPath` and `GuidanceSessionLearningPathStep` to the shared contract.
- API orchestrator now returns `session.learningPath` for every guidance session.
- Learning path steps are ordered as Quran, Tafsir, Hadith, Reflect, and Act.
- Quran-led sessions expose Quran and tafsir steps when an anchor and tafsir passage are available.
- Hadith-only scoped sessions keep Hadith available without forcing a Quran anchor.
- Learn route now renders a compact Study Flow rail before the Quran anchor.
- Added `scripts/check_cp09c_learning_path.ps1` for repeatable orchestration assertions.

## Product Owner Acceptance

| Gate | Status | Evidence |
| --- | --- | --- |
| Learning path is a contract, not only UI text. | Pass | Shared `GuidanceSession.learningPath` now drives the route. |
| Quran, tafsir, Hadith, reflection, and action are visible as one path. | Pass | `/search` renders Study Flow with five ordered steps. |
| Hadith-only mode does not invent a Quran anchor. | Pass | CP09C script verifies Hadith available while Quran/Tafsir unavailable. |
| Mobile rendering avoids repeated-label regression. | Pass | Browser check found no `TToday`, `TafsirTafsir`, or similar duplicate text. |
| Mobile rendering avoids horizontal overflow. | Pass | Browser check at 390x844 reported scroll width equal to client width. |

## Verification

- `corepack pnpm build` - Pass.
- `scripts/check_cp09b_orchestration.ps1` - Pass.
- `scripts/check_cp09c_learning_path.ps1` - Pass.
- `corepack pnpm -C apps/mobile exec expo export --platform web` - Pass.
- `scripts/check_phase5_runtime.ps1` - Pass after the mobile export completed.
- Browser verification at 390x844 on `http://127.0.0.1:8057/search` - Pass.

## Known Limits

- CP09C structures the path; it does not yet add a full tafsir reading room.
- Hadith support is still evidence-linked and private; public-grade grading and scholar-review copy remain future checkpoints.
- Ranking is deterministic and basic; deeper theme-to-ayah-to-hadith reasoning still needs future engine work.

## Close-Out

- Completed: Quran/Tafsir/Hadith learning path contract, API assembly, Learn rendering, verification script, build/export/runtime/browser checks.
- Next planned: CP10 Product Owner Go/No-Go only if current learning-path limits are accepted, otherwise continue with deeper Quran/Tafsir/Hadith learning checkpoints.
- Ad-hoc first: none blocking after CP09C.
- Checklist update: CP09C marked Pass in the orchestrator-first checklist.
- Documentation update: this report and the decision register were updated.
