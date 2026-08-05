import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from 'react-native';
import {
  ArrowLeft,
  Calendar,
  CreditCard,
  FileText,
  Zap,
  CheckCircle,
  Clock,
  AlertCircle,
} from 'lucide-react-native';
import { PaymentSheet } from '../components';
import { Bill } from '../types';
import { colors, shadows } from '../theme';
import { formatCurrency, formatDate, getDaysUntilDue } from '../utils/helpers';

interface BillDetailScreenProps {
  bill: Bill;
  onBack: () => void;
  onPay: (billId: string) => void;
}

export const BillDetailScreen: React.FC<BillDetailScreenProps> = ({
  bill,
  onBack,
  onPay,
}) => {
  const [showPaymentSheet, setShowPaymentSheet] = useState(false);
  const daysUntil = getDaysUntilDue(bill.dueDate);

  const getStatusInfo = () => {
    switch (bill.status) {
      case 'paid':
        return {
          icon: <CheckCircle size={18} color={colors.systemGreen} />,
          label: 'Paid',
          color: colors.systemGreen,
          bg: 'rgba(52, 199, 89, 0.1)',
        };
      case 'scheduled':
        return {
          icon: <Clock size={18} color={colors.systemBlue} />,
          label: 'Scheduled',
          color: colors.systemBlue,
          bg: 'rgba(0, 122, 255, 0.1)',
        };
      case 'overdue':
        return {
          icon: <AlertCircle size={18} color={colors.systemRed} />,
          label: 'Overdue',
          color: colors.systemRed,
          bg: 'rgba(255, 59, 48, 0.1)',
        };
      default:
        return {
          icon: <Clock size={18} color={colors.graySubtle} />,
          label: 'Pending',
          color: colors.graySubtle,
          bg: 'rgba(142, 142, 147, 0.1)',
        };
    }
  };

  const statusInfo = getStatusInfo();

  const handleOpenPayment = () => {
    setShowPaymentSheet(true);
  };

  const handleCloseSheet = () => {
    setShowPaymentSheet(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <ArrowLeft size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Bill Details</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroSection}>
          <View style={styles.logoContainer}>
            <Image
              source={{ uri: bill.logo }}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.vendor}>{bill.vendor}</Text>
          <Text style={styles.description}>{bill.description}</Text>

          <View style={[styles.statusBadge, { backgroundColor: statusInfo.bg }]}>
            {statusInfo.icon}
            <Text style={[styles.statusText, { color: statusInfo.color }]}>
              {statusInfo.label}
            </Text>
          </View>
        </View>

        <View style={styles.amountCard}>
          <Text style={styles.amountLabel}>Amount Due</Text>
          <Text style={styles.amount}>{formatCurrency(bill.amount)}</Text>
          {bill.status !== 'paid' && (
            <View style={styles.dueInfo}>
              <Calendar size={16} color={colors.graySubtle} />
              <Text style={styles.dueText}>
                Due {formatDate(bill.dueDate)} • {daysUntil} days left
              </Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Invoice Details</Text>
          <View style={styles.detailsCard}>
            <View style={styles.detailRow}>
              <View style={styles.detailLeft}>
                <FileText size={20} color={colors.graySubtle} />
                <Text style={styles.detailLabel}>Invoice ID</Text>
              </View>
              <Text style={styles.detailValue}>INV-2026-{bill.id.padStart(4, '0')}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.detailRow}>
              <View style={styles.detailLeft}>
                <Calendar size={20} color={colors.graySubtle} />
                <Text style={styles.detailLabel}>Issue Date</Text>
              </View>
              <Text style={styles.detailValue}>
                {new Date(bill.dueDate.getTime() - 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.detailRow}>
              <View style={styles.detailLeft}>
                <CreditCard size={20} color={colors.graySubtle} />
                <Text style={styles.detailLabel}>Payment Method</Text>
              </View>
              <Text style={styles.detailValue}>
                {bill.isAutoPay ? 'Apple Pay (Auto)' : 'Manual'}
              </Text>
            </View>
          </View>
        </View>

        {bill.isAutoPay && (
          <View style={styles.autoPayBanner}>
            <View style={styles.autoPayIcon}>
              <Zap size={20} color={colors.systemBlue} strokeWidth={2.5} />
            </View>
            <View style={styles.autoPayInfo}>
              <Text style={styles.autoPayTitle}>Auto-Pay Enabled</Text>
              <Text style={styles.autoPaySubtitle}>
                This bill will be paid automatically before the due date
              </Text>
            </View>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>OCR Extracted Data</Text>
          <View style={styles.ocrCard}>
            <Text style={styles.ocrLabel}>Scanned from document</Text>
            <View style={styles.ocrFields}>
              <View style={styles.ocrField}>
                <Text style={styles.ocrFieldLabel}>Vendor</Text>
                <Text style={styles.ocrFieldValue}>{bill.vendor}</Text>
              </View>
              <View style={styles.ocrField}>
                <Text style={styles.ocrFieldLabel}>Amount</Text>
                <Text style={styles.ocrFieldValue}>{formatCurrency(bill.amount)}</Text>
              </View>
              <View style={styles.ocrField}>
                <Text style={styles.ocrFieldLabel}>Due Date</Text>
                <Text style={styles.ocrFieldValue}>
                  {bill.dueDate.toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </Text>
              </View>
            </View>
            <View style={styles.ocrConfidence}>
              <CheckCircle size={14} color={colors.systemGreen} />
              <Text style={styles.ocrConfidenceText}>98% confidence score</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {bill.status !== 'paid' && (
        <View style={styles.footer}>
          <TouchableOpacity style={styles.payButton} onPress={handleOpenPayment}>
            <Text style={styles.payButtonText}>Pay {formatCurrency(bill.amount)}</Text>
          </TouchableOpacity>
        </View>
      )}

      <PaymentSheet
        visible={showPaymentSheet}
        bill={bill}
        onClose={handleCloseSheet}
        onPay={onPay}
      />
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
    fontSize: 17,
    fontWeight: '600',
    color: colors.primary,
  },
  placeholder: {
    width: 44,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: 28,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    ...shadows.soft,
  },
  logo: {
    width: 48,
    height: 48,
    borderRadius: 12,
  },
  vendor: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
    letterSpacing: -0.5,
  },
  description: {
    fontSize: 15,
    color: colors.graySubtle,
    marginTop: 4,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    marginTop: 16,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  amountCard: {
    backgroundColor: colors.secondary,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    ...shadows.soft,
  },
  amountLabel: {
    fontSize: 14,
    color: colors.graySubtle,
    marginBottom: 8,
  },
  amount: {
    fontSize: 40,
    fontWeight: '700',
    color: colors.primary,
    letterSpacing: -1,
  },
  dueInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  dueText: {
    fontSize: 14,
    color: colors.graySubtle,
    marginLeft: 8,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 12,
  },
  detailsCard: {
    backgroundColor: colors.secondary,
    borderRadius: 16,
    padding: 4,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  detailLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 15,
    color: colors.graySubtle,
    marginLeft: 12,
  },
  detailValue: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.primary,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
    marginHorizontal: 16,
  },
  autoPayBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 122, 255, 0.08)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  autoPayIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  autoPayInfo: {
    flex: 1,
  },
  autoPayTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.systemBlue,
  },
  autoPaySubtitle: {
    fontSize: 13,
    color: colors.graySubtle,
    marginTop: 2,
  },
  ocrCard: {
    backgroundColor: colors.secondary,
    borderRadius: 16,
    padding: 20,
  },
  ocrLabel: {
    fontSize: 12,
    color: colors.graySubtle,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 16,
  },
  ocrFields: {
    gap: 12,
  },
  ocrField: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ocrFieldLabel: {
    fontSize: 14,
    color: colors.graySubtle,
  },
  ocrFieldValue: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.primary,
  },
  ocrConfidence: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.04)',
  },
  ocrConfidenceText: {
    fontSize: 13,
    color: colors.systemGreen,
    marginLeft: 6,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.background,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 34,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.04)',
  },
  payButton: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: 'center',
  },
  payButtonText: {
    color: colors.background,
    fontSize: 17,
    fontWeight: '600',
  },
});
