import { Link } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { PublicActionCard } from '../../src/components/public/PublicActionCard';
import { PublicAppShell } from '../../src/components/public/PublicAppShell';
import { PublicBoundaryPanel } from '../../src/components/public/PublicBoundaryPanel';
import { publicColors, publicRadii, publicShadows, publicSpacing, publicTypography } from '../../src/theme/publicDesignSystem';

const WHY_POINTS = [
  ['Knowledge with context', 'RAFIQ connects search, reading, tafsir, topics, themes, and Hadith instead of leaving users to jump between disconnected tools.'],
  ['Answers with evidence', 'Guided answers must be supported by approved evidence and citation boundaries before they can be trusted publicly.'],
  ['Trust before reach', 'Public release is controlled by source approval, attribution, editorial review, scholar/content review, and Product Owner scope.'],
];

const USER_PATH = [
  'Explore a question or topic.',
  'Read Quran or Hadith context.',
  'Ask for guided help when evidence exists.',
  'Check source status before trusting public output.',
];

export default function PublicAboutScreen() {
  return (
    <PublicAppShell
      eyebrow="About RAFIQ"
      title="RAFIQ is built to make Islamic knowledge easier to explore without hiding the evidence."
      subtitle="The product objective is simple: help users search, read, ask, and understand source boundaries through one calm, careful, source-guided experience."
    >
      <View style={[styles.missionPanel, publicShadows.raised]}>
        <Text style={styles.kicker}>Mission</Text>
        <Text style={styles.missionTitle}>Make guidance feel accessible while keeping trust visible.</Text>
        <Text style={styles.missionBody}>
          RAFIQ is not replacing scholars or source study. It is a companion layer that helps users navigate knowledge,
          see citations, understand limits, and know when a public answer should be blocked.
        </Text>
      </View>

      <View style={styles.whyGrid}>
        {WHY_POINTS.map(([title, body]) => (
          <View key={title} style={[styles.whyCard, publicShadows.card]}>
            <Text style={styles.whyTitle}>{title}</Text>
            <Text style={styles.whyBody}>{body}</Text>
          </View>
        ))}
      </View>

      <View style={[styles.pathPanel, publicShadows.card]}>
        <Text style={styles.kicker}>User Path</Text>
        <Text style={styles.sectionTitle}>What a user should feel RAFIQ helps them do.</Text>
        {USER_PATH.map((item, index) => (
          <View key={item} style={styles.pathRow}>
            <Text style={styles.pathNumber}>0{index + 1}</Text>
            <Text style={styles.pathText}>{item}</Text>
          </View>
        ))}
      </View>

      <PublicBoundaryPanel
        title="RAFIQ can be deployment-ready before content is public"
        body="The product, navigation, presentation, and delivery quality should be complete. Public real-content visibility remains controlled by approval gates."
      />

      <View style={styles.actionGrid}>
        <PublicActionCard
          title="Start exploring"
          body="Go to the release-filtered search experience and see how RAFIQ handles public content boundaries."
          href="/public/search"
          action="Open Explore"
        />
        <PublicActionCard
          title="Check source trust"
          body="Understand how RAFIQ separates private imports, approval-pending sources, and future public release states."
          href="/public/sources"
          action="Open Sources"
        />
      </View>

      <Link href="/public" style={styles.homeLink}>
        Return to RAFIQ home
      </Link>
    </PublicAppShell>
  );
}

const styles = StyleSheet.create({
  missionPanel: {
    backgroundColor: publicColors.forest,
    borderColor: publicColors.deepGreen,
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
  missionTitle: {
    color: publicColors.white,
    fontSize: 30,
    fontWeight: '900',
    lineHeight: 36,
  },
  missionBody: {
    ...publicTypography.body,
    color: publicColors.mint,
  },
  whyGrid: {
    gap: publicSpacing.space16,
  },
  whyCard: {
    backgroundColor: publicColors.paper,
    borderColor: publicColors.line,
    borderRadius: publicRadii.xlarge,
    borderWidth: 1,
    gap: publicSpacing.space8,
    padding: publicSpacing.space20,
  },
  whyTitle: {
    ...publicTypography.cardTitle,
    color: publicColors.ink,
  },
  whyBody: {
    ...publicTypography.body,
    color: publicColors.slate,
  },
  pathPanel: {
    backgroundColor: publicColors.goldWash,
    borderColor: publicColors.lineStrong,
    borderRadius: publicRadii.xlarge,
    borderWidth: 1,
    gap: publicSpacing.space16,
    padding: publicSpacing.space24,
  },
  sectionTitle: {
    ...publicTypography.sectionTitle,
    color: publicColors.ink,
  },
  pathRow: {
    alignItems: 'flex-start',
    backgroundColor: publicColors.paper,
    borderColor: publicColors.line,
    borderRadius: publicRadii.large,
    borderWidth: 1,
    flexDirection: 'row',
    gap: publicSpacing.space12,
    padding: publicSpacing.space16,
  },
  pathNumber: {
    ...publicTypography.label,
    color: publicColors.gold,
  },
  pathText: {
    ...publicTypography.body,
    color: publicColors.slate,
    flex: 1,
  },
  actionGrid: {
    gap: publicSpacing.space16,
  },
  homeLink: {
    backgroundColor: publicColors.deepGreen,
    borderRadius: publicRadii.medium,
    color: publicColors.white,
    fontWeight: '900',
    minHeight: 48,
    overflow: 'hidden',
    paddingHorizontal: publicSpacing.space20,
    paddingVertical: publicSpacing.space16,
    textAlign: 'center',
  },
});
