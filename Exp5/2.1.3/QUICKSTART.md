# Quick Start Guide - E-commerce Catalog

## Prerequisites
- ✅ Node.js 18+ installed
- ✅ MongoDB (Atlas or local) running

## Setup Steps

### 1. Configure MongoDB

Edit the `.env` file with your MongoDB connection:

**For Local MongoDB:**
```env
MONGODB_URI=mongodb://localhost:27017/ecommerce-catalog
```

**For MongoDB Atlas:**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ecommerce-catalog?retryWrites=true&w=majority
```

### 2. Seed the Database

```bash
npm run seed
```

Expected output:
```
✅ MongoDB Connected
🗑️  Clearing existing products...
📦 Inserting sample products...
✅ 8 products inserted

📊 Seed Summary:
   Total Products: 8
   Total Variants: 23
   Total Reviews: 20
```

### 3. Start the Server

```bash
npm start
```

The server will start at: http://localhost:3000

### 4. Test the API

Open your browser or use curl:

**View API Documentation:**
```
http://localhost:3000/
```

**Get all products:**
```bash
curl http://localhost:3000/api/products
```

**Get category statistics:**
```bash
curl http://localhost:3000/api/analytics/categories
```

**Search products:**
```bash
curl http://localhost:3000/api/products/search?q=wireless
```

**Get top-rated products:**
```bash
curl http://localhost:3000/api/analytics/top-rated?limit=5
```

### 5. Test Aggregations

Run the aggregation test script:

```bash
npm test
```

This will display all analytics and aggregation results in your terminal.

## Common Operations

### Create a New Product

```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Smart Watch Pro",
    "description": "Advanced fitness tracking with heart rate monitor",
    "category": "Electronics",
    "brand": "TechPro",
    "basePrice": 299.99,
    "variants": [
      {
        "name": "Black - 42mm",
        "sku": "SWP-BLK-42",
        "price": 299.99,
        "attributes": { "color": "Black", "size": "42mm" },
        "stock": { "quantity": 50, "reserved": 0, "available": 50 }
      }
    ],
    "tags": ["smartwatch", "fitness", "health"],
    "featured": true
  }'
```

### Add a Review

First get a product ID, then:

```bash
curl -X POST http://localhost:3000/api/products/PRODUCT_ID/reviews \
  -H "Content-Type: application/json" \
  -d '{
    "user": "Your Name",
    "rating": 5,
    "comment": "Excellent product!",
    "isVerifiedPurchase": true
  }'
```

### Update Stock

```bash
curl -X PATCH http://localhost:3000/api/products/PRODUCT_ID/stock/update \
  -H "Content-Type: application/json" \
  -d '{
    "variantId": "VARIANT_ID",
    "quantity": 10
  }'
```

## Using MongoDB Compass

1. Open MongoDB Compass
2. Connect to your database
3. Navigate to `ecommerce-catalog` database
4. Browse the `products` collection
5. View indexes in the "Indexes" tab
6. Test aggregations in the "Aggregations" tab

## Troubleshooting

**Can't connect to MongoDB?**
- Local: Ensure `mongod` is running
- Atlas: Check connection string, IP whitelist, and credentials

**Port 3000 already in use?**
- Change PORT in `.env` file
- Or stop other processes using port 3000

**Validation errors?**
- Products need at least one variant
- SKUs must be unique
- Check required fields

## Next Steps

1. ✅ Explore the API at http://localhost:3000/
2. ✅ Test aggregation queries with `npm test`
3. ✅ Try filtering products by category/brand
4. ✅ Experiment with stock management
5. ✅ View analytics endpoints
6. ✅ Read the full [README.md](README.md) for detailed documentation

## Available Categories

- Electronics
- Clothing
- Books
- Home & Garden
- Sports
- Toys
- Food
- Other

## Key Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /api/products` | Get all products (with filters) |
| `GET /api/products/:id` | Get single product |
| `POST /api/products` | Create product |
| `GET /api/products/search?q=query` | Search products |
| `GET /api/analytics/categories` | Category statistics |
| `GET /api/analytics/top-rated` | Top rated products |
| `GET /api/analytics/best-sellers` | Best selling products |
| `GET /api/analytics/brands` | Brand statistics |
| `GET /api/analytics/inventory-value` | Inventory valuation |

---

**Happy Coding! 🚀**
