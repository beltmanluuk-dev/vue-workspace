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
import { Bell } from 'lucide-react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import { HeroCard, BillCard, ZenStatus, PaymentModal, CostSaverModal, MonthlyReportCard, EmergencyPauseButton, SmartAlertModal, BiometricPrompt } from '../components';
import { useStore } from '../store';
import { colors, spacing, typography } from '../theme';
import { getGreeting } from '../utils/helpers';
import { Bill } from '../types';

export const DashboardScreen: React.FC = () => {
  const navigation = useNavigation();
  const { 
    user, bills, isAutoPilotEnabled, markBillAsPaid, isEmergencyPaused, toggleEmergencyPause, 
    runClarityEngine, pendingApprovalBill: storePendingBill, showDeviationAlert, 
    setShowDeviationAlert, approvePendingBill, getDeviationResult 
  } = useStore();
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [showCostSaver, setShowCostSaver] = useState(false);
  const [costSaverBill, setCostSaverBill] = useState<Bill | null>(null);
  const [showBiometric, setShowBiometric] = useState(false);
  const [pendingApprovalBill, setPendingApprovalBill] = useState<Bill | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const fadeAnim = React.useRef(new Animated.Value(1)).current;

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
          <TouchableOpacity style={styles.notificationButton}>
            <Bell size={22} color={colors.primary} strokeWidth={1.8} />
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
            onPress={() => {}}
          />
        </View>

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
              onPress={() => bill.status === 'paused' ? handleApprovePausedBill(bill) : handleQuickPay(bill)}
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
});
