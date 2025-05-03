import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Dimensions,
    FlatList,
    RefreshControl,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';

import {
    Child,
    Transaction,
    children,
    getTransactionsByUserId
} from '@/app/mock-data';
import { ThemedText } from '@/components/ThemedText';

// Raiffeisen Bank brand colors
const BRAND_COLORS = {
  primary: '#FFEE00', // Raiffeisen Yellow
  secondary: '#004E9E', // Raiffeisen Blue
  lightGray: '#AAAAAA',
  positive: '#4CAF50',
  teal: '#37a69b',
};

// Using mock child ID until we have auth
const MOCK_CHILD_ID = 'c1';

export default function ChildMoneyScreen() {
  const router = useRouter();
  const [childData, setChildData] = useState<Child | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  const loadData = () => {
    // Get child data
    const child = children.find(c => c.id === MOCK_CHILD_ID);
    if (child) setChildData(child);

    // Get transactions
    const childTransactions = getTransactionsByUserId(MOCK_CHILD_ID);
    setTransactions(childTransactions);
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
        <ThemedText>Loading...</ThemedText>
      </View>
    );
  }

  // Calculate balances
  const spendingBalance = childData.accounts.spending.balance;
  const savingsBalance = childData.accounts.savings.balance;
  const investingBalance = childData.accounts.investing?.balance || 0;
  const totalBalance = spendingBalance + savingsBalance + investingBalance;

  // Filter transactions based on active tab
  const filteredTransactions = transactions.filter(tx => {
    if (activeTab === 'all') return true;
    if (activeTab === 'in' && 
        (tx.type === 'allowance' || tx.type === 'chore' || tx.type === 'deposit')) return true;
    if (activeTab === 'out' && 
        (tx.type === 'payment' || tx.type === 'withdrawal')) return true;
    return false;
  });

  const renderTransactionItem = ({ item }: { item: Transaction }) => (
    <TouchableOpacity style={styles.transactionItem}>
      <View style={styles.transactionIconContainer}>
        {item.type === 'allowance' && <Ionicons name="cash" size={20} color={BRAND_COLORS.positive} />}
        {item.type === 'chore' && <Ionicons name="checkbox" size={20} color={BRAND_COLORS.teal} />}
        {item.type === 'deposit' && <Ionicons name="arrow-down" size={20} color={BRAND_COLORS.positive} />}
        {item.type === 'payment' && <Ionicons name="cart" size={20} color="#F44336" />}
        {item.type === 'transfer' && <Ionicons name="swap-horizontal" size={20} color={BRAND_COLORS.secondary} />}
        {item.type === 'withdrawal' && <Ionicons name="arrow-up" size={20} color="#F44336" />}
      </View>
      <View style={styles.transactionContent}>
        <ThemedText style={styles.transactionDescription}>{item.description}</ThemedText>
        <ThemedText style={styles.transactionDate}>
          {new Date(item.date).toLocaleDateString()}
        </ThemedText>
      </View>
      <ThemedText 
        style={[
          styles.transactionAmount,
          item.type === 'payment' || item.type === 'withdrawal' 
            ? styles.negativeAmount 
            : styles.positiveAmount
        ]}
      >
        {item.type === 'payment' || item.type === 'withdrawal' ? '-' : '+'}${item.amount.toFixed(2)}
      </ThemedText>
    </TouchableOpacity>
  );

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
        {/* Balance Card */}
        <View style={styles.balanceCard}>
          <ThemedText style={styles.balanceTitle}>Total Balance</ThemedText>
          <ThemedText style={styles.balanceAmount}>${totalBalance.toFixed(2)}</ThemedText>
          
          <View style={styles.accountCardsContainer}>
            {/* Spending Account */}
            <View style={[styles.accountCard, { backgroundColor: '#E3F2FD' }]}>
              <View style={styles.accountIconContainer}>
                <Ionicons name="card" size={24} color={BRAND_COLORS.secondary} />
              </View>
              <ThemedText style={styles.accountLabel}>Spending</ThemedText>
              <ThemedText style={styles.accountBalance}>${spendingBalance.toFixed(2)}</ThemedText>
              <TouchableOpacity style={styles.accountAction}>
                <ThemedText style={styles.accountActionText}>View</ThemedText>
              </TouchableOpacity>
            </View>
            
            {/* Savings Account */}
            <View style={[styles.accountCard, { backgroundColor: '#E8F5E9' }]}>
              <View style={styles.accountIconContainer}>
                <Ionicons name="save" size={24} color={BRAND_COLORS.positive} />
              </View>
              <ThemedText style={styles.accountLabel}>Savings</ThemedText>
              <ThemedText style={styles.accountBalance}>${savingsBalance.toFixed(2)}</ThemedText>
              <TouchableOpacity 
                style={styles.accountAction}
                onPress={() => router.push('/(child)/goals')}
              >
                <ThemedText style={styles.accountActionText}>View Goals</ThemedText>
              </TouchableOpacity>
            </View>
            
            {/* Investing Account (if exists) */}
            {childData.accounts.investing && (
              <View style={[styles.accountCard, { backgroundColor: '#FFF9C4' }]}>
                <View style={styles.accountIconContainer}>
                  <Ionicons name="trending-up" size={24} color="#FF9800" />
                </View>
                <ThemedText style={styles.accountLabel}>Investing</ThemedText>
                <ThemedText style={styles.accountBalance}>${investingBalance.toFixed(2)}</ThemedText>
                <TouchableOpacity 
                  style={styles.accountAction}
                  onPress={() => router.push('/(child)/investing')}
                >
                  <ThemedText style={styles.accountActionText}>View Stocks</ThemedText>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
        
        {/* Action Buttons */}
        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity style={styles.actionButton}>
            <View style={[styles.actionButtonIcon, { backgroundColor: '#E3F2FD' }]}>
              <Ionicons name="arrow-forward" size={20} color={BRAND_COLORS.secondary} />
            </View>
            <ThemedText style={styles.actionButtonLabel}>Send Money</ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <View style={[styles.actionButtonIcon, { backgroundColor: '#E8F5E9' }]}>
              <Ionicons name="add" size={20} color={BRAND_COLORS.positive} />
            </View>
            <ThemedText style={styles.actionButtonLabel}>Add Money</ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <View style={[styles.actionButtonIcon, { backgroundColor: '#F5F5F5' }]}>
              <Ionicons name="settings-outline" size={20} color="#757575" />
            </View>
            <ThemedText style={styles.actionButtonLabel}>Settings</ThemedText>
          </TouchableOpacity>
        </View>
        
        {/* Transactions Section */}
        <View style={styles.transactionsContainer}>
          <ThemedText style={styles.sectionTitle}>Transactions</ThemedText>
          
          {/* Transaction Filters */}
          <View style={styles.tabContainer}>
            <TouchableOpacity 
              style={[styles.tab, activeTab === 'all' && styles.activeTab]}
              onPress={() => setActiveTab('all')}
            >
              <ThemedText style={[styles.tabText, activeTab === 'all' && styles.activeTabText]}>
                All
              </ThemedText>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.tab, activeTab === 'in' && styles.activeTab]}
              onPress={() => setActiveTab('in')}
            >
              <ThemedText style={[styles.tabText, activeTab === 'in' && styles.activeTabText]}>
                Money In
              </ThemedText>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.tab, activeTab === 'out' && styles.activeTab]}
              onPress={() => setActiveTab('out')}
            >
              <ThemedText style={[styles.tabText, activeTab === 'out' && styles.activeTabText]}>
                Money Out
              </ThemedText>
            </TouchableOpacity>
          </View>
          
          {/* Transaction List */}
          {filteredTransactions.length > 0 ? (
            <FlatList
              data={filteredTransactions}
              renderItem={renderTransactionItem}
              keyExtractor={item => item.id}
              scrollEnabled={false}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
          ) : (
            <View style={styles.emptyContainer}>
              <ThemedText style={styles.emptyText}>No transactions to display</ThemedText>
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
  balanceCard: {
    margin: 16,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  balanceTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666666',
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 16,
  },
  accountCardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  accountCard: {
    width: '48%',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  accountIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  accountLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666666',
    marginBottom: 4,
  },
  accountBalance: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 8,
  },
  accountAction: {
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 16,
    paddingVertical: 4,
    paddingHorizontal: 8,
    alignSelf: 'flex-start',
  },
  accountActionText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#666666',
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
    marginHorizontal: 16,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 16,
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
  transactionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  transactionContent: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333333',
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 12,
    color: '#666666',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  positiveAmount: {
    color: BRAND_COLORS.positive,
  },
  negativeAmount: {
    color: '#F44336',
  },
  separator: {
    height: 1,
    backgroundColor: '#F0F0F0',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emptyText: {
    fontSize: 14,
    color: '#888888',
    fontStyle: 'italic',
  },
}); 