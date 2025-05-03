import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
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

// Mock children data
const childrenData = [
  {
    id: '1',
    name: 'Emma',
    age: 15,
    balance: 120.50,
    avatar: 'girl',
    isActive: true,
  },
  {
    id: '2',
    name: 'Noah',
    age: 13,
    balance: 75.25,
    avatar: 'boy',
    isActive: true,
  }
];

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      {/* Home Header - Using a custom header for the home screen */}
      <View style={styles.header}>
        <View>
          <ThemedText style={styles.welcomeText}>Hello,</ThemedText>
          <ThemedText style={styles.nameText}>Alex Smith</ThemedText>
        </View>
        <TouchableOpacity style={styles.avatarContainer} onPress={() => router.push('/(tabs)/profile')}>
          <Ionicons name="person-circle" size={40} color={BRAND_COLORS.secondary} />
        </TouchableOpacity>
      </View>

      {/* Children Accounts Icons */}
      <View style={styles.childrenIconsContainer}>
        <View style={styles.childrenIconsHeader}>
          <ThemedText style={styles.childrenIconsTitle}>Children</ThemedText>
          <TouchableOpacity onPress={() => router.push('/(tabs)/family')}>
            <ThemedText style={styles.manageText}>Manage</ThemedText>
          </TouchableOpacity>
        </View>
        
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.childrenIconsScroll}
        >
          {childrenData.map(child => (
            <TouchableOpacity 
              key={child.id}
              style={styles.childIconButton}
              onPress={() => router.push({
                pathname: '/child-details',
                params: { id: child.id }
              })}
            >
              <View style={[
                styles.childAvatar, 
                { 
                  backgroundColor: child.avatar === 'girl' ? '#FFC0CB' : '#ADD8E6',
                  borderColor: child.isActive ? BRAND_COLORS.positive : '#F44336',
                }
              ]}>
                <Ionicons name="person" size={24} color={BRAND_COLORS.secondary} />
              </View>
              <ThemedText style={styles.childIconName}>{child.name}</ThemedText>
              <ThemedText style={styles.childIconBalance}>${child.balance.toFixed(2)}</ThemedText>
            </TouchableOpacity>
          ))}
          
          <TouchableOpacity 
            style={styles.addChildIconButton}
            onPress={() => router.push('/(tabs)/family')}
          >
            <View style={styles.addChildAvatar}>
              <Ionicons name="add" size={28} color={BRAND_COLORS.secondary} />
            </View>
            <ThemedText style={styles.addChildText}>Add</ThemedText>
            <ThemedText style={styles.addChildSubtext}>Child</ThemedText>
          </TouchableOpacity>
        </ScrollView>
      </View>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Wallet Card */}
        <View style={styles.walletCard}>
          {/* Total Balance */}
          <View style={[styles.balanceContainer, { backgroundColor: BRAND_COLORS.primary }]}>
            <ThemedText style={styles.balanceLabel}>Parent's Wallet</ThemedText>
            <View style={styles.balanceRow}>
              <ThemedText style={styles.balanceAmount}>$1,287.45</ThemedText>
              <TouchableOpacity style={styles.addMoneyButton} onPress={() => router.push('/(tabs)/wallet')}>
                <ThemedText style={styles.addMoneyText}>Add $</ThemedText>
              </TouchableOpacity>
            </View>
          </View>
          
          {/* Autofunding Section */}
          <TouchableOpacity style={styles.autofundingContainer} onPress={() => router.push('/(tabs)/wallet')}>
            <View style={styles.autofundingTextContainer}>
              <ThemedText style={styles.autofundingTitle}>Set up autofunding</ThemedText>
              <ThemedText style={styles.autofundingDescription}>Make sure you always have money to send to your kids.</ThemedText>
            </View>
            <Ionicons name="chevron-forward" size={20} color={BRAND_COLORS.lightGray} />
          </TouchableOpacity>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsContainer}>
          <TouchableOpacity style={styles.quickActionButton} onPress={() => router.push('/(tabs)/wallet')}>
            <View style={[styles.actionIcon, { backgroundColor: '#E8F5FF' }]}>
              <Ionicons name="add-circle-outline" size={22} color={BRAND_COLORS.secondary} />
            </View>
            <ThemedText style={styles.actionText}>Add Money</ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.quickActionButton} onPress={() => router.push('/(tabs)/wallet')}>
            <View style={[styles.actionIcon, { backgroundColor: '#F9F0FF' }]}>
              <Ionicons name="swap-horizontal" size={22} color={BRAND_COLORS.secondary} />
            </View>
            <ThemedText style={styles.actionText}>Transfer</ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.quickActionButton} onPress={() => router.push('/(tabs)/family')}>
            <View style={[styles.actionIcon, { backgroundColor: '#E8F5E9' }]}>
              <Ionicons name="card-outline" size={22} color={BRAND_COLORS.secondary} />
            </View>
            <ThemedText style={styles.actionText}>Cards</ThemedText>
          </TouchableOpacity>
        </View>

        {/* Notifications Section */}
        <View style={styles.notificationsContainer}>
          <View style={styles.notificationsHeader}>
            <ThemedText style={styles.notificationsTitle}>NOTIFICATIONS (3 OF 9)</ThemedText>
            <Ionicons name="chevron-forward" size={20} color={BRAND_COLORS.lightGray} />
          </View>
          
          {/* Notification Item */}
          <View style={styles.notificationItem}>
            <View style={[styles.notificationDot, { backgroundColor: '#F44336' }]} />
            <View style={styles.notificationContent}>
              <ThemedText style={styles.notificationTitle}>Add money to wallet</ThemedText>
              <ThemedText style={styles.notificationDescription}>Wallet balance is negative</ThemedText>
            </View>
          </View>
          
          {/* Notification Item */}
          <View style={styles.notificationItem}>
            <View style={[styles.notificationDot, { backgroundColor: '#FFC107' }]} />
            <View style={styles.notificationContent}>
              <ThemedText style={styles.notificationTitle}>Activate Emma's card</ThemedText>
            </View>
          </View>
          
          {/* Notification Item */}
          <View style={styles.notificationItem}>
            <View style={[styles.notificationDot, { backgroundColor: '#FFC107' }]} />
            <View style={styles.notificationContent}>
              <ThemedText style={styles.notificationTitle}>New allowance feature</ThemedText>
              <ThemedText style={styles.notificationDescription}>Autofunding for allowances</ThemedText>
            </View>
          </View>
        </View>

        {/* Recent Transactions */}
        <View style={styles.sectionHeader}>
          <ThemedText style={styles.sectionTitle}>Recent Transactions</ThemedText>
          <TouchableOpacity onPress={() => router.push('/(tabs)/wallet')}>
            <ThemedText style={[styles.seeAllText, { color: BRAND_COLORS.secondary }]}>See All</ThemedText>
          </TouchableOpacity>
        </View>

        {/* Transaction 1 */}
        <View style={styles.transactionItem}>
          <View style={styles.transactionLeftSection}>
            <View style={[styles.transactionIcon, { backgroundColor: '#FFF8E1' }]}>
              <Ionicons name="people-outline" size={20} color={BRAND_COLORS.secondary} />
            </View>
            <View>
              <ThemedText style={styles.transactionName}>Transfer to Emma</ThemedText>
              <ThemedText style={styles.transactionDate}>Today, 4:15 PM</ThemedText>
            </View>
          </View>
          <ThemedText style={styles.transactionAmount}>-$50.00</ThemedText>
        </View>

        {/* Transaction 2 */}
        <View style={styles.transactionItem}>
          <View style={styles.transactionLeftSection}>
            <View style={[styles.transactionIcon, { backgroundColor: '#E8F5E9' }]}>
              <Ionicons name="arrow-up" size={20} color={BRAND_COLORS.positive} />
            </View>
            <View>
              <ThemedText style={styles.transactionName}>Added to Wallet</ThemedText>
              <ThemedText style={styles.transactionDate}>Yesterday, 9:00 AM</ThemedText>
            </View>
          </View>
          <ThemedText style={styles.incomeAmount}>+$200.00</ThemedText>
        </View>

        {/* Transaction 3 */}
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
          <ThemedText style={styles.transactionAmount}>-$30.00</ThemedText>
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
    marginBottom: 16
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
  childrenIconsContainer: {
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  childrenIconsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  childrenIconsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333'
  },
  manageText: {
    fontSize: 14,
    fontWeight: '500',
    color: BRAND_COLORS.secondary
  },
  childrenIconsScroll: {
    paddingRight: 16,
  },
  childIconButton: {
    alignItems: 'center',
    marginRight: 16,
    width: 70,
  },
  childAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  childIconName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333333',
    marginBottom: 2,
  },
  childIconBalance: {
    fontSize: 12,
    color: BRAND_COLORS.secondary,
    fontWeight: '600',
  },
  addChildIconButton: {
    alignItems: 'center',
    width: 70,
  },
  addChildAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: BRAND_COLORS.secondary,
    backgroundColor: 'rgba(0, 78, 158, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  addChildText: {
    fontSize: 14,
    fontWeight: '500',
    color: BRAND_COLORS.secondary,
    marginBottom: 0,
  },
  addChildSubtext: {
    fontSize: 12,
    color: '#777777',
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 16
  },
  walletCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  balanceContainer: {
    padding: 16,
  },
  balanceLabel: {
    fontSize: 16,
    color: BRAND_COLORS.darkText,
    marginBottom: 8,
    fontWeight: '500',
  },
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: BRAND_COLORS.darkText,
  },
  addMoneyButton: {
    backgroundColor: '#37797D',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 24,
  },
  addMoneyText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  autofundingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  autofundingTextContainer: {
    flex: 1,
  },
  autofundingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: BRAND_COLORS.darkText,
    marginBottom: 4,
  },
  autofundingDescription: {
    fontSize: 14,
    color: '#666666',
  },
  viewDetailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewDetailsText: {
    fontSize: 14,
    fontWeight: '500',
    color: BRAND_COLORS.secondary,
    marginRight: 4,
  },
  quickActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24
  },
  quickActionButton: {
    alignItems: 'center',
    flex: 1
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8
  },
  actionText: {
    fontSize: 12,
    color: '#555555'
  },
  notificationsContainer: {
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    marginBottom: 24,
    overflow: 'hidden',
  },
  notificationsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  notificationsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#555555',
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  notificationDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 16,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333333',
    marginBottom: 4,
  },
  notificationDescription: {
    fontSize: 14,
    color: '#666666',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333'
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '500'
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0'
  },
  transactionLeftSection: {
    flexDirection: 'row',
    alignItems: 'center'
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
    fontSize: 14,
    fontWeight: '500',
    color: '#333333',
    marginBottom: 4
  },
  transactionDate: {
    fontSize: 12,
    color: '#777777'
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: BRAND_COLORS.negative
  },
  incomeAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: BRAND_COLORS.positive
  }
});
