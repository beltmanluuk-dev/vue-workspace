import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Animated,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Camera, Check, Edit3, Building2, Calendar, CreditCard } from 'lucide-react-native';
import { colors, spacing, typography, shadows } from '../theme';

export const BillScanResultScreen: React.FC = () => {
  const navigation = useNavigation();
  const [isScanning, setIsScanning] = useState(true);
  const [billData, setBillData] = useState({
    vendor: 'Stockholms Stad',
    amount: '1 450',
    dueDate: '2026-03-15',
    reference: 'OCR 4502891234',
  });
  const scanAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isScanning) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(scanAnim, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(scanAnim, {
            toValue: 0,
            duration: 1500,
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Simulate scan completion
      setTimeout(() => {
        setIsScanning(false);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }).start();
      }, 3000);
    }
  }, [isScanning]);

  const handleConfirm = () => {
    Alert.alert(
      'Faktura tillagd!',
      `${billData.vendor} - ${billData.amount} kr har lagts till i dina betalningar.`,
      [{ text: 'OK', onPress: () => navigation.goBack() }]
    );
  };

  const handleRescan = () => {
    setIsScanning(true);
    fadeAnim.setValue(0);
  };

  const scanLineY = scanAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 200],
  });

  if (isScanning) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.scannerContainer}>
          <View style={styles.cameraFrame}>
            <View style={styles.cornerTL} />
            <View style={styles.cornerTR} />
            <View style={styles.cornerBL} />
            <View style={styles.cornerBR} />
            
            <Animated.View 
              style={[
                styles.scanLine,
                { transform: [{ translateY: scanLineY }] }
              ]} 
            />
            
            <Camera size={48} color={colors.glass} style={styles.cameraIcon} />
          </View>
          
          <Text style={styles.scanTitle}>Skanna din faktura</Text>
          <Text style={styles.scanSubtitle}>
            Rikta kameran mot fakturan så läser AI:n av informationen automatiskt
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <View style={styles.header}>
          <View style={styles.successIcon}>
            <Check size={32} color={colors.mint} />
          </View>
          <Text style={styles.title}>AI har läst av fakturan</Text>
          <Text style={styles.subtitle}>Kontrollera att uppgifterna stämmer</Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.formField}>
            <View style={styles.fieldHeader}>
              <Building2 size={18} color={colors.graySubtle} />
              <Text style={styles.fieldLabel}>Mottagare</Text>
            </View>
            <TextInput
              style={styles.fieldInput}
              value={billData.vendor}
              onChangeText={(text) => setBillData(prev => ({ ...prev, vendor: text }))}
            />
          </View>

          <View style={styles.formField}>
            <View style={styles.fieldHeader}>
              <CreditCard size={18} color={colors.graySubtle} />
              <Text style={styles.fieldLabel}>Belopp</Text>
            </View>
            <View style={styles.amountContainer}>
              <TextInput
                style={styles.fieldInput}
                value={billData.amount}
                onChangeText={(text) => setBillData(prev => ({ ...prev, amount: text }))}
                keyboardType="numeric"
              />
              <Text style={styles.currency}>kr</Text>
            </View>
          </View>

          <View style={styles.formField}>
            <View style={styles.fieldHeader}>
              <Calendar size={18} color={colors.graySubtle} />
              <Text style={styles.fieldLabel}>Förfallodatum</Text>
            </View>
            <TextInput
              style={styles.fieldInput}
              value={billData.dueDate}
              onChangeText={(text) => setBillData(prev => ({ ...prev, dueDate: text }))}
            />
          </View>

          <View style={styles.formField}>
            <View style={styles.fieldHeader}>
              <Edit3 size={18} color={colors.graySubtle} />
              <Text style={styles.fieldLabel}>OCR/Referens</Text>
            </View>
            <TextInput
              style={styles.fieldInput}
              value={billData.reference}
              onChangeText={(text) => setBillData(prev => ({ ...prev, reference: text }))}
            />
          </View>
        </View>

        <TouchableOpacity style={styles.rescanButton} onPress={handleRescan}>
          <Camera size={20} color={colors.primary} />
          <Text style={styles.rescanText}>Skanna igen</Text>
        </TouchableOpacity>
      </Animated.View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
          <Text style={styles.confirmButtonText}>Stämmer, lägg till faktura</Text>
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
  scannerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  cameraFrame: {
    width: 280,
    height: 200,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    marginBottom: spacing.xxl,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cornerTL: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 40,
    height: 40,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderColor: colors.mint,
    borderTopLeftRadius: 16,
  },
  cornerTR: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 40,
    height: 40,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderColor: colors.mint,
    borderTopRightRadius: 16,
  },
  cornerBL: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 40,
    height: 40,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderColor: colors.mint,
    borderBottomLeftRadius: 16,
  },
  cornerBR: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 40,
    height: 40,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderColor: colors.mint,
    borderBottomRightRadius: 16,
  },
  scanLine: {
    position: 'absolute',
    left: 20,
    right: 20,
    height: 2,
    backgroundColor: colors.mint,
  },
  cameraIcon: {
    opacity: 0.5,
  },
  scanTitle: {
    fontSize: typography.fontSize.xxl,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: spacing.sm,
  },
  scanSubtitle: {
    fontSize: typography.fontSize.base,
    color: colors.graySubtle,
    textAlign: 'center',
    lineHeight: 22,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.xl,
  },
  header: {
    alignItems: 'center',
    paddingTop: spacing.xl,
    paddingBottom: spacing.xl,
  },
  successIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
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
  },
  formContainer: {
    gap: spacing.md,
  },
  formField: {
    backgroundColor: colors.glass,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    padding: spacing.md,
  },
  fieldHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  fieldLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.graySubtle,
  },
  fieldInput: {
    fontSize: typography.fontSize.lg,
    fontWeight: '600',
    color: colors.primary,
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currency: {
    fontSize: typography.fontSize.lg,
    fontWeight: '600',
    color: colors.primary,
    marginLeft: spacing.xs,
  },
  rescanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.lg,
    marginTop: spacing.md,
  },
  rescanText: {
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
  confirmButton: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    ...shadows.soft,
  },
  confirmButtonText: {
    color: colors.background,
    fontSize: typography.fontSize.lg,
    fontWeight: '600',
  },
});

export default BillScanResultScreen;
