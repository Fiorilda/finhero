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

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <ThemedText style={styles.welcomeText}>Hello,</ThemedText>
          <ThemedText style={styles.nameText}>Alex Smith</ThemedText>
        </View>
        <TouchableOpacity style={styles.avatarContainer} onPress={() => router.push('/(tabs)/profile')}>
          <Ionicons name="person-circle" size={40} color={BRAND_COLORS.secondary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Total Balance */}
        <View style={[styles.balanceContainer, { backgroundColor: BRAND_COLORS.primary }]}>
          <ThemedText style={styles.balanceLabel}>Wallet Balance</ThemedText>
          <ThemedText style={styles.balanceAmount}>$1,287.45</ThemedText>
          <TouchableOpacity style={styles.viewDetailsButton} onPress={() => router.push('/(tabs)/wallet')}>
            <ThemedText style={styles.viewDetailsText}>View Details</ThemedText>
            <Ionicons name="chevron-forward" size={16} color={BRAND_COLORS.secondary} />
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
              <Ionicons name="people" size={22} color={BRAND_COLORS.secondary} />
            </View>
            <ThemedText style={styles.actionText}>Family</ThemedText>
          </TouchableOpacity>
        </View>

        {/* Children Accounts Section */}
        <View style={styles.sectionHeader}>
          <ThemedText style={styles.sectionTitle}>Children Accounts</ThemedText>
          <TouchableOpacity onPress={() => router.push('/(tabs)/family')}>
            <ThemedText style={[styles.seeAllText, { color: BRAND_COLORS.secondary }]}>See All</ThemedText>
          </TouchableOpacity>
        </View>

        {/* Child Account Cards */}
        <TouchableOpacity 
          style={styles.childCard}
          onPress={() => router.push('/(tabs)/family')}
        >
          <View style={styles.childLeftSection}>
            <View style={[styles.childAvatar, { backgroundColor: '#FFC0CB' }]}>
              <Ionicons name="person" size={24} color={BRAND_COLORS.secondary} />
            </View>
            <View>
              <ThemedText style={styles.childName}>Emma Smith</ThemedText>
              <ThemedText style={styles.childAge}>12 years old</ThemedText>
            </View>
          </View>
          <View>
            <ThemedText style={styles.childBalance}>$120.50</ThemedText>
            <ThemedText style={styles.availableText}>Available</ThemedText>
          </View>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.childCard}
          onPress={() => router.push('/(tabs)/family')}
        >
          <View style={styles.childLeftSection}>
            <View style={[styles.childAvatar, { backgroundColor: '#ADD8E6' }]}>
              <Ionicons name="person" size={24} color={BRAND_COLORS.secondary} />
            </View>
            <View>
              <ThemedText style={styles.childName}>Noah Smith</ThemedText>
              <ThemedText style={styles.childAge}>8 years old</ThemedText>
            </View>
          </View>
          <View>
            <ThemedText style={styles.childBalance}>$75.25</ThemedText>
            <ThemedText style={styles.availableText}>Available</ThemedText>
          </View>
        </TouchableOpacity>

        {/* Add Child Button */}
        <TouchableOpacity 
          style={styles.addChildButton}
          onPress={() => router.push('/(tabs)/family')}
        >
          <Ionicons name="add-circle-outline" size={22} color={BRAND_COLORS.secondary} />
          <ThemedText style={styles.addChildText}>Add a Child</ThemedText>
        </TouchableOpacity>

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
    borderRadius: 12,
    padding: 20,
    marginBottom: 24
  },
  balanceLabel: {
    fontSize: 14,
    color: BRAND_COLORS.darkText,
    marginBottom: 8
  },
  balanceAmount: {
    fontSize: 30,
    fontWeight: 'bold',
    color: BRAND_COLORS.darkText,
    marginBottom: 8
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
    marginBottom: 32
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
  childCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2
  },
  childLeftSection: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  childAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12
  },
  childName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4
  },
  childAge: {
    fontSize: 12,
    color: '#777777'
  },
  childBalance: {
    fontSize: 16,
    fontWeight: 'bold',
    color: BRAND_COLORS.secondary,
    textAlign: 'right',
    marginBottom: 4
  },
  availableText: {
    fontSize: 12,
    color: '#777777',
    textAlign: 'right'
  },
  addChildButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#DDDDDD',
    borderRadius: 12,
    padding: 16,
    marginBottom: 32
  },
  addChildText: {
    marginLeft: 8,
    color: BRAND_COLORS.secondary,
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
  },
});
