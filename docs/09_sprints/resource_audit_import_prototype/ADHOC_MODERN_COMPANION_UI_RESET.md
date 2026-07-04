# ADHOC Modern Companion UI Reset

Date: 2026-06-30  
Status: Accepted for current status on 2026-06-30

## Product Owner Signal

Product Owner rejected the current UI direction before CP10. The issue is not only responsiveness or technical correctness. RAFIQ still feels too much like a dated dashboard or children's learning app: oversized text, oversized buttons, too many boxes, too much visible scaffolding, and settings mixed into Growth.

## Decision

CP10 cannot proceed until RAFIQ passes a modern companion UI inspection. Technical QA remains useful, but technical pass does not equal product acceptance.

## Modern Companion Standard

- Calm, current, mobile-first interface with restrained typography and no oversized marketing-style text.
- Reading and guidance density must improve: less empty box space, more delivered Quran/Sunnah/guidance value.
- Profile/Growth must be memory and continuity only.
- Reading preferences, language, and Arabic font selection must live in a dedicated settings surface.
- Bottom navigation must feel like a mature companion device interface, not a set of large colorful classroom buttons.
- Quran display must stay reading-first, with guidance available without interrupting reading.
- Hadith display must present verification, source, and practice clearly without decorative clutter.

## Implemented In This Correction

- Reduced shared typography scale, radii, spacing, and color loudness in the mobile companion design system.
- Flattened the companion shell and bottom navigation so they read as a device UI, not a card-heavy web dashboard.
- Removed reading preferences and Arabic font controls from Growth.
- Added `/settings` as a dedicated Reading Settings screen for language, reflection rhythm, guidance lens, and Quran Arabic font.
- Added a global top gear action that opens `/settings`.
- Profile no longer links to or displays Reading Settings; Growth remains focused on resume, saved guidance, reflection, and action completion.
- Rebuilt Today controls into a compact segmented daily-need selector with smaller actions and quieter Quran/guidance panels.
- Rebuilt Ask and Learn with tighter inputs, smaller starter rows, reduced button prominence, and less bright paneling.
- Rebuilt Quran Reading with reader-first Arabic display, compact reading/layer controls, smaller reflection/action areas, and quieter source/guidance layers.
- Rebuilt Hadith/Sunnah landing into a vertical verification reading surface instead of theme-card grid.
- Tightened Hadith detail, Growth, and Settings so narration, memory, and configuration read as mature utility surfaces.
- Verified `corepack pnpm build`, `corepack pnpm -C apps/mobile exec expo export --platform web`, and `scripts/check_phase5_runtime.ps1`.
- Added `scripts/serve_mobile_dist.mjs` so `localhost:8057` can serve the verified mobile export when Expo dev server crashes during dependency doctor/startup.

## Remaining Before CP10

- Quran reading, Quran learning, tafsir learning, and Hadith learning need deeper product updates in later checkpoints.
- CP10 should now review the orchestration engine quality, not only UI readiness.
