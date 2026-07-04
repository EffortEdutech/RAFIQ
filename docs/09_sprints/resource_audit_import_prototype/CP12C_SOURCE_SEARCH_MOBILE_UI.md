# CP12C Source Search Mobile UI

Date: 2026-07-03  
Sprint: RAFIQ Orchestrator-First Product Sprint  
Checkpoint: CP12C - Source Search Mobile UI  
Status: Pass for current mobile scope

## Objective

Build a first-class mobile Source Search surface so RAFIQ supports serious study, not only guided companionship.

`/search` remains Guidance Search.  
`/sources` is Source Search.

## Implemented

### New Route

Added:

```text
/sources
```

Purpose:

- search private source material;
- filter by resource family;
- view grouped compact results;
- open a source;
- inspect source detail;
- turn a result into RAFIQ guidance.

### Mobile UI

The Source Search screen includes:

- compact query field;
- domain filters:
  - All;
  - Quran;
  - Tafsir;
  - Hadith;
  - Themes;
- starter searches:
  - `mercy`;
  - `intention`;
  - `ٱللَّهِ`;
  - `2:255`;
- grouped result panels;
- compact result rows;
- source snippets limited for mobile readability;
- `Open`, `Source`, and `Guide` actions.

### Guidance Handoff

The `Guide` action uses each result's `openGuidanceTarget` and calls `createGuidanceSession`.

This makes Source Search a research entry point that can flow back into RAFIQ guidance.

### Navigation

- `/search` action now points to `/sources`.
- `/sources` action points back to `/search`.
- Bottom nav treats `/sources` as part of the Learn section.

## Acceptance Evidence

| Gate | Status | Evidence |
| --- | --- | --- |
| Source Search has its own route. | Pass | `/sources` route added. |
| Source Search is visually/mentally separate from Guidance Search. | Pass | `/search` remains `Guided discovery`; `/sources` is `Source search`. |
| User can filter source search. | Pass | All, Quran, Tafsir, Hadith, and Themes filters added. |
| User can search by keyword, Arabic phrase, or ayah reference. | Pass | Starters include `mercy`, `intention`, `ٱللَّهِ`, and `2:255`. |
| Results are grouped and compact. | Pass | UI renders API `groups` as compact panels and rows. |
| User can open a source. | Pass | Each row has `Open`; source detail appears when a source-detail deep link exists. |
| User can turn a source into guidance. | Pass | `Guide` calls `createGuidanceSession` from `openGuidanceTarget`. |
| Build passes. | Pass | `corepack pnpm build` passed. |
| Mobile export passes. | Pass | `corepack pnpm -C apps/mobile exec expo export --platform web` passed and exported bundle `index-37efa33d786273ca30aad29db9a07dbb.js`. |
| Runtime passes. | Pass | `scripts/check_phase5_runtime.ps1` passed. |
| Backend source search works. | Pass | `/api/private-content/search/sources?q=mercy&domain=all&limit=8` returned `mode=sources`, grouped tafsir/topic results, deep links, and guidance target. |

## Known Limits

- Automated Playwright visual QA remains unavailable because the local Playwright browser binary is missing.
- `/sources` uses the current mobile shell and needs Product Owner visual review on device.
- Translation and verification groups remain backend data/index follow-ups from CP12B.
- Source detail still opens the internal trust/provenance route. CP12E should split user-facing source study from internal source trust.

## Close-Out

- Completed: `/sources` mobile route, filters, starters, grouped result UI, open/source/guide actions, navigation bridge from `/search`, build/export/runtime/API checks.
- Next planned: CP12D - Guidance Deep-Link Upgrade.
- Ad-hoc first: none blocking. Future data work remains for translation and verification indexing.
- Checklist update: CP12C marked Pass for current mobile scope; TECH-017 added.
- Documentation update: CP12C report created; sprint plan, checklist, dual-search plan, and decision register updated.
