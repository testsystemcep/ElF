const admin = require('firebase-admin');
const path = require('path');

// Path to your service account key file
// We use the one found in the project structure
const serviceAccount = require('../../App_Backend/notehub-11011-firebase-adminsdk-fbsvc-8635001523.json');

try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://notehub-11011-default-rtdb.asia-southeast1.firebasedatabase.app"
  });
  console.log('✅ Firebase Admin SDK initialized');
} catch (error) {
  console.error('❌ Firebase Admin initialization error:', error.message);
}

module.exports = admin;
