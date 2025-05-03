import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Switch,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

import { ThemedText } from '@/components/ThemedText';

// Raiffeisen Bank brand colors
const BRAND_COLORS = {
  primary: '#FFEE00', // Raiffeisen Yellow
  secondary: '#004E9E', // Raiffeisen Blue
  lightGray: '#AAAAAA',
  positive: '#4CAF50',
  teal: '#37a69b',
};

// Example chores with more detailed properties
const DEFAULT_CHORES = [
  { id: '1', name: 'Clean room', value: 2, enabled: true, dueDay: 'Friday', completed: false },
  { id: '2', name: 'Take out trash', value: 1, enabled: true, dueDay: 'Monday', completed: true },
  { id: '3', name: 'Do dishes', value: 2, enabled: true, dueDay: 'Daily', completed: false },
  { id: '4', name: 'Homework', value: 3, enabled: false, dueDay: 'Weekdays', completed: false },
  { id: '5', name: 'Walk the dog', value: 2, enabled: false, dueDay: 'Daily', completed: false },
];

// Mock chores data for children
const mockChoresData = {
  '1': [...DEFAULT_CHORES],
  '2': [
    { id: '1', name: 'Clean bedroom', value: 3, enabled: true, dueDay: 'Saturday', completed: false },
    { id: '2', name: 'Help with groceries', value: 2, enabled: true, dueDay: 'Sunday', completed: false },
  ]
};

// Available due days
const DUE_DAY_OPTIONS = [
  'Daily',
  'Weekdays',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday'
];

export default function ChoresScreen() {
  const router = useRouter();
  const { childId, childName } = useLocalSearchParams();
  const childIdString = typeof childId === 'string' ? childId : '1';
  
  // State for chores
  const [chores, setChores] = useState([]);
  const [selectedChore, setSelectedChore] = useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [choreToDelete, setChoreToDelete] = useState(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [dueDayModalVisible, setDueDayModalVisible] = useState(false);
  
  // Fields for new/edit chore
  const [choreName, setChoreName] = useState('');
  const [choreValue, setChoreValue] = useState('1');
  const [choreEnabled, setChoreEnabled] = useState(true);
  const [choreDueDay, setChoreDueDay] = useState('Daily');

  // Load existing chores if available
  useEffect(() => {
    if (mockChoresData[childIdString]) {
      setChores([...mockChoresData[childIdString]]);
    } else {
      setChores([...DEFAULT_CHORES]);
      mockChoresData[childIdString] = [...DEFAULT_CHORES];
    }
  }, [childIdString]);

  // Open the edit modal with a new chore
  const handleAddChore = () => {
    setSelectedChore(null);
    setChoreName('');
    setChoreValue('1');
    setChoreEnabled(true);
    setChoreDueDay('Daily');
    setEditModalVisible(true);
  };

  // Open the edit modal with an existing chore
  const handleEditChore = (chore) => {
    setSelectedChore(chore);
    setChoreName(chore.name);
    setChoreValue(chore.value.toString());
    setChoreEnabled(chore.enabled);
    setChoreDueDay(chore.dueDay);
    setEditModalVisible(true);
  };

  // Confirm to delete a chore
  const confirmDeleteChore = (chore) => {
    setChoreToDelete(chore);
    setDeleteModalVisible(true);
  };

  // Delete a chore
  const handleDeleteChore = () => {
    if (!choreToDelete) return;
    
    setChores(prevChores => prevChores.filter(c => c.id !== choreToDelete.id));
    mockChoresData[childIdString] = chores.filter(c => c.id !== choreToDelete.id);
    setDeleteModalVisible(false);
    setChoreToDelete(null);
  };

  // Save a new or edited chore
  const handleSaveChore = () => {
    if (choreName.trim() === '') {
      Alert.alert('Error', 'Please enter a chore name');
      return;
    }
    
    const value = parseInt(choreValue, 10) || 1;
    
    if (selectedChore) {
      // Edit existing chore
      setChores(prevChores => prevChores.map(c => 
        c.id === selectedChore.id 
          ? { ...c, name: choreName, value, enabled: choreEnabled, dueDay: choreDueDay }
          : c
      ));
    } else {
      // Add new chore
      const newChore = {
        id: Date.now().toString(),
        name: choreName,
        value,
        enabled: choreEnabled,
        dueDay: choreDueDay,
        completed: false
      };
      
      setChores(prevChores => [...prevChores, newChore]);
    }
    
    setEditModalVisible(false);
    
    // Update mock data
    mockChoresData[childIdString] = chores;
  };

  // Toggle completed status
  const toggleCompleted = (id) => {
    setChores(prevChores => prevChores.map(chore => 
      chore.id === id 
        ? { ...chore, completed: !chore.completed } 
        : chore
    ));
    
    // Update mock data
    mockChoresData[childIdString] = chores.map(chore => 
      chore.id === id 
        ? { ...chore, completed: !chore.completed } 
        : chore
    );
  };

  // Toggle enabled status
  const toggleEnabled = (id) => {
    setChores(prevChores => prevChores.map(chore => 
      chore.id === id 
        ? { ...chore, enabled: !chore.enabled } 
        : chore
    ));
    
    // Update mock data
    mockChoresData[childIdString] = chores.map(chore => 
      chore.id === id 
        ? { ...chore, enabled: !chore.enabled } 
        : chore
    );
  };

  // Save all chores
  const saveChores = () => {
    // In a real app, you would save these to your backend
    mockChoresData[childIdString] = [...chores];
    
    Alert.alert(
      "Chores Saved",
      `${childName}'s chores have been updated.`,
      [{ text: "OK", onPress: () => router.back() }]
    );
  };

  // Render a chore item in the list
  const renderChoreItem = ({ item }) => (
    <View style={styles.choreItem}>
      <View style={styles.choreLeft}>
        <TouchableOpacity 
          style={[
            styles.completedCheckbox, 
            item.completed && styles.completedCheckboxActive
          ]}
          onPress={() => toggleCompleted(item.id)}
        >
          {item.completed && <Ionicons name="checkmark" size={18} color="#FFFFFF" />}
        </TouchableOpacity>
        <View style={styles.choreTextContainer}>
          <ThemedText style={[
            styles.choreName,
            item.completed && styles.choreNameCompleted
          ]}>
            {item.name}
          </ThemedText>
          <ThemedText style={styles.choreDueDay}>{item.dueDay}</ThemedText>
        </View>
      </View>
      
      <View style={styles.choreRight}>
        <ThemedText style={styles.choreValue}>${item.value}</ThemedText>
        <View style={styles.choreActions}>
          <TouchableOpacity 
            style={styles.editButton}
            onPress={() => handleEditChore(item)}
          >
            <Ionicons name="create-outline" size={20} color={BRAND_COLORS.secondary} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.deleteButton}
            onPress={() => confirmDeleteChore(item)}
          >
            <Ionicons name="trash-outline" size={20} color="#F44336" />
          </TouchableOpacity>
          <Switch
            value={item.enabled}
            onValueChange={() => toggleEnabled(item.id)}
            trackColor={{ false: '#D0D0D0', true: '#C8E6C9' }}
            thumbColor={item.enabled ? BRAND_COLORS.positive : '#F5F5F5'}
          />
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <ThemedText style={styles.title}>{childName}'s Chores</ThemedText>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.contentContainer}>
        <View style={styles.summaryCard}>
          <View style={styles.summaryContent}>
            <View style={styles.summaryIconContainer}>
              <Ionicons name="trophy" size={24} color="#FFD700" />
            </View>
            <View style={styles.summaryTextContainer}>
              <ThemedText style={styles.summaryTitle}>
                Weekly Chores Summary
              </ThemedText>
              <ThemedText style={styles.summaryDescription}>
                {chores.filter(c => c.completed).length} of {chores.length} chores completed
              </ThemedText>
            </View>
          </View>
          
          <View style={styles.earningSummary}>
            <ThemedText style={styles.earningTitle}>Earnings:</ThemedText>
            <ThemedText style={styles.earningAmount}>
              ${chores.filter(c => c.completed).reduce((sum, c) => sum + c.value, 0)}
            </ThemedText>
          </View>
        </View>
        
        <View style={styles.listHeader}>
          <ThemedText style={styles.sectionTitle}>Weekly Chores</ThemedText>
          <TouchableOpacity 
            style={styles.addChoreButton}
            onPress={handleAddChore}
          >
            <Ionicons name="add" size={20} color="#FFFFFF" />
            <ThemedText style={styles.addChoreText}>Add Chore</ThemedText>
          </TouchableOpacity>
        </View>
        
        <ThemedText style={styles.sectionDescription}>
          Assign chores that will reset each week. Each chore can have a dollar value
          that will be added to the allowance when completed.
        </ThemedText>
        
        <FlatList
          data={chores}
          renderItem={renderChoreItem}
          keyExtractor={item => item.id}
          style={styles.choresList}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListEmptyComponent={() => (
            <View style={styles.emptyList}>
              <ThemedText style={styles.emptyListText}>
                No chores yet. Tap "Add Chore" to create one.
              </ThemedText>
            </View>
          )}
        />
        
        <TouchableOpacity style={styles.saveButton} onPress={saveChores}>
          <ThemedText style={styles.saveButtonText}>Save Chores</ThemedText>
        </TouchableOpacity>
      </View>
      
      {/* Edit Chore Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={editModalVisible}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalContainer}
        >
          <View style={styles.editModalContent}>
            <View style={styles.modalHeader}>
              <ThemedText style={styles.modalTitle}>
                {selectedChore ? 'Edit Chore' : 'Add Chore'}
              </ThemedText>
              <TouchableOpacity onPress={() => setEditModalVisible(false)}>
                <Ionicons name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.formGroup}>
              <ThemedText style={styles.inputLabel}>Chore Name</ThemedText>
              <TextInput
                style={styles.textInput}
                value={choreName}
                onChangeText={setChoreName}
                placeholder="e.g. Clean room"
              />
            </View>
            
            <View style={styles.formGroup}>
              <ThemedText style={styles.inputLabel}>Value ($)</ThemedText>
              <TextInput
                style={[styles.textInput, styles.valueInput]}
                value={choreValue}
                onChangeText={setChoreValue}
                keyboardType="number-pad"
                maxLength={2}
              />
            </View>
            
            <View style={styles.formGroup}>
              <ThemedText style={styles.inputLabel}>Due Day</ThemedText>
              <TouchableOpacity 
                style={styles.dueDaySelector}
                onPress={() => setDueDayModalVisible(true)}
              >
                <ThemedText style={styles.dueDayText}>{choreDueDay}</ThemedText>
                <Ionicons name="chevron-down" size={20} color="#666" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.formGroup}>
              <View style={styles.enabledContainer}>
                <ThemedText style={styles.inputLabel}>Enabled</ThemedText>
                <Switch
                  value={choreEnabled}
                  onValueChange={setChoreEnabled}
                  trackColor={{ false: '#D0D0D0', true: '#C8E6C9' }}
                  thumbColor={choreEnabled ? BRAND_COLORS.positive : '#F5F5F5'}
                />
              </View>
            </View>
            
            <TouchableOpacity 
              style={styles.saveChoreButton}
              onPress={handleSaveChore}
            >
              <ThemedText style={styles.saveChoreButtonText}>
                {selectedChore ? 'Update Chore' : 'Add Chore'}
              </ThemedText>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
      
      {/* Delete Confirmation Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={deleteModalVisible}
        onRequestClose={() => setDeleteModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.deleteModalContent}>
            <ThemedText style={styles.deleteModalTitle}>Delete Chore?</ThemedText>
            <ThemedText style={styles.deleteModalText}>
              Are you sure you want to delete "{choreToDelete?.name}"?
            </ThemedText>
            
            <View style={styles.deleteModalButtons}>
              <TouchableOpacity 
                style={[styles.deleteModalButton, styles.cancelButton]}
                onPress={() => setDeleteModalVisible(false)}
              >
                <ThemedText style={styles.cancelButtonText}>Cancel</ThemedText>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.deleteModalButton, styles.confirmButton]}
                onPress={handleDeleteChore}
              >
                <ThemedText style={styles.confirmButtonText}>Delete</ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      
      {/* Due Day Selection Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={dueDayModalVisible}
        onRequestClose={() => setDueDayModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <ThemedText style={styles.modalTitle}>Select Due Day</ThemedText>
              <TouchableOpacity onPress={() => setDueDayModalVisible(false)}>
                <Ionicons name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={DUE_DAY_OPTIONS}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={[
                    styles.dueDayOption,
                    choreDueDay === item && styles.dueDayOptionSelected
                  ]}
                  onPress={() => {
                    setChoreDueDay(item);
                    setDueDayModalVisible(false);
                  }}
                >
                  <ThemedText style={[
                    styles.dueDayOptionText,
                    choreDueDay === item && styles.dueDayOptionTextSelected
                  ]}>
                    {item}
                  </ThemedText>
                  {choreDueDay === item && (
                    <Ionicons name="checkmark" size={24} color={BRAND_COLORS.teal} />
                  )}
                </TouchableOpacity>
              )}
            />
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
  contentContainer: {
    flex: 1,
    padding: 16,
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  summaryContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  summaryTextContainer: {
    flex: 1,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  summaryDescription: {
    fontSize: 14,
    color: '#666666',
  },
  earningSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
    padding: 12,
  },
  earningTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  earningAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: BRAND_COLORS.positive,
  },
  listHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
  },
  addChoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: BRAND_COLORS.teal,
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  addChoreText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
    marginLeft: 4,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 16,
    lineHeight: 20,
  },
  choresList: {
    flex: 1,
    marginBottom: 16,
  },
  emptyList: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyListText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
  },
  choreItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  choreLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  completedCheckbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#CCCCCC',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  completedCheckboxActive: {
    backgroundColor: BRAND_COLORS.positive,
    borderColor: BRAND_COLORS.positive,
  },
  choreTextContainer: {
    flex: 1,
  },
  choreName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333333',
    marginBottom: 2,
  },
  choreNameCompleted: {
    textDecorationLine: 'line-through',
    color: '#888888',
  },
  choreDueDay: {
    fontSize: 12,
    color: '#666666',
  },
  choreRight: {
    alignItems: 'flex-end',
  },
  choreValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 6,
  },
  choreActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editButton: {
    padding: 6,
    marginRight: 8,
  },
  deleteButton: {
    padding: 6,
    marginRight: 12,
  },
  separator: {
    height: 1,
    backgroundColor: '#EEEEEE',
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
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editModalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    width: '85%',
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  formGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    color: '#555555',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  valueInput: {
    width: '30%',
  },
  dueDaySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 8,
    padding: 12,
  },
  dueDayText: {
    fontSize: 16,
  },
  enabledContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  saveChoreButton: {
    backgroundColor: BRAND_COLORS.teal,
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  saveChoreButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  
  // Delete modal
  deleteModalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    width: '85%',
    maxWidth: 400,
  },
  deleteModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  deleteModalText: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 24,
    textAlign: 'center',
  },
  deleteModalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  deleteModalButton: {
    flex: 1,
    borderRadius: 24,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#F2F2F2',
    marginRight: 8,
  },
  cancelButtonText: {
    color: '#666666',
    fontSize: 16,
    fontWeight: '500',
  },
  confirmButton: {
    backgroundColor: '#F44336',
    marginLeft: 8,
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  
  // Due day modal
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
  dueDayOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  dueDayOptionSelected: {
    backgroundColor: '#F6F9FC',
  },
  dueDayOptionText: {
    fontSize: 16,
    color: '#333333',
  },
  dueDayOptionTextSelected: {
    color: BRAND_COLORS.teal,
    fontWeight: '500',
  },
}); 