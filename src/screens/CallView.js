import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  StatusBar,
  Dimensions,
  Platform,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS } from '../styles/colors';
import { db } from '../services/LocalDB';
import CallControls from '../components/CallControls';
import Toast from 'react-native-toast-message';

const { width, height } = Dimensions.get('window');

const CallView = ({ route, navigation }) => {
  const { callId, type, isNew } = route.params || {};
  const [caller, setCaller] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);
  const [isOnHold, setIsOnHold] = useState(false);
  const [isRinging, setIsRinging] = useState(true);
  const [callDuration, setCallDuration] = useState(0);
  const [callActive, setCallActive] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [userId, setUserId] = useState('admin_001');
  const timerRef = useRef(null);

  useEffect(() => {
    loadCallerInfo();
    startRinging();

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const loadCallerInfo = async () => {
    try {
      if (callId) {
        const calls = await db.getCalls(userId);
        const call = calls.find(c => c.id === callId);
        if (call) {
          const user = await db.getUserById(call.from === userId ? call.to : call.from);
          setCaller(user);
        }
      } else {
        // New call
        const user = await db.getUserById('user_001');
        setCaller(user);
      }
    } catch (error) {
      console.log('Error loading caller:', error);
    }
  };

  const startRinging = () => {
    setIsRinging(true);
    setTimeout(() => {
      setIsRinging(false);
      setCallActive(true);
      startTimer();
      Toast.show({
        type: 'success',
        text1: 'Call Connected',
        text2: `Connected to ${caller?.displayName || 'User'}`
      });
    }, 3000);
  };

  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEndCall = async () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    // Save call to history
    await db.addCall({
      from: userId,
      to: caller?.id || 'user_001',
      type: type || 'voice',
      duration: callDuration,
      status: 'completed',
      timestamp: new Date().toISOString()
    });

    navigation.goBack();
    Toast.show({
      type: 'info',
      text1: 'Call Ended',
      text2: `Duration: ${formatDuration(callDuration)}`
    });
  };

  const handleAccept = () => {
    setIsRinging(false);
    setCallActive(true);
    startTimer();
  };

  const handleReject = () => {
    navigation.goBack();
    Toast.show({
      type: 'error',
      text1: 'Call Rejected',
    });
  };

  const toggleControls = () => {
    setShowControls(!showControls);
  };

  if (isRinging) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <View style={styles.ringingContainer}>
          <View style={styles.ringingAvatar}>
            {caller?.profileImage ? (
              <Image source={{ uri: caller.profileImage }} style={styles.ringingAvatarImage} />
            ) : (
              <View style={styles.ringingAvatarPlaceholder}>
                <Text style={styles.ringingAvatarText}>
                  {caller?.displayName?.charAt(0) || 'U'}
                </Text>
              </View>
            )}
          </View>
          <Text style={styles.ringingName}>{caller?.displayName || 'Unknown'}</Text>
          <Text style={styles.ringingStatus}>Ringing...</Text>
          
          <View style={styles.ringingActions}>
            <TouchableOpacity style={styles.rejectButton} onPress={handleReject}>
              <Icon name="phone-hangup" size={32} color="#FFF" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.acceptButton} onPress={handleAccept}>
              <Icon name="phone" size={32} color="#FFF" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={1}
      onPress={toggleControls}
    >
      <StatusBar barStyle="light-content" />
      
      <View style={styles.callContainer}>
        {type === 'video' && isVideoOn && (
          <View style={styles.videoContainer}>
            {/* Remote video */}
            <View style={styles.remoteVideo}>
              <View style={styles.remoteVideoPlaceholder}>
                <Text style={styles.remoteVideoText}>
                  {caller?.displayName?.charAt(0) || 'U'}
                </Text>
              </View>
            </View>
            {/* Local video */}
            <View style={styles.localVideo}>
              <View style={styles.localVideoPlaceholder}>
                <Text style={styles.localVideoText}>You</Text>
              </View>
            </View>
          </View>
        )}

        {(!type || type === 'voice') && (
          <View style={styles.voiceContainer}>
            <View style={styles.voiceAvatar}>
              {caller?.profileImage ? (
                <Image source={{ uri: caller.profileImage }} style={styles.voiceAvatarImage} />
              ) : (
                <View style={styles.voiceAvatarPlaceholder}>
                  <Text style={styles.voiceAvatarText}>
                    {caller?.displayName?.charAt(0) || 'U'}
                  </Text>
                </View>
              )}
            </View>
            <Text style={styles.voiceName}>{caller?.displayName || 'Unknown'}</Text>
            <Text style={styles.voiceDuration}>{formatDuration(callDuration)}</Text>
          </View>
        )}

        {showControls && (
          <View style={styles.controlsContainer}>
            <CallControls
              isMuted={isMuted}
              isVideoOn={isVideoOn}
              isSpeakerOn={isSpeakerOn}
              isOnHold={isOnHold}
              onToggleMute={() => setIsMuted(!isMuted)}
              onToggleVideo={() => setIsVideoOn(!isVideoOn)}
              onToggleSpeaker={() => setIsSpeakerOn(!isSpeakerOn)}
              onToggleHold={() => setIsOnHold(!isOnHold)}
              onEndCall={handleEndCall}
              onSwitchCamera={() => {}}
              onAddParticipant={() => {}}
            />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgPrimary,
  },
  ringingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  ringingAvatar: {
    marginBottom: 24,
  },
  ringingAvatarImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  ringingAvatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ringingAvatarText: {
    color: '#FFF',
    fontSize: 48,
    fontWeight: 'bold',
  },
  ringingName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  ringingStatus: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  ringingActions: {
    flexDirection: 'row',
    marginTop: 48,
    gap: 40,
  },
  rejectButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.error,
    justifyContent: 'center',
    alignItems: 'center',
  },
  acceptButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.success,
    justifyContent: 'center',
    alignItems: 'center',
  },
  callContainer: {
    flex: 1,
  },
  videoContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  remoteVideo: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  remoteVideoPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  remoteVideoText: {
    color: '#FFF',
    fontSize: 48,
    fontWeight: 'bold',
  },
  localVideo: {
    position: 'absolute',
    top: 40,
    right: 16,
    width: 120,
    height: 160,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
    overflow: 'hidden',
  },
  localVideoPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  localVideoText: {
    color: '#FFF',
    fontSize: 14,
  },
  voiceContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  voiceAvatar: {
    marginBottom: 24,
  },
  voiceAvatarImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  voiceAvatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  voiceAvatarText: {
    color: '#FFF',
    fontSize: 48,
    fontWeight: 'bold',
  },
  voiceName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  voiceDuration: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  controlsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 40 : 16,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
});

export default CallView;
