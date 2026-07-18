# CP24-G02 - Request And Response Contracts

Date: 2026-07-13

Status: Complete

Scope: Shared TypeScript contracts for the private CP24 graph-aware retrieval prototype. This checkpoint does not implement API routes, retrieval logic, graph expansion, ranking, validation execution, or UI.

## 1. Purpose

CP24-G02 turns the locked CP24-G01 architecture into concrete shared contracts in `packages/shared/src/private-content.ts`.

The contracts define the request body, candidate shape, ranking explanation shape, evidence route, validation handoff, reviewer handoff, graph proof, and public boundary for:

```text
POST /api/private-content/graph-aware-retrieval/cp24
```

The route is still future work for CP24-G06. G02 only locks the type surface.

## 2. Implemented Shared Contracts

| Contract | Type |
| --- | --- |
| Request wrapper | `PrivateCp24GraphAwareRetrievalRequest` |
| Graph expansion request | `PrivateCp24GraphExpansionRequest` |
| Release boundary request | `PrivateCp24ReleaseBoundaryRequest` |
| Quality boundary request | `PrivateCp24QualityBoundaryRequest` |
| Output caps | `PrivateCp24OutputCaps` |
| Candidate | `PrivateCp24EvidenceCandidate` |
| Ranking signal | `PrivateCp24RankingSignal` |
| Ranking explanation | `PrivateCp24RankingExplanation` |
| Evidence route | `PrivateCp24EvidenceRoute` |
| Evidence route item | `PrivateCp24EvidenceRouteItem` |
| Validation gate result | `PrivateCp24ValidationGateResult` |
| Validation handoff | `PrivateCp24ValidationHandoff` |
| Reviewer handoff | `PrivateCp24ReviewerHandoff` |
| Graph proof | `PrivateCp24GraphProof` |
| Public boundary | `PrivateCp24PublicBoundary` |
| Response wrapper | `PrivateCp24GraphAwareRetrievalResponse` |

## 3. Request Contract

The request contract requires:

- `queryText`;
- `graphMode`;
- `graphExpansion`;
- `releaseBoundary`;
- `qualityBoundary`.

Required private defaults remain represented in the type surface:

| Field | Locked value |
| --- | --- |
| `graphExpansion.requireSourceRefs` | `true` |
| `graphExpansion.requireProvenanceRefs` | `true` |
| `graphExpansion.requireReleaseRefs` | `true` |
| `graphExpansion.includeVaultPackRefs` | `true` |
| `releaseBoundary.mode` | `private_internal` |
| `releaseBoundary.allowPublicBlocked` | `true` |
| `releaseBoundary.allowRejected` | `false` |
| `releaseBoundary.publicSafeOnly` | `false` |
| `qualityBoundary.allowWithheld` | `false` |
| `qualityBoundary.requireReviewForWarning` | `true` |

Graph expansion depth is limited to `0 | 1 | 2`.

## 4. Candidate And Ranking Contract

Every `PrivateCp24EvidenceCandidate` keeps canonical and graph identities separate:

- `canonicalRef`;
- `graphNodeIds`;
- `graphEdgeIds`;
- `sourceIds`;
- `provenanceIds`;
- `releaseStateIds`;
- `vaultPackIds`.

The candidate contract includes `publicSafe: false`, `ordinaryScore`, `escalationOutcome`, `selectionState`, `selectionReason`, and optional `rejectionReason`.

Ranking signals are operational only. `PrivateCp24RankingExplanation.authorityBoundary` is locked to:

```text
operational_relevance_only
```

This prevents ranking explanation language from becoming religious approval, authenticity, fatwa status, or public-release approval.

## 5. Evidence Route And Validation Handoff

The response contains one bounded `PrivateCp24EvidenceRoute` with separate arrays for:

- selected evidence;
- rejected evidence;
- escalation evidence;
- validation gate results;
- escalation outcomes;
- review queue item IDs;
- remediation IDs.

The `PrivateCp24ValidationHandoff` keeps validation inputs explicit:

- required gates;
- selected evidence route item IDs;
- selected canonical refs;
- selected graph node IDs;
- cited source IDs;
- missing citation IDs;
- unresolved reference IDs;
- escalation outcomes;
- remediation IDs;
- `publicReleaseApproved: false`.

## 6. Reviewer Handoff Contract

`PrivateCp24ReviewerHandoff` reuses the existing CP23 reviewer workflow types:

- `PrivateCp23ReviewQueueItem`;
- `PrivateCp23RemediationItem`;
- `PrivateCp23ReviewAuditEvent`.

It adds `requiredReviewerRoles` and `openBlockingRemediationCount` so G05-G07 can keep reviewer work visible without inventing a parallel review workflow.

## 7. Graph Proof And Public Boundary

`PrivateCp24GraphProof` locks the graph and vault identity:

| Field | Value |
| --- | --- |
| `graphId` | `rafiq-full-private-resource-graph` |
| `vaultId` | `rafiq-full-private-knowledge-vault` |
| `sourceCheckpoint` | `CP22-G10` |

`PrivateCp24PublicBoundary` locks:

- `privateOnly: true`;
- `publicSafeCandidateCount: 0`;
- `publicSafeGraphNodeCount: 0`;
- `publicSafeGraphEdgeCount: 0`;
- `publicSafeVaultArtifactCount: 0`;
- `publicReleaseApproved: false`;
- `publicRouteExposed: false`.

## 8. Acceptance

CP24-G02 is complete when:

- shared request contract is implemented;
- candidate/scoring/explanation contracts are implemented;
- evidence route and validation handoff contracts are implemented;
- reviewer handoff contract is implemented;
- public-boundary contract is implemented;
- `node scripts\check_cp24_g02_request_response_contracts.mjs` passes;
- `corepack pnpm -C packages/shared build` passes.

Status: complete.
