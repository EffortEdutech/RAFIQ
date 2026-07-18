# CP21B - Risk And Scholar Escalation Implementation Report

Date: 2026-07-08  
Status: Pass

## Objective

Implement the CP21B contract so sensitive prompts are classified before ordinary guidance is assembled, and RAFIQ can return a clear blocked or escalated session without confident advice.

## Completed

- Added `GuidanceSession.riskAssessment` to the shared contract.
- Added `safety_escalation` as a first-class `GuidanceSessionStatus`.
- Added deterministic API risk precheck for:
  - scholar escalation;
  - safety escalation;
  - medical/legal professional escalation.
- Added resolved post-retrieval risk classification for:
  - no-evidence sessions;
  - weak, unknown, or withheld Hadith support.
- Added Ask-screen escalation boundary so users see the safe next step instead of ordinary guidance.
- Added `scripts/check_cp21b_risk_scholar_escalation.mjs`.

## Acceptance Evidence

`corepack pnpm exec node scripts/check_cp21b_risk_scholar_escalation.mjs` passed.

Covered matrix:

- ordinary reflection: `ready`, `ordinary_reflection`;
- no evidence: `blocked_no_evidence`, `no_evidence`;
- halal/business contract: `scholar_escalation`;
- divorce: `scholar_escalation`;
- self-harm: `safety_escalation`;
- medication/professional advice: `medical_legal` with `safety_escalation`;
- weak/withheld Hadith: `ready` with `approved_with_disclaimer` and `weak_or_unverified_hadith`.

## Checks Run

- `corepack pnpm build`
- `scripts/start_phase5_apps.ps1`
- `corepack pnpm exec node scripts/check_cp21b_risk_scholar_escalation.mjs`
- `corepack pnpm build:mobile:web`
- `scripts/check_phase5_runtime.ps1`

Note: the first CP21B matrix attempt hit a stale NestJS API process. The stale `8056` listener was stopped, the API was rebuilt/restarted, and the matrix passed on the refreshed API.

## Next Planned

CP21C - Semantic Ranking And Cross-Source Selection.

## Ad-Hoc First

- Physical Product Owner target-device sign-off for CP21A remains pending.
- Public release remains NO-GO.
- CP21C should deepen retrieval quality by measured user needs, not by adding route chrome.

## Checklist Update

- CP21B marked `Pass`.
- TECH-031 added for risk/scholar escalation verification.

## Documentation Update

- CP21B contract updated.
- CP21 backlog updated.
- Sprint plan updated.
- Acceptance checklist updated.
- Decision register updated with OFP-DEC-050.
