const Note = require('../models/Note');
const { sendResponse } = require('../utils/response');

const getNotes = async (req, res) => {
  const { studentClass, class: queryClass, subject, page = 1, limit = 10 } = req.query;
  const targetClass = studentClass || queryClass;
  const skip = (page - 1) * limit;

  try {
    const query = {};
    if (targetClass) query.class = targetClass;
    if (subject) query.subject = subject;

    const notes = await Note.find(query)
      .sort({ createdAt: -1 })
      .skip(parseInt(skip))
      .limit(parseInt(limit));

    const total = await Note.countDocuments(query);

    return sendResponse(res, 200, true, "Notes fetched successfully", notes); // Return simplified array for admin ease
  } catch (err) {
    return sendResponse(res, 500, false, `Notes Error: ${err.message}`);
  }
};

const viewNote = async (req, res) => {
  const { id } = req.params;

  try {
    const note = await Note.findById(id);

    if (!note) {
      return sendResponse(res, 404, false, "Note not found");
    }

    // Secure PDF View logic
    // Normally, I'd generate a signed Firebase Storage URL or similar.
    // Here, I'll just return a placeholder for the frontend to interpret.
    const secureNoteData = {
      pdfUrl: note.pdfUrl,
      type: note.type,
      teacher: note.teacher,
      access_token: "TEMP_ACCESS_TOKEN", // Example security token for the frontend reader
    };

    return sendResponse(res, 200, true, "Secure access granted", secureNoteData);
  } catch (err) {
    return sendResponse(res, 500, false, `Secure Note Access Error: ${err.message}`);
  }
};

const addNote = async (req, res) => {
  try {
    const { class: classField, subject, type, teacher, pdfUrl, isPrivate } = req.body;
    const note = new Note({
      class: classField,
      subject,
      type,
      teacher,
      pdfUrl,
      isPrivate
    });
    await note.save();
    return sendResponse(res, 201, true, "Note added successfully", note);
  } catch (err) {
    return sendResponse(res, 500, false, `Add Note Error: ${err.message}`);
  }
};

const deleteNote = async (req, res) => {
  const { id } = req.params;
  try {
    const note = await Note.findByIdAndDelete(id);
    if (!note) return sendResponse(res, 404, false, "Note not found");
    return sendResponse(res, 200, true, "Note deleted successfully");
  } catch (err) {
    return sendResponse(res, 500, false, `Delete Note Error: ${err.message}`);
  }
};

module.exports = { getNotes, viewNote, addNote, deleteNote };
