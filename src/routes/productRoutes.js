const express = require('express');
const ProductController = require('../controllers/productController');
const validate = require('../middlewares/validation');
const { productSchema } = require('../utils/schema');
const { authenticateToken, isAdmin } = require('../middlewares/auth');

const router = express.Router();

// GET routes - authenticated users can view
router.get('/', authenticateToken, ProductController.getAll);
router.get('/:id', authenticateToken, ProductController.getById);
router.get('/category/:kategori', authenticateToken, ProductController.getByCategory);

// POST, PUT, DELETE routes - admin only
router.post('/', authenticateToken, isAdmin, validate(productSchema), ProductController.create);
router.put('/:id', authenticateToken, isAdmin, validate(productSchema), ProductController.update);
router.delete('/:id', authenticateToken, isAdmin, ProductController.delete);

module.exports = router;
