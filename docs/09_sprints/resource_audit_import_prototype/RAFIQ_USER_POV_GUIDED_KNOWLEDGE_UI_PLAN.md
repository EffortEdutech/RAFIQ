# RAFIQ User-POV Guided Knowledge UI Plan

Date: 2026-07-03  
Status: Product Owner corrective plan  
Reason: Product Owner rejected library/search UI that expects users to manually browse large collections.

## Core Correction

RAFIQ is not a Quran/Hadith database browser.

RAFIQ is a personal dakwah companion. The interface must help a user move from a real life need to Quran-centered guidance, Sunnah support, reflection, and one careful action.

The user should not need to know:

- which Hadith collection to browse;
- which book/chapter contains a narration;
- which exact source family is available;
- how to search technical source metadata;
- how to scroll through thousands of records.

RAFIQ should ask, understand, select, explain, and guide.

## Product Experience Rule

Every main knowledge route must answer:

1. What is the user trying to learn, practice, or resolve?
2. What Quran anchor should come first?
3. What meaning or tafsir helps the user understand it?
4. What Sunnah support helps the user practice it?
5. What must the user be careful not to overclaim?
6. What one action can the user take today?
7. How can the user save or continue later?

If a screen only lists data, it fails the RAFIQ objective.

## Search Repositioning

Search must not be a raw content search box.

Search becomes `Guided Discovery`:

- user enters a life question, feeling, theme, or practice need;
- RAFIQ opens a `GuidanceSession`;
- results are not shown as a long list first;
- first output is a guided path:
  - Quran anchor;
  - simple meaning;
  - tafsir context;
  - Sunnah support;
  - careful boundary;
  - reflection;
  - one action;
  - continue/save.

Raw source results can exist behind a quiet `Sources` layer, not as the main experience.

## Hadith Repositioning

Hadith must not begin as "choose collection and scroll".

Hadith becomes `Sunnah Practice`:

- entry prompts:
  - "I want to improve my prayer";
  - "I need patience with people";
  - "I want to learn adab";
  - "I want to check a narration";
  - "I want Sunnah support for a Quran ayah";
- RAFIQ selects a small set of relevant narrations;
- the opened narration shows:
  - Arabic/original when available;
  - meaning;
  - reference and reliability;
  - Quran connection;
  - practice map;
  - caution;
  - one action.

Collection browsing remains secondary under `Browse sources`, not the main Hadith experience.

## Proposed Route Model

### Today

Purpose: one daily guidance loop.

First viewport:

- "What is your heart carrying?"
- 3 to 5 human options plus free input.
- immediate session preview.

No dashboard stats.

### Ask

Purpose: natural guidance creation.

First viewport:

- one question field;
- examples from user life;
- answer only after evidence gate.

No chatbot transcript as primary design.

### Learn

Purpose: guided knowledge path.

First viewport:

- "What do you want to understand or practice?"
- theme chips based on common needs;
- one generated path.

No raw search list unless user opens sources.

### Read Quran

Purpose: reading first, guidance optional.

First viewport:

- Quran text primary;
- meaning/tafsir/Sunnah layers as quiet actions;
- `Open guidance from this ayah`.

No mixed dashboard panels.

### Sunnah

Purpose: Sunnah practice support.

First viewport:

- "What Sunnah do you want to practice?"
- guided themes and search;
- selected narrations from orchestrator.

Secondary:

- `Browse sources` opens collection selector and narration index.

### Growth

Purpose: continuity.

First viewport:

- unfinished guidance;
- saved reflections;
- pending actions;
- resume path.

No settings.

## Hadith Page Redesign Direction

Replace current `/hadith` default experience with:

1. `Sunnah Practice` prompt
   - one field: "What do you want to practice or check?"
   - examples: prayer, mercy, intention, patience, adab, gratitude.

2. `Guided Sunnah Path`
   - Quran lens;
   - 1 to 3 narrations;
   - reliability/caution;
   - one practice action.

3. `Browse Sources`
   - collapsed by default;
   - one compact source selector;
   - narration index only when user intentionally opens browsing.

The source browser must never dominate the first viewport.

## Search UI Redesign Direction

Replace current `/search` default experience with:

1. `Guided Discovery`
   - one input;
   - user-life starters;
   - no technical domain selector in first view.

2. `RAFIQ Path`
   - Quran anchor first;
   - tafsir if available;
   - Sunnah support;
   - reflection;
   - one action.

3. `Sources`
   - collapsed;
   - shows evidence count and source list only after user asks to inspect.

## Acceptance Checklist

The redesign fails if:

- a user must scroll through hundreds or thousands of records to learn;
- first viewport is mostly source metadata;
- collection/source names dominate over guidance;
- search returns a list before it creates a guided path;
- Hadith appears without Quran connection, caution, and action;
- repeated labels such as review status, source family, or record counts fill the screen;
- the user cannot start from a normal life need.

The redesign passes if:

- user can start with a feeling, question, theme, or practice goal;
- RAFIQ selects a Quran-first path;
- Hadith is shown as Sunnah support, not a database dump;
- source/reliability is visible but quiet;
- each path ends with reflection and one action;
- browsing sources is available but secondary.

## Next Checkpoints

### CP11A - Guided Discovery Search Rebuild

Rebuild `/search` into user-need guided discovery.

Acceptance:

- user enters "I need patience with my family";
- RAFIQ returns Quran anchor, tafsir context, Sunnah support, caution, reflection, one action;
- raw results are hidden behind `Sources`.

### CP11B - Sunnah Practice Home Rebuild

Rebuild `/hadith` default view into guided Sunnah practice.

Acceptance:

- user enters "intention" or chooses a practice need;
- RAFIQ returns a small curated Sunnah path;
- source browsing is collapsed and secondary.

### CP11C - Source Browse As Secondary Tool

Keep collection/narration browsing for review and direct lookup, but move it behind `Browse sources`.

Acceptance:

- no collection grid or record-count advertising appears in first viewport;
- source browsing is useful when intentionally opened.

## Product Owner Position

Current CP10 work improved pieces of Hadith display, but the product journey still needs correction:

- Hadith should not default to manual collection browsing.
- Search should not feel like a search engine.
- RAFIQ must lead with guidance, not source inventory.

This plan supersedes further cosmetic fixes to `/hadith` or `/search`.
