# RAFIQ Orchestrator API UAT Test Plan

Date: 2026-06-30  
Status: Ready for Product Owner UAT  
Scope: Private local RAFIQ API orchestrator at `/api/private-content/guidance/session`

## Purpose

This UAT confirms whether RAFIQ's orchestrator behaves like a guidance engine, not a static page or search dump. The tester should verify that a user need becomes one coherent `GuidanceSession` with:

- user need and detected intent;
- Quran anchor where appropriate;
- simple meaning and tafsir context;
- Sunnah/Hadith support where available;
- evidence and review state;
- reflection prompt;
- one action;
- next step;
- structured learning path.

## UAT Roles

| Role | Responsibility |
| --- | --- |
| Product Owner | Decide Pass, Fail, or Blocked for the UAT cases. |
| Tester | Run each command, inspect response fields, record evidence. |
| Developer | Fix defects only after Product Owner marks a case Fail or Blocked. |

## Environment Setup

Run from:

```powershell
cd "C:\Users\user\Documents\00 RAFIQ"
```

Start RAFIQ private local services:

```powershell
scripts/start_phase5_apps.ps1
```

Run the baseline health check:

```powershell
scripts/check_phase5_runtime.ps1
```

Expected result:

- `Status` is `pass`;
- `ApiUrl` is `http://127.0.0.1:8056`;
- `PublicContentEnabled` is `False`;
- Quran, Hadith, search, guided answer, validation, and mobile export checks pass.

## Automated UAT Smoke Checks

Run:

```powershell
scripts/check_cp09b_orchestration.ps1
```

Expected:

- natural patience/gratitude questions return ready sessions with Quran anchors;
- unknown/unmapped phrase is blocked;
- Hadith-only mercy returns Sunnah support without forcing a Quran anchor.

Run:

```powershell
scripts/check_cp09c_learning_path.ps1
```

Expected:

- Learn guidance returns Quran, Tafsir, Reflect, and Act steps available;
- Ask patience returns Quran, Tafsir, Reflect, and Act steps available;
- Hadith-only mercy returns Hadith step available while Quran/Tafsir are unavailable;
- every session returns exactly five learning path steps.

## Manual API Test Method

For each case below, run the request and inspect the JSON:

```powershell
$ApiUrl = "http://127.0.0.1:8056"
$response = Invoke-RestMethod "$ApiUrl/api/private-content/guidance/session?entryPoint=today&input=mercy&language=en&domain=all"
$response.session | ConvertTo-Json -Depth 12
```

Record:

- Status: Pass, Fail, or Blocked;
- session status;
- Quran anchor verse key;
- Sunnah support count;
- evidence counts;
- learning path step availability;
- notes.

## UAT Case 01 - Today Guidance

Request:

```powershell
Invoke-RestMethod "http://127.0.0.1:8056/api/private-content/guidance/session?entryPoint=today&input=mercy&language=en&domain=all" | ConvertTo-Json -Depth 12
```

Expected:

- `session.status` is `ready`;
- `session.need.entryPoint` is `today`;
- `session.quranAnchor` is not null;
- `session.guidance.message` begins from the Quran anchor, not generic advice;
- `session.guidance.reflectionPrompt` is present;
- `session.guidance.action.label` is one clear action;
- `session.learningPath.steps` has Quran, Tafsir, Hadith, Reflect, Act.

Pass rule:

- User can understand what to read, what it means, what to reflect on, and what to do today.

## UAT Case 02 - Natural Ask

Request:

```powershell
Invoke-RestMethod "http://127.0.0.1:8056/api/private-content/guidance/session?entryPoint=ask&input=patience%20before%20a%20difficult%20conversation&language=en&domain=all" | ConvertTo-Json -Depth 12
```

Expected:

- `session.status` is `ready`;
- detected intent/theme includes patience;
- Quran anchor is present;
- tafsir summary is present when available;
- verification summary explains evidence state;
- next step points to the Quran anchor route.

Pass rule:

- RAFIQ understands a natural user situation, maps it to a guidance theme, and gives Quran-first guidance.

## UAT Case 03 - Learn Theme

Request:

```powershell
Invoke-RestMethod "http://127.0.0.1:8056/api/private-content/guidance/session?entryPoint=learn_theme&input=guidance&language=en&domain=all" | ConvertTo-Json -Depth 12
```

Expected:

- `session.status` is `ready`;
- `session.need.entryPoint` is `learn_theme`;
- Quran anchor is present;
- `session.learningPath.title` points to the selected Quran anchor;
- Quran and Tafsir learning steps are available;
- Hadith step may be unavailable if no hadith support is attached;
- Reflect and Act are available.

Pass rule:

- Learn behaves like a knowledge path: Quran first, tafsir next, Sunnah support if available, then reflection and action.

## UAT Case 04 - Quran Ayah To Guidance

Request:

```powershell
Invoke-RestMethod "http://127.0.0.1:8056/api/private-content/guidance/session?entryPoint=quran_ayah&input=1%3A1&language=en&domain=all&surahNumber=1&ayahNumber=1&verseKey=1%3A1" | ConvertTo-Json -Depth 12
```

Expected:

- `session.status` is `ready`;
- `session.quranAnchor.verseKey` is `1:1`;
- simple meaning is present;
- action asks the user to return to the ayah, not to a random task;
- next step route is `/quran/1`.

Pass rule:

- Opening guidance from a Quran ayah keeps the ayah as the source of guidance.

## UAT Case 05 - Hadith-Only Mode

Request:

```powershell
Invoke-RestMethod "http://127.0.0.1:8056/api/private-content/guidance/session?entryPoint=learn_theme&input=mercy&language=en&domain=hadith" | ConvertTo-Json -Depth 12
```

Expected:

- `session.status` is `ready`;
- `session.quranAnchor` is null;
- `session.sunnahSupport.Count` is greater than 0;
- Hadith learning step is available;
- Quran and Tafsir steps are unavailable;
- response does not pretend a Quran anchor exists.

Pass rule:

- Scoped Hadith testing works without false Quran anchoring.

## UAT Case 06 - No Evidence Blocking

Request:

```powershell
Invoke-RestMethod "http://127.0.0.1:8056/api/private-content/guidance/session?entryPoint=ask&input=zzzz_unmapped_private_test_phrase&language=en&domain=all" | ConvertTo-Json -Depth 12
```

Expected:

- `session.status` is `blocked_no_evidence`;
- `session.quranAnchor` is null;
- guidance message asks for clearer detail or known theme;
- action does not give religious guidance without evidence.

Pass rule:

- RAFIQ blocks safely when evidence is insufficient.

## UAT Case 07 - Evidence And Source Integrity

Use any ready session from Cases 01-04.

Inspect:

```powershell
$session = (Invoke-RestMethod "http://127.0.0.1:8056/api/private-content/guidance/session?entryPoint=learn_theme&input=guidance&language=en&domain=all").session
$session.verification | ConvertTo-Json -Depth 8
$session.sourceMap | ConvertTo-Json -Depth 8
```

Expected:

- `verification.status` is not empty;
- `verification.evidenceCount` is greater than 0;
- Quran evidence count is greater than 0 for Quran-led cases;
- `reviewStatus` is present;
- `sourceMap.searchResults` is not empty;
- `sourceMap.sourceTargets` includes at least the selected Quran source for Quran-led cases.

Pass rule:

- Guidance can be traced back to evidence and source targets.

## UAT Case 08 - Mobile Learn Route Uses API Result

Open:

```text
http://127.0.0.1:8057/search
```

Expected visible result:

- Study Flow is visible;
- Quran, Tafsir, Hadith, Reflect, and Act steps are visible;
- no repeated text such as `TafsirTafsir`, `MercyMercy`, `TToday`, `AAsk`;
- no horizontal overflow on mobile width;
- Quran anchor still appears after the learning path.

Pass rule:

- The user can follow the path without feeling like they are reading developer output.

## UAT Recording Table

| Case | Status | Evidence To Record | Notes |
| --- | --- | --- | --- |
| 01 Today Guidance | Pass | `ready`; Quran `7:155`; 6 evidence items; 5 learning steps; Quran/Tafsir/Reflect/Act available. | Sunnah step unavailable because no Sunnah support attached. |
| 02 Natural Ask | Pass | `ready`; intent `ask:Patience`; Quran `2:45`; 6 Quran evidence items; next `/quran/2`. | Natural phrasing mapped to patience. |
| 03 Learn Theme | Pass | `ready`; intent `learn_theme:Guidance`; Quran `2:2`; Quran/Tafsir/Reflect/Act available. | Hadith step unavailable because no Sunnah support attached. |
| 04 Quran Ayah | Pass | `ready`; requested verse `1:1`; next `/quran/1`; 5 learning steps. | Ayah remains the anchor. |
| 05 Hadith-Only | Pass | `ready`; Quran anchor null; Sunnah support `2`; Hadith step available; Quran/Tafsir unavailable. | No forced Quran anchor. |
| 06 No Evidence | Pass | `blocked_no_evidence`; no Quran anchor; no evidence; Reflect/Act remain available for safe recovery. | No guidance invented. |
| 07 Evidence Integrity | Pass | Verification `approved_with_disclaimer`; 6 evidence items; 8 search results; 1 source target. | Source target: `quran_ayah_text:efbb2992-8f0e-43a4-95b3-a5a7627dc009`. |
| 08 Mobile Learn | Pass | `/search` at 390x844 shows Study Flow, Quran, Tafsir, Hadith, Reflect, Act, and Quran Anchor. | No duplicate labels; no horizontal overflow. |

## UAT Execution Record - 2026-07-03

| Check | Result | Evidence |
| --- | --- | --- |
| Local ports | Pass | `8056` and `8057` listening. |
| Baseline runtime | Pass | `scripts/check_phase5_runtime.ps1` returned `Status: pass`. |
| CP09B orchestration matrix | Pass | Today mercy, natural ask patience/gratitude, learn guidance, Quran ayah, no-evidence block, and Hadith-only mercy all matched expectations. |
| CP09C learning path matrix | Pass | Learn guidance, Ask patience, and Hadith-only mercy returned correct learning-path availability. |
| Manual API UAT cases 01-07 | Pass | All cases matched expected status, anchor, evidence, and learning-path behavior. |
| Mobile Learn route | Pass | Browser assertion at 390x844 found Study Flow and five learning labels with no overflow or repeated-label regression. |

Current Product Owner UAT result: `GO for orchestrator API structure`, with known limits still applying to deeper tafsir room, stronger hadith learning, and scholar-review approval.

## Product Owner Go/No-Go Rule

Mark API orchestrator UAT as `GO` only if:

- Cases 01-07 pass;
- Case 06 blocks safely;
- no case invents Quran, Tafsir, or Hadith support that is not present;
- API response can drive the mobile UI without extra hardcoded guidance;
- Product Owner agrees the response is useful to a real RAFIQ user.

Mark as `NO-GO` if:

- any ready session gives guidance without evidence;
- Hadith-only mode forces a Quran anchor;
- no-evidence input returns advice;
- learning path is missing from ready sessions;
- the response feels like developer/debug output rather than user guidance.

## Current Known Limits

- This UAT verifies orchestration structure and evidence discipline, not final public religious approval.
- Tafsir learning is still summary-level; a full tafsir reading room remains a future checkpoint.
- Hadith support is private evidence and still requires stronger grade/review UX before public release.
- Ranking is deterministic and basic; deeper semantic ranking remains future engine work.
