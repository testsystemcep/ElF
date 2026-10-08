const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
  class: String,
  imageUrl: String,
  title: String,
  description: String,
  date: Date,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('News', newsSchema);
