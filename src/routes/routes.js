const express = require('express');
const router = express.Router();

// Importar los controladores de rutas
const authRoutes = require('./authRoutes');
const productRoutes = require('./productRoutes');
const orderRoutes = require('./orderRoutes');
const reviewRoutes = require('./reviewRoutes');
const categoryRoutes = require('./categoryRoutes');


// Importar el middleware de autenticación
const authMiddleware = require('../middleware/authMiddleware');

// Definir las rutas para la API
router.use('/auth', authRoutes);               // Rutas de autenticación
router.use('/products', productRoutes);        // Rutas para productos
router.use('/category', categoryRoutes);       // Rutas para categorías
router.use('/orders', authMiddleware, orderRoutes);  // Rutas de órdenes (protegidas)
router.use('/reviews', reviewRoutes);          // Rutas para comentarios/reviews
   

module.exports = router;
