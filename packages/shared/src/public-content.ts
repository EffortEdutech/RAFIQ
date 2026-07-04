export type PublicContentNotice = {
  label: string;
  message: string;
  deploymentMode: string;
  publicReleaseEnabled: boolean;
  pendingContentBlocked: boolean;
};

export type PublicSearchDomain =
  | 'all'
  | 'quran'
  | 'tafsir'
  | 'topics'
  | 'themes'
  | 'hadith';

export type PublicSearchResult = {
  domain: 'quran' | 'tafsir' | 'topic' | 'ayah_theme' | 'hadith';
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
  release?: {
    entityType: string;
    entityId: string;
    gatePassed: true;
  };
};

export type PublicSearchResponse = {
  notice: PublicContentNotice;
  query: {
    text: string | null;
    domain: PublicSearchDomain | string;
  };
  pagination: {
    limit: number;
    offset: number;
    total: number;
  };
  facets: Record<string, number>;
  results: PublicSearchResult[];
  releaseFilter: {
    status: string;
    source: string;
    pendingContentBlocked: boolean;
    privateSearchIndexReadable: boolean;
  };
};

export type PublicAnswerResponseState =
  | 'approved'
  | 'approved_with_disclaimer'
  | 'source_unavailable'
  | 'scholar_escalation'
  | 'safety_escalation'
  | 'blocked';

export type PublicAnswerEvidenceItem = {
  citationId: string;
  domain: PublicSearchResult['domain'];
  title: string;
  subtitle?: string | null;
  snippet: string;
  reference: PublicSearchResult['reference'];
  target: PublicSearchResult['target'];
  release?: PublicSearchResult['release'];
  publicReleaseStatus: string;
};

export type PublicAnswerDraft = {
  questionText: string;
  detectedIntent: string;
  requestedLanguage: string;
  domainFilter: string;
  responseState: PublicAnswerResponseState;
  retrievedSourceIds: string[];
  evidenceItems: PublicAnswerEvidenceItem[];
  validationGateResults: Record<string, unknown>;
  draftAnswer: string;
  modelName: string;
  policyVersion: string;
  publicReleaseReady: boolean;
};

export type PublicAnswerDraftResponse = {
  notice: PublicContentNotice;
  answerDraft: PublicAnswerDraft;
  search: PublicSearchResponse;
};

export type PublicGuidedAnswerPromptStatus =
  | 'model_ready'
  | 'blocked_by_guardrail'
  | 'blocked_no_public_evidence';

export type PublicGuidedAnswer = {
  promptVersion: string;
  promptStatus: PublicGuidedAnswerPromptStatus;
  responseState: PublicAnswerResponseState;
  systemPrompt: string;
  userPrompt: string;
  evidencePrompt: PublicAnswerEvidenceItem[];
  guidedAnswer: string;
  citationIds: string[];
  modelProvider: string;
  modelName: string;
  publicReleaseReady: boolean;
};

export type PublicGuidedAnswerResponse = {
  notice: PublicContentNotice;
  guidedAnswer: PublicGuidedAnswer;
  answerDraft: PublicAnswerDraft;
  search: PublicSearchResponse;
};

export type PublicSourceDetailStatus =
  | 'approved_public'
  | 'not_public'
  | 'rolled_back';

export type PublicSourceDetail = {
  entityType: string;
  entityId: string;
  publicStatus: PublicSourceDetailStatus;
  title: string;
  sourceName?: string | null;
  sourceKey?: string | null;
  snapshotKey?: string | null;
  editionKey?: string | null;
  authorTranslatorEditor?: string | null;
  publisherOrMaintainer?: string | null;
  licenseName?: string | null;
  licenseUrl?: string | null;
  attributionText?: string | null;
  requiredLinks: string[];
  rightsStatus: string;
  attributionStatus: string;
  editorialStatus: string;
  scholarContentStatus: string;
  publicationStatus: string;
  publicReleaseGatePassed: boolean;
  rollbackStatus: string;
  permittedUseNote: string;
  unavailableReason?: string | null;
  privateFieldsExcluded: string[];
};

export type PublicSourceDetailResponse = {
  notice: PublicContentNotice;
  sourceDetail: PublicSourceDetail;
};
