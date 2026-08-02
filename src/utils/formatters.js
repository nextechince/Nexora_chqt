import moment from 'moment';

export const formatDate = (date, format = 'DD/MM/YYYY') => {
  if (!date) return '';
  return moment(date).format(format);
};

export const formatTime = (date, format = 'HH:mm') => {
  if (!date) return '';
  return moment(date).format(format);
};

export const formatDateTime = (date, format = 'DD/MM/YYYY HH:mm') => {
  if (!date) return '';
  return moment(date).format(format);
};

export const formatTimeAgo = (date) => {
  if (!date) return '';
  return moment(date).fromNow();
};

export const formatMessageTime = (date) => {
  if (!date) return '';
  const now = moment();
  const msgTime = moment(date);
  
  if (now.diff(msgTime, 'days') === 0) {
    return msgTime.format('HH:mm');
  } else if (now.diff(msgTime, 'days') === 1) {
    return 'Yesterday';
  } else if (now.diff(msgTime, 'days') < 7) {
    return msgTime.format('ddd');
  } else {
    return msgTime.format('DD/MM/YYYY');
  }
};

export const formatChatListTime = (date) => {
  if (!date) return '';
  const now = moment();
  const msgTime = moment(date);
  
  if (now.diff(msgTime, 'minutes') < 1) {
    return 'Just now';
  } else if (now.diff(msgTime, 'hours') < 1) {
    return `${now.diff(msgTime, 'minutes')}m`;
  } else if (now.diff(msgTime, 'days') === 0) {
    return msgTime.format('HH:mm');
  } else if (now.diff(msgTime, 'days') === 1) {
    return 'Yesterday';
  } else if (now.diff(msgTime, 'days') < 7) {
    return msgTime.format('ddd');
  } else {
    return msgTime.format('DD/MM/YYYY');
  }
};

export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const size = (bytes / Math.pow(k, i)).toFixed(1);
  return `${size} ${sizes[i]}`;
};

export const formatNumber = (num) => {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
};

export const formatDuration = (seconds) => {
  if (!seconds) return '00:00';
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export const formatPhone = (phone) => {
  if (!phone) return '';
  // Remove all non-numeric characters
  const cleaned = phone.replace(/\D/g, '');
  // Format as +XXX XXX XXX XXX
  const match = cleaned.match(/^(\d{1,3})(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return `+${match[1]} ${match[2]} ${match[3]} ${match[4]}`;
  }
  return phone;
};

export const formatEmail = (email) => {
  if (!email) return '';
  return email.toLowerCase().trim();
};

export const formatUsername = (username) => {
  if (!username) return '';
  return username.toLowerCase().replace(/\s/g, '_');
};

export const formatDisplayName = (name) => {
  if (!name) return '';
  return name.trim().replace(/\s+/g, ' ');
};

export const formatMessageCount = (count) => {
  if (count > 99) return '99+';
  return count.toString();
};

export const formatStorage = (bytes) => {
  if (bytes === 0) return '0 MB';
  const mb = bytes / (1024 * 1024);
  if (mb < 1) return `${(bytes / 1024).toFixed(1)} KB`;
  if (mb < 1024) return `${mb.toFixed(1)} MB`;
  return `${(mb / 1024).toFixed(1)} GB`;
};

export const formatCurrency = (amount, currency = '$') => {
  return `${currency}${amount.toFixed(2)}`;
};

export const formatPercentage = (value) => {
  return `${value.toFixed(0)}%`;
};

export const formatStatus = (status) => {
  const statusMap = {
    online: 'Online',
    offline: 'Offline',
    away: 'Away',
    busy: 'Busy',
    typing: 'Typing...',
    recording: 'Recording...',
  };
  return statusMap[status] || status;
};

export const formatMessageType = (type) => {
  const typeMap = {
    text: 'Text',
    image: 'Image',
    video: 'Video',
    audio: 'Audio',
    file: 'File',
    voice: 'Voice',
    sticker: 'Sticker',
    gif: 'GIF',
    contact: 'Contact',
    location: 'Location',
    poll: 'Poll',
    event: 'Event',
    announcement: 'Announcement',
  };
  return typeMap[type] || type;
};

export const formatCallType = (type) => {
  const typeMap = {
    voice: 'Voice Call',
    video: 'Video Call',
    missed: 'Missed Call',
  };
  return typeMap[type] || type;
};

export const formatCallStatus = (status) => {
  const statusMap = {
    ringing: 'Ringing...',
    in_progress: 'In Progress',
    ended: 'Ended',
    missed: 'Missed',
    rejected: 'Rejected',
  };
  return statusMap[status] || status;
};
