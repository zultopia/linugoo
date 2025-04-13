const userService = require("../services/user.services");

// Get profile pengguna yang sedang login
const getProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await userService.getUserById(userId);
    
    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }
    
    // Hapus password dari response
    const { password, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get semua siswa (hanya bisa diakses oleh Guru)
const getAllStudents = async (req, res) => {
  try {
    const students = await userService.getAllStudents();
    res.json({ students });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get semua users (untuk admin)
const getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.json({ users });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getProfile, getAllStudents, getAllUsers };