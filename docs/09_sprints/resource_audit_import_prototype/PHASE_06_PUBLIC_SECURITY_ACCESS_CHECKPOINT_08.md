# Phase 6 Checkpoint 08: Public Security And Access Review

Date: 2026-06-20  
Status: Completed For Current Local/Private Architecture  
Scope: Public/private access boundaries, RLS/schema exposure, API roles, environment flags, service-role isolation, and pre-public security gaps.

## Decision

Checkpoint 08 is approved for current Phase 6 design verification.

Decision:

- GO for current public/private API separation design.
- GO for current release-filtered public API security assertions.
- GO for local private runtime security posture.
- NO-GO for public deployment.
- NO-GO for public indexing/robots policy because public web deployment is not implemented yet.
- NO-GO for hosted production hardening until deployment environment exists.

## Verified Controls

| Control | Status | Evidence |
| --- | --- | --- |
| Private schemas blocked from client roles | Passed | `phase6_public_security_access.sql` |
| `public_api` usable by client roles | Passed | `phase6_public_security_access.sql` |
| Public functions available to client roles | Passed | `phase6_public_security_access.sql` |
| Private functions blocked from `anon` and `authenticated` | Passed | `phase6_public_security_access.sql` |
| `service_role` can execute private server functions | Passed | `phase6_public_security_access.sql` |
| Public search returns no pending real content | Passed | `phase6_public_security_access.sql`, runtime |
| Public answer exposes no pending evidence | Passed | `phase6_public_security_access.sql`, runtime |
| Approved fixture positive path works | Passed | `phase6_public_fixture_content.sql` |
| Approved fixture rollback removes public exposure | Passed | `phase6_public_fixture_content.sql` |
| API health flags remain private-local | Passed | `scripts/check_phase5_runtime.ps1` |
| Public content flag is disabled | Passed | `scripts/check_phase5_runtime.ps1` |
| Public release GO is false | Passed | `scripts/check_phase5_runtime.ps1` |
| Mobile env exposes only API URL | Passed by file review | `apps/mobile/.env.example` |
| Server DB URL stays API-side | Passed by file review | `.env.example`, `apps/api/.env.example` |

## Supabase Exposure Review

Current `supabase/config.toml` exposes only:

- `public`
- `graphql_public`

It does not expose private schemas through Supabase Data API:

- `ingest`
- `staging`
- `content`
- `private_api`
- `public_api`

RAFIQ product API access currently goes through the NestJS server, which uses server-side database credentials. This is acceptable for private-local development and Phase 6 public API design.

Future decision:

- If `public_api` is exposed directly through Supabase/PostgREST later, repeat RLS/function-grant testing in that deployment mode.
- Until then, public app clients should call `/api/public-content/*`, not Supabase directly.

## API Route Review

Allowed public routes:

- `/api/health`
- `/api/public-content/search`
- `/api/public-content/answer/draft`
- `/api/public-content/answer/guided`

Blocked from public UI:

- `/api/private-content/*`
- `/api/private-content/review/*`
- `/api/private-content/search/trace/*`
- `/api/private-content/source/detail`
- `/api/private-content/answer/model-adapter/*`
- `/api/private-content/answer/validation/*`

Current OpenAPI is still titled `RAFIQ Private API` because the product is private-local. Public deployment will require a separate public documentation profile or deployment flag.

## Environment Flag Review

Current defaults:

| Flag | Current Value | Security Meaning |
| --- | --- | --- |
| `RAFIQ_DEPLOYMENT_MODE` | `private_local` | product is not in public deployment mode |
| `RAFIQ_PUBLIC_CONTENT_ENABLED` | `false` | public content display disabled |
| `RAFIQ_MODEL_PROVIDER_ENABLED` | `false` | live model calls disabled |
| `RAFIQ_MODEL_EXECUTION_MODE` | `disabled_dry_run` | model adapter remains non-executing |

Required future public deployment flags:

- explicit `RAFIQ_DEPLOYMENT_MODE=public_release` or equivalent;
- explicit `RAFIQ_PUBLIC_CONTENT_ENABLED=true`;
- public launch must still require `publicReleaseGo=true`;
- model execution must remain disabled unless separately approved.

## Robots And Indexing Review

Status: Not implemented yet.

Before public deployment:

- add `robots.txt`;
- add noindex headers/meta for private, staging, review, and blocked public pages;
- prevent indexing of localhost/staging/test routes;
- block direct indexing of unavailable public Quran/Hadith pages;
- allow indexing only after Product Owner public release approval.

Current decision:

- Public indexing remains NO-GO.

## Service-Role Isolation Review

Current architecture:

- mobile/web app uses `EXPO_PUBLIC_API_URL`;
- mobile/web app does not receive database URL;
- NestJS API owns database connection;
- private endpoints are server-side only;
- public endpoints are server-side wrappers over `public_api`.

Current risk:

- `.env.example` includes empty `SUPABASE_SERVICE_ROLE_KEY` placeholder, which is acceptable as an example only.
- real service-role credentials must never enter mobile, Expo, browser bundles, public logs, or static exports.

## Remaining Public Security Gates

Before public launch:

- [ ] implement public-only app routes;
- [ ] hide/remove private routes in public deployment mode;
- [ ] add robots/noindex policy;
- [ ] add production CORS policy;
- [ ] add rate limiting for public search and answer endpoints;
- [ ] add request logging redaction policy;
- [ ] configure monitoring/alerting for public release filter failures;
- [ ] verify production environment variables;
- [ ] verify no service-role secrets in web/mobile bundles;
- [ ] verify direct Supabase Data API exposure policy;
- [ ] verify public source-detail excludes private fields;
- [ ] run browser tests against public pages once implemented.

## Current Checkpoint Decision

- [x] Public/private DB access assertions passed
- [x] Public API release filtering passed
- [x] Public answer evidence blocking passed
- [x] Approved fixture positive/rollback tests passed
- [x] Runtime health flags passed
- [x] Mobile env reviewed for public secret exposure
- [ ] Robots/indexing implemented
- [ ] Production CORS/rate limits implemented
- [ ] Public pages implemented
- [ ] Browser public-route leakage tests completed
- [x] Public launch remains NO-GO

## Next Action

Proceed to Checkpoint 09: Phase 6 Go/No-Go Decision Register.

That checkpoint should consolidate Checkpoints 01-08 into a formal Phase 6 decision: design readiness, public launch status, public AI status, remaining blockers, and the next implementation phase.
