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

const READING_CONTROLS = ['Surah', 'Ayah', 'Juz', 'Page', 'Translation', 'Tafsir'];

const READER_LAYERS = [
  ['Arabic text', 'Hidden until release-approved Quran text is selected for public display.'],
  ['Translation', 'Prepared for approved translations only; RAFIQ will not generate Quran translations with AI.'],
  ['Tafsir context', 'Reserved for approved tafsir passages with visible source and attribution status.'],
];

const READING_FLOW = [
  ['Choose a passage', 'Users should move by surah, ayah, juz, page, or saved reading position.'],
  ['Read with context', 'Arabic, translation, tafsir, themes, and source labels should feel connected.'],
  ['Ask carefully', 'A reading moment can move into guided answer only through evidence boundaries.'],
];

const APPROVAL_ROWS = [
  ['Quran source text', 'Pending public release approval'],
  ['Translation display', 'Pending rights and attribution approval'],
  ['Tafsir context', 'Pending source and editorial approval'],
  ['Scholar/content review', 'Required before public display'],
  ['Publication', 'Blocked until release gate passes'],
];

const NEXT_PATHS = [
  ['Search related evidence', '/public/search'],
  ['Ask with boundaries', '/public/answer'],
  ['Review source trust', '/public/sources'],
];

export default function PublicQuranPreviewScreen() {
  return (
    <PublicAppShell
      eyebrow="Quran Reader"
      title="A calm Quran reading room, ready for approved sources."
      subtitle="RAFIQ's Quran surface should feel complete before publication: clear navigation, layered context, visible approval status, and no public source text until release gates pass."
    >
      <View style={styles.badgeRow}>
        <PublicStatusBadge kind="privatePreview" label="Private preview" />
        <PublicStatusBadge kind="approvalPending" label="Approval pending" />
        <PublicStatusBadge kind="blocked" label="Public text hidden" />
      </View>

      <View style={[styles.readerStage, publicShadows.raised]}>
        <View style={styles.readerHero}>
          <View style={styles.readerHeroCopy}>
            <Text style={styles.kicker}>Reading Experience</Text>
            <Text style={styles.sectionTitle}>Designed for verified Quran display</Text>
            <Text style={styles.body}>
              This preview shows the reading architecture without exposing pending Quran text.
              When sources are approved, this same surface can carry Arabic text,
              translation, tafsir, themes, and attribution in one calm flow.
            </Text>
          </View>
          <View style={styles.readingPositionCard}>
            <Text style={styles.positionLabel}>Current preview</Text>
            <Text style={styles.positionTitle}>Surah view</Text>
            <Text style={styles.positionMeta}>Text withheld until public approval</Text>
          </View>
        </View>

        <View style={styles.controlGrid}>
          {READING_CONTROLS.map((control) => (
            <View key={control} style={styles.controlPill}>
              <Text style={styles.controlText}>{control}</Text>
            </View>
          ))}
        </View>

        <View style={styles.readerCard}>
          <View style={styles.readerCardHeader}>
            <Text style={styles.kicker}>Safe Preview</Text>
            <PublicStatusBadge kind="blocked" label="No public source text" />
          </View>
          <Text style={styles.placeholderTitle}>Selected passage preview</Text>
          <View style={styles.hiddenTextBlock}>
            <Text style={styles.hiddenText}>Quran text is intentionally hidden on the public route.</Text>
          </View>
          <Text style={styles.body}>
            RAFIQ can demonstrate the reading rhythm, controls, and context layout now,
            while keeping every real public passage behind source approval.
          </Text>
        </View>
      </View>

      <View style={[styles.layerPanel, publicShadows.card]}>
        <Text style={styles.kicker}>Reader Layers</Text>
        <Text style={styles.sectionTitle}>What appears when approval is complete</Text>
        {READER_LAYERS.map(([title, body]) => (
          <View key={title} style={styles.layerRow}>
            <Text style={styles.layerTitle}>{title}</Text>
            <Text style={styles.layerBody}>{body}</Text>
          </View>
        ))}
      </View>

      <View style={[styles.flowPanel, publicShadows.card]}>
        <Text style={styles.kicker}>Reading Flow</Text>
        <Text style={styles.sectionTitle}>From reading to source-guided understanding</Text>
        {READING_FLOW.map(([title, body], index) => (
          <View key={title} style={styles.flowStep}>
            <Text style={styles.flowNumber}>0{index + 1}</Text>
            <View style={styles.flowCopy}>
              <Text style={styles.flowTitle}>{title}</Text>
              <Text style={styles.flowBody}>{body}</Text>
            </View>
          </View>
        ))}
      </View>

      <PublicBoundaryPanel
        title="Quran display remains release-gated"
        body="The public route may show the product experience, controls, and approval status. It must not expose pending Quran text, translation text, tafsir passages, or unapproved derived summaries."
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
        <Link href="/public/source/quran-preview?entityType=quran_ayah_text" style={styles.inlineLink}>
          Open Quran source status preview
        </Link>
      </View>

      <View style={styles.nextPanel}>
        <Text style={styles.kicker}>Continue The Journey</Text>
        <Text style={styles.sectionTitle}>A reader should never hit a dead end</Text>
        <View style={styles.nextLinks}>
          {NEXT_PATHS.map(([label, href]) => (
            <Link href={href} key={href} style={styles.nextLink}>
              {label}
            </Link>
          ))}
        </View>
      </View>

      <PublicActionCard
        title="Compare with Hadith reading"
        body="Review the matching Hadith browse-and-detail surface so Quran and Hadith feel like one RAFIQ product family."
        href="/public/hadith"
        action="Open Hadith preview"
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
  readerStage: {
    backgroundColor: publicColors.paper,
    borderColor: publicColors.lineStrong,
    borderRadius: publicRadii.xlarge,
    borderWidth: 1,
    gap: publicSpacing.space20,
    padding: publicSpacing.space24,
  },
  readerHero: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: publicSpacing.space20,
    justifyContent: 'space-between',
  },
  readerHeroCopy: {
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
  readingPositionCard: {
    backgroundColor: publicColors.forest,
    borderRadius: publicRadii.large,
    gap: publicSpacing.space8,
    minWidth: 220,
    padding: publicSpacing.space20,
  },
  positionLabel: {
    ...publicTypography.label,
    color: publicColors.goldSoft,
    textTransform: 'uppercase',
  },
  positionTitle: {
    ...publicTypography.cardTitle,
    color: publicColors.white,
  },
  positionMeta: {
    ...publicTypography.metadata,
    color: publicColors.goldWash,
  },
  controlGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: publicSpacing.space8,
  },
  controlPill: {
    backgroundColor: publicColors.mintSoft,
    borderColor: publicColors.line,
    borderRadius: publicRadii.pill,
    borderWidth: 1,
    minHeight: 44,
    paddingHorizontal: publicSpacing.space16,
    paddingVertical: publicSpacing.space12,
  },
  controlText: {
    color: publicColors.ink,
    fontWeight: '900',
  },
  readerCard: {
    backgroundColor: publicColors.pearl,
    borderColor: publicColors.line,
    borderRadius: publicRadii.xlarge,
    borderWidth: 1,
    gap: publicSpacing.space16,
    padding: publicSpacing.space20,
  },
  readerCardHeader: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: publicSpacing.space12,
    justifyContent: 'space-between',
  },
  placeholderTitle: {
    ...publicTypography.cardTitle,
    color: publicColors.ink,
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
  flowPanel: {
    backgroundColor: publicColors.goldWash,
    borderColor: publicColors.lineStrong,
    borderRadius: publicRadii.xlarge,
    borderWidth: 1,
    gap: publicSpacing.space16,
    padding: publicSpacing.space20,
  },
  flowStep: {
    alignItems: 'flex-start',
    backgroundColor: publicColors.paper,
    borderColor: publicColors.line,
    borderRadius: publicRadii.large,
    borderWidth: 1,
    flexDirection: 'row',
    gap: publicSpacing.space12,
    padding: publicSpacing.space16,
  },
  flowNumber: {
    ...publicTypography.label,
    color: publicColors.gold,
  },
  flowCopy: {
    flex: 1,
    gap: publicSpacing.space4,
  },
  flowTitle: {
    color: publicColors.deepGreen,
    fontWeight: '900',
  },
  flowBody: {
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
