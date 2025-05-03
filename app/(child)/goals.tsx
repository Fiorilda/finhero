import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    FlatList,
    Modal,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

import { SavingsGoal, addSavingsGoal, getSavingsGoalsByChildId } from '@/app/mock-data';

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

// Custom progress bar implementation for both platforms
const ProgressBar = ({ progress, color, style }: { progress: number, color: string, style?: any }) => {
  return (
    <View style={[{ height: 6, backgroundColor: '#EEEEEE', borderRadius: 3, overflow: 'hidden' }, style]}>
      <View 
        style={{
          height: '100%',
          width: `${progress * 100}%`,
          backgroundColor: color,
          borderRadius: 3,
        }}
      />
    </View>
  );
};

export default function GoalsScreen() {
  const router = useRouter();
  const [goals, setGoals] = useState<SavingsGoal[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [depositModalVisible, setDepositModalVisible] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<SavingsGoal | null>(null);
  const [depositAmount, setDepositAmount] = useState('');
  const [newGoal, setNewGoal] = useState({
    name: '',
    targetAmount: '',
    targetDate: '',
    initialDeposit: ''
  });

  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = () => {
    const childGoals = getSavingsGoalsByChildId(MOCK_CHILD_ID);
    setGoals(childGoals);
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadGoals();
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleCreateGoal = () => {
    // Basic validation
    if (!newGoal.name || !newGoal.targetAmount) {
      return; // Could add error handling here
    }

    const goalData = {
      name: newGoal.name,
      targetAmount: parseFloat(newGoal.targetAmount),
      currentAmount: parseFloat(newGoal.initialDeposit || '0'),
      targetDate: newGoal.targetDate ? new Date(newGoal.targetDate) : undefined,
      childId: MOCK_CHILD_ID,
      completed: false,
      createdDate: new Date().toISOString().split('T')[0]
    };

    // In a real app, this would be an API call
    addSavingsGoal(goalData);
    
    // Reset form and close modal
    setNewGoal({
      name: '',
      targetAmount: '',
      targetDate: '',
      initialDeposit: ''
    });
    setModalVisible(false);
    
    // Refresh goals list
    loadGoals();
  };

  const handleOpenDepositModal = (goal: SavingsGoal) => {
    setSelectedGoal(goal);
    setDepositAmount('');
    setDepositModalVisible(true);
  };

  const handleDeposit = () => {
    if (!selectedGoal || !depositAmount || parseFloat(depositAmount) <= 0) {
      return; // Could add error handling here
    }

    // Update the goal with the new deposit amount
    const updatedGoal = {
      ...selectedGoal,
      currentAmount: selectedGoal.currentAmount + parseFloat(depositAmount)
    };

    // In a real app, this would be an API call
    // For now, we'll update the goal in our local state
    const updatedGoals = goals.map(goal => 
      goal.id === updatedGoal.id ? updatedGoal : goal
    );
    
    setGoals(updatedGoals);
    setDepositModalVisible(false);
    setSelectedGoal(null);
    setDepositAmount('');
  };

  const renderGoalItem = ({ item }: { item: SavingsGoal }) => {
    const progress = item.currentAmount / item.targetAmount;
    const progressPercentage = Math.round(progress * 100);
    
    return (
      <TouchableOpacity style={styles.goalCard}>
        <View style={styles.goalHeader}>
          <Text style={styles.goalName}>{item.name}</Text>
          <Text style={styles.goalProgress}>{progressPercentage}%</Text>
        </View>
        
        <View style={styles.amounts}>
          <Text style={styles.savedAmount}>${item.currentAmount.toFixed(2)}</Text>
          <Text style={styles.targetAmount}>of ${item.targetAmount.toFixed(2)}</Text>
        </View>
        
        <ProgressBar 
          progress={progress} 
          color={progressPercentage >= 100 ? BRAND_COLORS.positive : BRAND_COLORS.teal} 
          style={styles.progressBar}
        />
        
        <View style={styles.goalFooter}>
          <Text style={styles.goalDate}>
            Target: {item.targetDate ? new Date(item.targetDate).toLocaleDateString() : 'No date set'}
          </Text>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => handleOpenDepositModal(item)}
          >
            <Ionicons name="add" size={16} color="#FFFFFF" />
            <Text style={styles.addButtonText}>Add Money</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
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
        <View style={styles.header}>
          <Text style={styles.title}>My Savings Goals</Text>
          <TouchableOpacity 
            style={styles.newGoalButton}
            onPress={() => setModalVisible(true)}
          >
            <Ionicons name="add" size={20} color="#FFFFFF" />
            <Text style={styles.newGoalText}>New Goal</Text>
          </TouchableOpacity>
        </View>
        
        {goals.length > 0 ? (
          <FlatList
            data={goals}
            renderItem={renderGoalItem}
            keyExtractor={item => item.id}
            scrollEnabled={false}
            contentContainerStyle={styles.goalsList}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons name="flag-outline" size={60} color="#CCCCCC" />
            <Text style={styles.emptyText}>No savings goals yet</Text>
            <Text style={styles.emptySubtext}>Create a goal to start saving</Text>
            <TouchableOpacity 
              style={styles.createGoalButton}
              onPress={() => setModalVisible(true)}
            >
              <Text style={styles.createGoalText}>Create First Goal</Text>
            </TouchableOpacity>
          </View>
        )}
        
        <View style={styles.tipsContainer}>
          <View style={styles.tipHeader}>
            <Ionicons name="bulb" size={20} color="#FF9800" />
            <Text style={styles.tipTitle}>Savings Tips</Text>
          </View>
          <Text style={styles.tipText}>
            Save regularly to reach your goals faster. Try to add a little bit every week!
          </Text>
        </View>
      </ScrollView>

      {/* Add Goal Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Create a New Goal</Text>
              <TouchableOpacity 
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color="#333333" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalForm}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>What are you saving for?</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="E.g., New Bike, Gaming Console"
                  value={newGoal.name}
                  onChangeText={(text) => setNewGoal({...newGoal, name: text})}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>How much do you need?</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="0.00"
                  keyboardType="decimal-pad"
                  value={newGoal.targetAmount}
                  onChangeText={(text) => setNewGoal({...newGoal, targetAmount: text})}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>When do you want to achieve this? (optional)</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="MM/DD/YYYY"
                  value={newGoal.targetDate}
                  onChangeText={(text) => setNewGoal({...newGoal, targetDate: text})}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Initial deposit (optional)</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="0.00"
                  keyboardType="decimal-pad"
                  value={newGoal.initialDeposit}
                  onChangeText={(text) => setNewGoal({...newGoal, initialDeposit: text})}
                />
              </View>

              <TouchableOpacity 
                style={styles.createButton}
                onPress={handleCreateGoal}
              >
                <Text style={styles.createButtonText}>Create Goal</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Deposit Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={depositModalVisible}
        onRequestClose={() => setDepositModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Money to Goal</Text>
              <TouchableOpacity 
                onPress={() => setDepositModalVisible(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color="#333333" />
              </TouchableOpacity>
            </View>

            {selectedGoal && (
              <ScrollView style={styles.modalForm}>
                <Text style={styles.goalTitle}>{selectedGoal.name}</Text>
                
                <View style={styles.goalSummary}>
                  <Text style={styles.goalSummaryText}>
                    Current: ${selectedGoal.currentAmount.toFixed(2)}
                  </Text>
                  <Text style={styles.goalSummaryText}>
                    Target: ${selectedGoal.targetAmount.toFixed(2)}
                  </Text>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>How much would you like to add?</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="0.00"
                    keyboardType="decimal-pad"
                    value={depositAmount}
                    onChangeText={setDepositAmount}
                    autoFocus
                  />
                </View>

                <TouchableOpacity 
                  style={styles.createButton}
                  onPress={handleDeposit}
                >
                  <Text style={styles.createButtonText}>Add to Goal</Text>
                </TouchableOpacity>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
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
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
  },
  newGoalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: BRAND_COLORS.teal,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  newGoalText: {
    color: '#FFFFFF',
    fontWeight: '600',
    marginLeft: 4,
  },
  goalsList: {
    gap: 16,
  },
  goalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  goalName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  goalProgress: {
    fontSize: 16,
    fontWeight: 'bold',
    color: BRAND_COLORS.teal,
  },
  amounts: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  savedAmount: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333333',
    marginRight: 4,
  },
  targetAmount: {
    fontSize: 14,
    color: '#666666',
  },
  progressBar: {
    marginBottom: 12,
  },
  goalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  goalDate: {
    fontSize: 12,
    color: '#666666',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: BRAND_COLORS.secondary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontWeight: '500',
    fontSize: 12,
    marginLeft: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 40,
    marginVertical: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 24,
    textAlign: 'center',
  },
  createGoalButton: {
    backgroundColor: BRAND_COLORS.teal,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
  },
  createGoalText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  tipsContainer: {
    backgroundColor: '#FFF8E1',
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#FF9800',
    padding: 16,
    marginTop: 16,
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginLeft: 8,
  },
  tipText: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
  },
  closeButton: {
    padding: 5,
  },
  modalForm: {
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555555',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  createButton: {
    backgroundColor: BRAND_COLORS.secondary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // Deposit modal specific styles
  goalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 12,
    textAlign: 'center',
  },
  goalSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F8F8F8',
    padding: 12,
    borderRadius: 10,
    marginBottom: 20,
  },
  goalSummaryText: {
    fontSize: 14,
    color: '#555555',
    fontWeight: '500',
  },
}); 