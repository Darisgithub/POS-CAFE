const Joi = require('joi');

const productSchema = Joi.object({
    nama_produk: Joi.string().required(),
    kategori: Joi.string().valid('makanan_berat', 'makanan_ringan', 'minuman').required(),
    harga: Joi.number().positive().required(),
    stok: Joi.number().integer().min(0).required(),
    deskripsi: Joi.string().allow('', null)
});

const transactionSchema = Joi.object({
    items: Joi.array().items(
        Joi.object({
            product_id: Joi.number().integer().required(),
            qty: Joi.number().integer().min(1).required()
        })
    ).min(1).required(),
    metode_pembayaran: Joi.string().valid('cash', 'qris', 'debit').required()
});

const registerSchema = Joi.object({
    name: Joi.string().min(3).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid('admin', 'user').optional()
});

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});

module.exports = {
    productSchema,
    transactionSchema,
    registerSchema,
    loginSchema
};
