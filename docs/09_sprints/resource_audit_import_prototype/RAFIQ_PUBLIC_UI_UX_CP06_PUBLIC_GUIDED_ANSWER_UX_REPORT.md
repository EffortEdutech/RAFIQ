# RAFIQ Public UI/UX CP06 - Public Guided Answer UX Report

Date: 2026-06-20  
Sprint: RAFIQ Public UI/UX Implementation Sprint  
Checkpoint: CP06 - Public Guided Answer UX  
Status: Complete  
Decision: Approved for CP07 Public Source Detail UX

## Objective

Connect `/public/answer` to RAFIQ's public answer and guided-answer contracts, then render the blocked no-public-evidence state in a way that is clear, careful, and useful.

## Implemented

Updated:

- `apps/mobile/src/services/publicContentApi.ts`
- `apps/mobile/app/public/answer.tsx`

The public guided answer page now:

- calls `/api/public-content/answer/draft`;
- calls `/api/public-content/answer/guided`;
- supports question entry;
- supports domain filters:
  - All;
  - Quran;
  - Tafsir;
  - Topics;
  - Themes;
  - Hadith;
- displays prompt status;
- displays response state;
- displays evidence and citation counts;
- displays model provider/model layer status;
- renders the `blocked_no_public_evidence` state;
- renders a no-evidence citation panel;
- renders answer-boundary copy;
- renders public validation gate summaries;
- includes non-fatwa and scholar-escalation boundary language;
- excludes private review routes, private traces, and internal reviewer actions.

## Public API Evidence

Verified API calls:

- `GET /api/public-content/answer/draft?q=What%20does%20Islam%20say%20about%20mercy%3F&domain=all&limit=5`
- `GET /api/public-content/answer/guided?q=What%20does%20Islam%20say%20about%20mercy%3F&domain=all&limit=5`

Observed:

| Field | Result |
| --- | --- |
| `notice.label` | `PUBLIC RELEASE FILTER ACTIVE` |
| `answerDraft.responseState` | `source_unavailable` |
| `answerDraft.evidenceItems.length` | `0` |
| `answerDraft.publicReleaseReady` | `false` |
| `guidedAnswer.promptStatus` | `blocked_no_public_evidence` |
| `guidedAnswer.evidencePrompt.length` | `0` |
| `guidedAnswer.citationIds.length` | `0` |
| `guidedAnswer.modelProvider` | `not_connected` |
| `guidedAnswer.publicReleaseReady` | `false` |

## Browser Verification

Verified at:

- `http://127.0.0.1:8057/public/answer`

Observed:

| Check | Result |
| --- | --- |
| Public-safe question panel visible | Pass |
| `Check approved public evidence` action visible | Pass |
| `blocked_no_public_evidence` visible | Pass |
| `source_unavailable` visible | Pass |
| Evidence count shows `0` | Pass |
| Citation count shows `0` | Pass |
| No-evidence citation panel visible | Pass |
| Non-fatwa boundary copy visible | Pass |
| Public validation gates visible | Pass |
| `/review` absent from public navigation | Pass |

## Build And Runtime Verification

| Command | Result |
| --- | --- |
| `corepack pnpm build` | Passed |
| `corepack pnpm -C apps/mobile exec expo export --platform web` | Passed |
| `scripts/check_phase5_runtime.ps1` | Passed |

## Acceptance Evidence

CP06 satisfies checklist items:

- UX-020: public guided answer page built;
- UX-021: `blocked_no_public_evidence` state implemented;
- UX-022: answer evidence and citation area implemented;
- UX-023: safe guidance copy and non-fatwa boundary added.

## Remaining Boundaries

- Public guided answers remain blocked until approved public evidence exists.
- Public model execution remains disabled.
- Public source-detail is still a shell until CP07.
- Private evidence, private traces, private review queues, and internal reviewer actions remain excluded from public UI.

## Next Checkpoint

Proceed to CP07: Public Source Detail UX.

CP07 should implement the public source-detail surface for attribution, source status, permitted-use notes, rollback state, and private-internal data exclusion.
