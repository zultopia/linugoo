const admin = require("firebase-admin");

let serviceAccount = {};
try {
    serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_SDK || "{}");
} catch (err) {
    console.error("Invalid FIREBASE_ADMIN_SDK JSON:", err.message);
    serviceAccount = {};
}

const useEnvVars = Object.keys(serviceAccount).length === 0;

admin.initializeApp({
    credential: admin.credential.cert(useEnvVars ? {
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
    } : serviceAccount),
    databaseURL: "https://linugoo-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: "linugoo.appspot.com",
});

const db = admin.firestore();
const storage = admin.storage();

module.exports = { db, storage };
