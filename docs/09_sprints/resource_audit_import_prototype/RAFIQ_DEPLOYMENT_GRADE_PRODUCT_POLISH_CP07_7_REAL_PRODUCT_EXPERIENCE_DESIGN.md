# RAFIQ CP07.7 Real Product Experience Design

Date: 2026-06-25  
Status: Implemented; Product Owner visual review required

## Objective

Move RAFIQ from a better landing page into a visible MVP Core product loop:

`check-in -> guidance package -> reflection -> action completion -> journey continuity`

This follows `RAFIQ_MVP_Scope_Lock_V1.md`, which defines the first usable RAFIQ promise as:

> A user can open RAFIQ, share their current state, receive sourced Islamic guidance, reflect on it, complete a small action, and return later with their progress preserved.

## Product Owner Navigation Issue

Product Owner reported that the top navigation was not designed correctly because it disappears when scrolling to the bottom.

Correction:

- Added shared `RafiqNavigationBar`.
- Replaced duplicated top bars on Home and private workspace routes.
- Applied `stickyHeaderIndices={[0]}` to the Home `ScrollView`.
- Applied `stickyHeaderIndices={[0]}` to the private workspace shell.
- Removed reliance on the default Expo header in prior correction, so route titles such as `index` remain hidden.

## Product Experience Additions

### Home

- Added available-time chips: `3 minutes`, `10 minutes`, `30 minutes`.
- Guidance package now responds to selected time path in copy.
- Added `Core RAFIQ Loop` section.
- Added reflection journal draft field.
- Added action completion control.
- Added learning journey previews:
  - 30 Days of Tawakkul
  - Prayer Consistency
  - Mercy and Hope

### Shared Navigation

Primary navigation now expresses RAFIQ's actual product model:

- Today
- Companion
- Quran
- Hadith
- Library

Private/internal routes may additionally show:

- Review

## Verification

Passed:

- `corepack pnpm build`
- `corepack pnpm -C apps/mobile exec expo export --platform web`
- `scripts/check_phase5_runtime.ps1`

Browser verification confirmed:

- Home contains `CORE RAFIQ LOOP`.
- Home contains reflection journal surface.
- Home contains action completion surface.
- Home contains learning journeys.
- Home contains available-time controls.
- Navigation labels render at the top.
- No browser console errors.

Note: React Native Web uses an internal scroll surface for `ScrollView`, so `window.scrollY` does not reflect user scrolling. Sticky navigation was implemented through React Native's supported `stickyHeaderIndices` mechanism rather than a browser-only CSS hack.

## Current Decision

CP07.7 is implemented as a deeper product experience correction.

Product Owner must review visually before CP08. If accepted, the next product step should connect the guidance loop to persisted user state and real private retrieval output instead of static guidance examples.
