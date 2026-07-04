# RAFIQ Mobile Companion UI/UX Rebuild CP03 Ask Rebuild Report

Date: 2026-06-28  
Status: Complete  
Plan: `RAFIQ_MOBILE_COMPANION_UIUX_REBUILD_PLAN_V2.md`

## Objective

Rebuild Ask as a companion guidance package, not a chatbot transcript or evidence dashboard.

## Implemented

- Replaced the old Ask dashboard structure.
- Added a mobile-first companion question flow:
  - natural question input;
  - starter needs;
  - primary "Guide me" action;
  - Quran-first panel;
  - meaning layer;
  - Sunnah support layer;
  - guidance panel;
  - reflection input;
  - one action dock;
  - study deeper links.
- Preserved API-backed guided answer retrieval.
- Sanitized boundary/API wording before it reaches the user.
- Removed old explanatory flow cards and trust/status strips from the product route.

## Acceptance

- Ask starts from a human need.
- Quran appears before the answer text.
- Meaning and Sunnah support are visible.
- The answer is framed as guidance/reflection support.
- Reflection and one action are part of the flow.
- No developer/process language appears in the product screen.

## Verification

- `corepack pnpm build` passed.
- `corepack pnpm -C apps/mobile exec expo export --platform web` passed.
- `scripts/check_phase5_runtime.ps1` passed.
- Browser QA at `390x844` confirmed:
  - rebuilt Ask screen is live;
  - old Companion flow dashboard is absent;
  - Quran, meaning, Sunnah, guidance, reflection, and action are present;
  - no browser console errors were reported.

## Files

- `apps/mobile/app/answer.tsx`
