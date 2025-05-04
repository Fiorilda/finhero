import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Alert, Modal, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '../../components/ThemedText';

// Define brand colors since they're not in the Colors.ts file
const BRAND_COLORS = {
  primary: '#FFEE00',    // Raiffeisen Yellow
  secondary: '#004E9E',  // Raiffeisen Blue
  positive: '#4CAF50',   // Green for positive states
  negative: '#F44336',   // Red for negative states
  teal: '#00BCD4',       // Teal for special highlights
  lightGray: '#CCCCCC'   // Light gray for neutral elements
};

// Import from the correct location
import { Child, children } from '../../app/mock-data';

export default function FamilyScreen() {
  const [searchText, setSearchText] = useState('');
  const [showAddChildForm, setShowAddChildForm] = useState(false);
  const [newChildName, setNewChildName] = useState('');
  const [newChildAge, setNewChildAge] = useState('');
  const [newChildAvatar, setNewChildAvatar] = useState('boy');
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);
  const [transferAmount, setTransferAmount] = useState('');
  
  // Filter children based on search text
  const filteredChildren = children.filter((child: Child) => 
    child.name.toLowerCase().includes(searchText.toLowerCase())
  );

  // Function to handle adding a new child
  const handleAddChild = () => {
    if (!newChildName.trim()) {
      Alert.alert('Required Field', 'Please enter a name for the child.');
      return;
    }

    const age = parseInt(newChildAge);
    if (isNaN(age) || age < 12 || age > 17) {
      Alert.alert('Invalid Age', 'Please enter a valid age between 12 and 17.');
      return;
    }

    // Create a new child object
    const newChild: Child = {
      id: `c${children.length + 1}`,
      name: newChildName,
      age: age,
      email: `${newChildName.toLowerCase().replace(/\s+/g, '.')}@example.com`,
      phone: '555-000-0000',
      school: 'School',
      avatar: newChildAvatar,
      isActive: false,
      parentId: 'p1', // Default parent ID
      xp: 0,
      completedQuizzes: [],
      accounts: {
        spending: {
          id: `acc${children.length + 1}s`,
          balance: 0,
          restrictions: []
        },
        savings: {
          id: `acc${children.length + 1}sv`,
          balance: 0,
          goals: []
        }
      }
    };

    // Add the new child to the children array
    children.push(newChild);

    Alert.alert(
      'Success!', 
      `Child ${newChildName} has been added. An invitation has been sent to set up their account.`,
      [
        { 
          text: 'OK', 
          onPress: () => {
            setShowAddChildForm(false);
            setNewChildName('');
            setNewChildAge('');
            setNewChildAvatar('boy');
          } 
        }
      ]
    );
  };

  // Function to toggle card activation status
  const toggleCardStatus = (childId: string) => {
    // Find the child and toggle isActive property
    const childIndex = children.findIndex(child => child.id === childId);
    if (childIndex !== -1) {
      children[childIndex].isActive = !children[childIndex].isActive;
      
      Alert.alert(
        'Card Status Updated',
        `The card for ${children[childIndex].name} has been ${children[childIndex].isActive ? 'activated' : 'deactivated'}.`,
        [{ text: 'OK' }]
      );
    }
  };

  // Function to handle money transfer to child
  const handleTransfer = () => {
    if (!selectedChild) return;
    
    const amount = parseFloat(transferAmount);
    if (isNaN(amount) || amount <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount greater than 0.');
      return;
    }

    // Find the child and update their spending balance
    const childIndex = children.findIndex(child => child.id === selectedChild.id);
    if (childIndex !== -1) {
      children[childIndex].accounts.spending.balance += amount;
      
      Alert.alert(
        'Transfer Successful', 
        `$${amount.toFixed(2)} has been transferred to ${selectedChild.name}'s account.`,
        [
          { 
            text: 'OK', 
            onPress: () => {
              setShowTransferModal(false);
              setTransferAmount('');
              setSelectedChild(null);
            } 
          }
        ]
      );
    }
  };

  // Open transfer modal for a specific child
  const openTransferModal = (child: Child) => {
    setSelectedChild(child);
    setTransferAmount('');
    setShowTransferModal(true);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      
      {/* Header */}
      <View style={styles.header}>
        <ThemedText style={styles.headerTitle}>Family Management</ThemedText>
      </View>

      {/* Search & Add Child Section */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search children..."
            value={searchText}
            onChangeText={setSearchText}
            placeholderTextColor="#999"
          />
        </View>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setShowAddChildForm(!showAddChildForm)}
        >
          <Ionicons name={showAddChildForm ? "close" : "add"} size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Add Child Form */}
      {showAddChildForm && (
        <View style={styles.addChildForm}>
          <ThemedText style={styles.formTitle}>Add a New Child</ThemedText>
          
          <TextInput
            style={styles.input}
            placeholder="Child's Name"
            value={newChildName}
            onChangeText={setNewChildName}
            placeholderTextColor="#999"
          />
          
          <TextInput
            style={styles.input}
            placeholder="Age (12-17)"
            value={newChildAge}
            onChangeText={setNewChildAge}
            keyboardType="number-pad"
            placeholderTextColor="#999"
          />
          
          <View style={styles.avatarSelection}>
            <ThemedText style={styles.avatarLabel}>Choose an Avatar:</ThemedText>
            <View style={styles.avatarOptions}>
              <TouchableOpacity 
                style={[styles.avatarOption, newChildAvatar === 'boy' && styles.selectedAvatar]}
                onPress={() => setNewChildAvatar('boy')}
              >
                <View style={[styles.avatarIconContainer, { backgroundColor: '#B3D1FF', borderWidth: 2, borderColor: '#6FB66B' }]}>
                  <Ionicons name="person" size={40} color={BRAND_COLORS.secondary} />
                </View>
                <ThemedText style={styles.avatarText}>Boy</ThemedText>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.avatarOption, newChildAvatar === 'girl' && styles.selectedAvatar]}
                onPress={() => setNewChildAvatar('girl')}
              >
                <View style={[styles.avatarIconContainer, { backgroundColor: '#FFB6C1', borderWidth: 2, borderColor: '#6FB66B' }]}>
                  <Ionicons name="person" size={40} color={BRAND_COLORS.secondary} />
                </View>
                <ThemedText style={styles.avatarText}>Girl</ThemedText>
              </TouchableOpacity>
            </View>
          </View>
          
          <TouchableOpacity 
            style={styles.submitButton}
            onPress={handleAddChild}
          >
            <ThemedText style={styles.submitButtonText}>Add Child</ThemedText>
          </TouchableOpacity>
        </View>
      )}

      {/* Children List */}
      <ScrollView style={styles.childrenList} showsVerticalScrollIndicator={false}>
        {filteredChildren.map((child: Child) => (
          <View key={child.id} style={styles.childCard}>
            <TouchableOpacity 
              style={styles.childInfoSection}
              onPress={() => router.push({
                pathname: '/child-details',
                params: { id: child.id }
              })}
            >
              <View style={styles.childAvatarContainer}>
                {child.avatar === 'girl' ? (
                  <View style={[styles.childAvatarIcon, { backgroundColor: '#FFB6C1', borderWidth: 2, borderColor: '#6FB66B' }]}>
                    <Ionicons name="person" size={30} color={BRAND_COLORS.secondary} />
                  </View>
                ) : (
                  <View style={[styles.childAvatarIcon, { backgroundColor: '#B3D1FF', borderWidth: 2, borderColor: '#6FB66B' }]}>
                    <Ionicons name="person" size={30} color={BRAND_COLORS.secondary} />
                  </View>
                )}
              </View>
              
              <View style={styles.childDetails}>
                <ThemedText style={styles.childName}>{child.name}</ThemedText>
                <ThemedText style={styles.childAge}>{child.age} years old</ThemedText>
                <View style={styles.balanceContainer}>
                  <ThemedText style={styles.balanceLabel}>Total Balance:</ThemedText>
                  <ThemedText style={styles.balanceValue}>
                    ${(
                      child.accounts.spending.balance + 
                      child.accounts.savings.balance + 
                      (child.accounts.investing?.balance || 0)
                    ).toFixed(2)}
                  </ThemedText>
                </View>
              </View>
            </TouchableOpacity>
            
            <View style={styles.childCardDivider} />
            
            <View style={styles.actionsRow}>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => openTransferModal(child)}
              >
                <Ionicons name="cash-outline" size={20} color={BRAND_COLORS.secondary} />
                <Text style={styles.actionButtonText}>Transfer</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => router.push({
                  pathname: '/child-details',
                  params: { id: child.id }
                })}
              >
                <Ionicons name="eye-outline" size={20} color={BRAND_COLORS.secondary} />
                <Text style={styles.actionButtonText}>View</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  styles.actionButton, 
                  styles.toggleCardButton,
                  { backgroundColor: child.isActive ? '#FEE8E8' : '#E8F5E9' }
                ]}
                onPress={() => toggleCardStatus(child.id)}
              >
                <Ionicons 
                  name={child.isActive ? "card" : "card-outline"} 
                  size={20} 
                  color={child.isActive ? BRAND_COLORS.negative : BRAND_COLORS.positive} 
                />
                <Text 
                  style={[
                    styles.actionButtonText,
                    {color: child.isActive ? BRAND_COLORS.negative : BRAND_COLORS.positive}
                  ]}
                >
                  {child.isActive ? 'Deactivate Card' : 'Activate Card'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
        
        {filteredChildren.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="people" size={48} color="#CCCCCC" />
            <ThemedText style={styles.emptyStateText}>
              {searchText ? 'No children found' : 'You have no children yet'}
            </ThemedText>
            <ThemedText style={styles.emptyStateSubtext}>
              {searchText ? 'Try a different search term' : 'Add a child to get started'}
            </ThemedText>
            
            {!searchText && (
              <TouchableOpacity 
                style={styles.emptyStateButton}
                onPress={() => setShowAddChildForm(true)}
              >
                <ThemedText style={styles.emptyStateButtonText}>Add Child</ThemedText>
              </TouchableOpacity>
            )}
          </View>
        )}
      </ScrollView>

      {/* Transfer Money Modal */}
      <Modal
        visible={showTransferModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowTransferModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Transfer Money</Text>
              <TouchableOpacity onPress={() => setShowTransferModal(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            
            {selectedChild && (
              <View style={styles.transferToContainer}>
                <Text style={styles.transferToLabel}>To:</Text>
                <View style={styles.transferToChild}>
                  {selectedChild.avatar === 'girl' ? (
                    <View style={[styles.transferToAvatarIcon, { backgroundColor: '#FFB6C1', borderWidth: 1, borderColor: '#6FB66B' }]}>
                      <Ionicons name="person" size={20} color={BRAND_COLORS.secondary} />
                    </View>
                  ) : (
                    <View style={[styles.transferToAvatarIcon, { backgroundColor: '#B3D1FF', borderWidth: 1, borderColor: '#6FB66B' }]}>
                      <Ionicons name="person" size={20} color={BRAND_COLORS.secondary} />
                    </View>
                  )}
                  <Text style={styles.transferToName}>{selectedChild.name}</Text>
                </View>
              </View>
            )}
            
            <View style={styles.transferAmountContainer}>
              <Text style={styles.transferAmountLabel}>Amount:</Text>
              <View style={styles.transferAmountInputContainer}>
                <Text style={styles.currencySymbol}>$</Text>
                <TextInput
                  style={styles.transferAmountInput}
                  value={transferAmount}
                  onChangeText={setTransferAmount}
                  placeholder="0.00"
                  keyboardType="decimal-pad"
                  placeholderTextColor="#999"
                />
              </View>
            </View>
            
            <View style={styles.transferOptions}>
              <TouchableOpacity 
                style={styles.quickAmountButton}
                onPress={() => setTransferAmount('5')}
              >
                <Text style={styles.quickAmountText}>$5</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.quickAmountButton}
                onPress={() => setTransferAmount('10')}
              >
                <Text style={styles.quickAmountText}>$10</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.quickAmountButton}
                onPress={() => setTransferAmount('20')}
              >
                <Text style={styles.quickAmountText}>$20</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.quickAmountButton}
                onPress={() => setTransferAmount('50')}
              >
                <Text style={styles.quickAmountText}>$50</Text>
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity 
              style={[
                styles.transferButton,
                (!transferAmount || parseFloat(transferAmount) <= 0) && styles.disabledButton
              ]}
              onPress={handleTransfer}
              disabled={!transferAmount || parseFloat(transferAmount) <= 0}
            >
              <Text style={styles.transferButtonText}>Transfer Now</Text>
            </TouchableOpacity>
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
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
  },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: BRAND_COLORS.secondary,
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'center',
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginRight: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: '#333',
  },
  addButton: {
    backgroundColor: BRAND_COLORS.secondary,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  childrenList: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  childCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  childInfoSection: {
    flexDirection: 'row',
    padding: 16,
  },
  childAvatarContainer: {
    marginRight: 16,
  },
  childAvatarIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  childDetails: {
    flex: 1,
  },
  childName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  childAge: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
  },
  balanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  balanceLabel: {
    fontSize: 14,
    color: '#666',
    marginRight: 4,
  },
  balanceValue: {
    fontSize: 16,
    fontWeight: '600',
    color: BRAND_COLORS.secondary,
  },
  childCardDivider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginHorizontal: 16,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: '#F5F5F5',
  },
  toggleCardButton: {
    paddingHorizontal: 16,
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: BRAND_COLORS.secondary,
    marginLeft: 4,
  },
  addChildForm: {
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
  formTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: BRAND_COLORS.secondary,
    marginBottom: 16,
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    color: '#333',
  },
  avatarSelection: {
    marginBottom: 16,
  },
  avatarLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  avatarOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  avatarOption: {
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
  },
  avatarIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
  },
  selectedAvatar: {
    backgroundColor: 'rgba(0, 78, 158, 0.1)',
    borderWidth: 1,
    borderColor: BRAND_COLORS.secondary,
  },
  avatarText: {
    fontSize: 14,
    marginTop: 4,
    color: '#666',
  },
  submitButton: {
    backgroundColor: BRAND_COLORS.secondary,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 12,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 4,
    marginBottom: 16,
  },
  emptyStateButton: {
    backgroundColor: BRAND_COLORS.secondary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  emptyStateButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
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
    color: '#333',
  },
  transferToContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  transferToLabel: {
    fontSize: 16,
    color: '#666',
    marginRight: 8,
  },
  transferToChild: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  transferToAvatarIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  transferToName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  transferAmountContainer: {
    marginBottom: 20,
  },
  transferAmountLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  transferAmountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  currencySymbol: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 4,
  },
  transferAmountInput: {
    flex: 1,
    height: 50,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  transferOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  quickAmountButton: {
    backgroundColor: '#F5F5F5',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  quickAmountText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  transferButton: {
    backgroundColor: BRAND_COLORS.secondary,
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
  },
  transferButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    backgroundColor: '#CCCCCC',
  }
});