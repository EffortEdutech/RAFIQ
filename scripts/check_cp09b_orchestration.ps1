$ErrorActionPreference = "Stop"

$ApiUrl = if ($env:RAFIQ_API_URL) { $env:RAFIQ_API_URL } else { "http://127.0.0.1:8056" }

function Assert-True {
  param(
    [bool]$Condition,
    [string]$Message
  )
  if (-not $Condition) {
    throw $Message
  }
}

function Get-Session {
  param(
    [string]$Name,
    [string]$Query
  )
  $response = Invoke-RestMethod "$ApiUrl/api/private-content/guidance/session?$Query"
  Assert-True ($null -ne $response.session) "$Name did not return a session"
  return $response.session
}

$cases = @(
  @{
    Name = "today_mercy"
    Query = "entryPoint=today&input=mercy&language=en&domain=all"
    ExpectReady = $true
    ExpectQuran = $true
  },
  @{
    Name = "ask_patience_natural"
    Query = "entryPoint=ask&input=patience%20before%20a%20difficult%20conversation&language=en&domain=all"
    ExpectReady = $true
    ExpectQuran = $true
  },
  @{
    Name = "ask_gratitude_natural"
    Query = "entryPoint=ask&input=how%20can%20I%20practice%20gratitude%20today&language=en&domain=all"
    ExpectReady = $true
    ExpectQuran = $true
  },
  @{
    Name = "learn_guidance"
    Query = "entryPoint=learn_theme&input=guidance&language=en&domain=all"
    ExpectReady = $true
    ExpectQuran = $true
  },
  @{
    Name = "quran_ayah_1_1"
    Query = "entryPoint=quran_ayah&input=1%3A1&language=en&domain=all&surahNumber=1&ayahNumber=1&verseKey=1%3A1"
    ExpectReady = $true
    ExpectQuran = $true
    ExpectVerse = "1:1"
  },
  @{
    Name = "blocked_unknown"
    Query = "entryPoint=ask&input=zzzz_unmapped_private_test_phrase&language=en&domain=all"
    ExpectReady = $false
    ExpectQuran = $false
  },
  @{
    Name = "hadith_only_mercy"
    Query = "entryPoint=learn_theme&input=mercy&language=en&domain=hadith"
    ExpectReady = $true
    ExpectQuran = $false
    ExpectSunnah = $true
  }
)

$rows = foreach ($case in $cases) {
  $session = Get-Session -Name $case.Name -Query $case.Query
  $hasQuran = $null -ne $session.quranAnchor
  $ready = $session.status -eq "ready"

  if ($case.ExpectReady) {
    Assert-True $ready "$($case.Name) expected ready, got $($session.status)"
  } else {
    Assert-True (-not $ready) "$($case.Name) expected blocked/non-ready, got ready"
  }

  if ($case.ExpectQuran) {
    Assert-True $hasQuran "$($case.Name) expected a Quran anchor"
  } else {
    Assert-True (-not $hasQuran) "$($case.Name) did not expect a Quran anchor"
  }

  if ($case.ExpectVerse) {
    Assert-True ($session.quranAnchor.verseKey -eq $case.ExpectVerse) "$($case.Name) expected Quran $($case.ExpectVerse), got $($session.quranAnchor.verseKey)"
  }

  if ($case.ExpectSunnah) {
    Assert-True ($session.sunnahSupport.Count -gt 0) "$($case.Name) expected Sunnah support"
  }

  [pscustomobject]@{
    Case = $case.Name
    Status = $session.status
    Theme = $session.need.detectedTheme
    Intent = $session.need.detectedIntent
    Quran = if ($session.quranAnchor) { $session.quranAnchor.verseKey } else { "" }
    Evidence = $session.verification.evidenceCount
    QuranEvidence = $session.verification.quranEvidenceCount
    SunnahEvidence = $session.verification.sunnahEvidenceCount
    SunnahSupport = $session.sunnahSupport.Count
    Next = $session.guidance.nextStep.route
  }
}

$rows | Format-Table -AutoSize
