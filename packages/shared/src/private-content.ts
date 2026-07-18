export const PRIVATE_CONTENT_LABEL = 'UNAPPROVED CONTENT - NOT FOR PUBLICATION';

export type PrivateContentNotice = {
  label: string;
  publicationStatus?: string;
  rightsStatus?: string;
  attributionStatus?: string;
  editorialStatus?: string;
  scholarContentStatus?: string;
  message: string;
};

export type SourceDetailTarget = {
  entityType: string;
  entityId: string;
};

export type RafiqSearchMode = 'guidance' | 'sources';

export type RafiqDeepLinkKind =
  | 'read_ayah'
  | 'open_tafsir'
  | 'related_quran'
  | 'find_sunnah'
  | 'open_narration'
  | 'related_narrations'
  | 'check_verification'
  | 'search_quran_connection'
  | 'source_detail'
  | 'open_guidance';

export type SourceToGuidanceTarget = {
  entryPoint: 'quran_ayah' | 'hadith_record' | 'learn_theme' | 'ask';
  input: string;
  domain?: PrivateSearchDomain | PrivateSourceSearchDomain | string;
  sourceResultId?: string | null;
  quran?: {
    surahNumber: number;
    ayahNumber?: number;
    verseKey?: string;
  };
  hadithRecordId?: string | null;
};

export type RafiqDeepLink = {
  linkId: string;
  label: string;
  kind: RafiqDeepLinkKind;
  route: string;
  sourceDetailTarget?: SourceDetailTarget | null;
  guidanceTarget?: SourceToGuidanceTarget | null;
};

export type GuidanceResearchSuggestionKind =
  | 'quran'
  | 'translation'
  | 'tafsir'
  | 'sunnah'
  | 'topic'
  | 'theme'
  | 'verification';

export type GuidanceResearchSuggestion = {
  suggestionId: string;
  kind: GuidanceResearchSuggestionKind;
  label: string;
  query: string;
  route: string;
  sourceDetailTarget?: SourceDetailTarget | null;
};

export type QuranEditionSummary = {
  editionKey: string;
  name?: string;
  scriptLabel?: string;
  bismillahPolicy?: string;
  languageCode?: string;
  translatorName?: string;
  title?: string;
  authorName?: string;
  sourceDetailTarget?: SourceDetailTarget | null;
};

export type QuranSurahAyah = {
  ayahId: number;
  verseKey: string;
  surahNumber: number;
  ayahNumber: number;
  globalAyahNumber: number;
  sourceDetailTarget?: SourceDetailTarget | null;
  quranText: string;
  quranTextSourceDetailTarget?: SourceDetailTarget | null;
  translation?: {
    translationTextId: string;
    variantType: string;
    text: string;
    sourceMarkup?: string;
    sourceDetailTarget?: SourceDetailTarget | null;
  } | null;
  tafsirPassages: Array<{
    passageId: string;
    passageKey: string;
    text: string;
    blankText: boolean;
    sourceRole?: string;
    sourceOrder?: number;
    sourceDetailTarget?: SourceDetailTarget | null;
  }>;
  sourceTopics: Array<{
    topicId: string;
    sourceTopicKey: string;
    name: string;
    arabicName?: string;
    sourceDetailTarget?: SourceDetailTarget | null;
  }>;
  sourceAyahThemes: Array<{
    groupId: string;
    sourceGroupKey: string;
    themeText: string;
    rawKeywords?: string;
    sourceDetailTarget?: SourceDetailTarget | null;
  }>;
};

export type QuranSurahResponse = {
  notice: PrivateContentNotice;
  surah: {
    surahNumber: number;
    nameArabic?: string;
    nameTransliteration?: string;
    ayahCount: number;
  };
  editions: {
    quran: QuranEditionSummary;
    translation: QuranEditionSummary;
    tafsir: QuranEditionSummary;
  };
  ayahs: QuranSurahAyah[];
};

export type TafsirStudyPassage = {
  passageId: string;
  passageKey: string;
  text: string;
  blankText: boolean;
  sourceRole?: string | null;
  sourceOrder?: number | null;
  edition: QuranEditionSummary;
  sourceDetailTarget?: SourceDetailTarget | null;
};

export type TafsirStudyAyah = {
  surahNumber: number;
  ayahNumber: number;
  verseKey: string;
  quranText?: string | null;
  translationText?: string | null;
};

export type TafsirStudyResponse = {
  notice: PrivateContentNotice;
  passage: TafsirStudyPassage | null;
  ayahs: TafsirStudyAyah[];
  comparisons: TafsirStudyPassage[];
};

export type HadithCollectionSummary = {
  collectionId: string;
  collectionKey: string;
  nameEnglish?: string;
  nameArabic?: string;
  editionCount: number;
  recordCount: number;
  textVersionCount: number;
};

export type HadithCollectionsResponse = {
  notice: PrivateContentNotice;
  collections: HadithCollectionSummary[];
};

export type HadithRecordListItem = {
  hadithRecordId: string;
  collectionKey: string;
  collectionName?: string;
  editionKey: string;
  sourceHadithKey: string;
  sourceHadithNumber?: string;
  sourceUrn?: string;
  printedReference?: string;
  previewText?: string;
  previewLanguageCode?: string;
  gradeSummary: Array<{
    graderNameRaw?: string;
    rawGrade?: string;
    normalizedLabel?: string;
    claimScope?: string;
    reviewStatus?: string;
  }>;
};

export type HadithRecordsResponse = {
  notice: PrivateContentNotice;
  pagination: {
    limit: number;
    offset: number;
    total: number;
  };
  records: HadithRecordListItem[];
};

export type HadithTextQualitySeverity = 'ok' | 'review' | 'withheld';

export type HadithTextQualityFlag =
  | 'blank_text'
  | 'known_broken_phrase'
  | 'repeated_word'
  | 'suspicious_short'
  | 'suspicious_long';

export type HadithTextQualitySummary = {
  status: 'ok' | 'review_needed';
  flaggedTextVersionCount: number;
  withheldTextVersionCount: number;
  displayTextVersionId?: string | null;
  summary: string;
};

export type HadithDetailResponse = {
  notice: PrivateContentNotice;
  record: {
    hadithRecordId: string;
    collectionKey: string;
    collectionName?: string;
    editionKey: string;
    sourceHadithKey: string;
    sourceHadithNumber?: string;
    sourceArabicNumber?: string;
    sourceUrn?: string;
    printedReference?: string;
    sourceDetailTarget?: SourceDetailTarget | null;
  };
  textVersions: Array<{
    textVersionId: string;
    languageCode: string;
    translatorName?: string;
    fullText: string;
    narratorPrefix?: string;
    isnadText?: string;
    matnText?: string;
    sourceHtml?: string;
    textHash?: string;
    qualityFlags?: HadithTextQualityFlag[];
    qualitySeverity?: HadithTextQualitySeverity;
    qualitySummary?: string;
    sourceDetailTarget?: SourceDetailTarget | null;
  }>;
  qualitySummary?: HadithTextQualitySummary;
  gradeAssertions: Array<{
    assertionId: string;
    graderNameRaw?: string;
    rawGrade?: string;
    claimScope?: string;
    citation?: string;
    normalizedLabel?: string;
    normalizationVersion?: string;
    mappingMethod?: string;
    reviewStatus?: string;
    sourceDetailTarget?: SourceDetailTarget | null;
  }>;
  verificationClaims: Array<{
    claimId: string;
    claimText?: string;
    rawConclusion?: string;
    claimScope?: string;
    scholarResearcherRaw?: string;
    explanation?: string;
    classificationStatus?: string;
    editorialWorkflowStatus?: string;
    reviewStatus?: string;
    sourceDetailTarget?: SourceDetailTarget | null;
  }>;
};

export type PrivateSearchDomain =
  | 'all'
  | 'quran'
  | 'translation'
  | 'tafsir'
  | 'topics'
  | 'themes'
  | 'hadith';

export type PrivateSourceSearchDomain =
  | 'all'
  | 'quran'
  | 'translation'
  | 'tafsir'
  | 'topic'
  | 'ayah_theme'
  | 'hadith'
  | 'verification';

export type PrivateSourceSearchGroupKey =
  | 'quran'
  | 'translation'
  | 'tafsir'
  | 'hadith'
  | 'topics'
  | 'themes'
  | 'verification';

export type PrivateSearchResult = {
  domain: 'quran' | 'translation' | 'tafsir' | 'topic' | 'ayah_theme' | 'hadith' | 'verification';
  resultId: string;
  title: string;
  subtitle?: string | null;
  snippet: string;
  score?: number;
  reference: {
    surahNumber?: number | null;
    ayahNumber?: number | null;
    verseKey?: string | null;
    hadithRecordId?: string | null;
    collectionKey?: string | null;
  };
  target: {
    route: string;
    surahNumber?: number | null;
    ayahNumber?: number | null;
    verseKey?: string | null;
    translationTextId?: string | null;
    passageId?: string | null;
    topicId?: string | null;
    sourceTopicKey?: string | null;
    themeGroupId?: string | null;
    hadithRecordId?: string | null;
    collectionKey?: string | null;
    sourceHadithNumber?: string | null;
    languageCode?: string | null;
  };
  deepLinks?: RafiqDeepLink[];
  openGuidanceTarget?: SourceToGuidanceTarget | null;
};

export type PrivateRetrievalTraceSummary = {
  traceId: string;
  traceType: string;
  reviewStatus: string;
};

export type PrivateSearchResponse = {
  notice: PrivateContentNotice;
  query: {
    text: string | null;
    domain: PrivateSearchDomain | string;
    mode?: RafiqSearchMode;
  };
  pagination: {
    limit: number;
    offset: number;
    total: number;
  };
  facets: Record<string, number>;
  retrievalTrace: PrivateRetrievalTraceSummary;
  results: PrivateSearchResult[];
};

export type PrivateSourceSearchGroup = {
  groupKey: PrivateSourceSearchGroupKey;
  label: string;
  total: number;
  results: PrivateSearchResult[];
};

export type PrivateSourceSearchResponse = {
  notice: PrivateContentNotice;
  query: {
    text: string | null;
    domain: PrivateSourceSearchDomain | string;
    mode: 'sources';
  };
  pagination: {
    limit: number;
    offset: number;
    total: number;
  };
  facets: Record<string, number>;
  retrievalTrace: PrivateRetrievalTraceSummary;
  groups: PrivateSourceSearchGroup[];
  results: PrivateSearchResult[];
};

export type PrivateRetrievalTraceResponse = {
  notice: PrivateContentNotice;
  trace: {
    traceId: string;
    traceType: string;
    queryText?: string | null;
    domainFilter: string;
    limit: number;
    offset: number;
    totalResults: number;
    returnedResultIds: string[];
    facets: Record<string, number>;
    source: string;
    reviewStatus: string;
    createdAt: string;
  };
};

export type PrivateReviewQueueItem = {
  queueItemId: string;
  queueType: 'retrieval_trace' | 'source_gap' | 'grade_assertion' | 'verification_claim';
  subjectType: string;
  subjectId: string;
  title: string;
  summary?: string | null;
  severity: 'low' | 'medium' | 'high';
  reviewStatus: string;
  source: string;
  evidence: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
};

export type PrivateReviewQueueResponse = {
  notice: PrivateContentNotice;
  query: {
    status: string;
    queueType?: string | null;
  };
  pagination: {
    limit: number;
    offset: number;
    total: number;
  };
  facets: Record<string, number>;
  items: PrivateReviewQueueItem[];
};

export type PrivateReviewQueueItemResponse = {
  notice: PrivateContentNotice;
  item: PrivateReviewQueueItem | null;
  retrievalTrace?: PrivateRetrievalTraceResponse['trace'] | null;
};

export type PrivateAnswerResponseState =
  | 'approved'
  | 'approved_with_disclaimer'
  | 'source_unavailable'
  | 'scholar_escalation'
  | 'safety_escalation'
  | 'blocked';

export type PrivateAnswerEvidenceItem = {
  citationId: string;
  domain: PrivateSearchResult['domain'];
  title: string;
  subtitle?: string | null;
  snippet: string;
  reference: PrivateSearchResult['reference'];
  target: PrivateSearchResult['target'];
  reviewStatus: string;
  publicReleaseStatus: string;
};

export type PrivateAnswerDraft = {
  answerDraftId: string;
  questionText: string;
  detectedIntent: string;
  requestedLanguage: string;
  domainFilter: string;
  responseState: PrivateAnswerResponseState;
  retrievalTraceId?: string | null;
  retrievedSourceIds: string[];
  evidenceItems: PrivateAnswerEvidenceItem[];
  validationGateResults: Record<string, unknown>;
  draftAnswer: string;
  modelName: string;
  policyVersion: string;
  reviewStatus: string;
  createdAt: string;
};

export type PrivateAnswerDraftResponse = {
  notice: PrivateContentNotice;
  answerDraft: PrivateAnswerDraft | null;
};

export type PrivateGuidedAnswerPromptStatus =
  | 'model_ready'
  | 'blocked_by_guardrail'
  | 'blocked_no_evidence';

export type PrivateGuidedAnswer = {
  guidedAnswerId: string;
  answerDraftId: string;
  promptVersion: string;
  promptStatus: PrivateGuidedAnswerPromptStatus;
  responseState: PrivateAnswerResponseState;
  systemPrompt: string;
  userPrompt: string;
  evidencePrompt: PrivateAnswerEvidenceItem[];
  guidedAnswer: string;
  citationIds: string[];
  modelProvider: string;
  modelName: string;
  reviewStatus: string;
  createdAt: string;
};

export type PrivateGuidedAnswerResponse = {
  notice: PrivateContentNotice;
  guidedAnswer: PrivateGuidedAnswer | null;
  answerDraft: PrivateAnswerDraft | null;
};

export type PrivateModelAdapterStatus =
  | 'disabled_by_configuration'
  | 'blocked_by_guardrail'
  | 'blocked_no_evidence'
  | 'adapter_ready_not_executed';

export type PrivateModelAdapterConfig = {
  providerEnabled: boolean;
  providerKey: string;
  modelName: string;
  executionMode: string;
  liveExecutionAllowed: boolean;
  status: 'disabled' | 'configured_dry_run';
};

export type PrivateModelAdapterRun = {
  modelAdapterRunId: string;
  guidedAnswerId: string;
  adapterStatus: PrivateModelAdapterStatus;
  providerKey: string;
  modelName: string;
  providerEnabled: boolean;
  executionMode: string;
  refusalReason?: string | null;
  requestPayload: Record<string, unknown>;
  responsePayload: Record<string, unknown>;
  createdAt: string;
};

export type PrivateModelAdapterStatusResponse = {
  notice: PrivateContentNotice;
  modelAdapter: PrivateModelAdapterConfig;
};

export type PrivateModelAdapterRunResponse = {
  notice: PrivateContentNotice;
  modelAdapterRun: PrivateModelAdapterRun | null;
  guidedAnswer: PrivateGuidedAnswer | null;
};

export type PrivateAnswerValidationStatus =
  | 'passed_private_review_required'
  | 'failed_missing_citations'
  | 'failed_uncited_claims'
  | 'blocked_by_adapter'
  | 'blocked_by_guardrail';

export type PrivateReviewerActionStatus =
  | 'queued'
  | 'approved_for_internal_testing'
  | 'needs_correction'
  | 'deferred'
  | 'rejected';

export type PrivateAnswerValidationRun = {
  answerValidationRunId: string;
  guidedAnswerId: string;
  modelAdapterRunId?: string | null;
  candidateAnswer: string;
  validationStatus: PrivateAnswerValidationStatus;
  citationIds: string[];
  citedSourceIds: string[];
  missingCitationIds: string[];
  uncitedClaimFlags: Array<Record<string, unknown>>;
  validationResults: Record<string, unknown>;
  reviewerActionStatus: PrivateReviewerActionStatus;
  reviewerNotes?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type PrivateAnswerValidationRunResponse = {
  notice: PrivateContentNotice;
  answerValidationRun: PrivateAnswerValidationRun | null;
  guidedAnswer: PrivateGuidedAnswer | null;
  modelAdapterRun: PrivateModelAdapterRun | null;
};

export type PrivateSourceReleaseState = {
  entityVersion?: string | null;
  technicalStatus?: string | null;
  rightsStatus?: string | null;
  attributionStatus?: string | null;
  editorialStatus?: string | null;
  scholarContentStatus?: string | null;
  publicationStatus?: string | null;
  effectiveFrom?: string | null;
  effectiveTo?: string | null;
  notes?: string | null;
};

export type PrivateSourceProvenanceItem = {
  provenanceId: string;
  stagingTable: string;
  stagingRecordId: string;
  provenanceRole: string;
  mappingMethod: string;
  createdAt: string;
  source: {
    sourceKey?: string | null;
    name?: string | null;
    provider?: string | null;
    domain?: string | null;
    officialUrl?: string | null;
    repositoryUrl?: string | null;
    documentationUrl?: string | null;
    authorityClass?: string | null;
  };
  snapshot: {
    snapshotId?: string | null;
    snapshotKey?: string | null;
    upstreamVersion?: string | null;
    acquiredAt?: string | null;
    acquisitionMethod?: string | null;
    licenseName?: string | null;
    licenseUrl?: string | null;
    attributionText?: string | null;
    technicalStatus?: string | null;
    rightsStatus?: string | null;
    attributionStatus?: string | null;
    contentStatus?: string | null;
    publicationStatus?: string | null;
    aggregateSha256?: string | null;
    fileCount?: number | null;
    totalBytes?: number | null;
    rawObjectCount?: number | null;
  };
};

export type PrivateSourceDetail = SourceDetailTarget & {
  title: string;
  subtitle?: string | null;
  releaseState?: PrivateSourceReleaseState | null;
  provenanceCount: number;
  provenance: PrivateSourceProvenanceItem[];
};

export type PrivateSourceDetailResponse = {
  notice: PrivateContentNotice;
  sourceDetail: PrivateSourceDetail;
};

export type PrivateKnowledgeGraphifyLowScoringCase = {
  caseId: string;
  caseGroup: string;
  score: number;
  threshold: number;
  failedSignals: string[];
};

export type PrivateKnowledgeGraphifyRemediation = {
  caseId: string;
  caseGroup: string;
  signal: string;
  remediation: string;
  severity: string;
};

export type PrivateKnowledgeGraphifyCaseExplorerItem = {
  caseId: string;
  caseGroup: string;
  caseType: string;
  scoringMode: string;
  critical: boolean;
  prompt: string;
  status: string | null;
  riskClass: string | null;
  verificationStatus: string | null;
  score: number | null;
  pass: boolean | null;
  threshold: number | null;
  detectedTheme: string | null;
  detectedIntent: string | null;
  evidenceCount: number;
  quranAnchor: string | null;
  tafsirRoute: string | null;
  sourceSearchRoute: string | null;
  graphNodeIds: string[];
  vaultPackPath: string;
};

export type PrivateKnowledgeGraphifyNodeExplorerItem = {
  nodeId: string;
  type: string;
  label: string;
  releaseState: string;
  reviewState: string;
  qualityState: string;
  publicSafe: boolean;
};

export type PrivateKnowledgeGraphifyEdgeExplorerItem = {
  edgeId: string;
  type: string;
  from: string;
  to: string;
  releaseState: string;
  publicSafe: boolean;
};

export type PrivateKnowledgeGraphifyVaultPackExplorerItem = {
  caseId: string;
  title: string;
  path: string;
  score: number | null;
  pass: boolean | null;
  publicSafe: boolean;
  preview: string;
  headings: string[];
};

export type PrivateKnowledgeGraphifyCp21cResponse = {
  notice: PrivateContentNotice;
  verifier: {
    status: 'pass';
    command: string;
    checkpoint: string;
  };
  artifactPaths: {
    matrix: string;
    evidence: string;
    graph: string;
    rankingSummary: string;
    vaultPacks: string;
  };
  scaleBoundary: {
    isFullRafiqResourceGraph: false;
    message: string;
  };
  matrix: {
    caseCount: number;
    ordinaryCaseCount: number;
    escalationCaseCount: number;
  };
  graph: {
    graphId: string;
    nodeCount: number;
    edgeCount: number;
    publicSafeNodeCount: number;
    publicSafeEdgeCount: number;
  };
  vault: {
    packCount: number;
    publicSafePackCount: number;
  };
  rankingSummary: {
    status: string;
    ordinaryAverageScore: number;
    ordinaryAverageMinimum: number;
    ordinaryAveragePass: boolean;
    criticalCaseMinimum: number;
    criticalCaseMinimumPass: boolean;
    lowScoringCaseCount: number;
    remediationCount: number;
  };
  escalation: {
    caseCount: number;
    boundaryPassCount: number;
  };
  caseExplorer: PrivateKnowledgeGraphifyCaseExplorerItem[];
  graphExplorer: {
    nodeSamples: PrivateKnowledgeGraphifyNodeExplorerItem[];
    edgeSamples: PrivateKnowledgeGraphifyEdgeExplorerItem[];
    typeCounts: Record<string, number>;
  };
  vaultExplorer: {
    packs: PrivateKnowledgeGraphifyVaultPackExplorerItem[];
  };
  lowScoringCases: PrivateKnowledgeGraphifyLowScoringCase[];
  remediationList: PrivateKnowledgeGraphifyRemediation[];
  publicSafeBoundary: {
    publicSafe: false;
    publicReleaseApproved: false;
    message: string;
  };
};

export type PrivateKnowledgeGraphifyCp22PartitionSummary = {
  name: string;
  nodeCount: number;
  edgeCount: number;
  publicSafeNodeCount: number;
  publicSafeEdgeCount: number;
  checksumSha256: string;
};

export type PrivateKnowledgeGraphifyCp22NodeExplorerItem = {
  nodeId: string;
  type: string;
  label: string;
  partition: string;
  canonicalRef: string | null;
  sourceRefs: string[];
  provenanceRefs: string[];
  releaseStateRefs: string[];
  releaseState: string;
  reviewState: string;
  qualityState: string;
  accessLevel: string;
  publicSafe: boolean;
  metadata: Record<string, unknown>;
};

export type PrivateKnowledgeGraphifyCp22EdgeExplorerItem = {
  edgeId: string;
  type: string;
  from: string;
  to: string;
  fromPartition: string | null;
  toPartition: string | null;
  releaseState: string;
  reviewState: string;
  accessLevel: string;
  publicSafe: boolean;
  sourceRefs: string[];
  evidenceRefs: string[];
  metadata: Record<string, unknown>;
};

export type PrivateKnowledgeGraphifyCp22PartitionExplorerItem = PrivateKnowledgeGraphifyCp22PartitionSummary & {
  nodeSamples: PrivateKnowledgeGraphifyCp22NodeExplorerItem[];
  edgeSamples: PrivateKnowledgeGraphifyCp22EdgeExplorerItem[];
  nodeTypeCounts: Record<string, number>;
  edgeTypeCounts: Record<string, number>;
};

export type PrivateKnowledgeGraphifyCp22VaultPackExplorerItem = {
  artifactId: string;
  artifactType: string;
  title: string;
  category: string;
  path: string;
  publicSafe: boolean;
  graphNodeIds: string[];
  canonicalRefs: string[];
  sourceRefs: string[];
  preview: string;
  headings: string[];
};

export type PrivateKnowledgeGraphifyCp22LookupPath = {
  lookupType: 'ayah' | 'hadith' | 'source' | 'topic';
  key: string;
  label: string;
  graphNodeIds: string[];
  route: string | null;
};

export type PrivateKnowledgeGraphifyCp22Response = {
  notice: PrivateContentNotice;
  verifier: {
    status: 'pass';
    command: string;
    checkpoint: string;
  };
  artifactPaths: {
    graphManifest: string;
    graphSummary: string;
    graphPartitions: string;
    graphIndexes: string;
    vaultManifest: string;
    vaultPacks: string;
  };
  graph: {
    graphId: string;
    checkpoint: string;
    nodeCount: number;
    edgeCount: number;
    partitionCount: number;
    indexCount: number;
    publicSafeNodeCount: number;
    publicSafeEdgeCount: number;
    sourceGraphChecksumSha256: string | null;
  };
  vault: {
    vaultId: string;
    checkpoint: string;
    artifactCount: number;
    categoryCount: number;
    publicSafeArtifactCount: number;
    graphNodesReferenced: number;
  };
  partitionExplorer: {
    partitions: PrivateKnowledgeGraphifyCp22PartitionExplorerItem[];
    selectedByDefault: string;
  };
  graphExplorer: {
    typeCounts: Record<string, number>;
    releaseStateCounts: Record<string, number>;
    reviewStateCounts: Record<string, number>;
    qualityStateCounts: Record<string, number>;
    publicBoundary: {
      publicSafeNodes: number;
      publicSafeEdges: number;
      publicReleaseApproved: false;
    };
  };
  lookupPaths: PrivateKnowledgeGraphifyCp22LookupPath[];
  vaultExplorer: {
    categoryCounts: Record<string, number>;
    packs: PrivateKnowledgeGraphifyCp22VaultPackExplorerItem[];
  };
  publicSafeBoundary: {
    publicSafe: false;
    publicReleaseApproved: false;
    message: string;
  };
};

export type PrivateCp23GraphMode =
  | 'off'
  | 'explain_only'
  | 'expand_candidates'
  | 'rank_and_explain';

export type PrivateCp23SelectionState =
  | 'selected'
  | 'candidate'
  | 'rejected'
  | 'requires_review'
  | 'requires_escalation';

export type PrivateCp23ValidationImpact =
  | 'supports'
  | 'blocks'
  | 'warns'
  | 'escalates'
  | 'informational';

export type PrivateCp23EvidenceCandidate = {
  candidateId: string;
  canonicalRef: string;
  contentType: string;
  graphNodeIds: string[];
  graphEdgeIds: string[];
  sourceIds: string[];
  provenanceIds: string[];
  releaseStateIds: string[];
  qualityState: string;
  reviewState: string;
  publicSafe: false;
  vaultPackIds: string[];
  rankingSignals: string[];
  selectionState: PrivateCp23SelectionState;
  selectionReason: string;
};

export type PrivateCp23EvidenceRouteItem = {
  routeItemId: string;
  role: string;
  canonicalRef: string;
  graphNodeIds: string[];
  graphEdgeIds: string[];
  sourceIds: string[];
  provenanceIds: string[];
  releaseStateIds: string[];
  vaultPackIds: string[];
  selectionState: PrivateCp23SelectionState;
  selectionReason: string;
  validationImpact: PrivateCp23ValidationImpact;
};

export type PrivateCp23EvidenceRoute = {
  evidenceRouteId: string;
  retrievalTraceId: string;
  queryText: string;
  intent: string;
  domain: string;
  graphMode: PrivateCp23GraphMode;
  selectedEvidence: PrivateCp23EvidenceRouteItem[];
  rejectedEvidence: PrivateCp23EvidenceRouteItem[];
  escalationEvidence: PrivateCp23EvidenceRouteItem[];
  validationGateResults: Array<{
    gate: string;
    status: string;
    graphLinked: boolean;
    notes: string;
  }>;
  answerDraftId?: string | null;
  guidedAnswerId?: string | null;
  modelAdapterRunId?: string | null;
  answerValidationRunId?: string | null;
  reviewQueueItemIds: string[];
  createdAt: string;
};

export type PrivateCp23ReviewQueueItem = {
  queueItemId: string;
  queueType: string;
  subjectType: string;
  subjectId: string;
  title: string;
  summary: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  reviewStatus: string;
  assignedRole: string;
  sourceIds: string[];
  graphNodeIds: string[];
  graphEdgeIds: string[];
  vaultPackIds: string[];
  evidenceRouteIds: string[];
  remediationIds: string[];
  createdAt: string;
  updatedAt: string;
};

export type PrivateCp23RemediationItem = {
  remediationId: string;
  queueItemId: string;
  subjectType: string;
  subjectId: string;
  reason: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  issueType?: string;
  canonicalRefs?: string[];
  sourceIds?: string[];
  requiredAction: string;
  verificationMethod?: string;
  blockingStatus?: string;
  closurePath?: string;
  closureNotes?: string | null;
  graphNodeIds: string[];
  graphEdgeIds: string[];
  vaultPackIds: string[];
  ownerRole: string;
  status: string;
};

export type PrivateCp23ReviewAuditEvent = {
  auditEventId: string;
  eventType: string;
  actorRole: string;
  action?: string;
  fromStatus?: string;
  toStatus?: string;
  reviewerRole?: string;
  reviewerId?: string | null;
  subjectType: string;
  subjectId: string;
  evidenceRouteId?: string | null;
  queueItemId?: string | null;
  sourceIds?: string[];
  graphNodeIds: string[];
  graphEdgeIds: string[];
  vaultPackIds?: string[];
  remediationIds?: string[];
  notes: string;
  createdAt: string;
};

export type PrivateCp23ReviewerExportManifest = {
  exportId: string;
  checkpoint: 'CP23-A07';
  generatedAt: string;
  sourceCheckpoint: string;
  sourceGraphId: string;
  sourceGraphChecksumSha256: string | null;
  privateOnly: true;
  publicReleaseApproved: false;
  artifactPaths: {
    manifest: string;
    auditTrail: string;
    remediation: string;
  };
  counts: {
    auditEvents: number;
    remediationItems: number;
    highOrCriticalRemediationItems: number;
    openBlockingRemediationItems: number;
  };
  verifier: {
    command: string;
    status: 'pass';
  };
};

export type PrivateCp23ReviewerExports = {
  manifest: PrivateCp23ReviewerExportManifest;
  auditTrail: PrivateCp23ReviewAuditEvent[];
  remediation: PrivateCp23RemediationItem[];
};

export type PrivateReviewWorkbenchCp23Response = {
  notice: PrivateContentNotice;
  verifier: {
    status: 'pass';
    command: string;
    checkpoint: 'CP23-A06' | 'CP23-A07';
  };
  prototype: {
    checkpoint: 'CP23-A06';
    implementationMode: 'bounded_private_read_only';
    codeMutatesCanonicalContent: false;
    publicReleaseApproved: false;
    graphId: string;
    graphChecksumSha256: string | null;
    sourceCheckpoint: string;
    apiRoute: string;
    uiRoute: string;
  };
  retrieval: {
    graphMode: PrivateCp23GraphMode;
    requestDefaults: {
      maxInitialCandidates: number;
      maxExpandedCandidates: number;
      maxEvidenceRouteItems: number;
      requirePublicSafeFalse: true;
    };
    graphProof: {
      graphNodeCount: number;
      graphEdgeCount: number;
      vaultPackCount: number;
      publicSafeNodeCount: number;
      publicSafeEdgeCount: number;
      publicSafeArtifactCount: number;
    };
    candidates: PrivateCp23EvidenceCandidate[];
    selectedCandidateIds: string[];
    rejectedCandidateIds: string[];
    requiresReviewCandidateIds: string[];
  };
  evidenceRoutes: PrivateCp23EvidenceRoute[];
  reviewWorkbench: {
    route: string;
    queueSummary: Record<string, number>;
    roleSummary: Record<string, number>;
    items: PrivateCp23ReviewQueueItem[];
    screenMap: string[];
  };
  remediationItems: PrivateCp23RemediationItem[];
  auditEvents: PrivateCp23ReviewAuditEvent[];
  reviewerExports?: PrivateCp23ReviewerExports;
  uiPayloadBoundary: {
    route: string;
    payloadBoundary: string;
    graphNodesExposedToUi: string;
    maxCandidates: number;
    maxEvidenceRoutes: number;
    maxQueueItems: number;
    maxRemediationItems: number;
  };
  publicSafeBoundary: {
    publicSafe: false;
    publicReleaseApproved: false;
    publicSafeCandidateCount: 0;
    message: string;
  };
};

export type PrivateCp24RetrievalIntent =
  | 'guidance'
  | 'learning'
  | 'search'
  | 'reflection'
  | 'journal'
  | 'ruling'
  | 'medical'
  | 'legal'
  | 'crisis'
  | 'other';

export type PrivateCp24RetrievalDomain =
  | 'all'
  | 'quran'
  | 'translation'
  | 'tafsir'
  | 'hadith'
  | 'source'
  | 'topic'
  | 'validation';

export type PrivateCp24GraphMode = PrivateCp23GraphMode;

export type PrivateCp24GraphExpansionRequest = {
  maxDepth: 0 | 1 | 2;
  allowedNodeTypes: string[];
  allowedEdgeTypes: string[];
  requireSourceRefs: true;
  requireProvenanceRefs: true;
  requireReleaseRefs: true;
  includeVaultPackRefs: true;
};

export type PrivateCp24ReleaseBoundaryRequest = {
  mode: 'private_internal';
  allowPublicBlocked: true;
  allowRejected: false;
  publicSafeOnly: false;
};

export type PrivateCp24QualityBoundaryRequest = {
  allowWarning: boolean;
  allowWithheld: false;
  requireReviewForWarning: true;
};

export type PrivateCp24OutputCaps = {
  maxInitialCandidates: number;
  maxExpandedCandidates: number;
  maxGraphNodes: number;
  maxGraphEdges: number;
  maxEvidenceRouteItems: number;
  maxVaultPackRefs: number;
};

export type PrivateCp24GraphAwareRetrievalRequest = {
  queryText: string;
  fixtureId?: string | null;
  intent?: PrivateCp24RetrievalIntent;
  language?: string;
  domain?: PrivateCp24RetrievalDomain;
  limit?: number;
  offset?: number;
  graphMode: PrivateCp24GraphMode;
  graphExpansion: PrivateCp24GraphExpansionRequest;
  releaseBoundary: PrivateCp24ReleaseBoundaryRequest;
  qualityBoundary: PrivateCp24QualityBoundaryRequest;
  outputCaps?: PrivateCp24OutputCaps;
};

export type PrivateCp24ContentType =
  | 'quran_ayah'
  | 'quran_ayah_text'
  | 'translation_text'
  | 'tafsir_passage'
  | 'hadith_record'
  | 'hadith_text_version'
  | 'hadith_grade_assertion'
  | 'hadith_verification_claim'
  | 'source_topic'
  | 'source'
  | 'validation_finding'
  | 'review_workflow'
  | 'public_boundary';

export type PrivateCp24QualityState =
  | 'clean'
  | 'warning'
  | 'unverified'
  | 'withheld';

export type PrivateCp24ReviewState =
  | 'not_required'
  | 'pending'
  | 'technical_review'
  | 'content_review'
  | 'scholar_review'
  | 'product_owner_review'
  | 'remediation_required'
  | 'resolved_private'
  | 'approved_public_candidate'
  | 'rejected'
  | 'retired'
  | 'deferred';

export type PrivateCp24SelectionState =
  | 'selected'
  | 'candidate'
  | 'held'
  | 'rejected'
  | 'requires_review'
  | 'requires_escalation';

export type PrivateCp24RankingSignal =
  | 'text_match'
  | 'source_declared_relation'
  | 'imported_relation'
  | 'ayah_tafsir_adjacency'
  | 'translation_edition_available'
  | 'hadith_grade_context'
  | 'topic_candidate_match'
  | 'quality_warning'
  | 'release_blocker'
  | 'validation_history'
  | 'vault_context_available'
  | 'graph_neighbor_available'
  | 'source_refs_complete'
  | 'provenance_refs_complete'
  | 'release_refs_complete'
  | 'missing_source_ref'
  | 'missing_provenance_ref'
  | 'missing_release_ref'
  | 'escalation_sensitive_intent';

export type PrivateCp24RankingExplanation = {
  signal: PrivateCp24RankingSignal;
  weight: number;
  scoreImpact: number;
  explanation: string;
  authorityBoundary: 'operational_relevance_only';
};

export type PrivateCp24EvidenceCandidate = {
  candidateId: string;
  canonicalRef: string;
  contentType: PrivateCp24ContentType;
  graphNodeIds: string[];
  graphEdgeIds: string[];
  sourceIds: string[];
  provenanceIds: string[];
  releaseStateIds: string[];
  qualityState: PrivateCp24QualityState;
  reviewState: PrivateCp24ReviewState;
  publicSafe: false;
  vaultPackIds: string[];
  rankingSignals: PrivateCp24RankingSignal[];
  rankingExplanations: PrivateCp24RankingExplanation[];
  ordinaryScore: number | null;
  escalationOutcome: PrivateCp24EscalationOutcome | null;
  selectionState: PrivateCp24SelectionState;
  selectionReason: string;
  rejectionReason?: string | null;
};

export type PrivateCp24EvidenceRouteRole =
  | 'quran_anchor'
  | 'translation_context'
  | 'tafsir_context'
  | 'hadith_support'
  | 'hadith_grade_context'
  | 'topic_context'
  | 'source_context'
  | 'quality_context'
  | 'release_context'
  | 'validation_context'
  | 'public_boundary_context'
  | 'escalation_context';

export type PrivateCp24EvidenceRouteItem = {
  routeItemId: string;
  candidateId: string;
  role: PrivateCp24EvidenceRouteRole;
  canonicalRef: string;
  graphNodeIds: string[];
  graphEdgeIds: string[];
  sourceIds: string[];
  provenanceIds: string[];
  releaseStateIds: string[];
  vaultPackIds: string[];
  selectionState: PrivateCp24SelectionState;
  selectionReason: string;
  validationImpact: PrivateCp23ValidationImpact;
};

export type PrivateCp24ValidationGateResult = {
  gate:
    | 'intent'
    | 'source_retrieval'
    | 'quran_reference'
    | 'translation'
    | 'tafsir'
    | 'hadith_reference'
    | 'grade'
    | 'fatwa_boundary'
    | 'medical_legal_crisis'
    | 'personalization'
    | 'final_citation';
  status: 'pass' | 'warn' | 'fail' | 'blocked' | 'requires_review' | 'escalated';
  graphLinked: boolean;
  evidenceRouteItemIds: string[];
  remediationIds: string[];
  notes: string;
};

export type PrivateCp24EscalationOutcome =
  | 'scholar_escalation'
  | 'safety_escalation'
  | 'source_unavailable'
  | 'blocked'
  | 'approved_with_disclaimer'
  | 'approved';

export type PrivateCp24EvidenceRoute = {
  evidenceRouteId: string;
  retrievalTraceId: string;
  queryText: string;
  intent: PrivateCp24RetrievalIntent;
  domain: PrivateCp24RetrievalDomain;
  graphMode: PrivateCp24GraphMode;
  selectedEvidence: PrivateCp24EvidenceRouteItem[];
  rejectedEvidence: PrivateCp24EvidenceRouteItem[];
  escalationEvidence: PrivateCp24EvidenceRouteItem[];
  validationGateResults: PrivateCp24ValidationGateResult[];
  escalationOutcomes: PrivateCp24EscalationOutcome[];
  answerDraftId?: string | null;
  guidedAnswerId?: string | null;
  modelAdapterRunId?: string | null;
  answerValidationRunId?: string | null;
  reviewQueueItemIds: string[];
  remediationIds: string[];
  createdAt: string;
};

export type PrivateCp24ValidationHandoff = {
  evidenceRouteId: string;
  requiredGates: PrivateCp24ValidationGateResult['gate'][];
  selectedEvidenceRouteItemIds: string[];
  selectedCanonicalRefs: string[];
  selectedGraphNodeIds: string[];
  citedSourceIds: string[];
  missingCitationIds: string[];
  unresolvedReferenceIds: string[];
  escalationOutcomes: PrivateCp24EscalationOutcome[];
  remediationIds: string[];
  publicReleaseApproved: false;
};

export type PrivateCp24ReviewerHandoff = {
  queueItems: PrivateCp23ReviewQueueItem[];
  remediationItems: PrivateCp23RemediationItem[];
  auditEvents: PrivateCp23ReviewAuditEvent[];
  requiredReviewerRoles: Array<
    | 'technical_reviewer'
    | 'knowledge_editor'
    | 'scholar_reviewer'
    | 'product_owner'
    | 'admin'
    | 'developer_private'
  >;
  openBlockingRemediationCount: number;
};

export type PrivateCp24GraphProof = {
  graphId: 'rafiq-full-private-resource-graph';
  graphChecksumSha256: string;
  vaultId: 'rafiq-full-private-knowledge-vault';
  sourceCheckpoint: 'CP22-G10';
  partitionNames: string[];
  indexNames: string[];
  resolvedGraphNodeCount: number;
  resolvedGraphEdgeCount: number;
  resolvedVaultPackCount: number;
};

export type PrivateCp24PublicBoundary = {
  privateOnly: true;
  publicSafeCandidateCount: 0;
  publicSafeGraphNodeCount: 0;
  publicSafeGraphEdgeCount: 0;
  publicSafeVaultArtifactCount: 0;
  publicReleaseApproved: false;
  publicRouteExposed: false;
  message: string;
};

export type PrivateCp24GraphAwareRetrievalResponse = {
  notice: PrivateContentNotice;
  checkpoint: 'CP24-G02' | 'CP24-G03' | 'CP24-G04' | 'CP24-G05' | 'CP24-G06' | 'CP24-G07';
  route: 'POST /api/private-content/graph-aware-retrieval/cp24';
  retrievalTraceId: string;
  graphMode: PrivateCp24GraphMode;
  query: {
    text: string;
    fixtureId?: string | null;
    intent: PrivateCp24RetrievalIntent;
    domain: PrivateCp24RetrievalDomain;
    language?: string | null;
  };
  outputCaps: PrivateCp24OutputCaps;
  candidates: PrivateCp24EvidenceCandidate[];
  selectedCandidateIds: string[];
  heldCandidateIds: string[];
  rejectedCandidateIds: string[];
  requiresReviewCandidateIds: string[];
  requiresEscalationCandidateIds: string[];
  evidenceRoute: PrivateCp24EvidenceRoute;
  validationHandoff: PrivateCp24ValidationHandoff;
  reviewerHandoff: PrivateCp24ReviewerHandoff;
  graphProof: PrivateCp24GraphProof;
  publicBoundary: PrivateCp24PublicBoundary;
};

export type PrivateCp25ReviewerRole =
  | 'technical_reviewer'
  | 'knowledge_editor'
  | 'scholar_reviewer'
  | 'product_owner'
  | 'admin'
  | 'developer_private';

export type PrivateCp25ReviewStatus =
  | 'queued'
  | 'in_review'
  | 'technical_review'
  | 'content_review'
  | 'scholar_review'
  | 'product_owner_review'
  | 'remediation_required'
  | 'resolved_private'
  | 'approved_public_candidate'
  | 'rejected'
  | 'retired'
  | 'deferred';

export type PrivateCp25ReviewerAction =
  | 'claim'
  | 'request_technical_review'
  | 'request_content_review'
  | 'request_scholar_review'
  | 'request_product_owner_review'
  | 'request_remediation'
  | 'approve_private'
  | 'mark_public_candidate'
  | 'reject'
  | 'defer'
  | 'retire';

export type PrivateCp25ReviewQueueType =
  | 'retrieval_trace'
  | 'source_gap'
  | 'grade_assertion'
  | 'verification_claim'
  | 'answer_validation'
  | 'graph_quality'
  | 'vault_pack'
  | 'release_boundary'
  | 'escalation'
  | 'remediation'
  | 'hadith_record';

export type PrivateCp25ReviewSubjectType =
  | 'retrieval_trace'
  | 'evidence_route'
  | 'route_item'
  | 'candidate'
  | 'graph_node'
  | 'graph_edge'
  | 'vault_pack'
  | 'guided_answer'
  | 'answer_validation_run'
  | 'remediation'
  | 'public_boundary';

export type PrivateCp25RemediationStatus =
  | 'open'
  | 'assigned'
  | 'in_progress'
  | 'blocked'
  | 'resolved_private'
  | 'deferred'
  | 'rejected'
  | 'retired';

export type PrivateCp25Severity = 'low' | 'medium' | 'high' | 'critical';

export type PrivateCp25PublicBoundary = {
  privateOnly: true;
  publicReleaseApproved: false;
  publicRouteExposed: false;
  publicSafeChangeRequested: false;
  publicSafeCandidateCount: 0;
  publicSafeRouteItemCount: 0;
  publicSafeGraphNodeCount: 0;
  publicSafeGraphEdgeCount: 0;
  publicSafeVaultArtifactCount: 0;
  message: string;
};

export type PrivateCp25ReviewQueueItem = {
  queueItemId: string;
  queueType: PrivateCp25ReviewQueueType;
  subjectType: PrivateCp25ReviewSubjectType;
  subjectId: string;
  title: string;
  summary: string;
  severity: PrivateCp25Severity;
  reviewStatus: PrivateCp25ReviewStatus;
  assignedRole: PrivateCp25ReviewerRole;
  sourceIds: string[];
  graphNodeIds: string[];
  graphEdgeIds: string[];
  vaultPackIds: string[];
  evidenceRouteIds: string[];
  routeItemIds: string[];
  candidateIds: string[];
  remediationIds: string[];
  requiredActions: PrivateCp25ReviewerAction[];
  notesRequired: boolean;
  publicReleaseApproved: false;
  createdAt: string;
  updatedAt: string;
};

export type PrivateCp25RemediationState = {
  remediationId: string;
  queueItemId: string;
  sourceCp24RemediationId: string;
  evidenceRouteId: string;
  subjectType: PrivateCp25ReviewSubjectType;
  subjectId: string;
  issueType: string;
  severity: PrivateCp25Severity;
  status: PrivateCp25RemediationStatus;
  ownerRole: PrivateCp25ReviewerRole;
  requiredAction: string;
  blockingStatus: 'blocking' | 'review_required' | 'deferred' | 'resolved_private' | 'rejected';
  targetCanonicalRefs: string[];
  sourceIds: string[];
  graphNodeIds: string[];
  graphEdgeIds: string[];
  vaultPackIds: string[];
  closureNotes?: string | null;
  closureProof?: string | null;
  publicReleaseApproved: false;
  createdAt: string;
  updatedAt: string;
};

export type PrivateCp25ReviewerActionRequest = {
  queueItemId: string;
  remediationId?: string | null;
  subjectType: PrivateCp25ReviewSubjectType;
  subjectId: string;
  action: PrivateCp25ReviewerAction;
  fromStatus: PrivateCp25ReviewStatus | PrivateCp25RemediationStatus;
  reviewerRole: PrivateCp25ReviewerRole;
  reviewerId?: string | null;
  notes?: string | null;
  affectedSourceIds: string[];
  affectedGraphNodeIds: string[];
  affectedGraphEdgeIds: string[];
  affectedVaultPackIds: string[];
  affectedEvidenceRouteIds: string[];
  affectedRouteItemIds: string[];
  affectedCandidateIds: string[];
  affectedRemediationIds: string[];
  boundaryAcknowledgement: {
    privateOnly: true;
    publicReleaseApproved: false;
    publicSafeChangeRequested: false;
  };
};

export type PrivateCp25ReviewerActionValidation = {
  allowed: boolean;
  toStatus: PrivateCp25ReviewStatus | PrivateCp25RemediationStatus;
  notesRequired: boolean;
  missingRequiredNotes: boolean;
  invalidTransition: boolean;
  blockedReasons: string[];
  publicBoundary: PrivateCp25PublicBoundary;
};

export type PrivateCp25ReviewAuditEvent = {
  auditEventId: string;
  queueItemId: string;
  remediationId?: string | null;
  action: PrivateCp25ReviewerAction;
  fromStatus: PrivateCp25ReviewStatus | PrivateCp25RemediationStatus;
  toStatus: PrivateCp25ReviewStatus | PrivateCp25RemediationStatus;
  reviewerRole: PrivateCp25ReviewerRole;
  reviewerId?: string | null;
  notes: string;
  sourceIds: string[];
  graphNodeIds: string[];
  graphEdgeIds: string[];
  vaultPackIds: string[];
  evidenceRouteIds: string[];
  routeItemIds: string[];
  candidateIds: string[];
  remediationIds: string[];
  publicReleaseApproved: false;
  createdAt: string;
};

export type PrivateCp25ReviewerActionResponse = {
  notice: PrivateContentNotice;
  checkpoint: 'CP25-A02' | 'CP25-A03' | 'CP25-A04' | 'CP25-A05' | 'CP25-A06' | 'CP25-A07';
  route: 'POST /api/private-content/reviewer-workbench/cp25/actions';
  request: PrivateCp25ReviewerActionRequest;
  validation: PrivateCp25ReviewerActionValidation;
  queueItem: PrivateCp25ReviewQueueItem;
  remediationState?: PrivateCp25RemediationState | null;
  auditEvent: PrivateCp25ReviewAuditEvent;
  publicBoundary: PrivateCp25PublicBoundary;
};

export type PrivateCp25WorkbenchStateResponse = {
  notice: PrivateContentNotice;
  checkpoint: 'CP25-A02' | 'CP25-A03' | 'CP25-A04' | 'CP25-A05' | 'CP25-A06' | 'CP25-A07';
  route: 'GET /api/private-content/reviewer-workbench/cp25';
  sourceCheckpoint: 'CP24-G09';
  queueItems: PrivateCp25ReviewQueueItem[];
  remediationStates: PrivateCp25RemediationState[];
  auditEvents: PrivateCp25ReviewAuditEvent[];
  counts: {
    queueItemCount: number;
    remediationStateCount: number;
    auditEventCount: number;
    highOrCriticalCount: number;
    openBlockingCount: number;
    publicSafeCandidateCount: 0;
    publicSafeRouteItemCount: 0;
  };
  publicBoundary: PrivateCp25PublicBoundary;
};

export type PrivateCp26SnapshotGroupKey =
  | 'source_registry'
  | 'raw_lineage'
  | 'quran'
  | 'translations'
  | 'tafsir'
  | 'topics_themes'
  | 'hadith'
  | 'hadith_quality'
  | 'cross_domain_links'
  | 'private_retrieval'
  | 'private_review'
  | 'private_audit'
  | 'graph_vault_baseline';

export type PrivateCp26ArtifactFamily =
  | 'snapshot_input'
  | 'snapshot_manifest'
  | 'checksum_ledger'
  | 'graph_partition'
  | 'graph_index'
  | 'vault_manifest'
  | 'vault_pack'
  | 'retrieval_artifact'
  | 'review_artifact'
  | 'audit_artifact'
  | 'remediation_artifact'
  | 'diff_summary'
  | 'rollback_manifest'
  | 'unresolved_reference_report';

export type PrivateCp26ChecksumAlgorithm = 'sha256';

export type PrivateCp26PublicBoundaryStatus = {
  privateOnly: true;
  publicReleaseApproved: false;
  publicRouteExposed: false;
  publicSafeChangeRequested: false;
  publicSafeSnapshotRowCount: 0;
  publicSafeGraphNodeCount: 0;
  publicSafeGraphEdgeCount: 0;
  publicSafeVaultArtifactCount: 0;
  publicSafeRetrievalCandidateCount: 0;
  publicSafeRouteItemCount: 0;
  publicSafeReviewItemCount: 0;
  publicSafeAuditEventCount: 0;
  message: string;
};

export type PrivateCp26SnapshotArtifactRef = {
  artifactId: string;
  artifactFamily: PrivateCp26ArtifactFamily;
  path: string;
  checksumSha256: string;
  rowCount?: number;
  byteCount?: number;
  sourceSnapshotBatchId?: string;
  sourceCheckpoint?: string;
  canonicalRefs: string[];
  graphNodeIds: string[];
  graphEdgeIds: string[];
  vaultPackIds: string[];
  publicBoundary: PrivateCp26PublicBoundaryStatus;
};

export type PrivateCp26SnapshotSourceGroup = {
  groupKey: PrivateCp26SnapshotGroupKey;
  label: string;
  sourceTables: string[];
  sourceFiles: string[];
  snapshotPath: string;
  schemaVersion: string;
  rowCount: number;
  checksumSha256: string;
  canonicalRefCount: number;
  provenanceRefCount: number;
  releaseStateRefCount: number;
  unresolvedReferenceCount: number;
  qualityWarningCount: number;
  privateOnly: true;
  publicReleaseApproved: false;
  publicBoundary: PrivateCp26PublicBoundaryStatus;
  warnings: string[];
};

export type PrivateCp26ChecksumLedgerEntry = {
  entryId: string;
  artifactRef: PrivateCp26SnapshotArtifactRef;
  algorithm: PrivateCp26ChecksumAlgorithm;
  checksumSha256: string;
  computedAt: string;
  sourceSnapshotBatchId: string;
  status: 'new' | 'unchanged' | 'changed' | 'removed' | 'missing' | 'stale';
};

export type PrivateCp26ChecksumLedger = {
  schemaVersion: 'cp26.checksum-ledger.v1';
  sourceSnapshotBatchId: string;
  generatedAt: string;
  generatedBy: string;
  algorithm: PrivateCp26ChecksumAlgorithm;
  entries: PrivateCp26ChecksumLedgerEntry[];
  counts: {
    totalEntries: number;
    newCount: number;
    unchangedCount: number;
    changedCount: number;
    removedCount: number;
    missingCount: number;
    staleCount: number;
  };
  publicBoundary: PrivateCp26PublicBoundaryStatus;
};

export type PrivateCp26SnapshotBatchManifest = {
  schemaVersion: 'cp26.snapshot-batch-manifest.v1';
  snapshotBatchId: string;
  checkpoint:
    | 'CP26-S02'
    | 'CP26-S03'
    | 'CP26-S04'
    | 'CP26-S05'
    | 'CP26-S06'
    | 'CP26-S07'
    | 'CP26-S08';
  generatedAt: string;
  generatedBy: string;
  sourceCheckpoint: 'CP26-S01';
  sourceScope: string;
  privateOnly: true;
  publicReleaseApproved: false;
  sourceGroups: PrivateCp26SnapshotSourceGroup[];
  artifactRefs: PrivateCp26SnapshotArtifactRef[];
  checksumLedgerPath: string;
  checksumLedgerSha256: string;
  derivedOutputs: PrivateCp26SnapshotArtifactRef[];
  counts: {
    sourceGroupCount: number;
    snapshotArtifactCount: number;
    derivedOutputCount: number;
    unresolvedReferenceCount: number;
    highOrCriticalBlockerCount: number;
    publicSafeSnapshotRowCount: 0;
    publicSafeGraphNodeCount: 0;
    publicSafeGraphEdgeCount: 0;
    publicSafeVaultArtifactCount: 0;
  };
  publicBoundary: PrivateCp26PublicBoundaryStatus;
  warnings: string[];
};

export type PrivateCp26RefreshStatus =
  | 'not_started'
  | 'running'
  | 'pass'
  | 'fail'
  | 'blocked'
  | 'completed_with_unresolved_references'
  | 'rolled_back';

export type PrivateCp26RefreshRun = {
  refreshRunId: string;
  sourceSnapshotBatchId: string;
  sourceSnapshotManifestPath: string;
  sourceSnapshotManifestSha256: string;
  checkpoint: 'CP26-S04' | 'CP26-S05' | 'CP26-S06' | 'CP26-S07';
  startedAt: string;
  completedAt?: string | null;
  generatedBy: string;
  status: PrivateCp26RefreshStatus;
  refreshedOutputs: PrivateCp26SnapshotArtifactRef[];
  unresolvedReferenceReportPath?: string | null;
  rollbackManifestPath?: string | null;
  counts: {
    refreshedOutputCount: number;
    unresolvedReferenceCount: number;
    highOrCriticalBlockerCount: number;
    publicSafeSnapshotRowCount: 0;
    publicSafeGraphNodeCount: 0;
    publicSafeGraphEdgeCount: 0;
    publicSafeVaultArtifactCount: 0;
  };
  publicBoundary: PrivateCp26PublicBoundaryStatus;
};

export type PrivateCp26UnresolvedReference = {
  referenceId: string;
  referenceType:
    | 'source'
    | 'provenance'
    | 'release_state'
    | 'canonical_ref'
    | 'graph_node'
    | 'graph_edge'
    | 'vault_pack'
    | 'retrieval_candidate'
    | 'review_queue_item'
    | 'audit_event'
    | 'remediation';
  sourceGroupKey: PrivateCp26SnapshotGroupKey;
  severity: PrivateCp25Severity;
  blockingStatus: 'blocking' | 'review_required' | 'deferred';
  message: string;
  affectedArtifactIds: string[];
};

export type PrivateCp26UnresolvedReferenceReport = {
  schemaVersion: 'cp26.unresolved-reference-report.v1';
  sourceSnapshotBatchId: string;
  generatedAt: string;
  references: PrivateCp26UnresolvedReference[];
  counts: {
    total: number;
    blocking: number;
    reviewRequired: number;
    highOrCritical: number;
  };
  publicBoundary: PrivateCp26PublicBoundaryStatus;
};

export type PrivateCp26RollbackManifest = {
  schemaVersion: 'cp26.rollback-manifest.v1';
  rollbackManifestId: string;
  sourceSnapshotBatchId: string;
  refreshRunId: string;
  generatedAt: string;
  rollbackTarget: 'generated_private_artifacts_only';
  priorManifestRefs: PrivateCp26SnapshotArtifactRef[];
  restoreSteps: Array<{
    stepId: string;
    action: 'restore_artifact' | 'restore_manifest_pointer' | 'mark_refresh_rolled_back';
    targetPath: string;
    priorChecksumSha256: string;
    notes: string;
  }>;
  publicBoundary: PrivateCp26PublicBoundaryStatus;
};

export type PrivateCp26SnapshotStatusResponse = {
  notice: PrivateContentNotice;
  checkpoint: 'CP26-S06';
  route: 'GET /api/private-content/snapshots/cp26';
  sourceCheckpoint: 'CP26-S05';
  snapshot: {
    snapshotBatchId: string;
    checkpoint: string;
    generatedAt: string;
    manifestPath: string;
    manifestSha256: string;
    checksumLedgerPath: string;
    checksumLedgerSha256: string;
    sourceGroupCount: number;
    snapshotArtifactCount: number;
    unresolvedReferenceCount: number;
    highOrCriticalBlockerCount: number;
    publicSafeSnapshotRowCount: 0;
    publicSafeGraphNodeCount: 0;
    publicSafeGraphEdgeCount: 0;
    publicSafeVaultArtifactCount: 0;
  };
  checksum: {
    totalEntries: number;
    newCount: number;
    unchangedCount: number;
    changedCount: number;
    removedCount: number;
    missingCount: number;
    staleCount: number;
  };
  refresh: {
    refreshRunId: string;
    status: PrivateCp26RefreshStatus;
    refreshRunPath: string;
    refreshRunSha256: string;
    refreshedOutputCount: number;
    unresolvedReferenceCount: number;
    highOrCriticalBlockerCount: number;
  };
  diff: {
    proofId: string;
    manifestPath: string;
    manifestSha256: string;
    totalChecksumEntryCount: number;
    unchangedCount: number;
    addedCount: number;
    changedCount: number;
    removedCount: number;
    staleArtifactCount: number;
    mismatchedArtifactCount: number;
    detectedMismatchProbeCount: number;
  };
  unresolved: {
    reportPath: string;
    total: number;
    blocking: number;
    reviewRequired: number;
    highOrCritical: number;
    samples: PrivateCp26UnresolvedReference[];
  };
  rollback: {
    manifestPath: string;
    rollbackManifestId: string;
    rollbackTarget: 'generated_private_artifacts_only';
    restoreStepCount: number;
  };
  publicBoundary: PrivateCp26PublicBoundaryStatus;
};

export type PrivateCp27PublicBoundaryStatus = {
  privateOnly: true;
  publicReleaseApproved: false;
  publicRouteExposed: false;
  publicSafeChangeRequested: false;
  publicSafeSnapshotRowCount: 0;
  publicSafeGraphNodeCount: 0;
  publicSafeGraphEdgeCount: 0;
  publicSafeVaultArtifactCount: 0;
  publicSafeRetrievalCandidateCount: 0;
  publicSafeRouteItemCount: 0;
  publicSafeReviewItemCount: 0;
  publicSafeAuditEventCount: 0;
  message: string;
};

export type PrivateCp27ArtifactRef = {
  path: string;
  sha256?: string;
};

export type PrivateCp27PartitionInspectionSummary = {
  name: string;
  path: string;
  nodeCount: number;
  edgeCount: number;
  checksumSha256: string;
  publicSafeNodeCount: 0;
  publicSafeEdgeCount: 0;
};

export type PrivateCp27IndexInspectionSummary = {
  name: string;
  path: string;
  checksumSha256: string;
  entryCount: number;
};

export type PrivateCp27InternalUiInspectionResponse = {
  notice: PrivateContentNotice;
  checkpoint: 'CP27-G06';
  route: 'GET /api/private-content/knowledge-graphify/cp27';
  sourceCheckpoints: {
    graph: 'CP27-G03';
    vault: 'CP27-G04';
    diff: 'CP27-G05';
  };
  verifier: {
    status: 'pass';
    command: 'node scripts\\check_cp27_g06_internal_ui_proof.mjs';
    checkpoint: 'CP27-G06';
  };
  graph: {
    graphId: string;
    manifest: PrivateCp27ArtifactRef;
    summaryPath: string;
    checksumLedger: PrivateCp27ArtifactRef;
    nodeCount: number;
    edgeCount: number;
    partitionCount: number;
    indexCount: number;
    sourceGroupCount: number;
    mappedSourceGroupCount: number;
    deferredItemCount: number;
    blockedItemCount: number;
    unresolvedReferenceCount: number;
    highOrCriticalBlockerCount: number;
    publicSafeNodeCount: 0;
    publicSafeEdgeCount: 0;
    partitions: PrivateCp27PartitionInspectionSummary[];
    indexes: PrivateCp27IndexInspectionSummary[];
  };
  vault: {
    vaultId: string;
    manifest: PrivateCp27ArtifactRef;
    summaryPath: string;
    checksumLedger: PrivateCp27ArtifactRef;
    artifactCount: number;
    categoryCount: number;
    graphNodesReferenced: number;
    sourceGraphNodes: number;
    sourceGraphEdges: number;
    publicSafeArtifactCount: 0;
    categoryCounts: Record<string, number>;
  };
  diff: {
    proofId: string;
    manifest: PrivateCp27ArtifactRef;
    graphBaselineNodes: number;
    graphRefreshedNodes: number;
    graphBaselineEdges: number;
    graphRefreshedEdges: number;
    vaultBaselineArtifacts: number;
    vaultRefreshedArtifacts: number;
    matchedCount: number;
    addedCount: number;
    removedCount: number;
    changedCount: number;
    deferredCount: number;
    blockedCount: number;
    unresolvedReferenceCount: number;
    highOrCriticalBlockerCount: number;
  };
  responseBoundary: {
    fullGraphDumpIncluded: false;
    fullVaultDumpIncluded: false;
    rawSourceTextIncluded: false;
    maxPartitionRowsReturned: number;
    maxIndexRowsReturned: number;
    maxVaultCategoryRowsReturned: number;
    message: string;
  };
  artifactPaths: {
    latestGraphPointer: string;
    latestVaultPointer: string;
    latestDiffPointer: string;
    graphSummary: string;
    vaultSummary: string;
    diffManifest: string;
    internalUiProof: string;
  };
  publicBoundary: PrivateCp27PublicBoundaryStatus;
};
