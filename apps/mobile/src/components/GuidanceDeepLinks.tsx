import type { GuidanceResearchSuggestion, RafiqDeepLink } from '@rafiq/shared';
import { Link } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import {
  companionColors,
  companionRadii,
  companionSpacing,
  companionTypography,
} from '../theme/mobileCompanionDesignSystem';

type Props = {
  title?: string;
  links?: RafiqDeepLink[];
  suggestions?: GuidanceResearchSuggestion[];
  maxItems?: number;
};

function visibleLinks(links: RafiqDeepLink[] = []) {
  return links.filter((link) => Boolean(link.route)).slice(0, 4);
}

function visibleSuggestions(suggestions: GuidanceResearchSuggestion[] = []) {
  return suggestions.filter((item) => Boolean(item.route)).slice(0, 3);
}

export function GuidanceDeepLinks({
  links = [],
  maxItems = 4,
  suggestions = [],
  title = 'Study deeper',
}: Props) {
  const linkItems = visibleLinks(links).slice(0, maxItems);
  const suggestionItems = visibleSuggestions(suggestions).slice(0, Math.max(0, maxItems - linkItems.length));

  if (!linkItems.length && !suggestionItems.length) return null;

  return (
    <View style={styles.wrap}>
      <Text style={styles.kicker}>{title}</Text>
      <View style={styles.row}>
        {linkItems.map((link) => (
          <Link href={link.route as never} key={link.linkId} style={styles.link}>
            {link.label}
          </Link>
        ))}
        {suggestionItems.map((suggestion) => (
          <Link href={suggestion.route as never} key={suggestion.suggestionId} style={styles.secondaryLink}>
            {suggestion.label}
          </Link>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: companionSpacing.xs,
  },
  kicker: {
    ...companionTypography.label,
    color: companionColors.gold,
    textTransform: 'uppercase',
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: companionSpacing.xs,
  },
  link: {
    backgroundColor: companionColors.night,
    borderRadius: companionRadii.sm,
    color: companionColors.white,
    fontSize: 12,
    fontWeight: '800',
    minHeight: 34,
    overflow: 'hidden',
    paddingHorizontal: companionSpacing.sm,
    paddingVertical: companionSpacing.sm,
  },
  secondaryLink: {
    backgroundColor: companionColors.paperWarm,
    borderColor: companionColors.line,
    borderRadius: companionRadii.sm,
    borderWidth: 1,
    color: companionColors.ink,
    fontSize: 12,
    fontWeight: '800',
    minHeight: 34,
    overflow: 'hidden',
    paddingHorizontal: companionSpacing.sm,
    paddingVertical: companionSpacing.sm,
  },
});
