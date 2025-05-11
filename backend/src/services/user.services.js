const { db } = require("../config/db.config");
const bcrypt = require("bcrypt");

const getUserById = async (userId) => {
  try {
    const userDoc = await db.collection("users").doc(userId).get();
    
    if (!userDoc.exists) {
      return null;
    }
    
    return { id: userDoc.id, ...userDoc.data() };
  } catch (error) {
    throw new Error(`Error mendapatkan user: ${error.message}`);
  }
};

const updateUser = async (userId, updateData) => {
  try {
    const userRef = db.collection("users").doc(userId);
    
    const userDoc = await userRef.get();
    if (!userDoc.exists) {
      return null;
    }
    
    await userRef.update({
      ...updateData,
      updatedAt: new Date()
    });
    
    const updatedDoc = await userRef.get();
    const updatedUser = { id: updatedDoc.id, ...updatedDoc.data() };
    
    const { password, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  } catch (error) {
    throw new Error(`Error updating user: ${error.message}`);
  }
};

const changePassword = async (userId, currentPassword, newPassword) => {
  try {
    const user = await getUserById(userId);
    
    if (!user) {
      return { success: false, message: "User tidak ditemukan" };
    }
    
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    
    if (!isPasswordValid) {
      return { success: false, message: "Password saat ini salah" };
    }
    
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    await db.collection("users").doc(userId).update({
      password: hashedPassword,
      updatedAt: new Date()
    });
    
    return { success: true };
  } catch (error) {
    throw new Error(`Error changing password: ${error.message}`);
  }
};

const getAllStudents = async () => {
  try {
    const studentsSnapshot = await db.collection("users")
      .where("role", "==", "Siswa")
      .get();
    
    if (studentsSnapshot.empty) {
      return [];
    }
    
    const students = [];
    studentsSnapshot.forEach(doc => {
      const data = doc.data();
      const { password, ...studentWithoutPassword } = data;
      students.push({ id: doc.id, ...studentWithoutPassword });
    });
    
    return students;
  } catch (error) {
    throw new Error(`Error mendapatkan daftar siswa: ${error.message}`);
  }
};

const getAllUsers = async () => {
  try {
    const usersSnapshot = await db.collection("users").get();
    
    if (usersSnapshot.empty) {
      return [];
    }
    
    const users = [];
    usersSnapshot.forEach(doc => {
      const data = doc.data();
      const { password, ...userWithoutPassword } = data;
      users.push({ id: doc.id, ...userWithoutPassword });
    });
    
    return users;
  } catch (error) {
    throw new Error(`Error mendapatkan daftar users: ${error.message}`);
  }
};

module.exports = {
  getUserById,
  updateUser,
  changePassword,
  getAllStudents,
  getAllUsers
};