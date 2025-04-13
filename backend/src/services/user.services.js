const { db } = require("../config/db.config");

// Mendapatkan user berdasarkan ID
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

// Mendapatkan semua siswa
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
      // Hilangkan password dari data yang dikembalikan
      const { password, ...studentWithoutPassword } = data;
      students.push({ id: doc.id, ...studentWithoutPassword });
    });
    
    return students;
  } catch (error) {
    throw new Error(`Error mendapatkan daftar siswa: ${error.message}`);
  }
};

// Mendapatkan semua users
const getAllUsers = async () => {
  try {
    const usersSnapshot = await db.collection("users").get();
    
    if (usersSnapshot.empty) {
      return [];
    }
    
    const users = [];
    usersSnapshot.forEach(doc => {
      const data = doc.data();
      // Hilangkan password dari data yang dikembalikan
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
  getAllStudents,
  getAllUsers
};