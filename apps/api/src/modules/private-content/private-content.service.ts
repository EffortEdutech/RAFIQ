import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import type {
  GuidanceSession,
  GuidanceSessionEntryPoint,
  GuidanceSessionLearningPath,
  GuidanceSessionQuranAnchor,
  GuidanceSessionRequest,
  GuidanceSessionResponse,
  GuidanceSessionSunnahSupport,
  GuidanceResearchSuggestion,
  HadithCollectionsResponse,
  HadithDetailResponse,
  HadithRecordsResponse,
  PrivateAnswerDraftResponse,
  PrivateAnswerValidationRunResponse,
  PrivateGuidedAnswerResponse,
  PrivateSearchResult,
  PrivateSourceSearchGroup,
  PrivateSourceSearchGroupKey,
  PrivateSourceSearchResponse,
  RafiqDeepLink,
  PrivateModelAdapterRunResponse,
  PrivateModelAdapterStatusResponse,
  PrivateRetrievalTraceResponse,
  PrivateReviewQueueItemResponse,
  PrivateReviewQueueResponse,
  PrivateSearchResponse,
  PrivateSourceDetailResponse,
  QuranSurahResponse,
  QuranSurahAyah,
} from '@rafiq/shared';
import { PrivateContentRepository } from './private-content.repository.js';

type QuranOptions = {
  quran?: string;
  translation?: string;
  tafsir?: string;
};

type HadithListOptions = {
  collection?: string;
  language?: string;
  limit?: number;
  offset?: number;
};

type SearchOptions = {
  q: string;
  domain?: string;
  limit?: number;
  offset?: number;
};

type SourceSearchOptions = SearchOptions;

type ReviewQueueOptions = {
  status?: string;
  queueType?: string;
  limit?: number;
  offset?: number;
};

type AnswerDraftOptions = {
  q: string;
  intent?: string;
  language?: string;
  domain?: string;
  limit?: number;
};

type AnswerValidationRunOptions = {
  guidedAnswerId: string;
  modelAdapterRunId?: string;
  candidateAnswer?: string;
};

type ExpandedGuidanceNeed = {
  confidence: number;
  reason: string;
  searchInput: string;
  theme: string;
};

const DEFAULT_NOTICE = {
  label: 'UNAPPROVED CONTENT - NOT FOR PUBLICATION',
  message:
    'Private RAFIQ development and testing only. Do not expose through public API, public app, exports, or AI answers until approval gates pass.',
  rightsStatus: 'pending',
  attributionStatus: 'pending',
  editorialStatus: 'unreviewed',
  scholarContentStatus: 'unreviewed',
  publicationStatus: 'private_only',
};

function isGuidanceSessionEntryPoint(value: string): value is GuidanceSessionEntryPoint {
  return ['today', 'ask', 'quran_ayah', 'hadith_record', 'learn_theme', 'growth_resume'].includes(value);
}

function firstSentence(text?: string | null): string {
  const cleaned = text?.replace(/\s+/g, ' ').trim();
  if (!cleaned) return 'Read the Quran anchor slowly, then carry one small action.';
  const [sentence] = cleaned.split(/(?<=[.!?])\s+/);
  return sentence || cleaned;
}

function compactHadithMeaning(text?: string | null): string {
  const cleaned = text
    ?.replace(/\s+/g, ' ')
    .replace(/\b(\w+)\s+\1\b/gi, '$1')
    .trim();
  if (!cleaned) return 'A related narration is available. Open it with reliability notes before applying it.';
  const sentence = firstSentence(cleaned);
  const looksDamaged =
    /\bthe\s+the\b/i.test(text ?? '') ||
    /\bprayer\s+prayer\b/i.test(text ?? '') ||
    /\bdid reply to him but\b/i.test(text ?? '') ||
    sentence.length > 240;
  if (looksDamaged) {
    return 'A related narration is available for this practice. Open the narration study room and read it with reliability notes before applying it.';
  }
  return sentence;
}

function resultVerseKey(result?: PrivateSearchResult | null): string | undefined {
  return result?.reference.verseKey ?? result?.target.verseKey ?? undefined;
}

function resultSurahNumber(result?: PrivateSearchResult | null): number | undefined {
  return result?.reference.surahNumber ?? result?.target.surahNumber ?? undefined;
}

function resultAyahNumber(result?: PrivateSearchResult | null): number | undefined {
  return result?.reference.ayahNumber ?? result?.target.ayahNumber ?? undefined;
}

function resultHadithRecordId(result: PrivateSearchResult): string | null {
  return result.reference.hadithRecordId ?? result.target.hadithRecordId ?? null;
}

function normalizeSearchDomainForRpc(domain?: string): string {
  const normalized = (domain ?? 'all').toLowerCase();
  if (normalized === 'topic') return 'topics';
  if (normalized === 'ayah_theme' || normalized === 'theme') return 'themes';
  if (normalized === 'translation' || normalized === 'verification') return 'all';
  if (['all', 'quran', 'tafsir', 'topics', 'themes', 'hadith'].includes(normalized)) return normalized;
  return 'all';
}

function sourceGroupKeyForResult(result: PrivateSearchResult): PrivateSourceSearchGroupKey {
  if (result.domain === 'topic') return 'topics';
  if (result.domain === 'ayah_theme') return 'themes';
  if (result.domain === 'verification') return 'verification';
  return result.domain;
}

function parseAyahReference(input: string): { surahNumber: number; ayahNumber: number; verseKey: string } | null {
  const match = input.trim().match(/^(\d{1,3})\s*:\s*(\d{1,3})$/);
  if (!match) return null;
  const surahNumber = Number(match[1]);
  const ayahNumber = Number(match[2]);
  if (!Number.isInteger(surahNumber) || !Number.isInteger(ayahNumber)) return null;
  if (surahNumber < 1 || surahNumber > 114 || ayahNumber < 1 || ayahNumber > 286) return null;
  return { surahNumber, ayahNumber, verseKey: `${surahNumber}:${ayahNumber}` };
}

function sourceSearchRoute(query: string, domain = 'all'): string {
  const params = new URLSearchParams({ q: query, domain });
  return `/sources?${params.toString()}`;
}

function sourceDetailRoute(target?: { entityType: string; entityId: string } | null): string | null {
  if (!target) return null;
  const params = new URLSearchParams({ entityType: target.entityType, entityId: target.entityId });
  return `/source-detail?${params.toString()}`;
}

function ayahStudyRoute(surahNumber: number, ayahNumber: number): string {
  return `/quran/${surahNumber}/${ayahNumber}`;
}

function sourceResultStudyRoute(result: PrivateSearchResult): string {
  const surahNumber = resultSurahNumber(result);
  const ayahNumber = resultAyahNumber(result);
  if (surahNumber && ayahNumber && ['quran', 'translation', 'tafsir', 'ayah_theme'].includes(result.domain)) {
    return ayahStudyRoute(surahNumber, ayahNumber);
  }
  return result.target.route;
}

const INTENT_EXPANSIONS: Array<{
  keywords: string[];
  theme: string;
  searchInput: string;
  reason: string;
}> = [
  {
    keywords: ['gratitude', 'grateful', 'thankful', 'shukr', 'syukur'],
    theme: 'Gratitude',
    searchInput: 'gratitude',
    reason: 'Matched gratitude language to the known Quran theme.',
  },
  {
    keywords: ['patience', 'patient', 'sabr', 'difficult conversation', 'hard conversation', 'argument'],
    theme: 'Patience',
    searchInput: 'patience',
    reason: 'Matched difficult interaction language to the known patience theme.',
  },
  {
    keywords: ['rizq', 'provision', 'sustenance', 'income', 'money', 'job', 'nafkah'],
    theme: 'Provision',
    searchInput: 'provision',
    reason: 'Matched provision anxiety language to a broader Quran search theme.',
  },
  {
    keywords: ['anxious', 'anxiety', 'worried', 'worry', 'fear', 'afraid', 'overwhelmed'],
    theme: 'Trust',
    searchInput: 'guidance',
    reason: 'Matched anxiety language to guidance and reliance-oriented Quran evidence.',
  },
  {
    keywords: ['angry', 'anger', 'temper', 'frustrated', 'resentment'],
    theme: 'Restraint',
    searchInput: 'patience',
    reason: 'Matched anger language to patience and restraint evidence.',
  },
  {
    keywords: ['prayer', 'salah', 'solat', 'pray', 'khushu', 'focus'],
    theme: 'Prayer',
    searchInput: 'prayer',
    reason: 'Matched worship language to prayer evidence.',
  },
  {
    keywords: ['intention', 'intentions', 'niyyah', 'niat', 'sincerity', 'ikhlas'],
    theme: 'Intention',
    searchInput: 'intention',
    reason: 'Matched intention language to sincerity and action evidence.',
  },
  {
    keywords: ['mercy', 'rahmah', 'gentle', 'kindness', 'forgive', 'forgiveness'],
    theme: 'Mercy',
    searchInput: 'mercy',
    reason: 'Matched mercy language to the known Quran theme.',
  },
  {
    keywords: ['lost', 'confused', 'guidance', 'guide', 'direction', 'decision'],
    theme: 'Guidance',
    searchInput: 'guidance',
    reason: 'Matched direction-seeking language to guidance evidence.',
  },
];

function normalizeInput(value: string): string {
  return value.toLowerCase().replace(/\s+/g, ' ').trim();
}

function expandGuidanceNeed(input: string): ExpandedGuidanceNeed {
  const normalized = normalizeInput(input);
  const exactTheme =
    INTENT_EXPANSIONS.find((item) => normalized === item.theme.toLowerCase()) ??
    INTENT_EXPANSIONS.find((item) => normalized === item.searchInput);
  if (exactTheme) {
    return {
      confidence: 1,
      reason: exactTheme.reason,
      searchInput: exactTheme.searchInput,
      theme: exactTheme.theme,
    };
  }

  const match = INTENT_EXPANSIONS.find((item) =>
    item.keywords.some((keyword) => normalized.includes(keyword)),
  );
  if (match) {
    return {
      confidence: 0.82,
      reason: match.reason,
      searchInput: match.searchInput,
      theme: match.theme,
    };
  }

  return {
    confidence: 0.45,
    reason: 'No deterministic theme expansion matched; using the original input.',
    searchInput: input,
    theme: input,
  };
}

@Injectable()
export class PrivateContentService {
  constructor(private readonly repository: PrivateContentRepository) {}

  getQuranSurah(
    surahNumber: number,
    options: QuranOptions,
  ): Promise<QuranSurahResponse> {
    return this.repository.getQuranSurah(surahNumber, options);
  }

  listHadithCollections(): Promise<HadithCollectionsResponse> {
    return this.repository.listHadithCollections();
  }

  listHadithRecords(options: HadithListOptions): Promise<HadithRecordsResponse> {
    return this.repository.listHadithRecords(options);
  }

  getHadithRecord(hadithRecordId: string): Promise<HadithDetailResponse> {
    return this.repository.getHadithRecord(hadithRecordId);
  }

  searchContent(options: SearchOptions): Promise<PrivateSearchResponse> {
    return this.repository.searchContent(options);
  }

  async searchSources(options: SourceSearchOptions): Promise<PrivateSourceSearchResponse> {
    const requestedDomain = options.domain ?? 'all';
    const rpcDomain = normalizeSearchDomainForRpc(requestedDomain);
    const ayahReferenceResults = await this.createAyahReferenceSourceResults(options.q, requestedDomain);
    const search = await this.repository.searchContent({
      q: options.q,
      domain: rpcDomain,
      limit: options.limit ?? 30,
      offset: options.offset ?? 0,
    });
    const enrichedResults = this.dedupeSourceSearchResults([...ayahReferenceResults, ...search.results])
      .map((result) => this.enrichSourceSearchResult(result, options.q))
      .sort((first, second) => this.sourceSearchRank(second, requestedDomain) - this.sourceSearchRank(first, requestedDomain));
    const filteredResults = this.filterSourceSearchResults(enrichedResults, requestedDomain);
    const groups = this.groupSourceSearchResults(filteredResults);

    return {
      notice: search.notice,
      query: {
        text: search.query.text,
        domain: requestedDomain,
        mode: 'sources',
      },
      pagination: {
        ...search.pagination,
        total: filteredResults.length,
      },
      facets: this.facetsForSourceGroups(groups),
      retrievalTrace: search.retrievalTrace,
      groups,
      results: filteredResults,
    };
  }

  getRetrievalTrace(traceId: string): Promise<PrivateRetrievalTraceResponse> {
    return this.repository.getRetrievalTrace(traceId);
  }

  getSourceDetail(
    entityType: string,
    entityId: string,
  ): Promise<PrivateSourceDetailResponse> {
    return this.repository.getSourceDetail(entityType, entityId);
  }

  listReviewQueue(options: ReviewQueueOptions): Promise<PrivateReviewQueueResponse> {
    return this.repository.listReviewQueue(options);
  }

  getReviewQueueItem(queueItemId: string): Promise<PrivateReviewQueueItemResponse> {
    return this.repository.getReviewQueueItem(queueItemId);
  }

  createAnswerDraft(options: AnswerDraftOptions): Promise<PrivateAnswerDraftResponse> {
    return this.repository.createAnswerDraft(options);
  }

  getAnswerDraft(answerDraftId: string): Promise<PrivateAnswerDraftResponse> {
    return this.repository.getAnswerDraft(answerDraftId);
  }

  createGuidedAnswer(options: AnswerDraftOptions): Promise<PrivateGuidedAnswerResponse> {
    return this.repository.createGuidedAnswer(options);
  }

  getGuidedAnswer(guidedAnswerId: string): Promise<PrivateGuidedAnswerResponse> {
    return this.repository.getGuidedAnswer(guidedAnswerId);
  }

  async createGuidanceSession(
    request: GuidanceSessionRequest,
  ): Promise<GuidanceSessionResponse> {
    const entryPoint = isGuidanceSessionEntryPoint(request.entryPoint)
      ? request.entryPoint
      : 'ask';
    const language = request.language ?? 'en';
    const domain = request.domain ?? 'all';
    const expandedNeed = expandGuidanceNeed(request.input);
    const anchoredHadith =
      entryPoint === 'hadith_record' && request.hadithRecordId
        ? await this.repository.getHadithRecord(request.hadithRecordId)
        : null;
    const search = await this.repository.searchContent({
      q: expandedNeed.searchInput,
      domain,
      limit: 8,
      offset: 0,
    });
    const guided = await this.repository.createGuidedAnswer({
      q: expandedNeed.searchInput,
      intent: entryPoint,
      language,
      domain,
      limit: 6,
    });

    const quranAnchor = await this.createQuranAnchor(request, search.results, expandedNeed.searchInput, domain);
    const sunnahSupport = this.createSunnahSupport(search.results, anchoredHadith);
    const evidence = guided.guidedAnswer?.evidencePrompt ?? guided.answerDraft?.evidenceItems ?? [];
    const responseState =
      guided.guidedAnswer?.responseState ?? guided.answerDraft?.responseState ?? 'blocked';
    const now = new Date().toISOString();
    const sessionId = randomUUID();
    const guidanceMessage = this.createGuidanceMessage(
      quranAnchor,
      sunnahSupport,
      guided.answerDraft?.draftAnswer,
    );

    const session: GuidanceSession = {
      sessionId,
      status:
        responseState === 'blocked' || responseState === 'source_unavailable'
          ? 'blocked_no_evidence'
          : responseState === 'scholar_escalation'
            ? 'scholar_escalation'
            : 'ready',
      createdAt: now,
      updatedAt: now,
      need: {
        rawInput: request.input,
        entryPoint,
        detectedTheme: anchoredHadith?.record.collectionName ?? search.results[0]?.title ?? expandedNeed.theme,
        detectedIntent: `${guided.answerDraft?.detectedIntent ?? entryPoint}:${expandedNeed.theme}`,
        requestedLanguage: language,
        domainFilter: domain,
      },
      quranAnchor,
      sunnahSupport,
      verification: {
        status: responseState,
        summary: this.verificationSummary(
          responseState,
          evidence.length,
          quranAnchor,
          sunnahSupport.length,
          expandedNeed,
        ),
        evidenceCount: evidence.length,
        quranEvidenceCount: evidence.filter((item) =>
          ['quran', 'tafsir', 'topic', 'ayah_theme'].includes(item.domain),
        ).length,
        sunnahEvidenceCount: evidence.filter((item) => item.domain === 'hadith').length,
        requiresScholarReview: responseState === 'scholar_escalation' || responseState === 'safety_escalation',
        reviewStatus: guided.guidedAnswer?.reviewStatus ?? guided.answerDraft?.reviewStatus ?? 'unreviewed',
        evidence,
      },
      guidance: {
        title: quranAnchor ? `Guidance from ${quranAnchor.verseKey}` : 'Guidance needs stronger evidence',
        message: guidanceMessage,
        reflectionPrompt: quranAnchor
          ? `What is ${quranAnchor.verseKey} asking me to notice today?`
          : 'What question should I bring back with clearer context?',
        action: {
          actionId: `${sessionId}:action`,
          label: quranAnchor
            ? 'Read the Quran anchor once more, then choose one small act of obedience.'
            : 'Ask again with one clearer detail before acting.',
          completed: false,
        },
        nextStep: {
          label: quranAnchor ? 'Read Quran anchor' : 'Refine question',
          route: quranAnchor ? ayahStudyRoute(quranAnchor.surahNumber, quranAnchor.ayahNumber) : '/answer',
          reason: quranAnchor ? 'Quran remains the first anchor for the session.' : 'The session needs stronger evidence.',
        },
      },
      learningPath: this.createLearningPath(quranAnchor, sunnahSupport, sessionId),
      researchSuggestions: [
        ...(quranAnchor?.researchSuggestions ?? []),
        ...sunnahSupport.flatMap((support) => support.researchSuggestions ?? []),
      ],
      memory: {
        saved: false,
        reflectionText: null,
        journalEntryId: null,
        resumedFromSessionId: request.resumeSessionId ?? null,
      },
      sourceMap: {
        retrievalTraceId: search.retrievalTrace.traceId ?? guided.answerDraft?.retrievalTraceId ?? null,
        searchResults: search.results,
        sourceTargets: [
          quranAnchor?.sourceDetailTarget,
          ...sunnahSupport.map((support) => support.sourceDetailTarget),
        ].filter((target): target is NonNullable<typeof target> => Boolean(target)),
        sourceSearchRoute: sourceSearchRoute(expandedNeed.searchInput, domain),
      },
    };

    return {
      notice: guided.notice ?? search.notice ?? DEFAULT_NOTICE,
      session,
    };
  }

  private async createQuranAnchor(
    request: GuidanceSessionRequest,
    results: PrivateSearchResult[],
    expandedInput: string,
    domain: string,
  ): Promise<GuidanceSessionQuranAnchor | null> {
    const quranResult =
      results.find((result) => ['quran', 'tafsir', 'ayah_theme'].includes(result.domain)) ?? null;
    const fallbackQuranResult = quranResult || domain === 'hadith'
      ? null
      : (await this.repository.searchContent({
          q: expandedInput,
          domain: 'quran',
          limit: 3,
          offset: 0,
        })).results.find((result) => ['quran', 'tafsir', 'ayah_theme'].includes(result.domain)) ?? null;
    const selectedQuranResult = quranResult ?? fallbackQuranResult;
    const surahNumber = request.quran?.surahNumber ?? resultSurahNumber(selectedQuranResult);
    if (!surahNumber) return null;

    const surah = await this.repository.getQuranSurah(surahNumber, {});
    const verseKey = request.quran?.verseKey ?? resultVerseKey(selectedQuranResult);
    const ayahNumber = request.quran?.ayahNumber ?? resultAyahNumber(selectedQuranResult);
    const ayah =
      surah.ayahs.find((item) => (verseKey ? item.verseKey === verseKey : false)) ??
      surah.ayahs.find((item) => (ayahNumber ? item.ayahNumber === ayahNumber : false)) ??
      surah.ayahs[0];
    if (!ayah) return null;

    const tafsir = ayah.tafsirPassages.find((passage) => !passage.blankText)?.text ?? null;
    const tafsirTarget = ayah.tafsirPassages.find((passage) => !passage.blankText)?.sourceDetailTarget ?? null;
    const quranSourceTarget = ayah.quranTextSourceDetailTarget ?? ayah.sourceDetailTarget ?? null;
    const deepLinks: RafiqDeepLink[] = [
      {
        linkId: `${ayah.verseKey}:read-ayah`,
        label: 'Read ayah',
        kind: 'read_ayah',
        route: ayahStudyRoute(ayah.surahNumber, ayah.ayahNumber),
        sourceDetailTarget: quranSourceTarget,
        guidanceTarget: {
          entryPoint: 'quran_ayah',
          input: ayah.verseKey,
          domain: 'quran',
          quran: {
            surahNumber: ayah.surahNumber,
            ayahNumber: ayah.ayahNumber,
            verseKey: ayah.verseKey,
          },
        },
      },
      {
        linkId: `${ayah.verseKey}:open-tafsir`,
        label: 'Open tafsir',
        kind: 'open_tafsir',
        route: ayahStudyRoute(ayah.surahNumber, ayah.ayahNumber),
        sourceDetailTarget: tafsirTarget,
        guidanceTarget: null,
      },
      {
        linkId: `${ayah.verseKey}:related-quran`,
        label: 'Search related Quran',
        kind: 'related_quran',
        route: sourceSearchRoute(ayah.verseKey, 'quran'),
        sourceDetailTarget: null,
        guidanceTarget: null,
      },
      {
        linkId: `${ayah.verseKey}:find-sunnah`,
        label: 'Find Sunnah support',
        kind: 'find_sunnah',
        route: sourceSearchRoute(ayah.verseKey, 'hadith'),
        sourceDetailTarget: null,
        guidanceTarget: null,
      },
    ];
    const researchSuggestions: GuidanceResearchSuggestion[] = [
      {
        suggestionId: `${ayah.verseKey}:translation`,
        kind: 'translation',
        label: 'Compare translations',
        query: ayah.verseKey,
        route: sourceSearchRoute(ayah.verseKey, 'translation'),
        sourceDetailTarget: ayah.translation?.sourceDetailTarget ?? null,
      },
      {
        suggestionId: `${ayah.verseKey}:tafsir`,
        kind: 'tafsir',
        label: 'Study tafsir context',
        query: ayah.verseKey,
        route: sourceSearchRoute(ayah.verseKey, 'tafsir'),
        sourceDetailTarget: tafsirTarget,
      },
      {
        suggestionId: `${ayah.verseKey}:sunnah`,
        kind: 'sunnah',
        label: 'Find Sunnah support',
        query: ayah.verseKey,
        route: sourceSearchRoute(ayah.verseKey, 'hadith'),
        sourceDetailTarget: null,
      },
    ];
    return {
      verseKey: ayah.verseKey,
      surahNumber: ayah.surahNumber,
      ayahNumber: ayah.ayahNumber,
      arabicText: ayah.quranText,
      translationText: ayah.translation?.text ?? null,
      simpleMeaning: firstSentence(ayah.translation?.text ?? tafsir ?? selectedQuranResult?.snippet),
      tafsirSummary: tafsir ? firstSentence(tafsir) : null,
      sourceDetailTarget: quranSourceTarget,
      deepLinks,
      researchSuggestions,
      ayah,
    };
  }

  private createSunnahSupport(
    results: PrivateSearchResult[],
    anchoredHadith?: HadithDetailResponse | null,
  ): GuidanceSessionSunnahSupport[] {
    const anchor = anchoredHadith ? this.createAnchoredSunnahSupport(anchoredHadith) : null;
    const anchoredRecordId = anchoredHadith?.record.hadithRecordId ?? null;
    const related = results
      .filter((result) => result.domain === 'hadith')
      .filter((result) => resultHadithRecordId(result) !== anchoredRecordId)
      .sort((first, second) => {
        const firstSameCollection = first.reference.collectionKey === anchoredHadith?.record.collectionKey ? 1 : 0;
        const secondSameCollection = second.reference.collectionKey === anchoredHadith?.record.collectionKey ? 1 : 0;
        if (firstSameCollection !== secondSameCollection) return secondSameCollection - firstSameCollection;
        return (second.score ?? 0) - (first.score ?? 0);
      })
      .slice(0, anchor ? 1 : 2)
      .map((result) => {
        const hadithRecordId = resultHadithRecordId(result);
        const collectionKey = result.reference.collectionKey ?? result.target.collectionKey ?? null;
        const sourceDetailTarget = hadithRecordId
          ? { entityType: 'hadith_record', entityId: hadithRecordId }
          : null;

        return {
          supportId: result.resultId,
          title: result.title,
          narrationText: result.snippet,
          reference:
            result.reference.collectionKey || result.reference.hadithRecordId
              ? [result.reference.collectionKey, result.target.sourceHadithNumber].filter(Boolean).join(' ')
              : null,
          collectionKey,
          gradeLabel: null,
          verificationSummary: 'Check the narration reference and reliability note before practice or sharing.',
          practiceConnection: compactHadithMeaning(result.snippet),
          sourceDetailTarget,
          deepLinks: this.createSunnahDeepLinks({
            supportId: result.resultId,
            title: result.title,
            hadithRecordId,
            collectionKey,
            sourceDetailTarget,
            queryText: result.title,
          }),
          researchSuggestions: this.createSunnahResearchSuggestions({
            supportId: result.resultId,
            queryText: result.title,
            sourceDetailTarget,
          }),
        };
      });

    return [anchor, ...related].filter((support): support is GuidanceSessionSunnahSupport => Boolean(support));
  }

  private createAnchoredSunnahSupport(detail: HadithDetailResponse): GuidanceSessionSunnahSupport {
    const preferredText =
      detail.textVersions.find((version) => version.languageCode === 'en') ??
      detail.textVersions.find((version) => version.languageCode === 'ms') ??
      detail.textVersions.find((version) => version.languageCode === 'id') ??
      detail.textVersions.find((version) => version.languageCode !== 'ar') ??
      detail.textVersions.find((version) => version.languageCode === 'ar') ??
      detail.textVersions[0] ??
      null;
    const grade = detail.gradeAssertions[0];
    const claim = detail.verificationClaims[0];
    const reference = [
      detail.record.collectionKey,
      detail.record.printedReference ??
        detail.record.sourceHadithNumber ??
        detail.record.sourceArabicNumber,
    ].filter(Boolean).join(' ');

    return {
      supportId: `hadith-record:${detail.record.hadithRecordId}`,
      title: detail.record.collectionName ?? detail.record.collectionKey,
      narrationText: preferredText?.fullText ?? null,
      reference: reference || detail.record.sourceHadithKey,
      collectionKey: detail.record.collectionKey,
      gradeLabel: grade?.normalizedLabel ?? grade?.rawGrade ?? null,
      verificationSummary:
        claim?.claimText ??
        claim?.rawConclusion ??
        (grade?.reviewStatus ? `Reliability note: ${grade.reviewStatus}.` : 'No additional verification note is attached yet. Read with care.'),
      practiceConnection: compactHadithMeaning(preferredText?.fullText),
      sourceDetailTarget: detail.record.sourceDetailTarget ?? { entityType: 'hadith_record', entityId: detail.record.hadithRecordId },
      deepLinks: this.createSunnahDeepLinks({
        supportId: `hadith-record:${detail.record.hadithRecordId}`,
        title: detail.record.collectionName ?? detail.record.collectionKey,
        hadithRecordId: detail.record.hadithRecordId,
        collectionKey: detail.record.collectionKey,
        sourceDetailTarget: detail.record.sourceDetailTarget ?? { entityType: 'hadith_record', entityId: detail.record.hadithRecordId },
        queryText: preferredText?.fullText ?? detail.record.sourceHadithKey,
      }),
      researchSuggestions: this.createSunnahResearchSuggestions({
        supportId: `hadith-record:${detail.record.hadithRecordId}`,
        queryText: preferredText?.fullText ?? detail.record.sourceHadithKey,
        sourceDetailTarget: detail.record.sourceDetailTarget ?? { entityType: 'hadith_record', entityId: detail.record.hadithRecordId },
      }),
      record: {
        hadithRecordId: detail.record.hadithRecordId,
        collectionKey: detail.record.collectionKey,
        collectionName: detail.record.collectionName,
        editionKey: detail.record.editionKey,
        sourceHadithKey: detail.record.sourceHadithKey,
        sourceHadithNumber: detail.record.sourceHadithNumber,
        sourceUrn: detail.record.sourceUrn,
        printedReference: detail.record.printedReference,
        previewText: preferredText?.fullText,
        previewLanguageCode: preferredText?.languageCode,
        gradeSummary: detail.gradeAssertions.map((item) => ({
          graderNameRaw: item.graderNameRaw,
          rawGrade: item.rawGrade,
          normalizedLabel: item.normalizedLabel,
          claimScope: item.claimScope,
          reviewStatus: item.reviewStatus,
        })),
      },
    };
  }

  private createSunnahDeepLinks(options: {
    supportId: string;
    title: string;
    hadithRecordId?: string | null;
    collectionKey?: string | null;
    sourceDetailTarget?: { entityType: string; entityId: string } | null;
    queryText: string;
  }): RafiqDeepLink[] {
    const sourceRoute = sourceDetailRoute(options.sourceDetailTarget);
    return [
      {
        linkId: `${options.supportId}:open-narration`,
        label: 'Open narration',
        kind: 'open_narration',
        route: options.hadithRecordId ? `/hadith/${options.hadithRecordId}` : '/hadith',
        sourceDetailTarget: options.sourceDetailTarget ?? null,
        guidanceTarget: options.hadithRecordId
          ? {
              entryPoint: 'hadith_record',
              input: options.title,
              domain: 'hadith',
              hadithRecordId: options.hadithRecordId,
            }
          : null,
      },
      {
        linkId: `${options.supportId}:related-narrations`,
        label: 'Related narrations',
        kind: 'related_narrations',
        route: sourceSearchRoute(options.queryText, 'hadith'),
        sourceDetailTarget: null,
        guidanceTarget: null,
      },
      {
        linkId: `${options.supportId}:check-verification`,
        label: 'Check verification',
        kind: 'check_verification',
        route: sourceRoute ?? sourceSearchRoute(options.queryText, 'verification'),
        sourceDetailTarget: options.sourceDetailTarget ?? null,
        guidanceTarget: null,
      },
      {
        linkId: `${options.supportId}:quran-connection`,
        label: 'Search Quran connection',
        kind: 'search_quran_connection',
        route: sourceSearchRoute(options.queryText, 'quran'),
        sourceDetailTarget: null,
        guidanceTarget: null,
      },
    ];
  }

  private createSunnahResearchSuggestions(options: {
    supportId: string;
    queryText: string;
    sourceDetailTarget?: { entityType: string; entityId: string } | null;
  }): GuidanceResearchSuggestion[] {
    return [
      {
        suggestionId: `${options.supportId}:related-hadith`,
        kind: 'sunnah',
        label: 'Study related narrations',
        query: options.queryText,
        route: sourceSearchRoute(options.queryText, 'hadith'),
        sourceDetailTarget: options.sourceDetailTarget ?? null,
      },
      {
        suggestionId: `${options.supportId}:quran-link`,
        kind: 'quran',
        label: 'Search Quran connection',
        query: options.queryText,
        route: sourceSearchRoute(options.queryText, 'quran'),
        sourceDetailTarget: null,
      },
      {
        suggestionId: `${options.supportId}:verification`,
        kind: 'verification',
        label: 'Review verification evidence',
        query: options.queryText,
        route: sourceSearchRoute(options.queryText, 'verification'),
        sourceDetailTarget: options.sourceDetailTarget ?? null,
      },
    ];
  }

  private enrichSourceSearchResult(result: PrivateSearchResult, query: string): PrivateSearchResult {
    const studyRoute = sourceResultStudyRoute(result);
    const routedResult: PrivateSearchResult = {
      ...result,
      target: {
        ...result.target,
        route: studyRoute,
      },
    };
    const guidanceTarget = this.createSourceResultGuidanceTarget(result, query);
    return {
      ...routedResult,
      deepLinks: this.createSourceResultDeepLinks(routedResult, query, guidanceTarget),
      openGuidanceTarget: guidanceTarget,
    };
  }

  private async createAyahReferenceSourceResults(
    query: string,
    domain: string,
  ): Promise<PrivateSearchResult[]> {
    const reference = parseAyahReference(query);
    if (!reference) return [];

    const normalizedDomain = domain.toLowerCase();
    const include = (resultDomain: PrivateSearchResult['domain']) =>
      normalizedDomain === 'all' ||
      normalizedDomain === resultDomain ||
      (normalizedDomain === 'translation' && resultDomain === 'translation') ||
      (normalizedDomain === 'quran' && resultDomain === 'quran') ||
      (normalizedDomain === 'tafsir' && resultDomain === 'tafsir');

    const surah = await this.repository.getQuranSurah(reference.surahNumber, {});
    const ayah = surah.ayahs.find((item) => item.ayahNumber === reference.ayahNumber);
    if (!ayah) return [];

    const results: PrivateSearchResult[] = [];
    if (include('quran')) results.push(this.createAyahQuranSearchResult(ayah));
    if (ayah.translation && include('translation')) results.push(this.createAyahTranslationSearchResult(ayah));
    const tafsir = ayah.tafsirPassages.find((passage) => !passage.blankText);
    if (tafsir && include('tafsir')) results.push(this.createAyahTafsirSearchResult(ayah, tafsir));
    return results;
  }

  private createAyahQuranSearchResult(ayah: QuranSurahAyah): PrivateSearchResult {
    return {
      domain: 'quran',
      resultId: `quran-reference:${ayah.verseKey}`,
      title: ayah.verseKey,
      subtitle: 'Quran ayah',
      snippet: ayah.quranText,
      score: 99,
      reference: {
        surahNumber: ayah.surahNumber,
        ayahNumber: ayah.ayahNumber,
        verseKey: ayah.verseKey,
        hadithRecordId: null,
        collectionKey: null,
      },
      target: {
          route: ayahStudyRoute(ayah.surahNumber, ayah.ayahNumber),
        surahNumber: ayah.surahNumber,
        ayahNumber: ayah.ayahNumber,
        verseKey: ayah.verseKey,
      },
    };
  }

  private createAyahTranslationSearchResult(ayah: QuranSurahAyah): PrivateSearchResult {
    return {
      domain: 'translation',
      resultId: `translation-reference:${ayah.verseKey}:${ayah.translation?.translationTextId ?? 'default'}`,
      title: `${ayah.verseKey} translation`,
      subtitle: ayah.translation?.variantType ?? 'Translation',
      snippet: ayah.translation?.text ?? '',
      score: 98,
      reference: {
        surahNumber: ayah.surahNumber,
        ayahNumber: ayah.ayahNumber,
        verseKey: ayah.verseKey,
        hadithRecordId: null,
        collectionKey: null,
      },
      target: {
        route: ayahStudyRoute(ayah.surahNumber, ayah.ayahNumber),
        surahNumber: ayah.surahNumber,
        ayahNumber: ayah.ayahNumber,
        verseKey: ayah.verseKey,
        languageCode: 'en',
      },
    };
  }

  private createAyahTafsirSearchResult(
    ayah: QuranSurahAyah,
    tafsir: QuranSurahAyah['tafsirPassages'][number],
  ): PrivateSearchResult {
    return {
      domain: 'tafsir',
      resultId: `tafsir-reference:${tafsir.passageId}`,
      title: `Tafsir ${ayah.verseKey}`,
      subtitle: tafsir.sourceRole ?? 'Tafsir context',
      snippet: tafsir.text,
      score: 97,
      reference: {
        surahNumber: ayah.surahNumber,
        ayahNumber: ayah.ayahNumber,
        verseKey: ayah.verseKey,
        hadithRecordId: null,
        collectionKey: null,
      },
      target: {
        route: ayahStudyRoute(ayah.surahNumber, ayah.ayahNumber),
        surahNumber: ayah.surahNumber,
        ayahNumber: ayah.ayahNumber,
        verseKey: ayah.verseKey,
        passageId: tafsir.passageId,
      },
    };
  }

  private dedupeSourceSearchResults(results: PrivateSearchResult[]): PrivateSearchResult[] {
    const seen = new Set<string>();
    return results.filter((result) => {
      if (seen.has(result.resultId)) return false;
      seen.add(result.resultId);
      return true;
    });
  }

  private createSourceResultGuidanceTarget(
    result: PrivateSearchResult,
    query: string,
  ): PrivateSearchResult['openGuidanceTarget'] {
    const surahNumber = result.reference.surahNumber ?? result.target.surahNumber ?? null;
    const ayahNumber = result.reference.ayahNumber ?? result.target.ayahNumber ?? null;
    const verseKey = result.reference.verseKey ?? result.target.verseKey ?? null;
    const hadithRecordId = resultHadithRecordId(result);

    if (hadithRecordId) {
      return {
        entryPoint: 'hadith_record',
        input: result.title || query,
        domain: 'hadith',
        sourceResultId: result.resultId,
        hadithRecordId,
      };
    }

    if (surahNumber) {
      return {
        entryPoint: 'quran_ayah',
        input: verseKey ?? result.title ?? query,
        domain: 'quran',
        sourceResultId: result.resultId,
        quran: {
          surahNumber,
          ayahNumber: ayahNumber ?? undefined,
          verseKey: verseKey ?? undefined,
        },
      };
    }

    return {
      entryPoint: 'learn_theme',
      input: result.title || query,
      domain: result.domain,
      sourceResultId: result.resultId,
    };
  }

  private createSourceResultDeepLinks(
    result: PrivateSearchResult,
    query: string,
    guidanceTarget: PrivateSearchResult['openGuidanceTarget'],
  ): RafiqDeepLink[] {
    const sourceTarget = this.sourceDetailTargetForSearchResult(result);
    const sourceRoute = sourceDetailRoute(sourceTarget);
    const links: RafiqDeepLink[] = [
      {
        linkId: `${result.resultId}:open`,
        label: this.openLabelForSearchResult(result),
        kind: result.domain === 'hadith' ? 'open_narration' : result.domain === 'tafsir' ? 'open_tafsir' : 'read_ayah',
        route: result.target.route,
        sourceDetailTarget: sourceTarget,
        guidanceTarget,
      },
      {
        linkId: `${result.resultId}:guidance`,
        label: 'Open guidance',
        kind: 'open_guidance',
        route: '/search',
        sourceDetailTarget: sourceTarget,
        guidanceTarget,
      },
      {
        linkId: `${result.resultId}:sources`,
        label: 'Source detail',
        kind: 'source_detail',
        route: sourceRoute ?? result.target.route,
        sourceDetailTarget: sourceTarget,
        guidanceTarget: null,
      },
    ];

    if (result.domain === 'hadith') {
      links.push({
        linkId: `${result.resultId}:quran-connection`,
        label: 'Search Quran connection',
        kind: 'search_quran_connection',
        route: sourceSearchRoute(result.snippet || query, 'quran'),
        sourceDetailTarget: null,
        guidanceTarget: null,
      });
    } else {
      links.push({
        linkId: `${result.resultId}:sunnah-support`,
        label: 'Find Sunnah support',
        kind: 'find_sunnah',
        route: sourceSearchRoute(result.reference.verseKey ?? result.title ?? query, 'hadith'),
        sourceDetailTarget: null,
        guidanceTarget: null,
      });
    }

    return links;
  }

  private sourceDetailTargetForSearchResult(result: PrivateSearchResult): { entityType: string; entityId: string } | null {
    const hadithRecordId = resultHadithRecordId(result);
    if (hadithRecordId) return { entityType: 'hadith_record', entityId: hadithRecordId };
    if (result.target.passageId) return { entityType: 'tafsir_passage', entityId: String(result.target.passageId) };
    if (result.target.topicId) return { entityType: 'source_topic', entityId: String(result.target.topicId) };
    if (result.target.themeGroupId) return { entityType: 'source_ayah_theme_group', entityId: String(result.target.themeGroupId) };
    if (result.reference.verseKey ?? result.target.verseKey) {
      return { entityType: 'quran_ayah_text', entityId: String(result.reference.verseKey ?? result.target.verseKey) };
    }
    return null;
  }

  private openLabelForSearchResult(result: PrivateSearchResult): string {
    if (result.domain === 'hadith') return 'Open narration';
    if (result.domain === 'tafsir') return 'Open tafsir';
    if (result.domain === 'topic') return 'Open topic';
    if (result.domain === 'ayah_theme') return 'Open theme';
    return 'Read ayah';
  }

  private filterSourceSearchResults(results: PrivateSearchResult[], domain: string): PrivateSearchResult[] {
    const normalized = domain.toLowerCase();
    if (normalized === 'all') return results;
    if (normalized === 'topics' || normalized === 'topic') return results.filter((result) => result.domain === 'topic');
    if (normalized === 'themes' || normalized === 'theme' || normalized === 'ayah_theme') {
      return results.filter((result) => result.domain === 'ayah_theme');
    }
    if (normalized === 'translation') {
      return results.filter((result) => result.domain === 'translation');
    }
    if (normalized === 'verification') {
      return results.filter((result) => result.domain === 'verification');
    }
    return results.filter((result) => result.domain === normalized);
  }

  private groupSourceSearchResults(results: PrivateSearchResult[]): PrivateSourceSearchGroup[] {
    const order: Array<{ groupKey: PrivateSourceSearchGroupKey; label: string }> = [
      { groupKey: 'quran', label: 'Quran' },
      { groupKey: 'translation', label: 'Translations' },
      { groupKey: 'tafsir', label: 'Tafsir' },
      { groupKey: 'hadith', label: 'Hadith' },
      { groupKey: 'topics', label: 'Topics' },
      { groupKey: 'themes', label: 'Themes' },
      { groupKey: 'verification', label: 'Verification' },
    ];

    return order
      .map((group) => {
        const groupResults = results.filter((result) => sourceGroupKeyForResult(result) === group.groupKey);
        return {
          ...group,
          total: groupResults.length,
          results: groupResults,
        };
      })
      .filter((group) => group.total > 0);
  }

  private facetsForSourceGroups(groups: PrivateSourceSearchGroup[]): Record<string, number> {
    return groups.reduce<Record<string, number>>((facets, group) => {
      facets[group.groupKey] = group.total;
      return facets;
    }, {});
  }

  private sourceSearchRank(result: PrivateSearchResult, requestedDomain: string): number {
    const requested = requestedDomain.toLowerCase();
    const domainMatch =
      requested === 'all' ||
      requested === result.domain ||
      (requested === 'topics' && result.domain === 'topic') ||
      (requested === 'themes' && result.domain === 'ayah_theme')
        ? 10
        : 0;
    const score = typeof result.score === 'number' ? result.score : 0;
    const routeWeight = result.target.route ? 1 : 0;
    const guidanceWeight = result.openGuidanceTarget ? 1 : 0;
    const domainWeight =
      result.domain === 'quran'
        ? 5
        : result.domain === 'tafsir'
          ? 4
          : result.domain === 'hadith'
            ? 3
            : 2;
    return domainMatch + score + routeWeight + guidanceWeight + domainWeight;
  }

  private createLearningPath(
    quranAnchor: GuidanceSessionQuranAnchor | null,
    sunnahSupport: GuidanceSessionSunnahSupport[],
    sessionId: string,
  ): GuidanceSessionLearningPath {
    const hasTafsir = Boolean(quranAnchor?.tafsirSummary);
    const firstSunnah = sunnahSupport[0] ?? null;

    return {
      title: quranAnchor ? `Learn from ${quranAnchor.verseKey}` : 'Learning path needs stronger evidence',
      summary: quranAnchor
        ? 'Move from Quran recitation to meaning, tafsir context, Sunnah support, reflection, and one action.'
        : 'RAFIQ could not open a learning path without a Quran anchor.',
      steps: [
        {
          stepId: `${sessionId}:quran`,
          kind: 'quran',
          label: 'Quran',
          title: quranAnchor ? `Read ${quranAnchor.verseKey}` : 'Quran anchor unavailable',
          body: quranAnchor?.simpleMeaning ?? 'No Quran anchor was selected for this session.',
          reference: quranAnchor?.verseKey ?? null,
          route: quranAnchor ? ayahStudyRoute(quranAnchor.surahNumber, quranAnchor.ayahNumber) : null,
          sourceDetailTarget: quranAnchor?.sourceDetailTarget ?? null,
          available: Boolean(quranAnchor),
        },
        {
          stepId: `${sessionId}:tafsir`,
          kind: 'tafsir',
          label: 'Tafsir',
          title: hasTafsir ? 'Open the context' : 'Tafsir context pending',
          body: quranAnchor?.tafsirSummary ?? 'No tafsir passage is attached to this anchor yet.',
          reference: quranAnchor?.verseKey ?? null,
          route: quranAnchor ? ayahStudyRoute(quranAnchor.surahNumber, quranAnchor.ayahNumber) : null,
          sourceDetailTarget: quranAnchor?.ayah?.tafsirPassages.find((passage) => !passage.blankText)?.sourceDetailTarget ?? null,
          available: hasTafsir,
        },
        {
          stepId: `${sessionId}:sunnah`,
          kind: 'sunnah',
          label: 'Hadith',
          title: firstSunnah ? firstSunnah.title : 'Sunnah support pending',
          body: firstSunnah?.practiceConnection ?? 'No Sunnah support is attached to this session yet.',
          reference: firstSunnah?.reference ?? null,
          route: firstSunnah?.sourceDetailTarget?.entityId ? `/hadith/${firstSunnah.sourceDetailTarget.entityId}` : '/hadith',
          sourceDetailTarget: firstSunnah?.sourceDetailTarget ?? null,
          available: Boolean(firstSunnah),
        },
        {
          stepId: `${sessionId}:reflection`,
          kind: 'reflection',
          label: 'Reflect',
          title: 'Pause and notice',
          body: quranAnchor
            ? `What is ${quranAnchor.verseKey} asking me to notice today?`
            : 'What question should I bring back with clearer context?',
          reference: quranAnchor?.verseKey ?? null,
          route: null,
          sourceDetailTarget: null,
          available: true,
        },
        {
          stepId: `${sessionId}:action`,
          kind: 'action',
          label: 'Act',
          title: 'Carry one action',
          body: quranAnchor
            ? 'Read the Quran anchor once more, then choose one small act of obedience.'
            : 'Ask again with one clearer detail before acting.',
          reference: quranAnchor?.verseKey ?? null,
          route: quranAnchor ? ayahStudyRoute(quranAnchor.surahNumber, quranAnchor.ayahNumber) : '/answer',
          sourceDetailTarget: null,
          available: true,
        },
      ],
    };
  }

  private verificationSummary(
    responseState: GuidanceSession['verification']['status'],
    evidenceCount: number,
    quranAnchor: GuidanceSessionQuranAnchor | null,
    sunnahCount: number,
    expandedNeed?: ExpandedGuidanceNeed,
  ): string {
    if (responseState === 'blocked' || responseState === 'source_unavailable') {
      return 'RAFIQ blocked this session because evidence is insufficient.';
    }
    if (responseState === 'scholar_escalation') return 'This session requires scholar review before application.';
    if (!quranAnchor) return 'RAFIQ could not select a Quran anchor yet.';
    const expansion = expandedNeed?.confidence && expandedNeed.confidence >= 0.8
      ? ` Theme expansion: ${expandedNeed.theme}.`
      : '';
    return `RAFIQ selected a Quran anchor with ${evidenceCount} evidence item(s) and ${sunnahCount} Sunnah support item(s).${expansion}`;
  }

  private createGuidanceMessage(
    quranAnchor: GuidanceSessionQuranAnchor | null,
    sunnahSupport: GuidanceSessionSunnahSupport[],
    _fallback?: string | null,
  ): string {
    if (!quranAnchor) {
      return 'I could not find enough verified evidence for this guidance yet. Ask again with one clearer detail, or choose a Quran theme already available in the library.';
    }

    const tafsirLine =
      quranAnchor.tafsirSummary && quranAnchor.tafsirSummary !== quranAnchor.simpleMeaning
        ? `The tafsir opens this meaning: ${quranAnchor.tafsirSummary}`
        : null;
    const sunnahLine = sunnahSupport[0]
      ? `Sunnah support: ${sunnahSupport[0].practiceConnection}`
      : null;

    return [
      `Begin with ${quranAnchor.verseKey}.`,
      quranAnchor.simpleMeaning,
      tafsirLine,
      sunnahLine,
    ]
      .filter(Boolean)
      .join(' ');
  }

  getModelAdapterStatus(): PrivateModelAdapterStatusResponse {
    const providerEnabled = process.env.RAFIQ_MODEL_PROVIDER_ENABLED === 'true';
    const providerKey = process.env.RAFIQ_MODEL_PROVIDER ?? 'disabled';
    const modelName = process.env.RAFIQ_MODEL_NAME ?? 'not_configured';
    const executionMode = process.env.RAFIQ_MODEL_EXECUTION_MODE ?? 'disabled_dry_run';

    return {
      notice: {
        label: 'UNAPPROVED CONTENT - NOT FOR PUBLICATION',
        message:
          'Private RAFIQ development and testing only. Do not expose through public API, public app, exports, or AI answers until approval gates pass.',
        rightsStatus: 'pending',
        attributionStatus: 'pending',
        editorialStatus: 'unreviewed',
        scholarContentStatus: 'unreviewed',
        publicationStatus: 'private_only',
      },
      modelAdapter: {
        providerEnabled,
        providerKey,
        modelName,
        executionMode,
        liveExecutionAllowed: false,
        status: providerEnabled ? 'configured_dry_run' : 'disabled',
      },
    };
  }

  createModelAdapterRun(guidedAnswerId: string): Promise<PrivateModelAdapterRunResponse> {
    const status = this.getModelAdapterStatus().modelAdapter;
    return this.repository.createModelAdapterRun({
      guidedAnswerId,
      providerEnabled: status.providerEnabled,
      providerKey: status.providerKey,
      modelName: status.modelName,
      executionMode: status.executionMode,
    });
  }

  getModelAdapterRun(modelAdapterRunId: string): Promise<PrivateModelAdapterRunResponse> {
    return this.repository.getModelAdapterRun(modelAdapterRunId);
  }

  createAnswerValidationRun(
    options: AnswerValidationRunOptions,
  ): Promise<PrivateAnswerValidationRunResponse> {
    return this.repository.createAnswerValidationRun(options);
  }

  getAnswerValidationRun(
    answerValidationRunId: string,
  ): Promise<PrivateAnswerValidationRunResponse> {
    return this.repository.getAnswerValidationRun(answerValidationRunId);
  }

  updateAnswerValidationReviewerAction(options: {
    answerValidationRunId: string;
    action: string;
    notes?: string;
  }): Promise<PrivateAnswerValidationRunResponse> {
    return this.repository.updateAnswerValidationReviewerAction(options);
  }
}
