$ErrorActionPreference = "Stop"

$Workspace = Resolve-Path (Join-Path $PSScriptRoot "..")
$BundledPython = "C:\Users\user\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe"
$Python = if ($env:RAFIQ_PYTHON) {
  $env:RAFIQ_PYTHON
} elseif (Get-Command python -ErrorAction SilentlyContinue) {
  (Get-Command python).Source
} elseif (Test-Path $BundledPython) {
  $BundledPython
} else {
  throw "Python runtime not found. Set RAFIQ_PYTHON to a valid python.exe path."
}

& $Python (Join-Path $Workspace "scripts\verify_phase5_app_scaffold.py")
