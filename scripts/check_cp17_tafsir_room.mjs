const API_URL = process.env.RAFIQ_API_URL ?? 'http://127.0.0.1:8056';

async function getJson(path) {
  const response = await fetch(`${API_URL}${path}`);
  if (!response.ok) {
    throw new Error(`${path} failed with ${response.status}`);
  }
  return response.json();
}

const sourceSearch = await getJson('/api/private-content/search/sources?q=2%3A255&domain=tafsir&limit=8');
const tafsirResult = sourceSearch.results.find((result) => result.domain === 'tafsir');
if (!tafsirResult) throw new Error('No tafsir result returned for 2:255.');
if (!tafsirResult.target?.route?.startsWith('/tafsir/')) {
  throw new Error(`Tafsir source result did not route to tafsir room: ${tafsirResult.target?.route}`);
}

const passageId = tafsirResult.target.passageId;
if (!passageId) throw new Error('Tafsir result did not include passageId.');

const tafsir = await getJson(`/api/private-content/tafsir/passage/${passageId}`);
if (!tafsir.passage?.text) throw new Error('Tafsir study payload has no passage text.');
if (!tafsir.ayahs?.some((ayah) => ayah.verseKey === '2:255')) {
  throw new Error('Tafsir study payload did not include ayah 2:255.');
}

const guidance = await getJson('/api/private-content/guidance/session?entryPoint=quran_ayah&input=2%3A255&language=en&domain=all&surahNumber=2&ayahNumber=255&verseKey=2%3A255');
const tafsirStep = guidance.session?.learningPath?.steps?.find((step) => step.kind === 'tafsir');
if (!tafsirStep?.route?.startsWith('/tafsir/')) {
  throw new Error(`Guidance tafsir step did not route to tafsir room: ${tafsirStep?.route}`);
}

console.log(JSON.stringify({
  status: 'pass',
  sourceRoute: tafsirResult.target.route,
  passageId,
  ayahCount: tafsir.ayahs.length,
  comparisonCount: tafsir.comparisons.length,
  guidanceTafsirRoute: tafsirStep.route,
}, null, 2));
