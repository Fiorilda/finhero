import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import {
  Child,
  Transaction,
  getChildById,
  getTransactionsByUserId
} from '@/app/mock-data';

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

export default function ChildMoneyScreen() {
  const router = useRouter();
  const [childData, setChildData] = useState<Child | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  const loadData = () => {
    // Load child data
    const child = getChildById(MOCK_CHILD_ID);
    if (child) {
      setChildData(child);
      
      // Load transactions
      const childTransactions = getTransactionsByUserId(MOCK_CHILD_ID);
      setTransactions(childTransactions);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
    setTimeout(() => setRefreshing(false), 1000);
  };

  if (!childData) {
    return (
      <View style={styles.centerContent}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const totalBalance = childData.accounts.spending.balance + 
                       childData.accounts.savings.balance + 
                       (childData.accounts.investing?.balance || 0);

  const spendingBalance = childData.accounts.spending.balance;
  const savingsBalance = childData.accounts.savings.balance;
  const investingBalance = childData.accounts.investing?.balance || 0;

  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };

  // Format date to friendly format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Get transaction icon based on type
  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return 'arrow-down-circle';
      case 'withdrawal':
        return 'arrow-up-circle';
      case 'transfer':
        return 'swap-horizontal';
      case 'payment':
        return 'cart';
      case 'allowance':
        return 'calendar';
      case 'chore':
        return 'checkbox';
      default:
        return 'help-circle';
    }
  };

  // Render a transaction item
  const renderTransactionItem = ({ item }: { item: Transaction }) => {
    const isIncome = ['deposit', 'allowance', 'chore'].includes(item.type);
    
    return (
      <View style={styles.transactionItem}>
        <View style={[styles.transactionIcon, { backgroundColor: isIncome ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)' }]}>
          <Ionicons 
            name={getTransactionIcon(item.type)} 
            size={20} 
            color={isIncome ? BRAND_COLORS.positive : BRAND_COLORS.negative} 
          />
        </View>
        <View style={styles.transactionInfo}>
          <Text style={styles.transactionDescription}>{item.description}</Text>
          <Text style={styles.transactionDate}>{formatDate(item.date)}</Text>
        </View>
        <Text style={[styles.transactionAmount, { color: isIncome ? BRAND_COLORS.positive : BRAND_COLORS.negative }]}>
          {isIncome ? '+' : '-'}{formatCurrency(item.amount)}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContentContainer}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[BRAND_COLORS.secondary]}
            tintColor={BRAND_COLORS.secondary}
            progressViewOffset={10}
          />
        }
      >
        {/* Header with total balance */}
        <View style={styles.header}>
          <View style={styles.balanceContainer}>
            <Text style={styles.balanceLabel}>Total Balance</Text>
            <Text style={styles.balanceAmount}>{formatCurrency(totalBalance)}</Text>
          </View>
        </View>
        
        {/* Account cards */}
        <View style={styles.accountsContainer}>
          {/* Spending account */}
          <TouchableOpacity 
            style={[styles.accountCard, { backgroundColor: BRAND_COLORS.secondary }]}
            onPress={() => router.push('/spending')}
          >
            <View style={styles.accountHeader}>
              <Ionicons name="card" size={24} color="#FFFFFF" />
              <Text style={styles.accountType}>Spending</Text>
            </View>
            <Text style={styles.accountBalance}>{formatCurrency(spendingBalance)}</Text>
          </TouchableOpacity>
          
          {/* Savings account */}
          <TouchableOpacity 
            style={[styles.accountCard, { backgroundColor: BRAND_COLORS.teal }]}
            onPress={() => router.push('/goals')}
          >
            <View style={styles.accountHeader}>
              <Ionicons name="save" size={24} color="#FFFFFF" />
              <Text style={styles.accountType}>Savings</Text>
            </View>
            <Text style={styles.accountBalance}>{formatCurrency(savingsBalance)}</Text>
          </TouchableOpacity>
          
          {/* Investing account (if available) */}
          {childData.accounts.investing && (
            <TouchableOpacity 
              style={[styles.accountCard, { backgroundColor: '#8E44AD' }]}
              onPress={() => router.push('/investing')}
            >
              <View style={styles.accountHeader}>
                <Ionicons name="trending-up" size={24} color="#FFFFFF" />
                <Text style={styles.accountType}>Investing</Text>
              </View>
              <Text style={styles.accountBalance}>{formatCurrency(investingBalance)}</Text>
            </TouchableOpacity>
          )}
        </View>
        
        {/* Action Buttons */}
        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity style={styles.actionButton}>
            <View style={[styles.actionButtonIcon, { backgroundColor: '#E3F2FD' }]}>
              <Ionicons name="arrow-forward" size={20} color={BRAND_COLORS.secondary} />
            </View>
            <Text style={styles.actionButtonLabel}>Send Money</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <View style={[styles.actionButtonIcon, { backgroundColor: '#E8F5E9' }]}>
              <Ionicons name="add" size={20} color={BRAND_COLORS.positive} />
            </View>
            <Text style={styles.actionButtonLabel}>Add Money</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <View style={[styles.actionButtonIcon, { backgroundColor: '#F5F5F5' }]}>
              <Ionicons name="settings-outline" size={20} color="#757575" />
            </View>
            <Text style={styles.actionButtonLabel}>Settings</Text>
          </TouchableOpacity>
        </View>
        
        {/* Transactions Section */}
        <View style={styles.transactionsContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Transactions</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          {/* Transaction Filters */}
          <View style={styles.tabContainer}>
            <TouchableOpacity 
              style={[styles.tab, activeTab === 'all' && styles.activeTab]}
              onPress={() => setActiveTab('all')}
            >
              <Text style={[styles.tabText, activeTab === 'all' && styles.activeTabText]}>
                All
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.tab, activeTab === 'in' && styles.activeTab]}
              onPress={() => setActiveTab('in')}
            >
              <Text style={[styles.tabText, activeTab === 'in' && styles.activeTabText]}>
                Money In
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.tab, activeTab === 'out' && styles.activeTab]}
              onPress={() => setActiveTab('out')}
            >
              <Text style={[styles.tabText, activeTab === 'out' && styles.activeTabText]}>
                Money Out
              </Text>
            </TouchableOpacity>
          </View>
          
          {/* Transaction List */}
          {transactions.length > 0 ? (
            <FlatList
              data={transactions.slice(0, 5)} // Show only latest 5 transactions
              renderItem={renderTransactionItem}
              keyExtractor={item => item.id}
              scrollEnabled={false}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>No transactions to display</Text>
                </View>
              }
            />
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No transactions to display</Text>
            </View>
          )}
        </View>
        
        {/* Bottom spacing */}
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContentContainer: {
    paddingBottom: 40,
  },
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    backgroundColor: BRAND_COLORS.primary,
    padding: 24,
    paddingTop: 40,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  balanceContainer: {
    alignItems: 'center',
  },
  balanceLabel: {
    fontSize: 16,
    color: '#333333',
    marginBottom: 4,
  },
  balanceAmount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#333333',
  },
  accountsContainer: {
    padding: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  accountCard: {
    width: '48%',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  accountHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  accountType: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  accountBalance: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 16,
    marginBottom: 16,
  },
  actionButton: {
    alignItems: 'center',
  },
  actionButtonIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  actionButtonLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#666666',
  },
  transactionsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
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
  seeAllText: {
    fontSize: 14,
    color: BRAND_COLORS.secondary,
  },
  tabContainer: {
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
    fontWeight: '500',
    color: '#666666',
  },
  activeTabText: {
    color: BRAND_COLORS.secondary,
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