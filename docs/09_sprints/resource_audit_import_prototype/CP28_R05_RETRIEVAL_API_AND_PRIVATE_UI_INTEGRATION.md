# CP28-R05 - Retrieval API And Private UI Integration

Date: 2026-07-18

Status: Complete

Scope: Produce a bounded private API/UI integration proof for CP28 refreshed retrieval artifacts. This checkpoint does not add a production CP28 source route or public UI route.

## 1. Purpose

CP28-R05 proves the shape of a future private CP28 retrieval API/UI response without prematurely exposing it through source code.

The source route is intentionally deferred because CP28-R04 has zero selected route items and remains remediation-first. A real interactive route should wait until CP28 can return selected validation-handoff candidates without relaxing CP27 blocker rules.

## 2. Generated Artifacts

| Artifact | Path | Purpose |
| --- | --- | --- |
| Private API/UI proof | `data/retrieval/cp28/private-api-ui-proof.json` | Bounded fixture payloads showing candidate summaries, evidence route IDs, validation gate statuses, remediation IDs, and public boundary. |
| Retrieval manifest | `data/retrieval/cp28/manifest.json` | Adds CP28-R05 proof path, checksum, counts, and verifier pointer. |
| Latest retrieval pointer | `data/retrieval/cp28/latest-retrieval.json` | Advances the CP28 retrieval pointer to CP28-R05. |
| Generator | `scripts/generate_cp28_r05_private_api_ui_proof.mjs` | Rebuilds the bounded private API/UI proof. |
| Verifier | `scripts/check_cp28_r05_private_api_ui_proof.mjs` | Verifies R04 baseline, payload caps, route deferral, docs, and public boundary. |

## 3. Integration Decision

R05 selects `contract_payload_and_boundary_proof`.

This means:

- planned private route: `POST /api/private-content/graph-aware-retrieval/cp28`;
- source route implementation: deferred;
- source UI implementation: deferred;
- no public route exists;
- existing CP24 internal retrieval UI remains untouched;
- CP28 payload shape is proven through generated private artifacts.

## 4. Bounded Payload Proof

Each fixture payload includes only:

- fixture identity and regression label;
- bounded candidate summaries;
- route item IDs, not raw route dumps;
- validation gate names/statuses;
- remediation IDs and escalation candidate IDs;
- public-boundary object.

The proof excludes:

- raw Quran text bodies;
- raw translation bodies;
- raw tafsir bodies;
- raw hadith bodies;
- full graph dumps;
- full vault dumps;
- public release approval.

## 5. Current Results

| Metric | Count |
| --- | ---: |
| Fixture payloads | 10 |
| Bounded candidate summaries | 70 |
| Selected route items | 0 |
| Review route items | 55 |
| Escalation route items | 15 |
| Validation gate results | 110 |
| Remediation items | 70 |
| Public-safe candidates | 0 |
| Public-safe route items | 0 |
| Public route exposed | 0 |

## 6. Public Boundary

CP28-R05 remains private-only:

- public release is not approved;
- no public route is added;
- source CP28 private route is deferred;
- public-safe candidates and route items remain zero;
- no raw source text bodies are exported;
- payloads are bounded proof artifacts only.

## 7. Verification

Run:

```powershell
node scripts\check_cp28_r05_private_api_ui_proof.mjs
```

The verifier regenerates R04 and R05, checks checksums, confirms bounded payload caps, confirms no CP28 source route or public route exists, and confirms public-safe counts remain zero.

## 8. Next Checkpoint

Proceed next with:

```text
CP28-R06 - Retrieval Regression Suite And Public-Boundary Verifier
```

Status: complete.
