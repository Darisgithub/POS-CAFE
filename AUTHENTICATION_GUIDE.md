# 🚀 Quick Start Guide - Authentication System

## Setup Awal

### 1. Pastikan JWT Secret sudah di .env
Buka file `.env` dan pastikan ada baris:
```env
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=24h
```

### 2. Jalankan Server
```bash
npm run dev
```

### 3. Database akan otomatis membuat tabel users

---

## Testing dengan Postman

### Step 1: Daftar Admin (Register)

**Request:**
```
POST http://localhost:3000/auth/register
Content-Type: application/json

Body:
{
  "name": "Admin Cafe",
  "email": "admin@cafe.com",
  "password": "admin123",
  "role": "admin"
}
```

**Response:**
Anda akan mendapat token JWT. SIMPAN token ini!

```json
{
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": 1,
      "name": "Admin Cafe",
      "email": "admin@cafe.com",
      "role": "admin"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### Step 2: Daftar User/Kasir

**Request:**
```
POST http://localhost:3000/auth/register
Content-Type: application/json

Body:
{
  "name": "Kasir 1",
  "email": "kasir@cafe.com",
  "password": "kasir123",
  "role": "user"
}
```

---

### Step 3: Login (jika sudah punya akun)

**Request:**
```
POST http://localhost:3000/auth/login
Content-Type: application/json

Body:
{
  "email": "admin@cafe.com",
  "password": "admin123"
}
```

---

### Step 4: Simpan Token di Postman

Di Postman:
1. Klik tab **Authorization**
2. Type: pilih **Bearer Token**
3. Paste token Anda di field Token
4. Atau buat Environment variable `token` dan isi dengan token yang didapat

---

### Step 5: Test Endpoint dengan Token

#### Sebagai Admin - Tambah Produk

**Request:**
```
POST http://localhost:3000/products
Authorization: Bearer <your-admin-token>
Content-Type: application/json

Body:
{
  "nama_produk": "Nasi Goreng",
  "kategori": "makanan_berat",
  "harga": 25000,
  "stok": 50,
  "deskripsi": "Nasi goreng spesial"
}
```

#### Sebagai User - Lihat Produk

**Request:**
```
GET http://localhost:3000/products
Authorization: Bearer <your-user-token>
```

#### Sebagai User - Buat Transaksi

**Request:**
```
POST http://localhost:3000/transactions
Authorization: Bearer <your-user-token>
Content-Type: application/json

Body:
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

---

## Hak Akses

### 🔴 Admin
- ✅ CRUD Produk (Create, Read, Update, Delete)
- ✅ Lihat semua transaksi
- ✅ Lihat semua users

### 🔵 User (Kasir)
- ✅ Lihat produk
- ✅ Buat transaksi
- ❌ Tidak bisa CRUD produk
- ❌ Tidak bisa lihat semua transaksi

---

## Error yang Mungkin Terjadi

### 1. "Access token required"
**Penyebab:** Anda belum menyertakan token di header
**Solusi:** Tambahkan header `Authorization: Bearer <your-token>`

### 2. "Invalid token"
**Penyebab:** Token salah atau sudah expired
**Solusi:** Login ulang untuk mendapat token baru

### 3. "Access denied. Admin privileges required"
**Penyebab:** Endpoint ini hanya untuk admin, tapi Anda login sebagai user
**Solusi:** Login dengan akun admin

### 4. "Email already registered"
**Penyebab:** Email sudah digunakan
**Solusi:** Gunakan email lain atau login dengan email tersebut

---

## Tips

1. **Simpan Token:** Gunakan Postman Environment untuk menyimpan token
2. **Token Expired:** Default 24 jam, setelah itu harus login ulang
3. **Testing:** Buat 2 user (admin & kasir) untuk test hak akses
4. **Production:** Ganti JWT_SECRET dengan random string yang aman

---

## Flow Kerja Normal

### Untuk Kasir (User):
1. Login → Dapat token
2. Lihat produk → Pilih produk
3. Buat transaksi
4. (Ulangi untuk transaksi berikutnya)

### Untuk Admin:
1. Login → Dapat token
2. Kelola produk (tambah/edit/hapus)
3. Lihat laporan transaksi
4. Kelola stok

---

**Selamat! Sistem authentication sudah siap digunakan! 🎉**
