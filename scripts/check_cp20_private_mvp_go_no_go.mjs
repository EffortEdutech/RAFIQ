const API_URL = process.env.RAFIQ_API_URL ?? 'http://127.0.0.1:8056';

const NORMAL_HADITH_ID = '5afbb787-10dc-b1c9-8bc6-4beb0299d569';
const DAMAGED_HADITH_ID = 'b568137e-f5ab-f085-3c18-86e2ad9cf386';

async function getJson(path) {
  const response = await fetch(`${API_URL}${path}`);
  if (!response.ok) {
    throw new Error(`${path} failed with ${response.status}`);
  }
  return response.json();
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function makeQuery(params) {
  return new URLSearchParams(params).toString();
}

function guidancePath(params) {
  return `/api/private-content/guidance/session?${makeQuery(params)}`;
}

function step(session, kind) {
  return session.learningPath?.steps?.find((item) => item.kind === kind) ?? null;
}

const today = await getJson(guidancePath({
  entryPoint: 'today',
  input: 'patience before a difficult conversation',
  language: 'en',
  domain: 'all',
}));
const todaySession = today.session;
assert(todaySession?.status === 'ready', `Today guidance was not ready: ${todaySession?.status}`);
assert(todaySession.quranAnchor, 'Today guidance did not select a Quran anchor.');
assert(step(todaySession, 'tafsir')?.route?.startsWith('/tafsir/'), 'Today guidance did not open a tafsir study route.');
assert(todaySession.guidance?.reflectionPrompt, 'Today guidance did not include reflection.');
assert(todaySession.guidance?.action?.label, 'Today guidance did not include one action.');
assert(typeof todaySession.memory?.saved === 'boolean', 'Today guidance did not expose the session memory state.');

const askBlocked = await getJson(guidancePath({
  entryPoint: 'ask',
  input: 'zzzz_unmapped_private_test_phrase',
  language: 'en',
  domain: 'all',
}));
assert(askBlocked.session?.status === 'blocked_no_evidence', 'No-evidence Ask did not block safely.');
assert((askBlocked.session?.verification?.evidenceCount ?? -1) === 0, 'Blocked session still carried evidence.');

const sourceSearch = await getJson(`/api/private-content/search/sources?${makeQuery({
  q: '2:255',
  domain: 'all',
  limit: '12',
})}`);
const sourceGroups = new Set(sourceSearch.groups.map((group) => group.groupKey));
const exactQuranCount = sourceSearch.results.filter((result) =>
  result.domain === 'quran' && result.reference.verseKey === '2:255'
).length;
const tafsirResult = sourceSearch.results.find((result) =>
  result.domain === 'tafsir' && result.reference.verseKey === '2:255'
);
assert(sourceGroups.has('quran'), 'Source Search did not include Quran for 2:255.');
assert(sourceGroups.has('translation'), 'Source Search did not include translation for 2:255.');
assert(sourceGroups.has('tafsir'), 'Source Search did not include tafsir for 2:255.');
assert(exactQuranCount === 1, `Source Search returned ${exactQuranCount} exact Quran rows for 2:255.`);
assert(tafsirResult?.target?.passageId, 'Source Search tafsir result did not include passageId.');

const tafsir = await getJson(`/api/private-content/tafsir/passage/${tafsirResult.target.passageId}`);
assert(tafsir.passage?.text, 'Tafsir study room payload has no passage text.');
assert(tafsir.ayahs?.some((ayah) => ayah.verseKey === '2:255'), 'Tafsir study room did not include 2:255 anchor.');

const hadith = await getJson(`/api/private-content/hadith/record/${NORMAL_HADITH_ID}`);
const normalText = hadith.textVersions.find((version) => version.languageCode !== 'ar') ?? hadith.textVersions[0];
assert(normalText, 'Normal Hadith record returned no text versions.');
assert(normalText.qualitySeverity !== 'withheld', 'Normal Hadith record was incorrectly withheld.');

const damagedHadith = await getJson(`/api/private-content/hadith/record/${DAMAGED_HADITH_ID}`);
assert(
  damagedHadith.qualitySummary?.withheldTextVersionCount > 0,
  'Damaged Hadith record did not count withheld meaning text.',
);

const hadithGuidance = await getJson(guidancePath({
  entryPoint: 'hadith_record',
  input: 'intention',
  language: 'en',
  domain: 'hadith',
  hadithRecordId: NORMAL_HADITH_ID,
}));
assert(hadithGuidance.session?.status === 'ready', 'Hadith-record guidance was not ready.');
assert(
  hadithGuidance.session.sunnahSupport?.[0]?.sourceDetailTarget?.entityId === NORMAL_HADITH_ID,
  'Hadith-record guidance did not keep opened narration anchored first.',
);

console.log(JSON.stringify({
  status: 'pass',
  recommendation: 'conditional_go_private_companion_mvp',
  publicRelease: 'no_go',
  evidence: {
    today: {
      status: todaySession.status,
      quranAnchor: todaySession.quranAnchor.verseKey,
      tafsirRoute: step(todaySession, 'tafsir')?.route,
      reflection: Boolean(todaySession.guidance.reflectionPrompt),
      action: Boolean(todaySession.guidance.action?.label),
      memorySaved: todaySession.memory.saved,
      resumedFromSessionId: todaySession.memory.resumedFromSessionId,
    },
    askBlocked: {
      status: askBlocked.session.status,
      evidenceCount: askBlocked.session.verification.evidenceCount,
    },
    sourceSearch: {
      groups: sourceSearch.groups.map((group) => ({ groupKey: group.groupKey, total: group.total })),
      exactQuranCount,
      tafsirRoute: tafsirResult.target.route,
    },
    tafsir: {
      passageId: tafsirResult.target.passageId,
      ayahCount: tafsir.ayahs.length,
      comparisonCount: tafsir.comparisons.length,
    },
    hadith: {
      anchoredRecordId: NORMAL_HADITH_ID,
      normalTextSeverity: normalText.qualitySeverity,
      damagedRecordId: DAMAGED_HADITH_ID,
      damagedWithheldTextVersionCount: damagedHadith.qualitySummary.withheldTextVersionCount,
    },
  },
  conditionsBeforeBroaderRelease: [
    'Product Owner final visual inspection on target mobile or companion device.',
    'Scholar/risk escalation paths for sensitive guidance.',
    'Hadith replacement workflow for withheld damaged meaning records.',
    'Deeper semantic ranking beyond deterministic theme expansion.',
    'Backend-backed growth memory and identity model.',
    'Public rights/licensing publication gates.',
  ],
}, null, 2));
