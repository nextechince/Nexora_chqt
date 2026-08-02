import Toast from 'react-native-toast-message';
import { TOAST_DURATIONS } from './constants';

export const showToast = ({ type = 'info', title, message, duration = TOAST_DURATIONS.MEDIUM }) => {
  Toast.show({
    type,
    text1: title,
    text2: message,
    visibilityTime: duration,
    position: 'bottom',
  });
};

export const showSuccess = (title, message, duration) => {
  showToast({ type: 'success', title, message, duration });
};

export const showError = (title, message, duration) => {
  showToast({ type: 'error', title, message, duration });
};

export const showWarning = (title, message, duration) => {
  showToast({ type: 'warning', title, message, duration });
};

export const showInfo = (title, message, duration) => {
  showToast({ type: 'info', title, message, duration });
};

export const hideToast = () => {
  Toast.hide();
};

export default {
  showToast,
  showSuccess,
  showError,
  showWarning,
  showInfo,
  hideToast,
};
