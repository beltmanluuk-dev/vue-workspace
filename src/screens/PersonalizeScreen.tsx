import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Calendar, Shield, Tag, ChevronRight, Edit3 } from 'lucide-react-native';
import { colors, spacing, typography, shadows } from '../theme';

interface PaymentSetting {
  id: string;
  vendor: string;
  paymentDate: number;
  safetyLimit: number;
  nickname: string;
}

const mockSettings: PaymentSetting[] = [
  { id: '1', vendor: 'Hyra - Bostadsbolaget', paymentDate: 27, safetyLimit: 10000, nickname: 'Hyran' },
  { id: '2', vendor: 'Vattenfall', paymentDate: 15, safetyLimit: 1500, nickname: 'El' },
  { id: '3', vendor: 'Telia', paymentDate: 20, safetyLimit: 600, nickname: 'Internet' },
  { id: '4', vendor: 'Netflix', paymentDate: 10, safetyLimit: 200, nickname: '' },
  { id: '5', vendor: 'Folksam', paymentDate: 1, safetyLimit: 2000, nickname: 'Hemförsäkring' },
];

export const PersonalizeScreen: React.FC = () => {
  const navigation = useNavigation();
  const [settings, setSettings] = useState(mockSettings);
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleContinue = () => {
    navigation.navigate('FinalHandshake' as never);
  };

  const updateSetting = (id: string, field: keyof PaymentSetting, value: any) => {
    setSettings(prev => prev.map(s => 
      s.id === id ? { ...s, [field]: value } : s
    ));
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Anpassa dina betalningar</Text>
        <Text style={styles.subtitle}>
          Ställ in säkerhetsgränser och betalningsdatum
        </Text>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {settings.map((setting) => (
          <View key={setting.id} style={styles.settingCard}>
            <Text style={styles.vendorName}>{setting.vendor}</Text>
            
            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <Calendar size={18} color={colors.graySubtle} />
                <Text style={styles.settingLabel}>Betalningsdag</Text>
              </View>
              <TouchableOpacity style={styles.settingValue} onPress={() => Alert.alert('Betalningsdag', `Betalning sker den ${setting.paymentDate}:e varje månad`)}>
                <Text style={styles.settingValueText}>Den {setting.paymentDate}:e</Text>
                <ChevronRight size={16} color={colors.grayLight} />
              </TouchableOpacity>
            </View>

            <View style={styles.divider} />

            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <Shield size={18} color={colors.graySubtle} />
                <Text style={styles.settingLabel}>Säkerhetsgräns</Text>
              </View>
              <TouchableOpacity style={styles.settingValue} onPress={() => Alert.alert('Säkerhetsgräns', `Betalningar över ${setting.safetyLimit.toLocaleString('sv-SE')} kr kräver godkännande`)}>
                <Text style={styles.settingValueText}>Max {setting.safetyLimit.toLocaleString('sv-SE')} kr</Text>
                <ChevronRight size={16} color={colors.grayLight} />
              </TouchableOpacity>
            </View>

            <View style={styles.divider} />

            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <Tag size={18} color={colors.graySubtle} />
                <Text style={styles.settingLabel}>Smeknamn</Text>
              </View>
              {editingId === setting.id ? (
                <TextInput
                  style={styles.nicknameInput}
                  value={setting.nickname}
                  onChangeText={(text) => updateSetting(setting.id, 'nickname', text)}
                  onBlur={() => setEditingId(null)}
                  placeholder="Lägg till..."
                  placeholderTextColor={colors.grayLight}
                  autoFocus
                />
              ) : (
                <TouchableOpacity 
                  style={styles.settingValue}
                  onPress={() => setEditingId(setting.id)}
                >
                  <Text style={[styles.settingValueText, !setting.nickname && styles.placeholderText]}>
                    {setting.nickname || 'Lägg till...'}
                  </Text>
                  <Edit3 size={16} color={colors.grayLight} />
                </TouchableOpacity>
              )}
            </View>
          </View>
        ))}

        <View style={styles.infoCard}>
          <Shield size={24} color={colors.mint} />
          <Text style={styles.infoText}>
            Säkerhetsgränser skyddar dig från oväntade höga betalningar. Vue kommer alltid fråga dig innan en betalning som överskrider gränsen.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
          <Text style={styles.continueButtonText}>Fortsätt</Text>
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
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
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
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
  },
  settingCard: {
    backgroundColor: colors.glass,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  vendorName: {
    fontSize: typography.fontSize.lg,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: spacing.md,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  settingLabel: {
    fontSize: typography.fontSize.base,
    color: colors.charcoal,
  },
  settingValue: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  settingValueText: {
    fontSize: typography.fontSize.base,
    color: colors.primary,
    fontWeight: '500',
  },
  placeholderText: {
    color: colors.grayLight,
  },
  nicknameInput: {
    fontSize: typography.fontSize.base,
    color: colors.primary,
    fontWeight: '500',
    minWidth: 100,
    textAlign: 'right',
  },
  divider: {
    height: 1,
    backgroundColor: colors.glassBorder,
    marginVertical: spacing.xs,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(168, 213, 186, 0.15)',
    borderRadius: 12,
    padding: spacing.md,
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  infoText: {
    flex: 1,
    fontSize: typography.fontSize.sm,
    color: colors.charcoal,
    lineHeight: 20,
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
  continueButtonText: {
    color: colors.background,
    fontSize: typography.fontSize.lg,
    fontWeight: '600',
  },
});

export default PersonalizeScreen;
