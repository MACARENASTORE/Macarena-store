const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const upload = require('../config/multerConfig');

// Solo los usuarios autenticados pueden crear productos
router.post("/", upload.single('image'), productController.createProduct);

module.exports = router;
