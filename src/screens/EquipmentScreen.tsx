import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { Card, StatusBadge, MiniHealthRing, CompactSensorList } from '../components';
import { Equipment } from '../types';
import { Colors, Spacing, Typography, BorderRadius, getHealthColor, getStatusColor } from '../utils/theme';
import { formatDate } from '../utils/mockData';

type FilterType = 'all' | 'operational' | 'warning' | 'critical' | 'offline';

export const EquipmentScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { equipment } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [expandedEquipment, setExpandedEquipment] = useState<string | null>(null);

  const filters: { key: FilterType; label: string; count: number }[] = [
    { key: 'all', label: 'All', count: equipment.length },
    { key: 'operational', label: 'Operational', count: equipment.filter((e) => e.status === 'operational').length },
    { key: 'warning', label: 'Warning', count: equipment.filter((e) => e.status === 'warning').length },
    { key: 'critical', label: 'Critical', count: equipment.filter((e) => e.status === 'critical').length },
    { key: 'offline', label: 'Offline', count: equipment.filter((e) => e.status === 'offline').length },
  ];

  const filteredEquipment = equipment.filter((eq) => {
    const matchesSearch =
      eq.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      eq.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'all' || eq.status === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const getEquipmentIcon = (type: Equipment['type']): keyof typeof Ionicons.glyphMap => {
    switch (type) {
      case 'pump':
        return 'water';
      case 'compressor':
        return 'git-compare';
      case 'turbine':
        return 'sync';
      case 'valve':
        return 'git-branch';
      case 'sensor':
        return 'radio';
      case 'motor':
        return 'flash';
      case 'generator':
        return 'power';
      default:
        return 'hardware-chip';
    }
  };

  const EquipmentCard: React.FC<{ item: Equipment }> = ({ item }) => {
    const isExpanded = expandedEquipment === item.id;
    const healthColor = getHealthColor(item.healthScore);

    return (
      <Card style={styles.equipmentCard}>
        <TouchableOpacity
          onPress={() => setExpandedEquipment(isExpanded ? null : item.id)}
          activeOpacity={0.7}
        >
          <View style={styles.equipmentHeader}>
            <View style={[styles.equipmentIconContainer, { backgroundColor: `${healthColor}20` }]}>
              <Ionicons name={getEquipmentIcon(item.type)} size={24} color={healthColor} />
            </View>
            <View style={styles.equipmentInfo}>
              <Text style={styles.equipmentName}>{item.name}</Text>
              <Text style={styles.equipmentLocation}>{item.location}</Text>
              <View style={styles.equipmentMeta}>
                <StatusBadge status={item.status} size="small" />
                <Text style={styles.equipmentType}>
                  {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                </Text>
              </View>
            </View>
            <View style={styles.equipmentHealthContainer}>
              <MiniHealthRing score={item.healthScore} />
              <Ionicons
                name={isExpanded ? 'chevron-up' : 'chevron-down'}
                size={20}
                color={Colors.textSecondary}
                style={styles.expandIcon}
              />
            </View>
          </View>
        </TouchableOpacity>

        {isExpanded && (
          <View style={styles.expandedContent}>
            <View style={styles.divider} />

            {/* Metrics */}
            <View style={styles.metricsGrid}>
              <View style={styles.metricItem}>
                <Text style={styles.metricValue}>{item.metrics.uptime.toFixed(1)}%</Text>
                <Text style={styles.metricLabel}>Uptime</Text>
              </View>
              <View style={styles.metricItem}>
                <Text style={styles.metricValue}>{item.metrics.efficiency.toFixed(1)}%</Text>
                <Text style={styles.metricLabel}>Efficiency</Text>
              </View>
              <View style={styles.metricItem}>
                <Text style={styles.metricValue}>{item.metrics.operatingHours.toLocaleString()}</Text>
                <Text style={styles.metricLabel}>Hours</Text>
              </View>
              <View style={styles.metricItem}>
                <Text style={styles.metricValue}>{item.metrics.energyConsumption}</Text>
                <Text style={styles.metricLabel}>kWh</Text>
              </View>
            </View>

            {/* Sensors */}
            {item.iotSensors.length > 0 && (
              <View style={styles.sensorsSection}>
                <Text style={styles.sectionLabel}>IoT Sensors</Text>
                <CompactSensorList sensors={item.iotSensors} />
              </View>
            )}

            {/* Maintenance Info */}
            <View style={styles.maintenanceSection}>
              <Text style={styles.sectionLabel}>Maintenance Schedule</Text>
              <View style={styles.maintenanceRow}>
                <View style={styles.maintenanceItem}>
                  <Ionicons name="checkmark-circle" size={16} color={Colors.success} />
                  <Text style={styles.maintenanceText}>
                    Last: {formatDate(item.lastMaintenance)}
                  </Text>
                </View>
                <View style={styles.maintenanceItem}>
                  <Ionicons name="calendar" size={16} color={Colors.primary} />
                  <Text style={styles.maintenanceText}>
                    Next: {formatDate(item.nextMaintenance)}
                  </Text>
                </View>
              </View>
            </View>

            {/* Actions */}
            <View style={styles.actionsRow}>
              <TouchableOpacity style={styles.actionBtn}>
                <Ionicons name="document-text" size={18} color={Colors.primary} />
                <Text style={styles.actionBtnText}>History</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionBtn}>
                <Ionicons name="construct" size={18} color={Colors.warning} />
                <Text style={styles.actionBtnText}>Request Service</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionBtn}>
                <Ionicons name="analytics" size={18} color={Colors.info} />
                <Text style={styles.actionBtnText}>Analytics</Text>
              </TouchableOpacity>
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
        <Text style={styles.title}>Equipment</Text>
        <Text style={styles.subtitle}>{equipment.length} total assets</Text>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color={Colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search equipment..."
            placeholderTextColor={Colors.textTertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color={Colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
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
            {filter.key !== 'all' && (
              <View
                style={[
                  styles.filterDot,
                  { backgroundColor: getStatusColor(filter.key) },
                ]}
              />
            )}
            <Text
              style={[
                styles.filterText,
                activeFilter === filter.key && styles.filterTextActive,
              ]}
            >
              {filter.label}
            </Text>
            <Text
              style={[
                styles.filterCount,
                activeFilter === filter.key && styles.filterCountActive,
              ]}
            >
              {filter.count}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Equipment List */}
      <FlatList
        data={filteredEquipment}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <EquipmentCard item={item} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="search" size={48} color={Colors.textTertiary} />
            <Text style={styles.emptyTitle}>No equipment found</Text>
            <Text style={styles.emptySubtitle}>
              Try adjusting your search or filter
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
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
  searchContainer: {
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    height: 44,
    gap: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    ...Typography.body,
    color: Colors.text,
  },
  filtersContainer: {
    maxHeight: 44,
    marginBottom: Spacing.md,
    
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
    gap: Spacing.xs,
    
  },
  filterChipActive: {
    backgroundColor: Colors.primary,
  },
  filterDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
   
  },
  filterText: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  filterTextActive: {
    color: Colors.text,
  },
  filterCount: {
    ...Typography.caption,
    color: Colors.textTertiary,
    backgroundColor: Colors.backgroundTertiary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
    overflow: 'hidden',
  },
  filterCountActive: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    color: Colors.text,
  },
  listContent: {
    paddingHorizontal: Spacing.md,
    paddingBottom: 100,
  },
  equipmentCard: {
    marginBottom: Spacing.sm,
    backgroundColor: Colors.card,
  },
  equipmentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  equipmentIconContainer: {
    width: 52,
    height: 52,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  equipmentInfo: {
    flex: 1,
  },
  equipmentName: {
    ...Typography.body,
    color: Colors.text,
    fontWeight: '600',
    marginBottom: 2,
  },
  equipmentLocation: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  equipmentMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  equipmentType: {
    ...Typography.caption,
    color: Colors.textTertiary,
  },
  equipmentHealthContainer: {
    alignItems: 'center',
  },
  expandIcon: {
    marginTop: Spacing.xs,
  },
  expandedContent: {
    marginTop: Spacing.md,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginBottom: Spacing.md,
  },
  metricsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  metricItem: {
    alignItems: 'center',
  },
  metricValue: {
    ...Typography.body,
    color: Colors.text,
    fontWeight: '600',
  },
  metricLabel: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  sensorsSection: {
    marginBottom: Spacing.md,
  },
  sectionLabel: {
    ...Typography.label,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  maintenanceSection: {
    marginBottom: Spacing.md,
  },
  maintenanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  maintenanceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  maintenanceText: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  actionBtn: {
    alignItems: 'center',
    gap: 4,
  },
  actionBtnText: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xxl * 2,
  },
  emptyTitle: {
    ...Typography.h4,
    color: Colors.textSecondary,
    marginTop: Spacing.md,
  },
  emptySubtitle: {
    ...Typography.bodySmall,
    color: Colors.textTertiary,
    marginTop: Spacing.xs,
  },
});
