const Subject = require('../models/Subject');
const { sendResponse } = require('../utils/response');

const getSubjects = async (req, res) => {
  const { studentClass, class: queryClass } = req.query;
  const targetClass = studentClass || queryClass;

  try {
    const query = targetClass ? { class: targetClass } : {};
    const subjects = await Subject.find(query).sort({ name: 1 });
    return sendResponse(res, 200, true, "Subjects fetched successfully", subjects);
  } catch (err) {
    return sendResponse(res, 500, false, `Subjects Error: ${err.message}`);
  }
};

const addSubject = async (req, res) => {
  try {
    const subject = new Subject(req.body);
    await subject.save();
    return sendResponse(res, 201, true, "Subject added successfully", subject);
  } catch (err) {
    return sendResponse(res, 500, false, `Add Subject Error: ${err.message}`);
  }
};

const updateSubject = async (req, res) => {
  const { id } = req.params;
  try {
    const subject = await Subject.findByIdAndUpdate(id, req.body, { new: true });
    if (!subject) return sendResponse(res, 404, false, "Subject not found");
    return sendResponse(res, 200, true, "Subject updated successfully", subject);
  } catch (err) {
    return sendResponse(res, 500, false, `Update Subject Error: ${err.message}`);
  }
};

const deleteSubject = async (req, res) => {
  const { id } = req.params;
  try {
    const subject = await Subject.findByIdAndDelete(id);
    if (!subject) return sendResponse(res, 404, false, "Subject not found");
    return sendResponse(res, 200, true, "Subject deleted successfully");
  } catch (err) {
    return sendResponse(res, 500, false, `Delete Subject Error: ${err.message}`);
  }
};

module.exports = { getSubjects, addSubject, updateSubject, deleteSubject };
