const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
require('dotenv').config();

async function addAdmin() {
  await mongoose.connect(process.env.MONGO_URI);
  
  // Wipe out the existing botched admin so we can recreate it clean
  await User.deleteOne({ email: 'admin@inacadfusion.com' });

  const admin = new User({
    name: 'Platform Admin',
    email: 'admin@inacadfusion.com',
    password: 'admin123', // Let the User schema pre-save hook handle hashing
    role: 'admin',
    profileDetails: { industryDomain: 'Administration' }
  });

  await admin.save();
  console.log('Admin created: admin@inacadfusion.com / admin123');
  process.exit(0);
}

addAdmin();
