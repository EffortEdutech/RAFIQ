# Resource Decision Matrix

Status: Finalized  
Review date: 2026-06-14
Decision date: 2026-06-14

Subsequent implementation note: CR-060 was resolved on 2026-06-15; canonical
promotion tooling may now proceed in the private environment.

Decisions distinguish complete private-platform use from public release.
Pending rights or content approval does not remove technically usable content
from private import, integration, search, retrieval, rendering, or AI testing.

| Source Group | Audited Sources | Technical Status | Private Platform Decision | Public Release Decision | Main Conditions |
| --- | --- | --- | --- | --- | --- |
| Quran text | QUL 86/88; Tanzil Uthmani v1.1 | Complete; 6,236 ayahs and source variants validated | GO: import all validated editions | NO-GO pending exact edition rights, attribution, script selection, and content approval | Preserve source text and Bismillah behavior; no silent cross-source replacement |
| Quran metadata | QUL 63-70; Tanzil metadata v1.0 | Complete; surahs, ayahs, partitions, and differences validated | GO: import all source-qualified metadata | CONDITIONAL NO-GO pending metadata rights and approved display scheme | Keep partition/layout schemes separate |
| English translation | QUL Saheeh 193; Tanzil `en.sahih` | Complete; 6,236 keys and QUL variants validated | GO: import every edition and variant | NO-GO pending translator/publisher permission and attribution | Tagged text is lossless; chunks remain derived retrieval data |
| Malay translation | QUL 292; Tanzil `ms.basmeih` | Complete; 6,236 keys validated | GO: import both source editions | NO-GO pending rights and Basmeih/Basamia attribution resolution | Use Basmeih as candidate; preserve QUL alias |
| Indonesian translation | Tanzil `id.indonesian` | Complete optional audit; 6,236 keys validated | GO: optional private import | NO-GO pending source, rights, attribution, and product priority | Not committed as first public language |
| Tafsir | QUL 266, 35, 308 | Complete; JSON/SQLite equivalence and grouped passages validated | GO: complete private import | NO-GO pending provenance, rights, attribution, editorial, and scholar review | Preserve passages/pointers; retain 59 As-Sa'di blanks |
| Topics and concepts | QUL 45 | Complete; 2,512 topics and 30,687 ayah links validated | GO: complete private import | NO-GO pending composite provenance, rights, and governed mapping review | Keep source taxonomy separate from RAFIQ themes |
| Ayah themes | QUL 62 | Complete with findings; 2,098 rows, 1,049 unique groups, 36 gaps | GO: import raw and derived deduplicated staging | NO-GO pending rights and editorial mapping approval | Never invent confidence or missing themes |
| Hadith collections | 24 acquired snapshots across official, collection, multilingual, research, verification, and quarantined groups | Direct acquisition complete; 566 principals profiled, 563 parsed | GO: import every technically usable source with risk labels | NO-GO per source/version until provenance, rights, attribution, reliability, and content review pass | Source-qualified identity; quarantined sources remain private |
| Hadith grades | Fawaz, MeeAtif, LK, Abdullah Naseer, collection metadata | Complete technical audit; 153,622 assertions reviewed in aggregate | GO: import as attributed assertions | NO-GO for public summaries until authority, scope, normalization, and approval review | Preserve conflicts; exclude unreliable Abdullah status from authority |
| Hadith verification | SemakHadis archives; Dorar candidate | Local schema/sample audit complete; live/authorized coverage incomplete | GO: private adapter and workflow import | NO-GO for completeness or public authority claims | Continue official export/API requests; preserve classification/workflow separation |
| Similar ayahs | QUL candidate | Not audited in this sprint | DEFER from first import batch | NO-GO | Acquire and audit before use |
| Audio, morphology, grammar, layouts, fonts | Deferred groups | Not audited | DEFER | NO-GO | Separate future acquisition sprint |

## Overall Decisions

| Gate | Result |
| --- | --- |
| Complete private content acquisition | GO |
| Complete private staging import | GO |
| Canonical promotion tooling | GO, after CR-060 migration execution gate |
| Private search, retrieval, rendering, and AI/RAG testing | GO |
| Public content deployment | NO-GO |
| Public AI/RAG grounded in pending sources | NO-GO |
| Public API/export redistribution | NO-GO |

## Public Release Requirements

Each exact source snapshot intended for public exposure requires:

- verified provenance and permitted use;
- approved attribution;
- technical validation and canonical mapping;
- editorial and scholar/content review where applicable;
- approved display and warning policy;
- Product Owner approval;
- tested public-release filtering.
