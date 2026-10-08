const express = require('express');
const router = express.Router();
const { getStats, adminLogin, createAdmin, listAdmins, deleteAdmin, updateAdmin } = require('./controller');
const { verifyAdminToken, isSuperAdmin, restrictToClass } = require('../middleware/adminAuth');

// Public Login Route
router.post('/login', adminLogin);

// Protected Routes
router.use(verifyAdminToken);

// Dashboard Statistics (supports filtering)
router.get('/stats', restrictToClass, getStats);

// Admin Management (Super Admin ONLY)
router.post('/create', isSuperAdmin, createAdmin);
router.get('/list', isSuperAdmin, listAdmins);
router.put('/update/:id', isSuperAdmin, updateAdmin);
router.delete('/:id', isSuperAdmin, deleteAdmin);

module.exports = router;
