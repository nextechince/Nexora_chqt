import { COLORS } from '../styles/colors';

export const APP_CONFIG = {
  name: 'NEXORA CHQT',
  version: '1.0.0',
  build: 1,
};

export const STORAGE_KEYS = {
  TOKEN: '@nexora_token',
  USER: '@nexora_user',
  THEME: '@nexora_theme',
  LANGUAGE: '@nexora_language',
  SETTINGS: '@nexora_settings',
  CHATS: '@nexora_chats',
  MESSAGES: '@nexora_messages',
  GROUPS: '@nexora_groups',
  CHANNELS: '@nexora_channels',
  CALLS: '@nexora_calls',
  NOTIFICATIONS: '@nexora_notifications',
  SAVED_MESSAGES: '@nexora_saved_messages',
  BLOCKED_USERS: '@nexora_blocked_users',
  SEARCH_HISTORY: '@nexora_search_history',
};

export const MESSAGE_TYPES = {
  TEXT: 'text',
  IMAGE: 'image',
  VIDEO: 'video',
  AUDIO: 'audio',
  FILE: 'file',
  VOICE: 'voice',
  STICKER: 'sticker',
  GIF: 'gif',
  CONTACT: 'contact',
  LOCATION: 'location',
  POLL: 'poll',
  EVENT: 'event',
  ANNOUNCEMENT: 'announcement',
};

export const MESSAGE_STATUS = {
  SENT: 'sent',
  DELIVERED: 'delivered',
  READ: 'read',
  FAILED: 'failed',
  DELETED: 'deleted',
  EDITED: 'edited',
};

export const GROUP_ROLES = {
  OWNER: 'owner',
  ADMIN: 'admin',
  MODERATOR: 'moderator',
  MEMBER: 'member',
};

export const CHANNEL_TYPES = {
  PUBLIC: 'public',
  PRIVATE: 'private',
};

export const CALL_TYPES = {
  VOICE: 'voice',
  VIDEO: 'video',
};

export const CALL_STATUS = {
  RINGING: 'ringing',
  IN_PROGRESS: 'in_progress',
  ENDED: 'ended',
  MISSED: 'missed',
  REJECTED: 'rejected',
};

export const NOTIFICATION_TYPES = {
  MESSAGE: 'message',
  GROUP: 'group',
  CHANNEL: 'channel',
  CALL: 'call',
  LIKE: 'like',
  COMMENT: 'comment',
  FOLLOW: 'follow',
  SYSTEM: 'system',
};

export const PREMIUM_FEATURES = {
  BADGE: 'premium_badge',
  VERIFIED_BADGE: 'verified_badge',
  AI_REPLY: 'ai_reply',
  AI_MODERATOR: 'ai_moderator',
  ADVANCED_THEMES: 'advanced_themes',
  MORE_STORAGE: 'more_storage',
  MESSAGE_SCHEDULER: 'message_scheduler',
  EXCLUSIVE_STICKERS: 'exclusive_stickers',
  CUSTOM_BACKGROUNDS: 'custom_backgrounds',
  CUSTOM_EMOJI: 'custom_emoji',
  PRIORITY_SUPPORT: 'priority_support',
  NO_ADS: 'no_ads',
  LARGER_FILES: 'larger_files',
  VOICE_TO_TEXT: 'voice_to_text',
  TEXT_TO_VOICE: 'text_to_voice',
  PROFILE_VIEWERS: 'profile_viewers',
  MESSAGE_ANALYTICS: 'message_analytics',
  CUSTOM_NOTIFICATION_SOUNDS: 'custom_notification_sounds',
};

export const BADGE_TYPES = {
  VERIFIED: 'verified',
  PREMIUM: 'premium',
  DEVELOPER: 'developer',
  OWNER: 'owner',
  MODERATOR: 'moderator',
};

export const BADGE_ICONS = {
  verified: { icon: 'check-decagram', color: COLORS.verified },
  premium: { icon: 'crown', color: COLORS.premium },
  developer: { icon: 'code-tags', color: COLORS.developer },
  owner: { icon: 'crown', color: COLORS.owner },
  moderator: { icon: 'shield-check', color: COLORS.moderator },
};

export const EMOJI_CATEGORIES = [
  'Smileys',
  'People',
  'Animals',
  'Food',
  'Activities',
  'Travel',
  'Objects',
  'Symbols',
  'Flags',
];

export const FILE_TYPES = {
  PDF: 'pdf',
  ZIP: 'zip',
  DOCX: 'docx',
  APK: 'apk',
  XLSX: 'xlsx',
  PPTX: 'pptx',
  TXT: 'txt',
};

export const STORAGE_LIMITS = {
  FREE: 100, // MB
  PREMIUM: 1024, // MB
};

export const MAX_FILE_SIZE = {
  FREE: 10, // MB
  PREMIUM: 100, // MB
};

export const DEFAULT_THEME = 'dark';
export const DEFAULT_LANGUAGE = 'en';
export const DEFAULT_ACCENT_COLOR = '#5865F2';

export const DATE_FORMATS = {
  FULL: 'DD/MM/YYYY HH:mm',
  DATE: 'DD/MM/YYYY',
  TIME: 'HH:mm',
  RELATIVE: 'relative',
};

export const ANIMATION_DURATIONS = {
  FAST: 200,
  MEDIUM: 400,
  SLOW: 600,
};

export const TOAST_DURATIONS = {
  SHORT: 2000,
  MEDIUM: 3000,
  LONG: 5000,
};

export const OTPS = {
  LENGTH: 6,
  EXPIRY_MINUTES: 5,
};
