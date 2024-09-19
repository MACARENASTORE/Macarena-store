const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const authMiddleware = require("../middleware/authMiddleware");

// Crear un pedido y obtener detalles de un pedido (protegidas)
router.post("/", authMiddleware, orderController.createOrder);
router.get("/:id", authMiddleware, orderController.getOrderById);

// Actualizar el estado de un pedido (protegido)
router.put("/:id/status", authMiddleware, orderController.updateOrderStatus);

// Eliminar un pedido
router.delete("/:id", authMiddleware, orderController.deleteOrder);

module.exports = router;
