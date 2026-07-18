# CP25-A08 - Combined Verification

Date: 2026-07-15

Status: Complete

Owner: RAFIQ reviewer workflow, private-content, validation, and knowledge graph workstream

## 1. Purpose

CP25-A08 provides the one-command combined verification gate for the CP25 reviewer workbench action workflow.

The checker inherits CP22, CP23, and CP24 gates, then verifies CP25 contracts, generated action/audit/remediation artifacts, private API/UI boundaries, and public-safe zero counts.

## 2. Combined Command

Run:

```powershell
node scripts\check_cp25_a08_combined_verification.mjs
```

The combined verifier runs:

- `scripts/check_cp22_combined_verification.mjs`;
- `scripts/check_cp23_close_out.mjs`;
- `scripts/check_cp24_close_out.mjs`;
- `scripts/check_cp25_a07_audit_remediation_exports.mjs`.

It then performs CP25-specific checks against shared contracts, private API routes, private mobile workbench controls, A03/A04/A07 manifests, generated exports, public boundary flags, sprint docs, and checklist status.

## 3. Verification Coverage

| Area | Proof |
| --- | --- |
| CP22 graph/vault baseline | Full private graph and vault remain private; public-safe counts remain zero. |
| CP23 reviewer workflow | CP23 close-out and internal UX proof remain passing. |
| CP24 retrieval baseline | CP24 close-out, ranking, validation handoff, private API, and internal UI remain passing. |
| CP25 contracts | CP25 shared request, response, workbench state, and audit event contracts exist. |
| CP25 private API | CP25 GET and POST routes remain under `/api/private-content`; no public CP25 route exists. |
| CP25 UI | Private mode ribbon, public-release blocked copy, required notes, and audit preview remain visible. |
| CP25 artifacts | A03 review queue, A04 audit ledger, and A07 export manifests remain valid. |
| CP25 exports | 72 audit export events, 72 remediation transitions, 66 unresolved actions, and 12 high/critical open blockers remain inspectable. |
| Public boundary | Public release remains blocked and public-safe counts remain zero. |

## 4. Public Boundary

CP25-A08 confirms:

- `privateOnly: true`;
- `publicReleaseApproved: false`;
- `publicRouteExposed: false`;
- `publicSafeChangeRequested: false`;
- public-safe graph nodes, graph edges, vault artifacts, candidates, and route items remain zero.

No CP25 public route is introduced.

## 5. Limitations

CP25-A08 is a verification checkpoint. It does not add persistence, database audit tables, public-release approval, or production reviewer identity.

The combined verifier is intentionally broad and can take longer than narrow checkpoint checks because it reruns inherited CP22, CP23, CP24, and CP25 gates.

## 6. Next Checkpoint

Proceed next with:

```text
CP25-A09 - Close-Out And Next Scope Decision
```

Reason: CP25 now has a combined verifier. A09 should close the sprint, record known limitations, and decide the next RAFIQ scope.
