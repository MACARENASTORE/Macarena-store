// models/ProductModel.js

const mongoose = require('mongoose');

// Definimos el esquema para un producto
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'El nombre del producto es requerido'],
      
    },
    price: {
      type: Number,
      required: [true, 'El precio del producto es requerido'],
      min: [0, 'El precio no puede ser negativo'],
    },
    description: {
      type: String,
      required: [true, 'La descripción es requerida'],
      maxlength: [500, 'La descripción no puede exceder los 500 caracteres'],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: false,
    },
    stock: {
      type: Number,
      required: [false, 'El stock del producto es requerido'],
      //min: [0, 'El stock no puede ser negativo'],
    },
    image: [
      {
        url: {
          type: String,
          required: true,
        },
        public_id: {
          type: String,
          required: true,
        },
      },
    ],
    
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  
);

// Creando el modelo del producto basado en el esquema
const Product = mongoose.model('Product', productSchema);

module.exports = Product;
