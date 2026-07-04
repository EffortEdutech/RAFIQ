# RAFIQ UI/UX Delivery Checklist V1

Date: 2026-06-25  
Status: Active checklist for CP07.6 and CP08

## UX Foundation

| ID | Item | Status | Evidence |
| --- | --- | --- | --- |
| UXD-001 | Confirm master UI/UX blueprint exists. | Done | `RAFIQ_UI_UX_MASTER_BLUEPRINT_V1.md` |
| UXD-002 | Confirm private full-content mode is the primary development experience. | Done | Product Owner direction recorded in sprint plan and decision register. |
| UXD-003 | Confirm public approval gates do not define the main private UX. | Done | `RAFIQ_UI_UX_MASTER_BLUEPRINT_V1.md` |
| UXD-004 | Approve CP07.6 before CP08. | Pending | Product Owner approval required. |

## Signature Experience

| ID | Item | Status | Evidence |
| --- | --- | --- | --- |
| UXD-010 | Define signature RAFIQ journey. | Done | Master blueprint |
| UXD-011 | Design Home as companion entry, not dashboard. | Done | CP07.6 home path and intent cards |
| UXD-012 | Design Ask as evidence-led guidance workflow. | Done | CP07.6 evidence-before-answer flow |
| UXD-013 | Design Quran as beautiful reading room. | Done | CP07.6 Quran reading-room layer |
| UXD-014 | Design Hadith as curated source-aware library. | Done | CP07.6 Sunnah library layer |
| UXD-015 | Design Search as grouped knowledge discovery. | Done | CP07.6 grouped private search |

## Visual Quality

| ID | Item | Status | Evidence |
| --- | --- | --- | --- |
| UXD-020 | Reduce warning/status dominance. | Done | `PrivateModeRibbon` replaces dominant notices on primary private routes |
| UXD-021 | Remove raw IDs/traces from primary user view. | In Review | Ask still keeps technical details in internal review sections; CP08 should confirm no raw IDs dominate primary view. |
| UXD-022 | Improve Arabic reading hierarchy. | Done | Quran reading-room layer and ayah/reflection cards |
| UXD-023 | Ensure mobile layout feels first-class. | In Review | 390px browser verification passed for Home and Quran; CP08 should broaden full-route QA. |
| UXD-024 | Ensure desktop layout feels composed, not stacked. | Done | Desktop browser route verification passed for Home, Search, Quran, Hadith, Ask. |

## Delivery Gates

| ID | Item | Status | Evidence |
| --- | --- | --- | --- |
| UXD-030 | Browser verify Home, Search, Quran, Hadith, Ask. | Done | CP07.6 browser verification notes |
| UXD-031 | Product Owner review of visual direction. | Pending | CP07.6 |
| UXD-032 | CP08 deployment QA may proceed. | Blocked | Requires UXD-004 and CP07.6 completion |
