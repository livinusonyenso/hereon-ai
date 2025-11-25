import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { Card, HealthRing, StatusBadge, AlertTypeBadge, Button } from '../components';
import { Colors, Spacing, Typography, BorderRadius, getHealthColor } from '../utils/theme';
import { formatCurrency, formatRelativeTime } from '../utils/mockData';

const { width } = Dimensions.get('window');

export const DashboardScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const {
    company,
    dashboardStats,
    alerts,
    equipment,
    aiPredictions,
    isLoading,
    refreshData,
    lastUpdated,
  } = useApp();

  const unreadAlerts = alerts.filter((a) => !a.isRead);
  const criticalEquipment = equipment.filter((e) => e.status === 'critical');

  const StatCard: React.FC<{
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    value: string | number;
    color: string;
    subtitle?: string;
  }> = ({ icon, label, value, color, subtitle }) => (
    <Card style={styles.statCard} variant="elevated">
      <View style={[styles.statIconContainer, { backgroundColor: `${color}20` }]}>
        <Ionicons name={icon} size={20} color={color} />
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
      {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
    </Card>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={refreshData}
            tintColor={Colors.primary}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Welcome back</Text>
            <Text style={styles.companyName}>{company.name}</Text>
          </View>
          <TouchableOpacity
            style={styles.notificationButton}
            onPress={() => navigation.navigate('Alerts')}
          >
            <Ionicons name="notifications" size={24} color={Colors.text} />
            {unreadAlerts.length > 0 && (
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationCount}>{unreadAlerts.length}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* System Health Overview */}
        <Card variant="gradient" gradientColors={['#1a1a2e', '#16213e']} style={styles.healthCard}>
          <View style={styles.healthCardContent}>
            <View style={styles.healthRingContainer}>
              <HealthRing score={dashboardStats.overallHealth} size={140} strokeWidth={12} />
            </View>
            <View style={styles.healthInfo}>
              <Text style={styles.healthTitle}>System Health</Text>
              <Text style={styles.healthDescription}>
                {dashboardStats.operationalEquipment} of {dashboardStats.totalEquipment} systems operational
              </Text>
              <View style={styles.healthStats}>
                <View style={styles.healthStatItem}>
                  <View style={[styles.healthDot, { backgroundColor: Colors.success }]} />
                  <Text style={styles.healthStatText}>{dashboardStats.operationalEquipment} Operational</Text>
                </View>
                <View style={styles.healthStatItem}>
                  <View style={[styles.healthDot, { backgroundColor: Colors.warning }]} />
                  <Text style={styles.healthStatText}>{dashboardStats.warningEquipment} Warning</Text>
                </View>
                <View style={styles.healthStatItem}>
                  <View style={[styles.healthDot, { backgroundColor: Colors.critical }]} />
                  <Text style={styles.healthStatText}>{dashboardStats.criticalEquipment} Critical</Text>
                </View>
              </View>
            </View>
          </View>
          <View style={styles.lastUpdated}>
            <Ionicons name="sync" size={12} color={Colors.textSecondary} />
            <Text style={styles.lastUpdatedText}>
              Updated {formatRelativeTime(lastUpdated.toISOString())}
            </Text>
          </View>
        </Card>

        {/* Quick Stats */}
        <View style={styles.statsGrid}>
          <StatCard
            icon="hardware-chip"
            label="Equipment"
            value={dashboardStats.totalEquipment}
            color={Colors.primary}
          />
          <StatCard
            icon="alert-circle"
            label="Active Alerts"
            value={dashboardStats.activeAlerts}
            color={Colors.warning}
          />
          <StatCard
            icon="construct"
            label="Pending"
            value={dashboardStats.pendingRequests}
            color={Colors.info}
          />
          <StatCard
            icon="wallet"
            label="Balance"
            value={formatCurrency(company.accountBalance.available)}
            color={Colors.success}
            subtitle="Available"
          />
        </View>

        {/* Critical Alerts */}
        {unreadAlerts.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Alerts</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Alerts')}>
                <Text style={styles.seeAllText}>See All</Text>
              </TouchableOpacity>
            </View>
            {unreadAlerts.slice(0, 3).map((alert) => (
              <Card
                key={alert.id}
                style={styles.alertCard}
                onPress={() => navigation.navigate('Alerts')}
              >
                <View style={styles.alertHeader}>
                  <AlertTypeBadge type={alert.type} />
                  <Text style={styles.alertTime}>{formatRelativeTime(alert.timestamp)}</Text>
                </View>
                <Text style={styles.alertTitle}>{alert.title}</Text>
                <Text style={styles.alertEquipment}>{alert.equipmentName}</Text>
                {alert.aiRecommendation && (
                  <View style={styles.aiRecommendation}>
                    <Ionicons name="bulb" size={14} color={Colors.accent} />
                    <Text style={styles.aiRecommendationText} numberOfLines={2}>
                      {alert.aiRecommendation}
                    </Text>
                  </View>
                )}
              </Card>
            ))}
          </View>
        )}

        {/* AI Predictions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <Ionicons name="analytics" size={20} color={Colors.accent} />
              <Text style={styles.sectionTitle}>AI Predictions</Text>
            </View>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.predictionsContainer}
          >
            {aiPredictions.map((prediction) => (
              <Card key={prediction.id} style={styles.predictionCard} variant="elevated">
                <View style={styles.predictionHeader}>
                  <View
                    style={[
                      styles.predictionIcon,
                      {
                        backgroundColor:
                          prediction.severity === 'high'
                            ? `${Colors.critical}20`
                            : prediction.severity === 'medium'
                            ? `${Colors.warning}20`
                            : `${Colors.success}20`,
                      },
                    ]}
                  >
                    <Ionicons
                      name={
                        prediction.predictionType === 'failure'
                          ? 'warning'
                          : prediction.predictionType === 'maintenance'
                          ? 'construct'
                          : 'trending-up'
                      }
                      size={18}
                      color={
                        prediction.severity === 'high'
                          ? Colors.critical
                          : prediction.severity === 'medium'
                          ? Colors.warning
                          : Colors.success
                      }
                    />
                  </View>
                  <View style={styles.confidenceBadge}>
                    <Text style={styles.confidenceText}>{prediction.confidence}%</Text>
                  </View>
                </View>
                <Text style={styles.predictionEquipment}>{prediction.equipmentName}</Text>
                <Text style={styles.predictionType}>
                  {prediction.predictionType.charAt(0).toUpperCase() +
                    prediction.predictionType.slice(1)}{' '}
                  Prediction
                </Text>
                <Text style={styles.predictionRecommendation} numberOfLines={3}>
                  {prediction.recommendation}
                </Text>
                <View style={styles.predictionFooter}>
                  <Text style={styles.predictionSavings}>
                    Potential savings: {formatCurrency(prediction.potentialSavings)}
                  </Text>
                </View>
              </Card>
            ))}
          </ScrollView>
        </View>

        {/* Critical Equipment */}
        {criticalEquipment.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Requires Attention</Text>
            </View>
            {criticalEquipment.map((eq) => (
              <Card
                key={eq.id}
                style={styles.equipmentCard}
                onPress={() => navigation.navigate('Equipment')}
              >
                <View style={styles.equipmentCardContent}>
                  <View
                    style={[
                      styles.equipmentIcon,
                      { backgroundColor: `${getHealthColor(eq.healthScore)}20` },
                    ]}
                  >
                    <Ionicons
                      name="hardware-chip"
                      size={24}
                      color={getHealthColor(eq.healthScore)}
                    />
                  </View>
                  <View style={styles.equipmentInfo}>
                    <Text style={styles.equipmentName}>{eq.name}</Text>
                    <Text style={styles.equipmentLocation}>{eq.location}</Text>
                    <StatusBadge status={eq.status} size="small" showIcon />
                  </View>
                  <View style={styles.equipmentHealth}>
                    <Text
                      style={[
                        styles.equipmentHealthScore,
                        { color: getHealthColor(eq.healthScore) },
                      ]}
                    >
                      {eq.healthScore}%
                    </Text>
                    <Text style={styles.equipmentHealthLabel}>Health</Text>
                  </View>
                </View>
              </Card>
            ))}
          </View>
        )}

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate('Services')}
            >
              <LinearGradient
                colors={[Colors.primary, Colors.primaryDark]}
                style={styles.actionGradient}
              >
                <Ionicons name="add-circle" size={28} color={Colors.text} />
                <Text style={styles.actionText}>New Request</Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate('Account')}
            >
              <View style={styles.actionSecondary}>
                <Ionicons name="wallet" size={28} color={Colors.success} />
                <Text style={styles.actionText}>Top Up</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate('Equipment')}
            >
              <View style={styles.actionSecondary}>
                <Ionicons name="scan" size={28} color={Colors.info} />
                <Text style={styles.actionText}>Scan</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate('Alerts')}
            >
              <View style={styles.actionSecondary}>
                <Ionicons name="call" size={28} color={Colors.warning} />
                <Text style={styles.actionText}>Support</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  greeting: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
  },
  companyName: {
    ...Typography.h3,
    color: Colors.text,
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: Colors.critical,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationCount: {
    ...Typography.caption,
    color: Colors.text,
    fontWeight: '700',
  },
  healthCard: {
    marginBottom: Spacing.lg,
  },
  healthCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  healthRingContainer: {
    marginRight: Spacing.lg,
  },
  healthInfo: {
    flex: 1,
  },
  healthTitle: {
    ...Typography.h4,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  healthDescription: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  healthStats: {
    gap: Spacing.xs,
  },
  healthStatItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  healthDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: Spacing.sm,
  },
  healthStatText: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
  },
  lastUpdated: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  lastUpdatedText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginLeft: Spacing.xs,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  statCard: {
    width: (width - Spacing.md * 2 - Spacing.sm) / 2 - Spacing.sm / 2,
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  statValue: {
    ...Typography.h4,
    color: Colors.text,
  },
  statLabel: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  statSubtitle: {
    ...Typography.caption,
    color: Colors.textTertiary,
    fontSize: 10,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  sectionTitle: {
    ...Typography.h4,
    color: Colors.text,
  },
  seeAllText: {
    ...Typography.bodySmall,
    color: Colors.primary,
  },
  alertCard: {
    marginBottom: Spacing.sm,
    backgroundColor: Colors.card,
  },
  alertHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  alertTime: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  alertTitle: {
    ...Typography.body,
    color: Colors.text,
    fontWeight: '600',
    marginBottom: 4,
  },
  alertEquipment: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  aiRecommendation: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: `${Colors.accent}15`,
    padding: Spacing.sm,
    borderRadius: BorderRadius.sm,
    gap: Spacing.sm,
  },
  aiRecommendationText: {
    ...Typography.bodySmall,
    color: Colors.accent,
    flex: 1,
  },
  predictionsContainer: {
    paddingRight: Spacing.md,
  },
  predictionCard: {
    width: width * 0.7,
    marginRight: Spacing.md,
  },
  predictionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  predictionIcon: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  confidenceBadge: {
    backgroundColor: Colors.backgroundTertiary,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  confidenceText: {
    ...Typography.caption,
    color: Colors.text,
    fontWeight: '600',
  },
  predictionEquipment: {
    ...Typography.body,
    color: Colors.text,
    fontWeight: '600',
    marginBottom: 2,
  },
  predictionType: {
    ...Typography.caption,
    color: Colors.primary,
    marginBottom: Spacing.sm,
  },
  predictionRecommendation: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  predictionFooter: {
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  predictionSavings: {
    ...Typography.bodySmall,
    color: Colors.success,
    fontWeight: '600',
  },
  equipmentCard: {
    marginBottom: Spacing.sm,
    backgroundColor: Colors.card,
  },
  equipmentCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  equipmentIcon: {
    width: 48,
    height: 48,
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
  equipmentHealth: {
    alignItems: 'center',
  },
  equipmentHealthScore: {
    ...Typography.h4,
  },
  equipmentHealthLabel: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  actionButton: {
    width: (width - Spacing.md * 2 - Spacing.sm) / 2 - Spacing.sm / 2,
    height: 80,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
  },
  actionGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionSecondary: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: BorderRadius.lg,
  },
  actionText: {
    ...Typography.bodySmall,
    color: Colors.text,
    marginTop: Spacing.xs,
    fontWeight: '500',
  },
  bottomSpacer: {
    height: 100,
  },
});
