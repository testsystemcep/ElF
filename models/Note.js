const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  class: String,
  subject: String,
  type: String,
  teacher: String,
  pdfUrl: String, // Secure path or URL
  isPrivate: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Note', noteSchema);
