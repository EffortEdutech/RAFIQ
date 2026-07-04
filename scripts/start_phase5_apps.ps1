$ErrorActionPreference = "Stop"

$Workspace = Resolve-Path (Join-Path $PSScriptRoot "..")
$Node = "C:\Program Files\nodejs\node.exe"
$Corepack = "C:\Program Files\nodejs\corepack.cmd"

Set-Location $Workspace

if (-not (Test-Path $Node)) {
  throw "Node runtime not found: $Node"
}
if (-not (Test-Path $Corepack)) {
  throw "Corepack runtime not found: $Corepack"
}

$env:RAFIQ_DATABASE_URL = if ($env:RAFIQ_DATABASE_URL) { $env:RAFIQ_DATABASE_URL } else { "postgresql://postgres:postgres@127.0.0.1:55422/postgres" }
$env:RAFIQ_API_HOST = if ($env:RAFIQ_API_HOST) { $env:RAFIQ_API_HOST } else { "127.0.0.1" }
$env:RAFIQ_API_PORT = if ($env:RAFIQ_API_PORT) { $env:RAFIQ_API_PORT } else { "8056" }
$env:EXPO_PUBLIC_API_URL = if ($env:EXPO_PUBLIC_API_URL) { $env:EXPO_PUBLIC_API_URL } else { "http://127.0.0.1:8056" }
$env:CI = "1"

Write-Host "Building shared contracts and API..."
corepack pnpm -C packages/shared build
corepack pnpm -C apps/api build

$apiOpen = Test-NetConnection -ComputerName 127.0.0.1 -Port 8056 -InformationLevel Quiet
if ($apiOpen) {
  Write-Host "NestJS API is already running at http://127.0.0.1:8056"
} else {
  Write-Host "Starting NestJS API at http://127.0.0.1:8056"
  Start-Process `
    -FilePath $Node `
    -ArgumentList "dist\main.js" `
    -WorkingDirectory (Join-Path $Workspace "apps\api") `
    -WindowStyle Hidden `
    -RedirectStandardOutput "C:\tmp\rafiq-api.out.log" `
    -RedirectStandardError "C:\tmp\rafiq-api.err.log" | Out-Null
  Start-Sleep -Seconds 3
}

$expoOpen = Test-NetConnection -ComputerName 127.0.0.1 -Port 8057 -InformationLevel Quiet
if ($expoOpen) {
  Write-Host "Expo web is already running at http://127.0.0.1:8057"
} else {
  Write-Host "Starting Expo web at http://127.0.0.1:8057"
  Start-Process `
    -FilePath $Corepack `
    -ArgumentList "pnpm", "-C", "apps/mobile", "exec", "expo", "start", "--web", "--port", "8057" `
    -WorkingDirectory $Workspace `
    -WindowStyle Hidden `
    -RedirectStandardOutput "C:\tmp\rafiq-expo.out.log" `
    -RedirectStandardError "C:\tmp\rafiq-expo.err.log" | Out-Null
  Start-Sleep -Seconds 10
}

Write-Host ""
Write-Host "Open:"
Write-Host "  API:  http://127.0.0.1:8056/api/private-content/quran/surah/1"
Write-Host "  Expo: http://127.0.0.1:8057/"
Write-Host ""
Write-Host "Verify:"
Write-Host "  & 'C:\Windows\System32\WindowsPowerShell\v1.0\powershell.exe' -ExecutionPolicy Bypass -File scripts\check_phase5_runtime.ps1"
