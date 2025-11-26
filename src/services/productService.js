const ProductModel = require('../models/productModel');

const ProductService = {
    getAllProducts: async () => {
        return await ProductModel.findAll();
    },

    getProductById: async (id) => {
        const product = await ProductModel.findById(id);
        if (!product) {
            throw new Error('Product not found');
        }
        return product;
    },

    getProductsByCategory: async (category) => {
        return await ProductModel.findByCategory(category);
    },

    createProduct: async (data) => {
        return await ProductModel.create(data);
    },

    updateProduct: async (id, data) => {
        const product = await ProductModel.findById(id);
        if (!product) {
            throw new Error('Product not found');
        }
        return await ProductModel.update(id, data);
    },

    deleteProduct: async (id) => {
        const product = await ProductModel.findById(id);
        if (!product) {
            throw new Error('Product not found');
        }
        return await ProductModel.delete(id);
    }
};

module.exports = ProductService;
