const admin = require("firebase-admin");
const fs = require("fs");
const path = require("path");

const serviceAccount = JSON.parse(
    fs.readFileSync(path.join(__dirname, "..", process.env.SERVICE_ACCOUNT), "utf8")
);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount) || {
        projectId: serviceAccount.project_id || process.env.FIREBASE_PROJECT_ID,
        clientEmail: serviceAccount.client_email || process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: serviceAccount.private_key.replace(/\\n/g, "\n") || process.env.FIREBASE_PRIVATE_KEY
    },
    databaseURL: "https://linugoo-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: serviceAccount.project_id || process.env.FIREBASE_PROJECT_ID,
    storageBucket: "linugoo.appspot.com"
});

const db = admin.firestore();
const storage = admin.storage();

module.exports = { db, storage };