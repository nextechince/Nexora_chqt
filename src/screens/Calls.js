import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS } from '../styles/colors';
import { db } from '../services/LocalDB';
import moment from 'moment';

const Calls = ({ navigation }) => {
  const [calls, setCalls] = useState([]);
  const [filteredCalls, setFilteredCalls] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [userId, setUserId] = useState('admin_001');

  useEffect(() => {
    loadCalls();
  }, []);

  const loadCalls = async () => {
    try {
      const callList = await db.getCalls(userId);
      setCalls(callList);
      setFilteredCalls(callList);
    } catch (error) {
      console.log('Error loading calls:', error);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim()) {
      const filtered = calls.filter(call =>
        call.name?.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredCalls(filtered);
    } else {
      setFilteredCalls(calls);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadCalls();
    setRefreshing(false);
  };

  const handleCallPress = (call) => {
    navigation.navigate('CallView', { callId: call.id });
  };

  const startCall = (type = 'voice') => {
    navigation.navigate('CallView', { type, isNew: true });
  };

  const getCallIcon = (type) => {
    switch (type) {
      case 'voice':
        return 'phone';
      case 'video':
        return 'video';
      case 'missed':
        return 'phone-missed';
      default:
        return 'phone';
    }
  };

  const getCallColor = (type) => {
    switch (type) {
      case 'missed':
        return COLORS.error;
      case 'incoming':
        return COLORS.success;
      default:
        return COLORS.textPrimary;
    }
  };

  const renderCallItem = ({ item }) => (
    <TouchableOpacity
      style={styles.callItem}
      onPress={() => handleCallPress(item)}
    >
      <View style={styles.callAvatarContainer}>
        {item.avatar ? (
          <Image source={{ uri: item.avatar }} style={styles.callAvatar} />
        ) : (
          <View style={[styles.callAvatar, styles.callAvatarPlaceholder]}>
            <Text style={styles.callAvatarText}>
              {item.name?.charAt(0) || 'U'}
            </Text>
          </View>
        )}
      </View>
      <View style={styles.callInfo}>
        <Text style={styles.callName}>{item.name || 'Unknown'}</Text>
        <View style={styles.callDetails}>
          <Icon
            name={getCallIcon(item.type)}
            size={14}
            color={getCallColor(item.type)}
            style={styles.callTypeIcon}
          />
          <Text style={styles.callTime}>
            {item.timestamp ? moment(item.timestamp).fromNow() : 'Now'}
          </Text>
          {item.duration && (
            <Text style={styles.callDuration}>
              • {item.duration}s
            </Text>
          )}
        </View>
      </View>
      <TouchableOpacity
        style={styles.callAction}
        onPress={() => handleCallPress(item)}
      >
        <Icon name="phone" size={20} color={COLORS.success} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Icon name="phone-outline" size={60} color={COLORS.textSecondary} />
      <Text style={styles.emptyTitle}>No Calls</Text>
      <Text style={styles.emptySubtitle}>Your call history will appear here</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Calls</Text>
      </View>

      <View style={styles.searchContainer}>
        <Icon name="magnify" size={20} color={COLORS.textSecondary} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search calls..."
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

      <View style={styles.quickActions}>
        <TouchableOpacity
          style={[styles.quickAction, styles.voiceCall]}
          onPress={() => startCall('voice')}
        >
          <Icon name="phone" size={24} color="#FFF" />
          <Text style={styles.quickActionText}>Voice</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.quickAction, styles.videoCall]}
          onPress={() => startCall('video')}
        >
          <Icon name="video" size={24} color="#FFF" />
          <Text style={styles.quickActionText}>Video</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredCalls}
        keyExtractor={(item) => item.id || Math.random().toString()}
        renderItem={renderCallItem}
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />
        }
        contentContainerStyle={styles.listContent}
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
    marginBottom: 12,
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
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
    gap: 12,
  },
  quickAction: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  voiceCall: {
    backgroundColor: COLORS.success,
  },
  videoCall: {
    backgroundColor: COLORS.primary,
  },
  quickActionText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 80,
  },
  callItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderGlass,
  },
  callAvatarContainer: {
    marginRight: 12,
  },
  callAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  callAvatarPlaceholder: {
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  callAvatarText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  callInfo: {
    flex: 1,
  },
  callName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  callDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  callTypeIcon: {
    marginRight: 4,
  },
  callTime: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  callDuration: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginLeft: 4,
  },
  callAction: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
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
});

export default Calls;
