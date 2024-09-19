// Importar el modelo de Order (Pedido)
const Order = require("../models/OrderModel");

// Función para crear un nuevo pedido
exports.createOrder = async (req, res) => {
  try {
    // Extraer los datos del cuerpo de la solicitud
    const { user, products, totalPrice } = req.body;
    
    // Crear una nueva instancia de Order con los datos proporcionados
    const order = new Order({ user, products, totalPrice });
    
    // Guardar el pedido en la base de datos
    await order.save();
    
    // Responder con un estado 201 (Creado) y el pedido creado
    res.status(201).json(order);
  } catch (error) {
    // Manejar errores en la creación del pedido y responder con un estado 500
    res.status(500).json({ message: "Error al crear el pedido", error });
  }
};

// Función para obtener un pedido por su ID
exports.getOrderById = async (req, res) => {
  try {
    // Buscar el pedido por su ID y poblar los campos de usuario y productos relacionados
    const order = await Order.findById(req.params.id).populate("user").populate("products.product");
    
    // Si no se encuentra el pedido, responder con un estado 404 (No encontrado)
    if (!order) {
      return res.status(404).json({ message: "Pedido no encontrado" });
    }
    
    // Responder con el pedido encontrado y un estado 200 (Éxito)
    res.status(200).json(order);
  } catch (error) {
    // Manejar errores al obtener el pedido y responder con un estado 500
    res.status(500).json({ message: "Error al obtener el pedido", error });
  }
};

// Función para actualizar el estado de un pedido por su ID
exports.updateOrderStatus = async (req, res) => {
  try {
    // Actualizar el estado del pedido basado en el ID del pedido y el nuevo estado proporcionado
    const order = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    
    // Si no se encuentra el pedido, responder con un estado 404 (No encontrado)
    if (!order) {
      return res.status(404).json({ message: "Pedido no encontrado" });
    }
    
    // Responder con el pedido actualizado y un estado 200 (Éxito)
    res.status(200).json(order);
  } catch (error) {
    // Manejar errores al actualizar el estado del pedido y responder con un estado 500
    res.status(500).json({ message: "Error al actualizar el estado del pedido", error });
  }
};

// Función para eliminar un pedido por su ID
exports.deleteOrder = async (req, res) => {
  try {
    // Buscar y eliminar el pedido por su ID
    await Order.findByIdAndDelete(req.params.id);
    
    // Responder con un estado 200 (Éxito) y un mensaje de eliminación exitosa
    res.status(200).json({ message: "Pedido eliminado con éxito" });
  } catch (error) {
    // Manejar errores al eliminar el pedido y responder con un estado 500
    res.status(500).json({ message: "Error al eliminar el pedido", error });
  }
};
