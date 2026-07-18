# CP24-G07 - Internal UI Prototype

Date: 2026-07-14

Status: Complete

Scope: Internal RAFIQ UI screen for inspecting the CP24 private graph-aware retrieval prototype. This checkpoint does not create a public route, does not expose the full resource graph, and does not approve public release.

## 1. Purpose

CP24-G07 makes the CP24-G06 private API response inspectable inside RAFIQ's internal UI.

The screen lets a reviewer inspect:

- fixture-driven private retrieval requests;
- candidate ranking and selection reasons;
- evidence route items;
- validation gate and citation handoff;
- reviewer remediation summary;
- bounded graph/vault ID proof;
- public-release blocked state.

## 2. Internal Route

| Route | File | Purpose |
| --- | --- | --- |
| `/graph-aware-retrieval` | `apps/mobile/app/graph-aware-retrieval.tsx` | CP24 private graph-aware retrieval inspector. |

The internal navigation bar includes a `CP24` link to this route.

## 3. Visible Panels

The G07 screen includes:

- private mode ribbon;
- CP24 fixture selector;
- route and graph proof panel;
- candidate ranking cards;
- selected candidate detail;
- bounded evidence route cards;
- validation handoff summary;
- validation gate grid;
- reviewer remediation cards.

## 4. Private Boundary

The screen calls only:

```text
POST /api/private-content/graph-aware-retrieval/cp24
```

It does not call a public endpoint, does not load the full CP22 graph, and keeps the public boundary fields visible:

- `publicSafeCandidateCount`;
- `publicRouteExposed`;
- `publicReleaseApproved`;
- graph/vault resolved counts.

## 5. Layout Proof

The screen uses responsive wrapping cards with stable basis widths for desktop and narrow web/mobile layouts. The build proof is:

```powershell
corepack pnpm build:mobile:web
```

The build completed successfully after the G07 UI change.

## 6. Verification

Verifier:

```powershell
node scripts\check_cp24_g07_internal_ui_prototype.mjs
```

Inherited proof:

```powershell
node scripts\check_cp24_g06_private_api_prototype.mjs
```

## 7. Acceptance

CP24-G07 is complete when:

- internal CP24 UI panel or route loads;
- query fixture selector is visible;
- candidate ranking and explanation view is visible;
- evidence route and validation handoff view is visible;
- mobile/desktop layout proof is recorded;
- no public route exposes CP24 data.

Status: complete.
