import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  ActivityIndicator,
  FlatList
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Toast from 'react-native-toast-message';
import { COLORS } from '../styles/colors';
import { db } from '../services/LocalDB';

const SignupProfile = ({ navigation, route }) => {
  const { email, phone } = route.params || {};
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(false);

  // Sample avatar options
  const avatarOptions = [
    'https://ui-avatars.com/api/?name=User&background=5865F2&color=fff&size=128',
    'https://ui-avatars.com/api/?name=User&background=00D4FF&color=fff&size=128',
    'https://ui-avatars.com/api/?name=User&background=10B981&color=fff&size=128',
    'https://ui-avatars.com/api/?name=User&background=F59E0B&color=fff&size=128',
    'https://ui-avatars.com/api/?name=User&background=EF4444&color=fff&size=128',
    'https://ui-avatars.com/api/?name=User&background=8B5CF6&color=fff&size=128',
  ];

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7
    });
    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const handleCreateAccount = async () => {
    if (!displayName) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please enter your display name'
      });
      return;
    }

    setLoading(true);
    try {
      const result = await db.createUser({
        displayName,
        username: username || displayName.toLowerCase().replace(/\s/g, '_'),
        email,
        phone,
        profileImage
      });

      if (result.success) {
        Toast.show({
          type: 'success',
          text1: 'Account Created! 🎉',
          text2: 'Welcome to NEXORA CHQT'
        });
        navigation.replace('Login');
      } else {
        Toast.show({
          type: 'error',
          text1: 'Creation Failed',
          text2: result.message
        });
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Something went wrong'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.title}>Create Your Profile</Text>
          <Text style={styles.subtitle}>Almost there! Set up your profile</Text>
        </View>

        <TouchableOpacity style={styles.avatarContainer} onPress={pickImage}>
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Icon name="camera" size={30} color={COLORS.textSecondary} />
              <Text style={styles.avatarText}>Add Photo</Text>
            </View>
          )}
        </TouchableOpacity>

        <View style={styles.avatarOptions}>
          <FlatList
            horizontal
            data={avatarOptions}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.avatarOption,
                  profileImage === item && styles.avatarOptionSelected
                ]}
                onPress={() => setProfileImage(item)}
              >
                <Image source={{ uri: item }} style={styles.avatarOptionImage} />
              </TouchableOpacity>
            )}
            showsHorizontalScrollIndicator={false}
          />
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Icon name="account" size={20} color={COLORS.textSecondary} />
            <TextInput
              style={styles.input}
              placeholder="Display Name *"
              placeholderTextColor={COLORS.textSecondary}
              value={displayName}
              onChangeText={setDisplayName}
            />
          </View>

          <View style={styles.inputContainer}>
            <Icon name="at" size={20} color={COLORS.textSecondary} />
            <TextInput
              style={styles.input}
              placeholder="Username (optional)"
              placeholderTextColor={COLORS.textSecondary}
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
            />
          </View>

          <TouchableOpacity
            style={[styles.createButton, loading && styles.buttonDisabled]}
            onPress={handleCreateAccount}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.createButtonText}>Create Account</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgPrimary
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 24,
    paddingTop: 60
  },
  backButton: {
    marginBottom: 30
  },
  header: {
    marginBottom: 30,
    alignItems: 'center'
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.textPrimary
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginTop: 4
  },
  avatarContainer: {
    alignSelf: 'center',
    marginBottom: 16
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: COLORS.primary
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.bgSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderStyle: 'dashed'
  },
  avatarText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginTop: 4
  },
  avatarOptions: {
    marginBottom: 24,
    paddingHorizontal: 4
  },
  avatarOption: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginHorizontal: 6,
    borderWidth: 2,
    borderColor: 'transparent'
  },
  avatarOptionSelected: {
    borderColor: COLORS.primary
  },
  avatarOptionImage: {
    width: 46,
    height: 46,
    borderRadius: 23
  },
  form: {
    width: '100%'
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.bgSecondary,
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: COLORS.borderGlass
  },
  input: {
    flex: 1,
    height: 50,
    color: COLORS.textPrimary,
    fontSize: 16,
    marginLeft: 12
  },
  createButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10
  },
  buttonDisabled: {
    opacity: 0.7
  },
  createButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold'
  }
});

export default SignupProfile;
