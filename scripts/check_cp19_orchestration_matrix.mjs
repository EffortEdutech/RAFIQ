const API_URL = process.env.RAFIQ_API_URL ?? 'http://127.0.0.1:8056';

const NORMAL_HADITH_ID = '5afbb787-10dc-b1c9-8bc6-4beb0299d569';

async function getJson(path) {
  const response = await fetch(`${API_URL}${path}`);
  if (!response.ok) {
    throw new Error(`${path} failed with ${response.status}`);
  }
  return response.json();
}

function guidancePath(params) {
  const query = new URLSearchParams(params);
  return `/api/private-content/guidance/session?${query.toString()}`;
}

function sourceSearchPath(params) {
  const query = new URLSearchParams(params);
  return `/api/private-content/search/sources?${query.toString()}`;
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function learningStep(session, kind) {
  return session.learningPath?.steps?.find((step) => step.kind === kind) ?? null;
}

function scoreGuidanceCase(session, expectation) {
  let score = 0;
  const notes = [];
  const ready = session.status === 'ready';
  const blocked = session.status === 'blocked_no_evidence';
  const hasQuran = Boolean(session.quranAnchor);
  const hasTafsir = Boolean(learningStep(session, 'tafsir')?.available);
  const hasSunnah = session.sunnahSupport.length > 0;
  const hasReflection = Boolean(session.guidance.reflectionPrompt);
  const hasAction = Boolean(session.guidance.action?.label);
  const hasFiveSteps = session.learningPath?.steps?.length === 5;
  const sourceResultCount = session.sourceMap?.searchResults?.length ?? 0;

  if ((expectation.status === 'ready' && ready) || (expectation.status === 'blocked_no_evidence' && blocked)) score += 20;
  else notes.push(`status:${session.status}`);

  if (expectation.quran === undefined || expectation.quran === hasQuran) score += 15;
  else notes.push(`quran:${hasQuran ? session.quranAnchor?.verseKey : 'none'}`);

  if (!expectation.verseKey || session.quranAnchor?.verseKey === expectation.verseKey) score += 10;
  else notes.push(`verse:${session.quranAnchor?.verseKey ?? 'none'}`);

  if (expectation.tafsir === undefined || expectation.tafsir === hasTafsir) score += 10;
  else notes.push(`tafsir:${hasTafsir}`);

  if (expectation.sunnah === undefined || expectation.sunnah === hasSunnah) score += 10;
  else notes.push(`sunnah:${session.sunnahSupport.length}`);

  if (expectation.minEvidence === undefined || session.verification.evidenceCount >= expectation.minEvidence) score += 10;
  else notes.push(`evidence:${session.verification.evidenceCount}`);

  if (expectation.minQuranEvidence === undefined || session.verification.quranEvidenceCount >= expectation.minQuranEvidence) score += 5;
  else notes.push(`quranEvidence:${session.verification.quranEvidenceCount}`);

  if (hasFiveSteps) score += 10;
  else notes.push(`steps:${session.learningPath?.steps?.length ?? 0}`);

  if (hasReflection && hasAction) score += 5;
  else notes.push('reflection/action missing');

  if (sourceResultCount > 0 || expectation.status === 'blocked_no_evidence') score += 5;
  else notes.push('source map empty');

  return { score, notes };
}

const guidanceCases = [
  {
    name: 'natural_patience',
    params: {
      entryPoint: 'ask',
      input: 'patience before a difficult conversation',
      language: 'en',
      domain: 'all',
    },
    expectation: {
      status: 'ready',
      quran: true,
      tafsir: true,
      minEvidence: 1,
      minQuranEvidence: 1,
    },
  },
  {
    name: 'natural_prayer_focus',
    params: {
      entryPoint: 'ask',
      input: 'help me focus in prayer',
      language: 'en',
      domain: 'all',
    },
    expectation: {
      status: 'ready',
      quran: true,
      tafsir: true,
      minEvidence: 1,
      minQuranEvidence: 1,
    },
  },
  {
    name: 'direct_ayah_2_255',
    params: {
      entryPoint: 'quran_ayah',
      input: '2:255',
      language: 'en',
      domain: 'all',
      surahNumber: '2',
      ayahNumber: '255',
      verseKey: '2:255',
    },
    expectation: {
      status: 'ready',
      quran: true,
      verseKey: '2:255',
      tafsir: true,
      minEvidence: 1,
      minQuranEvidence: 1,
    },
  },
  {
    name: 'anchored_hadith_intention',
    params: {
      entryPoint: 'hadith_record',
      input: 'intention',
      language: 'en',
      domain: 'hadith',
      hadithRecordId: NORMAL_HADITH_ID,
    },
    expectation: {
      status: 'ready',
      quran: false,
      tafsir: false,
      sunnah: true,
      minEvidence: 1,
    },
    anchoredHadithId: NORMAL_HADITH_ID,
  },
  {
    name: 'blocked_unknown',
    params: {
      entryPoint: 'ask',
      input: 'zzzz_unmapped_private_test_phrase',
      language: 'en',
      domain: 'all',
    },
    expectation: {
      status: 'blocked_no_evidence',
      quran: false,
      tafsir: false,
      sunnah: false,
    },
  },
];

const rows = [];

for (const testCase of guidanceCases) {
  const payload = await getJson(guidancePath(testCase.params));
  const session = payload.session;
  assert(session, `${testCase.name} did not return a session`);
  const { score, notes } = scoreGuidanceCase(session, testCase.expectation);
  const tafsirStep = learningStep(session, 'tafsir');
  const sunnahStep = learningStep(session, 'sunnah');

  if (testCase.expectation.status === 'ready') {
    assert(session.status === 'ready', `${testCase.name} expected ready, got ${session.status}`);
    assert(score >= 80, `${testCase.name} scored ${score}; notes: ${notes.join(', ')}`);
  } else {
    assert(session.status === 'blocked_no_evidence', `${testCase.name} expected blocked_no_evidence, got ${session.status}`);
    assert(!session.quranAnchor, `${testCase.name} should not have a Quran anchor`);
    assert(session.verification.evidenceCount === 0, `${testCase.name} should not have evidence`);
  }

  if (testCase.expectation.quran === true) assert(session.quranAnchor, `${testCase.name} needs a Quran anchor`);
  if (testCase.expectation.quran === false) assert(!session.quranAnchor, `${testCase.name} must not force a Quran anchor`);
  if (testCase.expectation.verseKey) assert(session.quranAnchor?.verseKey === testCase.expectation.verseKey, `${testCase.name} expected ${testCase.expectation.verseKey}`);
  if (testCase.expectation.tafsir === true) assert(tafsirStep?.available && tafsirStep.route?.startsWith('/tafsir/'), `${testCase.name} needs an open tafsir route`);
  if (testCase.expectation.sunnah === true) assert(sunnahStep?.available && session.sunnahSupport.length > 0, `${testCase.name} needs Sunnah support`);
  if (testCase.anchoredHadithId) {
    assert(
      session.sunnahSupport[0]?.sourceDetailTarget?.entityId === testCase.anchoredHadithId,
      `${testCase.name} did not keep opened narration anchored first`,
    );
  }

  rows.push({
    case: testCase.name,
    status: session.status,
    score,
    quran: session.quranAnchor?.verseKey ?? null,
    tafsirRoute: tafsirStep?.route ?? null,
    sunnahSupport: session.sunnahSupport.length,
    evidence: session.verification.evidenceCount,
    quranEvidence: session.verification.quranEvidenceCount,
    sunnahEvidence: session.verification.sunnahEvidenceCount,
    notes,
  });
}

const sourceSearch = await getJson(sourceSearchPath({ q: '2:255', domain: 'all', limit: '12' }));
const sourceGroups = new Set(sourceSearch.groups.map((group) => group.groupKey));
const exactQuran = sourceSearch.results.find((result) => result.domain === 'quran' && result.reference.verseKey === '2:255');
const exactTranslation = sourceSearch.results.find((result) => result.domain === 'translation' && result.reference.verseKey === '2:255');
const exactTafsir = sourceSearch.results.find((result) => result.domain === 'tafsir' && result.reference.verseKey === '2:255');
const exactQuranCount = sourceSearch.results.filter((result) => result.domain === 'quran' && result.reference.verseKey === '2:255').length;
assert(sourceGroups.has('quran'), 'Source Search did not include Quran group for 2:255.');
assert(sourceGroups.has('translation'), 'Source Search did not include Translation group for 2:255.');
assert(sourceGroups.has('tafsir'), 'Source Search did not include Tafsir group for 2:255.');
assert(exactQuranCount === 1, `Source Search returned ${exactQuranCount} duplicate Quran rows for 2:255.`);
assert(exactQuran?.target.route === '/quran/2/255', `Quran exact result route mismatch: ${exactQuran?.target.route}`);
assert(exactTranslation?.target.route === '/quran/2/255', `Translation exact result route mismatch: ${exactTranslation?.target.route}`);
assert(exactTafsir?.target.route?.startsWith('/tafsir/'), `Tafsir exact result route mismatch: ${exactTafsir?.target.route}`);

console.log(JSON.stringify({
  status: 'pass',
  threshold: 80,
  guidanceCases: rows,
  sourceSearch: {
    query: '2:255',
    groups: sourceSearch.groups.map((group) => ({ groupKey: group.groupKey, total: group.total })),
    exactRoutes: {
      quran: exactQuran.target.route,
      translation: exactTranslation.target.route,
      tafsir: exactTafsir.target.route,
    },
    exactQuranCount,
    firstResults: sourceSearch.results.slice(0, 6).map((result) => ({
      domain: result.domain,
      title: result.title,
      route: result.target.route,
      verseKey: result.reference.verseKey,
    })),
  },
}, null, 2));
