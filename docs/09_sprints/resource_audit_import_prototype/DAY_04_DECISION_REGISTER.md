# Day 4 Decision Register

Sprint: RAFIQ Resource Audit & Import Prototype
Decision gate: Tafsir, Topics, And Ayah Themes
Status: Finalized
Audit date: 2026-06-12
Decision date: 2026-06-13
Approver: Product Owner

## Final Decisions

| ID | Decision | Final Status |
| --- | --- | --- |
| D4-DEC-001 | QUL Day 4 resources | Approved for Complete Private Platform; Public Release Blocked |
| D4-DEC-002 | Tafsir passage identity | Approved |
| D4-DEC-003 | Tafsir summaries | Derived, Cited, And Reviewed Only |
| D4-DEC-004 | Source topics versus RAFIQ themes | Separate Governed Layers |
| D4-DEC-005 | Ayah-theme range representation | Approved |
| D4-DEC-006 | Confidence values | Do Not Infer From QUL |
| D4-DEC-007 | Source relationship provenance | Required |
| D4-DEC-008 | Dataset validation gate | Technical Gate Passed; Private Import Approved; Public Rights Gate Open |
| D4-DEC-009 | Quality-defect handling | Import With Source-Preserving Quality Flags |
| D4-DEC-010 | Public release boundary | Rights, Attribution, And Content Approval Required |

## D4-DEC-001: Source Use

Authenticated raw files have been acquired, checksummed, and technically validated. Preserve them unchanged for audit and adapter development.

Approve resources `35`, `45`, `62`, `266`, and `308` for complete private
platform import, indexing, search, retrieval, AI/RAG testing, rendering, and
end-to-end integration.

Public application display, public APIs, public AI/RAG responses, and
commercial redistribution remain blocked until original provenance, rights,
attribution, and content approval are documented.

## D4-DEC-002: Tafsir Passage Identity

Model tafsir as source-specific passages that may cover multiple ayahs. Use a generated passage identity plus `(tafsir_source_id, group_ayah_key)` when the source provides a stable group key.

Never duplicate one passage as independent tafsir text for every ayah.

## D4-DEC-003: Tafsir Summaries

Keep source tafsir and derived summaries separate. Every summary must preserve:

- source passage lineage
- source tafsir attribution
- generation or editorial method
- model and prompt version where applicable
- reviewer and approval status

AI output must never be presented as original tafsir.

## D4-DEC-004: Topics And RAFIQ Themes

QUL source topics and RAFIQ's user-facing themes are different layers. Import source namespaces unchanged, then map them to a smaller governed RAFIQ theme taxonomy.

Do not expose QUL topic IDs as permanent RAFIQ theme IDs.

## D4-DEC-005: Ayah Theme Ranges

Store ayah themes as grouped ranges with a separate group-to-ayah mapping. Preserve source theme text and keywords verbatim while keeping normalized or corrected terms in derived records.

## D4-DEC-006: Confidence

QUL's published ayah-theme schema has no confidence field. RAFIQ must not assign or imply source confidence.

Any RAFIQ-generated confidence must include method, version, reviewer, and a clear `derived` provenance label.

## D4-DEC-007: Relationship Provenance

Every hierarchy, semantic relation, ayah-topic link, and RAFIQ mapping must record whether it is:

- source-provided
- imported from an upstream namespace
- editorially curated by RAFIQ
- algorithmically generated

## D4-DEC-008: Dataset Validation And Rights Gates

The file acquisition and technical validation gate has passed.

Private import is approved under
`BUILD_PENDING_CONTENT_APPROVAL_DECISION.md`. The complete private platform
must use all technically validated Day 4 content for functional testing.

The public-release rights gate remains open. Permission, licence, attribution,
and permitted transformation or summarization terms must be documented before
public exposure.

## D4-DEC-009: Quality-Defect Handling

Known source defects do not block private import. Handle them as follows:

- preserve all duplicate Ayah Theme rows in immutable raw storage
- deduplicate exact Ayah Theme pairs in derived staging while retaining links
  to both source rows
- record the 36 uncovered ayahs as explicit coverage gaps; do not synthesize
  themes to fill them
- quarantine malformed keywords from production taxonomy mapping while
  retaining their verbatim source values
- import the 59 blank Arabic As-Saadi records with `blank_text` quality flags
- sanitize source HTML only in derived display fields and preserve raw HTML

Every correction or normalization must be source-qualified, reversible, and
auditable.

## D4-DEC-010: Public Release Boundary

Day 4 content may be fully exercised in private environments. Public release
requires:

- provenance and rights evidence
- approved attribution
- editorial quality review
- scholar/content review where content is used in guidance
- Product Owner approval
- deployment-mode enforcement that prevents pending content from becoming
  public

## Approval Effect

Approval closes Day 4 and authorizes complete private import and testing. It
does not authorize public display, public retrieval, public API access, or
commercial redistribution.

## Day 4 Closure

Day 4 is formally closed.

Rights, attribution, editorial quality, and scholar/content review remain
parallel public-release conditions. They do not block private platform
completion.
