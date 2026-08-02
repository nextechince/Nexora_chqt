import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS } from '../styles/colors';
import { db } from '../services/LocalDB';
import moment from 'moment';

const SavedMessages = ({ navigation }) => {
  const [savedMessages, setSavedMessages] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [userId, setUserId] = useState('admin_001');

  useEffect(() => {
    loadSavedMessages();
  }, []);

  const loadSavedMessages = async () => {
    try {
      const saved = await db.getSavedMessages(userId);
      setSavedMessages(saved || []);
    } catch (error) {
      console.log('Error loading saved messages:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadSavedMessages();
    setRefreshing(false);
  };

  const deleteSaved = (id) => {
    Alert.alert(
      'Delete Saved Message',
      'Are you sure you want to delete this saved message?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await db.deleteSavedMessage(id);
            await loadSavedMessages();
          }
        }
      ]
    );
  };

  const renderSavedItem = ({ item }) => (
    <TouchableOpacity
      style={styles.savedItem}
      onPress={() => {
        if (item.message?.chatId) {
          navigation.navigate('ChatView', { chatId: item.message.chatId });
        }
      }}
    >
      <View style={styles.savedContent}>
        <Text style={styles.savedMessage}>{item.message?.text || 'Message'}</Text>
        <Text style={styles.savedTime}>
          Saved {moment(item.savedAt).fromNow()}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => deleteSaved(item.id)}
      >
        <Icon name="delete" size={20} color={COLORS.error} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Saved Messages</Text>
        {savedMessages.length > 0 && (
          <TouchableOpacity
            onPress={() => {
              Alert.alert(
                'Clear All',
                'Are you sure you want to clear all saved messages?',
                [
                  { text: 'Cancel', style: 'cancel' },
                  {
                    text: 'Clear All',
                    style: 'destructive',
                    onPress: async () => {
                      for (const msg of savedMessages) {
                        await db.deleteSavedMessage(msg.id);
                      }
                      await loadSavedMessages();
                    }
                  }
                ]
              );
            }}
          >
            <Text style={styles.clearAll}>Clear All</Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={savedMessages}
        keyExtractor={(item) => item.id}
        renderItem={renderSavedItem}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />
        }
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Icon name="bookmark-outline" size={60} color={COLORS.textSecondary} />
            <Text style={styles.emptyTitle}>No Saved Messages</Text>
            <Text style={styles.emptySubtitle}>
              Save messages to read them later
            </Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgPrimary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  clearAll: {
    fontSize: 14,
    color: COLORS.error,
    fontWeight: '500',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 80,
  },
  savedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderGlass,
  },
  savedContent: {
    flex: 1,
  },
  savedMessage: {
    fontSize: 15,
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  savedTime: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  deleteButton: {
    padding: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 8,
  },
});

export default SavedMessages;
