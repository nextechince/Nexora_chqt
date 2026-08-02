import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS } from '../styles/colors';

const SettingsItem = ({
  icon,
  title,
  subtitle,
  onPress,
  rightElement,
  isSwitch = false,
  switchValue = false,
  onSwitchChange,
  danger = false,
  disabled = false,
  style,
}) => {
  const renderRightElement = () => {
    if (isSwitch) {
      return (
        <Switch
          value={switchValue}
          onValueChange={onSwitchChange}
          trackColor={{ false: COLORS.bgSecondary, true: COLORS.primary }}
          thumbColor={switchValue ? '#FFF' : '#FFF'}
          disabled={disabled}
        />
      );
    }

    if (rightElement) {
      return rightElement;
    }

    return (
      <Icon
        name="chevron-right"
        size={20}
        color={COLORS.textSecondary}
      />
    );
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        disabled && styles.disabled,
        danger && styles.danger,
        style
      ]}
      onPress={onPress}
      disabled={disabled || isSwitch}
      activeOpacity={0.7}
    >
      <View style={styles.leftSection}>
        {icon && (
          <View style={[styles.iconContainer, danger && styles.dangerIcon]}>
            <Icon name={icon} size={22} color={danger ? COLORS.error : COLORS.primary} />
          </View>
        )}
        <View style={styles.textContainer}>
          <Text style={[styles.title, danger && styles.dangerText]}>
            {title}
          </Text>
          {subtitle && (
            <Text style={[styles.subtitle, danger && styles.dangerText]}>
              {subtitle}
            </Text>
          )}
        </View>
      </View>
      <View style={styles.rightSection}>
        {renderRightElement()}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: COLORS.bgSecondary,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.borderGlass,
  },
  disabled: {
    opacity: 0.5,
  },
  danger: {
    borderColor: COLORS.error,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: 'rgba(88, 101, 242, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  dangerIcon: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    color: COLORS.textPrimary,
    fontWeight: '500',
  },
  subtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  dangerText: {
    color: COLORS.error,
  },
  rightSection: {
    marginLeft: 8,
  },
});

export default SettingsItem;
