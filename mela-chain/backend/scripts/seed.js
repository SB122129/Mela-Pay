import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Course from '../models/Course.js';
import edxService from '../services/edxService.js';

dotenv.config();

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seed...');

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({});
    await Course.deleteMany({});
    console.log('✅ Existing data cleared');

    // Create admin user
    console.log('👤 Creating admin user...');
    const adminUser = new User({
      email: process.env.ADMIN_EMAIL || 'admin@melachain.com',
      name: 'Admin User',
      password: process.env.ADMIN_PASSWORD || 'admin123',
      role: 'admin'
    });
    await adminUser.save();
    console.log(`✅ Admin user created: ${adminUser.email}`);

    // Create test user
    const testUser = new User({
      email: 'user@test.com',
      name: 'Test User',
      password: 'test123',
      role: 'user'
    });
    await testUser.save();
    console.log(`✅ Test user created: ${testUser.email}`);

    // Sync courses from EdX
    console.log('📚 Syncing courses from EdX...');
    const syncResult = await edxService.syncCourses(20);
    if (syncResult.isMock) {
      console.log(`✅ Synced ${syncResult.synced} courses (mock EdX data)`);
    } else {
      console.log(`✅ Synced ${syncResult.synced} courses from EdX`);
    }

    // Add some additional mock courses if needed
    const courseCount = await Course.countDocuments();
    if (courseCount < 10) {
      console.log('📚 Adding additional mock courses...');
      const mockCourses = [
        {
          edxId: 'MELA-WEB3-101',
          title: 'Introduction to Web3 and Blockchain',
          description: 'Learn the fundamentals of blockchain technology and Web3 development.',
          imageUrl: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400',
          price: 99,
          priceInDOT: 18.0,
          institution: 'Mela Chain Academy',
          level: 'Beginner',
          duration: '4 weeks',
          language: 'English',
          subjects: ['Blockchain', 'Web3', 'Cryptocurrency'],
          edxUrl: 'https://www.edx.org/course/web3-blockchain',
          isActive: true
        },
        {
          edxId: 'MELA-POLKADOT-201',
          title: 'Polkadot Development Masterclass',
          description: 'Master Polkadot development with Substrate and build your own parachain.',
          imageUrl: 'https://images.unsplash.com/photo-1639322537228-f710d846310a?w=400',
          price: 199,
          priceInDOT: 36.18,
          institution: 'Polkadot Academy',
          level: 'Advanced',
          duration: '8 weeks',
          language: 'English',
          subjects: ['Polkadot', 'Substrate', 'Blockchain Development'],
          edxUrl: 'https://www.edx.org/course/polkadot-development',
          isActive: true
        },
        {
          edxId: 'MELA-SMART-301',
          title: 'Smart Contract Security',
          description: 'Learn to write secure smart contracts and identify common vulnerabilities.',
          imageUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400',
          price: 149,
          priceInDOT: 27.09,
          institution: 'Blockchain Security Institute',
          level: 'Intermediate',
          duration: '6 weeks',
          language: 'English',
          subjects: ['Smart Contracts', 'Security', 'Blockchain'],
          edxUrl: 'https://www.edx.org/course/smart-contract-security',
          isActive: true
        },
        {
          edxId: 'MELA-DEFI-401',
          title: 'DeFi Fundamentals',
          description: 'Understand decentralized finance protocols and build DeFi applications.',
          imageUrl: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=400',
          price: 179,
          priceInDOT: 32.55,
          institution: 'DeFi University',
          level: 'Intermediate',
          duration: '6 weeks',
          language: 'English',
          subjects: ['DeFi', 'Finance', 'Blockchain'],
          edxUrl: 'https://www.edx.org/course/defi-fundamentals',
          isActive: true
        },
        {
          edxId: 'MELA-NFT-501',
          title: 'NFT Creation and Marketing',
          description: 'Create, launch, and market your own NFT collection.',
          imageUrl: 'https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?w=400',
          price: 129,
          priceInDOT: 23.45,
          institution: 'Digital Art Academy',
          level: 'Beginner',
          duration: '4 weeks',
          language: 'English',
          subjects: ['NFT', 'Digital Art', 'Blockchain'],
          edxUrl: 'https://www.edx.org/course/nft-creation',
          isActive: true
        }
      ];

      for (const courseData of mockCourses) {
        const course = new Course(courseData);
        await course.save();
      }
      console.log(`✅ Added ${mockCourses.length} mock courses`);
    }

    const finalCourseCount = await Course.countDocuments();
    console.log(`\n📊 Database seeded successfully!`);
    console.log(`   - Users: 2 (1 admin, 1 test user)`);
    console.log(`   - Courses: ${finalCourseCount}`);
    console.log(`\n🔐 Admin Credentials:`);
    console.log(`   Email: ${adminUser.email}`);
    console.log(`   Password: ${process.env.ADMIN_PASSWORD || 'admin123'}`);
    console.log(`\n👤 Test User Credentials:`);
    console.log(`   Email: ${testUser.email}`);
    console.log(`   Password: test123`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
