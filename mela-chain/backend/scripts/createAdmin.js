import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const createAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // Admin credentials
    const adminData = {
      email: 'melapay12@gmail.com',
      name: 'Mela Admin',
      password: '1122127',
      role: 'admin',
      isActive: true
    };

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminData.email });
    
    if (existingAdmin) {
      console.log('⚠️  Admin user already exists');
      console.log('Updating password...');
      
      existingAdmin.password = adminData.password;
      await existingAdmin.save();
      
      console.log('✅ Admin password updated successfully');
    } else {
      // Create new admin
      const admin = await User.create(adminData);
      console.log('✅ Admin user created successfully');
      console.log('📧 Email:', admin.email);
      console.log('👤 Name:', admin.name);
      console.log('🔑 Role:', admin.role);
    }

    console.log('\n🎉 Admin account ready!');
    console.log('Email: melapay12@gmail.com');
    console.log('Password: 1122127');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin:', error);
    process.exit(1);
  }
};

createAdmin();
