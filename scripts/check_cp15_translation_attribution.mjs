const apiUrl = process.env.RAFIQ_API_URL ?? 'http://127.0.0.1:8056';

async function getJson(path) {
  const response = await fetch(`${apiUrl}${path}`);
  if (!response.ok) {
    throw new Error(`${path} failed with ${response.status}`);
  }
  return response.json();
}

function fail(message, evidence = {}) {
  return { status: 'fail', message, evidence };
}

function pass(message, evidence = {}) {
  return { status: 'pass', message, evidence };
}

const surah = await getJson('/api/private-content/quran/surah/2');
const ayah255 = surah.ayahs.find((ayah) => ayah.verseKey === '2:255');
const sourceSearch = await getJson('/api/private-content/search/sources?q=2%3A255&domain=translation');
const attributionTarget = ayah255?.translation?.sourceDetailTarget;
const attribution = attributionTarget
  ? await getJson(`/api/private-content/source/detail?entityType=${encodeURIComponent(attributionTarget.entityType)}&entityId=${encodeURIComponent(attributionTarget.entityId)}`)
  : null;

const checks = [
  ayah255?.translation?.text
    ? pass('Ayah 2:255 returns stored translation text.', {
        translationTextId: ayah255.translation.translationTextId,
        sample: ayah255.translation.text.slice(0, 160),
      })
    : fail('Ayah 2:255 has no translation in the API payload.', { edition: surah.editions.translation }),
  sourceSearch.results.length > 0
    ? pass('Source Search returns translation result for 2:255.', {
        resultCount: sourceSearch.results.length,
        first: sourceSearch.results[0],
      })
    : fail('Source Search has no translation result for 2:255.', { facets: sourceSearch.facets }),
  attribution?.sourceDetail?.provenance?.[0]?.snapshot?.attributionText
    ? pass('Translation attribution has source attribution text.', {
        title: attribution.sourceDetail.title,
        attributionText: attribution.sourceDetail.provenance[0].snapshot.attributionText,
      })
    : fail('Translation attribution text is missing.', { attributionTarget }),
];

const status = checks.every((check) => check.status === 'pass') ? 'pass' : 'fail';
console.log(JSON.stringify({ status, checks }, null, 2));

if (status !== 'pass') process.exit(1);
