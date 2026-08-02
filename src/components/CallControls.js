import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS } from '../styles/colors';

const CallControls = ({
  isMuted = false,
  isVideoOn = true,
  isSpeakerOn = false,
  isOnHold = false,
  onToggleMute,
  onToggleVideo,
  onToggleSpeaker,
  onToggleHold,
  onAddParticipant,
  onEndCall,
  onSwitchCamera,
  disabled = false,
}) => {
  const ControlButton = ({ icon, label, onPress, active = false, danger = false }) => (
    <TouchableOpacity
      style={[
        styles.controlButton,
        active && styles.controlButtonActive,
        danger && styles.controlButtonDanger,
        disabled && styles.controlButtonDisabled,
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <Icon
        name={icon}
        size={24}
        color={danger ? '#FFF' : active ? '#FFF' : COLORS.textPrimary}
      />
      <Text style={[
        styles.controlLabel,
        active && styles.controlLabelActive,
        danger && styles.controlLabelDanger,
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <ControlButton
          icon={isMuted ? 'microphone-off' : 'microphone'}
          label={isMuted ? 'Unmute' : 'Mute'}
          onPress={onToggleMute}
          active={isMuted}
        />
        <ControlButton
          icon={isVideoOn ? 'video' : 'video-off'}
          label={isVideoOn ? 'Video' : 'No Video'}
          onPress={onToggleVideo}
          active={!isVideoOn}
        />
        <ControlButton
          icon={isSpeakerOn ? 'volume-high' : 'volume-off'}
          label={isSpeakerOn ? 'Speaker' : 'Headphone'}
          onPress={onToggleSpeaker}
          active={isSpeakerOn}
        />
      </View>

      <View style={styles.row}>
        <ControlButton
          icon={isOnHold ? 'pause-circle' : 'play-circle'}
          label={isOnHold ? 'Resume' : 'Hold'}
          onPress={onToggleHold}
          active={isOnHold}
        />
        <ControlButton
          icon="camera-switch"
          label="Switch"
          onPress={onSwitchCamera}
        />
        <ControlButton
          icon="account-plus"
          label="Add"
          onPress={onAddParticipant}
        />
      </View>

      <TouchableOpacity
        style={styles.endCallButton}
        onPress={onEndCall}
        disabled={disabled}
      >
        <Icon name="phone-hangup" size={32} color="#FFF" />
        <Text style={styles.endCallLabel}>End Call</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: COLORS.bgSecondary,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.borderGlass,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  controlButton: {
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.05)',
    minWidth: 64,
  },
  controlButtonActive: {
    backgroundColor: COLORS.primary,
  },
  controlButtonDanger: {
    backgroundColor: COLORS.error,
  },
  controlButtonDisabled: {
    opacity: 0.5,
  },
  controlLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  controlLabelActive: {
    color: '#FFF',
  },
  controlLabelDanger: {
    color: '#FFF',
  },
  endCallButton: {
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: COLORS.error,
    borderRadius: 12,
    marginTop: 8,
  },
  endCallLabel: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4,
  },
});

export default CallControls;
