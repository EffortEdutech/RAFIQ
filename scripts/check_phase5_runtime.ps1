$ErrorActionPreference = "Stop"

$ApiUrl = if ($env:RAFIQ_API_URL) { $env:RAFIQ_API_URL } else { "http://127.0.0.1:8056" }
$ExpoUrl = if ($env:RAFIQ_EXPO_WEB_URL) { $env:RAFIQ_EXPO_WEB_URL } else { "http://127.0.0.1:8057" }
$MobileDist = Join-Path (Resolve-Path (Join-Path $PSScriptRoot "..")) "apps\mobile\dist\index.html"

function Assert-True {
  param(
    [bool]$Condition,
    [string]$Message
  )
  if (-not $Condition) {
    throw $Message
  }
}

$apiPortOpen = Test-NetConnection -ComputerName 127.0.0.1 -Port 8056 -InformationLevel Quiet
Assert-True $apiPortOpen "NestJS API port 8056 is not open"

$expoPortOpen = Test-NetConnection -ComputerName 127.0.0.1 -Port 8057 -InformationLevel Quiet
Assert-True $expoPortOpen "Expo web port 8057 is not open"

$health = Invoke-RestMethod "$ApiUrl/api/health"
Assert-True ($health.ok -eq $true) "API health endpoint did not return ok=true"
Assert-True ($health.service -eq "rafiq-api") "API health endpoint returned the wrong service name"
Assert-True ($health.deploymentMode -eq "private_local") "API health endpoint should default to private_local deployment mode"
Assert-True ($health.publicContentEnabled -eq $false) "API health endpoint should not enable public content by default"
Assert-True ($health.publicReleaseGo -eq $false) "API health endpoint should not report public release GO"

$openApi = Invoke-RestMethod "$ApiUrl/api/openapi.json"
Assert-True ($openApi.info.title -eq "RAFIQ Private API") "OpenAPI document title is wrong"
Assert-True ($openApi.paths.PSObject.Properties.Name -contains "/api/private-content/quran/surah/{surahNumber}") "OpenAPI document is missing Quran surah path"
Assert-True ($openApi.paths.PSObject.Properties.Name -contains "/api/public-content/search") "OpenAPI document is missing public search path"
Assert-True ($openApi.paths.PSObject.Properties.Name -contains "/api/public-content/answer/draft") "OpenAPI document is missing public answer draft path"
Assert-True ($openApi.paths.PSObject.Properties.Name -contains "/api/public-content/answer/guided") "OpenAPI document is missing public guided answer path"
Assert-True ($openApi.paths.PSObject.Properties.Name -contains "/api/public-content/source/detail") "OpenAPI document is missing public source detail path"

$quran = Invoke-RestMethod "$ApiUrl/api/private-content/quran/surah/1"
Assert-True ($quran.notice.label -eq "UNAPPROVED CONTENT - NOT FOR PUBLICATION") "API Quran endpoint is missing private notice"
Assert-True ($quran.ayahs.Count -eq 7) "API Quran endpoint should return 7 ayahs"
Assert-True ($quran.ayahs[0].quranTextSourceDetailTarget.entityType -eq "quran_ayah_text") "API Quran endpoint should expose Quran text source detail target"

$quranSourceDetail = Invoke-RestMethod "$ApiUrl/api/private-content/source/detail?entityType=$($quran.ayahs[0].quranTextSourceDetailTarget.entityType)&entityId=$($quran.ayahs[0].quranTextSourceDetailTarget.entityId)"
Assert-True ($quranSourceDetail.notice.label -eq "UNAPPROVED CONTENT - NOT FOR PUBLICATION") "API source detail endpoint is missing private notice"
Assert-True ($quranSourceDetail.sourceDetail.provenanceCount -gt 0) "API Quran source detail should include provenance"
Assert-True ($null -ne $quranSourceDetail.sourceDetail.releaseState) "API Quran source detail should include release state"

$collections = Invoke-RestMethod "$ApiUrl/api/private-content/hadith/collections"
Assert-True ($collections.notice.label -eq "UNAPPROVED CONTENT - NOT FOR PUBLICATION") "API Hadith collections endpoint is missing private notice"
Assert-True ($collections.collections.Count -eq 70) "API Hadith collections endpoint should return 70 collections"

$records = Invoke-RestMethod "$ApiUrl/api/private-content/hadith/records?collection=fawaz-linebyline:bukhari&language=english&limit=3&offset=0"
Assert-True ($records.pagination.total -eq 7563) "API Hadith records endpoint should return Bukhari total 7,563"
Assert-True ($records.records.Count -eq 3) "API Hadith records endpoint should return 3 records"

$hadithDetail = Invoke-RestMethod "$ApiUrl/api/private-content/hadith/record/$($records.records[0].hadithRecordId)"
Assert-True ($hadithDetail.record.sourceDetailTarget.entityType -eq "hadith_record") "API Hadith detail should expose record source detail target"
$hadithSourceDetail = Invoke-RestMethod "$ApiUrl/api/private-content/source/detail?entityType=$($hadithDetail.record.sourceDetailTarget.entityType)&entityId=$($hadithDetail.record.sourceDetailTarget.entityId)"
Assert-True ($hadithSourceDetail.sourceDetail.provenanceCount -gt 0) "API Hadith source detail should include provenance"

$search = Invoke-RestMethod "$ApiUrl/api/private-content/search?q=mercy&domain=all&limit=5&offset=0"
Assert-True ($search.notice.label -eq "UNAPPROVED CONTENT - NOT FOR PUBLICATION") "API search endpoint is missing private notice"
Assert-True ($search.pagination.total -gt 0) "API search endpoint should return results for mercy"
Assert-True ($search.results.Count -gt 0) "API search endpoint should return a non-empty result page"
Assert-True ($null -ne $search.retrievalTrace.traceId) "API search endpoint should return a retrieval trace ID"

$publicSearch = Invoke-RestMethod "$ApiUrl/api/public-content/search?q=mercy&domain=all&limit=5&offset=0"
Assert-True ($publicSearch.notice.label -eq "PUBLIC RELEASE FILTER ACTIVE") "Public search endpoint is missing release-filter notice"
Assert-True ($publicSearch.pagination.total -eq 0) "Public search should not return pending/private content"
Assert-True ($publicSearch.results.Count -eq 0) "Public search result page should be empty until approval gates pass"
Assert-True ($publicSearch.releaseFilter.pendingContentBlocked -eq $true) "Public search release filter should block pending content"
Assert-True ($publicSearch.releaseFilter.privateSearchIndexReadable -eq $false) "Public search must not expose private search index readability"

$publicAnswer = Invoke-RestMethod "$ApiUrl/api/public-content/answer/draft?q=What%20does%20Islam%20say%20about%20mercy%3F&domain=all&limit=5"
Assert-True ($publicAnswer.notice.label -eq "PUBLIC RELEASE FILTER ACTIVE") "Public answer endpoint is missing release-filter notice"
Assert-True ($publicAnswer.answerDraft.responseState -eq "source_unavailable") "Public answer should be unavailable without approved public evidence"
Assert-True ($publicAnswer.answerDraft.evidenceItems.Count -eq 0) "Public answer should not expose private/pending evidence"
Assert-True ($publicAnswer.answerDraft.publicReleaseReady -eq $false) "Public answer should not be release ready without approved evidence"
Assert-True ($publicAnswer.answerDraft.validationGateResults.publicReleaseGate.status -eq "failed") "Public answer release gate should fail without approved evidence"

$publicGuided = Invoke-RestMethod "$ApiUrl/api/public-content/answer/guided?q=What%20does%20Islam%20say%20about%20mercy%3F&domain=all&limit=5"
Assert-True ($publicGuided.notice.label -eq "PUBLIC RELEASE FILTER ACTIVE") "Public guided answer endpoint is missing release-filter notice"
Assert-True ($publicGuided.guidedAnswer.promptStatus -eq "blocked_no_public_evidence") "Public guided answer should block model-ready prompt without approved evidence"
Assert-True ($publicGuided.guidedAnswer.evidencePrompt.Count -eq 0) "Public guided answer should not expose private/pending evidence"
Assert-True ($publicGuided.guidedAnswer.citationIds.Count -eq 0) "Public guided answer should not produce citations without approved evidence"
Assert-True ($publicGuided.guidedAnswer.publicReleaseReady -eq $false) "Public guided answer should not be release ready without approved evidence"

$publicSourceDetail = Invoke-RestMethod "$ApiUrl/api/public-content/source/detail?entityType=quran_ayah_text&entityId=demo-source"
Assert-True ($publicSourceDetail.notice.label -eq "PUBLIC RELEASE FILTER ACTIVE") "Public source detail endpoint is missing release-filter notice"
Assert-True ($publicSourceDetail.sourceDetail.publicStatus -eq "not_public") "Public source detail should return not_public for pending/private entities"
Assert-True ($publicSourceDetail.sourceDetail.publicReleaseGatePassed -eq $false) "Public source detail should not pass release gate for pending/private entities"
Assert-True ($publicSourceDetail.sourceDetail.privateFieldsExcluded -contains "rawObjectPath") "Public source detail should document raw-object exclusion"
Assert-True ($publicSourceDetail.sourceDetail.privateFieldsExcluded -contains "reviewerNotes") "Public source detail should document reviewer-note exclusion"

$trace = Invoke-RestMethod "$ApiUrl/api/private-content/search/trace/$($search.retrievalTrace.traceId)"
Assert-True ($trace.trace.queryText -eq "mercy") "API retrieval trace should round-trip the search query"

$reviewQueue = Invoke-RestMethod "$ApiUrl/api/private-content/review/queue?status=all&limit=5&offset=0"
Assert-True ($reviewQueue.notice.label -eq "UNAPPROVED CONTENT - NOT FOR PUBLICATION") "API review queue endpoint is missing private notice"
Assert-True ($reviewQueue.pagination.total -gt 0) "API review queue endpoint should return queued review items"
Assert-True ($reviewQueue.items.Count -gt 0) "API review queue endpoint should return a non-empty page"

$reviewDetail = Invoke-RestMethod "$ApiUrl/api/private-content/review/queue/$($reviewQueue.items[0].queueItemId)"
Assert-True ($reviewDetail.item.queueItemId -eq $reviewQueue.items[0].queueItemId) "API review queue detail should round-trip the queue item ID"

$answer = Invoke-RestMethod "$ApiUrl/api/private-content/answer/draft?q=What%20does%20Islam%20say%20about%20mercy%3F&domain=all&limit=5"
Assert-True ($answer.notice.label -eq "UNAPPROVED CONTENT - NOT FOR PUBLICATION") "API answer draft endpoint is missing private notice"
Assert-True ($answer.answerDraft.responseState -eq "approved_with_disclaimer") "API answer draft should return approved_with_disclaimer for evidence-backed general question"
Assert-True ($answer.answerDraft.evidenceItems.Count -gt 0) "API answer draft should return evidence citations"
Assert-True ($answer.answerDraft.modelName -eq "deterministic_guardrail_v1") "API answer draft should identify deterministic guardrail model layer"

$answerLookup = Invoke-RestMethod "$ApiUrl/api/private-content/answer/draft/$($answer.answerDraft.answerDraftId)"
Assert-True ($answerLookup.answerDraft.answerDraftId -eq $answer.answerDraft.answerDraftId) "API answer draft lookup should round-trip the draft ID"

$guided = Invoke-RestMethod "$ApiUrl/api/private-content/answer/guided?q=What%20does%20Islam%20say%20about%20mercy%3F&domain=all&limit=5"
Assert-True ($guided.notice.label -eq "UNAPPROVED CONTENT - NOT FOR PUBLICATION") "API guided answer endpoint is missing private notice"
Assert-True ($guided.guidedAnswer.promptStatus -eq "model_ready") "API guided answer should be model_ready for evidence-backed general question"
Assert-True ($guided.guidedAnswer.evidencePrompt.Count -gt 0) "API guided answer should include evidence prompt items"
Assert-True ($guided.guidedAnswer.citationIds.Count -gt 0) "API guided answer should include citation IDs"
Assert-True ($guided.guidedAnswer.modelProvider -eq "not_connected") "API guided answer should not connect an external model yet"

$guidedLookup = Invoke-RestMethod "$ApiUrl/api/private-content/answer/guided/$($guided.guidedAnswer.guidedAnswerId)"
Assert-True ($guidedLookup.guidedAnswer.guidedAnswerId -eq $guided.guidedAnswer.guidedAnswerId) "API guided answer lookup should round-trip the guided answer ID"

$adapterStatus = Invoke-RestMethod "$ApiUrl/api/private-content/answer/model-adapter/status"
Assert-True ($adapterStatus.notice.label -eq "UNAPPROVED CONTENT - NOT FOR PUBLICATION") "API model adapter status endpoint is missing private notice"
Assert-True ($adapterStatus.modelAdapter.providerEnabled -eq $false) "API model adapter should be disabled by default"
Assert-True ($adapterStatus.modelAdapter.liveExecutionAllowed -eq $false) "API model adapter should not allow live execution in Checkpoint 12"

$adapterRun = Invoke-RestMethod "$ApiUrl/api/private-content/answer/model-adapter/run?guidedAnswerId=$($guided.guidedAnswer.guidedAnswerId)"
Assert-True ($adapterRun.modelAdapterRun.adapterStatus -eq "disabled_by_configuration") "API model adapter run should be disabled by configuration"
Assert-True ($adapterRun.modelAdapterRun.guidedAnswerId -eq $guided.guidedAnswer.guidedAnswerId) "API model adapter run should reference the guided answer"

$adapterLookup = Invoke-RestMethod "$ApiUrl/api/private-content/answer/model-adapter/run/$($adapterRun.modelAdapterRun.modelAdapterRunId)"
Assert-True ($adapterLookup.modelAdapterRun.modelAdapterRunId -eq $adapterRun.modelAdapterRun.modelAdapterRunId) "API model adapter lookup should round-trip the adapter run ID"

$validation = Invoke-RestMethod "$ApiUrl/api/private-content/answer/validation/run?guidedAnswerId=$($guided.guidedAnswer.guidedAnswerId)&modelAdapterRunId=$($adapterRun.modelAdapterRun.modelAdapterRunId)"
Assert-True ($validation.notice.label -eq "UNAPPROVED CONTENT - NOT FOR PUBLICATION") "API answer validation endpoint is missing private notice"
Assert-True ($validation.answerValidationRun.validationStatus -eq "passed_private_review_required") "API answer validation should pass deterministic citation enforcement"
Assert-True ($validation.answerValidationRun.reviewerActionStatus -eq "queued") "API answer validation should start with queued reviewer action status"
Assert-True ($validation.answerValidationRun.citationIds.Count -gt 0) "API answer validation should retain required citations"
Assert-True ($validation.answerValidationRun.missingCitationIds.Count -eq 0) "API answer validation should not report missing citations for default guided answer"

$validationLookup = Invoke-RestMethod "$ApiUrl/api/private-content/answer/validation/run/$($validation.answerValidationRun.answerValidationRunId)"
Assert-True ($validationLookup.answerValidationRun.answerValidationRunId -eq $validation.answerValidationRun.answerValidationRunId) "API answer validation lookup should round-trip the validation run ID"

$validationReview = Invoke-RestMethod "$ApiUrl/api/private-content/answer/validation/review/$($validation.answerValidationRun.answerValidationRunId)?action=needs_correction&notes=runtime-check"
Assert-True ($validationReview.answerValidationRun.reviewerActionStatus -eq "needs_correction") "API answer validation reviewer action should round-trip"

$expoHome = Invoke-WebRequest -UseBasicParsing "$ExpoUrl/"
Assert-True ($expoHome.Content.Contains("<title>RAFIQ</title>")) "Expo public home page shell is not reachable"

Assert-True (Test-Path $MobileDist) "Expo web export index.html is missing"

[pscustomobject]@{
  Status = "pass"
  ApiUrl = $ApiUrl
  ExpoUrl = $ExpoUrl
  ApiHealth = $health.service
  DeploymentMode = $health.deploymentMode
  PublicContentEnabled = $health.publicContentEnabled
  OpenApiTitle = $openApi.info.title
  QuranAyahs = $quran.ayahs.Count
  QuranSourceDetail = $quranSourceDetail.sourceDetail.provenanceCount
  HadithCollections = $collections.collections.Count
  HadithBukhariTotal = $records.pagination.total
  HadithSourceDetail = $hadithSourceDetail.sourceDetail.provenanceCount
  SearchResults = $search.results.Count
  PublicSearchResults = $publicSearch.results.Count
  PublicSearchReleaseFilter = $publicSearch.releaseFilter.status
  PublicAnswerState = $publicAnswer.answerDraft.responseState
  PublicGuidedPromptStatus = $publicGuided.guidedAnswer.promptStatus
  PublicSourceDetailStatus = $publicSourceDetail.sourceDetail.publicStatus
  RetrievalTrace = $search.retrievalTrace.traceId
  ReviewQueueItems = $reviewQueue.pagination.total
  ReviewQueueDetail = $reviewDetail.item.queueItemId
  AnswerDraft = $answer.answerDraft.answerDraftId
  AnswerState = $answer.answerDraft.responseState
  AnswerEvidenceItems = $answer.answerDraft.evidenceItems.Count
  GuidedAnswer = $guided.guidedAnswer.guidedAnswerId
  GuidedPromptStatus = $guided.guidedAnswer.promptStatus
  GuidedCitations = $guided.guidedAnswer.citationIds.Count
  ModelAdapterStatus = $adapterStatus.modelAdapter.status
  ModelAdapterRun = $adapterRun.modelAdapterRun.modelAdapterRunId
  ModelAdapterRunStatus = $adapterRun.modelAdapterRun.adapterStatus
  AnswerValidationRun = $validation.answerValidationRun.answerValidationRunId
  AnswerValidationStatus = $validation.answerValidationRun.validationStatus
  AnswerValidationReviewerAction = $validationReview.answerValidationRun.reviewerActionStatus
  MobileExport = $MobileDist
}
