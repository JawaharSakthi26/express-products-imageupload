const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { validateProduct } = require('../middleware/validate');
const multer = require('multer');
const Product = require('../models/product'); // Make sure this path is correct
const path = require('path');


// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Set the destination for file uploads
        cb(null, path.join(__dirname, '../uploads')); // Ensure this path is correct
    },
    filename: function (req, file, cb) {
        // Set the filename for the uploaded file
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage, // Add storage configuration
    limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5 MB
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload an image file (jpg, jpeg, png)'));
        }
        cb(null, true);
    }
});

// CRUD Operations
router.get('/products', productController.getAllProducts);
router.post('/products', validateProduct, productController.createProduct);
router.put('/products/:id', validateProduct, productController.updateProduct);
router.delete('/products/:id', productController.deleteProduct);

// File Upload
router.post('/products/:id/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded');
    }

    console.log('Uploaded file:', req.file); // Debugging line

    const imageUrl = `/uploads/${req.file.originalname}`;

    Product.findByIdAndUpdate(req.params.id, { imageUrl }, { new: true })
        .then(product => {
            if (!product) {
                return res.status(404).send('Product not found');
            }
            res.status(200).json(product);
        })
        .catch(err => res.status(500).json({ error: err.message }));
});

module.exports = router;
