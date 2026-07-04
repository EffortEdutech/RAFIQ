$ErrorActionPreference = "Stop"

$BridgePort = if ($env:RAFIQ_PRIVATE_BRIDGE_PORT) { [int]$env:RAFIQ_PRIVATE_BRIDGE_PORT } else { 8055 }
$BridgeHost = if ($env:RAFIQ_PRIVATE_BRIDGE_HOST) { $env:RAFIQ_PRIVATE_BRIDGE_HOST } else { "127.0.0.1" }
$BridgeUrl = "http://${BridgeHost}:${BridgePort}"

function Assert-True {
  param(
    [bool]$Condition,
    [string]$Message
  )
  if (-not $Condition) {
    throw $Message
  }
}

$portOpen = Test-NetConnection -ComputerName $BridgeHost -Port $BridgePort -InformationLevel Quiet
Assert-True $portOpen "RAFIQ private bridge port is not open: $BridgeUrl"

$health = Invoke-RestMethod "$BridgeUrl/api/health"
Assert-True ($health.ok -eq $true) "Health endpoint did not return ok=true"

$quran = Invoke-RestMethod "$BridgeUrl/api/quran/surah/1"
Assert-True ($quran.notice.label -eq "UNAPPROVED CONTENT - NOT FOR PUBLICATION") "Quran endpoint is missing private notice"
Assert-True ($quran.ayahs.Count -eq 7) "Quran endpoint should return 7 ayahs for Surah 1"

$hadithCollections = Invoke-RestMethod "$BridgeUrl/api/hadith/collections"
Assert-True ($hadithCollections.notice.label -eq "UNAPPROVED CONTENT - NOT FOR PUBLICATION") "Hadith collections endpoint is missing private notice"
Assert-True ($hadithCollections.collections.Count -eq 70) "Hadith collections endpoint should return 70 collections"

$hadithRecords = Invoke-RestMethod "$BridgeUrl/api/hadith/records?collection=fawaz-linebyline:bukhari&language=english&limit=3&offset=0"
Assert-True ($hadithRecords.pagination.total -eq 7563) "Bukhari English total should be 7,563"
Assert-True ($hadithRecords.records.Count -eq 3) "Hadith records endpoint should return 3 records for limit=3"

$quranPage = Invoke-WebRequest -UseBasicParsing "$BridgeUrl/quran/1"
Assert-True ($quranPage.Content.Contains("UNAPPROVED CONTENT - NOT FOR PUBLICATION")) "Quran page is missing private notice"
Assert-True ($quranPage.Content.Contains("Surah 1")) "Quran page is missing Surah 1 title"

$hadithPage = Invoke-WebRequest -UseBasicParsing "$BridgeUrl/hadith"
Assert-True ($hadithPage.Content.Contains("UNAPPROVED CONTENT - NOT FOR PUBLICATION")) "Hadith page is missing private notice"
Assert-True ($hadithPage.Content.Contains("Hadith Collections")) "Hadith page is missing collections title"

[pscustomobject]@{
  Status = "pass"
  BridgeUrl = $BridgeUrl
  QuranAyahs = $quran.ayahs.Count
  HadithCollections = $hadithCollections.collections.Count
  HadithBukhariTotal = $hadithRecords.pagination.total
}
