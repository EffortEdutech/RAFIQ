# RAFIQ Deployment-Grade UI/UX Reset CP03B Shared Guidance Components Report

Date: 2026-06-27  
Sprint: RAFIQ Deployment-Grade UI/UX Reset  
Checkpoint: CP03 - Shared Design System Reset  
Status: Complete for shared guidance component slice

## Purpose

CP03B creates the reusable product-language components needed to rebuild RAFIQ around the locked guidance loop.

The goal is to reduce one-off screen styling and give Today, Companion, Quran, Library, Hadith/Sunnah, and Profile a shared visual grammar.

## Implemented Components

File:

`apps/mobile/src/components/RafiqGuidanceComponents.tsx`

Components:

| Component | Role |
| --- | --- |
| `RafiqCheckInPanel` | User state / need capture surface. |
| `RafiqGuidanceStage` | Screen section wrapper for guidance-loop stages. |
| `QuranEvidenceCard` | Quran-first evidence surface. |
| `RafiqContextCard` | Tafsir meaning and Sunnah support context. |
| `RafiqReflectionComposer` | Private reflection journal input. |
| `RafiqOneActionCard` | One meaningful action and completion control. |
| `RafiqTrustStrip` | Secondary source-trust/support metadata. |
| `RafiqPathSteps` | Guidance-loop step display. |
| `RafiqNavigationCard` | Product path cards for primary journey routes. |

## Design Decisions

- Quran evidence has the strongest visual weight after the user check-in.
- Tafsir and Sunnah support are separate context cards, not mixed into a generic text block.
- Reflection and action are first-class components, not afterthoughts below content.
- Source trust is visible but visually secondary.
- Navigation cards reinforce Today, Companion, Quran, Library, and Profile.

## Verification

| Check | Result |
| --- | --- |
| Root build | Passed: `corepack pnpm build` |
| Expo web export | Passed: `corepack pnpm -C apps/mobile exec expo export --platform web` |

## Decision

CP03B is complete.

The shared component set is sufficient for CP04 Today rebuild and can be extended during CP05-CP08 when duplication appears.
