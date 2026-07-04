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
    sourceDetailTarget?: SourceDetailTarget | null;
  }>;
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
