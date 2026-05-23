const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

async function fixAdmin() {
  await mongoose.connect(process.env.MONGO_URI);
  
  // Delete the incorrect admin
  await User.deleteMany({ email: 'admin@inacadfusion.com' });

  // Create new admin with plain text password (pre-save hook will hash it)
  const admin = new User({
    name: 'Platform Admin',
    email: 'admin@inacadfusion.com',
    password: 'admin123',
    role: 'admin',
    domain: 'Administration'
  });

  await admin.save();
  console.log('Admin recreated successfully!');
  process.exit(0);
}

fixAdmin();
