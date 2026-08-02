import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS } from '../styles/colors';
import { db } from '../services/LocalDB';
import SettingsItem from '../components/SettingsItem';
import Toast from 'react-native-toast-message';

const SettingsAppearance = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState('dark');
  const [accentColor, setAccentColor] = useState('#5865F2');
  const [fontSize, setFontSize] = useState('medium');
  const [bubbleStyle, setBubbleStyle] = useState('rounded');
  const [userId, setUserId] = useState('admin_001');

  const accentColors = [
    '#5865F2', '#00D4FF', '#10B981', '#F59E0B', 
    '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6'
  ];

  const fontSizes = [
    { label: 'Small', value: 'small' },
    { label: 'Medium', value: 'medium' },
    { label: 'Large', value: 'large' },
  ];

  const bubbleStyles = [
    { label: 'Rounded', value: 'rounded' },
    { label: 'Square', value: 'square' },
    { label: 'Soft', value: 'soft' },
  ];

  useEffect(() => {
    loadAppearance();
  }, []);

  const loadAppearance = async () => {
    try {
      const userData = await db.getUserById(userId);
      if (userData) {
        setUser(userData);
        setTheme(userData.settings?.theme || 'dark');
        setAccentColor(userData.settings?.accentColor || '#5865F2');
        setFontSize(userData.settings?.fontSize || 'medium');
        setBubbleStyle(userData.settings?.bubbleStyle || 'rounded');
      }
    } catch (error) {
      console.log('Error loading appearance:', error);
    }
  };

  const updateAppearance = async (key, value) => {
    try {
      await db.updateUser(userId, {
        settings: {
          ...user?.settings,
          [key]: value
        }
      });
      if (key === 'theme') setTheme(value);
      if (key === 'accentColor') setAccentColor(value);
      if (key === 'fontSize') setFontSize(value);
      if (key === 'bubbleStyle') setBubbleStyle(value);
    } catch (error) {
      console.log('Error updating appearance:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Appearance</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Theme</Text>
        <SettingsItem
          icon="theme-light-dark"
          title="Dark Theme"
          isSwitch
          switchValue={theme === 'dark'}
          onSwitchChange={(value) => updateAppearance('theme', value ? 'dark' : 'light')}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Accent Color</Text>
        <View style={styles.colorGrid}>
          {accentColors.map((color, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.colorItem,
                { backgroundColor: color },
                accentColor === color && styles.colorItemSelected,
              ]}
              onPress={() => updateAppearance('accentColor', color)}
            >
              {accentColor === color && (
                <Icon name="check" size={16} color="#FFF" />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Font Size</Text>
        <View style={styles.optionsGrid}>
          {fontSizes.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.optionItem,
                fontSize === item.value && styles.optionItemSelected,
              ]}
              onPress={() => updateAppearance('fontSize', item.value)}
            >
              <Text style={[
                styles.optionText,
                fontSize === item.value && styles.optionTextSelected,
                item.value === 'small' && { fontSize: 13 },
                item.value === 'medium' && { fontSize: 15 },
                item.value === 'large' && { fontSize: 17 },
              ]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Bubble Style</Text>
        <View style={styles.optionsGrid}>
          {bubbleStyles.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.optionItem,
                bubbleStyle === item.value && styles.optionItemSelected,
              ]}
              onPress={() => updateAppearance('bubbleStyle', item.value)}
            >
              <Text style={[
                styles.optionText,
                bubbleStyle === item.value && styles.optionTextSelected,
              ]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Chat</Text>
        <SettingsItem
          icon="wallpaper"
          title="Chat Wallpaper"
          onPress={() => Toast.show({ type: 'info', text1: 'Coming Soon' })}
        />
        <SettingsItem
          icon="animation"
          title="Message Animations"
          isSwitch
          switchValue={true}
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
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    paddingVertical: 8,
  },
  colorItem: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  colorItemSelected: {
    borderColor: '#FFF',
    borderWidth: 3,
  },
  optionsGrid: {
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 8,
  },
  optionItem: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: COLORS.bgSecondary,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.borderGlass,
  },
  optionItemSelected: {
    backgroundColor: 'rgba(88, 101, 242, 0.1)',
    borderColor: COLORS.primary,
  },
  optionText: {
    color: COLORS.textSecondary,
    fontSize: 15,
  },
  optionTextSelected: {
    color: COLORS.primary,
    fontWeight: '600',
  },
});

export default SettingsAppearance;
