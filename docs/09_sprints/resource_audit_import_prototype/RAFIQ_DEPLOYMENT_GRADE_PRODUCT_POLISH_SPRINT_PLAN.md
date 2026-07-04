# RAFIQ Deployment-Grade Product Polish Sprint Plan

Date prepared: 2026-06-25  
Sprint status: Active; CP07.6 implemented; Product Owner visual approval pending  
Primary objective: Make RAFIQ feel deployment-ready as a product, regardless of whether public content approval is complete.

## Product Owner Direction

The previous plan over-focused on stakeholder/demo/approval process while RAFIQ still did not clearly show why it exists.

The new priority is product delivery quality:

- RAFIQ must communicate its objective immediately;
- UI/UX must feel mature enough for deployment;
- presentation must feel intentional, not low-level;
- approval gates must not make the product feel empty or unfinished;
- public content can remain gated, but the product experience must be complete.

## Sprint Principle

Content approval controls public content visibility.

It must not control whether RAFIQ looks like a serious product.

It also must not restrict the development team's internal RAFIQ environment.

## Delivery Status Clarification

Product Owner delivery direction:

- the development team must have a fully running RAFIQ with all available imported content;
- private/internal development mode must expose all technically usable canonical content regardless of rights, attribution, editorial, scholar/content, or public-release approval status;
- approval status must remain visible as metadata, warnings, labels, review queues, and source-trust indicators;
- approval status must not remove content from development workflows, private search, private reading, private guided answer testing, or internal QA;
- only public release, public indexing, public APIs, public model execution, and public deployment scope remain blocked by approval gates.

In short: RAFIQ must be complete for internal development and testing first. Public approval decides what can be published later.

## Checkpoint Plan

| Checkpoint | Title | Output | Status |
| --- | --- | --- | --- |
| CP01 | Product Positioning And Landing Page Upgrade | Rewrite first impression and upgrade home/shell presentation. | Done |
| CP02 | Deployment-Grade Visual System Upgrade | Improve typography, spacing, hierarchy, color depth, cards, and responsive layout. | Done |
| CP03 | Product Navigation And Information Architecture | Make user paths clearer: Search, Ask, Read Quran, Read Hadith, Sources, About RAFIQ. | Done |
| CP04 | Search Experience Polish | Make search feel useful even with gated content; add guided examples and expected experience. | Done |
| CP05 | Guided Answer Experience Polish | Make the answer page feel like RAFIQ's core feature, not a blocked API state. | Done |
| CP06 | Quran And Hadith Reading Experience Polish | Upgrade reading previews into deployment-grade read surfaces with complete controls and sample-safe placeholders. | Done |
| CP07 | Source Trust And Attribution Experience Polish | Make source status feel like a trust feature, not an admin detail. | Done |
| CP07.5 | RAFIQ Dream UX Recovery | Correct the product direction by upgrading the private full-content routes into the primary RAFIQ workspace experience. | Done |
| CP07.6 | Signature RAFIQ Experience Layer | Use the UI/UX master blueprint to design and implement RAFIQ's distinctive companion experience before deployment QA. | Implemented; PO Review Pending |
| CP08 | Deployment Readiness QA | Verify the full-content private/dev RAFIQ plus public release-gated shell: build/export/runtime/browser QA, mobile polish, no raw technical artifacts, deployment-readiness checklist. | Not Started |
| CP09 | Sprint Review And Next Go/No-Go | Decide if RAFIQ is ready for deployment-prep, further polish, or blocked remediation. | Not Started |

## Definition Of Deployment-Grade

RAFIQ is deployment-grade when:

- the first screen clearly explains the product objective;
- pages feel like a coherent product, not separate technical proofs;
- empty states still communicate value;
- content gating feels professional and intentional;
- UI copy is user-facing, not internal engineering language;
- mobile layout feels first-class;
- all public routes can be shown without apology;
- build/export/runtime checks pass.

## Current Boundary

Public real-content release remains blocked until approval gates pass.

Private/internal RAFIQ development and QA must proceed with all available imported content, regardless of approval status.

Public-facing product polish may proceed fully using:

- safe static product copy;
- release-gated states;
- private-preview labels where needed;
- approved fixture/demo patterns;
- no real unapproved public content exposure.
