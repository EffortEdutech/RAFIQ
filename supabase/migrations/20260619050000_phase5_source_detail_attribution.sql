-- RAFIQ Phase 5 Checkpoint 14: Deeper attribution and source-detail display.
--
-- Adds a service-role-only source-detail RPC over canonical release states and
-- provenance, then enriches Quran/Hadith payloads with sourceDetailTarget links
-- that the private app can open.

create or replace function private_api.get_source_detail(
  p_entity_type text,
  p_entity_id text
)
returns jsonb
language sql
stable
security definer
set search_path = private_api, content, ingest, public
as $$
  with input as (
    select lower(nullif(trim(coalesce(p_entity_type, '')), '')) as entity_type,
           nullif(trim(coalesce(p_entity_id, '')), '') as entity_id
  ),
  latest_release as (
    select ers.*
      from content.entity_release_states ers, input i
     where ers.entity_type = i.entity_type
       and ers.entity_id = i.entity_id
     order by ers.effective_from desc, ers.entity_version desc
     limit 1
  ),
  labels as (
    select 'quran_ayah'::text as entity_type, qa.id::text as entity_id,
           qa.verse_key as title,
           ('Surah ' || qa.surah_number || ', ayah ' || qa.ayah_number) as subtitle
      from content.quran_ayahs qa
    union all
    select 'quran_ayah_text', qat.id::text,
           ('Quran text ' || qa.verse_key),
           qte.edition_key
      from content.quran_ayah_texts qat
      join content.quran_ayahs qa on qa.id = qat.ayah_id
      join content.quran_text_editions qte on qte.id = qat.edition_id
    union all
    select 'translation_text', tt.id::text,
           ('Translation ' || qa.verse_key),
           te.edition_key
      from content.translation_texts tt
      join content.quran_ayahs qa on qa.id = tt.ayah_id
      join content.translation_editions te on te.id = tt.edition_id
    union all
    select 'tafsir_passage', tp.id::text,
           ('Tafsir passage ' || tp.passage_key),
           te.edition_key
      from content.tafsir_passages tp
      join content.tafsir_editions te on te.id = tp.edition_id
    union all
    select 'source_topic', st.id::text,
           st.name,
           sx.name
      from content.source_topics st
      join content.source_taxonomies sx on sx.id = st.taxonomy_id
    union all
    select 'source_ayah_theme_group', sag.id::text,
           'Ayah theme',
           sag.source_group_key
      from content.source_ayah_theme_groups sag
    union all
    select 'hadith_record', hr.id::text,
           coalesce(hc.name_en, hc.collection_key),
           coalesce('No. ' || hr.source_hadith_number, hr.source_hadith_key)
      from content.hadith_records hr
      join content.hadith_editions he on he.id = hr.edition_id
      join content.hadith_collections hc on hc.id = he.collection_id
    union all
    select 'hadith_text_version', htv.id::text,
           ('Hadith text ' || htv.language_code),
           coalesce(htv.translator_name, htv.text_hash)
      from content.hadith_text_versions htv
    union all
    select 'hadith_grade_assertion', hga.id::text,
           coalesce(hga.raw_grade, 'Hadith grade assertion'),
           hga.grader_name_raw
      from content.hadith_grade_assertions hga
    union all
    select 'hadith_verification_claim', hvc.id::text,
           coalesce(hvc.raw_conclusion, 'Hadith verification claim'),
           hvc.scholar_researcher_raw
      from content.hadith_verification_claims hvc
  ),
  selected_label as (
    select labels.*
      from labels, input i
     where labels.entity_type = i.entity_type
       and labels.entity_id = i.entity_id
     limit 1
  ),
  provenance_rows as (
    select ep.id,
           ep.staging_table,
           ep.staging_record_id,
           ep.provenance_role,
           ep.mapping_method,
           ep.created_at,
           ss.id as snapshot_id,
           ss.snapshot_key,
           ss.upstream_version,
           ss.acquired_at,
           ss.acquisition_method,
           ss.license_name,
           ss.license_url,
           ss.attribution_text,
           ss.technical_status as snapshot_technical_status,
           ss.rights_status as snapshot_rights_status,
           ss.attribution_status as snapshot_attribution_status,
           ss.content_status as snapshot_content_status,
           ss.publication_status as snapshot_publication_status,
           ss.aggregate_sha256,
           ss.file_count,
           ss.total_bytes,
           sr.source_key,
           sr.name as source_name,
           sr.provider,
           sr.domain,
           sr.official_url,
           sr.repository_url,
           sr.documentation_url,
           sr.authority_class,
           coalesce(raw_stats.raw_object_count, 0) as raw_object_count
      from content.entity_provenance ep
      join input i on i.entity_type = ep.entity_type and i.entity_id = ep.entity_id
      left join ingest.source_snapshots ss on ss.id = ep.source_snapshot_id
      left join ingest.source_registry sr on sr.id = ss.source_id
      left join lateral (
        select count(*) as raw_object_count
          from ingest.raw_objects ro
         where ro.snapshot_id = ss.id
      ) raw_stats on true
  ),
  provenance_payload as (
    select coalesce(jsonb_agg(jsonb_build_object(
             'provenanceId', id,
             'stagingTable', staging_table,
             'stagingRecordId', staging_record_id,
             'provenanceRole', provenance_role,
             'mappingMethod', mapping_method,
             'createdAt', created_at,
             'source', jsonb_build_object(
               'sourceKey', source_key,
               'name', source_name,
               'provider', provider,
               'domain', domain,
               'officialUrl', official_url,
               'repositoryUrl', repository_url,
               'documentationUrl', documentation_url,
               'authorityClass', authority_class
             ),
             'snapshot', jsonb_build_object(
               'snapshotId', snapshot_id,
               'snapshotKey', snapshot_key,
               'upstreamVersion', upstream_version,
               'acquiredAt', acquired_at,
               'acquisitionMethod', acquisition_method,
               'licenseName', license_name,
               'licenseUrl', license_url,
               'attributionText', attribution_text,
               'technicalStatus', snapshot_technical_status,
               'rightsStatus', snapshot_rights_status,
               'attributionStatus', snapshot_attribution_status,
               'contentStatus', snapshot_content_status,
               'publicationStatus', snapshot_publication_status,
               'aggregateSha256', aggregate_sha256,
               'fileCount', file_count,
               'totalBytes', total_bytes,
               'rawObjectCount', raw_object_count
             )
           ) order by source_key, snapshot_key, staging_table, staging_record_id), '[]'::jsonb) as items,
           count(*) as total_count
      from provenance_rows
  )
  select jsonb_build_object(
    'notice', private_api.private_content_notice(),
    'sourceDetail', jsonb_build_object(
      'entityType', (select entity_type from input),
      'entityId', (select entity_id from input),
      'title', coalesce((select title from selected_label), (select entity_type || ':' || entity_id from input)),
      'subtitle', (select subtitle from selected_label),
      'releaseState', case when exists (select 1 from latest_release) then (
        select jsonb_build_object(
          'entityVersion', entity_version,
          'technicalStatus', technical_status,
          'rightsStatus', rights_status,
          'attributionStatus', attribution_status,
          'editorialStatus', editorial_status,
          'scholarContentStatus', scholar_content_status,
          'publicationStatus', publication_status,
          'effectiveFrom', effective_from,
          'effectiveTo', effective_to,
          'notes', notes
        )
          from latest_release
      ) else null end,
      'provenanceCount', (select total_count from provenance_payload),
      'provenance', (select items from provenance_payload)
    )
  );
$$;

create or replace function private_api.get_quran_surah(
  p_surah_number integer,
  p_quran_edition_key text default 'qul_uthmani',
  p_translation_edition_key text default 'qul-en-sahih-simple',
  p_tafsir_edition_key text default 'qul-en-mukhtasar'
)
returns jsonb
language sql
stable
security definer
set search_path = private_api, content, public
as $$
  with selected_quran as (
    select *
      from content.quran_text_editions
     where edition_key = coalesce(p_quran_edition_key, 'qul_uthmani')
        or (p_quran_edition_key is null and active)
     order by case when edition_key = coalesce(p_quran_edition_key, 'qul_uthmani') then 0 else 1 end,
              edition_key
     limit 1
  ),
  selected_translation as (
    select *
      from content.translation_editions
     where edition_key = coalesce(p_translation_edition_key, 'qul-en-sahih-simple')
        or (p_translation_edition_key is null and active)
     order by case when edition_key = coalesce(p_translation_edition_key, 'qul-en-sahih-simple') then 0 else 1 end,
              edition_key
     limit 1
  ),
  selected_tafsir as (
    select *
      from content.tafsir_editions
     where edition_key = coalesce(p_tafsir_edition_key, 'qul-en-mukhtasar')
        or (p_tafsir_edition_key is null and active)
     order by case when edition_key = coalesce(p_tafsir_edition_key, 'qul-en-mukhtasar') then 0 else 1 end,
              edition_key
     limit 1
  )
  select jsonb_build_object(
    'notice', private_api.private_content_notice(),
    'surah', jsonb_build_object(
      'surahNumber', qs.surah_number,
      'nameArabic', qs.canonical_name_ar,
      'nameTransliteration', qs.canonical_name_latin,
      'ayahCount', qs.ayah_count,
      'sourceDetailTarget', jsonb_build_object('entityType', 'quran_surah', 'entityId', qs.surah_number::text)
    ),
    'editions', jsonb_build_object(
      'quran', (select jsonb_build_object('editionKey', edition_key, 'name', name, 'scriptLabel', script_label, 'bismillahPolicy', bismillah_policy, 'sourceDetailTarget', jsonb_build_object('entityType', 'quran_text_edition', 'entityId', id::text)) from selected_quran),
      'translation', (select jsonb_build_object('editionKey', edition_key, 'languageCode', language_code, 'translatorName', translator_name, 'title', title, 'sourceDetailTarget', jsonb_build_object('entityType', 'translation_edition', 'entityId', id::text)) from selected_translation),
      'tafsir', (select jsonb_build_object('editionKey', edition_key, 'languageCode', language_code, 'title', title, 'authorName', author_name, 'sourceDetailTarget', jsonb_build_object('entityType', 'tafsir_edition', 'entityId', id::text)) from selected_tafsir)
    ),
    'ayahs', coalesce(jsonb_agg(
      jsonb_build_object(
        'ayahId', qa.id,
        'verseKey', qa.verse_key,
        'surahNumber', qa.surah_number,
        'ayahNumber', qa.ayah_number,
        'globalAyahNumber', qa.global_ayah_number,
        'sourceDetailTarget', jsonb_build_object('entityType', 'quran_ayah', 'entityId', qa.id::text),
        'quranText', qat.text_value,
        'quranTextSourceDetailTarget', case when qat.id is null then null else jsonb_build_object('entityType', 'quran_ayah_text', 'entityId', qat.id::text) end,
        'translation', case when tt.id is null then null else jsonb_build_object(
          'translationTextId', tt.id,
          'variantType', tt.variant_type,
          'text', tt.text_value,
          'sourceMarkup', tt.source_markup,
          'sourceDetailTarget', jsonb_build_object('entityType', 'translation_text', 'entityId', tt.id::text)
        ) end,
        'tafsirPassages', coalesce((
          select jsonb_agg(jsonb_build_object(
                   'passageId', tp.id,
                   'passageKey', tp.passage_key,
                   'text', tp.passage_text,
                   'blankText', tp.blank_text,
                   'sourceRole', tpa.source_role,
                   'sourceOrder', tpa.source_order,
                   'sourceDetailTarget', jsonb_build_object('entityType', 'tafsir_passage', 'entityId', tp.id::text)
                 ) order by tpa.source_order, tp.passage_key)
            from content.tafsir_passage_ayahs tpa
            join content.tafsir_passages tp on tp.id = tpa.passage_id
            join selected_tafsir ste on ste.id = tp.edition_id
           where tpa.ayah_id = qa.id
        ), '[]'::jsonb),
        'sourceTopics', coalesce((
          select jsonb_agg(jsonb_build_object(
                   'topicId', st.id,
                   'sourceTopicKey', st.source_topic_key,
                   'name', st.name,
                   'arabicName', st.arabic_name,
                   'sourceDetailTarget', jsonb_build_object('entityType', 'source_topic', 'entityId', st.id::text)
                 ) order by st.name, st.source_topic_key)
            from content.source_topic_ayahs sta
            join content.source_topics st on st.id = sta.topic_id
           where sta.ayah_id = qa.id
        ), '[]'::jsonb),
        'sourceAyahThemes', coalesce((
          select jsonb_agg(jsonb_build_object(
                   'groupId', sag.id,
                   'sourceGroupKey', sag.source_group_key,
                   'themeText', sag.theme_text,
                   'rawKeywords', sag.raw_keywords,
                   'sourceDetailTarget', jsonb_build_object('entityType', 'source_ayah_theme_group', 'entityId', sag.id::text)
                 ) order by sag.source_group_key)
            from content.source_ayah_theme_group_ayahs saga
            join content.source_ayah_theme_groups sag on sag.id = saga.group_id
           where saga.ayah_id = qa.id
        ), '[]'::jsonb)
      ) order by qa.ayah_number
    ), '[]'::jsonb)
  )
    from content.quran_surahs qs
    join content.quran_ayahs qa on qa.surah_number = qs.surah_number
    left join selected_quran sq on true
    left join content.quran_ayah_texts qat on qat.ayah_id = qa.id and qat.edition_id = sq.id
    left join selected_translation stn on true
    left join content.translation_texts tt
      on tt.ayah_id = qa.id
     and tt.edition_id = stn.id
     and tt.variant_type = 'plain'
   where qs.surah_number = p_surah_number
   group by qs.surah_number, qs.canonical_name_ar, qs.canonical_name_latin,
            qs.ayah_count;
$$;

create or replace function private_api.get_hadith_record(p_hadith_record_id uuid)
returns jsonb
language sql
stable
security definer
set search_path = private_api, content, public
as $$
  select jsonb_build_object(
    'notice', private_api.private_content_notice(),
    'record', jsonb_build_object(
      'hadithRecordId', hr.id,
      'collectionKey', hc.collection_key,
      'collectionName', hc.name_en,
      'editionKey', he.edition_key,
      'sourceHadithKey', hr.source_hadith_key,
      'sourceHadithNumber', hr.source_hadith_number,
      'sourceArabicNumber', hr.source_arabic_number,
      'sourceUrn', hr.source_urn,
      'printedReference', hr.printed_reference,
      'sourceDetailTarget', jsonb_build_object('entityType', 'hadith_record', 'entityId', hr.id::text)
    ),
    'textVersions', coalesce((
      select jsonb_agg(jsonb_build_object(
               'textVersionId', htv.id,
               'languageCode', htv.language_code,
               'translatorName', htv.translator_name,
               'fullText', htv.full_text,
               'narratorPrefix', htv.narrator_prefix,
               'isnadText', htv.isnad_text,
               'matnText', htv.matn_text,
               'sourceHtml', htv.source_html,
               'textHash', htv.text_hash,
               'sourceDetailTarget', jsonb_build_object('entityType', 'hadith_text_version', 'entityId', htv.id::text)
             ) order by htv.language_code, htv.created_at)
        from content.hadith_text_versions htv
       where htv.hadith_record_id = hr.id
    ), '[]'::jsonb),
    'gradeAssertions', coalesce((
      select jsonb_agg(jsonb_build_object(
               'assertionId', hga.id,
               'graderNameRaw', hga.grader_name_raw,
               'rawGrade', hga.raw_grade,
               'claimScope', hga.claim_scope,
               'citation', hga.citation,
               'normalizedLabel', hgn.normalized_label,
               'normalizationVersion', hgn.normalization_version,
               'mappingMethod', hgn.mapping_method,
               'reviewStatus', hgn.review_status,
               'sourceDetailTarget', jsonb_build_object('entityType', 'hadith_grade_assertion', 'entityId', hga.id::text)
             ) order by hga.grader_name_raw, hga.raw_grade)
        from content.hadith_grade_assertions hga
        left join content.hadith_grade_normalizations hgn on hgn.assertion_id = hga.id
       where hga.hadith_record_id = hr.id
    ), '[]'::jsonb),
    'verificationClaims', coalesce((
      select jsonb_agg(jsonb_build_object(
               'claimId', hvc.id,
               'claimText', hvc.claim_text,
               'rawConclusion', hvc.raw_conclusion,
               'claimScope', hvc.claim_scope,
               'scholarResearcherRaw', hvc.scholar_researcher_raw,
               'explanation', hvc.explanation,
               'classificationStatus', hvc.classification_status,
               'editorialWorkflowStatus', hvc.editorial_workflow_status,
               'reviewStatus', hvc.review_status,
               'sourceDetailTarget', jsonb_build_object('entityType', 'hadith_verification_claim', 'entityId', hvc.id::text)
             ) order by hvc.created_at)
        from content.hadith_verification_claims hvc
       where hvc.hadith_record_id = hr.id
    ), '[]'::jsonb)
  )
    from content.hadith_records hr
    join content.hadith_editions he on he.id = hr.edition_id
    join content.hadith_collections hc on hc.id = he.collection_id
   where hr.id = p_hadith_record_id;
$$;

revoke all on function private_api.get_source_detail(text, text)
  from public, anon, authenticated;
grant execute on function private_api.get_source_detail(text, text)
  to service_role;
