const Notification = require('../models/Notification');
const { sendResponse } = require('../utils/response');

// GET /api/notifications
// Return all notifications sorted by createdAt DESC
const getNotifications = async (req, res) => {
  try {
    const clientClass = req.query.className || req.query.studentClass;
    let query = {};
    if (clientClass) {
      query = {
        $or: [
          { topic: 'all_students' },
          { topic: clientClass },
          { topic: { $exists: false } },
          { topic: '' }
        ]
      };
    }

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 });

    console.log(`[GET /api/notifications] Returned ${notifications.length} notifications (filtered by: ${clientClass || 'none'})`);

    return res.status(200).json({
      success: true,
      data: notifications
    });
  } catch (err) {
    console.error(`[GET /api/notifications] Error:`, err.message);
    return sendResponse(res, 500, false, `Notifications Error: ${err.message}`);
  }
};

// POST /api/notifications/send
// Save notification in MongoDB only
const sendNotification = async (req, res) => {
  console.log('[POST /api/notifications/send] Body:', req.body);
  const { title, message, type, topic } = req.body;

  try {
    const notification = new Notification({
      title,
      message,
      type: type || 'info',
      topic: topic || 'all_students',
    });

    await notification.save();
    
    console.log('✅ Notification saved in MongoDB:', notification._id);
    return res.status(201).json({ success: true, data: notification });
  } catch (err) {
    console.error(`❌ Notification Error:`, err.message);
    return sendResponse(res, 500, false, `Notification Error: ${err.message}`);
  }
};

// GET /api/notifications/:id
// Return a single notification by ID (used for edit pre-fill)
const getNotificationById = async (req, res) => {
  const { id } = req.params;
  try {
    const notification = await Notification.findById(id);
    if (!notification) return sendResponse(res, 404, false, "Notification not found");
    return res.status(200).json({ success: true, data: notification });
  } catch (err) {
    return sendResponse(res, 500, false, `Fetch Error: ${err.message}`);
  }
};

// Helper: Delete notification
const deleteNotification = async (req, res) => {
  const { id } = req.params;
  try {
    const notification = await Notification.findByIdAndDelete(id);
    if (!notification) return sendResponse(res, 404, false, "Notification not found");
    return sendResponse(res, 200, true, "Notification deleted successfully");
  } catch (err) {
    return sendResponse(res, 500, false, `Delete Error: ${err.message}`);
  }
};

// Helper: Mark as read
const markAsRead = async (req, res) => {
  const { id } = req.params;
  try {
    const notification = await Notification.findByIdAndUpdate(id, { isRead: true }, { new: true });
    if (!notification) return sendResponse(res, 404, false, "Notification not found");
    return sendResponse(res, 200, true, "Notification marked as read", notification);
  } catch (err) {
    return sendResponse(res, 500, false, `Read Error: ${err.message}`);
  }
};

// Helper: Update notification
const updateNotification = async (req, res) => {
  const { id } = req.params;
  const { title, message, type, topic } = req.body;
  try {
    const notification = await Notification.findByIdAndUpdate(id, { title, message, type, topic }, { new: true });
    if (!notification) return sendResponse(res, 404, false, "Notification not found");
    return sendResponse(res, 200, true, "Notification updated successfully", notification);
  } catch (err) {
    return sendResponse(res, 500, false, `Update Error: ${err.message}`);
  }
};

module.exports = { 
  getNotifications, 
  getNotificationById,
  sendNotification, 
  markAsRead, 
  deleteNotification, 
  updateNotification 
};
