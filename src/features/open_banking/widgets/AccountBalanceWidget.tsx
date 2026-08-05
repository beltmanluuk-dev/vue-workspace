import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, typography } from '../../../theme';

interface AccountBalanceWidgetProps {
  balance?: number;
  currency?: string;
}

export const AccountBalanceWidget: React.FC<AccountBalanceWidgetProps> = ({
  balance = 0,
  currency = 'SEK',
}) => {
  const formatted = balance.toLocaleString('sv-SE', { minimumFractionDigits: 0, maximumFractionDigits: 2 });

  return (
    <View style={styles.card}>
      <Text style={styles.label}>Totalt saldo</Text>
      <Text style={styles.amount}>
        {formatted} {currency}
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
  label: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  amount: {
    fontSize: typography.fontSize.xxl,
    fontWeight: '700',
    color: colors.primary,
  },
});
