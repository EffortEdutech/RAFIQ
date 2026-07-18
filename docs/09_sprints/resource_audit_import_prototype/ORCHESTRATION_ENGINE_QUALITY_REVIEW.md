# Orchestration Engine Quality Review

Date: 2026-07-06  
Status: CP19 matrix implemented and verified

## Current Level

The RAFIQ orchestration engine has moved from safe deterministic MVP toward an early companion-grade orchestrator. It is still not final, but it now handles a first set of natural-language theme expansions while preserving no-evidence blocking.

It currently does well at:

- creating one shared `GuidanceSessionResponse`;
- searching private Quran, tafsir, topic/theme, and Hadith content;
- selecting a Quran anchor when retrieval finds Quran evidence;
- attaching Sunnah support when Hadith evidence is retrieved;
- blocking no-evidence sessions instead of inventing Islamic guidance;
- returning verification counts, review status, source targets, reflection, action, and next step.

CP09B improved:

- natural user phrasing for gratitude, patience, provision, anxiety/trust, anger/restraint, prayer, mercy, and guidance;
- Quran-first fallback for general guidance when the first search does not produce a Quran anchor;
- Hadith-only study mode so explicitly scoped Hadith learning is not forced into a Quran anchor;
- deterministic acceptance script at `scripts/check_cp09b_orchestration.ps1`.

CP19 added:

- a repeatable scoring matrix at `scripts/check_cp19_orchestration_matrix.mjs`;
- natural-language checks for patience and prayer focus;
- direct ayah guidance check for `2:255`;
- anchored Hadith-record check for Bukhari #1;
- no-evidence blocking check for an unmapped private phrase;
- Source Search ranking/deep-link check for Quran, translation, and tafsir routes;
- dedupe protection so exact Quran ayah source rows do not repeat in the top results.

It is still not yet strong enough at:

- semantic intent expansion from natural user language;
- mapping common human phrasing to known Quran themes;
- always preserving Quran-first structure when Hadith evidence is found;
- joining Quran, tafsir, and Hadith into a true learning path;
- selecting the best anchor rather than the first retrievable anchor;
- explaining why a source was selected;
- handling tafsir learning as a first-class path;
- scoring confidence, risk, and scholar-escalation need beyond simple evidence availability.

## Smoke Test Results

| Case | Result | Assessment |
| --- | --- | --- |
| CP19 natural patience | `ready`, score `100`, Quran `2:45`, tafsir route | Pass. Quran-first natural guidance with tafsir path. |
| CP19 natural prayer focus | `ready`, score `100`, Quran `2:238`, tafsir route | Pass. Natural prayer wording maps to Quran guidance. |
| CP19 direct ayah `2:255` | `ready`, score `100`, Quran `2:255`, tafsir route | Pass. Requested ayah remains anchor. |
| CP19 anchored Hadith intention | `ready`, score `100`, first Sunnah support is opened narration | Pass. Hadith-only scoped mode anchors the narration. |
| CP19 unknown private phrase | `blocked_no_evidence`, no evidence | Pass. No invented guidance. |
| CP19 Source Search `2:255` | Quran `1`, translation `1`, tafsir `10`; exact Quran route `/quran/2/255` | Pass. Duplicate Quran source rows removed. |
| `today + mercy` | `ready`, Quran `7:155`, 6 Quran evidence | Good deterministic Quran anchor behavior. |
| `learn_theme + guidance` | `ready`, Quran `2:2`, 6 Quran evidence | Good theme-to-Quran behavior. |
| `quran_ayah + 1:1` | `ready`, Quran `1:1`, 6 Quran evidence | Good direct ayah session behavior. |
| `ask + I feel anxious about rizq` | `blocked_no_evidence` | Safe blocking behavior. |
| `ask + patience before a difficult conversation` | `ready`, Quran `2:45` | CP09B maps natural phrasing to patience evidence. |
| `ask + how can I practice gratitude today` | `ready`, Quran `56:75` | CP09B maps natural phrasing to gratitude evidence. |
| `learn_theme + mercy + domain=hadith` | `ready`, Sunnah support, no Quran anchor | Accepted for explicitly scoped Hadith-only study mode. |
| unknown private test phrase | `blocked_no_evidence` | No-evidence discipline preserved. |

## Expected Companion-Grade Gate

Before RAFIQ can be called broader-release orchestration-grade, the engine must pass:

- natural phrasing expansion: `gratitude today`, `difficult conversation`, `anxious about provision`, `angry`, `lost`, `need focus`, `prayer slipping`;
- Quran-first anchor: every non-blocked general guidance session must select a Quran anchor unless explicitly scoped to a Hadith-only study mode;
- tafsir path: Quran anchor must expose a meaningful tafsir learning step when tafsir exists; CP19 passes this for tested anchors;
- Sunnah support: Hadith support must show reliability and practice connection without replacing Quran; CP19 passes this for Hadith-only anchoring;
- source explanation: session must state why this Quran anchor and support were selected;
- risk handling: worship/legal/personal crisis questions must be escalated or narrowed instead of answered generically;
- repeatability: same input should produce stable source selection unless the evidence index changes;
- no-evidence discipline: blocked sessions must remain blocked.

## Recommendation

CP19 is implemented. Proceed next to CP20 Product Owner Private Companion MVP Go/No-Go Review, while carrying these engine gaps:

- broader semantic ranking beyond deterministic theme expansion;
- scholar-escalation and risk classification cases;
- richer cross-linking from Quran-led sessions into relevant Hadith where evidence exists;
- replacement/review workflow for flagged Hadith meaning records.

The next engine target remains:

```text
input/state
-> intent/theme expansion
-> Quran-first retrieval
-> tafsir context
-> Sunnah support where relevant
-> verification/risk gate
-> guidance package
-> reflection
-> one action
-> memory/resume
```
