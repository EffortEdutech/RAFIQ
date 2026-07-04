# RAFIQ Deployment-Grade UI/UX Reset CP02 High-Fidelity Screen Blueprint

Date: 2026-06-27  
Sprint: RAFIQ Deployment-Grade UI/UX Reset  
Checkpoint: CP02 - High-Fidelity Screen Blueprint  
Status: Complete; ready for CP03 shared design system reset

## Purpose

This checkpoint converts the CP01 product experience map into screen-level composition before implementation.

The goal is to ensure every primary RAFIQ screen has one clear user purpose, one primary action, and a consistent placement for Quran evidence, Sunnah support, reflection, action, and source trust.

## Shared Screen Pattern

Primary RAFIQ screens follow this structure:

```text
1. Personal context
2. Main guidance or reading surface
3. Quran-first evidence
4. Tafsir or meaning layer
5. Sunnah support
6. Reflection prompt
7. One action
8. Source trust as secondary support
```

This pattern may compress on smaller screens, but the hierarchy must not reverse into source status, internal review, or route mechanics first.

## Global Layout Rules

| Area | Rule |
| --- | --- |
| Navigation | Primary nav is Today, Companion, Quran, Library, Profile. |
| Hadith | Framed as Sunnah support and reachable contextually or through Library. |
| Review | Internal-only visual treatment; excluded from primary nav. |
| Source Trust | Available through chips, bottom panels, or secondary links. It must not interrupt primary reading. |
| Primary action | Every primary screen must expose exactly one dominant next action. |
| Private mode | Full-content private mode may show approval status, but status is secondary metadata. |
| Public mode | Public gates stay separate and must not define the private product UX. |

## Screen 1 - Today

Route: `/`  
Purpose: Deliver immediate daily guidance and one action.

### Composition

```text
Sticky RAFIQ nav
Warm greeting and time-aware check-in
Need selector: "What does your heart need today?"
Today's Theme stage
Quran evidence card
Short tafsir/meaning card
Reflection composer
Today's one action
Continue journey / save guidance secondary actions
Source trust footer strip
```

### Primary Action

`Begin today's reflection`

### Secondary Actions

- Save guidance.
- Continue in Companion.
- Open Quran context.

### Source Placement

Small trust strip after the action block:

```text
Sources: Quran evidence, tafsir source, related Sunnah support, review status
```

### Empty/Loading/Error States

| State | Behavior |
| --- | --- |
| Loading | Show calm skeleton surfaces for theme, ayah, reflection, action. |
| Empty | Offer a guided theme starter such as Tawakkul, Sabr, Shukr, Salah. |
| Error | Keep the check-in usable and offer retry without implying religious guidance was generated. |

## Screen 2 - Companion

Route: `/answer`  
Purpose: Convert a user state or question into a guided evidence package.

### Composition

```text
Sticky RAFIQ nav
Guided prompt: "What are you carrying today?"
Mood/need chips
Situation input
Detected theme preview
Quran evidence first
Tafsir meaning
Sunnah support
Guided answer
Reflection prompt
One action
Save to growth memory
Source trust drawer
```

### Primary Action

`Build my guidance package`

After package is available:

`Save reflection`

### Secondary Actions

- Read full ayah context.
- Explore related theme in Library.
- Open source trust.

### Source Placement

Source trust appears as a collapsed drawer below the guidance package. Raw validation, trace IDs, or internal request details must stay out of the primary flow.

### Empty/Loading/Error States

| State | Behavior |
| --- | --- |
| Empty | Show mood chips and examples, not a blank chatbot box. |
| Loading | Explain that RAFIQ is retrieving evidence, not inventing an answer. |
| No evidence | Gracefully block answer and offer Quran/Library exploration instead. |

## Screen 3 - Quran Reading Room

Route: `/quran/1` and future Quran routes  
Purpose: Read Quran beautifully with contextual understanding.

### Composition

```text
Sticky RAFIQ nav
Surah header with meaning and reading intention
Reading controls: Arabic, translation, transliteration, tafsir
Arabic-first ayah surface
Translation layer
Tafsir layer
Reflection prompt
Related themes
Related Sunnah support
Source trust compact panel
```

### Primary Action

`Reflect on this ayah`

### Secondary Actions

- Continue reading.
- Open related Hadith/Sunnah support.
- Save ayah.
- Explore theme.

### Source Placement

Source and review status sit after content layers as a compact panel. They should be available but not visually louder than Arabic, translation, or tafsir.

### Empty/Loading/Error States

| State | Behavior |
| --- | --- |
| Loading | Preserve reading-room layout with stable skeleton rows. |
| Empty | Show Quran route can still start from Surah Al-Fatihah or theme selection. |
| Error | Let user retry or return to Quran home without exposing internal API details. |

## Screen 4 - Library Knowledge Path

Route: `/search`  
Purpose: Turn search into guided discovery.

### Composition

```text
Sticky RAFIQ nav
Theme/question search entry
Suggested theme paths
RAFIQ framing summary
Quran evidence group
Tafsir context group
Sunnah support group
Themes/topics group
Next actions row: read, ask, reflect, save
Source trust summary
```

### Primary Action

`Explore this path`

### Secondary Actions

- Ask Companion about the theme.
- Open Quran evidence.
- Save path.

### Source Placement

Each evidence group may show one trust chip. Full source details live in a secondary panel.

### Empty/Loading/Error States

| State | Behavior |
| --- | --- |
| Empty | Show curated paths instead of a blank search page. |
| Loading | Show grouped skeletons for Quran, tafsir, Hadith, themes. |
| No result | Offer closest themes and Companion framing. |

## Screen 5 - Sunnah Support

Route: `/hadith` and Hadith detail routes  
Purpose: Help users understand Hadith through reliability, meaning, Quran context, and practice.

### Composition

```text
Sticky RAFIQ nav
Theme-led Sunnah entry
Featured narration or collection path
Teaching summary
Grade/reference band
Arabic and translation reading surface
Related Quran evidence
Practice/reflection prompt
Collection browsing as secondary section
Source trust panel
```

### Primary Action

`Reflect on this teaching`

### Secondary Actions

- Browse collections.
- Open related Quran.
- View source trust.

### Source Placement

Grade and reference are visible near the narration. Deeper verification and import/review state are secondary.

### Empty/Loading/Error States

| State | Behavior |
| --- | --- |
| Empty | Start from themes and trusted collections. |
| Loading | Keep grade/reference area stable. |
| Error | Offer collection browsing or retry without showing backend detail. |

## Screen 6 - Profile And Growth Memory

Route: `/profile`  
Purpose: Make RAFIQ feel continuous without requiring full account complexity before UI acceptance.

### Composition

```text
Sticky RAFIQ nav
Growth summary
Language/preference card
Saved guidance placeholder
Reflection journal placeholder
Action history placeholder
Privacy reassurance
```

### Primary Action

`Review saved guidance`

### Secondary Actions

- Set language.
- Open journal.
- Continue today's guidance.

### Source Placement

Profile does not need source trust as a primary element. Saved guidance cards may carry source chips when content appears.

### Empty/Loading/Error States

| State | Behavior |
| --- | --- |
| Empty | Use inspiring placeholders: saved guidance and reflections will appear here. |
| Loading | Keep privacy and preferences visible. |
| Error | Keep local preference shell usable. |

## Screen 7 - Internal Review Workspace

Route: `/review`  
Purpose: Preserve QA functionality without weakening the product journey.

### Composition

```text
Internal workspace header
Internal navigation only
Queue summary
Review item list
Validation/source status panels
Reviewer actions
Operational notes
```

### Primary Action

`Open next review item`

### Secondary Actions

- Filter queue.
- Open source detail.
- Return to Today.

### Source Placement

Review is allowed to show source and validation status prominently because it is an internal tool, not the normal user experience.

### Visual Boundary

The page must clearly say internal workspace through layout, tone, and navigation. It should not share the emotional first-screen treatment used by Today or Companion.

## CP02 Acceptance Check

| Acceptance Item | Status | Notes |
| --- | --- | --- |
| Each screen has one main user purpose. | Met | Purpose is defined per screen. |
| Each screen has one primary action. | Met | Primary action is explicit for all primary and internal screens. |
| Source/review status has a secondary placement. | Met | Exceptions are limited to Internal Review and Hadith grade/reference. |
| Review is separated from normal product UX. | Met | Review gets an internal workspace treatment. |
| Profile/growth memory has a minimum viable shell. | Met | Profile blueprint covers language, saved guidance, journal, action history, privacy. |

## Implementation Implications For CP03

CP03 should create or reset shared components around these surfaces:

- `RafiqAppShell`
- primary navigation with Today, Companion, Quran, Library, Profile
- internal workspace shell for Review
- guidance package card
- Quran evidence card
- tafsir context card
- Sunnah support card
- reflection composer
- one-action card
- source trust chip and drawer
- grouped knowledge path results
- profile growth-memory cards
- loading, empty, and error states

## Decision

CP02 is complete.

Proceed to CP03 - Shared Design System Reset.

Bismillah.
