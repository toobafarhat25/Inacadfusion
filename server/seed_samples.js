const mongoose = require('mongoose');
const User = require('./models/User');
const Project = require('./models/Project');
require('dotenv').config();

async function seedSamples() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    // Wipe just in case to prevent dupes during test
    await User.deleteMany({ email: { $in: ['test_startup@test.com', 'test_student@test.com'] } });
    await Project.deleteMany({ title: 'Test Seed Project' });

    const startup = await User.create({
      name: 'Test Startup',
      email: 'test_startup@test.com',
      password: 'password123',
      role: 'startup',
      profileDetails: { industryDomain: 'AI Tech' }
    });

    const student = await User.create({
      name: 'Test Student',
      email: 'test_student@test.com',
      password: 'password123',
      role: 'student',
      profileDetails: { academicBackground: 'CS', skills: ['React', 'Node.js'] }
    });

    await Project.create({
      title: 'Test Seed Project',
      description: 'A sample project to test the admin dashboard metrics',
      domain: 'Web Development',
      type: 'startup_idea',
      requiredSkills: ['React', 'Node.js'],
      uploadedBy: startup._id,
      status: 'active'
    });

    console.log("Seeded basic dummy data! The admin dashboard will now have stats > 0.");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seedSamples();
