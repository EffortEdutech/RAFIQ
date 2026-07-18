# CP25-A06 - Internal UI Action Controls

Date: 2026-07-15

Status: Complete

Owner: RAFIQ private reviewer workbench, mobile UI, and knowledge graph workstream

## 1. Purpose

CP25-A06 makes the CP25 private reviewer action workflow usable in the RAFIQ internal UI.

The checkpoint extends the private reviewer workbench screen with bounded action controls backed by the CP25-A05 private API prototype. Reviewers can select CP25 queue items, inspect role/status/remediation state, enter required notes, preview an action validation result, and see the audit-event preview before any persistence work exists.

CP25-A06 does not publish content. It does not approve public release. It does not mark graph, vault, route, candidate, source, or remediation artifacts public-safe.

## 2. Implementation Surface

| File | Change |
| --- | --- |
| `apps/mobile/app/review-workbench.tsx` | Added CP25 queue cards, action selector, required notes field, remediation status display, private action submit preview, audit preview, and public-boundary warning. |
| `apps/mobile/src/services/privateContentApi.ts` | Reused CP25 private API helpers from A05. |
| `docs/09_sprints/resource_audit_import_prototype/CP25_REVIEWER_WORKBENCH_ACTION_WORKFLOW_SPRINT_PLAN.md` | Advanced sprint status to CP25-A06 complete. |
| `docs/09_sprints/resource_audit_import_prototype/CP25_REVIEWER_WORKBENCH_ACTION_WORKFLOW_ACCEPTANCE_CHECKLIST.md` | Marked A06 rows complete with evidence. |
| `scripts/check_cp25_a06_internal_ui_action_controls.mjs` | Added A06 verifier. |

## 3. UI Controls

The internal reviewer workbench now includes:

- CP25 queue cards for bounded private queue item selection;
- action selector buttons derived from each queue item's required actions;
- required notes field with a visible missing-notes blocker before submit;
- role, current status, subject, remediation status, blocking status, and public approval display;
- private action preview submit button;
- audit preview display with allowed/blocked state, from/to status, blocked reasons, and preview audit event ID;
- private mode ribbon and public-release blocked warning.

## 4. Private Boundary

The screen keeps the CP25 workflow private-only:

- action requests call `/api/private-content/reviewer-workbench/cp25/actions`;
- the UI sends `boundaryAcknowledgement.privateOnly: true`;
- the UI sends `boundaryAcknowledgement.publicReleaseApproved: false`;
- the UI sends `boundaryAcknowledgement.publicSafeChangeRequested: false`;
- public-safe candidate and route item counts remain displayed as zero;
- public-release blocked copy remains visible near the controls.

No public route exposes CP25 workflow data.

## 5. Verification

Run:

```powershell
node scripts\check_cp25_a06_internal_ui_action_controls.mjs
corepack pnpm build:mobile:web
```

The verifier checks:

- inherited CP25-A05 verifier still passes;
- the internal workbench imports CP25 shared contracts and private API helpers;
- `PrivateModeRibbon` remains visible;
- CP25 action controls, queue cards, required notes field, and audit preview exist;
- the action request keeps public release and public-safe mutation false;
- public-release blocked indicators remain visible;
- no public CP25 route is introduced;
- sprint plan and checklist status are advanced to A06 complete.

## 6. Limitations

CP25-A06 previews reviewer actions through the private API prototype. It does not persist new actions, update the generated audit ledger, or write remediation transitions.

Responsive layout proof is currently build-level and static-verifier proof. Full browser/device screenshot proof should be added in a later UI proof or close-out checkpoint if required.

## 7. Next Checkpoint

Proceed next with:

```text
CP25-A07 - Audit Export And Remediation Review Proof
```

Reason: the UI can now preview bounded private reviewer actions. A07 should export action and remediation review proof while preserving audit history and public-safe zero counts.
