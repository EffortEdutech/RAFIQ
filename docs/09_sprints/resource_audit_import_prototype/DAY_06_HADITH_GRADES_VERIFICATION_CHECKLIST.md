# Day 6 Hadith Grades And Verification Audit Checklist

Status: Closed  
Audit date: 2026-06-14

## Grade Sources

- [x] Inventory grade-bearing downloaded datasets.
- [x] Extract raw grade vocabularies without destructive normalization.
- [x] Identify explicit grader attribution.
- [x] Measure grade coverage by source and collection.
- [x] Identify records with multiple differing normalized labels.
- [x] Separate collection reputation from narration-level grading.
- [x] Document sources whose grade fields are not reliable.
- [x] Define grade assertion and normalization requirements.

## Verification Sources

- [x] Inspect SemakHadis API schema, models, migrations, routes, and seed files.
- [x] Inspect the 60-row SemakHadis seed workbook.
- [x] Inspect the 28-record frontend mock dataset.
- [x] Separate classification status from editorial workflow status.
- [x] Record references, researcher attribution, narrator, and text fields.
- [x] Register encoding, malformed JSON, and mock-data quality defects.
- [x] Review Dorar's published methodology and API documentation.
- [x] Test the documented Dorar API access path.
- [ ] Obtain permitted Dorar API or bulk snapshot access.
- [ ] Obtain a complete live SemakHadis export and current usage terms.

## Architecture

- [x] Define source-qualified grade assertions.
- [x] Define source-qualified verification claims.
- [x] Preserve verbatim and normalized labels separately.
- [x] Preserve hadith-level, isnad-level, wording-level, and source-level scope.
- [x] Keep conflicting assertions.
- [x] Keep weak and fabricated content available in private verification tools.
- [x] Require contextual public-display policy rather than destructive deletion.

## Evidence

- `audits/AUD-GRADE-001_Hadith_Grades.md`
- `audits/AUD-VERIFY-001_Hadith_Verification.md`
- `data/staging_reports/hadith/day6/grade_source_summary.csv`
- `data/staging_reports/hadith/day6/grade_vocabulary.csv`
- `data/staging_reports/hadith/day6/fawaz_grade_conflicts.csv`
- `data/staging_reports/hadith/day6/semakhadis_profile.json`
- `scripts/audit_hadith_grades_verification.py`

## Exit Status

The downloaded grade and verification structures have been audited and
approved for architecture and private import. External Dorar access, the
complete SemakHadis export, rights, and public-display policy remain open.

The Product Owner finalized the Day 6 Decision Register on 2026-06-14.
