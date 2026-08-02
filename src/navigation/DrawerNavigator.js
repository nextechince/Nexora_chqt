import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../styles/themes';
import { COLORS } from '../styles/colors';

// Import screens
import MainTab from './MainTab';
import Profile from '../screens/Profile';
import Settings from '../screens/Settings';
import Premium from '../screens/Premium';
import SavedMessages from '../screens/SavedMessages';

const Drawer = createDrawerNavigator();

const CustomDrawerContent = ({ navigation, state, ...props }) => {
  const { colors } = useTheme();
  
  return (
    <View style={[styles.drawerContainer, { backgroundColor: colors.bgSecondary }]}>
      <View style={styles.drawerHeader}>
        <View style={styles.drawerAvatar}>
          <Text style={styles.drawerAvatarText}>A</Text>
        </View>
        <Text style={styles.drawerName}>Admin</Text>
        <Text style={styles.drawerEmail}>admin@nexora.com</Text>
        <View style={styles.drawerStatus}>
          <View style={styles.statusDot} />
          <Text style={styles.statusText}>Online</Text>
        </View>
      </View>

      <View style={styles.drawerItems}>
        <TouchableOpacity
          style={[styles.drawerItem, state.index === 0 && styles.drawerItemActive]}
          onPress={() => navigation.navigate('MainTabs')}
        >
          <Icon name="view-dashboard" size={22} color={state.index === 0 ? COLORS.primary : COLORS.textSecondary} />
          <Text style={[styles.drawerItemText, state.index === 0 && styles.drawerItemTextActive]}>
            Dashboard
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.drawerItem}
          onPress={() => navigation.navigate('Profile')}
        >
          <Icon name="account" size={22} color={COLORS.textSecondary} />
          <Text style={styles.drawerItemText}>Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.drawerItem}
          onPress={() => navigation.navigate('SavedMessages')}
        >
          <Icon name="bookmark" size={22} color={COLORS.textSecondary} />
          <Text style={styles.drawerItemText}>Saved Messages</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.drawerItem}
          onPress={() => navigation.navigate('Premium')}
        >
          <Icon name="crown" size={22} color={COLORS.premium} />
          <Text style={[styles.drawerItemText, { color: COLORS.premium }]}>Premium</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.drawerItem}
          onPress={() => navigation.navigate('Settings')}
        >
          <Icon name="cog" size={22} color={COLORS.textSecondary} />
          <Text style={styles.drawerItemText}>Settings</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.drawerFooter}>
        <TouchableOpacity style={styles.drawerItem}>
          <Icon name="logout" size={22} color={COLORS.error} />
          <Text style={[styles.drawerItemText, { color: COLORS.error }]}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const DrawerNavigator = () => {
  const { colors } = useTheme();

  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          width: 280,
          backgroundColor: colors.bgSecondary,
        },
        drawerType: 'front',
        overlayColor: 'transparent',
      }}
    >
      <Drawer.Screen name="MainTabs" component={MainTab} />
      <Drawer.Screen name="Profile" component={Profile} />
      <Drawer.Screen name="SavedMessages" component={SavedMessages} />
      <Drawer.Screen name="Premium" component={Premium} />
      <Drawer.Screen name="Settings" component={Settings} />
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    paddingTop: 40,
  },
  drawerHeader: {
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderGlass,
    marginBottom: 8,
  },
  drawerAvatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  drawerAvatarText: {
    color: '#FFF',
    fontSize: 28,
    fontWeight: 'bold',
  },
  drawerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  drawerEmail: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  drawerStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.online,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  drawerItems: {
    flex: 1,
    paddingHorizontal: 16,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  drawerItemActive: {
    backgroundColor: 'rgba(88, 101, 242, 0.1)',
  },
  drawerItemText: {
    fontSize: 15,
    color: COLORS.textSecondary,
    marginLeft: 12,
    fontWeight: '500',
  },
  drawerItemTextActive: {
    color: COLORS.primary,
  },
  drawerFooter: {
    borderTopWidth: 1,
    borderTopColor: COLORS.borderGlass,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
});

export default DrawerNavigator;
