# CP21A - Target-Device Product Owner UAT Pack

Date: 2026-07-07  
Status: Pack Pass; agent target-viewport UAT passed on 2026-07-08; Product Owner physical-device sign-off pending

## Objective

Give the Product Owner a repeatable target-device UAT script for RAFIQ as a private mobile or companion-device MVP.

## Device Scope

Test on at least one target mobile or companion-device viewport.

Minimum viewport checks:

- 390 x 844 phone-class viewport;
- 430 x 932 large phone viewport;
- actual target device if available.

## UAT Route Script

| Step | Route | What Product Owner Checks | Pass Condition |
| --- | --- | --- | --- |
| 1 | `/` | Today gives immediate Quran-centered guidance. | Quran anchor, reflection, and one action appear without dashboard feeling. |
| 2 | `/answer` | Ask accepts natural user need. | Evidence-backed guidance appears; no confident answer without evidence. |
| 3 | `/search` | Learn starts from user need, not raw search. | Guided steps show Quran, tafsir, reflection, and action. |
| 4 | `/sources?q=2%3A255&domain=all` | Source Search supports research. | Quran, translation, and tafsir results are grouped and tappable. |
| 5 | `/quran/2/255` | Ayah study is readable. | Arabic, translation choice, tafsir access, and guidance action are comfortable on mobile. |
| 6 | `/tafsir/bd7fc272-cafb-4619-810a-3c77bb00e31a` | Tafsir room gives depth. | Explanation and comparisons are readable without internal tooling language. |
| 7 | `/hadith` | Sunnah starts from practice need. | User is not asked to browse thousands of narrations first. |
| 8 | `/hadith/5afbb787-10dc-b1c9-8bc6-4beb0299d569` | Narration study is careful. | Reliability, Arabic, meaning quality, and share boundary are clear. |
| 9 | `/profile` | Growth feels like memory. | Resume, saved guidance, reflection, and action state are visible. |
| 10 | `/settings` | Settings are quiet and separate. | Language, rhythm, guidance lens, and Arabic font controls are compact. |

## Product Owner Pass/Fail Questions

Answer `Pass` or `Fail`.

| Question | Status | Notes |
| --- | --- | --- |
| Does RAFIQ feel like a companion, not a dashboard? | Pending | Agent target-viewport proxy passed; Product Owner physical-device sign-off still required. |
| Does first viewport deliver guidance or study value? | Pending | Agent target-viewport UAT passed; Product Owner physical-device sign-off still required. |
| Is Quran visually primary where relevant? | Pending | Agent target-viewport UAT passed; Product Owner physical-device sign-off still required. |
| Is Sunnah/Hadith handled carefully before practice/share? | Pending | Agent target-viewport UAT passed; Product Owner physical-device sign-off still required. |
| Is typography mature, not childish or oversized? | Pending | Agent target-viewport proxy passed; Product Owner physical-device sign-off still required. |
| Are links and actions visibly tappable? | Pending | Agent target-viewport proxy passed; Product Owner physical-device sign-off still required. |
| Is there no overflow, clipped text, or desktop grid? | Pending | Agent target-viewport UAT passed; Product Owner physical-device sign-off still required. |
| Is there no developer/internal/release wording? | Pending | Agent target-viewport UAT passed; Product Owner physical-device sign-off still required. |

## Evidence Capture

Record:

- device name;
- viewport or actual device resolution;
- route tested;
- pass/fail;
- blocker screenshot or note;
- Product Owner decision.

## Acceptance

CP21A execution can pass only after Product Owner target-device review is recorded.

Agent-executed target-viewport UAT evidence is recorded in `CP21A_TARGET_DEVICE_UAT_EXECUTION_REPORT.md`; this does not replace physical Product Owner sign-off.

## Next

If CP21A fails, fix the target-device blocker before CP21B.
