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

$recordId = '5afbb787-10dc-b1c9-8bc6-4beb0299d569'
$session = Invoke-RestMethod -Uri "$apiUrl/api/private-content/guidance/session?entryPoint=hadith_record&input=intention&language=en&domain=hadith&hadithRecordId=$recordId"
$firstSupport = $session.session.sunnahSupport[0]
$sunnahStep = @($session.session.learningPath.steps | Where-Object { $_.kind -eq 'sunnah' })[0]

Assert-True ($session.session.status -eq 'ready') 'Hadith-record anchored session should be ready.'
Assert-True ($session.session.need.entryPoint -eq 'hadith_record') 'Session should preserve hadith_record entry point.'
Assert-True ($firstSupport.sourceDetailTarget.entityId -eq $recordId) 'First Sunnah support must be the opened Hadith record.'
Assert-True ($firstSupport.reference -like '*bukhari*') 'Anchored support should preserve Bukhari collection/reference.'
Assert-True ($sunnahStep.route -eq "/hadith/$recordId") 'Sunnah learning step should route back to the opened narration.'
Assert-True ($session.session.sunnahSupport.Count -ge 1) 'Anchored session should include at least one Sunnah support item.'

[pscustomobject]@{
  Status = 'pass'
  ApiUrl = $apiUrl
  SessionStatus = $session.session.status
  EntryPoint = $session.session.need.entryPoint
  AnchoredRecordId = $firstSupport.sourceDetailTarget.entityId
  FirstReference = $firstSupport.reference
  SunnahStepRoute = $sunnahStep.route
  SupportCount = $session.session.sunnahSupport.Count
}
