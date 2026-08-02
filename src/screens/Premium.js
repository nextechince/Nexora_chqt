import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS } from '../styles/colors';
import { db } from '../services/LocalDB';
import Toast from 'react-native-toast-message';

const { width } = Dimensions.get('window');

const Premium = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState('admin_001');
  const [selectedPlan, setSelectedPlan] = useState('monthly');

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await db.getUserById(userId);
      if (userData) {
        setUser(userData);
      }
    } catch (error) {
      console.log('Error loading user:', error);
    }
  };

  const handleSubscribe = async () => {
    try {
      await db.grantPremium(userId);
      await loadUserData();
      Toast.show({
        type: 'success',
        text1: '🎉 Premium Activated!',
        text2: 'You now have access to all premium features'
      });
    } catch (error) {
      console.log('Error subscribing:', error);
    }
  };

  const plans = [
    {
      id: 'monthly',
      name: 'Monthly',
      price: '$9.99',
      period: 'per month',
      features: ['Premium Badge', 'Verified Badge', 'AI Reply Suggestions', 'Advanced Themes']
    },
    {
      id: 'yearly',
      name: 'Yearly',
      price: '$79.99',
      period: 'per year',
      features: ['All Monthly features', '2 Months Free', 'Exclusive Stickers', 'Priority Support']
    },
    {
      id: 'lifetime',
      name: 'Lifetime',
      price: '$199.99',
      period: 'one-time payment',
      features: ['All Yearly features', 'Custom Emoji', 'Custom Notification Sounds', 'Message Analytics']
    }
  ];

  const features = [
    { icon: 'crown', label: 'Premium Badge', color: COLORS.premium },
    { icon: 'check-decagram', label: 'Verified Badge', color: COLORS.verified },
    { icon: 'robot', label: 'AI Reply Suggestions', color: COLORS.primary },
    { icon: 'palette', label: 'Advanced Themes', color: COLORS.accent },
    { icon: 'sticker-emoji', label: 'Exclusive Stickers', color: COLORS.success },
    { icon: 'message', label: 'Custom Emoji', color: COLORS.warning },
    { icon: 'bell', label: 'Custom Notification Sounds', color: COLORS.info },
    { icon: 'chart-bar', label: 'Message Analytics', color: COLORS.developer },
    { icon: 'cloud', label: 'More Storage (10x)', color: COLORS.primary },
    { icon: 'microphone', label: 'Voice to Text', color: COLORS.accent },
    { icon: 'volume-high', label: 'Text to Voice', color: COLORS.success },
    { icon: 'eye', label: 'Profile Viewers', color: COLORS.warning },
    { icon: 'star', label: 'Priority Support', color: COLORS.premium },
    { icon: 'ad-off', label: 'No Ads', color: COLORS.info },
  ];

  if (user?.premium) {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-left" size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Premium</Text>
          <View style={styles.headerPlaceholder} />
        </View>

        <View style={styles.premiumActive}>
          <View style={styles.premiumActiveIcon}>
            <Icon name="crown" size={40} color={COLORS.premium} />
          </View>
          <Text style={styles.premiumActiveTitle}>🎉 You're a Premium Member!</Text>
          <Text style={styles.premiumActiveSubtitle}>
            Enjoy all premium features and exclusive benefits
          </Text>
          <View style={styles.premiumBadge}>
            <Icon name="crown" size={14} color={COLORS.premium} />
            <Text style={styles.premiumBadgeText}>Premium Member</Text>
          </View>
        </View>

        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>Premium Features</Text>
          <View style={styles.featuresGrid}>
            {features.map((feature, index) => (
              <View key={index} style={styles.featureItem}>
                <View style={[styles.featureIcon, { backgroundColor: feature.color + '20' }]}>
                  <Icon name={feature.icon} size={20} color={feature.color} />
                </View>
                <Text style={styles.featureLabel}>{feature.label}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Premium</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      <View style={styles.hero}>
        <Icon name="crown" size={60} color={COLORS.premium} />
        <Text style={styles.heroTitle}>Upgrade to Premium</Text>
        <Text style={styles.heroSubtitle}>
          Unlock exclusive features and take your chat experience to the next level
        </Text>
      </View>

      <View style={styles.plansContainer}>
        {plans.map((plan) => (
          <TouchableOpacity
            key={plan.id}
            style={[
              styles.planCard,
              selectedPlan === plan.id && styles.planCardSelected,
            ]}
            onPress={() => setSelectedPlan(plan.id)}
          >
            <Text style={styles.planName}>{plan.name}</Text>
            <Text style={styles.planPrice}>{plan.price}</Text>
            <Text style={styles.planPeriod}>{plan.period}</Text>
            <View style={styles.planFeatures}>
              {plan.features.map((feature, index) => (
                <View key={index} style={styles.planFeature}>
                  <Icon name="check" size={16} color={COLORS.success} />
                  <Text style={styles.planFeatureText}>{feature}</Text>
                </View>
              ))}
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.subscribeButton} onPress={handleSubscribe}>
        <Text style={styles.subscribeButtonText}>Subscribe Now</Text>
      </TouchableOpacity>

      <View style={styles.featuresSection}>
        <Text style={styles.sectionTitle}>All Premium Features</Text>
        <View style={styles.featuresGrid}>
          {features.map((feature, index) => (
            <View key={index} style={styles.featureItem}>
              <View style={[styles.featureIcon, { backgroundColor: feature.color + '20' }]}>
                <Icon name={feature.icon} size={20} color={feature.color} />
              </View>
              <Text style={styles.featureLabel}>{feature.label}</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgPrimary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  headerPlaceholder: {
    width: 24,
  },
  hero: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 30,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginTop: 16,
  },
  heroSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 20,
    lineHeight: 20,
  },
  plansContainer: {
    paddingHorizontal: 16,
    gap: 12,
  },
  planCard: {
    backgroundColor: COLORS.bgSecondary,
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  planCardSelected: {
    borderColor: COLORS.primary,
    backgroundColor: 'rgba(88, 101, 242, 0.05)',
  },
  planName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  planPrice: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginTop: 4,
  },
  planPeriod: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  planFeatures: {
    marginTop: 12,
  },
  planFeature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 2,
  },
  planFeatureText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginLeft: 8,
  },
  subscribeButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 16,
    marginHorizontal: 16,
    marginTop: 20,
    alignItems: 'center',
  },
  subscribeButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  featuresSection: {
    paddingHorizontal: 16,
    marginTop: 30,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 16,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  featureItem: {
    width: (width - 40) / 3,
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: COLORS.bgSecondary,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.borderGlass,
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  featureLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  premiumActive: {
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 24,
  },
  premiumActiveIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  premiumActiveTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  premiumActiveSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 8,
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.2)',
  },
  premiumBadgeText: {
    color: COLORS.premium,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
});

export default Premium;
