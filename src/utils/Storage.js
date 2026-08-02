import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from './constants';

export const Storage = {
  // Set item
  set: async (key, value) => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
      return true;
    } catch (error) {
      console.log('Storage set error:', error);
      return false;
    }
  },

  // Get item
  get: async (key) => {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.log('Storage get error:', error);
      return null;
    }
  },

  // Remove item
  remove: async (key) => {
    try {
      await AsyncStorage.removeItem(key);
      return true;
    } catch (error) {
      console.log('Storage remove error:', error);
      return false;
    }
  },

  // Clear all
  clear: async () => {
    try {
      await AsyncStorage.clear();
      return true;
    } catch (error) {
      console.log('Storage clear error:', error);
      return false;
    }
  },

  // Get all keys
  getAllKeys: async () => {
    try {
      return await AsyncStorage.getAllKeys();
    } catch (error) {
      console.log('Storage getAllKeys error:', error);
      return [];
    }
  },

  // Set token
  setToken: async (token) => {
    return await Storage.set(STORAGE_KEYS.TOKEN, token);
  },

  // Get token
  getToken: async () => {
    return await Storage.get(STORAGE_KEYS.TOKEN);
  },

  // Remove token
  removeToken: async () => {
    return await Storage.remove(STORAGE_KEYS.TOKEN);
  },

  // Set user
  setUser: async (user) => {
    return await Storage.set(STORAGE_KEYS.USER, user);
  },

  // Get user
  getUser: async () => {
    return await Storage.get(STORAGE_KEYS.USER);
  },

  // Remove user
  removeUser: async () => {
    return await Storage.remove(STORAGE_KEYS.USER);
  },

  // Set theme
  setTheme: async (theme) => {
    return await Storage.set(STORAGE_KEYS.THEME, theme);
  },

  // Get theme
  getTheme: async () => {
    return await Storage.get(STORAGE_KEYS.THEME);
  },

  // Set language
  setLanguage: async (language) => {
    return await Storage.set(STORAGE_KEYS.LANGUAGE, language);
  },

  // Get language
  getLanguage: async () => {
    return await Storage.get(STORAGE_KEYS.LANGUAGE);
  },

  // Set settings
  setSettings: async (settings) => {
    return await Storage.set(STORAGE_KEYS.SETTINGS, settings);
  },

  // Get settings
  getSettings: async () => {
    return await Storage.get(STORAGE_KEYS.SETTINGS);
  },

  // Clear all app data
  clearAppData: async () => {
    try {
      const keys = await Storage.getAllKeys();
      const appKeys = keys.filter(key => key.startsWith('@nexora_'));
      await AsyncStorage.multiRemove(appKeys);
      return true;
    } catch (error) {
      console.log('Clear app data error:', error);
      return false;
    }
  },
};

export default Storage;
