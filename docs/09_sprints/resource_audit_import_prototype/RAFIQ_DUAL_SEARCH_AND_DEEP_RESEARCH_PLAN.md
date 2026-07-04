# RAFIQ Dual Search And Deep Research Plan

Date: 2026-07-03  
Status: Product Owner planning draft  
Reason: RAFIQ needs both guided companionship and serious source research. CP11 corrected the default journey, but the user must also be able to dig deeper into Quran, tafsir, Hadith, and translations.

## Product Position

RAFIQ needs two search modes:

1. `Guidance Search`
2. `Source Search`

These modes serve different user intentions and must not be mixed into one confusing page.

Guidance Search is for: "Help me understand and practice."

Source Search is for: "Let me research the evidence."

The user must be able to move from a guidance result into deeper source study without losing context.

## Problem To Fix

Current guided results can feel like a closed response:

- Quran lens appears, but the user cannot easily open that ayah into a deeper Quran/translation/tafsir study room.
- Sunnah support appears, but the user cannot easily open the narration, related narrations, collection context, or verification detail from the guidance card.
- The response gives one action, but does not offer a clear research path for users who want to study more.

RAFIQ should answer, then invite deeper knowledge.

## Search Mode 1: Guidance Search

Purpose: personal dakwah companion.

User starts with:

- a feeling;
- a life question;
- a practice goal;
- a theme;
- an ayah;
- a narration.

RAFIQ returns:

- Quran anchor;
- translation/simple meaning;
- tafsir context where available;
- Sunnah support;
- verification/caution;
- reflection;
- one action;
- save/resume.

Guidance Search must remain calm and limited. It should not become a result dump.

### Required Deep Links From Guidance

Every Quran lens must have:

- `Read ayah`;
- `Open tafsir`;
- `Search related Quran`;
- `Find Sunnah support`.

Every Sunnah support item must have:

- `Open narration`;
- `Related narrations`;
- `Check verification`;
- `Search Quran connection`.

Every tafsir summary must have:

- `Open tafsir passage`;
- `Compare tafsir sources` when more than one source is available.

Every action/reflection result must have:

- `Save to Growth`;
- `Continue this path`;
- `Research sources`.

## Search Mode 2: Source Search

Purpose: research and browsing across RAFIQ's private knowledge resources.

User starts with:

- keyword;
- Arabic phrase;
- ayah reference;
- Hadith phrase;
- narrator/source/collection;
- theme;
- domain filter.

Source Search returns grouped results across:

- Quran Arabic text;
- translations;
- tafsir;
- ayah themes/topics;
- Hadith narrations;
- Hadith translations;
- verification/grade records when available.

Source Search must be compact, mobile-first, and useful. It should not show giant cards or repeated metadata.

### Source Search Result Groups

Results should be grouped by domain:

1. Quran
2. Tafsir
3. Hadith
4. Topics/Themes
5. Translations

Each result row should show only:

- short title/reference;
- one readable snippet;
- source/reliability indicator;
- one clear open action.

Expanded state may show:

- Arabic/original text;
- translation;
- tafsir passage;
- hadith reference;
- source detail;
- related guidance action.

## Navigation Model

### Recommended Route Structure

| Route | Purpose | First View |
| --- | --- | --- |
| `/search` | Guidance Search | Need input plus guided path |
| `/sources` | Source Search | Compact source search with filters |
| `/quran/:surahNumber` | Quran reading room | Quran text with layers |
| `/quran/:surahNumber/:ayahNumber` | Ayah study room | Ayah, translations, tafsir, themes, related Sunnah |
| `/hadith` | Sunnah Practice | Practice need first |
| `/hadith/sources` | Hadith source browser | Collection/filter/search |
| `/hadith/:hadithRecordId` | Narration study room | Narration, translation, verification, Quran link, related narrations |

If route count must stay smaller, `/sources` can be a tab inside `/search`, but the two modes must still be visually and mentally separate.

## Guidance To Research Loop

Guided result should become the starting point, not the end.

Flow:

```text
User need
-> Guidance Search
-> RAFIQ Path
-> Quran lens
-> Open ayah study
-> Tafsir / translation / related themes
-> Sunnah support
-> Open narration study
-> Related narrations / verification
-> Save or continue path
```

## Source Search To Guidance Loop

Source research should also be able to become guidance.

Flow:

```text
Source query
-> grouped source results
-> user opens ayah/narration/tafsir
-> user taps "Open guidance from this source"
-> GuidanceSession created
-> reflection/action saved
```

This is important because some users begin with evidence, not a feeling.

## Mobile UX Standard

The design must follow these rules:

- no large dashboard cards;
- no repeated source labels on every line;
- no three-column mobile grids;
- no giant educational heading swings;
- no raw IDs unless inside a technical source detail view;
- no thousands-of-record scrolling as the main learning path;
- result rows must be dense, readable, and tappable;
- filters must be compact chips or a bottom sheet;
- source metadata should be available, not noisy.

## Data And API Requirements

Existing endpoint:

- `/api/private-content/search`

Needed upgrades:

- support `mode=source`;
- support grouped response by domain;
- support Arabic query;
- support ayah reference query like `2:255`;
- support Hadith phrase query;
- support `domain=all|quran|translation|tafsir|hadith|themes`;
- include route targets for every result;
- include `openGuidanceTarget` for creating GuidanceSession from a source result.

Existing endpoint:

- `/api/private-content/guidance/session`

Needed upgrades:

- enrich `quranAnchor` with explicit deep-link targets;
- enrich `sunnahSupport` with narration route, related-search route, and verification route;
- include `researchSuggestions`:
  - related Quran;
  - related tafsir;
  - related Hadith;
  - related themes.

## Checkpoint Plan

### CP12A - Dual Search Product Contract

Status: Pass.

Define shared types for:

- Guidance Search mode;
- Source Search mode;
- grouped source result;
- deep-link target;
- research suggestion;
- source-to-guidance handoff.

Acceptance:

- the product can clearly distinguish a guided answer from a source result;
- every guidance evidence item has a route to deeper study.

### CP12B - Source Search API And Ranking

Status: Pass for current backend scope.

Upgrade private source search so it can return grouped Quran, tafsir, Hadith, translation, topic/theme results.

Acceptance:

- `mercy`, `patience`, Arabic text, ayah reference, and Hadith phrase searches return useful grouped results;
- no result requires the frontend to guess its route;
- Quran, tafsir, Hadith, and translations can be filtered.

### CP12C - Source Search Mobile UI

Status: Pass for current mobile scope.

Build `/sources` or a clearly separated `Sources` tab.

Acceptance:

- mobile user can search all resources;
- result groups are compact and readable;
- filters are easy to use;
- opening a result leads to a study room, not a dead card.

### CP12D - Guidance Deep-Link Upgrade

Status: Pass for current mobile scope.

Upgrade guidance cards so Quran lens, tafsir, and Sunnah support are expandable and clickable.

Acceptance:

- Quran lens opens ayah study;
- tafsir opens tafsir passage or ayah study with tafsir visible;
- Sunnah support opens narration study;
- each opened source can create or continue a GuidanceSession.

### CP12E - Ayah And Narration Study Rooms

Status: Pass for current mobile scope.

Create deeper study pages for one ayah and one narration.

Acceptance:

- ayah page shows Arabic, translation, tafsir, source, related themes, related Sunnah, and `Open guidance`;
- narration page shows original/translation, reference, verification, Quran connection, related narrations, and `Open guidance`;
- pages stay mobile-readable and not box-heavy.

## Product Owner Acceptance Checklist

Pass only if:

- users can choose between `Guidance` and `Sources`;
- guided answers are not dead ends;
- source search is useful without becoming cluttered;
- Quran, tafsir, Hadith, and translations are all searchable;
- every source result has a meaningful open route;
- every opened source can become a guided RAFIQ session;
- mobile first viewport is not dominated by filters, metadata, or boxes.

Fail if:

- guidance only gives a short answer with no path to deeper study;
- source search is hidden so deeply that users cannot research;
- source search returns a raw ungrouped dump;
- users must scroll thousands of Hadith records to learn;
- the UI confuses guidance mode and research mode.

## Recommended Next Step

Proceed with `CP13 - Product Owner Study UX Review And Mobile QA`, or run a data-first checkpoint for translation and verification indexing if resource coverage should improve before Product Owner review.

CP12E made guidance/source links land on user-facing ayah and narration study rooms.
