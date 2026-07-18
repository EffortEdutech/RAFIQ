# RAFIQ Knowledge Vault Artifact Contract V1

Status: Contract Draft
Date: 2026-07-10

Parent Document:

- `RAFIQ_KNOWLEDGE_GRAPHIFY_AND_VAULT_ARCHITECTURE_V1.md`

Related Contract:

- `RAFIQ_KNOWLEDGE_GRAPHIFY_GRAPH_CONTRACT_V1.md`

## Purpose

This document defines the first artifact contract for the RAFIQ product
Knowledge Vault.

The vault is a RAFIQ-owned product subsystem for human-readable review, study,
scholar, source, guidance, and release-gate artifacts generated from canonical
RAFIQ data and Knowledge Graphify evidence.

This vault is not the central Effort Studio AI development Obsidian vault.

## Vault Boundary

The RAFIQ Knowledge Vault is:

- product-owned;
- environment-aware;
- generated from canonical database and graph evidence;
- access-controlled;
- review-friendly;
- deployable with RAFIQ infrastructure.

It is not:

- a replacement for source files;
- a replacement for Supabase/Postgres;
- a replacement for source licensing registers;
- a replacement for scholar/content review;
- a public surface by default;
- the developer workspace vault at `C:\Users\user\Documents\00 AI agent\AI-Knowledge`.

## Artifact Base Contract

Every vault artifact must include front matter.

```yaml
artifact_id: string
artifact_type: string
title: string
status: draft | generated | in_review | approved_private | approved_public | retired
environment: private_local | private_staging | public_staging | production
access_level: system | admin | knowledge_editor | scholar_reviewer | developer_private | authenticated_user | public_user
public_safe: false
generated_at: string
generated_by: string
source_graph_id: string
canonical_refs: []
source_refs: []
release_state: string
review_state: string
quality_state: string
```

## Required Artifact Sections

Every artifact must include:

1. Summary
2. Canonical References
3. Source And Attribution
4. Evidence Graph
5. Quality And Review State
6. Release Boundary
7. Open Questions Or Blockers

Artifacts may include additional sections when needed.

## Artifact ID Format

Recommended formats:

| Artifact Type | ID Format |
| --- | --- |
| `ayah_study_pack` | `vault:ayah:{surah}:{ayah}` |
| `tafsir_passage_pack` | `vault:tafsir:{passage_id}` |
| `hadith_verification_pack` | `vault:hadith:{hadith_record_id}` |
| `theme_guidance_pack` | `vault:theme:{theme_slug}` |
| `source_approval_pack` | `vault:source:{source_id}` |
| `guidance_evidence_pack` | `vault:guidance:{session_id}` |
| `release_gate_pack` | `vault:release_gate:{scope_id}` |
| `ranking_case_pack` | `vault:ranking_case:{case_id}` |

## Artifact Types

## 1. Ayah Study Pack

Purpose:

Provide a human-readable study and review bundle for one Quran ayah.

Required sections:

- Ayah identity.
- Arabic text versions.
- Available translations.
- Translation attribution.
- Tafsir passages.
- Source topics and RAFIQ themes.
- Related hadith support, if any.
- Quality findings.
- Release state.
- Guidance usage.

Required graph links:

- `QuranAyah`
- `QuranTextVersion`
- `TranslationText`
- `TafsirPassage`
- `RafiqTheme`
- `HadithRecord`, when linked
- `ReleaseState`
- `QualityFinding`, when present

Public-safe rule:

May be public only when Quran text, translation, tafsir, attribution, and all
displayed related evidence are public-approved.

## 2. Tafsir Passage Pack

Purpose:

Provide review context for a tafsir passage and the ayah range it explains.

Required sections:

- Tafsir source and edition.
- Covered ayahs.
- Passage text or approved summary, depending on access level.
- Related comparison passages.
- Source attribution.
- Rights and publication state.
- Guidance usage.
- Review notes.

Required graph links:

- `TafsirPassage`
- `TafsirSource`
- `QuranAyah`
- `Source`
- `ReleaseState`
- `ReviewQueueItem`, when present

Public-safe rule:

May be public only when tafsir rights, attribution, source edition, and content
review are approved.

## 3. Hadith Verification Pack

Purpose:

Provide review context for a hadith record, its text versions, grades,
verification claims, and quality state.

Required sections:

- Hadith collection and reference.
- Arabic original, if available and permitted for the access level.
- Meaning or translation text versions.
- Grade assertions.
- Verification claims.
- Text quality findings.
- Replacement workflow state.
- Quran/theme/guidance relationships.
- Before-practice and before-sharing boundary.
- Release state.

Required graph links:

- `HadithRecord`
- `HadithCollection`
- `HadithTextVersion`
- `GradeAssertion`
- `VerificationClaim`
- `QualityFinding`
- `ReviewQueueItem`, when present
- `ReleaseState`

Public-safe rule:

May be public only when text provenance, rights, grade/verification display,
quality state, attribution, and content review are approved.

## 4. Theme Guidance Pack

Purpose:

Provide a governed evidence bundle for a RAFIQ theme such as tawakkul, sabr,
shukr, tawbah, rahmah, hope, anxiety, or prayer consistency.

Required sections:

- RAFIQ theme definition.
- Source-topic mappings.
- Quran anchors.
- Tafsir support.
- Hadith support.
- Reflection boundaries.
- Action boundaries.
- Scholar escalation boundaries.
- Quality and release blockers.
- Guidance session usage.

Required graph links:

- `RafiqTheme`
- `SourceTopic`
- `QuranAyah`
- `TafsirPassage`
- `HadithRecord`
- `GuidanceSession`, when used
- `ValidationGateResult`, when available

Public-safe rule:

May be public only when the full guidance package evidence is approved for
public use and reviewed for content/scholar boundaries.

## 5. Source Approval Pack

Purpose:

Provide a source-specific approval bundle for rights, attribution, provenance,
integrity, and permitted usage.

Required sections:

- Source identity.
- Provider/publisher/repository.
- Snapshot history.
- Raw-object summary.
- License or terms status.
- Attribution wording.
- Permitted use.
- Public-release blockers.
- Imported content summary.
- Review decision log.

Required graph links:

- `Source`
- `SourceSnapshot`
- `RawObject`
- provided content nodes
- `ReleaseState`
- `ReviewQueueItem`, when present

Public-safe rule:

The pack may have a public-safe summary only if it excludes private raw details
and its source status is safe to disclose.

## 6. Guidance Evidence Pack

Purpose:

Provide a complete evidence bundle for a guidance session.

Required sections:

- User need or sanitized prompt class.
- Guidance session status.
- Risk assessment.
- Quran anchor.
- Tafsir support.
- Hadith support.
- Reflection and action.
- Citation list.
- Validation gate results.
- Blocked or escalation reasons.
- Review state.

Required graph links:

- `GuidanceSession`
- cited `QuranAyah`
- cited `TranslationText`
- cited `TafsirPassage`
- cited `HadithRecord`
- `ValidationGateResult`
- `QualityFinding`, when relevant
- `ReleaseState`

Privacy rule:

User private text must be sanitized or omitted unless the artifact access level
explicitly permits private prompt review.

Public-safe rule:

Public evidence packs must never include private prompts, private reflections,
private-only evidence, public-blocked sources, or reviewer-only data.

## 7. Release Gate Pack

Purpose:

Show whether a public release surface, feature, source set, or guidance theme
can safely launch.

Required sections:

- Release scope.
- Required public evidence.
- Public/private API boundary.
- Source rights status.
- Attribution status.
- Content/scholar review status.
- Safety/risk gate status.
- Privacy/memory gate status.
- Blockers.
- Launch decision.

Required graph links:

- public candidate nodes and edges;
- `ReleaseState`;
- `Source`;
- `ValidationGateResult`;
- `ReviewQueueItem`;
- `QualityFinding`, when relevant.

Public-safe rule:

Release packs are internal unless intentionally converted into a public status
summary that excludes private or reviewer-only details.

## 8. Ranking Case Pack

Purpose:

Support CP21C by explaining why the orchestrator selected, rejected, or blocked
specific Quran, tafsir, hadith, and source-search candidates.

Required sections:

- Prompt or sanitized case label.
- Expected case type.
- Selected Quran anchor.
- Candidate Quran anchors.
- Selected tafsir passage.
- Candidate tafsir passages.
- Selected hadith support.
- Rejected hadith candidates and reasons.
- Score breakdown.
- Quality/release blockers.
- Remediation if score is low.

Required graph links:

- ranking case node;
- selected and candidate evidence nodes;
- `GuidanceSession`, if generated;
- `QualityFinding`, if relevant;
- `ReleaseState`;
- `ValidationGateResult`, if relevant.

Public-safe rule:

Ranking packs are private by default. A public-safe summary may only be exposed
after the selected evidence and prompt handling are approved.

## Artifact Statuses

Approved artifact statuses:

| Status | Meaning |
| --- | --- |
| `draft` | Human-created or incomplete artifact. |
| `generated` | Generated from graph/database state. |
| `in_review` | Artifact is being reviewed. |
| `approved_private` | Accepted for private RAFIQ use. |
| `approved_public` | Accepted for public exposure, subject to deployment gates. |
| `retired` | No longer active. |

## Storage And Deployment

The vault may be stored as:

- generated markdown files;
- database-backed artifact records;
- object storage artifacts;
- a hybrid of database records plus rendered markdown.

The storage decision must preserve:

- access control;
- deterministic regeneration;
- source graph reference;
- review history;
- public/private filtering;
- backup and rollback.

The vault must not use or depend on the central developer Obsidian vault.

## Public-Safe Artifact Rule

An artifact may be marked `public_safe: true` only when:

- every displayed content node is public-approved;
- every displayed relationship is public-approved;
- source rights and attribution are approved;
- quality state is clean or approved for display;
- private prompts, reflections, reviewer notes, raw paths, service data, and
  internal review states are excluded;
- the artifact access level is `public_user`.

## Forbidden Artifact Behavior

Vault artifacts must not:

- become a second canonical source of Islamic content;
- silently modify Quran, translation, tafsir, or hadith text;
- hide source, attribution, or release blockers;
- expose private user reflections or prompts;
- expose raw ingestion paths to public users;
- convert derived graph candidates into approved religious evidence;
- duplicate project docs as if they were content review artifacts.

## Acceptance Criteria

This contract is accepted when:

- all initial artifact types are defined;
- every artifact type is connected to graph node and edge evidence;
- public/private access rules are explicit;
- CP21C ranking packs can be generated from the contract;
- CP21E hadith verification/replacement packs can be generated later;
- release gate packs can prove public blockers before launch claims.

## Next

After this contract is accepted, use it to design CP21C ranking case packs and
later reviewer-facing source, ayah, tafsir, and hadith packs.

Bismillah.
