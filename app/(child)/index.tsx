import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
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
    children,
    Chore,
    getChoresByChildId,
    getNotificationsByUserId,
    getTransactionsByUserId,
    NotificationItem,
    Transaction
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

export default function ChildHomeScreen() {
  const router = useRouter();
  const [childData, setChildData] = useState<Child | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [chores, setChores] = useState<Chore[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = () => {
    // Get child data
    const child = children.find(c => c.id === MOCK_CHILD_ID);
    if (child) setChildData(child);

    // Get recent transactions
    const childTransactions = getTransactionsByUserId(MOCK_CHILD_ID);
    setTransactions(childTransactions.slice(0, 5)); // Get 5 most recent

    // Get notifications
    const childNotifications = getNotificationsByUserId(MOCK_CHILD_ID);
    setNotifications(childNotifications.slice(0, 3)); // Get 3 most recent

    // Get chores
    const childChores = getChoresByChildId(MOCK_CHILD_ID);
    setChores(childChores.filter(chore => !chore.completed));
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

  const renderNotificationItem = ({ item }: { item: NotificationItem }) => (
    <TouchableOpacity style={styles.notificationItem}>
      <View style={styles.notificationIconContainer}>
        {item.type === 'allowance' && <Ionicons name="cash" size={20} color={BRAND_COLORS.positive} />}
        {item.type === 'chore' && <Ionicons name="checkbox" size={20} color={BRAND_COLORS.teal} />}
        {item.type === 'goal' && <Ionicons name="flag" size={20} color="#FF9800" />}
        {item.type === 'transaction' && <Ionicons name="swap-horizontal" size={20} color={BRAND_COLORS.secondary} />}
        {item.type === 'system' && <Ionicons name="information-circle" size={20} color="#9E9E9E" />}
      </View>
      <View style={styles.notificationContent}>
        <ThemedText style={styles.notificationTitle}>{item.title}</ThemedText>
        <ThemedText style={styles.notificationMessage}>{item.message}</ThemedText>
        <ThemedText style={styles.notificationDate}>
          {new Date(item.date).toLocaleDateString()}
        </ThemedText>
      </View>
      {!item.read && <View style={styles.unreadDot} />}
    </TouchableOpacity>
  );

  const renderChoreItem = ({ item }: { item: Chore }) => (
    <TouchableOpacity 
      style={styles.choreItem}
      onPress={() => router.push('/(child)/chores')}
    >
      <View style={styles.choreCheck}>
        <Ionicons name="square-outline" size={24} color={BRAND_COLORS.teal} />
      </View>
      <View style={styles.choreContent}>
        <ThemedText style={styles.choreName}>{item.name}</ThemedText>
        <View style={styles.choreInfo}>
          <ThemedText style={styles.choreValue}>${item.value.toFixed(2)}</ThemedText>
          <ThemedText style={styles.choreDueDay}>{item.dueDay}</ThemedText>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderTransactionItem = ({ item }: { item: Transaction }) => (
    <View style={styles.transactionItem}>
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
    </View>
  );

  // Calculate total balance
  const spendingBalance = childData.accounts.spending.balance;
  const savingsBalance = childData.accounts.savings.balance;
  const investingBalance = childData.accounts.investing?.balance || 0;
  const totalBalance = spendingBalance + savingsBalance + investingBalance;

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
        {/* Welcome Header */}
        <View style={styles.welcomeSection}>
          <View style={styles.welcomeContent}>
            <ThemedText style={styles.welcomeText}>Hello, {childData.name}!</ThemedText>
            <ThemedText style={styles.dateText}>
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </ThemedText>
          </View>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Ionicons 
                name={childData.avatar === 'girl' ? 'person-circle' : 'person-circle'} 
                size={40} 
                color={childData.avatar === 'girl' ? '#FF4081' : '#2196F3'} 
              />
            </View>
          </View>
        </View>

        {/* Balance Card */}
        <View style={styles.balanceCard}>
          <View style={styles.balanceHeader}>
            <ThemedText style={styles.balanceTitle}>Total Balance</ThemedText>
            <TouchableOpacity onPress={() => router.push('/money')}>
              <ThemedText style={styles.viewAllLink}>View All</ThemedText>
            </TouchableOpacity>
          </View>
          <ThemedText style={styles.balanceAmount}>${totalBalance.toFixed(2)}</ThemedText>
          
          <View style={styles.accountsRow}>
            <TouchableOpacity 
              style={styles.accountItem}
              onPress={() => router.push('/(child)/money')}
            >
              <View style={[styles.accountIcon, { backgroundColor: '#E3F2FD' }]}>
                <Ionicons name="card" size={20} color={BRAND_COLORS.secondary} />
              </View>
              <ThemedText style={styles.accountLabel}>Spending</ThemedText>
              <ThemedText style={styles.accountBalance}>${spendingBalance.toFixed(2)}</ThemedText>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.accountItem}
              onPress={() => router.push('/(child)/goals')}
            >
              <View style={[styles.accountIcon, { backgroundColor: '#E8F5E9' }]}>
                <Ionicons name="save" size={20} color={BRAND_COLORS.positive} />
              </View>
              <ThemedText style={styles.accountLabel}>Savings</ThemedText>
              <ThemedText style={styles.accountBalance}>${savingsBalance.toFixed(2)}</ThemedText>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.quickButton}
              onPress={() => router.push('/(child)/investing')}
            >
              <View style={styles.quickButtonIconContainer}>
                <Ionicons name="trending-up" size={24} color={BRAND_COLORS.secondary} />
              </View>
              <Text style={styles.quickButtonText}>Investing</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Chores Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <ThemedText style={styles.sectionTitle}>My Chores</ThemedText>
            <TouchableOpacity onPress={() => router.push('/(child)/chores')}>
              <ThemedText style={styles.viewAllLink}>View All</ThemedText>
            </TouchableOpacity>
          </View>
          
          {chores.length > 0 ? (
            <FlatList
              data={chores.slice(0, 3)}
              renderItem={renderChoreItem}
              keyExtractor={item => item.id}
              scrollEnabled={false}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
          ) : (
            <View style={styles.emptyContainer}>
              <ThemedText style={styles.emptyText}>No chores to complete</ThemedText>
            </View>
          )}
        </View>

        {/* Recent Transactions */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <ThemedText style={styles.sectionTitle}>Recent Activity</ThemedText>
            <TouchableOpacity onPress={() => router.push('/(child)/money')}>
              <ThemedText style={styles.viewAllLink}>View All</ThemedText>
            </TouchableOpacity>
          </View>
          
          {transactions.length > 0 ? (
            <FlatList
              data={transactions.slice(0, 3)}
              renderItem={renderTransactionItem}
              keyExtractor={item => item.id}
              scrollEnabled={false}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
          ) : (
            <View style={styles.emptyContainer}>
              <ThemedText style={styles.emptyText}>No recent transactions</ThemedText>
            </View>
          )}
        </View>

        {/* Notifications */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <ThemedText style={styles.sectionTitle}>Notifications</ThemedText>
            <TouchableOpacity onPress={() => router.push('/profile')}>
              <ThemedText style={styles.viewAllLink}>View All</ThemedText>
            </TouchableOpacity>
          </View>
          
          {notifications.length > 0 ? (
            <FlatList
              data={notifications}
              renderItem={renderNotificationItem}
              keyExtractor={item => item.id}
              scrollEnabled={false}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
          ) : (
            <View style={styles.emptyContainer}>
              <ThemedText style={styles.emptyText}>No notifications</ThemedText>
            </View>
          )}
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
  welcomeSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  welcomeContent: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333333',
  },
  dateText: {
    fontSize: 14,
    color: '#666666',
    marginTop: 4,
  },
  avatarContainer: {
    marginLeft: 16,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
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
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  balanceTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666666',
  },
  viewAllLink: {
    fontSize: 14,
    color: BRAND_COLORS.teal,
    fontWeight: '500',
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 16,
  },
  accountsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  accountItem: {
    flex: 1,
    alignItems: 'center',
    padding: 8,
  },
  accountIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  accountLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#666666',
    marginBottom: 4,
  },
  accountBalance: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333333',
  },
  sectionContainer: {
    margin: 16,
    marginTop: 0,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
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
  separator: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginVertical: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  emptyText: {
    fontSize: 14,
    color: '#888888',
    fontStyle: 'italic',
  },
  
  // Chore styles
  choreItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  choreCheck: {
    marginRight: 12,
  },
  choreContent: {
    flex: 1,
  },
  choreName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333333',
    marginBottom: 4,
  },
  choreInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  choreValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: BRAND_COLORS.teal,
  },
  choreDueDay: {
    fontSize: 12,
    color: '#666666',
  },
  
  // Transaction styles
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  transactionIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
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
  
  // Notification styles
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 8,
  },
  notificationIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 2,
  },
  notificationMessage: {
    fontSize: 13,
    color: '#666666',
    marginBottom: 4,
  },
  notificationDate: {
    fontSize: 12,
    color: '#999999',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: BRAND_COLORS.teal,
    marginTop: 6,
  },
  quickButton: {
    flex: 1,
    alignItems: 'center',
    padding: 8,
  },
  quickButtonIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  quickButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333333',
  },
}); 