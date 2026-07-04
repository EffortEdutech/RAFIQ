# CR-060 Migration Execution Report

Status: Resolved  
Execution date: 2026-06-15  
Environment: Local Supabase CLI 2.106.0, PostgreSQL 17.6.1, Docker Desktop

## Decision

CR-060 is resolved. The approved Day 7 private ingestion/staging design and
Day 9 canonical content design have been converted into ordered executable
migrations and verified in an isolated local Supabase environment.

No remote or production database was linked, modified, or tested.

## Deliverables

- `supabase/config.toml`
- `supabase/migrations/20260614170252_create_private_ingest_staging.sql`
- `supabase/migrations/20260614170257_create_canonical_content.sql`
- `supabase/tests/cr060_validation.sql`

## Acceptance Results

| Check | Result |
| --- | --- |
| Clean database reset and ordered migration apply | Passed |
| `ingest` tables | 7 of 7 |
| `staging` tables | 28 of 28 |
| `content` tables | 42 of 42 |
| `public_api` tables | 0, intentionally empty |
| RLS enabled on private tables | 77 of 77 |
| `anon` private-schema usage/select | Denied |
| `authenticated` private-schema usage/select | Denied |
| `service_role` private access and write | Passed |
| Generated Quran `verse_key` behavior | Passed |
| SQL lint | No schema errors |
| Performance advisor | No issues |
| Security advisor at warning/error level | No issues |
| Roll back migration 2 to migration 1 | Passed |
| Reapply migration 2 | Passed |
| Final full validation after recovery | Passed |

The security advisor reports 77 informational `rls_enabled_no_policy`
notices at `info` level. These are accepted for this private foundation:
the schemas are not exposed through the Data API, `anon` and
`authenticated` have no schema or table privileges, and importer access is
restricted to `service_role`. Public access must later be implemented only
through reviewed `public_api` views or RPCs.

## Rollback Evidence

After rolling back the second migration, the database contained only:

- migration `20260614170252`;
- 7 `ingest` tables;
- 28 `staging` tables;
- no `content` or `public_api` schema objects.

Reapplying pending migrations restored migration `20260614170257` and the
complete 42-table canonical content model. The final validation suite passed.

## Gate Outcome

Phase 1 of the Complete Private Platform Import Roadmap is complete.
Proceed to Phase 2: Complete Source Registry and Raw Registration.

Public launch remains blocked by the separate rights, attribution,
editorial, scholar/content approval, and public release-enforcement gates.
