import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Platform, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

import { ThemedText } from '@/components/ThemedText';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <ThemedText style={styles.welcomeText}>Hello,</ThemedText>
          <ThemedText style={styles.nameText}>Alex Smith</ThemedText>
        </View>
        <TouchableOpacity style={styles.avatarContainer}>
          <Ionicons name="person-circle" size={40} color="#5BCFB8" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Total Balance */}
        <View style={styles.balanceContainer}>
          <ThemedText style={styles.balanceLabel}>Total Balance</ThemedText>
          <ThemedText style={styles.balanceAmount}>$1,287.45</ThemedText>
          <View style={styles.growthContainer}>
            <Ionicons name="arrow-up" size={16} color="#4CAF50" />
            <ThemedText style={styles.growthText}>+$56.80 this month</ThemedText>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsContainer}>
          <TouchableOpacity style={styles.quickActionButton}>
            <View style={[styles.actionIcon, { backgroundColor: '#E8F5FF' }]}>
              <Ionicons name="swap-horizontal" size={22} color="#2196F3" />
            </View>
            <ThemedText style={styles.actionText}>Transfer</ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.quickActionButton}>
            <View style={[styles.actionIcon, { backgroundColor: '#F9F0FF' }]}>
              <Ionicons name="add-circle-outline" size={22} color="#9C27B0" />
            </View>
            <ThemedText style={styles.actionText}>Add Money</ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.quickActionButton}>
            <View style={[styles.actionIcon, { backgroundColor: '#E8F5E9' }]}>
              <Ionicons name="card-outline" size={22} color="#4CAF50" />
            </View>
            <ThemedText style={styles.actionText}>Pay</ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.quickActionButton}>
            <View style={[styles.actionIcon, { backgroundColor: '#FFF8E1' }]}>
              <Ionicons name="options-outline" size={22} color="#FFC107" />
            </View>
            <ThemedText style={styles.actionText}>More</ThemedText>
          </TouchableOpacity>
        </View>

        {/* Accounts Section */}
        <View style={styles.sectionHeader}>
          <ThemedText style={styles.sectionTitle}>Your Accounts</ThemedText>
          <TouchableOpacity>
            <ThemedText style={styles.seeAllText}>See All</ThemedText>
          </TouchableOpacity>
        </View>

        {/* Spending Account */}
        <TouchableOpacity style={styles.accountCard}>
          <View style={styles.accountLeftSection}>
            <View style={[styles.accountIcon, { backgroundColor: '#E8F5FF' }]}>
              <Ionicons name="card" size={24} color="#2196F3" />
            </View>
            <View>
              <ThemedText style={styles.accountName}>Spending Account</ThemedText>
              <ThemedText style={styles.accountNumber}>**** 4582</ThemedText>
            </View>
          </View>
          <View>
            <ThemedText style={styles.accountBalance}>$752.30</ThemedText>
            <ThemedText style={styles.availableText}>Available</ThemedText>
          </View>
        </TouchableOpacity>

        {/* Savings Account */}
        <TouchableOpacity style={styles.accountCard}>
          <View style={styles.accountLeftSection}>
            <View style={[styles.accountIcon, { backgroundColor: '#E8F5E9' }]}>
              <Ionicons name="leaf" size={24} color="#4CAF50" />
            </View>
            <View>
              <ThemedText style={styles.accountName}>Savings Account</ThemedText>
              <ThemedText style={styles.accountNumber}>**** 7865</ThemedText>
            </View>
          </View>
          <View>
            <ThemedText style={styles.accountBalance}>$535.15</ThemedText>
            <ThemedText style={styles.availableText}>Available</ThemedText>
          </View>
        </TouchableOpacity>

        {/* Savings Goals Section */}
        <View style={styles.sectionHeader}>
          <ThemedText style={styles.sectionTitle}>Savings Goals</ThemedText>
          <TouchableOpacity>
            <ThemedText style={styles.seeAllText}>See All</ThemedText>
          </TouchableOpacity>
        </View>

        {/* Laptop Goal */}
        <TouchableOpacity style={styles.goalCard}>
          <View style={styles.accountLeftSection}>
            <View style={[styles.accountIcon, { backgroundColor: '#F9F0FF' }]}>
              <Ionicons name="laptop-outline" size={24} color="#9C27B0" />
            </View>
            <View>
              <ThemedText style={styles.accountName}>New Laptop</ThemedText>
              <View style={styles.progressBarContainer}>
                <View style={[styles.progressBar, { width: '100%' }]} />
              </View>
            </View>
          </View>
          <View>
            <ThemedText style={styles.accountBalance}>$479.00</ThemedText>
            <ThemedText style={styles.goalComplete}>Completed!</ThemedText>
          </View>
        </TouchableOpacity>

        {/* Vacation Goal */}
        <TouchableOpacity style={styles.goalCard}>
          <View style={styles.accountLeftSection}>
            <View style={[styles.accountIcon, { backgroundColor: '#FFF8E1' }]}>
              <Ionicons name="airplane-outline" size={24} color="#FFC107" />
            </View>
            <View style={{ flex: 1 }}>
              <ThemedText style={styles.accountName}>Summer Vacation</ThemedText>
              <View style={styles.progressBarContainer}>
                <View style={[styles.progressBar, { width: '45%' }]} />
              </View>
            </View>
          </View>
          <View>
            <ThemedText style={styles.accountBalance}>$450/$1000</ThemedText>
            <ThemedText style={styles.availableText}>45% saved</ThemedText>
          </View>
        </TouchableOpacity>

        {/* Recent Transactions */}
        <View style={styles.sectionHeader}>
          <ThemedText style={styles.sectionTitle}>Recent Transactions</ThemedText>
          <TouchableOpacity>
            <ThemedText style={styles.seeAllText}>See All</ThemedText>
          </TouchableOpacity>
        </View>

        {/* Transaction 1 */}
        <View style={styles.transactionItem}>
          <View style={styles.accountLeftSection}>
            <View style={[styles.transactionIcon, { backgroundColor: '#FFEBEE' }]}>
              <Ionicons name="fast-food-outline" size={20} color="#F44336" />
            </View>
            <View>
              <ThemedText style={styles.transactionName}>Burger King</ThemedText>
              <ThemedText style={styles.transactionDate}>Today, 2:34 PM</ThemedText>
            </View>
          </View>
          <ThemedText style={styles.transactionAmount}>-$12.40</ThemedText>
        </View>

        {/* Transaction 2 */}
        <View style={styles.transactionItem}>
          <View style={styles.accountLeftSection}>
            <View style={[styles.transactionIcon, { backgroundColor: '#E8F5E9' }]}>
              <Ionicons name="arrow-down" size={20} color="#4CAF50" />
            </View>
            <View>
              <ThemedText style={styles.transactionName}>Allowance</ThemedText>
              <ThemedText style={styles.transactionDate}>Yesterday, 9:00 AM</ThemedText>
            </View>
          </View>
          <ThemedText style={styles.incomeAmount}>+$50.00</ThemedText>
        </View>

        {/* Transaction 3 */}
        <View style={styles.transactionItem}>
          <View style={styles.accountLeftSection}>
            <View style={[styles.transactionIcon, { backgroundColor: '#E0F7FA' }]}>
              <Ionicons name="musical-notes-outline" size={20} color="#00BCD4" />
            </View>
            <View>
              <ThemedText style={styles.transactionName}>Spotify</ThemedText>
              <ThemedText style={styles.transactionDate}>Jan 15, 10:22 AM</ThemedText>
            </View>
          </View>
          <ThemedText style={styles.transactionAmount}>-$9.99</ThemedText>
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
    paddingTop: Platform.OS === 'ios' ? 50 : 30
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 20
  },
  welcomeText: {
    fontSize: 16,
    color: '#666666'
  },
  nameText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333'
  },
  avatarContainer: {
    height: 40,
    width: 40,
    borderRadius: 20
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 16
  },
  balanceContainer: {
    backgroundColor: '#5BCFB8',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20
  },
  balanceLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 5
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10
  },
  growthContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start'
  },
  growthText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#FFFFFF'
  },
  quickActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24
  },
  quickActionButton: {
    alignItems: 'center'
  },
  actionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8
  },
  actionText: {
    fontSize: 12,
    color: '#666666'
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333'
  },
  seeAllText: {
    fontSize: 14,
    color: '#5BCFB8'
  },
  accountCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    // Shadow for Android
    elevation: 2
  },
  goalCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    // Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2
  },
  accountLeftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1
  },
  accountIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12
  },
  accountName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333333',
    marginBottom: 4
  },
  accountNumber: {
    fontSize: 13,
    color: '#999999'
  },
  accountBalance: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333333',
    textAlign: 'right'
  },
  availableText: {
    fontSize: 12,
    color: '#999999',
    textAlign: 'right'
  },
  goalComplete: {
    fontSize: 12,
    color: '#4CAF50',
    textAlign: 'right',
    fontWeight: '500'
  },
  progressBarContainer: {
    height: 4,
    backgroundColor: '#F0F0F0',
    borderRadius: 2,
    overflow: 'hidden',
    width: '100%',
    marginTop: 4
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#5BCFB8',
    borderRadius: 2
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0'
  },
  transactionIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12
  },
  transactionName: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333333'
  },
  transactionDate: {
    fontSize: 13,
    color: '#999999',
    marginTop: 2
  },
  transactionAmount: {
    fontSize: 15,
    fontWeight: '600',
    color: '#F44336'
  },
  incomeAmount: {
    fontSize: 15,
    fontWeight: '600',
    color: '#4CAF50'
  }
});
