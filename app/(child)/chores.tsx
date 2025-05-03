import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    FlatList,
    RefreshControl,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';

import {
    Chore,
    getChoresByChildId,
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

export default function ChildChoresScreen() {
  const router = useRouter();
  const [chores, setChores] = useState<Chore[]>([]);
  const [completedChores, setCompletedChores] = useState<Chore[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('todo');

  const loadData = () => {
    const allChores = getChoresByChildId(MOCK_CHILD_ID);
    const pending = allChores.filter(chore => !chore.completed && chore.enabled);
    const completed = allChores.filter(chore => chore.completed && chore.enabled);
    
    setChores(pending);
    setCompletedChores(completed);
  };

  useEffect(() => {
    loadData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
    setTimeout(() => setRefreshing(false), 1000);
  };

  const toggleChoreCompletion = (choreId: string) => {
    // In a real app, this would call an API to update the chore status
    
    // Optimistic update for UI
    if (activeTab === 'todo') {
      const choreToUpdate = chores.find(c => c.id === choreId);
      if (choreToUpdate) {
        // Move to completed list
        setChores(prevChores => prevChores.filter(c => c.id !== choreId));
        setCompletedChores(prevCompleted => [...prevCompleted, {...choreToUpdate, completed: true}]);
        
        // Show completion message
        Alert.alert(
          "Chore Completed! 🎉",
          `Good job! You earned $${choreToUpdate.value.toFixed(2)} for completing "${choreToUpdate.name}".`,
          [{ text: "OK" }]
        );
      }
    } else {
      // Cannot un-complete a chore from completed tab
      Alert.alert(
        "Already Completed",
        "This chore has already been marked as completed.",
        [{ text: "OK" }]
      );
    }
  };

  const renderChoreItem = ({ item }: { item: Chore }) => (
    <TouchableOpacity 
      style={styles.choreItem}
      onPress={() => toggleChoreCompletion(item.id)}
    >
      <View style={styles.choreCheck}>
        <View style={[
          styles.checkCircle,
          activeTab === 'completed' && styles.checkCircleCompleted
        ]}>
          {activeTab === 'completed' && (
            <Ionicons name="checkmark" size={16} color="#FFFFFF" />
          )}
        </View>
      </View>
      
      <View style={styles.choreContent}>
        <ThemedText style={styles.choreName}>{item.name}</ThemedText>
        <View style={styles.choreInfo}>
          <View style={styles.choreMetaInfo}>
            <ThemedText style={styles.choreValue}>${item.value.toFixed(2)}</ThemedText>
            {item.recurrence !== 'once' && (
              <View style={styles.recurrenceTag}>
                <ThemedText style={styles.recurrenceText}>
                  {item.recurrence === 'daily' ? 'Daily' : 
                   item.recurrence === 'weekly' ? 'Weekly' : 'Monthly'}
                </ThemedText>
              </View>
            )}
          </View>
          <ThemedText style={styles.choreDueDay}>Due: {item.dueDay}</ThemedText>
        </View>
      </View>
      
      <Ionicons 
        name={activeTab === 'todo' ? 'checkmark-circle-outline' : 'checkmark-circle'} 
        size={28} 
        color={activeTab === 'todo' ? BRAND_COLORS.teal : BRAND_COLORS.positive} 
      />
    </TouchableOpacity>
  );

  // Calculate total earnings from completed chores
  const totalEarnings = completedChores.reduce((sum, chore) => sum + chore.value, 0);

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
        {/* Summary Card */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <ThemedText style={styles.summaryLabel}>To-Do Chores</ThemedText>
              <ThemedText style={styles.summaryValue}>{chores.length}</ThemedText>
            </View>
            <View style={styles.summaryItem}>
              <ThemedText style={styles.summaryLabel}>Completed</ThemedText>
              <ThemedText style={styles.summaryValue}>{completedChores.length}</ThemedText>
            </View>
            <View style={styles.summaryItem}>
              <ThemedText style={styles.summaryLabel}>Earnings</ThemedText>
              <ThemedText style={styles.earningsValue}>${totalEarnings.toFixed(2)}</ThemedText>
            </View>
          </View>
          
          {chores.length > 0 && (
            <TouchableOpacity style={styles.summaryButton}>
              <ThemedText style={styles.summaryButtonText}>Complete All</ThemedText>
            </TouchableOpacity>
          )}
        </View>
        
        {/* Tabs */}
        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'todo' && styles.activeTab]}
            onPress={() => setActiveTab('todo')}
          >
            <ThemedText style={[styles.tabText, activeTab === 'todo' && styles.activeTabText]}>
              To-Do
            </ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'completed' && styles.activeTab]}
            onPress={() => setActiveTab('completed')}
          >
            <ThemedText style={[styles.tabText, activeTab === 'completed' && styles.activeTabText]}>
              Completed
            </ThemedText>
          </TouchableOpacity>
        </View>
        
        {/* Chore List */}
        <View style={styles.choresContainer}>
          {activeTab === 'todo' ? (
            chores.length > 0 ? (
              <FlatList
                data={chores}
                renderItem={renderChoreItem}
                keyExtractor={item => item.id}
                scrollEnabled={false}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
              />
            ) : (
              <View style={styles.emptyContainer}>
                <Ionicons name="checkbox" size={40} color="#CCCCCC" />
                <ThemedText style={styles.emptyText}>No chores to complete</ThemedText>
                <ThemedText style={styles.emptySubtext}>Check back later for new tasks</ThemedText>
              </View>
            )
          ) : (
            completedChores.length > 0 ? (
              <FlatList
                data={completedChores}
                renderItem={renderChoreItem}
                keyExtractor={item => item.id}
                scrollEnabled={false}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
              />
            ) : (
              <View style={styles.emptyContainer}>
                <Ionicons name="trophy" size={40} color="#CCCCCC" />
                <ThemedText style={styles.emptyText}>No completed chores yet</ThemedText>
                <ThemedText style={styles.emptySubtext}>Complete tasks to earn money</ThemedText>
              </View>
            )
          )}
        </View>
        
        {/* Tips & Guidance */}
        <View style={styles.tipsContainer}>
          <View style={styles.tipHeader}>
            <Ionicons name="bulb" size={20} color="#FF9800" />
            <ThemedText style={styles.tipTitle}>Chore Tips</ThemedText>
          </View>
          <ThemedText style={styles.tipText}>
            Complete your chores to earn money. Recurring chores will appear again after they're reset.
          </ThemedText>
        </View>
        
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
  scrollContainer: {
    flex: 1,
  },
  scrollContentContainer: {
    paddingBottom: 40,
  },
  summaryCard: {
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
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
  },
  earningsValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: BRAND_COLORS.positive,
  },
  summaryButton: {
    backgroundColor: BRAND_COLORS.teal,
    borderRadius: 6,
    paddingVertical: 10,
    alignItems: 'center',
  },
  summaryButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
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
    fontWeight: '600',
    color: '#666666',
  },
  activeTabText: {
    color: BRAND_COLORS.secondary,
  },
  choresContainer: {
    marginHorizontal: 16,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    minHeight: 200,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666666',
    marginTop: 16,
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#888888',
    textAlign: 'center',
  },
  choreItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  choreCheck: {
    marginRight: 12,
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: BRAND_COLORS.teal,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkCircleCompleted: {
    backgroundColor: BRAND_COLORS.positive,
    borderColor: BRAND_COLORS.positive,
  },
  choreContent: {
    flex: 1,
    marginRight: 12,
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
    alignItems: 'center',
  },
  choreMetaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  choreValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: BRAND_COLORS.teal,
    marginRight: 8,
  },
  recurrenceTag: {
    backgroundColor: '#F0F0F0',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  recurrenceText: {
    fontSize: 10,
    color: '#666666',
  },
  choreDueDay: {
    fontSize: 12,
    color: '#666666',
  },
  separator: {
    height: 1,
    backgroundColor: '#F0F0F0',
  },
  tipsContainer: {
    margin: 16,
    padding: 16,
    backgroundColor: '#FFF8E1',
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#FF9800',
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
}); 