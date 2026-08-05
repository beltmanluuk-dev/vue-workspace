import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
} from 'react-native';
import { ArrowLeft, Wallet, AlertCircle, TrendingDown, Zap, Tv, Shield, Home, MoreHorizontal } from 'lucide-react-native';
import { useStore } from '../store';
import { Budget } from '../types';
import { colors, shadows } from '../theme';
import { formatCurrency, calculateBudgetUsage, getCategoryLabel } from '../utils/helpers';

const CATEGORY_ICON: Record<Budget['category'], React.ReactNode> = {
  utilities: <Zap size={20} color={colors.ocean} />,
  subscription: <Tv size={20} color={colors.ocean} />,
  insurance: <Shield size={20} color={colors.ocean} />,
  rent: <Home size={20} color={colors.ocean} />,
  other: <MoreHorizontal size={20} color={colors.ocean} />,
  all: <Wallet size={20} color={colors.ocean} />,
};

interface BudgetsScreenProps {
  onBack?: () => void;
}

export const BudgetsScreen: React.FC<BudgetsScreenProps> = ({ onBack }) => {
  const budgets = useStore((state) => state.budgets);
  const setLimit = useStore((state) => state.setBudgetLimit);

  const BudgetCard: React.FC<{ item: Budget }> = ({ item }) => {
    const [limitText, setLimitText] = useState(String(item.limit));
    const usage = calculateBudgetUsage(item.spent, item.limit);
    const isOver = usage >= 100;
    const isWarning = !isOver && usage >= (item.alertThreshold || 0.8) * 100;
    const remaining = item.limit - item.spent;

    return (
      <View style={[styles.card, isOver && styles.overCard, isWarning && styles.warningCard]}>
        <View style={styles.cardHeader}>
          <View style={[styles.iconContainer, isOver && { backgroundColor: 'rgba(244, 144, 144, 0.12)' }]}>
            {CATEGORY_ICON[item.category]}
          </View>
          <View style={styles.titleRow}>
            <Text style={styles.title}>{getCategoryLabel(item.category)}</Text>
            {isWarning && <AlertCircle size={16} color={colors.coral} />}
          </View>
          <Text style={styles.limit}>{formatCurrency(item.limit)}/mån</Text>
        </View>

        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { width: `${Math.min(usage, 100)}%`, backgroundColor: isOver ? colors.coral : isWarning ? colors.ocean : colors.mintDark }]} />
        </View>

        <View style={styles.statsRow}>
          <Text style={styles.spent}>Spenderat {formatCurrency(item.spent)}</Text>
          <Text style={[styles.usage, isOver && styles.overText]}>{usage.toFixed(0)}%</Text>
        </View>

        <View style={styles.remainingRow}>
          <Text style={[styles.remaining, isOver && styles.overText]}>
            {isOver ? 'Överstigit med ' : 'Kvarvarande '}{formatCurrency(Math.abs(remaining))}
          </Text>
        </View>

        <View style={styles.inputRow}>
          <Text style={styles.inputLabel}>Ny gräns:</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={limitText}
            onChangeText={setLimitText}
            onBlur={() => {
              const value = Number(limitText.replace(',', '.'));
              if (!Number.isNaN(value) && value >= 0) {
                setLimit(item.id, value);
              } else {
                setLimitText(String(item.limit));
              }
            }}
          />
          <Text style={styles.currency}>kr</Text>
        </View>
      </View>
    );
  };

  const renderItem = ({ item }: { item: Budget }) => <BudgetCard item={item} />;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <ArrowLeft size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Budgetar</Text>
        <View style={{ width: 44 }} />
      </View>

      <View style={styles.summaryCard}>
        <TrendingDown size={24} color={colors.mintDark} />
        <View style={{ marginLeft: 12, flex: 1 }}>
          <Text style={styles.summaryTitle}>Total budget</Text>
          <Text style={styles.summaryAmount}>
            {formatCurrency(budgets.reduce((sum, b) => sum + b.spent, 0))} / {formatCurrency(budgets.reduce((sum, b) => sum + b.limit, 0))}
          </Text>
        </View>
      </View>

      <FlatList
        data={budgets}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
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
  summaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 18,
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 16,
    ...shadows.soft,
  },
  summaryTitle: {
    fontSize: 13,
    color: colors.graySubtle,
  },
  summaryAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
    marginTop: 2,
  },
  list: {
    padding: 20,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    ...shadows.soft,
  },
  overCard: {
    borderColor: colors.coral,
    backgroundColor: 'rgba(244, 144, 144, 0.06)',
  },
  warningCard: {
    borderColor: colors.ocean,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.inputBackground,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  titleRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
    marginRight: 8,
  },
  limit: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.graySubtle,
  },
  progressContainer: {
    height: 8,
    backgroundColor: colors.inputBackground,
    borderRadius: 4,
    marginTop: 14,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  spent: {
    fontSize: 13,
    color: colors.graySubtle,
  },
  usage: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.graySubtle,
  },
  overText: {
    color: colors.coral,
  },
  remainingRow: {
    marginTop: 6,
  },
  remaining: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.graySubtle,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.cardBorder,
  },
  inputLabel: {
    fontSize: 14,
    color: colors.graySubtle,
    marginRight: 8,
  },
  input: {
    minWidth: 80,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
    textAlign: 'right',
    paddingVertical: 2,
  },
  currency: {
    fontSize: 14,
    color: colors.graySubtle,
    marginLeft: 4,
  },
});
