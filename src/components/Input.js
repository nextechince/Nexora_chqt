import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS } from '../styles/colors';

const Input = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
  error,
  success,
  disabled = false,
  icon,
  iconPosition = 'left',
  onIconPress,
  multiline = false,
  numberOfLines = 1,
  style,
  inputStyle,
  labelStyle,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = secureTextEntry;
  const isSecure = secureTextEntry && !showPassword;

  return (
    <View style={[styles.container, style]}>
      {label && (
        <Text style={[styles.label, labelStyle]}>{label}</Text>
      )}
      <View style={[
        styles.inputWrapper,
        isFocused && styles.focused,
        error && styles.errorBorder,
        success && styles.successBorder,
        disabled && styles.disabled,
      ]}>
        {icon && iconPosition === 'left' && (
          <TouchableOpacity onPress={onIconPress} disabled={!onIconPress}>
            <Icon name={icon} size={20} color={COLORS.textSecondary} style={styles.leftIcon} />
          </TouchableOpacity>
        )}
        <TextInput
          style={[
            styles.input,
            multiline && styles.multiline,
            inputStyle
          ]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={COLORS.textSecondary}
          secureTextEntry={isSecure}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          editable={!disabled}
          multiline={multiline}
          numberOfLines={numberOfLines}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
        {isPassword && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Icon
              name={showPassword ? 'eye-off' : 'eye'}
              size={20}
              color={COLORS.textSecondary}
            />
          </TouchableOpacity>
        )}
        {icon && iconPosition === 'right' && (
          <TouchableOpacity onPress={onIconPress} disabled={!onIconPress}>
            <Icon name={icon} size={20} color={COLORS.textSecondary} style={styles.rightIcon} />
          </TouchableOpacity>
        )}
      </View>
      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}
      {success && (
        <Text style={styles.successText}>{success}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.textPrimary,
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.bgSecondary,
    borderRadius: 12,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: COLORS.borderGlass,
  },
  focused: {
    borderColor: COLORS.primary,
    borderWidth: 2,
  },
  errorBorder: {
    borderColor: COLORS.error,
    borderWidth: 2,
  },
  successBorder: {
    borderColor: COLORS.success,
    borderWidth: 2,
  },
  disabled: {
    opacity: 0.5,
  },
  input: {
    flex: 1,
    height: 50,
    color: COLORS.textPrimary,
    fontSize: 16,
  },
  multiline: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  leftIcon: {
    marginRight: 12,
  },
  rightIcon: {
    marginLeft: 12,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 12,
    marginTop: 4,
  },
  successText: {
    color: COLORS.success,
    fontSize: 12,
    marginTop: 4,
  },
});

export default Input;
