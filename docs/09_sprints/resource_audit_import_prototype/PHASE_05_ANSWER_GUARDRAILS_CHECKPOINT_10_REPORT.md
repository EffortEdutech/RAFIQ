# Phase 5 Answer Guardrails Checkpoint 10 Report

Date: 2026-06-19  
Status: Complete  
Scope: AI/RAG guardrails and answer evidence policy.

## Completed Work

Added deterministic private answer-policy infrastructure:

- `content.private_answer_drafts`
- `private_api.detect_answer_intent(question)`
- `private_api.create_answer_draft(question, intent, language, domain, limit)`
- `private_api.get_answer_draft(answer_draft_id)`
- persisted retrieval trace IDs
- persisted retrieved source IDs
- persisted evidence citations
- persisted validation gate results
- persisted response state

This checkpoint does not call an LLM. It deliberately returns a guarded draft
shell so RAFIQ can prove retrieval, citation, escalation, and no-answer policy
before generated religious guidance is introduced.

Implemented response states:

- `approved_with_disclaimer`
- `source_unavailable`
- `scholar_escalation`
- `safety_escalation`

The policy layer records gate results for:

- intent gate
- source retrieval gate
- Quran reference gate
- translation gate
- tafsir gate
- Hadith reference gate
- grade gate
- fatwa boundary gate
- medical/legal/crisis gate
- final citation gate

Added private API and app integration:

- NestJS endpoint: `GET /api/private-content/answer/draft`
- NestJS endpoint: `GET /api/private-content/answer/draft/{answerDraftId}`
- shared answer draft response contracts
- Expo answer evidence policy screen at `/answer`
- home navigation link to the answer evidence policy screen

## Verification Evidence

Answer guardrail SQL verification passed:

```text
phase5_answer_guardrail_assertion_failures: 0
failed_checks: []
```

Scaffold verification passed:

```text
status: pass
requiredFiles: 36
apiRoutes: 10
mobileRoutes: 8
sharedContracts: 9
```

Build verification passed:

```text
@rafiq/shared build: pass
@rafiq/api build: pass
Expo web export: pass
```

Runtime verification passed:

```text
Status              : pass
ApiUrl              : http://127.0.0.1:8056
ExpoUrl             : http://127.0.0.1:8057
ApiHealth           : rafiq-api
OpenApiTitle        : RAFIQ Private API
QuranAyahs          : 7
HadithCollections   : 70
HadithBukhariTotal  : 7563
SearchResults       : 5
RetrievalTrace      : 4bc3be87-162f-411a-8b83-63ac89b62de9
ReviewQueueItems    : 637
ReviewQueueDetail   : c19557c8-9be6-4391-acb9-85596cb3f6b8
AnswerDraft         : b82f065b-0c4e-4f87-b7f5-4d2acbfddbde
AnswerState         : approved_with_disclaimer
AnswerEvidenceItems : 5
```

Browser verification passed:

- `/answer` renders private warning.
- `/answer` renders internal review status.
- `/answer` renders guarded draft state.
- `/answer` renders validation gate results.
- `/answer` renders evidence citations.
- `/answer` renders source-context links for citations.
- Browser console errors: none observed.

## Policy Decision

Checkpoint 10 authorizes private evidence-grounded answer drafting only at the
policy-shell level. Free-form AI generation remains blocked until the next layer
adds model prompts, citation enforcement, response validation, and reviewer
workflow controls.

The deterministic guardrail currently returns:

- related evidence for general questions;
- `scholar_escalation` for ruling/fatwa-like questions;
- `safety_escalation` for medical/legal/crisis-like questions;
- `source_unavailable` when retrieval finds no evidence.

## Important Notes

All answer drafts remain private and carry the persistent
`UNAPPROVED CONTENT - NOT FOR PUBLICATION` notice. Retrieved evidence may be
used for internal testing, but public AI answers remain blocked until rights,
attribution, editorial, scholar/content, and Product Owner approval gates pass.

## Gate Decision

Checkpoint 10 is approved. Phase 5 may proceed to private guided answer UX,
model-prompt integration behind the guardrail, citation enforcement, and
approval-filtered public retrieval design.
