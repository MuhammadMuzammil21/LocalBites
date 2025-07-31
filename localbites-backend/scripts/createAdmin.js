const mongoose = require('mongoose');
const User = require('../src/models/User');
require('dotenv').config();

const createAdminUser = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@localbites.com' });
    if (existingAdmin) {
      console.log('❌ Admin user already exists with email: admin@localbites.com');
      console.log('You can login with:');
      console.log('Email: admin@localbites.com');
      console.log('Password: admin123');
      process.exit(0);
    }

    // Create admin user
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@localbites.com',
      password: 'admin123',
      role: 'ADMIN'
    });

    console.log('✅ Admin user created successfully!');
    console.log('Login credentials:');
    console.log('Email: admin@localbites.com');
    console.log('Password: admin123');
    console.log('Role: ADMIN');

  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

createAdminUser(); 