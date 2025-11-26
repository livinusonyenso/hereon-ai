import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Dimensions,
  ViewStyle,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { Card, Button } from '../components';
import { PrepaidPackage, Transaction } from '../types';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '../utils/theme';
import { formatCurrency, formatDate, formatRelativeTime, mockPrepaidPackages, mockSubscriptions } from '../utils/mockData';

const { width } = Dimensions.get('window');

export const AccountScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { company, transactions, topUpBalance } = useApp();
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<PrepaidPackage | null>(null);

  const handleTopUp = () => {
    if (selectedPackage) {
      topUpBalance(selectedPackage.price);
      setShowTopUpModal(false);
      setSelectedPackage(null);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: () => {
            // In a real app, clear tokens here
            navigation.reset({
              index: 0,
              routes: [{ name: 'Auth' }],
            });
          },
        },
      ]
    );
  };

  const TransactionItem: React.FC<{ item: Transaction }> = ({ item }) => {
    const isDeposit = item.type === 'deposit';
    
    return (
      <View style={styles.transactionItem}>
        <View style={[
          styles.transactionIcon,
          { backgroundColor: isDeposit ? `${Colors.success}20` : `${Colors.critical}20` }
        ]}>
          <Ionicons
            name={isDeposit ? 'arrow-down' : 'arrow-up'}
            size={18}
            color={isDeposit ? Colors.success : Colors.critical}
          />
        </View>
        <View style={styles.transactionInfo}>
          <Text style={styles.transactionDescription} numberOfLines={1}>
            {item.description}
          </Text>
          <Text style={styles.transactionTime}>{formatRelativeTime(item.timestamp)}</Text>
        </View>
        <Text style={[
          styles.transactionAmount,
          { color: isDeposit ? Colors.success : Colors.critical }
        ]}>
          {isDeposit ? '+' : '-'}{formatCurrency(item.amount)}
        </Text>
      </View>
    );
  };

  const TopUpModal = () => (
    <Modal
      visible={showTopUpModal}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Top Up Account</Text>
          <TouchableOpacity onPress={() => setShowTopUpModal(false)}>
            <Ionicons name="close" size={24} color={Colors.text} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
          <Text style={styles.modalSubtitle}>Select a prepaid package</Text>

          {mockPrepaidPackages.map((pkg) => (
            <TouchableOpacity
              key={pkg.id}
              onPress={() => setSelectedPackage(pkg)}
              activeOpacity={0.7}
            >
              <Card
                style={[
                  styles.packageCard,
                  selectedPackage?.id === pkg.id && styles.packageCardSelected,
                  pkg.recommended && styles.packageCardRecommended,
                ]}
              >
                {pkg.recommended && (
                  <View style={styles.recommendedBadge}>
                    <Text style={styles.recommendedText}>RECOMMENDED</Text>
                  </View>
                )}
                <View style={styles.packageHeader}>
                  <View>
                    <Text style={styles.packageName}>{pkg.name}</Text>
                    <Text style={styles.packageDescription}>{pkg.description}</Text>
                  </View>
                  <View style={styles.packagePriceContainer}>
                    <Text style={styles.packagePrice}>{formatCurrency(pkg.price)}</Text>
                  </View>
                </View>
                <View style={styles.packageFeatures}>
                  {pkg.features.map((feature, index) => (
                    <View key={index} style={styles.featureItem}>
                      <Ionicons name="checkmark-circle" size={16} color={Colors.success} />
                      <Text style={styles.featureText}>{feature}</Text>
                    </View>
                  ))}
                </View>
                {selectedPackage?.id === pkg.id && (
                  <View style={styles.selectedIndicator}>
                    <Ionicons name="checkmark-circle" size={24} color={Colors.primary} />
                  </View>
                )}
              </Card>
            </TouchableOpacity>
          ))}

          <View style={styles.customAmountSection}>
            <Text style={styles.customAmountLabel}>Or enter a custom amount</Text>
            <TouchableOpacity style={styles.customAmountButton}>
              <Ionicons name="add" size={20} color={Colors.primary} />
              <Text style={styles.customAmountText}>Custom Amount</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        <View style={styles.modalFooter}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Selected:</Text>
            <Text style={styles.summaryValue}>
              {selectedPackage ? formatCurrency(selectedPackage.price) : '-'}
            </Text>
          </View>
          <Button
            title={selectedPackage ? `Top Up ${formatCurrency(selectedPackage.price)}` : 'Select a Package'}
            onPress={handleTopUp}
            disabled={!selectedPackage}
            fullWidth
          />
        </View>
      </SafeAreaView>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Account</Text>
          <TouchableOpacity style={styles.settingsButton}>
            <Ionicons name="settings" size={24} color={Colors.text} />
          </TouchableOpacity>
        </View>

        {/* Company Info */}
        <View style={styles.companyCard}>
          <View style={styles.companyAvatar}>
            <Text style={styles.companyInitial}>{company.name.charAt(0)}</Text>
          </View>
          <View style={styles.companyInfo}>
            <Text style={styles.companyName}>{company.name}</Text>
            <Text style={styles.companyIndustry}>
              {company.industry.replace('_', ' & ').toUpperCase()}
            </Text>
          </View>
        </View>

        {/* Balance Card */}
        <LinearGradient
          colors={['#1a1a2e', '#16213e', '#0f3460']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.balanceCard}
        >
          <View style={styles.balanceHeader}>
            <Text style={styles.balanceLabel}>Available Balance</Text>
            <View style={styles.balanceBadge}>
              <Ionicons name="shield-checkmark" size={14} color={Colors.success} />
              <Text style={styles.balanceBadgeText}>Secured</Text>
            </View>
          </View>
          <Text style={styles.balanceAmount}>
            {formatCurrency(company.accountBalance.available)}
          </Text>
          <View style={styles.balanceDetails}>
            <View style={styles.balanceDetailItem}>
              <Text style={styles.balanceDetailLabel}>Pending</Text>
              <Text style={styles.balanceDetailValue}>
                {formatCurrency(company.accountBalance.pending)}
              </Text>
            </View>
            <View style={styles.balanceDivider} />
            <View style={styles.balanceDetailItem}>
              <Text style={styles.balanceDetailLabel}>Total Spent</Text>
              <Text style={styles.balanceDetailValue}>
                {formatCurrency(company.accountBalance.totalSpent)}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.topUpButton}
            onPress={() => setShowTopUpModal(true)}
          >
            <Ionicons name="add" size={20} color={Colors.text} />
            <Text style={styles.topUpButtonText}>Top Up Balance</Text>
          </TouchableOpacity>
        </LinearGradient>

        {/* Active Subscription */}
        {company.subscription && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Active Subscription</Text>
            <Card style={styles.subscriptionCard} variant="elevated">
              <View style={styles.subscriptionHeader}>
                <View style={styles.subscriptionBadge}>
                  <Ionicons name="diamond" size={16} color={Colors.accent} />
                  <Text style={styles.subscriptionTier}>
                    {company.subscription.tier.toUpperCase()}
                  </Text>
                </View>
                <View style={styles.activeBadge}>
                  <View style={styles.activeDot} />
                  <Text style={styles.activeText}>Active</Text>
                </View>
              </View>
              <Text style={styles.subscriptionName}>{company.subscription.name}</Text>
              <View style={styles.subscriptionPrice}>
                <Text style={styles.subscriptionAmount}>
                  {formatCurrency(company.subscription.price)}
                </Text>
                <Text style={styles.subscriptionCycle}>
                  /{company.subscription.billingCycle}
                </Text>
              </View>
              <View style={styles.subscriptionFeatures}>
                {company.subscription.features.slice(0, 4).map((feature, index) => (
                  <View key={index} style={styles.subscriptionFeatureItem}>
                    <Ionicons name="checkmark" size={14} color={Colors.success} />
                    <Text style={styles.subscriptionFeatureText}>{feature}</Text>
                  </View>
                ))}
              </View>
              <TouchableOpacity style={styles.manageButton}>
                <Text style={styles.manageButtonText}>Manage Subscription</Text>
                <Ionicons name="chevron-forward" size={16} color={Colors.primary} />
              </TouchableOpacity>
            </Card>
          </View>
        )}

        {/* Subscription Plans */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Subscription Plans</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.plansContainer}
          >
            {mockSubscriptions.map((plan) => (
              <Card
                key={plan.id}
                style={[
                  styles.planCard,
                  plan.isActive && styles.planCardActive,
                ]}
              >
                {plan.tier === 'premium' && (
                  <View style={styles.planBadge}>
                    <Ionicons name="star" size={12} color={Colors.text} />
                    <Text style={styles.planBadgeText}>BEST VALUE</Text>
                  </View>
                )}
                <Text style={styles.planName}>{plan.name}</Text>
                <View style={styles.planPriceRow}>
                  <Text style={styles.planPrice}>{formatCurrency(plan.price)}</Text>
                  <Text style={styles.planCycle}>/mo</Text>
                </View>
                <View style={styles.planFeatures}>
                  {plan.features.slice(0, 3).map((feature, index) => (
                    <View key={index} style={styles.planFeatureItem}>
                      <Ionicons name="checkmark" size={12} color={Colors.success} />
                      <Text style={styles.planFeatureText}>{feature}</Text>
                    </View>
                  ))}
                </View>
                <Button
                  title={plan.isActive ? 'Current Plan' : 'Select'}
                  variant={plan.isActive ? 'secondary' : 'outline'}
                  size="small"
                  disabled={plan.isActive}
                  onPress={() => {}}
                  fullWidth
                />
              </Card>
            ))}
          </ScrollView>
        </View>

        {/* Recent Transactions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Transactions</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <Card style={styles.transactionsCard}>
            {transactions.slice(0, 5).map((transaction) => (
              <TransactionItem key={transaction.id} item={transaction} />
            ))}
          </Card>
        </View>

        {/* Quick Links */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Links</Text>
          <View style={styles.quickLinks}>
            <TouchableOpacity style={styles.quickLink}>
              <View style={[styles.quickLinkIcon, { backgroundColor: `${Colors.info}20` }]}>
                <Ionicons name="document-text" size={20} color={Colors.info} />
              </View>
              <Text style={styles.quickLinkText}>Invoices</Text>
              <Ionicons name="chevron-forward" size={16} color={Colors.textTertiary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickLink}>
              <View style={[styles.quickLinkIcon, { backgroundColor: `${Colors.warning}20` }]}>
                <Ionicons name="card" size={20} color={Colors.warning} />
              </View>
              <Text style={styles.quickLinkText}>Payment Methods</Text>
              <Ionicons name="chevron-forward" size={16} color={Colors.textTertiary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickLink}>
              <View style={[styles.quickLinkIcon, { backgroundColor: `${Colors.success}20` }]}>
                <Ionicons name="analytics" size={20} color={Colors.success} />
              </View>
              <Text style={styles.quickLinkText}>Usage Reports</Text>
              <Ionicons name="chevron-forward" size={16} color={Colors.textTertiary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickLink}>
              <View style={[styles.quickLinkIcon, { backgroundColor: `${Colors.primary}20` }]}>
                <Ionicons name="help-circle" size={20} color={Colors.primary} />
              </View>
              <Text style={styles.quickLinkText}>Help & Support</Text>
              <Ionicons name="chevron-forward" size={16} color={Colors.textTertiary} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <TouchableOpacity 
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <Ionicons name="log-out-outline" size={20} color={Colors.critical} />
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      <TopUpModal />
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
  title: {
    ...Typography.h2,
    color: Colors.text,
  },
  settingsButton: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  companyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  companyAvatar: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  companyInitial: {
    ...Typography.h2,
    color: Colors.text,
  },
  companyInfo: {
    flex: 1,
  },
  companyName: {
    ...Typography.h4,
    color: Colors.text,
  },
  companyIndustry: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  balanceCard: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    ...Shadows.lg,
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  balanceLabel: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
  },
  balanceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  balanceBadgeText: {
    ...Typography.caption,
    color: Colors.success,
  },
  balanceAmount: {
    ...Typography.statLarge,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  balanceDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  balanceDetailItem: {
    flex: 1,
  },
  balanceDetailLabel: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  balanceDetailValue: {
    ...Typography.body,
    color: Colors.text,
    fontWeight: '600',
    marginTop: 2,
  },
  balanceDivider: {
    width: 1,
    height: 30,
    backgroundColor: Colors.border,
    marginHorizontal: Spacing.md,
  },
  topUpButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.sm + 4,
    borderRadius: BorderRadius.md,
    gap: Spacing.sm,
  },
  topUpButtonText: {
    ...Typography.body,
    color: Colors.text,
    fontWeight: '600',
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
  sectionTitle: {
    ...Typography.h4,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  seeAllText: {
    ...Typography.bodySmall,
    color: Colors.primary,
  },
  subscriptionCard: {
    padding: Spacing.md,
  },
  subscriptionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  subscriptionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  subscriptionTier: {
    ...Typography.label,
    color: Colors.accent,
  },
  activeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  activeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.success,
  },
  activeText: {
    ...Typography.caption,
    color: Colors.success,
  },
  subscriptionName: {
    ...Typography.h4,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  subscriptionPrice: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: Spacing.md,
  },
  subscriptionAmount: {
    ...Typography.h3,
    color: Colors.text,
  },
  subscriptionCycle: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    marginLeft: 4,
  },
  subscriptionFeatures: {
    marginBottom: Spacing.md,
  },
  subscriptionFeatureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  subscriptionFeatureText: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
  },
  manageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    gap: Spacing.xs,
  },
  manageButtonText: {
    ...Typography.body,
    color: Colors.primary,
    fontWeight: '500',
  },
  plansContainer: {
    paddingRight: Spacing.md,
  },
  planCard: {
    width: width * 0.55,
    marginRight: Spacing.md,
    padding: Spacing.md,
  },
  planCardActive: {
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  planBadge: {
    position: 'absolute',
    top: -8,
    right: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.accent,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
    gap: 4,
  },
  planBadgeText: {
    ...Typography.caption,
    color: Colors.text,
    fontWeight: '700',
    fontSize: 9,
  },
  planName: {
    ...Typography.h4,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  planPriceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: Spacing.md,
  },
  planPrice: {
    ...Typography.h3,
    color: Colors.text,
  },
  planCycle: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
  },
  planFeatures: {
    marginBottom: Spacing.md,
  },
  planFeatureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginBottom: 4,
  },
  planFeatureText: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  transactionsCard: {
    padding: 0,
    overflow: 'hidden',
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  transactionIcon: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionDescription: {
    ...Typography.body,
    color: Colors.text,
  },
  transactionTime: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  transactionAmount: {
    ...Typography.body,
    fontWeight: '600',
  },
  quickLinks: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
  },
  quickLink: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  quickLinkIcon: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  quickLinkText: {
    ...Typography.body,
    color: Colors.text,
    flex: 1,
  },
  bottomSpacer: {
    height: 100,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.md,
    backgroundColor: `${Colors.critical}10`,
    borderRadius: BorderRadius.lg,
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  logoutText: {
    ...Typography.body,
    color: Colors.critical,
    fontWeight: '600',
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
  modalSubtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginBottom: Spacing.lg,
  },
  packageCard: {
    marginBottom: Spacing.md,
    padding: Spacing.md,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  packageCardSelected: {
    borderColor: Colors.primary,
  },
  packageCardRecommended: {
    backgroundColor: `${Colors.accent}10`,
  },
  recommendedBadge: {
    position: 'absolute',
    top: -10,
    right: Spacing.md,
    backgroundColor: Colors.accent,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  recommendedText: {
    ...Typography.caption,
    color: Colors.text,
    fontWeight: '700',
    fontSize: 9,
  },
  packageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  packageName: {
    ...Typography.h4,
    color: Colors.text,
  },
  packageDescription: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    marginTop: 2,
    maxWidth: '70%',
  },
  packagePriceContainer: {
    alignItems: 'flex-end',
  },
  packagePrice: {
    ...Typography.h3,
    color: Colors.primary,
  },
  packageFeatures: {
    gap: Spacing.xs,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  featureText: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
  },
  selectedIndicator: {
    position: 'absolute',
    top: Spacing.md,
    right: Spacing.md,
  },
  customAmountSection: {
    alignItems: 'center',
    paddingVertical: Spacing.lg,
  },
  customAmountLabel: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  customAmountButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: BorderRadius.md,
    borderStyle: 'dashed',
    gap: Spacing.sm,
  },
  customAmountText: {
    ...Typography.body,
    color: Colors.primary,
  },
  modalFooter: {
    padding: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  summaryLabel: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  summaryValue: {
    ...Typography.h4,
    color: Colors.text,
  },
});
