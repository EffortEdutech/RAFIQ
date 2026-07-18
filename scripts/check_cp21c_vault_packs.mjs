import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const PACK_DIR = 'data/vault/cp21c/ranking-cases';
const EVIDENCE_PATH = 'data/graphify/cp21c/evidence.json';

const REQUIRED_FRONT_MATTER = [
  'artifact_id',
  'artifact_type',
  'title',
  'status',
  'environment',
  'access_level',
  'public_safe',
  'generated_at',
  'generated_by',
  'source_graph_id',
  'canonical_refs',
  'source_refs',
  'release_state',
  'review_state',
  'quality_state',
  'case_id',
  'case_group',
  'case_type',
  'scoring_mode',
  'score',
  'pass',
];

const REQUIRED_SECTIONS = [
  'Summary',
  'Prompt Or Sanitized Case Label',
  'Expected Case Type',
  'Selected Quran Anchor',
  'Candidate Quran Anchors',
  'Selected Tafsir Passage',
  'Candidate Tafsir Passages',
  'Selected Hadith Support',
  'Rejected Hadith Candidates And Reasons',
  'Score Breakdown',
  'Quality/Release Blockers',
  'Remediation If Score Is Low',
  'Canonical References',
  'Source And Attribution',
  'Evidence Graph',
  'Quality And Review State',
  'Release Boundary',
  'Open Questions Or Blockers',
];

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function parseFrontMatter(content, file) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
  assert(match, `${file} missing YAML front matter`);
  const data = {};
  for (const line of match[1].split(/\r?\n/)) {
    const index = line.indexOf(':');
    if (index === -1) continue;
    data[line.slice(0, index).trim()] = line.slice(index + 1).trim();
  }
  return data;
}

function scalar(value) {
  return String(value ?? '').replace(/^"|"$/g, '');
}

const evidence = JSON.parse(await readFile(EVIDENCE_PATH, 'utf8'));
const expectedCaseIds = new Set(evidence.cases.map((item) => item.caseId));

const files = (await readdir(PACK_DIR)).filter((file) => file.endsWith('.md')).sort();
assert(files.length === evidence.cases.length, `expected ${evidence.cases.length} packs, found ${files.length}`);

const seenCaseIds = new Set();
const scores = [];
let publicSafeCount = 0;

for (const file of files) {
  const fullPath = path.join(PACK_DIR, file);
  const content = await readFile(fullPath, 'utf8');
  const frontMatter = parseFrontMatter(content, file);

  for (const field of REQUIRED_FRONT_MATTER) {
    assert(Object.prototype.hasOwnProperty.call(frontMatter, field), `${file} missing front matter field ${field}`);
  }

  for (const section of REQUIRED_SECTIONS) {
    assert(content.includes(`## ${section}`), `${file} missing section ${section}`);
  }

  assert(scalar(frontMatter.artifact_type) === 'ranking_case_pack', `${file} artifact_type must be ranking_case_pack`);
  assert(scalar(frontMatter.environment) === 'private_local', `${file} environment must be private_local`);
  assert(scalar(frontMatter.access_level) === 'developer_private', `${file} access_level must be developer_private`);
  assert(frontMatter.public_safe === 'false', `${file} public_safe must be false`);
  assert(content.includes('not the full RAFIQ resource graph'), `${file} must state it is not the full RAFIQ resource graph`);
  assert(content.includes('must not be exposed through'), `${file} must state public release boundary`);

  if (frontMatter.public_safe === 'true') publicSafeCount += 1;
  const caseId = scalar(frontMatter.case_id);
  assert(expectedCaseIds.has(caseId), `${file} has unknown case_id ${caseId}`);
  assert(!seenCaseIds.has(caseId), `duplicate pack for ${caseId}`);
  seenCaseIds.add(caseId);

  const score = Number(frontMatter.score);
  assert(Number.isFinite(score) && score >= 0 && score <= 100, `${file} score must be 0-100`);
  scores.push(score);
}

assert(seenCaseIds.size === expectedCaseIds.size, 'not all evidence cases have packs');
assert(publicSafeCount === 0, 'vault packs must not be public safe for CP21C');

console.log(JSON.stringify({
  status: 'pass',
  packDir: PACK_DIR,
  packCount: files.length,
  publicSafeCount,
  minScore: Math.min(...scores),
  maxScore: Math.max(...scores),
}, null, 2));
