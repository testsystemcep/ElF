const express = require('express');
const router = express.Router();
const { submitFeedback, getFeedback } = require('./controller');
router.post('/', submitFeedback);
router.get('/', getFeedback);

module.exports = router;
