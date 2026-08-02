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
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS } from '../styles/colors';
import { db } from '../services/LocalDB';
import MessageBubble from '../components/MessageBubble';
import Toast from 'react-native-toast-message';
import moment from 'moment';

const ChannelView = ({ route, navigation }) => {
  const { channelId } = route.params;
  const [channel, setChannel] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showInfo, setShowInfo] = useState(false);
  const [userId, setUserId] = useState('admin_001');
  const flatListRef = useRef();

  useEffect(() => {
    loadChannelData();
  }, []);

  const loadChannelData = async () => {
    setIsLoading(true);
    try {
      const channelData = await db.getChannelById(channelId);
      if (channelData) {
        setChannel(channelData);
        const msgs = await db.getUserMessages(userId, channelId);
        setMessages(msgs || []);
      }
    } catch (error) {
      console.log('Error loading channel:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const sendPost = async (text) => {
    if (!text.trim()) return;

    try {
      const post = await db.createChannelPost(
        channelId,
        userId,
        text.trim(),
        'text'
      );
      if (post) {
        setMessages(prev => [...prev, post]);
        setInputText('');
        flatListRef.current?.scrollToEnd();
      }
    } catch (error) {
      console.log('Error sending post:', error);
    }
  };

  const handleSubscribe = async () => {
    try {
      const isSubscribed = channel?.subscribers?.includes(userId);
      if (isSubscribed) {
        await db.unsubscribeChannel(channelId, userId);
        Toast.show({
          type: 'success',
          text1: 'Unsubscribed',
          text2: `You left ${channel?.name}`
        });
      } else {
        await db.subscribeChannel(channelId, userId);
        Toast.show({
          type: 'success',
          text1: 'Subscribed',
          text2: `You joined ${channel?.name}`
        });
      }
      await loadChannelData();
    } catch (error) {
      console.log('Error subscribing:', error);
    }
  };

  const renderPost = ({ item }) => (
    <MessageBubble
      message={item}
      isMe={item.senderId === userId}
    />
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  const isSubscribed = channel?.subscribers?.includes(userId);

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
          <Text style={styles.headerTitle}>{channel?.name || 'Channel'}</Text>
          <Text style={styles.headerSubtitle}>
            {channel?.subscribers?.length || 0} subscribers
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSubscribe}>
          <Icon
            name={isSubscribed ? 'check-circle' : 'plus-circle'}
            size={24}
            color={isSubscribed ? COLORS.success : COLORS.primary}
          />
        </TouchableOpacity>
      </View>

      {channel?.verified && (
        <View style={styles.verifiedBanner}>
          <Icon name="check-decagram" size={16} color={COLORS.verified} />
          <Text style={styles.verifiedText}>Verified Channel</Text>
        </View>
      )}

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderPost}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
        contentContainerStyle={styles.messagesList}
      />

      {isSubscribed && (
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Write a post..."
            placeholderTextColor={COLORS.textSecondary}
            value={inputText}
            onChangeText={setInputText}
            multiline
          />
          <TouchableOpacity style={styles.sendButton} onPress={() => sendPost(inputText)}>
            <Icon name="send" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>
      )}

      {/* Channel Info Modal */}
      <Modal visible={showInfo} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Channel Info</Text>
              <TouchableOpacity onPress={() => setShowInfo(false)}>
                <Icon name="close" size={24} color={COLORS.textPrimary} />
              </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.channelInfoContainer}>
                {channel?.photo ? (
                  <Image source={{ uri: channel.photo }} style={styles.channelInfoImage} />
                ) : (
                  <View style={[styles.channelInfoImage, styles.channelInfoImagePlaceholder]}>
                    <Text style={styles.channelInfoImageText}>
                      {channel?.name?.charAt(0) || 'C'}
                    </Text>
                  </View>
                )}
                <Text style={styles.channelInfoName}>{channel?.name}</Text>
                {channel?.description && (
                  <Text style={styles.channelInfoDescription}>{channel.description}</Text>
                )}
                <View style={styles.channelInfoStats}>
                  <View style={styles.channelInfoStat}>
                    <Text style={styles.channelInfoStatNumber}>
                      {channel?.subscribers?.length || 0}
                    </Text>
                    <Text style={styles.channelInfoStatLabel}>Subscribers</Text>
                  </View>
                  <View style={styles.channelInfoStat}>
                    <Text style={styles.channelInfoStatNumber}>{messages.length}</Text>
                    <Text style={styles.channelInfoStatLabel}>Posts</Text>
                  </View>
                  <View style={styles.channelInfoStat}>
                    <Text style={styles.channelInfoStatNumber}>
                      {channel?.createdAt ? moment(channel.createdAt).format('DD/MM/YY') : 'N/A'}
                    </Text>
                    <Text style={styles.channelInfoStatLabel}>Created</Text>
                  </View>
                </View>
                <View style={styles.channelInfoDetails}>
                  <View style={styles.channelInfoDetail}>
                    <Icon name="tag" size={16} color={COLORS.textSecondary} />
                    <Text style={styles.channelInfoDetailText}>
                      Category: {channel?.category || 'General'}
                    </Text>
                  </View>
                  <View style={styles.channelInfoDetail}>
                    <Icon name={channel?.isPrivate ? 'lock' : 'lock-open'} size={16} color={COLORS.textSecondary} />
                    <Text style={styles.channelInfoDetailText}>
                      {channel?.isPrivate ? 'Private' : 'Public'}
                    </Text>
                  </View>
                  {channel?.verified && (
                    <View style={styles.channelInfoDetail}>
                      <Icon name="check-decagram" size={16} color={COLORS.verified} />
                      <Text style={[styles.channelInfoDetailText, { color: COLORS.verified }]}>
                        Verified Channel
                      </Text>
                    </View>
                  )}
                </View>
                {channel?.creatorId === userId && (
                  <TouchableOpacity style={styles.channelInfoButton}>
                    <Text style={styles.channelInfoButtonText}>Edit Channel</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  style={[styles.channelInfoButton, styles.channelInfoButtonDanger]}
                  onPress={async () => {
                    await db.unsubscribeChannel(channelId, userId);
                    navigation.goBack();
                    Toast.show({
                      type: 'success',
                      text1: 'Unsubscribed',
                      text2: `You left ${channel?.name}`
                    });
                  }}
                >
                  <Text style={styles.channelInfoButtonDangerText}>Unsubscribe</Text>
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
  verifiedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    backgroundColor: 'rgba(0, 212, 255, 0.1)',
  },
  verifiedText: {
    color: COLORS.verified,
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
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
  channelInfoContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  channelInfoImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 12,
  },
  channelInfoImagePlaceholder: {
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  channelInfoImageText: {
    color: '#FFF',
    fontSize: 32,
    fontWeight: 'bold',
  },
  channelInfoName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  channelInfoDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 4,
    paddingHorizontal: 20,
  },
  channelInfoStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginVertical: 20,
    paddingVertical: 16,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
  },
  channelInfoStat: {
    alignItems: 'center',
  },
  channelInfoStatNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  channelInfoStatLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  channelInfoDetails: {
    width: '100%',
    paddingHorizontal: 20,
  },
  channelInfoDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  channelInfoDetailText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    marginLeft: 8,
  },
  channelInfoButton: {
    width: '100%',
    paddingVertical: 12,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  channelInfoButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  channelInfoButtonDanger: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.error,
    marginTop: 8,
  },
  channelInfoButtonDangerText: {
    color: COLORS.error,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ChannelView;
