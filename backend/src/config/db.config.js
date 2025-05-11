const admin = require("firebase-admin");
const serviceAccount = require("../linugoo-firebase-adminsdk-fbsvc-1f5c5beacb.json"); 

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://linugoo-default-rtdb.asia-southeast1.firebasedatabase.app",
    storageBucket: "linugoo.appspot.com"
});

const db = admin.firestore();
const storage = admin.storage();

module.exports = { db, storage };