# RAFIQ UI/UX Master Blueprint V1

Date: 2026-06-25  
Status: Product Owner review required before further UI implementation  
Purpose: Define the actual RAFIQ product experience before continuing build/polish work.

## Why This Document Exists

RAFIQ cannot be delivered by polishing screens one by one without a controlling UI/UX blueprint.

Recent implementation drifted toward:

- public approval explanations;
- release-status pages;
- internal engineering screens;
- content/status cards;
- routes that work technically but do not feel like RAFIQ.

That is not enough.

RAFIQ's UI/UX must be designed first, then implemented.

## Product Experience North Star

When a user opens RAFIQ, it should feel like:

> A calm Islamic knowledge companion that helps me read, understand, ask, reflect, and take one meaningful step with Quran and Sunnah evidence.

RAFIQ must not feel like:

- an admin dashboard;
- a content dump;
- a generic chatbot;
- a release-candidate document;
- a database browser;
- a warning/status console.

## Primary Product Mode

The main product experience is:

**Private Full-Content RAFIQ for development and testing.**

This means:

- all available imported canonical content is usable by the development team;
- approval status remains visible;
- approval status does not remove content from private UX;
- public release remains separately gated.

The public release-gated experience is secondary until public approval is complete.

## Experience Principles

| Principle | UI Meaning |
| --- | --- |
| Quran-first | Guidance should naturally lead to Quran evidence before AI explanation. |
| Companion, not dashboard | The UI should guide the next step instead of showing many equal boxes. |
| One meaningful action | Each session should end with read, reflect, save, ask, or continue. |
| Evidence visible | Every answer or content path should show source, attribution, and review state. |
| Calm depth | Rich content should feel spacious and readable, not dense and administrative. |
| Approval-aware, not approval-led | Approval metadata is present but must not dominate the main experience. |
| Full-content private mode | Development routes must use all available content regardless of approval status. |

## Signature RAFIQ Experience

The signature flow is not:

Search > result list > detail.

The signature flow is:

1. User arrives with a need, theme, question, or reading intention.
2. RAFIQ frames the need into a knowledge path.
3. RAFIQ surfaces Quran evidence.
4. RAFIQ connects Hadith, tafsir, topics, and themes.
5. RAFIQ offers a guided answer or reflection.
6. RAFIQ shows source trust and review status.
7. User leaves with one meaningful action or saved insight.

## Core User Journeys

### Journey 1: Daily Guidance

User intent:

> I want something beneficial today.

Flow:

Home > Today's Theme > Ayah > Short reflection > Related Hadith > One action

Required UI:

- greeting or calm opening;
- theme card;
- Quran card;
- reflection prompt;
- action card;
- save/continue option.

### Journey 2: Ask Carefully

User intent:

> I have a question and want evidence.

Flow:

Ask > intent framing > evidence retrieval > Quran/Hadith citations > guided answer > review boundary

Required UI:

- conversational but not chatbot-heavy;
- evidence cards before answer confidence;
- visible non-fatwa boundary;
- source trust links;
- reviewer/internal status in private mode.

### Journey 3: Read Quran With Context

User intent:

> I want to read and understand Quran.

Flow:

Quran > Surah/Ayah > Arabic > translation > tafsir > topics/themes > related Hadith

Required UI:

- beautiful Arabic reading surface;
- translation and tafsir as calm layers;
- toggles that feel like reading controls, not debug filters;
- source trust available but not visually dominant.

### Journey 4: Explore Hadith

User intent:

> I want to browse or verify Hadith.

Flow:

Hadith > collection > book/chapter/list > detail > grade/source/related Quran

Required UI:

- curated collection browser;
- readable narration list;
- detail screen with Arabic/translation;
- grade and verification shown clearly;
- source trust available.

### Journey 5: Search Knowledge Graph

User intent:

> I want to find Islamic knowledge about a topic.

Flow:

Search > grouped results > Quran/Tafsir/Hadith/Topics > source context > ask/read next

Required UI:

- grouped result sections;
- not a flat technical list;
- visual domain labels;
- next actions after search.

## Main Screens Required

| Screen | UX Role | Must Feel Like |
| --- | --- | --- |
| Home | Companion entry | calm daily guidance plus full-content entry |
| Ask | Guided answer | evidence-led companion workflow |
| Quran | Reading room | beautiful, spacious, Quran-centered |
| Hadith | Sunnah library | curated, trustworthy, source-aware |
| Search | Knowledge discovery | grouped, guided, exploratory |
| Source Trust | Attribution layer | trust support, not admin page |
| Review | Internal QA | private operational workspace |
| Profile/Journey | Growth memory | future user continuity |

## Visual Direction

RAFIQ visual language:

- warm cream/sand background;
- deep green foundation;
- soft gold accent;
- generous spacing;
- large readable type;
- Arabic text receives visual honor;
- fewer boxes;
- stronger page composition;
- cards should feel like content surfaces, not database rows.

Avoid:

- too many equal cards;
- excessive badges;
- raw IDs and trace IDs in primary view;
- approval warnings as the first impression;
- dense paragraphs explaining the system.

## Information Hierarchy

Every screen should follow this order:

1. User purpose.
2. Primary content or action.
3. Supporting evidence/context.
4. Source trust/review status.
5. Secondary technical details.

Current implementation often reverses this order. CP07.6 must correct it.

## Content Approval Rule

Private/dev mode:

- show all available imported content;
- show approval/review status;
- do not block development content access.

Public mode:

- show only release-approved content;
- show graceful gated states;
- hide unapproved real content.

## CP07.6 Required Before CP08

CP08 Deployment Readiness QA should not proceed until CP07.6 creates the signature RAFIQ UX layer.

CP07.6 must deliver:

- UX wireframe spec for Home, Ask, Quran, Hadith, and Search;
- redesigned Home first experience;
- redesigned Quran reader visual hierarchy;
- redesigned Ask guided flow;
- redesigned Search grouped result experience;
- reduced approval-warning dominance;
- browser screenshots or verification notes for desktop and mobile.

## Acceptance Criteria

RAFIQ UI/UX is acceptable when the Product Owner can open the app and say:

- I understand what RAFIQ is within 5 seconds;
- this feels like a companion, not a system report;
- I can enter Search, Quran, Hadith, and Ask naturally;
- the content feels alive and useful;
- approval status is visible but not suffocating;
- the experience feels worthy of deployment preparation.

## Decision Required

Before proceeding with CP08, Product Owner should approve this master UI/UX direction or request changes.

Recommended next checkpoint:

**CP07.6 - Signature RAFIQ Experience Layer**

