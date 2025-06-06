const { db } = require("../config/db.config");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const register = async (username, email, name, phone, password, role = "Siswa") => {
  const usersRef = db.collection("users");

  // Cek apakah username atau email sudah terdaftar
  const existingUser = await usersRef
    .where("email", "==", email)
    .get();

  if (!existingUser.empty) {
    throw new Error("Email sudah terdaftar!");
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Buat user baru
  const newUserRef = usersRef.doc();
  const newUser = new User(
    newUserRef.id,
    username,
    email,
    name,
    phone,
    hashedPassword,
    role // Tambahkan role saat membuat User baru
  );

  await newUserRef.set({ ...newUser });
  return { id: newUserRef.id, username, email, name, phone, role };
};

const login = async (emailOrUsername, password) => {
  const usersRef = db.collection("users");

  const userSnapshot = await usersRef
    .where("email", "==", emailOrUsername)
    .get();

  if (userSnapshot.empty) {
    throw new Error("User tidak ditemukan!");
  }

  const userData = userSnapshot.docs[0].data();
  const userId = userSnapshot.docs[0].id;

  const passwordMatch = await bcrypt.compare(password, userData.password);
  if (!passwordMatch) {
    throw new Error("Password salah!");
  }

  const token = jwt.sign(
    { 
      userId, 
      email: userData.email,
      role: userData.role 
    }, 
    process.env.JWT_SECRET, 
    {
      expiresIn: "1h",
    }
  );

  return { 
    token, 
    user: { 
      id: userId, 
      email: userData.email, 
      username: userData.username,
      role: userData.role
    } 
  };
};

const logout = async (userId, token) => {
  try {
    const blacklistRef = db.collection("token_blacklist");
    await blacklistRef.add({
      token,
      userId,
      blacklistedAt: new Date(),
      expiresAt: new Date(Date.now() + 3600 * 1000) 
    });
    
    return { success: true };
  } catch (error) {
    console.error("Error saat logout:", error);
    throw new Error("Gagal melakukan logout");
  }
};

module.exports = { register, login, logout };