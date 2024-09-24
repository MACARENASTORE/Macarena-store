const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");
const verifyToken = require('../middleware/authMiddleware'); // Middleware de autenticación

// Crear reseña y obtener reseñas de un producto
router.post("/", verifyToken, reviewController.createReview);
router.get("/:productId", verifyToken, reviewController.getReviewsByProduct);

// Eliminar reseña
router.delete("/:id", verifyToken, reviewController.deleteReview);

module.exports = router;
