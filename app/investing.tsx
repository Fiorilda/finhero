import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Platform, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

import { ThemedText } from '@/components/ThemedText';

// Raiffeisen Bank brand colors
const BRAND_COLORS = {
  primary: '#FFEE00', // Raiffeisen Yellow
  secondary: '#004E9E', // Raiffeisen Blue
  lightGray: '#AAAAAA',
  positive: '#4CAF50',
  teal: '#37a69b',
};

export default function InvestingScreen() {
  const router = useRouter();
  const { childId, childName } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <ThemedText style={styles.title}>{childName}</ThemedText>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <ThemedText style={styles.welcomeTitle}>Welcome to Invest!</ThemedText>

        <View style={styles.contentCard}>
          <ThemedText style={styles.sectionTitle}>Investing for kids</ThemedText>

          {/* Research Section */}
          <View style={styles.featureItem}>
            <View style={[styles.featureIcon, { backgroundColor: '#8692F7' }]}>
              <Ionicons name="search" size={26} color="#FFFFFF" />
            </View>
            <View style={styles.featureContent}>
              <ThemedText style={styles.featureTitle}>Research</ThemedText>
              <ThemedText style={styles.featureDescription}>
                Explore stocks and ETFs with expert analysis powered by Morningstar.
              </ThemedText>
            </View>
          </View>

          {/* Invest Section */}
          <View style={styles.featureItem}>
            <View style={[styles.featureIcon, { backgroundColor: '#3F51B5' }]}>
              <Ionicons name="grid" size={26} color="#FFFFFF" />
            </View>
            <View style={styles.featureContent}>
              <ThemedText style={styles.featureTitle}>Invest</ThemedText>
              <ThemedText style={styles.featureDescription}>
                Kids buy real stocks with as little as $1. Parents approve every trade.
              </ThemedText>
            </View>
          </View>

          {/* Learn Section */}
          <View style={styles.featureItem}>
            <View style={[styles.featureIcon, { backgroundColor: '#9C27B0' }]}>
              <Ionicons name="bulb" size={26} color="#FFFFFF" />
            </View>
            <View style={styles.featureContent}>
              <ThemedText style={styles.featureTitle}>Learn</ThemedText>
              <ThemedText style={styles.featureDescription}>
                Track performance together, access educational content and activate Learn Mode to give your kids an edge.
              </ThemedText>
            </View>
          </View>

          {/* Learn More Button */}
          <TouchableOpacity style={styles.learnMoreButton}>
            <ThemedText style={styles.learnMoreText}>Learn more about Invest</ThemedText>
            <Ionicons name="chevron-forward" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Additional Button Options */}
        <TouchableOpacity style={styles.actionButton}>
          <View style={styles.actionButtonContent}>
            <Ionicons name="search" size={24} color={BRAND_COLORS.secondary} />
            <ThemedText style={styles.actionButtonText}>Browse Investments</ThemedText>
          </View>
          <Ionicons name="chevron-forward" size={20} color={BRAND_COLORS.secondary} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <View style={styles.actionButtonContent}>
            <Ionicons name="school" size={24} color={BRAND_COLORS.secondary} />
            <ThemedText style={styles.actionButtonText}>Investing Lessons</ThemedText>
          </View>
          <Ionicons name="chevron-forward" size={20} color={BRAND_COLORS.secondary} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <View style={styles.actionButtonContent}>
            <Ionicons name="help-circle" size={24} color={BRAND_COLORS.secondary} />
            <ThemedText style={styles.actionButtonText}>Investing FAQ</ThemedText>
          </View>
          <Ionicons name="chevron-forward" size={20} color={BRAND_COLORS.secondary} />
        </TouchableOpacity>

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
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#333333',
  },
  contentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#333333',
  },
  featureItem: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  featureIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#333333',
  },
  featureDescription: {
    fontSize: 14,
    lineHeight: 20,
    color: '#666666',
  },
  learnMoreButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  learnMoreText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
    marginRight: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  actionButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 12,
    color: '#333333',
  },
}); 