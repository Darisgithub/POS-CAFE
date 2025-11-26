const { pool } = require('../config/database');

const TransactionModel = {
    findAll: async () => {
        const [rows] = await pool.query(`
      SELECT t.*, 
      JSON_ARRAYAGG(
        JSON_OBJECT(
          'product_id', ti.product_id,
          'nama_produk', p.nama_produk,
          'qty', ti.qty,
          'subtotal', ti.subtotal
        )
      ) as items
      FROM transactions t
      LEFT JOIN transaction_items ti ON t.id = ti.transaction_id
      LEFT JOIN products p ON ti.product_id = p.id
      GROUP BY t.id
      ORDER BY t.created_at DESC
    `);
        return rows;
    },

    findById: async (id) => {
        const [rows] = await pool.query(`
      SELECT t.*, 
      JSON_ARRAYAGG(
        JSON_OBJECT(
          'product_id', ti.product_id,
          'nama_produk', p.nama_produk,
          'qty', ti.qty,
          'subtotal', ti.subtotal
        )
      ) as items
      FROM transactions t
      LEFT JOIN transaction_items ti ON t.id = ti.transaction_id
      LEFT JOIN products p ON ti.product_id = p.id
      WHERE t.id = ?
      GROUP BY t.id
    `, [id]);
        return rows[0];
    },

    create: async (data) => {
        const { items, metode_pembayaran } = data;
        const connection = await pool.getConnection();

        try {
            await connection.beginTransaction();

            let total_harga = 0;
            const processedItems = [];

            // 1. Validate stock and calculate total
            for (const item of items) {
                const [products] = await connection.query('SELECT * FROM products WHERE id = ? FOR UPDATE', [item.product_id]);
                if (products.length === 0) {
                    throw new Error(`Product with ID ${item.product_id} not found`);
                }
                const product = products[0];

                if (product.stok < item.qty) {
                    throw new Error(`Insufficient stock for product ${product.nama_produk} (ID: ${item.product_id})`);
                }

                const subtotal = product.harga * item.qty;
                total_harga += subtotal;

                processedItems.push({
                    product_id: item.product_id,
                    qty: item.qty,
                    subtotal: subtotal
                });
            }

            // 2. Create Transaction
            const [transResult] = await connection.query(
                'INSERT INTO transactions (total_harga, metode_pembayaran) VALUES (?, ?)',
                [total_harga, metode_pembayaran]
            );
            const transactionId = transResult.insertId;

            // 3. Create Transaction Items and Update Stock
            for (const item of processedItems) {
                await connection.query(
                    'INSERT INTO transaction_items (transaction_id, product_id, qty, subtotal) VALUES (?, ?, ?, ?)',
                    [transactionId, item.product_id, item.qty, item.subtotal]
                );

                await connection.query(
                    'UPDATE products SET stok = stok - ? WHERE id = ?',
                    [item.qty, item.product_id]
                );
            }

            await connection.commit();

            return {
                id_transaksi: transactionId,
                total_harga,
                metode_pembayaran,
                items: processedItems,
                timestamp: new Date()
            };

        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }
};

module.exports = TransactionModel;
