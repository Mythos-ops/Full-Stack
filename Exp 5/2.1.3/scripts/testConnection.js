require('dotenv').config();
const mongoose = require('mongoose');

async function testConnection() {
    console.log('🔍 Testing MongoDB connection...\n');
    console.log(`Connection String: ${process.env.MONGODB_URI}\n`);
    
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 5000
        });
        
        console.log('✅ MongoDB Connected Successfully!');
        console.log(`   Host: ${conn.connection.host}`);
        console.log(`   Database: ${conn.connection.name}`);
        console.log(`   Port: ${conn.connection.port}\n`);
        
        await mongoose.connection.close();
        console.log('✅ Connection test passed!\n');
        process.exit(0);
    } catch (error) {
        console.error('❌ MongoDB Connection Failed!\n');
        console.error(`Error: ${error.message}\n`);
        
        if (error.message.includes('ECONNREFUSED')) {
            console.log('💡 Troubleshooting:');
            console.log('   1. MongoDB is not running locally');
            console.log('   2. Start MongoDB with: mongod');
            console.log('   3. Or use MongoDB Atlas (update .env file)\n');
        } else if (error.message.includes('Authentication')) {
            console.log('💡 Troubleshooting:');
            console.log('   1. Check username/password in connection string');
            console.log('   2. Verify database user permissions\n');
        } else if (error.message.includes('timed out')) {
            console.log('💡 Troubleshooting:');
            console.log('   1. MongoDB server is not accessible');
            console.log('   2. Check if MongoDB is running');
            console.log('   3. Check firewall settings');
            console.log('   4. For Atlas: whitelist your IP address\n');
        }
        
        process.exit(1);
    }
}

testConnection();
