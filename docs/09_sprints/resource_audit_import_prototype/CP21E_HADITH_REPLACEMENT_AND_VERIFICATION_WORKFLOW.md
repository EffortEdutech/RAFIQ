# CP21E - Hadith Replacement And Verification Workflow

Date: 2026-07-07  
Status: Contract Pass; implementation pending

## Objective

Move Hadith text-quality work from quarantine-only into a replacement and verification workflow for damaged or unreliable meaning records.

## Current Source State

CP16 measured damaged meaning candidates. CP18 withholds damaged text from guidance/display when automated quality flags require it.

CP21E defines the next workflow.

## Workflow States

| State | Meaning | User Guidance Use |
| --- | --- | --- |
| `detected` | Automated scan found a quality issue. | Not primary support. |
| `withheld` | Text is unusable or known broken. | Excluded from guidance/display. |
| `replacement_candidate` | Alternative text/source found. | Not used until verified. |
| `technical_verified` | Reference/text integrity checked. | May be shown in private review. |
| `scholar_review` | Religious usage/context is being reviewed. | Not public guidance. |
| `verified_private` | Safe for private RAFIQ study. | Can support private study/guidance with labels. |
| `approved_public` | Rights/content approval complete. | Can be used in public release if other gates pass. |

## Replacement Selection Rules

- Preserve Arabic original and reference even when meaning is withheld.
- Prefer a verified translation from a stronger provenance source.
- Never silently replace a damaged text without audit trail.
- Keep old damaged text quarantined for traceability.
- Do not use weak/unknown-grade narrations as primary practice guidance.

## Review Queue Fields

| Field | Purpose |
| --- | --- |
| `hadith_record_id` | Narration anchor. |
| `text_version_id` | Damaged or candidate text version. |
| `quality_flags` | Automated scan flags. |
| `replacement_source_id` | Candidate source. |
| `review_state` | Workflow state. |
| `technical_reviewer` | Data integrity reviewer. |
| `scholar_reviewer` | Religious reviewer. |
| `decision_notes` | Why accepted/rejected. |

## Implementation Acceptance

CP21E passes only when:

- review/replacement states exist in schema or review queue contract;
- damaged records can be listed by severity;
- verified replacement can be selected without deleting old text;
- orchestrator excludes `detected`, `withheld`, and unverified replacement candidates;
- script verifies at least one damaged fixture remains withheld and one verified fixture can be selected when available.

## Next

Implement after CP21B/CP21C so Hadith support follows risk and ranking rules.
