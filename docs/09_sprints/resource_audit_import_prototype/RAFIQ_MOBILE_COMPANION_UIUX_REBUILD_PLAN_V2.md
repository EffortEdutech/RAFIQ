# RAFIQ Mobile Companion UI/UX Rebuild Plan V2

Date: 2026-06-28  
Status: New plan for Product Owner review  
Decision: Previous UI/UX reset is rejected. Build again from this plan.

## Product Owner Direction

RAFIQ is not a developer console, content browser, dashboard, or route demo. RAFIQ is intended for a mobile device or special companion device. The experience must feel like a personal Islamic companion and knowledge delivery system.

The user must feel:

- I came with a state, question, or need.
- RAFIQ gave me Quran-first guidance.
- I understood the meaning.
- I saw Sunnah support where relevant.
- I reflected.
- I left with one action.
- RAFIQ remembered my growth path.

## Rejected Direction

Do not continue the current pattern of:

- large web-dashboard panels;
- route explanations;
- internal process copy;
- QA or approval language;
- source plumbing as primary UX;
- too many cards with product commentary;
- screens that explain what RAFIQ is supposed to do instead of doing it.

Internal review, source status, trace, validation, approval, payload, private/public release, and developer wording must not appear in the user product experience.

## New Product Posture

RAFIQ should behave like a calm companion device:

- one primary thing per screen;
- large readable Quran and guidance;
- minimal navigation;
- gesture-friendly touch targets;
- short human copy;
- knowledge delivered in layers, not dumps;
- Quran and Sunnah are visible as guidance, not metadata;
- reflection and action are always part of the loop.

## Core Experience Loop

```text
Need
-> Quran
-> Meaning
-> Sunnah
-> Reflection
-> One Action
-> Growth Memory
```

Every primary screen must support this loop. If a screen cannot support the loop, it is not part of the main product surface.

## Primary Information Architecture

Use five main destinations only:

1. Today
2. Ask
3. Read
4. Learn
5. Growth

Hadith/Sunnah is not hidden. It appears as:

- Sunnah layer inside Today and Ask;
- Sunnah tab inside Learn;
- Sunnah support inside Read;
- direct Sunnah collection entry from Learn.

Internal routes are excluded from the main device UI.

## Navigation Model

Mobile bottom navigation:

- Today
- Ask
- Read
- Learn
- Growth

Special companion device mode:

- home button returns to Today;
- primary action button continues the current loop;
- secondary action opens source detail only when the user asks to study deeper;
- no dense top nav.

## Visual Direction

The UI must feel like a premium spiritual companion, not a SaaS admin panel.

Visual rules:

- deep readable background, warm paper reading areas, gold only as accent;
- fewer boxes, fewer nested cards;
- use full-width guidance panels rather than many small dashboard cards;
- Arabic must feel honored and spacious;
- English meaning must be readable at mobile distance;
- action buttons must be obvious and thumb-friendly;
- avoid technical badges as decoration;
- avoid “status strips” unless they help the user decide what to do.

## Voice And Copy Rules

Use:

- “What is your heart carrying?”
- “Read this ayah.”
- “Reflect once.”
- “Carry this action today.”
- “Study the source.”
- “Save to Growth.”

Do not use:

- “payload”
- “validation”
- “review”
- “deployment”
- “approval”
- “private”
- “public release”
- “metadata”
- “trace”
- “route”
- “RAFIQ should”
- “user should”
- “source-aware”
- “workspace”
- “console”

## Screen Blueprint

### 1. Today

Purpose: immediate daily guidance.

First viewport:

- greeting or current moment;
- one emotional/spiritual need selector;
- one Quran reminder;
- one sentence of meaning;
- one action button.

Below first viewport:

- Sunnah support;
- reflection input;
- mark action complete;
- continue to Ask or Read.

Today must not feel like a dashboard. It must feel like opening RAFIQ and receiving guidance immediately.

### 2. Ask

Purpose: companion guidance package.

First viewport:

- “What is your heart carrying?”
- natural input;
- 3 to 4 starter chips;
- primary button: “Guide me.”

Result view:

- Quran first;
- meaning;
- Sunnah support;
- answer/reflection;
- one action;
- save to Growth.

Do not show chat transcript styling as the main experience. Ask is not a chatbot. It is a guided package.

### 3. Read

Purpose: Quran reading room.

First viewport:

- Surah name and Arabic name;
- reading intention selector;
- Arabic ayah;
- translation;
- one “Reflect” action.

Layer controls:

- Translation
- Tafsir
- Sunnah
- Themes
- Sources

Sources are optional and quiet. Quran reading must remain primary.

### 4. Learn

Purpose: knowledge path, not search dump.

First viewport:

- theme search;
- curated theme paths;
- “Continue a saved path.”

Knowledge path result:

- Quran anchor;
- tafsir/meaning;
- Sunnah support;
- related themes;
- next action;
- save path.

Learn includes a Sunnah tab:

- theme-led Hadith browsing;
- collection browsing secondary;
- narration detail with reference and grade;
- practice reflection.

### 5. Growth

Purpose: memory and continuity.

First viewport:

- current streak or return rhythm without gamifying worship;
- saved guidance;
- unfinished action;
- journal draft.

Growth sections:

- Saved Guidance
- Reflections
- Actions
- Preferences

Growth must feel like spiritual continuity, not an account settings page.

## Component System To Build

Replace the current card-heavy system with these components:

- `CompanionDeviceShell`
- `BottomDeviceNav`
- `GuidanceHero`
- `NeedSelector`
- `QuranReminderPanel`
- `MeaningLayer`
- `SunnahSupportLayer`
- `ReflectionPad`
- `OneActionDock`
- `KnowledgePath`
- `ReadingLayerControls`
- `GrowthMemoryList`
- `SourceDetailSheet`

Components must be mobile-first. Desktop may center a device-width experience instead of expanding into a dashboard.

## Implementation Checkpoints

### CP00 - Reject And Freeze Old UX

Output:

- mark previous CP12 as rejected;
- preserve old code only as implementation reference;
- stop optimizing old dashboard routes.

Acceptance:

- new plan is the source of truth.

### CP01 - Design Tokens And Device Shell

Output:

- mobile-first shell;
- bottom nav;
- typography scale;
- spacing scale;
- touch targets;
- safe-area handling;
- desktop device preview behavior.

Acceptance:

- app feels designed for phone/device before route content is added.

### CP02 - Today Rebuild

Output:

- new Today first viewport;
- Quran reminder;
- meaning;
- Sunnah support;
- reflection;
- one action.

Acceptance:

- user receives value in under 10 seconds.

### CP03 - Ask Rebuild

Output:

- natural companion input;
- guided package result;
- no chatbot-first UI;
- no API/process language leakage.

Acceptance:

- result reads like guidance, not system output.

### CP04 - Read Rebuild

Output:

- Quran reading room with honored Arabic;
- translation and tafsir layers;
- reflection/action per passage;
- quiet source details.

Acceptance:

- Quran remains visually primary.

### CP05 - Learn And Sunnah Rebuild

Output:

- theme-led learning;
- Sunnah tab;
- Hadith narration with reference and grade;
- knowledge path output.

Acceptance:

- Hadith is visible and useful without becoming a raw collection browser.

### CP06 - Growth Rebuild

Output:

- saved guidance;
- reflection memory;
- action continuity;
- preferences.

Acceptance:

- user understands why returning tomorrow matters.

### CP07 - Mobile QA

Output:

- test 390x844, 430x932, tablet, and desktop;
- no overlapping text;
- no broken navigation;
- no console errors;
- no developer-facing language.

Acceptance:

- Product Owner can inspect on mobile and see a coherent companion product.

### CP08 - Product Owner Acceptance

Output:

- Go/No-Go report;
- screenshots;
- route checklist;
- remaining gaps.

Acceptance:

- Product Owner confirms RAFIQ now feels like a companion and knowledge delivery system.

## Build Rules

- Build screen by screen, not by patching old copy only.
- After each checkpoint, run browser QA before proceeding.
- Do not mark a checkpoint complete if the first viewport still feels like a dashboard.
- Do not hide Hadith/Sunnah; integrate it as support in Today, Ask, Read, and Learn.
- Do not use internal operational terms anywhere in product screens.

## Product Owner Acceptance Questions

For every route, answer yes or no:

- Does this screen serve the user immediately?
- Does it deliver knowledge rather than explain the product?
- Is Quran visible as primary guidance where appropriate?
- Is Sunnah support easy to find?
- Is there one reflection or one action?
- Would this feel appropriate on a mobile or companion device?
- Is all developer/process language absent?

If any answer is no, the checkpoint is not accepted.
