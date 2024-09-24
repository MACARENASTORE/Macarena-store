const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Ruta para registrar un nuevo usuario
router.post('/signup', authController.registerUser);

// Ruta para iniciar sesión
router.post('/login', authController.loginUser);

module.exports = router;
