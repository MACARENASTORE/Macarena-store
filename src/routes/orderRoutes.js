const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const verifyToken = require('../middleware/authMiddleware'); // Middleware de autenticación

// Ruta para crear una nueva orden
router.post("/", verifyToken, orderController.createOrder);



module.exports = router;
