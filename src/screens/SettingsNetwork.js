import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS } from '../styles/colors';
import SettingsItem from '../components/SettingsItem';

const SettingsNetwork = ({ navigation }) => {
  const [network, setNetwork] = useState({
    connection: 'auto',
    dataSaver: false,
    proxy: false,
  });

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Network</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Connection</Text>
        <SettingsItem
          icon="wifi"
          title="Connection Preferences"
          subtitle="Auto"
          onPress={() => {}}
        />
        <SettingsItem
          icon="data-usage"
          title="Data Usage"
          subtitle="0 MB used"
          onPress={() => {}}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Optimization</Text>
        <SettingsItem
          icon="battery-saver"
          title="Data Saver"
          isSwitch
          switchValue={network.dataSaver}
          onSwitchChange={(value) => setNetwork(prev => ({ ...prev, dataSaver: value }))}
        />
        <SettingsItem
          icon="proxy"
          title="Proxy Settings"
          isSwitch
          switchValue={network.proxy}
          onSwitchChange={(value) => setNetwork(prev => ({ ...prev, proxy: value }))}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Media</Text>
        <SettingsItem
          icon="image"
          title="Auto-Download Images"
          isSwitch
          switchValue={true}
          onSwitchChange={() => {}}
        />
        <SettingsItem
          icon="video"
          title="Auto-Download Videos"
          isSwitch
          switchValue={false}
          onSwitchChange={() => {}}
        />
        <SettingsItem
          icon="file"
          title="Auto-Download Files"
          isSwitch
          switchValue={false}
          onSwitchChange={() => {}}
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

export default SettingsNetwork;
