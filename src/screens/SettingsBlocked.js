import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  FlatList,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS } from '../styles/colors';
import { db } from '../services/LocalDB';
import Toast from 'react-native-toast-message';

const SettingsBlocked = ({ navigation }) => {
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [allUsers, setAllUsers] = useState([]);
  const [userId, setUserId] = useState('admin_001');

  useEffect(() => {
    loadBlockedUsers();
  }, []);

  const loadBlockedUsers = async () => {
    try {
      const users = await db.getAllUsers();
      setAllUsers(users);
      // For demo, show some blocked users
      setBlockedUsers(users.slice(0, 2));
    } catch (error) {
      console.log('Error loading blocked users:', error);
    }
  };

  const handleUnblock = (user) => {
    Alert.alert(
      'Unblock User',
      `Are you sure you want to unblock ${user.displayName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Unblock',
          style: 'destructive',
          onPress: () => {
            setBlockedUsers(prev => prev.filter(u => u.id !== user.id));
            Toast.show({
              type: 'success',
              text1: 'User Unblocked',
              text2: `${user.displayName} has been unblocked`
            });
          }
        }
      ]
    );
  };

  const handleBlock = () => {
    // Show user search modal
    Toast.show({
      type: 'info',
      text1: 'Search Users',
      text2: 'Search for users to block'
    });
  };

  const renderBlockedItem = ({ item }) => (
    <View style={styles.blockedItem}>
      <View style={styles.blockedItemLeft}>
        <View style={styles.blockedAvatar}>
          {item.profileImage ? (
            <Image source={{ uri: item.profileImage }} style={styles.blockedAvatarImage} />
          ) : (
            <View style={styles.blockedAvatarPlaceholder}>
              <Text style={styles.blockedAvatarText}>
                {item.displayName?.charAt(0) || 'U'}
              </Text>
            </View>
          )}
        </View>
        <View style={styles.blockedInfo}>
          <Text style={styles.blockedName}>{item.displayName}</Text>
          <Text style={styles.blockedUsername}>@{item.username}</Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.unblockButton}
        onPress={() => handleUnblock(item)}
      >
        <Text style={styles.unblockButtonText}>Unblock</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Blocked Users</Text>
        <TouchableOpacity onPress={handleBlock}>
          <Icon name="plus" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Icon name="magnify" size={20} color={COLORS.textSecondary} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search blocked users..."
          placeholderTextColor={COLORS.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {blockedUsers.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Icon name="account-block-outline" size={60} color={COLORS.textSecondary} />
          <Text style={styles.emptyTitle}>No Blocked Users</Text>
          <Text style={styles.emptySubtitle}>
            Users you block will appear here
          </Text>
        </View>
      ) : (
        <FlatList
          data={blockedUsers}
          keyExtractor={(item) => item.id}
          renderItem={renderBlockedItem}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.bgSecondary,
    borderRadius: 10,
    marginHorizontal: 16,
    paddingHorizontal: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.borderGlass,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: COLORS.textPrimary,
    fontSize: 15,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 80,
  },
  blockedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderGlass,
  },
  blockedItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  blockedAvatar: {
    marginRight: 12,
  },
  blockedAvatarImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  blockedAvatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  blockedAvatarText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  blockedInfo: {
    flex: 1,
  },
  blockedName: {
    fontSize: 15,
    fontWeight: '500',
    color: COLORS.textPrimary,
  },
  blockedUsername: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  unblockButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: COLORS.error,
  },
  unblockButtonText: {
    color: COLORS.error,
    fontSize: 13,
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 8,
  },
});

export default SettingsBlocked;
