import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Check, Plus, Sparkles } from 'lucide-react-native';
import { colors, spacing, typography, shadows } from '../theme';
import { useStore } from '../store';

interface FoundBill {
  id: string;
  vendor: string;
  logo: string;
  amount: number;
  frequency: string;
  category: string;
  selected: boolean;
}

const mockFoundBills: FoundBill[] = [
  { id: '1', vendor: 'Hyra - Bostadsbolaget', logo: 'https://logo.clearbit.com/bostadsbolaget.se', amount: 8500, frequency: 'Månadsvis', category: 'Boende', selected: true },
  { id: '2', vendor: 'Vattenfall', logo: 'https://logo.clearbit.com/vattenfall.com', amount: 720, frequency: 'Månadsvis', category: 'El', selected: true },
  { id: '3', vendor: 'Telia', logo: 'https://logo.clearbit.com/telia.se', amount: 449, frequency: 'Månadsvis', category: 'Internet', selected: true },
  { id: '4', vendor: 'Netflix', logo: 'https://logo.clearbit.com/netflix.com', amount: 149, frequency: 'Månadsvis', category: 'Streaming', selected: true },
  { id: '5', vendor: 'Spotify', logo: 'https://logo.clearbit.com/spotify.com', amount: 119, frequency: 'Månadsvis', category: 'Streaming', selected: true },
  { id: '6', vendor: 'Folksam', logo: 'https://logo.clearbit.com/folksam.se', amount: 1250, frequency: 'Kvartalsvis', category: 'Försäkring', selected: true },
  { id: '7', vendor: 'Gym - SATS', logo: 'https://logo.clearbit.com/sats.se', amount: 399, frequency: 'Månadsvis', category: 'Hälsa', selected: false },
  { id: '8', vendor: 'Apple iCloud', logo: 'https://logo.clearbit.com/apple.com', amount: 29, frequency: 'Månadsvis', category: 'Lagring', selected: false },
];

export const ClarityListScreen: React.FC = () => {
  const navigation = useNavigation();
  const [bills, setBills] = useState(mockFoundBills);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const selectedCount = bills.filter(b => b.selected).length;
  const allSelected = bills.every(b => b.selected);

  const toggleBill = (id: string) => {
    setBills(prev => prev.map(bill => 
      bill.id === id ? { ...bill, selected: !bill.selected } : bill
    ));
  };

  const toggleAll = () => {
    const newValue = !allSelected;
    setBills(prev => prev.map(bill => ({ ...bill, selected: newValue })));
  };

  const handleContinue = () => {
    navigation.navigate('Personalize' as never);
  };

  const handleAddManually = () => {
    navigation.navigate('BillScanResult' as never);
  };

  const formatCurrency = (amount: number) => `${amount.toLocaleString('sv-SE')} kr`;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerIcon}>
          <Sparkles size={24} color={colors.mint} />
        </View>
        <Text style={styles.title}>Vi hittade {bills.length} betalningar!</Text>
        <Text style={styles.subtitle}>
          Välj vilka du vill att Vue hanterar åt dig
        </Text>
      </View>

      <View style={styles.selectAllContainer}>
        <TouchableOpacity style={styles.selectAllButton} onPress={toggleAll}>
          <View style={[styles.checkbox, allSelected && styles.checkboxSelected]}>
            {allSelected && <Check size={14} color={colors.background} />}
          </View>
          <Text style={styles.selectAllText}>Välj alla ({bills.length})</Text>
        </TouchableOpacity>
        <Text style={styles.selectedCount}>{selectedCount} valda</Text>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {bills.map((bill) => (
          <TouchableOpacity 
            key={bill.id}
            style={[styles.billCard, bill.selected && styles.billCardSelected]}
            onPress={() => toggleBill(bill.id)}
            activeOpacity={0.7}
          >
            <View style={styles.billLeft}>
              <View style={[styles.checkbox, bill.selected && styles.checkboxSelected]}>
                {bill.selected && <Check size={14} color={colors.background} />}
              </View>
              <Image 
                source={{ uri: bill.logo }} 
                style={styles.billLogo}
                resizeMode="contain"
              />
              <View style={styles.billInfo}>
                <Text style={styles.billVendor}>{bill.vendor}</Text>
                <Text style={styles.billMeta}>{bill.frequency} · {bill.category}</Text>
              </View>
            </View>
            <Text style={styles.billAmount}>{formatCurrency(bill.amount)}</Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity style={styles.addManuallyButton} onPress={handleAddManually}>
          <Plus size={20} color={colors.primary} />
          <Text style={styles.addManuallyText}>Lägg till manuellt</Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.continueButton, selectedCount === 0 && styles.continueButtonDisabled]}
          onPress={handleContinue}
          disabled={selectedCount === 0}
        >
          <Text style={styles.continueButtonText}>
            Fortsätt med {selectedCount} betalningar
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
  },
  headerIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(168, 213, 186, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  title: {
    fontSize: typography.fontSize.xxl,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: typography.fontSize.base,
    color: colors.graySubtle,
    textAlign: 'center',
  },
  selectAllContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
  },
  selectAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.grayLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  selectAllText: {
    fontSize: typography.fontSize.base,
    fontWeight: '600',
    color: colors.primary,
  },
  selectedCount: {
    fontSize: typography.fontSize.sm,
    color: colors.graySubtle,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
  },
  billCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.glass,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  billCardSelected: {
    borderColor: colors.mint,
    backgroundColor: 'rgba(168, 213, 186, 0.1)',
  },
  billLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
  },
  billLogo: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: colors.background,
  },
  billInfo: {
    flex: 1,
  },
  billVendor: {
    fontSize: typography.fontSize.base,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 2,
  },
  billMeta: {
    fontSize: typography.fontSize.sm,
    color: colors.graySubtle,
  },
  billAmount: {
    fontSize: typography.fontSize.lg,
    fontWeight: '600',
    color: colors.primary,
  },
  addManuallyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.lg,
    marginTop: spacing.sm,
  },
  addManuallyText: {
    fontSize: typography.fontSize.base,
    fontWeight: '600',
    color: colors.primary,
  },
  footer: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.glassBorder,
  },
  continueButton: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    ...shadows.soft,
  },
  continueButtonDisabled: {
    opacity: 0.5,
  },
  continueButtonText: {
    color: colors.background,
    fontSize: typography.fontSize.lg,
    fontWeight: '600',
  },
});

export default ClarityListScreen;
