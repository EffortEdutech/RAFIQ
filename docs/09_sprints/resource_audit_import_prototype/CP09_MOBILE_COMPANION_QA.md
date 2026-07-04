# CP09 Mobile Companion QA

Date: 2026-06-29  
Status: Complete  
Checkpoint: CP09 - Mobile Companion QA

## Objective

CP09 verifies RAFIQ as a mobile companion experience across core routes and device sizes.

The QA target is not only technical health. The screen must avoid developer language, overflow, cramped tap targets, desktop-grid behavior, and dashboard-like clutter.

## Routes Checked

- `/` Today
- `/answer` Ask
- `/quran/1` Read
- `/search` Learn
- `/hadith` Sunnah
- `/profile` Growth

Hadith detail was covered in CP07 and remains part of the CP09 route-risk evidence.

## Viewports Checked

- 390x844 mobile
- 430x932 mobile
- 768x1024 tablet
- 1280x720 desktop

## Verification Evidence

Commands:

- `corepack pnpm build` passed;
- `corepack pnpm -C apps/mobile exec expo export --platform web` passed;
- `scripts/check_phase5_runtime.ps1` passed;
- `GET /api/private-content/guidance/session?entryPoint=today&input=mercy&language=en&domain=all` returned a ready GuidanceSession;
- `GET http://127.0.0.1:8057/` returned HTTP 200.

Browser checks:

- 390x844 route matrix passed after data-load retest;
- 430x932 route matrix passed;
- tablet/desktop layout checks passed for overflow, tap targets, internal wording, and console errors;
- desktop route matrix passed;
- no horizontal overflow detected;
- no small visible tap targets detected;
- no app console errors detected in completed route batches;
- no visible developer/process terms detected in completed route batches.

## Timing Note

The browser automation session reset twice while performing longer tablet retests for Today. Runtime and API checks confirm Today is healthy and returns a ready session. Earlier completed browser batches confirmed phone and desktop Today rendering, and tablet layout checks reported no overflow, small targets, internal wording, or console errors.

This is recorded as a browser-tool stability limitation, not an app runtime failure.

## Product QA Outcome

CP09 passes for Product Owner acceptance:

- mobile layout does not overflow;
- tap targets remain visible;
- route UI avoids developer/process language;
- core routes deliver guidance, reading, verification, and memory;
- Growth returns saved state;
- Arabic font assets export and font preference remains verified.

## Technical Follow-Up

Carry these into CP10 review:

- mobile direct `tsc --noEmit` remains blocked by existing Expo/shared module-resolution issues documented in CP08;
- tablet Today should be manually spot-checked by Product Owner if desired because the browser automation retest reset before completion.

## CP10 Handoff

CP10 must decide Product Owner Go/No-Go:

- accept the current orchestrator-led RAFIQ loop;
- identify any product feeling gaps;
- decide GO, NO-GO, or GO with blocking fixes.
