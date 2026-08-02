import moment from 'moment';
import { DATE_FORMATS } from './constants';

export const formatDate = (date, format = DATE_FORMATS.FULL) => {
  if (!date) return '';
  return moment(date).format(format);
};

export const formatTimeAgo = (date) => {
  if (!date) return '';
  return moment(date).fromNow();
};

export const formatTime = (date) => {
  if (!date) return '';
  return moment(date).format('HH:mm');
};

export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const formatNumber = (num) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

export const getInitials = (name) => {
  if (!name) return 'U';
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export const truncateText = (text, length = 30) => {
  if (!text) return '';
  return text.length > length ? text.substring(0, length) + '...' : text;
};

export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
};

export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const isValidPhone = (phone) => {
  const regex = /^\+?[1-9]\d{1,14}$/;
  return regex.test(phone);
};

export const isValidUsername = (username) => {
  const regex = /^[a-zA-Z0-9_]{3,20}$/;
  return regex.test(username);
};

export const isValidPassword = (password) => {
  return password.length >= 6;
};

export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export const throttle = (func, limit) => {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

export const getErrorMessage = (error) => {
  if (typeof error === 'string') return error;
  if (error.message) return error.message;
  return 'An error occurred';
};

export const sortByDate = (items, key = 'timestamp') => {
  return [...items].sort((a, b) => new Date(b[key]) - new Date(a[key]));
};

export const groupByDate = (items, key = 'timestamp') => {
  const groups = {};
  items.forEach(item => {
    const date = moment(item[key]).format('YYYY-MM-DD');
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(item);
  });
  return groups;
};

export const getStatusColor = (status) => {
  const colors = {
    online: '#22C55E',
    offline: '#6B7280',
    away: '#F59E0B',
    busy: '#EF4444',
  };
  return colors[status] || colors.offline;
};

export const getMessageStatusIcon = (status) => {
  const icons = {
    sent: 'check',
    delivered: 'check-all',
    read: 'check-all',
    failed: 'alert-circle',
  };
  return icons[status] || 'check';
};

export const getMessageStatusColor = (status) => {
  const colors = {
    sent: '#94A3B8',
    delivered: '#94A3B8',
    read: '#5865F2',
    failed: '#EF4444',
  };
  return colors[status] || colors.sent;
};

export const getBadgeIcon = (badge) => {
  const icons = {
    verified: 'check-decagram',
    premium: 'crown',
    developer: 'code-tags',
    owner: 'crown',
    moderator: 'shield-check',
  };
  return icons[badge] || 'star';
};

export const getBadgeColor = (badge) => {
  const colors = {
    verified: '#00D4FF',
    premium: '#FFD700',
    developer: '#8B5CF6',
    owner: '#EF4444',
    moderator: '#F59E0B',
  };
  return colors[badge] || '#94A3B8';
};

export const getCallTypeIcon = (type) => {
  const icons = {
    voice: 'phone',
    video: 'video',
    missed: 'phone-missed',
  };
  return icons[type] || 'phone';
};

export const getCallTypeColor = (type) => {
  const colors = {
    voice: '#5865F2',
    video: '#10B981',
    missed: '#EF4444',
  };
  return colors[type] || '#94A3B8';
};

export const getFileIcon = (type) => {
  const icons = {
    pdf: 'file-pdf-box',
    zip: 'folder-zip',
    docx: 'file-word',
    apk: 'android',
    xlsx: 'file-excel',
    pptx: 'file-powerpoint',
    txt: 'file-document',
  };
  return icons[type] || 'file';
};

export const getFileColor = (type) => {
  const colors = {
    pdf: '#EF4444',
    zip: '#F59E0B',
    docx: '#3B82F6',
    apk: '#10B981',
    xlsx: '#22C55E',
    pptx: '#F97316',
    txt: '#94A3B8',
  };
  return colors[type] || '#94A3B8';
};
