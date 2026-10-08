const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  class: String,
  name: String,
  examName: String,
  type: String,
  teacher: String,
  description: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Subject', subjectSchema);
