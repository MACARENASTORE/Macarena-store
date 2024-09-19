const express = require('express');
const multer = require('multer');
const productController = require('../controllers/productController');

// Configurar multer para almacenar archivos en memoria
const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();

// Ruta para crear productos con imágenes
router.post("/", upload.single('image'), productController.createProduct);

module.exports = router;