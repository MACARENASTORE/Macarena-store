const Product = require('../models/ProductModel');
const { getStorage, ref, uploadBytesResumable, getDownloadURL } = require('firebase/storage');
const { initializeApp } = require('firebase/app');
const config = require('../config/firebase.config');

// Inicializar Firebase
initializeApp(config.firebaseConfig);
const storage = getStorage();

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