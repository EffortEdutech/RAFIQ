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
  Assert-True ($null -ne $response.session.learningPath) "$Name did not return a learning path"
  return $response.session
}

function Get-Step {
  param(
    [object]$Session,
    [string]$Kind
  )
  return @($Session.learningPath.steps | Where-Object { $_.kind -eq $Kind })[0]
}

$cases = @(
  @{
    Name = "learn_guidance"
    Query = "entryPoint=learn_theme&input=guidance&language=en&domain=all"
    ExpectQuran = $true
    ExpectTafsir = $true
    ExpectHadith = $false
  },
  @{
    Name = "ask_patience_natural"
    Query = "entryPoint=ask&input=patience%20before%20a%20difficult%20conversation&language=en&domain=all"
    ExpectQuran = $true
    ExpectTafsir = $true
    ExpectHadith = $false
  },
  @{
    Name = "hadith_only_mercy"
    Query = "entryPoint=learn_theme&input=mercy&language=en&domain=hadith"
    ExpectQuran = $false
    ExpectTafsir = $false
    ExpectHadith = $true
  }
)

$rows = foreach ($case in $cases) {
  $session = Get-Session -Name $case.Name -Query $case.Query
  $steps = @($session.learningPath.steps)
  $kinds = @($steps | ForEach-Object { $_.kind })

  Assert-True ($steps.Count -eq 5) "$($case.Name) expected 5 learning path steps, got $($steps.Count)"
  foreach ($kind in @("quran", "tafsir", "sunnah", "reflection", "action")) {
    Assert-True ($kinds -contains $kind) "$($case.Name) missing $kind step"
  }

  $quranStep = Get-Step -Session $session -Kind "quran"
  $tafsirStep = Get-Step -Session $session -Kind "tafsir"
  $sunnahStep = Get-Step -Session $session -Kind "sunnah"
  $reflectionStep = Get-Step -Session $session -Kind "reflection"
  $actionStep = Get-Step -Session $session -Kind "action"

  Assert-True ($quranStep.available -eq $case.ExpectQuran) "$($case.Name) Quran availability mismatch"
  Assert-True ($tafsirStep.available -eq $case.ExpectTafsir) "$($case.Name) Tafsir availability mismatch"
  Assert-True ($sunnahStep.available -eq $case.ExpectHadith) "$($case.Name) Hadith availability mismatch"
  Assert-True ($reflectionStep.available -eq $true) "$($case.Name) reflection step must remain available"
  Assert-True ($actionStep.available -eq $true) "$($case.Name) action step must remain available"

  if ($case.ExpectQuran) {
    Assert-True ($null -ne $session.quranAnchor) "$($case.Name) expected Quran anchor"
    Assert-True ([string]::IsNullOrWhiteSpace($quranStep.reference) -eq $false) "$($case.Name) Quran step needs reference"
    Assert-True ([string]::IsNullOrWhiteSpace($quranStep.route) -eq $false) "$($case.Name) Quran step needs route"
  }

  if ($case.ExpectHadith) {
    Assert-True ($session.sunnahSupport.Count -gt 0) "$($case.Name) expected Sunnah support"
    Assert-True ([string]::IsNullOrWhiteSpace($sunnahStep.body) -eq $false) "$($case.Name) Hadith step needs body"
  }

  [pscustomobject]@{
    Case = $case.Name
    Status = $session.status
    Title = $session.learningPath.title
    QuranStep = $quranStep.available
    TafsirStep = $tafsirStep.available
    HadithStep = $sunnahStep.available
    ReflectStep = $reflectionStep.available
    ActionStep = $actionStep.available
  }
}

$rows | Format-Table -AutoSize
