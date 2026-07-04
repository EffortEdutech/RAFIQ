-- RAFIQ Phase 5: Private Retrieval API
--
-- This schema is intentionally not a public API surface. It is a private
-- server-side retrieval contract for the RAFIQ API layer while content remains
-- pending rights, attribution, editorial, and scholar/content approval.

create schema if not exists private_api;

revoke all on schema private_api from public, anon, authenticated;
grant usage on schema private_api to service_role;

create or replace function private_api.private_content_notice()
returns jsonb
language sql
stable
security definer
set search_path = private_api, content, public
as $$
  select jsonb_build_object(
    'label', 'UNAPPROVED CONTENT - NOT FOR PUBLICATION',
    'publicationStatus', 'private_only',
    'rightsStatus', 'pending',
    'attributionStatus', 'pending',
    'editorialStatus', 'unreviewed',
    'scholarContentStatus', 'unreviewed',
    'message', 'Private RAFIQ development and testing only. Do not expose through public API, public app, exports, or AI answers until approval gates pass.'
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
      'ayahCount', qs.ayah_count
    ),
    'editions', jsonb_build_object(
      'quran', (select jsonb_build_object('editionKey', edition_key, 'name', name, 'scriptLabel', script_label, 'bismillahPolicy', bismillah_policy) from selected_quran),
      'translation', (select jsonb_build_object('editionKey', edition_key, 'languageCode', language_code, 'translatorName', translator_name, 'title', title) from selected_translation),
      'tafsir', (select jsonb_build_object('editionKey', edition_key, 'languageCode', language_code, 'title', title, 'authorName', author_name) from selected_tafsir)
    ),
    'ayahs', coalesce(jsonb_agg(
      jsonb_build_object(
        'ayahId', qa.id,
        'verseKey', qa.verse_key,
        'surahNumber', qa.surah_number,
        'ayahNumber', qa.ayah_number,
        'globalAyahNumber', qa.global_ayah_number,
        'quranText', qat.text_value,
        'translation', case when tt.id is null then null else jsonb_build_object(
          'translationTextId', tt.id,
          'variantType', tt.variant_type,
          'text', tt.text_value,
          'sourceMarkup', tt.source_markup
        ) end,
        'tafsirPassages', coalesce((
          select jsonb_agg(jsonb_build_object(
                   'passageId', tp.id,
                   'passageKey', tp.passage_key,
                   'text', tp.passage_text,
                   'blankText', tp.blank_text,
                   'sourceRole', tpa.source_role,
                   'sourceOrder', tpa.source_order
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
                   'arabicName', st.arabic_name
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
                   'rawKeywords', sag.raw_keywords
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

create or replace function private_api.list_hadith_collections()
returns jsonb
language sql
stable
security definer
set search_path = private_api, content, public
as $$
  select jsonb_build_object(
    'notice', private_api.private_content_notice(),
    'collections', coalesce(jsonb_agg(jsonb_build_object(
      'collectionId', hc.id,
      'collectionKey', hc.collection_key,
      'nameEnglish', hc.name_en,
      'nameArabic', hc.name_ar,
      'editionCount', coalesce(stats.edition_count, 0),
      'recordCount', coalesce(stats.record_count, 0),
      'textVersionCount', coalesce(stats.text_version_count, 0)
    ) order by hc.collection_key), '[]'::jsonb)
  )
    from content.hadith_collections hc
    left join lateral (
      select count(distinct he.id) as edition_count,
             count(distinct hr.id) as record_count,
             count(htv.id) as text_version_count
        from content.hadith_editions he
        left join content.hadith_records hr on hr.edition_id = he.id
        left join content.hadith_text_versions htv on htv.hadith_record_id = hr.id
       where he.collection_id = hc.id
    ) stats on true;
$$;

create or replace function private_api.list_hadith_records(
  p_collection_key text default null,
  p_language_code text default null,
  p_limit integer default 20,
  p_offset integer default 0
)
returns jsonb
language sql
stable
security definer
set search_path = private_api, content, public
as $$
  with bounded as (
    select least(greatest(coalesce(p_limit, 20), 1), 100) as page_limit,
           greatest(coalesce(p_offset, 0), 0) as page_offset
  ),
  filtered as (
    select hr.id, hr.source_hadith_key, hr.source_hadith_number, hr.source_urn,
           hr.printed_reference, he.edition_key, hc.collection_key, hc.name_en
      from content.hadith_records hr
      join content.hadith_editions he on he.id = hr.edition_id
      join content.hadith_collections hc on hc.id = he.collection_id
     where p_collection_key is null or hc.collection_key = p_collection_key
  ),
  paged as (
    select f.*
      from filtered f, bounded b
     order by f.collection_key, f.source_hadith_number nulls last, f.source_hadith_key
     limit (select page_limit from bounded)
    offset (select page_offset from bounded)
  )
  select jsonb_build_object(
    'notice', private_api.private_content_notice(),
    'pagination', jsonb_build_object(
      'limit', (select page_limit from bounded),
      'offset', (select page_offset from bounded),
      'total', (select count(*) from filtered)
    ),
    'records', coalesce(jsonb_agg(jsonb_build_object(
      'hadithRecordId', p.id,
      'collectionKey', p.collection_key,
      'collectionName', p.name_en,
      'editionKey', p.edition_key,
      'sourceHadithKey', p.source_hadith_key,
      'sourceHadithNumber', p.source_hadith_number,
      'sourceUrn', p.source_urn,
      'printedReference', p.printed_reference,
      'previewText', preview.full_text,
      'previewLanguageCode', preview.language_code,
      'gradeSummary', coalesce(grades.grade_summary, '[]'::jsonb)
    ) order by p.collection_key, p.source_hadith_number nulls last, p.source_hadith_key), '[]'::jsonb)
  )
    from paged p
    left join lateral (
      select htv.language_code, htv.full_text
        from content.hadith_text_versions htv
       where htv.hadith_record_id = p.id
         and (p_language_code is null or htv.language_code = p_language_code)
       order by case when htv.language_code = p_language_code then 0 else 1 end,
                htv.language_code,
                htv.created_at
       limit 1
    ) preview on true
    left join lateral (
      select jsonb_agg(jsonb_build_object(
               'graderNameRaw', hga.grader_name_raw,
               'rawGrade', hga.raw_grade,
               'normalizedLabel', hgn.normalized_label,
               'claimScope', hga.claim_scope,
               'reviewStatus', hgn.review_status
             ) order by hga.grader_name_raw, hga.raw_grade) as grade_summary
        from content.hadith_grade_assertions hga
        left join content.hadith_grade_normalizations hgn on hgn.assertion_id = hga.id
       where hga.hadith_record_id = p.id
    ) grades on true;
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
      'printedReference', hr.printed_reference
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
               'textHash', htv.text_hash
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
               'reviewStatus', hgn.review_status
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
               'reviewStatus', hvc.review_status
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

revoke all on function private_api.private_content_notice() from public, anon, authenticated;
revoke all on function private_api.get_quran_surah(integer, text, text, text) from public, anon, authenticated;
revoke all on function private_api.list_hadith_collections() from public, anon, authenticated;
revoke all on function private_api.list_hadith_records(text, text, integer, integer) from public, anon, authenticated;
revoke all on function private_api.get_hadith_record(uuid) from public, anon, authenticated;

grant execute on function private_api.private_content_notice() to service_role;
grant execute on function private_api.get_quran_surah(integer, text, text, text) to service_role;
grant execute on function private_api.list_hadith_collections() to service_role;
grant execute on function private_api.list_hadith_records(text, text, integer, integer) to service_role;
grant execute on function private_api.get_hadith_record(uuid) to service_role;
