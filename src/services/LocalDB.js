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
    await this.createDefaultAdmin();
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

  async createDefaultAdmin() {
    if (this.adminData.users.length > 0) return;

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

    this.adminData.users.push(admin);
    this.adminData.analytics.totalUsers = 1;
    this.adminData.analytics.activeUsers = 1;
    await this.saveAdminData();
  }

  // ============ USER SESSION MANAGEMENT ============
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
      
      // Update admin session tracking
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
      
      // Remove from admin sessions
      this.adminData.sessions = this.adminData.sessions.filter(s => s.userId !== userId);
      await this.saveAdminData();
      
      return true;
    } catch (error) {
      console.log('Error clearing user session:', error);
      return false;
    }
  }

  // ============ OTP MANAGEMENT ============
  async generateOTP(email, phone) {
    const otp = Math.floor(100000 + Math.random() * 900000);
    const expiresAt = new Date(Date.now() + 5 * 60000).toISOString(); // 5 minutes
    
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
    
    // Send real OTP via email (simulated)
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

  // ============ USER MANAGEMENT ============
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
      password: data.password,
      profileImage: data.profileImage || null,
      bio: '',
      status: 'Hey there! I am using NEXORA CHQT',
      verified: true,
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

    // Create user's local storage
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

  async login(phone, email, password) {
    // Find user by phone or email
    const user = this.adminData.users.find(u => 
      (u.phone === phone || u.email === email) && 
      u.password === password
    );
    
    if (!user) {
      return { success: false, message: 'Invalid credentials' };
    }

    // Check if user exists in admin panel
    const userExists = this.adminData.users.some(u => u.id === user.id);
    if (!userExists) {
      return { success: false, message: 'Account not found. Please create one first.' };
    }

    user.online = true;
    user.lastSeen = new Date().toISOString();
    this.adminData.analytics.activeUsers = this.adminData.users.filter(u => u.online).length;
    await this.saveAdminData();

    // Load user's session
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

    const { password: _, ...userDataWithoutPassword } = user;
    return { success: true, user: userDataWithoutPassword };
  }

  async checkUserExists(phone) {
    return this.adminData.users.some(u => u.phone === phone);
  }

  async getUserByPhone(phone) {
    const user = this.adminData.users.find(u => u.phone === phone);
    if (user) {
      const { password, ...userData } = user;
      return userData;
    }
    return null;
  }

  async getUserById(id) {
    const user = this.adminData.users.find(u => u.id === id);
    if (user) {
      const { password, ...userData } = user;
      return userData;
    }
    return null;
  }

  async getUsers() {
    return this.adminData.users.map(({ password, ...user }) => user);
  }

  // ============ CHAT METHODS (Per User) ============
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

    // Simulate delivery and read
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

  // ============ GROUP METHODS (Per User) ============
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

  // ============ CHANNEL METHODS (Per User) ============
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

  // ============ NOTIFICATION METHODS ============
  async addUserNotification(userId, notification) {
    const userData = await this.loadUserSession(userId);
    if (!userData) return null;

    if (!userData.notifications) userData.notifications = [];
    const notif = {
      id: uuidv4(),
      ...notification,
      read: false,
      timestamp: new Date().toISOString()
    };
    userData.notifications.unshift(notif);
    await this.saveUserSession(userId, userData);
    return notif;
  }

  // ============ SAVED MESSAGES ============
  async saveUserMessage(userId, message) {
    const userData = await this.loadUserSession(userId);
    if (!userData) return null;

    if (!userData.savedMessages) userData.savedMessages = [];
    const saved = {
      id: uuidv4(),
      message,
      savedAt: new Date().toISOString()
    };
    userData.savedMessages.push(saved);
    await this.saveUserSession(userId, userData);
    return saved;
  }

  // ============ ADMIN METHODS ============
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

  async getAllUsers() {
    return this.adminData.users.map(({ password, ...user }) => user);
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
    // Remove from admin
    this.adminData.users = this.adminData.users.filter(u => u.id !== userId);
    this.adminData.sessions = this.adminData.sessions.filter(s => s.userId !== userId);
    this.adminData.analytics.totalUsers = this.adminData.users.length;
    this.adminData.analytics.activeUsers = this.adminData.users.filter(u => u.online).length;
    await this.saveAdminData();

    // Remove user's data
    const key = `@nexora_user_${userId}`;
    await AsyncStorage.removeItem(key);
    
    return { success: true };
  }
}

export const db = new LocalDB();
