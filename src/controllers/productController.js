// Importar los modelos y funciones necesarias
const Product = require('../models/ProductModel');
const Category = require('../models/CategoryModel');
const { getStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject } = require('firebase/storage');
const { initializeApp } = require('firebase/app');
const config = require('../config/firebase.config');

// Inicializar Firebase
initializeApp(config.firebaseConfig);
const storage = getStorage();

// Crear producto
exports.createProduct = async (req, res) => {
    try {
        const { name, description, price, category, stock } = req.body; // Obtener los datos del producto
        let imageUrl = []; // Inicializamos el array para almacenar las URLs de las imágenes

        // Verificamos si se ha subido una imagen
        if (req.file) {
            const file = req.file; // Obtenemos el archivo de la solicitud
            const fileName = `${Date.now()}_${file.originalname.replace(/\s+/g, "_")}`; // Creamos un nombre único para el archivo
            const fileRef = ref(storage, `products/${fileName}`); // Referencia a Firebase Storage
            const metadata = { contentType: file.mimetype }; // Metadatos del archivo

            // Subir la imagen a Firebase Storage
            const uploadTask = uploadBytesResumable(fileRef, file.buffer, metadata);

            // Esperar a que la imagen se suba y obtener la URL
            await new Promise((resolve, reject) => {
                uploadTask.on('state_changed', null, (error) => reject(error), async () => {
                    try {
                        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref); // Obtener URL de descarga
                        imageUrl.push(downloadURL); // Guardar la URL de la imagen en el array
                        resolve();
                    } catch (error) {
                        reject(error);
                    }
                });
            });
        }

        // Crear el producto con la información recibida
        const product = new Product({
            name,
            description,
            price,
            category,
            stock,
            image: imageUrl // Guardar la(s) URL(s) de la imagen
        });

        // Guardar el producto en la base de datos
        await product.save();
        res.status(201).json(product); // Responder con el producto creado
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error creando el producto", error });
    }
};

// Obtener todos los productos
exports.getAllProducts = async (req, res) => {
    try {
        // Buscar todos los productos en la base de datos
        const products = await Product.find().populate('category', 'name'); // Opción de obtener datos de la categoría
        res.status(200).json(products); // Responder con la lista de productos
    } catch (error) {
        res.status(500).json({ message: "Error obteniendo los productos", error });
    }
};

// Obtener un solo producto por ID
exports.getProductById = async (req, res) => {
    try {
        // Buscar el producto por su ID
        const product = await Product.findById(req.params.id).populate('category', 'name');
        if (!product) {
            return res.status(404).json({ message: "Producto no encontrado" }); // Si no se encuentra, responder con error 404
        }
        res.status(200).json(product); // Responder con el producto encontrado
    } catch (error) {
        res.status(500).json({ message: "Error obteniendo el producto", error });
    }
};

// Actualizar un producto
exports.updateProduct = async (req, res) => {
    try {
        const { name, description, price, category, stock } = req.body; // Desestructurar los datos enviados en la solicitud
        let imageUrl = [];

        // Si se sube una nueva imagen
        if (req.file) {
            const file = req.file;
            const fileName = `${Date.now()}_${file.originalname.replace(/\s+/g, "_")}`;
            const fileRef = ref(storage, `products/${fileName}`);
            const metadata = { contentType: file.mimetype };

            const uploadTask = uploadBytesResumable(fileRef, file.buffer, metadata);

            // Subir la nueva imagen a Firebase
            await new Promise((resolve, reject) => {
                uploadTask.on('state_changed', null, (error) => reject(error), async () => {
                    try {
                        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                        imageUrl.push(downloadURL); // Guardar la nueva URL de la imagen
                        resolve();
                    } catch (error) {
                        reject(error);
                    }
                });
            });
        }

        // Actualizar el producto con los nuevos datos (si no hay nueva imagen, se deja la original)
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            { 
                name, 
                description, 
                price, 
                category, 
                stock, 
                image: imageUrl.length > 0 ? imageUrl : undefined 
            },
            { new: true, runValidators: true } // Opciones: devuelve el nuevo documento y valida los campos
        );

        if (!updatedProduct) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }

        res.status(200).json(updatedProduct); // Responder con el producto actualizado
    } catch (error) {
        res.status(500).json({ message: "Error actualizando el producto", error });
    }
};

// Eliminar un producto
exports.deleteProduct = async (req, res) => {
    try {
        // Buscar el producto que se desea eliminar
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }

        // Opcional: eliminar la imagen asociada del producto en Firebase Storage
        if (product.image && product.image.length > 0) {
            const fileName = product.image[0].split('/').pop().split('?')[0];  // Extraer el nombre del archivo de la URL
            const fileRef = ref(storage, `products/${fileName}`);
            await deleteObject(fileRef);  // Eliminar la imagen de Firebase
        }

        // Eliminar el producto de la base de datos
        await product.remove();
        res.status(200).json({ message: "Producto eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ message: "Error eliminando el producto", error });
    }
};
