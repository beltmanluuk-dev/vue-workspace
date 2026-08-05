import React, { useMemo, useCallback, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  Alert,
  Animated,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Bell, TrendingUp, Users, Wallet, Lightbulb, ArrowRight, Sparkles } from 'lucide-react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import { HeroCard, BillCard, ZenStatus, PaymentModal, CostSaverModal, MonthlyReportCard, EmergencyPauseButton, SmartAlertModal, BiometricPrompt, PriceAlertCard } from '../components';
import { usePriceIncreaseEngine } from '../hooks';
import { useStore } from '../store';
import { colors, spacing, typography, shadows } from '../theme';
import { getGreeting, formatCurrency } from '../utils/helpers';
import { Bill, Insight } from '../types';
import { PriceAlertAction } from '../engine/types';

export const DashboardScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { 
    user, bills, isAutoPilotEnabled, markBillAsPaid, isEmergencyPaused, toggleEmergencyPause, 
    runClarityEngine, pendingApprovalBill: storePendingBill, showDeviationAlert, 
    setShowDeviationAlert, approvePendingBill, getDeviationResult,
    insights, notifications, family, budgets, selectBill, getActiveInsights, getUnreadNotifications, getBudgetAlerts
  } = useStore();
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [showCostSaver, setShowCostSaver] = useState(false);
  const [costSaverBill, setCostSaverBill] = useState<Bill | null>(null);
  const [showBiometric, setShowBiometric] = useState(false);
  const [pendingApprovalBill, setPendingApprovalBill] = useState<Bill | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const fadeAnim = React.useRef(new Animated.Value(1)).current;

  // Price Increase Detection
  const { activeAlert, handleAction, closeAlert, hasPendingAlerts, stats } = usePriceIncreaseEngine();

  const handlePriceAlertAction = useCallback((action: PriceAlertAction) => {
    handleAction(action);
    if (action === 'find_alternative') {
      Alert.alert(
        'Hitta alternativ',
        'Vi söker efter billigare alternativ åt dig. Du får en notis när vi hittat något!',
        [{ text: 'OK' }]
      );
    }
  }, [handleAction]);

  useEffect(() => {
    // Elegant loading state for ClarityEngine
    const timer = setTimeout(() => {
      runClarityEngine();
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setIsAnalyzing(false));
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const pendingBills = useMemo(
    () => bills.filter((bill) => 
      bill.status === 'pending' || bill.status === 'scheduled' || 
      bill.status === 'paused' || bill.status === 'pending_approval'
    ),
    [bills]
  );

  const totalDue = useMemo(
    () => pendingBills.reduce((sum, bill) => sum + bill.amount, 0),
    [pendingBills]
  );

  const nextBill = useMemo(() => {
    const sorted = [...pendingBills].sort(
      (a, b) => a.dueDate.getTime() - b.dueDate.getTime()
    );
    return sorted[0] || null;
  }, [pendingBills]);

  const upcomingBills = useMemo(() => {
    return [...pendingBills]
      .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime())
      .slice(0, 5);
  }, [pendingBills]);

  const handleQuickPay = useCallback((bill: Bill) => {
    setSelectedBill(bill);
    setShowPayment(true);
  }, []);

  const handleClosePayment = useCallback(() => {
    setShowPayment(false);
    setSelectedBill(null);
  }, []);

  const handlePay = useCallback(
    (billId: string) => {
      markBillAsPaid(billId);
    },
    [markBillAsPaid]
  );

  const handleHighBillPress = useCallback((bill: Bill) => {
    setPendingApprovalBill(bill);
    setShowBiometric(true);
  }, []);

  const handleApproveAlert = useCallback(async () => {
    if (storePendingBill) {
      setPendingApprovalBill(storePendingBill);
      setShowBiometric(true);
    }
    setShowDeviationAlert(false);
  }, [storePendingBill, setShowDeviationAlert]);

  const handlePauseAlert = useCallback(() => {
    setShowDeviationAlert(false);
    if (storePendingBill) {
      Alert.alert('Pausad', `Betalningen till ${storePendingBill.vendor} har pausats.`);
    }
  }, [storePendingBill, setShowDeviationAlert]);

  const handleCloseCostSaver = useCallback(() => {
    setShowCostSaver(false);
    setCostSaverBill(null);
  }, []);

  const handleTogglePause = useCallback(() => {
    toggleEmergencyPause();
  }, [toggleEmergencyPause]);

  const handleApprovePausedBill = useCallback((bill: Bill) => {
    setPendingApprovalBill(bill);
    setShowBiometric(true);
  }, []);

  const handleBiometricAuth = useCallback(async () => {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      
      if (hasHardware && isEnrolled) {
        const result = await LocalAuthentication.authenticateAsync({
          promptMessage: 'Verifiera för att godkänna betalning',
          cancelLabel: 'Avbryt',
          disableDeviceFallback: false,
          fallbackLabel: 'Använd lösenord',
        });
        
        if (result.success && pendingApprovalBill) {
          approvePendingBill(pendingApprovalBill.id);
          Alert.alert('Godkänd', `Betalningen till ${pendingApprovalBill.vendor} är nu schemalagd.`);
        }
      } else {
        if (pendingApprovalBill) {
          approvePendingBill(pendingApprovalBill.id);
          Alert.alert('Godkänd', `Betalningen till ${pendingApprovalBill.vendor} är nu schemalagd.`);
        }
      }
    } catch (error) {
      Alert.alert(
        'Verifiering misslyckades',
        'Kunde inte verifiera. Försök igen eller använd en annan metod.',
        [
          { text: 'Försök igen', onPress: () => handleBiometricAuth() },
          { text: 'Avbryt', style: 'cancel' }
        ]
      );
    }
    setShowBiometric(false);
    setPendingApprovalBill(null);
  }, [pendingApprovalBill, approvePendingBill]);

  const handleViewReport = useCallback(() => {
    navigation.navigate('MonthlyReportDetail' as never);
  }, [navigation]);

  const paidBillsCount = useMemo(
    () => bills.filter((b) => b.status === 'paid').length,
    [bills]
  );

  const totalPaid = useMemo(
    () => bills.filter((b) => b.status === 'paid').reduce((sum, b) => sum + b.amount, 0),
    [bills]
  );

  const unreadCount = getUnreadNotifications().length;
  const activeInsights = getActiveInsights();
  const budgetAlerts = getBudgetAlerts();

  const handleNotificationPress = useCallback(() => {
    navigation.navigate('Notifications');
  }, [navigation]);

  const handleInsightPress = useCallback((insight: Insight) => {
    if (insight.actionRoute) {
      navigation.navigate(insight.actionRoute);
    }
  }, [navigation]);

  const handleBillPress = useCallback((bill: Bill) => {
    selectBill(bill.id);
    navigation.navigate('BillDetail', { billId: bill.id });
  }, [selectBill, navigation]);

  const getInsightIcon = (type: Insight['type']) => {
    switch (type) {
      case 'saving': return <TrendingUp size={18} color={colors.mintDark} />;
      case 'warning': return <Bell size={18} color={colors.coral} />;
      case 'opportunity': return <Lightbulb size={18} color={colors.ocean} />;
      default: return <Lightbulb size={18} color={colors.graySubtle} />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      
      {/* Elegant ClarityEngine Loading Overlay */}
      {isAnalyzing && (
        <Animated.View style={[styles.loadingOverlay, { opacity: fadeAnim }]}>
          <View style={styles.loadingCard}>
            <ActivityIndicator size="small" color={colors.primary} />
            <Text style={styles.loadingText}>Analyserar dina betalningar...</Text>
          </View>
        </Animated.View>
      )}
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.greeting}>{getGreeting()},</Text>
            <Text style={styles.userName}>{user?.firstName ?? 'Användare'}</Text>
          </View>
          <TouchableOpacity style={styles.notificationButton} onPress={handleNotificationPress}>
            <Bell size={22} color={colors.primary} strokeWidth={1.8} />
            {unreadCount > 0 && (
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationBadgeText}>{unreadCount > 9 ? '9+' : unreadCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <ZenStatus
          isAutoPilotEnabled={isAutoPilotEnabled}
          pendingCount={pendingBills.filter((b) => !b.isAutoPay).length}
        />

        <View style={styles.heroSection}>
          <HeroCard
            nextBill={nextBill}
            totalDue={totalDue}
            onPress={() => navigation.navigate('Bills')}
          />
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.quickAction} onPress={() => navigation.navigate('AIAssistant')}>
            <View style={[styles.quickActionIcon, { backgroundColor: 'rgba(123, 97, 255, 0.12)' }]}>
              <Sparkles size={22} color="#7B61FF" />
            </View>
            <Text style={styles.quickActionText}>VUE AI</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickAction} onPress={() => navigation.navigate('Insights')}>
            <View style={[styles.quickActionIcon, { backgroundColor: 'rgba(168, 213, 186, 0.25)' }]}>
              <Lightbulb size={22} color={colors.mintDark} />
            </View>
            <Text style={styles.quickActionText}>Insikter</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickAction} onPress={() => navigation.navigate('Budgets')}>
            <View style={[styles.quickActionIcon, { backgroundColor: 'rgba(122, 139, 158, 0.18)' }]}>
              <Wallet size={22} color={colors.ocean} />
            </View>
            <Text style={styles.quickActionText}>Budgetar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickAction} onPress={() => navigation.navigate('Family')}>
            <View style={[styles.quickActionIcon, { backgroundColor: 'rgba(240, 165, 193, 0.18)' }]}>
              <Users size={22} color={colors.rose} />
            </View>
            <Text style={styles.quickActionText}>Family</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickAction} onPress={() => navigation.navigate('PaymentMethods')}>
            <View style={[styles.quickActionIcon, { backgroundColor: 'rgba(244, 144, 144, 0.18)' }]}>
              <TrendingUp size={22} color={colors.coral} />
            </View>
            <Text style={styles.quickActionText}>Betalning</Text>
          </TouchableOpacity>
        </View>

        {/* Insights Preview */}
        {activeInsights.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Smarta insikter</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Insights')} style={styles.seeAll}>
                <Text style={styles.seeAllText}>Se alla</Text>
                <ArrowRight size={14} color={colors.graySubtle} />
              </TouchableOpacity>
            </View>
            {activeInsights.slice(0, 2).map((insight) => (
              <TouchableOpacity
                key={insight.id}
                activeOpacity={0.8}
                onPress={() => handleInsightPress(insight)}
                style={styles.insightCard}
              >
                <View style={styles.insightIcon}>{getInsightIcon(insight.type)}</View>
                <View style={styles.insightContent}>
                  <Text style={styles.insightTitle}>{insight.title}</Text>
                  <Text style={styles.insightDesc} numberOfLines={2}>{insight.description}</Text>
                  {insight.amount !== undefined && (
                    <Text style={styles.insightAmount}>{formatCurrency(insight.amount)}</Text>
                  )}
                </View>
                <ArrowRight size={18} color={colors.graySubtle} />
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Monthly Report */}
        <View style={styles.section}>
          <MonthlyReportCard
            paymentsHandled={paidBillsCount}
            totalAmount={totalPaid}
            timeSavedMinutes={120}
            allGreen={pendingBills.length === 0}
            onPress={handleViewReport}
          />
        </View>

        {/* Emergency Pause */}
        <View style={styles.section}>
          <EmergencyPauseButton
            isPaused={isEmergencyPaused}
            onTogglePause={handleTogglePause}
          />
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Kommande</Text>
            <Text style={styles.sectionCount}>{upcomingBills.length} fakturor</Text>
          </View>

          {upcomingBills.map((bill) => (
            <BillCard
              key={bill.id}
              bill={bill}
              onPress={() => handleBillPress(bill)}
              onQuickPay={() => bill.status === 'paused' ? handleApprovePausedBill(bill) : handleQuickPay(bill)}
              onHighBillPress={() => handleHighBillPress(bill)}
            />
          ))}
        </View>
      </ScrollView>

      <PaymentModal
        visible={showPayment}
        bill={selectedBill}
        onClose={handleClosePayment}
        onPay={handlePay}
      />

      <CostSaverModal
        visible={showCostSaver}
        bill={costSaverBill}
        onClose={handleCloseCostSaver}
        onExplore={() => {
          handleCloseCostSaver();
        }}
      />

      <SmartAlertModal
        visible={showDeviationAlert}
        type="high_payment"
        title="Ovanligt hög betalning"
        message={`Denna betalning är ${storePendingBill ? Math.round(((storePendingBill.amount - (storePendingBill.averageAmount || 0)) / (storePendingBill.averageAmount || 1)) * 100) : 0}% högre än vanligt. Vill du godkänna den?`}
        amount={storePendingBill?.amount}
        previousAmount={storePendingBill?.averageAmount}
        vendor={storePendingBill?.vendor}
        onApprove={handleApproveAlert}
        onPause={handlePauseAlert}
        onClose={() => setShowDeviationAlert(false)}
      />

      <BiometricPrompt
        visible={showBiometric}
        action={`Godkänn betalning till ${pendingApprovalBill?.vendor}`}
        onAuthenticate={handleBiometricAuth}
        onCancel={() => {
          setShowBiometric(false);
          setPendingApprovalBill(null);
        }}
      />

      {/* Price Increase Detection Alert */}
      {activeAlert && (
        <PriceAlertCard
          alert={activeAlert}
          visible={!!activeAlert}
          onAction={handlePriceAlertAction}
          onDismiss={closeAlert}
        />
      )}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
  },
  headerLeft: {
    flex: 1,
  },
  notificationButton: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: colors.glass,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  greeting: {
    fontSize: typography.fontSize.base,
    color: colors.graySubtle,
    fontWeight: '400',
    letterSpacing: typography.letterSpacing.normal,
  },
  userName: {
    fontSize: typography.fontSize.xxxl,
    fontWeight: '700',
    color: colors.primary,
    letterSpacing: typography.letterSpacing.tight,
    marginTop: spacing.xs / 2,
    fontFamily: typography.fontFamily.bold,
  },
  heroSection: {
    marginTop: spacing.xl,
    marginBottom: spacing.xxl,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: typography.fontSize.xxl,
    fontWeight: '600',
    color: colors.primary,
    letterSpacing: typography.letterSpacing.wide,
    fontFamily: typography.fontFamily.semibold,
  },
  sectionCount: {
    fontSize: 14,
    color: colors.graySubtle,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 120,
    left: 0,
    right: 0,
    zIndex: 10,
    alignItems: 'center',
  },
  loadingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.glass,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    gap: spacing.sm,
  },
  loadingText: {
    fontSize: typography.fontSize.sm,
    color: colors.primary,
    fontWeight: '500',
  },
  notificationBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.coral,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: colors.background,
  },
  notificationBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#fff',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
  },
  quickAction: {
    alignItems: 'center',
    width: 72,
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
  },
  seeAll: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.graySubtle,
    marginRight: 4,
  },
  insightCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 18,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    ...shadows.soft,
  },
  insightIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.inputBackground,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  insightContent: {
    flex: 1,
    marginRight: 8,
  },
  insightTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 2,
  },
  insightDesc: {
    fontSize: 13,
    color: colors.graySubtle,
    lineHeight: 18,
  },
  insightAmount: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.mintDark,
    marginTop: 6,
  },
});
