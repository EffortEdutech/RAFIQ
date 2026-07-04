# RAFIQ Mobile Companion UI/UX Rebuild CP02 Today Rebuild Report

Date: 2026-06-28  
Status: Complete  
Plan: `RAFIQ_MOBILE_COMPANION_UIUX_REBUILD_PLAN_V2.md`

## Objective

Rebuild Today as the first useful RAFIQ companion screen. Today must deliver guidance immediately instead of presenting a dashboard or explaining the product.

## Implemented

- Replaced the old Today dashboard content.
- Added a focused mobile guidance flow:
  - need selector;
  - moment selector;
  - Quran reminder;
  - meaning layer;
  - Sunnah support layer;
  - reflection input;
  - one action dock;
  - continuation actions to Ask and Learn.
- Kept Today inside `CompanionDeviceShell`.
- Removed old sections:
  - product paths;
  - core loop explanation;
  - growth cards;
  - dashboard-style guidance package sections.

## First Viewport Goal

The first screen now answers the user's immediate need:

> What is your heart carrying?

The user can choose a state and receive a Quran reminder without reading product/process explanation.

## Acceptance

- Today serves the user immediately.
- Quran appears as primary guidance.
- Sunnah support is visible on the same flow.
- Reflection and one action are built in.
- Bottom device navigation remains available.
- Old dashboard sections are absent.

## Verification

- `corepack pnpm build` passed.
- `corepack pnpm -C apps/mobile exec expo export --platform web` passed.
- `scripts/check_phase5_runtime.ps1` passed.
- Browser QA at `390x844` confirmed:
  - rebuilt Today content is live;
  - old dashboard sections are absent;
  - Quran, meaning, Sunnah, reflection, and action are present;
  - no browser console errors were reported.

## Files

- `apps/mobile/src/screens/public/PublicHomeScreen.tsx`
