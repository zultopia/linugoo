const admin = require("firebase-admin");
const fs = require("fs");
const path = require("path");

const serviceAccount = JSON.parse(
    fs.readFileSync(path.join(__dirname, "..", process.env.SERVICE_ACCOUNT), "utf8")
);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://linugoo-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: serviceAccount.project_id,
    storageBucket: "linugoo.appspot.com"
});

const db = admin.firestore();
const storage = admin.storage();

module.exports = { db, storage };