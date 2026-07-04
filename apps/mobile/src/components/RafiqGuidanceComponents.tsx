import { Link } from 'expo-router';
import type { PropsWithChildren } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import {
  publicColors,
  publicRadii,
  publicShadows,
  publicSpacing,
  publicTypography,
} from '../theme/publicDesignSystem';

type ActionLink = {
  href: string;
  label: string;
};

type CheckInOption = {
  key: string;
  label: string;
};

type CheckInPanelProps = {
  activeKey: string;
  eyebrow: string;
  options: CheckInOption[];
  supportingText: string;
  title: string;
  onSelect: (key: string) => void;
};

export function RafiqCheckInPanel({
  activeKey,
  eyebrow,
  options,
  supportingText,
  title,
  onSelect,
}: CheckInPanelProps) {
  return (
    <View style={[styles.checkInPanel, publicShadows.raised]}>
      <Text style={styles.modeLabel}>{eyebrow}</Text>
      <Text style={styles.heroTitle}>{title}</Text>
      <Text style={styles.heroText}>{supportingText}</Text>
      <View style={styles.chipRow}>
        {options.map((option) => {
          const active = option.key === activeKey;
          return (
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              key={option.key}
              onPress={() => onSelect(option.key)}
              style={[styles.moodChip, active ? styles.activeMoodChip : null]}
            >
              <Text style={[styles.moodLabel, active ? styles.activeMoodLabel : null]}>
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

type GuidanceStageProps = PropsWithChildren<{
  eyebrow: string;
  subtitle: string;
  title: string;
}>;

export function RafiqGuidanceStage({ children, eyebrow, subtitle, title }: GuidanceStageProps) {
  return (
    <View style={styles.stage}>
      <View style={styles.stageHeader}>
        <Text style={styles.kickerDark}>{eyebrow}</Text>
        <Text style={styles.stageTitle}>{title}</Text>
        <Text style={styles.stageSubtitle}>{subtitle}</Text>
      </View>
      {children}
    </View>
  );
}

type QuranEvidenceCardProps = {
  action: ActionLink;
  reference: string;
  text: string;
};

export function QuranEvidenceCard({ action, reference, text }: QuranEvidenceCardProps) {
  return (
    <View style={[styles.quranCard, publicShadows.raised]}>
      <Text style={styles.cardKickerGold}>Quran First</Text>
      <Text style={styles.quranText}>{text}</Text>
      <Text style={styles.reference}>{reference}</Text>
      <Link href={action.href as never} style={styles.goldAction}>
        {action.label}
      </Link>
    </View>
  );
}

type ContextCardProps = {
  action?: ActionLink;
  body: string;
  tone?: 'paper' | 'mint';
  title: string;
};

export function RafiqContextCard({ action, body, title, tone = 'paper' }: ContextCardProps) {
  return (
    <View style={[styles.contextCard, tone === 'mint' ? styles.mintContextCard : null, publicShadows.card]}>
      <Text style={styles.cardKicker}>{title}</Text>
      <Text style={styles.contextText}>{body}</Text>
      {action ? (
        <Link href={action.href as never} style={styles.inlineAction}>
          {action.label}
        </Link>
      ) : null}
    </View>
  );
}

type ReflectionComposerProps = {
  helper: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  title: string;
  value: string;
};

export function RafiqReflectionComposer({
  helper,
  onChangeText,
  placeholder,
  title,
  value,
}: ReflectionComposerProps) {
  return (
    <View style={[styles.reflectionCard, publicShadows.card]}>
      <Text style={styles.cardKicker}>{title}</Text>
      <TextInput
        accessibilityLabel={title}
        multiline
        onChangeText={onChangeText}
        placeholder={placeholder}
        style={styles.reflectionInput}
        value={value}
      />
      <Text style={styles.helperText}>{value.length ? 'Reflection saved in your journal draft.' : helper}</Text>
    </View>
  );
}

type OneActionCardProps = {
  actionText: string;
  completed: boolean;
  onToggle: () => void;
};

export function RafiqOneActionCard({ actionText, completed, onToggle }: OneActionCardProps) {
  return (
    <View style={[styles.actionCard, publicShadows.card]}>
      <Text style={styles.cardKicker}>One Meaningful Action</Text>
      <Text style={styles.actionText}>{actionText}</Text>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ selected: completed }}
        onPress={onToggle}
        style={[styles.completeButton, completed ? styles.completeButtonDone : null]}
      >
        <Text style={styles.completeButtonText}>
          {completed ? 'Action marked complete' : 'Mark today\'s action complete'}
        </Text>
      </Pressable>
    </View>
  );
}

type TrustStripProps = {
  items: string[];
};

export function RafiqTrustStrip({ items }: TrustStripProps) {
  return (
    <View style={styles.trustStrip}>
      <Text style={styles.trustLabel}>Sources</Text>
      <View style={styles.trustItems}>
        {items.map((item) => (
          <Text key={item} style={styles.trustChip}>
            {item}
          </Text>
        ))}
      </View>
    </View>
  );
}

type PathStep = {
  body: string;
  number: string;
  title: string;
};

type RafiqPathStepsProps = {
  steps: PathStep[];
};

export function RafiqPathSteps({ steps }: RafiqPathStepsProps) {
  return (
    <View style={styles.pathGrid}>
      {steps.map((step) => (
        <View key={step.title} style={[styles.pathCard, publicShadows.card]}>
          <Text style={styles.pathNumber}>{step.number}</Text>
          <Text style={styles.pathTitle}>{step.title}</Text>
          <Text style={styles.pathBody}>{step.body}</Text>
        </View>
      ))}
    </View>
  );
}

type NavigationCardProps = {
  body: string;
  href: string;
  title: string;
};

export function RafiqNavigationCard({ body, href, title }: NavigationCardProps) {
  return (
    <Link href={href as never} style={[styles.navCard, publicShadows.card]}>
      <Text style={styles.navCardTitle}>{title}</Text>
      <Text style={styles.navCardBody}>{body}</Text>
    </Link>
  );
}

const styles = StyleSheet.create({
  checkInPanel: {
    backgroundColor: publicColors.pearl,
    borderColor: publicColors.gold,
    borderRadius: 40,
    borderWidth: 1,
    gap: publicSpacing.space20,
    padding: publicSpacing.space32,
  },
  modeLabel: {
    ...publicTypography.label,
    alignSelf: 'flex-start',
    backgroundColor: publicColors.goldWash,
    borderRadius: publicRadii.pill,
    color: publicColors.deepGreen,
    overflow: 'hidden',
    paddingHorizontal: publicSpacing.space16,
    paddingVertical: publicSpacing.space8,
    textTransform: 'uppercase',
  },
  heroTitle: {
    color: publicColors.ink,
    fontSize: 21,
    fontWeight: '900',
    letterSpacing: 0,
    lineHeight: 27,
  },
  heroText: {
    color: publicColors.slate,
    fontSize: 15,
    lineHeight: 23,
    maxWidth: 820,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: publicSpacing.space12,
  },
  moodChip: {
    backgroundColor: publicColors.white,
    borderColor: publicColors.lineStrong,
    borderRadius: publicRadii.pill,
    borderWidth: 1,
    paddingHorizontal: publicSpacing.space20,
    paddingVertical: publicSpacing.space12,
  },
  activeMoodChip: {
    backgroundColor: publicColors.deepGreen,
    borderColor: publicColors.deepGreen,
  },
  moodLabel: {
    color: publicColors.deepGreen,
    fontWeight: '900',
  },
  activeMoodLabel: {
    color: publicColors.white,
  },
  stage: {
    gap: publicSpacing.space16,
  },
  stageHeader: {
    gap: publicSpacing.space8,
  },
  kickerDark: {
    ...publicTypography.label,
    color: publicColors.goldSoft,
    textTransform: 'uppercase',
  },
  stageTitle: {
    color: publicColors.white,
    fontSize: 18,
    fontWeight: '900',
    lineHeight: 24,
  },
  stageSubtitle: {
    color: publicColors.mint,
    fontSize: 15,
    lineHeight: 23,
    maxWidth: 840,
  },
  quranCard: {
    backgroundColor: publicColors.deepGreen,
    borderColor: publicColors.gold,
    borderRadius: 36,
    borderWidth: 1,
    gap: publicSpacing.space16,
    padding: publicSpacing.space24,
  },
  cardKickerGold: {
    color: publicColors.goldSoft,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  quranText: {
    color: publicColors.white,
    fontSize: 20,
    fontWeight: '900',
    lineHeight: 30,
  },
  reference: {
    color: publicColors.goldSoft,
    fontWeight: '900',
  },
  goldAction: {
    alignSelf: 'flex-start',
    backgroundColor: publicColors.gold,
    borderRadius: publicRadii.pill,
    color: publicColors.ink,
    fontWeight: '900',
    overflow: 'hidden',
    paddingHorizontal: publicSpacing.space16,
    paddingVertical: publicSpacing.space12,
  },
  contextCard: {
    backgroundColor: publicColors.paper,
    borderColor: publicColors.line,
    borderRadius: publicRadii.xlarge,
    borderWidth: 1,
    gap: publicSpacing.space8,
    padding: publicSpacing.space20,
    width: '100%',
  },
  mintContextCard: {
    backgroundColor: publicColors.mintSoft,
    borderColor: publicColors.mint,
  },
  cardKicker: {
    color: publicColors.gold,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  contextText: {
    color: publicColors.inkSoft,
    fontSize: 15,
    lineHeight: 23,
  },
  inlineAction: {
    alignSelf: 'flex-start',
    backgroundColor: publicColors.deepGreen,
    borderRadius: publicRadii.pill,
    color: publicColors.white,
    fontWeight: '900',
    overflow: 'hidden',
    paddingHorizontal: publicSpacing.space16,
    paddingVertical: publicSpacing.space12,
  },
  reflectionCard: {
    backgroundColor: publicColors.paper,
    borderColor: publicColors.lineStrong,
    borderRadius: publicRadii.xlarge,
    borderWidth: 1,
    gap: publicSpacing.space12,
    padding: publicSpacing.space20,
  },
  reflectionInput: {
    backgroundColor: publicColors.cream,
    borderColor: publicColors.line,
    borderRadius: publicRadii.large,
    borderWidth: 1,
    color: publicColors.ink,
    minHeight: 118,
    padding: publicSpacing.space16,
    textAlignVertical: 'top',
  },
  helperText: {
    color: publicColors.deepGreen,
    fontWeight: '900',
  },
  actionCard: {
    backgroundColor: publicColors.goldWash,
    borderColor: publicColors.lineStrong,
    borderRadius: publicRadii.xlarge,
    borderWidth: 1,
    gap: publicSpacing.space12,
    padding: publicSpacing.space20,
  },
  actionText: {
    color: publicColors.ink,
    fontSize: 16,
    fontWeight: '900',
    lineHeight: 24,
  },
  completeButton: {
    backgroundColor: publicColors.deepGreen,
    borderRadius: publicRadii.pill,
    padding: publicSpacing.space16,
  },
  completeButtonDone: {
    backgroundColor: publicColors.success,
  },
  completeButtonText: {
    color: publicColors.white,
    fontWeight: '900',
    textAlign: 'center',
  },
  trustStrip: {
    alignItems: 'stretch',
    backgroundColor: 'rgba(255, 253, 247, 0.92)',
    borderColor: 'rgba(255, 253, 247, 0.35)',
    borderRadius: publicRadii.xlarge,
    borderWidth: 1,
    flexDirection: 'column',
    gap: publicSpacing.space12,
    padding: publicSpacing.space16,
  },
  trustLabel: {
    color: publicColors.deepGreen,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  trustItems: {
    alignItems: 'stretch',
    flexDirection: 'column',
    gap: publicSpacing.space8,
  },
  trustChip: {
    backgroundColor: publicColors.mintSoft,
    borderRadius: publicRadii.large,
    color: publicColors.deepGreen,
    fontWeight: '900',
    overflow: 'hidden',
    paddingHorizontal: publicSpacing.space12,
    paddingVertical: publicSpacing.space8,
  },
  pathGrid: {
    flexDirection: 'column',
    gap: publicSpacing.space16,
  },
  pathCard: {
    backgroundColor: publicColors.paper,
    borderColor: publicColors.line,
    borderRadius: publicRadii.xlarge,
    borderWidth: 1,
    width: '100%',
    padding: publicSpacing.space20,
  },
  pathNumber: {
    color: publicColors.gold,
    fontSize: 15,
    fontWeight: '900',
  },
  pathTitle: {
    color: publicColors.ink,
    fontSize: 16,
    fontWeight: '900',
    marginTop: publicSpacing.space8,
  },
  pathBody: {
    color: publicColors.slate,
    fontSize: 16,
    lineHeight: 25,
    marginTop: publicSpacing.space8,
  },
  navCard: {
    backgroundColor: publicColors.paper,
    borderColor: publicColors.line,
    borderRadius: publicRadii.xlarge,
    borderWidth: 1,
    width: '100%',
    overflow: 'hidden',
    padding: publicSpacing.space20,
  },
  navCardTitle: {
    color: publicColors.deepGreen,
    fontSize: 20,
    fontWeight: '900',
  },
  navCardBody: {
    color: publicColors.slate,
    fontSize: 15,
    lineHeight: 23,
    marginTop: publicSpacing.space8,
  },
});
