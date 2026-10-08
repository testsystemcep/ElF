const mongoose = require('mongoose');

const examSchema = new mongoose.Schema({
  className: String,
  subject: String,
  examName: String,
  date: Date,
  time: String,
  room: String,
  title: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Exam', examSchema);
