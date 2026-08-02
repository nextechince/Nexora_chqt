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

const ProfileCard = ({
  user,
  onPress,
  showBadges = true,
  showActions = true,
  onMessagePress,
  onCallPress,
  onFollowPress,
}) => {
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const renderBadges = () => {
    const badges = user.badges || [];
    const badgeIcons = {
      verified: { icon: 'check-decagram', color: COLORS.verified, label: 'Verified' },
      premium: { icon: 'crown', color: COLORS.premium, label: 'Premium' },
      developer: { icon: 'code-tags', color: COLORS.developer, label: 'Developer' },
      owner: { icon: 'crown', color: COLORS.owner, label: 'Owner' },
      moderator: { icon: 'shield-check', color: COLORS.moderator, label: 'Moderator' },
    };

    return badges.map((badge, index) => {
      const badgeInfo = badgeIcons[badge];
      if (!badgeInfo) return null;
      return (
        <View key={index} style={[styles.badge, { backgroundColor: badgeInfo.color + '20' }]}>
          <Icon name={badgeInfo.icon} size={12} color={badgeInfo.color} />
          <Text style={[styles.badgeText, { color: badgeInfo.color }]}>
            {badgeInfo.label}
          </Text>
        </View>
      );
    });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.avatarContainer} onPress={onPress}>
        {user.profileImage ? (
          <Image source={{ uri: user.profileImage }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.avatarPlaceholder]}>
            <Text style={styles.avatarText}>
              {getInitials(user.displayName || 'User')}
            </Text>
          </View>
        )}
        {user.online && <View style={styles.onlineDot} />}
      </TouchableOpacity>

      <View style={styles.info}>
        <View style={styles.nameContainer}>
          <Text style={styles.displayName}>{user.displayName || 'User'}</Text>
          {user.verified && (
            <Icon name="check-decagram" size={16} color={COLORS.verified} style={styles.verifiedIcon} />
          )}
          {user.premium && (
            <Icon name="crown" size={16} color={COLORS.premium} style={styles.premiumIcon} />
          )}
        </View>

        {user.username && (
          <Text style={styles.username}>@{user.username}</Text>
        )}

        {user.bio && (
          <Text style={styles.bio}>{user.bio}</Text>
        )}

        {user.status && (
          <View style={styles.statusContainer}>
            <View style={[styles.statusDot, user.online ? styles.statusOnline : styles.statusOffline]} />
            <Text style={styles.statusText}>
              {user.online ? 'Online' : `Last seen ${user.lastSeen || 'recently'}`}
            </Text>
          </View>
        )}

        {showBadges && (
          <View style={styles.badgesContainer}>
            {renderBadges()}
          </View>
        )}

        {showActions && (
          <View style={styles.actions}>
            {onMessagePress && (
              <TouchableOpacity style={styles.actionButton} onPress={onMessagePress}>
                <Icon name="message" size={20} color="#FFF" />
                <Text style={styles.actionButtonText}>Chat</Text>
              </TouchableOpacity>
            )}
            {onCallPress && (
              <TouchableOpacity style={[styles.actionButton, styles.callButton]} onPress={onCallPress}>
                <Icon name="phone" size={20} color="#FFF" />
                <Text style={styles.actionButtonText}>Call</Text>
              </TouchableOpacity>
            )}
            {onFollowPress && (
              <TouchableOpacity style={[styles.actionButton, styles.followButton]} onPress={onFollowPress}>
                <Icon name="account-plus" size={20} color="#FFF" />
                <Text style={styles.actionButtonText}>Follow</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: COLORS.bgSecondary,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.borderGlass,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  avatarPlaceholder: {
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#FFF',
    fontSize: 32,
    fontWeight: 'bold',
  },
  onlineDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: COLORS.online,
    borderWidth: 3,
    borderColor: COLORS.bgSecondary,
  },
  info: {
    flex: 1,
    justifyContent: 'center',
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  displayName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  verifiedIcon: {
    marginLeft: 4,
  },
  premiumIcon: {
    marginLeft: 4,
  },
  username: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  bio: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusOnline: {
    backgroundColor: COLORS.online,
  },
  statusOffline: {
    backgroundColor: COLORS.offline,
  },
  statusText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  badgesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginRight: 4,
    marginBottom: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '600',
    marginLeft: 2,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  callButton: {
    backgroundColor: COLORS.success,
  },
  followButton: {
    backgroundColor: COLORS.accent,
  },
  actionButtonText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
});

export default ProfileCard;
