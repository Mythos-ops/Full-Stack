const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/database');
const productRoutes = require('./routes/productRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Routes
app.use('/api', productRoutes);

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'E-commerce Product Catalog API',
        version: '1.0.0',
        endpoints: {
            products: {
                create: 'POST /api/products',
                getAll: 'GET /api/products',
                getById: 'GET /api/products/:id',
                update: 'PUT /api/products/:id',
                delete: 'DELETE /api/products/:id',
                search: 'GET /api/products/search?q=query',
                lowStock: 'GET /api/products/low-stock?threshold=10',
                byCategory: 'GET /api/category/:category'
            },
            reviews: {
                add: 'POST /api/products/:id/reviews'
            },
            stock: {
                update: 'PATCH /api/products/:id/stock/update',
                reserve: 'PATCH /api/products/:id/stock/reserve',
                release: 'PATCH /api/products/:id/stock/release',
                purchase: 'POST /api/products/:id/purchase'
            },
            analytics: {
                categories: 'GET /api/analytics/categories',
                topRated: 'GET /api/analytics/top-rated',
                bestSellers: 'GET /api/analytics/best-sellers',
                brands: 'GET /api/analytics/brands',
                reviews: 'GET /api/analytics/reviews',
                variants: 'GET /api/analytics/variants',
                lowStockByCategory: 'GET /api/analytics/low-stock-by-category',
                priceRanges: 'GET /api/analytics/price-ranges',
                featured: 'GET /api/analytics/featured',
                performance: 'GET /api/analytics/performance',
                inventoryValue: 'GET /api/analytics/inventory-value'
            }
        }
    });
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        mongodb: require('mongoose').connection.readyState === 1 ? 'connected' : 'disconnected'
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint not found'
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err : undefined
    });
});

// Connect to MongoDB and start server
const startServer = async () => {
    try {
        await connectDB();
        
        app.listen(PORT, () => {
            console.log(`\n🚀 Server is running on port ${PORT}`);
            console.log(`📍 http://localhost:${PORT}`);
            console.log(`\n📚 Available endpoints:`);
            console.log(`   GET  /              - API documentation`);
            console.log(`   GET  /health        - Health check`);
            console.log(`   POST /api/products  - Create product`);
            console.log(`   GET  /api/products  - Get all products`);
            console.log(`   GET  /api/analytics/* - Various analytics endpoints`);
            console.log(`\n📖 See README.md for complete API documentation\n`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('\n\n⏳ Shutting down gracefully...');
    try {
        await require('mongoose').connection.close();
        console.log('✅ MongoDB connection closed');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error during shutdown:', error);
        process.exit(1);
    }
});

startServer();

module.exports = app;
