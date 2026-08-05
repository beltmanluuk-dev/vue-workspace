import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import { ArrowLeft, User, Mail, Wallet, PiggyBank, Calendar, Bell, Fingerprint, Moon, Globe } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { useStore } from '../store';
import { colors, spacing, typography, shadows } from '../theme';

const LANGUAGES: { key: 'sv' | 'en'; label: string }[] = [
  { key: 'sv', label: 'Svenska' },
  { key: 'en', label: 'English' },
];

export const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { user, updateUserProfile } = useStore();

  const [name, setName] = useState(user.name || '');
  const [email, setEmail] = useState(user.email || '');
  const [income, setIncome] = useState(user.monthlyIncome ? String(user.monthlyIncome) : '');
  const [savingsGoal, setSavingsGoal] = useState(
    user.savingsGoalPercent ? String(user.savingsGoalPercent) : '20'
  );
  const [payday, setPayday] = useState(user.payday ? String(user.payday) : '25');
  const [language, setLanguage] = useState<'sv' | 'en'>(user.preferredLanguage || 'sv');
  const [notificationsEnabled, setNotificationsEnabled] = useState(user.notificationsEnabled ?? true);
  const [biometricEnabled, setBiometricEnabled] = useState(user.biometricEnabled ?? false);
  const [darkMode, setDarkMode] = useState(user.darkMode || 'system');

  const handleSave = () => {
    const incomeNum = parseFloat(income.replace(',', '.'));
    const savingsNum = parseInt(savingsGoal, 10);
    const paydayNum = parseInt(payday, 10);

    if (!name.trim() || !email.trim()) {
      Alert.alert('Fel', 'Namn och e-post måste fyllas i.');
      return;
    }

    updateUserProfile({
      name: name.trim(),
      email: email.trim(),
      monthlyIncome: Number.isNaN(incomeNum) ? undefined : incomeNum,
      savingsGoalPercent: Number.isNaN(savingsNum) ? undefined : savingsNum,
      payday: Number.isNaN(paydayNum) ? undefined : paydayNum,
      preferredLanguage: language,
      notificationsEnabled,
      biometricEnabled,
      darkMode,
    });

    Alert.alert('Sparat', 'Din profil har uppdaterats.');
  };

  const toggleDarkMode = (value: 'light' | 'dark' | 'system') => {
    setDarkMode(value);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.title}>Min profil</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <User size={48} color={colors.background} />
          </View>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.email}>{user.email}</Text>
        </View>

        <View style={styles.card}>
          <SectionTitle text="Personuppgifter" />
          <InputField
            icon={<User size={18} color={colors.graySubtle} />}
            label="Namn"
            value={name}
            onChangeText={setName}
            placeholder="Ditt namn"
          />
          <InputField
            icon={<Mail size={18} color={colors.graySubtle} />}
            label="E-post"
            value={email}
            onChangeText={setEmail}
            placeholder="namn@exempel.se"
            keyboardType="email-address"
          />

          <SectionTitle text="Ekonomi" />
          <InputField
            icon={<Wallet size={18} color={colors.graySubtle} />}
            label="Månadsinkomst (kr)"
            value={income}
            onChangeText={setIncome}
            placeholder="0"
            keyboardType="decimal-pad"
          />
          <InputField
            icon={<PiggyBank size={18} color={colors.graySubtle} />}
            label="Sparmål (%)"
            value={savingsGoal}
            onChangeText={setSavingsGoal}
            placeholder="20"
            keyboardType="number-pad"
          />
          <InputField
            icon={<Calendar size={18} color={colors.graySubtle} />}
            label="Löningsdag (dag i månaden)"
            value={payday}
            onChangeText={setPayday}
            placeholder="25"
            keyboardType="number-pad"
          />

          <SectionTitle text="Inställningar" />
          <ToggleRow
            icon={<Bell size={18} color={colors.graySubtle} />}
            label="Notifikationer"
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
          />
          <ToggleRow
            icon={<Fingerprint size={18} color={colors.graySubtle} />}
            label="Biometrisk inloggning"
            value={biometricEnabled}
            onValueChange={setBiometricEnabled}
          />

          <SectionTitle text="Språk" />
          <View style={styles.languageRow}>
            {LANGUAGES.map((lang) => (
              <TouchableOpacity
                key={lang.key}
                style={[styles.languageChip, language === lang.key && styles.languageChipActive]}
                onPress={() => setLanguage(lang.key)}
              >
                <Text style={[styles.languageText, language === lang.key && styles.languageTextActive]}>
                  {lang.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <SectionTitle text="Mörkt läge" />
          <View style={styles.darkModeRow}>
            {(['light', 'dark', 'system'] as const).map((mode) => (
              <TouchableOpacity
                key={mode}
                style={[styles.darkModeChip, darkMode === mode && styles.darkModeChipActive]}
                onPress={() => toggleDarkMode(mode)}
              >
                <Text style={[styles.darkModeText, darkMode === mode && styles.darkModeTextActive]}>
                  {mode === 'light' ? 'Ljust' : mode === 'dark' ? 'Mörkt' : 'System'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Spara profil</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const SectionTitle: React.FC<{ text: string }> = ({ text }) => (
  <Text style={styles.sectionTitle}>{text}</Text>
);

interface InputFieldProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  keyboardType?: 'default' | 'email-address' | 'decimal-pad' | 'number-pad';
}

const InputField: React.FC<InputFieldProps> = ({
  icon,
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = 'default',
}) => (
  <View style={styles.inputGroup}>
    <Text style={styles.label}>{label}</Text>
    <View style={styles.inputContainer}>
      <View style={styles.inputIcon}>{icon}</View>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.grayLight}
        keyboardType={keyboardType}
      />
    </View>
  </View>
);

interface ToggleRowProps {
  icon: React.ReactNode;
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}

const ToggleRow: React.FC<ToggleRowProps> = ({ icon, label, value, onValueChange }) => (
  <View style={styles.toggleRow}>
    <View style={styles.toggleLeft}>
      <View style={styles.toggleIcon}>{icon}</View>
      <Text style={styles.toggleLabel}>{label}</Text>
    </View>
    <Switch
      value={value}
      onValueChange={onValueChange}
      trackColor={{ false: '#E5E5EA', true: colors.systemGreen }}
      thumbColor={colors.background}
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: colors.glass,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: typography.fontSize.xxl,
    fontWeight: '700',
    color: colors.primary,
    fontFamily: typography.fontFamily.bold,
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
  avatarSection: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  name: {
    fontSize: typography.fontSize.xxl,
    fontWeight: '700',
    color: colors.primary,
    fontFamily: typography.fontFamily.bold,
  },
  email: {
    fontSize: typography.fontSize.base,
    color: colors.graySubtle,
    marginTop: 4,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 24,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    ...shadows.soft,
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: typography.fontSize.sm,
    fontWeight: '700',
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  inputGroup: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: typography.fontSize.sm,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.inputBackground,
    borderRadius: 14,
    paddingHorizontal: spacing.md,
  },
  inputIcon: {
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    paddingVertical: spacing.md,
    fontSize: typography.fontSize.base,
    color: colors.text || colors.primary,
    fontFamily: typography.fontFamily.regular,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.inputBackground,
    borderRadius: 14,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginBottom: spacing.md,
  },
  toggleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  toggleIcon: {
    marginRight: spacing.sm,
  },
  toggleLabel: {
    fontSize: typography.fontSize.base,
    color: colors.primary,
    fontFamily: typography.fontFamily.regular,
  },
  languageRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: spacing.md,
  },
  languageChip: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: colors.inputBackground,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  languageChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  languageText: {
    fontSize: typography.fontSize.base,
    fontWeight: '600',
    color: colors.graySubtle,
  },
  languageTextActive: {
    color: colors.background,
  },
  darkModeRow: {
    flexDirection: 'row',
    gap: 8,
  },
  darkModeChip: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: colors.inputBackground,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  darkModeChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  darkModeText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.graySubtle,
  },
  darkModeTextActive: {
    color: colors.background,
  },
  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: 18,
    paddingVertical: 18,
    alignItems: 'center',
    ...shadows.soft,
    marginBottom: spacing.xxxl,
  },
  saveButtonText: {
    color: colors.background,
    fontSize: 17,
    fontWeight: '700',
  },
});
