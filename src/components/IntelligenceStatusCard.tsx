/**
 * IntelligenceStatusCard
 * Visar ekonomisk status från ClarityEngine - subtil integration utan designändring
 */

import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Shield,
  AlertTriangle,
  Sparkles,
} from 'lucide-react-native';
import { colors, spacing, typography, shadows } from '../theme';
import { useStore } from '../store';
import { t } from '../i18n';

interface IntelligenceStatusCardProps {
  compact?: boolean;
  onPress?: () => void;
}

export const IntelligenceStatusCard: React.FC<IntelligenceStatusCardProps> = ({
  compact = false,
  onPress,
}) => {
  const {
    financialStressScore,
    stressRiskLevel,
    moneyMomentum,
    financialWeather,
    autopilotLevel,
    riskWarnings,
    potentialSavings,
  } = useStore();

  const weatherIcon = useMemo(() => {
    const icons: Record<string, string> = {
      sunny: '☀️',
      partly_cloudy: '🌤️',
      cloudy: '☁️',
      stormy: '⛈️',
    };
    return icons[financialWeather] || '☀️';
  }, [financialWeather]);

  const getMomentumIcon = () => {
    switch (moneyMomentum) {
      case 'Förbättras':
        return <TrendingUp size={16} color={colors.mint} strokeWidth={2} />;
      case 'Ökad risk':
        return <TrendingDown size={16} color={colors.coral} strokeWidth={2} />;
      default:
        return <Minus size={16} color={colors.ocean} strokeWidth={2} />;
    }
  };

  const getStatusColor = () => {
    if (stressRiskLevel === 'Kritisk' || stressRiskLevel === 'Hög') {
      return colors.coral;
    }
    if (stressRiskLevel === 'Medel') {
      return colors.ocean;
    }
    return colors.mint;
  };

  const urgentWarnings = riskWarnings.filter(
    w => w.severity === 'Kritisk' || w.severity === 'Hög'
  ).length;

  const getStatusMessage = (): string => {
    if (urgentWarnings > 0) {
      return t('insights.risk_period', { days: riskWarnings[0]?.daysUntilRisk || 0 });
    }
    if (stressRiskLevel === 'Låg') {
      return t('insights.economy_stable');
    }
    if (potentialSavings > 0) {
      return t('insights.savings_potential', { amount: potentialSavings.toLocaleString('sv-SE') });
    }
    return t('insights.all_good');
  };

  if (compact) {
    return (
      <TouchableOpacity 
        style={styles.compactContainer} 
        onPress={onPress}
        activeOpacity={0.8}
      >
        <View style={styles.compactLeft}>
          <Text style={styles.weatherIcon}>{weatherIcon}</Text>
          <View style={styles.compactInfo}>
            <Text style={styles.compactTitle}>{moneyMomentum}</Text>
            <Text style={styles.compactSubtitle}>{autopilotLevel}</Text>
          </View>
        </View>
        {urgentWarnings > 0 && (
          <View style={styles.warningBadge}>
            <AlertTriangle size={12} color={colors.background} strokeWidth={2} />
            <Text style={styles.warningBadgeText}>{urgentWarnings}</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={onPress}
      activeOpacity={0.9}
    >
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.weatherIcon}>{weatherIcon}</Text>
          <View>
            <Text style={styles.title}>Ekonomisk status</Text>
            <Text style={[styles.riskLevel, { color: getStatusColor() }]}>
              {stressRiskLevel}
            </Text>
          </View>
        </View>
        <View style={styles.autopilotBadge}>
          <Shield size={14} color={colors.ocean} strokeWidth={2} />
          <Text style={styles.autopilotText}>{autopilotLevel}</Text>
        </View>
      </View>

      <View style={styles.statusRow}>
        <View style={styles.statusItem}>
          {getMomentumIcon()}
          <Text style={styles.statusLabel}>{moneyMomentum}</Text>
        </View>
        
        <View style={styles.divider} />
        
        <View style={styles.statusItem}>
          <View style={[styles.stressIndicator, { backgroundColor: getStatusColor() }]}>
            <Text style={styles.stressScore}>{financialStressScore}</Text>
          </View>
          <Text style={styles.statusLabel}>Stress</Text>
        </View>

        {potentialSavings > 0 && (
          <>
            <View style={styles.divider} />
            <View style={styles.statusItem}>
              <Sparkles size={16} color={colors.mint} strokeWidth={2} />
              <Text style={styles.savingsText}>
                +{potentialSavings.toLocaleString('sv-SE')} kr
              </Text>
            </View>
          </>
        )}
      </View>

      <View style={styles.messageContainer}>
        <Text style={styles.statusMessage}>{getStatusMessage()}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.glass,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    padding: spacing.lg,
    ...shadows.glass,
  },
  compactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.glass,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    padding: spacing.md,
  },
  compactLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  compactInfo: {
    marginLeft: spacing.xs,
  },
  compactTitle: {
    fontSize: typography.fontSize.sm,
    fontWeight: '600',
    color: colors.primary,
  },
  compactSubtitle: {
    fontSize: typography.fontSize.xs,
    color: colors.graySubtle,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  weatherIcon: {
    fontSize: 28,
  },
  title: {
    fontSize: typography.fontSize.base,
    fontWeight: '600',
    color: colors.primary,
  },
  riskLevel: {
    fontSize: typography.fontSize.sm,
    fontWeight: '500',
  },
  autopilotBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 10,
    gap: 4,
  },
  autopilotText: {
    fontSize: typography.fontSize.xs,
    fontWeight: '600',
    color: colors.ocean,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
  },
  statusLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.graySubtle,
  },
  divider: {
    width: 1,
    height: 20,
    backgroundColor: colors.glassBorder,
  },
  stressIndicator: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stressScore: {
    fontSize: typography.fontSize.xs,
    fontWeight: '700',
    color: colors.background,
  },
  savingsText: {
    fontSize: typography.fontSize.sm,
    fontWeight: '600',
    color: colors.mint,
  },
  messageContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.03)',
    borderRadius: 10,
    padding: spacing.sm,
  },
  statusMessage: {
    fontSize: typography.fontSize.sm,
    color: colors.primary,
    textAlign: 'center',
  },
  warningBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.coral,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 10,
    gap: 4,
  },
  warningBadgeText: {
    fontSize: typography.fontSize.xs,
    fontWeight: '700',
    color: colors.background,
  },
});

export default IntelligenceStatusCard;
