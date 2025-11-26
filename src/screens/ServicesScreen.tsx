import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Modal,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { Card, StatusBadge, PriorityBadge, Button } from '../components';
import { ServiceRequest, Equipment } from '../types';
import { Colors, Spacing, Typography, BorderRadius, getPriorityColor, getStatusColor } from '../utils/theme';
import { formatCurrency, formatDate, formatRelativeTime } from '../utils/mockData';

type RequestFilterType = 'all' | 'pending' | 'in-progress' | 'completed';

export const ServicesScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { serviceRequests, equipment, createServiceRequest, company } = useApp();
  const [activeFilter, setActiveFilter] = useState<RequestFilterType>('all');
  const [showNewRequestModal, setShowNewRequestModal] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);
  const [requestType, setRequestType] = useState<ServiceRequest['type']>('maintenance');
  const [requestPriority, setRequestPriority] = useState<ServiceRequest['priority']>('medium');
  const [requestDescription, setRequestDescription] = useState('');

  const filters: { key: RequestFilterType; label: string; count: number }[] = [
    { key: 'all', label: 'All', count: serviceRequests.length },
    { key: 'pending', label: 'Pending', count: serviceRequests.filter((r) => r.status === 'pending' || r.status === 'assigned').length },
    { key: 'in-progress', label: 'In Progress', count: serviceRequests.filter((r) => r.status === 'in-progress').length },
    { key: 'completed', label: 'Completed', count: serviceRequests.filter((r) => r.status === 'completed').length },
  ];

  const filteredRequests = serviceRequests.filter((request) => {
    switch (activeFilter) {
      case 'pending':
        return request.status === 'pending' || request.status === 'assigned';
      case 'in-progress':
        return request.status === 'in-progress';
      case 'completed':
        return request.status === 'completed';
      default:
        return true;
    }
  });

  const getRequestIcon = (type: ServiceRequest['type']): keyof typeof Ionicons.glyphMap => {
    switch (type) {
      case 'emergency':
        return 'alert-circle';
      case 'repair':
        return 'hammer';
      case 'inspection':
        return 'search';
      default:
        return 'construct';
    }
  };

  const estimateCost = (): number => {
    let baseCost = 500;
    if (requestType === 'emergency') baseCost = 2000;
    if (requestType === 'repair') baseCost = 1500;
    if (requestType === 'inspection') baseCost = 400;
    
    if (requestPriority === 'critical') baseCost *= 2;
    if (requestPriority === 'high') baseCost *= 1.5;
    
    return Math.round(baseCost);
  };

  const handleCreateRequest = () => {
    if (!selectedEquipment || !requestDescription.trim()) return;

    createServiceRequest({
      equipmentId: selectedEquipment.id,
      equipmentName: selectedEquipment.name,
      type: requestType,
      priority: requestPriority,
      status: 'pending',
      description: requestDescription,
      estimatedCost: estimateCost(),
    });

    // Reset form
    setSelectedEquipment(null);
    setRequestType('maintenance');
    setRequestPriority('medium');
    setRequestDescription('');
    setShowNewRequestModal(false);
  };

  const RequestCard: React.FC<{ item: ServiceRequest }> = ({ item }) => {
    const priorityColor = getPriorityColor(item.priority);
    const statusColor = getStatusColor(item.status);

    return (
      <Card style={styles.requestCard}>
        <View style={styles.requestHeader}>
          <View style={[styles.requestIconContainer, { backgroundColor: `${priorityColor}20` }]}>
            <Ionicons name={getRequestIcon(item.type)} size={20} color={priorityColor} />
          </View>
          <View style={styles.requestInfo}>
            <Text style={styles.requestEquipment}>{item.equipmentName}</Text>
            <Text style={styles.requestType}>
              {item.type.charAt(0).toUpperCase() + item.type.slice(1)} Request
            </Text>
          </View>
          <PriorityBadge priority={item.priority} />
        </View>

        <Text style={styles.requestDescription} numberOfLines={2}>
          {item.description}
        </Text>

        <View style={styles.requestMeta}>
          <StatusBadge status={item.status} size="small" showIcon />
          <Text style={styles.requestTime}>{formatRelativeTime(item.createdAt)}</Text>
        </View>

        <View style={styles.requestFooter}>
          <View style={styles.requestCost}>
            <Ionicons name="wallet" size={14} color={Colors.textSecondary} />
            <Text style={styles.requestCostText}>
              Est. {formatCurrency(item.estimatedCost)}
            </Text>
          </View>
          {item.assignedTechnician && (
            <View style={styles.technicianInfo}>
              <View style={styles.technicianAvatar}>
                <Text style={styles.technicianInitial}>
                  {item.assignedTechnician.charAt(0)}
                </Text>
              </View>
              <Text style={styles.technicianName}>{item.assignedTechnician}</Text>
            </View>
          )}
        </View>
      </Card>
    );
  };

  const NewRequestModal = () => (
    <Modal
      visible={showNewRequestModal}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>New Service Request</Text>
          <TouchableOpacity onPress={() => setShowNewRequestModal(false)}>
            <Ionicons name="close" size={24} color={Colors.text} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
          {/* Equipment Selection */}
          <View style={styles.formSection}>
            <Text style={styles.formLabel}>Select Equipment</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {equipment.map((eq) => (
                <TouchableOpacity
                  key={eq.id}
                  style={[
                    styles.equipmentOption,
                    selectedEquipment?.id === eq.id && styles.equipmentOptionSelected,
                  ]}
                  onPress={() => setSelectedEquipment(eq)}
                >
                  <Text
                    style={[
                      styles.equipmentOptionText,
                      selectedEquipment?.id === eq.id && styles.equipmentOptionTextSelected,
                    ]}
                    numberOfLines={1}
                  >
                    {eq.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Request Type */}
          <View style={styles.formSection}>
            <Text style={styles.formLabel}>Request Type</Text>
            <View style={styles.optionsGrid}>
              {(['maintenance', 'repair', 'inspection', 'emergency'] as const).map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.typeOption,
                    requestType === type && styles.typeOptionSelected,
                    type === 'emergency' && styles.emergencyOption,
                  ]}
                  onPress={() => setRequestType(type)}
                >
                  <Ionicons
                    name={getRequestIcon(type)}
                    size={24}
                    color={
                      requestType === type
                        ? Colors.text
                        : type === 'emergency'
                        ? Colors.critical
                        : Colors.textSecondary
                    }
                  />
                  <Text
                    style={[
                      styles.typeOptionText,
                      requestType === type && styles.typeOptionTextSelected,
                    ]}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Priority */}
          <View style={styles.formSection}>
            <Text style={styles.formLabel}>Priority</Text>
            <View style={styles.priorityOptions}>
              {(['low', 'medium', 'high', 'critical'] as const).map((priority) => (
                <TouchableOpacity
                  key={priority}
                  style={[
                    styles.priorityOption,
                    requestPriority === priority && {
                      backgroundColor: getPriorityColor(priority),
                    },
                  ]}
                  onPress={() => setRequestPriority(priority)}
                >
                  <View
                    style={[
                      styles.priorityDot,
                      { backgroundColor: getPriorityColor(priority) },
                      requestPriority === priority && { backgroundColor: Colors.text },
                    ]}
                  />
                  <Text
                    style={[
                      styles.priorityOptionText,
                      requestPriority === priority && styles.priorityOptionTextSelected,
                    ]}
                  >
                    {priority.charAt(0).toUpperCase() + priority.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Description */}
          <View style={styles.formSection}>
            <Text style={styles.formLabel}>Description</Text>
            <TextInput
              style={styles.descriptionInput}
              multiline
              numberOfLines={4}
              placeholder="Describe the issue or request..."
              placeholderTextColor={Colors.textTertiary}
              value={requestDescription}
              onChangeText={setRequestDescription}
            />
          </View>

          {/* Cost Estimate */}
          <Card style={styles.costEstimateCard} variant="elevated">
            <View style={styles.costEstimateHeader}>
              <Text style={styles.costEstimateLabel}>Estimated Cost</Text>
              <Text style={styles.costEstimateValue}>{formatCurrency(estimateCost())}</Text>
            </View>
            <View style={styles.balanceInfo}>
              <Text style={styles.balanceLabel}>Available Balance:</Text>
              <Text style={styles.balanceValue}>
                {formatCurrency(company.accountBalance.available)}
              </Text>
            </View>
            {company.accountBalance.available < estimateCost() && (
              <View style={styles.insufficientWarning}>
                <Ionicons name="warning" size={16} color={Colors.warning} />
                <Text style={styles.insufficientText}>
                  Insufficient balance. Please top up your account.
                </Text>
              </View>
            )}
          </Card>
        </ScrollView>

        <View style={styles.modalFooter}>
          <Button
            title="Cancel"
            variant="secondary"
            onPress={() => setShowNewRequestModal(false)}
            style={{ flex: 1 }}
          />
          <Button
            title="Submit Request"
            onPress={handleCreateRequest}
            disabled={
              !selectedEquipment ||
              !requestDescription.trim() ||
              company.accountBalance.available < estimateCost()
            }
            style={{ flex: 2 }}
          />
        </View>
      </SafeAreaView>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Services</Text>
          <Text style={styles.subtitle}>
            {serviceRequests.filter((r) => r.status !== 'completed').length} active requests
          </Text>
        </View>
        <TouchableOpacity
          style={styles.newRequestButton}
          onPress={() => setShowNewRequestModal(true)}
        >
          <Ionicons name="add" size={24} color={Colors.text} />
        </TouchableOpacity>
      </View>

      {/* Stats Cards */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.statsContainer}
        contentContainerStyle={styles.statsContent}
      >
        <Card style={styles.statCard} variant="gradient" gradientColors={[Colors.primary, Colors.primaryDark]}>
          <Text style={styles.statValue}>
            {serviceRequests.filter((r) => r.status === 'pending').length}
          </Text>
          <Text style={styles.statLabel}>Pending</Text>
        </Card>
        <Card style={styles.statCard}>
          <Text style={styles.statValue}>
            {serviceRequests.filter((r) => r.status === 'in-progress').length}
          </Text>
          <Text style={styles.statLabel}>In Progress</Text>
        </Card>
        <Card style={styles.statCard}>
          <Text style={styles.statValue}>
            {formatCurrency(
              serviceRequests
                .filter((r) => r.status !== 'completed')
                .reduce((sum, r) => sum + r.estimatedCost, 0)
            )}
          </Text>
          <Text style={styles.statLabel}>Est. Total</Text>
        </Card>
      </ScrollView>

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

      {/* Requests List */}
      <FlatList
        data={filteredRequests}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <RequestCard item={item} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <View style={styles.emptyIconContainer}>
              <Ionicons name="construct" size={48} color={Colors.textTertiary} />
            </View>
            <Text style={styles.emptyTitle}>No requests</Text>
            <Text style={styles.emptySubtitle}>
              Create a new service request to get started
            </Text>
            <Button
              title="New Request"
              icon="add"
              onPress={() => setShowNewRequestModal(true)}
              style={{ marginTop: Spacing.lg }}
            />
          </View>
        }
      />

      <NewRequestModal />
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
  newRequestButton: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsContainer: {
    flexGrow: 0,
    minHeight: 90,
    marginBottom: Spacing.md,
  },
  statsContent: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
  },
  statCard: {
    minWidth: 120,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    marginRight: Spacing.sm,
  },
  statValue: {
    ...Typography.h4,
    color: Colors.text,
    textAlign: 'center',
  },
  statLabel: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 4,
    textAlign: 'center',
  },
  // FIXED: Changed from maxHeight: 44 to minHeight: 60 to match EquipmentScreen
  filtersContainer: {
    marginBottom: Spacing.md,
    flexGrow: 0,
    minHeight: 60,
    zIndex: 1,
  },
  // FIXED: Added paddingVertical: 8 and gap to match EquipmentScreen
  filtersContent: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 8,
    gap: Spacing.sm,
  },
  // FIXED: Added paddingVertical and minHeight to match EquipmentScreen filterChip
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundSecondary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: 10,
    borderRadius: BorderRadius.full,
    marginRight: Spacing.sm,
    gap: Spacing.sm,
    minHeight: 44,
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
  requestCard: {
    marginBottom: Spacing.sm,
    backgroundColor: Colors.card,
  },
  requestHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  requestIconContainer: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  requestInfo: {
    flex: 1,
  },
  requestEquipment: {
    ...Typography.body,
    color: Colors.text,
    fontWeight: '600',
  },
  requestType: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  requestDescription: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  requestMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  requestTime: {
    ...Typography.caption,
    color: Colors.textTertiary,
  },
  requestFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  requestCost: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  requestCostText: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
  },
  technicianInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  technicianAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  technicianInitial: {
    ...Typography.caption,
    color: Colors.text,
    fontWeight: '600',
  },
  technicianName: {
    ...Typography.caption,
    color: Colors.textSecondary,
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
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  modalTitle: {
    ...Typography.h3,
    color: Colors.text,
  },
  modalContent: {
    flex: 1,
    padding: Spacing.md,
  },
  formSection: {
    marginBottom: Spacing.lg,
  },
  formLabel: {
    ...Typography.label,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  equipmentOption: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.backgroundSecondary,
    marginRight: Spacing.sm,
    maxWidth: 150,
  },
  equipmentOptionSelected: {
    backgroundColor: Colors.primary,
  },
  equipmentOptionText: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
  },
  equipmentOptionTextSelected: {
    color: Colors.text,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  typeOption: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.backgroundSecondary,
    gap: Spacing.sm,
  },
  typeOptionSelected: {
    backgroundColor: Colors.primary,
  },
  emergencyOption: {
    borderWidth: 1,
    borderColor: Colors.critical,
  },
  typeOptionText: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
  },
  typeOptionTextSelected: {
    color: Colors.text,
  },
  priorityOptions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  priorityOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.sm,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.backgroundSecondary,
    gap: Spacing.xs,
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  priorityOptionText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  priorityOptionTextSelected: {
    color: Colors.text,
  },
  descriptionInput: {
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    ...Typography.body,
    color: Colors.text,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  costEstimateCard: {
    marginBottom: Spacing.lg,
  },
  costEstimateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  costEstimateLabel: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  costEstimateValue: {
    ...Typography.h3,
    color: Colors.text,
  },
  balanceInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  balanceLabel: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
  },
  balanceValue: {
    ...Typography.body,
    color: Colors.success,
    fontWeight: '600',
  },
  insufficientWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.sm,
    padding: Spacing.sm,
    backgroundColor: `${Colors.warning}20`,
    borderRadius: BorderRadius.sm,
  },
  insufficientText: {
    ...Typography.caption,
    color: Colors.warning,
    flex: 1,
  },
  modalFooter: {
    flexDirection: 'row',
    gap: Spacing.sm,
    padding: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
});