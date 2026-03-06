const Product = require('../models/Product');

class AggregationService {
    /**
     * Get products grouped by category with statistics
     */
    static async getProductsByCategory() {
        return await Product.aggregate([
            {
                $match: { isActive: true }
            },
            {
                $group: {
                    _id: '$category',
                    totalProducts: { $sum: 1 },
                    averagePrice: { $avg: '$basePrice' },
                    minPrice: { $min: '$basePrice' },
                    maxPrice: { $max: '$basePrice' },
                    averageRating: { $avg: '$averageRating' },
                    totalStock: { $sum: '$totalStock' },
                    totalReviews: { $sum: '$totalReviews' }
                }
            },
            {
                $sort: { totalProducts: -1 }
            }
        ]);
    }

    /**
     * Get top-rated products with minimum reviews threshold
     */
    static async getTopRatedProducts(minReviews = 5, limit = 10) {
        return await Product.aggregate([
            {
                $match: {
                    isActive: true,
                    totalReviews: { $gte: minReviews }
                }
            },
            {
                $project: {
                    name: 1,
                    brand: 1,
                    category: 1,
                    basePrice: 1,
                    averageRating: 1,
                    totalReviews: 1,
                    totalStock: 1,
                    purchaseCount: 1
                }
            },
            {
                $sort: { averageRating: -1, totalReviews: -1 }
            },
            {
                $limit: limit
            }
        ]);
    }

    /**
     * Get best-selling products
     */
    static async getBestSellingProducts(limit = 10) {
        return await Product.aggregate([
            {
                $match: { isActive: true, purchaseCount: { $gt: 0 } }
            },
            {
                $project: {
                    name: 1,
                    brand: 1,
                    category: 1,
                    basePrice: 1,
                    purchaseCount: 1,
                    averageRating: 1,
                    totalStock: 1
                }
            },
            {
                $sort: { purchaseCount: -1, averageRating: -1 }
            },
            {
                $limit: limit
            }
        ]);
    }

    /**
     * Get product statistics by brand
     */
    static async getBrandStatistics() {
        return await Product.aggregate([
            {
                $match: { isActive: true }
            },
            {
                $group: {
                    _id: '$brand',
                    totalProducts: { $sum: 1 },
                    averagePrice: { $avg: '$basePrice' },
                    averageRating: { $avg: '$averageRating' },
                    totalSales: { $sum: '$purchaseCount' },
                    totalStock: { $sum: '$totalStock' },
                    categories: { $addToSet: '$category' }
                }
            },
            {
                $project: {
                    brand: '$_id',
                    totalProducts: 1,
                    averagePrice: { $round: ['$averagePrice', 2] },
                    averageRating: { $round: ['$averageRating', 2] },
                    totalSales: 1,
                    totalStock: 1,
                    categoryCount: { $size: '$categories' },
                    categories: 1
                }
            },
            {
                $sort: { totalSales: -1, averageRating: -1 }
            }
        ]);
    }

    /**
     * Get review statistics for products
     */
    static async getReviewStatistics() {
        return await Product.aggregate([
            {
                $match: { isActive: true, totalReviews: { $gt: 0 } }
            },
            {
                $unwind: '$reviews'
            },
            {
                $group: {
                    _id: '$_id',
                    productName: { $first: '$name' },
                    category: { $first: '$category' },
                    totalReviews: { $sum: 1 },
                    averageRating: { $avg: '$reviews.rating' },
                    verifiedReviews: {
                        $sum: { $cond: ['$reviews.isVerifiedPurchase', 1, 0] }
                    },
                    fiveStarReviews: {
                        $sum: { $cond: [{ $eq: ['$reviews.rating', 5] }, 1, 0] }
                    },
                    fourStarReviews: {
                        $sum: { $cond: [{ $eq: ['$reviews.rating', 4] }, 1, 0] }
                    },
                    threeStarReviews: {
                        $sum: { $cond: [{ $eq: ['$reviews.rating', 3] }, 1, 0] }
                    },
                    twoStarReviews: {
                        $sum: { $cond: [{ $eq: ['$reviews.rating', 2] }, 1, 0] }
                    },
                    oneStarReviews: {
                        $sum: { $cond: [{ $eq: ['$reviews.rating', 1] }, 1, 0] }
                    }
                }
            },
            {
                $project: {
                    productName: 1,
                    category: 1,
                    totalReviews: 1,
                    averageRating: { $round: ['$averageRating', 2] },
                    verifiedReviews: 1,
                    ratingDistribution: {
                        5: '$fiveStarReviews',
                        4: '$fourStarReviews',
                        3: '$threeStarReviews',
                        2: '$twoStarReviews',
                        1: '$oneStarReviews'
                    }
                }
            },
            {
                $sort: { totalReviews: -1 }
            }
        ]);
    }

    /**
     * Get variant statistics (stock and pricing)
     */
    static async getVariantStatistics() {
        return await Product.aggregate([
            {
                $match: { isActive: true }
            },
            {
                $unwind: '$variants'
            },
            {
                $match: { 'variants.isActive': true }
            },
            {
                $group: {
                    _id: '$_id',
                    productName: { $first: '$name' },
                    category: { $first: '$category' },
                    brand: { $first: '$brand' },
                    totalVariants: { $sum: 1 },
                    averageVariantPrice: { $avg: '$variants.price' },
                    minVariantPrice: { $min: '$variants.price' },
                    maxVariantPrice: { $max: '$variants.price' },
                    totalStock: { $sum: '$variants.stock.quantity' },
                    totalReserved: { $sum: '$variants.stock.reserved' },
                    totalAvailable: { $sum: '$variants.stock.available' }
                }
            },
            {
                $project: {
                    productName: 1,
                    category: 1,
                    brand: 1,
                    totalVariants: 1,
                    averageVariantPrice: { $round: ['$averageVariantPrice', 2] },
                    minVariantPrice: 1,
                    maxVariantPrice: 1,
                    totalStock: 1,
                    totalReserved: 1,
                    totalAvailable: 1,
                    reservedPercentage: {
                        $cond: [
                            { $eq: ['$totalStock', 0] },
                            0,
                            { $round: [{ $multiply: [{ $divide: ['$totalReserved', '$totalStock'] }, 100] }, 2] }
                        ]
                    }
                }
            },
            {
                $sort: { totalStock: -1 }
            }
        ]);
    }

    /**
     * Get products with low stock by category
     */
    static async getLowStockByCategory(threshold = 10) {
        return await Product.aggregate([
            {
                $match: {
                    isActive: true,
                    totalStock: { $gt: 0, $lte: threshold }
                }
            },
            {
                $group: {
                    _id: '$category',
                    products: {
                        $push: {
                            name: '$name',
                            brand: '$brand',
                            stock: '$totalStock',
                            purchaseCount: '$purchaseCount'
                        }
                    },
                    totalProducts: { $sum: 1 },
                    totalStock: { $sum: '$totalStock' }
                }
            },
            {
                $sort: { totalProducts: -1 }
            }
        ]);
    }

    /**
     * Get price range analysis by category
     */
    static async getPriceRangeByCategory() {
        return await Product.aggregate([
            {
                $match: { isActive: true }
            },
            {
                $bucket: {
                    groupBy: '$basePrice',
                    boundaries: [0, 50, 100, 500, 1000, 5000, 10000],
                    default: 'Over 10000',
                    output: {
                        count: { $sum: 1 },
                        products: {
                            $push: {
                                name: '$name',
                                category: '$category',
                                price: '$basePrice',
                                rating: '$averageRating'
                            }
                        },
                        averageRating: { $avg: '$averageRating' },
                        totalSales: { $sum: '$purchaseCount' }
                    }
                }
            }
        ]);
    }

    /**
     * Get featured products with highest engagement
     */
    static async getFeaturedProducts(limit = 10) {
        return await Product.aggregate([
            {
                $match: {
                    isActive: true,
                    featured: true
                }
            },
            {
                $addFields: {
                    engagementScore: {
                        $add: [
                            { $multiply: ['$averageRating', 2] },
                            { $multiply: ['$purchaseCount', 0.5] },
                            { $multiply: ['$viewCount', 0.01] },
                            { $multiply: ['$totalReviews', 0.1] }
                        ]
                    }
                }
            },
            {
                $project: {
                    name: 1,
                    brand: 1,
                    category: 1,
                    basePrice: 1,
                    averageRating: 1,
                    totalReviews: 1,
                    purchaseCount: 1,
                    viewCount: 1,
                    totalStock: 1,
                    engagementScore: { $round: ['$engagementScore', 2] }
                }
            },
            {
                $sort: { engagementScore: -1 }
            },
            {
                $limit: limit
            }
        ]);
    }

    /**
     * Get product performance metrics
     */
    static async getProductPerformance() {
        return await Product.aggregate([
            {
                $match: { isActive: true }
            },
            {
                $addFields: {
                    conversionRate: {
                        $cond: [
                            { $eq: ['$viewCount', 0] },
                            0,
                            { $multiply: [{ $divide: ['$purchaseCount', '$viewCount'] }, 100] }
                        ]
                    },
                    reviewRate: {
                        $cond: [
                            { $eq: ['$purchaseCount', 0] },
                            0,
                            { $multiply: [{ $divide: ['$totalReviews', '$purchaseCount'] }, 100] }
                        ]
                    }
                }
            },
            {
                $project: {
                    name: 1,
                    category: 1,
                    brand: 1,
                    viewCount: 1,
                    purchaseCount: 1,
                    totalReviews: 1,
                    averageRating: 1,
                    conversionRate: { $round: ['$conversionRate', 2] },
                    reviewRate: { $round: ['$reviewRate', 2] }
                }
            },
            {
                $sort: { purchaseCount: -1 }
            },
            {
                $limit: 20
            }
        ]);
    }

    /**
     * Get inventory value by category
     */
    static async getInventoryValue() {
        return await Product.aggregate([
            {
                $match: { isActive: true }
            },
            {
                $unwind: '$variants'
            },
            {
                $group: {
                    _id: '$category',
                    totalInventoryValue: {
                        $sum: { $multiply: ['$variants.stock.quantity', '$variants.price'] }
                    },
                    availableInventoryValue: {
                        $sum: { $multiply: ['$variants.stock.available', '$variants.price'] }
                    },
                    reservedInventoryValue: {
                        $sum: { $multiply: ['$variants.stock.reserved', '$variants.price'] }
                    },
                    totalUnits: { $sum: '$variants.stock.quantity' },
                    availableUnits: { $sum: '$variants.stock.available' }
                }
            },
            {
                $project: {
                    category: '$_id',
                    totalInventoryValue: { $round: ['$totalInventoryValue', 2] },
                    availableInventoryValue: { $round: ['$availableInventoryValue', 2] },
                    reservedInventoryValue: { $round: ['$reservedInventoryValue', 2] },
                    totalUnits: 1,
                    availableUnits: 1
                }
            },
            {
                $sort: { totalInventoryValue: -1 }
            }
        ]);
    }
}

module.exports = AggregationService;
