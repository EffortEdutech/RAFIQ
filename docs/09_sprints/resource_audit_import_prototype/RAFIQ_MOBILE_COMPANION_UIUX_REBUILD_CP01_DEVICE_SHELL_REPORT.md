# RAFIQ Mobile Companion UI/UX Rebuild CP01 Device Shell Report

Date: 2026-06-28  
Status: Complete  
Plan: `RAFIQ_MOBILE_COMPANION_UIUX_REBUILD_PLAN_V2.md`

## Objective

Create the mobile-first RAFIQ companion foundation before rebuilding screen content.

## Implemented

- Added mobile companion design tokens:
  - color system;
  - spacing scale;
  - typography scale;
  - radii;
  - device width;
  - bottom navigation height;
  - minimum touch target.
- Added `CompanionDeviceShell`.
- Added `BottomDeviceNav`.
- Product routes now use the device shell through `PrivateWorkspaceShell`.
- Today route now uses `CompanionDeviceShell` directly.
- Internal review routes remain separated from the product shell.

## New Main Navigation

- Today
- Ask
- Read
- Learn
- Growth

Hadith/Sunnah is treated as part of Learn and as support inside product flows, not as a hidden developer route.

## Acceptance Notes

CP01 does not claim final UI quality. It only establishes the required mobile/device foundation so CP02 onward can rebuild real screen content inside the right shell.

## Verification

- `corepack pnpm build` passed.
- `corepack pnpm -C apps/mobile exec expo export --platform web` passed.
- `scripts/check_phase5_runtime.ps1` passed.
- Browser QA at `390x844` passed for:
  - `/`
  - `/answer`
  - `/quran/1`
  - `/search`
  - `/profile`
- Verified:
  - RAFIQ Quran-guided companion header renders;
  - bottom device navigation renders with Today, Ask, Read, Learn, Growth;
  - old web top navigation is no longer the product shell;
  - no browser console errors were reported.

## Files

- `apps/mobile/src/theme/mobileCompanionDesignSystem.ts`
- `apps/mobile/src/components/CompanionDeviceShell.tsx`
- `apps/mobile/src/components/BottomDeviceNav.tsx`
- `apps/mobile/src/components/PrivateWorkspaceShell.tsx`
- `apps/mobile/src/screens/public/PublicHomeScreen.tsx`
- `apps/mobile/app/_layout.tsx`
