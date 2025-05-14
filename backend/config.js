const fs = require("fs");
const path = require("path");

let serviceAccount = {};
try {
  serviceAccount = JSON.parse(
    fs.readFileSync(path.join(__dirname, "..", process.env.SERVICE_ACCOUNT), "utf8")
  );
} catch (error) {
  console.error("Error reading service account file:", error.message);
  // Will fall back to environment variables
}

module.exports = {
  port: process.env.PORT || 5000,
  firebaseConfig: {
    credential: {
      projectId: serviceAccount.project_id || process.env.FIREBASE_PROJECT_ID,
      clientEmail: serviceAccount.client_email || process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: serviceAccount.private_key?.replace(/\\n/g, "\n") || process.env.FIREBASE_PRIVATE_KEY,
    },
    databaseURL: "https://linugoo-default-rtdb.asia-southeast1.firebasedatabase.app",
    storageBucket: "linugoo.appspot.com",
  },
  clientUrl: process.env.CLIENT_URL || (process.env.NODE_ENV === 'production' ? 'your-production-url' : 'http://localhost:5000'),
  corsOptions: {
    origin: process.env.CLIENT_URL || (process.env.NODE_ENV === 'production' ? 'your-production-url' : 'http://localhost:5000'),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
  },
}