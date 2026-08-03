import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';

class LocalDB {
  constructor() {
    this.adminData = {
      users: [],
      sessions: [],
      otps: [],
      reports: [],
      analytics: {
        totalUsers: 0,
        activeUsers: 0,
        messagesSent: 0,
        groupsCreated: 0,
        channelsCreated: 0,
        storageUsage: 0,
        premiumRevenue: 0
      }
    };
    this.currentUser = null;
    this.userData = null;
    this.initialized = false;
  }

  async init() {
    if (this.initialized) return;
    await this.loadAdminData();
    await this.createDefaultData();
    this.initialized = true;
    return this;
  }

  async loadAdminData() {
    try {
      const stored = await AsyncStorage.getItem('@nexora_admin_data');
      if (stored) {
        this.adminData = JSON.parse(stored);
      }
    } catch (error) {
      console.log('Error loading admin data:', error);
    }
  }

  async saveAdminData() {
    try {
      await AsyncStorage.setItem('@nexora_admin_data', JSON.stringify(this.adminData));
    } catch (error) {
      console.log('Error saving admin data:', error);
    }
  }

  async createDefaultData() {
    if (this.adminData.users.length > 0) return;

    // ============================================
    // 4 OFFICIAL ACCOUNTS
    // ============================================
    
    const users = [
      {
        id: 'user_001',
        displayName: 'NEXORA CHQT',
        username: 'NEXORA',
        email: 'nexora@nexora.com',
        phone: '+12225550101',
        password: '123456',
        profileImage: null,
        bio: 'Official NEXORA CHQT Account 🚀',
        status: 'Available 🟢',
        verified: true,
        premium: true,
        isAdmin: false,
        isDeveloper: false,
        badges: ['moderator', 'premium', 'verified'],
        online: true,
        lastSeen: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        settings: {
          notifications: true,
          sound: true,
          privacy: {
            lastSeen: 'everyone',
            profilePhoto: 'everyone',
            status: 'everyone',
            readReceipts: true,
            onlineStatus: 'everyone'
          }
        }
      },
      {
        id: 'user_002',
        displayName: 'MR PYTHON CODE',
        username: '',
        email: 'mrpython@nexora.com',
        phone: '+15559876543',
        password: '123456',
        profileImage: null,
        bio: 'Python Developer | NEXORA Owner 🐍',
        status: 'Coding 💻',
        verified: true,
        premium: true,
        isAdmin: true,
        isDeveloper: true,
        badges: ['owner', 'premium', 'verified', 'developer'],
        online: true,
        lastSeen: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        settings: {
          notifications: true,
          sound: true,
          privacy: {
            lastSeen: 'everyone',
            profilePhoto: 'everyone',
            status: 'everyone',
            readReceipts: true,
            onlineStatus: 'everyone'
          }
        }
      },
      {
        id: 'user_003',
        displayName: 'NEX TECH',
        username: '',
        email: 'nextech@nexora.com',
        phone: '+15554567890',
        password: '123456',
        profileImage: null,
        bio: 'Tech Enthusiast | Developer 🔧',
        status: 'Building the future 🚀',
        verified: true,
        premium: true,
        isAdmin: false,
        isDeveloper: true,
        badges: ['developer', 'premium', 'verified'],
        online: true,
        lastSeen: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        settings: {
          notifications: true,
          sound: true,
          privacy: {
            lastSeen: 'everyone',
            profilePhoto: 'everyone',
            status: 'everyone',
            readReceipts: true,
            onlineStatus: 'everyone'
          }
        }
      },
      {
        id: 'user_004',
        displayName: 'NEXORA SUPPORT',
        username: 'SUPPORT',
        email: 'support@nexora.com',
        phone: '+14445550202',
        password: '123456',
        profileImage: null,
        bio: 'Official Support Team 💪',
        status: 'Here to help! 💪',
        verified: true,
        premium: true,
        isAdmin: false,
        isDeveloper: false,
        badges: ['moderator', 'premium', 'verified'],
        online: true,
        lastSeen: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        settings: {
          notifications: true,
          sound: true,
          privacy: {
            lastSeen: 'everyone',
            profilePhoto: 'everyone',
            status: 'everyone',
            readReceipts: true,
            onlineStatus: 'everyone'
          }
        }
      }
    ];

    this.adminData.users = users;
    this.adminData.analytics.totalUsers = users.length;
    this.adminData.analytics.activeUsers = users.length;

    // ============================================
    // CHANNEL: NEXORA OFFICIAL CHANNEL
    // ============================================
    
    const channel = {
      id: 'channel_001',
      name: 'NEXORA OFFICIAL CHANNEL',
      description: 'Official channel for NEXORA CHQT updates and announcements 📢',
      photo: null,
      coverImage: null,
      creatorId: 'user_001',
      subscribers: ['user_001', 'user_002', 'user_003', 'user_004'],
      isPrivate: false,
      category: 'Technology',
      verified: true,
      lastPost: 'Welcome to the official NEXORA CHQT channel! 🎉',
      lastPostTime: new Date().toISOString(),
      unread: 0,
      createdAt: new Date().toISOString(),
      posts: [
        {
          id: 'post_001',
          senderId: 'user_001',
          text: 'Welcome to the official NEXORA CHQT channel! 🎉',
          type: 'text',
          timestamp: new Date().toISOString(),
          status: 'read',
          reactions: { '🎉': 4, '🔥': 2 },
          comments: [
            {
              id: 'comment_001',
              senderId: 'user_002',
              text: 'Great to be here! 🚀',
              timestamp: new Date().toISOString()
            },
            {
              id: 'comment_002',
              senderId: 'user_003',
              text: 'Amazing! Let\'s build something great! 💻',
              timestamp: new Date(Date.now() - 600000).toISOString()
            }
          ],
          pinned: true,
          edited: false,
          deleted: false
        },
        {
          id: 'post_002',
          senderId: 'user_001',
          text: 'New features coming soon! Stay tuned! 📢',
          type: 'text',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          status: 'read',
          reactions: { '🔥': 3, '👀': 2 },
          comments: [
            {
              id: 'comment_003',
              senderId: 'user_004',
              text: 'Can\'t wait! Support team is ready! 💪',
              timestamp: new Date(Date.now() - 1800000).toISOString()
            }
          ],
          pinned: false,
          edited: false,
          deleted: false
        }
      ],
      stats: {
        subscribers: 4,
        views: 156,
        posts: 2
      }
    };

    this.adminData.channels = [channel];
    this.adminData.messages = {};
    this.adminData.messages[channel.id] = channel.posts;
    this.adminData.analytics.channelsCreated = 1;

    // ============================================
    // CHATS BETWEEN USERS
    // ============================================
    
    const chat1 = {
      id: 'chat_001',
      participants: ['user_001', 'user_002'],
      name: 'MR PYTHON CODE',
      isGroup: false,
      lastMessage: 'Welcome to NEXORA CHQT! 🚀',
      lastMessageTime: new Date().toISOString(),
      unread: 0,
      pinned: false,
      archived: false,
      createdAt: new Date().toISOString()
    };

    const chat2 = {
      id: 'chat_002',
      participants: ['user_001', 'user_003'],
      name: 'NEX TECH',
      isGroup: false,
      lastMessage: 'Great to have you on board! 👋',
      lastMessageTime: new Date().toISOString(),
      unread: 0,
      pinned: false,
      archived: false,
      createdAt: new Date().toISOString()
    };

    const chat3 = {
      id: 'chat_003',
      participants: ['user_001', 'user_004'],
      name: 'NEXORA SUPPORT',
      isGroup: false,
      lastMessage: 'Support team is here to help! 💪',
      lastMessageTime: new Date().toISOString(),
      unread: 0,
      pinned: false,
      archived: false,
      createdAt: new Date().toISOString()
    };

    const chat4 = {
      id: 'chat_004',
      participants: ['user_002', 'user_003'],
      name: 'NEX TECH',
      isGroup: false,
      lastMessage: 'Let\'s code something amazing! 💻',
      lastMessageTime: new Date().toISOString(),
      unread: 0,
      pinned: false,
      archived: false,
      createdAt: new Date().toISOString()
    };

    this.adminData.chats = [chat1, chat2, chat3, chat4];

    // ============================================
    // MESSAGES FOR EACH CHAT
    // ============================================
    
    this.adminData.messages[chat1.id] = [
      {
        id: 'msg_001',
        senderId: 'user_001',
        text: 'Welcome to NEXORA CHQT! 🚀',
        type: 'text',
        timestamp: new Date().toISOString(),
        status: 'read',
        reactions: { '🚀': 1 },
        repliedTo: null,
        edited: false,
        deleted: false
      },
      {
        id: 'msg_002',
        senderId: 'user_002',
        text: 'Thanks! Excited to be here! 💻',
        type: 'text',
        timestamp: new Date(Date.now() - 600000).toISOString(),
        status: 'read',
        reactions: {},
        repliedTo: null,
        edited: false,
        deleted: false
      },
      {
        id: 'msg_003',
        senderId: 'user_001',
        text: 'You\'re the Owner now! Make it great! 👑',
        type: 'text',
        timestamp: new Date(Date.now() - 300000).toISOString(),
        status: 'read',
        reactions: { '👑': 1 },
        repliedTo: { id: 'msg_002', senderName: 'MR PYTHON CODE', text: 'Thanks! Excited to be here! 💻' },
        edited: false,
        deleted: false
      }
    ];

    this.adminData.messages[chat2.id] = [
      {
        id: 'msg_004',
        senderId: 'user_001',
        text: 'Great to have you on board! 👋',
        type: 'text',
        timestamp: new Date().toISOString(),
        status: 'read',
        reactions: {},
        repliedTo: null,
        edited: false,
        deleted: false
      },
      {
        id: 'msg_005',
        senderId: 'user_003',
        text: 'Thanks! Ready to build amazing things! 🔧',
        type: 'text',
        timestamp: new Date(Date.now() - 900000).toISOString(),
        status: 'read',
        reactions: {},
        repliedTo: null,
        edited: false,
        deleted: false
      }
    ];

    this.adminData.messages[chat3.id] = [
      {
        id: 'msg_006',
        senderId: 'user_001',
        text: 'Support team is here to help! 💪',
        type: 'text',
        timestamp: new Date().toISOString(),
        status: 'read',
        reactions: { '💪': 1 },
        repliedTo: null,
        edited: false,
        deleted: false
      },
      {
        id: 'msg_007',
        senderId: 'user_004',
        text: 'Always ready to assist! 🛡️',
        type: 'text',
        timestamp: new Date(Date.now() - 1200000).toISOString(),
        status: 'read',
        reactions: {},
        repliedTo: null,
        edited: false,
        deleted: false
      }
    ];

    this.adminData.messages[chat4.id] = [
      {
        id: 'msg_008',
        senderId: 'user_002',
        text: 'Let\'s code something amazing! 💻',
        type: 'text',
        timestamp: new Date().toISOString(),
        status: 'read',
        reactions: { '💻': 1 },
        repliedTo: null,
        edited: false,
        deleted: false
      },
      {
        id: 'msg_009',
        senderId: 'user_003',
        text: 'I\'m in! What are we building? 🚀',
        type: 'text',
        timestamp: new Date(Date.now() - 300000).toISOString(),
        status: 'read',
        reactions: {},
        repliedTo: null,
        edited: false,
        deleted: false
      }
    ];

    // ============================================
    // NOTIFICATIONS
    // ============================================
    
    this.adminData.notifications = [
      {
        id: 'notif_001',
        type: 'channel',
        title: 'New channel post',
        body: 'NEXORA CHQT: Welcome to the official NEXORA CHQT channel! 🎉',
        read: false,
        timestamp: new Date().toISOString(),
        data: { channelId: 'channel_001' }
      },
      {
        id: 'notif_002',
        type: 'message',
        title: 'New message from MR PYTHON CODE',
        body: 'Thanks! Excited to be here! 💻',
        read: false,
        timestamp: new Date(Date.now() - 600000).toISOString(),
        data: { chatId: 'chat_001' }
      },
      {
        id: 'notif_003',
        type: 'group',
        title: 'New comment',
        body: 'MR PYTHON CODE commented on NEXORA OFFICIAL CHANNEL',
        read: false,
        timestamp: new Date(Date.now() - 300000).toISOString(),
        data: { channelId: 'channel_001' }
      }
    ];

    // ============================================
    // SESSIONS
    // ============================================
    
    this.adminData.sessions = [
      {
        userId: 'user_001',
        lastActive: new Date().toISOString(),
        device: 'Mobile',
        ip: 'Local'
      },
      {
        userId: 'user_002',
        lastActive: new Date().toISOString(),
        device: 'Mobile',
        ip: 'Local'
      },
      {
        userId: 'user_003',
        lastActive: new Date().toISOString(),
        device: 'Mobile',
        ip: 'Local'
      },
      {
        userId: 'user_004',
        lastActive: new Date().toISOString(),
        device: 'Mobile',
        ip: 'Local'
      }
    ];

    await this.saveData();
  }

  // ============================================
  // OTP MANAGEMENT
  // ============================================
  
  async generateOTP(email, phone) {
    const otp = Math.floor(100000 + Math.random() * 900000);
    const expiresAt = new Date(Date.now() + 5 * 60000).toISOString();
    
    const otpData = {
      id: uuidv4(),
      email,
      phone,
      otp: otp.toString(),
      expiresAt,
      verified: false,
      createdAt: new Date().toISOString()
    };
    
    this.adminData.otps.push(otpData);
    await this.saveAdminData();
    
    console.log(`📧 OTP for ${email}: ${otp}`);
    console.log(`📱 OTP for ${phone}: ${otp}`);
    
    return otpData;
  }

  async verifyOTP(email, phone, otp) {
    const otpData = this.adminData.otps.find(
      o => (o.email === email || o.phone === phone) && 
           o.otp === otp && 
           !o.verified &&
           new Date(o.expiresAt) > new Date()
    );
    
    if (otpData) {
      otpData.verified = true;
      await this.saveAdminData();
      return { success: true };
    }
    
    return { success: false, message: 'Invalid or expired OTP' };
  }

  // ============================================
  // USER MANAGEMENT
  // ============================================
  
  async createUser(data) {
    const existing = this.adminData.users.find(u => 
      u.email === data.email || u.phone === data.phone || u.username === data.username
    );
    
    if (existing) {
      return { success: false, message: 'User already exists' };
    }

    const user = {
      id: uuidv4(),
      displayName: data.displayName,
      username: data.username || data.displayName.toLowerCase().replace(/\s/g, '_'),
      email: data.email,
      phone: data.phone,
      password: data.password || '123456',
      profileImage: data.profileImage || null,
      bio: '',
      status: 'Hey there! I am using NEXORA CHQT',
      verified: false,
      premium: false,
      isAdmin: false,
      isDeveloper: false,
      badges: [],
      online: true,
      lastSeen: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      settings: {
        notifications: true,
        sound: true,
        privacy: {
          lastSeen: 'everyone',
          profilePhoto: 'everyone',
          status: 'everyone',
          readReceipts: true,
          onlineStatus: 'everyone'
        }
      }
    };

    this.adminData.users.push(user);
    this.adminData.analytics.totalUsers = this.adminData.users.length;
    this.adminData.analytics.activeUsers = this.adminData.users.filter(u => u.online).length;
    await this.saveAdminData();

    const userData = {
      user,
      chats: [],
      messages: {},
      groups: [],
      channels: [],
      calls: [],
      notifications: [],
      savedMessages: []
    };
    await this.saveUserSession(user.id, userData);

    return { success: true, user };
  }

  async login(phone) {
    const user = this.adminData.users.find(u => u.phone === phone);
    
    if (!user) {
      return { success: false, message: 'Account not found. Please create one first.' };
    }

    user.online = true;
    user.lastSeen = new Date().toISOString();
    this.adminData.analytics.activeUsers = this.adminData.users.filter(u => u.online).length;
    await this.saveAdminData();

    const userData = await this.loadUserSession(user.id);
    if (!userData) {
      const newUserData = {
        user,
        chats: [],
        messages: {},
        groups: [],
        channels: [],
        calls: [],
        notifications: [],
        savedMessages: []
      };
      await this.saveUserSession(user.id, newUserData);
    }

    return { success: true, user };
  }

  async checkUserExists(phone) {
    return this.adminData.users.some(u => u.phone === phone);
  }

  async getUserByPhone(phone) {
    const user = this.adminData.users.find(u => u.phone === phone);
    if (user) {
      return user;
    }
    return null;
  }

  async getUserById(id) {
    const user = this.adminData.users.find(u => u.id === id);
    if (user) {
      return user;
    }
    return null;
  }

  async getUsers() {
    return this.adminData.users;
  }

  async getAllUsers() {
    return this.adminData.users;
  }

  async updateUser(id, updates) {
    const index = this.adminData.users.findIndex(u => u.id === id);
    if (index === -1) return null;
    
    this.adminData.users[index] = { ...this.adminData.users[index], ...updates };
    await this.saveAdminData();
    return this.adminData.users[index];
  }

  // ============================================
  // USER SESSION MANAGEMENT
  // ============================================
  
  async loadUserSession(userId) {
    try {
      const key = `@nexora_user_${userId}`;
      const stored = await AsyncStorage.getItem(key);
      if (stored) {
        this.userData = JSON.parse(stored);
        this.currentUser = this.userData.user;
        return this.userData;
      }
    } catch (error) {
      console.log('Error loading user session:', error);
    }
    return null;
  }

  async saveUserSession(userId, data) {
    try {
      const key = `@nexora_user_${userId}`;
      await AsyncStorage.setItem(key, JSON.stringify(data));
      this.userData = data;
      this.currentUser = data.user;
      
      const session = {
        userId,
        lastActive: new Date().toISOString(),
        device: 'Mobile',
        ip: 'Local'
      };
      
      const existingSession = this.adminData.sessions.find(s => s.userId === userId);
      if (existingSession) {
        existingSession.lastActive = session.lastActive;
      } else {
        this.adminData.sessions.push(session);
      }
      await this.saveAdminData();
      
      return true;
    } catch (error) {
      console.log('Error saving user session:', error);
      return false;
    }
  }

  async clearUserSession(userId) {
    try {
      const key = `@nexora_user_${userId}`;
      await AsyncStorage.removeItem(key);
      this.userData = null;
      this.currentUser = null;
      
      this.adminData.sessions = this.adminData.sessions.filter(s => s.userId !== userId);
      await this.saveAdminData();
      
      return true;
    } catch (error) {
      console.log('Error clearing user session:', error);
      return false;
    }
  }

  async logout(userId) {
    const user = this.adminData.users.find(u => u.id === userId);
    if (user) {
      user.online = false;
      user.lastSeen = new Date().toISOString();
      this.adminData.analytics.activeUsers = this.adminData.users.filter(u => u.online).length;
      await this.saveAdminData();
    }
    return { success: true };
  }

  // ============================================
  // CHAT METHODS
  // ============================================
  
  async getUserChats(userId) {
    const userData = await this.loadUserSession(userId);
    return userData?.chats || [];
  }

  async createUserChat(userId, otherUserId) {
    const userData = await this.loadUserSession(userId);
    if (!userData) return null;

    const existing = userData.chats.find(c => 
      c.participants.includes(userId) && c.participants.includes(otherUserId) && !c.isGroup
    );
    if (existing) return existing;

    const otherUser = await this.getUserById(otherUserId);
    const chat = {
      id: uuidv4(),
      participants: [userId, otherUserId],
      name: otherUser.displayName,
      isGroup: false,
      lastMessage: null,
      lastMessageTime: null,
      unread: 0,
      pinned: false,
      archived: false,
      createdAt: new Date().toISOString()
    };

    userData.chats.push(chat);
    userData.messages[chat.id] = [];
    await this.saveUserSession(userId, userData);
    return chat;
  }

  async sendUserMessage(userId, chatId, senderId, text, type = 'text', replyTo = null) {
    const userData = await this.loadUserSession(userId);
    if (!userData) return null;

    const chat = userData.chats.find(c => c.id === chatId);
    if (!chat) return null;

    const message = {
      id: uuidv4(),
      senderId,
      text,
      type,
      timestamp: new Date().toISOString(),
      status: 'sent',
      reactions: {},
      repliedTo: replyTo,
      edited: false,
      deleted: false,
      readBy: [senderId]
    };

    if (!userData.messages[chatId]) {
      userData.messages[chatId] = [];
    }
    userData.messages[chatId].push(message);

    chat.lastMessage = text;
    chat.lastMessageTime = message.timestamp;
    chat.unread += 1;

    this.adminData.analytics.messagesSent += 1;
    await this.saveAdminData();
    await this.saveUserSession(userId, userData);

    setTimeout(async () => {
      const updatedData = await this.loadUserSession(userId);
      const msg = updatedData.messages[chatId]?.find(m => m.id === message.id);
      if (msg) {
        msg.status = 'delivered';
        await this.saveUserSession(userId, updatedData);
      }
    }, 500);

    setTimeout(async () => {
      const updatedData = await this.loadUserSession(userId);
      const msg = updatedData.messages[chatId]?.find(m => m.id === message.id);
      if (msg) {
        msg.status = 'read';
        chat.unread = 0;
        await this.saveUserSession(userId, updatedData);
      }
    }, 2000);

    return message;
  }

  async getUserMessages(userId, chatId) {
    const userData = await this.loadUserSession(userId);
    return userData?.messages[chatId] || [];
  }

  async markAsRead(chatId, userId) {
    const userData = await this.loadUserSession(userId);
    if (!userData) return;

    const chat = userData.chats.find(c => c.id === chatId);
    if (chat) {
      chat.unread = 0;
    }

    if (userData.messages[chatId]) {
      userData.messages[chatId].forEach(m => {
        if (m.status !== 'read' && m.senderId !== userId) {
          m.status = 'read';
          if (!m.readBy) m.readBy = [];
          if (!m.readBy.includes(userId)) m.readBy.push(userId);
        }
      });
    }
    await this.saveUserSession(userId, userData);
  }

  async deleteMessage(chatId, messageId, forEveryone = true) {
    const userData = await this.loadUserSession(this.currentUser?.id);
    if (!userData || !userData.messages[chatId]) return { success: false };

    if (forEveryone) {
      userData.messages[chatId] = userData.messages[chatId].filter(m => m.id !== messageId);
    } else {
      const message = userData.messages[chatId].find(m => m.id === messageId);
      if (message) message.deleted = true;
    }
    await this.saveUserSession(this.currentUser.id, userData);
    return { success: true };
  }

  async editMessage(chatId, messageId, newText) {
    const userData = await this.loadUserSession(this.currentUser?.id);
    if (!userData || !userData.messages[chatId]) return { success: false };

    const message = userData.messages[chatId].find(m => m.id === messageId);
    if (message) {
      message.text = newText;
      message.edited = true;
      message.editedAt = new Date().toISOString();
      await this.saveUserSession(this.currentUser.id, userData);
      return { success: true };
    }
    return { success: false };
  }

  async pinMessage(chatId, messageId) {
    const userData = await this.loadUserSession(this.currentUser?.id);
    if (!userData || !userData.messages[chatId]) return { success: false };

    const message = userData.messages[chatId].find(m => m.id === messageId);
    if (message) {
      message.pinned = !message.pinned;
      await this.saveUserSession(this.currentUser.id, userData);
      return { success: true, pinned: message.pinned };
    }
    return { success: false };
  }

  async reactToMessage(chatId, messageId, emoji, userId) {
    const userData = await this.loadUserSession(userId);
    if (!userData || !userData.messages[chatId]) return { success: false };

    const message = userData.messages[chatId].find(m => m.id === messageId);
    if (message) {
      if (!message.reactions) message.reactions = {};
      if (message.reactions[emoji]) {
        message.reactions[emoji] += 1;
      } else {
        message.reactions[emoji] = 1;
      }
      await this.saveUserSession(userId, userData);
      return { success: true };
    }
    return { success: false };
  }

  async forwardMessage(chatId, messageId, targetChatId) {
    const userData = await this.loadUserSession(this.currentUser?.id);
    if (!userData || !userData.messages[chatId]) return { success: false };

    const message = userData.messages[chatId].find(m => m.id === messageId);
    if (message) {
      const forwarded = {
        ...message,
        id: uuidv4(),
        forwarded: true,
        originalSenderId: message.senderId,
        timestamp: new Date().toISOString()
      };
      
      if (!userData.messages[targetChatId]) {
        userData.messages[targetChatId] = [];
      }
      userData.messages[targetChatId].push(forwarded);
      await this.saveUserSession(this.currentUser.id, userData);
      return { success: true };
    }
    return { success: false };
  }

  // ============================================
  // GROUP METHODS
  // ============================================
  
  async getUserGroups(userId) {
    const userData = await this.loadUserSession(userId);
    return userData?.groups || [];
  }

  async createUserGroup(userId, name, members = [], description = '') {
    const userData = await this.loadUserSession(userId);
    if (!userData) return null;

    const group = {
      id: uuidv4(),
      name,
      photo: null,
      description,
      creatorId: userId,
      members: [userId, ...members],
      admins: [userId],
      moderators: [],
      isGroup: true,
      privacy: 'public',
      lastMessage: null,
      lastMessageTime: null,
      unread: 0,
      pinned: false,
      archived: false,
      createdAt: new Date().toISOString(),
      joinRequests: [],
      muted: false,
      announcements: [],
      polls: [],
      events: [],
      stats: {
        members: 1 + members.length,
        messages: 0,
        activity: 'low'
      }
    };

    userData.groups.push(group);
    userData.messages[group.id] = [];
    this.adminData.analytics.groupsCreated += 1;
    await this.saveAdminData();
    await this.saveUserSession(userId, userData);
    return group;
  }

  async getGroupById(id) {
    // Check admin data first
    const adminGroup = this.adminData.groups?.find(g => g.id === id);
    if (adminGroup) return adminGroup;
    
    // Check user data
    const userData = await this.loadUserSession(this.currentUser?.id);
    return userData?.groups?.find(g => g.id === id);
  }

  async getGroups() {
    const userData = await this.loadUserSession(this.currentUser?.id);
    return userData?.groups || [];
  }

  async joinGroup(groupId, userId) {
    const group = await this.getGroupById(groupId);
    if (!group) return { success: false, message: 'Group not found' };

    if (group.members.includes(userId)) {
      return { success: false, message: 'Already a member' };
    }

    if (group.privacy === 'private') {
      if (!group.joinRequests) group.joinRequests = [];
      if (!group.joinRequests.includes(userId)) {
        group.joinRequests.push(userId);
        await this.saveData();
        return { success: true, message: 'Join request sent' };
      }
      return { success: false, message: 'Join request already pending' };
    }

    group.members.push(userId);
    group.stats.members = group.members.length;
    await this.saveData();
    return { success: true, message: 'Joined group' };
  }

  async leaveGroup(groupId, userId) {
    const group = await this.getGroupById(groupId);
    if (!group) return { success: false };

    group.members = group.members.filter(id => id !== userId);
    group.admins = group.admins.filter(id => id !== userId);
    group.moderators = group.moderators.filter(id => id !== userId);
    group.stats.members = group.members.length;
    await this.saveData();
    return { success: true };
  }

  // ============================================
  // CHANNEL METHODS
  // ============================================
  
  async getUserChannels(userId) {
    const userData = await this.loadUserSession(userId);
    return userData?.channels || [];
  }

  async createUserChannel(userId, name, description = '', isPrivate = false, category = 'General') {
    const userData = await this.loadUserSession(userId);
    if (!userData) return null;

    const channel = {
      id: uuidv4(),
      name,
      description,
      photo: null,
      coverImage: null,
      creatorId: userId,
      subscribers: [userId],
      isPrivate,
      category,
      verified: false,
      lastPost: null,
      lastPostTime: null,
      unread: 0,
      createdAt: new Date().toISOString(),
      posts: [],
      stats: {
        subscribers: 1,
        views: 0,
        posts: 0
      }
    };

    userData.channels.push(channel);
    userData.messages[channel.id] = [];
    this.adminData.analytics.channelsCreated += 1;
    await this.saveAdminData();
    await this.saveUserSession(userId, userData);
    return channel;
  }

  async getChannelById(id) {
    // Check admin data first
    const adminChannel = this.adminData.channels?.find(c => c.id === id);
    if (adminChannel) return adminChannel;
    
    // Check user data
    const userData = await this.loadUserSession(this.currentUser?.id);
    return userData?.channels?.find(c => c.id === id);
  }

  async getChannels() {
    const userData = await this.loadUserSession(this.currentUser?.id);
    return userData?.channels || [];
  }

  async subscribeChannel(channelId, userId) {
    const channel = await this.getChannelById(channelId);
    if (!channel) return { success: false };

    if (!channel.subscribers.includes(userId)) {
      channel.subscribers.push(userId);
      channel.stats.subscribers = channel.subscribers.length;
      await this.saveData();
    }
    return { success: true };
  }

  async unsubscribeChannel(channelId, userId) {
    const channel = await this.getChannelById(channelId);
    if (!channel) return { success: false };

    channel.subscribers = channel.subscribers.filter(id => id !== userId);
    channel.stats.subscribers = channel.subscribers.length;
    await this.saveData();
    return { success: true };
  }

  async createChannelPost(channelId, senderId, text, type = 'text') {
    const channel = await this.getChannelById(channelId);
    if (!channel) return null;

    const post = {
      id: uuidv4(),
      senderId,
      text,
      type,
      timestamp: new Date().toISOString(),
      status: 'sent',
      reactions: {},
      comments: [],
      pinned: false,
      edited: false,
      deleted: false
    };

    if (!this.adminData.messages[channelId]) {
      this.adminData.messages[channelId] = [];
    }
    this.adminData.messages[channelId].push(post);

    channel.lastPost = text;
    channel.lastPostTime = post.timestamp;
    channel.stats.posts += 1;
    channel.stats.views += 1;

    await this.saveAdminData();
    return post;
  }

  // ============================================
  // CALL METHODS
  // ============================================
  
  async addCall(callData) {
    const call = {
      id: uuidv4(),
      ...callData,
      timestamp: new Date().toISOString(),
      duration: callData.duration || 0
    };
    if (!this.adminData.calls) this.adminData.calls = [];
    this.adminData.calls.push(call);
    await this.saveAdminData();
    return call;
  }

  async getCalls(userId) {
    if (!this.adminData.calls) return [];
    return this.adminData.calls
      .filter(c => c.from === userId || c.to === userId)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }

  // ============================================
  // NOTIFICATION METHODS
  // ============================================
  
  async addNotification(notification) {
    if (!this.adminData.notifications) this.adminData.notifications = [];
    const notif = {
      id: uuidv4(),
      ...notification,
      read: false,
      timestamp: new Date().toISOString()
    };
    this.adminData.notifications.unshift(notif);
    await this.saveAdminData();
    return notif;
  }

  async getNotifications(userId) {
    return this.adminData.notifications || [];
  }

  async markNotificationRead(notificationId) {
    if (!this.adminData.notifications) return { success: false };
    const notif = this.adminData.notifications.find(n => n.id === notificationId);
    if (notif) {
      notif.read = true;
      await this.saveAdminData();
      return { success: true };
    }
    return { success: false };
  }

  async clearNotifications() {
    this.adminData.notifications = [];
    await this.saveAdminData();
    return { success: true };
  }

  // ============================================
  // SAVED MESSAGES
  // ============================================
  
  async saveMessage(userId, message) {
    if (!this.adminData.savedMessages) this.adminData.savedMessages = [];
    const saved = {
      id: uuidv4(),
      userId,
      message,
      savedAt: new Date().toISOString()
    };
    this.adminData.savedMessages.push(saved);
    await this.saveAdminData();
    return saved;
  }

  async getSavedMessages(userId) {
    if (!this.adminData.savedMessages) return [];
    return this.adminData.savedMessages.filter(s => s.userId === userId);
  }

  async deleteSavedMessage(savedId) {
    if (!this.adminData.savedMessages) return { success: false };
    this.adminData.savedMessages = this.adminData.savedMessages.filter(s => s.id !== savedId);
    await this.saveAdminData();
    return { success: true };
  }

  // ============================================
  // ADMIN METHODS
  // ============================================
  
  async getAdminStats() {
    const stats = {
      totalUsers: this.adminData.users.length,
      activeUsers: this.adminData.users.filter(u => u.online).length,
      messagesSent: this.adminData.analytics.messagesSent || 0,
      groupsCreated: this.adminData.analytics.groupsCreated || 0,
      channelsCreated: this.adminData.analytics.channelsCreated || 0,
      storageUsage: this.adminData.analytics.storageUsage || 0,
      premiumRevenue: this.adminData.analytics.premiumRevenue || 0,
      sessions: this.adminData.sessions.length,
      systemHealth: 'Good',
      recentActivity: this.adminData.sessions.slice(0, 5)
    };
    return stats;
  }

  async getAdminSessions() {
    return this.adminData.sessions;
  }

  async grantPremium(userId) {
    const user = this.adminData.users.find(u => u.id === userId);
    if (user) {
      user.premium = true;
      if (!user.badges.includes('premium')) {
        user.badges.push('premium');
      }
      await this.saveAdminData();
      return { success: true };
    }
    return { success: false };
  }

  async revokePremium(userId) {
    const user = this.adminData.users.find(u => u.id === userId);
    if (user) {
      user.premium = false;
      user.badges = user.badges.filter(b => b !== 'premium');
      await this.saveAdminData();
      return { success: true };
    }
    return { success: false };
  }

  async grantVerification(userId) {
    const user = this.adminData.users.find(u => u.id === userId);
    if (user) {
      user.verified = true;
      if (!user.badges.includes('verified')) {
        user.badges.push('verified');
      }
      await this.saveAdminData();
      return { success: true };
    }
    return { success: false };
  }

  async revokeVerification(userId) {
    const user = this.adminData.users.find(u => u.id === userId);
    if (user) {
      user.verified = false;
      user.badges = user.badges.filter(b => b !== 'verified');
      await this.saveAdminData();
      return { success: true };
    }
    return { success: false };
  }

  async deleteUser(userId) {
    this.adminData.users = this.adminData.users.filter(u => u.id !== userId);
    this.adminData.sessions = this.adminData.sessions.filter(s => s.userId !== userId);
    this.adminData.analytics.totalUsers = this.adminData.users.length;
    this.adminData.analytics.activeUsers = this.adminData.users.filter(u => u.online).length;
    await this.saveAdminData();

    const key = `@nexora_user_${userId}`;
    await AsyncStorage.removeItem(key);
    
    return { success: true };
  }

  async banUser(userId, reason) {
    const user = this.adminData.users.find(u => u.id === userId);
    if (user) {
      user.banned = true;
      user.bannedReason = reason;
      user.bannedAt = new Date().toISOString();
      user.online = false;
      await this.saveAdminData();
      return { success: true };
    }
    return { success: false };
  }

  async unbanUser(userId) {
    const user = this.adminData.users.find(u => u.id === userId);
    if (user) {
      user.banned = false;
      delete user.bannedReason;
      delete user.bannedAt;
      await this.saveAdminData();
      return { success: true };
    }
    return { success: false };
  }

  // ============================================
  // SAVE DATA
  // ============================================
  
  async saveData() {
    await this.saveAdminData();
  }
}

export const db = new LocalDB();
