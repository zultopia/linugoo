const jwt = require("jsonwebtoken");
const { db } = require("../config/db.config");

// Middleware untuk verifikasi token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  
  if (!token) {
    return res.status(401).json({ message: "Token tidak ditemukan!" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token tidak valid!" });
  }
};

// Middleware untuk memeriksa role
const checkRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (roles.includes(req.user.role)) {
      next();
    } else {
      return res.status(403).json({ message: "Akses ditolak. Role tidak memiliki izin." });
    }
  };
};

const checkTokenBlacklist = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  
  if (!token) {
    return next();
  }
  
  try {
    // Periksa apakah token ada di blacklist
    const blacklistRef = db.collection("token_blacklist");
    const snapshot = await blacklistRef.where("token", "==", token).get();
    
    if (!snapshot.empty) {
      return res.status(401).json({ message: "Token tidak valid (telah logout)" });
    }
    
    next();
  } catch (error) {
    console.error("Error memeriksa token blacklist:", error);
    next();
  }
};

module.exports = { verifyToken, checkRole, checkTokenBlacklist };