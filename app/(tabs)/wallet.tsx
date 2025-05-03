import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Platform, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

import { ThemedText } from '@/components/ThemedText';

// Raiffeisen Bank brand colors
const BRAND_COLORS = {
  primary: '#FFEE00', // Raiffeisen Yellow
  secondary: '#004E9E', // Raiffeisen Blue
  darkText: '#000000',
  lightGray: '#AAAAAA',
  accent1: '#FFD100', // Darker yellow
  accent2: '#0069B4', // Lighter blue
  positive: '#4CAF50',
  negative: '#F44336',
};

export default function WalletScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.title}>My Wallet</ThemedText>
      </View>
      
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Wallet Balance */}
        <View style={[styles.balanceContainer, { backgroundColor: BRAND_COLORS.primary }]}>
          <ThemedText style={styles.balanceLabel}>Available Balance</ThemedText>
          <ThemedText style={styles.balanceAmount}>$1,287.45</ThemedText>
          <View style={styles.cardInfoContainer}>
            <Ionicons name="card" size={20} color={BRAND_COLORS.secondary} style={styles.cardIcon} />
            <ThemedText style={styles.cardNumber}>**** **** **** 4582</ThemedText>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionButton}>
            <View style={[styles.actionIcon, { backgroundColor: '#E8F5FF' }]}>
              <Ionicons name="add-circle-outline" size={24} color={BRAND_COLORS.secondary} />
            </View>
            <ThemedText style={styles.actionText}>Add Money</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <View style={[styles.actionIcon, { backgroundColor: '#F9F0FF' }]}>
              <Ionicons name="swap-horizontal" size={24} color={BRAND_COLORS.secondary} />
            </View>
            <ThemedText style={styles.actionText}>Transfer</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <View style={[styles.actionIcon, { backgroundColor: '#E8F5E9' }]}>
              <Ionicons name="card-outline" size={24} color={BRAND_COLORS.secondary} />
            </View>
            <ThemedText style={styles.actionText}>Card Settings</ThemedText>
          </TouchableOpacity>
        </View>

        {/* Transaction History */}
        <View style={styles.sectionHeader}>
          <ThemedText style={styles.sectionTitle}>Recent Transactions</ThemedText>
          <TouchableOpacity>
            <ThemedText style={styles.seeAllText}>See All</ThemedText>
          </TouchableOpacity>
        </View>

        {/* Transaction List */}
        <View style={styles.transactionContainer}>
          {/* Transaction Item */}
          <View style={styles.transactionItem}>
            <View style={styles.transactionLeftSection}>
              <View style={[styles.transactionIcon, { backgroundColor: '#E8F5E9' }]}>
                <Ionicons name="arrow-up-outline" size={20} color={BRAND_COLORS.positive} />
              </View>
              <View>
                <ThemedText style={styles.transactionName}>Added to Wallet</ThemedText>
                <ThemedText style={styles.transactionDate}>Today, 10:24 AM</ThemedText>
              </View>
            </View>
            <ThemedText style={styles.incomeAmount}>+$200.00</ThemedText>
          </View>

          {/* Transaction Item */}
          <View style={styles.transactionItem}>
            <View style={styles.transactionLeftSection}>
              <View style={[styles.transactionIcon, { backgroundColor: '#FFF8E1' }]}>
                <Ionicons name="people-outline" size={20} color={BRAND_COLORS.secondary} />
              </View>
              <View>
                <ThemedText style={styles.transactionName}>Transfer to Emma</ThemedText>
                <ThemedText style={styles.transactionDate}>Yesterday, 4:15 PM</ThemedText>
              </View>
            </View>
            <ThemedText style={styles.expenseAmount}>-$50.00</ThemedText>
          </View>

          {/* Transaction Item */}
          <View style={styles.transactionItem}>
            <View style={styles.transactionLeftSection}>
              <View style={[styles.transactionIcon, { backgroundColor: '#FFF8E1' }]}>
                <Ionicons name="people-outline" size={20} color={BRAND_COLORS.secondary} />
              </View>
              <View>
                <ThemedText style={styles.transactionName}>Transfer to Noah</ThemedText>
                <ThemedText style={styles.transactionDate}>Jan 15, 3:30 PM</ThemedText>
              </View>
            </View>
            <ThemedText style={styles.expenseAmount}>-$30.00</ThemedText>
          </View>

          {/* Transaction Item */}
          <View style={styles.transactionItem}>
            <View style={styles.transactionLeftSection}>
              <View style={[styles.transactionIcon, { backgroundColor: '#E8F5E9' }]}>
                <Ionicons name="arrow-up-outline" size={20} color={BRAND_COLORS.positive} />
              </View>
              <View>
                <ThemedText style={styles.transactionName}>Added to Wallet</ThemedText>
                <ThemedText style={styles.transactionDate}>Jan 10, 9:00 AM</ThemedText>
              </View>
            </View>
            <ThemedText style={styles.incomeAmount}>+$300.00</ThemedText>
          </View>
        </View>

        {/* Payment Methods Section */}
        <View style={styles.sectionHeader}>
          <ThemedText style={styles.sectionTitle}>Payment Methods</ThemedText>
          <TouchableOpacity>
            <ThemedText style={styles.seeAllText}>Manage</ThemedText>
          </TouchableOpacity>
        </View>

        <View style={styles.paymentMethodsContainer}>
          <View style={styles.paymentMethodCard}>
            <View style={styles.paymentMethodLeftSection}>
              <Ionicons name="card" size={32} color={BRAND_COLORS.secondary} />
              <View style={styles.paymentMethodDetails}>
                <ThemedText style={styles.paymentMethodName}>Raiffeisen Debit Card</ThemedText>
                <ThemedText style={styles.paymentMethodNumber}>**** 4582</ThemedText>
              </View>
            </View>
            <View style={styles.defaultBadge}>
              <ThemedText style={styles.defaultText}>Default</ThemedText>
            </View>
          </View>

          <TouchableOpacity style={styles.addPaymentButton}>
            <Ionicons name="add-circle-outline" size={22} color={BRAND_COLORS.secondary} />
            <ThemedText style={styles.addPaymentText}>Add Payment Method</ThemedText>
          </TouchableOpacity>
        </View>

        {/* Add space at the bottom for tab bar */}
        <View style={{ height: 80 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    backgroundColor: BRAND_COLORS.primary,
    paddingVertical: 30,
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
  },
  scrollContainer: {
    flex: 1,
    padding: 16,
  },
  balanceContainer: {
    borderRadius: 12,
    padding: 20,
    marginTop: 16,
    marginBottom: 24,
  },
  balanceLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: BRAND_COLORS.darkText,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: BRAND_COLORS.darkText,
    marginBottom: 12,
  },
  cardInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardIcon: {
    marginRight: 8,
  },
  cardNumber: {
    fontSize: 14,
    color: BRAND_COLORS.darkText,
    opacity: 0.8,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  actionButton: {
    alignItems: 'center',
    flex: 1,
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '500',
    color: BRAND_COLORS.darkText,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: BRAND_COLORS.darkText,
  },
  seeAllText: {
    fontSize: 14,
    color: BRAND_COLORS.secondary,
    fontWeight: '500',
  },
  transactionContainer: {
    marginBottom: 32,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  transactionLeftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  transactionName: {
    fontSize: 16,
    fontWeight: '500',
    color: BRAND_COLORS.darkText,
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 14,
    color: BRAND_COLORS.lightGray,
  },
  incomeAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: BRAND_COLORS.positive,
  },
  expenseAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: BRAND_COLORS.negative,
  },
  paymentMethodsContainer: {
    marginBottom: 32,
  },
  paymentMethodCard: {
    backgroundColor: '#F7F9FC',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  paymentMethodLeftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentMethodDetails: {
    marginLeft: 12,
  },
  paymentMethodName: {
    fontSize: 16,
    fontWeight: '500',
    color: BRAND_COLORS.darkText,
    marginBottom: 4,
  },
  paymentMethodNumber: {
    fontSize: 14,
    color: BRAND_COLORS.lightGray,
  },
  defaultBadge: {
    backgroundColor: BRAND_COLORS.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  defaultText: {
    fontSize: 12,
    fontWeight: '500',
    color: BRAND_COLORS.darkText,
  },
  addPaymentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
  },
  addPaymentText: {
    fontSize: 16,
    fontWeight: '500',
    color: BRAND_COLORS.secondary,
    marginLeft: 8,
  },
}); 