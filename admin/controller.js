const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const { sendResponse } = require('../utils/response');

const JWT_SECRET = process.env.JWT_SECRET || 'notehub_super_secret_key_2025';

// Admin Login
const adminLogin = async (req, res) => {
    const { username, password } = req.body;

    try {
        const admin = await Admin.findOne({ username });
        
        // 1. DATABASE AUTH
        if (admin) {
            const isMatch = await bcrypt.compare(password, admin.password);
            if (isMatch) {
                const token = jwt.sign(
                    { id: admin._id, username: admin.username, role: admin.role, adminClass: admin.adminClass },
                    JWT_SECRET,
                    { expiresIn: '24h' }
                );
                return sendResponse(res, 200, true, "Login successful", {
                    token, username: admin.username, role: admin.role, adminClass: admin.adminClass
                });
            }
        }

        // 2. OFFLINE/LOCAL FALLBACK (For when DB is not connected/empty)
        const MOCK_ADMINS = {
            'admin@notehub': { pass: '$2b$10$De9QeCcTUNz1F7.uws/i7OVVuzGFx.ZDRRY7/5u7Fdz5gkNv396YaK', role: 'super_admin', class: null },
            'ayush@123': { pass: '$2b$10$1YHYqCuZuyudnf1KxuJ0sOppxdrkeVDvFbL/TZo4PaMbykQC5PFNU6', role: 'class_admin', class: 'FYCS' }
        };

        if (MOCK_ADMINS[username]) {
            const isMatch = await bcrypt.compare(password, MOCK_ADMINS[username].pass);
            if (isMatch) {
                const token = jwt.sign(
                    { id: 'offline-id', username, role: MOCK_ADMINS[username].role, adminClass: MOCK_ADMINS[username].class },
                    JWT_SECRET,
                    { expiresIn: '24h' }
                );
                return sendResponse(res, 200, true, "Offline Login successful", {
                    token, username, role: MOCK_ADMINS[username].role, adminClass: MOCK_ADMINS[username].class
                });
            }
        }

        return sendResponse(res, 401, false, "Invalid username or password");

    } catch (err) {
        return sendResponse(res, 500, false, `Login Error: ${err.message}`);
    }
};

// Create New Admin (Super Admin Only)
const createAdmin = async (req, res) => {
    const { username, password, role, adminClass } = req.body;

    try {
        const existingAdmin = await Admin.findOne({ username });
        if (existingAdmin) {
            return sendResponse(res, 400, false, "Username already exists");
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newAdmin = new Admin({
            username,
            password: hashedPassword,
            role,
            adminClass: role === 'class_admin' ? adminClass : null
        });

        await newAdmin.save();
        return sendResponse(res, 201, true, "Admin created successfully");

    } catch (err) {
        return sendResponse(res, 500, false, `Create Error: ${err.message}`);
    }
};

// List Admins (Super Admin Only)
const listAdmins = async (req, res) => {
    try {
        const admins = await Admin.find().select('-password');
        return sendResponse(res, 200, true, "Admins fetched", admins);
    } catch (err) {
        return sendResponse(res, 500, false, `Fetch Error: ${err.message}`);
    }
};

// Delete Admin (Super Admin Only)
const deleteAdmin = async (req, res) => {
    try {
        await Admin.findByIdAndDelete(req.params.id);
        return sendResponse(res, 200, true, "Admin deleted successfully");
    } catch (err) {
        return sendResponse(res, 500, false, `Delete Error: ${err.message}`);
    }
};

// Stats for dashboard (supports filtering)
const getStats = async (req, res) => {
    const query = {};
    if (req.admin.role === 'class_admin') {
        query.class = req.admin.adminClass;
    }
    // Note: Feedback and potentially User don't have a direct 'class' field normally, but let's filter if they do.
    
    try {
        // Models used for stats
        const Subject = require('../models/Subject');
        const Note = require('../models/Note');
        const Assignment = require('../models/Assignment');
        const Exam = require('../models/Exam');

        const [subjects, notes, assignments, exams] = await Promise.all([
            Subject.countDocuments(query),
            Note.countDocuments(query),
            Assignment.countDocuments(query),
            Exam.countDocuments(query.class ? { className: query.class } : {}), // Exams use className
        ]);

        return sendResponse(res, 200, true, "Stats fetched", {
            subjects,
            notes,
            assignments,
            exams,
            users: 0,
            adminClass: req.admin.adminClass
        });
    } catch (err) {
        return sendResponse(res, 500, false, `Stats Error: ${err.message}`);
    }
};

// Update Admin (Password reset or other fields)
const updateAdmin = async (req, res) => {
    const { password } = req.body;

    try {
        const updateData = {};
        if (password) {
            updateData.password = await bcrypt.hash(password, 10);
        }

        const admin = await Admin.findByIdAndUpdate(req.params.id, updateData, { new: true });
        if (!admin) {
            return sendResponse(res, 404, false, "Admin not found");
        }

        return sendResponse(res, 200, true, "Admin updated successfully");
    } catch (err) {
        return sendResponse(res, 500, false, `Update Error: ${err.message}`);
    }
};

module.exports = {
    adminLogin,
    createAdmin,
    listAdmins,
    deleteAdmin,
    getStats,
    updateAdmin
};
