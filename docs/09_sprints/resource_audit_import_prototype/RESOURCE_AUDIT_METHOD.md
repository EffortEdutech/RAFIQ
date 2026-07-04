# Resource Audit Method

## Purpose

This method standardizes how RAFIQ evaluates every candidate content source.

## Audit Steps

1. Identify official source.
2. Identify maintainer or publisher.
3. Confirm access method.
4. Confirm license or usage terms.
5. Confirm attribution requirements.
6. Inspect data format.
7. Capture sample records.
8. Count records.
9. Identify primary keys and foreign keys.
10. Identify language coverage.
11. Identify source version or update date.
12. Record quality risks.
13. Decide import status.

## Required Evidence

Every source audit should include:

- official URL or repository URL
- license/terms URL
- download/API URL
- date accessed
- sample raw record
- format type
- expected record count
- actual record count if downloaded
- checksum method
- attribution text
- reviewer

## Content Risk Categories

| Risk | Examples |
| --- | --- |
| License Risk | Terms unclear, commercial use unclear, no redistribution permission. |
| Provenance Risk | Source copied/scraped from another site without clear rights. |
| Integrity Risk | Missing records, duplicate records, corrupted text, inconsistent IDs. |
| Religious Reliability Risk | Hadith grade unknown, tafsir source unclear, translation not approved. |
| Technical Risk | Large files, unstable API, generated links, no versioning. |
| Localization Risk | Language label unclear, translator unknown, mixed-language content. |

## Decision Labels

| Label | Meaning |
| --- | --- |
| `Approve for Production Import` | Safe to import and publish after normal validation. |
| `Approve for Staging Only` | Usable for prototype, not production. |
| `Needs Legal Review` | Usage rights unclear. |
| `Needs Scholar Review` | Religious reliability or usage context unclear. |
| `Defer` | Good source but not needed now. |
| `Block` | Not usable. |

## Audit Output Location

Audit forms should be saved under:

`docs/09_sprints/resource_audit_import_prototype/audits/`

Use one file per source or resource group.

