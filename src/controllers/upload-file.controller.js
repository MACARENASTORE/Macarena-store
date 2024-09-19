const express = require("express");
const { initializeApp } = require("firebase/app");
const { getStorage, ref, getDownloadURL, uploadBytesResumable } = require("firebase/storage");
const multer = require("multer");
const config = require("../config/firebase.config");

const router = express.Router();

// Initialize Firebase
initializeApp(config.firebaseConfig);

// Initialize Cloud Storage and get a reference to the service
const storage = getStorage();

// Setting up multer as a middleware to handle file uploads
const upload = multer({ storage: multer.memoryStorage() });

router.post("/", upload.single("filename"), async (req, res) => {
    try {
        const dateTime = giveCurrentDateTime();
        const storageRef = ref(storage, `files/${req.file.originalname} ${dateTime}`);

        // Create file metadata
        const metadata = {
            contentType: req.file.mimetype,
        };

        // Upload file
        const snapshot = await uploadBytesResumable(storageRef, req.file.buffer, metadata);

        // Get download URL
        const downloadURL = await getDownloadURL(snapshot.ref);

        console.log('File successfully uploaded.');
        return res.send({
            message: 'File uploaded to Firebase Storage',
            name: req.file.originalname,
            type: req.file.mimetype,
            downloadURL: downloadURL
        });
    } catch (error) {
        return res.status(400).send(error.message);
    }
});

const giveCurrentDateTime = () => {
    const today = new Date();
    const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    return `${date} ${time}`;
}

module.exports = router;
