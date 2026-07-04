param(
  [switch]$SkipSupabase,
  [switch]$ForegroundBridge
)

$ErrorActionPreference = "Stop"

$Workspace = Resolve-Path (Join-Path $PSScriptRoot "..")
$Python = "C:\Users\user\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe"
$BridgePort = if ($env:RAFIQ_PRIVATE_BRIDGE_PORT) { [int]$env:RAFIQ_PRIVATE_BRIDGE_PORT } else { 8055 }
$BridgeHost = if ($env:RAFIQ_PRIVATE_BRIDGE_HOST) { $env:RAFIQ_PRIVATE_BRIDGE_HOST } else { "127.0.0.1" }
$BridgeUrl = "http://${BridgeHost}:${BridgePort}"
$LogOut = "C:\tmp\rafiq-private-bridge.out.log"
$LogErr = "C:\tmp\rafiq-private-bridge.err.log"

Set-Location $Workspace

if (-not (Test-Path $Python)) {
  throw "Python runtime not found: $Python"
}

$env:PATH = "C:\Program Files\Docker\Docker\resources\bin;" + $env:PATH
$env:SUPABASE_TELEMETRY_DISABLED = "1"
$env:PYTHONPATH = "C:\tmp\rafiq-phase3-pydeps"
$env:PYTHONIOENCODING = "utf-8"

if (-not $SkipSupabase) {
  Write-Host "Starting Supabase local database..."
  npx --yes supabase@2.106.0 db start --yes
}

$portOpen = Test-NetConnection -ComputerName $BridgeHost -Port $BridgePort -InformationLevel Quiet
if ($portOpen) {
  Write-Host "RAFIQ private bridge is already running at $BridgeUrl"
} elseif ($ForegroundBridge) {
  Write-Host "Starting RAFIQ private bridge in this window at $BridgeUrl"
  & $Python "apps\private-bridge\server.py"
} else {
  Write-Host "Starting RAFIQ private bridge in the background at $BridgeUrl"
  $process = Start-Process `
    -FilePath $Python `
    -ArgumentList "apps\private-bridge\server.py" `
    -WorkingDirectory $Workspace `
    -WindowStyle Hidden `
    -RedirectStandardOutput $LogOut `
    -RedirectStandardError $LogErr `
    -PassThru
  Start-Sleep -Seconds 2
  Write-Host "Bridge process ID: $($process.Id)"
}

Write-Host ""
Write-Host "Open RAFIQ:"
Write-Host "  $BridgeUrl/"
Write-Host "  $BridgeUrl/quran/1"
Write-Host "  $BridgeUrl/hadith"
Write-Host ""
Write-Host "Run health check:"
Write-Host "  & 'C:\Windows\System32\WindowsPowerShell\v1.0\powershell.exe' -ExecutionPolicy Bypass -File scripts\check_rafiq_local.ps1"
