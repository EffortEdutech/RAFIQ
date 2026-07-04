-- RAFIQ Phase 5 Checkpoint 08: Indexed private search, ranking, and retrieval traces.
--
-- This remains private infrastructure only. No client role receives direct
-- content/search table access. The NestJS service-role API is the only product
-- bridge.

create table if not exists content.private_search_documents (
  id uuid primary key default gen_random_uuid(),
  result_id text not null unique,
  domain text not null check (domain in ('quran', 'tafsir', 'topic', 'ayah_theme', 'hadith')),
  title text not null,
  subtitle text,
  searchable_text text not null,
  snippet text,
  surah_number smallint,
  ayah_number smallint,
  verse_key text,
  hadith_record_id uuid,
  collection_key text,
  target jsonb not null default '{}'::jsonb,
  rank_weight numeric not null default 1,
  search_vector tsvector generated always as
    (to_tsvector('simple', coalesce(title, '') || ' ' || coalesce(subtitle, '') || ' ' || coalesce(searchable_text, ''))) stored,
  source_updated_at timestamptz not null default now(),
  indexed_at timestamptz not null default now()
);

create index if not exists idx_private_search_documents_vector
  on content.private_search_documents using gin (search_vector);
create index if not exists idx_private_search_documents_domain
  on content.private_search_documents(domain, rank_weight desc, result_id);
create index if not exists idx_private_search_documents_quran_ref
  on content.private_search_documents(surah_number, ayah_number)
  where surah_number is not null;
create index if not exists idx_private_search_documents_hadith_ref
  on content.private_search_documents(hadith_record_id)
  where hadith_record_id is not null;

create table if not exists content.private_retrieval_traces (
  id uuid primary key default gen_random_uuid(),
  trace_type text not null default 'private_search',
  query_text text,
  domain_filter text not null default 'all',
  limit_value integer not null,
  offset_value integer not null,
  total_results integer not null,
  returned_result_ids jsonb not null default '[]'::jsonb,
  facets jsonb not null default '{}'::jsonb,
  source text not null default 'private_api.search_content',
  review_status text not null default 'unreviewed',
  created_at timestamptz not null default now()
);

create index if not exists idx_private_retrieval_traces_created
  on content.private_retrieval_traces(created_at desc);
create index if not exists idx_private_retrieval_traces_review
  on content.private_retrieval_traces(review_status, created_at desc);

alter table content.private_search_documents enable row level security;
alter table content.private_retrieval_traces enable row level security;

grant select, insert, update, delete on content.private_search_documents to service_role;
grant select, insert, update, delete on content.private_retrieval_traces to service_role;

create or replace function private_api.rebuild_private_search_documents()
returns jsonb
language plpgsql
security definer
set search_path = private_api, content, public
as $$
declare
  inserted_count integer;
begin
  truncate table content.private_search_documents;

  insert into content.private_search_documents (
    result_id,
    domain,
    title,
    subtitle,
    searchable_text,
    snippet,
    surah_number,
    ayah_number,
    verse_key,
    hadith_record_id,
    collection_key,
    target,
    rank_weight
  )
  select ('quran:' || qa.verse_key || ':' || qte.edition_key)::text as result_id,
         'quran'::text as domain,
         qa.verse_key as title,
         qte.name as subtitle,
         qat.text_value as searchable_text,
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
         1.50 as rank_weight
    from content.quran_text_editions qte
    join content.quran_ayah_texts qat on qat.edition_id = qte.id
    join content.quran_ayahs qa on qa.id = qat.ayah_id
   where qte.active;

  insert into content.private_search_documents (
    result_id,
    domain,
    title,
    subtitle,
    searchable_text,
    snippet,
    surah_number,
    ayah_number,
    verse_key,
    hadith_record_id,
    collection_key,
    target,
    rank_weight
  )
  select ('tafsir:' || tp.id::text)::text as result_id,
         'tafsir'::text as domain,
         ('Tafsir ' || coalesce(min(qa.verse_key), tp.passage_key)) as title,
         te.title as subtitle,
         coalesce(tp.passage_text, '') as searchable_text,
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
         1.25 as rank_weight
    from content.tafsir_editions te
    join content.tafsir_passages tp on tp.edition_id = te.id
    join content.tafsir_passage_ayahs tpa on tpa.passage_id = tp.id
    join content.quran_ayahs qa on qa.id = tpa.ayah_id
   where te.active
     and coalesce(tp.passage_text, '') <> ''
   group by tp.id, tp.passage_key, tp.passage_text, te.title;

  insert into content.private_search_documents (
    result_id,
    domain,
    title,
    subtitle,
    searchable_text,
    snippet,
    surah_number,
    ayah_number,
    verse_key,
    hadith_record_id,
    collection_key,
    target,
    rank_weight
  )
  select ('topic:' || st.id::text)::text as result_id,
         'topic'::text as domain,
         st.name as title,
         coalesce(st.arabic_name, sx.name) as subtitle,
         concat_ws(' ', st.name, st.arabic_name, st.description) as searchable_text,
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
         1.10 as rank_weight
    from content.source_topics st
    join content.source_taxonomies sx on sx.id = st.taxonomy_id
    left join content.source_topic_ayahs sta on sta.topic_id = st.id
    left join content.quran_ayahs qa on qa.id = sta.ayah_id
   group by st.id, st.name, st.arabic_name, st.description, st.source_topic_key, sx.name;

  insert into content.private_search_documents (
    result_id,
    domain,
    title,
    subtitle,
    searchable_text,
    snippet,
    surah_number,
    ayah_number,
    verse_key,
    hadith_record_id,
    collection_key,
    target,
    rank_weight
  )
  select ('ayah_theme:' || sag.id::text)::text as result_id,
         'ayah_theme'::text as domain,
         'Ayah theme' as title,
         sag.raw_keywords as subtitle,
         concat_ws(' ', sag.theme_text, sag.raw_keywords) as searchable_text,
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
         1.00 as rank_weight
    from content.source_ayah_theme_groups sag
    left join content.source_ayah_theme_group_ayahs saga on saga.group_id = sag.id
    left join content.quran_ayahs qa on qa.id = saga.ayah_id
   group by sag.id, sag.theme_text, sag.raw_keywords;

  insert into content.private_search_documents (
    result_id,
    domain,
    title,
    subtitle,
    searchable_text,
    snippet,
    surah_number,
    ayah_number,
    verse_key,
    hadith_record_id,
    collection_key,
    target,
    rank_weight
  )
  select ('hadith:' || hr.id::text || ':' || htv.id::text)::text as result_id,
         'hadith'::text as domain,
         coalesce(hc.name_en, hc.collection_key) as title,
         coalesce('No. ' || hr.source_hadith_number, he.edition_key) as subtitle,
         coalesce(htv.full_text, '') as searchable_text,
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
         0.90 as rank_weight
    from content.hadith_text_versions htv
    join content.hadith_records hr on hr.id = htv.hadith_record_id
    join content.hadith_editions he on he.id = hr.edition_id
    join content.hadith_collections hc on hc.id = he.collection_id
   where coalesce(htv.full_text, '') <> '';

  get diagnostics inserted_count = row_count;

  return jsonb_build_object(
    'notice', private_api.private_content_notice(),
    'status', 'rebuilt',
    'documentCount', (select count(*) from content.private_search_documents),
    'lastInsertCount', inserted_count
  );
end;
$$;

create or replace function private_api.search_content(
  p_query text,
  p_domain text default 'all',
  p_limit integer default 20,
  p_offset integer default 0
)
returns jsonb
language plpgsql
volatile
security definer
set search_path = private_api, content, public
as $$
declare
  query_text text := nullif(trim(coalesce(p_query, '')), '');
  domain_filter text := lower(coalesce(nullif(trim(p_domain), ''), 'all'));
  document_domain_filter text;
  page_limit integer := least(greatest(coalesce(p_limit, 20), 1), 50);
  page_offset integer := greatest(coalesce(p_offset, 0), 0);
  ts_query tsquery;
  result_payload jsonb;
  facet_payload jsonb;
  total_count integer;
  trace_id uuid;
  returned_ids jsonb;
begin
  document_domain_filter := case
    when domain_filter = 'topics' then 'topic'
    when domain_filter in ('themes', 'theme', 'ayah_themes') then 'ayah_theme'
    else domain_filter
  end;

  if query_text is null then
    insert into content.private_retrieval_traces (
      query_text,
      domain_filter,
      limit_value,
      offset_value,
      total_results,
      returned_result_ids,
      facets
    )
    values (null, domain_filter, page_limit, page_offset, 0, '[]'::jsonb, '{}'::jsonb)
    returning id into trace_id;

    return jsonb_build_object(
      'notice', private_api.private_content_notice(),
      'query', jsonb_build_object('text', null, 'domain', domain_filter),
      'pagination', jsonb_build_object('limit', page_limit, 'offset', page_offset, 'total', 0),
      'facets', '{}'::jsonb,
      'retrievalTrace', jsonb_build_object(
        'traceId', trace_id,
        'traceType', 'private_search',
        'reviewStatus', 'unreviewed'
      ),
      'results', '[]'::jsonb
    );
  end if;

  ts_query := websearch_to_tsquery('simple', query_text);

  with matched as (
    select psd.*,
           ((ts_rank(psd.search_vector, ts_query) * psd.rank_weight)
             + case when lower(psd.title) = lower(query_text) then 0.5 else 0 end
             + case when psd.domain = document_domain_filter then 0.2 else 0 end) as score
      from content.private_search_documents psd
     where document_domain_filter in ('all', psd.domain)
       and psd.search_vector @@ ts_query
  ),
  counted as (
    select matched.*,
           count(*) over () as total_rows
      from matched
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
      from matched
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
           'target', paged.target
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

  returned_ids := coalesce((
    select jsonb_agg(value->>'resultId')
      from jsonb_array_elements(result_payload) as items(value)
  ), '[]'::jsonb);

  insert into content.private_retrieval_traces (
    query_text,
    domain_filter,
    limit_value,
    offset_value,
    total_results,
    returned_result_ids,
    facets
  )
  values (
    query_text,
    domain_filter,
    page_limit,
    page_offset,
    total_count,
    returned_ids,
    facet_payload
  )
  returning id into trace_id;

  return jsonb_build_object(
    'notice', private_api.private_content_notice(),
    'query', jsonb_build_object('text', query_text, 'domain', domain_filter),
    'pagination', jsonb_build_object('limit', page_limit, 'offset', page_offset, 'total', total_count),
    'facets', facet_payload,
    'retrievalTrace', jsonb_build_object(
      'traceId', trace_id,
      'traceType', 'private_search',
      'reviewStatus', 'unreviewed'
    ),
    'results', result_payload
  );
end;
$$;

create or replace function private_api.get_retrieval_trace(p_trace_id uuid)
returns jsonb
language sql
volatile
security definer
set search_path = private_api, content, public
as $$
  select jsonb_build_object(
    'notice', private_api.private_content_notice(),
    'trace', jsonb_build_object(
      'traceId', prt.id,
      'traceType', prt.trace_type,
      'queryText', prt.query_text,
      'domainFilter', prt.domain_filter,
      'limit', prt.limit_value,
      'offset', prt.offset_value,
      'totalResults', prt.total_results,
      'returnedResultIds', prt.returned_result_ids,
      'facets', prt.facets,
      'source', prt.source,
      'reviewStatus', prt.review_status,
      'createdAt', prt.created_at
    )
  )
    from content.private_retrieval_traces prt
   where prt.id = p_trace_id;
$$;

select private_api.rebuild_private_search_documents();

revoke all on function private_api.rebuild_private_search_documents()
  from public, anon, authenticated;
revoke all on function private_api.search_content(text, text, integer, integer)
  from public, anon, authenticated;
revoke all on function private_api.get_retrieval_trace(uuid)
  from public, anon, authenticated;

grant execute on function private_api.rebuild_private_search_documents()
  to service_role;
grant execute on function private_api.search_content(text, text, integer, integer)
  to service_role;
grant execute on function private_api.get_retrieval_trace(uuid)
  to service_role;
