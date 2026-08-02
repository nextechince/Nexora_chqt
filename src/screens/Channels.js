import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  TextInput,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS } from '../styles/colors';
import { db } from '../services/LocalDB';
import ChannelItem from '../components/ChannelItem';
import Toast from 'react-native-toast-message';

const Channels = ({ navigation }) => {
  const [channels, setChannels] = useState([]);
  const [filteredChannels, setFilteredChannels] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newChannelName, setNewChannelName] = useState('');
  const [newChannelDesc, setNewChannelDesc] = useState('');
  const [newChannelPrivacy, setNewChannelPrivacy] = useState(false);
  const [newChannelCategory, setNewChannelCategory] = useState('General');
  const [userId, setUserId] = useState('admin_001');

  const categories = ['General', 'Technology', 'Gaming', 'Music', 'Art', 'Sports', 'News', 'Education'];

  useEffect(() => {
    loadChannels();
  }, []);

  const loadChannels = async () => {
    try {
      const channelList = await db.getUserChannels(userId);
      setChannels(channelList);
      setFilteredChannels(channelList);
    } catch (error) {
      console.log('Error loading channels:', error);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim()) {
      const filtered = channels.filter(channel =>
        channel.name.toLowerCase().includes(query.toLowerCase()) ||
        (channel.description && channel.description.toLowerCase().includes(query.toLowerCase())) ||
        (channel.category && channel.category.toLowerCase().includes(query.toLowerCase()))
      );
      setFilteredChannels(filtered);
    } else {
      setFilteredChannels(channels);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadChannels();
    setRefreshing(false);
  };

  const handleCreateChannel = async () => {
    if (!newChannelName.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please enter a channel name'
      });
      return;
    }

    try {
      const channel = await db.createUserChannel(
        userId,
        newChannelName.trim(),
        newChannelDesc.trim(),
        newChannelPrivacy,
        newChannelCategory
      );

      if (channel) {
        await loadChannels();
        setShowCreateModal(false);
        setNewChannelName('');
        setNewChannelDesc('');
        Toast.show({
          type: 'success',
          text1: 'Channel Created! 🎉',
          text2: `${newChannelName} has been created`
        });
      }
    } catch (error) {
      console.log('Error creating channel:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to create channel'
      });
    }
  };

  const handleSubscribe = async (channel) => {
    try {
      if (channel.subscribed) {
        await db.unsubscribeChannel(channel.id, userId);
        Toast.show({
          type: 'success',
          text1: 'Unsubscribed',
          text2: `You left ${channel.name}`
        });
      } else {
        await db.subscribeChannel(channel.id, userId);
        Toast.show({
          type: 'success',
          text1: 'Subscribed',
          text2: `You joined ${channel.name}`
        });
      }
      await loadChannels();
    } catch (error) {
      console.log('Error subscribing:', error);
    }
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Icon name="broadcast-outline" size={60} color={COLORS.textSecondary} />
      <Text style={styles.emptyTitle}>No Channels</Text>
      <Text style={styles.emptySubtitle}>Create or subscribe to channels</Text>
      <TouchableOpacity
        style={styles.createButton}
        onPress={() => setShowCreateModal(true)}
      >
        <Text style={styles.createButtonText}>Create Channel</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Channels</Text>
        <TouchableOpacity onPress={() => setShowCreateModal(true)}>
          <Icon name="plus" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Icon name="magnify" size={20} color={COLORS.textSecondary} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search channels..."
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
        data={filteredChannels}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ChannelItem
            channel={{
              ...item,
              subscribed: item.subscribers?.includes(userId) || false,
            }}
            onPress={() => navigation.navigate('ChannelView', { channelId: item.id })}
            onLongPress={() => handleSubscribe(item)}
          />
        )}
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />
        }
        contentContainerStyle={styles.listContent}
      />

      {/* Create Channel Modal */}
      <Modal visible={showCreateModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Create Channel</Text>
              <TouchableOpacity onPress={() => setShowCreateModal(false)}>
                <Icon name="close" size={24} color={COLORS.textPrimary} />
              </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Channel Name *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter channel name"
                placeholderTextColor={COLORS.textSecondary}
                value={newChannelName}
                onChangeText={setNewChannelName}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Enter channel description"
                placeholderTextColor={COLORS.textSecondary}
                value={newChannelDesc}
                onChangeText={setNewChannelDesc}
                multiline
                numberOfLines={3}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Category</Text>
              <View style={styles.categoryContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {categories.map((cat) => (
                    <TouchableOpacity
                      key={cat}
                      style={[
                        styles.categoryButton,
                        newChannelCategory === cat && styles.categoryButtonActive,
                      ]}
                      onPress={() => setNewChannelCategory(cat)}
                    >
                      <Text style={[
                        styles.categoryText,
                        newChannelCategory === cat && styles.categoryTextActive,
                      ]}>
                        {cat}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>

            <TouchableOpacity
              style={styles.privacyToggle}
              onPress={() => setNewChannelPrivacy(!newChannelPrivacy)}
            >
              <View style={styles.privacyToggleLeft}>
                <Icon
                  name={newChannelPrivacy ? 'lock' : 'lock-open'}
                  size={20}
                  color={newChannelPrivacy ? COLORS.primary : COLORS.textSecondary}
                />
                <Text style={styles.privacyToggleText}>
                  {newChannelPrivacy ? 'Private Channel' : 'Public Channel'}
                </Text>
              </View>
              <View style={[styles.toggleSwitch, newChannelPrivacy && styles.toggleSwitchActive]}>
                <View style={[styles.toggleKnob, newChannelPrivacy && styles.toggleKnobActive]} />
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.createChannelButton} onPress={handleCreateChannel}>
              <Text style={styles.createChannelButtonText}>Create Channel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  createButton: {
    marginTop: 20,
    paddingHorizontal: 24,
    paddingVertical: 10,
    backgroundColor: COLORS.primary,
    borderRadius: 20,
  },
  createButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
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
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 6,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 12,
    color: COLORS.textPrimary,
    fontSize: 15,
    borderWidth: 1,
    borderColor: COLORS.borderGlass,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  categoryContainer: {
    flexDirection: 'row',
    paddingVertical: 4,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.05)',
    marginRight: 8,
  },
  categoryButtonActive: {
    backgroundColor: COLORS.primary,
  },
  categoryText: {
    color: COLORS.textSecondary,
    fontSize: 13,
  },
  categoryTextActive: {
    color: '#FFF',
  },
  privacyToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderGlass,
    marginBottom: 16,
  },
  privacyToggleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  privacyToggleText: {
    color: COLORS.textPrimary,
    fontSize: 15,
    marginLeft: 8,
  },
  toggleSwitch: {
    width: 44,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.bgPrimary,
    padding: 2,
  },
  toggleSwitchActive: {
    backgroundColor: COLORS.primary,
  },
  toggleKnob: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.textSecondary,
  },
  toggleKnobActive: {
    backgroundColor: '#FFF',
    transform: [{ translateX: 20 }],
  },
  createChannelButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  createChannelButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Channels;
