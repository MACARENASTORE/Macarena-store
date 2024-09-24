const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const verifyToken = require('../middleware/authMiddleware'); // Middleware de autenticación

// Ruta para crear una nueva orden
router.post("/", verifyToken, orderController.createOrder);

// Ruta para obtener todas las órdenes de un usuario
router.get("/user/:userId", verifyToken, orderController.getUserOrders);

// Ruta para obtener una orden específica por su ID
router.get("/:id", verifyToken, orderController.getOrderById);

// Ruta para actualizar el estado de una orden (por ejemplo, cambiar a "shipped" o "delivered")
router.put("/:id", verifyToken, orderController.updateOrderStatus);

// Ruta para eliminar una orden
router.delete("/:id", verifyToken, orderController.deleteOrder);

module.exports = router;
