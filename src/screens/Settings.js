import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Share,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS } from '../styles/colors';
import { db } from '../services/LocalDB';
import SettingsItem from '../components/SettingsItem';
import Toast from 'react-native-toast-message';

const Settings = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState(true);
  const [sound, setSound] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [userId, setUserId] = useState('admin_001');

  useEffect(() => {
    loadUserSettings();
  }, []);

  const loadUserSettings = async () => {
    try {
      const userData = await db.getUserById(userId);
      if (userData) {
        setUser(userData);
        setNotifications(userData.settings?.notifications ?? true);
        setSound(userData.settings?.sound ?? true);
      }
    } catch (error) {
      console.log('Error loading settings:', error);
    }
  };

  const toggleNotifications = async (value) => {
    setNotifications(value);
    try {
      await db.updateUser(userId, {
        settings: { ...user?.settings, notifications: value }
      });
    } catch (error) {
      console.log('Error updating notifications:', error);
    }
  };

  const toggleSound = async (value) => {
    setSound(value);
    try {
      await db.updateUser(userId, {
        settings: { ...user?.settings, sound: value }
      });
    } catch (error) {
      console.log('Error updating sound:', error);
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: 'Check out NEXORA CHQT - The best chat app! 🚀',
      });
    } catch (error) {
      console.log('Error sharing:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <SettingsItem
          icon="account-edit"
          title="Edit Profile"
          onPress={() => navigation.navigate('SettingsProfile')}
        />
        <SettingsItem
          icon="phone"
          title="Change Phone Number"
          onPress={() => Toast.show({ type: 'info', text1: 'Coming Soon' })}
        />
        <SettingsItem
          icon="email"
          title="Change Email"
          onPress={() => Toast.show({ type: 'info', text1: 'Coming Soon' })}
        />
        <SettingsItem
          icon="lock"
          title="Change Password"
          onPress={() => navigation.navigate('ForgotPassword')}
        />
        <SettingsItem
          icon="shield-check"
          title="Two-Factor Authentication"
          onPress={() => Toast.show({ type: 'info', text1: 'Coming Soon' })}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notifications</Text>
        <SettingsItem
          icon="bell"
          title="Message Notifications"
          isSwitch
          switchValue={notifications}
          onSwitchChange={toggleNotifications}
        />
        <SettingsItem
          icon="bell-ring"
          title="Group Notifications"
          isSwitch
          switchValue={notifications}
          onSwitchChange={toggleNotifications}
        />
        <SettingsItem
          icon="bell-outline"
          title="Channel Notifications"
          isSwitch
          switchValue={notifications}
          onSwitchChange={toggleNotifications}
        />
        <SettingsItem
          icon="volume-high"
          title="Sound Settings"
          isSwitch
          switchValue={sound}
          onSwitchChange={toggleSound}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Privacy</Text>
        <SettingsItem
          icon="eye"
          title="Last Seen Visibility"
          onPress={() => navigation.navigate('SettingsPrivacy')}
        />
        <SettingsItem
          icon="image"
          title="Profile Photo Visibility"
          onPress={() => navigation.navigate('SettingsPrivacy')}
        />
        <SettingsItem
          icon="message"
          title="Read Receipts"
          onPress={() => navigation.navigate('SettingsPrivacy')}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Security</Text>
        <SettingsItem
          icon="shield"
          title="Login Alerts"
          isSwitch
          switchValue={true}
          onSwitchChange={() => {}}
        />
        <SettingsItem
          icon="devices"
          title="Active Sessions"
          onPress={() => navigation.navigate('SettingsSecurity')}
        />
        <SettingsItem
          icon="key"
          title="Security Keys"
          onPress={() => Toast.show({ type: 'info', text1: 'Coming Soon' })}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Appearance</Text>
        <SettingsItem
          icon="theme-light-dark"
          title="Dark Theme"
          isSwitch
          switchValue={darkMode}
          onSwitchChange={() => setDarkMode(!darkMode)}
        />
        <SettingsItem
          icon="palette"
          title="Accent Color"
          onPress={() => navigation.navigate('SettingsAppearance')}
        />
        <SettingsItem
          icon="wallpaper"
          title="Chat Wallpaper"
          onPress={() => Toast.show({ type: 'info', text1: 'Coming Soon' })}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Storage</Text>
        <SettingsItem
          icon="download"
          title="Media Auto-Download"
          onPress={() => navigation.navigate('SettingsStorage')}
        />
        <SettingsItem
          icon="database"
          title="Storage Usage"
          onPress={() => navigation.navigate('SettingsStorage')}
        />
        <SettingsItem
          icon="delete-sweep"
          title="Clear Cache"
          onPress={() => {
            Toast.show({
              type: 'success',
              text1: 'Cache Cleared',
              text2: 'All cache has been cleared'
            });
          }}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>General</Text>
        <SettingsItem
          icon="translate"
          title="Language"
          onPress={() => navigation.navigate('SettingsLanguage')}
        />
        <SettingsItem
          icon="account-block"
          title="Blocked Users"
          onPress={() => navigation.navigate('SettingsBlocked')}
        />
        <SettingsItem
          icon="share-variant"
          title="Share App"
          onPress={handleShare}
        />
        <SettingsItem
          icon="information"
          title="About"
          onPress={() => navigation.navigate('SettingsAbout')}
        />
        <SettingsItem
          icon="help-circle"
          title="Help Center"
          onPress={() => Toast.show({ type: 'info', text1: 'Help Center' })}
        />
      </View>

      <TouchableOpacity
        style={styles.premiumButton}
        onPress={() => navigation.navigate('Premium')}
      >
        <Icon name="crown" size={24} color={COLORS.premium} />
        <View style={styles.premiumContent}>
          <Text style={styles.premiumTitle}>Upgrade to Premium</Text>
          <Text style={styles.premiumSubtitle}>Get exclusive features and badges</Text>
        </View>
        <Icon name="chevron-right" size={24} color={COLORS.textSecondary} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.adminButton} onPress={() => navigation.navigate('AdminPanel')}>
        <Icon name="shield-account" size={24} color={COLORS.primary} />
        <Text style={styles.adminButtonText}>Admin Panel</Text>
        <Icon name="chevron-right" size={24} color={COLORS.textSecondary} />
      </TouchableOpacity>
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
  section: {
    paddingHorizontal: 16,
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  premiumButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.2)',
  },
  premiumContent: {
    flex: 1,
    marginLeft: 12,
  },
  premiumTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.premium,
  },
  premiumSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  adminButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(88, 101, 242, 0.1)',
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 30,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  adminButtonText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
    marginLeft: 12,
  },
});

export default Settings;
