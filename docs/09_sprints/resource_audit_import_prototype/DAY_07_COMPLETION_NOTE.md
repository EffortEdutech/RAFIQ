# Day 7 Completion Note

Status: Closed  
Design and decision date: 2026-06-14

## Completed

- Reconciled import architecture with every audited resource domain.
- Replaced the original lightweight import outline with an immutable
  source/snapshot/object design.
- Defined the future versioned landing-zone layout.
- Preserved all existing raw paths through legacy-path registration.
- Defined Source Registry V2 and its status vocabularies.
- Created the V2 source manifest template.
- Defined import-run identity and idempotency.
- Defined validation findings, transformation events, and record lineage.
- Designed source-shaped staging tables for all audited domains.
- Produced 35-table PostgreSQL reference DDL.
- Defined private `ingest` and `staging` security boundaries.
- Registered the incomplete Hadith raw-object inventory as Day 8 priority.
- Finalized the Day 7 Decision Register.

## Main Findings

1. Source identity, acquired version, and file identity must be separate.
2. Existing manifests overload technical, rights, and publication status.
3. Existing raw paths should remain unchanged.
4. Staging must preserve source structure before canonical mapping.
5. Tafsir requires passages and many-to-many ayah links.
6. Quran scripts, translations, and hadith editions require versioned text
   records.
7. Grade and verification conclusions require attributed claim tables.
8. Quality defects are evidence and must not be silently removed.
9. Raw and staging schemas must not be client accessible.
10. Hadith still requires complete object inventory or an approved aggregate
    generated-subtree policy.

## Final Decisions

See `DAY_07_DECISION_REGISTER.md`.

- Immutable raw storage and source-shaped staging are approved.
- Existing raw paths are grandfathered.
- Reference DDL is approved for prototype work only.
- Final canonical schema and production migrations remain later gates.

## Next Scheduled Batch

Day 8: Import Prototype Loaders And Executable Validation Rules.

First task: complete the Hadith raw-object inventory policy/tool.

