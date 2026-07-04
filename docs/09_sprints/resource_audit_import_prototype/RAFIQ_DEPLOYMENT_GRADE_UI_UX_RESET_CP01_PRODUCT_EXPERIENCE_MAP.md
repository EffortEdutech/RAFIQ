# RAFIQ Deployment-Grade UI/UX Reset CP01 Product Experience Map

Date: 2026-06-27  
Sprint: RAFIQ Deployment-Grade UI/UX Reset  
Checkpoint: CP01 - Product Experience Map  
Status: Complete; ready for CP02 screen blueprint

## Purpose

This checkpoint locks RAFIQ's primary product journey before further UI implementation.

The reset sprint must move RAFIQ away from route demos, source-status screens, and content browsing. The product experience must instead feel like a personal Islamic companion that helps a user receive source-grounded guidance, reflect, act, and grow.

## Controlling Product Loop

```text
User state or need
->
Theme detection
->
Quran-first evidence
->
Tafsir explanation
->
Sunnah support
->
Reflection
->
One action
->
Growth memory
```

Every primary screen must support this loop. Screens that do not support the loop are secondary or internal surfaces.

## Product Promise In Five Seconds

When the app opens, RAFIQ must communicate:

> RAFIQ helps me receive guidance, understand Quran and Sunnah, reflect, act, and grow.

The first impression must not be:

- a release-status report;
- an approval dashboard;
- a generic content library;
- a generic chatbot;
- a technical route index.

## Route-To-Journey Map

| Route | Product Surface | Journey Role | Primary User Action | Boundary |
| --- | --- | --- | --- | --- |
| `/` | Today | Begin with daily guidance and one meaningful action. | Check in, read today's Quran evidence, reflect, act. | Primary product |
| `/answer` | Companion | Turn a user state or question into a guided evidence package. | Share need, receive Quran-first guidance, save reflection. | Primary product |
| `/quran/1` | Quran | Read Quran with meaning, tafsir, themes, and Sunnah support. | Read, reflect, continue to related evidence. | Primary product |
| `/search` | Library | Explore a theme or question as a knowledge path. | Search or choose theme, then read/ask/reflect/save. | Primary product |
| `/hadith` | Sunnah Support | Discover Hadith through theme, grade, related Quran, and practice. | Understand what the narration teaches and how to apply it. | Primary product sub-surface |
| `/profile` | Profile | Show continuity: preferences, saved guidance, journal, action history. | Review saved guidance and continue growth. | Primary product |
| `/source-detail` | Source Trust | Explain attribution, release state, and review status. | Verify source context without interrupting reading. | Secondary support |
| `/review` | Internal Review | QA imported content and review queues. | Inspect internal validation and source status. | Internal workspace |
| `/public/*` | Public Gated Shell | Release-filtered public preview and future production path. | Understand public-safe surfaces. | Public/release-gated |

## Navigation Decision

Primary product navigation is:

```text
Today | Companion | Quran | Library | Profile
```

Decision:

- Hadith remains a real product surface, but the top-level framing is Sunnah support inside Library, Quran, and Companion.
- Hadith may remain directly reachable by route and contextual links.
- Hadith must not dominate the main navigation in a way that makes RAFIQ feel like a collection browser.
- Review is removed from normal product navigation and visually separated as internal workspace.
- Source Trust remains available from secondary source links and trust panels, not as a primary user destination.

## User Intent Map

| User Intent | RAFIQ Response | Primary Surface | Supporting Surfaces |
| --- | --- | --- | --- |
| I need something beneficial today. | Daily theme, ayah, reflection prompt, one action. | Today | Quran, Companion, Profile |
| I feel anxious, lost, grateful, or stuck. | Guided package with theme, Quran, tafsir, Sunnah support, reflection, action. | Companion | Quran, Library, Profile |
| I want to read and understand Quran. | Arabic-first reading room with translation, tafsir, reflection, related themes and Hadith. | Quran | Library, Hadith |
| I want evidence about a topic. | Knowledge path grouped by Quran, tafsir, Hadith, themes, and next actions. | Library | Companion, Quran |
| I want to verify a narration. | Grade-aware Sunnah support with related Quran, teaching, and source context. | Hadith | Source Trust, Library |
| I want to continue growing. | Saved guidance, reflection journal placeholder, action history, preferences. | Profile | Today, Companion |
| I need to review content quality. | Internal queue and source-review tooling. | Review | Source Trust |

## Private, Public, And Internal Boundaries

| Mode | Purpose | Content Rule | UI Rule |
| --- | --- | --- | --- |
| Private development | Build and test complete RAFIQ experience. | Use all available imported canonical content regardless of public approval status. | Approval/source status visible but secondary. |
| Public release-gated | Safe public preview and future public launch path. | Only release-approved content may be exposed. | Gated states must feel intentional and calm. |
| Internal review | QA, source validation, approval, and editorial operations. | Internal content and review metadata may be shown to authorized team members. | Visually marked as internal; excluded from normal product navigation. |

## Main Surface Roles

### Today

Today is the emotional first screen. It should deliver immediate value through a daily guidance package:

```text
Greeting -> user state -> today's theme -> Quran evidence -> short meaning -> reflection -> one action
```

### Companion

Companion is the flagship guided package. It must not look like a generic chat window. The experience is:

```text
Need -> theme -> Quran -> tafsir -> Sunnah support -> answer -> reflection -> action -> save
```

### Quran

Quran is the reading room. It should honor Arabic text first, then let the user reveal translation, tafsir, reflection, themes, and related Hadith without making source metadata dominate.

### Library

Library is knowledge path exploration. Search results should be grouped and relational, not a flat technical list.

### Sunnah Support

Hadith should answer: what does this narration teach, how reliable is it, what Quran context supports it, and what action or reflection follows?

### Profile

Profile is the minimum growth memory shell. It should make RAFIQ feel continuous through preferences, saved guidance, journal placeholders, and privacy reassurance without requiring a full account system before UI acceptance.

### Review

Review remains useful for the development team but is no longer part of the normal RAFIQ user journey.

## CP01 Acceptance Check

| Acceptance Item | Status | Notes |
| --- | --- | --- |
| Product Owner can explain RAFIQ's main journey without mentioning backend, approval, or routes. | Met | The controlling product loop is user-state to growth memory. |
| Every primary route has a clear role in the guidance loop. | Met | Today, Companion, Quran, Library, Hadith/Sunnah, and Profile are mapped. |
| Private/public/internal boundaries are explicit. | Met | Boundaries are separated by content rule and UI rule. |
| Decision on Hadith navigation is recorded. | Met | Hadith becomes a primary product sub-surface, not top-level default nav. |
| Review separation is recorded. | Met | Review is internal workspace only. |

## Decision

CP01 is complete.

Proceed to CP02 - High-Fidelity Screen Blueprint.

Bismillah.
