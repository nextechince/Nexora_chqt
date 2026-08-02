import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS } from '../styles/colors';

// Mock GIF data (in production, use Tenor/Giphy API)
const MOCK_GIFS = [
  'https://media.giphy.com/media/3o7abldj0b3rxrZUxW/giphy.gif',
  'https://media.giphy.com/media/3o7abldj0b3rxrZUxW/giphy.gif',
  'https://media.giphy.com/media/3o7abldj0b3rxrZUxW/giphy.gif',
  'https://media.giphy.com/media/3o7abldj0b3rxrZUxW/giphy.gif',
  'https://media.giphy.com/media/3o7abldj0b3rxrZUxW/giphy.gif',
  'https://media.giphy.com/media/3o7abldj0b3rxrZUxW/giphy.gif',
];

const GifPicker = ({ onGifSelect, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [gifs, setGifs] = useState(MOCK_GIFS);

  const searchGifs = async () => {
    if (!searchQuery.trim()) {
      setGifs(MOCK_GIFS);
      return;
    }

    setLoading(true);
    try {
      // In production, call Tenor/Giphy API
      // For demo, use mock data
      setTimeout(() => {
        setGifs(MOCK_GIFS);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.log('Error searching GIFs:', error);
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>GIFs</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Icon name="close" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Icon name="magnify" size={20} color={COLORS.textSecondary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search GIFs..."
          placeholderTextColor={COLORS.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={searchGifs}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => {
            setSearchQuery('');
            setGifs(MOCK_GIFS);
          }}>
            <Icon name="close" size={20} color={COLORS.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <ScrollView style={styles.gifsContainer}>
          <View style={styles.gifsGrid}>
            {gifs.map((gif, index) => (
              <TouchableOpacity
                key={index}
                style={styles.gifButton}
                onPress={() => onGifSelect(gif)}
              >
                <Image source={{ uri: gif }} style={styles.gif} />
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.bgSecondary,
    borderRadius: 16,
    padding: 16,
    maxHeight: 400,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  closeButton: {
    padding: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    height: 36,
    color: COLORS.textPrimary,
    fontSize: 14,
    marginLeft: 8,
  },
  loadingContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gifsContainer: {
    maxHeight: 250,
  },
  gifsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingBottom: 8,
  },
  gifButton: {
    width: '33.33%',
    aspectRatio: 1,
    padding: 2,
  },
  gif: {
    width: '100%',
    height: '100%',
    borderRadius: 4,
    resizeMode: 'cover',
  },
});

export default GifPicker;
