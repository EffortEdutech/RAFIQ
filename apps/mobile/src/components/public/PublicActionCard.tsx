import { Link } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { publicColors, publicRadii, publicShadows, publicSpacing, publicTypography } from '../../theme/publicDesignSystem';

type Props = {
  title: string;
  body: string;
  href: string;
  action: string;
};

export function PublicActionCard({ title, body, href, action }: Props) {
  return (
    <View style={[styles.actionCard, publicShadows.card]}>
      <View style={styles.cardAccent} />
      <View style={styles.cardCopy}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardBody}>{body}</Text>
      </View>
      <Link href={href as never} style={styles.cardLink}>
        {action}
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  actionCard: {
    backgroundColor: publicColors.paper,
    borderColor: publicColors.line,
    borderRadius: publicRadii.large,
    borderWidth: 1,
    gap: publicSpacing.space16,
    overflow: 'hidden',
    padding: publicSpacing.space20,
  },
  cardAccent: {
    backgroundColor: publicColors.gold,
    borderRadius: publicRadii.pill,
    height: 5,
    width: 72,
  },
  cardCopy: {
    gap: publicSpacing.space8,
  },
  cardTitle: {
    ...publicTypography.cardTitle,
    color: publicColors.ink,
  },
  cardBody: {
    ...publicTypography.body,
    color: publicColors.slate,
  },
  cardLink: {
    backgroundColor: publicColors.deepGreen,
    borderRadius: publicRadii.medium,
    color: publicColors.white,
    fontWeight: '800',
    minHeight: 48,
    overflow: 'hidden',
    paddingHorizontal: publicSpacing.space20,
    paddingVertical: publicSpacing.space16,
    textAlign: 'center',
  },
});
