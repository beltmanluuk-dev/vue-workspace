import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { TrendingUp, TrendingDown, Minus, PieChart } from 'lucide-react-native';
import { useStore } from '../store';
import { colors, shadows, spacing, typography } from '../theme';
import { formatCurrency } from '../utils/helpers';

const { width } = Dimensions.get('window');

export const AnalyticsScreen: React.FC = () => {
  const { bills } = useStore();

  const stats = useMemo(() => {
    const totalSpent = bills
      .filter((b) => b.status === 'paid')
      .reduce((sum, b) => sum + b.amount, 0);

    const totalPending = bills
      .filter((b) => b.status === 'pending' || b.status === 'scheduled')
      .reduce((sum, b) => sum + b.amount, 0);

    const categoryBreakdown = bills.reduce((acc, bill) => {
      const category = bill.category;
      if (!acc[category]) {
        acc[category] = { total: 0, count: 0 };
      }
      acc[category].total += bill.amount;
      acc[category].count += 1;
      return acc;
    }, {} as Record<string, { total: number; count: number }>);

    const autoPayCount = bills.filter((b) => b.isAutoPay).length;
    const autoPayPercentage = Math.round((autoPayCount / bills.length) * 100);

    return { totalSpent, totalPending, categoryBreakdown, autoPayPercentage };
  }, [bills]);

  const categories = [
    { key: 'subscription', label: 'Subscriptions', color: colors.ocean, icon: '📱' },
    { key: 'utilities', label: 'Utilities', color: colors.mint, icon: '⚡' },
    { key: 'insurance', label: 'Insurance', color: colors.coral, icon: '🛡️' },
    { key: 'rent', label: 'Rent', color: colors.rose, icon: '🏠' },
    { key: 'other', label: 'Other', color: colors.grayMedium, icon: '📦' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Analytics</Text>
          <Text style={styles.subtitle}>Your spending insights</Text>
        </View>

        <View style={styles.statsGrid}>
          <View style={[styles.statCard, styles.statCardLarge]}>
            <View style={styles.statHeader}>
              <TrendingDown size={20} color={colors.systemGreen} />
              <Text style={styles.statLabel}>Paid this month</Text>
            </View>
            <Text style={styles.statValue}>{formatCurrency(stats.totalSpent)}</Text>
          </View>

          <View style={[styles.statCard, styles.statCardLarge]}>
            <View style={styles.statHeader}>
              <TrendingUp size={20} color={colors.systemBlue} />
              <Text style={styles.statLabel}>Upcoming</Text>
            </View>
            <Text style={styles.statValue}>{formatCurrency(stats.totalPending)}</Text>
          </View>
        </View>

        <View style={styles.automationCard}>
          <View style={styles.automationHeader}>
            <View style={styles.automationIconContainer}>
              <Minus size={24} color={colors.primary} />
            </View>
            <View style={styles.automationInfo}>
              <Text style={styles.automationTitle}>Automation Rate</Text>
              <Text style={styles.automationSubtitle}>Bills on auto-pay</Text>
            </View>
          </View>
          <View style={styles.automationProgress}>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${stats.autoPayPercentage}%` },
                ]}
              />
            </View>
            <Text style={styles.automationPercentage}>{stats.autoPayPercentage}%</Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <PieChart size={20} color={colors.primary} />
            <Text style={styles.sectionTitle}>By Category</Text>
          </View>

          {categories.map((category) => {
            const data = stats.categoryBreakdown[category.key];
            if (!data) return null;

            return (
              <View key={category.key} style={styles.categoryRow}>
                <View style={styles.categoryLeft}>
                  <Text style={styles.categoryIcon}>{category.icon}</Text>
                  <View>
                    <Text style={styles.categoryLabel}>{category.label}</Text>
                    <Text style={styles.categoryCount}>
                      {data.count} {data.count === 1 ? 'bill' : 'bills'}
                    </Text>
                  </View>
                </View>
                <Text style={styles.categoryAmount}>
                  {formatCurrency(data.total)}
                </Text>
              </View>
            );
          })}
        </View>

        <View style={styles.insightCard}>
          <Text style={styles.insightEmoji}>💡</Text>
          <Text style={styles.insightTitle}>Smart Insight</Text>
          <Text style={styles.insightText}>
            Enable auto-pay on all bills to achieve Zen Mode and never worry about
            missing a payment.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxxl,
  },
  header: {
    paddingTop: spacing.lg,
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: typography.fontSize.xxxl,
    fontWeight: '700',
    color: colors.primary,
    letterSpacing: typography.letterSpacing.tight,
    fontFamily: typography.fontFamily.bold,
  },
  subtitle: {
    fontSize: typography.fontSize.base,
    color: colors.graySubtle,
    marginTop: spacing.xs,
    letterSpacing: typography.letterSpacing.normal,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: spacing.lg,
    marginBottom: spacing.xl,
  },
  statCard: {
    backgroundColor: colors.glass,
    borderRadius: 24,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    ...shadows.glass,
  },
  statCardLarge: {
    flex: 1,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.graySubtle,
    marginLeft: spacing.sm,
    letterSpacing: typography.letterSpacing.normal,
  },
  statValue: {
    fontSize: typography.fontSize.xxl,
    fontWeight: '700',
    color: colors.primary,
    letterSpacing: typography.letterSpacing.tight,
    fontFamily: typography.fontFamily.bold,
  },
  automationCard: {
    backgroundColor: colors.glass,
    borderRadius: 24,
    padding: spacing.xl,
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    ...shadows.glass,
  },
  automationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  automationIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  automationInfo: {
    flex: 1,
  },
  automationTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.primary,
  },
  automationSubtitle: {
    fontSize: 13,
    color: colors.graySubtle,
    marginTop: 2,
  },
  automationProgress: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.06)',
    borderRadius: 4,
    marginRight: 12,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.mint,
    borderRadius: 4,
  },
  automationPercentage: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.primary,
    minWidth: 50,
    textAlign: 'right',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.primary,
    marginLeft: 10,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.glass,
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  categoryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryIcon: {
    fontSize: 24,
    marginRight: 14,
  },
  categoryLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.primary,
  },
  categoryCount: {
    fontSize: 12,
    color: colors.graySubtle,
    marginTop: 2,
  },
  categoryAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
  insightCard: {
    backgroundColor: colors.oceanLight,
    borderRadius: 24,
    padding: spacing.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.ocean,
  },
  insightEmoji: {
    fontSize: 32,
    marginBottom: 12,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 8,
  },
  insightText: {
    fontSize: 14,
    color: colors.graySubtle,
    textAlign: 'center',
    lineHeight: 20,
  },
});
