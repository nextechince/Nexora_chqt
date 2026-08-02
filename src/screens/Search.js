import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS } from '../styles/colors';
import { db } from '../services/LocalDB';

const Search = ({ navigation }) => {
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [results, setResults] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [allGroups, setAllGroups] = useState([]);
  const [allChannels, setAllChannels] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);
  const [userId, setUserId] = useState('admin_001');

  const tabs = [
    { id: 'all', label: 'All', icon: 'magnify' },
    { id: 'people', label: 'People', icon: 'account' },
    { id: 'messages', label: 'Messages', icon: 'message' },
    { id: 'groups', label: 'Groups', icon: 'account-group' },
    { id: 'channels', label: 'Channels', icon: 'broadcast' },
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const users = await db.getAllUsers();
      setAllUsers(users);
      const groups = await db.getUserGroups(userId);
      setAllGroups(groups);
      const channels = await db.getUserChannels(userId);
      setAllChannels(channels);
    } catch (error) {
      console.log('Error loading data:', error);
    }
  };

  const handleSearch = (text) => {
    setQuery(text);
    if (text.trim().length === 0) {
      setResults([]);
      return;
    }

    const searchTerm = text.toLowerCase().trim();
    let searchResults = [];

    // Search users
    const users = allUsers.filter(u => 
      u.displayName?.toLowerCase().includes(searchTerm) ||
      u.username?.toLowerCase().includes(searchTerm) ||
      u.email?.toLowerCase().includes(searchTerm)
    );

    // Search groups
    const groups = allGroups.filter(g =>
      g.name?.toLowerCase().includes(searchTerm) ||
      g.description?.toLowerCase().includes(searchTerm)
    );

    // Search channels
    const channels = allChannels.filter(c =>
      c.name?.toLowerCase().includes(searchTerm) ||
      c.description?.toLowerCase().includes(searchTerm) ||
      c.category?.toLowerCase().includes(searchTerm)
    );

    // Combine results based on active tab
    switch (activeTab) {
      case 'people':
        searchResults = users.map(u => ({ ...u, type: 'user' }));
        break;
      case 'groups':
        searchResults = groups.map(g => ({ ...g, type: 'group' }));
        break;
      case 'channels':
        searchResults = channels.map(c => ({ ...c, type: 'channel' }));
        break;
      case 'messages':
        searchResults = [];
        break;
      default:
        searchResults = [
          ...users.map(u => ({ ...u, type: 'user' })),
          ...groups.map(g => ({ ...g, type: 'group' })),
          ...channels.map(c => ({ ...c, type: 'channel' })),
        ];
    }

    setResults(searchResults);

    // Add to history
    if (text.trim()) {
      setSearchHistory(prev => {
        const filtered = prev.filter(h => h !== text);
        return [text, ...filtered].slice(0, 10);
      });
    }
  };

  const renderResultItem = ({ item }) => {
    const getIcon = () => {
      switch (item.type) {
        case 'user': return 'account-circle';
        case 'group': return 'account-group';
        case 'channel': return 'broadcast';
        default: return 'account-circle';
      }
    };

    const getColor = () => {
      switch (item.type) {
        case 'user': return COLORS.primary;
        case 'group': return COLORS.success;
        case 'channel': return COLORS.accent;
        default: return COLORS.textSecondary;
      }
    };

    return (
      <TouchableOpacity
        style={styles.resultItem}
        onPress={() => {
          if (item.type === 'user') {
            navigation.navigate('Profile', { userId: item.id });
          } else if (item.type === 'group') {
            navigation.navigate('GroupView', { groupId: item.id });
          } else if (item.type === 'channel') {
            navigation.navigate('ChannelView', { channelId: item.id });
          }
        }}
      >
        <View style={[styles.resultIcon, { backgroundColor: getColor() + '20' }]}>
          <Icon name={getIcon()} size={20} color={getColor()} />
        </View>
        <View style={styles.resultInfo}>
          <Text style={styles.resultTitle}>{item.displayName || item.name}</Text>
          <Text style={styles.resultSubtitle}>
            {item.type === 'user' ? `@${item.username}` : 
             item.type === 'group' ? `${item.members?.length || 0} members` :
             item.type === 'channel' ? `${item.subscribers?.length || 0} subscribers` : ''}
          </Text>
        </View>
        <Icon name="chevron-right" size={20} color={COLORS.textSecondary} />
      </TouchableOpacity>
    );
  };

  const renderHistory = () => (
    <View style={styles.historyContainer}>
      <View style={styles.historyHeader}>
        <Text style={styles.historyTitle}>Recent Searches</Text>
        <TouchableOpacity onPress={() => setSearchHistory([])}>
          <Text style={styles.historyClear}>Clear All</Text>
        </TouchableOpacity>
      </View>
      {searchHistory.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={styles.historyItem}
          onPress={() => handleSearch(item)}
        >
          <Icon name="clock" size={16} color={COLORS.textSecondary} />
          <Text style={styles.historyText}>{item}</Text>
          <TouchableOpacity onPress={() => {
            setSearchHistory(prev => prev.filter(h => h !== item));
          }}>
            <Icon name="close" size={16} color={COLORS.textSecondary} />
          </TouchableOpacity>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <View style={styles.searchBox}>
          <Icon name="magnify" size={20} color={COLORS.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search..."
            placeholderTextColor={COLORS.textSecondary}
            value={query}
            onChangeText={handleSearch}
            autoFocus
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => handleSearch('')}>
              <Icon name="close" size={20} color={COLORS.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabs}
      >
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[
              styles.tab,
              activeTab === tab.id && styles.tabActive,
            ]}
            onPress={() => {
              setActiveTab(tab.id);
              if (query) handleSearch(query);
            }}
          >
            <Icon
              name={tab.icon}
              size={16}
              color={activeTab === tab.id ? '#FFF' : COLORS.textSecondary}
            />
            <Text style={[
              styles.tabLabel,
              activeTab === tab.id && styles.tabLabelActive,
            ]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {query.length === 0 ? (
        renderHistory()
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id || Math.random().toString()}
          renderItem={renderResultItem}
          contentContainerStyle={styles.resultsList}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <Icon name="file-search-outline" size={60} color={COLORS.textSecondary} />
              <Text style={styles.emptyTitle}>No Results Found</Text>
              <Text style={styles.emptySubtitle}>
                Try searching for people, groups, or channels
              </Text>
            </View>
          )}
        />
      )}
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
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    backgroundColor: COLORS.bgSecondary,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderGlass,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.bgPrimary,
    borderRadius: 10,
    paddingHorizontal: 12,
    marginLeft: 12,
    height: 40,
    borderWidth: 1,
    borderColor: COLORS.borderGlass,
  },
  searchInput: {
    flex: 1,
    color: COLORS.textPrimary,
    fontSize: 15,
    marginLeft: 8,
  },
  tabs: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.bgSecondary,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderGlass,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  tabActive: {
    backgroundColor: COLORS.primary,
  },
  tabLabel: {
    color: COLORS.textSecondary,
    fontSize: 13,
    marginLeft: 6,
  },
  tabLabelActive: {
    color: '#FFF',
  },
  resultsList: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 80,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderGlass,
  },
  resultIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  resultInfo: {
    flex: 1,
  },
  resultTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: COLORS.textPrimary,
  },
  resultSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  historyContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  historyTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  historyClear: {
    fontSize: 14,
    color: COLORS.primary,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderGlass,
  },
  historyText: {
    flex: 1,
    color: COLORS.textPrimary,
    fontSize: 14,
    marginLeft: 12,
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

export default Search;
