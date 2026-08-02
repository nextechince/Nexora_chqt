import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  RefreshControl,
  Modal
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS } from '../styles/colors';
import { db } from '../services/LocalDB';
import ChatItem from '../components/ChatItem';
import Toast from 'react-native-toast-message';

const Chats = ({ navigation }) => {
  const [chats, setChats] = useState([]);
  const [filteredChats, setFilteredChats] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [showArchived, setShowArchived] = useState(false);
  const [userId, setUserId] = useState('admin_001');

  useEffect(() => {
    loadChats();
  }, []);

  const loadChats = async () => {
    try {
      const userData = await db.getUserById(userId);
      if (userData) {
        const chatList = await db.getUserChats(userId);
        setChats(chatList);
        setFilteredChats(chatList);
      }
    } catch (error) {
      console.log('Error loading chats:', error);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim()) {
      const filtered = chats.filter(chat =>
        chat.name.toLowerCase().includes(query.toLowerCase()) ||
        (chat.lastMessage && chat.lastMessage.toLowerCase().includes(query.toLowerCase()))
      );
      setFilteredChats(filtered);
    } else {
      setFilteredChats(chats);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadChats();
    setRefreshing(false);
  };

  const handleChatPress = (chat) => {
    if (chat.isGroup) {
      navigation.navigate('GroupView', { groupId: chat.id, groupName: chat.name });
    } else {
      navigation.navigate('ChatView', { chatId: chat.id, chatName: chat.name });
    }
  };

  const handleArchiveChat = async (chat) => {
    try {
      const userData = await db.loadUserSession(userId);
      if (userData) {
        const chatIndex = userData.chats.findIndex(c => c.id === chat.id);
        if (chatIndex !== -1) {
          userData.chats[chatIndex].archived = !userData.chats[chatIndex].archived;
          await db.saveUserSession(userId, userData);
          await loadChats();
          Toast.show({
            type: 'success',
            text1: 'Chat Archived',
            text2: chat.archived ? 'Chat unarchived' : 'Chat archived'
          });
        }
      }
    } catch (error) {
      console.log('Error archiving chat:', error);
    }
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Icon name="chat-outline" size={60} color={COLORS.textSecondary} />
      <Text style={styles.emptyTitle}>No Chats Yet</Text>
      <Text style={styles.emptySubtitle}>Start a new conversation</Text>
      <TouchableOpacity
        style={styles.startChatButton}
        onPress={() => navigation.navigate('Profile')}
      >
        <Text style={styles.startChatButtonText}>Find People</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Chats</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={() => setShowArchived(!showArchived)}>
            <Icon name="archive" size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('SavedMessages')}>
            <Icon name="bookmark-outline" size={24} color={COLORS.textPrimary} style={styles.headerIcon} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <Icon name="magnify" size={20} color={COLORS.textSecondary} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search chats..."
          placeholderTextColor={COLORS.textSecondary}
          value={searchQuery}
          onChangeText={handleSearch}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => handleSearch('')}>
            <Icon name="close" size={20} color={COLORS.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={filteredChats.filter(chat => showArchived ? chat.archived : !chat.archived)}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ChatItem
            chat={item}
            onPress={() => handleChatPress(item)}
            onLongPress={() => handleArchiveChat(item)}
          />
        )}
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />
        }
        contentContainerStyle={styles.listContent}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('CreateGroup')}
      >
        <Icon name="plus" size={28} color="#FFF" />
      </TouchableOpacity>
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
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    marginLeft: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.bgSecondary,
    borderRadius: 10,
    marginHorizontal: 16,
    paddingHorizontal: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.borderGlass,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: COLORS.textPrimary,
    fontSize: 15,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 80,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
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
  startChatButton: {
    marginTop: 20,
    paddingHorizontal: 24,
    paddingVertical: 10,
    backgroundColor: COLORS.primary,
    borderRadius: 20,
  },
  startChatButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});

export default Chats;
