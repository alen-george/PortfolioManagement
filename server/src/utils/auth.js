const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

// Password hashing
const hashPassword = async (password) => {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
};

// Password verification
const verifyPassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

// Generate JWT token
const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

// Verify JWT token
const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

// Generate session ID (UUID-like)
const generateSessionId = () => {
  return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
};

// Calculate token expiration time
const getTokenExpirationTime = () => {
  const expiresIn = JWT_EXPIRES_IN;
  const now = new Date();
  
  if (expiresIn.includes('h')) {
    const hours = parseInt(expiresIn);
    return new Date(now.getTime() + hours * 60 * 60 * 1000);
  } else if (expiresIn.includes('d')) {
    const days = parseInt(expiresIn);
    return new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
  } else if (expiresIn.includes('m')) {
    const minutes = parseInt(expiresIn);
    return new Date(now.getTime() + minutes * 60 * 1000);
  }
  
  // Default to 24 hours
  return new Date(now.getTime() + 24 * 60 * 60 * 1000);
};

module.exports = {
  hashPassword,
  verifyPassword,
  generateToken,
  verifyToken,
  generateSessionId,
  getTokenExpirationTime
}; 