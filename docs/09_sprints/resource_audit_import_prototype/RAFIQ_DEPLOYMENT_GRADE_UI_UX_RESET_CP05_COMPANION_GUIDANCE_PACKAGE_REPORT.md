# RAFIQ Deployment-Grade UI/UX Reset CP05 Companion Guidance Package Report

Date: 2026-06-27  
Sprint: RAFIQ Deployment-Grade UI/UX Reset  
Checkpoint: CP05 - Companion Guidance Package Rebuild  
Status: Complete

## Purpose

CP05 rebuilds `/answer` as RAFIQ's flagship Companion experience.

The page should no longer feel like a blocked API state, generic chatbot, or technical answer-policy screen. It should feel like:

```text
Need
->
Evidence
->
Guidance
->
Reflection
->
Action
```

## Implemented

File:

`apps/mobile/app/answer.tsx`

The rebuilt Companion route now includes:

- situation-first check-in;
- starter need chips;
- free-text situation input;
- real private guided-answer API retrieval;
- visible Companion flow map;
- Quran-first evidence stage;
- tafsir meaning context;
- Sunnah support context;
- source-trust strip with prompt/response/evidence status;
- guided answer after evidence;
- calm non-fatwa boundary;
- secondary evidence drawer with source and source-trust links;
- reflection composer;
- one-action card;
- Profile growth-memory path.

## Key UX Changes

| Area | Change |
| --- | --- |
| Entry | User starts with condition/need instead of technical query framing. |
| Evidence order | Quran/tafsir/Sunnah evidence appears before generated guidance. |
| Guidance answer | Guided answer is framed as reflection support after evidence. |
| Source trust | Prompt status, response state, evidence count, and source links remain available but secondary. |
| Reflection/action | Companion closes with private reflection and one practical action. |
| Growth memory | Profile path is included so Companion feels continuous. |

## Acceptance Check

| CP05 Acceptance Item | Status | Evidence |
| --- | --- | --- |
| Guided check-in, not chatbot window. | Implemented | Situation prompt, starter chips, and structured input lead the page. |
| Mood/need chips. | Implemented | Starter need chips provided. |
| Free-text situation input. | Implemented | Multiline Companion situation field. |
| Detected theme / intent. | Implemented | API `detectedIntent` is shown as the evidence stage title. |
| Quran-first evidence. | Implemented | Quran evidence card appears before the guided answer. |
| Tafsir meaning. | Implemented | Tafsir context card appears beside Quran evidence. |
| Hadith/Sunnah support. | Implemented | Sunnah support card appears beside Quran evidence. |
| Guided answer. | Implemented | Guided answer appears after evidence. |
| Reflection prompt. | Implemented | `RafiqReflectionComposer`. |
| Action step. | Implemented | `RafiqOneActionCard`. |
| Save/journal path. | Implemented | Profile growth-memory link. |
| Technical validation details hidden from primary user flow. | Implemented | Source and prompt metadata are secondary trust strip/drawer items. |

## Verification

| Check | Result |
| --- | --- |
| Root build | Passed: `corepack pnpm build` |
| Expo web export | Passed: `corepack pnpm -C apps/mobile exec expo export --platform web` |

## Browser QA

| Check | Result |
| --- | --- |
| Runtime check after dev-server restart | Passed: `scripts/check_phase5_runtime.ps1` |
| Desktop browser smoke on `/answer` | Passed: check-in, starter chips, free-text input, flow map, evidence-first stage, Quran-first card, tafsir meaning, Sunnah support, guided answer, reflection, one action, Profile path, and prompt/source status are visible. |
| Evidence before answer | Passed: browser text order confirms `Evidence first` appears before `Guided answer`. |
| Primary nav boundary | Passed: Profile is in top nav and Hadith is not top-level nav. |
| Mobile browser smoke on `/answer` | Passed at 390px width: check-in, evidence-first, reflection, and one action render with no document-level horizontal overflow. |
| Console errors | Passed: no browser console errors found during smoke checks. |

## Decision

CP05 is complete.

Proceed to CP06 - Quran Reading Room Rebuild.
