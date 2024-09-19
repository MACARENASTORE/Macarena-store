const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");
const authMiddleware = require("../middleware/authMiddleware");

// Crear reseña y obtener reseñas de un producto
router.post("/", authMiddleware, reviewController.createReview);
router.get("/:productId", reviewController.getReviewsByProduct);

// Eliminar reseña
router.delete("/:id", authMiddleware, reviewController.deleteReview);

module.exports = router;
