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

const SettingsStorage = ({ navigation }) => {
  const [storage, setStorage] = useState({
    used: 0,
    total: 1024,
    autoDownload: 'wifi',
    mediaSize: 0,
    cacheSize: 0,
  });
  const [userId, setUserId] = useState('admin_001');

  useEffect(() => {
    loadStorage();
  }, []);

  const loadStorage = async () => {
    try {
      const stats = await db.getAdminStats();
      setStorage(prev => ({
        ...prev,
        used: stats.storageUsage || 0,
      }));
    } catch (error) {
      console.log('Error loading storage:', error);
    }
  };

  const clearCache = () => {
    Toast.show({
      type: 'success',
      text1: 'Cache Cleared',
      text2: 'All cache has been cleared successfully'
    });
    setStorage(prev => ({ ...prev, cacheSize: 0 }));
  };

  const exportData = () => {
    Toast.show({
      type: 'info',
      text1: 'Export Started',
      text2: 'Your data is being exported'
    });
  };

  const percentage = Math.min((storage.used / storage.total) * 100, 100);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Storage</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      <View style={styles.storageCard}>
        <View style={styles.storageHeader}>
          <Text style={styles.storageTitle}>Storage Usage</Text>
          <Text style={styles.storageText}>
            {storage.used.toFixed(1)} MB / {storage.total} MB
          </Text>
        </View>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${percentage}%` }]} />
        </View>
        <Text style={styles.storagePercentage}>{percentage.toFixed(0)}% used</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Auto-Download</Text>
        <SettingsItem
          icon="download"
          title="Media Auto-Download"
          subtitle={storage.autoDownload === 'wifi' ? 'WiFi only' : 
                   storage.autoDownload === 'data' ? 'WiFi & Data' : 'Disabled'}
          onPress={() => {}}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Usage</Text>
        <SettingsItem
          icon="image"
          title="Images"
          subtitle={`${storage.mediaSize || 0} MB`}
          onPress={() => {}}
        />
        <SettingsItem
          icon="video"
          title="Videos"
          subtitle="0 MB"
          onPress={() => {}}
        />
        <SettingsItem
          icon="file"
          title="Documents"
          subtitle="0 MB"
          onPress={() => {}}
        />
        <SettingsItem
          icon="microphone"
          title="Voice Messages"
          subtitle="0 MB"
          onPress={() => {}}
        />
        <SettingsItem
          icon="delete-sweep"
          title="Cache"
          subtitle={`${storage.cacheSize || 0} MB`}
          onPress={clearCache}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Actions</Text>
        <TouchableOpacity style={styles.actionButton} onPress={clearCache}>
          <Icon name="delete-sweep" size={20} color={COLORS.textPrimary} />
          <Text style={styles.actionButtonText}>Clear Cache</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={exportData}>
          <Icon name="download" size={20} color={COLORS.textPrimary} />
          <Text style={styles.actionButtonText}>Export Data</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, styles.actionButtonDanger]}>
          <Icon name="delete" size={20} color={COLORS.error} />
          <Text style={[styles.actionButtonText, styles.actionButtonTextDanger]}>
            Clear All Data
          </Text>
        </TouchableOpacity>
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
  storageCard: {
    margin: 16,
    padding: 16,
    backgroundColor: COLORS.bgSecondary,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.borderGlass,
  },
  storageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  storageTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  storageText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  progressBar: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 3,
  },
  storagePercentage: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 4,
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
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderGlass,
  },
  actionButtonDanger: {
    borderBottomWidth: 0,
  },
  actionButtonText: {
    fontSize: 15,
    color: COLORS.textPrimary,
    marginLeft: 12,
  },
  actionButtonTextDanger: {
    color: COLORS.error,
  },
});

export default SettingsStorage;
