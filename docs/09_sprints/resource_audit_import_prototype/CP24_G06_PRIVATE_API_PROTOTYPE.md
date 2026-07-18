# CP24-G06 - Private API Prototype

Date: 2026-07-14

Status: Complete

Scope: Private API exposure for the CP24 graph-aware retrieval prototype. This checkpoint does not create a public route, does not expose the full graph, does not execute live model generation, and does not approve public release.

## 1. Purpose

CP24-G06 exposes the CP24-G03 through CP24-G05 prototype outputs through a bounded private API route so the next internal UI checkpoint can inspect real prototype payloads.

The route adapts existing CP24 artifacts:

- `data/retrieval/cp24/ranking-selection.json`;
- `data/retrieval/cp24/validation-handoff.json`;
- `data/retrieval/cp24/manifest.json`;
- CP22 full-private graph manifest for graph/index proof.

## 2. Private Route

| Route | Method | Purpose |
| --- | --- | --- |
| `/api/private-content/graph-aware-retrieval/cp24` | `POST` | Return one bounded private CP24 graph-aware retrieval prototype response. |

The route lives under the existing `private-content` controller namespace.

No public route is introduced.

## 3. Request Handling

The request DTO validates:

- required `queryText`;
- optional `fixtureId`;
- optional intent/domain/language;
- optional graph mode;
- optional `limit`, `offset`, and `maxDepth`.

Invalid Request Handling:

Unknown fixture IDs, missing query text, missing artifacts, or invalid private-boundary artifacts fail through a safe `BadRequestException`.

## 4. Bounded Response

The service returns the shared `PrivateCp24GraphAwareRetrievalResponse` contract with:

- checkpoint `CP24-G06`;
- route string `POST /api/private-content/graph-aware-retrieval/cp24`;
- bounded candidates;
- selected/held/rejected/review/escalation candidate ID groups;
- one bounded evidence route;
- validation handoff;
- reviewer handoff generated from G05 remediation items;
- graph proof;
- explicit public boundary.

The response caps candidate, graph node, graph edge, evidence route item, and vault pack references. It does not dump the full CP22 graph or vault.

## 5. Public Boundary

G06 preserves:

- `privateOnly: true`;
- `publicSafeCandidateCount: 0`;
- `publicSafeGraphNodeCount: 0`;
- `publicSafeGraphEdgeCount: 0`;
- `publicSafeVaultArtifactCount: 0`;
- `publicReleaseApproved: false`;
- `publicRouteExposed: false`.

The API response is for private review and internal UI proof only.

## 6. Implementation Files

| File | Change |
| --- | --- |
| `apps/api/src/modules/private-content/private-content.dto.ts` | Adds `PrivateCp24GraphAwareRetrievalRequestDto`. |
| `apps/api/src/modules/private-content/private-content.controller.ts` | Adds private POST route. |
| `apps/api/src/modules/private-content/private-content.service.ts` | Adds artifact-backed private CP24 retrieval response assembly. |
| `apps/api/src/modules/private-content/private-content.openapi.ts` | Adds `PrivateCp24GraphAwareRetrievalResponseDto`. |
| `apps/mobile/src/services/privateContentApi.ts` | Adds private POST client helper for G07 UI work. |
| `scripts/check_cp24_g06_private_api_prototype.mjs` | Adds checkpoint verifier. |

## 7. Verification

Verifier:

```powershell
node scripts\check_cp24_g06_private_api_prototype.mjs
```

Inherited proof:

```powershell
node scripts\check_cp24_g05_validation_handoff.mjs
```

Build proof:

```powershell
corepack pnpm build:api
```

## 8. Acceptance

CP24-G06 is complete when:

- private CP24 API route is implemented;
- service method returns bounded response;
- OpenAPI private DTOs are documented;
- invalid requests fail safely;
- no public CP24 route is introduced;
- `node scripts\check_cp24_g06_private_api_prototype.mjs` passes.

Status: complete.
