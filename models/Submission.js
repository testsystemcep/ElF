const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  assignmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Assignment' },
  student_id: String, // Firebase UID
  file_url: String,
  submitted_at: { type: Date, default: Date.now },
  status: { type: String, enum: ['pending', 'grading', 'graded'], default: 'pending' },
});

module.exports = mongoose.model('Submission', submissionSchema);
