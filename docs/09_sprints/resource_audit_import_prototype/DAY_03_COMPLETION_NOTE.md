# Day 3 Completion Note

Status: Closed
Audit date: 2026-06-11
Decision date: 2026-06-12

## Completed

- Audited English Saheeh International and Malay Basmeih candidates.
- Completed the optional Indonesian structural audit.
- Reviewed Tanzil translation terms and QUL resource copyright pages.
- Preserved three raw translation files with manifests and SHA-256 checksums.
- Validated 6,236 complete, unique ayah mappings in each file.
- Confirmed identical key coverage across all three languages.
- Documented QUL footnote/chunk structures and download restrictions.
- Drafted Day 3 architecture and source-use decisions.

## Main Findings

1. The files are technically suitable for staging and parser development.
2. Tanzil translation use is non-commercial unless separate permission is obtained.
3. QUL has no copyright information for the audited English and Malay resources.
4. QUL translation downloads required sign-in and were acquired on 2026-06-12.
5. Malay attribution differs between distributors: Basmeih versus Basamia.
6. No production translation source is approved yet.

## Final Decisions

See `DAY_03_DECISION_REGISTER.md`.

- Translation identity and raw-preservation rules approved.
- Tanzil English and Malay files approved for staging only.
- QUL translation schemas and raw files approved for audit/staging evaluation only; production use remains blocked.
- Basmeih adopted as the current audited Malay attribution candidate.
- Translation text, footnotes, and chunks must remain separate.
- Indonesian approved for optional staging only.
- AI-generated Quran translation substitution prohibited.

## Tracked Conditions

- Obtain original translator or publisher permission before production use.
- Confirm required production attribution wording.
- Resolve the Basmeih/Basamia alias against original-source evidence.
- Select the intended English and Malay editions only after rights, attribution, and editorial review.

## File Validation Amendment

- Ten QUL translation files acquired and checksummed.
- All JSON/SQLite pairs match exactly.
- Saheeh footnote references and definitions are complete.
- QUL and Tanzil translations confirmed as different editions.

## Next Scheduled Batch

Day 4: Tafsir, Topics, and Ayah Themes audit.
