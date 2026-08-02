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
  ActivityIndicator,
  Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS } from '../styles/colors';
import { db } from '../services/LocalDB';
import MessageBubble from '../components/MessageBubble';
import EmojiPicker from '../components/EmojiPicker';
import StickerPicker from '../components/StickerPicker';
import GifPicker from '../components/GifPicker';
import TypingIndicator from '../components/TypingIndicator';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { Audio } from 'expo-av';
import Toast from 'react-native-toast-message';
import moment from 'moment';

const ChatView = ({ route, navigation }) => {
  const { chatId, chatName } = route.params;
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showStickerPicker, setShowStickerPicker] = useState(false);
  const [showGifPicker, setShowGifPicker] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [replyTo, setReplyTo] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState(null);
  const [typingUsers, setTypingUsers] = useState([]);
  const [userId, setUserId] = useState('admin_001');
  const flatListRef = useRef();

  useEffect(() => {
    loadMessages();
    markMessagesAsRead();
    
    // Simulate typing
    const typingInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        setTypingUsers(['User']);
        setTimeout(() => setTypingUsers([]), 2000);
      }
    }, 10000);

    return () => clearInterval(typingInterval);
  }, []);

  const loadMessages = async () => {
    setIsLoading(true);
    try {
      const msgs = await db.getUserMessages(userId, chatId);
      setMessages(msgs || []);
    } catch (error) {
      console.log('Error loading messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const markMessagesAsRead = async () => {
    try {
      await db.markAsRead(chatId, userId);
    } catch (error) {
      console.log('Error marking messages as read:', error);
    }
  };

  const sendMessage = async (text, type = 'text', extra = {}) => {
    if (!text && type === 'text') return;

    try {
      const message = await db.sendUserMessage(
        userId,
        chatId,
        userId,
        text || '',
        type,
        replyTo?.id || null
      );

      if (message) {
        setMessages(prev => [...prev, message]);
        setReplyTo(null);
        setInputText('');
        flatListRef.current?.scrollToEnd();
        
        // Simulate reply
        simulateReply();
      }
    } catch (error) {
      console.log('Error sending message:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to send message'
      });
    }
  };

  const simulateReply = () => {
    setTimeout(async () => {
      const replies = [
        'That\'s interesting! Tell me more. 🤔',
        'I see! Thanks for sharing. 😊',
        'Got it! Let me think about that. 💭',
        'Awesome! You\'re using NEXORA CHQT! 🚀',
        'Great to hear from you! 🙌',
        'I\'m here to help! 💪',
        'That\'s a great point! 🎯',
        'Thanks for the message! 📨'
      ];
      const reply = replies[Math.floor(Math.random() * replies.length)];
      const message = await db.sendUserMessage(
        userId,
        chatId,
        'user_001',
        reply,
        'text',
        null
      );
      if (message) {
        setMessages(prev => [...prev, message]);
        flatListRef.current?.scrollToEnd();
      }
    }, 1500 + Math.random() * 2000);
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7
    });
    if (!result.canceled) {
      await sendMessage(result.assets[0].uri, 'image');
    }
    setShowActions(false);
  };

  const pickDocument = async () => {
    const result = await DocumentPicker.getDocumentAsync({});
    if (result.type === 'success') {
      await sendMessage(result.uri, 'file', {
        fileName: result.name,
        fileSize: result.size
      });
    }
    setShowActions(false);
  };

  const startRecording = async () => {
    try {
      const permission = await Audio.requestPermissionsAsync();
      if (permission.status === 'granted') {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true
        });
        const { recording } = await Audio.Recording.createAsync(
          Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
        );
        setRecording(recording);
        setIsRecording(true);
      }
    } catch (error) {
      console.log('Error starting recording:', error);
    }
  };

  const stopRecording = async () => {
    if (!recording) return;
    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecording(null);
      setIsRecording(false);
      await sendMessage(uri, 'voice');
    } catch (error) {
      console.log('Error stopping recording:', error);
    }
  };

  const handleReaction = async (message, emoji) => {
    try {
      await db.reactToMessage(chatId, message.id, emoji, userId);
      await loadMessages();
    } catch (error) {
      console.log('Error adding reaction:', error);
    }
  };

  const handleDelete = async (message) => {
    try {
      await db.deleteMessage(chatId, message.id, true);
      await loadMessages();
      Toast.show({
        type: 'success',
        text1: 'Message Deleted',
        text2: 'Message has been deleted'
      });
    } catch (error) {
      console.log('Error deleting message:', error);
    }
  };

  const handleEdit = async (message) => {
    // Show edit prompt
    Alert.prompt(
      'Edit Message',
      'Enter new message text',
      async (newText) => {
        if (newText) {
          try {
            await db.editMessage(chatId, message.id, newText);
            await loadMessages();
            Toast.show({
              type: 'success',
              text1: 'Message Edited',
              text2: 'Message updated successfully'
            });
          } catch (error) {
            console.log('Error editing message:', error);
          }
        }
      },
      'plain-text',
      message.text
    );
  };

  const handlePin = async (message) => {
    try {
      await db.pinMessage(chatId, message.id);
      await loadMessages();
      Toast.show({
        type: 'success',
        text1: message.pinned ? 'Message Unpinned' : 'Message Pinned',
        text2: message.pinned ? 'Message has been unpinned' : 'Message has been pinned'
      });
    } catch (error) {
      console.log('Error pinning message:', error);
    }
  };

  const handleForward = async (message) => {
    // Show chat selector
    const userChats = await db.getUserChats(userId);
    // For demo, just forward to first chat
    if (userChats.length > 0) {
      await db.forwardMessage(chatId, message.id, userChats[0].id);
      Toast.show({
        type: 'success',
        text1: 'Message Forwarded',
        text2: 'Message forwarded successfully'
      });
    }
  };

  const renderMessage = ({ item }) => (
    <MessageBubble
      message={item}
      isMe={item.senderId === userId}
      onReaction={handleReaction}
      onReply={() => setReplyTo(item)}
      onPin={handlePin}
      onDelete={handleDelete}
      onEdit={handleEdit}
      onForward={handleForward}
    />
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
        <Text style={styles.headerTitle}>{chatName}</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <Icon name="account-circle" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
      </View>

      {replyTo && (
        <View style={styles.replyBar}>
          <View style={styles.replyBarContent}>
            <View style={styles.replyBarLine} />
            <View style={styles.replyBarInfo}>
              <Text style={styles.replyBarSender}>Replying to {replyTo.senderName || 'User'}</Text>
              <Text style={styles.replyBarText} numberOfLines={1}>{replyTo.text}</Text>
            </View>
          </View>
          <TouchableOpacity onPress={() => setReplyTo(null)}>
            <Icon name="close" size={20} color={COLORS.textSecondary} />
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
        contentContainerStyle={styles.messagesList}
        inverted={false}
      />

      {typingUsers.length > 0 && (
        <TypingIndicator users={typingUsers} />
      )}

      <View style={styles.inputContainer}>
        <TouchableOpacity onPress={() => setShowActions(!showActions)}>
          <Icon name="plus" size={24} color={COLORS.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setShowEmojiPicker(true)}>
          <Icon name="emoticon-happy" size={24} color={COLORS.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setShowStickerPicker(true)}>
          <Icon name="sticker-emoji" size={24} color={COLORS.textSecondary} />
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          placeholderTextColor={COLORS.textSecondary}
          value={inputText}
          onChangeText={setInputText}
          multiline
        />

        {inputText.trim() ? (
          <TouchableOpacity style={styles.sendButton} onPress={() => sendMessage(inputText)}>
            <Icon name="send" size={24} color="#FFF" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.micButton, isRecording && styles.micButtonRecording]}
            onPressIn={startRecording}
            onPressOut={stopRecording}
          >
            <Icon name="microphone" size={24} color={isRecording ? '#FFF' : COLORS.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      {/* Emoji Picker Modal */}
      <Modal visible={showEmojiPicker} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <EmojiPicker
            onEmojiSelect={(emoji) => {
              setInputText(prev => prev + emoji);
              setShowEmojiPicker(false);
            }}
            onClose={() => setShowEmojiPicker(false)}
          />
        </View>
      </Modal>

      {/* Sticker Picker Modal */}
      <Modal visible={showStickerPicker} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <StickerPicker
            onStickerSelect={(sticker) => {
              sendMessage(sticker, 'sticker');
              setShowStickerPicker(false);
            }}
            onClose={() => setShowStickerPicker(false)}
          />
        </View>
      </Modal>

      {/* GIF Picker Modal */}
      <Modal visible={showGifPicker} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <GifPicker
            onGifSelect={(gif) => {
              sendMessage(gif, 'gif');
              setShowGifPicker(false);
            }}
            onClose={() => setShowGifPicker(false)}
          />
        </View>
      </Modal>

      {/* Actions Modal */}
      <Modal visible={showActions} transparent animationType="slide">
        <TouchableOpacity style={styles.modalOverlay} onPress={() => setShowActions(false)}>
          <View style={styles.actionsContent}>
            <TouchableOpacity style={styles.actionItem} onPress={pickImage}>
              <View style={[styles.actionIcon, { backgroundColor: COLORS.primary }]}>
                <Icon name="image" size={24} color="#FFF" />
              </View>
              <Text style={styles.actionText}>Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionItem} onPress={pickDocument}>
              <View style={[styles.actionIcon, { backgroundColor: COLORS.success }]}>
                <Icon name="file" size={24} color="#FFF" />
              </View>
              <Text style={styles.actionText}>Document</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionItem} onPress={() => {
              setShowActions(false);
              setShowGifPicker(true);
            }}>
              <View style={[styles.actionIcon, { backgroundColor: COLORS.warning }]}>
                <Icon name="gif" size={24} color="#FFF" />
              </View>
              <Text style={styles.actionText}>GIF</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionItem} onPress={() => {
              setShowActions(false);
              // Open camera
            }}>
              <View style={[styles.actionIcon, { backgroundColor: COLORS.accent }]}>
                <Icon name="camera" size={24} color="#FFF" />
              </View>
              <Text style={styles.actionText}>Camera</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
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
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  replyBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(88, 101, 242, 0.1)',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderGlass,
  },
  replyBarContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  replyBarLine: {
    width: 3,
    height: 30,
    backgroundColor: COLORS.primary,
    borderRadius: 2,
    marginRight: 8,
  },
  replyBarInfo: {
    flex: 1,
  },
  replyBarSender: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '500',
  },
  replyBarText: {
    color: COLORS.textSecondary,
    fontSize: 12,
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
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  micButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  micButtonRecording: {
    backgroundColor: COLORS.error,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  actionsContent: {
    flexDirection: 'row',
    backgroundColor: COLORS.bgSecondary,
    padding: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    justifyContent: 'space-around',
  },
  actionItem: {
    alignItems: 'center',
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  actionText: {
    color: COLORS.textSecondary,
    fontSize: 11,
  },
});

export default ChatView;
