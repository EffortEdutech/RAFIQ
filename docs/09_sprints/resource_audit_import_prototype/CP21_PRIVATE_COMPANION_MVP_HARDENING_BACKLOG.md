# CP21 - Private Companion MVP Hardening Backlog

Date: 2026-07-06  
Status: Pass as hardening backlog lock

## Objective

Turn the CP20 conditional private MVP GO into an ordered hardening backlog so RAFIQ does not drift back into route-by-route UI work before the private companion foundation is stronger.

## Product Owner Position

RAFIQ may continue private MVP development, but the next work must harden the companion system, not add surface chrome.

Public release remains NO-GO.

## Hardening Principles

- Target-device evidence comes before more screen expansion.
- Sensitive guidance must have risk classification and scholar escalation before broader use.
- Retrieval quality must improve by measured cases, not by visual route existence.
- Growth Memory must become a real companion memory model, not only local UI state.
- Hadith meaning quality must move from quarantine into replacement and verification workflow.
- Quran, tafsir, and Hadith depth should improve through study paths and source selection, not larger panels or more buttons.

## CP21 Backlog Gates

| Gate | Priority | Status | Acceptance Evidence | Unlocks |
| --- | --- | --- | --- | --- |
| CP21A Target-Device Product Owner UAT | H0 | Agent target-viewport execution passed; physical PO sign-off pending | Product Owner tests RAFIQ on target mobile or companion-device viewport; no dashboard feeling, no overflow, no childish typography, no developer wording. | Allows deeper UI polish to proceed with real device evidence. |
| CP21B Risk And Scholar Escalation Implementation | H0 | Implementation passed | Sensitive prompts are classified; advice that needs scholar review is blocked or escalated; no confident answer is shown for unsafe cases. CP21B matrix covers ordinary, no-evidence, scholar, safety, medical/legal, and weak/withheld-Hadith cases. | Allows broader Ask/Today guidance evaluation. |
| CP21C Semantic Ranking And Cross-Source Selection | H0 | Contract locked; implementation pending | Matrix covers at least 20 user needs; Quran/tafsir/Hadith support is selected by ranked relevance, not only deterministic theme expansion. | Allows deeper orchestration upgrade. |
| CP21D Backend Growth Memory Contract | H0 | Contract locked; implementation pending | Saved sessions, reflections, action completion, resume state, preferences, and journal entries have an API/storage contract with privacy boundaries. | Allows companion memory beyond local device state. |
| CP21E Hadith Replacement And Verification Workflow | H0 | Contract locked; implementation pending | Withheld damaged meaning records have review/replacement states; user guidance can select verified replacements where available. | Allows Hadith learning to use more reliable meanings. |
| CP21F Public Release Gate Register | H0 | Register locked; public release blocked | Rights, attribution, editorial, scholar-content, privacy, and safety gates are explicitly listed before any public launch claim. | Prevents accidental public-readiness claims. |
| CP21G Quran/Tafsir/Hadith Study Path Depth | H1 | Planned | Study paths support deeper tafsir comparison, related ayah chains, related narrations, and one careful action without crowding mobile UI. | Allows next learning-depth checkpoint. |
| CP21H Companion Device Operating Constraints | H1 | Planned | Offline/cache, small-screen, restart/resume, font, and low-distraction constraints are documented for the target device. | Allows hardware/companion-device design decisions. |

## Immediate Next Checkpoint

CP21C - Semantic Ranking And Cross-Source Selection.

Scope:

- build a measured ranking matrix across at least 20 user needs;
- improve Quran/tafsir/Hadith support selection beyond deterministic theme expansion;
- keep no-evidence, scholar, safety, and weak-Hadith gates intact;
- verify ranking improvements through an automated script before UI expansion.

## Backlog Acceptance Rules

CP21 is accepted only if:

- every CP20 public-release blocker is mapped to a named hardening gate;
- the next checkpoint is explicit;
- H0 work is separated from H1 deeper-study work;
- public release remains blocked;
- documentation and checklist are updated.

## Checks Run

- `corepack pnpm exec node scripts/check_cp21_hardening_backlog.mjs`
- `corepack pnpm exec node scripts/check_cp21a_f_contract_pack.mjs`

## Completed

- Converted CP20 conditional GO conditions into CP21 hardening gates.
- Marked CP21 as a backlog lock, not a public-release approval.
- Set CP21A as the immediate next checkpoint.
- Added CP21A-F UAT/contract/register pack.
- Executed CP21A agent target-viewport UAT.
- Implemented CP21B risk and scholar escalation.

## Next Planned

CP21C - Semantic Ranking And Cross-Source Selection.

## Ad-Hoc First

- Physical Product Owner target-device sign-off for CP21A remains pending.
- Keep public release blocked until CP21F and governance gates pass.
- Do not add new route chrome before CP21C ranking evidence.

## Checklist Update

- CP21 marked `Pass` as hardening backlog lock.
- CP21A-F marked as pack/contract/register locked, not implementation accepted.
- TECH-028 added for backlog verification.
- CP21A marked `Pass` for agent target-viewport UAT.
- CP21B marked `Pass` for implementation.
- TECH-031 added for CP21B risk/scholar escalation verification.

## Documentation Update

- Master sprint plan updated.
- Acceptance checklist updated.
- Decision register updated with OFP-DEC-047 through OFP-DEC-050.
