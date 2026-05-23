const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  const admins = await User.find({ role: 'admin' });
  console.log('Admins found:', admins);
  process.exit(0);
}
run();
