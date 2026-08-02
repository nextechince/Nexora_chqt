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
  Modal,
  FlatList,
  ActivityIndicator
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Toast from 'react-native-toast-message';
import { COLORS } from '../styles/colors';
import { COUNTRIES } from '../utils/countries';
import { db } from '../services/LocalDB';

const SignupPhone = ({ navigation }) => {
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES.find(c => c.code === '+234'));
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleContinue = () => {
    if (!phoneNumber || phoneNumber.length < 5) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please enter a valid phone number'
      });
      return;
    }
    setShowConfirm(true);
  };

  const handleConfirm = async () => {
    const fullPhone = selectedCountry.code + phoneNumber;
    
    setLoading(true);
    try {
      const exists = await db.checkUserExists(fullPhone);
      if (exists) {
        Toast.show({
          type: 'error',
          text1: 'Account Exists',
          text2: 'This phone number is already registered'
        });
        setShowConfirm(false);
        return;
      }

      // Send OTP
      await db.generateOTP(null, fullPhone);
      
      setShowConfirm(false);
      navigation.navigate('SignupEmail', { phone: fullPhone });
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

  const renderCountryItem = ({ item }) => (
    <TouchableOpacity
      style={styles.countryItem}
      onPress={() => {
        setSelectedCountry(item);
        setShowCountryPicker(false);
      }}
    >
      <Text style={styles.countryFlag}>{item.flag}</Text>
      <Text style={styles.countryName}>{item.name}</Text>
      <Text style={styles.countryCode}>{item.code}</Text>
    </TouchableOpacity>
  );

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
          <Text style={styles.title}>Enter Your Phone Number</Text>
          <Text style={styles.subtitle}>
            We'll send a verification code to this number
          </Text>
        </View>

        <View style={styles.phoneContainer}>
          <TouchableOpacity
            style={styles.countrySelector}
            onPress={() => setShowCountryPicker(true)}
          >
            <Text style={styles.countryFlag}>{selectedCountry.flag}</Text>
            <Text style={styles.countryCodeText}>{selectedCountry.code}</Text>
            <Icon name="chevron-down" size={20} color={COLORS.textSecondary} />
          </TouchableOpacity>

          <TextInput
            style={styles.phoneInput}
            placeholder="Phone Number"
            placeholderTextColor={COLORS.textSecondary}
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
          />
        </View>

        <TouchableOpacity
          style={[styles.continueButton, loading && styles.buttonDisabled]}
          onPress={handleContinue}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <>
              <Text style={styles.continueButtonText}>Continue</Text>
              <Icon name="arrow-right" size={20} color="#FFF" />
            </>
          )}
        </TouchableOpacity>

        <Text style={styles.termsText}>
          By continuing, you agree to our Terms of Service and Privacy Policy
        </Text>

        <Modal
          visible={showCountryPicker}
          animationType="slide"
          transparent={true}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Select Country</Text>
                <TouchableOpacity onPress={() => setShowCountryPicker(false)}>
                  <Icon name="close" size={24} color={COLORS.textPrimary} />
                </TouchableOpacity>
              </View>
              <FlatList
                data={COUNTRIES}
                keyExtractor={(item) => item.code}
                renderItem={renderCountryItem}
                showsVerticalScrollIndicator={false}
              />
            </View>
          </View>
        </Modal>

        <Modal
          visible={showConfirm}
          transparent={true}
          animationType="fade"
        >
          <View style={styles.confirmModalContainer}>
            <View style={styles.confirmModalContent}>
              <View style={styles.confirmIcon}>
                <Icon name="phone-check" size={50} color={COLORS.primary} />
              </View>
              <Text style={styles.confirmTitle}>Confirm Number</Text>
              <Text style={styles.confirmText}>
                Do you want to use {selectedCountry.code}{phoneNumber} for NEXORA CHQT?
              </Text>
              <View style={styles.confirmButtons}>
                <TouchableOpacity
                  style={[styles.confirmButton, styles.confirmButtonNo]}
                  onPress={() => setShowConfirm(false)}
                >
                  <Text style={styles.confirmButtonText}>No</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.confirmButton, styles.confirmButtonYes]}
                  onPress={handleConfirm}
                >
                  <Text style={[styles.confirmButtonText, styles.confirmButtonTextYes]}>Yes</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
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
    marginBottom: 40
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 8
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary
  },
  phoneContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.bgSecondary,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.borderGlass,
    overflow: 'hidden',
    marginBottom: 24
  },
  countrySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    borderRightWidth: 1,
    borderRightColor: COLORS.borderGlass
  },
  countryFlag: {
    fontSize: 24,
    marginRight: 8
  },
  countryCodeText: {
    color: COLORS.textPrimary,
    fontSize: 16,
    marginRight: 4
  },
  phoneInput: {
    flex: 1,
    height: 56,
    color: COLORS.textPrimary,
    fontSize: 16,
    paddingHorizontal: 12
  },
  continueButton: {
    flexDirection: 'row',
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16
  },
  continueButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8
  },
  buttonDisabled: {
    opacity: 0.7
  },
  termsText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    textAlign: 'center'
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end'
  },
  modalContent: {
    backgroundColor: COLORS.bgSecondary,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    padding: 20
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.textPrimary
  },
  countryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderGlass
  },
  countryName: {
    flex: 1,
    color: COLORS.textPrimary,
    fontSize: 16,
    marginLeft: 12
  },
  countryCode: {
    color: COLORS.textSecondary,
    fontSize: 14
  },
  confirmModalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  confirmModalContent: {
    backgroundColor: COLORS.bgSecondary,
    borderRadius: 20,
    padding: 24,
    width: '85%',
    alignItems: 'center'
  },
  confirmIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(88, 101, 242, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16
  },
  confirmTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 8
  },
  confirmText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 24
  },
  confirmButtons: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between'
  },
  confirmButton: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 6
  },
  confirmButtonNo: {
    backgroundColor: COLORS.bgGlass
  },
  confirmButtonYes: {
    backgroundColor: COLORS.primary
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textSecondary
  },
  confirmButtonTextYes: {
    color: '#FFF'
  }
});

export default SignupPhone;
