import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS } from '../styles/colors';
import moment from 'moment';

const ChatItem = ({
  chat,
  onPress,
  onLongPress,
  showOnline = true,
}) => {
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatTime = (timestamp) => {
    const now = moment();
    const time = moment(timestamp);
    
    if (now.diff(time, 'days') === 0) {
      return time.format('HH:mm');
    } else if (now.diff(time, 'days') === 1) {
      return 'Yesterday';
    } else if (now.diff(time, 'days') < 7) {
      return time.format('ddd');
    } else {
      return time.format('DD/MM/YYYY');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'sent':
        return 'check';
      case 'delivered':
        return 'check-all';
      case 'read':
        return 'check-all';
      default:
        return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'read':
        return COLORS.primary;
      default:
        return COLORS.textSecondary;
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        chat.pinned && styles.pinnedContainer,
        chat.archived && styles.archivedContainer
      ]}
      onPress={() => onPress && onPress(chat)}
      onLongPress={() => onLongPress && onLongPress(chat)}
      activeOpacity={0.7}
    >
      <View style={styles.avatarContainer}>
        {chat.avatar ? (
          <Image source={{ uri: chat.avatar }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.avatarPlaceholder]}>
            <Text style={styles.avatarText}>
              {chat.isGroup ? '👥' : getInitials(chat.name)}
            </Text>
          </View>
        )}
        {showOnline && chat.online && !chat.isGroup && (
          <View style={styles.onlineDot} />
        )}
        {chat.isGroup && (
          <View style={styles.groupIcon}>
            <Icon name="account-group" size={12} color="#FFF" />
          </View>
        )}
      </View>

      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.nameContainer}>
            <Text style={styles.name} numberOfLines={1}>
              {chat.name}
            </Text>
            {chat.pinned && (
              <Icon name="pin" size={14} color={COLORS.primary} style={styles.pinIcon} />
            )}
            {chat.verified && (
              <Icon name="check-decagram" size={14} color={COLORS.verified} style={styles.verifiedIcon} />
            )}
            {chat.premium && (
              <Icon name="crown" size={14} color={COLORS.premium} style={styles.premiumIcon} />
            )}
          </View>
          <Text style={styles.time}>
            {chat.lastMessageTime && formatTime(chat.lastMessageTime)}
          </Text>
        </View>

        <View style={styles.footer}>
          <View style={styles.messageContainer}>
            {chat.isGroup && chat.senderName && (
              <Text style={styles.senderName} numberOfLines={1}>
                {chat.senderName}: 
              </Text>
            )}
            {chat.lastMessage && (
              <Text style={[
                styles.message,
                chat.unread > 0 && styles.unreadMessage
              ]} numberOfLines={1}>
                {chat.lastMessage}
              </Text>
            )}
            {chat.status && (
              <Icon
                name={getStatusIcon(chat.status)}
                size={14}
                color={getStatusColor(chat.status)}
                style={styles.statusIcon}
              />
            )}
          </View>

          {chat.unread > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>
                {chat.unread > 99 ? '99+' : chat.unread}
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderGlass,
  },
  pinnedContainer: {
    backgroundColor: 'rgba(88, 101, 242, 0.05)',
  },
  archivedContainer: {
    opacity: 0.5,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  avatarPlaceholder: {
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  onlineDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.online,
    borderWidth: 2,
    borderColor: COLORS.bgPrimary,
  },
  groupIcon: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.bgPrimary,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
    flex: 1,
  },
  pinIcon: {
    marginLeft: 4,
  },
  verifiedIcon: {
    marginLeft: 4,
  },
  premiumIcon: {
    marginLeft: 4,
  },
  time: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginLeft: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  senderName: {
    fontSize: 14,
    color: COLORS.primary,
    marginRight: 4,
  },
  message: {
    fontSize: 14,
    color: COLORS.textSecondary,
    flex: 1,
  },
  unreadMessage: {
    color: COLORS.textPrimary,
    fontWeight: '500',
  },
  statusIcon: {
    marginLeft: 4,
  },
  unreadBadge: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
    marginLeft: 8,
  },
  unreadText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: 'bold',
  },
});

export default ChatItem;
