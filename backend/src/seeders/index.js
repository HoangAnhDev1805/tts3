require('dotenv').config();
const connectDB = require('../config/database');
const { User, PaymentPackage, PaymentMethod, WebsiteSetting, TelegramSetting } = require('../models');
const { ROLES, USER_STATUS } = require('../config/constants');

const seed = async () => {
  try {
    await connectDB();
    console.log('🌱 Starting seeding...');

    // Create admin user
    const adminExists = await User.findOne({ username: 'admin' });
    if (!adminExists) {
      await User.create({
        username: 'admin',
        password: 'admin123',
        email: 'admin@3daixs.com',
        fullName: 'Administrator',
        role: ROLES.ADMIN,
        status: USER_STATUS.ACTIVE,
        expiryDate: new Date('2099-12-31'),
      });
      console.log('✅ Admin user created (username: admin, password: admin123)');
    }

    // Create payment packages
    const packageCount = await PaymentPackage.countDocuments();
    if (packageCount === 0) {
      await PaymentPackage.insertMany([
        { name: '3 tháng', months: 3, price: 500000, description: 'Gói 3 tháng', isActive: true, order: 1 },
        { name: '6 tháng', months: 6, price: 900000, description: 'Gói 6 tháng', isActive: true, order: 2 },
        { name: '9 tháng', months: 9, price: 1200000, description: 'Gói 9 tháng', isActive: true, order: 3 },
        { name: '12 tháng', months: 12, price: 1500000, description: 'Gói 12 tháng', isActive: true, order: 4 },
      ]);
      console.log('✅ Payment packages created');
    }

    // Create payment methods
    const methodCount = await PaymentMethod.countDocuments();
    if (methodCount === 0) {
      await PaymentMethod.insertMany([
        {
          type: 'bank',
          bankName: 'Vietcombank',
          bankCode: 'VCB',
          accountNumber: '1234567890',
          accountName: 'NGUYEN VAN A',
          transferContent: 'MUA_[PHONE]',
          isActive: true,
          order: 1,
        },
      ]);
      console.log('✅ Payment methods created');
    }

    // Create website settings
    const settingExists = await WebsiteSetting.findOne();
    if (!settingExists) {
      await WebsiteSetting.create({
        title: '3DAIXS.COM - Hệ thống quản lý lô đề',
        description: 'Hệ thống quản lý và tính tiền lô đề chuyên nghiệp',
        keywords: ['lô đề', 'xổ số', 'quản lý'],
      });
      console.log('✅ Website settings created');
    }

    // Create telegram settings
    const telegramExists = await TelegramSetting.findOne();
    if (!telegramExists) {
      await TelegramSetting.create({ isActive: false });
      console.log('✅ Telegram settings created');
    }

    console.log('✅ Seeding completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

seed();
