const express = require('express');
const multer = require('multer');
const productController = require('../controllers/productController');

// Configurar multer para almacenar archivos en memoria
const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();

// Ruta para crear productos con imágenes
router.post("/", upload.single('image'), productController.createProduct);

// Ruta para obtener todos los productos
router.get("/", productController.getAllProducts);

// Ruta para obtener un producto por ID
router.get("/:id", productController.getProductById);

// Ruta para actualizar un producto por ID (con posibilidad de actualizar imagen)
router.put("/:id", upload.single('image'), productController.updateProduct);

// Ruta para eliminar un producto por ID
router.delete("/:id", productController.deleteProduct);

module.exports = router;
