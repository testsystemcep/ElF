const express = require('express');
const router = express.Router();
const { 
  getNotifications, 
  getNotificationById,
  sendNotification, 
  markAsRead, 
  deleteNotification, 
  updateNotification 
} = require('./controller');
const { verifyAdminToken } = require('../middleware/adminAuth');

// Public endpoints (Flutter app access)
router.get('/', getNotifications);
router.get('/:id', getNotificationById);
router.put('/read/:id', markAsRead);

// Protected endpoints (Admin panel only)
router.post('/send', verifyAdminToken, sendNotification);
router.put('/update/:id', verifyAdminToken, updateNotification);
router.delete('/:id', verifyAdminToken, deleteNotification);

module.exports = router;
