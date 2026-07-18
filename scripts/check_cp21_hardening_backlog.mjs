import { readFile } from 'node:fs/promises';

const docPath = 'docs/09_sprints/resource_audit_import_prototype/CP21_PRIVATE_COMPANION_MVP_HARDENING_BACKLOG.md';
const doc = await readFile(docPath, 'utf8');

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const requiredGates = [
  'CP21A Target-Device Product Owner UAT',
  'CP21B Risk And Scholar Escalation Implementation',
  'CP21C Semantic Ranking And Cross-Source Selection',
  'CP21D Backend Growth Memory Contract',
  'CP21E Hadith Replacement And Verification Workflow',
  'CP21F Public Release Gate Register',
  'CP21G Quran/Tafsir/Hadith Study Path Depth',
  'CP21H Companion Device Operating Constraints',
];

const requiredPhrases = [
  'Public release remains NO-GO',
  'Target-device evidence comes before more screen expansion',
  'CP21C - Semantic Ranking And Cross-Source Selection',
  'Do not add new route chrome before CP21C ranking evidence',
];

for (const gate of requiredGates) {
  assert(doc.includes(gate), `Missing CP21 gate: ${gate}`);
}

for (const phrase of requiredPhrases) {
  assert(doc.includes(phrase), `Missing CP21 acceptance phrase: ${phrase}`);
}

const h0Count = (doc.match(/\| H0 \|/g) ?? []).length;
const h1Count = (doc.match(/\| H1 \|/g) ?? []).length;
assert(h0Count >= 6, `Expected at least 6 H0 gates, found ${h0Count}.`);
assert(h1Count >= 2, `Expected at least 2 H1 gates, found ${h1Count}.`);

console.log(JSON.stringify({
  status: 'pass',
  docPath,
  gates: requiredGates.length,
  h0Count,
  h1Count,
  nextCheckpoint: 'CP21C - Semantic Ranking And Cross-Source Selection',
  publicRelease: 'no_go',
}, null, 2));
