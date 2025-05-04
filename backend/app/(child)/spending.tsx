import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    FlatList,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import { Child, Transaction, getChildById, getTransactionsByUserId } from '@/app/mock-data';

// Raiffeisen Bank brand colors
const BRAND_COLORS = {
  primary: '#FFEE00', // Raiffeisen Yellow
  secondary: '#004E9E', // Raiffeisen Blue
  lightGray: '#AAAAAA',
  positive: '#4CAF50',
  negative: '#F44336',
  teal: '#37a69b',
};

// Mock child ID until we have auth
const MOCK_CHILD_ID = 'c1';

export default function SpendingScreen() {
  const router = useRouter();
  const [childData, setChildData] = useState<Child | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    // Load child data
    const child = getChildById(MOCK_CHILD_ID);
    if (child) {
      setChildData(child);
      
      // Load transactions
      const childTransactions = getTransactionsByUserId(MOCK_CHILD_ID);
      setTransactions(childTransactions);
    }
  }, []);

  if (!childData) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  // Filter transactions based on active tab and payment type
  const filteredTransactions = transactions.filter(tx => {
    if (activeTab === 'all') return tx.type === 'payment' || tx.type === 'withdrawal';
    if (activeTab === 'online') return tx.type === 'payment' && tx.category === 'Online';
    if (activeTab === 'shops') return tx.type === 'payment' && tx.category === 'Shopping';
    return false;
  });

  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };

  // Format date to friendly format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Get transaction icon based on category
  const getTransactionIcon = (category: string) => {
    switch (category) {
      case 'Shopping':
        return 'cart';
      case 'Food':
        return 'fast-food';
      case 'Entertainment':
        return 'film';
      case 'Online':
        return 'globe';
      default:
        return 'cash';
    }
  };

  // Render a transaction item
  const renderTransactionItem = ({ item }: { item: Transaction }) => {
    return (
      <View style={styles.transactionItem}>
        <View style={styles.transactionIcon}>
          <Ionicons 
            name={getTransactionIcon(item.category)} 
            size={20} 
            color={BRAND_COLORS.negative} 
          />
        </View>
        <View style={styles.transactionInfo}>
          <Text style={styles.transactionDescription}>{item.description}</Text>
          <Text style={styles.transactionDate}>{formatDate(item.date)}</Text>
        </View>
        <Text style={[styles.transactionAmount, { color: BRAND_COLORS.negative }]}>
          -{formatCurrency(item.amount)}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header with account balance */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.balanceContainer}>
          <Text style={styles.balanceLabel}>Spending Account</Text>
          <Text style={styles.balanceAmount}>{formatCurrency(childData.accounts.spending.balance)}</Text>
        </View>
      </View>

      <ScrollView style={styles.contentContainer} showsVerticalScrollIndicator={false}>
        {/* Quick actions */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionButton}>
            <View style={styles.actionIcon}>
              <Ionicons name="card" size={24} color={BRAND_COLORS.secondary} />
            </View>
            <Text style={styles.actionText}>Card</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <View style={styles.actionIcon}>
              <Ionicons name="swap-horizontal" size={24} color={BRAND_COLORS.secondary} />
            </View>
            <Text style={styles.actionText}>Transfer</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <View style={styles.actionIcon}>
              <Ionicons name="trending-down" size={24} color={BRAND_COLORS.secondary} />
            </View>
            <Text style={styles.actionText}>Requests</Text>
          </TouchableOpacity>
        </View>

        {/* Account details */}
        <View style={styles.detailsContainer}>
          <Text style={styles.detailsTitle}>Account Details</Text>
          
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Account Number</Text>
            <Text style={styles.detailValue}>**** {childData.accounts.spending.id.slice(-4)}</Text>
          </View>
          
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Restrictions</Text>
            <View style={styles.restrictionsContainer}>
              {childData.accounts.spending.restrictions.map((restriction, index) => (
                <View key={index} style={styles.restrictionTag}>
                  <Ionicons name="alert-circle" size={14} color={BRAND_COLORS.negative} />
                  <Text style={styles.restrictionText}>{restriction}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Transactions section */}
        <View style={styles.transactionsContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Spending</Text>
          </View>
          
          {/* Tabs for filtering */}
          <View style={styles.tabsContainer}>
            <TouchableOpacity 
              style={[styles.tab, activeTab === 'all' && styles.activeTab]}
              onPress={() => setActiveTab('all')}
            >
              <Text style={[styles.tabText, activeTab === 'all' && styles.activeTabText]}>All</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.tab, activeTab === 'online' && styles.activeTab]}
              onPress={() => setActiveTab('online')}
            >
              <Text style={[styles.tabText, activeTab === 'online' && styles.activeTabText]}>Online</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.tab, activeTab === 'shops' && styles.activeTab]}
              onPress={() => setActiveTab('shops')}
            >
              <Text style={[styles.tabText, activeTab === 'shops' && styles.activeTabText]}>Shops</Text>
            </TouchableOpacity>
          </View>

          {/* Transaction list */}
          <FlatList
            data={filteredTransactions}
            renderItem={renderTransactionItem}
            keyExtractor={item => item.id}
            scrollEnabled={false}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No spending transactions in this category</Text>
              </View>
            }
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  header: {
    backgroundColor: BRAND_COLORS.secondary,
    padding: 24,
    paddingTop: 60,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    zIndex: 10,
  },
  balanceContainer: {
    alignItems: 'center',
  },
  balanceLabel: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.8,
    marginBottom: 4,
  },
  balanceAmount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  contentContainer: {
    flex: 1,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: -20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  actionButton: {
    alignItems: 'center',
  },
  actionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  actionText: {
    fontSize: 12,
    color: '#333333',
  },
  detailsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    margin: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 16,
  },
  detailItem: {
    marginBottom: 16,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    color: '#333333',
  },
  restrictionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  restrictionTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  restrictionText: {
    fontSize: 12,
    color: BRAND_COLORS.negative,
    marginLeft: 4,
  },
  transactionsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    margin: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
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
    color: '#333333',
  },
  tabsContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  activeTab: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  tabText: {
    fontSize: 14,
    color: '#666666',
  },
  activeTabText: {
    color: BRAND_COLORS.secondary,
    fontWeight: '500',
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333333',
  },
  transactionDate: {
    fontSize: 12,
    color: '#777777',
    marginTop: 2,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '600',
  },
  separator: {
    height: 1,
    backgroundColor: '#F0F0F0',
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#999999',
  },
}); 