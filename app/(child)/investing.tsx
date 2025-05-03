import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    FlatList,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

import { Child, Investment, getChildById, getInvestmentsByChildId } from '@/app/mock-data';

// Raiffeisen Bank brand colors
const BRAND_COLORS = {
  primary: '#FFEE00', // Raiffeisen Yellow
  secondary: '#004E9E', // Raiffeisen Blue
  lightGray: '#AAAAAA',
  positive: '#4CAF50',
  negative: '#F44336',
  teal: '#37a69b',
  purple: '#8E44AD',
};

// Mock child ID until we have auth
const MOCK_CHILD_ID = 'c1';

export default function InvestingScreen() {
  const router = useRouter();
  const [childData, setChildData] = useState<Child | null>(null);
  const [investments, setInvestments] = useState<Investment[]>([]);

  useEffect(() => {
    // Load child data
    const child = getChildById(MOCK_CHILD_ID);
    if (child) {
      setChildData(child);
      
      // Load investments
      const childInvestments = getInvestmentsByChildId(MOCK_CHILD_ID);
      setInvestments(childInvestments);
    }
  }, []);

  if (!childData || !childData.accounts.investing) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  // Calculate total investment value and gain/loss
  const totalInvested = investments.reduce(
    (sum, investment) => sum + (investment.shares * investment.purchasePrice),
    0
  );
  
  const currentValue = investments.reduce(
    (sum, investment) => sum + (investment.shares * investment.currentPrice),
    0
  );
  
  const totalGainLoss = currentValue - totalInvested;
  const percentageChange = (totalGainLoss / totalInvested) * 100;

  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };

  // Format percentage with + or - sign
  const formatPercentage = (percentage: number) => {
    const sign = percentage >= 0 ? '+' : '';
    return `${sign}${percentage.toFixed(2)}%`;
  };

  // Format date to friendly format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Render an investment item
  const renderInvestmentItem = ({ item }: { item: Investment }) => {
    const currentInvestmentValue = item.shares * item.currentPrice;
    const originalInvestmentValue = item.shares * item.purchasePrice;
    const investmentGainLoss = currentInvestmentValue - originalInvestmentValue;
    const investmentPercentageChange = (investmentGainLoss / originalInvestmentValue) * 100;
    const isPositive = investmentGainLoss >= 0;
    
    return (
      <View style={styles.investmentItem}>
        <View style={styles.investmentHeader}>
          <View style={styles.symbolContainer}>
            <Text style={styles.symbol}>{item.symbol}</Text>
          </View>
          <View style={styles.investmentInfo}>
            <Text style={styles.investmentName}>{item.name}</Text>
            <Text style={styles.sharesInfo}>{item.shares} shares</Text>
          </View>
          <View style={styles.priceInfo}>
            <Text style={styles.currentPrice}>{formatCurrency(item.currentPrice)}</Text>
            <Text style={[
              styles.priceChange, 
              { color: isPositive ? BRAND_COLORS.positive : BRAND_COLORS.negative }
            ]}>
              {isPositive ? '+' : ''}{formatCurrency(investmentGainLoss)} ({formatPercentage(investmentPercentageChange)})
            </Text>
          </View>
        </View>
        
        <View style={styles.investmentDetails}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Purchased:</Text>
            <Text style={styles.detailValue}>{formatDate(item.purchaseDate)}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Purchase Price:</Text>
            <Text style={styles.detailValue}>{formatCurrency(item.purchasePrice)}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Current Value:</Text>
            <Text style={styles.detailValue}>{formatCurrency(currentInvestmentValue)}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header with account balance */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.balanceContainer}>
          <Text style={styles.balanceLabel}>Investing Account</Text>
          <Text style={styles.balanceAmount}>{formatCurrency(currentValue)}</Text>
          <View style={styles.changeContainer}>
            <Text style={[
              styles.changeText, 
              { color: totalGainLoss >= 0 ? '#FFFFFF' : '#FFCCCC' }
            ]}>
              {formatCurrency(totalGainLoss)} ({formatPercentage(percentageChange)})
            </Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.contentContainer} showsVerticalScrollIndicator={false}>
        {/* Quick actions */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionButton}>
            <View style={styles.actionIcon}>
              <Ionicons name="search" size={24} color={BRAND_COLORS.purple} />
            </View>
            <Text style={styles.actionText}>Research</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <View style={styles.actionIcon}>
              <Ionicons name="trending-up" size={24} color={BRAND_COLORS.purple} />
            </View>
            <Text style={styles.actionText}>Buy</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <View style={styles.actionIcon}>
              <Ionicons name="trending-down" size={24} color={BRAND_COLORS.purple} />
            </View>
            <Text style={styles.actionText}>Sell</Text>
          </TouchableOpacity>
        </View>

        {/* Portfolio Summary */}
        <View style={styles.summaryContainer}>
          <Text style={styles.sectionTitle}>Portfolio Summary</Text>
          
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Total Invested</Text>
              <Text style={styles.summaryValue}>{formatCurrency(totalInvested)}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Current Value</Text>
              <Text style={styles.summaryValue}>{formatCurrency(currentValue)}</Text>
            </View>
          </View>
          
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Total Gain/Loss</Text>
              <Text style={[
                styles.summaryValue, 
                { color: totalGainLoss >= 0 ? BRAND_COLORS.positive : BRAND_COLORS.negative }
              ]}>
                {formatCurrency(totalGainLoss)}
              </Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Return</Text>
              <Text style={[
                styles.summaryValue, 
                { color: percentageChange >= 0 ? BRAND_COLORS.positive : BRAND_COLORS.negative }
              ]}>
                {formatPercentage(percentageChange)}
              </Text>
            </View>
          </View>
        </View>

        {/* Investments List */}
        <View style={styles.investmentsContainer}>
          <Text style={styles.sectionTitle}>Your Investments</Text>
          
          <FlatList
            data={investments}
            renderItem={renderInvestmentItem}
            keyExtractor={item => item.id}
            scrollEnabled={false}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No investments yet</Text>
              </View>
            }
          />
        </View>

        {/* Learning Section */}
        <View style={styles.learningContainer}>
          <View style={styles.learningHeader}>
            <Ionicons name="school" size={24} color="#FF9800" />
            <Text style={styles.learningTitle}>Investment Tips</Text>
          </View>
          
          <Text style={styles.learningText}>
            Investing is a long-term strategy. Markets go up and down, but historically, 
            they tend to rise over time. Stay patient and keep learning!
          </Text>
          
          <TouchableOpacity style={styles.learnMoreButton}>
            <Text style={styles.learnMoreText}>Learn More</Text>
          </TouchableOpacity>
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
  header: {
    backgroundColor: BRAND_COLORS.purple,
    padding: 24,
    paddingTop: 60,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    zIndex: 10,
  },
  balanceContainer: {
    alignItems: 'center',
  },
  balanceLabel: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.8,
    marginBottom: 4,
  },
  balanceAmount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  changeContainer: {
    marginTop: 4,
  },
  changeText: {
    fontSize: 14,
    color: '#FFFFFF',
  },
  contentContainer: {
    flex: 1,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: -20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  actionButton: {
    alignItems: 'center',
  },
  actionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  actionText: {
    fontSize: 12,
    color: '#333333',
  },
  summaryContainer: {
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryItem: {
    width: '48%',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
  },
  investmentsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    margin: 16,
    marginTop: 0,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  investmentItem: {
    paddingVertical: 12,
  },
  investmentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  symbolContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: BRAND_COLORS.purple + '20', // 20% opacity
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  symbol: {
    fontSize: 16,
    fontWeight: 'bold',
    color: BRAND_COLORS.purple,
  },
  investmentInfo: {
    flex: 1,
  },
  investmentName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333333',
    marginBottom: 2,
  },
  sharesInfo: {
    fontSize: 12,
    color: '#666666',
  },
  priceInfo: {
    alignItems: 'flex-end',
  },
  currentPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 2,
  },
  priceChange: {
    fontSize: 12,
  },
  investmentDetails: {
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
    marginLeft: 62, // To align with the content after the icon
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  detailLabel: {
    fontSize: 12,
    color: '#666666',
  },
  detailValue: {
    fontSize: 12,
    color: '#333333',
    fontWeight: '500',
  },
  separator: {
    height: 1,
    backgroundColor: '#F0F0F0',
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#999999',
  },
  learningContainer: {
    backgroundColor: '#FFF8E1',
    borderRadius: 12,
    margin: 16,
    marginTop: 0,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#FF9800',
  },
  learningHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  learningTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginLeft: 8,
  },
  learningText: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
    marginBottom: 16,
  },
  learnMoreButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#FF9800',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  learnMoreText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '500',
  },
}); 