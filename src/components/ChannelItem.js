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

const ChannelItem = ({
  channel,
  onPress,
  onLongPress,
  showSubscribe = true,
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
    } else {
      return time.format('DD/MM/YYYY');
    }
  };

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress && onPress(channel)}
      onLongPress={() => onLongPress && onLongPress(channel)}
      activeOpacity={0.7}
    >
      <View style={styles.avatarContainer}>
        {channel.photo ? (
          <Image source={{ uri: channel.photo }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.avatarPlaceholder]}>
            <Text style={styles.avatarText}>
              {getInitials(channel.name)}
            </Text>
          </View>
        )}
        {channel.verified && (
          <View style={styles.verifiedBadge}>
            <Icon name="check-decagram" size={16} color={COLORS.verified} />
          </View>
        )}
      </View>

      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.nameContainer}>
            <Text style={styles.name} numberOfLines={1}>
              {channel.name}
            </Text>
            {channel.verified && (
              <Icon name="check-decagram" size={14} color={COLORS.verified} style={styles.verifiedIcon} />
            )}
            {channel.isPrivate && (
              <Icon name="lock" size={14} color={COLORS.textSecondary} style={styles.lockIcon} />
            )}
          </View>
          <Text style={styles.subscribers}>
            {formatNumber(channel.subscribers || 0)} subscribers
          </Text>
        </View>

        {channel.description && (
          <Text style={styles.description} numberOfLines={2}>
            {channel.description}
          </Text>
        )}

        <View style={styles.footer}>
          {channel.lastPost && (
            <Text style={styles.lastPost} numberOfLines={1}>
              📌 {channel.lastPost}
            </Text>
          )}
          {channel.lastPostTime && (
            <Text style={styles.time}>
              {formatTime(channel.lastPostTime)}
            </Text>
          )}
        </View>

        {showSubscribe && (
          <TouchableOpacity
            style={[
              styles.subscribeButton,
              channel.subscribed && styles.subscribedButton
            ]}
            onPress={() => {}}
          >
            <Text style={[
              styles.subscribeButtonText,
              channel.subscribed && styles.subscribedButtonText
            ]}>
              {channel.subscribed ? 'Subscribed' : 'Subscribe'}
            </Text>
          </TouchableOpacity>
        )}
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
  verifiedBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    backgroundColor: COLORS.bgPrimary,
    borderRadius: 12,
    padding: 2,
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
  verifiedIcon: {
    marginLeft: 4,
  },
  lockIcon: {
    marginLeft: 4,
  },
  subscribers: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  description: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastPost: {
    fontSize: 13,
    color: COLORS.textSecondary,
    flex: 1,
  },
  time: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginLeft: 8,
  },
  subscribeButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    marginTop: 8,
  },
  subscribedButton: {
    backgroundColor: 'rgba(88, 101, 242, 0.1)',
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  subscribeButtonText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
  subscribedButtonText: {
    color: COLORS.primary,
  },
});

export default ChannelItem;
