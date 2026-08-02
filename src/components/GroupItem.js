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

const GroupItem = ({
  group,
  onPress,
  onLongPress,
}) => {
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'owner':
        return { icon: 'crown', color: COLORS.owner };
      case 'admin':
        return { icon: 'shield-account', color: COLORS.primary };
      case 'moderator':
        return { icon: 'shield-check', color: COLORS.moderator };
      default:
        return null;
    }
  };

  const formatTime = (timestamp) => {
    const now = moment();
    const time = moment(timestamp);
    
    if (now.diff(time, 'days') === 0) {
      return time.format('HH:mm');
    } else if (now.diff(time, 'days') === 1) {
      return 'Yesterday';
    } else {
      return time.format('DD/MM/YYYY');
    }
  };

  const renderMemberAvatars = () => {
    const visible = group.members?.slice(0, 3) || [];
    const remaining = (group.members?.length || 0) - 3;

    return (
      <View style={styles.memberAvatars}>
        {visible.map((member, index) => (
          <View
            key={index}
            style={[
              styles.memberAvatar,
              { marginLeft: index > 0 ? -8 : 0 }
            ]}
          >
            {member.avatar ? (
              <Image source={{ uri: member.avatar }} style={styles.memberAvatarImage} />
            ) : (
              <View style={styles.memberAvatarPlaceholder}>
                <Text style={styles.memberAvatarText}>
                  {member.name ? getInitials(member.name) : '?'}
                </Text>
              </View>
            )}
          </View>
        ))}
        {remaining > 0 && (
          <View style={styles.memberAvatarMore}>
            <Text style={styles.memberAvatarMoreText}>+{remaining}</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        group.pinned && styles.pinnedContainer,
        group.muted && styles.mutedContainer
      ]}
      onPress={() => onPress && onPress(group)}
      onLongPress={() => onLongPress && onLongPress(group)}
      activeOpacity={0.7}
    >
      <View style={styles.avatarContainer}>
        {group.photo ? (
          <Image source={{ uri: group.photo }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.avatarPlaceholder]}>
            <Text style={styles.avatarText}>
              {getInitials(group.name)}
            </Text>
          </View>
        )}
        <View style={styles.groupTypeIcon}>
          <Icon name="account-group" size={14} color="#FFF" />
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.nameContainer}>
            <Text style={styles.name} numberOfLines={1}>
              {group.name}
            </Text>
            {group.pinned && (
              <Icon name="pin" size={14} color={COLORS.primary} style={styles.pinIcon} />
            )}
            {group.verified && (
              <Icon name="check-decagram" size={14} color={COLORS.verified} style={styles.verifiedIcon} />
            )}
            {group.muted && (
              <Icon name="bell-off" size={14} color={COLORS.textSecondary} style={styles.mutedIcon} />
            )}
          </View>
          <Text style={styles.time}>
            {group.lastMessageTime && formatTime(group.lastMessageTime)}
          </Text>
        </View>

        <View style={styles.footer}>
          <View style={styles.messageContainer}>
            {group.lastMessage && (
              <Text style={[
                styles.message,
                group.unread > 0 && styles.unreadMessage
              ]} numberOfLines={1}>
                {group.lastMessage}
              </Text>
            )}
          </View>

          <View style={styles.rightSection}>
            {renderMemberAvatars()}
            {group.unread > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadText}>
                  {group.unread > 99 ? '99+' : group.unread}
                </Text>
              </View>
            )}
          </View>
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
  mutedContainer: {
    opacity: 0.6,
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
  groupTypeIcon: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    width: 20,
    height: 20,
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
  mutedIcon: {
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
    flex: 1,
  },
  message: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  unreadMessage: {
    color: COLORS.textPrimary,
    fontWeight: '500',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  memberAvatars: {
    flexDirection: 'row',
    marginRight: 8,
  },
  memberAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.bgPrimary,
  },
  memberAvatarImage: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  memberAvatarPlaceholder: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.bgSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  memberAvatarText: {
    fontSize: 8,
    color: COLORS.textSecondary,
    fontWeight: 'bold',
  },
  memberAvatarMore: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.bgSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.bgPrimary,
  },
  memberAvatarMoreText: {
    fontSize: 10,
    color: COLORS.textSecondary,
    fontWeight: 'bold',
  },
  unreadBadge: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  unreadText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: 'bold',
  },
});

export default GroupItem;
