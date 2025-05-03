import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

import { HeaderWithBack } from '@/components/HeaderWithBack';
import { ThemedText } from '@/components/ThemedText';

// Raiffeisen Bank brand colors
const BRAND_COLORS = {
  primary: '#FFEE00', // Raiffeisen Yellow
  secondary: '#004E9E', // Raiffeisen Blue
  lightGray: '#AAAAAA',
  positive: '#4CAF50',
  teal: '#37a69b',
};

// Frequency options
const FREQUENCY_OPTIONS = [
  'Weekly',
  'Bi-weekly',
  'Monthly'
];

// Day options
const DAY_OPTIONS = [
  'On Sunday',
  'On Monday',
  'On Tuesday',
  'On Wednesday',
  'On Thursday',
  'On Friday',
  'On Saturday'
];

// Mock allowance data for children
const mockAllowanceData = {
  '1': {
    amount: '10.00',
    frequency: 'Weekly',
    day: 'On Sunday',
    spendingPercentage: 100,
    savingsPercentage: 0,
    givingPercentage: 0,
    isActive: true
  },
  '2': {
    amount: '15.00',
    frequency: 'Bi-weekly',
    day: 'On Friday',
    spendingPercentage: 70,
    savingsPercentage: 20,
    givingPercentage: 10,
    isActive: true
  }
};

export default function AllowanceScreen() {
  const router = useRouter();
  const { childId, childName } = useLocalSearchParams();
  const childIdString = typeof childId === 'string' ? childId : '1';
  const childNameString = typeof childName === 'string' ? childName : 'Child';
  
  // State for allowance settings
  const [amount, setAmount] = useState('0.00');
  const [frequency, setFrequency] = useState('Weekly');
  const [day, setDay] = useState('On Sunday');
  const [spendingPercentage, setSpendingPercentage] = useState(100);
  const [savingsPercentage, setSavingsPercentage] = useState(0);
  const [givingPercentage, setGivingPercentage] = useState(0);
  
  // States for dropdowns
  const [frequencyModalVisible, setFrequencyModalVisible] = useState(false);
  const [dayModalVisible, setDayModalVisible] = useState(false);
  
  // Load existing data if available
  useEffect(() => {
    if (mockAllowanceData[childIdString]) {
      const data = mockAllowanceData[childIdString];
      setAmount(data.amount);
      setFrequency(data.frequency);
      setDay(data.day);
      setSpendingPercentage(data.spendingPercentage);
      setSavingsPercentage(data.savingsPercentage);
      setGivingPercentage(data.givingPercentage);
    }
  }, [childIdString]);
  
  // Handle amount changes with proper formatting
  const handleAmountChange = (text) => {
    // Remove any non-numeric characters except decimal point
    const cleaned = text.replace(/[^0-9.]/g, '');
    
    // Ensure only one decimal point
    const parts = cleaned.split('.');
    let formatted;
    
    if (parts.length > 1) {
      // If there's a decimal point, limit to 2 decimal places
      formatted = `${parts[0]}.${parts.slice(1).join('').substring(0, 2)}`;
    } else {
      formatted = cleaned;
    }
    
    setAmount(formatted);
  };
  
  // Calculate actual amounts based on percentages
  const amountValue = parseFloat(amount) || 0;
  const spendingAmount = (amountValue * spendingPercentage / 100).toFixed(0);
  const savingsAmount = (amountValue * savingsPercentage / 100).toFixed(0);
  const givingAmount = (amountValue * givingPercentage / 100).toFixed(0);
  
  // Calculate next payment date
  const getNextPaymentDate = () => {
    const today = new Date();
    let daysToAdd = 0;
    
    // Get the target day of the week
    const targetDay = day.split(' ')[1].toLowerCase();
    const dayMap = {
      'sunday': 0,
      'monday': 1,
      'tuesday': 2,
      'wednesday': 3,
      'thursday': 4,
      'friday': 5,
      'saturday': 6
    };
    
    const targetDayNum = dayMap[targetDay];
    
    if (targetDayNum !== undefined) {
      // Calculate days to add to reach the next occurrence of the target day
      daysToAdd = (targetDayNum + 7 - today.getDay()) % 7;
      if (daysToAdd === 0) daysToAdd = 7; // If today is the target day, go to next week
    }
    
    const nextDate = new Date(today);
    nextDate.setDate(today.getDate() + daysToAdd);
    
    // Format as MM/DD/YYYY
    return `${nextDate.getMonth() + 1}/${nextDate.getDate()}/${nextDate.getFullYear()}`;
  };

  // Handle saving the allowance settings
  const handleSaveAllowance = () => {
    // In a real app, you would send this data to your backend
    // For this demo, we'll just update our mock data and show an alert
    mockAllowanceData[childIdString] = {
      amount,
      frequency,
      day,
      spendingPercentage,
      savingsPercentage,
      givingPercentage,
      isActive: true
    };
    
    Alert.alert(
      "Allowance Saved",
      `${childNameString}'s allowance has been set to $${amount} ${frequency.toLowerCase()}.`,
      [{ text: "OK", onPress: () => router.back() }]
    );
  };
  
  // Handle canceling the allowance
  const handleCancelAllowance = () => {
    Alert.alert(
      "Cancel Allowance",
      `Are you sure you want to cancel ${childNameString}'s allowance?`,
      [
        { text: "No", style: "cancel" },
        { 
          text: "Yes", 
          style: "destructive",
          onPress: () => {
            if (mockAllowanceData[childIdString]) {
              delete mockAllowanceData[childIdString];
            }
            router.back();
          }
        }
      ]
    );
  };
  
  return (
    <View style={styles.container}>
      <HeaderWithBack title={`${childNameString}'s Allowance`} />

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <ThemedText style={styles.pageTitle}>Allowance</ThemedText>
        
        {/* Amount Input */}
        <View style={styles.amountContainer}>
          <View style={styles.currencyContainer}>
            <ThemedText style={styles.currencySymbol}>$</ThemedText>
            <TextInput
              style={styles.amountInput}
              value={amount}
              onChangeText={handleAmountChange}
              keyboardType="decimal-pad"
              selectionColor={BRAND_COLORS.teal}
            />
          </View>
        </View>
        
        {/* Frequency Selection */}
        <TouchableOpacity 
          style={styles.selectionContainer}
          onPress={() => setFrequencyModalVisible(true)}
        >
          <ThemedText style={styles.selectionText}>{frequency}</ThemedText>
          <Ionicons name="chevron-down" size={24} color="#666" />
        </TouchableOpacity>
        
        {/* Day Selection */}
        <TouchableOpacity 
          style={styles.selectionContainer}
          onPress={() => setDayModalVisible(true)}
        >
          <ThemedText style={styles.selectionText}>{day}</ThemedText>
          <Ionicons name="chevron-down" size={24} color="#666" />
        </TouchableOpacity>
        
        {/* Allocation Section */}
        <View style={styles.allocationSection}>
          <ThemedText style={styles.sectionTitle}>ALLOCATION</ThemedText>
          
          {/* Spending Allocation */}
          <View style={styles.allocationRow}>
            <TouchableOpacity style={styles.percentageContainer}>
              <ThemedText style={styles.percentageText}>{spendingPercentage}%</ThemedText>
            </TouchableOpacity>
            <View style={styles.allocationDetails}>
              <ThemedText style={styles.allocationText}>in Spend Anywhere</ThemedText>
              <ThemedText style={styles.allocationAmount}>(${spendingAmount})</ThemedText>
            </View>
          </View>
          
          {/* Savings Allocation */}
          <View style={styles.allocationRow}>
            <TouchableOpacity style={styles.percentageContainer}>
              <ThemedText style={styles.percentageText}>{savingsPercentage}%</ThemedText>
            </TouchableOpacity>
            <View style={styles.allocationDetails}>
              <ThemedText style={styles.allocationText}>in General Savings</ThemedText>
              <ThemedText style={styles.allocationAmount}>(${savingsAmount})</ThemedText>
            </View>
          </View>
          
          {/* Giving Allocation */}
          <View style={styles.allocationRow}>
            <TouchableOpacity style={styles.percentageContainer}>
              <ThemedText style={styles.percentageText}>{givingPercentage}%</ThemedText>
            </TouchableOpacity>
            <View style={styles.allocationDetails}>
              <ThemedText style={styles.allocationText}>in Giving</ThemedText>
              <ThemedText style={styles.allocationAmount}>(${givingAmount})</ThemedText>
            </View>
          </View>
          
          <ThemedText style={styles.totalText}>=100%</ThemedText>
          
          <ThemedText style={styles.nextPaymentText}>
            Next payment ({getNextPaymentDate()})
          </ThemedText>
          <ThemedText style={styles.paymentTimeText}>
            Allowance is usually added at 6am
          </ThemedText>
          
          {/* Action Buttons */}
          <TouchableOpacity onPress={handleCancelAllowance}>
            <ThemedText style={styles.cancelText}>Cancel Allowance</ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity onPress={() => {
            handleSaveAllowance();
            router.push('/chores');
          }}>
            <ThemedText style={styles.choresText}>Save Allowance & Add Weekly Chores</ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.saveButton} onPress={handleSaveAllowance}>
            <ThemedText style={styles.saveButtonText}>Save Allowance</ThemedText>
          </TouchableOpacity>
        </View>
        
        {/* Bottom spacing */}
        <View style={{ height: 40 }} />
      </ScrollView>
      
      {/* Frequency Selection Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={frequencyModalVisible}
        onRequestClose={() => setFrequencyModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <ThemedText style={styles.modalTitle}>Select Frequency</ThemedText>
              <TouchableOpacity onPress={() => setFrequencyModalVisible(false)}>
                <Ionicons name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>
            <ScrollView>
              {FREQUENCY_OPTIONS.map((option, index) => (
                <TouchableOpacity 
                  key={index}
                  style={[
                    styles.modalOption,
                    frequency === option && styles.modalOptionSelected
                  ]}
                  onPress={() => {
                    setFrequency(option);
                    setFrequencyModalVisible(false);
                  }}
                >
                  <ThemedText style={[
                    styles.modalOptionText,
                    frequency === option && styles.modalOptionTextSelected
                  ]}>
                    {option}
                  </ThemedText>
                  {frequency === option && (
                    <Ionicons name="checkmark" size={24} color={BRAND_COLORS.teal} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
      
      {/* Day Selection Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={dayModalVisible}
        onRequestClose={() => setDayModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <ThemedText style={styles.modalTitle}>Select Day</ThemedText>
              <TouchableOpacity onPress={() => setDayModalVisible(false)}>
                <Ionicons name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>
            <ScrollView>
              {DAY_OPTIONS.map((option, index) => (
                <TouchableOpacity 
                  key={index}
                  style={[
                    styles.modalOption,
                    day === option && styles.modalOptionSelected
                  ]}
                  onPress={() => {
                    setDay(option);
                    setDayModalVisible(false);
                  }}
                >
                  <ThemedText style={[
                    styles.modalOptionText,
                    day === option && styles.modalOptionTextSelected
                  ]}>
                    {option}
                  </ThemedText>
                  {day === option && (
                    <Ionicons name="checkmark" size={24} color={BRAND_COLORS.teal} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: Platform.OS === 'ios' ? 40 : 30,
  },
  scrollContainer: {
    flex: 1,
    padding: 16,
  },
  pageTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#333333',
  },
  amountContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginVertical: 16,
    padding: 20,
    paddingVertical: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
    alignItems: 'center',
    width: '100%',
  },
  currencyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  currencySymbol: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#333333',
    marginRight: 4,
  },
  amountInput: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#333333',
    minWidth: 180,
    textAlign: 'center',
    letterSpacing: 2,
    paddingHorizontal: 8,
  },
  selectionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F2F2F2',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  selectionText: {
    fontSize: 18,
    color: '#333333',
  },
  allocationSection: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666666',
    marginBottom: 16,
  },
  allocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  percentageContainer: {
    width: 70,
    height: 70,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  percentageText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333333',
  },
  allocationDetails: {
    flex: 1,
  },
  allocationText: {
    fontSize: 18,
    color: '#333333',
  },
  allocationAmount: {
    fontSize: 16,
    color: '#666666',
  },
  totalText: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 24,
  },
  nextPaymentText: {
    fontSize: 16,
    color: '#333333',
  },
  paymentTimeText: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 32,
  },
  cancelText: {
    fontSize: 16,
    color: '#F44336',
    textAlign: 'center',
    marginBottom: 16,
  },
  choresText: {
    fontSize: 16,
    color: BRAND_COLORS.teal,
    textAlign: 'center',
    marginBottom: 24,
  },
  saveButton: {
    backgroundColor: BRAND_COLORS.teal,
    borderRadius: 24,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: 20,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  modalOptionSelected: {
    backgroundColor: '#F6F9FC',
  },
  modalOptionText: {
    fontSize: 16,
    color: '#333333',
  },
  modalOptionTextSelected: {
    color: BRAND_COLORS.teal,
    fontWeight: '500',
  },
}); 