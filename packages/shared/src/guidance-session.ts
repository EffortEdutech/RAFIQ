import type {
  HadithRecordListItem,
  GuidanceResearchSuggestion,
  PrivateAnswerEvidenceItem,
  PrivateAnswerResponseState,
  PrivateContentNotice,
  PrivateSearchDomain,
  PrivateSearchResult,
  QuranSurahAyah,
  RafiqDeepLink,
  SourceDetailTarget,
} from './private-content.js';

export type GuidanceSessionEntryPoint =
  | 'today'
  | 'ask'
  | 'quran_ayah'
  | 'hadith_record'
  | 'learn_theme'
  | 'growth_resume';

export type GuidanceSessionStatus =
  | 'draft'
  | 'ready'
  | 'blocked_no_evidence'
  | 'scholar_escalation'
  | 'saved'
  | 'completed';

export type GuidanceSessionNeed = {
  rawInput: string;
  entryPoint: GuidanceSessionEntryPoint;
  detectedTheme: string;
  detectedIntent?: string | null;
  requestedLanguage: string;
  domainFilter: PrivateSearchDomain | string;
};

export type GuidanceSessionQuranAnchor = {
  verseKey: string;
  surahNumber: number;
  ayahNumber: number;
  arabicText: string;
  translationText?: string | null;
  simpleMeaning: string;
  tafsirSummary?: string | null;
  sourceDetailTarget?: SourceDetailTarget | null;
  deepLinks?: RafiqDeepLink[];
  researchSuggestions?: GuidanceResearchSuggestion[];
  ayah?: QuranSurahAyah;
};

export type GuidanceSessionSunnahSupport = {
  supportId: string;
  title: string;
  narrationText?: string | null;
  reference?: string | null;
  collectionKey?: string | null;
  gradeLabel?: string | null;
  verificationSummary: string;
  practiceConnection: string;
  sourceDetailTarget?: SourceDetailTarget | null;
  deepLinks?: RafiqDeepLink[];
  researchSuggestions?: GuidanceResearchSuggestion[];
  record?: HadithRecordListItem;
};

export type GuidanceSessionVerification = {
  status: PrivateAnswerResponseState;
  summary: string;
  evidenceCount: number;
  quranEvidenceCount: number;
  sunnahEvidenceCount: number;
  requiresScholarReview: boolean;
  reviewStatus: string;
  evidence: PrivateAnswerEvidenceItem[];
};

export type GuidanceSessionGuidance = {
  title: string;
  message: string;
  reflectionPrompt: string;
  action: {
    actionId: string;
    label: string;
    completed: boolean;
    completedAt?: string | null;
  };
  nextStep: {
    label: string;
    route: string;
    reason: string;
  };
};

export type GuidanceSessionLearningPathStepKind =
  | 'quran'
  | 'tafsir'
  | 'sunnah'
  | 'reflection'
  | 'action';

export type GuidanceSessionLearningPathStep = {
  stepId: string;
  kind: GuidanceSessionLearningPathStepKind;
  label: string;
  title: string;
  body: string;
  reference?: string | null;
  route?: string | null;
  sourceDetailTarget?: SourceDetailTarget | null;
  available: boolean;
};

export type GuidanceSessionLearningPath = {
  title: string;
  summary: string;
  steps: GuidanceSessionLearningPathStep[];
};

export type GuidanceSessionMemory = {
  saved: boolean;
  savedAt?: string | null;
  reflectionText?: string | null;
  journalEntryId?: string | null;
  resumedFromSessionId?: string | null;
};

export type GuidanceSessionSourceMap = {
  retrievalTraceId?: string | null;
  searchResults: PrivateSearchResult[];
  sourceTargets: SourceDetailTarget[];
  sourceSearchRoute?: string | null;
};

export type GuidanceSession = {
  sessionId: string;
  status: GuidanceSessionStatus;
  createdAt: string;
  updatedAt: string;
  need: GuidanceSessionNeed;
  quranAnchor: GuidanceSessionQuranAnchor | null;
  sunnahSupport: GuidanceSessionSunnahSupport[];
  verification: GuidanceSessionVerification;
  guidance: GuidanceSessionGuidance;
  learningPath?: GuidanceSessionLearningPath;
  researchSuggestions?: GuidanceResearchSuggestion[];
  memory: GuidanceSessionMemory;
  sourceMap: GuidanceSessionSourceMap;
};

export type GuidanceSessionRequest = {
  entryPoint: GuidanceSessionEntryPoint;
  input: string;
  language?: string;
  domain?: PrivateSearchDomain | string;
  quran?: {
    surahNumber: number;
    ayahNumber?: number;
    verseKey?: string;
  };
  hadithRecordId?: string;
  resumeSessionId?: string;
};

export type GuidanceSessionResponse = {
  notice: PrivateContentNotice;
  session: GuidanceSession | null;
};
