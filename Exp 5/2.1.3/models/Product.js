const mongoose = require('mongoose');

// Nested Schema for Product Reviews
const reviewSchema = new mongoose.Schema({
    user: {
        type: String,
        required: [true, 'User name is required'],
        trim: true
    },
    rating: {
        type: Number,
        required: [true, 'Rating is required'],
        min: [1, 'Rating must be at least 1'],
        max: [5, 'Rating cannot exceed 5']
    },
    comment: {
        type: String,
        required: [true, 'Review comment is required'],
        trim: true,
        maxlength: [1000, 'Comment cannot exceed 1000 characters']
    },
    isVerifiedPurchase: {
        type: Boolean,
        default: false
    },
    helpful: {
        type: Number,
        default: 0,
        min: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    _id: true  // Each review gets its own _id
});

// Nested Schema for Product Variants (e.g., size, color)
const variantSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Variant name is required'],
        trim: true
    },
    sku: {
        type: String,
        required: [true, 'SKU is required'],
        unique: true,
        uppercase: true,
        trim: true
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price cannot be negative']
    },
    attributes: {
        color: String,
        size: String,
        material: String,
        weight: Number
    },
    stock: {
        quantity: {
            type: Number,
            required: [true, 'Stock quantity is required'],
            min: [0, 'Stock cannot be negative'],
            default: 0
        },
        reserved: {
            type: Number,
            default: 0,
            min: 0
        },
        available: {
            type: Number,
            default: 0,
            min: 0
        }
    },
    isActive: {
        type: Boolean,
        default: true
    },
    images: [String]
}, {
    _id: true
});

// Main Product Schema with nested reviews and variants
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true,
        maxlength: [200, 'Product name cannot exceed 200 characters']
    },
    description: {
        type: String,
        required: [true, 'Product description is required'],
        trim: true,
        maxlength: [2000, 'Description cannot exceed 2000 characters']
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        enum: ['Electronics', 'Clothing', 'Books', 'Home & Garden', 'Sports', 'Toys', 'Food', 'Other'],
        index: true
    },
    brand: {
        type: String,
        required: [true, 'Brand is required'],
        trim: true,
        index: true
    },
    basePrice: {
        type: Number,
        required: [true, 'Base price is required'],
        min: [0, 'Price cannot be negative']
    },
    discount: {
        percentage: {
            type: Number,
            default: 0,
            min: 0,
            max: 100
        },
        startDate: Date,
        endDate: Date
    },
    // Nested variants array
    variants: {
        type: [variantSchema],
        validate: [arrayMinLength, 'Product must have at least one variant']
    },
    // Nested reviews array
    reviews: [reviewSchema],
    // Computed fields
    averageRating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    totalReviews: {
        type: Number,
        default: 0,
        min: 0
    },
    totalStock: {
        type: Number,
        default: 0,
        min: 0
    },
    tags: {
        type: [String],
        index: true
    },
    isActive: {
        type: Boolean,
        default: true,
        index: true
    },
    featured: {
        type: Boolean,
        default: false,
        index: true
    },
    viewCount: {
        type: Number,
        default: 0,
        min: 0
    },
    purchaseCount: {
        type: Number,
        default: 0,
        min: 0
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Validator function
function arrayMinLength(val) {
    return val && val.length > 0;
}

// ==================== INDEXES ====================

// Compound index for category and brand queries
productSchema.index({ category: 1, brand: 1 });

// Text index for search functionality
productSchema.index({ name: 'text', description: 'text', tags: 'text' });

// Index for price range queries
productSchema.index({ basePrice: 1 });

// Index for sorting by rating
productSchema.index({ averageRating: -1 });

// Compound index for featured active products
productSchema.index({ featured: 1, isActive: 1, averageRating: -1 });

// Index for variant SKU lookups
productSchema.index({ 'variants.sku': 1 });

// ==================== VIRTUAL FIELDS ====================

// Virtual for discounted price
productSchema.virtual('currentPrice').get(function() {
    if (this.discount && this.discount.percentage > 0) {
        const now = new Date();
        if (this.discount.startDate && this.discount.endDate &&
            now >= this.discount.startDate && now <= this.discount.endDate) {
            return this.basePrice * (1 - this.discount.percentage / 100);
        }
    }
    return this.basePrice;
});

// Virtual for stock status
productSchema.virtual('stockStatus').get(function() {
    if (this.totalStock === 0) return 'Out of Stock';
    if (this.totalStock < 10) return 'Low Stock';
    return 'In Stock';
});

// ==================== PRE-SAVE MIDDLEWARE ====================

// Calculate average rating and total reviews before saving
productSchema.pre('save', function(next) {
    if (this.reviews && this.reviews.length > 0) {
        const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
        this.averageRating = parseFloat((totalRating / this.reviews.length).toFixed(2));
        this.totalReviews = this.reviews.length;
    } else {
        this.averageRating = 0;
        this.totalReviews = 0;
    }
    next();
});

// Calculate total stock before saving
productSchema.pre('save', function(next) {
    if (this.variants && this.variants.length > 0) {
        this.totalStock = this.variants.reduce((sum, variant) => {
            variant.stock.available = variant.stock.quantity - variant.stock.reserved;
            return sum + variant.stock.available;
        }, 0);
    } else {
        this.totalStock = 0;
    }
    next();
});

// ==================== METHODS ====================

// Method to add a review
productSchema.methods.addReview = function(reviewData) {
    this.reviews.push(reviewData);
    return this.save();
};

// Method to update stock for a specific variant
productSchema.methods.updateVariantStock = async function(variantId, quantity) {
    const variant = this.variants.id(variantId);
    if (!variant) {
        throw new Error('Variant not found');
    }
    
    variant.stock.quantity += quantity;
    if (variant.stock.quantity < 0) {
        throw new Error('Insufficient stock');
    }
    
    variant.stock.available = variant.stock.quantity - variant.stock.reserved;
    return this.save();
};

// Method to reserve stock for a variant
productSchema.methods.reserveStock = async function(variantId, quantity) {
    const variant = this.variants.id(variantId);
    if (!variant) {
        throw new Error('Variant not found');
    }
    
    if (variant.stock.available < quantity) {
        throw new Error('Insufficient available stock');
    }
    
    variant.stock.reserved += quantity;
    variant.stock.available = variant.stock.quantity - variant.stock.reserved;
    return this.save();
};

// Method to release reserved stock
productSchema.methods.releaseStock = async function(variantId, quantity) {
    const variant = this.variants.id(variantId);
    if (!variant) {
        throw new Error('Variant not found');
    }
    
    variant.stock.reserved -= quantity;
    if (variant.stock.reserved < 0) {
        variant.stock.reserved = 0;
    }
    
    variant.stock.available = variant.stock.quantity - variant.stock.reserved;
    return this.save();
};

// Method to complete purchase (reduce stock)
productSchema.methods.completePurchase = async function(variantId, quantity) {
    const variant = this.variants.id(variantId);
    if (!variant) {
        throw new Error('Variant not found');
    }
    
    if (variant.stock.reserved < quantity) {
        throw new Error('Quantity exceeds reserved stock');
    }
    
    variant.stock.quantity -= quantity;
    variant.stock.reserved -= quantity;
    variant.stock.available = variant.stock.quantity - variant.stock.reserved;
    
    this.purchaseCount += 1;
    
    return this.save();
};

// Method to increment view count
productSchema.methods.incrementViews = async function() {
    this.viewCount += 1;
    return this.save();
};

// ==================== STATIC METHODS ====================

// Static method to find products by category with filters
productSchema.statics.findByCategory = function(category, filters = {}) {
    const query = { category, isActive: true };
    
    if (filters.minPrice) query.basePrice = { $gte: filters.minPrice };
    if (filters.maxPrice) query.basePrice = { ...query.basePrice, $lte: filters.maxPrice };
    if (filters.brand) query.brand = filters.brand;
    if (filters.minRating) query.averageRating = { $gte: filters.minRating };
    
    return this.find(query).sort({ averageRating: -1, purchaseCount: -1 });
};

// Static method to search products
productSchema.statics.searchProducts = function(searchTerm, options = {}) {
    return this.find(
        { $text: { $search: searchTerm }, isActive: true },
        { score: { $meta: 'textScore' } }
    )
    .sort({ score: { $meta: 'textScore' } })
    .limit(options.limit || 20);
};

// Static method to get low stock variants
productSchema.statics.getLowStockProducts = function(threshold = 10) {
    return this.find({
        isActive: true,
        totalStock: { $gt: 0, $lt: threshold }
    }).select('name variants totalStock');
};

// Static method to bulk update stock
productSchema.statics.bulkUpdateStock = async function(updates) {
    const bulkOps = updates.map(update => ({
        updateOne: {
            filter: { _id: update.productId, 'variants._id': update.variantId },
            update: { 
                $inc: { 
                    'variants.$.stock.quantity': update.quantity 
                }
            }
        }
    }));
    
    return this.bulkWrite(bulkOps);
};

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
