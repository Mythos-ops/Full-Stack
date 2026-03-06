const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/productController');

// ========== CRUD ROUTES ==========

// Create product
router.post('/products', ProductController.createProduct);

// Get all products with filters
router.get('/products', ProductController.getAllProducts);

// Search products
router.get('/products/search', ProductController.searchProducts);

// Get low stock products
router.get('/products/low-stock', ProductController.getLowStockProducts);

// Get single product
router.get('/products/:id', ProductController.getProductById);

// Update product
router.put('/products/:id', ProductController.updateProduct);

// Delete product (soft delete)
router.delete('/products/:id', ProductController.deleteProduct);

// Get products by category
router.get('/category/:category', ProductController.getProductsByCategory);

// ========== REVIEW ROUTES ==========

// Add review to product
router.post('/products/:id/reviews', ProductController.addReview);

// ========== STOCK MANAGEMENT ROUTES ==========

// Update variant stock
router.patch('/products/:id/stock/update', ProductController.updateVariantStock);

// Reserve stock
router.patch('/products/:id/stock/reserve', ProductController.reserveStock);

// Release reserved stock
router.patch('/products/:id/stock/release', ProductController.releaseStock);

// Complete purchase
router.post('/products/:id/purchase', ProductController.completePurchase);

// ========== AGGREGATION & ANALYTICS ROUTES ==========

// Get category statistics
router.get('/analytics/categories', ProductController.getCategoryStats);

// Get top-rated products
router.get('/analytics/top-rated', ProductController.getTopRatedProducts);

// Get best-selling products
router.get('/analytics/best-sellers', ProductController.getBestSellers);

// Get brand statistics
router.get('/analytics/brands', ProductController.getBrandStats);

// Get review statistics
router.get('/analytics/reviews', ProductController.getReviewStats);

// Get variant statistics
router.get('/analytics/variants', ProductController.getVariantStats);

// Get low stock by category
router.get('/analytics/low-stock-by-category', ProductController.getLowStockByCategory);

// Get price range analysis
router.get('/analytics/price-ranges', ProductController.getPriceRanges);

// Get featured products with engagement score
router.get('/analytics/featured', ProductController.getFeaturedProducts);

// Get product performance metrics
router.get('/analytics/performance', ProductController.getProductPerformance);

// Get inventory value
router.get('/analytics/inventory-value', ProductController.getInventoryValue);

module.exports = router;
