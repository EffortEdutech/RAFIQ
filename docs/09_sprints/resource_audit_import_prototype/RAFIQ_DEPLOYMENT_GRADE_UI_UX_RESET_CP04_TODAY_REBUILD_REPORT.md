# RAFIQ Deployment-Grade UI/UX Reset CP04 Today Rebuild Report

Date: 2026-06-27  
Sprint: RAFIQ Deployment-Grade UI/UX Reset  
Checkpoint: CP04 - Today Experience Rebuild  
Status: Complete

## Purpose

CP04 rebuilds the first screen so RAFIQ communicates its product promise immediately:

> guidance, not information overload.

The Today screen now follows the locked product loop instead of behaving like a route demo or status-heavy product brochure.

## Implemented

File:

`apps/mobile/src/screens/public/PublicHomeScreen.tsx`

The rebuilt screen now follows:

```text
Greeting / user need
->
Time intention
->
Today's theme
->
Quran evidence
->
Tafsir meaning
->
Sunnah support
->
Source trust strip
->
Reflection journal
->
One action
->
Continue to Companion / Quran / Library / Profile
```

## Key Changes

| Area | Change |
| --- | --- |
| First impression | Hero now asks what the user's heart needs today and explains RAFIQ's guidance role. |
| Locked loop | Today is structured around need, evidence, reflection, action, and growth memory. |
| Quran-first hierarchy | Quran evidence is visually dominant before tafsir or Sunnah support. |
| Sunnah support | Hadith remains available contextually as Sunnah support, not a top-level content-browser prompt. |
| Reflection | Private reflection composer appears as part of the main Today flow. |
| One action | Action completion is first-class and visible without needing internal review context. |
| Product paths | Primary path cards match Today, Companion, Quran, Library, Profile. |
| Shared components | Today now uses `RafiqGuidanceComponents` instead of one-off local card styles. |

## Acceptance Check

| CP04 Acceptance Item | Status | Evidence |
| --- | --- | --- |
| User understands RAFIQ within five seconds. | Implemented | First viewport asks a personal guidance question and states the product promise. |
| Page does not feel like a dashboard. | Implemented | No metrics/status dashboard leads the page. |
| One meaningful action is visible in the main flow. | Implemented | `RafiqOneActionCard` is part of the Today flow. |
| Quran appears before AI/generic advice. | Implemented | `QuranEvidenceCard` precedes tafsir and Sunnah context. |
| Source/review status is secondary. | Implemented | `RafiqTrustStrip` appears after evidence/context, not as first impression. |

## Verification

| Check | Result |
| --- | --- |
| Root build | Passed: `corepack pnpm build` |
| Expo web export | Passed: `corepack pnpm -C apps/mobile exec expo export --platform web` |

## Browser QA

| Check | Result |
| --- | --- |
| Runtime check after dev-server restart | Passed: `scripts/check_phase5_runtime.ps1` |
| Desktop browser smoke on `/` | Passed: Today shows personal check-in, Quran-first evidence, tafsir meaning, Sunnah support, source trust, reflection journal, one meaningful action, core loop, product paths, Profile nav, and no top-level Hadith nav. |
| Mobile browser smoke on `/` | Passed at 390px width: heart-need prompt, Quran-first evidence, reflection journal, and one action render with no document-level horizontal overflow. |
| Console errors | Passed: no browser console errors found during smoke checks. |

## Decision

CP04 is complete.

Proceed to CP05 - Companion Guidance Package Rebuild.
