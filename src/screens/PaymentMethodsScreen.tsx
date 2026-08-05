import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  TextInput,
} from 'react-native';
import { ArrowLeft, CreditCard, Plus, Check, Apple, Building2, Repeat, Smartphone, Trash2, ShieldCheck } from 'lucide-react-native';
import { useStore } from '../store';
import { PaymentMethod } from '../types';
import { colors, shadows } from '../theme';

interface PaymentMethodsScreenProps {
  onBack?: () => void;
}

const typeConfig: Record<PaymentMethod['type'], { label: string; icon: React.ReactNode; color: string }> = {
  apple_pay: { label: 'Apple Pay', icon: <Apple size={20} color="#000" />, color: colors.text },
  card: { label: 'Kort', icon: <CreditCard size={20} color={colors.ocean} />, color: colors.ocean },
  bank: { label: 'Bankkonto', icon: <Building2 size={20} color={colors.mintDark} />, color: colors.mintDark },
  autogiro: { label: 'Autogiro', icon: <Repeat size={20} color={colors.rose} />, color: colors.rose },
  swish: { label: 'Swish', icon: <Smartphone size={20} color="#4F46E5" />, color: '#4F46E5' },
};

export const PaymentMethodsScreen: React.FC<PaymentMethodsScreenProps> = ({ onBack }) => {
  const paymentMethods = useStore((state) => state.paymentMethods);
  const setDefault = useStore((state) => state.setDefaultPaymentMethod);
  const addMethod = useStore((state) => state.addPaymentMethod);
  const removeMethod = useStore((state) => state.removePaymentMethod);
  const verifyMethod = useStore((state) => state.verifyPaymentMethod);
  const [modalVisible, setModalVisible] = useState(false);
  const [type, setType] = useState<PaymentMethod['type']>('bank');
  const [name, setName] = useState('');
  const [last4, setLast4] = useState('');

  const handleAdd = () => {
    if (!name.trim()) return;
    addMethod({
      type,
      name: name.trim(),
      last4: last4.trim() || undefined,
      isDefault: paymentMethods.length === 0,
      isVerified: false,
    });
    setName('');
    setLast4('');
    setModalVisible(false);
  };

  const handleVerify = (id: string) => {
    verifyMethod(id);
  };

  const handleRemove = (id: string) => {
    removeMethod(id);
  };

  const renderItem = ({ item }: { item: PaymentMethod }) => {
    const cfg = typeConfig[item.type];
    return (
      <View style={[styles.card, item.isDefault && styles.defaultCard]}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setDefault(item.id)}
          style={styles.cardMain}
        >
          <View style={[styles.iconContainer, { backgroundColor: `${cfg.color}20` }]}>{cfg.icon}</View>
          <View style={styles.info}>
            <Text style={styles.name}>{item.name || cfg.label}</Text>
            <Text style={styles.meta}>
              {item.isVerified ? 'Verifierad' : 'Ej verifierad'}
              {item.last4 ? ` • **** ${item.last4}` : ''}
            </Text>
          </View>
          {item.isDefault ? (
            <View style={styles.check}>
              <Check size={16} color={colors.background} />
            </View>
          ) : (
            <View style={styles.unchecked} />
          )}
        </TouchableOpacity>
        <View style={styles.cardActions}>
          {!item.isVerified && (
            <TouchableOpacity onPress={() => handleVerify(item.id)} style={[styles.actionButton, styles.verifyButton]}>
              <ShieldCheck size={18} color={colors.background} />
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={() => handleRemove(item.id)} style={[styles.actionButton, styles.deleteButton]}>
            <Trash2 size={18} color={colors.background} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <ArrowLeft size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Betalningsmetoder</Text>
        <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.addButton}>
          <Plus size={24} color={colors.background} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={paymentMethods}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
      />

      <View style={styles.autogiroBanner}>
        <Repeat size={20} color={colors.rose} />
        <Text style={styles.autogiroText}>Autogiro betalar räkningar automatiskt på förfallodagen.</Text>
      </View>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Lägg till betalmetod</Text>
            <View style={styles.typeRow}>
              {(['bank', 'card', 'autogiro', 'swish'] as PaymentMethod['type'][]).map((t) => (
                <TouchableOpacity key={t} onPress={() => setType(t)} style={[styles.typeChip, type === t && styles.typeChipActive]}>
                  <View style={styles.typeChipIcon}>{typeConfig[t].icon}</View>
                  <Text style={[styles.typeChipText, type === t && styles.typeChipTextActive]}>{typeConfig[t].label}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TextInput style={styles.input} placeholder="Namn / Bank" value={name} onChangeText={setName} placeholderTextColor={colors.graySubtle} />
            <TextInput
              style={styles.input}
              placeholder={type === 'swish' ? 'Telefonnummer' : 'Sista 4 siffror'}
              value={last4}
              onChangeText={setLast4}
              keyboardType="numeric"
              maxLength={type === 'swish' ? 12 : 4}
              placeholderTextColor={colors.graySubtle}
            />
            <TouchableOpacity onPress={handleAdd} style={styles.saveButton}>
              <Text style={styles.saveText}>Spara</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.cancelButton}>
              <Text style={styles.cancelText}>Avbryt</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {
    padding: 20,
    paddingBottom: 100,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    ...shadows.soft,
  },
  defaultCard: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
  cardMain: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
    gap: 8,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifyButton: {
    backgroundColor: colors.systemGreen,
  },
  deleteButton: {
    backgroundColor: colors.systemRed,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  info: { flex: 1 },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
  },
  meta: {
    fontSize: 13,
    color: colors.graySubtle,
    marginTop: 2,
  },
  check: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unchecked: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.grayLight,
  },
  autogiroBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(240, 165, 193, 0.12)',
    marginHorizontal: 20,
    padding: 14,
    borderRadius: 14,
    marginBottom: 20,
  },
  autogiroText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 13,
    color: colors.primary,
    lineHeight: 18,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: colors.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 16,
  },
  typeRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  typeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: colors.inputBackground,
    marginRight: 8,
  },
  typeChipActive: {
    backgroundColor: colors.primary,
  },
  typeChipIcon: {
    marginRight: 6,
  },
  typeChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.graySubtle,
  },
  typeChipTextActive: {
    color: colors.background,
  },
  input: {
    backgroundColor: colors.inputBackground,
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: colors.primary,
    marginBottom: 12,
  },
  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  saveText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: '700',
  },
  cancelButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  cancelText: {
    color: colors.graySubtle,
    fontSize: 16,
    fontWeight: '600',
  },
});
