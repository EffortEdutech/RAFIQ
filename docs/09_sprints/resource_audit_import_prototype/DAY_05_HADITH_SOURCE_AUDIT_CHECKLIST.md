# Day 5 Hadith Source Audit Checklist

Status: Closed  
Audit date: 2026-06-13
Acquisition date: 2026-06-14

## Workspace Inventory

- [x] Check `data/raw/hadith/` for existing datasets.
- [x] Confirm no hadith raw dataset is currently stored.
- [x] Review canonical RAFIQ hadith specifications and archived research notes.
- [x] Identify unsupported claims requiring correction.

## Candidate Sources

### Official Sunnah.com API

- [x] Confirm official API and developer documentation.
- [x] Confirm API-key access process.
- [x] Confirm collections, books, chapters, hadiths, URNs, and grades schema.
- [x] Confirm Arabic and English language records.
- [x] Review copying and scraping restrictions.
- [ ] Request RAFIQ API access and production-use terms.
- [ ] Acquire available collection metadata and hadith datasets through the
  API when access is received.
- [ ] Record API version, access date, and checksums of retained snapshots.

### Fawaz Ahmed Hadith API

- [x] Confirm repository, pinned version `1`, and Unlicense file.
- [x] Inspect edition metadata and upstream reference list.
- [x] Confirm 10 book groups, 74 editions, and 9 languages.
- [x] Record that 63 edition authors are `Unknown`.
- [x] Record that 71 edition source fields are blank.
- [ ] Obtain resource-level provenance and rights evidence before public use.
- [x] Download the complete pinned branch-1 repository and all editions.

### AhmedBaset Hadith JSON/API

- [x] Confirm 50,884 Arabic/English records across 17 books are claimed.
- [x] Confirm the repository says the dataset was scraped from Sunnah.com.
- [x] Confirm latest documented tag `v1.2.0`, dated 2024-04-06.
- [x] Confirm no repository licence is published.
- [x] Confirm Sunnah.com prohibits scraping and mass reproduction.
- [x] Download tag `v1.2.0` into quarantined immutable raw storage.
- [x] Download the related API repository.
- [x] Record scraping, rights, and provenance risk flags.

## Additional Complete-Acquisition Sources

- [x] Download LK-Hadith-Corpus.
- [x] Download SemakHadis API repository, seed workbook, and reference tables.
- [x] Download SemakHadis frontend mock data.
- [x] Download the six-book JSON repository.
- [x] Download all selected Hugging Face dataset snapshots.
- [x] Inventory and download the remaining discovered Hugging Face candidates.
- [x] Download the large Arabic hadith/Quran ASR dataset.
- [ ] Request Dorar, HadeethEnc, IslamHouse, and live SemakHadis exports.

## Required Validation After Acquisition

- [x] Collection, edition, book, and chapter inventory.
- [x] Hadith count per collection and language.
- [x] Empty Arabic/English bodies.
- [x] Duplicate source identities and duplicate texts.
- [ ] Broken collection, book, and chapter references.
- [ ] URN uniqueness by language.
- [x] Numbering-system compatibility risks documented.
- [x] Grade structure and grader-attribution gaps documented.
- [x] HTML, markup, and Unicode checks.
- [x] Representative cross-source comparison.

## Exit Status

The source audit, comprehensive download manifest, principal-payload
validation, and representative comparison are complete. See
`audits/VAL-HADITH-001_Downloaded_Dataset_Validation_Comparison.md`.

Book/chapter foreign-key integrity and official URN uniqueness move into the
import-loader validation because several raw sources do not publish those
relationships. Pending rights or approval do not block private acquisition or
private import testing.

The Product Owner finalized the Day 5 Decision Register on 2026-06-14.
