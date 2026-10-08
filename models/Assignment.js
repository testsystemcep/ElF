const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  class: String,
  subject: String,
  title: String,
  description: String,
  teacher: String,
  examName: String,
  givenDate: Date,
  submissionDate: Date,
  pdfUrl: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Assignment', assignmentSchema);
