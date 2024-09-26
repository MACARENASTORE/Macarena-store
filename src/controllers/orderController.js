const Order = require("../models/OrderModel");
const Cart = require("../models/CartModel");
const User = require("../models/UserModel");

// Crear una nueva orden desde el carrito
exports.createOrder = async (req, res) => {
  try {
    const { userId } = req.body;
    console.log(req.body);
    // Obtener el carrito del usuario
    const cart = await Cart.findOne({ user: userId }).populate("items.productId");
    console.log(cart);
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "El carrito está vacío" });
    }

    // Calcular el precio total
    const totalPrice = cart.items.reduce((total, item) => {
      return total + (item.productId.price * item.quantity);
    }, 0);

    // Crear una nueva orden
    const newOrder = new Order({
      user: userId,
      products: cart.items.map(item => ({
        productId: item.productId._id, // Asegúrate de usar el _id del producto
        quantity: item.quantity,
        price: item.price
      })),
      totalPrice,
      status: "pending",
    });

    // Guardar la orden
    const savedOrder = await newOrder.save();

    // Vaciar el carrito después de crear la orden
    await Cart.findOneAndUpdate({ user: userId }, { items: [] });

    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(500).json({ message: "Error al crear la orden", error });
  }
};
