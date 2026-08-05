import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Modal,
} from 'react-native';
import { ArrowLeft, Users, Plus, Crown, User, Baby, Mail, Shield } from 'lucide-react-native';
import { useStore } from '../store';
import { FamilyMember, UserRole } from '../types';
import { colors, shadows } from '../theme';

interface FamilyScreenProps {
  onBack?: () => void;
}

const roleConfig: Record<UserRole, { icon: React.ReactNode; label: string; color: string }> = {
  owner: { icon: <Crown size={18} color={colors.ocean} />, label: 'Ägare', color: colors.ocean },
  parent: { icon: <Shield size={18} color={colors.mintDark} />, label: 'Förälder', color: colors.mintDark },
  junior: { icon: <Baby size={18} color={colors.rose} />, label: 'Junior', color: colors.rose },
  member: { icon: <User size={18} color={colors.graySubtle} />, label: 'Medlem', color: colors.graySubtle },
};

export const FamilyScreen: React.FC<FamilyScreenProps> = ({ onBack }) => {
  const family = useStore((state) => state.family);
  const user = useStore((state) => state.user);
  const addMember = useStore((state) => state.addFamilyMember);
  const removeMember = useStore((state) => state.removeFamilyMember);
  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('member');

  const isValidEmail = (text: string) => {
    if (!text.trim()) return true;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text.trim());
  };

  const handleAdd = () => {
    if (!name.trim()) return;
    if (!isValidEmail(email)) return;
    addMember({
      name: name.trim(),
      email: email.trim() || undefined,
      role,
      isActive: true,
      monthlyIncome: role !== 'junior' ? 0 : undefined,
      spendingLimit: role === 'junior' ? 500 : undefined,
    });
    setName('');
    setEmail('');
    setModalVisible(false);
  };

  const renderMember = ({ item }: { item: FamilyMember }) => {
    const cfg = roleConfig[item.role];
    return (
      <View style={styles.memberCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{item.name.charAt(0).toUpperCase()}</Text>
        </View>
        <View style={styles.memberInfo}>
          <Text style={styles.memberName}>{item.name}</Text>
          {item.email && (
            <View style={styles.emailRow}>
              <Mail size={12} color={colors.graySubtle} />
              <Text style={styles.memberEmail}>{item.email}</Text>
            </View>
          )}
          <View style={[styles.roleBadge, { backgroundColor: `${cfg.color}20` }]}>
            {cfg.icon}
            <Text style={[styles.roleText, { color: cfg.color }]}>{cfg.label}</Text>
          </View>
        </View>
        {item.id !== user.id && (
          <TouchableOpacity onPress={() => removeMember(item.id)} style={styles.removeButton}>
            <Text style={styles.removeText}>Ta bort</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <ArrowLeft size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Family Connect</Text>
        <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.addButton}>
          <Plus size={24} color={colors.background} />
        </TouchableOpacity>
      </View>

      <View style={styles.familyHeader}>
        <View style={styles.familyIcon}>
          <Users size={28} color={colors.ocean} />
        </View>
        <View>
          <Text style={styles.familyName}>{family?.name || 'Min familj'}</Text>
          <Text style={styles.familyMeta}>{family ? `${family.members.length} medlemmar` : 'Inga medlemmar än'}</Text>
        </View>
      </View>

      <FlatList
        data={family?.members || []}
        keyExtractor={(item) => item.id}
        renderItem={renderMember}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
      />

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Bjud in familjemedlem</Text>
            <TextInput style={styles.input} placeholder="Namn" value={name} onChangeText={setName} placeholderTextColor={colors.graySubtle} />
            <TextInput
              style={[styles.input, email && !isValidEmail(email) && styles.inputError]}
              placeholder="E-post"
              value={email}
              onChangeText={setEmail}
              placeholderTextColor={colors.graySubtle}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {email && !isValidEmail(email) && (
              <Text style={styles.errorText}>Ange en giltig e-postadress</Text>
            )}
            <View style={styles.roleRow}>
              {(['parent', 'junior', 'member'] as UserRole[]).map((r) => (
                <TouchableOpacity
                  key={r}
                  onPress={() => setRole(r)}
                  style={[styles.roleChip, role === r && styles.roleChipActive]}
                >
                  <View style={styles.roleChipIcon}>{roleConfig[r].icon}</View>
                  <Text style={[styles.roleChipText, role === r && styles.roleChipTextActive]}>
                    {roleConfig[r].label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity onPress={handleAdd} style={[styles.saveButton, (!name.trim() || !isValidEmail(email)) && styles.saveButtonDisabled]}>
              <Text style={styles.saveText}>Lägg till</Text>
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
  familyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 16,
    backgroundColor: colors.card,
    borderRadius: 18,
    ...shadows.soft,
  },
  familyIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: colors.inputBackground,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  familyName: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
  },
  familyMeta: {
    fontSize: 13,
    color: colors.graySubtle,
    marginTop: 2,
  },
  list: {
    padding: 20,
    paddingBottom: 40,
  },
  memberCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    ...shadows.soft,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.oceanLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.oceanDark,
  },
  memberInfo: { flex: 1 },
  memberName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
  },
  emailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  memberEmail: {
    fontSize: 13,
    color: colors.graySubtle,
    marginLeft: 4,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginTop: 6,
  },
  roleText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  removeButton: {
    padding: 8,
  },
  removeText: {
    fontSize: 13,
    color: colors.coral,
    fontWeight: '600',
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
  input: {
    backgroundColor: colors.inputBackground,
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: colors.primary,
    marginBottom: 12,
  },
  inputError: {
    borderWidth: 1,
    borderColor: colors.coral,
  },
  errorText: {
    fontSize: 13,
    color: colors.coral,
    marginBottom: 12,
  },
  roleRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  roleChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: colors.inputBackground,
    marginRight: 8,
  },
  roleChipActive: {
    backgroundColor: colors.primary,
  },
  roleChipIcon: {
    marginRight: 6,
  },
  roleChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.graySubtle,
  },
  roleChipTextActive: {
    color: colors.background,
  },
  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  saveButtonDisabled: {
    backgroundColor: colors.grayLight,
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
