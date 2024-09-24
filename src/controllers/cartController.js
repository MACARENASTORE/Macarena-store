const Cart = require('../models/CartModel');
const mongoose = require('mongoose');
const Product = require('../models/ProductModel');
const User = require('../models/UserModel');

// Agregar producto al carrito
const addToCart = async (req, res) => {
    const { userId, productId, quantity } = req.body;
  console.log(req.body);
    // Validar ObjectId
    if (!mongoose.isValidObjectId(userId) || !mongoose.isValidObjectId(productId)) {
      return res.status(400).json({ message: "ID inválido para userId o productId" });
    }
  console.log("idvalido");
    // Validar cantidad
    if (quantity <= 0) {
      return res.status(400).json({ message: "La cantidad debe ser mayor a 0" });
    }
  
    try {
      // Verificar si el producto existe
      const productExists = await Product.findById(productId);
      if (!productExists) {
        return res.status(404).json({ message: "Producto no encontrado" });
      }
  
      // Buscar el carrito del usuario
      let cart = await Cart.findOne({ userId });
  
      if (!cart) {
        // Crear nuevo carrito si no existe
        cart = new Cart({
          userId,
          items: [{ productId, quantity }],
          totalPrice: productExists.price * quantity
        });
      } else {
        // Actualizar carrito existente
        const productIndex = cart.items.findIndex(p => p.productId.toString() === productId);
  
        if (productIndex > -1) {
          // Si el producto ya está en el carrito, actualizamos la cantidad y recalculamos el precio
          cart.items[productIndex].quantity += quantity;
        } else {
          // Si el producto no está, lo añadimos al carrito
          cart.items.push({ productId, quantity });
        }
  
        // Recalcular el precio total
        cart.totalPrice = cart.items.reduce((total, item) => {
          const itemProduct = productExists.price; // Usar el precio del producto
          return total + item.quantity * itemProduct;
        }, 0);
      }
  
      // Guardar el carrito
      await cart.save();
      res.status(201).json(cart);
    } catch (error) {
      res.status(500).json({ message: "Error al agregar producto al carrito", error });
    }}
// Obtener el carrito de un usuario
const getCartByUserId = async (req, res) => {
  const { userId } = req.params;

  try {
    const cart = await Cart.findOne({ userId }).populate('products.productId');

    if (!cart) {
      return res.status(404).json({ message: "Carrito no encontrado" });
    }

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el carrito", error });
  }
};

// Eliminar un producto del carrito
const removeFromCart = async (req, res) => {
  const { cartId, productId } = req.params;

  try {
    const cart = await Cart.findById(cartId);

    if (!cart) {
      return res.status(404).json({ message: "Carrito no encontrado" });
    }

    cart.products = cart.products.filter(p => p.productId.toString() !== productId);

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el producto del carrito", error });
  }
};

module.exports = { addToCart, getCartByUserId, removeFromCart };
