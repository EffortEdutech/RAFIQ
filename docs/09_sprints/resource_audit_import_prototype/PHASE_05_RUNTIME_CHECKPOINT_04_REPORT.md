# Phase 5 Runtime Checkpoint 04 Report

Date: 2026-06-18  
Status: Complete  
Scope: Dependency install, NestJS API run, Expo web run, and private content verification.

## Completed Work

Installed workspace dependencies with pnpm and configured:

- `.npmrc` with `node-linker=hoisted` for Expo/Metro compatibility.
- root `package.json` build/check/start scripts.
- `apps/mobile/metro.config.js` for monorepo Metro resolution.
- `apps/mobile/index.js` as a local Expo Router entrypoint.
- `scripts/start_phase5_apps.ps1`.
- `scripts/check_phase5_runtime.ps1`.

Activated runtime services:

- NestJS API: `http://127.0.0.1:8056`
- Expo web preview: `http://127.0.0.1:8057`

The temporary Python private bridge remains available on `8055` during the
transition, but Checkpoint 04 verifies the new NestJS/Expo path.

## API Verification

The NestJS API successfully serves:

- `GET /api/private-content/quran/surah/1`
- `GET /api/private-content/hadith/collections`
- `GET /api/private-content/hadith/records`
- `GET /api/private-content/hadith/record/{hadithRecordId}`

Verified values:

- Quran Surah 1 returns 7 ayahs.
- Hadith collections return 70 collections.
- `fawaz-linebyline:bukhari` English returns total `7,563`.
- Hadith detail returns text versions.
- All checked responses include `UNAPPROVED CONTENT - NOT FOR PUBLICATION`.

## Mobile/Web Verification

Expo web export passed:

- `apps/mobile/dist/index.html` generated.
- Web bundle generated successfully.

Browser verification passed:

- `/` renders RAFIQ Private landing page.
- `/quran/1` renders private warning, Surah 1, and Arabic Quran text.
- `/hadith` renders private warning and Hadith collection data.
- Browser console error check returned no errors.

## Commands Passed

- `corepack pnpm install`
- `corepack pnpm -C packages/shared build`
- `corepack pnpm -C apps/api build`
- `corepack pnpm exec tsc -p apps/mobile/tsconfig.json --noEmit`
- `corepack pnpm -C apps/mobile exec expo export --platform web --clear`
- `scripts/start_phase5_apps.ps1`
- `scripts/check_phase5_runtime.ps1`
- `scripts/verify_phase5_app_scaffold.py`

Runtime verifier result:

```text
Status             : pass
ApiUrl             : http://127.0.0.1:8056
ExpoUrl            : http://127.0.0.1:8057
QuranAyahs         : 7
HadithCollections  : 70
HadithBukhariTotal : 7563
MobileExport       : C:\Users\user\Documents\00 RAFIQ\apps\mobile\dist\index.html
```

## Notes

- Expo initially required web dependencies and pnpm/Metro hoisting adjustments;
  these are now recorded in the workspace.
- Expo still prints compatibility warnings in this environment because the
  hoisted dependency graph can expose alternate transitive copies, but the
  direct mobile package versions were aligned with SDK 51 and export/browser
  verification passed.
- Public release remains blocked pending rights, attribution, editorial,
  scholar/content, and Product Owner approvals.

## Gate Decision

Checkpoint 04 is approved. Phase 5 may proceed to Checkpoint 05: replace the
remaining temporary bridge dependency, add DTO validation/OpenAPI/error shape,
and begin richer private Quran/Hadith product workflows.
