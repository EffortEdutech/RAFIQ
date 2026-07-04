# RAFIQ Public UI/UX CP05 - Public Search UX Report

Date: 2026-06-20  
Sprint: RAFIQ Public UI/UX Implementation Sprint  
Checkpoint: CP05 - Public Search UX  
Status: Complete  
Decision: Approved for CP06 Public Guided Answer UX

## Objective

Connect `/public/search` to RAFIQ's release-filtered public search API and make the zero-approved-content state feel intentional instead of broken.

## Implemented

Added:

- `apps/mobile/src/services/publicContentApi.ts`

Updated:

- `apps/mobile/app/public/search.tsx`

The public search page now:

- calls `/api/public-content/search`;
- supports query entry;
- supports domain filters:
  - All;
  - Quran;
  - Tafsir;
  - Topics;
  - Themes;
  - Hadith;
- displays release-filter status;
- displays approved public result count;
- displays pending-content blocking status;
- displays private-index readability status;
- renders an intentional approval-pending empty state when no public content is approved;
- includes future approved-result card rendering with source-detail link behavior;
- excludes private review routes and private retrieval trace display.

## Public API Evidence

Verified API call:

`GET /api/public-content/search?q=mercy&domain=all&limit=5&offset=0`

Observed:

| Field | Result |
| --- | --- |
| `notice.label` | `PUBLIC RELEASE FILTER ACTIVE` |
| `pagination.total` | `0` |
| `results.length` | `0` |
| `releaseFilter.status` | `active` |
| `releaseFilter.pendingContentBlocked` | `true` |
| `releaseFilter.privateSearchIndexReadable` | `false` |

## Browser Verification

Verified at:

- `http://127.0.0.1:8057/public/search`

Observed:

| Check | Result |
| --- | --- |
| Search title visible | Pass |
| Search input and search action visible | Pass |
| Domain filter controls visible | Pass |
| Release-filter status visible | Pass |
| Approved public results count visible as `0` | Pass |
| Pending content blocked visible as `true` | Pass |
| Private search index readable visible as `false` | Pass |
| Intentional empty state visible | Pass |
| `/review` absent from public navigation | Pass |

## Build And Runtime Verification

| Command | Result |
| --- | --- |
| `corepack pnpm build` | Passed |
| `corepack pnpm -C apps/mobile exec expo export --platform web` | Passed |
| `scripts/check_phase5_runtime.ps1` | Passed |

## Acceptance Evidence

CP05 satisfies checklist items:

- UX-016: public search page uses `/api/public-content/search`;
- UX-017: zero-approved-content empty state implemented;
- UX-018: approved result rendering path implemented for future approved fixture/demo results;
- UX-019: result-card source status and source-detail link behavior prepared.

## Remaining Boundaries

- Real public content remains blocked until public release approval gates pass.
- Public source-detail is still a shell until CP07.
- Public search does not expose private retrieval traces, review queues, or private source internals.

## Next Checkpoint

Proceed to CP06: Public Guided Answer UX.

CP06 should connect `/public/answer` to public answer/guided-answer APIs and render the `blocked_no_public_evidence` state with clear evidence-boundary and non-fatwa language.
