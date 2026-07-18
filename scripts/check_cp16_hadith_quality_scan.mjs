import { createRequire } from 'node:module';

const require = createRequire(new URL('../apps/api/src/modules/private-content/private-content.repository.ts', import.meta.url));
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.RAFIQ_DATABASE_URL ?? 'postgresql://postgres:postgres@127.0.0.1:55422/postgres',
});

const flagExpression = `
  array_remove(array[
    case when htv.full_text ~* '\\m([[:alpha:]]{4,})\\s+\\1\\M' then 'repeated_word' end,
    case when htv.full_text ~* '(did reply to him but|narrated narrated|mercy mercy|prayer prayer)' then 'known_broken_phrase' end,
    case when char_length(coalesce(htv.full_text, '')) < 24 then 'suspicious_short' end,
    case when char_length(coalesce(htv.full_text, '')) > 4000 then 'suspicious_long' end,
    case when htv.full_text is null or btrim(htv.full_text) = '' then 'blank_text' end
  ], null)
`;

const client = await pool.connect();

try {
  await client.query('set role service_role');

  const summary = await client.query(`
    with flagged as (
      select
        htv.id,
        htv.language_code,
        ${flagExpression} as flags
      from content.hadith_text_versions htv
      where coalesce(htv.language_code, '') <> 'ar'
    )
    select
      count(*)::int as meaning_count,
      count(*) filter (where cardinality(flags) > 0)::int as flagged_count,
      count(*) filter (where 'repeated_word' = any(flags))::int as repeated_word_count,
      count(*) filter (where 'known_broken_phrase' = any(flags))::int as known_broken_phrase_count,
      count(*) filter (where 'suspicious_short' = any(flags))::int as suspicious_short_count,
      count(*) filter (where 'suspicious_long' = any(flags))::int as suspicious_long_count,
      count(*) filter (where 'blank_text' = any(flags))::int as blank_text_count
    from flagged
  `);

  const samples = await client.query(`
    with flagged as (
      select
        htv.id as text_version_id,
        htv.hadith_record_id,
        htv.language_code,
        hc.collection_key,
        he.edition_key,
        hr.source_hadith_number,
        left(regexp_replace(coalesce(htv.full_text, ''), '\\s+', ' ', 'g'), 260) as sample,
        ${flagExpression} as flags
      from content.hadith_text_versions htv
      join content.hadith_records hr on hr.id = htv.hadith_record_id
      join content.hadith_editions he on he.id = hr.edition_id
      join content.hadith_collections hc on hc.id = he.collection_id
      where coalesce(htv.language_code, '') <> 'ar'
    )
    select *
    from flagged
    where cardinality(flags) > 0
    order by cardinality(flags) desc, collection_key, source_hadith_number nulls last
    limit 25
  `);

  const scan = summary.rows[0];
  const report = {
    status: scan.meaning_count > 0 ? 'pass' : 'fail',
    checkpoint: 'CP16',
    scan,
    reviewQueue: samples.rows.map((row) => ({
      severity: row.flags.includes('blank_text') || row.flags.includes('known_broken_phrase') ? 'high' : 'medium',
      subjectType: 'hadith_text_version',
      subjectId: row.text_version_id,
      hadithRecordId: row.hadith_record_id,
      collectionKey: row.collection_key,
      editionKey: row.edition_key,
      sourceHadithNumber: row.source_hadith_number,
      languageCode: row.language_code,
      flags: row.flags,
      sample: row.sample,
    })),
    quarantineRule:
      'Any Hadith meaning record with blank_text, known_broken_phrase, repeated_word, suspicious_short, or suspicious_long should stay out of user-facing guidance until reviewed or replaced.',
  };

  console.log(JSON.stringify(report, null, 2));
  if (report.status !== 'pass') process.exitCode = 1;
} finally {
  client.release();
  await pool.end();
}
