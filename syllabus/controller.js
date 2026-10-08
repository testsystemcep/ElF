const Syllabus = require('../models/Syllabus');
const { sendResponse } = require('../utils/response');

const getSyllabus = async (req, res) => {
  const { studentClass, class: queryClass, subject } = req.query;
  const targetClass = studentClass || queryClass;

  try {
    const query = {};
    if (targetClass) query.class = targetClass;
    if (subject) query.subject = subject;

    const syllabus = await Syllabus.find(query).sort({ createdAt: -1 });
    return sendResponse(res, 200, true, "Syllabus fetched successfully", syllabus);
  } catch (err) {
    return sendResponse(res, 500, false, `Syllabus Fetch Error: ${err.message}`);
  }
};

const addSyllabus = async (req, res) => {
  try {
    const { class: classField, subject, examName, type, pdfUrl } = req.body;
    const syllabus = new Syllabus({
      class: classField,
      subject,
      examName,
      type,
      pdfUrl
    });
    await syllabus.save();
    return sendResponse(res, 201, true, "Syllabus added successfully", syllabus);
  } catch (err) {
    return sendResponse(res, 500, false, `Add Syllabus Error: ${err.message}`);
  }
};

const updateSyllabus = async (req, res) => {
  const { id } = req.params;
  try {
    // Map the incoming 'class' property to standard schema if it comes as 'class'
    const updateData = { ...req.body };
    if (req.body.class !== undefined) {
      updateData.class = req.body.class;
    }
    
    const syllabus = await Syllabus.findByIdAndUpdate(id, updateData, { new: true });
    if (!syllabus) return sendResponse(res, 404, false, "Syllabus not found");
    return sendResponse(res, 200, true, "Syllabus updated successfully", syllabus);
  } catch (err) {
    return sendResponse(res, 500, false, `Update Syllabus Error: ${err.message}`);
  }
};

const deleteSyllabus = async (req, res) => {
  const { id } = req.params;
  try {
    const syllabus = await Syllabus.findByIdAndDelete(id);
    if (!syllabus) return sendResponse(res, 404, false, "Syllabus not found");
    return sendResponse(res, 200, true, "Syllabus deleted successfully");
  } catch (err) {
    return sendResponse(res, 500, false, `Delete Syllabus Error: ${err.message}`);
  }
};

module.exports = { getSyllabus, addSyllabus, updateSyllabus, deleteSyllabus };
