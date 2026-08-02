import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal as RNModal,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS } from '../styles/colors';

const Modal = ({
  visible,
  onClose,
  title,
  children,
  actions,
  fullScreen = false,
  style,
}) => {
  return (
    <RNModal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        />
        <View style={[
          styles.container,
          fullScreen && styles.fullScreen,
          style
        ]}>
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Icon name="close" size={24} color={COLORS.textPrimary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {children}
          </ScrollView>

          {actions && actions.length > 0 && (
            <View style={styles.actions}>
              {actions.map((action, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.actionButton,
                    action.primary && styles.primaryAction,
                    action.danger && styles.dangerAction,
                    action.style,
                  ]}
                  onPress={action.onPress}
                  disabled={action.disabled}
                >
                  {action.icon && (
                    <Icon
                      name={action.icon}
                      size={20}
                      color={action.primary || action.danger ? '#FFF' : COLORS.textPrimary}
                      style={styles.actionIcon}
                    />
                  )}
                  <Text style={[
                    styles.actionText,
                    (action.primary || action.danger) && styles.primaryActionText,
                  ]}>
                    {action.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </View>
    </RNModal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  container: {
    backgroundColor: COLORS.bgSecondary,
    borderRadius: 20,
    width: '90%',
    maxHeight: '80%',
    padding: 20,
  },
  fullScreen: {
    width: '100%',
    height: '100%',
    borderRadius: 0,
    padding: 20,
    paddingTop: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  closeButton: {
    padding: 4,
  },
  content: {
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
    gap: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  primaryAction: {
    backgroundColor: COLORS.primary,
  },
  dangerAction: {
    backgroundColor: COLORS.error,
  },
  actionIcon: {
    marginRight: 8,
  },
  actionText: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: '500',
  },
  primaryActionText: {
    color: '#FFF',
  },
});

export default Modal;
