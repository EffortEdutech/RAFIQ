# RAFIQ Mobile

Status: Phase 5 Checkpoint 03 scaffold.

This is the future Expo app. It is scaffolded around the private content
contract but is not yet installed or activated.

Initial routes:

- `/`
- `/quran/[surahNumber]`
- `/hadith`

Run from the workspace root:

```powershell
& 'C:\Windows\System32\WindowsPowerShell\v1.0\powershell.exe' -ExecutionPolicy Bypass -File scripts\start_phase5_apps.ps1
```

Then open:

- `http://127.0.0.1:8057/`
- `http://127.0.0.1:8057/quran/1`
- `http://127.0.0.1:8057/hadith`

The Expo web preview consumes the NestJS API at `http://127.0.0.1:8056`.
