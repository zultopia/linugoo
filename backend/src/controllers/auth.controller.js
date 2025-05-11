const authService = require("../services/auth.services");

const register = async (req, res) => {
  try {
    const { username, email, name, phone, password, role } = req.body;
    const validRole = ["Guru", "Siswa"].includes(role) ? role : "Siswa";
    const user = await authService.register(username, email, name, phone, password, validRole);
    res.status(201).json({ message: "Registrasi berhasil!", user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { emailOrUsername, password } = req.body;
    const result = await authService.login(emailOrUsername, password);
    res.json({ message: "Login berhasil!", ...result });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const logout = async (req, res) => {
  try {
    const userId = req.user.userId;
    const token = req.headers.authorization?.split(" ")[1];
    
    if (!token || !userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    await authService.logout(userId, token);
    
    res.status(200).json({ message: "Logout berhasil!" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ error: error.message || "Terjadi kesalahan saat logout" });
  }
};

module.exports = { register, login, logout };