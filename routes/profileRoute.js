const express = require('express');
const { getProfile, updateProfile } = require("../controllers/profileController")
const authToken = require('../middleware/auth');
const multer = require("multer")

const router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    },
})

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5 
    }
});

router.get("/get/:id", authToken, getProfile)

router.post("/update/:id", authToken,upload.single("profilePic"), updateProfile)

module.exports = router;