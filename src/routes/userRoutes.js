const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const verifyToken = require('../middleware/authMiddleware'); // Middleware de autenticación

// Ruta para obtener el perfil del usuario autenticado
router.get('/profile', verifyToken, userController.getProfile);

// Ruta para actualizar el perfil del usuario autenticado
router.put('/profile', verifyToken, userController.updateProfile);

// Ruta para eliminar la cuenta del usuario autenticado
router.delete('/profile', verifyToken, userController.deleteUser);

module.exports = router;
