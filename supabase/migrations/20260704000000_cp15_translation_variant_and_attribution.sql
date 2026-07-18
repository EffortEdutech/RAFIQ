-- CP15: Translation coverage and attribution data upgrade.
--
-- The Phase 3 parser stores plain display translations with variant_type
-- `simple`. The Phase 5 retrieval RPC was still joining only `plain`, which
-- left Quran study rooms without translations even when a selected translation
-- edition existed.

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
    left join lateral (
      select candidate.*
        from content.translation_texts candidate
       where candidate.ayah_id = qa.id
         and candidate.edition_id = stn.id
         and candidate.variant_type in ('simple', 'plain')
       order by case candidate.variant_type when 'simple' then 0 when 'plain' then 1 else 2 end
       limit 1
    ) tt on true
   where qs.surah_number = p_surah_number
   group by qs.surah_number, qs.canonical_name_ar, qs.canonical_name_latin,
            qs.ayah_count;
$$;

revoke all on function private_api.get_quran_surah(integer, text, text, text)
  from public, anon, authenticated;
grant execute on function private_api.get_quran_surah(integer, text, text, text)
  to service_role;
