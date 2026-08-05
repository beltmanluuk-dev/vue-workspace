import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, Lightbulb, AlertTriangle, TrendingUp, PartyPopper, ShieldAlert, X, PiggyBank, Filter } from 'lucide-react-native';
import { useStore } from '../store';
import { Insight } from '../types';
import { colors, shadows } from '../theme';
import { formatCurrency } from '../utils/helpers';

type FilterType = 'all' | Insight['type'];

const FILTER_CONFIG: Record<FilterType, { label: string }> = {
  all: { label: 'Alla' },
  saving: { label: 'Sparande' },
  warning: { label: 'Varningar' },
  opportunity: { label: 'Möjligheter' },
  celebration: { label: 'Framsteg' },
  tip: { label: 'Tips' },
};

interface InsightsScreenProps {
  onBack?: () => void;
}

export const InsightsScreen: React.FC<InsightsScreenProps> = ({ onBack }) => {
  const insights = useStore((state) => state.insights);
  const dismiss = useStore((state) => state.dismissInsight);
  const navigation = useNavigation<any>();
  const [filter, setFilter] = useState<FilterType>('all');

  const activeInsights = useMemo(
    () => insights.filter((i) => !i.isDismissed && (filter === 'all' || i.type === filter)),
    [insights, filter]
  );

  const totalPotentialSavings = useMemo(
    () => activeInsights.filter((i) => i.type === 'saving' || i.type === 'opportunity').reduce((sum, i) => sum + (i.amount || 0), 0),
    [activeInsights]
  );

  const warningCount = useMemo(() => activeInsights.filter((i) => i.type === 'warning').length, [activeInsights]);

  const getIcon = (type: Insight['type']) => {
    switch (type) {
      case 'saving': return <TrendingUp size={22} color={colors.mintDark} />;
      case 'warning': return <AlertTriangle size={22} color={colors.coralDark} />;
      case 'opportunity': return <Lightbulb size={22} color={colors.ocean} />;
      case 'celebration': return <PartyPopper size={22} color={colors.rose} />;
      case 'tip': return <ShieldAlert size={22} color={colors.graySubtle} />;
      default: return <Lightbulb size={22} color={colors.ocean} />;
    }
  };

  const getImpactColor = (impact?: Insight['impact']) => {
    switch (impact) {
      case 'high': return colors.coral;
      case 'medium': return colors.ocean;
      case 'low': return colors.graySubtle;
      default: return colors.mintDark;
    }
  };

  const renderItem = ({ item }: { item: Insight }) => (
    <View style={[styles.card, { borderLeftColor: getImpactColor(item.impact), borderLeftWidth: 4 }]}>
      <View style={styles.iconContainer}>{getIcon(item.type)}</View>
      <View style={styles.content}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
        <View style={styles.footer}>
          {item.amount !== undefined && (
            <Text style={styles.amount}>{formatCurrency(item.amount)}</Text>
          )}
          {item.actionText && (
            <TouchableOpacity activeOpacity={0.8} onPress={() => item.actionRoute && navigation.navigate(item.actionRoute)}>
              <Text style={styles.action}>{item.actionText}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      <TouchableOpacity onPress={() => dismiss(item.id)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
        <X size={18} color={colors.graySubtle} />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <ArrowLeft size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Insikter</Text>
        <View style={{ width: 44 }} />
      </View>

      <View style={styles.summaryCard}>
        <View style={[styles.summaryIcon, { backgroundColor: `${colors.mintDark}20` }]}>
          <PiggyBank size={24} color={colors.mintDark} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.summaryTitle}>Möjliga besparingar</Text>
          <Text style={styles.summaryAmount}>{formatCurrency(totalPotentialSavings)}</Text>
        </View>
        {warningCount > 0 && (
          <View style={styles.warningBadge}>
            <Text style={styles.warningBadgeText}>{warningCount}</Text>
          </View>
        )}
      </View>

      <View style={styles.filterRow}>
        <Filter size={16} color={colors.graySubtle} />
        {(Object.keys(FILTER_CONFIG) as FilterType[]).map((f) => (
          <TouchableOpacity key={f} onPress={() => setFilter(f)} style={[styles.filterChip, filter === f && styles.filterChipActive]}>
            <Text style={[styles.filterChipText, filter === f && styles.filterChipTextActive]}>{FILTER_CONFIG[f].label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={activeInsights}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Lightbulb size={48} color={colors.grayLight} />
            <Text style={styles.emptyTitle}>Inga aktiva insikter</Text>
            <Text style={styles.emptyText}>Kom tillbaka senare för nya spartips och varningar.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
  },
  list: {
    padding: 20,
    paddingBottom: 40,
  },
  summaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 18,
    marginHorizontal: 20,
    marginBottom: 12,
    padding: 16,
    ...shadows.soft,
  },
  summaryIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  summaryTitle: {
    fontSize: 13,
    color: colors.graySubtle,
  },
  summaryAmount: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.primary,
    marginTop: 2,
  },
  warningBadge: {
    minWidth: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.coral,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  warningBadgeText: {
    color: colors.background,
    fontSize: 13,
    fontWeight: '700',
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 18,
    backgroundColor: colors.inputBackground,
    marginLeft: 8,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.graySubtle,
  },
  filterChipTextActive: {
    color: colors.background,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.card,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    ...shadows.soft,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.inputBackground,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  content: { flex: 1 },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: colors.graySubtle,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  amount: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
  },
  action: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.oceanDark,
  },
  empty: {
    alignItems: 'center',
    marginTop: 80,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
    marginTop: 16,
  },
  emptyText: {
    fontSize: 14,
    color: colors.graySubtle,
    marginTop: 8,
    textAlign: 'center',
  },
});
