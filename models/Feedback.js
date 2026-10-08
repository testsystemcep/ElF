const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  userId: String, // Firebase UID
  name: String,
  email: String,
  message: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Feedback', feedbackSchema);
