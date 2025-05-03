import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Platform, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

import { ThemedText } from '@/components/ThemedText';

// Raiffeisen Bank brand colors
const BRAND_COLORS = {
  primary: '#FFEE00', // Raiffeisen Yellow
  secondary: '#004E9E', // Raiffeisen Blue
  lightGray: '#AAAAAA',
  positive: '#4CAF50',
  teal: '#37a69b',
};

type ChildData = {
  id: string;
  name: string;
  age: number;
  email: string;
  phone: string;
  school: string;
  balance: number;
  avatar: string;
  isActive: boolean;
  spendingBalance?: number;
  savingsBalance?: number;
};

// Mock data for children accounts - this would come from your actual data store
const mockChildren = [
  {
    id: '1',
    name: 'Emma Smith',
    age: 15,
    email: 'emma.smith@example.com',
    phone: '555-123-4567',
    school: 'Lincoln High School',
    balance: 120.50,
    avatar: 'girl',
    isActive: true,
    spendingBalance: 7.32,
    savingsBalance: 0.00,
  },
  {
    id: '2',
    name: 'Noah Smith',
    age: 13,
    email: 'noah.smith@example.com',
    phone: '555-987-6543',
    school: 'Washington Middle School',
    balance: 75.25,
    avatar: 'boy',
    isActive: true,
    spendingBalance: 12.45,
    savingsBalance: 25.00,
  }
];

export default function ChildDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [child, setChild] = useState<ChildData | null>(null);

  useEffect(() => {
    // In a real app, you would fetch this data from your backend or state management
    const childData = mockChildren.find(c => c.id === id);
    if (childData) {
      setChild(childData);
    }
  }, [id]);

  if (!child) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <ThemedText style={styles.title}>Child Details</ThemedText>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.centerContent}>
          <ThemedText>Loading child details...</ThemedText>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <ThemedText style={styles.title}>{child.name}</ThemedText>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Child Card Header */}
        <View style={styles.customizeCard}>
          <View style={styles.customizeIconContainer}>
            <Ionicons name="settings-outline" size={20} color={BRAND_COLORS.teal} />
          </View>
          <ThemedText style={styles.customizeText}>Customize {child.name}'s card</ThemedText>
        </View>

        {/* Financial Accounts Section */}
        <View style={styles.accountsContainer}>
          {/* Spending Account */}
          <View style={styles.accountCard}>
            <View style={styles.accountHeader}>
              <View style={styles.accountIconContainer}>
                <Ionicons name="card-outline" size={24} color={BRAND_COLORS.teal} />
              </View>
              <ThemedText style={styles.accountTitle}>Spending</ThemedText>
            </View>
            <ThemedText style={styles.accountBalance}>${child.spendingBalance?.toFixed(2)}</ThemedText>
            <TouchableOpacity style={styles.accountAction}>
              <ThemedText style={styles.accountActionText}>Manage controls</ThemedText>
            </TouchableOpacity>
          </View>

          {/* Savings Account */}
          <View style={styles.accountCard}>
            <View style={styles.accountHeader}>
              <View style={styles.accountIconContainer}>
                <Ionicons name="save-outline" size={24} color={BRAND_COLORS.teal} />
              </View>
              <ThemedText style={styles.accountTitle}>Savings</ThemedText>
            </View>
            <ThemedText style={styles.accountBalance}>${child.savingsBalance?.toFixed(2)}</ThemedText>
            <TouchableOpacity style={styles.accountAction}>
              <ThemedText style={styles.accountActionText}>Start saving</ThemedText>
            </TouchableOpacity>
          </View>

          {/* Investing Account */}
          <View style={styles.accountCard}>
            <View style={styles.accountHeader}>
              <View style={styles.accountIconContainer}>
                <Ionicons name="trending-up-outline" size={24} color={BRAND_COLORS.teal} />
              </View>
              <ThemedText style={styles.accountTitle}>Investing</ThemedText>
            </View>
            <View style={styles.emptyAccountContent}>
              <TouchableOpacity 
                style={styles.getStartedButton}
                onPress={() => router.push({
                  pathname: '/investing',
                  params: { childId: child.id, childName: child.name }
                })}
              >
                <ThemedText style={styles.getStartedText}>Get Started</ThemedText>
              </TouchableOpacity>
            </View>
          </View>

          {/* Allowance Setup */}
          <View style={styles.accountCard}>
            <View style={styles.accountHeader}>
              <View style={styles.accountIconContainer}>
                <Ionicons name="cash-outline" size={24} color={BRAND_COLORS.teal} />
              </View>
              <ThemedText style={styles.accountTitle}>Allowance</ThemedText>
            </View>
            <View style={styles.emptyAccountContent}>
              <TouchableOpacity 
                style={styles.getStartedButton}
                onPress={() => router.push({
                  pathname: '/allowance',
                  params: { childId: child.id, childName: child.name }
                })}
              >
                <ThemedText style={styles.getStartedText}>Set up</ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Chores Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <ThemedText style={styles.sectionTitle}>Chores</ThemedText>
            <TouchableOpacity 
              onPress={() => router.push({
                pathname: '/chores',
                params: { childId: child.id, childName: child.name }
              })}
            >
              <ThemedText style={styles.sectionAction}>Assign Chores</ThemedText>
            </TouchableOpacity>
          </View>
          <View style={[styles.accountCard, { marginBottom: 0 }]}>
            <View style={styles.choreInfo}>
              <View style={styles.choreIconContainer}>
                <Ionicons name="list-outline" size={24} color={BRAND_COLORS.teal} />
              </View>
              <View style={styles.choreTextContainer}>
                <ThemedText style={styles.choreTitle}>Weekly Chores</ThemedText>
                <ThemedText style={styles.choreDescription}>
                  Assign tasks for your child to complete and earn rewards
                </ThemedText>
              </View>
            </View>
            <TouchableOpacity 
              style={styles.getStartedButton}
              onPress={() => router.push({
                pathname: '/chores',
                params: { childId: child.id, childName: child.name }
              })}
            >
              <ThemedText style={styles.getStartedText}>Set up</ThemedText>
            </TouchableOpacity>
          </View>
        </View>

        {/* Transaction History Button */}
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="time-outline" size={22} color={BRAND_COLORS.secondary} />
          <ThemedText style={styles.actionButtonText}>View Transaction History</ThemedText>
          <Ionicons name="chevron-forward" size={20} color={BRAND_COLORS.secondary} />
        </TouchableOpacity>

        {/* Settings Button */}
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="settings-outline" size={22} color={BRAND_COLORS.secondary} />
          <ThemedText style={styles.actionButtonText}>Account Settings</ThemedText>
          <Ionicons name="chevron-forward" size={20} color={BRAND_COLORS.secondary} />
        </TouchableOpacity>

        {/* Bottom spacing */}
        <View style={{ height: 40 }} />
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: BRAND_COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
  },
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  customizeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 1,
  },
  customizeIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#e0f7fa',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  customizeText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333333',
  },
  accountsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  accountCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    width: '48%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  accountHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  accountIconContainer: {
    marginRight: 8,
  },
  accountTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333333',
  },
  accountBalance: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 12,
  },
  accountAction: {
    marginTop: 'auto',
  },
  accountActionText: {
    fontSize: 14,
    color: '#888888',
    fontWeight: '500',
  },
  emptyAccountContent: {
    height: 72,
    justifyContent: 'center',
  },
  getStartedButton: {
    backgroundColor: '#F5F5F5',
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  getStartedText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666666',
  },
  section: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
  },
  sectionAction: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666666',
  },
  choreInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginBottom: 12,
  },
  choreIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(55, 166, 155, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  choreTextContainer: {
    flex: 1,
  },
  choreTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  choreDescription: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  actionButtonText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#333333',
    marginLeft: 12,
  },
}); 