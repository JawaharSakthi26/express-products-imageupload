const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    description: {
        type: String,
        maxlength: 500
    },
    imageUrl: {
        type: String
    }
});

module.exports = mongoose.model('Product', productSchema);
