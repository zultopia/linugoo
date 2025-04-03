const authService = require("../services/auth.services");

const register = async (req, res) => {
  try {
    const { username, email, name, phone, password } = req.body;
    const user = await authService.register(username, email, name, phone, password);
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

module.exports = { register, login };