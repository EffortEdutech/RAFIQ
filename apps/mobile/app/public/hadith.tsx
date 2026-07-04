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

const FILTER_CONTROLS = ['Collection', 'Book', 'Chapter', 'Grade', 'Language', 'Source status'];

const RESULT_PREVIEW = [
  ['Collection label', 'Shows the source collection and edition without pretending it is universally canonical.'],
  ['Verification status', 'Displays grade and verification boundaries only after source-qualified approval.'],
  ['Attribution trail', 'Keeps source, translator, edition, and permitted-use status visible.'],
];

const DETAIL_LAYERS = [
  ['Hadith text', 'Hidden until public rights, attribution, and content review are approved.'],
  ['Grade context', 'Reserved for attributed grading claims and visible disagreement handling.'],
  ['Related evidence', 'Prepared to connect Quran, topics, themes, and source-qualified narrations.'],
];

const APPROVAL_ROWS = [
  ['Collection source', 'Pending public release approval'],
  ['Arabic and translation text', 'Pending rights and attribution approval'],
  ['Grade display', 'Pending verification approval'],
  ['Editorial review', 'Required before public display'],
  ['Scholar/content review', 'Required before public display'],
  ['Publication', 'Blocked until release gate passes'],
];

const NEXT_PATHS = [
  ['Open Quran reader', '/public/quran'],
  ['Search related evidence', '/public/search'],
  ['Review source trust', '/public/sources'],
];

export default function PublicHadithPreviewScreen() {
  return (
    <PublicAppShell
      eyebrow="Hadith Reader"
      title="Hadith browsing that keeps source trust visible."
      subtitle="RAFIQ's Hadith surface should feel ready for deployment: collection browsing, list-to-detail rhythm, grade boundaries, attribution status, and no public Hadith text until release gates pass."
    >
      <View style={styles.badgeRow}>
        <PublicStatusBadge kind="privatePreview" label="Private preview" />
        <PublicStatusBadge kind="approvalPending" label="Approval pending" />
        <PublicStatusBadge kind="blocked" label="Public text hidden" />
      </View>

      <View style={[styles.browserStage, publicShadows.raised]}>
        <View style={styles.browserHero}>
          <View style={styles.browserHeroCopy}>
            <Text style={styles.kicker}>Browse Experience</Text>
            <Text style={styles.sectionTitle}>Designed for transparent Hadith review</Text>
            <Text style={styles.body}>
              This preview demonstrates how Hadith browsing should work once sources are approved:
              filter by collection, move from list to detail, read verification context, and keep
              attribution visible at every step.
            </Text>
          </View>
          <View style={styles.collectionCard}>
            <Text style={styles.collectionLabel}>Current preview</Text>
            <Text style={styles.collectionTitle}>Collection view</Text>
            <Text style={styles.collectionMeta}>Text withheld until public approval</Text>
          </View>
        </View>

        <View style={styles.filterGrid}>
          {FILTER_CONTROLS.map((control) => (
            <View key={control} style={styles.filterPill}>
              <Text style={styles.filterText}>{control}</Text>
            </View>
          ))}
        </View>

        <View style={styles.listDetailGrid}>
          <View style={styles.resultListCard}>
            <Text style={styles.kicker}>Result List</Text>
            <Text style={styles.cardTitle}>Source-aware narrations</Text>
            {RESULT_PREVIEW.map(([title, body]) => (
              <View key={title} style={styles.previewRow}>
                <Text style={styles.previewTitle}>{title}</Text>
                <Text style={styles.previewBody}>{body}</Text>
              </View>
            ))}
          </View>

          <View style={styles.detailCard}>
            <View style={styles.detailHeader}>
              <Text style={styles.kicker}>Detail Preview</Text>
              <PublicStatusBadge kind="blocked" label="No public source text" />
            </View>
            <Text style={styles.cardTitle}>Selected narration preview</Text>
            <View style={styles.hiddenTextBlock}>
              <Text style={styles.hiddenText}>Hadith text is intentionally hidden on the public route.</Text>
            </View>
            <Text style={styles.body}>
              RAFIQ can show the structure, review posture, and trust signals now,
              while withholding real narration text until every release gate is satisfied.
            </Text>
          </View>
        </View>
      </View>

      <View style={[styles.layerPanel, publicShadows.card]}>
        <Text style={styles.kicker}>Detail Layers</Text>
        <Text style={styles.sectionTitle}>What a public Hadith detail page must carry</Text>
        {DETAIL_LAYERS.map(([title, body]) => (
          <View key={title} style={styles.layerRow}>
            <Text style={styles.layerTitle}>{title}</Text>
            <Text style={styles.layerBody}>{body}</Text>
          </View>
        ))}
      </View>

      <PublicBoundaryPanel
        title="Hadith display remains release-gated"
        body="The public route may show browsing, filtering, and detail UX. It must not expose pending Hadith text, grade claims, verification internals, or unapproved derived summaries."
      />

      <View style={[styles.statusCard, publicShadows.card]}>
        <Text style={styles.kicker}>Source And Approval Status</Text>
        <Text style={styles.sectionTitle}>Public release gate</Text>
        <View style={styles.statusRows}>
          {APPROVAL_ROWS.map(([label, value]) => (
            <View key={label} style={styles.statusRow}>
              <Text style={styles.statusLabel}>{label}</Text>
              <Text style={styles.statusValue}>{value}</Text>
            </View>
          ))}
        </View>
        <Link href="/public/source/hadith-preview?entityType=hadith_record" style={styles.inlineLink}>
          Open Hadith source status preview
        </Link>
      </View>

      <View style={styles.nextPanel}>
        <Text style={styles.kicker}>Continue The Journey</Text>
        <Text style={styles.sectionTitle}>Hadith reading should stay connected to the wider evidence graph</Text>
        <View style={styles.nextLinks}>
          {NEXT_PATHS.map(([label, href]) => (
            <Link href={href} key={href} style={styles.nextLink}>
              {label}
            </Link>
          ))}
        </View>
      </View>

      <PublicActionCard
        title="Return to Quran reading"
        body="Use both reading surfaces together to review whether RAFIQ feels like one coherent product."
        href="/public/quran"
        action="Open Quran preview"
      />
    </PublicAppShell>
  );
}

const styles = StyleSheet.create({
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: publicSpacing.space8,
  },
  browserStage: {
    backgroundColor: publicColors.paper,
    borderColor: publicColors.lineStrong,
    borderRadius: publicRadii.xlarge,
    borderWidth: 1,
    gap: publicSpacing.space20,
    padding: publicSpacing.space24,
  },
  browserHero: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: publicSpacing.space20,
    justifyContent: 'space-between',
  },
  browserHeroCopy: {
    flex: 1,
    gap: publicSpacing.space12,
    minWidth: 260,
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
  collectionCard: {
    backgroundColor: publicColors.forest,
    borderRadius: publicRadii.large,
    gap: publicSpacing.space8,
    minWidth: 220,
    padding: publicSpacing.space20,
  },
  collectionLabel: {
    ...publicTypography.label,
    color: publicColors.goldSoft,
    textTransform: 'uppercase',
  },
  collectionTitle: {
    ...publicTypography.cardTitle,
    color: publicColors.white,
  },
  collectionMeta: {
    ...publicTypography.metadata,
    color: publicColors.goldWash,
  },
  filterGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: publicSpacing.space8,
  },
  filterPill: {
    backgroundColor: publicColors.mintSoft,
    borderColor: publicColors.line,
    borderRadius: publicRadii.pill,
    borderWidth: 1,
    minHeight: 44,
    paddingHorizontal: publicSpacing.space16,
    paddingVertical: publicSpacing.space12,
  },
  filterText: {
    color: publicColors.ink,
    fontWeight: '900',
  },
  listDetailGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: publicSpacing.space16,
  },
  resultListCard: {
    backgroundColor: publicColors.cream,
    borderColor: publicColors.line,
    borderRadius: publicRadii.xlarge,
    borderWidth: 1,
    flex: 1,
    gap: publicSpacing.space12,
    minWidth: 260,
    padding: publicSpacing.space20,
  },
  detailCard: {
    backgroundColor: publicColors.pearl,
    borderColor: publicColors.line,
    borderRadius: publicRadii.xlarge,
    borderWidth: 1,
    flex: 1,
    gap: publicSpacing.space16,
    minWidth: 260,
    padding: publicSpacing.space20,
  },
  detailHeader: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: publicSpacing.space12,
    justifyContent: 'space-between',
  },
  cardTitle: {
    ...publicTypography.cardTitle,
    color: publicColors.ink,
  },
  previewRow: {
    backgroundColor: publicColors.paper,
    borderColor: publicColors.line,
    borderRadius: publicRadii.large,
    borderWidth: 1,
    gap: publicSpacing.space4,
    padding: publicSpacing.space16,
  },
  previewTitle: {
    color: publicColors.deepGreen,
    fontWeight: '900',
  },
  previewBody: {
    ...publicTypography.metadata,
    color: publicColors.slate,
  },
  hiddenTextBlock: {
    backgroundColor: publicColors.white,
    borderColor: publicColors.line,
    borderRadius: publicRadii.large,
    borderStyle: 'dashed',
    borderWidth: 1,
    padding: publicSpacing.space20,
  },
  hiddenText: {
    ...publicTypography.body,
    color: publicColors.muted,
    fontWeight: '800',
    textAlign: 'center',
  },
  layerPanel: {
    backgroundColor: publicColors.paper,
    borderColor: publicColors.line,
    borderRadius: publicRadii.xlarge,
    borderWidth: 1,
    gap: publicSpacing.space16,
    padding: publicSpacing.space20,
  },
  layerRow: {
    backgroundColor: publicColors.cream,
    borderColor: publicColors.line,
    borderRadius: publicRadii.large,
    borderWidth: 1,
    gap: publicSpacing.space8,
    padding: publicSpacing.space16,
  },
  layerTitle: {
    ...publicTypography.cardTitle,
    color: publicColors.ink,
  },
  layerBody: {
    ...publicTypography.metadata,
    color: publicColors.slate,
  },
  statusCard: {
    backgroundColor: publicColors.paper,
    borderColor: publicColors.line,
    borderRadius: publicRadii.xlarge,
    borderWidth: 1,
    gap: publicSpacing.space16,
    padding: publicSpacing.space20,
  },
  statusRows: {
    borderColor: publicColors.line,
    borderRadius: publicRadii.large,
    borderWidth: 1,
    overflow: 'hidden',
  },
  statusRow: {
    borderBottomColor: publicColors.line,
    borderBottomWidth: 1,
    gap: publicSpacing.space4,
    padding: publicSpacing.space12,
  },
  statusLabel: {
    ...publicTypography.label,
    color: publicColors.muted,
    textTransform: 'uppercase',
  },
  statusValue: {
    ...publicTypography.body,
    color: publicColors.ink,
    fontWeight: '700',
  },
  inlineLink: {
    color: publicColors.deepGreen,
    fontWeight: '900',
    minHeight: 44,
    paddingVertical: publicSpacing.space12,
  },
  nextPanel: {
    backgroundColor: publicColors.forest,
    borderColor: publicColors.deepGreen,
    borderRadius: publicRadii.xlarge,
    borderWidth: 1,
    gap: publicSpacing.space16,
    padding: publicSpacing.space24,
  },
  nextLinks: {
    gap: publicSpacing.space8,
  },
  nextLink: {
    backgroundColor: 'rgba(255, 253, 247, 0.08)',
    borderColor: 'rgba(255, 253, 247, 0.18)',
    borderRadius: publicRadii.medium,
    borderWidth: 1,
    color: publicColors.white,
    fontWeight: '900',
    minHeight: 48,
    overflow: 'hidden',
    paddingHorizontal: publicSpacing.space16,
    paddingVertical: publicSpacing.space12,
  },
});
