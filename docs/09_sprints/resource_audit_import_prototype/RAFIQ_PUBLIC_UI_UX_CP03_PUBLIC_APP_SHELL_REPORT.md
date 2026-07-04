# RAFIQ Public UI/UX CP03 - Public App Shell Report

Date: 2026-06-20  
Sprint: RAFIQ Public UI/UX Implementation Sprint  
Checkpoint: CP03 - Public App Shell  
Status: Complete  
Decision: Approved for CP04 Public Landing Page

## Objective

Implement the first visible RAFIQ public app shell using the CP02 visual design system, while keeping private/internal workflows out of public navigation.

## Implemented

- Added public visual tokens for the Expo app:
  - `apps/mobile/src/theme/publicDesignSystem.ts`
- Added reusable public UI components:
  - `PublicAppShell`
  - `PublicActionCard`
  - `PublicBoundaryPanel`
  - `PublicStatusBadge`
- Converted `/` into the public RAFIQ home shell.
- Added public route shells:
  - `/public`
  - `/public/search`
  - `/public/answer`
  - `/public/quran`
  - `/public/hadith`
  - `/public/source/:id`
- Updated Expo app metadata from `RAFIQ Private` to `RAFIQ`.
- Preserved private/internal routes as direct internal routes, but removed them from public navigation.

## Public Navigation

Public navigation now exposes only:

- Home
- Search
- Ask
- Quran
- Hadith

The public shell does not expose:

- `/review`
- `/search` private route
- `/answer` private route
- `/source-detail` private route
- private retrieval traces
- validation internals
- source registry internals

## Browser Verification

Verified at:

- `http://127.0.0.1:8057/`
- `http://127.0.0.1:8057/public/search`

Observed:

| Check | Result |
| --- | --- |
| Browser title is `RAFIQ` | Pass |
| Public hero text is visible | Pass |
| Approval-boundary copy is visible | Pass |
| Public navigation links render | Pass |
| `/review` is absent from public navigation | Pass |
| `/public/search` route renders | Pass |
| Public search pending-content state renders | Pass |

## Build And Runtime Verification

| Command | Result |
| --- | --- |
| `corepack pnpm build` | Passed |
| `corepack pnpm -C apps/mobile exec expo export --platform web` | Passed |
| `scripts/check_phase5_runtime.ps1` | Passed |

Note: `expo export --platform web --clear` exceeded the command timeout during cache rebuild, but the normal Expo export completed successfully and runtime verification passed afterward.

## Acceptance Evidence

CP03 satisfies checklist items:

- UX-010: public app shell built;
- UX-011: public navigation does not expose private routes;
- UX-012: footer/source policy and public release boundary copy added.

## Remaining Boundaries

- Public pages are still shells and preview states; CP04-CP08 will deepen the actual page experiences.
- Real public content remains blocked until release approval gates pass.
- Private routes remain available for internal testing, but must stay out of public navigation.

## Next Checkpoint

Proceed to CP04: Public Landing Page.

CP04 should polish the home page into a stronger first-screen product experience with clearer calls to action, trust indicators, and approval-boundary messaging.
