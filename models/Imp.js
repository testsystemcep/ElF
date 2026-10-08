const mongoose = require('mongoose');

const impSchema = new mongoose.Schema({
  class: String,
  subject: String,
  examName: String,
  type: String,
  pdfUrl: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Imp', impSchema);
