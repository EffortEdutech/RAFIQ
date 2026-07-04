# RAFIQ Deployment-Grade UI/UX Reset CP03A Shared Shell Report

Date: 2026-06-27  
Sprint: RAFIQ Deployment-Grade UI/UX Reset  
Checkpoint: CP03 - Shared Design System Reset  
Status: In progress; shared shell and navigation slice complete

## Purpose

This report records the first implementation slice of CP03. The goal was to enforce the CP01/CP02 information architecture in code before rebuilding individual screens.

## Implemented

| Area | Change | Files |
| --- | --- | --- |
| Product navigation | Primary nav changed to Today, Companion, Quran, Library, Profile. | `apps/mobile/src/components/RafiqNavigationBar.tsx` |
| Internal navigation | Review now uses internal navigation treatment instead of normal product nav. | `apps/mobile/src/components/RafiqNavigationBar.tsx`, `apps/mobile/src/components/PrivateWorkspaceShell.tsx` |
| Profile shell | Added minimum Profile/Growth Memory route with preferences, saved guidance, reflection journal placeholder, action history, and privacy reassurance. | `apps/mobile/app/profile.tsx` |
| Home IA cards | Home product navigation cards now match the reset nav and frame Sunnah support through Library/context. | `apps/mobile/src/screens/public/PublicHomeScreen.tsx` |
| Typography cleanup | Legacy nonzero/negative letter spacing values were reset to `0`. | `apps/mobile/src/theme/publicDesignSystem.ts`, shell components |

## Product Decisions Enforced

- Hadith is no longer a top-level primary nav item.
- Hadith remains available as Sunnah support through `/hadith`, Library, Quran, and Companion links.
- Profile becomes a primary product destination because growth memory is part of RAFIQ's MVP promise.
- Review remains accessible for the team but is visually and navigationally internal.
- Public and private shell typography now avoids nonzero letter spacing.

## Verification

| Check | Result |
| --- | --- |
| Root API/shared build | Passed: `corepack pnpm build` |
| Expo web export | Passed: `corepack pnpm -C apps/mobile exec expo export --platform web` |
| Runtime check | Passed: `scripts/check_phase5_runtime.ps1` |
| Browser desktop smoke | Passed: Home top nav shows Profile and no top-level Hadith; Profile route loads; Review uses internal nav; no console errors. |
| Browser mobile smoke | Passed: `/profile` at 390px width shows privacy and saved-guidance content with no document-level horizontal overflow. |
| Letter-spacing scan | Passed: all remaining `letterSpacing` values in app source are `0`. |

## CP03 Remaining Work

CP03 is not fully closed yet. Remaining shared design-system work:

- create/standardize guidance package card;
- Quran evidence card;
- tafsir context card;
- Sunnah support card;
- reflection composer;
- one-action card;
- source trust chip/drawer;
- grouped knowledge path result sections;
- consistent loading, empty, and error states.

These can be implemented alongside CP04-CP08 screen rebuilds if the shared components are extracted as soon as duplication appears.

## Decision

CP03 is in progress.

Proceed next with CP03B shared guidance components or CP04 Today rebuild using the new shell.
