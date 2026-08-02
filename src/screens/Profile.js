import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  Share,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS } from '../styles/colors';
import { db } from '../services/LocalDB';
import Toast from 'react-native-toast-message';

const Profile = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [userId, setUserId] = useState('admin_001');

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      const userData = await db.getUserById(userId);
      if (userData) {
        setUser(userData);
      }
    } catch (error) {
      console.log('Error loading profile:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadUserProfile();
    setRefreshing(false);
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7
    });
    if (!result.canceled) {
      try {
        await db.updateUser(userId, { profileImage: result.assets[0].uri });
        await loadUserProfile();
        Toast.show({
          type: 'success',
          text1: 'Photo Updated',
          text2: 'Profile photo updated successfully'
        });
      } catch (error) {
        console.log('Error updating photo:', error);
      }
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out my NEXORA CHQT profile!\n${user?.displayName}\n@${user?.username}`,
      });
    } catch (error) {
      console.log('Error sharing:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await db.logout(userId);
      await db.clearUserSession(userId);
      navigation.replace('Login');
      Toast.show({
        type: 'success',
        text1: 'Logged Out',
        text2: 'See you soon! 👋'
      });
    } catch (error) {
      console.log('Error logging out:', error);
    }
  };

  const renderBadge = (badge) => {
    const badgeConfig = {
      verified: { icon: 'check-decagram', color: COLORS.verified, label: 'Verified' },
      premium: { icon: 'crown', color: COLORS.premium, label: 'Premium' },
      developer: { icon: 'code-tags', color: COLORS.developer, label: 'Developer' },
      owner: { icon: 'crown', color: COLORS.owner, label: 'Owner' },
      moderator: { icon: 'shield-check', color: COLORS.moderator, label: 'Moderator' },
    };

    const config = badgeConfig[badge];
    if (!config) return null;

    return (
      <View key={badge} style={[styles.badge, { backgroundColor: config.color + '20' }]}>
        <Icon name={config.icon} size={12} color={config.color} />
        <Text style={[styles.badgeText, { color: config.color }]}>{config.label}</Text>
      </View>
    );
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={handleShare}>
            <Icon name="share-variant" size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Settings')} style={styles.headerIcon}>
            <Icon name="cog" size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.profileContainer}>
        <TouchableOpacity onPress={pickImage} style={styles.avatarContainer}>
          {user?.profileImage ? (
            <Image source={{ uri: user.profileImage }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.avatarPlaceholder]}>
              <Text style={styles.avatarText}>
                {user?.displayName?.charAt(0) || 'U'}
              </Text>
            </View>
          )}
          <View style={styles.avatarEdit}>
            <Icon name="camera" size={16} color="#FFF" />
          </View>
        </TouchableOpacity>

        <Text style={styles.displayName}>{user?.displayName}</Text>
        <Text style={styles.username}>@{user?.username}</Text>

        {user?.bio && (
          <Text style={styles.bio}>{user.bio}</Text>
        )}

        {user?.status && (
          <View style={styles.statusContainer}>
            <View style={[styles.statusDot, user?.online && styles.statusOnline]} />
            <Text style={styles.statusText}>
              {user?.online ? 'Online' : `Last seen ${user?.lastSeen}`}
            </Text>
          </View>
        )}

        <View style={styles.badgesContainer}>
          {user?.badges?.map(badge => renderBadge(badge))}
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Posts</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Followers</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Following</Text>
          </View>
        </View>
      </View>

      <View style={styles.menuSection}>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('SettingsProfile')}
        >
          <Icon name="account-edit" size={22} color={COLORS.textSecondary} />
          <Text style={styles.menuText}>Edit Profile</Text>
          <Icon name="chevron-right" size={20} color={COLORS.textSecondary} style={styles.menuArrow} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('SavedMessages')}
        >
          <Icon name="bookmark" size={22} color={COLORS.textSecondary} />
          <Text style={styles.menuText}>Saved Messages</Text>
          <Icon name="chevron-right" size={20} color={COLORS.textSecondary} style={styles.menuArrow} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('SettingsNotifications')}
        >
          <Icon name="bell" size={22} color={COLORS.textSecondary} />
          <Text style={styles.menuText}>Notifications</Text>
          <Icon name="chevron-right" size={20} color={COLORS.textSecondary} style={styles.menuArrow} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('SettingsPrivacy')}
        >
          <Icon name="shield" size={22} color={COLORS.textSecondary} />
          <Text style={styles.menuText}>Privacy & Security</Text>
          <Icon name="chevron-right" size={20} color={COLORS.textSecondary} style={styles.menuArrow} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('SettingsAppearance')}
        >
          <Icon name="palette" size={22} color={COLORS.textSecondary} />
          <Text style={styles.menuText}>Appearance</Text>
          <Icon name="chevron-right" size={20} color={COLORS.textSecondary} style={styles.menuArrow} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('Premium')}
        >
          <Icon name="crown" size={22} color={COLORS.premium} />
          <Text style={[styles.menuText, { color: COLORS.premium }]}>Premium</Text>
          <Icon name="chevron-right" size={20} color={COLORS.textSecondary} style={styles.menuArrow} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Icon name="logout" size={22} color={COLORS.error} />
        <Text style={styles.logoutText}>Logout</Text>
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
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    marginLeft: 16,
  },
  profileContainer: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarPlaceholder: {
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#FFF',
    fontSize: 36,
    fontWeight: 'bold',
  },
  avatarEdit: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: COLORS.bgPrimary,
  },
  displayName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  username: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  bio: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 20,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.offline,
    marginRight: 6,
  },
  statusOnline: {
    backgroundColor: COLORS.online,
  },
  statusText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  badgesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 12,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    margin: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '600',
    marginLeft: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
    paddingVertical: 16,
    backgroundColor: COLORS.bgSecondary,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.borderGlass,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  menuSection: {
    marginTop: 16,
    paddingHorizontal: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderGlass,
  },
  menuText: {
    flex: 1,
    fontSize: 15,
    color: COLORS.textPrimary,
    marginLeft: 12,
  },
  menuArrow: {
    marginLeft: 8,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 16,
    paddingVertical: 14,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.error,
  },
  logoutText: {
    color: COLORS.error,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default Profile;
