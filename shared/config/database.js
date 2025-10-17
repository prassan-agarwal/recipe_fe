// shared/config/database.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
    
    return conn;
  } catch (error) {
    console.error('❌ Database connection error:', error.message);
    
    if (error.message.includes('MONGODB_URI is not defined')) {
      console.log('💡 Please add MONGODB_URI to your .env file');
      console.log('💡 Example: MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/recipe-app');
    } else if (error.message.includes('authentication failed')) {
      console.log('💡 Check your MongoDB username and password in the connection string');
    } else if (error.message.includes('getaddrinfo')) {
      console.log('💡 Check your MongoDB connection string and internet connection');
    }
    
    process.exit(1);
  }
};

// Handle MongoDB connection events
mongoose.connection.on('connected', () => {
  console.log('🔗 Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('⚠️ Mongoose disconnected from MongoDB');
});

// Close connection when app is terminated
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('🔌 MongoDB connection closed through app termination');
  process.exit(0);
});

module.exports = connectDB;