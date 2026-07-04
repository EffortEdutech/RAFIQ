import { Link } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { PublicActionCard } from '../../src/components/public/PublicActionCard';
import { PublicAppShell } from '../../src/components/public/PublicAppShell';
import { PublicBoundaryPanel } from '../../src/components/public/PublicBoundaryPanel';
import { PublicStatusBadge } from '../../src/components/public/PublicStatusBadge';
import {
  publicColors,
  publicRadii,
  publicShadows,
  publicSpacing,
  publicTypography,
} from '../../src/theme/publicDesignSystem';

const SOURCE_JOURNEY = [
  ['Imported privately', 'RAFIQ can test structure, search, reading, and answer workflows without publishing the content.'],
  ['Rights and attribution checked', 'A source must have permitted use, attribution text, required links, and version identity recorded.'],
  ['Editorial and scholar review', 'Content display and derived guidance must be reviewed before public use.'],
  ['Approved public or blocked', 'Only approved source versions appear publicly; everything else remains hidden or rolled back.'],
];

const TRUST_PROMISES = [
  ['No hidden source guessing', 'Users should see whether source attribution is approved, pending, or blocked.'],
  ['No premature public content', 'Release-filtered public APIs exclude pending private content.'],
  ['No silent rollback', 'If a source is withdrawn, RAFIQ should show a controlled not-public or rollback state.'],
  ['No authority theatre', 'Source trust explains boundaries; it does not pretend approval work is finished.'],
];

const ATTRIBUTION_CHECKLIST = [
  'Source name and source key',
  'Snapshot or edition identity',
  'Author, translator, editor, publisher, or maintainer',
  'License name, permitted-use note, and required links',
  'Rights, attribution, editorial, scholar/content, and publication statuses',
];

const DETAIL_PREVIEWS = [
  ['Quran source preview', '/public/source/quran-preview?entityType=quran_ayah_text'],
  ['Hadith source preview', '/public/source/hadith-preview?entityType=hadith_record'],
];

export default function PublicSourcesScreen() {
  return (
    <PublicAppShell
      eyebrow="Source Trust"
      title="Trust is part of the product, not a footnote."
      subtitle="RAFIQ should make source approval visible and understandable. Users should know when content is approved, pending, blocked, or rolled back before they rely on it."
    >
      <View style={styles.statusRow}>
        <PublicStatusBadge kind="privatePreview" label="Private engine active" />
        <PublicStatusBadge kind="approvalPending" label="Approval gates visible" />
        <PublicStatusBadge kind="blocked" label="Pending content blocked" />
      </View>

      <View style={[styles.heroPanel, publicShadows.raised]}>
        <Text style={styles.kicker}>Trust Promise</Text>
        <Text style={styles.sectionTitle}>Every public answer and reading surface needs a source story.</Text>
        <Text style={styles.body}>
          RAFIQ is strongest when trust is visible: what source is being used,
          what approval stage it has reached, how it should be attributed, and
          why some content is intentionally unavailable.
        </Text>
        <View style={styles.heroMetrics}>
          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>0</Text>
            <Text style={styles.metricLabel}>Pending sources published</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>5</Text>
            <Text style={styles.metricLabel}>Release gates shown</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>1</Text>
            <Text style={styles.metricLabel}>Public-safe detail pattern</Text>
          </View>
        </View>
      </View>

      <View style={[styles.journeyPanel, publicShadows.card]}>
        <Text style={styles.kicker}>Source Journey</Text>
        <Text style={styles.sectionTitle}>From private import to public trust</Text>
        {SOURCE_JOURNEY.map(([title, body], index) => (
          <View key={title} style={styles.journeyStep}>
            <Text style={styles.stepNumber}>0{index + 1}</Text>
            <View style={styles.stepCopy}>
              <Text style={styles.stepTitle}>{title}</Text>
              <Text style={styles.stepBody}>{body}</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={[styles.trustPanel, publicShadows.card]}>
        <Text style={styles.kicker}>User-Facing Trust</Text>
        <Text style={styles.sectionTitle}>What users should be able to understand</Text>
        {TRUST_PROMISES.map(([title, body]) => (
          <View key={title} style={styles.promiseRow}>
            <Text style={styles.promiseMark}>OK</Text>
            <View style={styles.promiseCopy}>
              <Text style={styles.promiseTitle}>{title}</Text>
              <Text style={styles.promiseBody}>{body}</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={[styles.attributionPanel, publicShadows.card]}>
        <Text style={styles.kicker}>Attribution Payload</Text>
        <Text style={styles.sectionTitle}>What a public source detail must explain</Text>
        {ATTRIBUTION_CHECKLIST.map((item) => (
          <View key={item} style={styles.checkRow}>
            <Text style={styles.checkDot}>-</Text>
            <Text style={styles.checkText}>{item}</Text>
          </View>
        ))}
      </View>

      <PublicBoundaryPanel
        title="Content approval remains separate from product readiness"
        body="RAFIQ can be polished for deployment while public content remains hidden. Approval decides what content becomes public, not whether the product experience should be complete."
      />

      <View style={styles.detailPanel}>
        <Text style={styles.kicker}>Source Detail Preview</Text>
        <Text style={styles.sectionTitle}>Open a public-safe source status surface</Text>
        <View style={styles.detailLinks}>
          {DETAIL_PREVIEWS.map(([label, href]) => (
            <Link href={href} key={href} style={styles.detailLink}>
              {label}
            </Link>
          ))}
        </View>
      </View>

      <View style={styles.actionGrid}>
        <PublicActionCard
          title="Search with release filters"
          body="See how public search stays useful while pending content remains excluded."
          href="/public/search"
          action="Open search"
        />
        <PublicActionCard
          title="Read the product promise"
          body="Review RAFIQ's objective, trust boundary, and user-facing mission."
          href="/public/about"
          action="Open About RAFIQ"
        />
      </View>
    </PublicAppShell>
  );
}

const styles = StyleSheet.create({
  statusRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: publicSpacing.space8,
  },
  heroPanel: {
    backgroundColor: publicColors.paper,
    borderColor: publicColors.lineStrong,
    borderRadius: publicRadii.xlarge,
    borderWidth: 1,
    gap: publicSpacing.space16,
    padding: publicSpacing.space24,
  },
  kicker: {
    ...publicTypography.label,
    color: publicColors.gold,
    textTransform: 'uppercase',
  },
  sectionTitle: {
    ...publicTypography.sectionTitle,
    color: publicColors.ink,
  },
  body: {
    ...publicTypography.body,
    color: publicColors.slate,
  },
  heroMetrics: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: publicSpacing.space12,
  },
  metricCard: {
    backgroundColor: publicColors.forest,
    borderRadius: publicRadii.large,
    flex: 1,
    gap: publicSpacing.space4,
    minWidth: 150,
    padding: publicSpacing.space16,
  },
  metricValue: {
    color: publicColors.white,
    fontSize: 28,
    fontWeight: '900',
  },
  metricLabel: {
    ...publicTypography.metadata,
    color: publicColors.goldWash,
  },
  journeyPanel: {
    backgroundColor: publicColors.goldWash,
    borderColor: publicColors.lineStrong,
    borderRadius: publicRadii.xlarge,
    borderWidth: 1,
    gap: publicSpacing.space16,
    padding: publicSpacing.space20,
  },
  journeyStep: {
    alignItems: 'flex-start',
    backgroundColor: publicColors.paper,
    borderColor: publicColors.line,
    borderRadius: publicRadii.large,
    borderWidth: 1,
    flexDirection: 'row',
    gap: publicSpacing.space12,
    padding: publicSpacing.space16,
  },
  stepNumber: {
    ...publicTypography.label,
    color: publicColors.gold,
  },
  stepCopy: {
    flex: 1,
    gap: publicSpacing.space4,
  },
  stepTitle: {
    color: publicColors.deepGreen,
    fontWeight: '900',
  },
  stepBody: {
    ...publicTypography.metadata,
    color: publicColors.slate,
  },
  trustPanel: {
    backgroundColor: publicColors.forest,
    borderColor: publicColors.deepGreen,
    borderRadius: publicRadii.xlarge,
    borderWidth: 1,
    gap: publicSpacing.space16,
    padding: publicSpacing.space24,
  },
  promiseRow: {
    alignItems: 'flex-start',
    backgroundColor: 'rgba(255, 253, 247, 0.08)',
    borderColor: 'rgba(255, 253, 247, 0.16)',
    borderRadius: publicRadii.large,
    borderWidth: 1,
    flexDirection: 'row',
    gap: publicSpacing.space12,
    padding: publicSpacing.space16,
  },
  promiseMark: {
    color: publicColors.goldSoft,
    fontWeight: '900',
  },
  promiseCopy: {
    flex: 1,
    gap: publicSpacing.space4,
  },
  promiseTitle: {
    color: publicColors.white,
    fontWeight: '900',
  },
  promiseBody: {
    ...publicTypography.metadata,
    color: publicColors.mint,
  },
  attributionPanel: {
    backgroundColor: publicColors.paper,
    borderColor: publicColors.line,
    borderRadius: publicRadii.xlarge,
    borderWidth: 1,
    gap: publicSpacing.space12,
    padding: publicSpacing.space20,
  },
  checkRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: publicSpacing.space8,
  },
  checkDot: {
    color: publicColors.gold,
    fontWeight: '900',
  },
  checkText: {
    ...publicTypography.body,
    color: publicColors.slate,
    flex: 1,
  },
  detailPanel: {
    backgroundColor: publicColors.mintSoft,
    borderColor: publicColors.line,
    borderRadius: publicRadii.xlarge,
    borderWidth: 1,
    gap: publicSpacing.space16,
    padding: publicSpacing.space20,
  },
  detailLinks: {
    gap: publicSpacing.space8,
  },
  detailLink: {
    backgroundColor: publicColors.deepGreen,
    borderRadius: publicRadii.medium,
    color: publicColors.white,
    fontWeight: '900',
    minHeight: 48,
    overflow: 'hidden',
    paddingHorizontal: publicSpacing.space16,
    paddingVertical: publicSpacing.space12,
    textAlign: 'center',
  },
  actionGrid: {
    gap: publicSpacing.space16,
  },
});
