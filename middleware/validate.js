// middleware/validate.js
exports.validateProduct = (req, res, next) => {
    // Your validation logic here
    next(); // Pass control to the next middleware
};