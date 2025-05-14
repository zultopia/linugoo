const fs = require("fs");
const path = require("path");

let serviceAccount = {};
try {
  serviceAccount = JSON.parse(
    fs.readFileSync(path.join(__dirname, "..", process.env.SERVICE_ACCOUNT), "utf8")
  );
} catch (error) {
  console.error("Error reading service account file:", error.message);
  serviceAccount = {};
}

const useEnvVars = Object.keys(serviceAccount).length === 0;

module.exports = {
  port: process.env.PORT || 5000,
  firebaseConfig: {
    credential: useEnvVars ? {
      type: process.env.FIREBASE_TYPE,
      projectId: process.env.FIREBASE_PROJECT_ID,
      privateKeyId: process.env.FIREBASE_PRIVATE_KEY_ID,
      privateKey: (process.env.FIREBASE_PRIVATE_KEY || "").replace(/\\n/g, "\n"),
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      clientId: process.env.FIREBASE_CLIENT_ID,
      authUri: process.env.FIREBASE_AUTH_URI,
      tokenUri: process.env.FIREBASE_TOKEN_URI,
      authProviderX509CertUrl: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
      clientX509CertUrl: process.env.FIREBASE_CLIENT_X509_CERT_URL,
      universeDomain: process.env.FIREBASE_UNIVERSE_DOMAIN,
    } : serviceAccount,
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
};