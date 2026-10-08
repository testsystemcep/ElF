const jwt = require('jsonwebtoken');
const { sendResponse } = require('../utils/response');

const JWT_SECRET = process.env.JWT_SECRET || 'notehub_super_secret_key_2025';

// Supports Admin JWT (Admin Panel)
const verifyUniversalToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return sendResponse(res, 401, false, "Unauthorized: No token provided");
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.admin = decoded; 
    // Set req.user for general access with fallback for uid
    req.user = { 
        uid: decoded.id || decoded.uid, 
        username: decoded.username, 
        role: decoded.role 
    };
    return next();
  } catch (err) {
    return sendResponse(res, 401, false, `Unauthorized: Invalid or expired token`);
  }
};

module.exports = { verifyUniversalToken };
