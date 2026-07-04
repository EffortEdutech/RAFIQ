# RAFIQ Deployment-Grade UI/UX Reset Sprint Plan

Date: 2026-06-27  
Status: Rejected by Product Owner; recovery required before deployment-readiness QA  
Sprint Type: Product experience reset before deployment-readiness QA  

## Why This Sprint Exists

RAFIQ's documentation describes a personal Islamic companion, daily guidance system, Quran reflection assistant, and spiritual growth platform.

The current app is technically connected, but the visible experience still feels too close to:

- a content browser;
- an internal review tool;
- a generic Islamic app;
- a route demo;
- a source-status interface;
- a backend proof-of-work screen.

That is not yet deployment-grade RAFIQ.

This sprint resets the product UI/UX around RAFIQ's real promise:

> A user opens RAFIQ, receives source-grounded Islamic guidance, reflects, acts, and grows closer to Allah through Quran and Sunnah.

## Source Documents

This sprint is controlled by:

- `docs/00_overview/RAFIQ_Product_Master_Blueprint_V1.md`
- `docs/01_product/RAFIQ_PRD_V2.md`
- `docs/01_product/RAFIQ_MVP_Scope_Lock_V1.md`
- `docs/02_ux_design/RAFIQ_UX_Specification_V2.md`
- `docs/02_ux_design/RAFIQ_UI_UX_MASTER_BLUEPRINT_V1.md`
- `docs/02_ux_design/RAFIQ_Figma_Build_Pack_V2.md`
- `docs/02_ux_design/RAFIQ_Screen_Specification_V1.md`
- `docs/02_ux_design/RAFIQ_UI_UX_DELIVERY_CHECKLIST_V1.md`

Archived or superseded documents may provide background only. They must not override the current product and UX documents.

## Product Owner Direction

The development/private RAFIQ experience must use all available imported content regardless of approval status.

Approval status remains visible, but approval status must not dominate the main user experience.

Public release remains gated separately. The private/development product must still feel complete, premium, and deployment-ready.

## Sprint Objective

Rebuild RAFIQ's visible experience so the app no longer feels like separated technical pages and instead feels like one coherent companion product.

The product must communicate within five seconds:

> RAFIQ helps me receive guidance, understand Quran and Sunnah, reflect, act, and grow.

## UX North Star

The primary RAFIQ loop is:

```text
User state or need
->
Theme detection
->
Quran-first evidence
->
Tafsir explanation
->
Hadith support
->
Reflection
->
One action
->
Growth memory
```

Every main screen must support this loop.

## Non-Negotiable Experience Rules

| Rule | Decision |
| --- | --- |
| Companion first | RAFIQ must feel like a guide, not a database. |
| Quran first | Quran evidence appears before AI explanation or generic advice. |
| One action | Each session should end with one reflection or action. |
| Full-content private mode | Private/dev routes use all available content for product testing. |
| Approval-aware | Approval/source status is visible but visually secondary. |
| Review separation | Internal Review must not appear as a normal user destination. |
| No technical first impression | Raw IDs, traces, internal gates, and review queues must not lead primary pages. |
| Premium visual quality | Screens must feel composed, calm, intentional, and worth paying for. |

## Target Navigation

Primary product navigation:

```text
Today | Companion | Quran | Library | Profile
```

Secondary/private internal navigation:

```text
Internal Review | Source Trust | Admin/QA
```

Hadith remains an important product surface, but the default user framing should be:

```text
Sunnah support within guidance, Quran, and Library
```

Hadith can still have its own route, but it should not make RAFIQ feel like a collection browser.

## Main Product Surfaces

| Surface | Current Problem | Required Direction |
| --- | --- | --- |
| Today `/` | Better than before, but not yet premium enough as the emotional first screen. | Daily guidance companion with immediate value, user state, Quran evidence, reflection, and action. |
| Companion `/answer` | Still too sparse and partly technical in structure. | Flagship guided package: user state -> theme -> Quran -> tafsir -> Hadith -> reflection -> action. |
| Quran `/quran/1` | Still shows source/review links too prominently and feels like data layers. | Beautiful Quran reading room with Arabic honor, translation, tafsir, themes, reflection, and related Sunnah. |
| Hadith `/hadith` | Risks feeling like a collection browser. | Sunnah support experience: theme-led, grade-aware, related Quran, practice/reflection. |
| Library `/search` | Search is still too close to a result list. | Knowledge Path Explorer grouped by Quran, tafsir, Hadith, themes, and next actions. |
| Review `/review` | Internal QA is visible in the normal product family. | Move visually and navigationally into internal workspace only. |
| Profile | Missing from practical navigation. | Add minimum profile/growth memory shell: language, saved guidance, journal, privacy. |

## Visual Experience Direction

RAFIQ should feel:

- calm;
- warm;
- premium;
- spacious;
- spiritually reflective;
- Quran-centered;
- trustworthy;
- personal.

Visual foundations:

- deep green foundation;
- warm cream/sand background;
- restrained gold accent;
- generous spacing;
- strong Arabic typography;
- soft layered cards;
- fewer equal boxes;
- stronger hero composition;
- clear primary action per screen.

Avoid:

- many badges competing for attention;
- repeated source links inside primary reading flow;
- raw technical labels;
- dense review/status panels;
- generic cards that could belong to any app;
- admin dashboard composition.

## Checkpoints

### CP01 - Product Experience Map

Purpose: Lock the exact product journey before implementation.

Deliverables:

- final RAFIQ primary loop diagram;
- route-to-journey map;
- user intent map;
- private vs public vs internal route boundary;
- decision on whether Hadith is primary nav or Library sub-surface.

Acceptance:

- Product Owner can explain RAFIQ's main journey without mentioning backend, approval, or routes;
- every primary route has a clear role in the guidance loop.

### CP02 - High-Fidelity Screen Blueprint

Purpose: Define screen composition before coding.

Deliverables:

- Today screen wireframe;
- Companion guidance package wireframe;
- Quran reading room wireframe;
- Library knowledge path wireframe;
- Hadith support wireframe;
- Profile/growth memory wireframe;
- Internal Review separation wireframe.

Acceptance:

- each screen has one main user purpose;
- each screen has one primary action;
- source/review status has a defined secondary placement.

### CP03 - Shared Design System Reset

Purpose: Replace ad-hoc page styling with a real RAFIQ component language.

Deliverables:

- `RafiqAppShell`;
- sticky premium navigation;
- guidance package card;
- Quran evidence card;
- tafsir context card;
- hadith support card;
- reflection composer;
- action card;
- source trust chip/panel;
- empty/loading/error states.

Acceptance:

- new pages share a coherent visual system;
- navigation stays visible and product-grade;
- Review is excluded from normal product navigation.

### CP04 - Today Experience Rebuild

Purpose: Make the first screen deliver RAFIQ's promise immediately.

Required experience:

```text
Greeting
->
What does your heart need today?
->
Mood/need/time check-in
->
Today's theme
->
Quran evidence
->
Short tafsir/meaning
->
Reflection prompt
->
One action
->
Continue journey or save
```

Acceptance:

- user understands RAFIQ within five seconds;
- page does not feel like a dashboard;
- one meaningful action is visible without scrolling too far.

### CP05 - Companion Guidance Package Rebuild

Purpose: Make `/answer` the flagship RAFIQ experience.

Required experience:

- guided check-in, not chatbot window;
- mood/need chips;
- free-text situation input;
- detected theme;
- Quran-first evidence;
- tafsir meaning;
- Hadith support;
- guided answer;
- reflection prompt;
- action step;
- save/journal path.

Acceptance:

- answer feels like guidance, not generated text;
- no unsupported guidance appears without evidence;
- technical validation details are hidden from primary user flow.

### CP06 - Quran Reading Room Rebuild

Purpose: Make Quran reading feel beautiful, honored, and contextual.

Required experience:

- Surah header with meaning and reading intention;
- Arabic-first ayah display;
- translation and transliteration controls;
- tafsir layer;
- reflection prompt per ayah or section;
- related themes;
- related Hadith support;
- source trust in secondary placement.

Acceptance:

- Arabic text is visually honored;
- reading is calmer than the current data-layer view;
- source links do not interrupt the main reading rhythm.

### CP07 - Library Knowledge Path Rebuild

Purpose: Turn search into guided discovery.

Required experience:

```text
Search or choose theme
->
RAFIQ frames the topic
->
Quran evidence group
->
Tafsir context group
->
Hadith support group
->
Themes/topics group
->
Next actions: read, ask, reflect, save
```

Acceptance:

- search is not a flat list;
- results show relationships;
- user always has a next step after search.

### CP08 - Hadith As Sunnah Support

Purpose: Reframe Hadith away from collection browsing alone.

Required experience:

- theme-led Sunnah discovery;
- collection browsing still available;
- grade and reference visible;
- related Quran;
- practice/reflection prompt;
- verification/source trust secondary panel.

Acceptance:

- user sees what the narration teaches;
- grade is clear;
- collection browsing supports guidance instead of dominating it.

### CP09 - Profile And Growth Memory Shell

Purpose: Add the minimum user continuity layer required by the MVP promise.

Required experience:

- language/preference surface;
- saved guidance placeholder;
- reflection journal placeholder;
- action completion/history placeholder;
- privacy reassurance.

Acceptance:

- RAFIQ feels like it can remember growth;
- no complex account system is required before UI acceptance;
- private reflection language is clear and safe.

### CP10 - Internal Review Separation

Purpose: Keep QA power without weakening the product experience.

Deliverables:

- Review route visually marked as internal workspace;
- Review removed from normal product navigation;
- Source/review details available from secondary links only;
- internal queue remains usable.

Acceptance:

- normal RAFIQ user journey never lands on Review by accident;
- development team can still access Review directly.

### CP11 - Responsive, Accessibility, And Browser QA

Purpose: Confirm the rebuilt experience holds up across desktop and mobile.

Required checks:

- desktop browser QA;
- mobile-width browser QA;
- sticky navigation;
- no horizontal overflow;
- readable Arabic and Latin typography;
- keyboard-accessible primary controls;
- graceful loading and error states;
- no console errors.

Acceptance:

- Today, Companion, Quran, Hadith, Library, Profile, and Review pass QA;
- QA evidence is recorded in a checkpoint report.

### CP12 - Product Owner Acceptance And Go/No-Go

Purpose: Decide whether RAFIQ can proceed to deployment-readiness QA.

Decision options:

- GO to CP08 Deployment Readiness QA;
- CONDITIONAL GO with defined corrections;
- NO-GO and continue UI/UX reset.

Acceptance:

- Product Owner confirms RAFIQ now feels aligned with the documented vision;
- remaining issues are tracked clearly.

## Sprint Checklist

| ID | Checkpoint | Task | Status | Evidence |
| --- | --- | --- | --- | --- |
| UXR-001 | CP01 | Product experience map | Done | `RAFIQ_DEPLOYMENT_GRADE_UI_UX_RESET_CP01_PRODUCT_EXPERIENCE_MAP.md` |
| UXR-002 | CP02 | High-fidelity screen blueprint | Done | `RAFIQ_DEPLOYMENT_GRADE_UI_UX_RESET_CP02_HIGH_FIDELITY_SCREEN_BLUEPRINT.md` |
| UXR-003 | CP03 | Shared design system reset | Done | `RAFIQ_DEPLOYMENT_GRADE_UI_UX_RESET_CP03A_SHARED_SHELL_REPORT.md`; `RAFIQ_DEPLOYMENT_GRADE_UI_UX_RESET_CP03B_SHARED_GUIDANCE_COMPONENTS_REPORT.md` |
| UXR-004 | CP04 | Today experience rebuild | Done | `RAFIQ_DEPLOYMENT_GRADE_UI_UX_RESET_CP04_TODAY_REBUILD_REPORT.md` |
| UXR-005 | CP05 | Companion guidance package rebuild | Done | `RAFIQ_DEPLOYMENT_GRADE_UI_UX_RESET_CP05_COMPANION_GUIDANCE_PACKAGE_REPORT.md` |
| UXR-006 | CP06 | Quran reading room rebuild | Done | `RAFIQ_DEPLOYMENT_GRADE_UI_UX_RESET_CP06_QURAN_READING_ROOM_REPORT.md` |
| UXR-007 | CP07 | Library knowledge path rebuild | Done | `RAFIQ_DEPLOYMENT_GRADE_UI_UX_RESET_CP07_LIBRARY_KNOWLEDGE_PATH_REPORT.md` |
| UXR-008 | CP08 | Hadith as Sunnah support | Done | `RAFIQ_DEPLOYMENT_GRADE_UI_UX_RESET_CP08_HADITH_SUNNAH_SUPPORT_REPORT.md` |
| UXR-009 | CP09 | Profile and growth memory shell | Done | `RAFIQ_DEPLOYMENT_GRADE_UI_UX_RESET_CP09_PROFILE_GROWTH_MEMORY_REPORT.md` |
| UXR-010 | CP10 | Internal Review separation | Done | `RAFIQ_DEPLOYMENT_GRADE_UI_UX_RESET_CP10_INTERNAL_REVIEW_SEPARATION_REPORT.md` |
| UXR-011 | CP11 | Responsive/accessibility/browser QA | Done | `RAFIQ_DEPLOYMENT_GRADE_UI_UX_RESET_CP11_RESPONSIVE_ACCESSIBILITY_BROWSER_QA_REPORT.md` |
| UXR-012 | CP12 | Product Owner acceptance and Go/No-Go | Rejected / Superseded | `RAFIQ_DEPLOYMENT_GRADE_UI_UX_RESET_CP12_PRODUCT_OWNER_ACCEPTANCE_GO_NO_GO_REPORT.md` |
| UXR-013 | Recovery | Mobile companion knowledge delivery recovery | In Progress | `RAFIQ_DEPLOYMENT_GRADE_UI_UX_RESET_PRODUCT_OWNER_REJECTION_RECOVERY_PLAN.md` |

## Implementation Order

Recommended execution:

1. CP01 - Product Experience Map
2. CP02 - High-Fidelity Screen Blueprint
3. CP03 - Shared Design System Reset
4. CP04 - Today
5. CP05 - Companion
6. CP06 - Quran
7. CP07 - Library
8. CP08 - Hadith
9. CP09 - Profile
10. CP10 - Review separation
11. CP11 - QA
12. CP12 - Product Owner decision

Do not proceed to deployment-readiness QA until the Product Owner rejection recovery passes and CP12 reaches GO or CONDITIONAL GO again.

## Success Definition

This sprint succeeds when RAFIQ no longer looks like a set of technical routes and instead feels like:

- a trusted Islamic companion;
- a daily guidance experience;
- a Quran-centered reflection system;
- a Sunnah-supported learning path;
- a product that is calm, useful, premium, and worthy of deployment preparation.

The Product Owner should be able to open RAFIQ and say:

> This finally feels like the RAFIQ we documented.

Bismillah.
