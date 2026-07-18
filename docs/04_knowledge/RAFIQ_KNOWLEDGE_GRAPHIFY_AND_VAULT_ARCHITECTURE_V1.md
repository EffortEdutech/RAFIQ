# RAFIQ Knowledge Graphify And Vault Architecture V1

Status: Architecture Locked
Date: 2026-07-10

## Purpose

This document defines a future RAFIQ product subsystem that combines a
Graphify-style knowledge graph with a RAFIQ-owned knowledge vault for Quran,
translations, tafsir, hadith, themes, provenance, validation, review, and
guidance relationships.

This subsystem is not the current developer Graphify and Obsidian setup used
to build this repository.

## Non-Negotiable Distinction

RAFIQ currently uses developer tooling for project development:

- `graphify-out/` maps source code and scripts for engineering navigation.
- `C:\Users\user\Documents\00 AI agent\AI-Knowledge` stores cross-project
  architecture notes, ADRs, roadmaps, and development context.

The RAFIQ Knowledge Graphify and Vault subsystem is different:

- it belongs to the RAFIQ product architecture;
- it is deployed, packaged, or operated with RAFIQ infrastructure;
- it works from RAFIQ canonical content, source registry, provenance records,
  review states, validation gates, and release states;
- it must not depend on the developer AI workspace or central Obsidian vault;
- it must never expose private, raw, review, or pending-public-release material
  to public users unless explicit release gates approve that exposure.

Short form:

```text
Developer Graphify + Obsidian = builder workspace intelligence.
RAFIQ Knowledge Graphify + Vault = product knowledge intelligence.
```

## Product Vision

RAFIQ should not only store Islamic resources. RAFIQ should understand how
resources are connected, where they came from, what quality and approval state
they carry, and which guidance sessions rely on them.

The RAFIQ Knowledge Graphify and Vault subsystem provides:

- a graph representation of Quran, tafsir, translations, hadith, themes,
  provenance, quality, and guidance relationships;
- a vault representation for human-readable review, study, scholar, and product
  knowledge bundles;
- an internal intelligence layer for ranking, review, audit, and release-gate
  verification;
- a future foundation for user-facing study paths, if and only if public
  content approval and privacy gates allow it.

## Architecture Position

The canonical source of truth remains Supabase/Postgres plus preserved raw
source files, source registry records, import lineage, validation findings, and
governance states.

Graphify and the vault are derived intelligence surfaces.

```text
Raw Sources
  -> Import And Validation Pipeline
  -> Canonical RAFIQ Content Database
  -> Source Registry / Provenance / Release States
  -> RAFIQ Knowledge Graphify Export
  -> RAFIQ Knowledge Vault Export
  -> Ranking, Review, Study, Audit, And Release-Gate Workflows
```

Build rule:

```text
Postgres holds truth.
Graphify reveals relationships.
The vault makes review and study readable.
Validation gates preserve trust.
Governance decides publication.
```

## What This Subsystem Is

RAFIQ Knowledge Graphify is:

- an internal product graph over canonical content and governance metadata;
- a way to inspect relationships across Quran, tafsir, hadith, themes, review,
  quality, and guidance sessions;
- a ranking and audit support layer for CP21C and later checkpoints;
- a provenance explanation layer for reviewers and developers;
- a possible future source for curated user-facing study maps.

RAFIQ Knowledge Vault is:

- a RAFIQ-owned vault of generated or curated markdown-like knowledge bundles;
- a review and scholar-friendly reading layer over graph evidence;
- a place for source packs, theme packs, ayah study packs, hadith verification
  packs, release-gate packs, and guidance evidence packs;
- a deployable product asset, not the central Effort Studio AI development
  vault.

## What This Subsystem Is Not

RAFIQ Knowledge Graphify and Vault are not:

- the canonical Islamic content database;
- a replacement for Supabase/Postgres;
- a replacement for source licensing records;
- a replacement for scholar/content review;
- a fatwa engine;
- a source of Quran translation, tafsir, hadith text, hadith grade, or religious
  ruling;
- a license to infer religious relationships without review;
- the current `graphify-out/` developer code graph;
- the current central Obsidian vault.

## Core Governance Principle

Graph edges must be traceable and status-aware.

An edge may show that two resources are connected, but it must also show how
that connection was created and whether it is safe to use.

Example:

```text
Ayah 65:2-3 -> supports_theme -> tawakkul
  source: QUL / RAFIQ editorial mapping / derived ranking candidate
  status: imported / technical_verified / scholar_review / approved_private
  public_release: blocked / approved
```

The graph may support discovery and review. It must not silently upgrade a
candidate relationship into approved religious guidance.

## Node Types

Initial product graph nodes should include:

| Node | Purpose |
| --- | --- |
| `Source` | Registered source, publisher, repository, API, or dataset family. |
| `SourceSnapshot` | Versioned acquisition snapshot with checksums and dates. |
| `RawObject` | Preserved raw file or object imported into RAFIQ. |
| `QuranAyah` | Canonical ayah identity by surah and ayah number. |
| `QuranTextVersion` | Source-specific Arabic Quran text edition. |
| `TranslationText` | Source-specific ayah translation text. |
| `TranslationFootnote` | Footnote or note attached to translation text. |
| `TafsirPassage` | Tafsir passage, including multi-ayah passages. |
| `TafsirSource` | Tafsir work, language, edition, and attribution identity. |
| `HadithCollection` | Source-specific hadith collection identity. |
| `HadithRecord` | Source-qualified narration record. |
| `HadithTextVersion` | Arabic, translation, or meaning text version for a narration. |
| `GradeAssertion` | Attributed grade claim with source and scope. |
| `VerificationClaim` | Verification claim from SemakHadis, Dorar, or other approved source. |
| `SourceTopic` | Source taxonomy topic or concept. |
| `RafiqTheme` | Governed RAFIQ theme used for guidance. |
| `GuidanceSession` | Orchestrated RAFIQ guidance session. |
| `ValidationGateResult` | AI/content validation gate result. |
| `QualityFinding` | Automated or reviewed data-quality finding. |
| `ReviewQueueItem` | Internal reviewer workflow item. |
| `ReleaseState` | Private/public approval and publication state. |
| `VaultNote` | Human-readable product vault artifact generated from graph evidence. |

## Edge Types

Initial graph relationships should include:

| Edge | Meaning |
| --- | --- |
| `source_provides` | A source provides a content entity. |
| `snapshot_contains` | A snapshot contains a raw object. |
| `raw_object_imported_as` | A raw object produced a canonical or staging entity. |
| `ayah_has_text_version` | An ayah has an Arabic text edition. |
| `ayah_has_translation` | An ayah has a translation text. |
| `translation_has_footnote` | Translation text has a structured note. |
| `tafsir_explains_ayah` | Tafsir passage explains an ayah or ayah range. |
| `hadith_has_text_version` | Hadith record has Arabic or meaning text. |
| `hadith_has_grade_assertion` | Hadith record has an attributed grade claim. |
| `hadith_has_verification_claim` | Hadith record has verification evidence. |
| `source_topic_maps_to_theme` | Source topic maps to governed RAFIQ theme. |
| `theme_has_quran_anchor` | Theme has candidate or approved Quran evidence. |
| `theme_has_hadith_support` | Theme has candidate or approved hadith support. |
| `guidance_cites` | Guidance session cites Quran, tafsir, translation, or hadith evidence. |
| `entity_has_quality_finding` | Entity has quality warning or defect. |
| `entity_has_release_state` | Entity is private-only, public-blocked, approved, or published. |
| `review_item_targets` | Review item targets a content or relationship entity. |
| `vault_note_describes` | Vault note describes a graph node, subgraph, or review pack. |

## Edge Statuses

Every non-trivial relationship should carry a status:

| Status | Meaning |
| --- | --- |
| `source_declared` | Relationship comes directly from source data. |
| `imported` | Relationship was imported into RAFIQ staging/canonical data. |
| `derived_candidate` | Relationship was produced by ranking, search, heuristic, or embedding. |
| `technical_verified` | Structure, references, and source integrity were checked. |
| `content_review` | Religious/content review is pending or active. |
| `scholar_review` | Qualified reviewer/scholar review is pending or active. |
| `approved_private` | Accepted for private RAFIQ study or internal guidance. |
| `approved_public` | Approved for public use, subject to deployment gates. |
| `rejected` | Relationship must not be used. |
| `retired` | Relationship was formerly used and is now inactive. |

## Release Boundary

The graph and vault must preserve deployment mode.

Private development may include technically validated but public-blocked
resources, as allowed by RAFIQ governance.

Public surfaces must only use nodes and edges whose content, rights,
attribution, review, safety, and release states permit public exposure.

Required invariant:

```text
No public guidance, public search, public study page, or public vault note may
depend on a private-only, unapproved, withheld, rejected, or public-blocked
node or edge.
```

## Vault Design

The RAFIQ Knowledge Vault should be product-owned and generated from canonical
graph evidence.

Initial vault artifact types:

| Vault Artifact | Purpose |
| --- | --- |
| `Ayah Study Pack` | Ayah, translations, tafsir passages, themes, related support, attribution. |
| `Tafsir Passage Pack` | Passage, covered ayahs, source details, comparison passages, usage state. |
| `Hadith Verification Pack` | Narration, text versions, grades, verification, quality flags, replacement state. |
| `Theme Guidance Pack` | RAFIQ theme, Quran anchors, tafsir, hadith support, reflection/action boundaries. |
| `Source Approval Pack` | Source rights, attribution, provenance, checksums, public-release blockers. |
| `Guidance Evidence Pack` | Guidance session citations, validation gates, risk state, and review status. |
| `Release Gate Pack` | Public launch dependency graph and blockers. |

Vault artifacts must be generated from graph/database state or explicitly
reviewed by an authorized RAFIQ role. They must not duplicate raw project docs
as a second source of truth.

## Deployment Model

The deployed RAFIQ product may contain:

- a graph export service;
- a graph query API for internal tools;
- a vault artifact generator;
- a private reviewer/scholar vault interface;
- a public-safe study artifact interface later, after approval gates pass.

This subsystem must not rely on absolute developer paths such as:

```text
C:\Users\user\Documents\00 AI agent
```

Deployment paths, storage, and access controls must be environment-specific and
owned by RAFIQ.

## Access Control

Initial access levels:

| Access Level | May See |
| --- | --- |
| `system` | Full graph, raw lineage references, private states, reviewer states. |
| `admin` | Full graph except secrets; source, release, and reviewer workflows. |
| `knowledge_editor` | Content graph, quality findings, source packs, review queues. |
| `scholar_reviewer` | Religious review packs, evidence, source context, guidance packs. |
| `developer_private` | Private graph for debugging and ranking evidence. |
| `authenticated_user` | Only approved user-facing study/guidance artifacts. |
| `public_user` | Only approved public-safe graph/vault artifacts. |

No role may see secrets, service keys, private user reflections, or raw private
prompts unless a separate privacy design explicitly permits that access.

## CP21C Integration

The first useful implementation target is CP21C Semantic Ranking And
Cross-Source Selection.

For CP21C, Graphify and vault design should support a measured ranking matrix:

- at least 20 user needs or queries;
- selected Quran anchor;
- candidate Quran anchors;
- selected tafsir passage;
- candidate tafsir passages;
- selected hadith support;
- rejected hadith support and reason;
- quality findings;
- release and approval blockers;
- final score and remediation.

The graph should answer:

```text
Why did RAFIQ select this evidence?
Which nearby evidence was rejected?
Which source, quality, or release gates affected selection?
Does the selected path remain Quran-first and source-grounded?
```

CP21C should not require public approval of private resources. It should prove
private ranking quality while preserving public-release blockers.

## CP21D Integration

For backend Growth Memory, the graph may later connect:

```text
User -> saved GuidanceSession -> cited evidence -> reflection -> action state
```

Privacy boundary:

User memory may improve relevance, not authenticity. It must never override
Quran, hadith, tafsir, source status, review status, or escalation gates.

## CP21E Integration

For Hadith replacement and verification, the graph may connect:

```text
HadithRecord
  -> damaged HadithTextVersion
  -> QualityFinding
  -> replacement candidate
  -> technical review
  -> scholar review
  -> verified private text
```

The graph must preserve old damaged text for traceability. It must not silently
replace a text version in guidance without an auditable review state.

## Query Examples

Internal graph queries should eventually support questions like:

```text
Show all resources connected to Quran 2:255.
```

```text
Which guidance sessions cite hadith with withheld meaning text?
```

```text
Which tawakkul guidance candidates lack tafsir coverage?
```

```text
Which public study packs depend on public-blocked sources?
```

```text
Which hadith replacement candidates are technically verified but still awaiting scholar review?
```

```text
Why did the ranking engine select this Quran anchor and reject nearby candidates?
```

## Implementation Phases

### Phase 1 - Architecture And Contract

- Lock this architecture document.
- Define graph node, edge, status, and vault artifact contracts.
- Decide initial deployment boundary and storage approach.
- Keep the developer Graphify/Obsidian setup out of product runtime.

### Phase 2 - CP21C Resource Graph Prototype

- Export a small private graph for CP21C ranking evaluation.
- Include selected Quran, tafsir, hadith, source, quality, and release states.
- Produce ranking evidence packs for at least 20 cases.
- Do not change user-facing guidance yet.

### Phase 3 - Review Vault Prototype

- Generate ayah, tafsir, hadith, source, and guidance evidence packs.
- Support knowledge editor and scholar review workflows.
- Keep raw/private fields access-controlled.

### Phase 4 - Hadith Replacement Graph

- Connect damaged text findings to replacement candidates and review states.
- Verify that guidance excludes unverified or withheld meaning text.

### Phase 5 - Public Release Gate Graph

- Prove public surfaces cannot cite private-only or public-blocked content.
- Generate public launch blocker packs from the graph.
- Only expose public-safe vault artifacts after approval gates pass.

## Acceptance Criteria

This architecture is accepted when:

- the product Graphify/Vault subsystem is clearly separated from developer
  Graphify/Obsidian tooling;
- Postgres remains the canonical source of truth;
- graph and vault outputs are derived, traceable, status-aware, and governed;
- no graph relationship can silently become approved religious guidance;
- private and public release boundaries are explicit;
- CP21C has a concrete first implementation use case;
- future CP21D and CP21E integrations are defined without forcing immediate
  implementation.

## Architecture Decision

RAFIQ will treat Knowledge Graphify and the RAFIQ Knowledge Vault as product
subsystems, not developer tooling.

They exist to make Quran, tafsir, translation, hadith, theme, provenance,
quality, review, release, and guidance relationships visible and auditable.

They do not replace canonical content storage, validation gates, scholar review,
or source licensing governance.

RAFIQ may use this subsystem to improve ranking, review, study, and release
readiness, but the subsystem must always preserve the product's central rule:

```text
Knowledge is sourced.
Guidance is retrieved and verified.
Publication is governed.
```

Bismillah.
