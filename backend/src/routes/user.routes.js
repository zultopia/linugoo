const express = require("express");
const router = express.Router();

// Contoh endpoint
router.get("/", (req, res) => {
  res.send("User Route is working!");
});

module.exports = router; // Pastikan ini adalah `router`