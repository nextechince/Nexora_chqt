import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';

class LocalDB {
  constructor() {
    this.data = {
      users: [],
      chats: [],
      messages: {},
      groups: [],
      channels: [],
      calls: [],
      notifications: [],
      savedMessages: [],
      blockedUsers: [],
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
    this.initialized = false;
  }

  async init() {
    if (this.initialized) return;
    await this.loadData();
    await this.createDefaultData();
    this.initialized = true;
    return this;
  }

  async loadData() {
    try {
      const stored = await AsyncStorage.getItem('@nexora_db');
      if (stored) {
        this.data = JSON.parse(stored);
      }
    } catch (error) {
      console.log('Error loading DB:', error);
    }
  }

  async saveData() {
    try {
      await AsyncStorage.setItem('@nexora_db', JSON.stringify(this.data));
    } catch (error) {
      console.log('Error saving DB:', error);
    }
  }

  async createDefaultData() {
    if (this.data.users.length > 0) return;

    // Create admin user
    const admin = {
      id: 'admin_001',
      displayName: 'NEXORA Admin',
      username: 'nexora_admin',
      email: 'admin@nexora.com',
      phone: '+1234567890',
      password: 'Admin@123',
      profileImage: null,
      bio: '🚀 Building the future of chat',
      status: 'Available',
      verified: true,
      premium: true,
      isAdmin: true,
      isDeveloper: true,
      badges: ['verified', 'premium', 'developer', 'owner'],
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

    // Create test users
    const users = [
      {
        id: 'user_001',
        displayName: 'Alice Johnson',
        username: 'alice_j',
        email: 'alice@example.com',
        phone: '+1234567891',
        password: 'Alice@123',
        profileImage: null,
        bio: '💻 Tech enthusiast | 🎮 Gamer',
        status: 'Gaming',
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
      },
      {
        id: 'user_002',
        displayName: 'Bob Smith',
        username: 'bob_smith',
        email: 'bob@example.com',
        phone: '+1234567892',
        password: 'Bob@123',
        profileImage: null,
        bio: '☕ Coffee addict | 📚 Reader',
        status: 'Reading',
        verified: false,
        premium: true,
        isAdmin: false,
        isDeveloper: false,
        badges: ['premium'],
        online: false,
        lastSeen: new Date(Date.now() - 3600000).toISOString(),
        createdAt: new Date().toISOString(),
        settings: {
          notifications: true,
          sound: true,
          privacy: {
            lastSeen: 'contacts',
            profilePhoto: 'contacts',
            status: 'contacts',
            readReceipts: true,
            onlineStatus: 'everyone'
          }
        }
      },
      {
        id: 'user_003',
        displayName: 'Carol White',
        username: 'carol_w',
        email: 'carol@example.com',
        phone: '+1234567893',
        password: 'Carol@123',
        profileImage: null,
        bio: '🎨 Designer | 📸 Photographer',
        status: 'Designing',
        verified: true,
        premium: false,
        isAdmin: false,
        isDeveloper: false,
        badges: ['verified'],
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

    this.data.users = [admin, ...users];
    this.data.analytics.totalUsers = this.data.users.length;
    this.data.analytics.activeUsers = this.data.users.filter(u => u.online).length;

    // Create chats
    const chat1 = {
      id: uuidv4(),
      participants: ['admin_001', 'user_001'],
      name: 'Alice Johnson',
      isGroup: false,
      lastMessage: 'Hey! How are you doing?',
      lastMessageTime: new Date(Date.now() - 1800000).toISOString(),
      unread: 2,
      pinned: false,
      archived: false,
      createdAt: new Date().toISOString()
    };

    const chat2 = {
      id: uuidv4(),
      participants: ['admin_001', 'user_002'],
      name: 'Bob Smith',
      isGroup: false,
      lastMessage: 'Thanks for the update!',
      lastMessageTime: new Date(Date.now() - 3600000).toISOString(),
      unread: 0,
      pinned: true,
      archived: false,
      createdAt: new Date().toISOString()
    };

    const chat3 = {
      id: uuidv4(),
      participants: ['admin_001', 'user_003'],
      name: 'Carol White',
      isGroup: false,
      lastMessage: 'Love the new design!',
      lastMessageTime: new Date(Date.now() - 7200000).toISOString(),
      unread: 0,
      pinned: false,
      archived: false,
      createdAt: new Date().toISOString()
    };

    this.data.chats = [chat1, chat2, chat3];

    // Create messages
    this.data.messages[chat1.id] = [
      {
        id: uuidv4(),
        senderId: 'admin_001',
        text: 'Welcome to NEXORA CHQT! 🎉',
        type: 'text',
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        status: 'read',
        reactions: {},
        repliedTo: null,
        edited: false,
        deleted: false
      },
      {
        id: uuidv4(),
        senderId: 'admin_001',
        text: 'This is a fully working chat app!',
        type: 'text',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        status: 'read',
        reactions: {},
        repliedTo: null,
        edited: false,
        deleted: false
      },
      {
        id: uuidv4(),
        senderId: 'user_001',
        text: 'Hey! How are you doing?',
        type: 'text',
        timestamp: new Date(Date.now() - 1800000).toISOString(),
        status: 'delivered',
        reactions: {},
        repliedTo: null,
        edited: false,
        deleted: false
      }
    ];

    this.data.messages[chat2.id] = [
      {
        id: uuidv4(),
        senderId: 'admin_001',
        text: 'Hey Bob! How is the project going?',
        type: 'text',
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        status: 'read',
        reactions: {},
        repliedTo: null,
        edited: false,
        deleted: false
      },
      {
        id: uuidv4(),
        senderId: 'user_002',
        text: 'Thanks for the update!',
        type: 'text',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        status: 'read',
        reactions: {},
        repliedTo: null,
        edited: false,
        deleted: false
      }
    ];

    this.data.messages[chat3.id] = [
      {
        id: uuidv4(),
        senderId: 'user_003',
        text: 'Love the new design!',
        type: 'text',
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        status: 'read',
        reactions: {},
        repliedTo: null,
        edited: false,
        deleted: false
      }
    ];

    // Create a group
    const group = {
      id: uuidv4(),
      name: 'NEXORA Dev Team',
      photo: null,
      description: 'Official development team chat',
      creatorId: 'admin_001',
      members: ['admin_001', 'user_001', 'user_002', 'user_003'],
      admins: ['admin_001'],
      moderators: ['user_001'],
      isGroup: true,
      privacy: 'private',
      lastMessage: 'Great work everyone! 🚀',
      lastMessageTime: new Date(Date.now() - 600000).toISOString(),
      unread: 1,
      pinned: false,
      archived: false,
      createdAt: new Date().toISOString(),
      joinRequests: [],
      muted: false,
      announcements: [],
      polls: [],
      events: [],
      stats: {
        members: 4,
        messages: 15,
        activity: 'high'
      }
    };

    this.data.groups = [group];

    this.data.messages[group.id] = [
      {
        id: uuidv4(),
        senderId: 'admin_001',
        text: 'Welcome to the NEXORA Dev Team! 👋',
        type: 'text',
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        status: 'read',
        reactions: { '👋': 3 },
        repliedTo: null,
        edited: false,
        deleted: false
      },
      {
        id: uuidv4(),
        senderId: 'admin_001',
        text: 'Let\'s build something amazing! 🚀',
        type: 'text',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        status: 'read',
        reactions: { '🚀': 2 },
        repliedTo: null,
        edited: false,
        deleted: false
      },
      {
        id: uuidv4(),
        senderId: 'user_001',
        text: 'Great work everyone! 🎉',
        type: 'text',
        timestamp: new Date(Date.now() - 600000).toISOString(),
        status: 'delivered',
        reactions: {},
        repliedTo: null,
        edited: false,
        deleted: false
      }
    ];

    // Create a channel
    const channel = {
      id: uuidv4(),
      name: 'NEXORA Updates',
      description: 'Official channel for NEXORA news and updates',
      photo: null,
      coverImage: null,
      creatorId: 'admin_001',
      subscribers: ['admin_001', 'user_001', 'user_002', 'user_003'],
      isPrivate: false,
      category: 'Technology',
      verified: true,
      lastPost: 'New update coming soon!',
      lastPostTime: new Date().toISOString(),
      unread: 0,
      createdAt: new Date().toISOString(),
      posts: [],
      stats: {
        subscribers: 4,
        views: 156,
        posts: 3
      }
    };

    this.data.channels = [channel];

    this.data.messages[channel.id] = [
      {
        id: uuidv4(),
        senderId: 'admin_001',
        text: 'Welcome to the NEXORA Updates channel! 📢',
        type: 'text',
        timestamp: new Date(Date.now() - 172800000).toISOString(),
        status: 'read',
        reactions: {},
        repliedTo: null,
        edited: false,
        deleted: false
      },
      {
        id: uuidv4(),
        senderId: 'admin_001',
        text: 'We\'re launching new features soon! Stay tuned 🚀',
        type: 'text',
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        status: 'read',
        reactions: { '🔥': 2 },
        repliedTo: null,
        edited: false,
        deleted: false
      }
    ];

    // Create some notifications
    this.data.notifications = [
      {
        id: uuidv4(),
        type: 'message',
        title: 'New message from Alice',
        body: 'Hey! How are you doing?',
        read: false,
        timestamp: new Date(Date.now() - 1800000).toISOString(),
        data: { chatId: chat1.id }
      },
      {
        id: uuidv4(),
        type: 'group',
        title: 'New message in NEXORA Dev Team',
        body: 'Great work everyone! 🎉',
        read: false,
        timestamp: new Date(Date.now() - 600000).toISOString(),
        data: { groupId: group.id }
      }
    ];

    await this.saveData();
  }

  // ============ USER METHODS ============
  async createUser(data) {
    const existing = this.data.users.find(u => 
      u.email === data.email || u.phone === data.phone || u.username === data.username
    );
    if (existing) {
      return { success: false, message: 'User already exists' };
    }

    const user = {
      id: uuidv4(),
      displayName: data.displayName,
      username: data.username,
      email: data.email,
      phone: data.phone,
      password: data.password,
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

    this.data.users.push(user);
    this.data.analytics.totalUsers = this.data.users.length;
    this.data.analytics.activeUsers = this.data.users.filter(u => u.online).length;
    await this.saveData();

    // Generate OTP (simulated)
    const otp = Math.floor(100000 + Math.random() * 900000);
    console.log(`📱 OTP for ${data.email}: ${otp}`);

    return { success: true, user, otp };
  }

  async login(email, password) {
    const user = this.data.users.find(u => 
      (u.email === email || u.phone === email) && u.password === password
    );
    
    if (!user) {
      return { success: false, message: 'Invalid credentials' };
    }

    user.online = true;
    user.lastSeen = new Date().toISOString();
    this.data.analytics.activeUsers = this.data.users.filter(u => u.online).length;
    await this.saveData();

    const { password: _, ...userData } = user;
    return { success: true, user: userData, token: this.generateToken(user.id) };
  }

  async logout(userId) {
    const user = this.data.users.find(u => u.id === userId);
    if (user) {
      user.online = false;
      user.lastSeen = new Date().toISOString();
      this.data.analytics.activeUsers = this.data.users.filter(u => u.online).length;
      await this.saveData();
    }
    return { success: true };
  }

  generateToken(userId) {
    return `nexora_${userId}_${Date.now()}_${Math.random().toString(36).substring(7)}`;
  }

  async getUserById(id) {
    const user = this.data.users.find(u => u.id === id);
    if (user) {
      const { password, ...userData } = user;
      return userData;
    }
    return null;
  }

  async getUsers() {
    return this.data.users.map(({ password, ...user }) => user);
  }

  async searchUsers(query) {
    return this.data.users
      .filter(u => 
        u.displayName.toLowerCase().includes(query.toLowerCase()) ||
        u.username.toLowerCase().includes(query.toLowerCase()) ||
        u.email.toLowerCase().includes(query.toLowerCase()) ||
        u.phone.includes(query)
      )
      .map(({ password, ...user }) => user);
  }

  async updateUser(id, updates) {
    const index = this.data.users.findIndex(u => u.id === id);
    if (index === -1) return null;
    
    this.data.users[index] = { ...this.data.users[index], ...updates };
    await this.saveData();
    const { password, ...userData } = this.data.users[index];
    return userData;
  }

  async deleteUser(id) {
    this.data.users = this.data.users.filter(u => u.id !== id);
    this.data.analytics.totalUsers = this.data.users.length;
    this.data.analytics.activeUsers = this.data.users.filter(u => u.online).length;
    await this.saveData();
    return { success: true };
  }

  async blockUser(userId, blockedId) {
    if (!this.data.blockedUsers) this.data.blockedUsers = [];
    if (!this.data.blockedUsers.includes(blockedId)) {
      this.data.blockedUsers.push(blockedId);
      await this.saveData();
    }
    return { success: true };
  }

  async unblockUser(userId, blockedId) {
    if (this.data.blockedUsers) {
      this.data.blockedUsers = this.data.blockedUsers.filter(id => id !== blockedId);
      await this.saveData();
    }
    return { success: true };
  }

  // ============ CHAT METHODS ============
  async createChat(userId, otherUserId) {
    const existing = this.data.chats.find(c => 
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

    this.data.chats.push(chat);
    this.data.messages[chat.id] = [];
    await this.saveData();
    return chat;
  }

  async getChats(userId) {
    return this.data.chats
      .filter(c => c.participants.includes(userId) && !c.archived)
      .sort((a, b) => new Date(b.lastMessageTime || b.createdAt) - new Date(a.lastMessageTime || a.createdAt));
  }

  async getChatById(id) {
    return this.data.chats.find(c => c.id === id);
  }

  async sendMessage(chatId, senderId, text, type = 'text', replyTo = null) {
    const chat = await this.getChatById(chatId);
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

    if (!this.data.messages[chatId]) {
      this.data.messages[chatId] = [];
    }
    this.data.messages[chatId].push(message);

    // Update chat
    chat.lastMessage = text;
    chat.lastMessageTime = message.timestamp;
    chat.unread += 1;

    this.data.analytics.messagesSent += 1;
    await this.saveData();

    // Simulate delivery and read
    setTimeout(async () => {
      message.status = 'delivered';
      await this.saveData();
    }, 500);

    setTimeout(async () => {
      message.status = 'read';
      chat.unread = 0;
      await this.saveData();
    }, 2000);

    return message;
  }

  async getMessages(chatId) {
    return this.data.messages[chatId] || [];
  }

  async markAsRead(chatId, userId) {
    const chat = await this.getChatById(chatId);
    if (chat) {
      chat.unread = 0;
      await this.saveData();
    }

    if (this.data.messages[chatId]) {
      this.data.messages[chatId].forEach(m => {
        if (m.status !== 'read' && m.senderId !== userId) {
          m.status = 'read';
          if (!m.readBy) m.readBy = [];
          if (!m.readBy.includes(userId)) m.readBy.push(userId);
        }
      });
      await this.saveData();
    }
    return { success: true };
  }

  async deleteMessage(chatId, messageId, forEveryone = true) {
    if (!this.data.messages[chatId]) return { success: false };

    if (forEveryone) {
      this.data.messages[chatId] = this.data.messages[chatId].filter(m => m.id !== messageId);
    } else {
      const message = this.data.messages[chatId].find(m => m.id === messageId);
      if (message) message.deleted = true;
    }
    await this.saveData();
    return { success: true };
  }

  async editMessage(chatId, messageId, newText) {
    if (!this.data.messages[chatId]) return { success: false };

    const message = this.data.messages[chatId].find(m => m.id === messageId);
    if (message) {
      message.text = newText;
      message.edited = true;
      message.editedAt = new Date().toISOString();
      await this.saveData();
      return { success: true };
    }
    return { success: false };
  }

  async pinMessage(chatId, messageId) {
    if (!this.data.messages[chatId]) return { success: false };

    const message = this.data.messages[chatId].find(m => m.id === messageId);
    if (message) {
      message.pinned = !message.pinned;
      await this.saveData();
      return { success: true, pinned: message.pinned };
    }
    return { success: false };
  }

  async reactToMessage(chatId, messageId, emoji, userId) {
    if (!this.data.messages[chatId]) return { success: false };

    const message = this.data.messages[chatId].find(m => m.id === messageId);
    if (message) {
      if (!message.reactions) message.reactions = {};
      if (message.reactions[emoji]) {
        message.reactions[emoji] += 1;
      } else {
        message.reactions[emoji] = 1;
      }
      await this.saveData();
      return { success: true };
    }
    return { success: false };
  }

  async forwardMessage(chatId, messageId, targetChatId) {
    if (!this.data.messages[chatId]) return { success: false };

    const message = this.data.messages[chatId].find(m => m.id === messageId);
    if (message) {
      const forwarded = {
        ...message,
        id: uuidv4(),
        forwarded: true,
        originalSenderId: message.senderId,
        timestamp: new Date().toISOString()
      };
      
      if (!this.data.messages[targetChatId]) {
        this.data.messages[targetChatId] = [];
      }
      this.data.messages[targetChatId].push(forwarded);
      await this.saveData();
      return { success: true };
    }
    return { success: false };
  }

  // ============ GROUP METHODS ============
  async createGroup(name, creatorId, members = [], description = '') {
    const group = {
      id: uuidv4(),
      name,
      photo: null,
      description,
      creatorId,
      members: [creatorId, ...members],
      admins: [creatorId],
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

    this.data.groups.push(group);
    this.data.messages[group.id] = [];
    this.data
