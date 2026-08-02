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

const SettingsSecurity = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [security, setSecurity] = useState({
    loginAlerts: true,
    twoFactor: false,
    backupCodes: false,
  });
  const [sessions, setSessions] = useState([]);
  const [userId, setUserId] = useState('admin_001');

  useEffect(() => {
    loadSecurity();
  }, []);

  const loadSecurity = async () => {
    try {
      const userData = await db.getUserById(userId);
      if (userData) {
        setUser(userData);
        const sessionsData = await db.getAdminSessions();
        setSessions(sessionsData);
      }
    } catch (error) {
      console.log('Error loading security:', error);
    }
  };

  const updateSecurity = async (key, value) => {
    setSecurity(prev => ({ ...prev, [key]: value }));
  };

  const handleLogoutAll = () => {
    // In a real app, logout all sessions
    Toast.show({
      type: 'info',
      text1: 'Sessions Cleared',
      text2: 'All other sessions have been logged out'
    });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Security</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account Security</Text>
        <SettingsItem
          icon="alert-circle"
          title="Login Alerts"
          isSwitch
          switchValue={security.loginAlerts}
          onSwitchChange={(value) => updateSecurity('loginAlerts', value)}
        />
        <SettingsItem
          icon="shield"
          title="Two-Factor Authentication"
          subtitle={security.twoFactor ? 'Enabled' : 'Disabled'}
          isSwitch
          switchValue={security.twoFactor}
          onSwitchChange={(value) => updateSecurity('twoFactor', value)}
        />
        <SettingsItem
          icon="key"
          title="Backup Codes"
          subtitle={security.backupCodes ? 'Generated' : 'Not generated'}
          onPress={() => {
            Toast.show({
              type: 'success',
              text1: 'Backup Codes Generated',
              text2: 'Save these codes in a safe place'
            });
          }}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sessions</Text>
        {sessions.map((session, index) => (
          <SettingsItem
            key={index}
            icon="devices"
            title={`Session ${index + 1}`}
            subtitle={`Last active: ${session.lastActive}`}
            onPress={() => {}}
          />
        ))}
        <TouchableOpacity style={styles.logoutAllButton} onPress={handleLogoutAll}>
          <Text style={styles.logoutAllText}>Logout All Devices</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Advanced</Text>
        <SettingsItem
          icon="security-key"
          title="Security Keys"
          onPress={() => Toast.show({ type: 'info', text1: 'Coming Soon' })}
        />
        <SettingsItem
          icon="link"
          title="Device Linking"
          onPress={() => Toast.show({ type: 'info', text1: 'Coming Soon' })}
        />
        <SettingsItem
          icon="delete"
          title="Delete Account"
          danger
          onPress={() => {
            Toast.show({
              type: 'error',
              text1: 'Account Deletion',
              text2: 'This action cannot be undone'
            });
          }}
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
  logoutAllButton: {
    marginTop: 8,
    paddingVertical: 12,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.error,
  },
  logoutAllText: {
    color: COLORS.error,
    fontSize: 15,
    fontWeight: '600',
  },
});

export default SettingsSecurity;
