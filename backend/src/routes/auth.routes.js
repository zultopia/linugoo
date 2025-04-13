const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const { verifyToken } = require("../middlewares/auth.middleware");

// POST /auth/register
router.post("/register", authController.register);
router.post('/login', authController.login);
router.post('/logout', verifyToken, authController.logout);

module.exports = router;