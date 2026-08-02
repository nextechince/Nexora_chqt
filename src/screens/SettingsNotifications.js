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
import Toast from 'react-native-toast-message';

const SettingsNotifications = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [settings, setSettings] = useState({
    messages: true,
    groups: true,
    channels: true,
    calls: true,
    sound: true,
    preview: true,
    dnd: false,
  });
  const [userId, setUserId] = useState('admin_001');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const userData = await db.getUserById(userId);
      if (userData) {
        setUser(userData);
        setSettings(prev => ({
          ...prev,
          ...userData.settings?.notifications,
        }));
      }
    } catch (error) {
      console.log('Error loading settings:', error);
    }
  };

  const updateSetting = async (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    try {
      await db.updateUser(userId, {
        settings: {
          ...user?.settings,
          notifications: { ...settings, [key]: value }
        }
      });
    } catch (error) {
      console.log('Error updating setting:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>General</Text>
        <SettingsItem
          icon="bell"
          title="Message Notifications"
          isSwitch
          switchValue={settings.messages}
          onSwitchChange={(value) => updateSetting('messages', value)}
        />
        <SettingsItem
          icon="bell-ring"
          title="Group Notifications"
          isSwitch
          switchValue={settings.groups}
          onSwitchChange={(value) => updateSetting('groups', value)}
        />
        <SettingsItem
          icon="bell-outline"
          title="Channel Notifications"
          isSwitch
          switchValue={settings.channels}
          onSwitchChange={(value) => updateSetting('channels', value)}
        />
        <SettingsItem
          icon="phone"
          title="Call Notifications"
          isSwitch
          switchValue={settings.calls}
          onSwitchChange={(value) => updateSetting('calls', value)}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sounds</Text>
        <SettingsItem
          icon="volume-high"
          title="Sound Effects"
          isSwitch
          switchValue={settings.sound}
          onSwitchChange={(value) => updateSetting('sound', value)}
        />
        <SettingsItem
          icon="message-text"
          title="Notification Preview"
          isSwitch
          switchValue={settings.preview}
          onSwitchChange={(value) => updateSetting('preview', value)}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Focus</Text>
        <SettingsItem
          icon="moon"
          title="Do Not Disturb"
          isSwitch
          switchValue={settings.dnd}
          onSwitchChange={(value) => updateSetting('dnd', value)}
        />
        {settings.dnd && (
          <View style={styles.dndInfo}>
            <Text style={styles.dndInfoText}>
              All notifications will be silenced until you turn off Do Not Disturb
            </Text>
          </View>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Advanced</Text>
        <SettingsItem
          icon="clock"
          title="Quiet Hours"
          onPress={() => Toast.show({ type: 'info', text1: 'Coming Soon' })}
        />
        <SettingsItem
          icon="star"
          title="Priority Contacts"
          onPress={() => Toast.show({ type: 'info', text1: 'Coming Soon' })}
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
  dndInfo: {
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderRadius: 8,
    padding: 12,
    marginTop: 4,
  },
  dndInfoText: {
    color: COLORS.textSecondary,
    fontSize: 13,
    lineHeight: 18,
  },
});

export default SettingsNotifications;
