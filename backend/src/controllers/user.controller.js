const userService = require("../services/user.services");
const { db, storage } = require("../config/db.config");
const multer = require("multer");
const path = require("path");

const getProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await userService.getUserById(userId);
    
    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    const { password, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { name, email, phone, username } = req.body;
    
    if (!name && !email && !phone && !username) {
      return res.status(400).json({ message: "Tidak ada data yang diupdate" });
    }
    
    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (phone) updateData.phone = phone;
    if (username) updateData.username = username;
    
    const updatedUser = await userService.updateUser(userId, updateData);
    
    if (!updatedUser) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }
    
    res.json({ 
      message: "Profile berhasil diupdate", 
      user: updatedUser 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const uploadProfileImage = async (req, res) => {
  try {
    const userId = req.user.userId;
    
    if (!req.file) {
      return res.status(400).json({ message: "Tidak ada file yang diupload" });
    }
    
    const fileName = `profile-images/${userId}-${Date.now()}${path.extname(req.file.originalname)}`;
    const bucket = storage.bucket();
    const file = bucket.file(fileName);
    
    const stream = file.createWriteStream({
      metadata: {
        contentType: req.file.mimetype,
      },
    });
    
    stream.on('error', (error) => {
      console.error('Upload error:', error);
      res.status(500).json({ error: "Gagal upload gambar" });
    });
    
    stream.on('finish', async () => {
      await file.makePublic();
      
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
      
      const updatedUser = await userService.updateUser(userId, { 
        profileImage: publicUrl 
      });
      
      res.json({ 
        message: "Profile image berhasil diupload", 
        imageUrl: publicUrl,
        user: updatedUser
      });
    });
    
    stream.end(req.file.buffer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const changePassword = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ 
        message: "Current password dan new password harus diisi" 
      });
    }
    
    const result = await userService.changePassword(userId, currentPassword, newPassword);
    
    if (!result.success) {
      return res.status(400).json({ message: result.message });
    }
    
    res.json({ message: "Password berhasil diubah" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllStudents = async (req, res) => {
  try {
    const students = await userService.getAllStudents();
    res.json({ students });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.json({ users });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { 
  getProfile, 
  updateProfile,
  uploadProfileImage,
  changePassword,
  getAllStudents, 
  getAllUsers 
};