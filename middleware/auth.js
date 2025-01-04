const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");

async function authToken(req, res, next) {
    try {
        console.log("⭐ Auth Middleware Started");
                
        const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];
        console.log("📜 Received token:", token ? "Token exists" : "No token");

        if (!token) {
            console.log("❌ No token provided");
            return res.status(401).json({
                success: false,
                message: "Access denied. No token provided."
            });
        }
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("🔓 Decoded token:", decoded);
                
        const user = await userModel.findById(decoded.id);
        console.log("👤 Found user:", user ? user._id : "No user found");
        
        if (!user) {
            console.log("❌ User not found in database");
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
       
        req.user = user;
        console.log("✅ Auth middleware successful");
        next();

    } catch (error) {
        console.log("❌ Auth error:", error.message);
        return res.status(401).json({
            success: false,
            message: "Invalid token",
            error: error.message
        });
    }
}

module.exports = authToken;