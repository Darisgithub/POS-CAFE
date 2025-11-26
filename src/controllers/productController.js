const ProductService = require('../services/productService');

const ProductController = {
    getAll: async (req, res, next) => {
        try {
            const products = await ProductService.getAllProducts();
            res.json(products);
        } catch (error) {
            next(error);
        }
    },

    getById: async (req, res, next) => {
        try {
            const product = await ProductService.getProductById(req.params.id);
            res.json(product);
        } catch (error) {
            if (error.message === 'Product not found') {
                return res.status(404).json({ error: error.message });
            }
            next(error);
        }
    },

    getByCategory: async (req, res, next) => {
        try {
            const products = await ProductService.getProductsByCategory(req.params.kategori);
            res.json(products);
        } catch (error) {
            next(error);
        }
    },

    create: async (req, res, next) => {
        try {
            const product = await ProductService.createProduct(req.body);
            res.status(201).json(product);
        } catch (error) {
            next(error);
        }
    },

    update: async (req, res, next) => {
        try {
            const product = await ProductService.updateProduct(req.params.id, req.body);
            res.json(product);
        } catch (error) {
            if (error.message === 'Product not found') {
                return res.status(404).json({ error: error.message });
            }
            next(error);
        }
    },

    delete: async (req, res, next) => {
        try {
            await ProductService.deleteProduct(req.params.id);
            res.status(204).send();
        } catch (error) {
            if (error.message === 'Product not found') {
                return res.status(404).json({ error: error.message });
            }
            next(error);
        }
    }
};

module.exports = ProductController;
