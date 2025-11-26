-- Reset Database Script
-- Jalankan script ini di MySQL untuk hapus semua data

USE cafe_pos_db;

-- Hapus semua data (tapi table tetap ada)
TRUNCATE TABLE transaction_items;
TRUNCATE TABLE transactions;
TRUNCATE TABLE products;
TRUNCATE TABLE users;

-- Atau hapus database sepenuhnya (akan dibuat ulang saat server start)
-- DROP DATABASE cafe_pos_db;

SELECT 'Database berhasil di-reset!' as status;
