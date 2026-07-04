# RAFIQ AI Validation Gates V1

Status: Build Gate
Last updated: 2026-06-09

## Purpose

This document converts RAFIQ's AI safety principles into implementation gates.

No AI guidance response may be shown to a user unless it passes these gates or falls back to a safe refusal/escalation response.

## Required Gates

| Gate | Requirement | Failure Behavior |
| --- | --- | --- |
| Intent Gate | Classify user input as guidance, learning, search, reflection, journal, crisis, ruling, medical, legal, or other. | Route to safe template or human/scholar recommendation. |
| Source Retrieval Gate | Retrieve source records before generation. | Do not generate Islamic claims; explain that no relevant source was found. |
| Quran Reference Gate | Every Quran reference must match an existing surah and ayah range in the database. | Remove invalid reference and regenerate from valid evidence. |
| Translation Gate | Quran translation must come from an approved source record, not from the LLM. | Hide translation or use approved fallback language. |
| Tafsir Gate | Tafsir summaries must be grounded in a stored tafsir source. | Label as unavailable; do not infer tafsir. |
| Hadith Reference Gate | Hadith must include collection, reference, text source, and grade or verification status. | Exclude the hadith from guidance. |
| Grade Gate | Weak/fabricated/unknown narrations cannot be used as primary guidance. | Use only as cautionary/verification content if approved. |
| Fatwa Boundary Gate | Rulings, halal/haram decisions, divorce, inheritance, finance, marriage disputes, and worship-specific rulings require escalation. | Provide general related evidence only and recommend a qualified scholar. |
| Medical/Legal/Crisis Gate | Medical, legal, self-harm, abuse, or emergency content must not be handled as ordinary spiritual guidance. | Show appropriate safety guidance and recommend professional/emergency help. |
| Personalization Gate | User history may influence relevance, not authenticity. | Ignore personalization if it conflicts with source authority. |
| Final Citation Gate | Final response must display references and source labels for religious content. | Block response. |

## Response States

| State | Meaning |
| --- | --- |
| `approved` | All required gates passed. |
| `approved_with_disclaimer` | Sources are valid but relevance confidence is medium or topic is sensitive. |
| `source_unavailable` | No suitable evidence found. |
| `scholar_escalation` | Topic may require qualified scholarly ruling. |
| `safety_escalation` | Topic includes medical, legal, crisis, abuse, or emergency risk. |
| `blocked` | Validation failed after retry. |

## Implementation Contract

Each guidance response should persist:

- `prompt_template_id`
- `prompt_template_version`
- `retrieved_source_ids`
- `validation_gate_results`
- `final_response_state`
- `model_name`
- `created_at`

## Non-Negotiable Rule

The LLM may explain, connect, simplify, and reflect. It may not invent religious evidence, source references, hadith grades, scholarly rulings, or Quran translations.

