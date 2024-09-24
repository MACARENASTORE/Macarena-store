const Product = require('../models/ProductModel');
const { getStorage, ref, uploadBytesResumable, getDownloadURL } = require('firebase/storage');
const { initializeApp } = require('firebase/app');
const config = require('../config/firebase.config');

// Inicializar Firebase
initializeApp(config.firebaseConfig);
const storage = getStorage();

// Crear producto
exports.createProduct = async (req, res) => {
    try {
        const { name, description, price } = req.body;
        console.log(req.body);

        // Cargar imagen a Firebase Storage
        let imageUrl = [];

        if (req.file) {  // Cambiar a req.file si estás subiendo solo una imagen
            const file = req.file;
            const fileName = `${Date.now()}_${file.originalname.replace(/\s+/g, "_")}`;
            const fileRef = ref(storage, `products/${fileName}`);
            const metadata = { contentType: file.mimetype };
            console.log(fileName, fileRef, metadata);

            const uploadTask = uploadBytesResumable(fileRef, file.buffer, metadata);

            await new Promise((resolve, reject) => {
                uploadTask.on('state_changed', null, (error) => reject(error), async () => {
                    try {
                        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                        imageUrl.push(downloadURL);  // Agregar URL de la imagen a la lista
                        resolve();
                    } catch (error) {
                        reject(error);
                    }
                });
            });
        }

        // Crear nuevo producto
        const product = new Product({
            name,
            description,
            price,
            image: imageUrl // Esto es ahora un array que contendrá la URL de Firebase
        });

        await product.save();
        res.status(201).json(product);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error creando el producto", error });
    }
};

// Obtener todos los productos
exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: "Error obteniendo los productos", error });
    }
};

// Obtener un solo producto por ID
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: "Error obteniendo el producto", error });
    }
};

// Actualizar un producto
exports.updateProduct = async (req, res) => {
    try {
        const { name, description, price } = req.body;

        let imageUrl = [];
        if (req.file) {  // Si hay una nueva imagen
            const file = req.file;
            const fileName = `${Date.now()}_${file.originalname.replace(/\s+/g, "_")}`;
            const fileRef = ref(storage, `products/${fileName}`);
            const metadata = { contentType: file.mimetype };

            const uploadTask = uploadBytesResumable(fileRef, file.buffer, metadata);

            await new Promise((resolve, reject) => {
                uploadTask.on('state_changed', null, (error) => reject(error), async () => {
                    try {
                        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                        imageUrl.push(downloadURL);  // Agregar URL de la imagen
                        resolve();
                    } catch (error) {
                        reject(error);
                    }
                });
            });
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            { name, description, price, image: imageUrl.length > 0 ? imageUrl : undefined },
            { new: true, runValidators: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }

        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(500).json({ message: "Error actualizando el producto", error });
    }
};

// Eliminar un producto
exports.deleteProduct = async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);

        if (!deletedProduct) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }

        res.status(200).json({ message: "Producto eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ message: "Error eliminando el producto", error });
    }
};
