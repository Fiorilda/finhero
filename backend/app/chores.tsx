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
  const childNameString = typeof childName === 'string' ? childName : 'Child';
  
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
      `${childNameString}'s chores have been updated.`,
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
      <HeaderWithBack title={`${childNameString}'s Chores`} />
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidView}
      >
        <View style={styles.content}>
          <View style={styles.summaryContainer}>
            <View style={styles.summaryItem}>
              <ThemedText style={styles.summaryNumber}>{chores.length}</ThemedText>
              <ThemedText style={styles.summaryLabel}>Total</ThemedText>
            </View>
            <View style={styles.summaryItem}>
              <ThemedText style={styles.summaryNumber}>
                {chores.filter(c => c.enabled).length}
              </ThemedText>
              <ThemedText style={styles.summaryLabel}>Enabled</ThemedText>
            </View>
            <View style={styles.summaryItem}>
              <ThemedText style={styles.summaryNumber}>
                {chores.filter(c => c.completed).length}
              </ThemedText>
              <ThemedText style={styles.summaryLabel}>Completed</ThemedText>
            </View>
          </View>

          <FlatList
            data={chores}
            renderItem={renderChoreItem}
            keyExtractor={item => item.id}
            style={styles.choresList}
            contentContainerStyle={styles.choresTodayContent}
            ListHeaderComponent={
              <View style={styles.sectionHeader}>
                <ThemedText style={styles.sectionTitle}>All Chores</ThemedText>
                <TouchableOpacity onPress={handleAddChore}>
                  <Ionicons name="add-circle" size={28} color={BRAND_COLORS.secondary} />
                </TouchableOpacity>
              </View>
            }
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Ionicons name="checkbox-outline" size={50} color="#AAAAAA" />
                <ThemedText style={styles.emptyText}>No chores added yet</ThemedText>
                <TouchableOpacity 
                  style={styles.addButton}
                  onPress={handleAddChore}
                >
                  <ThemedText style={styles.addButtonText}>Add a Chore</ThemedText>
                </TouchableOpacity>
              </View>
            }
          />

          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.saveButton}
              onPress={saveChores}
            >
              <ThemedText style={styles.saveButtonText}>Save Chores</ThemedText>
            </TouchableOpacity>
          </View>
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
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: Platform.OS === 'ios' ? 40 : 30,
  },
  keyboardAvoidView: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666666',
  },
  sectionHeader: {
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
  choresList: {
    flex: 1,
    marginBottom: 16,
  },
  choresTodayContent: {
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 16,
  },
  addButton: {
    backgroundColor: BRAND_COLORS.teal,
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonContainer: {
    alignItems: 'center',
    marginTop: 20,
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
}); 