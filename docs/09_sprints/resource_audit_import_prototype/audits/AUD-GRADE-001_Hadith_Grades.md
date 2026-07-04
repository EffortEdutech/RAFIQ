# AUD-GRADE-001: Hadith Grades

Status: Technical Audit Complete  
Audit date: 2026-06-14

## Scope

The audit inspected grade-bearing records in:

- Fawaz Ahmed hadith-api
- MeeAtif six-collection datasets
- LK-Hadith-Corpus
- Abdullah Naseer six-book JSON
- SemakHadis verification samples
- official Sunnah.com and Dorar grade-model documentation

## Measured Coverage

| Source | Profiles | Records | Grade-bearing records | Assertions |
| --- | ---: | ---: | ---: | ---: |
| Fawaz | 10 | 36,512 | 21,185 | 67,716 |
| MeeAtif | 6 | 33,738 | 18,056 | 18,056 |
| LK-Hadith-Corpus | 6 | 34,088 | 33,585 | 33,585 |
| Abdullah Naseer | 6 | 34,265 | 34,265 | 34,265 |

The Abdullah count must not be interpreted as reliable grade coverage. Its
README explicitly says hadith status is not accurately represented, while all
34,265 records are labeled sahih.

## Source Structures

### Fawaz

Fawaz has the strongest downloaded grade structure. A narration may carry
multiple objects with:

- grader name
- verbatim grade
- source collection and hadith number

Nine named graders occur in the selected English editions. The largest
assertion counts include:

| Grader label | Assertions |
| --- | ---: |
| Al-Albani | 19,081 |
| Zubair Ali Zai | 19,033 |
| Shuaib Al Arnaut | 6,413 |
| Abu Ghuddah | 5,692 |
| Muhammad Muhyi Al-Din Abdul Hamid | 5,171 |
| Muhammad Fouad Abd al-Baqi | 4,314 |
| Ahmad Muhammad Shakir | 3,729 |

The audit found 7,476 records where named assertions do not all map to the same
broad normalized bucket. This is a review queue, not an automatic declaration
of scholarly contradiction. Labels may describe matn, isnad, supporting
chains, source agreement, or composite judgments such as `Hasan Sahih`.

Fawaz's repository provenance gaps still apply. A named label must be retained
as a sourced assertion, not promoted automatically to RAFIQ's final judgment.

### MeeAtif

MeeAtif stores one display string per record. Examples include:

- `Sahih (Darussalam)`
- `Hasan (Darussalam)`
- `Hasan Sahih (Al-Albani)`
- `Da'if (Al-Albani)`

The grader can often be parsed from parentheses but is not represented as a
separate field. Bukhari and Muslim have no grade strings in this dataset.

### LK-Hadith-Corpus

LK provides English and Arabic grade columns. It has no explicit grader field.
The corpus documentation says Bukhari was manually checked, while segmentation
for other books was automated at reported 92% accuracy. Grade provenance and
segmentation provenance must remain separate.

### Abdullah Naseer

Do not import the `status` field as an authoritative grade assertion. Preserve
it as raw source metadata with an `unreliable_grade_field` flag.

## Vocabulary Findings

Raw labels are much richer than the earlier RAFIQ list of `Sahih`, `Hasan`,
`Daif`, and `Mawdu`. They include:

- composite grades such as `Hasan Sahih`
- isnad-specific labels
- strengthening or external-support qualifiers
- source-agreement references
- bilingual variants
- spelling and transliteration variants
- free-text comments

Normalization must therefore be many-to-one and reversible. Store:

- `raw_grade`
- `normalized_bucket`
- `grade_scope`
- `grader_name_raw`
- `grader_authority_id`
- `source_id` and source version
- source hadith mapping
- citation or edition reference
- parser version
- review status

## Canonical Recommendation

Use `hadith_grade_assertions`, not a single grade column on `hadith_records`.
Conflicting assertions must coexist. RAFIQ may calculate a derived display
summary only when its method, input assertions, version, and reviewer are
recorded.

Never infer a narration-level grade solely from a collection title. Collection
reputation, individual narration grading, isnad grading, and wording
verification are different claims.

## Private And Public Use

All grade-bearing records may be imported for complete private testing.
Weak, disputed, and fabricated labels are required for verification and
misinformation workflows.

Public presentation requires contextual labels, attribution, and reviewed
display rules. It must not silently delete evidence or present RAFIQ's
normalization as a scholar's verbatim judgment.

