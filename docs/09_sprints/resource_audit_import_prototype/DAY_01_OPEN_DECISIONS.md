# Day 1 Open Decisions

Status: Draft
Last updated: 2026-06-09

## Decisions

| ID | Decision | Recommendation | Status | Notes |
| --- | --- | --- | --- | --- |
| D1-DEC-001 | Launch language audit order | Audit English and Malay first; Indonesian optional in same sprint if source discovery is quick. | Pending | Malay matters for likely target market; English useful for initial engineering/testing. |
| D1-DEC-002 | Quran text source strategy | Audit QUL and Tanzil together before selecting canonical text source. | Pending | Tanzil has clear license terms; QUL may bundle resources but per-resource license matters. |
| D1-DEC-003 | Hadith source strategy | Audit provenance before selecting hadith-json/API source. | Pending | Scraping/source-rights and grade provenance are major risks. |
| D1-DEC-004 | Raw data storage policy | Keep raw data outside repo unless small and license allows. | Pending | Use manifests/checksums in repo; avoid committing large datasets. |
| D1-DEC-005 | Sprint ownership | Keep owners as `TBD` until actual team roles are assigned. | Pending | Can be updated later. |
| D1-DEC-006 | Production import threshold | Require license, attribution, integrity, and content approval before production import. | Proposed Accepted | Already matches build-gate docs. |

## Decision Log Format

When decided, update:

- status
- decision date
- reason
- affected docs

