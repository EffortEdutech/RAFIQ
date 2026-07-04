-- RAFIQ Phase 5 Checkpoint 07: Private search and retrieval foundation.
--
-- This is a private server-side search contract only. It intentionally stays
-- inside private_api and remains service_role-only while content approvals are
-- pending.

create or replace function private_api.search_content(
  p_query text,
  p_domain text default 'all',
  p_limit integer default 20,
  p_offset integer default 0
)
returns jsonb
language sql
stable
security definer
set search_path = private_api, content, public
as $$
  with search_input as (
    select nullif(trim(coalesce(p_query, '')), '') as query_text,
           lower(coalesce(nullif(trim(p_domain), ''), 'all')) as domain_filter,
           least(greatest(coalesce(p_limit, 20), 1), 50) as page_limit,
           greatest(coalesce(p_offset, 0), 0) as page_offset
  ),
  quran_results as (
    select 'quran'::text as domain,
           ('quran:' || qa.verse_key || ':' || qte.edition_key)::text as result_id,
           qa.verse_key as title,
           qte.name as subtitle,
           qat.text_value as snippet,
           qa.surah_number,
           qa.ayah_number,
           qa.verse_key,
           null::uuid as hadith_record_id,
           null::text as collection_key,
           jsonb_build_object(
             'route', '/quran/' || qa.surah_number,
             'surahNumber', qa.surah_number,
             'ayahNumber', qa.ayah_number,
             'verseKey', qa.verse_key
           ) as target,
           10 as rank_group
      from search_input si
      join content.quran_text_editions qte on qte.active
      join content.quran_ayah_texts qat on qat.edition_id = qte.id
      join content.quran_ayahs qa on qa.id = qat.ayah_id
     where si.query_text is not null
       and si.domain_filter in ('all', 'quran')
       and qat.text_value ilike ('%' || si.query_text || '%')
  ),
  tafsir_results as (
    select 'tafsir'::text as domain,
           ('tafsir:' || tp.id::text)::text as result_id,
           ('Tafsir ' || coalesce(min(qa.verse_key), tp.passage_key)) as title,
           te.title as subtitle,
           tp.passage_text as snippet,
           min(qa.surah_number) as surah_number,
           min(qa.ayah_number) as ayah_number,
           min(qa.verse_key) as verse_key,
           null::uuid as hadith_record_id,
           null::text as collection_key,
           jsonb_build_object(
             'route', '/quran/' || min(qa.surah_number),
             'surahNumber', min(qa.surah_number),
             'ayahNumber', min(qa.ayah_number),
             'verseKey', min(qa.verse_key),
             'passageId', tp.id
           ) as target,
           20 as rank_group
      from search_input si
      join content.tafsir_editions te on te.active
      join content.tafsir_passages tp on tp.edition_id = te.id
      join content.tafsir_passage_ayahs tpa on tpa.passage_id = tp.id
      join content.quran_ayahs qa on qa.id = tpa.ayah_id
     where si.query_text is not null
       and si.domain_filter in ('all', 'tafsir')
       and coalesce(tp.passage_text, '') ilike ('%' || si.query_text || '%')
     group by tp.id, tp.passage_key, tp.passage_text, te.title
  ),
  topic_results as (
    select 'topic'::text as domain,
           ('topic:' || st.id::text)::text as result_id,
           st.name as title,
           coalesce(st.arabic_name, sx.name) as subtitle,
           coalesce(st.description, st.name) as snippet,
           min(qa.surah_number) as surah_number,
           min(qa.ayah_number) as ayah_number,
           min(qa.verse_key) as verse_key,
           null::uuid as hadith_record_id,
           null::text as collection_key,
           jsonb_build_object(
             'route', '/quran/' || min(qa.surah_number),
             'surahNumber', min(qa.surah_number),
             'ayahNumber', min(qa.ayah_number),
             'verseKey', min(qa.verse_key),
             'topicId', st.id,
             'sourceTopicKey', st.source_topic_key
           ) as target,
           30 as rank_group
      from search_input si
      join content.source_topics st on true
      join content.source_taxonomies sx on sx.id = st.taxonomy_id
      left join content.source_topic_ayahs sta on sta.topic_id = st.id
      left join content.quran_ayahs qa on qa.id = sta.ayah_id
     where si.query_text is not null
       and si.domain_filter in ('all', 'topic', 'topics')
       and (
         st.name ilike ('%' || si.query_text || '%')
         or coalesce(st.arabic_name, '') ilike ('%' || si.query_text || '%')
         or coalesce(st.description, '') ilike ('%' || si.query_text || '%')
       )
     group by st.id, st.name, st.arabic_name, st.description, st.source_topic_key, sx.name
  ),
  ayah_theme_results as (
    select 'ayah_theme'::text as domain,
           ('ayah_theme:' || sag.id::text)::text as result_id,
           'Ayah theme' as title,
           sag.raw_keywords as subtitle,
           sag.theme_text as snippet,
           min(qa.surah_number) as surah_number,
           min(qa.ayah_number) as ayah_number,
           min(qa.verse_key) as verse_key,
           null::uuid as hadith_record_id,
           null::text as collection_key,
           jsonb_build_object(
             'route', '/quran/' || min(qa.surah_number),
             'surahNumber', min(qa.surah_number),
             'ayahNumber', min(qa.ayah_number),
             'verseKey', min(qa.verse_key),
             'themeGroupId', sag.id
           ) as target,
           40 as rank_group
      from search_input si
      join content.source_ayah_theme_groups sag on true
      left join content.source_ayah_theme_group_ayahs saga on saga.group_id = sag.id
      left join content.quran_ayahs qa on qa.id = saga.ayah_id
     where si.query_text is not null
       and si.domain_filter in ('all', 'ayah_theme', 'ayah_themes', 'theme', 'themes')
       and (
         sag.theme_text ilike ('%' || si.query_text || '%')
         or coalesce(sag.raw_keywords, '') ilike ('%' || si.query_text || '%')
       )
     group by sag.id, sag.theme_text, sag.raw_keywords
  ),
  hadith_results as (
    select 'hadith'::text as domain,
           ('hadith:' || hr.id::text || ':' || htv.id::text)::text as result_id,
           coalesce(hc.name_en, hc.collection_key) as title,
           coalesce('No. ' || hr.source_hadith_number, he.edition_key) as subtitle,
           htv.full_text as snippet,
           null::smallint as surah_number,
           null::smallint as ayah_number,
           null::text as verse_key,
           hr.id as hadith_record_id,
           hc.collection_key,
           jsonb_build_object(
             'route', '/hadith/' || hr.id,
             'hadithRecordId', hr.id,
             'collectionKey', hc.collection_key,
             'sourceHadithNumber', hr.source_hadith_number,
             'languageCode', htv.language_code
           ) as target,
           50 as rank_group
      from search_input si
      join content.hadith_text_versions htv on true
      join content.hadith_records hr on hr.id = htv.hadith_record_id
      join content.hadith_editions he on he.id = hr.edition_id
      join content.hadith_collections hc on hc.id = he.collection_id
     where si.query_text is not null
       and si.domain_filter in ('all', 'hadith')
       and coalesce(htv.full_text, '') ilike ('%' || si.query_text || '%')
  ),
  all_results as (
    select * from quran_results
    union all
    select * from tafsir_results
    union all
    select * from topic_results
    union all
    select * from ayah_theme_results
    union all
    select * from hadith_results
  ),
  ranked as (
    select ar.*,
           count(*) over () as total_count
      from all_results ar
     order by ar.rank_group,
              ar.surah_number nulls last,
              ar.ayah_number nulls last,
              ar.collection_key nulls last,
              ar.subtitle nulls last,
              ar.result_id
     limit (select page_limit from search_input)
    offset (select page_offset from search_input)
  ),
  domain_counts as (
    select domain, count(*) as result_count
      from all_results
     group by domain
  )
  select jsonb_build_object(
    'notice', private_api.private_content_notice(),
    'query', jsonb_build_object(
      'text', (select query_text from search_input),
      'domain', (select domain_filter from search_input)
    ),
    'pagination', jsonb_build_object(
      'limit', (select page_limit from search_input),
      'offset', (select page_offset from search_input),
      'total', coalesce((select max(total_count) from ranked), 0)
    ),
    'facets', coalesce((
      select jsonb_object_agg(domain, result_count order by domain)
        from domain_counts
    ), '{}'::jsonb),
    'results', coalesce(jsonb_agg(jsonb_build_object(
      'domain', ranked.domain,
      'resultId', ranked.result_id,
      'title', ranked.title,
      'subtitle', ranked.subtitle,
      'snippet', left(coalesce(ranked.snippet, ''), 520),
      'reference', jsonb_build_object(
        'surahNumber', ranked.surah_number,
        'ayahNumber', ranked.ayah_number,
        'verseKey', ranked.verse_key,
        'hadithRecordId', ranked.hadith_record_id,
        'collectionKey', ranked.collection_key
      ),
      'target', ranked.target
    ) order by ranked.rank_group,
             ranked.surah_number nulls last,
             ranked.ayah_number nulls last,
             ranked.collection_key nulls last,
             ranked.subtitle nulls last,
             ranked.result_id), '[]'::jsonb)
  )
    from ranked;
$$;

revoke all on function private_api.search_content(text, text, integer, integer)
  from public, anon, authenticated;
grant execute on function private_api.search_content(text, text, integer, integer)
  to service_role;
