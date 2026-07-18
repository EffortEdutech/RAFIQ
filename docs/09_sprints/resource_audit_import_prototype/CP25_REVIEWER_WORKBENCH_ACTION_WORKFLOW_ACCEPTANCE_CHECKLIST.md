# CP25 - Reviewer Workbench Action Workflow Acceptance Checklist

Date: 2026-07-14

Status: CP25 complete; recommended next scope CP26

Scope: Private reviewer workbench action workflow after CP24 graph-aware retrieval prototype close-out.

## Status Legend

- Pass: implemented or documented and verified for the checkpoint.
- Fail: implemented or documented but verification failed.
- Not Started: planned but not yet implemented.
- Blocked: cannot proceed without missing input, data, or decision.
- Deferred: intentionally moved outside CP25.

## 1. Program Readiness

| ID | Acceptance item | Status | Evidence |
| --- | --- | --- | --- |
| CP25-R01 | CP25 is documented as the post-CP24 reviewer workbench action workflow. | Pass | `CP25_REVIEWER_WORKBENCH_ACTION_WORKFLOW_SPRINT_PLAN.md`. |
| CP25-R02 | CP24 close-out is the controlling baseline. | Pass | `CP24_G09_CLOSE_OUT_AND_NEXT_SCOPE_DECISION.md`. |
| CP25-R03 | CP23 reviewer workflow and UI plans are controlling inputs. | Pass | `CP23_A04_REVIEWER_WORKFLOW_CONTRACT.md`; `CP23_A05_INTERNAL_UI_WORKBENCH_PLAN.md`. |
| CP25-R04 | CP25 remains private-only and does not approve public release. | Pass | CP25 sprint plan product boundaries. |
| CP25-R05 | CP24 remediation, route, selected-candidate, and public-safe zero counts are acknowledged. | Pass | CP25 sprint plan baseline section. |

## 2. CP25-A01 Action Workflow Architecture And Case Matrix

| ID | Acceptance item | Status | Evidence |
| --- | --- | --- | --- |
| CP25-A01-01 | Action workflow architecture note is complete. | Pass | `CP25_A01_ACTION_WORKFLOW_ARCHITECTURE_AND_CASE_MATRIX.md`. |
| CP25-A01-02 | Action and role matrix is complete. | Pass | `CP25_A01_ACTION_WORKFLOW_ARCHITECTURE_AND_CASE_MATRIX.md`. |
| CP25-A01-03 | CP24 fixture-to-review-case map is complete. | Pass | `CP25_A01_ACTION_WORKFLOW_ARCHITECTURE_AND_CASE_MATRIX.md`. |
| CP25-A01-04 | Allowed transition and required notes policy is complete. | Pass | `CP25_A01_ACTION_WORKFLOW_ARCHITECTURE_AND_CASE_MATRIX.md`. |
| CP25-A01-05 | Rollback and verifier plan is complete. | Pass | `CP25_A01_ACTION_WORKFLOW_ARCHITECTURE_AND_CASE_MATRIX.md`; `scripts/check_cp25_a01_action_workflow_plan.mjs`. |

## 3. CP25-A02 Request, Response, And State Contracts

| ID | Acceptance item | Status | Evidence |
| --- | --- | --- | --- |
| CP25-A02-01 | Reviewer action request contract is implemented. | Pass | `packages/shared/src/private-content.ts`; `CP25_A02_REQUEST_RESPONSE_AND_STATE_CONTRACTS.md`. |
| CP25-A02-02 | Reviewer action response contract is implemented. | Pass | `packages/shared/src/private-content.ts`; `CP25_A02_REQUEST_RESPONSE_AND_STATE_CONTRACTS.md`. |
| CP25-A02-03 | Review queue and remediation state contracts are implemented. | Pass | `packages/shared/src/private-content.ts`; `CP25_A02_REQUEST_RESPONSE_AND_STATE_CONTRACTS.md`. |
| CP25-A02-04 | Audit event contract is implemented. | Pass | `packages/shared/src/private-content.ts`; `CP25_A02_REQUEST_RESPONSE_AND_STATE_CONTRACTS.md`. |
| CP25-A02-05 | Public-boundary contract keeps public-safe and publication fields false by default. | Pass | `packages/shared/src/private-content.ts`; `scripts/check_cp25_a02_contracts.mjs`. |

## 4. CP25-A03 Review Queue And Remediation State Export

| ID | Acceptance item | Status | Evidence |
| --- | --- | --- | --- |
| CP25-A03-01 | Review queue export is generated from CP24 outputs. | Pass | `data/review/cp25/review-queue.json`; `scripts/generate_cp25_review_queue_remediation_state.mjs`. |
| CP25-A03-02 | Remediation state export represents or explicitly defers all 72 CP24 remediation items. | Pass | `data/review/cp25/remediation-state.json`; `data/review/cp25/manifest.json`. |
| CP25-A03-03 | Role assignment and blocker summaries are generated. | Pass | `data/review/cp25/state-summary.json`; `data/review/cp25/manifest.json`. |
| CP25-A03-04 | Queue/remediation items reference CP24 route, candidate, and remediation IDs. | Pass | `scripts/check_cp25_a03_review_queue_exports.mjs`. |
| CP25-A03-05 | Public-safe counts remain zero. | Pass | `data/review/cp25/manifest.json`; `scripts/check_cp25_a03_review_queue_exports.mjs`. |

## 5. CP25-A04 Audit Event And Decision Ledger

| ID | Acceptance item | Status | Evidence |
| --- | --- | --- | --- |
| CP25-A04-01 | Audit event schema is implemented. | Pass | `data/review/cp25/audit-events.json`; `data/review/cp25/transition-rules.json`. |
| CP25-A04-02 | Decision ledger artifact is generated. | Pass | `data/review/cp25/decision-ledger.json`; `data/review/cp25/audit-decision-ledger-manifest.json`. |
| CP25-A04-03 | Action-to-transition verifier is implemented. | Pass | `scripts/check_cp25_a04_audit_decision_ledger.mjs`; `data/review/cp25/invalid-action-fixtures.json`. |
| CP25-A04-04 | Required notes verifier is implemented. | Pass | `scripts/check_cp25_a04_audit_decision_ledger.mjs`; `data/review/cp25/invalid-action-fixtures.json`. |
| CP25-A04-05 | Audit events cannot publish content. | Pass | `data/review/cp25/audit-events.json`; `scripts/check_cp25_a04_audit_decision_ledger.mjs`. |

## 6. CP25-A05 Private API Prototype

| ID | Acceptance item | Status | Evidence |
| --- | --- | --- | --- |
| CP25-A05-01 | Private reviewer action route is implemented. | Pass | `apps/api/src/modules/private-content/private-content.controller.ts`; `scripts/check_cp25_a05_private_api_prototype.mjs`. |
| CP25-A05-02 | Private remediation transition route is implemented. | Pass | `apps/api/src/modules/private-content/private-content.service.ts`; `apps/api/src/modules/private-content/private-content.dto.ts`. |
| CP25-A05-03 | Private audit/ledger preview route is implemented. | Pass | `apps/api/src/modules/private-content/private-content.service.ts`; `apps/mobile/src/services/privateContentApi.ts`. |
| CP25-A05-04 | Invalid actions fail safely. | Pass | `apps/api/src/modules/private-content/private-content.service.ts`; `scripts/check_cp25_a05_private_api_prototype.mjs`. |
| CP25-A05-05 | No public CP25 route is introduced. | Pass | `apps/api/src/modules/private-content/private-content.controller.ts`; `scripts/check_cp25_a05_private_api_prototype.mjs`. |

## 7. CP25-A06 Internal UI Action Controls

| ID | Acceptance item | Status | Evidence |
| --- | --- | --- | --- |
| CP25-A06-01 | Internal reviewer action controls are visible. | Pass | `apps/mobile/app/review-workbench.tsx`; `scripts/check_cp25_a06_internal_ui_action_controls.mjs`. |
| CP25-A06-02 | Required notes field is enforced in UI flow. | Pass | `apps/mobile/app/review-workbench.tsx`; `CP25_A06_INTERNAL_UI_ACTION_CONTROLS.md`. |
| CP25-A06-03 | Audit preview is visible before submit. | Pass | `apps/mobile/app/review-workbench.tsx`; `scripts/check_cp25_a06_internal_ui_action_controls.mjs`. |
| CP25-A06-04 | Remediation state controls are visible. | Pass | `apps/mobile/app/review-workbench.tsx`; `CP25_A06_INTERNAL_UI_ACTION_CONTROLS.md`. |
| CP25-A06-05 | Private mode ribbon and public-release blocked warning remain visible. | Pass | `apps/mobile/app/review-workbench.tsx`; `scripts/check_cp25_a06_internal_ui_action_controls.mjs`. |

## 8. CP25-A07 Audit Export And Remediation Review Proof

| ID | Acceptance item | Status | Evidence |
| --- | --- | --- | --- |
| CP25-A07-01 | Audit event export is generated. | Pass | `data/review/cp25/a07-audit-event-export.json`; `scripts/check_cp25_a07_audit_remediation_exports.mjs`. |
| CP25-A07-02 | Remediation transition export is generated. | Pass | `data/review/cp25/a07-remediation-transition-export.json`; `scripts/check_cp25_a07_audit_remediation_exports.mjs`. |
| CP25-A07-03 | Reviewer workload and blocker summaries are generated. | Pass | `data/review/cp25/a07-reviewer-workload-summary.json`; `data/review/cp25/a07-unresolved-action-report.json`. |
| CP25-A07-04 | Resolved/deferred/rejected states preserve history. | Pass | `data/review/cp25/a07-remediation-transition-export.json`; `CP25_A07_AUDIT_EXPORT_AND_REMEDIATION_REVIEW_PROOF.md`. |
| CP25-A07-05 | Public-safe counts remain zero. | Pass | `data/review/cp25/a07-export-manifest.json`; `scripts/check_cp25_a07_audit_remediation_exports.mjs`. |

## 9. CP25-A08 Combined Verification

| ID | Acceptance item | Status | Evidence |
| --- | --- | --- | --- |
| CP25-A08-01 | Combined verifier exists. | Pass | `scripts/check_cp25_a08_combined_verification.mjs`. |
| CP25-A08-02 | CP24 close-out verifier is inherited. | Pass | `scripts/check_cp25_a08_combined_verification.mjs`; `scripts/check_cp24_close_out.mjs`. |
| CP25-A08-03 | Transition, audit, and required-notes checks pass. | Pass | `scripts/check_cp25_a07_audit_remediation_exports.mjs`; `scripts/check_cp25_a08_combined_verification.mjs`. |
| CP25-A08-04 | Private API and UI boundary checks pass. | Pass | `apps/api/src/modules/private-content/private-content.controller.ts`; `apps/mobile/app/review-workbench.tsx`. |
| CP25-A08-05 | Public boundary checks pass and public-safe counts remain zero. | Pass | `data/review/cp25/a07-export-manifest.json`; `scripts/check_cp25_a08_combined_verification.mjs`. |

## 10. CP25-A09 Close-Out And Next Scope Decision

| ID | Acceptance item | Status | Evidence |
| --- | --- | --- | --- |
| CP25-A09-01 | CP25 close-out report is complete. | Pass | `CP25_A09_CLOSE_OUT_AND_NEXT_SCOPE_DECISION.md`; `scripts/check_cp25_a09_close_out.mjs`. |
| CP25-A09-02 | Final checklist is complete. | Pass | `CP25_REVIEWER_WORKBENCH_ACTION_WORKFLOW_ACCEPTANCE_CHECKLIST.md`; `scripts/check_cp25_a09_close_out.mjs`. |
| CP25-A09-03 | Known limitations are documented. | Pass | `CP25_A09_CLOSE_OUT_AND_NEXT_SCOPE_DECISION.md`. |
| CP25-A09-04 | Next scope decision is recorded. | Pass | `CP25_A09_CLOSE_OUT_AND_NEXT_SCOPE_DECISION.md`; CP26 selected. |
| CP25-A09-05 | Public release remains blocked unless separately approved. | Pass | `CP25_A09_CLOSE_OUT_AND_NEXT_SCOPE_DECISION.md`; `scripts/check_cp25_a09_close_out.mjs`. |

## 11. Overall Readiness

Current status: CP25 is complete. CP26 should start next.

Recommended next action:

1. Run `node scripts\check_cp25_a09_close_out.mjs`.
2. Start `CP26 - Live Snapshot Export And Refresh`.

Inherited gate for implementation work:

```powershell
node scripts\check_cp24_close_out.mjs
node scripts\check_cp23_close_out.mjs
node scripts\check_cp22_combined_verification.mjs
```
