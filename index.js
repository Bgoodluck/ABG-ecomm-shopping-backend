
const express = require("express");
const cors = require("cors");
require("dotenv").config()
const connectDB = require("./config/db")
const http = require('http');
const setupSocketIO = require('./services/setupSocketIO');
const userRoute = require("./routes/userRoute")
const profileRoute = require("./routes/profileRoute")
const cartRoute = require("./routes/cartRoute")
const uploadProductRoute = require("./routes/uploadProductRoute")
const productReviewRoute = require("./routes/productReviewRoute")
const subscribeRoute = require("./routes/subscribeRoute")
const orderRoute = require ("./routes/orderRoute")
const path = require("path")
const cookieparser = require("cookie-parser");
const chatMessageRoute = require("./routes/chatMessageRoute")
const openAiRoute = require('./routes/openAiRoute');


const app = express();
const server = http.createServer(app);
app.use(cors(
    {
        origin: process.env.FRONTEND_URL || "https://abg-ecomm-shopping-frontend-wfta.vercel.app",
        allowedHeaders: ["Content-Type", "Authorization", "auth-token"],
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
        exposedHeaders: ["set-cookie"],
        credentials: true
    }
))
app.use(express.json({ limit: '50mb' }))
app.use(cookieparser());
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


app.use("/api/user", userRoute);
app.use("/api/profile", profileRoute)
app.use("/api/product", uploadProductRoute)
app.use("/api/review", productReviewRoute)
app.use("/api/newsletter", subscribeRoute)
app.use("/api/cart", cartRoute)
app.use("/api/order",orderRoute)
app.use("/api/chat", chatMessageRoute)
app.use('/api/openai', openAiRoute);



const io = setupSocketIO(server);


const PORT = process.env.PORT || 8080

connectDB()
// app.listen(PORT,()=>{
//     console.log(`Server is running on port ${PORT}`)
// })

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });


module.exports = { app, server, io };