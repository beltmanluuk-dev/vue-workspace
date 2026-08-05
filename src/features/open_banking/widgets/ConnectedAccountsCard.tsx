import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, typography } from '../../../theme';

export const ConnectedAccountsCard: React.FC = () => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Anslutna konton</Text>
      <Text style={styles.body}>
        Ingen bank är ansluten ännu. Open Banking-integrationen är förberedd men inte aktiverad.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  title: {
    fontSize: typography.fontSize.lg,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: spacing.sm,
  },
  body: {
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
    lineHeight: 22,
  },
});
