import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { ArrowLeft, Bell, AlertTriangle, TrendingUp, CreditCard, Users, AlertCircle, CheckCircle } from 'lucide-react-native';
import { useStore } from '../store';
import { Notification } from '../types';
import { colors, shadows } from '../theme';
import { formatCurrency, formatRelativeTime } from '../utils/helpers';

interface NotificationsScreenProps {
  onBack?: () => void;
}

export const NotificationsScreen: React.FC<NotificationsScreenProps> = ({ onBack }) => {
  const notifications = useStore((state) => state.notifications);
  const markRead = useStore((state) => state.markNotificationRead);
  const dismiss = useStore((state) => state.dismissNotification);

  const getIcon = (type: Notification['type'], priority: Notification['priority']) => {
    const color = priority === 'critical' ? colors.coral : priority === 'high' ? colors.ocean : colors.graySubtle;
    switch (type) {
      case 'price_increase': return <TrendingUp size={22} color={color} />;
      case 'overdue': return <AlertTriangle size={22} color={color} />;
      case 'due_soon': return <Bell size={22} color={color} />;
      case 'family': return <Users size={22} color={color} />;
      case 'budget_warning': return <AlertCircle size={22} color={color} />;
      case 'autopilot_action': return <CreditCard size={22} color={color} />;
      default: return <Bell size={22} color={color} />;
    }
  };

  const sorted = useMemo(() => {
    return [...notifications]
      .filter((n) => !n.isDismissed)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }, [notifications]);

  const unreadCount = sorted.filter((n) => !n.isRead).length;

  const renderItem = ({ item }: { item: Notification }) => (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => markRead(item.id)}
      style={[
        styles.card,
        !item.isRead && styles.unreadCard,
      ]}
    >
      <View style={styles.iconContainer}>{getIcon(item.type, item.priority)}</View>
      <View style={styles.content}>
        <View style={styles.row}>
          <Text style={[styles.title, !item.isRead && styles.unreadText]}>{item.title}</Text>
          {!item.isRead && <View style={styles.dot} />}
        </View>
        <Text style={styles.message}>{item.message}</Text>
        <View style={styles.metaRow}>
          <Text style={styles.time}>{formatRelativeTime(item.createdAt)}</Text>
          {item.amount !== undefined && (
            <Text style={styles.amount}>{formatCurrency(item.amount)}</Text>
          )}
        </View>
      </View>
      <TouchableOpacity
        onPress={() => dismiss(item.id)}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Text style={styles.dismiss}>✕</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <ArrowLeft size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifikationer</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{unreadCount}</Text>
        </View>
      </View>

      <FlatList
        data={sorted}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <CheckCircle size={48} color={colors.mintDark} />
            <Text style={styles.emptyTitle}>Allt är uppdaterat</Text>
            <Text style={styles.emptyText}>Du har inga nya notifikationer.</Text>
          </View>
        }
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
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
  },
  badge: {
    minWidth: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.coral,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#fff',
  },
  list: {
    padding: 20,
    paddingBottom: 40,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.card,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    ...shadows.soft,
  },
  unreadCard: {
    borderColor: colors.oceanLight,
    backgroundColor: colors.glass,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.inputBackground,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  content: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.primary,
    flex: 1,
  },
  unreadText: {
    fontWeight: '700',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.ocean,
    marginLeft: 8,
  },
  message: {
    fontSize: 13,
    color: colors.graySubtle,
    marginTop: 4,
    lineHeight: 18,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  time: {
    fontSize: 12,
    color: colors.grayLight,
  },
  amount: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
  },
  dismiss: {
    fontSize: 16,
    color: colors.graySubtle,
    marginLeft: 12,
    padding: 4,
  },
  empty: {
    alignItems: 'center',
    marginTop: 80,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
    marginTop: 16,
  },
  emptyText: {
    fontSize: 14,
    color: colors.graySubtle,
    marginTop: 8,
    textAlign: 'center',
  },
});
