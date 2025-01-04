const express = require('express');
const router = express.Router();
const openaiController = require('../controllers/openAiController');

router.post('/generate-response', openaiController.generateAIResponse);

module.exports = router;