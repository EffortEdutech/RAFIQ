# CP07 Hadith/Sunnah Verification Display

Date: 2026-06-29  
Status: Complete  
Checkpoint: CP07 - Hadith/Sunnah Verification Display

## Objective

CP07 rebuilds Hadith/Sunnah support so the user sees reliability before practice or sharing.

The page must not feel like a database browser or source-review screen. Sunnah support must stay connected to Quran-centered guidance, reflection, and one careful action.

## Product Changes

### Hadith Landing

Updated `/hadith` so it now leads with:

- check-before-practice posture;
- source family context without developer wording;
- theme selection for Intention, Mercy, Prayer, and Adab;
- featured narration with reference and grade visible;
- reliability-first reminder before the open action;
- reflection and one action;
- further support narrations.

### Hadith Detail

Rebuilt `/hadith/[hadithRecordId]` as a user-facing verification display:

- reliability first;
- grade or reliability note;
- reference and collection;
- narration text;
- connection to guidance;
- one careful action;
- before-sharing caution.

Removed the previous internal review-style surface from the user path, including source detail links, record IDs, text hashes, and raw review panels.

## Acceptance Evidence

Product Owner gate:

- reliability is visible before practice/share;
- Sunnah is connected to guidance, not decorative;
- narration, reference, collection, and grade are visible;
- user receives reflection/action support;
- no internal process wording appears in browser text checks.

Verification:

- `corepack pnpm build` passed;
- `corepack pnpm -C apps/mobile exec expo export --platform web` passed;
- `scripts/check_phase5_runtime.ps1` passed;
- browser QA at 390x844 passed for `/hadith`;
- browser QA at 390x844 passed for `/hadith/[hadithRecordId]`;
- no horizontal overflow detected;
- internal word scan returned no matches for dashboard, API, endpoint, payload, deployment, private, preview, source detail, record id, hash, or workflow.

## Browser QA Notes

`/hadith` confirmed:

- `Check before practice.`;
- `Reliability First`;
- `Source Families`;
- `Further Support`;
- no horizontal overflow.

`/hadith/[hadithRecordId]` confirmed:

- `Reliability First`;
- `Narration`;
- `Connection To Guidance`;
- `One Careful Action`;
- `Before Sharing`;
- no horizontal overflow.

## CP08 Handoff

CP08 must rebuild Growth Memory so RAFIQ preserves continuity:

- saved guidance sessions;
- saved reflections;
- action completion;
- resume unfinished guidance;
- user preferences, including Arabic font and language.

Growth must feel like memory and return, not account settings.
