const { pool } = require('../config/database');

const ProductModel = {
    findAll: async () => {
        const [rows] = await pool.query('SELECT * FROM products');
        return rows;
    },

    findById: async (id) => {
        const [rows] = await pool.query('SELECT * FROM products WHERE id = ?', [id]);
        return rows[0];
    },

    findByCategory: async (category) => {
        const [rows] = await pool.query('SELECT * FROM products WHERE kategori = ?', [category]);
        return rows;
    },

    create: async (data) => {
        const { nama_produk, kategori, harga, stok, deskripsi } = data;
        const [result] = await pool.query(
            'INSERT INTO products (nama_produk, kategori, harga, stok, deskripsi) VALUES (?, ?, ?, ?, ?)',
            [nama_produk, kategori, harga, stok, deskripsi]
        );
        return { id: result.insertId, ...data };
    },

    update: async (id, data) => {
        const { nama_produk, kategori, harga, stok, deskripsi } = data;
        await pool.query(
            'UPDATE products SET nama_produk = ?, kategori = ?, harga = ?, stok = ?, deskripsi = ? WHERE id = ?',
            [nama_produk, kategori, harga, stok, deskripsi, id]
        );
        return { id, ...data };
    },

    delete: async (id) => {
        await pool.query('DELETE FROM products WHERE id = ?', [id]);
        return { id };
    },

    // Helper to check stock
    checkStock: async (id) => {
        const [rows] = await pool.query('SELECT stok, harga FROM products WHERE id = ?', [id]);
        return rows[0];
    },

    decreaseStock: async (connection, id, qty) => {
        await connection.query('UPDATE products SET stok = stok - ? WHERE id = ?', [qty, id]);
    }
};

module.exports = ProductModel;
