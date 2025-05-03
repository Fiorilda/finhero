import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    FlatList,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

import { Investment, getInvestmentsByChildId } from '@/app/mock-data';

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

export default function InvestingScreen() {
  const router = useRouter();
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadInvestments();
  }, []);

  const loadInvestments = () => {
    const childInvestments = getInvestmentsByChildId(MOCK_CHILD_ID);
    setInvestments(childInvestments);
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadInvestments();
    setTimeout(() => setRefreshing(false), 1000);
  };

  const renderInvestmentItem = ({ item }: { item: Investment }) => {
    const currentValue = item.shares * item.currentPrice;
    const purchaseValue = item.shares * item.purchasePrice;
    const profitLoss = currentValue - purchaseValue;
    const profitLossPercent = (profitLoss / purchaseValue) * 100;
    const isProfit = profitLoss >= 0;
    
    return (
      <TouchableOpacity style={styles.investmentCard}>
        <View style={styles.investmentHeader}>
          <View style={styles.companyInfo}>
            <View style={styles.logoPlaceholder}>
              <Text style={styles.logoText}>{item.symbol}</Text>
            </View>
            <View>
              <Text style={styles.stockSymbol}>{item.symbol}</Text>
              <Text style={styles.companyName}>{item.name}</Text>
            </View>
          </View>
          <View style={styles.stockPerformance}>
            <Text 
              style={[
                styles.performancePercent,
                isProfit ? styles.profitText : styles.lossText
              ]}
            >
              {isProfit ? '+' : ''}{profitLossPercent.toFixed(2)}%
            </Text>
            <View style={styles.trendIconContainer}>
              <Ionicons 
                name={isProfit ? "trending-up" : "trending-down"} 
                size={16} 
                color={isProfit ? BRAND_COLORS.positive : '#F44336'} 
              />
            </View>
          </View>
        </View>
        
        <View style={styles.investmentDetails}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Shares</Text>
            <Text style={styles.detailValue}>{item.shares}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Price</Text>
            <Text style={styles.detailValue}>${item.currentPrice.toFixed(2)}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Value</Text>
            <Text style={styles.detailValue}>${currentValue.toFixed(2)}</Text>
          </View>
        </View>
        
        <View style={styles.performanceContainer}>
          <View style={styles.performanceHeader}>
            <Text style={styles.performanceLabel}>Performance</Text>
            <Text 
              style={[
                styles.performanceValue,
                isProfit ? styles.profitText : styles.lossText
              ]}
            >
              {isProfit ? '+' : ''}{profitLoss.toFixed(2)}
            </Text>
          </View>
          <View style={styles.investmentActions}>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionButtonText}>Learn More</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionButton, styles.tradeButton]}>
              <Text style={styles.tradeButtonText}>Trade</Text>
            </TouchableOpacity>
          </View>
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
          <Text style={styles.title}>My Investments</Text>
          <TouchableOpacity style={styles.exploreButton}>
            <Ionicons name="search" size={18} color="#FFFFFF" />
            <Text style={styles.exploreButtonText}>Explore</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.summaryCard}>
          <View style={styles.summaryLeft}>
            <Text style={styles.portfolioLabel}>Portfolio Value</Text>
            <Text style={styles.portfolioValue}>
              ${investments.reduce((sum, inv) => sum + (inv.shares * inv.currentPrice), 0).toFixed(2)}
            </Text>
            <View style={styles.performanceSummary}>
              <Ionicons name="trending-up" size={14} color={BRAND_COLORS.positive} />
              <Text style={styles.performanceSummaryText}>+3.24%</Text>
              <Text style={styles.performancePeriod}>this week</Text>
            </View>
          </View>
          <View style={styles.summaryRight}>
            {/* Simple chart placeholder */}
            <View style={styles.chartPlaceholder}>
              <View style={styles.chart}>
                <View style={styles.chartBar} />
                <View style={[styles.chartBar, { height: 15 }]} />
                <View style={[styles.chartBar, { height: 10 }]} />
                <View style={[styles.chartBar, { height: 25 }]} />
                <View style={[styles.chartBar, { height: 20 }]} />
              </View>
            </View>
          </View>
        </View>
        
        {investments.length > 0 ? (
          <FlatList
            data={investments}
            renderItem={renderInvestmentItem}
            keyExtractor={item => item.id}
            scrollEnabled={false}
            contentContainerStyle={styles.investmentsList}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons name="trending-up-outline" size={60} color="#CCCCCC" />
            <Text style={styles.emptyText}>No investments yet</Text>
            <Text style={styles.emptySubtext}>Explore stocks to start investing</Text>
            <TouchableOpacity style={styles.exploreStocksButton}>
              <Text style={styles.exploreStocksText}>Explore Stocks</Text>
            </TouchableOpacity>
          </View>
        )}
        
        <View style={styles.tipsContainer}>
          <View style={styles.tipHeader}>
            <Ionicons name="bulb" size={20} color="#FF9800" />
            <Text style={styles.tipTitle}>Investing Tips</Text>
          </View>
          <Text style={styles.tipText}>
            Investing is a long-term commitment. Learn about companies before investing, and remember to diversify your portfolio.
          </Text>
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
  exploreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: BRAND_COLORS.secondary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  exploreButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    marginLeft: 6,
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    flexDirection: 'row',
  },
  summaryLeft: {
    flex: 2,
  },
  portfolioLabel: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  portfolioValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 8,
  },
  performanceSummary: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  performanceSummaryText: {
    fontSize: 14,
    fontWeight: '600',
    color: BRAND_COLORS.positive,
    marginLeft: 4,
    marginRight: 6,
  },
  performancePeriod: {
    fontSize: 12,
    color: '#666666',
  },
  summaryRight: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  chartPlaceholder: {
    width: 80,
    height: 50,
    justifyContent: 'flex-end',
  },
  chart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: '100%',
  },
  chartBar: {
    width: 8,
    height: 30,
    backgroundColor: BRAND_COLORS.positive,
    borderRadius: 2,
    opacity: 0.7,
  },
  investmentsList: {
    gap: 12,
  },
  investmentCard: {
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
  investmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  companyInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F2F2F2',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  logoText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: BRAND_COLORS.secondary,
  },
  stockSymbol: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
  },
  companyName: {
    fontSize: 14,
    color: '#666666',
  },
  stockPerformance: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  performancePercent: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 4,
  },
  profitText: {
    color: BRAND_COLORS.positive,
  },
  lossText: {
    color: '#F44336',
  },
  trendIconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F8F8F8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  investmentDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#F0F0F0',
    marginBottom: 12,
  },
  detailItem: {
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
  },
  performanceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  performanceHeader: {
    flexDirection: 'column',
  },
  performanceLabel: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 2,
  },
  performanceValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  investmentActions: {
    flexDirection: 'row',
  },
  actionButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: '#F5F5F5',
    marginLeft: 8,
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#666666',
  },
  tradeButton: {
    backgroundColor: 'rgba(55, 166, 155, 0.15)',
  },
  tradeButtonText: {
    color: BRAND_COLORS.teal,
    fontWeight: '600',
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
  exploreStocksButton: {
    backgroundColor: BRAND_COLORS.secondary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
  },
  exploreStocksText: {
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
}); 