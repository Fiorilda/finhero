import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Alert, Platform, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
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
    if (isNaN(age) || age < 1 || age > 18) {
      Alert.alert('Invalid Age', 'Please enter a valid age between 1 and 18.');
      return;
    }

    // Add child logic would go here in a real app
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
    // This would update the database in a real app
    Alert.alert(
      'Card Status Updated',
      'The card status has been updated successfully.',
      [{ text: 'OK' }]
    );
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
            placeholder="Age"
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
                <Ionicons name="person-circle" size={40} color="#2196F3" />
                <ThemedText style={styles.avatarText}>Boy</ThemedText>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.avatarOption, newChildAvatar === 'girl' && styles.selectedAvatar]}
                onPress={() => setNewChildAvatar('girl')}
              >
                <Ionicons name="person-circle" size={40} color="#FF4081" />
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
          <TouchableOpacity 
            key={child.id}
            style={styles.childCard}
            onPress={() => router.push({
              pathname: '/child-details',
              params: { id: child.id }
            })}
          >
            <View style={styles.childInfoSection}>
              <View style={[styles.childAvatar, { backgroundColor: child.avatar === 'girl' ? '#FFC0CB' : '#ADD8E6' }]}>
                <Ionicons 
                  name="person" 
                  size={24} 
                  color={BRAND_COLORS.secondary}
                />
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
            </View>
            
            <View style={styles.actionsSection}>
              <View style={styles.statusIndicator}>
                <View style={[
                  styles.statusDot, 
                  { backgroundColor: child.isActive ? BRAND_COLORS.positive : '#F44336' }
                ]} />
                <ThemedText style={styles.statusText}>
                  {child.isActive ? 'Card Active' : 'Card Inactive'}
                </ThemedText>
              </View>
              
              <TouchableOpacity 
                style={[
                  styles.toggleButton,
                  { backgroundColor: child.isActive ? '#F44336' : BRAND_COLORS.positive }
                ]}
                onPress={() => toggleCardStatus(child.id)}
              >
                <ThemedText style={styles.toggleButtonText}>
                  {child.isActive ? 'Deactivate' : 'Activate'}
                </ThemedText>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
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
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
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
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginRight: 10,
    alignItems: 'center',
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
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  childInfoSection: {
    flexDirection: 'row',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    paddingBottom: 12,
  },
  childAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
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
  actionsSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 14,
    color: '#666',
  },
  toggleButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  toggleButtonText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '500',
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
}); 