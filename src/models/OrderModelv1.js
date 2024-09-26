const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  products: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
    }
  ],
  totalPrice: { type: Number, required: true },
  status: { type: String, enum: ["pending", "shipped", "delivered", "cancelled"], default: "pending" },
  createdAt: { type: Date, default: Date.now },
  shippedAt: { type: Date },
  // Puedes agregar un campo que referencie el carrito si deseas tener esa relación
  cart: { type: mongoose.Schema.Types.ObjectId, ref: "Cart" } // opcional
});

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
