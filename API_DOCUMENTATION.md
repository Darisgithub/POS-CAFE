# 📚 Dokumentasi API - Sistem POS Cafe

## 📋 Daftar Isi
1. [Informasi Umum](#informasi-umum)
2. [Setup & Instalasi](#setup--instalasi)
3. [Authentication & Authorization](#authentication--authorization)
4. [API Authentication](#api-authentication)
5. [API Products](#api-products)
6. [API Transactions](#api-transactions)
7. [Error Handling](#error-handling)
8. [Contoh Penggunaan dengan Postman](#contoh-penggunaan-dengan-postman)

---

## Informasi Umum

**Base URL:** `http://localhost:3000`

**Format Response:** JSON

**Port Default:** 3000 (dapat diubah di file `.env`)

---

## Setup & Instalasi

### 1. Install Dependencies
```bash
npm install
```

### 2. Konfigurasi Database
Buat file `.env` di root project dengan isi:
```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=cafe_pos_db

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=24h
```

**⚠️ PENTING:** Untuk production, ganti `JWT_SECRET` dengan random string yang aman!

### 3. Jalankan Server
```bash
# Development mode dengan auto-reload
npm run dev

# Production mode
npm start
```

### 4. Verifikasi Server Berjalan
Buka browser atau Postman, akses:
```
GET http://localhost:3000/
```

Response yang diharapkan:
```json
{
  "message": "Cafe POS System API is running"
}
```

---

## Authentication & Authorization

Sistem POS ini menggunakan **JWT (JSON Web Token)** untuk autentikasi dan **role-based access control** untuk otorisasi.

### Role & Permissions

#### 🔵 User (Kasir)
**Akses:**
- ✅ Login & Register
- ✅ Lihat produk (GET products, GET by ID, GET by category)
- ✅ Buat transaksi (POST transactions)
- ❌ Tidak bisa CRUD produk
- ❌ Tidak bisa lihat semua transaksi

#### 🔴 Admin
**Akses:**
- ✅ Semua akses User
- ✅ CRUD Produk (Create, Update, Delete products)
- ✅ Lihat semua transaksi
- ✅ Lihat semua users

### Cara Menggunakan Token

Setelah login atau register, Anda akan mendapatkan **JWT token**. Token ini harus disertakan di setiap request ke endpoint yang dilindungi.

**Format Header:**
```
Authorization: Bearer <your-jwt-token>
```

**Contoh:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Di Postman:**
1. Pilih tab **Authorization**
2. Type: **Bearer Token**
3. Paste token Anda di field **Token**

---

## API Authentication

### 1. Register User Baru

**Endpoint:** `POST /auth/register`

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "user"
}
```

**Field Explanation:**
- `name` (required): Nama lengkap (minimal 3 karakter)
- `email` (required): Email valid dan unik
- `password` (required): Password (minimal 6 karakter)
- `role` (optional): Pilihan: `user` atau `admin`. Default: `user`

**Response Success (201 Created):**
```json
{
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJqb2huQGV4YW1wbGUuY29tIiwicm9sZSI6InVzZXIiLCJpYXQiOjE3MzI2MTAzMzUsImV4cCI6MTczMjY5NjczNX0.abc123..."
  }
}
```

**Response Error - Email sudah terdaftar (400):**
```json
{
  "message": "Email already registered"
}
```

**Contoh Register Admin:**
```json
{
  "name": "Admin User",
  "email": "admin@cafe.com",
  "password": "admin123",
  "role": "admin"
}
```

---

### 2. Login

**Endpoint:** `POST /auth/login`

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Field Explanation:**
- `email` (required): Email yang terdaftar
- `password` (required): Password user

**Response Success (200 OK):**
```json
{
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJqb2huQGV4YW1wbGUuY29tIiwicm9sZSI6InVzZXIiLCJpYXQiOjE3MzI2MTAzMzUsImV4cCI6MTczMjY5NjczNX0.abc123..."
  }
}
```

**Response Error - Invalid credentials (401):**
```json
{
  "message": "Invalid email or password"
}
```

**💡 Tips:** Simpan token yang diterima untuk digunakan di request selanjutnya!

---

### 3. Get Profile (Protected)

**Endpoint:** `GET /auth/profile`

**Headers:**
```
Authorization: Bearer <your-jwt-token>
```

**Response Success (200 OK):**
```json
{
  "message": "Profile retrieved successfully",
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "created_at": "2025-11-26T06:30:00.000Z"
  }
}
```

**Response Error - No token (401):**
```json
{
  "message": "Access token required"
}
```

**Response Error - Invalid token (403):**
```json
{
  "message": "Invalid token"
}
```

---

### 4. Get All Users (Admin Only)

**Endpoint:** `GET /auth/users`

**Headers:**
```
Authorization: Bearer <admin-jwt-token>
```

**Response Success (200 OK):**
```json
{
  "message": "Users retrieved successfully",
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "created_at": "2025-11-26T06:30:00.000Z"
    },
    {
      "id": 2,
      "name": "Admin User",
      "email": "admin@cafe.com",
      "role": "admin",
      "created_at": "2025-11-26T06:31:00.000Z"
    }
  ]
}
```

**Response Error - Not Admin (403):**
```json
{
  "message": "Access denied. Admin privileges required."
}
```

---

## API Products

**🔒 Semua endpoint products memerlukan autentikasi (token JWT)**

### 1. Tambah Produk Baru (Create) - Admin Only

**Endpoint:** `POST /products`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer <admin-token>
```

**Request Body:**
```json
{
  "nama_produk": "Nasi Goreng Spesial",
  "kategori": "makanan_berat",
  "harga": 25000,
  "stok": 50,
  "deskripsi": "Nasi goreng dengan telur, ayam, dan sayuran"
}
```

**Field Explanation:**
- `nama_produk` (required): Nama produk
- `kategori` (required): Pilihan: `makanan_berat`, `makanan_ringan`, atau `minuman`
- `harga` (required): Harga produk (harus positif)
- `stok` (required): Jumlah stok (minimal 0)
- `deskripsi` (optional): Deskripsi produk

**Response Success (201 Created):**
```json
{
  "message": "Product created successfully",
  "data": {
    "id": 1,
    "nama_produk": "Nasi Goreng Spesial",
    "kategori": "makanan_berat",
    "harga": 25000,
    "stok": 50,
    "deskripsi": "Nasi goreng dengan telur, ayam, dan sayuran",
    "created_at": "2025-11-26T06:16:35.000Z",
    "updated_at": "2025-11-26T06:16:35.000Z"
  }
}
```

**Contoh Tambahan:**
```json
// Makanan Ringan
{
  "nama_produk": "Kentang Goreng",
  "kategori": "makanan_ringan",
  "harga": 15000,
  "stok": 100,
  "deskripsi": "Kentang goreng crispy"
}

// Minuman
{
  "nama_produk": "Es Teh Manis",
  "kategori": "minuman",
  "harga": 5000,
  "stok": 200,
  "deskripsi": ""
}
```

---

### 2. Ambil Semua Produk (Get All) - Authenticated Users

**Endpoint:** `GET /products`

**Headers:**
```
Authorization: Bearer <your-token>
```

**Request:** Tidak perlu body

**Response Success (200 OK):**
```json
{
  "message": "Products retrieved successfully",
  "data": [
    {
      "id": 1,
      "nama_produk": "Nasi Goreng Spesial",
      "kategori": "makanan_berat",
      "harga": 25000,
      "stok": 50,
      "deskripsi": "Nasi goreng dengan telur, ayam, dan sayuran",
      "created_at": "2025-11-26T06:16:35.000Z",
      "updated_at": "2025-11-26T06:16:35.000Z"
    },
    {
      "id": 2,
      "nama_produk": "Kentang Goreng",
      "kategori": "makanan_ringan",
      "harga": 15000,
      "stok": 100,
      "deskripsi": "Kentang goreng crispy",
      "created_at": "2025-11-26T06:17:10.000Z",
      "updated_at": "2025-11-26T06:17:10.000Z"
    }
  ]
}
```

---

### 3. Ambil Produk Berdasarkan ID (Get by ID) - Authenticated Users

**Endpoint:** `GET /products/:id`

**Headers:**
```
Authorization: Bearer <your-token>
```

**Contoh:** `GET /products/1`

**Response Success (200 OK):**
```json
{
  "message": "Product retrieved successfully",
  "data": {
    "id": 1,
    "nama_produk": "Nasi Goreng Spesial",
    "kategori": "makanan_berat",
    "harga": 25000,
    "stok": 50,
    "deskripsi": "Nasi goreng dengan telur, ayam, dan sayuran",
    "created_at": "2025-11-26T06:16:35.000Z",
    "updated_at": "2025-11-26T06:16:35.000Z"
  }
}
```

**Response Error (404 Not Found):**
```json
{
  "message": "Product not found"
}
```

---

### 4. Ambil Produk Berdasarkan Kategori (Get by Category) - Authenticated Users

**Endpoint:** `GET /products/category/:kategori`

**Headers:**
```
Authorization: Bearer <your-token>
```

**Kategori yang tersedia:**
- `makanan_berat`
- `makanan_ringan`
- `minuman`

**Contoh:** `GET /products/category/makanan_berat`

**Response Success (200 OK):**
```json
{
  "message": "Products retrieved successfully",
  "data": [
    {
      "id": 1,
      "nama_produk": "Nasi Goreng Spesial",
      "kategori": "makanan_berat",
      "harga": 25000,
      "stok": 50,
      "deskripsi": "Nasi goreng dengan telur, ayam, dan sayuran",
      "created_at": "2025-11-26T06:16:35.000Z",
      "updated_at": "2025-11-26T06:16:35.000Z"
    }
  ]
}
```

---

### 5. Update Produk (Update) - Admin Only

**Endpoint:** `PUT /products/:id`

**Contoh:** `PUT /products/1`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer <admin-token>
```

**Request Body:**
```json
{
  "nama_produk": "Nasi Goreng Spesial Premium",
  "kategori": "makanan_berat",
  "harga": 30000,
  "stok": 45,
  "deskripsi": "Nasi goreng dengan telur, ayam, udang, dan sayuran"
}
```

**Response Success (200 OK):**
```json
{
  "message": "Product updated successfully",
  "data": {
    "id": 1,
    "nama_produk": "Nasi Goreng Spesial Premium",
    "kategori": "makanan_berat",
    "harga": 30000,
    "stok": 45,
    "deskripsi": "Nasi goreng dengan telur, ayam, udang, dan sayuran",
    "created_at": "2025-11-26T06:16:35.000Z",
    "updated_at": "2025-11-26T06:20:10.000Z"
  }
}
```

---

### 6. Hapus Produk (Delete) - Admin Only

**Endpoint:** `DELETE /products/:id`

**Headers:**
```
Authorization: Bearer <admin-token>
```

**Contoh:** `DELETE /products/1`

**Response Success (200 OK):**
```json
{
  "message": "Product deleted successfully"
}
```

**Response Error (404 Not Found):**
```json
{
  "message": "Product not found"
}
```

---

## API Transactions

**🔒 Semua endpoint transactions memerlukan autentikasi**

### 1. Buat Transaksi Baru (Create Transaction) - All Authenticated Users

**Endpoint:** `POST /transactions`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer <your-token>
```

**Request Body:**
```json
{
  "items": [
    {
      "product_id": 1,
      "qty": 2
    },
    {
      "product_id": 2,
      "qty": 1
    }
  ],
  "metode_pembayaran": "cash"
}
```

**Field Explanation:**
- `items` (required): Array berisi produk yang dibeli
  - `product_id` (required): ID produk
  - `qty` (required): Jumlah yang dibeli (minimal 1)
- `metode_pembayaran` (required): Pilihan: `cash`, `qris`, atau `debit`

**Response Success (201 Created):**
```json
{
  "message": "Transaction created successfully",
  "data": {
    "transaction_id": 1,
    "total_harga": 65000,
    "metode_pembayaran": "cash",
    "created_at": "2025-11-26T06:25:30.000Z",
    "items": [
      {
        "product_id": 1,
        "nama_produk": "Nasi Goreng Spesial",
        "qty": 2,
        "harga": 25000,
        "subtotal": 50000
      },
      {
        "product_id": 2,
        "nama_produk": "Kentang Goreng",
        "qty": 1,
        "harga": 15000,
        "subtotal": 15000
      }
    ]
  }
}
```

**Catatan Penting:**
- Stok produk akan otomatis dikurangi sesuai qty yang dibeli
- Jika stok tidak mencukupi, transaksi akan gagal

**Response Error - Stok Tidak Cukup (400 Bad Request):**
```json
{
  "message": "Insufficient stock for product: Nasi Goreng Spesial. Available: 5, Requested: 10"
}
```

**Contoh Metode Pembayaran Lain:**
```json
// QRIS
{
  "items": [
    {
      "product_id": 3,
      "qty": 2
    }
  ],
  "metode_pembayaran": "qris"
}

// Debit
{
  "items": [
    {
      "product_id": 1,
      "qty": 1
    }
  ],
  "metode_pembayaran": "debit"
}
```

---

### 2. Ambil Semua Transaksi (Get All Transactions) - Admin Only

**Endpoint:** `GET /transactions`

**Headers:**
```
Authorization: Bearer <admin-token>
```

**Request:** Tidak perlu body

**Response Success (200 OK):**
```json
{
  "message": "Transactions retrieved successfully",
  "data": [
    {
      "id": 1,
      "total_harga": 65000,
      "metode_pembayaran": "cash",
      "created_at": "2025-11-26T06:25:30.000Z",
      "items": [
        {
          "id": 1,
          "transaction_id": 1,
          "product_id": 1,
          "qty": 2,
          "subtotal": 50000
        },
        {
          "id": 2,
          "transaction_id": 1,
          "product_id": 2,
          "qty": 1,
          "subtotal": 15000
        }
      ]
    }
  ]
}
```

---

### 3. Ambil Transaksi Berdasarkan ID (Get Transaction by ID) - Admin Only

**Endpoint:** `GET /transactions/:id`

**Headers:**
```
Authorization: Bearer <admin-token>
```

**Contoh:** `GET /transactions/1`

**Response Success (200 OK):**
```json
{
  "message": "Transaction retrieved successfully",
  "data": {
    "id": 1,
    "total_harga": 65000,
    "metode_pembayaran": "cash",
    "created_at": "2025-11-26T06:25:30.000Z",
    "items": [
      {
        "id": 1,
        "transaction_id": 1,
        "product_id": 1,
        "qty": 2,
        "subtotal": 50000
      },
      {
        "id": 2,
        "transaction_id": 1,
        "product_id": 2,
        "qty": 1,
        "subtotal": 15000
      }
    ]
  }
}
```

**Response Error (404 Not Found):**
```json
{
  "message": "Transaction not found"
}
```

---

## Error Handling

### Format Error Response

Semua error akan mengembalikan response dalam format:

```json
{
  "message": "Pesan error yang jelas"
}
```

### Status Code yang Digunakan

| Status Code | Keterangan |
|-------------|------------|
| 200 | OK - Request berhasil |
| 201 | Created - Data berhasil dibuat |
| 400 | Bad Request - Input tidak valid |
| 401 | Unauthorized - Token tidak ada atau tidak valid |
| 403 | Forbidden - Akses ditolak (no permission) |
| 404 | Not Found - Data tidak ditemukan |
| 500 | Internal Server Error - Error pada server |

### Contoh Error Authentication (401 Unauthorized)

```json
{
  "message": "Access token required"
}
```

```json
{
  "message": "Invalid email or password"
}
```

### Contoh Error Authorization (403 Forbidden)

```json
{
  "message": "Access denied. Admin privileges required."
}
```

```json
{
  "message": "Invalid token"
}
```

### Contoh Error Validasi (400 Bad Request)

```json
{
  "message": "\"harga\" must be a positive number"
}
```

```json
{
  "message": "\"kategori\" must be one of [makanan_berat, makanan_ringan, minuman]"
}
```

---

## Contoh Penggunaan dengan Postman

### Setup Postman

1. **Buka Postman**
2. **Buat Collection baru** bernama "Cafe POS API"
3. **Set Base URL:** `http://localhost:3000`

### Skenario Lengkap

#### Step 1: Tambah Produk

1. Buat request baru: `POST http://localhost:3000/products`
2. Pilih tab **Body** → **raw** → **JSON**
3. Masukkan:
```json
{
  "nama_produk": "Nasi Goreng",
  "kategori": "makanan_berat",
  "harga": 25000,
  "stok": 50,
  "deskripsi": "Nasi goreng spesial"
}
```
4. Klik **Send**
5. Catat `id` produk dari response

#### Step 2: Lihat Semua Produk

1. Buat request: `GET http://localhost:3000/products`
2. Klik **Send**
3. Lihat list semua produk

#### Step 3: Lihat Produk by ID

1. Buat request: `GET http://localhost:3000/products/1`
2. Klik **Send**

#### Step 4: Lihat Produk by Kategori

1. Buat request: `GET http://localhost:3000/products/category/makanan_berat`
2. Klik **Send**

#### Step 5: Update Produk

1. Buat request: `PUT http://localhost:3000/products/1`
2. Body:
```json
{
  "nama_produk": "Nasi Goreng Premium",
  "kategori": "makanan_berat",
  "harga": 30000,
  "stok": 45,
  "deskripsi": "Nasi goreng premium dengan udang"
}
```

#### Step 6: Buat Transaksi

1. Buat request: `POST http://localhost:3000/transactions`
2. Body:
```json
{
  "items": [
    {
      "product_id": 1,
      "qty": 2
    }
  ],
  "metode_pembayaran": "cash"
}
```

#### Step 7: Lihat Semua Transaksi

1. Buat request: `GET http://localhost:3000/transactions`
2. Klik **Send**

#### Step 8: Hapus Produk

1. Buat request: `DELETE http://localhost:3000/products/1`
2. Klik **Send**

---

## Tips & Best Practices

### 1. Testing API
- Gunakan Postman atau tools sejenis untuk testing
- Simpan collection Postman untuk reuse
- Test setiap endpoint satu per satu

### 2. Development
- Gunakan `npm run dev` saat development
- Check console untuk log request
- Monitor database untuk memastikan data tersimpan

### 3. Database
- Backup database secara berkala
- Monitor stok produk
- Review transaksi secara periodik

### 4. Error Handling
- Selalu check response status code
- Baca error message dengan teliti
- Validasi input sebelum submit

---

## Troubleshooting

### Server tidak bisa dijalankan
- Check apakah MySQL sudah running
- Pastikan file `.env` sudah dibuat dengan benar
- Verify port 3000 tidak digunakan aplikasi lain

### Error "Product not found"
- Pastikan ID produk yang diakses ada di database
- Check dulu dengan `GET /products` untuk lihat ID yang tersedia

### Error "Insufficient stock"
- Check stok produk dengan `GET /products/:id`
- Update stok jika diperlukan dengan `PUT /products/:id`

### Error Validation
- Pastikan semua field required terisi
- Check tipe data (number untuk harga/stok)
- Pastikan kategori sesuai enum yang ditentukan

---

## Kontak & Support

Jika ada pertanyaan atau menemukan bug, silakan hubungi developer atau buat issue di repository project.

---

**Happy Coding! 🚀**
