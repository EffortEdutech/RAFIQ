import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const API_URL = process.env.RAFIQ_API_URL ?? 'http://127.0.0.1:8056';
const CASES_PATH = 'data/graphify/cp21c/cases.json';
const OUTPUT_PATH = 'data/graphify/cp21c/evidence.json';

function makeQuery(params) {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === '') continue;
    query.set(key, String(value));
  }
  return query.toString();
}

async function getJson(pathname) {
  const response = await fetch(`${API_URL}${pathname}`);
  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new Error(`${pathname} failed with ${response.status}${text ? `: ${text.slice(0, 200)}` : ''}`);
  }
  return response.json();
}

function guidancePath(input) {
  return `/api/private-content/guidance/session?${makeQuery({
    entryPoint: input.entryPoint,
    input: input.text,
    language: input.language ?? 'en',
    domain: input.domain ?? 'all',
    surahNumber: input.surahNumber,
    ayahNumber: input.ayahNumber,
    verseKey: input.verseKey,
    hadithRecordId: input.hadithRecordId,
  })}`;
}

function sourceSearchPath(input) {
  return `/api/private-content/search/sources?${makeQuery({
    q: input.query,
    domain: input.domain ?? 'all',
    limit: input.limit ?? 12,
  })}`;
}

function learningStep(session, kind) {
  return session?.learningPath?.steps?.find((step) => step.kind === kind) ?? null;
}

function compactSourceTarget(target) {
  if (!target) return null;
  return {
    entityType: target.entityType ?? null,
    entityId: target.entityId ?? null,
  };
}

function compactSearchResult(result) {
  return {
    domain: result.domain,
    resultId: result.resultId,
    title: result.title,
    subtitle: result.subtitle ?? null,
    score: result.score ?? null,
    reference: {
      verseKey: result.reference?.verseKey ?? null,
      surahNumber: result.reference?.surahNumber ?? null,
      ayahNumber: result.reference?.ayahNumber ?? null,
      hadithRecordId: result.reference?.hadithRecordId ?? null,
      collectionKey: result.reference?.collectionKey ?? null,
    },
    target: {
      route: result.target?.route ?? null,
      verseKey: result.target?.verseKey ?? null,
      passageId: result.target?.passageId ?? null,
      translationTextId: result.target?.translationTextId ?? null,
      hadithRecordId: result.target?.hadithRecordId ?? null,
      collectionKey: result.target?.collectionKey ?? null,
    },
    hasOpenGuidanceTarget: Boolean(result.openGuidanceTarget),
  };
}

function compactGuidanceSession(session) {
  const tafsirStep = learningStep(session, 'tafsir');
  const sunnahStep = learningStep(session, 'sunnah');
  return {
    sessionId: session.sessionId,
    status: session.status,
    createdAt: session.createdAt,
    need: {
      entryPoint: session.need?.entryPoint ?? null,
      detectedTheme: session.need?.detectedTheme ?? null,
      detectedIntent: session.need?.detectedIntent ?? null,
      requestedLanguage: session.need?.requestedLanguage ?? null,
      domainFilter: session.need?.domainFilter ?? null,
    },
    riskAssessment: {
      riskClass: session.riskAssessment?.riskClass ?? null,
      responseState: session.riskAssessment?.responseState ?? null,
      escalationRoute: session.riskAssessment?.escalationRoute ?? null,
      matchedTerms: session.riskAssessment?.matchedTerms ?? [],
      hasUserBoundary: Boolean(session.riskAssessment?.userBoundary),
    },
    verification: {
      status: session.verification?.status ?? null,
      evidenceCount: session.verification?.evidenceCount ?? 0,
      quranEvidenceCount: session.verification?.quranEvidenceCount ?? 0,
      sunnahEvidenceCount: session.verification?.sunnahEvidenceCount ?? 0,
      requiresScholarReview: Boolean(session.verification?.requiresScholarReview),
      reviewStatus: session.verification?.reviewStatus ?? null,
      evidence: (session.verification?.evidence ?? []).map((item) => ({
        citationId: item.citationId,
        domain: item.domain,
        title: item.title,
        reference: item.reference,
        target: item.target,
        reviewStatus: item.reviewStatus,
        publicReleaseStatus: item.publicReleaseStatus,
      })),
    },
    quranAnchor: session.quranAnchor
      ? {
          verseKey: session.quranAnchor.verseKey,
          surahNumber: session.quranAnchor.surahNumber,
          ayahNumber: session.quranAnchor.ayahNumber,
          hasTranslation: Boolean(session.quranAnchor.translationText),
          hasTafsirSummary: Boolean(session.quranAnchor.tafsirSummary),
          sourceDetailTarget: compactSourceTarget(session.quranAnchor.sourceDetailTarget),
          deepLinkRoutes: (session.quranAnchor.deepLinks ?? []).map((link) => link.route),
        }
      : null,
    tafsirStep: tafsirStep
      ? {
          available: Boolean(tafsirStep.available),
          route: tafsirStep.route ?? null,
          reference: tafsirStep.reference ?? null,
          sourceDetailTarget: compactSourceTarget(tafsirStep.sourceDetailTarget),
        }
      : null,
    sunnahStep: sunnahStep
      ? {
          available: Boolean(sunnahStep.available),
          route: sunnahStep.route ?? null,
          reference: sunnahStep.reference ?? null,
          sourceDetailTarget: compactSourceTarget(sunnahStep.sourceDetailTarget),
        }
      : null,
    sunnahSupport: (session.sunnahSupport ?? []).map((support, index) => ({
      index,
      supportId: support.supportId,
      title: support.title,
      reference: support.reference ?? null,
      collectionKey: support.collectionKey ?? null,
      gradeLabel: support.gradeLabel ?? null,
      verificationSummary: support.verificationSummary,
      sourceDetailTarget: compactSourceTarget(support.sourceDetailTarget),
      hadithRecordId: support.sourceDetailTarget?.entityId ?? null,
    })),
    guidance: {
      hasMessage: Boolean(session.guidance?.message),
      hasReflection: Boolean(session.guidance?.reflectionPrompt),
      hasAction: Boolean(session.guidance?.action?.label),
      nextStepRoute: session.guidance?.nextStep?.route ?? null,
    },
    learningPath: {
      title: session.learningPath?.title ?? null,
      stepCount: session.learningPath?.steps?.length ?? 0,
      steps: (session.learningPath?.steps ?? []).map((step) => ({
        kind: step.kind,
        available: Boolean(step.available),
        route: step.route ?? null,
        reference: step.reference ?? null,
        sourceDetailTarget: compactSourceTarget(step.sourceDetailTarget),
      })),
    },
    sourceMap: {
      retrievalTraceId: session.sourceMap?.retrievalTraceId ?? null,
      sourceSearchRoute: session.sourceMap?.sourceSearchRoute ?? null,
      searchResultCount: session.sourceMap?.searchResults?.length ?? 0,
      sourceTargets: (session.sourceMap?.sourceTargets ?? []).map(compactSourceTarget),
      firstSearchResults: (session.sourceMap?.searchResults ?? []).slice(0, 6).map(compactSearchResult),
    },
  };
}

function compactSourceSearch(response) {
  return {
    query: response.query,
    pagination: response.pagination,
    retrievalTrace: response.retrievalTrace,
    facets: response.facets,
    groups: (response.groups ?? []).map((group) => ({
      groupKey: group.groupKey,
      label: group.label,
      total: group.total,
      firstResults: (group.results ?? []).slice(0, 4).map(compactSearchResult),
    })),
    firstResults: (response.results ?? []).slice(0, 12).map(compactSearchResult),
    exactQuranRowsByVerse: countExactQuranRows(response.results ?? []),
  };
}

function countExactQuranRows(results) {
  const counts = {};
  for (const result of results) {
    if (result.domain !== 'quran') continue;
    const verseKey = result.reference?.verseKey;
    if (!verseKey) continue;
    counts[verseKey] = (counts[verseKey] ?? 0) + 1;
  }
  return counts;
}

async function fetchTafsirEvidence(route) {
  if (!route?.startsWith('/tafsir/')) return null;
  const passageId = route.split('/').filter(Boolean).at(1);
  if (!passageId) return null;
  const payload = await getJson(`/api/private-content/tafsir/passage/${encodeURIComponent(passageId)}`);
  return {
    passageId,
    found: Boolean(payload.passage),
    blankText: Boolean(payload.passage?.blankText),
    sourceDetailTarget: compactSourceTarget(payload.passage?.sourceDetailTarget),
    ayahKeys: (payload.ayahs ?? []).map((ayah) => ayah.verseKey),
    comparisonCount: payload.comparisons?.length ?? 0,
  };
}

async function fetchHadithEvidence(hadithRecordId) {
  if (!hadithRecordId) return null;
  const payload = await getJson(`/api/private-content/hadith/record/${encodeURIComponent(hadithRecordId)}`);
  return {
    hadithRecordId,
    record: {
      collectionKey: payload.record?.collectionKey ?? null,
      printedReference: payload.record?.printedReference ?? null,
      sourceDetailTarget: compactSourceTarget(payload.record?.sourceDetailTarget),
    },
    qualitySummary: payload.qualitySummary ?? null,
    textVersions: (payload.textVersions ?? []).map((version) => ({
      textVersionId: version.textVersionId,
      languageCode: version.languageCode,
      qualitySeverity: version.qualitySeverity ?? null,
      qualityFlags: version.qualityFlags ?? [],
      sourceDetailTarget: compactSourceTarget(version.sourceDetailTarget),
    })),
    gradeAssertions: (payload.gradeAssertions ?? []).slice(0, 5).map((grade) => ({
      assertionId: grade.assertionId,
      rawGrade: grade.rawGrade ?? null,
      normalizedLabel: grade.normalizedLabel ?? null,
      reviewStatus: grade.reviewStatus ?? null,
      sourceDetailTarget: compactSourceTarget(grade.sourceDetailTarget),
    })),
    verificationClaimCount: payload.verificationClaims?.length ?? 0,
  };
}

async function collectGuidanceEvidence(testCase) {
  const payload = await getJson(guidancePath(testCase.input));
  const session = payload.session;
  const evidence = {
    caseId: testCase.caseId,
    caseGroup: testCase.caseGroup,
    caseType: testCase.caseType,
    scoringMode: testCase.scoringMode ?? 'ordinary_ranking',
    endpoint: guidancePath(testCase.input),
    notice: payload.notice,
    session: session ? compactGuidanceSession(session) : null,
    supplemental: {
      tafsir: null,
      hadith: null,
    },
  };

  if (session) {
    const tafsirRoute = learningStep(session, 'tafsir')?.route;
    evidence.supplemental.tafsir = await fetchTafsirEvidence(tafsirRoute);

    const openedHadithId = testCase.input.hadithRecordId ?? session.sunnahSupport?.[0]?.sourceDetailTarget?.entityId;
    evidence.supplemental.hadith = await fetchHadithEvidence(openedHadithId);
  }

  return evidence;
}

async function collectSourceSearchEvidence(testCase) {
  const payload = await getJson(sourceSearchPath(testCase.input));
  const firstTafsir = payload.results?.find((result) => result.domain === 'tafsir' && result.target?.passageId);
  return {
    caseId: testCase.caseId,
    caseGroup: testCase.caseGroup,
    caseType: testCase.caseType,
    scoringMode: testCase.scoringMode ?? 'ordinary_ranking',
    endpoint: sourceSearchPath(testCase.input),
    notice: payload.notice,
    sourceSearch: compactSourceSearch(payload),
    supplemental: {
      tafsir: firstTafsir?.target?.route ? await fetchTafsirEvidence(firstTafsir.target.route) : null,
      hadith: null,
    },
  };
}

async function main() {
  const matrix = JSON.parse(await readFile(CASES_PATH, 'utf8'));
  const evidence = [];
  const errors = [];

  for (const testCase of matrix.cases) {
    try {
      if (testCase.caseType === 'guidance_session') {
        evidence.push(await collectGuidanceEvidence(testCase));
      } else if (testCase.caseType === 'source_search') {
        evidence.push(await collectSourceSearchEvidence(testCase));
      } else {
        throw new Error(`Unsupported caseType: ${testCase.caseType}`);
      }
    } catch (error) {
      errors.push({
        caseId: testCase.caseId,
        message: error instanceof Error ? error.message : String(error),
      });
    }
  }

  const ordinaryCount = evidence.filter((item) => item.scoringMode !== 'separate_escalation').length;
  const escalationCount = evidence.filter((item) => item.scoringMode === 'separate_escalation').length;
  const output = {
    evidenceId: 'cp21c-resource-graphify-evidence-v1',
    checkpoint: 'CP21C-G02',
    status: errors.length === 0 ? 'collected' : 'collected_with_errors',
    collectedAt: new Date().toISOString(),
    apiUrl: API_URL,
    matrixId: matrix.matrixId,
    productBoundary: matrix.productBoundary,
    summary: {
      totalCases: matrix.cases.length,
      collectedCases: evidence.length,
      ordinaryRankingCases: ordinaryCount,
      separateEscalationCases: escalationCount,
      errorCount: errors.length,
    },
    errors,
    cases: evidence,
  };

  await mkdir(path.dirname(OUTPUT_PATH), { recursive: true });
  await writeFile(OUTPUT_PATH, `${JSON.stringify(output, null, 2)}\n`, 'utf8');

  if (errors.length > 0) {
    console.error(JSON.stringify({ status: 'failed', outputPath: OUTPUT_PATH, errors }, null, 2));
    process.exitCode = 1;
    return;
  }

  console.log(JSON.stringify({
    status: 'pass',
    outputPath: OUTPUT_PATH,
    summary: output.summary,
  }, null, 2));
}

await main();
