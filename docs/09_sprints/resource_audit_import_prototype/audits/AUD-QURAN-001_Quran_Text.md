# AUD-QURAN-001: Quran Text Sources

Status: Finalized
Audit date: 2026-06-10
Decision date: 2026-06-11

Controlling decision:

`../DAY_02_DECISION_REGISTER.md`

## Scope

Candidate sources:

- Tanzil Quran Text
- QUL Quran Script resources

## Official Sources

### Tanzil

- Download page: https://tanzil.net/download/
- License: https://tanzil.net/docs/Text_License
- Updates: https://tanzil.net/updates/

Tanzil states that Quran text version 1.1 was released on 2021-02-12. The text is licensed under Creative Commons Attribution 3.0 with additional clear terms: verbatim copying/distribution is allowed, changing the text is not allowed, Tanzil attribution and a link are required, and the copyright block must remain in substantial derived files.

### QUL

- Resource directory: https://qul.tarteel.ai/resources/quran-script
- Uthmani ayah-by-ayah: https://qul.tarteel.ai/resources/quran-script/88
- QPC Hafs ayah-by-ayah: https://qul.tarteel.ai/resources/quran-script/86
- FAQ: https://qul.tarteel.ai/faq
- Credits: https://qul.tarteel.ai/credits
- Uthmani copyright page: https://qul.tarteel.ai/resources/88/copyright
- QPC Hafs copyright page: https://qul.tarteel.ai/resources/86/copyright

QUL lists 28 Quran script resources and provides JSON/SQLite export options. Its FAQ states commercial use is possible but each resource's license must be checked. QUL credits say most resources were created or curated by community contributors rather than Tarteel.

The resource-specific copyright pages for QUL Uthmani resource `88` and QPC Hafs resource `86` currently state that QUL does not have copyright information for those resources.

## Access Findings

| Source | Access Result |
| --- | --- |
| Tanzil Uthmani text | Directly downloaded successfully. |
| QUL schema/preview | Publicly accessible. |
| QUL JSON/SQLite file | Authenticated JSON and SQLite acquired and validated on 2026-06-12. |

QUL file-level inspection is complete for resources `88` and `86`.

## Tanzil Raw Sample

Stored at:

`data/raw/quran/tanzil/quran-uthmani-with-ayah-numbers.txt`

Manifest:

`data/manifests/tanzil-quran-uthmani-v1.1.json`

SHA-256:

`18C719BB3BA26D32EF457F40DAD77CD28C4C5A34156833E26A8E5FCFDD246FB1`

## Tanzil Structure

Data rows use:

```text
surah_number|ayah_number|text
```

Validation results:

| Check | Result |
| --- | --- |
| Quran rows | 6236 |
| Unique verse keys | 6236 |
| Duplicate verse keys | 0 |
| Surahs represented | 114 |
| First key | `1:1` |
| Last key | `114:6` |
| Copyright block present | Yes |

## QUL Published Structure

QUL's Uthmani sample is keyed by `verse_key`:

```json
{
  "1:1": {
    "verse_key": "1:1",
    "text": "...",
    "script_type": "text_uthmani",
    "font_family": "me_quran",
    "page_number": 1,
    "juz_number": 1,
    "hizb_number": 1
  }
}
```

QUL's QPC Hafs resource uses the same broad structure with `script_type: text_qpc_hafs` and requires the QPC Hafs font for intended rendering.

## Bismillah Representation Finding

This is a build-critical difference.

The downloaded Tanzil file includes Bismillah as a prefix in the first ayah of most surahs:

- `2:1` includes Bismillah before `Alif Lam Mim`.
- `112:1` includes Bismillah before the ayah.
- `9:1` does not include Bismillah.

QUL's public ayah text views show:

- `2:1` without Bismillah
- `112:1` without Bismillah
- `9:1` without Bismillah

QUL separately exposes a `bismillah_pre` field in surah metadata.

## Risks

| Risk | Finding |
| --- | --- |
| License | Tanzil text terms are clear. QUL resources `88` and `86` have no copyright information on their QUL copyright pages, so production use is blocked pending provenance/permission review. |
| Modification | Stripping Tanzil's Bismillah prefix from stored canonical text may conflict with the no-change requirement. |
| Rendering | QUL QPC Hafs depends on a matching font. Mobile font behavior needs later verification. |
| Provenance | QUL is a distributor/manager for community resources; source provenance must be recorded per script. |
| Access | QUL JSON/SQLite files require sign-in at the time of audit. |

## Provisional Recommendation

1. Use Tanzil Uthmani v1.1 as the initial integrity/reference baseline because its provenance, version, license, and direct download are clear.
2. Preserve Tanzil raw text unchanged.
3. Do not yet declare Tanzil's downloaded representation as RAFIQ's final display text because of Bismillah-prefix behavior.
4. Preserve the validated QUL Uthmani/QPC Hafs files as source-specific variants.
5. Store source-specific text variants rather than overwriting one with another.

Suggested canonical model:

- stable identity: `surah_number + ayah_number`
- generated convenience key: `verse_key`
- source-specific script records: `quran_script_texts`
- fields: `source_id`, `script_type`, `font_family`, `text_verbatim`, `includes_bismillah_prefix`

## Decision

`Tanzil: Approve for Staging Only`

`QUL Quran Scripts: Blocked for Production; Staging Schema Review Only`

Production display source remains undecided pending provenance and license review, script selection, rendering verification, and scholar/content approval.

## File Validation Amendment

See `VAL-QUL-001_Quran_Scripts_Metadata.md`.

- Both QUL script JSON/SQLite pairs match exactly.
- Both contain 6,236 complete canonical keys.
- QUL and Tanzil differ in Bismillah representation and script orthography.
- File validation is complete; production rights and final display-script approval remain open.
