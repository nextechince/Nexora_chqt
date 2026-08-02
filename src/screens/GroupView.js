import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
  Modal,
  ScrollView,
  ActivityIndicator,
  Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS } from '../styles/colors';
import { db } from '../services/LocalDB';
import MessageBubble from '../components/MessageBubble';
import OnlineStatus from '../components/OnlineStatus';
import Toast from 'react-native-toast-message';
import moment from 'moment';

const GroupView = ({ route, navigation }) => {
  const { groupId, groupName } = route.params;
  const [group, setGroup] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showMembers, setShowMembers] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [userId, setUserId] = useState('admin_001');
  const flatListRef = useRef();

  useEffect(() => {
    loadGroupData();
  }, []);

  const loadGroupData = async () => {
    setIsLoading(true);
    try {
      const groupData = await db.getGroupById(groupId);
      if (groupData) {
        setGroup(groupData);
        const msgs = await db.getUserMessages(userId, groupId);
        setMessages(msgs || []);
      }
    } catch (error) {
      console.log('Error loading group:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async (text) => {
    if (!text.trim()) return;

    try {
      const message = await db.sendUserMessage(
        userId,
        groupId,
        userId,
        text.trim(),
        'text'
      );
      if (message) {
        setMessages(prev => [...prev, message]);
        setInputText('');
        flatListRef.current?.scrollToEnd();
      }
    } catch (error) {
      console.log('Error sending message:', error);
    }
  };

  const handleMemberPress = (memberId) => {
    // Navigate to member profile
    Toast.show({
      type: 'info',
      text1: 'Member',
      text2: `Viewing member profile`
    });
  };

  const renderMember = ({ item }) => (
    <TouchableOpacity
      style={styles.memberItem}
      onPress={() => handleMemberPress(item.id)}
    >
      <View style={styles.memberAvatarContainer}>
        {item.profileImage ? (
          <Image source={{ uri: item.profileImage }} style={styles.memberAvatar} />
        ) : (
          <View style={[styles.memberAvatar, styles.memberAvatarPlaceholder]}>
            <Text style={styles.memberAvatarText}>
              {item.displayName?.charAt(0) || 'U'}
            </Text>
          </View>
        )}
        {item.online && <View style={styles.memberOnlineDot} />}
      </View>
      <View style={styles.memberInfo}>
        <Text style={styles.memberName}>{item.displayName}</Text>
        <OnlineStatus online={item.online} lastSeen={item.lastSeen} size="small" />
      </View>
      {item.id === group?.creatorId && (
        <View style={styles.ownerBadge}>
          <Text style={styles.ownerBadgeText}>Owner</Text>
        </View>
      )}
      {group?.admins?.includes(item.id) && item.id !== group?.creatorId && (
        <View style={[styles.ownerBadge, { backgroundColor: COLORS.primary }]}>
          <Text style={styles.ownerBadgeText}>Admin</Text>
        </View>
      )}
      {group?.moderators?.includes(item.id) && !group?.admins?.includes(item.id) && (
        <View style={[styles.ownerBadge, { backgroundColor: COLORS.moderator }]}>
          <Text style={styles.ownerBadgeText}>Mod</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.headerCenter} onPress={() => setShowInfo(true)}>
          <Text style={styles.headerTitle}>{group?.name || 'Group'}</Text>
          <Text style={styles.headerSubtitle}>
            {group?.members?.length || 0} members
          </Text>
        </TouchableOpacity>
        <View style={styles.headerRight}>
          <TouchableOpacity onPress={() => setShowMembers(true)}>
            <Icon name="account-group" size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <MessageBubble
            message={item}
            isMe={item.senderId === userId}
          />
        )}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
        contentContainerStyle={styles.messagesList}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          placeholderTextColor={COLORS.textSecondary}
          value={inputText}
          onChangeText={setInputText}
          multiline
        />
        <TouchableOpacity style={styles.sendButton} onPress={() => sendMessage(inputText)}>
          <Icon name="send" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      {/* Members Modal */}
      <Modal visible={showMembers} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Members</Text>
              <TouchableOpacity onPress={() => setShowMembers(false)}>
                <Icon name="close" size={24} color={COLORS.textPrimary} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={group?.members || []}
              keyExtractor={(item) => item.id}
              renderItem={renderMember}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>
      </Modal>

      {/* Group Info Modal */}
      <Modal visible={showInfo} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Group Info</Text>
              <TouchableOpacity onPress={() => setShowInfo(false)}>
                <Icon name="close" size={24} color={COLORS.textPrimary} />
              </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.groupInfoContainer}>
                {group?.photo ? (
                  <Image source={{ uri: group.photo }} style={styles.groupInfoImage} />
                ) : (
                  <View style={[styles.groupInfoImage, styles.groupInfoImagePlaceholder]}>
                    <Text style={styles.groupInfoImageText}>
                      {group?.name?.charAt(0) || 'G'}
                    </Text>
                  </View>
                )}
                <Text style={styles.groupInfoName}>{group?.name}</Text>
                {group?.description && (
                  <Text style={styles.groupInfoDescription}>{group.description}</Text>
                )}
                <View style={styles.groupInfoStats}>
                  <View style={styles.groupInfoStat}>
                    <Text style={styles.groupInfoStatNumber}>{group?.members?.length || 0}</Text>
                    <Text style={styles.groupInfoStatLabel}>Members</Text>
                  </View>
                  <View style={styles.groupInfoStat}>
                    <Text style={styles.groupInfoStatNumber}>{messages.length}</Text>
                    <Text style={styles.groupInfoStatLabel}>Messages</Text>
                  </View>
                  <View style={styles.groupInfoStat}>
                    <Text style={styles.groupInfoStatNumber}>
                      {group?.createdAt ? moment(group.createdAt).format('DD/MM/YY') : 'N/A'}
                    </Text>
                    <Text style={styles.groupInfoStatLabel}>Created</Text>
                  </View>
                </View>
                {group?.creatorId === userId && (
                  <TouchableOpacity style={styles.groupInfoButton}>
                    <Text style={styles.groupInfoButtonText}>Edit Group</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  style={[styles.groupInfoButton, styles.groupInfoButtonDanger]}
                  onPress={() => {
                    Alert.alert(
                      'Leave Group',
                      `Are you sure you want to leave ${group?.name}?`,
                      [
                        { text: 'Cancel', style: 'cancel' },
                        {
                          text: 'Leave',
                          style: 'destructive',
                          onPress: async () => {
                            await db.leaveGroup(groupId, userId);
                            navigation.goBack();
                            Toast.show({
                              type: 'success',
                              text1: 'Left Group',
                              text2: `You left ${group?.name}`
                            });
                          }
                        }
                      ]
                    );
                  }}
                >
                  <Text style={styles.groupInfoButtonDangerText}>Leave Group</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgPrimary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.bgPrimary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.bgSecondary,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderGlass,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  headerSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  messagesList: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: COLORS.bgSecondary,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderGlass,
  },
  input: {
    flex: 1,
    color: COLORS.textPrimary,
    fontSize: 16,
    maxHeight: 100,
    paddingHorizontal: 8,
    paddingVertical: 6,
    backgroundColor: COLORS.bgPrimary,
    borderRadius: 20,
    paddingHorizontal: 16,
    marginRight: 8,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.bgSecondary,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderGlass,
  },
  memberAvatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  memberAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  memberAvatarPlaceholder: {
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  memberAvatarText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  memberOnlineDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.online,
    borderWidth: 2,
    borderColor: COLORS.bgSecondary,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 15,
    fontWeight: '500',
    color: COLORS.textPrimary,
  },
  ownerBadge: {
    backgroundColor: COLORS.owner,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  ownerBadgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '600',
  },
  groupInfoContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  groupInfoImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 12,
  },
  groupInfoImagePlaceholder: {
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  groupInfoImageText: {
    color: '#FFF',
    fontSize: 32,
    fontWeight: 'bold',
  },
  groupInfoName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  groupInfoDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 4,
    paddingHorizontal: 20,
  },
  groupInfoStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginVertical: 20,
    paddingVertical: 16,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
  },
  groupInfoStat: {
    alignItems: 'center',
  },
  groupInfoStatNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  groupInfoStatLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  groupInfoButton: {
    width: '100%',
    paddingVertical: 12,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  groupInfoButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  groupInfoButtonDanger: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.error,
    marginTop: 8,
  },
  groupInfoButtonDangerText: {
    color: COLORS.error,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default GroupView;
