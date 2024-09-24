const Order = require("../models/OrderModel");
const User = require('../models/UserModel');

// Crear una nueva orden
exports.createOrder = async (req, res) => {
  try {
    const { user, products, totalPrice } = req.body;

    // Crear una nueva orden
    const newOrder = new Order({
      user,
      products,
      totalPrice,
      status: "pending", // Estado por defecto
    });

    // Guardar la orden en la base de datos
    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(500).json({ message: "Error al crear la orden", error });
  }
};

// Obtener todas las órdenes de un usuario
exports.getUserOrders = async (req, res) => {
  try {
    const userId = req.params.userId;
    
    // Buscar las órdenes del usuario
    const orders = await Order.find({ user: userId }).populate("products.product");

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener las órdenes", error });
  }
};

// Obtener una orden por su ID
exports.getOrderById = async (req, res) => {
  try {
    const orderId = req.params.id;
    
    // Buscar la orden por su ID
    const order = await Order.findById(orderId).populate("products.product").populate("user");
    
    if (!order) {
      return res.status(404).json({ message: "Orden no encontrada" });
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener la orden", error });
  }
};

// Actualizar el estado de una orden
exports.updateOrderStatus = async (req, res) => {
  try {
    const orderId = req.params.id;
    const { status, shippedAt } = req.body;

    // Actualizar la orden con el nuevo estado y fecha de envío
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status, shippedAt },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Orden no encontrada" });
    }

    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar la orden", error });
  }
};

// Eliminar una orden
exports.deleteOrder = async (req, res) => {
  try {
    const orderId = req.params.id;

    // Eliminar la orden
    const deletedOrder = await Order.findByIdAndDelete(orderId);

    if (!deletedOrder) {
      return res.status(404).json({ message: "Orden no encontrada" });
    }

    res.status(200).json({ message: "Orden eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar la orden", error });
  }
};
