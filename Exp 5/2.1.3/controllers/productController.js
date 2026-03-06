const Product = require('../models/Product');
const AggregationService = require('../services/aggregationService');

class ProductController {
    // Create a new product
    static async createProduct(req, res) {
        try {
            const product = new Product(req.body);
            await product.save();
            
            res.status(201).json({
                success: true,
                message: 'Product created successfully',
                data: product
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message,
                errors: error.errors
            });
        }
    }

    // Get all products with optional filters
    static async getAllProducts(req, res) {
        try {
            const {
                category,
                brand,
                minPrice,
                maxPrice,
                minRating,
                inStock,
                featured,
                page = 1,
                limit = 20
            } = req.query;

            const query = { isActive: true };
            
            if (category) query.category = category;
            if (brand) query.brand = brand;
            if (minPrice || maxPrice) {
                query.basePrice = {};
                if (minPrice) query.basePrice.$gte = parseFloat(minPrice);
                if (maxPrice) query.basePrice.$lte = parseFloat(maxPrice);
            }
            if (minRating) query.averageRating = { $gte: parseFloat(minRating) };
            if (inStock === 'true') query.totalStock = { $gt: 0 };
            if (featured === 'true') query.featured = true;

            const skip = (page - 1) * limit;
            
            const products = await Product.find(query)
                .sort({ averageRating: -1, purchaseCount: -1 })
                .skip(skip)
                .limit(parseInt(limit));

            const total = await Product.countDocuments(query);

            res.json({
                success: true,
                data: products,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total,
                    pages: Math.ceil(total / limit)
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // Get single product by ID
    static async getProductById(req, res) {
        try {
            const product = await Product.findById(req.params.id);
            
            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: 'Product not found'
                });
            }

            // Increment view count
            await product.incrementViews();

            res.json({
                success: true,
                data: product
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // Update product
    static async updateProduct(req, res) {
        try {
            const product = await Product.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true, runValidators: true }
            );

            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: 'Product not found'
                });
            }

            res.json({
                success: true,
                message: 'Product updated successfully',
                data: product
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    // Delete (soft delete) product
    static async deleteProduct(req, res) {
        try {
            const product = await Product.findByIdAndUpdate(
                req.params.id,
                { isActive: false },
                { new: true }
            );

            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: 'Product not found'
                });
            }

            res.json({
                success: true,
                message: 'Product deleted successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // Add review to product
    static async addReview(req, res) {
        try {
            const product = await Product.findById(req.params.id);
            
            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: 'Product not found'
                });
            }

            await product.addReview(req.body);

            res.json({
                success: true,
                message: 'Review added successfully',
                data: product
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    // Update variant stock
    static async updateVariantStock(req, res) {
        try {
            const { variantId, quantity } = req.body;
            
            const product = await Product.findById(req.params.id);
            
            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: 'Product not found'
                });
            }

            await product.updateVariantStock(variantId, quantity);

            res.json({
                success: true,
                message: 'Stock updated successfully',
                data: product
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    // Reserve stock for variant
    static async reserveStock(req, res) {
        try {
            const { variantId, quantity } = req.body;
            
            const product = await Product.findById(req.params.id);
            
            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: 'Product not found'
                });
            }

            await product.reserveStock(variantId, quantity);

            res.json({
                success: true,
                message: 'Stock reserved successfully',
                data: product
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    // Release reserved stock
    static async releaseStock(req, res) {
        try {
            const { variantId, quantity } = req.body;
            
            const product = await Product.findById(req.params.id);
            
            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: 'Product not found'
                });
            }

            await product.releaseStock(variantId, quantity);

            res.json({
                success: true,
                message: 'Reserved stock released successfully',
                data: product
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    // Complete purchase
    static async completePurchase(req, res) {
        try {
            const { variantId, quantity } = req.body;
            
            const product = await Product.findById(req.params.id);
            
            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: 'Product not found'
                });
            }

            await product.completePurchase(variantId, quantity);

            res.json({
                success: true,
                message: 'Purchase completed successfully',
                data: product
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    // Search products
    static async searchProducts(req, res) {
        try {
            const { q, limit = 20 } = req.query;
            
            if (!q) {
                return res.status(400).json({
                    success: false,
                    message: 'Search query is required'
                });
            }

            const products = await Product.searchProducts(q, { limit: parseInt(limit) });

            res.json({
                success: true,
                data: products,
                count: products.length
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // Get products by category
    static async getProductsByCategory(req, res) {
        try {
            const { category } = req.params;
            const filters = req.query;

            const products = await Product.findByCategory(category, filters);

            res.json({
                success: true,
                data: products,
                count: products.length
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // Get low stock products
    static async getLowStockProducts(req, res) {
        try {
            const { threshold = 10 } = req.query;
            
            const products = await Product.getLowStockProducts(parseInt(threshold));

            res.json({
                success: true,
                data: products,
                count: products.length
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // ========== AGGREGATION ENDPOINTS ==========

    static async getCategoryStats(req, res) {
        try {
            const stats = await AggregationService.getProductsByCategory();
            res.json({ success: true, data: stats });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    static async getTopRatedProducts(req, res) {
        try {
            const { minReviews = 5, limit = 10 } = req.query;
            const products = await AggregationService.getTopRatedProducts(
                parseInt(minReviews),
                parseInt(limit)
            );
            res.json({ success: true, data: products });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    static async getBestSellers(req, res) {
        try {
            const { limit = 10 } = req.query;
            const products = await AggregationService.getBestSellingProducts(parseInt(limit));
            res.json({ success: true, data: products });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    static async getBrandStats(req, res) {
        try {
            const stats = await AggregationService.getBrandStatistics();
            res.json({ success: true, data: stats });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    static async getReviewStats(req, res) {
        try {
            const stats = await AggregationService.getReviewStatistics();
            res.json({ success: true, data: stats });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    static async getVariantStats(req, res) {
        try {
            const stats = await AggregationService.getVariantStatistics();
            res.json({ success: true, data: stats });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    static async getLowStockByCategory(req, res) {
        try {
            const { threshold = 10 } = req.query;
            const stats = await AggregationService.getLowStockByCategory(parseInt(threshold));
            res.json({ success: true, data: stats });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    static async getPriceRanges(req, res) {
        try {
            const stats = await AggregationService.getPriceRangeByCategory();
            res.json({ success: true, data: stats });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    static async getFeaturedProducts(req, res) {
        try {
            const { limit = 10 } = req.query;
            const products = await AggregationService.getFeaturedProducts(parseInt(limit));
            res.json({ success: true, data: products });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    static async getProductPerformance(req, res) {
        try {
            const stats = await AggregationService.getProductPerformance();
            res.json({ success: true, data: stats });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    static async getInventoryValue(req, res) {
        try {
            const stats = await AggregationService.getInventoryValue();
            res.json({ success: true, data: stats });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
}

module.exports = ProductController;
