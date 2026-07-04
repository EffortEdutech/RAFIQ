# RAFIQ API

Status: Phase 5 Checkpoint 05 hardened private API.

This app is the future NestJS API layer. It must consume private canonical
content only through the `private_api` database RPC contract.

## Rules

- Use server-side database credentials only.
- Do not expose `content`, `ingest`, or `staging` schemas directly.
- Preserve the private notice in every content response.
- Public APIs must remain blocked until Phase 6 approval gates pass.

## Initial Modules

- `PrivateContentModule`
- `PrivateContentController`
- `PrivateContentService`
- `PrivateContentRepository`
- `HealthModule`

## Hardening Surface

- DTO validation rejects invalid surah numbers, UUIDs, and pagination values.
- Errors use a standard `{ error: { code, message, details, requestId } }` shape.
- Every request receives an `x-request-id` response header and is logged server-side.
- OpenAPI is generated at `/api/openapi.json` and browsable at `/api/docs`.

## Local Target

Run from the workspace root:

```powershell
& 'C:\Windows\System32\WindowsPowerShell\v1.0\powershell.exe' -ExecutionPolicy Bypass -File scripts\start_phase5_apps.ps1
```

Then open:

- `http://127.0.0.1:8056/api/private-content/quran/surah/1`
- `http://127.0.0.1:8056/api/private-content/hadith/collections`
- `http://127.0.0.1:8056/api/health`
- `http://127.0.0.1:8056/api/docs`

The temporary Python bridge can remain available during transition, but the
Checkpoint 05 runtime now verifies this NestJS API directly. Bridge parity is
checked by `check:bridge-parity`; after parity passes, the Python bridge is
diagnostic-only.
