const mongoose = require('mongoose');

// ==========================================
// 1. PASTE YOUR ENTIRE ATLAS LINK HERE
// (Make sure to replace <password> with your password!)
// ==========================================
const ATLAS_URI = 'mongodb+srv://tooba040:mongoatlas%2325@cluster0.3bifgjr.mongodb.net/inacad-fusion?appName=Cluster0';

const LOCAL_URI = 'mongodb://127.0.0.1:27017/inacad-fusion';

async function migrate() {
  if (!ATLAS_URI.includes('mongoatlas')) {
    console.log('❌ Please open migrate_db.js and paste your full Atlas link on line 6!');
    process.exit(1);
  }

  console.log('🔄 Connecting to Local Database...');
  const localDb = await mongoose.createConnection(LOCAL_URI).asPromise();

  console.log('☁️ Connecting to Cloud Database...');
  const cloudDb = await mongoose.createConnection(ATLAS_URI).asPromise();

  console.log('✅ Connected to both! Starting migration...');

  // Get all collections from local DB
  const collections = await localDb.db.listCollections().toArray();

  for (let col of collections) {
    const colName = col.name;
    console.log(`\n📦 Copying collection: ${colName}...`);

    // Read local data
    const data = await localDb.db.collection(colName).find({}).toArray();

    if (data.length > 0) {
      // Insert into cloud
      await cloudDb.db.collection(colName).insertMany(data);
      console.log(`   ✔️ Uploaded ${data.length} items to ${colName}`);
    } else {
      console.log(`   ⏭️ Skipped (Empty)`);
    }
  }

  console.log('\n🎉 ALL DONE! Your cloud database is fully set up!');
  process.exit(0);
}

migrate().catch(console.error);
