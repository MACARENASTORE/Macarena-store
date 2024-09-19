const jwt = require('jsonwebtoken');

// Secret para JWT, asegúrate de definirlo en tu archivo .env
const JWT_SECRET = process.env.JWT_SECRET || 'mysecretkey';

// Función para generar un token JWT
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '1h' });
};

// Función para verificar un token JWT
const verifyToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        reject(err);
      } else {
        resolve(decoded);
      }
    });
  });
};

module.exports = {
  generateToken,
  verifyToken
};