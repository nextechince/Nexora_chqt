import { isValidEmail, isValidPhone, isValidUsername, isValidPassword } from './helpers';

export const validateEmail = (email) => {
  if (!email) return { valid: false, message: 'Email is required' };
  if (!isValidEmail(email)) return { valid: false, message: 'Invalid email format' };
  return { valid: true, message: '' };
};

export const validatePhone = (phone) => {
  if (!phone) return { valid: false, message: 'Phone number is required' };
  if (!isValidPhone(phone)) return { valid: false, message: 'Invalid phone number' };
  return { valid: true, message: '' };
};

export const validateUsername = (username) => {
  if (!username) return { valid: false, message: 'Username is required' };
  if (!isValidUsername(username)) {
    return { valid: false, message: 'Username must be 3-20 characters (letters, numbers, underscores)' };
  }
  return { valid: true, message: '' };
};

export const validatePassword = (password) => {
  if (!password) return { valid: false, message: 'Password is required' };
  if (!isValidPassword(password)) {
    return { valid: false, message: 'Password must be at least 6 characters' };
  }
  return { valid: true, message: '' };
};

export const validateConfirmPassword = (password, confirmPassword) => {
  if (!confirmPassword) return { valid: false, message: 'Please confirm your password' };
  if (password !== confirmPassword) {
    return { valid: false, message: 'Passwords do not match' };
  }
  return { valid: true, message: '' };
};

export const validateDisplayName = (name) => {
  if (!name) return { valid: false, message: 'Display name is required' };
  if (name.length < 2) return { valid: false, message: 'Display name must be at least 2 characters' };
  if (name.length > 30) return { valid: false, message: 'Display name must be less than 30 characters' };
  return { valid: true, message: '' };
};

export const validateBio = (bio) => {
  if (bio && bio.length > 200) {
    return { valid: false, message: 'Bio must be less than 200 characters' };
  }
  return { valid: true, message: '' };
};

export const validateStatus = (status) => {
  if (status && status.length > 40) {
    return { valid: false, message: 'Status must be less than 40 characters' };
  }
  return { valid: true, message: '' };
};

export const validateGroupName = (name) => {
  if (!name) return { valid: false, message: 'Group name is required' };
  if (name.length < 2) return { valid: false, message: 'Group name must be at least 2 characters' };
  if (name.length > 50) return { valid: false, message: 'Group name must be less than 50 characters' };
  return { valid: true, message: '' };
};

export const validateChannelName = (name) => {
  if (!name) return { valid: false, message: 'Channel name is required' };
  if (name.length < 2) return { valid: false, message: 'Channel name must be at least 2 characters' };
  if (name.length > 50) return { valid: false, message: 'Channel name must be less than 50 characters' };
  return { valid: true, message: '' };
};

export const validateMessage = (message) => {
  if (!message) return { valid: false, message: 'Message is required' };
  if (message.length > 4096) {
    return { valid: false, message: 'Message must be less than 4096 characters' };
  }
  return { valid: true, message: '' };
};

export const validateOTP = (otp) => {
  if (!otp) return { valid: false, message: 'OTP is required' };
  if (otp.length !== 6) return { valid: false, message: 'OTP must be 6 digits' };
  if (!/^\d{6}$/.test(otp)) return { valid: false, message: 'OTP must be numeric' };
  return { valid: true, message: '' };
};

export const validateUrl = (url) => {
  if (!url) return { valid: false, message: 'URL is required' };
  const regex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
  if (!regex.test(url)) return { valid: false, message: 'Invalid URL format' };
  return { valid: true, message: '' };
};

export const validateSearch = (query) => {
  if (query && query.length < 2) {
    return { valid: false, message: 'Search query must be at least 2 characters' };
  }
  if (query && query.length > 100) {
    return { valid: false, message: 'Search query must be less than 100 characters' };
  }
  return { valid: true, message: '' };
};

export const validateFile = (file) => {
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (!file) return { valid: false, message: 'File is required' };
  if (file.size > maxSize) {
    return { valid: false, message: 'File size must be less than 10MB' };
  }
  return { valid: true, message: '' };
};

export const validateImage = (image) => {
  const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (!image) return { valid: false, message: 'Image is required' };
  if (!validTypes.includes(image.type)) {
    return { valid: false, message: 'Invalid image format. Supported: JPEG, PNG, GIF, WEBP' };
  }
  return validateFile(image);
};
