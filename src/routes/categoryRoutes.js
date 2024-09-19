const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");
const authMiddleware = require("../middleware/authMiddleware");



// Solo los usuarios autenticados pueden crear, actualizar o eliminar categorias
router.post("/", authMiddleware, categoryController.createCategory);


module.exports = router;
