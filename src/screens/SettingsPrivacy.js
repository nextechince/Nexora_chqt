import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS } from '../styles/colors';
import { db } from '../services/LocalDB';
import SettingsItem from '../components/SettingsItem';

const SettingsPrivacy = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [privacy, setPrivacy] = useState({
    lastSeen: 'everyone',
    profilePhoto: 'everyone',
    status: 'everyone',
    readReceipts: true,
    onlineStatus: 'everyone',
    forwardedMessages: 'everyone',
  });
  const [userId, setUserId] = useState('admin_001');

  useEffect(() => {
    loadPrivacy();
  }, []);

  const loadPrivacy = async () => {
    try {
      const userData = await db.getUserById(userId);
      if (userData) {
        setUser(userData);
        setPrivacy(prev => ({
          ...prev,
          ...userData.settings?.privacy,
        }));
      }
    } catch (error) {
      console.log('Error loading privacy:', error);
    }
  };

  const updatePrivacy = async (key, value) => {
    setPrivacy(prev => ({ ...prev, [key]: value }));
    try {
      await db.updateUser(userId, {
        settings: {
          ...user?.settings,
          privacy: { ...privacy, [key]: value }
        }
      });
    } catch (error) {
      console.log('Error updating privacy:', error);
    }
  };

  const showOptions = (key, title, options) => {
    // In a real app, show a modal with options
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Visibility</Text>
        <SettingsItem
          icon="eye"
          title="Last Seen"
          subtitle={privacy.lastSeen === 'everyone' ? 'Everyone' : 
                   privacy.lastSeen === 'contacts' ? 'My Contacts' : 'Nobody'}
          onPress={() => showOptions('lastSeen', 'Last Seen', ['Everyone', 'My Contacts', 'Nobody'])}
        />
        <SettingsItem
          icon="image"
          title="Profile Photo"
          subtitle={privacy.profilePhoto === 'everyone' ? 'Everyone' : 
                   privacy.profilePhoto === 'contacts' ? 'My Contacts' : 'Nobody'}
          onPress={() => showOptions('profilePhoto', 'Profile Photo', ['Everyone', 'My Contacts', 'Nobody'])}
        />
        <SettingsItem
          icon="message"
          title="Status"
          subtitle={privacy.status === 'everyone' ? 'Everyone' : 
                   privacy.status === 'contacts' ? 'My Contacts' : 'Nobody'}
          onPress={() => showOptions('status', 'Status', ['Everyone', 'My Contacts', 'Nobody'])}
        />
        <SettingsItem
          icon="account"
          title="Online Status"
          subtitle={privacy.onlineStatus === 'everyone' ? 'Everyone' : 
                   privacy.onlineStatus === 'contacts' ? 'My Contacts' : 'Nobody'}
          onPress={() => showOptions('onlineStatus', 'Online Status', ['Everyone', 'My Contacts', 'Nobody'])}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Messages</Text>
        <SettingsItem
          icon="check-all"
          title="Read Receipts"
          subtitle={privacy.readReceipts ? 'On' : 'Off'}
          isSwitch
          switchValue={privacy.readReceipts}
          onSwitchChange={(value) => updatePrivacy('readReceipts', value)}
        />
        <SettingsItem
          icon="share"
          title="Forwarded Messages"
          subtitle={privacy.forwardedMessages === 'everyone' ? 'Everyone' : 'Nobody'}
          onPress={() => showOptions('forwardedMessages', 'Forwarded Messages', ['Everyone', 'Nobody'])}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Blocking</Text>
        <SettingsItem
          icon="account-block"
          title="Blocked Users"
          onPress={() => navigation.navigate('SettingsBlocked')}
        />
        <SettingsItem
          icon="message-alert"
          title="Blocked Messages"
          onPress={() => {}}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Data</Text>
        <SettingsItem
          icon="delete"
          title="Clear History"
          danger
          onPress={() => {}}
        />
        <SettingsItem
          icon="download"
          title="Export Data"
          onPress={() => {}}
        />
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
});

export default SettingsPrivacy;
