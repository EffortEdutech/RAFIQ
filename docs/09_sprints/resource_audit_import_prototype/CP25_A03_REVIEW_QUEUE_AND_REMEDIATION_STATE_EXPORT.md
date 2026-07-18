# CP25-A03 - Review Queue And Remediation State Export

Date: 2026-07-15

Status: Complete

Owner: RAFIQ reviewer workbench, private-content, and knowledge graph workstream

## 1. Purpose

CP25-A03 generates the bounded private reviewer workbench state required before reviewer actions can be prototyped.

The export starts from CP24 validation handoff artifacts and produces:

- a review queue export,
- a remediation state export,
- role assignment, severity, blocker, and unresolved-reference summaries,
- a manifest with checksums.

This checkpoint does not approve content. It does not publish any Quran, hadith, tafsir, translation, answer, graph, or vault artifact. It prepares private workflow state only.

## 2. Inputs

| Input | Purpose |
| --- | --- |
| `data/retrieval/cp24/validation-handoff.json` | Source CP24 evidence routes, route items, validation outcomes, and 72 CP24 remediation items. |
| `data/retrieval/cp24/manifest.json` | Source CP24 retrieval prototype counts and public boundary. |
| `packages/shared/src/private-content.ts` | CP25 queue, remediation state, audit event, action, role, and public-boundary contracts. |

## 3. Outputs

| Output | Purpose |
| --- | --- |
| `data/review/cp25/review-queue.json` | Private review queue items derived from CP24 remediation items. |
| `data/review/cp25/remediation-state.json` | Private remediation workflow state linked to original CP24 remediation IDs. |
| `data/review/cp25/state-summary.json` | Role assignment, queue type, severity, blocker, and unresolved-reference summaries. |
| `data/review/cp25/manifest.json` | Artifact manifest, source links, counts, checksums, and public boundary. |
| `scripts/generate_cp25_review_queue_remediation_state.mjs` | Deterministic exporter. |
| `scripts/check_cp25_a03_review_queue_exports.mjs` | Checkpoint verifier. |

## 4. Export Rules

The exporter applies these rules:

1. Every CP24 remediation item becomes one CP25 review queue item.
2. Every CP24 remediation item becomes one CP25 remediation state.
3. Queue items keep CP24 evidence route, route item, candidate, and remediation IDs where available.
4. Graph node, graph edge, source, and vault pack refs are copied from CP24 route items only as bounded ID arrays.
5. High and critical items remain visible as blockers.
6. All queue items require reviewer notes before action processing.
7. Public release remains false on every artifact.
8. Public-safe counts remain zero.
9. Missing graph refs are not hidden; they are reported in the unresolved-reference summary.

## 5. Generated Counts

| Count | Value |
| --- | ---: |
| CP24 remediation items | 72 |
| CP25 review queue items | 72 |
| CP25 remediation states | 72 |
| Explicitly deferred CP24 remediation items | 0 |
| High/critical queue items | 18 high/critical |
| Blocking remediation states | 18 |
| Review-required remediation states | 54 |
| Public-safe candidates | 0 |
| Public-safe route items | 0 |

## 6. Governance Boundary

The A03 export is private-only.

- `publicReleaseApproved` remains `false`.
- `publicRouteExposed` remains `false`.
- `publicSafeChangeRequested` remains `false`.
- Public-safe graph node, graph edge, vault artifact, candidate, and route item counts remain zero.
- `approve_private` and `mark_public_candidate` are not executed in A03.

This means CP25-A03 creates workbench state, not release approval.

## 7. Verification

Run:

```powershell
node scripts\check_cp25_a03_review_queue_exports.mjs
```

The verifier checks:

- inherited CP25-A02 contract verifier still passes,
- all 72 CP24 remediation items are represented,
- no CP24 remediation item is silently dropped,
- queue/remediation refs link back to CP24 route, candidate, route item, and remediation IDs,
- checksums match generated artifacts,
- role, severity, blocker, and unresolved-reference summaries are present,
- public-safe counts remain zero,
- sprint plan and checklist status are updated.

## 8. Limitations

CP25-A03 does not yet create reviewer audit events or a decision ledger. That is CP25-A04.

CP25-A03 does not yet expose an API route or UI controls. Those are CP25-A05 and CP25-A06.

CP25-A03 does not resolve remediation items. It only initializes private review and remediation state.

## 9. Next Checkpoint

Proceed next with:

```text
CP25-A04 - Audit Event And Decision Ledger
```

Reason: CP25-A03 now gives CP25 a complete private queue and remediation-state baseline. CP25-A04 should define and generate the append-only reviewer event model that records action attempts, status transitions, required notes, and affected refs without publishing content.
