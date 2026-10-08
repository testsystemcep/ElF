const express = require('express');
const router = express.Router();
const { handleUniversalRequest } = require('../controllers/universalController');

// The single universal endpoint
router.post('/universal', handleUniversalRequest);

module.exports = router;
