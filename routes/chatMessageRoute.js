const express = require("express");
const authToken = require('../middleware/auth');
const { getChatHistory } = require("../controllers/chatMessageController");




const router = express.Router();


router.get('/history/:userId', authToken, getChatHistory);

module.exports = router;