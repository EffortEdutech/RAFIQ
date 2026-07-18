const API_URL = process.env.RAFIQ_API_URL ?? 'http://127.0.0.1:8056';

const DAMAGED_HADITH_ID = 'b568137e-f5ab-f085-3c18-86e2ad9cf386';
const NORMAL_HADITH_ID = '5afbb787-10dc-b1c9-8bc6-4beb0299d569';

async function getJson(path) {
  const response = await fetch(`${API_URL}${path}`);
  if (!response.ok) {
    throw new Error(`${path} failed with ${response.status}`);
  }
  return response.json();
}

const damaged = await getJson(`/api/private-content/hadith/record/${DAMAGED_HADITH_ID}`);
const damagedVersion = damaged.textVersions.find((version) =>
  version.qualityFlags?.includes('known_broken_phrase'),
);
if (!damagedVersion) {
  throw new Error('Damaged hadith did not expose known_broken_phrase quality flag.');
}
if (damagedVersion.qualitySeverity !== 'withheld') {
  throw new Error(`Damaged hadith quality severity was ${damagedVersion.qualitySeverity}, expected withheld.`);
}
if (damaged.qualitySummary?.withheldTextVersionCount < 1) {
  throw new Error('Hadith quality summary did not count withheld text versions.');
}

const normal = await getJson(`/api/private-content/hadith/record/${NORMAL_HADITH_ID}`);
const normalReadable = normal.textVersions.find((version) => version.languageCode !== 'ar') ?? normal.textVersions[0];
if (!normalReadable) throw new Error('Normal hadith fixture did not return any text version.');
if (normalReadable.qualitySeverity === 'withheld') {
  throw new Error(`Normal hadith ${normalReadable.languageCode} text was incorrectly withheld.`);
}

const anchored = await getJson(
  `/api/private-content/guidance/session?entryPoint=hadith_record&input=intention&language=en&domain=hadith&hadithRecordId=${NORMAL_HADITH_ID}`,
);
const support = anchored.session?.sunnahSupport?.[0];
if (support?.sourceDetailTarget?.entityId !== NORMAL_HADITH_ID) {
  throw new Error('Hadith guidance session did not keep the opened narration anchored first.');
}
if (!support?.practiceConnection || support.practiceConnection.length < 24) {
  throw new Error('Anchored Sunnah support did not include a usable practice connection.');
}

console.log(JSON.stringify({
  status: 'pass',
  damagedHadithId: DAMAGED_HADITH_ID,
  damagedSeverity: damagedVersion.qualitySeverity,
  damagedFlags: damagedVersion.qualityFlags,
  withheldTextVersionCount: damaged.qualitySummary.withheldTextVersionCount,
  normalHadithId: NORMAL_HADITH_ID,
  normalReadableLanguage: normalReadable.languageCode,
  normalReadableSeverity: normalReadable.qualitySeverity,
  anchoredSupportId: support.supportId,
}, null, 2));
