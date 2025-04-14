const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const { verifyToken, checkRole } = require("../middlewares/auth.middleware");

// GET /users/profile - Mendapatkan profil pengguna yang sedang login
router.get("/profile", verifyToken, userController.getProfile);

// GET /users/students - Mendapatkan semua siswa (hanya untuk Guru)
router.get("/students", verifyToken, checkRole(["Guru"]), userController.getAllStudents);

// GET /users - Mendapatkan semua pengguna
router.get("/", verifyToken, userController.getAllUsers);

module.exports = router;