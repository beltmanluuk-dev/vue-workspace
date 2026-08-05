import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeft, TrendingUp, TrendingDown, Calendar, Zap, PiggyBank } from 'lucide-react-native';
import { colors, spacing, typography } from '../theme';
import { useStore } from '../store';

export const MonthlyReportDetailScreen: React.FC = () => {
  const navigation = useNavigation();
  const { bills } = useStore();

  const totalPaid = bills.filter(b => b.status === 'paid').reduce((sum, b) => sum + b.amount, 0);
  const totalPending = bills.filter(b => b.status === 'pending' || b.status === 'scheduled').reduce((sum, b) => sum + b.amount, 0);
  const totalAll = totalPaid + totalPending;

  const categoryBreakdown = [
    { name: 'Prenumerationer', amount: 268, percentage: 9, color: colors.ocean },
    { name: 'Försörjning', amount: 1341, percentage: 46, color: colors.mintDark },
    { name: 'Försäkring', amount: 1250, percentage: 43, color: colors.coral },
  ];

  const insights = [
    {
      icon: <TrendingDown size={20} color={colors.mintDark} strokeWidth={2} />,
      title: 'Elförbrukning minskat',
      description: 'Din elräkning är 12% lägre än förra månaden',
      type: 'positive',
    },
    {
      icon: <TrendingUp size={20} color={colors.coral} strokeWidth={2} />,
      title: 'Vattenfall högre än vanligt',
      description: 'Räkningen är 24% högre än genomsnittet',
      type: 'warning',
    },
    {
      icon: <PiggyBank size={20} color={colors.ocean} strokeWidth={2} />,
      title: 'Sparad tid',
      description: 'Vue har sparat dig 2.5 timmar denna månad',
      type: 'info',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()} activeOpacity={0.7}>
          <ChevronLeft size={24} color={colors.primary} strokeWidth={2} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Månadsrapport</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.periodBadge}>
          <Calendar size={16} color={colors.ocean} strokeWidth={2} />
          <Text style={styles.periodText}>Februari 2026</Text>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Total utgifter</Text>
          <Text style={styles.summaryAmount}>{totalAll.toLocaleString('sv-SE')} kr</Text>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryItemLabel}>Betalt</Text>
              <Text style={[styles.summaryItemValue, { color: colors.mintDark }]}>{totalPaid.toLocaleString('sv-SE')} kr</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={styles.summaryItemLabel}>Kommande</Text>
              <Text style={[styles.summaryItemValue, { color: colors.ocean }]}>{totalPending.toLocaleString('sv-SE')} kr</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Fördelning per kategori</Text>
          <View style={styles.categoryList}>
            {categoryBreakdown.map((category, index) => (
              <View key={index} style={styles.categoryItem}>
                <View style={styles.categoryInfo}>
                  <View style={[styles.categoryDot, { backgroundColor: category.color }]} />
                  <Text style={styles.categoryName}>{category.name}</Text>
                </View>
                <View style={styles.categoryValues}>
                  <Text style={styles.categoryAmount}>{category.amount.toLocaleString('sv-SE')} kr</Text>
                  <Text style={styles.categoryPercentage}>{category.percentage}%</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Insikter</Text>
          <View style={styles.insightsList}>
            {insights.map((insight, index) => (
              <View key={index} style={[styles.insightCard, insight.type === 'warning' && styles.insightWarning]}>
                <View style={styles.insightIcon}>{insight.icon}</View>
                <View style={styles.insightContent}>
                  <Text style={styles.insightTitle}>{insight.title}</Text>
                  <Text style={styles.insightDescription}>{insight.description}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.autopilotSection}>
          <Zap size={20} color={colors.ocean} strokeWidth={2} />
          <View style={styles.autopilotContent}>
            <Text style={styles.autopilotTitle}>AutoPilot aktiv</Text>
            <Text style={styles.autopilotDescription}>5 räkningar betalades automatiskt denna månad</Text>
          </View>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: colors.glass,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  headerTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: '600',
    color: colors.primary,
  },
  placeholder: {
    width: 44,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxxl,
  },
  periodBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: colors.oceanLight,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 12,
    gap: spacing.xs,
    marginBottom: spacing.lg,
  },
  periodText: {
    fontSize: typography.fontSize.sm,
    fontWeight: '600',
    color: colors.ocean,
  },
  summaryCard: {
    backgroundColor: colors.glass,
    borderRadius: 20,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    marginBottom: spacing.xl,
  },
  summaryLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.graySubtle,
    marginBottom: spacing.xs,
  },
  summaryAmount: {
    fontSize: typography.fontSize.xxxl,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: spacing.lg,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryItem: {
    flex: 1,
  },
  summaryItemLabel: {
    fontSize: typography.fontSize.xs,
    color: colors.graySubtle,
    marginBottom: 2,
  },
  summaryItemValue: {
    fontSize: typography.fontSize.lg,
    fontWeight: '600',
  },
  summaryDivider: {
    width: 1,
    height: 32,
    backgroundColor: colors.glassBorder,
    marginHorizontal: spacing.lg,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: spacing.md,
  },
  categoryList: {
    backgroundColor: colors.glass,
    borderRadius: 16,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    gap: spacing.md,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  categoryDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  categoryName: {
    fontSize: typography.fontSize.base,
    color: colors.primary,
  },
  categoryValues: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  categoryAmount: {
    fontSize: typography.fontSize.base,
    fontWeight: '600',
    color: colors.primary,
  },
  categoryPercentage: {
    fontSize: typography.fontSize.sm,
    color: colors.graySubtle,
    width: 36,
    textAlign: 'right',
  },
  insightsList: {
    gap: spacing.md,
  },
  insightCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.glass,
    borderRadius: 16,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  insightWarning: {
    borderColor: 'rgba(244, 144, 144, 0.5)',
    backgroundColor: 'rgba(244, 144, 144, 0.1)',
  },
  insightIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  insightContent: {
    flex: 1,
  },
  insightTitle: {
    fontSize: typography.fontSize.base,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 2,
  },
  insightDescription: {
    fontSize: typography.fontSize.sm,
    color: colors.graySubtle,
  },
  autopilotSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.oceanLight,
    borderRadius: 16,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.ocean,
  },
  autopilotContent: {
    marginLeft: spacing.md,
  },
  autopilotTitle: {
    fontSize: typography.fontSize.base,
    fontWeight: '600',
    color: colors.ocean,
  },
  autopilotDescription: {
    fontSize: typography.fontSize.sm,
    color: colors.ocean,
    opacity: 0.8,
  },
});

export default MonthlyReportDetailScreen;
