# Phase 6 Checkpoint 04: Product Owner Public-Scope Approval Checklist

Date: 2026-06-19  
Status: Prepared For Product Owner Review  
Scope: Exact public-release scope approval for RAFIQ content, public APIs, public pages, search, and AI/RAG retrieval.

## Decision Rule

Private platform use and public release are separate decisions.

The Product Owner may approve public release only for exact source versions that pass all gates below:

| Gate | Required Result |
| --- | --- |
| G1 Provenance | Original work, edition, author/translator/editor, publisher or maintainer, and upstream chain documented |
| G2 Rights | Licence or written permission covers intended RAFIQ public uses |
| G3 Attribution | Exact wording, links, notices, and placement approved |
| G4 Technical | File integrity, counts, canonical mapping, rendering, and search/index behavior verified |
| G5 Editorial | Display edition, formatting, footnotes, warnings, and product policy approved |
| G6 Scholar/content | Qualified reviewer approves religious accuracy and usage context |
| G7 Product Owner | Product Owner approves the exact public scope and date |

If any gate is `Open`, `Partial`, `Unclear`, `Rejected`, or `Deferred`, the item remains private-only.

## Public Scope Summary

Current recommendation:

| Area | Public Scope Decision | Reason |
| --- | --- | --- |
| Quran Arabic display | NO-GO | Display script and rights/attribution approval not complete |
| Quran metadata | NO-GO | Public display scheme and metadata rights not approved |
| English translation | NO-GO | Saheeh International production permission/attribution not complete |
| Malay translation | NO-GO | Basmeih/Basamia attribution and rights not resolved |
| Indonesian translation | NO-GO | Not selected for first public scope and rights not approved |
| Tafsir | NO-GO | Provenance, rights, editorial, and scholar review not complete |
| Topics/concepts | NO-GO | Composite provenance and governed mapping approval not complete |
| Ayah themes | NO-GO | Rights, editorial mapping, duplicates, gaps, and malformed terms not public-approved |
| Hadith collections | NO-GO | Per-source rights, provenance, reliability, and scholar/content approval not complete |
| Hadith grades | NO-GO | Authority, scope, conflict handling, and public summary rules not approved |
| Hadith verification | NO-GO | Authorized coverage and public authority claims not approved |
| Public search | DESIGN GO / CONTENT NO-GO | Release-filtered public search exists; returns zero pending content |
| Public AI/RAG answer retrieval | DESIGN GO / ANSWER NO-GO | Public answer contract exists; blocks without approved public evidence |
| Public model execution | NO-GO | No public evidence scope or model approval yet |

Product Owner current checkpoint decision:

- [ ] Approve a limited public beta scope
- [ ] Approve public search over selected approved content
- [ ] Approve public AI/RAG answers over selected approved content
- [x] Keep all current content private-only until approval packs pass

## Source-Version Approval Checklist

Complete one row per exact source snapshot, edition, or collection intended for public release.

| Candidate | Exact Source Version | Public Use Requested | G1 | G2 | G3 | G4 | G5 | G6 | G7 | Decision |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| QUL 86 | QPC Hafs Quran script | Quran Arabic display/search | Open | Open | Open | Passed | Open | Open | Open | Blocked |
| QUL 88 | Uthmani Quran script | Quran Arabic display/search | Open | Open | Open | Passed | Open | Open | Open | Blocked |
| QUL/Tanzil 193 | Saheeh International English translation | Translation display/search/RAG evidence | Partial | Open | Open | Passed | Open | Open | Open | Blocked |
| QUL/Tanzil 292 | Malay Basmeih/Basamia translation | Translation display/search/RAG evidence | Partial | Open | Open | Passed | Open | Open | Open | Blocked |
| Tanzil `id.indonesian` | Indonesian translation | Optional translation display/search | Open | Open | Open | Passed | Deferred | Open | Open | Blocked |
| QUL 266 | English Al-Mukhtasar tafsir | Tafsir display/search/RAG evidence | Open | Open | Open | Passed | Open | Open | Open | Blocked |
| QUL 35 | English Ibn Kathir tafsir | Tafsir display/search/RAG evidence | Open | Open | Open | Passed | Open | Open | Open | Blocked |
| QUL 308 | Arabic As-Sa'di tafsir | Tafsir display/search/RAG evidence | Open | Open | Open | Passed With Findings | Open | Open | Open | Blocked |
| QUL 45 | Topics and Concepts | Topic display/search/RAG evidence | Open | Open | Open | Passed | Open | Open | Open | Blocked |
| QUL 62 | Ayah Themes | Theme display/search/RAG evidence | Open | Open | Open | Passed With Findings | Open | Open | Open | Blocked |
| Fawaz Hadith API | Pinned branch `1` | Hadith display/search/RAG evidence | Open | Open | Open | Passed With Gaps | Open | Open | Open | Blocked |
| Sunnah.com official API/export | TBD authorized export | Hadith display/search/RAG evidence | Open | Open | Open | Not Started | Open | Open | Open | Blocked |
| SemakHadis | TBD official live export | Malay verification display/search/RAG evidence | Open | Open | Open | Not Started | Open | Open | Open | Blocked |
| Dorar | TBD authorized access/export | Hadith verification display/search/RAG evidence | Open | Open | Open | Not Started | Open | Open | Open | Blocked |

Allowed gate values: `Open`, `Partial`, `Passed`, `Passed With Conditions`, `Passed With Findings`, `Rejected`, `Deferred`, `Not Applicable`.

## Public Feature Approval Checklist

| Feature | Requires Approved Content | Requires Display Policy | Requires Attribution Placement | Requires Reviewer Signoff | Current Decision |
| --- | --- | --- | --- | --- | --- |
| Public Quran reader | Yes | Yes | Yes | Scholar/content | Blocked |
| Public translation display | Yes | Yes | Yes | Editorial + scholar/content | Blocked |
| Public tafsir display | Yes | Yes | Yes | Editorial + scholar/content | Blocked |
| Public topics/themes display | Yes | Yes | Yes | Editorial + scholar/content | Blocked |
| Public Hadith list/detail | Yes | Yes | Yes | Hadith reviewer/scholar | Blocked |
| Public search | Yes | Yes | Yes | Product + technical | Design approved; content blocked |
| Public answer draft | Yes | Yes | Yes | Product + scholar/content | Design approved; answer blocked |
| Public guided-answer prompt | Yes | Yes | Yes | Product + scholar/content | Design approved; model blocked |
| Public API/export redistribution | Explicit export rights | Yes | Yes | Product + legal/content | Blocked |

## Intended Public Uses To Approve

For each source approved for public release, explicitly mark which uses are allowed.

- [ ] public website display
- [ ] public mobile application display
- [ ] authenticated-user display
- [ ] unauthenticated-user display
- [ ] server-side storage and backup
- [ ] search indexing and retrieval
- [ ] AI/RAG evidence retrieval
- [ ] public AI answer summaries
- [ ] offline or cached application copies
- [ ] footnote and metadata display
- [ ] formatting that does not alter wording
- [ ] derived search metadata
- [ ] embeddings
- [ ] summaries
- [ ] API/export redistribution

Any unchecked use is not approved.

## Required Evidence Before Product Owner Approval

Attach or link evidence for each approved source:

- official source URL;
- exact source snapshot or edition key;
- licence or written permission;
- permitted public and commercial uses;
- required attribution wording;
- required links/notices;
- checksum or integrity report;
- technical validation report;
- editorial display decision;
- scholar/content review record;
- expiry, renewal, or update obligations;
- rollback/takedown contact and workflow.

## Public AI/RAG Approval Conditions

Public AI/RAG answers may be approved only when all conditions pass:

- [ ] every retrieved evidence item is release-approved;
- [ ] public search returns only `public_api.release_approved_entities`;
- [ ] evidence citations are mandatory;
- [ ] Quran translations are never generated by AI;
- [ ] tafsir is never inferred beyond retrieved approved tafsir;
- [ ] Hadith evidence includes source, collection, reference, and grade/verification status where applicable;
- [ ] halal/haram, fatwa, medical, legal, crisis, abuse, and emergency queries route to escalation/refusal policy;
- [ ] model provider, model name, prompts, and validation rules are approved;
- [ ] post-generation citation enforcement is enabled;
- [ ] reviewer/takedown workflow exists.

Current AI/RAG decision:

- [x] Public retrieval contract approved
- [x] Public guided-answer contract approved
- [ ] Public evidence scope approved
- [ ] Public answer generation approved
- [ ] Public model execution approved

## Product Owner Decision Record

Checkpoint 04 decision:

- [x] Checklist prepared
- [ ] Limited public beta scope approved
- [ ] Public content source list approved
- [ ] Public search over approved content approved
- [ ] Public AI/RAG answer retrieval approved
- [ ] Public model execution approved
- [x] Public launch remains NO-GO

Product Owner:

Decision date:

Approved public scope version:

Conditions:

Signature/record:

## Next Action

Proceed to Checkpoint 05: Public Attribution Placement And Rollback Workflow.

The next checkpoint should define where attribution appears in public pages, search results, answer citations, API responses, and what happens when a source approval is revoked or corrected.
