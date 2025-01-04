const mongoose = require("mongoose");

 async function connectDB() {
  try {
    const connectionURL = process.env.MONGODB_URL;
    
    
    await mongoose.connect(connectionURL);
    
    console.log('ABG connection to MongoDB is successful');
  } catch (error) {
    console.error('MongoDB connection error:', error);
   
    throw error;
  }
};

module.exports = connectDB
