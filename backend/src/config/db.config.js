const admin = require("firebase-admin");
const fs = require("fs");
const path = require("path");

let serviceAccount;
try {
    const serviceAccountPath = path.join(__dirname, "..", process.env.SERVICE_ACCOUNT);
    const rawData = fs.readFileSync(serviceAccountPath, "utf8");
    serviceAccount = JSON.parse(rawData);
} catch (error) {
    console.error("Error reading service account file:", error.message);
    serviceAccount = {};
}

admin.initializeApp({
    credential: admin.credential.cert({
        type: serviceAccount.type || process.env.FIREBASE_TYPE,
        projectId: serviceAccount.project_id || process.env.FIREBASE_PROJECT_ID,
        privateKeyId: serviceAccount.private_key_id || process.env.FIREBASE_PRIVATE_KEY_ID,
        privateKey: (serviceAccount.private_key ? serviceAccount.private_key.replace(/\\n/g, "\n") : null) || process.env.FIREBASE_PRIVATE_KEY,
        clientEmail: serviceAccount.client_email || process.env.FIREBASE_CLIENT_EMAIL,
        clientId: serviceAccount.client_id || process.env.FIREBASE_CLIENT_ID,
        authUri: serviceAccount.auth_uri || process.env.FIREBASE_AUTH_URI,
        tokenUri: serviceAccount.token_uri || process.env.FIREBASE_TOKEN_URI,
        authProviderX509CertUrl: serviceAccount.auth_provider_x509_cert_url || process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
        clientX509CertUrl: serviceAccount.client_x509_cert_url || process.env.FIREBASE_CLIENT_X509_CERT_URL,
        universeDomain: serviceAccount.universe_domain || process.env.FIREBASE_UNIVERSE_DOMAIN
    }),
    databaseURL: "https://linugoo-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: serviceAccount.project_id || process.env.FIREBASE_PROJECT_ID,
    storageBucket: "linugoo.appspot.com"
});

const db = admin.firestore();
const storage = admin.storage();

module.exports = { db, storage };