# CP25-A05 - Private API Prototype

Date: 2026-07-15

Status: Complete

Owner: RAFIQ private-content API, reviewer workbench, and knowledge graph workstream

## 1. Purpose

CP25-A05 exposes the CP25 reviewer action workflow behind private API routes only.

The prototype reads CP25-A03 and CP25-A04 generated artifacts, returns bounded private workbench state, validates reviewer action requests against the A04 transition rules, and returns an audit-event preview with validation results.

CP25-A05 does not persist reviewer actions. It does not publish content. It does not mark graph, vault, route, candidate, or source artifacts public-safe.

## 2. Implemented Private Routes

| Route | Method | Purpose |
| --- | --- | --- |
| `/api/private-content/reviewer-workbench/cp25` | `GET` | Return bounded CP25 queue, remediation state, audit events, counts, and public boundary. |
| `/api/private-content/reviewer-workbench/cp25/actions` | `POST` | Validate one reviewer action and return a private audit-event preview. |

No public route was introduced.

## 3. Implementation Surface

| File | Change |
| --- | --- |
| `apps/api/src/modules/private-content/private-content.controller.ts` | Added private CP25 GET and POST routes. |
| `apps/api/src/modules/private-content/private-content.dto.ts` | Added CP25 reviewer action request DTO and boundary acknowledgement DTO. |
| `apps/api/src/modules/private-content/private-content.service.ts` | Added artifact-backed CP25 workbench state and action validation methods. |
| `apps/api/src/modules/private-content/private-content.openapi.ts` | Added private CP25 response DTOs. |
| `apps/mobile/src/services/privateContentApi.ts` | Added CP25 workbench and action client helpers. |
| `scripts/check_cp25_a05_private_api_prototype.mjs` | Added private API prototype verifier. |

## 4. API Behavior

`GET /api/private-content/reviewer-workbench/cp25` returns:

- CP25 checkpoint `CP25-A05`;
- private route string;
- source checkpoint `CP24-G09`;
- 72 queue items;
- 72 remediation states;
- 72 audit events;
- high/critical and blocker counts;
- public-safe counts fixed at zero;
- public release boundary fixed at false.

`POST /api/private-content/reviewer-workbench/cp25/actions`:

- requires queue item ID, subject type, subject ID, action, from status, reviewer role, affected refs, and boundary acknowledgement;
- validates transition rules from `data/review/cp25/transition-rules.json`;
- enforces required notes;
- blocks invalid target/status/role/public-boundary requests;
- Invalid actions fail safely through `validation.allowed: false` and blocked reasons;
- returns `validation.allowed` and blocked reasons;
- returns an audit-event preview;
- does not mutate artifacts or persist reviewer state.

## 5. Private Boundary

The CP25-A05 API prototype keeps:

- `privateOnly: true`;
- `publicReleaseApproved: false`;
- `publicRouteExposed: false`;
- `publicSafeChangeRequested: false`;
- public-safe candidate, route item, graph node, graph edge, and vault artifact counts at zero.
- public-safe counts remain zero.

`approved_public_candidate` remains a private workflow status for a later public-release gate. It is not public release.

## 6. Verification

Run:

```powershell
node scripts\check_cp25_a05_private_api_prototype.mjs
corepack pnpm build:api
corepack pnpm build:mobile:web
```

The verifier checks:

- inherited CP25-A04 verifier still passes;
- private CP25 GET and POST controller routes exist;
- no public CP25 route exists;
- DTO validation includes required target, action, refs, and boundary fields;
- service reads CP25 A03/A04 artifacts and validates transitions;
- invalid action previews return blocked validation rather than public mutation;
- mobile client helpers target private routes;
- OpenAPI documents private CP25 DTOs;
- public-safe counts remain zero;
- sprint plan and checklist status are updated.

## 7. Limitations

CP25-A05 is an API prototype. It does not persist state changes, update the generated ledger, or implement database tables.

CP25-A05 does not add UI action controls. That is CP25-A06.

CP25-A05 does not approve public release. Any public release must happen in a separate public-release checkpoint.

## 8. Next Checkpoint

Proceed next with:

```text
CP25-A06 - Internal UI Action Controls
```

Reason: the private API surface now exists. CP25-A06 should make the workbench action controls visible in RAFIQ internal UI while preserving the private-mode and public-release blocked warnings.
