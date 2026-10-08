const mongoose = require('mongoose');

const syllabusSchema = new mongoose.Schema({
  class: String,
  subject: String,
  examName: String,
  type: String,
  pdfUrl: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Syllabus', syllabusSchema);
