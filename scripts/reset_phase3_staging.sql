-- RAFIQ Phase 3 development reset.
--
-- Clears import-run and staging rows only. Source registry, snapshots,
-- raw objects, parser assignments, and canonical content schema remain intact.

\set ON_ERROR_STOP on

begin;
truncate table ingest.import_runs cascade;
commit;

select 'import_runs' as table_name, count(*)::bigint from ingest.import_runs
union all select 'source_records', count(*) from staging.source_records
union all select 'quran_ayah_texts', count(*) from staging.quran_ayah_texts
union all select 'quran_partitions', count(*) from staging.quran_partitions
union all select 'translation_texts', count(*) from staging.translation_texts
union all select 'hadith_records', count(*) from staging.hadith_records
union all select 'hadith_text_versions', count(*) from staging.hadith_text_versions;
