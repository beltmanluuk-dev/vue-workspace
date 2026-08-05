import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Switch,
  ScrollView,
  Alert,
} from 'react-native';
import { ArrowLeft, Calendar, Zap, Tv, Shield, Home, MoreHorizontal, AlertCircle } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { useStore } from '../store';
import { colors, spacing, typography, shadows } from '../theme';
import { Bill } from '../types';
import { formatDate, formatCurrency, parseDate } from '../utils/helpers';

interface CategoryConfig {
  label: string;
  icon: React.ReactNode;
  keywords: string[];
}

const CATEGORY_CONFIG: Record<Bill['category'], CategoryConfig> = {
  utilities: {
    label: 'El / Vatten / Värme',
    icon: <Zap size={16} color={colors.background} />,
    keywords: ['telia', 'vattenfall', 'fortum', 'ellevio', 'svea', 'vatten', 'el', 'energi'],
  },
  subscription: {
    label: 'Prenumeration',
    icon: <Tv size={16} color={colors.background} />,
    keywords: ['netflix', 'spotify', 'hbo', 'viaplay', 'disney', 'apple', 'tidal', 'youtube', 'premiär'],
  },
  insurance: {
    label: 'Försäkring',
    icon: <Shield size={16} color={colors.background} />,
    keywords: ['försäkring', 'trygg', 'if', 'folksam', 'länsförsäkringar', 'moderna', 'swedbank försäkring'],
  },
  rent: {
    label: 'Hyra / Lån',
    icon: <Home size={16} color={colors.background} />,
    keywords: ['hyra', 'lån', 'bostad', 'hsb', 'svensk bostadsfond', 'landlord', 'ränta'],
  },
  other: {
    label: 'Övrigt',
    icon: <MoreHorizontal size={16} color={colors.background} />,
    keywords: [],
  },
};

const CATEGORIES: Bill['category'][] = ['utilities', 'subscription', 'insurance', 'rent', 'other'];

const suggestCategory = (vendorName: string): Bill['category'] => {
  const lower = vendorName.toLowerCase();
  for (const cat of CATEGORIES) {
    if (cat === 'other') continue;
    if (CATEGORY_CONFIG[cat].keywords.some((kw) => lower.includes(kw))) {
      return cat;
    }
  }
  return 'other';
};

const today = new Date();

export const AddBillScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { addBill } = useStore();

  const [vendor, setVendor] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDateText, setDueDateText] = useState(formatDate(today));
  const [category, setCategory] = useState<Bill['category']>('other');
  const [isAutoPay, setIsAutoPay] = useState(false);
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [categoryManuallySet, setCategoryManuallySet] = useState(false);

  useEffect(() => {
    if (!categoryManuallySet && vendor.trim().length > 2) {
      const suggested = suggestCategory(vendor);
      if (suggested !== category) {
        setCategory(suggested);
      }
    }
  }, [vendor, categoryManuallySet, category]);

  const numericAmount = parseFloat(amount.replace(',', '.'));
  const parsedDueDate = parseDate(dueDateText);
  const isAmountValid = !Number.isNaN(numericAmount) && numericAmount > 0;
  const isDueDateValid = parsedDueDate !== null;
  const isFormValid = vendor.trim().length > 1 && isAmountValid && isDueDateValid;

  const handleVendorChange = (text: string) => {
    setVendor(text);
  };

  const handleAmountChange = (text: string) => {
    const sanitized = text
      .replace(/[^0-9,.]/g, '')
      .replace(/([,.]).*/g, '$1')
      .replace(',', '.');
    const parts = sanitized.split('.');
    if (parts.length === 2 && parts[1].length > 2) {
      setAmount(`${parts[0]}.${parts[1].slice(0, 2)}`);
    } else {
      setAmount(sanitized);
    }
  };

  const setQuickDate = (days: number) => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    setDueDateText(formatDate(d));
  };

  const handleCategorySelect = (cat: Bill['category']) => {
    setCategory(cat);
    setCategoryManuallySet(true);
  };

  const getLogoForVendor = (vendorName: string) => {
    const initial = vendorName.trim().charAt(0).toUpperCase() || 'V';
    return `https://via.placeholder.com/48/2563EB/FFFFFF?text=${encodeURIComponent(initial)}`;
  };

  const handleSave = () => {
    if (!isFormValid) {
      Alert.alert('Fel', 'Kontrollera att företag, belopp och förfallodatum är korrekta.');
      return;
    }

    setSubmitting(true);
    const newBill: Omit<Bill, 'id'> = {
      vendor: vendor.trim(),
      logo: getLogoForVendor(vendor),
      amount: numericAmount,
      dueDate: parsedDueDate as Date,
      status: 'pending',
      category,
      isAutoPay,
      description: description.trim() || undefined,
      isUrgent: false,
    };

    addBill(newBill);
    setSubmitting(false);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.title}>Ny faktura</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <Text style={styles.label}>Företag / Avsändare</Text>
          <TextInput
            style={styles.input}
            placeholder="T.ex. Telia"
            placeholderTextColor={colors.grayLight}
            value={vendor}
            onChangeText={handleVendorChange}
            autoFocus
          />

          <Text style={styles.label}>Belopp (kr)</Text>
          <TextInput
            style={[styles.input, amount.length > 0 && !isAmountValid && styles.inputError]}
            placeholder="0,00"
            placeholderTextColor={colors.grayLight}
            value={amount}
            onChangeText={handleAmountChange}
            keyboardType="decimal-pad"
          />

          <Text style={styles.label}>Förfallodatum</Text>
          <View style={[styles.dateInput, dueDateText.length > 0 && !isDueDateValid && styles.inputError]}>
            <Calendar size={18} color={colors.graySubtle} />
            <TextInput
              style={styles.dateTextInput}
              value={dueDateText}
              onChangeText={setDueDateText}
              placeholder="ÅÅÅÅ-MM-DD"
              placeholderTextColor={colors.grayLight}
            />
          </View>
          <View style={styles.quickDates}>
            {[
              { label: 'Idag', days: 0 },
              { label: '+7 dagar', days: 7 },
              { label: '+30 dagar', days: 30 },
            ].map((option) => (
              <TouchableOpacity
                key={option.label}
                style={styles.quickDateChip}
                onPress={() => setQuickDate(option.days)}
              >
                <Text style={styles.quickDateText}>{option.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
          {dueDateText.length > 0 && !isDueDateValid && (
            <View style={styles.hintRow}>
              <AlertCircle size={14} color={colors.systemRed} />
              <Text style={styles.hintError}>Ogiltigt datum. Använd formatet ÅÅÅÅ-MM-DD.</Text>
            </View>
          )}

          <Text style={styles.label}>Kategori</Text>
          <View style={styles.categories}>
            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[styles.categoryChip, category === cat && styles.categoryChipActive]}
                onPress={() => handleCategorySelect(cat)}
              >
                <View style={styles.categoryChipIcon}>
                  {CATEGORY_CONFIG[cat].icon}
                </View>
                <Text style={[styles.categoryText, category === cat && styles.categoryTextActive]}>
                  {CATEGORY_CONFIG[cat].label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.row}>
            <View>
              <Text style={styles.label}>Autogiro / Autobetalning</Text>
              <Text style={styles.subtitle}>Betala automatiskt vid förfallodatum</Text>
            </View>
            <Switch
              value={isAutoPay}
              onValueChange={setIsAutoPay}
              trackColor={{ false: '#E5E5EA', true: colors.systemGreen }}
              thumbColor={colors.background}
            />
          </View>

          <Text style={styles.label}>Beskrivning (valfritt)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="LÄgg till en notering..."
            placeholderTextColor={colors.grayLight}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={3}
          />
        </View>

        <TouchableOpacity
          style={[styles.saveButton, submitting && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={submitting}
        >
          <Text style={styles.saveButtonText}>
            {submitting ? 'Sparar...' : `Spara faktura ${isAmountValid ? formatCurrency(numericAmount) : ''}`}
          </Text>
        </TouchableOpacity>
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
  card: {
    backgroundColor: colors.card,
    borderRadius: 24,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    ...shadows.soft,
    marginBottom: spacing.xl,
  },
  label: {
    fontSize: typography.fontSize.sm,
    fontWeight: '600',
    color: colors.primary,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  input: {
    backgroundColor: colors.inputBackground,
    borderRadius: 14,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: typography.fontSize.base,
    color: colors.text || colors.primary,
    fontFamily: typography.fontFamily.regular,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  dateInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.inputBackground,
    borderRadius: 14,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  dateText: {
    fontSize: typography.fontSize.base,
    color: colors.primary,
    fontFamily: typography.fontFamily.regular,
  },
  dateTextInput: {
    flex: 1,
    fontSize: typography.fontSize.base,
    color: colors.text || colors.primary,
    fontFamily: typography.fontFamily.regular,
    paddingVertical: 0,
  },
  categories: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  categoryChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.inputBackground,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    marginBottom: 6,
  },
  categoryChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryText: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.graySubtle,
  },
  categoryTextActive: {
    color: colors.background,
    fontWeight: '700',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.lg,
  },
  subtitle: {
    fontSize: 12,
    color: colors.graySubtle,
    marginTop: 2,
  },
  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: 18,
    paddingVertical: 18,
    alignItems: 'center',
    ...shadows.soft,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: colors.background,
    fontSize: 17,
    fontWeight: '700',
  },
  inputError: {
    borderWidth: 1,
    borderColor: colors.systemRed,
  },
  quickDates: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  quickDateChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: colors.glass,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  quickDateText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.graySubtle,
  },
  hintRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 4,
  },
  hintError: {
    fontSize: 12,
    color: colors.systemRed,
  },
  categoryChipIcon: {
    marginRight: 6,
  },
});
