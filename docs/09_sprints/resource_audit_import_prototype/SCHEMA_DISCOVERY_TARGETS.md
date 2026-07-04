# Schema Discovery Targets

## Purpose

This document lists the data-shape questions the sprint must answer before the production schema is locked.

## Quran Text

- Which script variant is used?
- Are ayahs keyed by `surah_id` and `ayah_number`?
- Is there a global ayah ID?
- Are basmalah records represented separately?
- Are sajdah markers included?
- Are there exactly 114 surahs and 6236 ayahs?
- What normalization is needed for search?

## Translations

- Is translation ayah-level, word-level, or both?
- Is translator/source name included?
- Is language code ISO-compatible?
- Are footnotes inline, separate, or absent?
- Are ayah IDs compatible with Quran text IDs?
- Are multiple translations from the same language distinguishable?

## Tafsir

- [x] Tafsir may span one or many ayahs and uses a main group record plus ayah pointers.
- [x] Source name and language are resource-level metadata.
- [x] QUL publishes source text, not RAFIQ-ready governed summaries.
- [ ] Inspect authenticated files for footnotes and references.
- [x] Long passages require derived retrieval chunks with source lineage.

## Topics & Themes

- [x] Topics are hierarchical and may have parents and children.
- [ ] Alias representation requires file inspection.
- [x] Topics link directly to ayahs through `verse_key`.
- [x] QUL Ayah Theme resource `62` publishes no confidence field.
- [ ] Topic ID uniqueness and stability require file validation.
- [x] RAFIQ moods require a separate governed mapping layer.

## Hadith

- Which collections are included?
- Are book/chapter/hadith numbers stable?
- Are collection-specific references preserved?
- Is Arabic text included?
- Are translations included?
- Are narrators included?
- Are grades included or external?
- Are duplicate hadiths linked across collections?

## Hadith Grades & Verification

- Who assigned the grade?
- Is the grade per hadith, per chain, or per wording?
- Is source/reference for the grade included?
- Are weak/fabricated records clearly marked?
- Can grades be joined to hadith records reliably?

## Knowledge Graph Links

- Can ayah-topic links be imported directly?
- Can hadith-topic links be imported directly?
- Which links are source-provided vs RAFIQ-generated?
- What confidence values are reliable?
- Which relationships require scholar review?

## Output

Each section should produce:

- fields found
- fields missing
- identifier strategy
- validation rules
- canonical table recommendations
- unresolved risks
