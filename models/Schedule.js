const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
  class: String,
  date: String, // format YYYY-MM-DD
  schedule: [
    {
      teacher: String,
      subject: String,
      start_time: String,
      end_time: String,
      room: String,
    }
  ],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Schedule', scheduleSchema);
