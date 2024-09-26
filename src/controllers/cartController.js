const mongoose = require("mongoose");
const Product = require("../models/ProductModel");
const Cart = require("../models/CartModel");

// Agregar producto al carrito
const addToCart = async (req, res) => {
    const { userId, productId, quantity } = req.body;
    console.log(req.body);

    // Validar ObjectId
    if (!mongoose.isValidObjectId(userId) || !mongoose.isValidObjectId(productId)) {
        return res.status(400).json({ message: "ID inválido para userId o productId" });
    }
    console.log("ID válido");

    // Validar cantidad
    if (quantity <= 0) {
        return res.status(400).json({ message: "La cantidad debe ser mayor a 0" });
    }

    try {
        // Verificar si el producto existe
        const productExists = await Product.findById(productId);
        console.log(productExists);
        if (!productExists) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }

        // Buscar el carrito del usuario
        let cart = await Cart.findOne({ userId });
        console.log(cart);
        if (!cart) {
            // Crear nuevo carrito si no existe
            cart = new Cart({
                user: userId,
                items: [{ productId, quantity, price: productExists.price }],
                totalPrice: productExists.price * quantity
            });
            console.log(cart);
        } else {
            // Actualizar carrito existente
            const productIndex = cart.items.findIndex(p => p.productId.toString() === productId);

            if (productIndex > -1) {
                // Si el producto ya está en el carrito, actualizamos la cantidad
                cart.items[productIndex].quantity += quantity;
            } else {
                // Si el producto no está, lo añadimos al carrito
                cart.items.push({ productId, quantity, price: productExists.price });
            }
            
            // Recalcular el precio total
            cart.totalPrice = await cart.items.reduce(async (totalPromise, item) => {
                const total = await totalPromise; // Esperar el total acumulado
                const itemProduct = await Product.findById(item.productId);
                return total + item.quantity * itemProduct.price; // Usar el precio del producto correspondiente
            }, Promise.resolve(0)); // Inicializar el total en 0
        }
        console.log("creacion carrito", cart);

        // Guardar el carrito
        await cart.save();
        res.status(201).json(cart);
    } catch (error) {
        res.status(500).json({ message: "Error al agregar producto al carrito", error });
    }
};

// Obtener el carrito de un usuario
const getCartByUserId = async (req, res) => {
    const { userId } = req.params;
    console.log(req.params);
    try {
        const cart = await Cart.findOne({ user: userId }).populate('items.productId');
        console.log(cart)
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

        cart.items = cart.items.filter(p => p.productId.toString() !== productId);

        // Recalcular el precio total después de la eliminación
        cart.totalPrice = await cart.items.reduce(async (totalPromise, item) => {
            const total = await totalPromise; // Esperar el total acumulado
            const itemProduct = await Product.findById(item.productId);
            return total + item.quantity * itemProduct.price; // Usar el precio del producto correspondiente
        }, Promise.resolve(0)); // Inicializar el total en 0

        await cart.save();
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar el producto del carrito", error });
    }
};

// Obtener todos los carritos
const getAllCarts = async (req, res) => {
    try {
        // Buscar todos los carritos y poblar los productos
        const carts = await Cart.find().populate('items.productId');

        if (!carts || carts.length === 0) {
            return res.status(404).json({ message: "No se encontraron carritos" });
        }

        res.status(200).json(carts);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener los carritos", error });
    }
};

module.exports = { addToCart, getCartByUserId, removeFromCart, getAllCarts };
