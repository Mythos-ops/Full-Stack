require('dotenv').config();
const connectDB = require('../config/database');
const AggregationService = require('../services/aggregationService');

async function testAggregations() {
    try {
        console.log('🧪 Testing Aggregation Queries\n');
        
        await connectDB();

        // Test 1: Products by Category
        console.log('📊 1. Products by Category:');
        const categoryStats = await AggregationService.getProductsByCategory();
        console.table(categoryStats);
        console.log('');

        // Test 2: Top Rated Products
        console.log('⭐ 2. Top Rated Products:');
        const topRated = await AggregationService.getTopRatedProducts(2, 5);
        console.table(topRated.map(p => ({
            name: p.name,
            category: p.category,
            rating: p.averageRating,
            reviews: p.totalReviews,
            price: p.basePrice
        })));
        console.log('');

        // Test 3: Best Sellers
        console.log('🏆 3. Best Selling Products:');
        const bestSellers = await AggregationService.getBestSellingProducts(5);
        console.table(bestSellers.map(p => ({
            name: p.name,
            category: p.category,
            purchases: p.purchaseCount,
            rating: p.averageRating,
            stock: p.totalStock
        })));
        console.log('');

        // Test 4: Brand Statistics
        console.log('🏷️  4. Brand Statistics:');
        const brandStats = await AggregationService.getBrandStatistics();
        console.table(brandStats.map(b => ({
            brand: b._id,
            products: b.totalProducts,
            avgPrice: b.averagePrice,
            avgRating: b.averageRating,
            sales: b.totalSales
        })));
        console.log('');

        // Test 5: Low Stock by Category
        console.log('⚠️  5. Low Stock Products (threshold: 10):');
        const lowStock = await AggregationService.getLowStockByCategory(10);
        if (lowStock.length > 0) {
            lowStock.forEach(category => {
                console.log(`\n   ${category._id}:`);
                console.log(`   Total Products: ${category.totalProducts}`);
                console.log(`   Total Stock: ${category.totalStock}`);
                category.products.forEach(p => {
                    console.log(`      - ${p.name} (${p.brand}): ${p.stock} units`);
                });
            });
        } else {
            console.log('   No low stock products found');
        }
        console.log('');

        // Test 6: Featured Products with Engagement
        console.log('🌟 6. Featured Products (by engagement score):');
        const featured = await AggregationService.getFeaturedProducts(5);
        console.table(featured.map(p => ({
            name: p.name,
            engagement: p.engagementScore,
            rating: p.averageRating,
            purchases: p.purchaseCount,
            views: p.viewCount
        })));
        console.log('');

        // Test 7: Inventory Value
        console.log('💰 7. Inventory Value by Category:');
        const inventoryValue = await AggregationService.getInventoryValue();
        console.table(inventoryValue.map(i => ({
            category: i.category,
            totalValue: `$${i.totalInventoryValue.toFixed(2)}`,
            availableValue: `$${i.availableInventoryValue.toFixed(2)}`,
            units: i.totalUnits
        })));
        console.log('');

        // Test 8: Product Performance
        console.log('📈 8. Product Performance (Top 5):');
        const performance = await AggregationService.getProductPerformance();
        console.table(performance.slice(0, 5).map(p => ({
            name: p.name,
            views: p.viewCount,
            purchases: p.purchaseCount,
            conversionRate: `${p.conversionRate}%`,
            reviews: p.totalReviews,
            reviewRate: `${p.reviewRate}%`
        })));
        console.log('');

        console.log('✅ All aggregation tests completed!\n');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error testing aggregations:', error);
        process.exit(1);
    }
}

testAggregations();
