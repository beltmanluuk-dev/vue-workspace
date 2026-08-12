import React, { useMemo, useCallback, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { Inbox, CheckCircle, Clock, AlertCircle, Camera, Plus } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import * as LocalAuthentication from 'expo-local-authentication';
import { BillCard, PaymentModal, CostSaverModal, BiometricPrompt, EmptyState } from '../components';
import { useStore } from '../store';
import { colors } from '../theme';
import { Bill } from '../types';

type FilterType = 'all' | 'pending' | 'scheduled' | 'paid' | 'pending_approval';

export const BillsScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { bills, markBillAsPaid, runClarityEngine, approvePendingBill, selectBill } = useStore();
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [showCostSaver, setShowCostSaver] = useState(false);
  const [costSaverBill, setCostSaverBill] = useState<Bill | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [showBiometric, setShowBiometric] = useState(false);
  const [pendingApprovalBill, setPendingApprovalBill] = useState<Bill | null>(null);

  useEffect(() => {
    runClarityEngine();
  }, []);

  const filteredBills = useMemo(() => {
    if (activeFilter === 'all') return bills;
    if (activeFilter === 'pending') {
      return bills.filter((bill) => bill.status === 'pending' || bill.status === 'pending_approval');
    }
    return bills.filter((bill) => bill.status === activeFilter);
  }, [bills, activeFilter]);

  const sortedBills = useMemo(
    () =>
      [...filteredBills].sort(
        (a, b) => a.dueDate.getTime() - b.dueDate.getTime()
      ),
    [filteredBills]
  );

  const counts = useMemo(
    () => ({
      all: bills.length,
      pending: bills.filter((b) => b.status === 'pending' || b.status === 'pending_approval').length,
      scheduled: bills.filter((b) => b.status === 'scheduled').length,
      paid: bills.filter((b) => b.status === 'paid').length,
      pending_approval: bills.filter((b) => b.status === 'pending_approval').length,
    }),
    [bills]
  );

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
    if (bill.status === 'pending_approval') {
      setPendingApprovalBill(bill);
      setShowBiometric(true);
    } else {
      setCostSaverBill(bill);
      setShowCostSaver(true);
    }
  }, []);

  const handleBillPress = useCallback((bill: Bill) => {
    selectBill(bill.id);
    navigation.navigate('BillDetail', { billId: bill.id });
  }, [selectBill, navigation]);

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

  const handleCloseCostSaver = useCallback(() => {
    setShowCostSaver(false);
    setCostSaverBill(null);
  }, []);

  const filters: { key: FilterType; label: string; icon: React.ReactNode }[] = [
    { key: 'all', label: 'Alla', icon: <Inbox size={16} color={activeFilter === 'all' ? colors.background : colors.graySubtle} /> },
    { key: 'pending', label: 'Väntande', icon: <AlertCircle size={16} color={activeFilter === 'pending' ? colors.background : colors.graySubtle} /> },
    { key: 'scheduled', label: 'Schemalagda', icon: <Clock size={16} color={activeFilter === 'scheduled' ? colors.background : colors.graySubtle} /> },
    { key: 'paid', label: 'Betalda', icon: <CheckCircle size={16} color={activeFilter === 'paid' ? colors.background : colors.graySubtle} /> },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.title}>Fakturor</Text>
            <Text style={styles.subtitle}>Hantera dina betalningar</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity 
              style={[styles.headerButton, styles.headerButtonMargin]}
              onPress={() => navigation.navigate('BillScanResult')}
            >
              <Camera size={22} color={colors.primary} strokeWidth={1.8} />
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.headerButton, { backgroundColor: colors.primary }]}
              onPress={() => navigation.navigate('AddBill')}
            >
              <Plus size={22} color={colors.background} strokeWidth={2} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterContainer}
        contentContainerStyle={styles.filterContent}
      >
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter.key}
            style={[
              styles.filterButton,
              activeFilter === filter.key && styles.filterButtonActive,
            ]}
            onPress={() => setActiveFilter(filter.key)}
          >
            {filter.icon}
            <Text
              style={[
                styles.filterText,
                activeFilter === filter.key && styles.filterTextActive,
              ]}
            >
              {filter.label}
            </Text>
            <View
              style={[
                styles.filterBadge,
                activeFilter === filter.key && styles.filterBadgeActive,
              ]}
            >
              <Text
                style={[
                  styles.filterBadgeText,
                  activeFilter === filter.key && styles.filterBadgeTextActive,
                ]}
              >
                {counts[filter.key]}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <FlatList
        data={sortedBills}
        keyExtractor={(item) => item.id}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
        removeClippedSubviews={true}
        renderItem={({ item: bill }) => (
          <BillCard
            bill={bill}
            onPress={() => handleBillPress(bill)}
            onQuickPay={() => handleQuickPay(bill)}
            onHighBillPress={() => handleHighBillPress(bill)}
          />
        )}
        ListEmptyComponent={
          <EmptyState
            type="bills"
            title={activeFilter === 'paid' ? 'Inga betalda fakturor' : 'Inga fakturor hittade'}
            message={
              activeFilter === 'paid'
                ? 'Betalda fakturor visas här när du har betalat dem.'
                : 'Anslut din bank för att automatiskt hitta dina återkommande betalningar.'
            }
          />
        }
      />

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
        onExplore={() => handleCloseCostSaver()}
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
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    marginBottom: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: colors.card,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.button,
  },
  headerButtonMargin: {
    marginRight: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.primary,
    letterSpacing: -0.8,
  },
  subtitle: {
    fontSize: 15,
    color: colors.graySubtle,
    marginTop: 4,
  },
  filterContainer: {
    maxHeight: 50,
    marginBottom: 20,
  },
  filterContent: {
    paddingHorizontal: 20,
    gap: 10,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    marginRight: 10,
    borderWidth: 1.5,
    borderColor: colors.border,
    ...shadows.button,
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.buttonBorder,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.graySubtle,
    marginLeft: 6,
  },
  filterTextActive: {
    color: colors.background,
  },
  filterBadge: {
    backgroundColor: 'rgba(0, 0, 0, 0.06)',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
    marginLeft: 8,
  },
  filterBadgeActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  filterBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.graySubtle,
  },
  filterBadgeTextActive: {
    color: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.primary,
  },
  emptySubtitle: {
    fontSize: 14,
    color: colors.graySubtle,
    marginTop: 4,
  },
});
