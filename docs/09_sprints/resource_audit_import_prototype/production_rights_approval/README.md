# Production Rights And Approval Packs

Status: In Progress  
Started: 2026-06-12

## Purpose

These packs convert a technically validated QUL resource into an auditable
production decision. QUL reliability and file integrity are already accepted.
The remaining work is to establish upstream identity, usage rights,
attribution, product selection, and religious/content approval.

This is an evidence workflow, not legal advice. Ambiguous or commercially
important permissions should be reviewed by qualified counsel before launch.

## Initial Scope

| Pack | Resource | Content | Current decision |
| --- | --- | --- | --- |
| `PRA-QUL-086` | QUL `86` | QPC Hafs Quran script | Technical pass; rights and selection open |
| `PRA-QUL-088` | QUL `88` | Uthmani Quran script | Technical pass; rights and selection open |
| `PRA-QUL-193` | QUL `193` | Saheeh International English translation | Technical pass; rights and edition selection open |
| `PRA-QUL-292` | QUL `292` | Malay Basamia/Basmeih translation | Technical pass; rights and attribution open |

## Approval Gates

Every pack must pass all seven gates:

| Gate | Required result |
| --- | --- |
| G1 Provenance | Original work, author/translator, publisher or maintainer, edition, and QUL upstream chain documented |
| G2 Rights | Licence or written permission covers RAFIQ's intended production uses |
| G3 Attribution | Exact credit, links, notices, and placement requirements approved |
| G4 Technical | Files, checksums, counts, identifiers, and rendering/import checks passed |
| G5 Editorial | One source edition and presentation policy selected without altering raw text |
| G6 Scholar/content | Qualified reviewer approves religious accuracy and usage context |
| G7 Product approval | Product Owner records final production decision and date |

Failure or uncertainty at G1-G3 keeps the resource out of production. A
conditional or unanswered permission request is not approval.

## Execution Sequence

1. Send the QUL provenance/licence request using
   `templates/PERMISSION_REQUEST_TEMPLATE.md`.
2. Save the complete response, attachments, sender identity, and date in the
   relevant pack evidence section.
3. If QUL is not the rights holder, contact the original publisher or rights
   holder identified by QUL.
4. Complete the rights-use matrix. Every intended use must be explicitly
   allowed or clearly covered by the licence.
5. Approve the final attribution statement.
6. Conduct editorial and scholar/content review.
7. Record the Product Owner decision using
   `templates/APPROVAL_RECORD_TEMPLATE.md`.
8. Update the source manifest and licensing register only after G1-G7 pass.

## Intended RAFIQ Uses To Authorize

- commercial mobile and web application display
- server-side storage and backup
- search indexing and retrieval
- delivery to authenticated and unauthenticated users
- offline or cached application copies, if planned
- display of footnotes and associated metadata
- internal formatting that does not change the wording
- derived search metadata, embeddings, or summaries where applicable
- redistribution through exports or APIs only if separately authorized

Do not assume permission for one use grants permission for the others.

## Evidence Standard

Accept:

- an applicable published licence from the rights holder
- a signed agreement
- an email or support response from an authorized representative that clearly
  identifies the resource and permitted uses
- official publisher documentation identifying public-domain status

Do not accept:

- QUL availability by itself
- another application's use of the same content
- an unattributed repository copy
- verbal approval without a retained record
- a general commercial-use statement that says resource-specific terms apply
  but does not identify those terms

