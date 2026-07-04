$ErrorActionPreference = "Stop"

$ApiUrl = if ($env:RAFIQ_API_URL) { $env:RAFIQ_API_URL } else { "http://127.0.0.1:8056" }
$BridgeUrl = if ($env:RAFIQ_PRIVATE_BRIDGE_URL) { $env:RAFIQ_PRIVATE_BRIDGE_URL } else { "http://127.0.0.1:8055" }

function Assert-True {
  param(
    [bool]$Condition,
    [string]$Message
  )
  if (-not $Condition) {
    throw $Message
  }
}

function Get-Json {
  param([string]$Url)
  return Invoke-RestMethod -TimeoutSec 30 $Url
}

$bridgeHealth = Get-Json "$BridgeUrl/api/health"
Assert-True ($bridgeHealth.ok -eq $true) "Temporary Python bridge is not healthy"

$apiHealth = Get-Json "$ApiUrl/api/health"
Assert-True ($apiHealth.ok -eq $true) "NestJS API is not healthy"

$apiQuran = Get-Json "$ApiUrl/api/private-content/quran/surah/1"
$bridgeQuran = Get-Json "$BridgeUrl/api/quran/surah/1"
Assert-True ($apiQuran.notice.label -eq $bridgeQuran.notice.label) "Quran private notice differs"
Assert-True ($apiQuran.ayahs.Count -eq $bridgeQuran.ayahs.Count) "Quran ayah count differs"
Assert-True ($apiQuran.ayahs[0].ayahKey -eq $bridgeQuran.ayahs[0].ayahKey) "Quran first ayah key differs"

$apiCollections = Get-Json "$ApiUrl/api/private-content/hadith/collections"
$bridgeCollections = Get-Json "$BridgeUrl/api/hadith/collections"
Assert-True ($apiCollections.collections.Count -eq $bridgeCollections.collections.Count) "Hadith collection count differs"

$recordsPath = "collection=fawaz-linebyline:bukhari&language=english&limit=3&offset=0"
$apiRecords = Get-Json "$ApiUrl/api/private-content/hadith/records?$recordsPath"
$bridgeRecords = Get-Json "$BridgeUrl/api/hadith/records?$recordsPath"
$apiRecordItems = @($apiRecords.records)
$bridgeRecordItems = @($bridgeRecords.records)
Assert-True ($apiRecords.pagination.total -eq $bridgeRecords.pagination.total) "Hadith record total differs"
Assert-True ($apiRecordItems.Count -eq $bridgeRecordItems.Count) "Hadith page size differs"
Assert-True ($apiRecordItems[0].hadithRecordId -eq $bridgeRecordItems[0].hadithRecordId) "Hadith first record ID differs"

$recordId = $apiRecordItems[0].hadithRecordId
$apiDetail = Get-Json "$ApiUrl/api/private-content/hadith/record/$recordId"
$bridgeDetail = Get-Json "$BridgeUrl/api/hadith/record/$recordId"
Assert-True ($apiDetail.record.hadithRecordId -eq $bridgeDetail.record.hadithRecordId) "Hadith detail record ID differs"
Assert-True ($apiDetail.textVersions.Count -eq $bridgeDetail.textVersions.Count) "Hadith detail text-version count differs"

[pscustomobject]@{
  Status = "pass"
  ApiUrl = $ApiUrl
  BridgeUrl = $BridgeUrl
  QuranAyahs = $apiQuran.ayahs.Count
  HadithCollections = $apiCollections.collections.Count
  HadithBukhariTotal = $apiRecords.pagination.total
  ComparedRecordId = $recordId
  BridgeDisposition = "diagnostic-only after parity"
}
