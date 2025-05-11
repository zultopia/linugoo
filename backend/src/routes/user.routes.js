const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const { verifyToken, checkRole } = require("../middlewares/auth.middleware");
const multer = require("multer");

// Configure multer for file upload
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, 
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("File harus berupa gambar"), false);
    }
  },
});

// GET /users/profile - Mendapatkan profil pengguna yang sedang login
router.get("/profile", verifyToken, userController.getProfile);

// PUT /users/profile - Update profil pengguna
router.put("/profile", verifyToken, userController.updateProfile);

// POST /users/upload-profile-image - Upload profile image
router.post(
  "/upload-profile-image", 
  verifyToken, 
  upload.single("profileImage"), 
  userController.uploadProfileImage
);

// POST /users/change-password - Change password
router.post("/change-password", verifyToken, userController.changePassword);

// GET /users/students - Mendapatkan semua siswa (hanya untuk Guru)
router.get("/students", verifyToken, checkRole(["Guru"]), userController.getAllStudents);

// GET /users - Mendapatkan semua pengguna
router.get("/", verifyToken, userController.getAllUsers);

module.exports = router;