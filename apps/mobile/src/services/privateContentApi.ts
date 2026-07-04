import type {
  GuidanceSessionEntryPoint,
  GuidanceSessionResponse,
  HadithCollectionsResponse,
  HadithDetailResponse,
  HadithRecordsResponse,
  QuranSurahResponse,
} from '@rafiq/shared';

export type PrivateSearchDomain =
  | 'all'
  | 'quran'
  | 'translation'
  | 'tafsir'
  | 'topics'
  | 'themes'
  | 'hadith'
  | 'verification';

export type SourceDetailTarget = {
  entityType: string;
  entityId: string;
};

export type SourceToGuidanceTarget = {
  entryPoint: 'quran_ayah' | 'hadith_record' | 'learn_theme' | 'ask';
  input: string;
  domain?: PrivateSearchDomain | string;
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
  kind: string;
  route: string;
  sourceDetailTarget?: SourceDetailTarget | null;
  guidanceTarget?: SourceToGuidanceTarget | null;
};

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
  notice: QuranSurahResponse['notice'];
  query: {
    text: string | null;
    domain: PrivateSearchDomain | string;
    mode?: 'guidance' | 'sources';
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

export type PrivateSourceSearchResponse = PrivateSearchResponse & {
  query: PrivateSearchResponse['query'] & {
    mode: 'sources';
  };
  groups: Array<{
    groupKey: 'quran' | 'translation' | 'tafsir' | 'hadith' | 'topics' | 'themes' | 'verification';
    label: string;
    total: number;
    results: PrivateSearchResult[];
  }>;
};

export type PrivateReviewQueueType =
  | 'retrieval_trace'
  | 'source_gap'
  | 'grade_assertion'
  | 'verification_claim'
  | 'answer_validation';

export type PrivateReviewQueueItem = {
  queueItemId: string;
  queueType: PrivateReviewQueueType;
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

export type PrivateRetrievalTraceDetail = {
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

export type PrivateReviewQueueResponse = {
  notice: QuranSurahResponse['notice'];
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
  notice: QuranSurahResponse['notice'];
  item: PrivateReviewQueueItem | null;
  retrievalTrace?: PrivateRetrievalTraceDetail | null;
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
  notice: QuranSurahResponse['notice'];
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
  notice: QuranSurahResponse['notice'];
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
  notice: QuranSurahResponse['notice'];
  modelAdapter: PrivateModelAdapterConfig;
};

export type PrivateModelAdapterRunResponse = {
  notice: QuranSurahResponse['notice'];
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
  notice: QuranSurahResponse['notice'];
  answerValidationRun: PrivateAnswerValidationRun | null;
  guidedAnswer: PrivateGuidedAnswer | null;
  modelAdapterRun: PrivateModelAdapterRun | null;
};

export type PrivateSourceDetailResponse = {
  notice: QuranSurahResponse['notice'];
  sourceDetail: {
    entityType: string;
    entityId: string;
    title: string;
    subtitle?: string | null;
    releaseState?: Record<string, unknown> | null;
    provenanceCount: number;
    provenance: Array<{
      provenanceId: string;
      stagingTable: string;
      stagingRecordId: string;
      provenanceRole: string;
      mappingMethod: string;
      createdAt: string;
      source: Record<string, unknown>;
      snapshot: Record<string, unknown>;
    }>;
  };
};

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://127.0.0.1:8056';

async function getJson<T>(path: string): Promise<T> {
  const response = await fetch(`${API_URL}${path}`);
  if (!response.ok) {
    throw new Error(`RAFIQ API request failed: ${response.status}`);
  }
  return response.json() as Promise<T>;
}

export function getQuranSurah(
  surahNumber: number,
  params: {
    quran?: string;
    translation?: string;
    tafsir?: string;
  } = {},
): Promise<QuranSurahResponse> {
  const query = new URLSearchParams();
  if (params.quran) query.set('quran', params.quran);
  if (params.translation) query.set('translation', params.translation);
  if (params.tafsir) query.set('tafsir', params.tafsir);
  const suffix = query.toString() ? `?${query.toString()}` : '';
  return getJson<QuranSurahResponse>(
    `/api/private-content/quran/surah/${surahNumber}${suffix}`,
  );
}

export function listHadithCollections(): Promise<HadithCollectionsResponse> {
  return getJson<HadithCollectionsResponse>('/api/private-content/hadith/collections');
}

export function listHadithRecords(params: {
  collection?: string;
  language?: string;
  limit?: number;
  offset?: number;
}): Promise<HadithRecordsResponse> {
  const query = new URLSearchParams();
  if (params.collection) query.set('collection', params.collection);
  if (params.language) query.set('language', params.language);
  if (params.limit !== undefined) query.set('limit', String(params.limit));
  if (params.offset !== undefined) query.set('offset', String(params.offset));
  return getJson<HadithRecordsResponse>(
    `/api/private-content/hadith/records?${query.toString()}`,
  );
}

export function getHadithRecord(hadithRecordId: string): Promise<HadithDetailResponse> {
  return getJson<HadithDetailResponse>(
    `/api/private-content/hadith/record/${hadithRecordId}`,
  );
}

export function searchPrivateContent(params: {
  q: string;
  domain?: PrivateSearchDomain;
  limit?: number;
  offset?: number;
}): Promise<PrivateSearchResponse> {
  const query = new URLSearchParams();
  query.set('q', params.q);
  if (params.domain) query.set('domain', params.domain);
  if (params.limit !== undefined) query.set('limit', String(params.limit));
  if (params.offset !== undefined) query.set('offset', String(params.offset));
  return getJson<PrivateSearchResponse>(
    `/api/private-content/search?${query.toString()}`,
  );
}

export function searchPrivateSources(params: {
  q: string;
  domain?: PrivateSearchDomain;
  limit?: number;
  offset?: number;
}): Promise<PrivateSourceSearchResponse> {
  const query = new URLSearchParams();
  query.set('q', params.q);
  if (params.domain) query.set('domain', params.domain);
  if (params.limit !== undefined) query.set('limit', String(params.limit));
  if (params.offset !== undefined) query.set('offset', String(params.offset));
  return getJson<PrivateSourceSearchResponse>(
    `/api/private-content/search/sources?${query.toString()}`,
  );
}

export function getSourceDetail(
  target: SourceDetailTarget,
): Promise<PrivateSourceDetailResponse> {
  const query = new URLSearchParams();
  query.set('entityType', target.entityType);
  query.set('entityId', target.entityId);
  return getJson<PrivateSourceDetailResponse>(
    `/api/private-content/source/detail?${query.toString()}`,
  );
}

export function listReviewQueue(params: {
  status?: string;
  queueType?: PrivateReviewQueueType;
  limit?: number;
  offset?: number;
}): Promise<PrivateReviewQueueResponse> {
  const query = new URLSearchParams();
  if (params.status) query.set('status', params.status);
  if (params.queueType) query.set('queueType', params.queueType);
  if (params.limit !== undefined) query.set('limit', String(params.limit));
  if (params.offset !== undefined) query.set('offset', String(params.offset));
  return getJson<PrivateReviewQueueResponse>(
    `/api/private-content/review/queue?${query.toString()}`,
  );
}

export function getReviewQueueItem(
  queueItemId: string,
): Promise<PrivateReviewQueueItemResponse> {
  return getJson<PrivateReviewQueueItemResponse>(
    `/api/private-content/review/queue/${queueItemId}`,
  );
}

export function createAnswerDraft(params: {
  q: string;
  intent?: string;
  language?: string;
  domain?: PrivateSearchDomain;
  limit?: number;
}): Promise<PrivateAnswerDraftResponse> {
  const query = new URLSearchParams();
  query.set('q', params.q);
  if (params.intent) query.set('intent', params.intent);
  if (params.language) query.set('language', params.language);
  if (params.domain) query.set('domain', params.domain);
  if (params.limit !== undefined) query.set('limit', String(params.limit));
  return getJson<PrivateAnswerDraftResponse>(
    `/api/private-content/answer/draft?${query.toString()}`,
  );
}

export function getAnswerDraft(answerDraftId: string): Promise<PrivateAnswerDraftResponse> {
  return getJson<PrivateAnswerDraftResponse>(
    `/api/private-content/answer/draft/${answerDraftId}`,
  );
}

export function createGuidedAnswer(params: {
  q: string;
  intent?: string;
  language?: string;
  domain?: PrivateSearchDomain;
  limit?: number;
}): Promise<PrivateGuidedAnswerResponse> {
  const query = new URLSearchParams();
  query.set('q', params.q);
  if (params.intent) query.set('intent', params.intent);
  if (params.language) query.set('language', params.language);
  if (params.domain) query.set('domain', params.domain);
  if (params.limit !== undefined) query.set('limit', String(params.limit));
  return getJson<PrivateGuidedAnswerResponse>(
    `/api/private-content/answer/guided?${query.toString()}`,
  );
}

export function getGuidedAnswer(guidedAnswerId: string): Promise<PrivateGuidedAnswerResponse> {
  return getJson<PrivateGuidedAnswerResponse>(
    `/api/private-content/answer/guided/${guidedAnswerId}`,
  );
}

export function createGuidanceSession(params: {
  entryPoint: GuidanceSessionEntryPoint;
  input: string;
  language?: string;
  domain?: PrivateSearchDomain;
  surahNumber?: number;
  ayahNumber?: number;
  verseKey?: string;
  hadithRecordId?: string;
  resumeSessionId?: string;
}): Promise<GuidanceSessionResponse> {
  const query = new URLSearchParams();
  query.set('entryPoint', params.entryPoint);
  query.set('input', params.input);
  if (params.language) query.set('language', params.language);
  if (params.domain) query.set('domain', params.domain);
  if (params.surahNumber !== undefined) query.set('surahNumber', String(params.surahNumber));
  if (params.ayahNumber !== undefined) query.set('ayahNumber', String(params.ayahNumber));
  if (params.verseKey) query.set('verseKey', params.verseKey);
  if (params.hadithRecordId) query.set('hadithRecordId', params.hadithRecordId);
  if (params.resumeSessionId) query.set('resumeSessionId', params.resumeSessionId);
  return getJson<GuidanceSessionResponse>(
    `/api/private-content/guidance/session?${query.toString()}`,
  );
}

export function getModelAdapterStatus(): Promise<PrivateModelAdapterStatusResponse> {
  return getJson<PrivateModelAdapterStatusResponse>(
    '/api/private-content/answer/model-adapter/status',
  );
}

export function createModelAdapterRun(
  guidedAnswerId: string,
): Promise<PrivateModelAdapterRunResponse> {
  const query = new URLSearchParams();
  query.set('guidedAnswerId', guidedAnswerId);
  return getJson<PrivateModelAdapterRunResponse>(
    `/api/private-content/answer/model-adapter/run?${query.toString()}`,
  );
}

export function getModelAdapterRun(
  modelAdapterRunId: string,
): Promise<PrivateModelAdapterRunResponse> {
  return getJson<PrivateModelAdapterRunResponse>(
    `/api/private-content/answer/model-adapter/run/${modelAdapterRunId}`,
  );
}

export function createAnswerValidationRun(params: {
  guidedAnswerId: string;
  modelAdapterRunId?: string;
  candidateAnswer?: string;
}): Promise<PrivateAnswerValidationRunResponse> {
  const query = new URLSearchParams();
  query.set('guidedAnswerId', params.guidedAnswerId);
  if (params.modelAdapterRunId) query.set('modelAdapterRunId', params.modelAdapterRunId);
  if (params.candidateAnswer) query.set('candidateAnswer', params.candidateAnswer);
  return getJson<PrivateAnswerValidationRunResponse>(
    `/api/private-content/answer/validation/run?${query.toString()}`,
  );
}

export function getAnswerValidationRun(
  answerValidationRunId: string,
): Promise<PrivateAnswerValidationRunResponse> {
  return getJson<PrivateAnswerValidationRunResponse>(
    `/api/private-content/answer/validation/run/${answerValidationRunId}`,
  );
}

export function updateAnswerValidationReviewerAction(params: {
  answerValidationRunId: string;
  action: PrivateReviewerActionStatus;
  notes?: string;
}): Promise<PrivateAnswerValidationRunResponse> {
  const query = new URLSearchParams();
  query.set('action', params.action);
  if (params.notes) query.set('notes', params.notes);
  return getJson<PrivateAnswerValidationRunResponse>(
    `/api/private-content/answer/validation/review/${params.answerValidationRunId}?${query.toString()}`,
  );
}
