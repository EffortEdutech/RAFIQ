# CP12A Dual Search Product Contract

Date: 2026-07-03  
Sprint: RAFIQ Orchestrator-First Product Sprint  
Checkpoint: CP12A - Dual Search Product Contract  
Status: Pass

## Objective

Define RAFIQ's two search modes as a product contract before more UI rebuilds:

- `Guidance Search`: for user needs, reflection, action, and orchestrated guidance.
- `Source Search`: for research across Quran, translations, tafsir, Hadith, topics/themes, and verification/source records.

The key correction is that guided results must not be dead ends. Quran lens, tafsir context, and Sunnah support must carry explicit routes into deeper study.

## Implemented

### Shared Contract

Updated `@rafiq/shared` with:

- `RafiqSearchMode`;
- `RafiqDeepLinkKind`;
- `RafiqDeepLink`;
- `SourceToGuidanceTarget`;
- `GuidanceResearchSuggestion`;
- `PrivateSourceSearchDomain`;
- `PrivateSourceSearchGroupKey`;
- `PrivateSourceSearchGroup`;
- `PrivateSourceSearchResponse`.

Updated existing contract objects:

- `PrivateSearchDomain` now includes `translation`;
- `PrivateSearchResult.domain` can represent `translation` and `verification`;
- `PrivateSearchResult` can carry `deepLinks` and `openGuidanceTarget`;
- `PrivateSearchResponse.query` can carry `mode`;
- `GuidanceSessionQuranAnchor` can carry `deepLinks` and `researchSuggestions`;
- `GuidanceSessionSunnahSupport` can carry `deepLinks` and `researchSuggestions`;
- `GuidanceSession` can carry top-level `researchSuggestions`;
- `GuidanceSessionSourceMap` can carry `sourceSearchRoute`.

### API Contract Surface

Updated API validation/OpenAPI vocabulary to include:

- `translation`;
- `verification`;
- search mode documentation for `guidance` and `sources`.

Added guidance-session deep-link population:

- Quran anchor links:
  - `Read ayah`;
  - `Open tafsir`;
  - `Search related Quran`;
  - `Find Sunnah support`.
- Sunnah support links:
  - `Open narration`;
  - `Related narrations`;
  - `Check verification`;
  - `Search Quran connection`.
- Session-level research suggestions combine Quran and Sunnah suggestions.
- Source map includes a `sourceSearchRoute`.

### Mobile Contract Surface

Updated private mobile API wrapper with:

- `translation` and `verification` search domains;
- `RafiqDeepLink`;
- `SourceToGuidanceTarget`;
- `PrivateSourceSearchResponse`;
- `searchPrivateSources()` helper that groups existing search results by Quran, Translations, Tafsir, Hadith, Topics, Themes, and Verification.

This gives CP12C a stable UI-facing shape even before CP12B upgrades backend ranking.

## Acceptance Evidence

| Gate | Status | Evidence |
| --- | --- | --- |
| Product clearly separates Guidance Search and Source Search. | Pass | Contract defines `RafiqSearchMode`, `PrivateSourceSearchResponse`, grouped source results, and `GuidanceSession` research suggestions. |
| Every guidance evidence item can open deeper study. | Pass | Quran anchors and Sunnah support now have optional `deepLinks`. |
| Source results can become guided sessions. | Pass | `SourceToGuidanceTarget` and `openGuidanceTarget` are defined in shared/mobile contracts. |
| Quran, translation, tafsir, Hadith, theme/topic, and verification domains are represented. | Pass | Shared domains and grouped source-search response include these resource families. |
| Shared/API build passes. | Pass | `corepack pnpm build` passed. |
| Mobile export passes. | Pass | `corepack pnpm -C apps/mobile exec expo export --platform web` passed. |

## Known Limits

- CP12A defines and partially populates the contract; it does not yet build the `/sources` UI.
- CP12B still needs backend source-search ranking, grouping, Arabic query support, ayah-reference parsing, and Hadith phrase search.
- CP12D still needs the visible UI links in guidance cards.
- Existing source-detail route is still internal/trust-heavy and must be redesigned before it becomes a user-facing research destination.

## Close-Out

- Completed: Dual-search shared contract, API vocabulary updates, guidance deep-link/research fields, mobile source-search response shape, build, and mobile export.
- Next planned: CP12B - Source Search API And Ranking.
- Ad-hoc first: none blocking. Product note: source-detail UI must later be separated into user study detail versus internal source trust detail.
- Checklist update: CP12A marked Pass; TECH-015 added.
- Documentation update: CP12A report created; sprint plan and acceptance checklist updated.
