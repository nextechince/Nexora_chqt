import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS } from '../styles/colors';
import { db } from '../services/LocalDB';
import moment from 'moment';

const Notifications = ({ navigation }) => {
  const [notifications, setNotifications] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [userId, setUserId] = useState('admin_001');

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      const notifs = await db.getNotifications(userId);
      setNotifications(notifs || []);
    } catch (error) {
      console.log('Error loading notifications:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadNotifications();
    setRefreshing(false);
  };

  const markAsRead = async (id) => {
    try {
      await db.markNotificationRead(id);
      await loadNotifications();
    } catch (error) {
      console.log('Error marking notification as read:', error);
    }
  };

  const clearAll = async () => {
    try {
      await db.clearNotifications();
      await loadNotifications();
    } catch (error) {
      console.log('Error clearing notifications:', error);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'message': return 'message';
      case 'group': return 'account-group';
      case 'channel': return 'broadcast';
      case 'call': return 'phone';
      case 'like': return 'heart';
      case 'comment': return 'comment';
      case 'follow': return 'account-plus';
      default: return 'bell';
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'message': return COLORS.primary;
      case 'group': return COLORS.success;
      case 'channel': return COLORS.accent;
      case 'call': return COLORS.warning;
      case 'like': return COLORS.error;
      case 'comment': return COLORS.info;
      case 'follow': return COLORS.premium;
      default: return COLORS.textSecondary;
    }
  };

  const renderNotification = ({ item }) => (
    <TouchableOpacity
      style={[styles.notificationItem, !item.read && styles.unread]}
      onPress={() => {
        markAsRead(item.id);
        if (item.data?.chatId) {
          navigation.navigate('ChatView', { chatId: item.data.chatId });
        }
      }}
    >
      <View style={[styles.notificationIcon, { backgroundColor: getNotificationColor(item.type) + '20' }]}>
        <Icon name={getNotificationIcon(item.type)} size={20} color={getNotificationColor(item.type)} />
      </View>
      <View style={styles.notificationContent}>
        <Text style={styles.notificationTitle}>{item.title}</Text>
        <Text style={styles.notificationBody}>{item.body}</Text>
        <Text style={styles.notificationTime}>
          {moment(item.timestamp).fromNow()}
        </Text>
      </View>
      {!item.read && <View style={styles.unreadDot} />}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        {notifications.length > 0 && (
          <TouchableOpacity onPress={clearAll}>
            <Text style={styles.clearAll}>Clear All</Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={renderNotification}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />
        }
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Icon name="bell-off" size={60} color={COLORS.textSecondary} />
            <Text style={styles.emptyTitle}>No Notifications</Text>
            <Text style={styles.emptySubtitle}>
              You're all caught up!
            </Text>
          </View>
        )}
      />
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
  clearAll: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '500',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 80,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderGlass,
  },
  unread: {
    backgroundColor: 'rgba(88, 101, 242, 0.02)',
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  notificationBody: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  notificationTime: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
    marginLeft: 8,
  },
  emptyContainer: {
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

export default Notifications;
