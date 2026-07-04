# Phase 5 Private Retrieval Checkpoint 01 Report

Date: 2026-06-17  
Status: Complete  
Scope: Private database retrieval layer for first RAFIQ content pages.

## Completed Work

Created migration:

- `supabase/migrations/20260617044855_phase5_private_retrieval_api.sql`

Created private schema:

- `private_api`

The schema is not a public API surface. It is intended for server-side RAFIQ
API use through `service_role` while content remains private-only.

## Private RPC Contracts

| Function | Purpose |
| --- | --- |
| `private_api.private_content_notice()` | Standard private-only content warning payload. |
| `private_api.get_quran_surah(integer, text, text, text)` | Returns one surah with Quran text, translation, tafsir passages, source topics, and source ayah themes. |
| `private_api.list_hadith_collections()` | Returns promoted source-qualified Hadith collections with edition, record, and text counts. |
| `private_api.list_hadith_records(text, text, integer, integer)` | Returns paginated Hadith records for collection browsing. |
| `private_api.get_hadith_record(uuid)` | Returns full Hadith detail with text versions, grade assertions, normalizations, and verification claims. |

Every returned payload includes:

`UNAPPROVED CONTENT - NOT FOR PUBLICATION`

## Security Result

| Role | `private_api` Usage | Function Execute |
| --- | --- | --- |
| `anon` | Denied | Denied |
| `authenticated` | Denied | Denied |
| `service_role` | Allowed | Allowed |

This preserves the current private-build rule: client roles cannot query
private content directly. The future NestJS/API layer must call these functions
server-side only.

## Verification Evidence

Executable verifier:

- `supabase/tests/phase5_private_retrieval.sql`

Verifier result:

- 5/5 private functions installed.
- 11/11 assertions passed.
- 0 assertion failures.
- Surah 1 retrieval returned 7 ayahs and the private notice.
- Hadith collection retrieval returned 70 collections.
- `fawaz-linebyline:bukhari` list retrieval returned total `7,563`.
- Hadith detail retrieval returned text versions.
- Supabase `db lint --local`: no schema errors found.
- Supabase `db advisors --local`: no issues found.
- Local migration list includes `20260617044855`.

## Gate Decision

Checkpoint 01 is approved. Phase 5 may proceed to the first product integration
step: create the server/API scaffold that consumes `private_api`, then build
the first private Quran and Hadith pages.
