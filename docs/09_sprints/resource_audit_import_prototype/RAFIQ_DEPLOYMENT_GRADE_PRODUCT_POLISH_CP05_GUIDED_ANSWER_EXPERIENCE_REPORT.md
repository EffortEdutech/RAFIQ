# RAFIQ Deployment-Grade Product Polish CP05 Guided Answer Experience Report

Date completed: 2026-06-25  
Sprint: RAFIQ Deployment-Grade Product Polish  
Checkpoint: CP05 - Guided Answer Experience Polish  
Status: Complete

## Objective

Make the public guided-answer page feel like RAFIQ's core product promise, not a blocked API state.

## Changes Implemented

| Area | Upgrade |
| --- | --- |
| Page positioning | Reframed the page as `Ask RAFIQ, but only with evidence.` |
| Question panel | Rewrote the prompt flow around careful Islamic knowledge questions and evidence readiness. |
| Question starters | Added user-facing starter questions for mercy, patience, charity, and ruling-like boundaries. |
| Answer readiness | Replaced low-level model/provider copy with polished readiness cards for prompt, answer state, evidence, and citations. |
| Answer workflow | Added a four-step explanation: understand the question, retrieve approved evidence, validate boundaries, and show citations. |
| Blocked answer state | Reframed blocked public answers as trust-preserving behavior rather than system failure. |
| Evidence section | Clarified that no public answer should appear without approved evidence and citations. |
| Guidance boundary | Preserved the non-fatwa boundary and scholar/local-authority escalation copy. |
| Next product path | Added links to source search, Quran preview, and source trust when an answer cannot be produced. |

## Verification

Passed:

- `corepack pnpm build`;
- `corepack pnpm -C apps/mobile exec expo export --platform web`;
- `scripts/check_phase5_runtime.ps1`;
- browser desktop guided-answer verification;
- browser mobile `390x844` guided-answer verification.

Browser verification confirmed:

- title visible: `Ask RAFIQ, but only with evidence.`;
- question starters visible;
- guided answer workflow visible;
- blocked public answer boundary visible;
- evidence/citation boundary visible;
- next product path visible;
- old technical title no longer visible;
- no horizontal overflow on desktop;
- no horizontal overflow on mobile `390x844`;
- no visible private route, review queue, or retrieval trace leaks.

## Decision

CP05 is approved as complete.

The guided-answer page now presents RAFIQ as an evidence-first answer workflow while keeping public release gates intact.

## Next Step

Proceed to CP06: Quran And Hadith Reading Experience Polish.
