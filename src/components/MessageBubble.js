import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
  ScrollView
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS } from '../styles/colors';
import moment from 'moment';

const MessageBubble = ({
  message,
  isMe,
  onReaction,
  onReply,
  onPin,
  onDelete,
  onEdit,
  onForward,
  onLongPress,
  showTime = true,
}) => {
  const [showOptions, setShowOptions] = useState(false);
  const [showReactions, setShowReactions] = useState(false);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'sent':
        return 'check';
      case 'delivered':
        return 'check-all';
      case 'read':
        return 'check-all';
      default:
        return 'check';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'read':
        return COLORS.primary;
      default:
        return COLORS.textSecondary;
    }
  };

  const renderMessageContent = () => {
    switch (message.type) {
      case 'image':
        return (
          <TouchableOpacity onPress={() => {}}>
            <Image source={{ uri: message.uri }} style={styles.messageImage} />
          </TouchableOpacity>
        );
      case 'file':
        return (
          <View style={styles.fileContainer}>
            <Icon name="file-document" size={24} color={COLORS.primary} />
            <View style={styles.fileInfo}>
              <Text style={styles.fileName}>{message.fileName}</Text>
              <Text style={styles.fileSize}>{message.fileSize} KB</Text>
            </View>
          </View>
        );
      case 'voice':
        return (
          <View style={styles.voiceContainer}>
            <Icon name="microphone" size={20} color={COLORS.primary} />
            <View style={styles.voiceWave}>
              <View style={styles.waveBar} />
              <View style={[styles.waveBar, styles.waveBar2]} />
              <View style={[styles.waveBar, styles.waveBar3]} />
              <View style={[styles.waveBar, styles.waveBar4]} />
            </View>
            <Text style={styles.voiceDuration}>0:30</Text>
          </View>
        );
      case 'video':
        return (
          <TouchableOpacity style={styles.videoContainer}>
            <Image source={{ uri: message.thumbnail }} style={styles.videoThumbnail} />
            <View style={styles.videoPlayButton}>
              <Icon name="play" size={30} color="#FFF" />
            </View>
            <Text style={styles.videoDuration}>{message.duration}</Text>
          </TouchableOpacity>
        );
      case 'sticker':
        return (
          <Image source={{ uri: message.uri }} style={styles.sticker} />
        );
      case 'gif':
        return (
          <Image source={{ uri: message.uri }} style={styles.gif} />
        );
      case 'contact':
        return (
          <View style={styles.contactContainer}>
            <Icon name="account-circle" size={40} color={COLORS.primary} />
            <View style={styles.contactInfo}>
              <Text style={styles.contactName}>{message.contactName}</Text>
              <Text style={styles.contactPhone}>{message.contactPhone}</Text>
            </View>
          </View>
        );
      case 'location':
        return (
          <View style={styles.locationContainer}>
            <Icon name="map-marker" size={24} color={COLORS.primary} />
            <Text style={styles.locationText}>{message.location}</Text>
          </View>
        );
      default:
        return (
          <Text style={styles.messageText}>{message.text}</Text>
        );
    }
  };

  const renderReactions = () => {
    if (!message.reactions || Object.keys(message.reactions).length === 0) {
      return null;
    }

    return (
      <View style={styles.reactionsContainer}>
        {Object.entries(message.reactions).map(([emoji, count]) => (
          <View key={emoji} style={styles.reaction}>
            <Text style={styles.reactionEmoji}>{emoji}</Text>
            {count > 1 && <Text style={styles.reactionCount}>{count}</Text>}
          </View>
        ))}
      </View>
    );
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        isMe ? styles.containerRight : styles.containerLeft,
        message.deleted && styles.deletedContainer
      ]}
      onLongPress={() => {
        setShowOptions(true);
        if (onLongPress) onLongPress(message);
      }}
      activeOpacity={0.7}
    >
      {message.repliedTo && (
        <View style={styles.replyContainer}>
          <View style={styles.replyLine} />
          <View style={styles.replyContent}>
            <Text style={styles.replySender}>
              {message.repliedTo.senderName || 'User'}
            </Text>
            <Text style={styles.replyText} numberOfLines={2}>
              {message.repliedTo.text}
            </Text>
          </View>
        </View>
      )}

      <View style={[
        styles.bubble,
        isMe ? styles.bubbleRight : styles.bubbleLeft,
        message.deleted && styles.deletedBubble
      ]}>
        {message.deleted ? (
          <Text style={styles.deletedText}>This message was deleted</Text>
        ) : (
          <>
            {message.senderName && !isMe && (
              <Text style={styles.senderName}>{message.senderName}</Text>
            )}
            {renderMessageContent()}
            {renderReactions()}
          </>
        )}
      </View>

      {!message.deleted && (
        <View style={[
          styles.footer,
          isMe ? styles.footerRight : styles.footerLeft
        ]}>
          {showTime && (
            <Text style={styles.time}>
              {moment(message.timestamp).format('HH:mm')}
            </Text>
          )}
          {isMe && message.status && (
            <Icon
              name={getStatusIcon(message.status)}
              size={14}
              color={getStatusColor(message.status)}
              style={styles.statusIcon}
            />
          )}
        </View>
      )}

      {/* Options Modal */}
      <Modal
        visible={showOptions}
        transparent
        animationType="fade"
        onRequestClose={() => setShowOptions(false)}
      >
        <TouchableOpacity
          style={styles.optionsOverlay}
          activeOpacity={1}
          onPress={() => setShowOptions(false)}
        >
          <View style={styles.optionsContainer}>
            <ScrollView>
              <TouchableOpacity
                style={styles.optionItem}
                onPress={() => {
                  setShowOptions(false);
                  if (onReply) onReply(message);
                }}
              >
                <Icon name="reply" size={20} color={COLORS.textPrimary} />
                <Text style={styles.optionText}>Reply</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.optionItem}
                onPress={() => {
                  setShowOptions(false);
                  setShowReactions(true);
                }}
              >
                <Icon name="emoticon-happy" size={20} color={COLORS.textPrimary} />
                <Text style={styles.optionText}>React</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.optionItem}
                onPress={() => {
                  setShowOptions(false);
                  if (onForward) onForward(message);
                }}
              >
                <Icon name="share" size={20} color={COLORS.textPrimary} />
                <Text style={styles.optionText}>Forward</Text>
              </TouchableOpacity>

              {isMe && (
                <>
                  <TouchableOpacity
                    style={styles.optionItem}
                    onPress={() => {
                      setShowOptions(false);
                      if (onEdit) onEdit(message);
                    }}
                  >
                    <Icon name="pencil" size={20} color={COLORS.textPrimary} />
                    <Text style={styles.optionText}>Edit</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.optionItem}
                    onPress={() => {
                      setShowOptions(false);
                      if (onPin) onPin(message);
                    }}
                  >
                    <Icon name="pin" size={20} color={COLORS.textPrimary} />
                    <Text style={styles.optionText}>
                      {message.pinned ? 'Unpin' : 'Pin'}
                    </Text>
                  </TouchableOpacity>
                </>
              )}

              <TouchableOpacity
                style={[styles.optionItem, styles.optionItemDanger]}
                onPress={() => {
                  setShowOptions(false);
                  if (onDelete) onDelete(message);
                }}
              >
                <Icon name="delete" size={20} color={COLORS.error} />
                <Text style={[styles.optionText, styles.optionTextDanger]}>
                  Delete
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Reaction Picker Modal */}
      <Modal
        visible={showReactions}
        transparent
        animationType="fade"
        onRequestClose={() => setShowReactions(false)}
      >
        <TouchableOpacity
          style={styles.optionsOverlay}
          activeOpacity={1}
          onPress={() => setShowReactions(false)}
        >
          <View style={styles.reactionsPicker}>
            {['❤️', '😂', '😮', '😢', '🔥', '👍', '👎', '🎉', '💯', '👏'].map((emoji) => (
              <TouchableOpacity
                key={emoji}
                style={styles.reactionOption}
                onPress={() => {
                  setShowReactions(false);
                  if (onReaction) onReaction(message, emoji);
                }}
              >
                <Text style={styles.reactionOptionEmoji}>{emoji}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
    paddingHorizontal: 8,
  },
  containerRight: {
    alignItems: 'flex-end',
  },
  containerLeft: {
    alignItems: 'flex-start',
  },
  bubble: {
    maxWidth: '80%',
    padding: 10,
    borderRadius: 16,
  },
  bubbleRight: {
    backgroundColor: COLORS.primary,
    borderBottomRightRadius: 4,
  },
  bubbleLeft: {
    backgroundColor: COLORS.bgSecondary,
    borderBottomLeftRadius: 4,
  },
  deletedContainer: {
    opacity: 0.6,
  },
  deletedBubble: {
    backgroundColor: COLORS.bgSecondary,
  },
  deletedText: {
    color: COLORS.textSecondary,
    fontStyle: 'italic',
    fontSize: 14,
  },
  senderName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 4,
  },
  messageText: {
    color: COLORS.textPrimary,
    fontSize: 15,
    lineHeight: 20,
  },
  messageImage: {
    width: 200,
    height: 150,
    borderRadius: 8,
  },
  fileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 8,
  },
  fileInfo: {
    marginLeft: 12,
  },
  fileName: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: '500',
  },
  fileSize: {
    color: COLORS.textSecondary,
    fontSize: 12,
  },
  voiceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    minWidth: 120,
  },
  voiceWave: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 12,
    height: 30,
  },
  waveBar: {
    width: 3,
    height: 10,
    backgroundColor: COLORS.primary,
    marginHorizontal: 1,
    borderRadius: 2,
  },
  waveBar2: { height: 16 },
  waveBar3: { height: 22 },
  waveBar4: { height: 14 },
  voiceDuration: {
    color: COLORS.textSecondary,
    fontSize: 12,
  },
  videoContainer: {
    position: 'relative',
  },
  videoThumbnail: {
    width: 200,
    height: 120,
    borderRadius: 8,
  },
  videoPlayButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -25 }, { translateY: -25 }],
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoDuration: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    color: '#FFF',
    fontSize: 12,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  sticker: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  gif: {
    width: 150,
    height: 100,
    borderRadius: 8,
  },
  contactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  contactInfo: {
    marginLeft: 12,
  },
  contactName: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: '500',
  },
  contactPhone: {
    color: COLORS.textSecondary,
    fontSize: 12,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  locationText: {
    color: COLORS.textPrimary,
    fontSize: 14,
    marginLeft: 8,
  },
  replyContainer: {
    flexDirection: 'row',
    marginBottom: 4,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 8,
    padding: 6,
  },
  replyLine: {
    width: 3,
    backgroundColor: COLORS.primary,
    borderRadius: 2,
    marginRight: 8,
  },
  replyContent: {
    flex: 1,
  },
  replySender: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '500',
  },
  replyText: {
    color: COLORS.textSecondary,
    fontSize: 12,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  footerRight: {
    justifyContent: 'flex-end',
  },
  footerLeft: {
    justifyContent: 'flex-start',
  },
  time: {
    fontSize: 10,
    color: COLORS.textSecondary,
  },
  statusIcon: {
    marginLeft: 4,
  },
  reactionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
  },
  reaction: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginRight: 4,
  },
  reactionEmoji: {
    fontSize: 14,
  },
  reactionCount: {
    color: COLORS.textSecondary,
    fontSize: 10,
    marginLeft: 2,
  },
  optionsOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionsContainer: {
    backgroundColor: COLORS.bgSecondary,
    borderRadius: 16,
    padding: 8,
    minWidth: 200,
    maxWidth: 280,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  optionItemDanger: {
    borderTopWidth: 1,
    borderTopColor: COLORS.borderGlass,
  },
  optionText: {
    color: COLORS.textPrimary,
    fontSize: 15,
    marginLeft: 12,
  },
  optionTextDanger: {
    color: COLORS.error,
  },
  reactionsPicker: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: COLORS.bgSecondary,
    borderRadius: 16,
    padding: 12,
    maxWidth: 300,
    justifyContent: 'center',
  },
  reactionOption: {
    padding: 8,
    margin: 4,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 30,
  },
  reactionOptionEmoji: {
    fontSize: 28,
  },
});

export default MessageBubble;
