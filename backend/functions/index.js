const functions = require("firebase-functions");
const app = require("../app");

if (functions.config().client_url) {
  const corsMiddleware = app._router.stack.find(layer => layer.name === 'corsMiddleware');
  if (corsMiddleware) {
    corsMiddleware.handle.options.origin.push(functions.config().client_url);
  }
}

exports.api = functions.https.onRequest(app);