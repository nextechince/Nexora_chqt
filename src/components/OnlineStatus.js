import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { COLORS } from '../styles/colors';
import moment from 'moment';

const OnlineStatus = ({
  online = false,
  lastSeen,
  showText = true,
  size = 'medium',
}) => {
  const getStatusText = () => {
    if (online) return 'Online';
    if (lastSeen) {
      const now = moment();
      const last = moment(lastSeen);
      const diff = now.diff(last, 'minutes');
      
      if (diff < 1) return 'Just now';
      if (diff < 60) return `${diff}m ago`;
      if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
      return last.format('DD/MM/YYYY');
    }
    return 'Offline';
  };

  const getDotSize = () => {
    switch (size) {
      case 'small':
        return styles.dotSmall;
      case 'large':
        return styles.dotLarge;
      default:
        return styles.dotMedium;
    }
  };

  const getTextSize = () => {
    switch (size) {
      case 'small':
        return styles.textSmall;
      case 'large':
        return styles.textLarge;
      default:
        return styles.textMedium;
    }
  };

  const getColor = () => {
    if (online) return COLORS.online;
    return COLORS.offline;
  };

  return (
    <View style={styles.container}>
      <View style={[
        styles.dot,
        getDotSize(),
        { backgroundColor: getColor() }
      ]} />
      {showText && (
        <Text style={[
          styles.text,
          getTextSize(),
          { color: getColor() }
        ]}>
          {getStatusText()}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    borderRadius: 50,
    marginRight: 6,
  },
  dotSmall: {
    width: 6,
    height: 6,
  },
  dotMedium: {
    width: 8,
    height: 8,
  },
  dotLarge: {
    width: 10,
    height: 10,
  },
  text: {
    fontWeight: '500',
  },
  textSmall: {
    fontSize: 11,
  },
  textMedium: {
    fontSize: 13,
  },
  textLarge: {
    fontSize: 15,
  },
});

export default OnlineStatus;
