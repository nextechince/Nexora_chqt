import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS } from '../styles/colors';
import { db } from '../services/LocalDB';
import Toast from 'react-native-toast-message';

const CreateChannel = ({ navigation }) => {
  const [channelName, setChannelName] = useState('');
  const [description, setDescription] = useState('');
  const [channelPhoto, setChannelPhoto] = useState(null);
  const [isPrivate, setIsPrivate] = useState(false);
  const [category, setCategory] = useState('General');
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState('admin_001');

  const categories = ['General', 'Technology', 'Gaming', 'Music', 'Art', 'Sports', 'News', 'Education'];

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7
    });
    if (!result.canceled) {
      setChannelPhoto(result.assets[0].uri);
    }
  };

  const handleCreate = async () => {
    if (!channelName.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please enter a channel name'
      });
      return;
    }

    setLoading(true);
    try {
      const channel = await db.createUserChannel(
        userId,
        channelName.trim(),
        description.trim(),
        isPrivate,
        category
      );

      if (channel) {
        Toast.show({
          type: 'success',
          text1: 'Channel Created! 🎉',
          text2: `${channelName} has been created`
        });
        navigation.goBack();
      }
    } catch (error) {
      console.log('Error creating channel:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to create channel'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Channel</Text>
        <TouchableOpacity onPress={handleCreate} disabled={loading}>
          {loading ? (
            <ActivityIndicator size="small" color={COLORS.primary} />
          ) : (
            <Text style={styles.headerDone}>Create</Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <TouchableOpacity style={styles.photoContainer} onPress={pickImage}>
          {channelPhoto ? (
            <Image source={{ uri: channelPhoto }} style={styles.channelPhoto} />
          ) : (
            <View style={styles.photoPlaceholder}>
              <Icon name="camera" size={30} color={COLORS.textSecondary} />
              <Text style={styles.photoText}>Add Channel Photo</Text>
            </View>
          )}
        </TouchableOpacity>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Channel Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter channel name"
            placeholderTextColor={COLORS.textSecondary}
            value={channelName}
            onChangeText={setChannelName}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Enter channel description"
            placeholderTextColor={COLORS.textSecondary}
            value={description}
            onChangeText={setDescription}
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
                    category === cat && styles.categoryButtonActive,
                  ]}
                  onPress={() => setCategory(cat)}
                >
                  <Text style={[
                    styles.categoryText,
                    category === cat && styles.categoryTextActive,
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
          onPress={() => setIsPrivate(!isPrivate)}
        >
          <View style={styles.privacyToggleLeft}>
            <Icon
              name={isPrivate ? 'lock' : 'lock-open'}
              size={20}
              color={isPrivate ? COLORS.primary : COLORS.textSecondary}
            />
            <Text style={styles.privacyToggleText}>
              {isPrivate ? 'Private Channel' : 'Public Channel'}
            </Text>
          </View>
          <View style={[styles.toggleSwitch, isPrivate && styles.toggleSwitchActive]}>
            <View style={[styles.toggleKnob, isPrivate && styles.toggleKnobActive]} />
          </View>
        </TouchableOpacity>

        <View style={styles.infoBox}>
          <Icon name="information" size={16} color={COLORS.textSecondary} />
          <Text style={styles.infoText}>
            {isPrivate 
              ? 'Private channels are only visible to subscribers. Users need an invite to join.'
              : 'Public channels are visible to everyone. Anyone can subscribe and view posts.'}
          </Text>
        </View>
      </ScrollView>
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
  headerDone: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  photoContainer: {
    alignSelf: 'center',
    marginBottom: 20,
  },
  channelPhoto: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  photoPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.bgSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.borderGlass,
    borderStyle: 'dashed',
  },
  photoText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginTop: 4,
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
    backgroundColor: COLORS.bgSecondary,
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
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  infoText: {
    color: COLORS.textSecondary,
    fontSize: 13,
    marginLeft: 8,
    flex: 1,
  },
});

export default CreateChannel;
