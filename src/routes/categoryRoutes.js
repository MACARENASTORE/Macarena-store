const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");
const verifyToken = require("../middleware/authMiddleware");

// Crear una nueva categoría (solo usuarios autenticados)
router.post("/", verifyToken, categoryController.createCategory);

// Obtener todas las categorías (no requiere autenticación)
router.get("/", categoryController.getAllCategories);

// Obtener una categoría por ID (no requiere autenticación)
router.get("/:id", categoryController.getCategoryById);

// Actualizar una categoría (solo usuarios autenticados)
router.put("/:id", verifyToken, categoryController.updateCategory);

// Eliminar una categoría (solo usuarios autenticados)
router.delete("/:id", verifyToken, categoryController.deleteCategory);

module.exports = router;
