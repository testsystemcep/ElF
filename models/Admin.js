const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['super_admin', 'class_admin'],
    default: 'class_admin',
  },
  adminClass: { // Using 'adminClass' to avoid reserved keywords like 'class'
    type: String,
    required: function () { return this.role === 'class_admin'; }, // Required for class admins
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Admin', adminSchema);
