const jwt = require('jsonwebtoken');
const { sendResponse } = require('../utils/response');

// Using a fallback for local dev if not in .env
const JWT_SECRET = process.env.JWT_SECRET || 'notehub_super_secret_key_2025';

// Verify Admin Token
const verifyAdminToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return sendResponse(res, 401, false, "Access Denied: No token provided");
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.admin = decoded; // { id, username, role, adminClass }
        next();
    } catch (err) {
        return sendResponse(res, 401, false, "Access Denied: Invalid token");
    }
};

// Check if Super Admin
const isSuperAdmin = (req, res, next) => {
    if (req.admin && req.admin.role === 'super_admin') {
        return next();
    }
    return sendResponse(res, 403, false, "Access Denied: Super Admin only");
};

// Access Control Logic: Automatic Class-Based Filtering
const restrictToClass = (req, res, next) => {
    if (!req.admin) {
        return sendResponse(res, 401, false, "Unauthorized");
    }

    // Super Admin → Can see everything unless they specify a class themselves
    if (req.admin.role === 'super_admin') {
        return next();
    }

    // Class Admin → Force their assigned class into query and body
    if (req.admin.role === 'class_admin') {
        const assignedClass = req.admin.adminClass;
        
        // Ensure they can ONLY query and modify their own class
        req.query.class = assignedClass;
        
        if (req.body) {
            req.body.class = assignedClass;
        }

        // Add to body specifically for document creation/update
        if (req.method === 'POST' || req.method === 'PUT') {
            req.body.class = assignedClass;
        }

        next();
    } else {
        return sendResponse(res, 403, false, "Access Denied: Invalid role");
    }
};

module.exports = {
    verifyAdminToken,
    isSuperAdmin,
    restrictToClass
};
