# RAFIQ Public UI/UX CP04 - Public Landing Page Report

Date: 2026-06-20  
Sprint: RAFIQ Public UI/UX Implementation Sprint  
Checkpoint: CP04 - Public Landing Page  
Status: Complete  
Decision: Approved for CP05 Public Search UX

## Objective

Polish the public home page into RAFIQ's first real product-facing landing experience.

CP04 builds on CP03's shell and CP02's visual system by adding stronger first-screen actions, trust indicators, product story, user paths, and approval-boundary messaging.

## Implemented

Updated:

- `apps/mobile/src/screens/public/PublicHomeScreen.tsx`

Added to the public landing page:

- primary CTA: `Search knowledge`;
- secondary CTA: `Ask with guidance`;
- trust indicators:
  - Source-aware;
  - Evidence-led;
  - Review-gated;
  - Built for careful guidance;
- three public user paths:
  - public search;
  - guided answer;
  - reading preview;
- product story panel: `What RAFIQ will feel like`;
- workflow cards:
  - Search with boundaries;
  - Ask with evidence;
  - Read with attribution;
- approval-boundary panel;
- local-review/public-release distinction.

## UX Outcome

The public home now communicates:

- what RAFIQ is;
- what the user can do first;
- why sources may not appear yet;
- how RAFIQ treats evidence and review boundaries;
- that this is ready for local product review, not public release.

## Browser Verification

Verified at:

- `http://127.0.0.1:8057/`

Observed:

| Check | Result |
| --- | --- |
| Browser title is `RAFIQ` | Pass |
| Hero text is visible | Pass |
| Primary CTA links to `/public/search` | Pass |
| Secondary CTA links to `/public/answer` | Pass |
| Trust indicators render | Pass |
| Product story panel renders | Pass |
| Workflow steps render | Pass |
| Approval-boundary copy renders | Pass |
| `/review` is absent from public navigation | Pass |

## Build And Runtime Verification

| Command | Result |
| --- | --- |
| `corepack pnpm build` | Passed |
| `corepack pnpm -C apps/mobile exec expo export --platform web` | Passed |
| `scripts/check_phase5_runtime.ps1` | Passed |

Runtime checker note:

- Updated `scripts/check_phase5_runtime.ps1` so the Expo home assertion checks the stable public app title `<title>RAFIQ</title>` instead of the retired `RAFIQ Private` shell text.

## Acceptance Evidence

CP04 satisfies checklist items:

- UX-013: public landing page built;
- UX-014: primary user paths added for search, guided answer, and reading preview;
- UX-015: public approval-boundary copy added and reviewed.

## Remaining Boundaries

- Real public content remains blocked until release approval gates pass.
- Public search is still a shell until CP05 connects the release-filtered public search API.
- Public guided answer remains a shell until CP06 implements the interaction and blocked-evidence UX.

## Next Checkpoint

Proceed to CP05: Public Search UX.

CP05 should connect `/public/search` to `/api/public-content/search`, render zero-approved-content empty states, and prepare approved fixture/demo result rendering.
