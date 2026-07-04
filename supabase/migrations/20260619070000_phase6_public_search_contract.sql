-- RAFIQ Phase 6 Checkpoint 02: Public Search Contract.
--
-- Public search must use the same ranked search documents as the private app,
-- but it may only return rows whose canonical target entity passes every
-- public release gate. With the current private_only dataset, this function is
-- intentionally callable and empty.

create or replace function public_api.search_public_content(
  p_query text,
  p_domain text default 'all',
  p_limit integer default 20,
  p_offset integer default 0
)
returns jsonb
language plpgsql
stable
security definer
set search_path = public_api, content, public
as $$
declare
  query_text text := nullif(trim(coalesce(p_query, '')), '');
  domain_filter text := lower(coalesce(nullif(trim(p_domain), ''), 'all'));
  document_domain_filter text;
  page_limit integer := least(greatest(coalesce(p_limit, 20), 1), 50);
  page_offset integer := greatest(coalesce(p_offset, 0), 0);
  ts_query tsquery;
  result_payload jsonb := '[]'::jsonb;
  facet_payload jsonb := '{}'::jsonb;
  total_count integer := 0;
begin
  document_domain_filter := case
    when domain_filter = 'topics' then 'topic'
    when domain_filter in ('themes', 'theme', 'ayah_themes') then 'ayah_theme'
    else domain_filter
  end;

  if query_text is null then
    return jsonb_build_object(
      'notice', public_api.public_release_notice(),
      'query', jsonb_build_object('text', null, 'domain', domain_filter),
      'pagination', jsonb_build_object('limit', page_limit, 'offset', page_offset, 'total', 0),
      'facets', '{}'::jsonb,
      'results', '[]'::jsonb,
      'releaseFilter', jsonb_build_object(
        'status', 'active',
        'source', 'public_api.release_approved_entities',
        'pendingContentBlocked', true,
        'privateSearchIndexReadable', false
      )
    );
  end if;

  ts_query := websearch_to_tsquery('simple', query_text);

  with candidate_documents as (
    select psd.*,
           case
             when psd.domain = 'quran' then 'quran_ayah'
             when psd.domain = 'tafsir' then 'tafsir_passage'
             when psd.domain = 'topic' then 'source_topic'
             when psd.domain = 'ayah_theme' then 'source_ayah_theme_group'
             when psd.domain = 'hadith' then 'hadith_record'
             else null
           end as release_entity_type,
           case
             when psd.domain = 'quran' then qa.id::text
             when psd.domain = 'tafsir' then psd.target->>'passageId'
             when psd.domain = 'topic' then psd.target->>'topicId'
             when psd.domain = 'ayah_theme' then psd.target->>'themeGroupId'
             when psd.domain = 'hadith' then psd.hadith_record_id::text
             else null
           end as release_entity_id,
           ((ts_rank(psd.search_vector, ts_query) * psd.rank_weight)
             + case when lower(psd.title) = lower(query_text) then 0.5 else 0 end
             + case when psd.domain = document_domain_filter then 0.2 else 0 end) as score
      from content.private_search_documents psd
      left join content.quran_ayahs qa
        on qa.surah_number = psd.surah_number
       and qa.ayah_number = psd.ayah_number
     where document_domain_filter in ('all', psd.domain)
       and psd.search_vector @@ ts_query
  ),
  approved as (
    select cd.*
      from candidate_documents cd
      join public_api.release_approved_entities rae
        on rae.entity_type = cd.release_entity_type
       and rae.entity_id = cd.release_entity_id
  ),
  counted as (
    select approved.*,
           count(*) over () as total_rows
      from approved
  ),
  paged as (
    select *
      from counted
     order by score desc,
              rank_weight desc,
              domain,
              surah_number nulls last,
              ayah_number nulls last,
              collection_key nulls last,
              result_id
     limit page_limit
    offset page_offset
  ),
  facets as (
    select domain, count(*) as result_count
      from approved
     group by domain
  )
  select coalesce(jsonb_agg(jsonb_build_object(
           'domain', paged.domain,
           'resultId', paged.result_id,
           'title', paged.title,
           'subtitle', paged.subtitle,
           'snippet', left(coalesce(paged.snippet, ''), 520),
           'score', round(paged.score::numeric, 6),
           'reference', jsonb_build_object(
             'surahNumber', paged.surah_number,
             'ayahNumber', paged.ayah_number,
             'verseKey', paged.verse_key,
             'hadithRecordId', paged.hadith_record_id,
             'collectionKey', paged.collection_key
           ),
           'target', paged.target,
           'release', jsonb_build_object(
             'entityType', paged.release_entity_type,
             'entityId', paged.release_entity_id,
             'gatePassed', true
           )
         ) order by paged.score desc,
                  paged.rank_weight desc,
                  paged.domain,
                  paged.surah_number nulls last,
                  paged.ayah_number nulls last,
                  paged.collection_key nulls last,
                  paged.result_id), '[]'::jsonb),
         coalesce(max(paged.total_rows), 0),
         coalesce((select jsonb_object_agg(domain, result_count order by domain) from facets), '{}'::jsonb)
    into result_payload, total_count, facet_payload
    from paged;

  return jsonb_build_object(
    'notice', public_api.public_release_notice(),
    'query', jsonb_build_object('text', query_text, 'domain', domain_filter),
    'pagination', jsonb_build_object('limit', page_limit, 'offset', page_offset, 'total', total_count),
    'facets', facet_payload,
    'results', result_payload,
    'releaseFilter', jsonb_build_object(
      'status', 'active',
      'source', 'public_api.release_approved_entities',
      'pendingContentBlocked', true,
      'privateSearchIndexReadable', false
    )
  );
end;
$$;

revoke all on function public_api.search_public_content(text, text, integer, integer)
  from public;
grant execute on function public_api.search_public_content(text, text, integer, integer)
  to anon, authenticated, service_role;
