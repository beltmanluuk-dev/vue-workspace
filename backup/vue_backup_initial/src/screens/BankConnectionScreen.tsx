import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, CommonActions } from '@react-navigation/native';
import { ChevronLeft, Link, Shield, CheckCircle, ChevronRight } from 'lucide-react-native';
import { colors, spacing, typography, shadows } from '../theme';
import { useStore } from '../store';

interface Bank {
  id: string;
  name: string;
  logo: string;
  color: string;
}

const banks: Bank[] = [
  { id: 'nordea', name: 'Nordea', logo: '🏦', color: '#0000A0' },
  { id: 'seb', name: 'SEB', logo: '🏦', color: '#60CD18' },
  { id: 'swedbank', name: 'Swedbank', logo: '🏦', color: '#FF6600' },
  { id: 'handelsbanken', name: 'Handelsbanken', logo: '🏦', color: '#005FA0' },
  { id: 'lansforsakringar', name: 'Länsförsäkringar', logo: '🏦', color: '#E30613' },
  { id: 'skandia', name: 'Skandiabanken', logo: '🏦', color: '#00A0D6' },
  { id: 'ica', name: 'ICA Banken', logo: '🏦', color: '#E3000B' },
  { id: 'avanza', name: 'Avanza', logo: '🏦', color: '#00C281' },
];

interface BankRowProps {
  bank: Bank;
  onPress: () => void;
}

const BankRow: React.FC<BankRowProps> = ({ bank, onPress }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.98,
      useNativeDriver: true,
      tension: 200,
      friction: 8,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 200,
      friction: 8,
    }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        style={styles.bankRow}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
      >
        <View style={[styles.bankIcon, { backgroundColor: bank.color + '15' }]}>
          <Text style={styles.bankEmoji}>{bank.logo}</Text>
        </View>
        <Text style={styles.bankName}>{bank.name}</Text>
        <ChevronRight size={20} color={colors.grayLight} strokeWidth={2} />
      </TouchableOpacity>
    </Animated.View>
  );
};

export const BankConnectionScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { setBankConnected, setOnboardingComplete } = useStore();
  const [selectedBank, setSelectedBank] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  
  const isOnboarding = route.name === 'BankConnectionOnboarding';

  const handleBankSelect = (bankId: string) => {
    const bank = banks.find(b => b.id === bankId);
    setSelectedBank(bankId);
    setIsConnecting(true);
    
    // Simulate connection process
    setTimeout(() => {
      setIsConnecting(false);
      if (bank) {
        setBankConnected(bank.name);
        setOnboardingComplete();
      }
      
      Alert.alert(
        'Ansluten!',
        `${bank?.name} har kopplats till ditt Vue-konto.`,
        [{ 
          text: 'Fortsätt', 
          onPress: () => {
            if (isOnboarding) {
              navigation.navigate('VueScanConsent' as never);
            } else {
              navigation.goBack();
            }
          }
        }]
      );
    }, 2000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()} activeOpacity={0.7}>
          <ChevronLeft size={24} color={colors.primary} strokeWidth={2} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Koppla bank</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.heroIcon}>
            <Link size={32} color={colors.ocean} strokeWidth={1.5} />
          </View>
          <Text style={styles.heroTitle}>Anslut ditt konto</Text>
          <Text style={styles.heroSubtitle}>
            Välj din bank för att säkert koppla dina konton via Open Banking API.
          </Text>
        </View>

        {/* Security Badge */}
        <View style={styles.securitySection}>
          <View style={styles.securityBadge}>
            <Shield size={16} color={colors.mintDark} strokeWidth={2} />
            <Text style={styles.securityText}>Säkert via Tink • Banknivå kryptering</Text>
          </View>
        </View>

        {/* Banks List */}
        <View style={styles.banksSection}>
          <Text style={styles.sectionLabel}>VÄLJ DIN BANK</Text>
          <View style={styles.banksList}>
            {banks.map((bank) => (
              <BankRow
                key={bank.id}
                bank={bank}
                onPress={() => handleBankSelect(bank.id)}
              />
            ))}
          </View>
        </View>

        {/* Trust Indicators */}
        <View style={styles.trustSection}>
          <View style={styles.trustItem}>
            <CheckCircle size={16} color={colors.mintDark} strokeWidth={2} />
            <Text style={styles.trustText}>PSD2-kompatibel</Text>
          </View>
          <View style={styles.trustItem}>
            <CheckCircle size={16} color={colors.mintDark} strokeWidth={2} />
            <Text style={styles.trustText}>GDPR-skyddad</Text>
          </View>
          <View style={styles.trustItem}>
            <CheckCircle size={16} color={colors.mintDark} strokeWidth={2} />
            <Text style={styles.trustText}>Bankgaranti</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Vue använder Tink för säker bankanslutning. Vi lagrar aldrig dina bankuppgifter.
          </Text>
        </View>
      </ScrollView>

      {/* Connecting Overlay */}
      {isConnecting && (
        <View style={styles.connectingOverlay}>
          <View style={styles.connectingCard}>
            <View style={styles.spinner} />
            <Text style={styles.connectingText}>Ansluter till {selectedBank}...</Text>
            <Text style={styles.connectingSubtext}>Vänta medan vi verifierar din bank</Text>
          </View>
        </View>
      )}
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
    borderWidth: 1,
    borderColor: colors.glassBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: '600',
    color: colors.primary,
    letterSpacing: typography.letterSpacing.normal,
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
  heroSection: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  heroIcon: {
    width: 72,
    height: 72,
    borderRadius: 24,
    backgroundColor: colors.oceanLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  heroTitle: {
    fontSize: typography.fontSize.xxl,
    fontWeight: '700',
    color: colors.primary,
    textAlign: 'center',
    letterSpacing: typography.letterSpacing.tight,
    marginBottom: spacing.sm,
  },
  heroSubtitle: {
    fontSize: typography.fontSize.base,
    color: colors.graySubtle,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: spacing.md,
  },
  securitySection: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  securityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.mintLight,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 16,
    gap: spacing.xs,
  },
  securityText: {
    fontSize: typography.fontSize.sm,
    fontWeight: '500',
    color: colors.mintDark,
  },
  banksSection: {
    marginBottom: spacing.xl,
  },
  sectionLabel: {
    fontSize: typography.fontSize.xs,
    fontWeight: '600',
    color: colors.grayMedium,
    letterSpacing: typography.letterSpacing.widest,
    marginBottom: spacing.md,
    marginLeft: spacing.xs,
  },
  banksList: {
    backgroundColor: colors.glass,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    overflow: 'hidden',
  },
  bankRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.glassBorder,
  },
  bankIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  bankEmoji: {
    fontSize: 24,
  },
  bankName: {
    flex: 1,
    fontSize: typography.fontSize.base,
    fontWeight: '500',
    color: colors.primary,
  },
  trustSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  trustItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  trustText: {
    fontSize: typography.fontSize.sm,
    color: colors.graySubtle,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  footerText: {
    fontSize: typography.fontSize.xs,
    color: colors.grayLight,
    textAlign: 'center',
    lineHeight: 18,
  },
  connectingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  connectingCard: {
    backgroundColor: colors.background,
    borderRadius: 24,
    padding: spacing.xl,
    alignItems: 'center',
    width: '80%',
    maxWidth: 280,
  },
  spinner: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 3,
    borderColor: colors.oceanLight,
    borderTopColor: colors.ocean,
    marginBottom: spacing.lg,
  },
  connectingText: {
    fontSize: typography.fontSize.base,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  connectingSubtext: {
    fontSize: typography.fontSize.sm,
    color: colors.graySubtle,
  },
});

export default BankConnectionScreen;
