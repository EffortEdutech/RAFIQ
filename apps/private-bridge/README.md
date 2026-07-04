# RAFIQ Private Bridge

Status: Phase 5 private product bridge.

This is a local/private preview server for the first RAFIQ content pages. It
does not expose `content`, `ingest`, or `staging` tables to browser clients.
The server connects to Postgres and calls only the locked-down `private_api`
RPC functions created in Phase 5 Checkpoint 01.

## Run

Recommended after restart:

```powershell
& 'C:\Windows\System32\WindowsPowerShell\v1.0\powershell.exe' -ExecutionPolicy Bypass -File scripts\start_rafiq_local.ps1
```

Health check:

```powershell
& 'C:\Windows\System32\WindowsPowerShell\v1.0\powershell.exe' -ExecutionPolicy Bypass -File scripts\check_rafiq_local.ps1
```

Manual run:

```powershell
$env:PYTHONPATH='C:\tmp\rafiq-phase3-pydeps'
$env:PYTHONIOENCODING='utf-8'
& 'C:\Users\user\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe' apps\private-bridge\server.py
```

Open:

- `http://127.0.0.1:8055/`
- `http://127.0.0.1:8055/quran/1`
- `http://127.0.0.1:8055/hadith`
- `http://127.0.0.1:8055/hadith/records?collection=fawaz-linebyline:bukhari&language=english`

## Private Endpoints

- `GET /api/health`
- `GET /api/quran/surah/{surahNumber}`
- `GET /api/hadith/collections`
- `GET /api/hadith/records?collection={collectionKey}&language={languageCode}&limit={limit}&offset={offset}`
- `GET /api/hadith/record/{hadithRecordId}`

The Quran endpoint also accepts optional query parameters:

- `quran`
- `translation`
- `tafsir`

## Configuration

Environment variables:

- `RAFIQ_DATABASE_URL`, default:
  `postgresql://postgres:postgres@127.0.0.1:55422/postgres`
- `RAFIQ_PRIVATE_BRIDGE_HOST`, default: `127.0.0.1`
- `RAFIQ_PRIVATE_BRIDGE_PORT`, default: `8055`

## Guardrail

Every page renders the private notice returned by `private_api`:

`UNAPPROVED CONTENT - NOT FOR PUBLICATION`

Public release remains blocked until rights, attribution, editorial,
scholar/content, and Product Owner approvals are complete.
