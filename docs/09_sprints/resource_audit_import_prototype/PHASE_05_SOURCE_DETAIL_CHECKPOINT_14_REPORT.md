# Phase 5 Checkpoint 14 Report: Source Detail And Attribution Display

Date: 2026-06-19  
Status: Completed  
Scope: Deeper private attribution, release-state, and provenance display.

## Summary

Checkpoint 14 adds a private source-detail layer so RAFIQ can show where a
canonical content item came from before any public approval decision. The new
flow links Quran, translation, tafsir, topic/theme, and Hadith detail surfaces
to release status and provenance evidence.

## Database

Added:

- `private_api.get_source_detail(entity_type, entity_id)`

The RPC returns:

- private notice;
- canonical entity title/subtitle;
- latest `content.entity_release_states` row;
- provenance rows from `content.entity_provenance`;
- source registry metadata from `ingest.source_registry`;
- snapshot license, attribution, rights, publication, checksum, file, and raw
  object summary from `ingest.source_snapshots` and `ingest.raw_objects`.

Enriched:

- `private_api.get_quran_surah(...)`
- `private_api.get_hadith_record(...)`

These payloads now expose `sourceDetailTarget` pointers for supported canonical
entities.

## API And App

Added NestJS endpoint:

- `GET /api/private-content/source/detail?entityType=...&entityId=...`

Added Expo private page:

- `/source-detail`

Updated private app links:

- Quran edition, ayah text, translation, tafsir passage, source topic, and ayah
  theme source-detail links.
- Hadith record, text version, grade assertion, and verification claim
  source-detail links.
- Search result attribution links for Hadith, tafsir, topics, and themes.
- Answer evidence attribution links for Hadith, tafsir, topics, and themes.

## Verification

Executable verification assets:

- `supabase/tests/phase5_source_detail_attribution.sql`
- `scripts/check_phase5_runtime.ps1`
- `scripts/verify_phase5_app_scaffold.py`

Acceptance criteria:

- Quran ayah text exposes source-detail target;
- translation text exposes source-detail target;
- Hadith record and text version expose source-detail targets;
- source detail includes private notice, release state, provenance, snapshot
  key, and source metadata.

## Decision

Checkpoint 14 is approved for private development and testing. Public release
still requires rights, attribution, editorial, scholar/content, and Product
Owner approval.
