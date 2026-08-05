import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  Animated,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  User,
  Bell,
  CreditCard,
  Shield,
  HelpCircle,
  ChevronRight,
  Zap,
  Moon,
  Globe,
  Sun,
  Link,
  Fingerprint,
} from 'lucide-react-native';
import { useStore } from '../store';
import { colors, shadows, spacing, typography } from '../theme';
import * as Haptics from 'expo-haptics';
import { RootStackParamList } from '../navigation';
import { BiometricPrompt } from '../components';

type SettingsNavigationProp = NativeStackNavigationProp<RootStackParamList, 'MainTabs'>;

interface SettingRowProps {
  icon: React.ReactNode;
  label: string;
  subtitle?: string;
  onPress?: () => void;
  rightElement?: React.ReactNode;
}

const SettingRow: React.FC<SettingRowProps> = ({
  icon,
  label,
  subtitle,
  onPress,
  rightElement,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    if (onPress) {
      Animated.spring(scaleAnim, {
        toValue: 0.98,
        useNativeDriver: true,
        tension: 200,
        friction: 8,
      }).start();
    }
  };

  const handlePressOut = () => {
    if (onPress) {
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 200,
        friction: 8,
      }).start();
    }
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        style={styles.settingRow}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.7}
        disabled={!onPress && !rightElement}
      >
    <View style={styles.settingLeft}>
      <View style={[styles.settingIcon, { backgroundColor: colors.surface }]}>{icon}</View>
      <View>
        <Text style={[styles.settingLabel, { color: colors.text }]}>{label}</Text>
        {subtitle && <Text style={[styles.settingSubtitle, { color: colors.textSecondary }]}>{subtitle}</Text>}
      </View>
    </View>
        {rightElement || (onPress && <ChevronRight size={20} color={colors.grayLight} />)}
      </TouchableOpacity>
    </Animated.View>
  );
};

export const SettingsScreen: React.FC = () => {
  const navigation = useNavigation<SettingsNavigationProp>();
  const { user, isAutoPilotEnabled, toggleAutoPilot } = useStore();
  const [showBiometric, setShowBiometric] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleDarkModeToggle = (value: boolean) => {
    Haptics.selectionAsync();
    setIsDarkMode(value);
    // Dark mode toggle is visual only for now
  };

  const handleSettingPress = (setting: string) => {
    switch (setting) {
      case 'privacy':
        navigation.navigate('PrivacyPolicy');
        break;
      case 'bank':
        navigation.navigate('BankConnection');
        break;
      case 'biometric':
        setShowBiometric(true);
        break;
      case 'personal':
        Alert.alert('Personlig information', 'Denna funktion kommer snart!');
        break;
      case 'payment':
        Alert.alert('Betalningsmetoder', 'Denna funktion kommer snart!');
        break;
      case 'notifications':
        Alert.alert('Notifikationer', 'Denna funktion kommer snart!');
        break;
      case 'language':
        Alert.alert('Språk', 'Svenska är valt');
        break;
      case 'help':
        navigation.navigate('HelpCenter');
        break;
      default:
        break;
    }
  };

  const handleBiometricAuth = () => {
    setShowBiometric(false);
    Alert.alert('Verifierat!', 'Biometrisk verifiering lyckades.');
  };

  return (
    <SafeAreaView style={[styles.container, styles.container]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={[styles.title, styles.title]}>Inställningar</Text>
        </View>

        <View style={[styles.profileCard, styles.profileCard]}>
          <View style={[styles.avatar, styles.avatar]}>
            <Text style={[styles.avatarText, styles.avatarText]}>{user?.firstName?.charAt(0) ?? 'U'}</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={[styles.profileName, styles.profileName]}>{user?.name ?? 'Användare'}</Text>
            <Text style={[styles.profileEmail, styles.profileEmail]}>{user?.email ?? ''}</Text>
          </View>
          <ChevronRight size={20} color={colors.grayLight} />
        </View>

        <View style={[styles.autoPilotCard, styles.autoPilotCard]}>
          <View style={styles.autoPilotHeader}>
            <View style={styles.autoPilotIconContainer}>
              <Zap size={24} color={colors.background} strokeWidth={2.5} />
            </View>
            <View style={styles.autoPilotInfo}>
              <Text style={[styles.autoPilotTitle, styles.autoPilotTitle]}>Auto-Pilot Mode</Text>
              <Text style={styles.autoPilotSubtitle}>
                Automatically pay bills before due dates
              </Text>
            </View>
          </View>
          <Switch
            value={isAutoPilotEnabled}
            onValueChange={toggleAutoPilot}
            trackColor={{ false: '#E5E5EA', true: colors.systemGreen }}
            thumbColor={colors.background}
          />
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionLabel, styles.sectionLabel]}>Konto</Text>
          <View style={[styles.sectionCard, styles.sectionCard]}>
            <SettingRow
              icon={<User size={20} color={colors.textSecondary} />}
              label="Personlig information"
              onPress={() => handleSettingPress('personal')}
            />
            <View style={[styles.divider, styles.divider]} />
            <SettingRow
              icon={<CreditCard size={20} color={colors.textSecondary} />}
              label="Betalningsmetoder"
              subtitle="Apple Pay, •••• 4242"
              onPress={() => handleSettingPress('payment')}
            />
            <View style={[styles.divider, styles.divider]} />
            <SettingRow
              icon={<Link size={20} color={colors.textSecondary} />}
              label="Kopplade bankkonton"
              subtitle="Nordea, SEB"
              onPress={() => handleSettingPress('bank')}
            />
            <View style={[styles.divider, styles.divider]} />
            <SettingRow
              icon={<Bell size={20} color={colors.textSecondary} />}
              label="Notifikationer"
              onPress={() => handleSettingPress('notifications')}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionLabel, styles.sectionLabel]}>Inställningar</Text>
          <View style={[styles.sectionCard, styles.sectionCard]}>
            <SettingRow
              icon={<Globe size={20} color={colors.textSecondary} />}
              label="Språk"
              subtitle="Svenska"
              onPress={() => handleSettingPress('language')}
            />
            <View style={[styles.divider, styles.divider]} />
            <SettingRow
              icon={<Fingerprint size={20} color={colors.textSecondary} />}
              label="Biometrisk verifiering"
              subtitle="Face ID aktiv"
              onPress={() => handleSettingPress('biometric')}
            />
            <View style={[styles.divider, styles.divider]} />
            <SettingRow
              icon={isDarkMode ? <Sun size={20} color={colors.textSecondary} /> : <Moon size={20} color={colors.textSecondary} />}
              label="Mörkt läge"
              rightElement={
                <Switch
                  value={isDarkMode}
                  onValueChange={handleDarkModeToggle}
                  trackColor={{ false: '#E5E5EA', true: colors.systemGreen }}
                  thumbColor={colors.background}
                />
              }
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionLabel, styles.sectionLabel]}>Support</Text>
          <View style={[styles.sectionCard, styles.sectionCard]}>
            <SettingRow
              icon={<Shield size={20} color={colors.textSecondary} />}
              label="Sekretess & Säkerhet"
              onPress={() => handleSettingPress('privacy')}
            />
            <View style={[styles.divider, styles.divider]} />
            <SettingRow
              icon={<HelpCircle size={20} color={colors.textSecondary} />}
              label="Hjälpcenter"
              onPress={() => handleSettingPress('help')}
            />
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={[styles.version, styles.version]}>VUE v1.0.0</Text>
          <Text style={[styles.copyright, styles.copyright]}>Made with precision</Text>
        </View>
      </ScrollView>

      <BiometricPrompt
        visible={showBiometric}
        action="Verifiera din identitet"
        onAuthenticate={handleBiometricAuth}
        onCancel={() => setShowBiometric(false)}
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
    paddingTop: spacing.lg,
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: typography.fontSize.xxxl,
    fontWeight: '700',
    color: colors.primary,
    letterSpacing: typography.letterSpacing.tight,
    fontFamily: typography.fontFamily.bold,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.glass,
    borderRadius: 24,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    ...shadows.glass,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  avatarText: {
    fontSize: 22,
    fontWeight: '600',
    color: colors.background,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.primary,
  },
  profileEmail: {
    fontSize: 14,
    color: colors.graySubtle,
    marginTop: 2,
  },
  autoPilotCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.primary,
    borderRadius: 24,
    padding: spacing.xl,
    marginBottom: spacing.xxl,
    ...shadows.glass,
  },
  autoPilotHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  autoPilotIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  autoPilotInfo: {
    flex: 1,
  },
  autoPilotTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.background,
  },
  autoPilotSubtitle: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 2,
  },
  section: {
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.graySubtle,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
    marginLeft: 4,
  },
  sectionCard: {
    backgroundColor: colors.glass,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.lg,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.lg,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.primary,
  },
  settingSubtitle: {
    fontSize: 13,
    color: colors.graySubtle,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
    marginLeft: 66,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  version: {
    fontSize: 13,
    color: colors.graySubtle,
  },
  copyright: {
    fontSize: 12,
    color: colors.grayLight,
    marginTop: 4,
  },
});
