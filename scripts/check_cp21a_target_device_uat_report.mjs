import { readFile } from 'node:fs/promises';

const reportPath = 'docs/09_sprints/resource_audit_import_prototype/CP21A_TARGET_DEVICE_UAT_EXECUTION_REPORT.md';
const packPath = 'docs/09_sprints/resource_audit_import_prototype/CP21A_TARGET_DEVICE_PRODUCT_OWNER_UAT_PACK.md';

const report = await readFile(reportPath, 'utf8');
const pack = await readFile(packPath, 'utf8');

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const requiredReportPhrases = [
  'Status: Agent target-viewport UAT Pass; physical Product Owner device sign-off pending',
  '`390 x 844` phone-class viewport',
  '`430 x 932` large-phone viewport',
  'Pass after settle retest',
  'No route overflowed at tested viewports',
  'No route returned browser console errors during UAT',
  'CP21A passes for agent-executed target-viewport UAT',
  'not yet final Product Owner physical-device acceptance',
  'TECH-030 added',
];

const requiredRoutes = [
  '`/`',
  '`/answer`',
  '`/search`',
  '`/sources?q=2%3A255&domain=all`',
  '`/quran/2/255`',
  '`/tafsir/bd7fc272-cafb-4619-810a-3c77bb00e31a`',
  '`/hadith`',
  '`/hadith/5afbb787-10dc-b1c9-8bc6-4beb0299d569`',
  '`/profile`',
  '`/settings`',
];

for (const phrase of requiredReportPhrases) {
  assert(report.includes(phrase), `CP21A report missing phrase: ${phrase}`);
}

for (const route of requiredRoutes) {
  assert(report.includes(route), `CP21A report missing route: ${route}`);
}

assert(
  pack.includes('agent target-viewport UAT passed on 2026-07-08'),
  'CP21A pack was not updated with agent target-viewport UAT status.',
);
assert(
  pack.includes('this does not replace physical Product Owner sign-off'),
  'CP21A pack lost physical Product Owner sign-off boundary.',
);

console.log(JSON.stringify({
  status: 'pass',
  reportPath,
  packPath,
  routes: requiredRoutes.length,
  viewports: ['390 x 844', '430 x 932'],
  acceptedAs: 'agent_target_viewport_uat',
  physicalProductOwnerSignoff: 'pending',
  publicRelease: 'no_go',
}, null, 2));
