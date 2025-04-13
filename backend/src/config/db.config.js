const admin = require("firebase-admin");
const serviceAccount = require("../linugoo-firebase-adminsdk-fbsvc-75068bd32b.json"); // Pastikan file ini ada!

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://linugoo-default-rtdb.asia-southeast1.firebasedatabase.app"
});
const db = admin.firestore();

module.exports = { db };