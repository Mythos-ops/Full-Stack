# E-commerce Product Catalog

A comprehensive e-commerce product catalog system with nested schemas, advanced aggregations, stock management, and analytics capabilities.

## Aim

To create a nested schema for a product catalog and implement aggregation and stock management using MongoDB and Mongoose.

## Objectives

- ✅ Create nested schemas for products with variants and reviews
- ✅ Add review and variant support with validation
- ✅ Perform complex aggregation queries for analytics
- ✅ Optimize database with strategic indexes
- ✅ Implement comprehensive stock update methods

## Hardware/Software Requirements

- **MongoDB Atlas or MongoDB Compass** (MongoDB 5.0+)
- **Mongoose 7+**
- **Node.js 18+**
- **Express.js 4+**

## Project Structure

```
2.1.3/
├── config/
│   └── database.js              # MongoDB connection configuration
├── models/
│   └── Product.js               # Product schema with nested variants & reviews
├── services/
│   └── aggregationService.js   # Aggregation pipeline queries
├── controllers/
│   └── productController.js    # Request handlers
├── routes/
│   └── productRoutes.js        # API routes
├── scripts/
│   ├── seedData.js             # Database seed script
│   └── testAggregations.js     # Test aggregation queries
├── index.js                     # Main application file
├── package.json                 # Dependencies
├── .env                         # Environment variables
└── README.md                    # This file
```

## Features

### 1. Nested Schema Architecture

**Product Schema** contains:
- Basic product information (name, description, category, brand)
- **Nested Variants** (each with own SKU, price, attributes, stock)
- **Nested Reviews** (user ratings, comments, verification status)
- Computed fields (averageRating, totalReviews, totalStock)
- Discount management with date ranges

**Variant Schema** includes:
- Individual SKU tracking
- Custom attributes (color, size, material, weight)
- Separate stock management (quantity, reserved, available)
- Images array
- Active/inactive status

**Review Schema** includes:
- User information
- 1-5 star rating system
- Comment with character limit
- Verified purchase flag
- Helpfulness tracking

### 2. Strategic Indexes

The system implements multiple indexes for performance optimization:

```javascript
// Compound indexes
{ category: 1, brand: 1 }           // Category + brand queries
{ featured: 1, isActive: 1, averageRating: -1 }  // Featured products

// Text index
{ name: 'text', description: 'text', tags: 'text' }  // Search

// Single field indexes
{ basePrice: 1 }                     // Price range queries
{ averageRating: -1 }                // Rating sorting
{ 'variants.sku': 1 }                // SKU lookups
```

### 3. Stock Management Methods

The Product model includes sophisticated stock management:

- **updateVariantStock(variantId, quantity)** - Add/reduce stock
- **reserveStock(variantId, quantity)** - Reserve stock for pending orders
- **releaseStock(variantId, quantity)** - Release reserved stock
- **completePurchase(variantId, quantity)** - Finalize purchase and reduce stock

### 4. Advanced Aggregation Queries

11 comprehensive aggregation pipelines for analytics:

1. **Products by Category** - Group products with statistics
2. **Top Rated Products** - Products with highest ratings (min reviews threshold)
3. **Best Sellers** - Most purchased products
4. **Brand Statistics** - Performance metrics by brand
5. **Review Statistics** - Detailed review analysis with rating distribution
6. **Variant Statistics** - Stock and pricing per variant
7. **Low Stock by Category** - Products needing restock
8. **Price Range Analysis** - Distribution using $bucket
9. **Featured Products** - Engagement score calculation
10. **Product Performance** - Conversion rates and metrics
11. **Inventory Value** - Total value by category

## Installation

### 1. Install Dependencies

Open a **new terminal** and run:

```bash
cd "Exp 5/2.1.3"
npm install
```

### 2. Configure MongoDB

**Option A: Local MongoDB**
```bash
# Ensure MongoDB is running locally
mongod
```

**Option B: MongoDB Atlas**
1. Create a cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Get your connection string
3. Update `.env` file:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ecommerce-catalog?retryWrites=true&w=majority
```

### 3. Seed the Database

```bash
npm run seed
```

This will insert 8 sample products with variants and reviews.

### 4. Start the Server

```bash
npm start
```

Or for development with auto-reload:

```bash
npm run dev
```

The server will start at `http://localhost:3000`

## API Endpoints

### Product CRUD Operations

#### Create Product
```http
POST /api/products
Content-Type: application/json

{
  "name": "Product Name",
  "description": "Product description",
  "category": "Electronics",
  "brand": "BrandName",
  "basePrice": 99.99,
  "variants": [
    {
      "name": "Black - Standard",
      "sku": "PROD-BLK-STD",
      "price": 99.99,
      "attributes": { "color": "Black" },
      "stock": { "quantity": 100, "reserved": 0, "available": 100 }
    }
  ],
  "tags": ["tag1", "tag2"],
  "featured": false
}
```

#### Get All Products with Filters
```http
GET /api/products?category=Electronics&minPrice=50&maxPrice=200&minRating=4&featured=true&page=1&limit=20
```

Query Parameters:
- `category` - Filter by category
- `brand` - Filter by brand
- `minPrice`, `maxPrice` - Price range
- `minRating` - Minimum average rating
- `inStock` - Only products with available stock (true/false)
- `featured` - Only featured products (true/false)
- `page`, `limit` - Pagination

#### Get Single Product
```http
GET /api/products/:id
```

#### Update Product
```http
PUT /api/products/:id
Content-Type: application/json

{
  "basePrice": 89.99,
  "featured": true
}
```

#### Delete Product (Soft Delete)
```http
DELETE /api/products/:id
```

#### Search Products
```http
GET /api/products/search?q=wireless&limit=20
```

#### Get Products by Category
```http
GET /api/category/Electronics?minPrice=100&brand=BrandName
```

#### Get Low Stock Products
```http
GET /api/products/low-stock?threshold=10
```

### Review Management

#### Add Review
```http
POST /api/products/:id/reviews
Content-Type: application/json

{
  "user": "John Doe",
  "rating": 5,
  "comment": "Excellent product!",
  "isVerifiedPurchase": true
}
```

### Stock Management

#### Update Variant Stock
```http
PATCH /api/products/:id/stock/update
Content-Type: application/json

{
  "variantId": "variant_id_here",
  "quantity": 10
}
```

#### Reserve Stock
```http
PATCH /api/products/:id/stock/reserve
Content-Type: application/json

{
  "variantId": "variant_id_here",
  "quantity": 2
}
```

#### Release Reserved Stock
```http
PATCH /api/products/:id/stock/release
Content-Type: application/json

{
  "variantId": "variant_id_here",
  "quantity": 1
}
```

#### Complete Purchase
```http
POST /api/products/:id/purchase
Content-Type: application/json

{
  "variantId": "variant_id_here",
  "quantity": 1
}
```

### Analytics & Aggregation Endpoints

#### Get Category Statistics
```http
GET /api/analytics/categories
```

Returns products grouped by category with statistics.

#### Get Top Rated Products
```http
GET /api/analytics/top-rated?minReviews=5&limit=10
```

#### Get Best Sellers
```http
GET /api/analytics/best-sellers?limit=10
```

#### Get Brand Statistics
```http
GET /api/analytics/brands
```

#### Get Review Statistics
```http
GET /api/analytics/reviews
```

Detailed review analysis with rating distribution (5-star to 1-star breakdown).

#### Get Variant Statistics
```http
GET /api/analytics/variants
```

Stock and pricing statistics for all variants.

#### Get Low Stock by Category
```http
GET /api/analytics/low-stock-by-category?threshold=10
```

#### Get Price Range Analysis
```http
GET /api/analytics/price-ranges
```

Products grouped into price buckets using MongoDB $bucket.

#### Get Featured Products (by Engagement)
```http
GET /api/analytics/featured?limit=10
```

Featured products ranked by engagement score (rating × 2 + purchases × 0.5 + views × 0.01 + reviews × 0.1).

#### Get Product Performance
```http
GET /api/analytics/performance
```

Conversion rates and review rates for products.

#### Get Inventory Value
```http
GET /api/analytics/inventory-value
```

Total inventory value by category.

## Testing

### Test Aggregation Queries

Run the aggregation test script to see all analytics in action:

```bash
npm test
```

This will display:
- Products by category
- Top rated products
- Best sellers
- Brand statistics
- Low stock alerts
- Featured products
- Inventory valuation
- Product performance metrics

### Manual Testing with MongoDB Compass

1. Connect to your database using MongoDB Compass
2. Navigate to the `products` collection
3. Use the Aggregations tab to test queries
4. Examine indexes in the Indexes tab

## Schema Details

### Product Model Fields

```javascript
{
  name: String (required, max 200 chars),
  description: String (required, max 2000 chars),
  category: String (enum, indexed),
  brand: String (required, indexed),
  basePrice: Number (required, min 0),
  discount: {
    percentage: Number (0-100),
    startDate: Date,
    endDate: Date
  },
  variants: [VariantSchema],    // Nested
  reviews: [ReviewSchema],      // Nested
  averageRating: Number (0-5, computed),
  totalReviews: Number (computed),
  totalStock: Number (computed),
  tags: [String] (indexed),
  isActive: Boolean (default true, indexed),
  featured: Boolean (default false, indexed),
  viewCount: Number,
  purchaseCount: Number,
  timestamps: true
}
```

### Virtual Fields

- **currentPrice** - Calculates discounted price if discount is active
- **stockStatus** - Returns "Out of Stock", "Low Stock", or "In Stock"

### Pre-Save Middleware

- Automatically calculates `averageRating` from reviews
- Automatically calculates `totalStock` from variants
- Updates variant `available` stock (quantity - reserved)

## Database Indexes Explained

### Why These Indexes?

1. **{ category: 1, brand: 1 }**
   - Optimizes filtering products by category and brand together
   - Common in e-commerce browsing

2. **Text Index**
   - Enables full-text search across name, description, and tags
   - Returns results with relevance score

3. **{ basePrice: 1 }**
   - Speeds up price range queries
   - Essential for price filters

4. **{ averageRating: -1 }**
   - Optimizes sorting by rating (descending)
   - Used in "top rated" queries

5. **{ featured: 1, isActive: 1, averageRating: -1 }**
   - Compound index for homepage featured products
   - Pre-sorted by rating

6. **{ 'variants.sku': 1 }**
   - Fast SKU lookups for inventory management
   - Unique constraint at schema level

## Stock Management Flow Example

```javascript
// Customer adds item to cart
await product.reserveStock(variantId, 1);
// Stock: quantity=100, reserved=1, available=99

// Customer completes checkout
await product.completePurchase(variantId, 1);
// Stock: quantity=99, reserved=0, available=99

// OR if customer cancels
await product.releaseStock(variantId, 1);
// Stock: quantity=100, reserved=0, available=100
```

## Aggregation Pipeline Examples

### Example 1: Products by Category

```javascript
Product.aggregate([
  { $match: { isActive: true } },
  {
    $group: {
      _id: '$category',
      totalProducts: { $sum: 1 },
      averagePrice: { $avg: '$basePrice' },
      averageRating: { $avg: '$averageRating' }
    }
  },
  { $sort: { totalProducts: -1 } }
]);
```

### Example 2: Review Distribution

```javascript
Product.aggregate([
  { $unwind: '$reviews' },
  {
    $group: {
      _id: '$_id',
      fiveStarReviews: {
        $sum: { $cond: [{ $eq: ['$reviews.rating', 5] }, 1, 0] }
      },
      // ... other star counts
    }
  }
]);
```

## Common Use Cases

### 1. Homepage Featured Products
```http
GET /api/analytics/featured?limit=10
```

### 2. Category Page with Filters
```http
GET /api/products?category=Electronics&minPrice=100&maxPrice=500&minRating=4&inStock=true
```

### 3. Search Functionality
```http
GET /api/products/search?q=wireless headphones
```

### 4. Low Stock Alert
```http
GET /api/products/low-stock?threshold=20
```

### 5. Inventory Valuation Report
```http
GET /api/analytics/inventory-value
```

## Troubleshooting

### MongoDB Connection Issues

**Error:** `MongoServerError: Authentication failed`
- Check your connection string in `.env`
- Verify username/password
- Ensure IP is whitelisted in MongoDB Atlas

**Error:** `ECONNREFUSED`
- Ensure MongoDB is running locally
- Check if port 27017 is accessible

### Validation Errors

Products must have at least one variant:
```json
{
  "success": false,
  "message": "Product must have at least one variant"
}
```

### Stock Management Errors

**"Insufficient stock"**
- Requested quantity exceeds available stock
- Check variant stock levels

**"Variant not found"**
- Provided variantId doesn't exist
- Use correct MongoDB ObjectId

## Performance Considerations

1. **Indexes** - All critical fields are indexed
2. **Pagination** - Use `page` and `limit` for large result sets
3. **Selective Fields** - Use projection to limit returned data
4. **Aggregation** - Aggregations are optimized with early `$match` stages

## Future Enhancements

- [ ] Add user authentication and authorization
- [ ] Implement wishlist functionality
- [ ] Add product comparison feature
- [ ] Implement advanced search with filters
- [ ] Add product recommendations
- [ ] Implement caching with Redis
- [ ] Add image upload functionality
- [ ] Implement order management
- [ ] Add real-time stock notifications
- [ ] Create admin dashboard

## License

ISC

## Author

Created as part of Full Stack Development - Exp 5/2.1.3

---

## Quick Reference

### Categories Available
- Electronics
- Clothing
- Books
- Home & Garden
- Sports
- Toys
- Food
- Other

### Stock Management Flow
1. **Reserve** → Hold stock for pending order
2. **Complete** → Finalize purchase, reduce stock
3. **Release** → Cancel order, free reserved stock
4. **Update** → Manual stock adjustment

### Key Aggregations
- Category stats
- Top rated (min reviews)
- Best sellers (purchases)
- Brand performance
- Review distribution
- Variant statistics
- Low stock alerts
- Price ranges
- Featured products
- Performance metrics
- Inventory value

---

**Need Help?** Check the API documentation at `http://localhost:3000/` when the server is running.
