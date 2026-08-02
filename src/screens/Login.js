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
  ActivityIndicator,
  Modal,
  FlatList
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Toast from 'react-native-toast-message';
import { COLORS } from '../styles/colors';
import { COUNTRIES } from '../utils/countries';
import { db } from '../services/LocalDB';

const Login = ({ navigation }) => {
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES.find(c => c.code === '+234'));
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [otpLoading, setOtpLoading] = useState(false);
  const inputs = useRef([]);

  const handleSendOTP = async () => {
    if (!phoneNumber || phoneNumber.length < 5) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please enter a valid phone number'
      });
      return;
    }

    const fullPhone = selectedCountry.code + phoneNumber;
    setLoading(true);
    try {
      const exists = await db.checkUserExists(fullPhone);
      if (!exists) {
        Toast.show({
          type: 'error',
          text1: 'Account Not Found',
          text2: 'Please create an account first'
        });
        return;
      }

      await db.generateOTP(null, fullPhone);
      setShowOTP(true);
      Toast.show({
        type: 'success',
        text1: 'OTP Sent',
        text2: `Verification code sent to ${fullPhone}`
      });
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

  const handleVerifyOTP = async () => {
    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please enter the complete 6-digit OTP'
      });
      return;
    }

    const fullPhone = selectedCountry.code + phoneNumber;
    setOtpLoading(true);
    try {
      const result = await db.verifyOTP(null, fullPhone, otpCode);
      if (result.success) {
        const loginResult = await db.login(fullPhone);
        if (loginResult.success) {
          Toast.show({
            type: 'success',
            text1: 'Welcome!',
            text2: `Hello ${loginResult.user.displayName}`
          });
          navigation.replace('MainTabs');
        }
      } else {
        Toast.show({
          type: 'error',
          text1: 'Verification Failed',
          text2: result.message || 'Invalid OTP. Please try again.'
        });
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Something went wrong'
      });
    } finally {
      setOtpLoading(false);
    }
  };

  const handleOtpChange = (text, index) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text && index < 5) {
      inputs.current[index + 1].focus();
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputs.current[index - 1].focus();
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
        <View style={styles.header}>
          <Text style={styles.title}>NEXORA</Text>
          <Text style={styles.subtitle}>CHQT</Text>
          <Text style={styles.welcome}>Welcome Back</Text>
        </View>

        {!showOTP ? (
          <>
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
              onPress={handleSendOTP}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.continueButtonText}>Send OTP</Text>
              )}
            </TouchableOpacity>
          </>
        ) : (
          <>
            <View style={styles.otpContainer}>
              {otp.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={ref => inputs.current[index] = ref}
                  style={styles.otpInput}
                  value={digit}
                  onChangeText={text => handleOtpChange(text, index)}
                  onKeyPress={e => handleKeyPress(e, index)}
                  keyboardType="number-pad"
                  maxLength={1}
                  autoFocus={index === 0}
                />
              ))}
            </View>

            <TouchableOpacity
              style={[styles.verifyButton, otpLoading && styles.buttonDisabled]}
              onPress={handleVerifyOTP}
              disabled={otpLoading}
            >
              {otpLoading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.verifyButtonText}>Verify & Login</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.backToPhone}
              onPress={() => setShowOTP(false)}
            >
              <Text style={styles.backToPhoneText}>← Change Phone Number</Text>
            </TouchableOpacity>
          </>
        )}

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('SignupPhone')}>
            <Text style={styles.signupLink}>Create Account</Text>
          </TouchableOpacity>
        </View>

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
    justifyContent: 'center'
  },
  header: {
    alignItems: 'center',
    marginBottom: 40
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: COLORS.primary,
    textShadowColor: COLORS.shadowGlow,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20
  },
  subtitle: {
    fontSize: 20,
    color: COLORS.accent,
    marginTop: -5,
    letterSpacing: 4
  },
  welcome: {
    fontSize: 18,
    color: COLORS.textPrimary,
    marginTop: 20
  },
  phoneContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.bgSecondary,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.borderGlass,
    overflow: 'hidden',
    marginBottom: 20
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
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20
  },
  continueButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold'
  },
  buttonDisabled: {
    opacity: 0.7
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24
  },
  otpInput: {
    width: 50,
    height: 60,
    backgroundColor: COLORS.bgSecondary,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.borderGlass,
    color: COLORS.textPrimary,
    fontSize: 24,
    textAlign: 'center',
    fontWeight: 'bold'
  },
  verifyButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16
  },
  verifyButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold'
  },
  backToPhone: {
    alignItems: 'center',
    marginTop: 8
  },
  backToPhoneText: {
    color: COLORS.textSecondary,
    fontSize: 14
  },
  footer: {
    marginTop: 30,
    alignItems: 'center'
  },
  footerText: {
    color: COLORS.textSecondary,
    fontSize: 14
  },
  signupLink: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 4
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
  }
});

export default Login;
