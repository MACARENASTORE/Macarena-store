const express = require('express');
const { addToCart, getCartByUserId, removeFromCart } = require('../controllers/cartController');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware'); // Middleware de autenticación



// Ruta para agregar un producto al carrito
router.post('/add', verifyToken, addToCart);

// Ruta para obtener el carrito de un usuario
router.get('/:userId', verifyToken, getCartByUserId);

// Ruta para eliminar un producto del carrito
router.delete('/:cartId/:productId', verifyToken, removeFromCart);

module.exports = router;
