import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { COLORS } from '../styles/colors';

const Badge = ({
  text,
  count,
  variant = 'primary',
  size = 'medium',
  style,
  textStyle,
}) => {
  const getVariantStyle = () => {
    switch (variant) {
      case 'success':
        return { backgroundColor: COLORS.success };
      case 'error':
        return { backgroundColor: COLORS.error };
      case 'warning':
        return { backgroundColor: COLORS.warning };
      case 'info':
        return { backgroundColor: COLORS.info };
      case 'premium':
        return { backgroundColor: COLORS.premium };
      case 'verified':
        return { backgroundColor: COLORS.verified };
      default:
        return { backgroundColor: COLORS.primary };
    }
  };

  const getSizeStyle = () => {
    switch (size) {
      case 'small':
        return styles.small;
      case 'large':
        return styles.large;
      default:
        return styles.medium;
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

  const displayText = count ? `${count}` : text;

  return (
    <View style={[
      styles.container,
      getVariantStyle(),
      getSizeStyle(),
      style
    ]}>
      <Text style={[
        styles.text,
        getTextSize(),
        textStyle
      ]}>
        {displayText}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  small: {
    height: 18,
    paddingHorizontal: 4,
    minWidth: 18,
  },
  medium: {
    height: 22,
    paddingHorizontal: 8,
    minWidth: 22,
  },
  large: {
    height: 28,
    paddingHorizontal: 12,
    minWidth: 28,
  },
  text: {
    color: '#FFF',
    fontWeight: '600',
    textAlign: 'center',
  },
  textSmall: {
    fontSize: 10,
  },
  textMedium: {
    fontSize: 12,
  },
  textLarge: {
    fontSize: 14,
  },
});

export default Badge;
