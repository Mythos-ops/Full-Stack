require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/Product');
const connectDB = require('../config/database');

const sampleProducts = [
    {
        name: 'Wireless Bluetooth Headphones',
        description: 'Premium wireless headphones with active noise cancellation, 30-hour battery life, and superior sound quality.',
        category: 'Electronics',
        brand: 'SoundMaster',
        basePrice: 199.99,
        discount: {
            percentage: 15,
            startDate: new Date('2026-03-01'),
            endDate: new Date('2026-03-31')
        },
        variants: [
            {
                name: 'Black - Standard',
                sku: 'WBH-BLK-STD',
                price: 199.99,
                attributes: { color: 'Black', size: 'Standard' },
                stock: { quantity: 50, reserved: 5, available: 45 },
                isActive: true,
                images: ['headphones-black-1.jpg', 'headphones-black-2.jpg']
            },
            {
                name: 'Silver - Standard',
                sku: 'WBH-SLV-STD',
                price: 209.99,
                attributes: { color: 'Silver', size: 'Standard' },
                stock: { quantity: 30, reserved: 2, available: 28 },
                isActive: true,
                images: ['headphones-silver-1.jpg']
            }
        ],
        reviews: [
            {
                user: 'John Doe',
                rating: 5,
                comment: 'Excellent sound quality! Best headphones I\'ve ever owned.',
                isVerifiedPurchase: true,
                helpful: 12
            },
            {
                user: 'Jane Smith',
                rating: 4,
                comment: 'Great noise cancellation, but a bit heavy for long wear.',
                isVerifiedPurchase: true,
                helpful: 8
            }
        ],
        tags: ['wireless', 'bluetooth', 'noise-cancelling', 'premium'],
        featured: true,
        viewCount: 1250,
        purchaseCount: 45
    },
    {
        name: 'Organic Cotton T-Shirt',
        description: 'Comfortable, eco-friendly t-shirt made from 100% organic cotton. Perfect for everyday wear.',
        category: 'Clothing',
        brand: 'EcoWear',
        basePrice: 29.99,
        variants: [
            {
                name: 'White - Small',
                sku: 'OCT-WHT-S',
                price: 29.99,
                attributes: { color: 'White', size: 'S' },
                stock: { quantity: 100, reserved: 10, available: 90 },
                isActive: true
            },
            {
                name: 'White - Medium',
                sku: 'OCT-WHT-M',
                price: 29.99,
                attributes: { color: 'White', size: 'M' },
                stock: { quantity: 150, reserved: 15, available: 135 },
                isActive: true
            },
            {
                name: 'Black - Medium',
                sku: 'OCT-BLK-M',
                price: 29.99,
                attributes: { color: 'Black', size: 'M' },
                stock: { quantity: 120, reserved: 8, available: 112 },
                isActive: true
            },
            {
                name: 'Black - Large',
                sku: 'OCT-BLK-L',
                price: 29.99,
                attributes: { color: 'Black', size: 'L' },
                stock: { quantity: 80, reserved: 5, available: 75 },
                isActive: true
            }
        ],
        reviews: [
            {
                user: 'Alice Johnson',
                rating: 5,
                comment: 'Super soft and comfortable. Love that it\'s organic!',
                isVerifiedPurchase: true,
                helpful: 25
            },
            {
                user: 'Bob Wilson',
                rating: 5,
                comment: 'Great quality, fits perfectly. Will buy more colors.',
                isVerifiedPurchase: true,
                helpful: 18
            },
            {
                user: 'Carol Brown',
                rating: 4,
                comment: 'Nice shirt, but runs slightly small.',
                isVerifiedPurchase: false,
                helpful: 5
            }
        ],
        tags: ['organic', 'cotton', 'eco-friendly', 'basic'],
        featured: true,
        viewCount: 890,
        purchaseCount: 156
    },
    {
        name: 'Programming in JavaScript - Complete Guide',
        description: 'Comprehensive guide to modern JavaScript, covering ES6+, async programming, and best practices.',
        category: 'Books',
        brand: 'TechBooks Publishing',
        basePrice: 49.99,
        variants: [
            {
                name: 'Paperback',
                sku: 'PJS-PB-001',
                price: 49.99,
                attributes: { material: 'Paper' },
                stock: { quantity: 200, reserved: 20, available: 180 },
                isActive: true
            },
            {
                name: 'Hardcover',
                sku: 'PJS-HC-001',
                price: 69.99,
                attributes: { material: 'Hardcover' },
                stock: { quantity: 75, reserved: 5, available: 70 },
                isActive: true
            }
        ],
        reviews: [
            {
                user: 'Developer Dave',
                rating: 5,
                comment: 'Best JavaScript book I\'ve read. Very comprehensive and well-explained.',
                isVerifiedPurchase: true,
                helpful: 45
            },
            {
                user: 'Sarah Code',
                rating: 5,
                comment: 'Perfect for both beginners and experienced developers.',
                isVerifiedPurchase: true,
                helpful: 32
            },
            {
                user: 'Mike Tech',
                rating: 4,
                comment: 'Great content, could use more real-world examples.',
                isVerifiedPurchase: true,
                helpful: 15
            }
        ],
        tags: ['programming', 'javascript', 'coding', 'education'],
        featured: false,
        viewCount: 650,
        purchaseCount: 89
    },
    {
        name: 'Smart LED Plant Grow Light',
        description: 'Full spectrum LED grow light with timer and adjustable brightness. Perfect for indoor plants.',
        category: 'Home & Garden',
        brand: 'GreenThumb',
        basePrice: 79.99,
        discount: {
            percentage: 20,
            startDate: new Date('2026-03-05'),
            endDate: new Date('2026-03-15')
        },
        variants: [
            {
                name: 'Standard 20W',
                sku: 'LED-PL-20W',
                price: 79.99,
                attributes: { weight: 0.5 },
                stock: { quantity: 60, reserved: 3, available: 57 },
                isActive: true
            },
            {
                name: 'Pro 40W',
                sku: 'LED-PL-40W',
                price: 119.99,
                attributes: { weight: 0.8 },
                stock: { quantity: 35, reserved: 2, available: 33 },
                isActive: true
            }
        ],
        reviews: [
            {
                user: 'Plant Parent',
                rating: 5,
                comment: 'My plants are thriving! The timer feature is so convenient.',
                isVerifiedPurchase: true,
                helpful: 22
            },
            {
                user: 'Green Thumb Gary',
                rating: 4,
                comment: 'Good light, works well. Wish it was a bit brighter.',
                isVerifiedPurchase: true,
                helpful: 8
            }
        ],
        tags: ['plants', 'LED', 'indoor', 'smart-home'],
        featured: true,
        viewCount: 420,
        purchaseCount: 38
    },
    {
        name: 'Professional Yoga Mat',
        description: 'Extra thick, non-slip yoga mat with alignment marks. Eco-friendly TPE material.',
        category: 'Sports',
        brand: 'ZenFit',
        basePrice: 39.99,
        variants: [
            {
                name: 'Purple - 6mm',
                sku: 'YM-PUR-6MM',
                price: 39.99,
                attributes: { color: 'Purple', size: '6mm' },
                stock: { quantity: 85, reserved: 8, available: 77 },
                isActive: true
            },
            {
                name: 'Blue - 6mm',
                sku: 'YM-BLU-6MM',
                price: 39.99,
                attributes: { color: 'Blue', size: '6mm' },
                stock: { quantity: 92, reserved: 6, available: 86 },
                isActive: true
            },
            {
                name: 'Pink - 8mm',
                sku: 'YM-PNK-8MM',
                price: 49.99,
                attributes: { color: 'Pink', size: '8mm' },
                stock: { quantity: 45, reserved: 4, available: 41 },
                isActive: true
            }
        ],
        reviews: [
            {
                user: 'Yoga Enthusiast',
                rating: 5,
                comment: 'Perfect grip, great thickness. Best mat I\'ve owned!',
                isVerifiedPurchase: true,
                helpful: 34
            },
            {
                user: 'Fitness Fan',
                rating: 5,
                comment: 'Very comfortable for floor exercises too.',
                isVerifiedPurchase: true,
                helpful: 19
            },
            {
                user: 'Beginner Betty',
                rating: 4,
                comment: 'Good mat, but takes a while to flatten out.',
                isVerifiedPurchase: true,
                helpful: 7
            }
        ],
        tags: ['yoga', 'fitness', 'exercise', 'non-slip'],
        featured: false,
        viewCount: 780,
        purchaseCount: 67
    },
    {
        name: 'Educational STEM Building Blocks Set',
        description: '500-piece building blocks set for creative construction and learning. Compatible with major brands.',
        category: 'Toys',
        brand: 'SmartPlay',
        basePrice: 59.99,
        variants: [
            {
                name: 'Classic Set',
                sku: 'BB-STEM-500',
                price: 59.99,
                attributes: {},
                stock: { quantity: 120, reserved: 12, available: 108 },
                isActive: true
            }
        ],
        reviews: [
            {
                user: 'Parent Paula',
                rating: 5,
                comment: 'Kids love it! Great for creativity and problem-solving.',
                isVerifiedPurchase: true,
                helpful: 28
            },
            {
                user: 'Teacher Tom',
                rating: 5,
                comment: 'Excellent educational value. Use it in my classroom.',
                isVerifiedPurchase: true,
                helpful: 15
            },
            {
                user: 'Grandma Grace',
                rating: 5,
                comment: 'Perfect gift for my grandkids. They play with it for hours!',
                isVerifiedPurchase: true,
                helpful: 12
            }
        ],
        tags: ['toys', 'educational', 'STEM', 'building'],
        featured: false,
        viewCount: 540,
        purchaseCount: 78
    },
    {
        name: 'Premium Stainless Steel Water Bottle',
        description: 'Insulated water bottle keeps drinks cold for 24h, hot for 12h. BPA-free, leak-proof design.',
        category: 'Home & Garden',
        brand: 'HydroLife',
        basePrice: 34.99,
        variants: [
            {
                name: 'Black - 500ml',
                sku: 'WB-BLK-500',
                price: 34.99,
                attributes: { color: 'Black', size: '500ml' },
                stock: { quantity: 150, reserved: 15, available: 135 },
                isActive: true
            },
            {
                name: 'Silver - 750ml',
                sku: 'WB-SLV-750',
                price: 39.99,
                attributes: { color: 'Silver', size: '750ml' },
                stock: { quantity: 100, reserved: 8, available: 92 },
                isActive: true
            },
            {
                name: 'Blue - 1000ml',
                sku: 'WB-BLU-1000',
                price: 44.99,
                attributes: { color: 'Blue', size: '1000ml' },
                stock: { quantity: 75, reserved: 5, available: 70 },
                isActive: true
            }
        ],
        reviews: [
            {
                user: 'Hiker Hannah',
                rating: 5,
                comment: 'Keeps water ice cold all day on the trail!',
                isVerifiedPurchase: true,
                helpful: 30
            },
            {
                user: 'Office Owen',
                rating: 4,
                comment: 'Great bottle, wish it fit in my car cup holder.',
                isVerifiedPurchase: true,
                helpful: 14
            }
        ],
        tags: ['water-bottle', 'insulated', 'eco-friendly', 'hydration'],
        featured: true,
        viewCount: 920,
        purchaseCount: 142
    },
    {
        name: 'Wireless Gaming Mouse',
        description: 'High-precision gaming mouse with customizable RGB lighting and 16000 DPI sensor.',
        category: 'Electronics',
        brand: 'GameTech Pro',
        basePrice: 89.99,
        variants: [
            {
                name: 'Black Edition',
                sku: 'GM-BLK-PRO',
                price: 89.99,
                attributes: { color: 'Black' },
                stock: { quantity: 8, reserved: 2, available: 6 },
                isActive: true
            },
            {
                name: 'White Edition',
                sku: 'GM-WHT-PRO',
                price: 94.99,
                attributes: { color: 'White' },
                stock: { quantity: 5, reserved: 1, available: 4 },
                isActive: true
            }
        ],
        reviews: [
            {
                user: 'Pro Gamer',
                rating: 5,
                comment: 'Incredible precision! My aim has improved noticeably.',
                isVerifiedPurchase: true,
                helpful: 40
            },
            {
                user: 'Casual Player',
                rating: 4,
                comment: 'Great mouse, battery life could be better.',
                isVerifiedPurchase: true,
                helpful: 12
            }
        ],
        tags: ['gaming', 'wireless', 'RGB', 'high-dpi'],
        featured: false,
        viewCount: 680,
        purchaseCount: 52
    }
];

async function seedDatabase() {
    try {
        console.log('🌱 Starting database seed...\n');

        // Connect to database
        await connectDB();

        // Clear existing products
        console.log('🗑️  Clearing existing products...');
        await Product.deleteMany({});
        console.log('✅ Existing products cleared\n');

        // Insert sample products
        console.log('📦 Inserting sample products...');
        const insertedProducts = await Product.insertMany(sampleProducts);
        console.log(`✅ ${insertedProducts.length} products inserted\n`);

        // Display summary
        console.log('📊 Seed Summary:');
        console.log(`   Total Products: ${insertedProducts.length}`);
        
        const categoryCount = {};
        insertedProducts.forEach(product => {
            categoryCount[product.category] = (categoryCount[product.category] || 0) + 1;
        });
        
        console.log('\n   Products by Category:');
        Object.entries(categoryCount).forEach(([category, count]) => {
            console.log(`      ${category}: ${count}`);
        });

        const totalVariants = insertedProducts.reduce((sum, product) => sum + product.variants.length, 0);
        const totalReviews = insertedProducts.reduce((sum, product) => sum + product.reviews.length, 0);
        
        console.log(`\n   Total Variants: ${totalVariants}`);
        console.log(`   Total Reviews: ${totalReviews}`);
        console.log('\n✅ Database seeded successfully!\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
}

// Run the seed function
seedDatabase();
