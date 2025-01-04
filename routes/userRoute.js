const express = require('express');
const userController = require("../controllers/userController");
const authToken = require('../middleware/auth');
const upload = require("../middleware/multer");


const router = express.Router()


router.post("/signup",upload.single('profilePic'), userController.register)
router.post("/login", userController.login)
router.get("/user-details", authToken, userController.userDetails)
router.get("/logout",userController.logout);

// Admin Panel Only

router.get("/all-users",authToken,userController.allUsers)
router.post("/update-user",authToken,userController.updateUser)
router.get('/:userId', authToken, userController.getUserDetails)



module.exports = router;