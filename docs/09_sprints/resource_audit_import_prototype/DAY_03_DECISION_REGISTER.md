# Day 3 Decision Register

Sprint: RAFIQ Resource Audit & Import Prototype
Decision gate: Quran Translations
Status: Finalized
Audit date: 2026-06-11
Decision date: 2026-06-12
Approver: Product Owner

## Final Decisions

| ID | Decision | Final Status |
| --- | --- | --- |
| D3-DEC-001 | Translation identity and ayah mapping | Approved |
| D3-DEC-002 | Raw translation preservation | Approved |
| D3-DEC-003 | Tanzil English and Malay files | Staging Only |
| D3-DEC-004 | QUL translation resources | Schema Discovery Only; Production Blocked |
| D3-DEC-005 | Malay translator attribution | Basmeih Candidate; Alias Review Required |
| D3-DEC-006 | Translation footnotes and chunks | Separate Structured Records |
| D3-DEC-007 | Indonesian translation | Optional Staging Only |
| D3-DEC-008 | AI translation boundary | Approved |

## D3-DEC-001: Translation Identity

Use `(translation_source_id, surah_number, ayah_number)` as the unique translation record identity. Join to Quran through the approved canonical ayah key, never through distributor-specific numeric IDs alone.

## D3-DEC-002: Raw Preservation

Preserve every downloaded translation verbatim with source, version, URL, access date, checksum, rights status, and attribution. Corrections or normalized display variants must be separate derived records.

## D3-DEC-003: Tanzil Translation Files

Approve the audited `en.sahih` and `ms.basmeih` files for local staging, parser development, schema validation, and non-production comparison only.

Production and commercial use remain blocked because Tanzil's catalog terms require separate translator or publisher permission.

## D3-DEC-004: QUL Translation Resources

Approve public QUL pages for schema discovery only. Block production content use because downloads require sign-in and audited copyright pages state that copyright information is unavailable.

## D3-DEC-005: Malay Attribution

Use `Abdullah Muhammad Basmeih` as the current audited candidate attribution. Store QUL's `Abdullah Basamia` as an unresolved source alias, not as the canonical person name.

## D3-DEC-006: Footnotes And Chunks

Model source text, footnotes, and styled chunks separately. Do not flatten QUL footnotes into verse text or infer footnotes from bracketed prose.

Recommended entities:

- `translation_sources`
- `translation_verses`
- `translation_footnotes`
- `translation_chunks`
- `source_record_mappings`

## D3-DEC-007: Indonesian

Permit the audited Indonesian file for optional staging only. Keep it outside committed launch scope and production until rights and product priority are approved.

## D3-DEC-008: AI Translation Boundary

AI must not create, replace, or silently revise Quran translations. AI may assist with search, indexing, or clearly labeled commentary only when it does not present generated text as a Quran translation.

## Approval Effect

Approval closes Day 3 while retaining production-rights blockers as tracked conditions. It does not authorize public display or commercial redistribution.

## Change Control

Any future change to these decisions must record:

- new source or rights evidence
- affected translation and version
- architecture or product impact
- replacement decision ID
- approver and date

## Day 3 Closure

Day 3 is formally closed.

Publisher permission, production attribution, and original-source verification remain tracked conditions. They do not reopen the completed structural audit.

## Amendment: Authenticated QUL Files

Amendment date: 2026-06-12

Authenticated QUL files for Saheeh resource `193` and Malay resource `292` were acquired and technically validated.

Amended effect on `D3-DEC-004`:

- raw acquisition and integrity validation: complete
- schema discovery: complete
- local raw preservation and adapter testing: approved
- complete private-platform import and testing: approved
- public release and commercial redistribution: blocked pending original-source
  rights and attribution

Additional binding findings:

- QUL and Tanzil translation files are different editions and must remain separate source records.
- the simple, inline, tagged, and chunked Saheeh variants are structurally consistent
- rich tagged text remains the lossless source for footnote markup; chunks are retrieval-oriented and may flatten HTML
- no QUL variant may silently replace a Tanzil translation
