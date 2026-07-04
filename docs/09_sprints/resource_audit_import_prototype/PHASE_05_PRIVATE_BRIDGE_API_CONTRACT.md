# Phase 5 Private Bridge API Contract

Status: Checkpoint 02 contract  
Scope: Local/private RAFIQ bridge only. This is not the final public API.

## Rule

The private bridge must call `private_api` server-side only. Browser clients
must never receive database credentials and must never query `content`,
`staging`, or `ingest` directly.

Every content response and page must display:

`UNAPPROVED CONTENT - NOT FOR PUBLICATION`

## Pages

| Page | Purpose |
| --- | --- |
| `/` | Local private bridge landing page. |
| `/quran/{surahNumber}` | First private Quran reading page with Quran edition, translation, tafsir, and tafsir display controls. |
| `/hadith` | Source-qualified Hadith collection browser. |
| `/hadith/records` | Hadith record list with collection, language, page-size, previous, and next controls. |
| `/hadith/record/{hadithRecordId}` | Hadith detail page with text versions, grade assertions, and verification claims. |

## Endpoints

### `GET /api/health`

Returns local bridge health.

```json
{
  "ok": true,
  "service": "rafiq-private-bridge"
}
```

### `GET /api/quran/surah/{surahNumber}`

Query parameters:

| Name | Required | Default | Description |
| --- | --- | --- | --- |
| `quran` | No | `qul_uthmani` | Quran text edition key. |
| `translation` | No | `qul-en-sahih-simple` | Translation edition key. |
| `tafsir` | No | `qul-en-mukhtasar` | Tafsir edition key. |

Returns one surah payload from `private_api.get_quran_surah`.

### `GET /api/hadith/collections`

Returns all promoted source-qualified Hadith collections from
`private_api.list_hadith_collections`.

### `GET /api/hadith/records`

Query parameters:

| Name | Required | Default | Description |
| --- | --- | --- | --- |
| `collection` | No | all collections | Source-qualified collection key. |
| `language` | No | any available language | Preferred text-version language. |
| `limit` | No | `20` | Page size, bounded by `private_api`. |
| `offset` | No | `0` | Page offset. |

Returns paginated records from `private_api.list_hadith_records`.

### `GET /api/hadith/record/{hadithRecordId}`

Returns one Hadith record detail from `private_api.get_hadith_record`.

## Replacement Path

When the real NestJS API is scaffolded, preserve this contract shape first,
then move implementation behind typed controllers, DTO validation, OpenAPI,
rate limits, and audit logging.
