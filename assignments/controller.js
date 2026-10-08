const Assignment = require('../models/Assignment');
const { sendResponse } = require('../utils/response');

const getAssignments = async (req, res) => {
  const { studentClass, class: queryClass, subject } = req.query;
  const targetClass = studentClass || queryClass;

  try {
    const query = {};
    if (targetClass) query.class = targetClass;
    if (subject) query.subject = subject;

    const assignments = await Assignment.find(query).sort({ submissionDate: 1 });
    return sendResponse(res, 200, true, "Assignments fetched successfully", assignments);
  } catch (err) {
    return sendResponse(res, 500, false, `Assignments Error: ${err.message}`);
  }
};

const addAssignment = async (req, res) => {
  try {
    const assignment = new Assignment(req.body);
    await assignment.save();
    return sendResponse(res, 201, true, "Assignment added successfully", assignment);
  } catch (err) {
    return sendResponse(res, 500, false, `Add Assignment Error: ${err.message}`);
  }
};

const updateAssignment = async (req, res) => {
  const { id } = req.params;
  try {
    const assignment = await Assignment.findByIdAndUpdate(id, req.body, { new: true });
    if (!assignment) return sendResponse(res, 404, false, "Assignment not found");
    return sendResponse(res, 200, true, "Assignment updated successfully", assignment);
  } catch (err) {
    return sendResponse(res, 500, false, `Update Assignment Error: ${err.message}`);
  }
};

const deleteAssignment = async (req, res) => {
  const { id } = req.params;
  try {
    const assignment = await Assignment.findByIdAndDelete(id);
    if (!assignment) return sendResponse(res, 404, false, "Assignment not found");
    return sendResponse(res, 200, true, "Assignment deleted successfully");
  } catch (err) {
    return sendResponse(res, 500, false, `Delete Assignment Error: ${err.message}`);
  }
};

module.exports = { getAssignments, addAssignment, updateAssignment, deleteAssignment };
