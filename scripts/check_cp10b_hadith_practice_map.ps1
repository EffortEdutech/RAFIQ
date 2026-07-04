$ErrorActionPreference = 'Stop'

$apiUrl = $env:RAFIQ_API_URL
if ([string]::IsNullOrWhiteSpace($apiUrl)) {
  $apiUrl = 'http://127.0.0.1:8056'
}

function Assert-True {
  param(
    [bool]$Condition,
    [string]$Message
  )

  if (-not $Condition) {
    throw $Message
  }
}

$records = Invoke-RestMethod -Uri "$apiUrl/api/private-content/hadith/records?collection=fawaz-linebyline:bukhari&limit=1&offset=0"
Assert-True ($records.records.Count -ge 1) 'CP10B needs at least one Bukhari record for the practice-map check.'

$recordId = $records.records[0].hadithRecordId
$detail = Invoke-RestMethod -Uri "$apiUrl/api/private-content/hadith/record/$recordId"
Assert-True ($detail.record.hadithRecordId -eq $recordId) 'Hadith detail did not return the requested record.'
Assert-True ($detail.textVersions.Count -gt 0) 'Hadith detail must expose narration text versions.'
$arabicVersions = @($detail.textVersions | Where-Object { $_.languageCode -eq 'ar' })
Assert-True ($arabicVersions.Count -ge 1) 'Hadith detail should expose Arabic original text when available.'

$session = Invoke-RestMethod -Uri "$apiUrl/api/private-content/guidance/session?entryPoint=learn_theme&input=intention&language=en&domain=hadith"
Assert-True ($session.session.status -eq 'ready') 'Hadith-scoped intention guidance session should be ready.'
Assert-True ($session.session.sunnahSupport.Count -gt 0) 'Hadith-scoped intention guidance session should include Sunnah support.'
Assert-True ($session.session.learningPath.steps.Count -gt 0) 'Hadith-scoped intention guidance session should expose a learning path.'

[pscustomobject]@{
  Status = 'pass'
  ApiUrl = $apiUrl
  HadithRecordId = $recordId
  TextVersions = $detail.textVersions.Count
  HasArabicOriginal = ($arabicVersions.Count -ge 1)
  GuidanceStatus = $session.session.status
  SunnahSupport = $session.session.sunnahSupport.Count
  LearningPathSteps = $session.session.learningPath.steps.Count
}
