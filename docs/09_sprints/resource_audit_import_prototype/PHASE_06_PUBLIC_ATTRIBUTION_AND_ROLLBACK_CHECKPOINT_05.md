# Phase 6 Checkpoint 05: Public Attribution Placement And Rollback Workflow

Date: 2026-06-19  
Status: Prepared For Product Owner / Technical Review  
Scope: Required public attribution placement and source rollback/takedown workflow for RAFIQ public release.

## Decision Rule

No source may be exposed publicly unless RAFIQ can show its approved attribution everywhere the source appears and remove it quickly if approval changes.

Public release requires:

- approved attribution text;
- approved attribution placement;
- public source-detail availability;
- rollback/takedown owner;
- rollback/takedown test evidence.

If attribution or rollback evidence is missing, the source remains private-only.

## Attribution Placement Matrix

| Surface | Required Attribution Placement | Minimum Visible Fields | Link/Drilldown Requirement | Current Decision |
| --- | --- | --- | --- | --- |
| Public Quran reader | Edition/source selector and ayah/source info panel | source name, edition/script, rights notice, attribution wording | Public source detail link per edition/text source | Blocked until approved content exists |
| Public translation display | Translation selector and translation info panel | translator, edition, publisher/source, attribution wording, licence/terms | Public source detail link per translation edition | Blocked |
| Public tafsir display | Tafsir heading/card and expanded source panel | tafsir title, author/editor/translator where applicable, source edition, attribution wording | Public source detail link per tafsir passage/edition | Blocked |
| Public topics/themes | Topic/theme page footer or source panel | source taxonomy/theme dataset name, upstream source, editorial status, attribution wording | Public source detail link per topic/theme group | Blocked |
| Public Hadith list | Collection filter/header and each result card where source differs | collection, edition/source, reference, translation/source label | Public source detail link per collection/record | Blocked |
| Public Hadith detail | Top source panel and text-version section | collection, book/reference, edition/source, translator, grade/verification attribution if displayed | Public source detail link per record/text/grade/claim | Blocked |
| Public search result | Each result card or expandable attribution row | domain, title, source/edition, public release status | Public source detail target in API and UI | Design required |
| Public answer evidence citation | Each citation and evidence drawer | citation id, title, domain, source/edition, source status | Public source detail target for every citation | Design required |
| Public API response | Response payload metadata | source/edition identifiers, attribution text or source detail URL, release gate status | Machine-readable source detail target | Design required |
| Public export/API redistribution | Export header and per-record metadata | full attribution wording, licence/terms, source version, checksum/version | Required if export rights are explicitly approved | Blocked |

## Minimum Public Attribution Payload

Every public content item, search result, answer citation, or API record should be able to expose:

| Field | Required | Source |
| --- | --- | --- |
| `entityType` | Yes | canonical entity |
| `entityId` | Yes | canonical entity |
| `sourceKey` | Yes | `ingest.source_registry` |
| `sourceName` | Yes | `ingest.source_registry` |
| `snapshotKey` | Yes | `ingest.source_snapshots` |
| `editionKey` or equivalent | When applicable | canonical content table |
| `authorTranslatorEditor` | When applicable | approval pack/source metadata |
| `publisherOrMaintainer` | When applicable | approval pack/source metadata |
| `licenseName` | Yes if licensed | `ingest.source_snapshots` / approval pack |
| `licenseUrl` | Yes if licensed | `ingest.source_snapshots` / approval pack |
| `attributionText` | Yes | approved G3 attribution |
| `requiredLinks` | When applicable | approval pack |
| `rightsStatus` | Yes | release state / snapshot |
| `attributionStatus` | Yes | release state / snapshot |
| `editorialStatus` | Yes | release state |
| `scholarContentStatus` | Yes | release state |
| `publicationStatus` | Yes | release state |
| `publicReleaseGatePassed` | Yes | `public_api.release_gate_passed` |
| `lastApprovedAt` | Yes for public release | approval record |
| `rollbackContact` | Yes for public release | approval record |

## Public Source Detail Requirement

Before any content is public, RAFIQ must implement a public-safe source-detail endpoint or payload section that:

- reads only release-approved source entities;
- includes approved attribution and licence text;
- excludes private-only raw object paths and internal review notes;
- excludes service-role-only details;
- includes rollback/takedown status if a source is under review;
- returns `not_public` for private-only or pending entities.

Private `source-detail` already exists for internal testing. Public source-detail must be a separate public contract.

## Attribution Display Rules

1. The global footer is not enough.
2. The source must be visible close to the content it supports.
3. Search results must show source/edition at result level.
4. Answer citations must show source/edition at citation level.
5. Quran translation, tafsir, Hadith grade, and verification claims must not share one generic attribution label.
6. If two sources contribute to one visible answer, both must be cited separately.
7. If a licence requires specific wording or link placement, the approval pack overrides the default RAFIQ layout.
8. If attribution cannot fit in a compact UI, the compact UI must show source name plus a source-detail link.
9. Public API responses must provide machine-readable attribution, not just UI text.
10. Missing attribution blocks public display.

## Rollback Triggers

Immediate rollback/takedown is required when any of these occur:

| Trigger | Severity | Required Action |
| --- | --- | --- |
| Rights holder revokes or limits permission | Critical | Unpublish affected source immediately |
| Attribution text or placement is found non-compliant | High | Remove public exposure until corrected |
| Source provenance is disputed | High | Move affected source to pending review |
| Scholar/content reviewer rejects usage context | High | Unpublish affected content and dependent answers |
| Technical integrity mismatch or checksum drift | High | Remove affected snapshot from public surfaces |
| Hadith grade/verification source is unreliable or misrepresented | High | Remove affected claim from public summaries/answers |
| Translation identity or authorship is disputed | High | Unpublish affected translation until resolved |
| Tafsir/topic/theme mapping creates misleading guidance | High | Remove from public search/RAG and review |
| Public API leaks private/pending content | Critical | Disable public content flag and investigate |
| Model answer uses uncited or non-approved evidence | Critical | Disable public answer generation and investigate |

## Rollback Workflow

1. **Intake**
   - Record source, entity, trigger, reporter, evidence, and timestamp.
   - Assign severity: `critical`, `high`, `medium`, or `low`.

2. **Containment**
   - For critical/high issues, set the affected release state to non-public immediately.
   - Public release filters must remove the entity from search and answer retrieval.
   - Disable public AI/RAG answer generation if evidence leakage is suspected.

3. **Impact Analysis**
   - Identify all affected canonical entities through provenance:
     - Quran text/translation rows;
     - tafsir passages;
     - topics/themes;
     - Hadith records/text versions;
     - grade assertions;
     - verification claims;
     - public search documents;
     - public answer citations or cached outputs.

4. **User-Facing Handling**
   - Hide removed content from public pages.
   - If a page becomes empty, show a neutral unavailable message.
   - Do not expose internal dispute notes publicly.
   - Preserve citations in internal audit logs.

5. **Correction**
   - Update attribution, rights, editorial, scholar/content, or technical records.
   - Re-run SQL release-filter assertions.
   - Re-run public API/search/answer runtime checks.

6. **Reapproval**
   - Product Owner may restore public release only after the failed gate is passed again.
   - Record a new approval date and version.

7. **Post-Incident Record**
   - Add a correction-register entry.
   - Attach evidence and verification outputs.
   - Document whether public users were affected.

## Required Rollback States

| State | Meaning | Public Behavior |
| --- | --- | --- |
| `public` / `published` | Approved and visible | Public API may return it |
| `pending_review` | Temporarily under review | Public API must exclude it |
| `private_only` | Private testing only | Public API must exclude it |
| `revoked` | Permission or approval removed | Public API must exclude it |
| `retired` | Formerly approved but no longer active | Public API must exclude it unless archival display is separately approved |
| `rejected` | Not approved | Public API must exclude it |

Current implementation uses release-state fields and `publication_status`. If new status values such as `revoked` or `retired` are introduced later, public API release filters must continue to allow only `public` or `published`.

## Public Release Verification Checklist

Before any public deployment:

- [ ] every public result has attribution payload;
- [ ] every public result has source-detail target or source-detail URL;
- [ ] search result cards show source/edition;
- [ ] answer citations show source/edition;
- [ ] Quran/translation/tafsir source selectors show approved attribution;
- [ ] Hadith pages show collection, edition/source, reference, and grade/verification source where applicable;
- [ ] public API responses include attribution metadata;
- [ ] public source-detail returns only approved public-safe fields;
- [ ] rollback test removes an approved fixture from public search;
- [ ] rollback test removes an approved fixture from public answer evidence;
- [ ] rollback test does not delete private records;
- [ ] correction-register entry is created for rollback events;
- [ ] Product Owner reapproval is required before restore.

## Current Checkpoint Decision

- [x] Attribution placement policy prepared
- [x] Rollback/takedown workflow prepared
- [x] Public source-detail requirement defined
- [ ] Public source-detail API implemented
- [ ] Public UI attribution placement implemented
- [ ] Approved fixture rollback test implemented
- [x] Public launch remains NO-GO

## Next Action

Proceed to Checkpoint 06: Approved Fixture Content Test.

The next checkpoint should create a controlled approved fixture so public search and public answer retrieval can be tested with one approved item while all pending content remains blocked.
