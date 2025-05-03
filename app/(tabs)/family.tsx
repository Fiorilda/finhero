import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Alert, FlatList, Modal, Platform, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

import { ThemedText } from '@/components/ThemedText';

// Raiffeisen Bank brand colors
const BRAND_COLORS = {
  primary: '#FFEE00', // Raiffeisen Yellow
  secondary: '#004E9E', // Raiffeisen Blue
  lightGray: '#AAAAAA',
  positive: '#4CAF50',
};

// Mock data for children accounts
const initialChildren = [
  {
    id: '1',
    name: 'Emma Smith',
    age: 15,
    balance: 120.50,
    avatar: 'girl',
    isActive: true,
  },
  {
    id: '2',
    name: 'Noah Smith',
    age: 13,
    balance: 75.25,
    avatar: 'boy',
    isActive: true,
  }
];

export default function FamilyScreen() {
  const [children, setChildren] = useState(initialChildren);
  const [modalVisible, setModalVisible] = useState(false);
  const [transferModalVisible, setTransferModalVisible] = useState(false);
  const [newChildName, setNewChildName] = useState('');
  const [newChildAge, setNewChildAge] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [selectedChildId, setSelectedChildId] = useState('');

  const addChild = () => {
    if (!newChildName.trim() || !newChildAge.trim()) {
      Alert.alert('Error', 'Please enter both name and age');
      return;
    }

    const age = parseInt(newChildAge);
    if (isNaN(age) || age < 12 || age > 17) {
      Alert.alert('Error', 'Please enter a valid age (12-17)');
      return;
    }

    const newChild = {
      id: Date.now().toString(),
      name: newChildName.trim(),
      age: age,
      balance: 0,
      avatar: Math.random() > 0.5 ? 'girl' : 'boy',
      isActive: false,
    };

    setChildren([...children, newChild]);
    setModalVisible(false);
    setNewChildName('');
    setNewChildAge('');
  };

  const removeChild = (id: string) => {
    Alert.alert(
      'Remove Child Account',
      'Are you sure you want to remove this child account?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Remove', 
          style: 'destructive',
          onPress: () => {
            setChildren(children.filter(child => child.id !== id));
          }
        }
      ]
    );
  };

  const openTransferModal = (id: string) => {
    setSelectedChildId(id);
    setTransferAmount('');
    setTransferModalVisible(true);
  };

  const transferMoney = () => {
    const amount = parseFloat(transferAmount);
    if (isNaN(amount) || amount <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    setChildren(children.map(child => {
      if (child.id === selectedChildId) {
        return {
          ...child,
          balance: child.balance + amount,
          isActive: true, // Activate the account when transferring money
        };
      }
      return child;
    }));

    setTransferModalVisible(false);
    Alert.alert('Success', 'Money transferred successfully!');
  };

  const toggleAccountStatus = (id: string) => {
    setChildren(children.map(child => {
      if (child.id === id) {
        return {
          ...child,
          isActive: !child.isActive,
        };
      }
      return child;
    }));
  };

  const renderChildItem = ({ item }: { item: typeof children[0] }) => (
    <View style={styles.childCard}>
      <View style={styles.childInfo}>
        <View style={[styles.avatar, { backgroundColor: item.avatar === 'girl' ? '#FFC0CB' : '#ADD8E6' }]}>
          <Ionicons 
            name="person" 
            size={30} 
            color={BRAND_COLORS.secondary} 
          />
        </View>
        <View style={styles.childDetails}>
          <View style={styles.nameStatusRow}>
            <ThemedText style={styles.childName}>{item.name}</ThemedText>
            <View style={[styles.statusBadge, { backgroundColor: item.isActive ? '#E8F5E9' : '#FFEBEE' }]}>
              <ThemedText style={[styles.statusText, { color: item.isActive ? BRAND_COLORS.positive : '#F44336' }]}>
                {item.isActive ? 'Active' : 'Inactive'}
              </ThemedText>
            </View>
          </View>
          <ThemedText style={styles.childAge}>{item.age} years old</ThemedText>
        </View>
      </View>
      
      <View style={styles.balanceSection}>
        <ThemedText style={styles.balanceLabel}>Balance</ThemedText>
        <ThemedText style={styles.balanceAmount}>${item.balance.toFixed(2)}</ThemedText>
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.transferButton]} 
            onPress={() => openTransferModal(item.id)}
          >
            <Ionicons name="wallet-outline" size={16} color="#FFFFFF" />
            <ThemedText style={styles.actionButtonText}>Transfer</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionButton, styles.toggleButton, { backgroundColor: item.isActive ? '#F44336' : BRAND_COLORS.positive }]}
            onPress={() => toggleAccountStatus(item.id)}
          >
            <ThemedText style={styles.actionButtonText}>{item.isActive ? 'Deactivate' : 'Activate'}</ThemedText>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity 
        style={styles.removeButton}
        onPress={() => removeChild(item.id)}
      >
        <Ionicons name="close-circle" size={22} color="#FF6B6B" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.title}>Children</ThemedText>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <View style={styles.addChildButton}>
            <Ionicons name="add" size={24} color="#FFFFFF" />
          </View>
        </TouchableOpacity>
      </View>

      <ThemedText style={styles.subtitle}>Manage your children's accounts (ages 12-17)</ThemedText>

      <FlatList
        data={children}
        renderItem={renderChildItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.childrenList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="people" size={60} color={BRAND_COLORS.lightGray} />
            <ThemedText style={styles.emptyStateText}>
              You haven't added any children yet
            </ThemedText>
            <TouchableOpacity 
              style={styles.emptyStateButton}
              onPress={() => setModalVisible(true)}
            >
              <ThemedText style={styles.emptyStateButtonText}>Add a Child</ThemedText>
            </TouchableOpacity>
          </View>
        }
      />

      {/* Add Child Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <ThemedText style={styles.modalTitle}>Add Child</ThemedText>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#000000" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalForm}>
              <View style={styles.inputContainer}>
                <ThemedText style={styles.label}>Child's Name</ThemedText>
                <TextInput
                  style={styles.input}
                  placeholder="Enter child's name"
                  value={newChildName}
                  onChangeText={setNewChildName}
                />
              </View>

              <View style={styles.inputContainer}>
                <ThemedText style={styles.label}>Child's Age (12-17)</ThemedText>
                <TextInput
                  style={styles.input}
                  placeholder="Enter age between 12-17"
                  value={newChildAge}
                  onChangeText={setNewChildAge}
                  keyboardType="number-pad"
                  maxLength={2}
                />
              </View>

              <ThemedText style={styles.noteText}>
                Note: After adding a child, you'll need to transfer money to activate their account.
              </ThemedText>

              <TouchableOpacity 
                style={styles.addChildButtonModal}
                onPress={addChild}
              >
                <ThemedText style={styles.addChildButtonText}>Add Child</ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Transfer Money Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={transferModalVisible}
        onRequestClose={() => setTransferModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <ThemedText style={styles.modalTitle}>Transfer Money</ThemedText>
              <TouchableOpacity onPress={() => setTransferModalVisible(false)}>
                <Ionicons name="close" size={24} color="#000000" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalForm}>
              <View style={styles.inputContainer}>
                <ThemedText style={styles.label}>Amount ($)</ThemedText>
                <TextInput
                  style={styles.input}
                  placeholder="Enter amount to transfer"
                  value={transferAmount}
                  onChangeText={setTransferAmount}
                  keyboardType="decimal-pad"
                />
              </View>

              <ThemedText style={styles.noteText}>
                This amount will be transferred from your wallet to your child's account.
              </ThemedText>

              <TouchableOpacity 
                style={styles.addChildButtonModal}
                onPress={transferMoney}
              >
                <ThemedText style={styles.addChildButtonText}>Transfer</ThemedText>
              </TouchableOpacity>
            </View>
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
  },
  header: {
    backgroundColor: BRAND_COLORS.primary,
    paddingVertical: 30,
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
  },
  addChildButton: {
    backgroundColor: BRAND_COLORS.secondary,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#555555',
    marginTop: 20,
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  childrenList: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  childCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    position: 'relative',
  },
  childInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  childDetails: {
    flex: 1,
  },
  nameStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  childName: {
    fontSize: 18,
    fontWeight: '600',
  },
  childAge: {
    fontSize: 14,
    color: '#777777',
  },
  balanceSection: {
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 12,
  },
  balanceLabel: {
    fontSize: 14,
    color: '#777777',
    marginBottom: 4,
  },
  balanceAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: BRAND_COLORS.secondary,
    marginBottom: 12,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginRight: 10,
  },
  transferButton: {
    backgroundColor: BRAND_COLORS.secondary,
  },
  toggleButton: {
    backgroundColor: BRAND_COLORS.positive,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontWeight: '500',
    fontSize: 14,
    marginLeft: 4,
  },
  removeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#777777',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  emptyStateButton: {
    backgroundColor: BRAND_COLORS.secondary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  emptyStateButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
  },
  modalForm: {
    paddingBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#555555',
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  noteText: {
    fontSize: 14,
    color: '#777777',
    marginBottom: 20,
    fontStyle: 'italic',
  },
  addChildButtonModal: {
    backgroundColor: BRAND_COLORS.secondary,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  addChildButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  }
}); 