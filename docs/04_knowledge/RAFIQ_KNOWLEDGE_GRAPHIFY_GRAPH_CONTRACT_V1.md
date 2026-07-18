# RAFIQ Knowledge Graphify Graph Contract V1

Status: Contract Draft
Date: 2026-07-10

Parent Document:

- `RAFIQ_KNOWLEDGE_GRAPHIFY_AND_VAULT_ARCHITECTURE_V1.md`

## Purpose

This document defines the first contract for the RAFIQ product Knowledge
Graphify graph.

It specifies node types, edge types, required fields, identifiers, statuses,
access boundaries, and export expectations for a RAFIQ-owned product graph over
Quran, translations, tafsir, hadith, themes, provenance, validation, review,
release states, and guidance relationships.

This contract is not for the current developer `graphify-out/` code graph.

## Contract Boundary

The graph is derived from RAFIQ canonical content and governance data.

Canonical truth remains in:

- preserved raw resources;
- source registry and acquisition snapshots;
- Supabase/Postgres canonical content tables;
- import lineage and validation findings;
- source licensing and approval records;
- content governance and review states;
- guidance session and validation records.

The graph may explain, inspect, rank, and audit relationships. It must not
become the canonical source of Islamic text, translation, tafsir, hadith grade,
or religious ruling.

## Graph Export Principles

Every graph export must be:

- deterministic for the same source state;
- source-aware;
- release-state-aware;
- access-level-aware;
- traceable back to canonical entity IDs;
- safe to filter for private, reviewer, and public contexts;
- explicit about derived or candidate relationships.

## Graph Identity

Each graph export must include a graph manifest.

Minimum manifest fields:

| Field | Requirement |
| --- | --- |
| `graphId` | Stable ID for the exported graph. |
| `graphKind` | `resource_graph`, `ranking_graph`, `review_graph`, or `release_gate_graph`. |
| `scope` | Description of domains and records included. |
| `environment` | `private_local`, `private_staging`, `public_staging`, or `production`. |
| `deploymentMode` | RAFIQ deployment mode used when exporting. |
| `sourceDatabaseSnapshot` | Database snapshot, migration version, or export timestamp reference. |
| `exportedAt` | ISO timestamp. |
| `exportedBy` | System or role that produced the export. |
| `accessLevel` | Highest access level represented in the graph. |
| `publicSafe` | Boolean; true only when every node and edge is public-approved. |
| `notes` | Optional warnings or limitations. |

## Node Contract

All nodes must use the same base shape.

```json
{
  "id": "string",
  "type": "string",
  "label": "string",
  "canonicalRef": {
    "schema": "string",
    "table": "string",
    "id": "string"
  },
  "sourceRefs": [],
  "releaseState": "string",
  "reviewState": "string",
  "qualityState": "string",
  "accessLevel": "string",
  "publicSafe": false,
  "metadata": {}
}
```

### Required Node Fields

| Field | Requirement |
| --- | --- |
| `id` | Stable graph node ID. |
| `type` | One of the approved node types in this contract. |
| `label` | Human-readable label safe for the node access level. |
| `canonicalRef` | Pointer to canonical database entity, when available. |
| `sourceRefs` | Source, snapshot, raw object, or provenance references. |
| `releaseState` | Current release state. |
| `reviewState` | Current content/reviewer state. |
| `qualityState` | Current quality state summary. |
| `accessLevel` | Minimum role required to inspect this node. |
| `publicSafe` | True only if node can appear in public graph/vault surfaces. |
| `metadata` | Node-type-specific safe metadata. |

## Node ID Format

Node IDs should be stable, readable, and namespace-qualified.

Recommended formats:

| Node Type | ID Format |
| --- | --- |
| `Source` | `source:{source_id}` |
| `SourceSnapshot` | `snapshot:{snapshot_id}` |
| `RawObject` | `raw_object:{raw_object_id}` |
| `QuranAyah` | `ayah:{surah_number}:{ayah_number}` |
| `QuranTextVersion` | `quran_text:{text_version_id}` |
| `TranslationText` | `translation_text:{translation_text_id}` |
| `TranslationFootnote` | `translation_footnote:{footnote_id}` |
| `TafsirPassage` | `tafsir_passage:{passage_id}` |
| `HadithCollection` | `hadith_collection:{collection_id}` |
| `HadithRecord` | `hadith_record:{hadith_record_id}` |
| `HadithTextVersion` | `hadith_text:{text_version_id}` |
| `GradeAssertion` | `grade_assertion:{grade_assertion_id}` |
| `VerificationClaim` | `verification_claim:{verification_claim_id}` |
| `SourceTopic` | `source_topic:{namespace}:{topic_id}` |
| `RafiqTheme` | `rafiq_theme:{slug}` |
| `GuidanceSession` | `guidance_session:{session_id}` |
| `ValidationGateResult` | `validation_gate:{run_id}:{gate_name}` |
| `QualityFinding` | `quality_finding:{finding_id}` |
| `ReviewQueueItem` | `review_item:{review_item_id}` |
| `ReleaseState` | `release_state:{entity_type}:{entity_id}` |
| `VaultNote` | `vault_note:{artifact_type}:{artifact_id}` |

## Approved Node Types

| Node Type | Required Metadata |
| --- | --- |
| `Source` | `name`, `domain`, `provider`, `rightsStatus`, `attributionStatus`. |
| `SourceSnapshot` | `sourceId`, `versionLabel`, `acquiredAt`, `checksumStatus`. |
| `RawObject` | `snapshotId`, `pathOrObjectKey`, `checksum`, `rawAccessLevel`. |
| `QuranAyah` | `surahNumber`, `ayahNumber`, `verseKey`. |
| `QuranTextVersion` | `ayahKey`, `sourceId`, `script`, `edition`, `language`. |
| `TranslationText` | `ayahKey`, `language`, `translator`, `sourceId`, `variantType`. |
| `TranslationFootnote` | `translationTextId`, `footnoteType`, `language`, `sourceId`. |
| `TafsirPassage` | `sourceId`, `language`, `coveredAyahs`, `passageType`. |
| `TafsirSource` | `name`, `language`, `author`, `edition`, `rightsStatus`. |
| `HadithCollection` | `sourceId`, `collectionName`, `collectionSlug`, `languageScope`. |
| `HadithRecord` | `sourceId`, `collection`, `reference`, `recordNumber`. |
| `HadithTextVersion` | `hadithRecordId`, `language`, `textType`, `qualityState`. |
| `GradeAssertion` | `hadithRecordId`, `grade`, `grader`, `sourceId`, `claimScope`. |
| `VerificationClaim` | `hadithRecordId`, `status`, `verifier`, `sourceId`, `claimScope`. |
| `SourceTopic` | `namespace`, `sourceId`, `topicLabel`, `language`. |
| `RafiqTheme` | `slug`, `name`, `themeType`, `governanceState`. |
| `GuidanceSession` | `entryPoint`, `status`, `detectedTheme`, `riskState`. |
| `ValidationGateResult` | `gateName`, `gateState`, `responseState`, `reason`. |
| `QualityFinding` | `entityType`, `entityId`, `findingType`, `severity`. |
| `ReviewQueueItem` | `queueType`, `targetEntity`, `reviewState`, `priority`. |
| `ReleaseState` | `entityType`, `entityId`, `privateState`, `publicState`. |
| `VaultNote` | `artifactType`, `artifactId`, `generatedAt`, `reviewState`. |

## Edge Contract

All edges must use the same base shape.

```json
{
  "id": "string",
  "type": "string",
  "from": "string",
  "to": "string",
  "status": "string",
  "confidence": null,
  "sourceRefs": [],
  "evidenceRefs": [],
  "releaseState": "string",
  "reviewState": "string",
  "accessLevel": "string",
  "publicSafe": false,
  "metadata": {}
}
```

### Required Edge Fields

| Field | Requirement |
| --- | --- |
| `id` | Stable graph edge ID. |
| `type` | One of the approved edge types in this contract. |
| `from` | Source node ID. |
| `to` | Target node ID. |
| `status` | Source/review status of the relationship. |
| `confidence` | Numeric confidence only when meaningful and sourced; otherwise null. |
| `sourceRefs` | Source or import references for the relationship. |
| `evidenceRefs` | Evidence records, traces, or review references. |
| `releaseState` | Release status of the edge itself. |
| `reviewState` | Review status of the relationship. |
| `accessLevel` | Minimum role required to inspect this edge. |
| `publicSafe` | True only if edge can appear in public graph/vault surfaces. |
| `metadata` | Edge-type-specific safe metadata. |

## Approved Edge Types

| Edge Type | From | To |
| --- | --- | --- |
| `source_provides` | `Source` | Any content node |
| `snapshot_contains` | `SourceSnapshot` | `RawObject` |
| `raw_object_imported_as` | `RawObject` | Any canonical content node |
| `ayah_has_text_version` | `QuranAyah` | `QuranTextVersion` |
| `ayah_has_translation` | `QuranAyah` | `TranslationText` |
| `translation_has_footnote` | `TranslationText` | `TranslationFootnote` |
| `tafsir_explains_ayah` | `TafsirPassage` | `QuranAyah` |
| `hadith_in_collection` | `HadithRecord` | `HadithCollection` |
| `hadith_has_text_version` | `HadithRecord` | `HadithTextVersion` |
| `hadith_has_grade_assertion` | `HadithRecord` | `GradeAssertion` |
| `hadith_has_verification_claim` | `HadithRecord` | `VerificationClaim` |
| `source_topic_maps_to_theme` | `SourceTopic` | `RafiqTheme` |
| `theme_has_quran_anchor` | `RafiqTheme` | `QuranAyah` |
| `theme_has_tafsir_support` | `RafiqTheme` | `TafsirPassage` |
| `theme_has_hadith_support` | `RafiqTheme` | `HadithRecord` |
| `guidance_cites` | `GuidanceSession` | Quran, tafsir, translation, or hadith node |
| `guidance_has_validation_gate` | `GuidanceSession` | `ValidationGateResult` |
| `entity_has_quality_finding` | Any content node | `QualityFinding` |
| `entity_has_release_state` | Any graph node | `ReleaseState` |
| `review_item_targets` | `ReviewQueueItem` | Any graph node or edge |
| `vault_note_describes` | `VaultNote` | Any graph node or edge |

## Relationship Statuses

Approved edge statuses:

| Status | Meaning |
| --- | --- |
| `source_declared` | Relationship came directly from source data. |
| `imported` | Relationship was imported into RAFIQ data. |
| `derived_candidate` | Relationship came from ranking, search, heuristics, or embeddings. |
| `technical_verified` | References and structure passed technical validation. |
| `content_review` | Relationship is in content review. |
| `scholar_review` | Relationship is in scholar or qualified reviewer review. |
| `approved_private` | Relationship can support private RAFIQ study or guidance. |
| `approved_public` | Relationship can support public surfaces if deployment gates pass. |
| `rejected` | Relationship must not be used. |
| `retired` | Relationship is inactive but retained for audit. |

## Release States

Approved release states:

| State | Meaning |
| --- | --- |
| `private_available` | Available in private RAFIQ development or internal review. |
| `private_blocked` | Not available even in private guidance. |
| `public_blocked` | Must not be exposed publicly. |
| `public_candidate` | Candidate for public approval, not yet approved. |
| `approved_public` | Approved for public exposure subject to deployment gates. |
| `published_public` | Currently exposed in public deployment. |
| `retired_public` | Formerly public, no longer active. |

## Quality States

Approved quality states:

| State | Meaning |
| --- | --- |
| `clean` | No known quality finding. |
| `warning` | Known issue but may be usable with labels. |
| `withheld` | Must not be shown as user-facing text or primary guidance. |
| `damaged` | Text or metadata is damaged and requires review. |
| `blank` | Source record is blank and preserved as source truth. |
| `unverified` | Quality not yet assessed. |
| `replaced` | A replacement exists, old record retained for audit. |

## Review States

Approved review states:

| State | Meaning |
| --- | --- |
| `not_required` | No review required for current private use. |
| `pending` | Review required but not started. |
| `technical_review` | Technical review active. |
| `content_review` | Content/editorial review active. |
| `scholar_review` | Qualified reviewer/scholar review active. |
| `approved_private` | Approved for private use. |
| `approved_public` | Approved for public use. |
| `rejected` | Not approved. |
| `retired` | No longer active. |

## Access Levels

Approved access levels:

| Access Level | Meaning |
| --- | --- |
| `system` | Internal system-only graph data. |
| `admin` | Admin source, review, and release workflows. |
| `knowledge_editor` | Content editor and data-quality workflows. |
| `scholar_reviewer` | Religious review packs and evidence bundles. |
| `developer_private` | Private debugging and ranking evidence. |
| `authenticated_user` | Approved user-facing private study/guidance artifacts. |
| `public_user` | Approved public-safe graph artifacts only. |

## Public-Safe Rule

`publicSafe` may be true only when all are true:

- node or edge content is approved for public use;
- source rights and attribution are approved;
- review state permits public exposure;
- quality state is not `withheld`, `damaged`, `blank`, or `unverified`;
- access level is `public_user`;
- no connected required evidence node is private-only or public-blocked.

## CP21C Minimum Graph Scope

The CP21C graph prototype must include:

- at least 20 evaluated prompt nodes or matrix case records;
- selected Quran anchors;
- candidate Quran anchors where available;
- tafsir passages for selected anchors;
- hadith support and rejected hadith candidates where available;
- quality findings affecting selection;
- release states affecting selection;
- guidance session or ranking decision nodes;
- scoring and remediation metadata.

## Forbidden Graph Behavior

The graph must not:

- generate Quran translation text;
- generate tafsir as source content;
- generate hadith text;
- invent hadith grades;
- infer religious rulings;
- upgrade `derived_candidate` relationships into approved guidance;
- expose private or public-blocked content through public graph exports;
- depend on the developer AI workspace or central Obsidian vault.

## Acceptance Criteria

This contract is accepted when:

- all graph nodes and edges have stable IDs;
- all nodes and edges have release, review, quality, and access fields;
- public-safe filtering is enforceable from graph fields;
- CP21C has enough graph structure to explain ranking decisions;
- relationship statuses preserve the difference between source data, imported
  data, derived candidates, private approval, and public approval;
- the graph remains a derived product intelligence layer, not canonical truth.

## Next

After this contract is accepted, implement a small CP21C graph export prototype
only after the CP21C prototype plan is approved.

Bismillah.
