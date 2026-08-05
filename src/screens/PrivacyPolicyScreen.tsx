import React, { useRef } from 'react';
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
import { useNavigation } from '@react-navigation/native';
import { ChevronLeft, Shield, Lock, Eye, FileText, UserCheck, Trash2 } from 'lucide-react-native';
import { colors, spacing, typography, shadows } from '../theme';

interface PolicySectionProps {
  icon: React.ReactNode;
  title: string;
  content: string;
}

const PolicySection: React.FC<PolicySectionProps> = ({ icon, title, content }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  return (
    <Animated.View style={[styles.sectionCard, { transform: [{ scale: scaleAnim }] }]}>
      <View style={styles.sectionHeader}>
        <View style={styles.iconContainer}>
          {icon}
        </View>
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      <Text style={styles.sectionContent}>{content}</Text>
    </Animated.View>
  );
};

export const PrivacyPolicyScreen: React.FC = () => {
  const navigation = useNavigation();

  const handleRequestData = () => {
    Alert.alert('Data Request', 'Din dataförfrågan har skickats. Vi återkommer inom 48 timmar.');
  };

  const handleUpdateDetails = () => {
    Alert.alert('Uppdatera detaljer', 'Denna funktion kommer snart!');
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Radera konto',
      'Är du säker på att du vill radera ditt konto? Detta kan inte ångras.',
      [
        { text: 'Avbryt', style: 'cancel' },
        { text: 'Radera', style: 'destructive', onPress: () => Alert.alert('Konto raderat', 'Ditt konto har tagits bort.') },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()} activeOpacity={0.7}>
          <ChevronLeft size={24} color={colors.primary} strokeWidth={2} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy & Security</Text>
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
            <Shield size={32} color={colors.mintDark} strokeWidth={1.5} />
          </View>
          <Text style={styles.heroTitle}>Our Commitment to Your Privacy</Text>
          <Text style={styles.heroSubtitle}>
            At Vue, we believe that financial clarity starts with trust. Your data is handled with the highest level of integrity and security.
          </Text>
        </View>

        {/* Protection Section */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>HOW WE PROTECT YOUR DATA</Text>
          
          <PolicySection
            icon={<Lock size={20} color={colors.ocean} strokeWidth={2} />}
            title="End-to-End Encryption"
            content="All financial transactions and personal data are encrypted using bank-grade security standards."
          />

          <PolicySection
            icon={<Eye size={20} color={colors.ocean} strokeWidth={2} />}
            title="No Human Intervention"
            content="Our system is built for autonomy. No one at Vue 'looks in' on your private transactions unless you explicitly request support."
          />

          <PolicySection
            icon={<Shield size={20} color={colors.ocean} strokeWidth={2} />}
            title="Strict Access Control"
            content="We use multi-factor authentication and rigorous security protocols to ensure that your financial flow remains yours alone."
          />
        </View>

        {/* Data Collection Section */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>DATA WE COLLECT (AND WHY)</Text>
          
          <PolicySection
            icon={<UserCheck size={20} color={colors.mint} strokeWidth={2} />}
            title="Identity Information"
            content="To comply with financial regulations and ensure that only you can authorize your payments."
          />

          <PolicySection
            icon={<FileText size={20} color={colors.mint} strokeWidth={2} />}
            title="Transaction Data"
            content="To provide the automation that makes your life lighter, knowing when and where to send your payments."
          />

          <PolicySection
            icon={<Eye size={20} color={colors.mint} strokeWidth={2} />}
            title="Usage Data"
            content="To continuously improve the 'Clarity' of our app interface and your experience."
          />
        </View>

        {/* Your Rights Section */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>YOUR RIGHTS</Text>
          
          <View style={styles.rightsCard}>
            <Text style={styles.rightsTitle}>Full Control Over Your Data</Text>
            <Text style={styles.rightsContent}>
              In line with our value of Transparency, you have complete control over your data.
            </Text>
            
            <View style={styles.rightsActions}>
              <TouchableOpacity style={styles.rightAction} activeOpacity={0.7} onPress={handleRequestData}>
                <FileText size={18} color={colors.ocean} strokeWidth={2} />
                <Text style={styles.rightActionText}>Begär datakopia</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.rightAction} activeOpacity={0.7} onPress={handleUpdateDetails}>
                <UserCheck size={18} color={colors.ocean} strokeWidth={2} />
                <Text style={styles.rightActionText}>Uppdatera detaljer</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={[styles.rightAction, styles.deleteAction]} activeOpacity={0.7} onPress={handleDeleteAccount}>
                <Trash2 size={18} color={colors.coral} strokeWidth={2} />
                <Text style={[styles.rightActionText, styles.deleteText]}>Radera konto</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Last updated: February 2026</Text>
          <Text style={styles.footerSubtext}>Vue v1.0.0</Text>
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
    paddingVertical: spacing.xxl,
  },
  heroIcon: {
    width: 72,
    height: 72,
    borderRadius: 24,
    backgroundColor: colors.mintLight,
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
  section: {
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
  sectionCard: {
    backgroundColor: colors.glass,
    borderRadius: 20,
    padding: spacing.lg,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  sectionTitle: {
    fontSize: typography.fontSize.base,
    fontWeight: '600',
    color: colors.primary,
    flex: 1,
  },
  sectionContent: {
    fontSize: typography.fontSize.sm,
    color: colors.graySubtle,
    lineHeight: 22,
    marginLeft: 52,
  },
  rightsCard: {
    backgroundColor: colors.oceanLight,
    borderRadius: 24,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.ocean,
  },
  rightsTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: spacing.sm,
  },
  rightsContent: {
    fontSize: typography.fontSize.sm,
    color: colors.grayMedium,
    lineHeight: 22,
    marginBottom: spacing.lg,
  },
  rightsActions: {
    gap: spacing.sm,
  },
  rightAction: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 14,
    padding: spacing.md,
  },
  rightActionText: {
    fontSize: typography.fontSize.sm,
    fontWeight: '500',
    color: colors.ocean,
    marginLeft: spacing.sm,
  },
  deleteAction: {
    backgroundColor: colors.roseLight,
  },
  deleteText: {
    color: colors.coral,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  footerText: {
    fontSize: typography.fontSize.sm,
    color: colors.graySubtle,
  },
  footerSubtext: {
    fontSize: typography.fontSize.xs,
    color: colors.grayLight,
    marginTop: spacing.xs,
  },
});

export default PrivacyPolicyScreen;
