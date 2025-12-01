# 📊 Sistem POS Cafe - Backend API

Backend API untuk sistem Point of Sale (POS) Cafe dengan fitur autentikasi dan otorisasi berbasis role.

## 🚀 Fitur

### ✅ Authentication & Authorization
- **JWT-based authentication** - Token-based security
- **Role-based access control** - Admin & User roles
- **Password hashing** with bcrypt
- **Token expiration** - Configurable expiry time

### ✅ Product Management
- CRUD operations untuk produk
- Kategorisasi produk (makanan berat, ringan, minuman)
- Stock management
- Protected endpoints (Admin only untuk CUD, All users untuk R)

### ✅ Transaction Management
- Create transactions dengan multiple items
- Automatic stock reduction
- Payment method selection (cash, QRIS, debit)
- Transaction history (Admin only)

## 📋 Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MySQL
- **Authentication:** JWT (jsonwebtoken)
- **Password Hashing:** bcryptjs
- **Validation:** Joi
- **Database Driver:** mysql2

## 🛠️ Installation

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/Darisgithub/POS-CAFE.git
cd sistem-pos
npm install
```

### 2. Configure Environment
Create `.env` file:
```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=your-db-name

JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRES_IN=your-jwt-expires-time. example: 24h
```

### 3. Start MySQL Server
Pastikan MySQL sudah running di komputer Anda

### 4. Run Application
```bash
# Development mode
npm run dev

# Production mode
npm start
```

Server akan jalan di `http://localhost:3000`

## 📁 Project Structure

```
sistem-pos/
├── src/
│   ├── config/
│   │   └── database.js          # Database configuration & init
│   ├── controllers/
│   │   ├── authController.js     # Auth logic (register, login)
│   │   ├── productController.js  # Product CRUD logic
│   │   └── transactionController.js # Transaction logic
│   ├── middlewares/
│   │   ├── auth.js              # JWT verification & role check
│   │   ├── errorHandler.js      # Global error handler
│   │   └── validation.js        # Joi validation middleware
│   ├── models/
│   │   ├── userModel.js         # User data access
│   │   ├── productModel.js      # Product data access
│   │   └── transactionModel.js  # Transaction data access
│   ├── routes/
│   │   ├── authRoutes.js        # Auth endpoints
│   │   ├── productRoutes.js     # Product endpoints
│   │   └── transactionRoutes.js # Transaction endpoints
│   ├── services/
│   │   ├── productService.js    # Product business logic
│   │   └── transactionService.js # Transaction business logic
│   ├── utils/
│   │   └── schema.js            # Joi validation schemas
│   └── app.js                   # Express app entry point
├── .env                         # Environment variables
├── .env.example                 # ENV template
├── package.json
├── API_DOCUMENTATION.md         # Complete API docs
└── AUTHENTICATION_GUIDE.md      # Auth quick start guide
```

## 🔐 Authentication System

### Roles & Permissions

#### 🔴 Admin
- Full CRUD access to products
- View all transactions
- View all users
- Create transactions

#### 🔵 User (Kasir)
- View products only
- Create transactions
- Cannot modify products
- Cannot view all transactions

### How to Use

1. **Register/Login** → Get JWT token
2. **Add token to headers:**
   ```
   Authorization: Bearer <your-token>
   ```
3. **Make requests** to protected endpoints

📖 See [AUTHENTICATION_GUIDE.md](./AUTHENTICATION_GUIDE.md) for detailed guide

## 📚 API Endpoints

### Authentication (`/auth`)
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/auth/register` | Public | Register new user |
| POST | `/auth/login` | Public | Login user |
| GET | `/auth/profile` | Authenticated | Get user profile |
| GET | `/auth/users` | Admin | Get all users |

### Products (`/products`)
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/products` | Authenticated | Get all products |
| GET | `/products/:id` | Authenticated | Get product by ID |
| GET | `/products/category/:kategori` | Authenticated | Get by category |
| POST | `/products` | Admin | Create product |
| PUT | `/products/:id` | Admin | Update product |
| DELETE | `/products/:id` | Admin | Delete product |

### Transactions (`/transactions`)
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/transactions` | Authenticated | Create transaction |
| GET | `/transactions` | Admin | Get all transactions |
| GET | `/transactions/:id` | Admin | Get transaction by ID |

📖 See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for complete API documentation

## 🧪 Testing with Postman

### Quick Test Flow

1. **Register Admin:**
```json
POST /auth/register
{
  "name": "Admin",
  "email": "admin@cafe.com",
  "password": "admin123",
  "role": "admin"
}
```

2. **Login:**
```json
POST /auth/login
{
  "email": "admin@cafe.com",
  "password": "admin123"
}
```

3. **Add Product (with token):**
```json
POST /products
Authorization: Bearer <token>
{
  "nama_produk": "Nasi Goreng",
  "kategori": "makanan_berat",
  "harga": 25000,
  "stok": 50,
  "deskripsi": "Nasi goreng spesial"
}
```

4. **Create Transaction:**
```json
POST /transactions
Authorization: Bearer <token>
{
  "items": [
    { "product_id": 1, "qty": 2 }
  ],
  "metode_pembayaran": "cash"
}
```

## 🗄️ Database Schema

### Table: users
```sql
id (INT, AUTO_INCREMENT, PRIMARY KEY)
name (VARCHAR 255)
email (VARCHAR 255, UNIQUE)
password (VARCHAR 255) -- hashed
role (ENUM: 'admin', 'user')
created_at (TIMESTAMP)
updated_at (TIMESTAMP)
```

### Table: products
```sql
id (INT, AUTO_INCREMENT, PRIMARY KEY)
nama_produk (VARCHAR 255)
kategori (ENUM: 'makanan_berat', 'makanan_ringan', 'minuman')
harga (DECIMAL 10,2)
stok (INT)
deskripsi (TEXT)
created_at (TIMESTAMP)
updated_at (TIMESTAMP)
```

### Table: transactions
```sql
id (INT, AUTO_INCREMENT, PRIMARY KEY)
total_harga (DECIMAL 10,2)
metode_pembayaran (ENUM: 'cash', 'qris', 'debit')
created_at (TIMESTAMP)
```

### Table: transaction_items
```sql
id (INT, AUTO_INCREMENT, PRIMARY KEY)
transaction_id (INT, FOREIGN KEY)
product_id (INT, FOREIGN KEY)
qty (INT)
subtotal (DECIMAL 10,2)
```

## ⚙️ Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 3000 |
| `DB_HOST` | MySQL host | localhost |
| `DB_USER` | MySQL user | root |
| `DB_PASSWORD` | MySQL password | (empty) |
| `DB_NAME` | Database name | cafe_pos_db |
| `JWT_SECRET` | JWT signing secret | (required) |
| `JWT_EXPIRES_IN` | Token expiry | 24h |

## 🔒 Security Features

- ✅ Password hashing with bcrypt (10 rounds)
- ✅ JWT token with expiration
- ✅ Role-based access control
- ✅ Input validation with Joi
- ✅ SQL injection prevention (prepared statements)
- ✅ CORS enabled
- ✅ Error handling middleware

## 🐛 Troubleshooting

### Server won't start
- ✓ Check MySQL is running
- ✓ Verify `.env` configuration
- ✓ Ensure port 3000 is not in use

### Authentication errors
- ✓ Check token is included in headers
- ✓ Verify token hasn't expired
- ✓ Ensure JWT_SECRET is set in .env

### Database errors
- ✓ Verify MySQL credentials
- ✓ Check database exists (auto-created on first run)
- ✓ Ensure proper permissions

## 📝 Development Notes

### Adding New Endpoints
1. Create route in `src/routes/`
2. Create controller in `src/controllers/`
3. Create model in `src/models/`
4. Add validation schema in `src/utils/schema.js`
5. Apply auth middleware if needed
6. Update API documentation

### Database Changes
- Modify `src/config/database.js` `initDB()` function
- Tables are created automatically on server start

## 📦 Dependencies

```json
{
  "bcryptjs": "^2.4.3",
  "cors": "^2.8.5",
  "dotenv": "^16.3.1",
  "express": "^4.18.2",
  "joi": "^17.11.0",
  "jsonwebtoken": "^9.0.2",
  "morgan": "^1.10.0",
  "mysql2": "^3.6.5"
}
```

## 🎯 Future Enhancements

- [ ] Refresh token implementation
- [ ] User profile update
- [ ] Product image upload
- [ ] Transaction filtering & search
- [ ] Daily/Monthly reports
- [ ] Email verification
- [ ] Password reset functionality
- [ ] Rate limiting
- [ ] API documentation with Swagger

## 📄 License

ISC

## 👥 Contributing

1. Fork the project
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

**Made with ❤️ for Cafe POS System**

For detailed API documentation: [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)  
For authentication guide: [AUTHENTICATION_GUIDE.md](./AUTHENTICATION_GUIDE.md)
