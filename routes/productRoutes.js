const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { validateProduct } = require('../middleware/validate');
const multer = require('multer');
const Product = require('../models/product'); // Make sure this path is correct
const path = require('path');


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../uploads'));
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload an image file (jpg, jpeg, png)'));
        }
        cb(null, true);
    }
});

router.get('/products', productController.getAllProducts);
router.post('/products', validateProduct, productController.createProduct);
router.put('/products/:id', validateProduct, productController.updateProduct);
router.delete('/products/:id', productController.deleteProduct);

router.post('/products/:id/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded');
    }

    console.log('Uploaded file:', req.file);

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
