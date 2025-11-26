import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  ViewStyle,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { Card, AlertTypeBadge, Button } from '../components';
import { Alert } from '../types';
import { Colors, Spacing, Typography, BorderRadius, getStatusColor } from '../utils/theme';
import { formatRelativeTime, formatDate, formatTime } from '../utils/mockData';

type AlertFilterType = 'all' | 'unread' | 'critical' | 'warning' | 'info';

export const AlertsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { alerts, markAlertAsRead } = useApp();
  const [activeFilter, setActiveFilter] = useState<AlertFilterType>('all');
  const [expandedAlert, setExpandedAlert] = useState<string | null>(null);

  const filters: { key: AlertFilterType; label: string; count: number }[] = [
    { key: 'all', label: 'All', count: alerts.length },
    { key: 'unread', label: 'Unread', count: alerts.filter((a) => !a.isRead).length },
    { key: 'critical', label: 'Critical', count: alerts.filter((a) => a.type === 'critical' || a.type === 'shutdown').length },
    { key: 'warning', label: 'Warning', count: alerts.filter((a) => a.type === 'warning').length },
    { key: 'info', label: 'Info', count: alerts.filter((a) => a.type === 'info').length },
  ];

  const filteredAlerts = alerts.filter((alert) => {
    switch (activeFilter) {
      case 'unread':
        return !alert.isRead;
      case 'critical':
        return alert.type === 'critical' || alert.type === 'shutdown';
      case 'warning':
        return alert.type === 'warning';
      case 'info':
        return alert.type === 'info';
      default:
        return true;
    }
  });

  const getAlertIcon = (type: Alert['type']): keyof typeof Ionicons.glyphMap => {
    switch (type) {
      case 'critical':
        return 'alert-circle';
      case 'shutdown':
        return 'power';
      case 'warning':
        return 'warning';
      default:
        return 'information-circle';
    }
  };

  const getAlertColor = (type: Alert['type']): string => {
    switch (type) {
      case 'critical':
      case 'shutdown':
        return Colors.critical;
      case 'warning':
        return Colors.warning;
      default:
        return Colors.info;
    }
  };

  const AlertCard: React.FC<{ item: Alert }> = ({ item }) => {
    const isExpanded = expandedAlert === item.id;
    const alertColor = getAlertColor(item.type);

    return (
      <Card
        style={[
          styles.alertCard,
          !item.isRead && styles.alertCardUnread,
          !item.isRead && { borderLeftColor: alertColor },
        ]}
      >
        <TouchableOpacity
          onPress={() => {
            setExpandedAlert(isExpanded ? null : item.id);
            if (!item.isRead) {
              markAlertAsRead(item.id);
            }
          }}
          activeOpacity={0.7}
        >
          <View style={styles.alertHeader}>
            <View style={[styles.alertIconContainer, { backgroundColor: `${alertColor}20` }]}>
              <Ionicons name={getAlertIcon(item.type)} size={20} color={alertColor} />
            </View>
            <View style={styles.alertInfo}>
              <View style={styles.alertTitleRow}>
                <Text style={styles.alertTitle} numberOfLines={1}>
                  {item.title}
                </Text>
                {!item.isRead && <View style={styles.unreadDot} />}
              </View>
              <Text style={styles.alertEquipment}>{item.equipmentName}</Text>
              <View style={styles.alertMeta}>
                <AlertTypeBadge type={item.type} size="small" />
                <Text style={styles.alertTime}>{formatRelativeTime(item.timestamp)}</Text>
              </View>
            </View>
            <Ionicons
              name={isExpanded ? 'chevron-up' : 'chevron-down'}
              size={20}
              color={Colors.textSecondary}
            />
          </View>
        </TouchableOpacity>

        {isExpanded && (
          <View style={styles.expandedContent}>
            <View style={styles.divider} />
            
            {/* Message */}
            <View style={styles.messageSection}>
              <Text style={styles.sectionLabel}>Details</Text>
              <Text style={styles.messageText}>{item.message}</Text>
            </View>

            {/* Timestamp */}
            <View style={styles.timestampSection}>
              <Ionicons name="time" size={14} color={Colors.textSecondary} />
              <Text style={styles.timestampText}>
                {formatDate(item.timestamp)} at {formatTime(item.timestamp)}
              </Text>
            </View>

            {/* AI Recommendation */}
            {item.aiRecommendation && (
              <View style={styles.aiSection}>
                <View style={styles.aiHeader}>
                  <Ionicons name="bulb" size={16} color={Colors.accent} />
                  <Text style={styles.aiLabel}>AI Recommendation</Text>
                </View>
                <Text style={styles.aiText}>{item.aiRecommendation}</Text>
              </View>
            )}

            {/* Actions */}
            <View style={styles.actionsSection}>
              {item.requiresAction && (
                <Button
                  title="Create Service Request"
                  onPress={() => navigation.navigate('Services')}
                  icon="construct"
                  size="medium"
                  fullWidth
                />
              )}
              <View style={styles.secondaryActions}>
                <TouchableOpacity style={styles.secondaryBtn}>
                  <Ionicons name="eye" size={18} color={Colors.primary} />
                  <Text style={styles.secondaryBtnText}>View Equipment</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.secondaryBtn}>
                  <Ionicons name="share" size={18} color={Colors.primary} />
                  <Text style={styles.secondaryBtnText}>Share</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </Card>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Alerts</Text>
          <Text style={styles.subtitle}>
            {alerts.filter((a) => !a.isRead).length} unread notifications
          </Text>
        </View>
        <TouchableOpacity
          style={styles.markAllButton}
          onPress={() => alerts.forEach((a) => markAlertAsRead(a.id))}
        >
          <Ionicons name="checkmark-done" size={20} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Filters */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filtersContainer}
        contentContainerStyle={styles.filtersContent}
      >
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter.key}
            style={[
              styles.filterChip,
              activeFilter === filter.key && styles.filterChipActive,
            ]}
            onPress={() => setActiveFilter(filter.key)}
          >
            <Text
              style={[
                styles.filterText,
                activeFilter === filter.key && styles.filterTextActive,
              ]}
            >
              {filter.label}
            </Text>
            <View
              style={[
                styles.filterCountContainer,
                activeFilter === filter.key && styles.filterCountContainerActive,
              ]}
            >
              <Text
                style={[
                  styles.filterCount,
                  activeFilter === filter.key && styles.filterCountActive,
                ]}
              >
                {filter.count}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Stats Summary */}
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <View style={[styles.statDot, { backgroundColor: Colors.critical }]} />
          <Text style={styles.statText}>
            {alerts.filter((a) => a.type === 'critical' || a.type === 'shutdown').length} Critical
          </Text>
        </View>
        <View style={styles.statItem}>
          <View style={[styles.statDot, { backgroundColor: Colors.warning }]} />
          <Text style={styles.statText}>
            {alerts.filter((a) => a.type === 'warning').length} Warnings
          </Text>
        </View>
        <View style={styles.statItem}>
          <View style={[styles.statDot, { backgroundColor: Colors.info }]} />
          <Text style={styles.statText}>
            {alerts.filter((a) => a.type === 'info').length} Info
          </Text>
        </View>
      </View>

      {/* Alerts List */}
      <FlatList
        data={filteredAlerts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <AlertCard item={item} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <View style={styles.emptyIconContainer}>
              <Ionicons name="notifications-off" size={48} color={Colors.textTertiary} />
            </View>
            <Text style={styles.emptyTitle}>No alerts</Text>
            <Text style={styles.emptySubtitle}>
              {activeFilter === 'all'
                ? 'All systems running smoothly'
                : `No ${activeFilter} alerts at this time`}
            </Text>
          </View>
        }
      />

      {/* Emergency FAB */}
      <TouchableOpacity
        style={styles.emergencyFab}
        onPress={() => Linking.openURL('whatsapp://send?phone=2348089844699')}
        activeOpacity={0.8}
      >
        <Ionicons name="logo-whatsapp" size={24} color="#FFF" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  title: {
    ...Typography.h2,
    color: Colors.text,
  },
  subtitle: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  markAllButton: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filtersContainer: {
    maxHeight: 44,
    marginBottom: Spacing.sm,
  },
  filtersContent: {
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundSecondary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    marginRight: Spacing.sm,
    gap: Spacing.sm,
  },
  filterChipActive: {
    backgroundColor: Colors.primary,
  },
  filterText: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  filterTextActive: {
    color: Colors.text,
  },
  filterCountContainer: {
    backgroundColor: Colors.backgroundTertiary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  filterCountContainerActive: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  filterCount: {
    ...Typography.caption,
    color: Colors.textTertiary,
  },
  filterCountActive: {
    color: Colors.text,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.lg,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  statDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statText: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  listContent: {
    paddingHorizontal: Spacing.md,
    paddingBottom: 160,
  },
  alertCard: {
    marginBottom: Spacing.sm,
    backgroundColor: Colors.card,
    borderLeftWidth: 3,
    borderLeftColor: 'transparent',
  },
  alertCardUnread: {
    backgroundColor: Colors.cardElevated,
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  alertIconContainer: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  alertInfo: {
    flex: 1,
  },
  alertTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  alertTitle: {
    ...Typography.body,
    color: Colors.text,
    fontWeight: '600',
    flex: 1,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
  },
  alertEquipment: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginVertical: 2,
  },
  alertMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  alertTime: {
    ...Typography.caption,
    color: Colors.textTertiary,
  },
  expandedContent: {
    marginTop: Spacing.md,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginBottom: Spacing.md,
  },
  messageSection: {
    marginBottom: Spacing.md,
  },
  sectionLabel: {
    ...Typography.label,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  messageText: {
    ...Typography.body,
    color: Colors.text,
    lineHeight: 22,
  },
  timestampSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginBottom: Spacing.md,
  },
  timestampText: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  aiSection: {
    backgroundColor: `${Colors.accent}10`,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  aiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  aiLabel: {
    ...Typography.bodySmall,
    color: Colors.accent,
    fontWeight: '600',
  },
  aiText: {
    ...Typography.bodySmall,
    color: Colors.text,
    lineHeight: 20,
  },
  actionsSection: {
    gap: Spacing.md,
  },
  secondaryActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.xl,
  },
  secondaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  secondaryBtnText: {
    ...Typography.bodySmall,
    color: Colors.primary,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xxl * 2,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  emptyTitle: {
    ...Typography.h4,
    color: Colors.textSecondary,
  },
  emptySubtitle: {
    ...Typography.bodySmall,
    color: Colors.textTertiary,
    marginTop: Spacing.xs,
    textAlign: 'center',
  },
  emergencyFab: {
    position: 'absolute',
    bottom: 110, // Raised to sit above the absolute tab bar
    right: Spacing.md,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.critical,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.critical,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 999, // Ensure it's on top
  },
});
