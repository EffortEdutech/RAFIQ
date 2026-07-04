# CP09B Orchestration Engine Evaluation And Upgrade

Date: 2026-06-30  
Status: Implemented and verified

## Purpose

CP09B upgrades RAFIQ's orchestration engine from a safe deterministic MVP toward an early companion-grade orchestrator.

The goal is not to generate broad Islamic answers. The goal is to route user state and questions into evidence-bound Quran-first guidance sessions, while blocking no-evidence cases.

## Implemented

- Added deterministic theme expansion for common natural language:
  - gratitude / shukr / syukur;
  - patience / sabr / difficult conversation;
  - provision / rizq;
  - anxiety / worry / trust;
  - anger / restraint;
  - prayer / salah / solat;
  - mercy / forgiveness;
  - guidance / direction.
- Preserved raw user input in `GuidanceSession.need.rawInput`.
- Used expanded search input for retrieval and guided-answer generation.
- Added Quran-first fallback for general guidance if the first retrieval pass does not produce a Quran anchor.
- Preserved Hadith-only mode when the user explicitly scopes `domain=hadith`.
- Added `scripts/check_cp09b_orchestration.ps1` as a repeatable engine acceptance check.

## Verified Matrix

| Case | Expected | Result |
| --- | --- | --- |
| `today + mercy` | ready with Quran anchor | Pass: `7:155` |
| `ask + patience before a difficult conversation` | ready with Quran anchor | Pass: `2:45` |
| `ask + how can I practice gratitude today` | ready with Quran anchor | Pass: `56:75` |
| `learn_theme + guidance` | ready with Quran anchor | Pass: `2:2` |
| `quran_ayah + 1:1` | ready with Quran `1:1` | Pass |
| unknown private test phrase | blocked/no Quran anchor | Pass |
| `domain=hadith + mercy` | Hadith-only ready with Sunnah support and no forced Quran anchor | Pass |

## Verification Commands

```text
corepack pnpm build
scripts/check_cp09b_orchestration.ps1
scripts/check_phase5_runtime.ps1
```

All passed on 2026-06-30.

## Remaining Limits

- Theme expansion is deterministic and limited to a first vocabulary set.
- Quran anchor ranking is still basic.
- Tafsir learning is still not a first-class path.
- Sunnah support still needs stronger reliability display and practice mapping.
- Scholar-escalation logic remains basic and should be expanded for worship/legal/personal crisis cases.

## Next

Recommended next checkpoint:

`CP09C - Quran, Tafsir, Hadith Learning Path Upgrade`

CP10 can proceed only if the Product Owner accepts the current engine limits for this sprint.
