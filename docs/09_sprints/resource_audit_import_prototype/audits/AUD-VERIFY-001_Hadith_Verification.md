# AUD-VERIFY-001: Hadith Verification

Status: Local Source Audit Complete; External Access Pending  
Audit date: 2026-06-14

## SemakHadis

Downloaded resources:

- archived `semakhadis-api` repository
- `hadith_seeder.xlsx` with 60 records
- API seed tables and schema
- archived frontend repository
- frontend `mock.json` with 28 records

The GitHub API repository is archived and read-only. Its schema separates:

### Classification Status

- `draft`
- `sahih`
- `palsu`
- `hasan`
- `dhaif`
- `maudhu`
- `tidak sahih`

### Editorial Progress Status

- `draf`
- `diterbitkan`
- `disemak`
- `dibuang`

These are different dimensions. A hadith classification must never be mapped
into publication workflow state.

The schema also supports Arabic and Malay text, descriptions, narrators,
references, tags, creator identity, reports, and audit logs. However, the
repository does not contain the complete live verification database.

## Seed Workbook

The workbook contains 60 rows with:

- Arabic and Malay text
- Companion narrator
- chapter and keyword
- free-text status
- scholar/researcher commentary
- scholar/researcher attribution
- multiple reference and volume/page columns

Status vocabulary includes `Palsu`, `Tidak sahih`, `Munkar`, `Lemah`,
`Sangat lemah`, `Batil`, `Bukan hadis`, and `tidak ada sumbernya`.

Researcher fields cite several authorities, including Al-Albani, Ibn Qayyim
al-Jawziyyah, and Ibn Iraq al-Kinani. These are assertions embedded in a seed
workbook; each still requires a preserved citation and source-row lineage.

The workbook contains mojibake in names and punctuation. Repair only in
derived staging.

## Frontend Mock Data

The 28 records are development mock/sample content, not an authoritative
export:

- 27 have a blank `pengkaji-hadis` value
- 10 have blank Arabic text
- 10 have no references
- six use the placeholder status `asdasd`
- statuses mix concise grades with free-text verification conclusions

Do not treat frontend mock IDs, approval fields, or labels as production
verification records.

## Dorar Al-Sunniyyah

Dorar publishes a hadith search API description and a methodology for its
hadith encyclopedia. The methodology emphasizes:

- preserving the named critic's judgment
- distinguishing rulings on the hadith from rulings on an isnad
- retaining concise source references
- grouping results by broad authenticity categories
- presenting conflicting scholarly assessments where applicable

On 2026-06-14, automated requests to the documented JSON endpoint returned
HTTP 403. RAFIQ did not bypass the restriction and acquired no Dorar payload.

Required follow-up:

- request permitted API or bulk research access
- confirm storage, caching, attribution, and public-display terms
- obtain a dated sample or export
- validate result fields and stable identifiers

Official references:

- https://dorar.net/article/77
- https://dorar.net/article/79

## Canonical Recommendation

Use `hadith_verification_claims` with:

- source and source record ID
- hadith/source mapping
- claim type
- verbatim conclusion
- normalized classification
- claim scope: hadith, matn, isnad, wording, attribution, or source absence
- scholar/researcher attribution
- cited reference
- explanation
- editorial workflow state
- source publication state
- parser and review lineage

Verification claims must coexist with grade assertions. `Not found`,
`no origin`, `weak isnad`, and `fabricated` are not interchangeable.

## Decision Boundary

SemakHadis resources are sufficient for schema discovery and private adapter
testing, but not for claiming complete verification coverage. Dorar remains an
access-pending source.

All available records should be imported privately with quality flags.
Public verification display remains pending source permission, complete
citations, normalization review, and content approval.

